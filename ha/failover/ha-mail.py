#!/usr/bin/env python3
"""ha-mail: send one HA alert email over SMTPS (465).

Usage: ha-mail.py <subject> <body>   (body "-" = read stdin)

Credentials come from /etc/ha-failover/secrets.env (mode 600, root, never in
the repo): HA_MAIL_HOST, HA_MAIL_USER, HA_MAIL_PASSWORD, HA_MAIL_FROM,
HA_MAIL_TO (comma separated). Never prints the password. Exit 0 on send,
1 on failure (the watchdog logs it and retries on the next transition).
"""
import smtplib
import socket
import ssl
import sys
from email.message import EmailMessage
from email.utils import formatdate, make_msgid

SECRETS = "/etc/ha-failover/secrets.env"


def load(path):
    env = {}
    try:
        with open(path, encoding="utf-8") as fh:
            for line in fh:
                line = line.strip()
                if not line or line.startswith("#") or "=" not in line:
                    continue
                k, v = line.split("=", 1)
                env[k.strip()] = v.strip().strip('"').strip("'")
    except OSError as exc:
        print(f"ha-mail: cannot read {path}: {exc.strerror}", file=sys.stderr)
    return env


def main():
    if len(sys.argv) < 3:
        print("usage: ha-mail.py <subject> <body|->", file=sys.stderr)
        return 2
    subject, body = sys.argv[1], sys.argv[2]
    if body == "-":
        body = sys.stdin.read()
    env = load(SECRETS)
    host = env.get("HA_MAIL_HOST")
    user = env.get("HA_MAIL_USER")
    password = env.get("HA_MAIL_PASSWORD")
    sender = env.get("HA_MAIL_FROM") or user
    to = [a.strip() for a in (env.get("HA_MAIL_TO") or "").split(",") if a.strip()]
    if not (host and user and password and to):
        print("ha-mail: HA_MAIL_HOST/USER/PASSWORD/TO missing in secrets.env", file=sys.stderr)
        return 1
    msg = EmailMessage()
    msg["From"] = f"unbottled HA ({socket.gethostname()}) <{sender}>"
    msg["To"] = ", ".join(to)
    msg["Subject"] = subject
    msg["Date"] = formatdate(localtime=False)
    msg["Message-ID"] = make_msgid(domain="unbottled.ai")
    msg.set_content(body)
    try:
        with smtplib.SMTP_SSL(host, 465, context=ssl.create_default_context(), timeout=30) as s:
            s.login(user, password)
            s.send_message(msg)
    except (OSError, smtplib.SMTPException) as exc:
        print(f"ha-mail: send failed: {type(exc).__name__}", file=sys.stderr)
        return 1
    print("ha-mail: sent")
    return 0


if __name__ == "__main__":
    sys.exit(main())
