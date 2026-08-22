# Upgrade DMARC to reject (final tightening)

## When to do this

After **2-4 weeks** of running the current `p=quarantine` policy, if DMARC reports show no legitimate senders failing authentication.

Current live DMARC (as of last check):
```
v=DMARC1; p=quarantine; pct=100; rua=mailto:dan@thereflectco.com; ruf=mailto:dan@thereflectco.com; fo=1
```

## The upgrade

Change the `_dmarc` TXT record in Shopify DNS to:

```
v=DMARC1; p=reject; pct=100; rua=mailto:dan@thereflectco.com; ruf=mailto:dan@thereflectco.com; fo=1; aspf=s; adkim=s
```

Three changes:
1. `p=quarantine` → `p=reject` — spoofed mail is rejected outright, not just spam-foldered
2. `aspf=s` added — strict SPF alignment (envelope-from domain must exactly match From: header domain)
3. `adkim=s` added — strict DKIM alignment (signing domain must exactly match From: header domain)

## Effect

Recipients that support DMARC (Gmail, Outlook, Yahoo, iCloud — >95% of inboxes) will **reject** any mail that claims to be from `@thereflectco.com` but fails SPF+DKIM. This kills impersonation attacks.

Your legitimate mail (sent through Google Workspace) continues to pass because SPF, DKIM, and DMARC alignment all work correctly. Confirmed by:
- SPF: `v=spf1 include:_spf.google.com include:shops.shopify.com -all` — Google is authorized
- DKIM: 1024-bit key at `google._domainkey`, signed by Google Workspace
- MX: pointing to `smtp.google.com`

## Before you tighten — check the reports

DMARC reports arrive in your `dan@thereflectco.com` inbox as XML attachments from various email providers (Google, Microsoft, Yahoo, etc.). They tell you:
- Who's sending mail claiming to be from `@thereflectco.com`
- Whether each message passed or failed SPF/DKIM
- Whether alignment is correct

**How to read them:** paste the XML content into https://dmarcian.com/dmarc-xml/ — they parse it into a readable table for free.

**What you're looking for:** any legitimate sender (not you, not Google, not Shopify) that's sending mail as your domain and failing. Common culprits:
- Marketing tools like Mailchimp, HubSpot, ConvertKit sending from your domain
- CRM tools sending outreach as you
- E-signature tools like DocuSign

If you find any legitimate sender failing, we need to authorize them in SPF or set up DKIM for them **before** you upgrade to `p=reject`. Otherwise their mail will be rejected.

If reports show only your Google Workspace mail (all passing) and various fake spoof attempts (all failing) — you're safe to upgrade.

## To make the change

1. **https://admin.shopify.com** → **Settings → Domains → thereflectco.com → DNS**
2. Find the `_dmarc` TXT record (currently has `p=quarantine`)
3. Click the pencil ✏️ icon
4. Replace the value with the new string above
5. Click Confirm

**Verify after ~5 min:**
```
dig +short TXT _dmarc.thereflectco.com
```

Should return the new value with `p=reject`.

## Rollback if needed

If legitimate mail starts bouncing after the change, revert to the previous value:

```
v=DMARC1; p=quarantine; pct=100; rua=mailto:dan@thereflectco.com; ruf=mailto:dan@thereflectco.com; fo=1
```

Reverts in ~5 minutes after the DNS change propagates.
