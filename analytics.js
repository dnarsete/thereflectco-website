/* Google Analytics 4 — placeholder
   To activate:
   1. Go to https://analytics.google.com → Admin → Create Property
   2. Property name: The Reflect Co.   Time zone: America/Denver
   3. Set up a Web data stream → URL: https://thereflectco.com
   4. Copy the Measurement ID (looks like G-XXXXXXXXXX)
   5. Replace MEASUREMENT_ID below with the real ID
   6. Commit + push — GA starts collecting on next page load. */

(function () {
  var MEASUREMENT_ID = 'G-XXXXXXXXXX';   // <-- paste your real ID here
  if (MEASUREMENT_ID.indexOf('XXXX') !== -1) return;   // skip until configured

  var s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + MEASUREMENT_ID;
  document.head.appendChild(s);

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = gtag;
  gtag('js', new Date());
  gtag('config', MEASUREMENT_ID, {
    anonymize_ip: true,
    cookie_flags: 'SameSite=None;Secure'
  });
})();
