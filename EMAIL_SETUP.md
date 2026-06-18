# Email setup — exact steps

Two parts: (A) make `support@thereflectco.com` actually deliver mail, and
(B) tighten anti-spam (DMARC/SPF) over the next 4 weeks.

---

## A · Make `support@thereflectco.com` deliver

You added `support@` to the website. Until you do this step, mail sent to
that address bounces and hurts your domain reputation.

1. Go to **https://admin.google.com**
2. **Directory → Users → dan@thereflectco.com**
3. Right side: **User information → Email aliases → Add alias**
4. Alias: `support` (Google auto-completes the domain)
5. **Save**

Effect: any mail to `support@thereflectco.com` shows up in your dan@ inbox.
Costs nothing — Google Workspace includes up to 30 aliases per user.

If you ever want a separate inbox (not just an alias), upgrade to a second
Workspace user (~$6/mo).

---

## B · Anti-spam tightening (4-week rollout)

You already have SPF, DKIM, and DMARC at `p=none` (monitoring only). The
upgrade path is to gradually enforce them so Gmail/Outlook trust you.

### Week 0 (now) — Already done
- SPF: `v=spf1 include:_spf.google.com include:shops.shopify.com ~all` ✓
- DKIM: Google + Shopify keys present ✓
- DMARC: `v=DMARC1; p=none; rua=mailto:dan@thereflectco.com` ✓

Watch your inbox for DMARC reports (XML attachments from various email
providers). They tell you who is sending mail as you and whether it's
passing SPF/DKIM. Keep an eye out for legitimate senders failing — those
need fixing before you tighten.

### Week 2 — Verify DKIM is signing

1. Go to **https://admin.google.com**
2. **Apps → Google Workspace → Gmail → Authenticate email**
3. Confirm status reads **"Authenticating email"** (not "Not authenticating")
4. If not: click **Generate new record → 2048-bit** and follow the steps
   (you'll add a TXT record to Shopify DNS — Google gives you the exact
   value)

### Week 2 — Tighten SPF (one DNS edit)

In **Shopify admin → Online Store → Domains → thereflectco.com → DNS**:

- Find the TXT record: `v=spf1 include:_spf.google.com include:shops.shopify.com ~all`
- Change to: `v=spf1 include:_spf.google.com -all`
  (Drop the Shopify include unless you're still sending mail via Shopify.
  Change `~all` to `-all` for strict enforcement.)
- Save.

### Week 2 → Week 4 — Upgrade DMARC to quarantine

In Shopify DNS, edit the `_dmarc` TXT record:

- Current: `v=DMARC1; p=none; rua=mailto:dan@thereflectco.com`
- New:     `v=DMARC1; p=quarantine; pct=100; rua=mailto:dan@thereflectco.com; ruf=mailto:dan@thereflectco.com; adkim=s; aspf=s`

Effect: receivers send suspicious mail (anything failing SPF/DKIM that
claims to be from your domain) to the spam folder instead of inbox.

Watch DMARC reports for 2 weeks. If legitimate senders are getting
quarantined, fix those before the next step.

### Week 4+ — Upgrade DMARC to reject

In Shopify DNS, edit `_dmarc` again:

- New: `v=DMARC1; p=reject; pct=100; rua=mailto:dan@thereflectco.com; ruf=mailto:dan@thereflectco.com; adkim=s; aspf=s`

Effect: spoofed mail is rejected outright — the highest level of domain
protection. Should not be done before Week 4 because it's irreversible
without DNS edits.

---

## What you get when this is done

- Mail to `support@thereflectco.com` delivers (catch the form submissions)
- Domain shows up as fully authenticated in recipient inboxes (gets the
  blue checkmark in Gmail and similar trust badges in Outlook 365)
- Spoofers can't pretend to be you — phishing risk drops dramatically
- Inbox placement (vs. spam folder) improves measurably
