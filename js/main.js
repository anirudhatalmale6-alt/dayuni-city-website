/* ============================================
   DAYUNI CITY — Main JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Page Loader ----
  const loader = document.getElementById('pageLoader');
  window.addEventListener('load', () => {
    setTimeout(() => loader.classList.add('hidden'), 800);
  });

  // ---- Navigation ----
  const nav = document.getElementById('mainNav');
  const navToggle = document.getElementById('navToggle');
  const navLinks = document.getElementById('navLinks');
  const navLinksList = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    nav.classList.toggle('scrolled', window.scrollY > 50);
  });

  navToggle.addEventListener('click', () => {
    navToggle.classList.toggle('active');
    navLinks.classList.toggle('open');
  });

  navLinksList.forEach(link => {
    link.addEventListener('click', () => {
      navToggle.classList.remove('active');
      navLinks.classList.remove('open');
    });
  });

  // Active nav link on scroll
  const sections = document.querySelectorAll('section[id]');
  function updateActiveNav() {
    const scrollY = window.scrollY + 150;
    sections.forEach(section => {
      const top = section.offsetTop;
      const height = section.offsetHeight;
      const id = section.getAttribute('id');
      const link = document.querySelector(`.nav-link[data-section="${id}"]`);
      if (link) {
        link.classList.toggle('active', scrollY >= top && scrollY < top + height);
      }
    });
  }
  window.addEventListener('scroll', updateActiveNav);

  // ---- Reveal on Scroll ----
  const reveals = document.querySelectorAll('.reveal');
  const revealObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        entry.target.classList.add('visible');
        revealObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });

  reveals.forEach(el => revealObserver.observe(el));

  // ---- Counter Animation ----
  const counters = document.querySelectorAll('.stat-number[data-count]');
  const counterObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        animateCounter(entry.target);
        counterObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  counters.forEach(el => counterObserver.observe(el));

  function animateCounter(el) {
    const target = parseInt(el.dataset.count);
    const duration = 2000;
    const start = performance.now();

    function update(now) {
      const elapsed = now - start;
      const progress = Math.min(elapsed / duration, 1);
      const eased = 1 - Math.pow(1 - progress, 3);
      el.textContent = Math.round(target * eased);
      if (progress < 1) requestAnimationFrame(update);
    }
    requestAnimationFrame(update);
  }

  // ---- Product Filters ----
  const filterBtns = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

  filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      filterBtns.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.dataset.filter;
      productCards.forEach(card => {
        if (filter === 'semua' || card.dataset.category === filter) {
          card.classList.remove('hidden');
          card.style.animation = 'fadeUp 0.5s ease forwards';
        } else {
          card.classList.add('hidden');
        }
      });
    });
  });

  // ---- Testimonials ----
  const defaultTestimonials = [
    {
      text: 'Suka sekali belanja di Dayuni City! Produknya benar-benar elegan dan detailnya sangat feminin, persis seperti yang saya cari. Kemasannya juga rapi dan cantik dengan sentuhan botani yang khas.',
      author: 'Amanda P.',
      role: 'Pelanggan',
      stars: 5
    },
    {
      text: 'Pelayanan dari Kak Yuni Rhosita sangat ramah dan responsif. Pengiriman cepat dan kualitas produknya melampaui ekspektasi saya. Pasti akan jadi langganan tetap di sini!',
      author: 'Citra K.',
      role: 'Pelanggan',
      stars: 5
    },
    {
      text: 'Mencari online shop yang tepercaya dan punya selera style yang elegan itu tidak mudah, sampai akhirnya saya menemukan Dayuni City. Benar-benar puas dengan pembelian pertama saya!',
      author: 'Dian S.',
      role: 'Pelanggan',
      stars: 5
    }
  ];

  let testimonials = JSON.parse(localStorage.getItem('dayuni_testimonials')) || defaultTestimonials;
  let currentSlide = 0;

  const track = document.getElementById('testimonialsTrack');
  const dotsContainer = document.getElementById('carouselDots');
  const prevBtn = document.getElementById('prevTestimonial');
  const nextBtn = document.getElementById('nextTestimonial');

  function renderTestimonials() {
    track.innerHTML = testimonials.map(t => `
      <div class="testimonial-card">
        <div class="testimonial-inner">
          <div class="testimonial-stars">
            ${Array(t.stars).fill('<svg viewBox="0 0 24 24"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>').join('')}
          </div>
          <p class="testimonial-text">${t.text}</p>
          <div class="testimonial-author">${t.author}</div>
          <div class="testimonial-role">${t.role}</div>
        </div>
      </div>
    `).join('');

    dotsContainer.innerHTML = testimonials.map((_, i) =>
      `<button class="carousel-dot ${i === 0 ? 'active' : ''}" data-index="${i}" aria-label="Slide ${i + 1}"></button>`
    ).join('');

    dotsContainer.querySelectorAll('.carousel-dot').forEach(dot => {
      dot.addEventListener('click', () => goToSlide(parseInt(dot.dataset.index)));
    });

    currentSlide = 0;
    updateCarousel();
  }

  function goToSlide(index) {
    currentSlide = index;
    updateCarousel();
  }

  function updateCarousel() {
    track.style.transform = `translateX(-${currentSlide * 100}%)`;
    dotsContainer.querySelectorAll('.carousel-dot').forEach((dot, i) => {
      dot.classList.toggle('active', i === currentSlide);
    });
  }

  prevBtn.addEventListener('click', () => {
    currentSlide = currentSlide > 0 ? currentSlide - 1 : testimonials.length - 1;
    updateCarousel();
  });

  nextBtn.addEventListener('click', () => {
    currentSlide = currentSlide < testimonials.length - 1 ? currentSlide + 1 : 0;
    updateCarousel();
  });

  // Auto-rotate
  let autoRotate = setInterval(() => {
    currentSlide = currentSlide < testimonials.length - 1 ? currentSlide + 1 : 0;
    updateCarousel();
  }, 6000);

  track.parentElement.addEventListener('mouseenter', () => clearInterval(autoRotate));
  track.parentElement.addEventListener('mouseleave', () => {
    autoRotate = setInterval(() => {
      currentSlide = currentSlide < testimonials.length - 1 ? currentSlide + 1 : 0;
      updateCarousel();
    }, 6000);
  });

  renderTestimonials();

  // ---- Contact Form ----
  const contactForm = document.getElementById('contactForm');
  const formStatus = document.getElementById('formStatus');

  contactForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const formData = new FormData(contactForm);
    const data = Object.fromEntries(formData);

    // Store messages locally (can be connected to email service later)
    const messages = JSON.parse(localStorage.getItem('dayuni_messages')) || [];
    messages.push({
      ...data,
      date: new Date().toISOString()
    });
    localStorage.setItem('dayuni_messages', JSON.stringify(messages));

    formStatus.textContent = 'Pesan berhasil terkirim! Kami akan segera merespons.';
    formStatus.className = 'form-status success';
    contactForm.reset();

    setTimeout(() => {
      formStatus.textContent = '';
      formStatus.className = 'form-status';
    }, 5000);
  });

  // ---- Back to Top ----
  const backToTop = document.getElementById('backToTop');

  window.addEventListener('scroll', () => {
    backToTop.classList.toggle('visible', window.scrollY > 500);
  });

  backToTop.addEventListener('click', () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });

  // ---- Touch Swipe for Testimonials ----
  let touchStartX = 0;
  let touchEndX = 0;

  track.addEventListener('touchstart', (e) => {
    touchStartX = e.changedTouches[0].screenX;
  }, { passive: true });

  track.addEventListener('touchend', (e) => {
    touchEndX = e.changedTouches[0].screenX;
    const diff = touchStartX - touchEndX;
    if (Math.abs(diff) > 50) {
      if (diff > 0) {
        currentSlide = currentSlide < testimonials.length - 1 ? currentSlide + 1 : 0;
      } else {
        currentSlide = currentSlide > 0 ? currentSlide - 1 : testimonials.length - 1;
      }
      updateCarousel();
    }
  }, { passive: true });

});
