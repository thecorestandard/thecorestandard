/* The Core Standard — shared behaviours
   Handles: nav scroll, reveal animations, hamburger, sticky-cta, FAQ accordion, FAQ category filter, TOC highlighter */
(function(){
  'use strict';

  // The Core Standard loads no non-essential or tracking cookies: only
  // strictly necessary cookies plus Google Fonts. No cookie-consent
  // banner is required. If analytics (e.g. GA4) is added later, restore
  // a consent gate here before loading it.
  window.TCS = window.TCS || {};

  // ─── FORMS (Formspree) ───────────────────────────────────────────
  // EDIT THIS ONE LINE: create a form at formspree.io, then paste its
  // endpoint below (looks like https://formspree.io/f/abcdwxyz). Every
  // form on the site posts to it; the "form" field in each submission
  // tells you which page it came from. The forms stay inert (and tell
  // people to email instead) until this is set.
  window.TCS_FORM_ENDPOINT = 'https://formspree.io/f/xlgaedwk';

  // NAV SCROLL SHADOW
  var nav = document.getElementById('mainNav');
  if (nav) {
    window.addEventListener('scroll', function(){
      if (window.scrollY > 50) { nav.classList.add('scrolled'); } else { nav.classList.remove('scrolled'); }
    }, { passive: true });
  }

  // SCROLL REVEAL (with IntersectionObserver, falls back gracefully)
  var revealEls = document.querySelectorAll('.reveal, .reveal-left, .reveal-right');
  if ('IntersectionObserver' in window && revealEls.length) {
    var observer = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) { entry.target.classList.add('visible'); observer.unobserve(entry.target); }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    revealEls.forEach(function(el){ observer.observe(el); });
  } else {
    revealEls.forEach(function(el){ el.classList.add('visible'); });
  }

  // HAMBURGER
  var hamburger = document.querySelector('.hamburger');
  var navLinks = document.querySelector('.nav-links');
  if (hamburger && navLinks) {
    hamburger.addEventListener('click', function(){
      hamburger.classList.toggle('open');
      navLinks.classList.toggle('open');
      var expanded = hamburger.classList.contains('open');
      hamburger.setAttribute('aria-expanded', expanded ? 'true' : 'false');
    });
    navLinks.querySelectorAll('a').forEach(function(link){
      link.addEventListener('click', function(){
        hamburger.classList.remove('open');
        navLinks.classList.remove('open');
        hamburger.setAttribute('aria-expanded', 'false');
      });
    });
  }

  // STICKY MOBILE CTA
  var sticky = document.getElementById('stickyCta');
  var sentinel = document.querySelector('.hero, .page-hero');
  if (sticky && sentinel && 'IntersectionObserver' in window) {
    var stickyObs = new IntersectionObserver(function(entries){
      entries.forEach(function(e){
        if (e.isIntersecting) {
          sticky.classList.remove('visible');
          sticky.setAttribute('aria-hidden', 'true');
        } else {
          sticky.classList.add('visible');
          sticky.setAttribute('aria-hidden', 'false');
        }
      });
    }, { threshold: 0.05 });
    stickyObs.observe(sentinel);
  }

  // FAQ ACCORDION
  document.querySelectorAll('.faq-q').forEach(function(q){
    q.addEventListener('click', function(){
      var item = this.closest('.faq-item');
      var open = item.classList.contains('open');
      if (open) {
        item.classList.remove('open');
        this.setAttribute('aria-expanded', 'false');
      } else {
        item.classList.add('open');
        this.setAttribute('aria-expanded', 'true');
      }
    });
  });

  // FAQ CATEGORY PILLS (filter)
  var pills = document.querySelectorAll('.faq-pill');
  if (pills.length) {
    pills.forEach(function(pill){
      pill.addEventListener('click', function(){
        var cat = pill.getAttribute('data-category');
        pills.forEach(function(p){ p.classList.remove('active'); });
        pill.classList.add('active');
        document.querySelectorAll('.faq-item').forEach(function(item){
          var itemCats = (item.getAttribute('data-category') || '').split(' ');
          if (cat === 'all' || itemCats.indexOf(cat) !== -1) {
            item.style.display = '';
          } else {
            item.style.display = 'none';
            item.classList.remove('open');
          }
        });
      });
    });
  }

  // LEGAL TOC — highlight active section on scroll
  var tocLinks = document.querySelectorAll('.legal-toc a');
  var legalHeadings = document.querySelectorAll('.legal-content h2');
  if (tocLinks.length && legalHeadings.length && 'IntersectionObserver' in window) {
    var tocObs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          var id = entry.target.getAttribute('id');
          tocLinks.forEach(function(link){
            link.classList.toggle('active', link.getAttribute('href') === '#' + id);
          });
        }
      });
    }, { rootMargin: '-100px 0px -70% 0px', threshold: 0 });
    legalHeadings.forEach(function(h){ tocObs.observe(h); });
  }

  // COUNTERS
  var counters = document.querySelectorAll('.stat-number[data-count]');
  if (counters.length && 'IntersectionObserver' in window) {
    var animateCounter = function(c){
      var target = parseInt(c.dataset.count, 10);
      var suffix = c.dataset.suffix || '';
      var duration = 1600;
      var start = performance.now();
      var tick = function(now){
        var progress = Math.min((now - start) / duration, 1);
        var eased = 1 - Math.pow(1 - progress, 3);
        c.textContent = Math.round(target * eased) + suffix;
        if (progress < 1) requestAnimationFrame(tick);
      };
      requestAnimationFrame(tick);
    };
    var counterObs = new IntersectionObserver(function(entries){
      entries.forEach(function(entry){
        if (entry.isIntersecting) {
          animateCounter(entry.target);
          counterObs.unobserve(entry.target);
        }
      });
    }, { threshold: 0.4 });
    counters.forEach(function(c){ counterObs.observe(c); });
  }

  // PRODUCTS DROPDOWN (nav)
  // The trigger is now an <a href="products.html"> so clicking navigates on desktop.
  // On mobile (hamburger drawer open, narrow viewport), first tap opens the dropdown;
  // second tap on the same trigger follows the link.
  document.querySelectorAll('.nav-dropdown').forEach(function(dd){
    var trigger = dd.querySelector('.nav-dropdown-trigger');
    if (!trigger) return;
    trigger.addEventListener('click', function(e){
      var isMobile = window.matchMedia && window.matchMedia('(max-width: 900px)').matches;
      if (isMobile) {
        // On mobile: first tap toggles dropdown, does not navigate.
        // Second tap on an already-open dropdown navigates (default behaviour).
        if (!dd.classList.contains('open')) {
          e.preventDefault();
          e.stopPropagation();
          dd.classList.add('open');
          trigger.setAttribute('aria-expanded', 'true');
        }
        // else: let the click navigate to products.html
      } else {
        // On desktop: click navigates. Hover already opens the dropdown via CSS.
        // Nothing to do — let the anchor follow its href.
      }
    });
    // Close on ESC
    dd.addEventListener('keydown', function(e){
      if (e.key === 'Escape') {
        dd.classList.remove('open');
        trigger.setAttribute('aria-expanded', 'false');
        trigger.focus();
      }
    });
  });
  // Close dropdowns on outside click
  document.addEventListener('click', function(e){
    document.querySelectorAll('.nav-dropdown.open').forEach(function(dd){
      if (!dd.contains(e.target)) {
        dd.classList.remove('open');
        var t = dd.querySelector('.nav-dropdown-trigger');
        if (t) t.setAttribute('aria-expanded', 'false');
      }
    });
  });

  // SMOOTH SCROLL for in-page anchors that don't rely on CSS scroll-behavior
  document.querySelectorAll('a[href^="#"]').forEach(function(link){
    link.addEventListener('click', function(e){
      var href = link.getAttribute('href');
      if (href.length > 1 && href !== '#') {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth', block: 'start' });
          history.replaceState(null, '', href);
        }
      }
    });
  });

  // HOMEPAGE LEVEL FINDER (aka "the scorecard") — handler is INLINED in index.html
  // so it ships with the HTML and can't be cached separately. Nothing here.

  // =====================================================================
  // CENTRAL STRIPE URL MAP — update a key here when a new payment link is ready.
  // Null values mean the product is not yet live; buttons with those keys
  // fall back to whatever href they already have (typically an early-list mailto).
  // =====================================================================
  var TCS_STRIPE_URLS = {
    // Candidate-paid (TCS Certified) — one assessment, scored against every level
    'tcs_certified':      'https://buy.stripe.com/fZucN7cz42bBfTKeWk2Ji0A',
    'ea_certified_l1':    'https://buy.stripe.com/6oU28t6aG17x6jacOc2Ji0i',
    'ea_certified_l2':    'https://buy.stripe.com/00w28t2Yu4jJ8ri9C02Ji0j',
    'ea_certified_l3':    'https://buy.stripe.com/cNi7sNcz4g2r4b2bK82Ji0k',
    // Private PA Certified — coming soon, not yet sellable
    'ppa_certified_l1':   null,
    'ppa_certified_l2':   null,
    'cos_certified':      null,
    // Employer-commissioned (EA Hire)
    'ea_hire_operational':'https://buy.stripe.com/fZufZjdD8dUj4b29C02Ji0n',
    'ea_hire_director':   'https://buy.stripe.com/00w8wR9mS17x5f63dC2Ji0o',
    'ea_hire_csuite':     'https://buy.stripe.com/dRm4gBdD817xbDu3dC2Ji0p',
    // Employer-commissioned (Benchmark Your Team) — one price band per team size
    'benchmark_team_1_4':   'https://buy.stripe.com/8x24gBeHc8zZdLC7tS2Ji0B',
    'benchmark_team_5_9':   'https://buy.stripe.com/cNi8wR7eKg2r6ja4hG2Ji0C',
    'benchmark_team_10_19': 'https://buy.stripe.com/28EeVf56C7vVePG9C02Ji0D',
    'benchmark_team_20_plus':'https://buy.stripe.com/28E9AV0Qm7vVazq15u2Ji0E',
    // Employer-commissioned (EA Manager Edition)
    'ea_manager_standard':null,
    'ea_manager_senior':  null,
    // Employer-commissioned (Private PA) — coming soon, not yet sellable
    'private_pa_l1':      null,
    'private_pa_l2':      null,
    // Employer-commissioned (Chief of Staff)
    'chief_of_staff':     null,
    // Add-on (applied at checkout, not a standalone button)
    'tcs_match':          null,
    'rush_turnaround':    null
  };

  // Product labels shown in the modal's continue button
  var TCS_PRODUCT_LABELS = {
    'ea_certified_l1':    'EA Certified Level 1',
    'ea_certified_l2':    'EA Certified Level 2',
    'ea_certified_l3':    'EA Certified Level 3',
    'ppa_certified_l1':   'Private PA Certified Level 1',
    'ppa_certified_l2':   'Senior Private PA Certified',
    'cos_certified':      'Chief of Staff Certified',
    'ea_hire_operational':'Operational EA Assessment',
    'ea_hire_director':   'Director EA Assessment',
    'ea_hire_csuite':     'C-Suite EA Assessment',
    'benchmark_team_1_4':   'Benchmark Your Team (1–4)',
    'benchmark_team_5_9':   'Benchmark Your Team (5–9)',
    'benchmark_team_10_19': 'Benchmark Your Team (10–19)',
    'benchmark_team_20_plus':'Benchmark Your Team (20+)',
    'ea_manager_standard':'EA Manager Edition: Standard',
    'ea_manager_senior':  'EA Manager Edition: Senior/Lead',
    'private_pa_l1':      'Private PA Assessment',
    'private_pa_l2':      'Senior Private PA Assessment',
    'chief_of_staff':     'Chief of Staff Assessment',
    'tcs_match':          'TCS Match Overlay',
    'rush_turnaround':    'Rush Turnaround'
  };

  // For each button carrying data-checkout-key, resolve the URL from the map.
  // If a URL is available, upgrade the button's href and arm the modal.
  // If null, leave the button's existing href alone (the early-list mailto).
  document.querySelectorAll('[data-checkout-key]').forEach(function(btn) {
    var key = btn.getAttribute('data-checkout-key');
    var url = TCS_STRIPE_URLS[key];
    if (url) {
      btn.setAttribute('data-checkout-url', url);
      btn.setAttribute('data-checkout-label', TCS_PRODUCT_LABELS[key] || '');
      btn.setAttribute('href', url);
      btn.setAttribute('target', '_blank');
      btn.setAttribute('rel', 'noopener');
    }
    // else leave the button's default mailto href alone
  });

  // PRE-CHECKOUT MODAL (Stripe gate)
  var stripeButtons = document.querySelectorAll('[data-checkout-url]');
  if (stripeButtons.length) {
    var modalHTML = '<div id="tcsCheckoutModal" class="tcs-modal" role="dialog" aria-modal="true" aria-labelledby="tcsModalTitle" aria-hidden="true">'
      + '<div class="tcs-modal-backdrop" data-close="true" aria-hidden="true"></div>'
      + '<div class="tcs-modal-panel">'
      + '<button class="tcs-modal-close" type="button" aria-label="Close" data-close="true">\u00D7</button>'
      + '<div class="tcs-modal-eyebrow">Before you continue to payment</div>'
      + '<h2 id="tcsModalTitle">A few things to confirm.</h2>'
      + '<div class="tcs-modal-section"><h3>What you will receive</h3><ul id="tcsModalReceive"></ul></div>'
      + '<div class="tcs-modal-section"><h3>How the simulation works</h3><ul>'
      + '<li>Between 60 and 90 minutes, depending on the level, completed in one sitting</li>'
      + '<li>Timed: the clock does not stop once it begins, and it cannot be paused and resumed</li>'
      + '<li>The assessment link is issued within the hour and expires 14 days after issue</li>'
      + '<li>Results delivered within 48 hours of submission</li>'
      + '</ul></div>'
      + '<div class="tcs-modal-section tcs-modal-upsell" id="tcsModalUpsell"><h3 style="color:var(--orange);">\u2606 Available at checkout</h3><p class="tcs-modal-note"><strong>Priority turnaround.</strong> On the Stripe checkout page you will see the option to add Priority Turnaround for &pound;150 +VAT. Your report is reviewed ahead of the standard queue and delivered within 24 hours of submission, instead of 48. Useful for live shortlists and interview cycles. Optional and skippable.</p></div>'
      + '<div class="tcs-modal-section"><p class="tcs-modal-note"><strong>Need extra time?</strong> Candidates who need a +25% accommodation for neurodivergence, disability, or a medical reason can <a href="mailto:hello@thecorestandard.co.uk?subject=TCS%20Certified%20accommodation%20request">request it here</a> before continuing. Self-certified, no diagnosis required.</p></div>'
      + '<label class="tcs-modal-agree" for="tcsModalAgree"><input type="checkbox" id="tcsModalAgree"><span>I agree to the <a href="terms.html" target="_blank" rel="noopener">Terms of Service</a> and <a href="privacy.html" target="_blank" rel="noopener">Privacy Notice</a>. I ask for my assessment access to be issued straight away, and I understand I lose the right to cancel once it has been issued.</span></label>'
      + '<div class="tcs-modal-offer" style="margin-top:6px;padding:10px 14px;background:rgba(235,100,30,0.08);border:1px dashed rgba(235,100,30,0.45);border-radius:6px;font-size:12.5px;color:var(--rich-black,#0F0800);text-align:center;">\u2726 Launch offer: enter code <strong style="color:var(--orange,#EB641E);letter-spacing:0.05em;">LAUNCH10</strong> at the Stripe checkout for 10% off.</div>'
      + '<div class="tcs-modal-cta"><button type="button" class="btn btn-ghost" data-close="true">Cancel</button><a href="#" id="tcsModalContinue" class="btn btn-orange" target="_blank" rel="noopener" aria-disabled="true">Continue to payment \u2192</a></div>'
      + '</div></div>';

    document.body.insertAdjacentHTML('beforeend', modalHTML);

    var modal = document.getElementById('tcsCheckoutModal');
    var modalContinue = document.getElementById('tcsModalContinue');
    var modalAgree = document.getElementById('tcsModalAgree');
    var modalReceive = document.getElementById('tcsModalReceive');
    var modalUpsell = document.getElementById('tcsModalUpsell');

    // Employer purchases receive a hiring report; candidate (Certified) purchases own a credential.
    var RECEIVE_EMPLOYER = '<li>An independent, expert-reviewed competency report on your candidate, scored 0 to 100 across the four pillars</li>'
      + '<li>A clear reviewer recommendation, plus notes on strengths, risk factors, and where to probe further</li>'
      + '<li>Delivered to your inbox within 48 hours of the candidate\u2019s submission</li>';
    var RECEIVE_CANDIDATE = '<li>A full expert-reviewed competency report, scored against every level of the standard</li>'
      + '<li>Your Recruiter Summary and verified digital badge</li>'
      + '<li>Your signed certificate, with a unique verifier URL employers can check</li>';
    var RECEIVE_BENCHMARK = '<li>An expert-reviewed report on every EA you assess, scored 0 to 100 across the four pillars</li>'
      + '<li>A team report tailored to you: the whole team on one benchmark, with where each person sits and where to develop next</li>'
      + '<li>A 30-minute debrief with Lily, and each EA’s own report to keep</li>';

    var openCheckoutModal = function(url, label, key) {
      key = key || '';
      var isCandidate = key.indexOf('certified') !== -1;
      var isBenchmark = key.indexOf('benchmark') !== -1;
      var isEaHire = key.indexOf('ea_hire') !== -1;
      if (modalReceive) modalReceive.innerHTML = isCandidate ? RECEIVE_CANDIDATE : (isBenchmark ? RECEIVE_BENCHMARK : RECEIVE_EMPLOYER);
      // Priority Turnaround is only set up on EA Hire, so only offer it there.
      if (modalUpsell) modalUpsell.style.display = isEaHire ? '' : 'none';
      modalContinue.setAttribute('href', url);
      modalContinue.setAttribute('aria-disabled', 'true');
      modalAgree.checked = false;
      modalContinue.textContent = label ? 'Continue to payment for ' + label + ' \u2192' : 'Continue to payment \u2192';
      modal.classList.add('open');
      modal.setAttribute('aria-hidden', 'false');
      document.body.style.overflow = 'hidden';
    };

    var closeCheckoutModal = function() {
      modal.classList.remove('open');
      modal.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
    };

    stripeButtons.forEach(function(btn) {
      btn.addEventListener('click', function(e) {
        e.preventDefault();
        var url = btn.getAttribute('data-checkout-url');
        var label = btn.getAttribute('data-checkout-label') || '';
        var key = btn.getAttribute('data-checkout-key') || '';
        if (url) openCheckoutModal(url, label, key);
      });
    });

    modalAgree.addEventListener('change', function() {
      modalContinue.setAttribute('aria-disabled', this.checked ? 'false' : 'true');
    });

    modalContinue.addEventListener('click', function(e) {
      if (!modalAgree.checked) { e.preventDefault(); return false; }
      setTimeout(closeCheckoutModal, 200);
    });

    modal.querySelectorAll('[data-close]').forEach(function(el) {
      el.addEventListener('click', closeCheckoutModal);
    });

    document.addEventListener('keydown', function(e) {
      if (e.key === 'Escape' && modal.classList.contains('open')) closeCheckoutModal();
    });
  }

})();

