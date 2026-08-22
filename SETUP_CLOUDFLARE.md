# Front thereflectco.com with Cloudflare (free)

## What this gets you

- **Real security headers** (HSTS, X-Frame-Options at the HTTP level) — GitHub Pages can't add these directly; Cloudflare can
- **DDoS protection** (blocks attack traffic automatically)
- **WAF** (web application firewall — blocks common bot/exploit patterns)
- **Better performance** — Cloudflare's global CDN caches closer to visitors
- **Analytics** — see traffic by country, browser, referrer (independent of Google Analytics)
- **Bot detection** — blocks scrapers, keeps humans

Cost: **$0/month** on Cloudflare's Free tier. Everything above is included free.

Time to set up: **~30 minutes** (mostly waiting for DNS to propagate).

---

## The tradeoff

Right now, Shopify manages your DNS (that's where your MX, DMARC, SPF, DKIM records live). To use Cloudflare, you switch your **nameservers** — the top-level pointer for your domain — from Shopify to Cloudflare. All your existing DNS records get copied over.

Nothing about your site or email actually moves. It's just a change in who's managing the DNS records.

If you don't like it, you can switch nameservers back to Shopify in 5 minutes.

---

## Step-by-step

### Step 1 — Create a Cloudflare account

1. Open **https://dash.cloudflare.com/sign-up**
2. Sign up with your email (`dan@thereflectco.com` or personal — doesn't matter)
3. Confirm your email

### Step 2 — Add thereflectco.com

1. After sign-in, click **Add a site**
2. Enter: `thereflectco.com`
3. Click **Continue**
4. Choose the **Free** plan → **Continue**
5. Cloudflare will scan your current DNS records at Shopify and import them all automatically. You'll see a list of A, CNAME, TXT, MX records.
6. **Review the list** — should include:
   - A record: `@` → `185.199.108.153`
   - CNAME: `www` → `dnarsete.github.io`
   - MX: `@` → `smtp.google.com`
   - TXT: SPF, DMARC, DKIM (google._domainkey), etc.
7. Click **Continue**

### Step 3 — Switch nameservers at Shopify

Cloudflare will give you **two nameserver hostnames** (something like `alice.ns.cloudflare.com` and `bob.ns.cloudflare.com`).

1. In another tab, open **Shopify admin → Settings → Domains → thereflectco.com**
2. Look for **Nameservers** or **Change nameservers** (may be behind a "..." menu or "Advanced")
3. Replace the current Shopify nameservers with the two Cloudflare hostnames Cloudflare gave you
4. Save

### Step 4 — Wait for propagation

- Cloudflare will detect the switch within 1-24 hours (usually 1-2 hours)
- You'll get an email from Cloudflare when it's active
- The site keeps working the whole time — no downtime

### Step 5 — Turn on security headers

Once Cloudflare shows your site as active:

1. In Cloudflare dashboard → **thereflectco.com** → **SSL/TLS**
2. Set **Encryption mode** to **Full** (not "Flexible")
3. Under **Edge Certificates** → turn on **Always Use HTTPS** (redirects HTTP → HTTPS)
4. Under **Edge Certificates** → turn on **HSTS** with default settings (6 months, include subdomains)
5. Go to **Security → Settings** → set **Security Level** to **Medium**
6. Turn on **Bot Fight Mode**

### Step 6 — Add response headers (optional but recommended)

1. Cloudflare dashboard → **Rules → Transform Rules** → **Modify Response Header**
2. Click **Create rule** and add these headers for `hostname eq "thereflectco.com"`:
   - `X-Frame-Options` = `DENY`
   - `X-Content-Type-Options` = `nosniff`
   - `Referrer-Policy` = `strict-origin-when-cross-origin`
   - `Permissions-Policy` = `geolocation=(), microphone=(), camera=(), payment=()`
3. Deploy

---

## After it's live

Test your security score at **https://securityheaders.com/?q=thereflectco.com** — should go from a C or D to an A/A+.

Test SSL at **https://www.ssllabs.com/ssltest/analyze.html?d=thereflectco.com** — should be A+.

---

## If something breaks

- **Site stops loading:** switch nameservers back to Shopify's original values (write them down before switching!). Everything reverts in an hour.
- **Email stops working:** check that all MX + TXT records got imported to Cloudflare. Cloudflare's import isn't always perfect.
- **HTTPS errors:** SSL/TLS mode must be **Full** (not "Flexible" or "Off").

---

## What NOT to do

- Don't turn on Cloudflare's "Proxy" (orange cloud) for MX records — email must go direct to Google, not through Cloudflare. Cloudflare imports MX with proxy OFF by default; leave it that way.
- Don't enable Cloudflare's "Auto Minify" for JavaScript unless you want to debug potential issues later — GitHub Pages already serves optimized static files.
