// Google Analytics 4 + custom events. No-op until UWS_CONFIG.gaMeasurementId is set.
// Never send personal data (name, phone, email) to GA: only non-identifying labels.
(function () {
  const id = (window.UWS_CONFIG || {}).gaMeasurementId;
  window.dataLayer = window.dataLayer || [];
  window.gtag = function () { window.dataLayer.push(arguments); };

  // Safe tracker the rest of the site calls; does nothing when GA is off.
  window.uwsTrack = function (name, params) {
    if (id) window.gtag('event', name, params || {});
  };
  if (!id) return;

  const s = document.createElement('script');
  s.async = true;
  s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(id);
  document.head.appendChild(s);
  window.gtag('js', new Date());
  window.gtag('config', id);

  document.addEventListener('DOMContentLoaded', () => {
    const track = window.uwsTrack;

    // Which sections people actually reach (once per page view)
    const seen = new Set();
    if ('IntersectionObserver' in window) {
      const io = new IntersectionObserver((entries) => {
        entries.forEach((e) => {
          const name = e.target.id || e.target.className.split(' ')[0];
          if (e.isIntersecting && !seen.has(name)) {
            seen.add(name);
            track('section_view', { section: name });
          }
        });
      }, { threshold: 0.4 });
      document.querySelectorAll('section').forEach((sec) => io.observe(sec));
    }

    // Clicks on WhatsApp buttons and on "book a trial" buttons, labelled by where they are on the page
    document.addEventListener('click', (ev) => {
      const a = ev.target.closest('a');
      if (!a) return;
      const box = a.closest('section, footer, nav, .mobile-menu');
      const where = a.classList.contains('wa-float') ? 'floating_button' : (box ? (box.id || box.classList[0]) : 'page');
      const label = a.textContent.trim().slice(0, 60) || a.getAttribute('aria-label') || '';
      if (a.href.includes('wa.me/')) track('whatsapp_click', { location: where, label });
      else if (a.getAttribute('href') === '#workshop') track('book_trial_cta_click', { location: where, label });
    });

    // Form engagement: started (first field touched); submit is tracked in main.js
    const form = document.getElementById('workshopForm');
    if (form) form.addEventListener('focusin', () => track('form_start', { form: 'free_trial' }), { once: true });

    // Voice-note testimonial and online-class video
    const audio = document.querySelector('.voice-player audio');
    if (audio) {
      audio.addEventListener('play', () => track('voice_note_play', { testimonial: 'first_student' }), { once: true });
      audio.addEventListener('ended', () => track('voice_note_complete', { testimonial: 'first_student' }), { once: true });
    }
    document.querySelectorAll('.faq-item').forEach((d) => {
      d.addEventListener('toggle', () => { if (d.open) track('faq_open', { question: d.querySelector('summary').textContent.trim() }); });
    });
  });
})();