/* ============================================================
   Editorial index (.dim-index) entrance choreography.
   Supports any number of instances per page. Exposes
   window.__setDimAll(p) so render tooling can drive it directly.
   ============================================================ */
(function(){
  var idxs = [].slice.call(document.querySelectorAll('.dim-index'));
  if (!idxs.length) return;
  function clamp(x){ return x<0?0:x>1?1:x; }
  function ease(t){ return 1-Math.pow(1-t,3); }

  var instances = idxs.map(function(idx){
    return {
      lead: idx.querySelector('.dim-lead'),
      list: idx.querySelector('.dim-list'),
      rows: [].slice.call(idx.querySelectorAll('.dim-row')),
      set: function(p){
        var dl=ease(clamp(p/0.7));
        if(this.lead){ this.lead.style.opacity=dl; this.lead.style.transform='translateY('+((1-dl)*48).toFixed(2)+'px)'; }
        var ll=ease(clamp((p-0.15)/0.7));
        if(this.list){ var narrow = (window.innerWidth || 1200) <= 860; this.list.style.opacity=ll; this.list.style.transform = narrow ? ('translateY('+((1-ll)*32).toFixed(2)+'px)') : ('translateX('+((1-ll)*72).toFixed(2)+'px)'); }
        this.rows.forEach(function(r,i){
          var rp=ease(clamp((p-0.32-i*0.11)/0.5));
          r.style.opacity=rp; r.style.transform='translateY('+((1-rp)*28).toFixed(2)+'px)';
        });
      }
    };
  });

  window.__setDimAll = function(p){ instances.forEach(function(it){ it.set(p); }); };
  window.__setDim = window.__setDimAll; /* back-compat alias */

  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  if (reduce){ window.__setDimAll(1); return; }
  window.__setDimAll(0);
  if (window.__DIM_MANUAL) return;

  idxs.forEach(function(idx, n){
    var it = instances[n], started=false;
    var io = new IntersectionObserver(function(es){
      es.forEach(function(e){
        if (e.isIntersecting && !started){
          started=true;
          var t0=performance.now(), dur=1400;
          (function loop(now){ var p=clamp((now-t0)/dur); it.set(p); if(p<1) requestAnimationFrame(loop); })(t0);
          io.disconnect();
        }
      });
    }, {threshold:0.2});
    io.observe(idx);
  });
})();

