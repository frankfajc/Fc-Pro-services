// Navbar scroll effect
const nav = document.getElementById('nav');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', window.scrollY > 50);
});

// Mobile menu toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');
navToggle.addEventListener('click', () => {
  navLinks.classList.toggle('active');
});
navLinks.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => navLinks.classList.remove('active'));
});

// Smooth scroll for anchor links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function(e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  });
});

// Contact form handler
async function handleSubmit(e) {
  e.preventDefault();
  const form = e.target;
  const btn = form.querySelector('.form-submit');
  const originalText = btn.textContent;

  btn.textContent = 'Sending...';
  btn.disabled = true;

  const data = {
    fname:   form.fname.value,
    lname:   form.lname.value,
    email:   form.email.value,
    phone:   form.phone.value,
    service: form.service.value,
    message: form.message.value,
  };

  try {
    const res = await fetch('/api/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });

    if (res.ok) {
      btn.textContent = 'Request Sent!';
      btn.style.background = '#16a34a';
      form.reset();
    } else {
      btn.textContent = 'Error — Try Again';
      btn.style.background = '#dc2626';
    }
  } catch {
    btn.textContent = 'Error — Try Again';
    btn.style.background = '#dc2626';
  }

  setTimeout(() => {
    btn.textContent = originalText;
    btn.style.background = '';
    btn.disabled = false;
  }, 4000);
}

// Animate elements on scroll
const observerOptions = { threshold: 0.15 };
const observer = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

document.querySelectorAll('.service-card, .sector-card, .why-feature, .project-card').forEach(el => {
  el.style.opacity = '0';
  el.style.transform = 'translateY(20px)';
  el.style.transition = 'all 0.6s ease';
  observer.observe(el);
});

// Testimonials Carousel
(function () {
  const track    = document.getElementById('carTrack');
  const viewport = document.getElementById('carViewport');
  const btnPrev  = document.getElementById('carPrev');
  const btnNext  = document.getElementById('carNext');
  const dotsWrap = document.getElementById('carDots');
  if (!track) return;

  const cards  = Array.from(track.querySelectorAll('.testimonial-card'));
  const GAP    = 24;
  let current  = 0;
  let autoTimer;

  function visible() { return window.innerWidth < 768 ? 1 : 3; }

  function setWidths() {
    const vc = visible();
    const w  = (viewport.offsetWidth - GAP * (vc - 1)) / vc;
    cards.forEach(c => c.style.width = w + 'px');
  }

  function maxIndex() { return cards.length - visible(); }

  function buildDots() {
    dotsWrap.innerHTML = '';
    const total = maxIndex() + 1;
    for (let i = 0; i < total; i++) {
      const d = document.createElement('button');
      d.className = 'car-dot' + (i === 0 ? ' active' : '');
      d.addEventListener('click', () => goTo(i));
      dotsWrap.appendChild(d);
    }
  }

  function updateDots() {
    dotsWrap.querySelectorAll('.car-dot').forEach((d, i) =>
      d.classList.toggle('active', i === current));
  }

  function goTo(index) {
    const vc = visible();
    current = Math.max(0, Math.min(index, maxIndex()));
    const cardW = (viewport.offsetWidth - GAP * (vc - 1)) / vc;
    track.style.transform = `translateX(-${current * (cardW + GAP)}px)`;
    btnPrev.disabled = current === 0;
    btnNext.disabled = current === maxIndex();
    updateDots();
  }

  function startAuto() {
    autoTimer = setInterval(() => {
      goTo(current >= maxIndex() ? 0 : current + 1);
    }, 4000);
  }

  function resetAuto() {
    clearInterval(autoTimer);
    startAuto();
  }

  btnPrev.addEventListener('click', () => { goTo(current - 1); resetAuto(); });
  btnNext.addEventListener('click', () => { goTo(current + 1); resetAuto(); });
  viewport.addEventListener('mouseenter', () => clearInterval(autoTimer));
  viewport.addEventListener('mouseleave', startAuto);

  // Touch swipe
  let touchStartX = 0;
  viewport.addEventListener('touchstart', e => { touchStartX = e.touches[0].clientX; }, { passive: true });
  viewport.addEventListener('touchend', e => {
    const diff = touchStartX - e.changedTouches[0].clientX;
    if (Math.abs(diff) > 50) { goTo(diff > 0 ? current + 1 : current - 1); resetAuto(); }
  });

  window.addEventListener('resize', () => { setWidths(); buildDots(); goTo(current); });

  setWidths();
  buildDots();
  goTo(0);
  startAuto();
})();
