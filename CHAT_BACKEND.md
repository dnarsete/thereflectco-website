# AI chatbot — backend setup

The chat widget on contact.html is wired to call a backend if one is
configured (see `chat.js`). Until you wire it up, it falls back to
keyword-matched canned responses with a yellow "live AI being set up"
banner.

This doc walks you through wiring it to a real Claude-powered backend.

## What you need

1. **Anthropic API key** — sign up at https://console.anthropic.com, then
   Settings → API Keys → Create Key. Copy the key (starts with `sk-ant-`).
2. **A serverless function host.** Cheapest path: **Cloudflare Workers**
   (free tier, no credit card). Other options: Supabase Edge Functions
   (you already use Supabase for the CRM), Vercel, Netlify.

Below is the Cloudflare Worker path — it's the simplest.

## Cloudflare Workers setup

### 1. Sign up

- Go to https://dash.cloudflare.com/sign-up → free account
- After signing in, go to **Workers & Pages → Overview → Create**

### 2. Create the Worker

Pick **Hello World** template. Name it `reflect-chat`. Then **Edit code**.

Paste this in (replace the default code):

```js
export default {
  async fetch(request, env) {
    const cors = {
      'Access-Control-Allow-Origin': 'https://thereflectco.com',
      'Access-Control-Allow-Methods': 'POST, OPTIONS',
      'Access-Control-Allow-Headers': 'Content-Type'
    };
    if (request.method === 'OPTIONS') return new Response(null, { headers: cors });
    if (request.method !== 'POST') return new Response('POST only', { status: 405, headers: cors });

    const { messages } = await request.json();
    if (!Array.isArray(messages) || messages.length === 0) {
      return new Response(JSON.stringify({ error: 'no messages' }), { status: 400, headers: { ...cors, 'Content-Type': 'application/json' } });
    }

    const r = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'x-api-key': env.ANTHROPIC_API_KEY,
        'anthropic-version': '2023-06-01',
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        model: 'claude-haiku-4-5-20251001',
        max_tokens: 600,
        system: `You are the customer service assistant for The Reflect Co. (thereflectco.com), a proactive performance company that makes products to help people do better, for health, wellness, and longevity. Brands: Appose (at shopappose.com) and the LipTX line within it. Voice: plain, frank, no marketing fluff. Answer briefly. If you don't know, say so and route the visitor to the contact form on the page.`,
        messages
      })
    });

    const data = await r.json();
    return new Response(JSON.stringify(data), { status: r.status, headers: { ...cors, 'Content-Type': 'application/json' } });
  }
};
```

### 3. Save your API key as a secret

In the Worker → **Settings → Variables → Add variable**:
- Name: `ANTHROPIC_API_KEY`
- Type: **Encrypt** (important — never plaintext)
- Value: paste your `sk-ant-...` key
- Save

### 4. Deploy + copy the URL

Click **Deploy**. Cloudflare gives you a URL like
`https://reflect-chat.YOURNAME.workers.dev`. Copy it.

### 5. Wire it into the site

Open `chat.js` in the repo and find this line near the top:

```js
const BACKEND_URL = '';   // paste your worker URL here when ready
```

Paste the URL between the quotes, commit + push. The chat widget will
automatically start using the real backend.

The yellow "live AI being set up" banner disappears once a backend URL is
configured.

## What it costs

- Cloudflare Workers free tier: **100,000 requests/day** — far more than
  you'll ever use for a customer chat
- Anthropic API: usage-based. At Haiku rates (~$1/M input tokens,
  $5/M output tokens), 10,000 chat exchanges with ~500 tokens each round
  costs about **$8/month**. Realistic real-world usage at this scale:
  probably under $5/month for a year.

## Optional safety knobs

Inside the Worker, you can add:
- **Rate limiting** by IP (one of CF's built-in features)
- **Allowed-origin enforcement** (already done in the snippet —
  only `thereflectco.com` can call it)
- **Message length cap** (truncate prompts longer than 2000 chars)
- **Logging** (Workers Logs is free — see who's chatting about what)