/* ============================================================
   Studio interaction layer: scroll progress + magnetic buttons
   ============================================================ */
(function(){
  var reduce = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  // scroll progress bar
  var bar = document.createElement('div');
  bar.id = 'tcs-progress';
  document.body.appendChild(bar);
  var barTick = false;
  function updateBar(){
    var h = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (h > 0 ? Math.min(100, (window.scrollY / h) * 100) : 0) + '%';
    barTick = false;
  }
  window.addEventListener('scroll', function(){ if(!barTick){ barTick = true; requestAnimationFrame(updateBar); } }, {passive:true});
  updateBar();

  if (reduce) return;

  // magnetic pull on primary buttons
  var mags = [].slice.call(document.querySelectorAll('.btn-orange, .btn-primary, .nav-cta'));
  mags.forEach(function(btn){
    btn.addEventListener('mousemove', function(e){
      var r = btn.getBoundingClientRect();
      var mx = e.clientX - r.left - r.width/2;
      var my = e.clientY - r.top - r.height/2;
      btn.style.transform = 'translate(' + (mx*0.16).toFixed(1) + 'px,' + (my*0.30).toFixed(1) + 'px)';
    });
    btn.addEventListener('mouseleave', function(){ btn.style.transform = ''; });
  });
})();

/* ============================================================
   FORMS — one Formspree endpoint for every form on the site.
   Progressive enhancement: AJAX submit with inline success/error,
   spam honeypot, and a per-form "form" label so submissions are
   easy to tell apart in the Formspree inbox. Set the endpoint in
   window.TCS_FORM_ENDPOINT near the top of this file.
   ============================================================ */
