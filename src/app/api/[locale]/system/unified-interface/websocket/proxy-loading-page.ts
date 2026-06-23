/**
 * Proxy Loading Page
 *
 * The HTML the Bun proxy returns (503) when the upstream Next.js server is not
 * yet reachable — during startup, a redeploy, or recovery from high load. Kept
 * out of server.ts so the proxy logic stays readable; this is pure markup.
 *
 * Self-hosted: auto-retries every ~20s and lets the user retry immediately.
 */

/* eslint-disable i18next/no-literal-string */

export const PROXY_LOADING_HTML = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>Back in a moment</title>
  <style>
    *{box-sizing:border-box;margin:0;padding:0}
    :root{--bg:#080808;--surface:#111;--border:#1e1e1e;--border-bright:#2a2a2a;--text:#f0f0f0;--muted:#555;--subtle:#333;--accent:#6366f1;--accent-dim:#4f46e5}
    body{font-family:-apple-system,BlinkMacSystemFont,'Segoe UI',Helvetica,sans-serif;background:var(--bg);color:var(--text);min-height:100vh;display:flex;flex-direction:column;align-items:center;justify-content:center;padding:24px;gap:0}

    /* Ambient glow */
    .glow{position:fixed;top:-200px;left:50%;transform:translateX(-50%);width:600px;height:400px;background:radial-gradient(ellipse,rgba(99,102,241,.07) 0%,transparent 70%);pointer-events:none}

    .card{background:var(--surface);border:1px solid var(--border);border-radius:20px;padding:52px 44px 44px;max-width:460px;width:100%;text-align:center;position:relative;overflow:hidden}
    .card::before{content:'';position:absolute;inset:0;background:linear-gradient(135deg,rgba(99,102,241,.04) 0%,transparent 60%);pointer-events:none}

    /* Spinner ring */
    .spinner-wrap{position:relative;width:72px;height:72px;margin:0 auto 32px}
    .spinner-ring{width:72px;height:72px;border-radius:50%;border:2px solid var(--border-bright);border-top-color:var(--accent);animation:spin 1.1s cubic-bezier(.6,.2,.4,.8) infinite;position:absolute;inset:0}
    .spinner-ring.slow{width:58px;height:58px;margin:7px;border-top-color:transparent;border-right-color:rgba(99,102,241,.35);animation-duration:2.2s;animation-direction:reverse}
    @keyframes spin{to{transform:rotate(360deg)}}
    .spinner-dot{position:absolute;inset:0;display:flex;align-items:center;justify-content:center}
    .spinner-dot::after{content:'';width:8px;height:8px;border-radius:50%;background:var(--accent);opacity:.7;animation:pulse 1.1s ease-in-out infinite}
    @keyframes pulse{0%,100%{opacity:.4;transform:scale(.85)}50%{opacity:1;transform:scale(1)}}

    .eyebrow{font-size:11px;font-weight:600;letter-spacing:.1em;text-transform:uppercase;color:var(--accent);margin-bottom:14px;opacity:.9}
    h1{font-size:24px;font-weight:700;color:var(--text);margin-bottom:12px;line-height:1.25;letter-spacing:-.02em}
    .subtext{font-size:14px;color:var(--muted);line-height:1.7;margin-bottom:32px;max-width:320px;margin-left:auto;margin-right:auto}

    /* Status bar */
    .status-bar{background:var(--bg);border:1px solid var(--border);border-radius:10px;padding:14px 18px;margin-bottom:28px;display:flex;align-items:center;gap:12px;text-align:left}
    .status-dot{width:7px;height:7px;border-radius:50%;background:#22c55e;flex-shrink:0;animation:statusPulse 2s ease-in-out infinite}
    @keyframes statusPulse{0%,100%{opacity:.4}50%{opacity:1;box-shadow:0 0 6px #22c55e}}
    .status-dot.warn{background:#f59e0b;animation:statusPulse 1.5s ease-in-out infinite}
    @keyframes statusPulse{0%,100%{opacity:.5}50%{opacity:1}}
    .status-text{font-size:13px;color:var(--muted);flex:1}
    .status-text strong{color:rgba(240,240,240,.75);font-weight:500}
    .status-timer{font-size:12px;color:var(--subtle);font-variant-numeric:tabular-nums;font-family:ui-monospace,monospace}

    /* Progress bar */
    .progress-wrap{height:2px;background:var(--border);border-radius:99px;margin-bottom:24px;overflow:hidden}
    .progress-bar{height:100%;background:linear-gradient(90deg,var(--accent-dim),var(--accent));border-radius:99px;width:0%;transition:width .9s linear}

    /* Button */
    .btn{display:inline-flex;align-items:center;justify-content:center;gap:8px;background:var(--text);color:#000;border:none;border-radius:10px;padding:12px 26px;font-size:14px;font-weight:600;cursor:pointer;transition:opacity .15s,transform .1s;width:100%}
    .btn:hover:not(:disabled){opacity:.88;transform:translateY(-1px)}
    .btn:active:not(:disabled){transform:translateY(0)}
    .btn:disabled{opacity:.35;cursor:not-allowed;background:var(--subtle);color:var(--muted)}
    .btn-spinner{width:14px;height:14px;border:2px solid rgba(0,0,0,.2);border-top-color:#000;border-radius:50%;animation:spin .7s linear infinite;display:none}
    .btn.loading .btn-spinner{display:block}
    .btn.loading .btn-label{opacity:.7}

    .footer-note{font-size:12px;color:#2e2e2e;margin-top:20px;line-height:1.6}
  </style>
</head>
<body>
  <div class="glow"></div>
  <div class="card">
    <div class="spinner-wrap">
      <div class="spinner-ring"></div>
      <div class="spinner-ring slow"></div>
      <div class="spinner-dot"></div>
    </div>

    <div class="eyebrow">System Status</div>
    <h1>Back in a moment</h1>
    <p class="subtext">The server is catching its breath - either waking up after an update or recovering from high load. It'll be right back.</p>

    <div class="status-bar">
      <div class="status-dot warn" id="sdot"></div>
      <div class="status-text"><strong id="stext">Checking server&hellip;</strong><br><span id="sdesc">Auto-retry in progress</span></div>
      <div class="status-timer" id="stimer">0:15</div>
    </div>

    <div class="progress-wrap">
      <div class="progress-bar" id="prog"></div>
    </div>

    <button class="btn" id="btn" onclick="manualReload()">
      <div class="btn-spinner"></div>
      <span class="btn-label">Try now</span>
    </button>
  </div>
  <div class="footer-note">unbottled.ai &mdash; if this persists, try refreshing manually</div>

  <script>
    var TOTAL=20, elapsed=0, reloading=false;
    var messages=[
      ['Warming up…','Server process starting'],
      ['Almost there…','Loading application modules'],
      ['Hang tight…','Finalising startup'],
      ['Ready soon…','Waiting for health check'],
    ];

    function fmt(s){return'0:'+String(s).padStart(2,'0')}

    function setStatus(dot,title,desc){
      document.getElementById('sdot').className='status-dot'+(dot?' warn':'');
      document.getElementById('stext').textContent=title;
      document.getElementById('sdesc').textContent=desc;
    }

    function tick(){
      if(reloading)return;
      elapsed++;
      var remaining=TOTAL-elapsed;
      document.getElementById('stimer').textContent=fmt(Math.max(0,remaining));
      document.getElementById('prog').style.width=(elapsed/TOTAL*100)+'%';

      var mi=Math.min(Math.floor(elapsed/5),messages.length-1);
      setStatus(true,messages[mi][0],messages[mi][1]);

      if(remaining<=0){autoReload();return;}
      setTimeout(tick,1000);
    }

    function autoReload(){
      if(reloading)return;
      reloading=true;
      var btn=document.getElementById('btn');
      btn.disabled=true;
      btn.classList.add('loading');
      btn.querySelector('.btn-label').textContent='Connecting…';
      setStatus(false,'Reconnecting…','Attempting to reach the server');
      document.getElementById('stimer').textContent='';
      location.reload();
    }

    function manualReload(){
      if(reloading)return;
      reloading=true;
      var btn=document.getElementById('btn');
      btn.disabled=true;
      btn.classList.add('loading');
      btn.querySelector('.btn-label').textContent='Connecting…';
      setStatus(false,'Reconnecting…','Attempting to reach the server');
      document.getElementById('stimer').textContent='';
      location.reload();
    }

    window.onload=function(){setTimeout(tick,1000)};
  </script>
</body>
</html>`;
