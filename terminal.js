/* VMsolutions — interactive terminal (EN default · IT) */
(() => {
  const screen = document.getElementById('screen');
  const form   = document.getElementById('form');
  const input  = document.getElementById('cmd');
  const caret  = document.getElementById('caret');
  const hints  = document.getElementById('hints');
  const term   = document.getElementById('term');
  const langUI = document.getElementById('lang');
  /* owner override: motion stays on even if the OS requests reduced motion */
  const reduce = false;

  let lang = 'en';

  /* ---------- ambient: faint indigo data-stream ---------- */
  (function ambient(){
    const cv = document.getElementById('amb'); if (!cv) return;
    const g = cv.getContext('2d'); const G = 14;
    let cols, drops, w, h;
    const glyphs = '0123456789ABCDEF/<>{}#$x';
    function size(){ w=cv.width=innerWidth; h=cv.height=innerHeight;
      cols=Math.ceil(w/G); drops=Array.from({length:cols},()=>Math.random()*-60); }
    size(); addEventListener('resize', size);
    let last=0;
    (function frame(t){
      if (t-last > 55){ last=t;
        g.fillStyle='rgba(10,10,15,.24)'; g.fillRect(0,0,w,h);
        g.font='12px "IBM Plex Mono", monospace';
        for (let i=0;i<cols;i++){
          const ch = glyphs[(Math.random()*glyphs.length)|0];
          const py = drops[i]*G;
          g.fillStyle = Math.random()>.95 ? 'rgba(199,201,214,.9)' : 'rgba(99,102,241,.6)';
          g.fillText(ch, i*G, py);
          if (py>h && Math.random()>.975) drops[i]=0; else drops[i]+=0.5;
        }
      }
      requestAnimationFrame(frame);
    })(0);
  })();

  const BANNER =
` ██╗   ██╗███╗   ███╗
 ██║   ██║████╗ ████║
 ██║   ██║██╔████╔██║
 ╚██╗ ██╔╝██║╚██╔╝██║
  ╚████╔╝ ██║ ╚═╝ ██║
   ╚═══╝  ╚═╝     ╚═╝  solutions`;

  /* ---------- output helpers ---------- */
  const el = (cls, html) => { const d = document.createElement('div'); if (cls) d.className = cls; d.innerHTML = html; return d; };
  const out = (html, cls='line') => { screen.appendChild(el(cls, html)); scroll(); };
  const block = (html) => { screen.appendChild(el('line block', html)); scroll(); };
  const scroll = () => { screen.scrollTop = screen.scrollHeight; };
  const escape = s => String(s).replace(/[&<>]/g, c => ({'&':'&amp;','<':'&lt;','>':'&gt;'}[c]));

  /* ---------- i18n content (embargo-safe · no employer names) ---------- */
  const T = {
    en: {
      about:
`<span class="c-bright">VMsolutions</span> — security &amp; industrial automation
<span class="c-muted">// IT security · OT/industrial automation · ICS security</span>

A two-person studio pairing offensive security with hands-on industrial
automation. We secure and build systems — from source code and cloud,
down to PLCs and the plant floor.

<span class="c-muted">type</span> <span class="c-amber2">team</span> <span class="c-muted">to meet us ·</span> <span class="c-amber2">services</span> <span class="c-muted">for what we do</span>`,
      team:
`<span class="c-muted"># the team</span>

<span class="tag">VP</span> <span class="c-bright">Valentino Paulon</span> — security &amp; software
   published CVEs, cloud-agent 0-days, full-stack &amp; AI · <span class="c-amber2">type valentino</span>

<span class="tag">MM</span> <span class="c-bright">Matteo Munafò</span> — industrial automation
   8y PLC/HMI/SCADA across railway, chemical, oil &amp; gas · <span class="c-amber2">type matteo</span>`,
      valentino:
`<span class="c-bright">Valentino Paulon</span> — security researcher &amp; engineer
<span class="c-muted">// privilege escalation · cloud-agent security · source-level research</span>

Finds real, exploitable, novel bugs and reports them responsibly.
Builds AI products and full-stack software.

  <span class="c-muted">published</span>  <span class="c-bright">CVE-2026-11837</span> — ansible.posix LPE, credited by Red Hat
  <span class="c-muted">also</span>       additional CVEs &amp; 0-days under coordinated disclosure
  <span class="c-muted">stack</span>      Go · Python · C/C++ · full-stack · AI/LLM

  linkedin  <a href="https://www.linkedin.com/in/valentino-paulon-738356367/" target="_blank" rel="noopener">in/valentino-paulon</a>
  github    <a href="https://github.com/M8seven" target="_blank" rel="noopener">github.com/M8seven</a>

<span class="c-muted">more:</span> <span class="c-amber2">research</span> <span class="c-muted">·</span> <span class="c-amber2">cve</span>`,
      matteo:
`<span class="c-bright">Matteo Munafò</span> — automation &amp; controls technician
<span class="c-muted">// PLC · HMI/SCADA · industrial systems</span>

8 years in industrial automation across railway, chemical and oil &amp; gas.
Advanced troubleshooting and on-site commissioning.

  <span class="c-muted">plc</span>        Siemens (S7-1200/1500/400H) · Rockwell · Saia · Selectron · ABB
  <span class="c-muted">hmi</span>        WinCC (Comfort/Advanced/Pro) · TIA Portal · STEP 7
  <span class="c-muted">field</span>      FAT/SAT commissioning · HART instrumentation · ATEX
  <span class="c-muted">langs</span>      IT (native) · EN (B2/C1) · ES (B1/B2)

  linkedin  <a href="https://www.linkedin.com/in/matteo-munafo/" target="_blank" rel="noopener">in/matteo-munafo</a>`,
      research:
`<span class="c-muted"># Valentino — selected public work; more under coordinated disclosure</span>

<span class="tag">CVE</span> <span class="c-bright">CVE-2026-11837</span> — ansible.posix LPE (symlink-following chown)
   reported &amp; credited by Red Hat
   <a href="https://access.redhat.com/security/cve/CVE-2026-11837" target="_blank" rel="noopener">access.redhat.com</a> · <a href="https://github.com/M8seven/cve-2026-11837-ansible-posix-authorized-key" target="_blank" rel="noopener">writeup</a>

<span class="tag embargo">0DAY</span> <span class="c-bright">cloud-agent privilege escalation</span> — multiple, under disclosure

<span class="tag doi">DOI</span> <span class="c-bright">Captive Portal Security Analysis</span> — <a href="https://doi.org/10.5281/zenodo.19061528" target="_blank" rel="noopener">10.5281/zenodo.19061528</a>
<span class="tag doi">DOI</span> <span class="c-bright">Cross-Provider Fact Mesh</span> — <a href="https://doi.org/10.5281/zenodo.19061105" target="_blank" rel="noopener">10.5281/zenodo.19061105</a>`,
      cve:
`<span class="c-amber">CVE-2026-11837</span>  <span class="c-muted">— published · credit: Valentino Paulon</span>
<dl class="kv">
  <dt>component</dt><dd>ansible.posix · authorized_key</dd>
  <dt>class</dt><dd>local privilege escalation (CWE-59)</dd>
  <dt>root cause</dt><dd>symlink-following chown on ~/.ssh/authorized_keys</dd>
  <dt>vendor</dt><dd>Red Hat — credit accepted</dd>
  <dt>record</dt><dd><a href="https://access.redhat.com/security/cve/CVE-2026-11837" target="_blank" rel="noopener">access.redhat.com</a></dd>
</dl>`,
      services:
`<span class="c-amber">// SECURITY &amp; IT</span>  <span class="c-muted">— Valentino</span>
  · code security review — Go / Python / C / C++
  · cloud &amp; infrastructure assessment
  · vulnerability research · full-stack &amp; AI development

<span class="c-amber">// INDUSTRIAL AUTOMATION — OT</span>  <span class="c-muted">— Matteo</span>
  · PLC programming (Siemens · Rockwell · Saia · Selectron · ABB)
  · HMI/SCADA development · WinCC
  · FAT/SAT commissioning · advanced troubleshooting

<span class="c-amber">// ICS / OT SECURITY</span>  <span class="c-muted">— together</span>
  · security assessment of industrial control systems
  · PLC/SCADA hardening — where IT security meets the plant floor

<span class="c-muted">remote-first · project-based ·</span> type <span class="c-amber2">contact</span>`,
      method:
`<span class="c-muted"># how we work</span>

We don't run a scanner and forward the output. We read code, read
systems, and find what tools miss — from a CVE in source to a fault
on the plant floor.

Findings ship with exact references, a realistic model, a working
proof, and a concrete fix. <span class="c-olive">Verified before we report.</span>`,
      contact:
`<span class="c-bright">Let's talk.</span>

  Valentino   <a href="mailto:valentino.paulon88@gmail.com">valentino.paulon88@gmail.com</a>
              <a href="https://www.linkedin.com/in/valentino-paulon-738356367/" target="_blank" rel="noopener">linkedin</a> · <a href="https://github.com/M8seven" target="_blank" rel="noopener">github</a>
  Matteo      <a href="mailto:teomueln@gmail.com">teomueln@gmail.com</a>
              <a href="https://www.linkedin.com/in/matteo-munafo/" target="_blank" rel="noopener">linkedin</a>

<span class="c-muted">remote-first · security · automation · ICS/OT security</span>`,
      help:
`<span class="c-muted">available commands</span>
  <span class="c-amber2">about</span>      what VMsolutions is
  <span class="c-amber2">team</span>       the two of us
  <span class="c-amber2">valentino</span>  security &amp; software
  <span class="c-amber2">matteo</span>     industrial automation
  <span class="c-amber2">services</span>   what we do
  <span class="c-amber2">research</span>   published CVEs &amp; papers
  <span class="c-amber2">contact</span>    get in touch
  <span class="c-amber2">lang</span>       switch language — <span class="c-muted">lang en | lang it</span>
  <span class="c-amber2">ls</span> / <span class="c-amber2">cat</span>   browse files · <span class="c-amber2">clear</span> clears the screen
<span class="c-muted">tip: Tab completes · ↑/↓ history · or click a suggestion below</span>`,
      intro:`<span class="c-bright">VMsolutions</span> · security &amp; industrial automation
<span class="c-muted">type</span> <span class="c-amber2">help</span> <span class="c-muted">or click a command below ·</span> <span class="c-amber2">lang it</span> <span class="c-muted">for Italian</span>`,
      nofile:f=>`<span class="c-rust">cat: ${escape(f)}: no such file</span> <span class="c-muted">(try ls)</span>`,
      nocat:`<span class="c-rust">cat: missing file — try</span> ls`,
      notfound:n=>`<span class="c-rust">${escape(n)}: command not found</span> <span class="c-muted">— type</span> <span class="c-amber2">help</span>`,
      langset:l=>`<span class="c-muted">language →</span> <span class="c-olive">${l}</span>`,
    },
    it: {
      about:
`<span class="c-bright">VMsolutions</span> — sicurezza e automazione industriale
<span class="c-muted">// sicurezza IT · automazione OT/industriale · sicurezza ICS</span>

Uno studio di due persone che unisce sicurezza offensiva e automazione
industriale sul campo. Mettiamo in sicurezza e costruiamo sistemi —
dal codice e dal cloud, fino ai PLC e all'impianto.

<span class="c-muted">scrivi</span> <span class="c-amber2">team</span> <span class="c-muted">per conoscerci ·</span> <span class="c-amber2">services</span> <span class="c-muted">per cosa facciamo</span>`,
      team:
`<span class="c-muted"># il team</span>

<span class="tag">VP</span> <span class="c-bright">Valentino Paulon</span> — sicurezza e software
   CVE pubbliche, 0-day cloud-agent, full-stack e AI · <span class="c-amber2">scrivi valentino</span>

<span class="tag">MM</span> <span class="c-bright">Matteo Munafò</span> — automazione industriale
   8 anni PLC/HMI/SCADA tra ferroviario, chimico, oil &amp; gas · <span class="c-amber2">scrivi matteo</span>`,
      valentino:
`<span class="c-bright">Valentino Paulon</span> — ricercatore di sicurezza e ingegnere
<span class="c-muted">// privilege escalation · sicurezza cloud-agent · ricerca sul codice</span>

Trova bug reali, sfruttabili, nuovi e li segnala responsabilmente.
Costruisce prodotti AI e software full-stack.

  <span class="c-muted">pubblicato</span> <span class="c-bright">CVE-2026-11837</span> — LPE in ansible.posix, accreditata da Red Hat
  <span class="c-muted">inoltre</span>    altre CVE e 0-day sotto coordinated disclosure
  <span class="c-muted">stack</span>      Go · Python · C/C++ · full-stack · AI/LLM

  linkedin  <a href="https://www.linkedin.com/in/valentino-paulon-738356367/" target="_blank" rel="noopener">in/valentino-paulon</a>
  github    <a href="https://github.com/M8seven" target="_blank" rel="noopener">github.com/M8seven</a>

<span class="c-muted">altro:</span> <span class="c-amber2">research</span> <span class="c-muted">·</span> <span class="c-amber2">cve</span>`,
      matteo:
`<span class="c-bright">Matteo Munafò</span> — tecnico automazione e controlli
<span class="c-muted">// PLC · HMI/SCADA · sistemi industriali</span>

8 anni in automazione industriale tra ferroviario, chimico e oil &amp; gas.
Troubleshooting avanzato e messa in servizio sul campo.

  <span class="c-muted">plc</span>        Siemens (S7-1200/1500/400H) · Rockwell · Saia · Selectron · ABB
  <span class="c-muted">hmi</span>        WinCC (Comfort/Advanced/Pro) · TIA Portal · STEP 7
  <span class="c-muted">campo</span>      collaudi FAT/SAT · strumentazione HART · ATEX
  <span class="c-muted">lingue</span>     IT (madrelingua) · EN (B2/C1) · ES (B1/B2)

  linkedin  <a href="https://www.linkedin.com/in/matteo-munafo/" target="_blank" rel="noopener">in/matteo-munafo</a>`,
      research:
`<span class="c-muted"># Valentino — lavoro pubblico; altro sotto coordinated disclosure</span>

<span class="tag">CVE</span> <span class="c-bright">CVE-2026-11837</span> — LPE in ansible.posix (chown che segue symlink)
   segnalata e accreditata da Red Hat
   <a href="https://access.redhat.com/security/cve/CVE-2026-11837" target="_blank" rel="noopener">access.redhat.com</a> · <a href="https://github.com/M8seven/cve-2026-11837-ansible-posix-authorized-key" target="_blank" rel="noopener">writeup</a>

<span class="tag embargo">0DAY</span> <span class="c-bright">privilege escalation in cloud-agent</span> — multipli, sotto disclosure

<span class="tag doi">DOI</span> <span class="c-bright">Captive Portal Security Analysis</span> — <a href="https://doi.org/10.5281/zenodo.19061528" target="_blank" rel="noopener">10.5281/zenodo.19061528</a>
<span class="tag doi">DOI</span> <span class="c-bright">Cross-Provider Fact Mesh</span> — <a href="https://doi.org/10.5281/zenodo.19061105" target="_blank" rel="noopener">10.5281/zenodo.19061105</a>`,
      cve:
`<span class="c-amber">CVE-2026-11837</span>  <span class="c-muted">— pubblicata · credit: Valentino Paulon</span>
<dl class="kv">
  <dt>componente</dt><dd>ansible.posix · authorized_key</dd>
  <dt>classe</dt><dd>local privilege escalation (CWE-59)</dd>
  <dt>causa</dt><dd>chown che segue symlink su ~/.ssh/authorized_keys</dd>
  <dt>vendor</dt><dd>Red Hat — credit accettato</dd>
  <dt>record</dt><dd><a href="https://access.redhat.com/security/cve/CVE-2026-11837" target="_blank" rel="noopener">access.redhat.com</a></dd>
</dl>`,
      services:
`<span class="c-amber">// SICUREZZA &amp; IT</span>  <span class="c-muted">— Valentino</span>
  · code review di sicurezza — Go / Python / C / C++
  · assessment cloud e infrastruttura
  · vulnerability research · sviluppo full-stack e AI

<span class="c-amber">// AUTOMAZIONE INDUSTRIALE — OT</span>  <span class="c-muted">— Matteo</span>
  · programmazione PLC (Siemens · Rockwell · Saia · Selectron · ABB)
  · sviluppo HMI/SCADA · WinCC
  · collaudi FAT/SAT · troubleshooting avanzato

<span class="c-amber">// SICUREZZA ICS / OT</span>  <span class="c-muted">— insieme</span>
  · assessment di sicurezza su sistemi di controllo industriale
  · hardening PLC/SCADA — dove la sicurezza IT incontra l'impianto

<span class="c-muted">da remoto · a progetto ·</span> scrivi <span class="c-amber2">contact</span>`,
      method:
`<span class="c-muted"># come lavoriamo</span>

Non lanciamo uno scanner e inoltriamo l'output. Leggiamo il codice,
leggiamo i sistemi, e troviamo ciò che i tool si perdono — da una CVE
nel sorgente a un guasto sull'impianto.

Ogni finding arriva con riferimenti esatti, un modello realistico, un
PoC funzionante e un fix concreto. <span class="c-olive">Verificato prima di segnalare.</span>`,
      contact:
`<span class="c-bright">Parliamone.</span>

  Valentino   <a href="mailto:valentino.paulon88@gmail.com">valentino.paulon88@gmail.com</a>
              <a href="https://www.linkedin.com/in/valentino-paulon-738356367/" target="_blank" rel="noopener">linkedin</a> · <a href="https://github.com/M8seven" target="_blank" rel="noopener">github</a>
  Matteo      <a href="mailto:teomueln@gmail.com">teomueln@gmail.com</a>
              <a href="https://www.linkedin.com/in/matteo-munafo/" target="_blank" rel="noopener">linkedin</a>

<span class="c-muted">da remoto · sicurezza · automazione · sicurezza ICS/OT</span>`,
      help:
`<span class="c-muted">comandi disponibili</span>
  <span class="c-amber2">about</span>      cos'è VMsolutions
  <span class="c-amber2">team</span>       noi due
  <span class="c-amber2">valentino</span>  sicurezza e software
  <span class="c-amber2">matteo</span>     automazione industriale
  <span class="c-amber2">services</span>   cosa facciamo
  <span class="c-amber2">research</span>   CVE e paper pubblicati
  <span class="c-amber2">contact</span>    contatti
  <span class="c-amber2">lang</span>       cambia lingua — <span class="c-muted">lang en | lang it</span>
  <span class="c-amber2">ls</span> / <span class="c-amber2">cat</span>   sfoglia i file · <span class="c-amber2">clear</span> pulisce lo schermo
<span class="c-muted">suggerimento: Tab completa · ↑/↓ cronologia · o clicca un comando sotto</span>`,
      intro:`<span class="c-bright">VMsolutions</span> · sicurezza e automazione industriale
<span class="c-muted">scrivi</span> <span class="c-amber2">help</span> <span class="c-muted">o clicca un comando qui sotto ·</span> <span class="c-amber2">lang en</span> <span class="c-muted">for English</span>`,
      nofile:f=>`<span class="c-rust">cat: ${escape(f)}: file inesistente</span> <span class="c-muted">(prova ls)</span>`,
      nocat:`<span class="c-rust">cat: manca il file — prova</span> ls`,
      notfound:n=>`<span class="c-rust">${escape(n)}: comando non trovato</span> <span class="c-muted">— scrivi</span> <span class="c-amber2">help</span>`,
      langset:l=>`<span class="c-muted">lingua →</span> <span class="c-olive">${l}</span>`,
    },
  };
  const t = k => T[lang][k];

  const FILE_KEYS = { 'about.txt':'about','team.txt':'team','valentino.txt':'valentino','matteo.txt':'matteo','services.txt':'services','contact.txt':'contact','cve-2026-11837.md':'cve' };

  /* ---------- commands ---------- */
  const COMMANDS = {
    help(){ block(t('help')); },
    about(){ block(t('about')); }, whoami(){ block(t('about')); },
    team(){ block(t('team')); },
    valentino(){ block(t('valentino')); }, vp(){ block(t('valentino')); },
    matteo(){ block(t('matteo')); }, mm(){ block(t('matteo')); },
    research(){ block(t('research')); },
    cve(){ block(t('cve')); },
    services(){ block(t('services')); },
    method(){ block(t('method')); },
    contact(){ block(t('contact')); },
    banner(){ out(`<pre class="banner">${BANNER}</pre>`); },
    ls(){ block(`<span class="c-olive">${Object.keys(FILE_KEYS).join('   ')}</span>`); },
    cat(args){ const f=args[0];
      if (!f) return out(t('nocat'));
      if (FILE_KEYS[f]) return block(t(FILE_KEYS[f]));
      out(t('nofile')(f)); },
    lang(args){ const l=(args[0]||'').toLowerCase();
      if (l==='en'||l==='it'){ setLang(l, true); }
      else out(`<span class="c-muted">lang:</span> <span class="c-olive">${lang}</span> <span class="c-muted">· usage: lang en | lang it</span>`); },
    id(){ out(`<span class="c-muted">uid=0(root) gid=0(root)</span> <span class="c-amber">— privilege escalation is the job</span>`); },
    sudo(){ out(`<span class="c-rust">guest is not in the sudoers file.</span> <span class="c-muted">This incident will be reported. ;)</span>`); },
    exploit(){ block(
`<span class="c-muted">running exploit chain…</span>
  [*] enumerating symlinks            <span class="c-olive">ok</span>
  [*] racing chown(2)                 <span class="c-olive">ok</span>
  [+] root shell                      <span class="c-amber">got it</span>
<span class="c-muted">…responsibly disclosed, of course. type</span> <span class="c-amber2">research</span>`); },
    date(){ out(`<span class="c-muted">${new Date().toString()}</span>`); },
    clear(){ screen.innerHTML=''; },
  };
  const NAMES = Object.keys(COMMANDS);
  const COMPLETIONS = [...NAMES, ...Object.keys(FILE_KEYS)];

  function run(raw){
    const line = raw.trim();
    out(`<span class="cmd-echo"><span class="ps">guest@vm</span><span class="pp">:~</span>$ ${escape(line)}</span>`);
    if (!line) return;
    const [name, ...args] = line.split(/\s+/);
    const fn = COMMANDS[name.toLowerCase()];
    if (fn) fn(args); else out(t('notfound')(name));
  }

  /* ---------- language ---------- */
  function setLang(l, announce){
    lang = l; document.documentElement.lang = l;
    [...langUI.querySelectorAll('button')].forEach(b => b.classList.toggle('on', b.dataset.l===l));
    if (announce){
      screen.innerHTML='';
      out(`<pre class="banner">${BANNER}</pre>`);
      out(t('langset')(l));
      block(t('intro'));
      input.focus(); placeCaret();
    }
  }
  langUI.querySelectorAll('button').forEach(b => b.addEventListener('click', () => setLang(b.dataset.l, true)));

  /* ---------- history ---------- */
  const hist = []; let hi = -1;

  /* ---------- caret tracking ---------- */
  const meas = document.createElement('canvas').getContext('2d');
  function placeCaret(){
    const cs = getComputedStyle(input); meas.font = `${cs.fontSize} ${cs.fontFamily}`;
    const w = meas.measureText(input.value.slice(0, input.selectionStart || 0)).width;
    caret.style.left = (input.offsetLeft + w) + 'px';
  }
  ['input','keyup','click','focus'].forEach(e => input.addEventListener(e, placeCaret));
  input.addEventListener('focus', () => caret.classList.add('show'));
  input.addEventListener('blur',  () => caret.classList.remove('show'));

  /* ---------- suggested chips ---------- */
  ['about','team','services','research','contact'].forEach(cmd => {
    const b = document.createElement('button');
    b.innerHTML = `<span class="k">▸</span>${cmd}`;
    b.addEventListener('click', () => { input.focus(); typeAndRun(cmd); });
    hints.appendChild(b);
  });
  function typeAndRun(cmd){
    let i=0; input.value=''; placeCaret();
    const iv=setInterval(()=>{ input.value=cmd.slice(0,++i); placeCaret();
      if (i>=cmd.length){ clearInterval(iv); setTimeout(()=>{ run(cmd); resetInput(); }, 130); } }, 32);
  }
  const resetInput = () => { input.value=''; placeCaret(); };

  /* ---------- input handling ---------- */
  form.addEventListener('submit', e => { e.preventDefault();
    const v=input.value; if (v.trim()){ hist.push(v); hi=hist.length; } run(v); resetInput(); });
  input.addEventListener('keydown', e => {
    if (e.key==='ArrowUp'){ e.preventDefault(); if (hi>0){ input.value=hist[--hi]; placeCaret(); } }
    else if (e.key==='ArrowDown'){ e.preventDefault(); if (hi<hist.length-1){ input.value=hist[++hi]; } else { hi=hist.length; input.value=''; } placeCaret(); }
    else if (e.key==='Tab'){ e.preventDefault();
      const parts=input.value.split(/\s+/); const frag=parts[parts.length-1];
      const pool = (parts[0]==='cat' && parts.length>1) ? Object.keys(FILE_KEYS) : COMPLETIONS;
      const hit=pool.filter(c=>c.startsWith(frag));
      if (hit.length===1){ parts[parts.length-1]=hit[0]; input.value=parts.join(' '); placeCaret(); }
      else if (hit.length>1){ out(`<span class="c-muted">${hit.join('   ')}</span>`); }
    }
  });
  document.addEventListener('click', e => { if (!e.target.closest('a,button')) input.focus(); });

  /* clock */
  const clock=document.getElementById('clock');
  const tick=()=>{ clock.textContent=new Date().toTimeString().slice(0,8); };
  tick(); setInterval(tick,1000);

  /* ---------- boot ---------- */
  const BOOT = [
    ['vmsolutions — secure session','c-muted'],
    ['[0.00] init','ok'],['[0.21] mod variant-analysis.ko','ok'],
    ['[0.39] link OT/IT bridge','ok'],['[0.60] arm cve-2026-11837 (symlink→chown)','armed'],
    ['[0.84] escalating privileges','root'],['[1.10] session ready','ok'],
  ];
  const STAT = { ok:'<span class="c-olive">ok</span>', armed:'<span class="c-amber2">armed</span>', root:'<span class="c-amber">root</span>' };
  function bootLine([txt,st]){ const pad='.'.repeat(Math.max(2,44-txt.length));
    out(st in STAT ? `<span class="c-muted">${txt}</span> <span class="c-muted">${pad}</span> ${STAT[st]}` : `<span class="${st}">${txt}</span>`); }
  function finish(){
    screen.innerHTML='';
    out(`<pre class="banner">${BANNER}</pre>`);
    block(t('intro')); input.focus(); placeCaret();
  }
  let booted=false;
  function boot(){ if (booted) return; booted=true;
    let i=0; (function step(){ if (i<BOOT.length){ bootLine(BOOT[i++]); setTimeout(step,150+Math.random()*120); } else setTimeout(finish,360); })();
  }
  const skip=()=>{ if (!screen.querySelector('.banner')) finish(); };
  addEventListener('keydown', e => { if (!screen.querySelector('.banner')){ e.preventDefault(); skip(); } });
  screen.addEventListener('click', skip);

  boot();
})();
