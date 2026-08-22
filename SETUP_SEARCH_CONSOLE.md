# Verify thereflectco.com in Google Search Console + Bing Webmaster Tools

## Why this matters

Search Console tells you:
- Which pages Google has indexed
- What search terms bring people to the site
- Any security or crawling issues Google detected
- Where to submit your sitemap for faster indexing

Bing Webmaster Tools does the same for Bing. Both are free.

**Verification was broken earlier** — the original `google-site-verification` TXT record was overwritten during DKIM setup, so you'll need to re-verify.

---

## Part 1 — Google Search Console (10 min)

### Step 1 — Add the property

1. Open **https://search.google.com/search-console**
2. Sign in with the same Google account that owns Google Workspace (usually the one that runs `@reflectskin.com`, since that's your admin account)
3. Click **Add property** (top left, near the dropdown)
4. Choose **URL prefix** (not Domain, since Domain requires DNS records which we're avoiding right now)
5. Type: `https://thereflectco.com` and click **Continue**

### Step 2 — Verify via HTML tag

Google shows multiple verification methods. Use **HTML tag** (easiest).

1. Click the **HTML tag** section to expand it
2. Google shows a meta tag like: `<meta name="google-site-verification" content="XXXXXX_YOUR_UNIQUE_STRING_XXXXXX" />`
3. **Copy the entire tag** — you'll paste it in chat and I'll add it to the site for you

### Step 3 — Send me the meta tag

Paste the whole `<meta name="google-site-verification"...>` string here in chat. I'll add it to `index.html`, commit + push, and it'll be live in ~1 minute.

### Step 4 — Click Verify in Search Console

Once I confirm the tag is live, go back to Google Search Console and click **Verify** on that page.

### Step 5 — Submit the sitemap

After verification succeeds:

1. Left sidebar: **Sitemaps**
2. Enter: `sitemap.xml`
3. Click **Submit**

Google will crawl within a few days. You'll start seeing search data after ~1 week.

---

## Part 2 — Bing Webmaster Tools (5 min)

### Step 1 — Add the site

1. Open **https://www.bing.com/webmasters**
2. Sign in with a Microsoft account (or create one — same email as your Google Workspace works)
3. If prompted, choose **Add a site manually**
4. Enter: `https://thereflectco.com` and click **Add**

### Step 2 — Verify via HTML meta tag (or import from Google)

Bing offers two shortcuts:
- **Import from Google Search Console** (fastest — click that button if it appears)
- **Or manually verify** via HTML meta tag

If manual: Bing gives you a `<meta name="msvalidate.01" content="XXXXXX" />` tag. Paste it in chat and I'll add it to the site the same way as Google.

### Step 3 — Submit the sitemap

After verification:

1. Left sidebar: **Sitemaps**
2. Add: `https://thereflectco.com/sitemap.xml`
3. Click **Submit**

---

## What to do first

Go to **Google Search Console** and start Step 1. When you see the HTML tag on Step 2, paste it here and I'll deploy it.
