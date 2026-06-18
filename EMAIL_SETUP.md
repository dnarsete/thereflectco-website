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

### Day 0 (now) — The three changes that get you out of spam

**1. DMARC — replace `_dmarc` TXT record in Shopify DNS:**
- Old: `v=DMARC1; p=none; rua=mailto:dan@thereflectco.com`
- New: `v=DMARC1; p=quarantine; pct=100; rua=mailto:dan@thereflectco.com; ruf=mailto:dan@thereflectco.com; fo=1`

**2. SPF — replace the root TXT record:**
- Old: `v=spf1 include:_spf.google.com include:shops.shopify.com ~all`
- New: `v=spf1 include:_spf.google.com include:shops.shopify.com -all`
  (only the trailing `~all` → `-all` changes)

**3. Confirm DKIM is actively signing** (Google Workspace admin):
- https://admin.google.com → Apps → Google Workspace → Gmail → Authenticate email
- Status must read **"Authenticating email"**
- If not, click **Start authentication**

Why this fixes spam placement: with `p=none`, receivers see "domain owner
doesn't enforce" and your trust score drops. With `p=quarantine` they see
you actively protect against impersonation, and your authenticated mail
gets inbox placement.

### Week 2 — Optional cleanup if no issues

If you're no longer sending mail through Shopify (you may not be once
shopappose is the only Shopify store, and that has its own domain), drop
the Shopify include from SPF:
- `v=spf1 include:_spf.google.com -all`

Don't do this if you still send any mail from the thereflectco.com Shopify
store — order confirmations, abandoned cart, etc.

### Week 4+ — Strongest setting (if reports are clean)

After 2-4 weeks of monitoring DMARC reports (they arrive at dan@ as XML
attachments — Google parses them in the Postmaster Tools dashboard), tighten
to reject:

- New: `v=DMARC1; p=reject; pct=100; rua=mailto:dan@thereflectco.com; ruf=mailto:dan@thereflectco.com; fo=1; aspf=s; adkim=s`

Effect: spoofed mail is rejected outright (the highest level of domain
protection). Don't do this before Week 4 — you need monitoring data first.

---

## What you get when this is done

- Mail to `support@thereflectco.com` delivers (catch the form submissions)
- Domain shows up as fully authenticated in recipient inboxes (gets the
  blue checkmark in Gmail and similar trust badges in Outlook 365)
- Spoofers can't pretend to be you — phishing risk drops dramatically
- Inbox placement (vs. spam folder) improves measurably
