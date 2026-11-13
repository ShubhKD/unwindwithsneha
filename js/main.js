document.addEventListener('DOMContentLoaded', () => {

  // Sticky Nav
  const nav = document.getElementById('nav');
  window.addEventListener('scroll', () => nav.classList.toggle('scrolled', window.scrollY > 50));

  // Mobile Menu
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobileMenu');
  const mobileOverlay = document.getElementById('mobileOverlay');
  const mobileClose = document.getElementById('mobileClose');

  function openMenu() { mobileMenu.classList.add('open'); mobileOverlay.classList.add('open'); document.body.style.overflow = 'hidden'; }
  function closeMenu() { mobileMenu.classList.remove('open'); mobileOverlay.classList.remove('open'); document.body.style.overflow = ''; }

  hamburger.addEventListener('click', openMenu);
  mobileClose.addEventListener('click', closeMenu);
  mobileOverlay.addEventListener('click', closeMenu);
  mobileMenu.querySelectorAll('a').forEach(a => a.addEventListener('click', closeMenu));

  // FAQ single-open
  document.querySelectorAll('.faq-item').forEach(d => {
    d.addEventListener('toggle', () => {
      if (d.open) document.querySelectorAll('.faq-item[open]').forEach(o => { if (o !== d) o.removeAttribute('open'); });
    });
  });

  // Proof Wall
  const proofWall = document.getElementById('proofWall');
  if (proofWall) {
    const imgs = [
      'testimonial-18.47.15.jpg','testimonial-18.47.15-1.jpg','testimonial-18.47.15-2.jpg',
      'testimonial-18.47.16.jpg','testimonial-18.47.16-1.jpg','testimonial-18.47.16-2.jpg',
      'testimonial-18.47.17.jpg','testimonial-18.47.17-1.jpg','testimonial-18.47.17-2.jpg',
      'testimonial-18.47.18.jpg','testimonial-18.47.18-1.jpg','testimonial-18.47.18-2.jpg',
      'testimonial-18.47.19.jpg','testimonial-18.47.19-2.jpg',
      'testimonial-18.47.20.jpg','testimonial-18.47.20-1.jpg','testimonial-18.47.20-2.jpg',
      'testimonial-18.47.21.jpg','testimonial-18.47.21-1.jpg','testimonial-18.47.21-2.jpg',
      'testimonial-18.47.22.jpg','testimonial-18.47.22-1.jpg','testimonial-18.47.22-2.jpg',
      'testimonial-18.47.23.jpg','testimonial-18.47.23-1.jpg','testimonial-18.47.23-2.jpg',
      'testimonial-18.47.24.jpg','testimonial-18.47.24-1.jpg','testimonial-18.47.24-2.jpg',
      'testimonial-18.47.25.jpg'
    ];
    imgs.forEach(f => {
      const img = document.createElement('img');
      img.src = `images/testimonials/${f}`;
      img.alt = 'Student testimonial';
      img.loading = 'lazy';
      img.onerror = function() { this.style.display = 'none'; };
      proofWall.appendChild(img);
    });

    // Auto-scroll
    let paused = false;
    proofWall.addEventListener('mouseenter', () => paused = true);
    proofWall.addEventListener('mouseleave', () => paused = false);
    proofWall.addEventListener('touchstart', () => paused = true, { passive: true });
    proofWall.addEventListener('touchend', () => setTimeout(() => paused = false, 3000));
    setInterval(() => {
      if (!paused && proofWall.scrollWidth > proofWall.clientWidth) {
        proofWall.scrollLeft += 1;
        if (proofWall.scrollLeft >= proofWall.scrollWidth - proofWall.clientWidth) proofWall.scrollLeft = 0;
      }
    }, 30);
  }

  // Online class clip: play only while on screen; respect reduced motion
  const onlineVideo = document.querySelector('.online-video video');
  if (onlineVideo) {
    const reduceMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (reduceMotion) {
      onlineVideo.removeAttribute('autoplay');
      onlineVideo.pause();
      onlineVideo.controls = true;
    } else if ('IntersectionObserver' in window) {
      new IntersectionObserver(([entry]) => {
        if (entry.isIntersecting) onlineVideo.play().catch(() => { onlineVideo.controls = true; });
        else onlineVideo.pause();
      }, { threshold: 0.25 }).observe(onlineVideo);
    }
  }

  // Workshop Form
  const form = document.getElementById('workshopForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const val = (id) => document.getElementById(id).value.trim();
      const lead = {
        name: val('fname'),
        phone: val('fphone'),
        gender: val('fgender'),
        batch: val('fbatch'),
        email: val('femail'),
        website: val('fwebsite'), // honeypot: real people leave this empty
        page: location.href,
        referrer: document.referrer
      };

      // 1. Log the booking to the leads sheet first, so it's captured even if they never press Send in WhatsApp.
      //    sendBeacon survives the page switching to WhatsApp; text/plain avoids a CORS preflight to Apps Script.
      const endpoint = (window.UWS_CONFIG || {}).leadsEndpoint;
      if (endpoint && !lead.website) {
        const body = JSON.stringify(lead);
        const sent = navigator.sendBeacon && navigator.sendBeacon(endpoint, new Blob([body], { type: 'text/plain;charset=utf-8' }));
        if (!sent) fetch(endpoint, { method: 'POST', mode: 'no-cors', keepalive: true, headers: { 'Content-Type': 'text/plain;charset=utf-8' }, body }).catch(() => {});
      }
      if (window.uwsTrack) window.uwsTrack('generate_lead', { form: 'free_trial', batch: lead.batch });

      // 2. Pre-filled WhatsApp message to Sneha
      const lines = [`Hi Sneha! I'd like to book a free trial class.`, '', `Name: ${lead.name}`, `Phone: ${lead.phone}`, `Preferred batch: ${lead.batch}`];
      if (lead.gender) lines.push(`Gender: ${lead.gender}`);
      if (lead.email) lines.push(`Email: ${lead.email}`);
      const waUrl = `https://wa.me/919560003507?text=${encodeURIComponent(lines.join('\n'))}`;

      // 3. Show the "one last step" screen with a manual button, then open WhatsApp
      //    straight away (inside the tap) so iPhone Safari doesn't block it.
      document.getElementById('waSendBtn').href = waUrl;
      document.getElementById('formContainer').style.display = 'none';
      document.getElementById('formSuccess').classList.add('show');
      window.open(waUrl, '_blank');
    });
  }

});
