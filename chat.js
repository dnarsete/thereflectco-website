/* Reflect Co customer service chat widget.
   v1: keyword-based canned responses. v2 (planned): swap respond() with a call
   to a Supabase Edge Function that proxies to the Anthropic API. */

(function () {
  const fab = document.getElementById('chat-fab');
  const panel = document.getElementById('chat-panel');
  const closeBtn = document.getElementById('chat-close');
  const form = document.getElementById('chat-form');
  const input = document.getElementById('chat-input');
  const msgs = document.getElementById('chat-msgs');
  if (!fab || !panel || !form) return;

  function open() {
    panel.classList.add('open');
    fab.classList.add('hidden');
    setTimeout(() => input.focus(), 100);
    if (!msgs.children.length) {
      addBot("Hi! I'm the Reflect Co assistant. I can answer quick questions about our brands, the Professional Portal, wholesale terms, or how to get in touch. What can I help with?");
    }
  }
  function close() {
    panel.classList.remove('open');
    fab.classList.remove('hidden');
  }
  fab.addEventListener('click', open);
  closeBtn.addEventListener('click', close);

  function add(role, text) {
    const el = document.createElement('div');
    el.className = 'chat-msg ' + role;
    el.textContent = text;
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }
  function addBot(text) { return add('bot', text); }
  function addUser(text) { return add('user', text); }
  function addTyping() {
    const el = document.createElement('div');
    el.className = 'chat-msg typing';
    el.textContent = 'Typing…';
    msgs.appendChild(el);
    msgs.scrollTop = msgs.scrollHeight;
    return el;
  }

  /* Stub responder — replace with API call to Anthropic via your backend.
     Returns a string. */
  function respond(message) {
    const m = message.toLowerCase();
    if (/appose|shop ?appose|where.*buy/.test(m)) {
      return "Appose is our brand — quiet luxury, the same testing standard as everything we make. Shop direct at shopappose.com.";
    }
    if (/liptx|lip/.test(m)) {
      return "LipTX is a specialty line within Appose. Built to the same proactive performance standard. You can read more on the Our Brands page.";
    }
    if (/portal|crm|sign ?in|login|rep account/.test(m)) {
      return "Authorized representatives and distributors sign in at the Professional Portal — link in the top nav. If you don't have credentials yet, your admin can invite you.";
    }
    if (/wholesale|carry|distributor|retail/.test(m)) {
      return "We're selective about wholesale partners. Send a note via the contact form with your channel, geography, and the brands you currently carry — we'll route it to the right person.";
    }
    if (/shipping|tax|return/.test(m)) {
      return "Default shipping is a flat rate. Multi-jurisdiction tax is handled at order time. All sales final; returns only for shipping damage (routed through your rep).";
    }
    if (/test|prove|claim|data/.test(m)) {
      return "Every formulation is batch-tested against the claim on the label. If we can't prove it, we don't say it. Specific test data can be requested through your rep or the contact form.";
    }
    if (/contact|email|phone|address/.test(m)) {
      return "Email dnarsete@gmail.com or fill the form on this page. We're at 3642 S. Jason Street, Englewood, CO 80210. Hours: Mon–Fri, 9am–5pm MT.";
    }
    if (/hi|hello|hey/.test(m.trim())) {
      return "Hi — what can I help with? You can ask about brands, the Professional Portal, wholesale, shipping, or how to get in touch.";
    }
    return "I'm a basic stub for now — for anything specific I can't answer, please use the form on this page and we'll follow up by email.";
  }

  form.addEventListener('submit', function (e) {
    e.preventDefault();
    const text = input.value.trim();
    if (!text) return;
    addUser(text);
    input.value = '';
    const typing = addTyping();
    setTimeout(() => {
      typing.remove();
      addBot(respond(text));
    }, 400 + Math.random() * 600);
  });
})();
