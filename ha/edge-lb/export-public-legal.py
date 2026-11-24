"""Export two English legal documents from saved, anonymous release HTML.

Run on the workstation with lxml. Only the canonical legal heading, date,
introduction and named legal sections enter the standalone document.
"""
import html
import sys
from pathlib import Path
from urllib.parse import urlsplit

from lxml import etree
from lxml import html as parser

SECTIONS = {
    "terms-of-service": "agreement service subscriptions withdrawal accounts content ai-output intellectual-property liability indemnification termination changes governing-law contact".split(),
    "privacy-policy": "information-we-collect use-of-information disclosure security your-rights cookies guest-media third-party-sites children changes contact".split(),
}
TAGS = {"h1", "h2", "h3", "h4", "p", "section", "ul", "ol", "li", "strong", "em", "a", "br", "address", "blockquote", "pre"}
SKIP = {"script", "style", "button", "template", "svg", "iframe", "form", "input", "textarea", "noscript"}


def clean(node):
    if not isinstance(node.tag, str) or node.tag in SKIP or node.get("hidden") is not None:
        return ""
    tag = node.tag if node.tag in TAGS else "div" if node.tag == "div" else "span"
    attrs = ""
    if tag == "a":
        url = node.get("href", "")
        if urlsplit(url).scheme in ("https", "mailto") or url.startswith("#"):
            attrs = ' href="' + html.escape(url, quote=True) + '"'
    if tag == "section":
        attrs = ' id="' + html.escape(node.get("id", ""), quote=True) + '"'
    children = "".join(clean(child) + html.escape(child.tail or "") for child in node)
    return f"<{tag}{attrs}>" + html.escape(node.text or "") + children + f"</{tag}>"


def export(source, slug):
    tree = parser.fromstring(source, parser=parser.HTMLParser(encoding="utf-8", no_network=True))
    # Identifiers come from the two source page components. Walk up from the
    # legal section to its own document, excluding the personalized site layout.
    anchors = tree.xpath("//section[@id=$anchor]", anchor=SECTIONS[slug][0])
    if len(anchors) != 1:
        raise ValueError("missing or ambiguous legal section")
    root = anchors[0].xpath("ancestor::div[contains(concat(' ',normalize-space(@class),' '),' min-h-screen ')][1]")
    if len(root) != 1:
        raise ValueError("missing legal document")
    root = root[0]
    title = root.xpath(".//h1")
    dates = root.xpath(".//h1/following-sibling::div[1]//p[1]")
    intros = root.xpath(".//div[contains(concat(' ',normalize-space(@class),' '),' text-pretty ') and not(ancestor::section)]")
    sections = root.xpath(".//section[@id]")
    ids = [section.get("id") for section in sections]
    expected = SECTIONS[slug]
    if ids != expected and not (slug == "privacy-policy" and sorted(ids) == sorted(expected + ["gdpr"])):
        raise ValueError("legal section set changed; review the released document")
    if any(len(nodes) != 1 for nodes in (title, dates, intros)):
        raise ValueError("legal heading, date or introduction changed")
    if any(not section.xpath(".//h2") for section in sections):
        raise ValueError("incomplete legal document")
    contents = "".join(clean(node) for node in [title[0], dates[0], intros[0], *sections])
    title_text = html.escape(title[0].text_content().strip())
    return f'<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>{title_text}</title><main>{contents}</main></html>\n'


if __name__ == "__main__":
    slug, source, destination = sys.argv[1:]
    if slug not in SECTIONS:
        sys.exit("unsupported document")
    try:
        result = export(Path(source).read_bytes(), slug)
    except (ValueError, etree.ParserError) as error:
        sys.exit(str(error))
    with Path(destination).open("x") as output:
        output.write(result)