(function(){
  var forms = [].slice.call(document.querySelectorAll('form[data-form]'));
  if (!forms.length) return;
  var endpoint = window.TCS_FORM_ENDPOINT || '';
  var configured = endpoint && endpoint.indexOf('YOUR_FORM_ID') === -1;

  function ensureHidden(form, name, value){
    if (form.querySelector('[name="' + name + '"]')) return;
    var i = document.createElement('input');
    i.type = (name === '_gotcha') ? 'text' : 'hidden';
    if (name === '_gotcha') { i.style.cssText = 'position:absolute;left:-9999px;opacity:0;height:0;width:0;'; i.tabIndex = -1; i.setAttribute('autocomplete','off'); i.setAttribute('aria-hidden','true'); }
    i.name = name; i.value = value;
    form.appendChild(i);
  }

  function message(form, text, ok){
    var box = form.querySelector('.tcs-form-msg');
    if (!box){ box = document.createElement('p'); box.className = 'tcs-form-msg'; box.setAttribute('role','status'); box.style.cssText = 'margin-top:12px;font-size:13px;font-weight:500;line-height:1.5;'; form.appendChild(box); }
    box.style.color = ok ? '#5bbf8a' : '#e0552b';
    box.innerHTML = text;
  }

  function succeed(form){
    var custom = form.getAttribute('data-success');
    var text = custom || 'Thank you — we’ve got your details and will be in touch. In the meantime, keep an eye on your inbox.';
    // hide the interactive fields, leave the confirmation
    [].slice.call(form.children).forEach(function(el){
      if (el.classList && el.classList.contains('tcs-form-msg')) return;
      el.style.display = 'none';
    });
    message(form, text, true);
  }

  forms.forEach(function(form){
    var key = form.getAttribute('data-form') || 'form';
    if (configured) form.setAttribute('action', endpoint);
    form.setAttribute('method', 'POST');
    ensureHidden(form, 'form', key);
    ensureHidden(form, '_subject', 'TCS website: ' + key);
    ensureHidden(form, '_gotcha', '');
    form.removeAttribute('onsubmit');

    form.addEventListener('submit', function(e){
      e.preventDefault();
      if (form.querySelector('[name="_gotcha"]') && form.querySelector('[name="_gotcha"]').value) return; // bot
      if (!configured){
        message(form, 'This form isn’t connected yet. Please email <a href="mailto:hello@thecorestandard.co.uk" style="color:#EB641E;">hello@thecorestandard.co.uk</a> and we’ll help.', false);
        return;
      }
      var btn = form.querySelector('[type="submit"]');
      var orig = btn ? btn.innerHTML : '';
      if (btn){ btn.disabled = true; btn.innerHTML = 'Sending…'; }
      fetch(endpoint, { method:'POST', body:new FormData(form), headers:{ 'Accept':'application/json' } })
        .then(function(r){
          if (r.ok){ succeed(form); return; }
          return r.json().then(function(d){
            var m = (d && d.errors && d.errors[0] && d.errors[0].message) || 'Something went wrong. Please email hello@thecorestandard.co.uk.';
            message(form, m, false);
          }).catch(function(){ message(form, 'Something went wrong. Please email hello@thecorestandard.co.uk.', false); });
        })
        .catch(function(){ message(form, 'Network error — please email <a href="mailto:hello@thecorestandard.co.uk" style="color:#EB641E;">hello@thecorestandard.co.uk</a>.', false); })
        .then(function(){ if (btn){ btn.disabled = false; btn.innerHTML = orig; } });
    });
  });
})();
