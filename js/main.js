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

  // Workshop Form
  const form = document.getElementById('workshopForm');
  if (form) {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      const name = document.getElementById('fname').value;
      const phone = document.getElementById('fphone').value;
      const email = document.getElementById('femail').value;
      const gender = document.getElementById('fgender').value;
      const batch = document.getElementById('fbatch').value;

      // Show success
      document.getElementById('formContainer').style.display = 'none';
      document.getElementById('formSuccess').classList.add('show');

      // Open WhatsApp with pre-filled message
      const msg = encodeURIComponent(`Hi Sneha! I'd like to book a free trial class.\n\nName: ${name}\nPhone: ${phone}\nPreferred batch: ${batch}\nEmail: ${email}`);
      setTimeout(() => {
        window.open(`https://wa.me/919560003507?text=${msg}`, '_blank');
      }, 1500);
    });
  }

});
