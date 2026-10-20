/* Lapland Travel Assistant – cookie consent + Google tag (Consent Mode v2)
 *
 * Nothing is tracked and no banner is shown until GTAG_ID is filled in.
 * GTAG_ID: Google Ads ID ("AW-…") or Google Analytics ID ("G-…").
 * CONVERSIONS: Google Ads conversion "send_to" values, e.g. 'AW-123456789/AbCdEfGh'.
 */
(function(){
  var GTAG_ID = '';
  var CONVERSIONS = { trip: '', question: '' };
  var KEY = 'lta-consent'; // 'granted' | 'denied'

  function get(){ try { return localStorage.getItem(KEY); } catch(e){ return null; } }
  function set(v){ try { localStorage.setItem(KEY, v); } catch(e){} }

  window.dataLayer = window.dataLayer || [];
  function gtag(){ dataLayer.push(arguments); }
  window.gtag = window.gtag || gtag;

  // Called by the site when a request is sent (only counts if consent was given)
  window.ltaConversion = function(kind){
    if (!GTAG_ID || get() !== 'granted' || !CONVERSIONS[kind]) return;
    gtag('event', 'conversion', { send_to: CONVERSIONS[kind] });
  };

  // Footer link "Cookie settings" calls this
  window.ltaCookieSettings = function(){ if (GTAG_ID) show(); };

  if (!GTAG_ID) return;

  gtag('consent', 'default', {
    ad_storage: 'denied', ad_user_data: 'denied', ad_personalization: 'denied',
    analytics_storage: 'denied', wait_for_update: 500
  });
  if (get() === 'granted') grant(true);
  var s = document.createElement('script');
  s.async = true; s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(GTAG_ID);
  document.head.appendChild(s);
  gtag('js', new Date());
  gtag('config', GTAG_ID);

  function grant(silent){
    gtag('consent', 'update', {
      ad_storage: 'granted', ad_user_data: 'granted', ad_personalization: 'granted', analytics_storage: 'granted'
    });
  }

  var css = '#lta-cc{position:fixed;left:16px;right:16px;bottom:16px;z-index:9999;max-width:560px;margin:0 auto;background:#0E2A3B;color:#F6F8F8;border-radius:18px;padding:18px 20px;font:15px/1.5 "DM Sans",system-ui,sans-serif;box-shadow:0 10px 30px rgba(0,0,0,.25)}'
    + '#lta-cc p{margin:0 0 12px}#lta-cc a{color:#C9A24A}#lta-cc .b{display:flex;gap:10px;flex-wrap:wrap}'
    + '#lta-cc button{font:700 14px "DM Sans",system-ui,sans-serif;border-radius:999px;padding:10px 18px;cursor:pointer;border:1px solid #C9A24A}'
    + '#lta-cc .y{background:#C9A24A;color:#0E2A3B}#lta-cc .n{background:transparent;color:#F6F8F8;border-color:rgba(246,248,248,.5)}';

  function show(){
    if (document.getElementById('lta-cc')) return;
    if (!document.getElementById('lta-cc-css')){
      var st = document.createElement('style'); st.id = 'lta-cc-css'; st.textContent = css; document.head.appendChild(st);
    }
    var d = document.createElement('div'); d.id = 'lta-cc'; d.setAttribute('role','dialog'); d.setAttribute('aria-label','Cookie choices');
    d.innerHTML = '<p>We’d like to use cookies to see which of our ads bring visitors to the site. Nothing is set unless you accept. <a href="/#/cookies">Read more</a></p>'
      + '<div class="b"><button type="button" class="y">Accept</button><button type="button" class="n">Decline</button></div>';
    d.querySelector('.y').onclick = function(){ set('granted'); grant(); d.remove(); };
    d.querySelector('.n').onclick = function(){
      set('denied');
      gtag('consent','update',{ad_storage:'denied',ad_user_data:'denied',ad_personalization:'denied',analytics_storage:'denied'});
      d.remove();
    };
    (document.body || document.documentElement).appendChild(d);
  }

  if (!get()){
    if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', show); else show();
  }
})();
