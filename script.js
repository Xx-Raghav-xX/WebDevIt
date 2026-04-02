/* ============================================
   Web Dev It — JavaScript
   ============================================ */

document.addEventListener('DOMContentLoaded', () => {

  // ---- Sticky Navbar ----
  const navbar = document.getElementById('navbar');
  const handleScroll = () => {
    if (window.scrollY > 50) {
      navbar.classList.add('scrolled');
    } else {
      navbar.classList.remove('scrolled');
    }
  };
  window.addEventListener('scroll', handleScroll, { passive: true });

  // ---- Mobile Menu ----
  const hamburger = document.getElementById('hamburger');
  const mobileMenu = document.getElementById('mobile-menu');

  if (hamburger && mobileMenu) {
    hamburger.addEventListener('click', () => {
      hamburger.classList.toggle('active');
      mobileMenu.classList.toggle('active');
      document.body.style.overflow = mobileMenu.classList.contains('active') ? 'hidden' : '';
    });

    // Close menu on link click
    mobileMenu.querySelectorAll('a').forEach(link => {
      link.addEventListener('click', () => {
        hamburger.classList.remove('active');
        mobileMenu.classList.remove('active');
        document.body.style.overflow = '';
      });
    });
  }

  // ---- Scroll Animations (Intersection Observer) ----
  const animatedElements = document.querySelectorAll('.fade-up, .fade-in');

  if (animatedElements.length > 0) {
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    animatedElements.forEach(el => observer.observe(el));
  }

  // ---- Testimonials Carousel ----
  const track = document.getElementById('testimonials-track');
  const prevBtn = document.getElementById('testimonial-prev');
  const nextBtn = document.getElementById('testimonial-next');

  if (track && prevBtn && nextBtn) {
    let scrollAmount = 0;

    const getCardWidth = () => {
      const card = track.querySelector('.testimonial-card');
      if (!card) return 340;
      const style = getComputedStyle(track);
      const gap = parseInt(style.gap) || 24;
      return card.offsetWidth + gap;
    };

    nextBtn.addEventListener('click', () => {
      const cardWidth = getCardWidth();
      const maxScroll = track.scrollWidth - track.offsetWidth;
      scrollAmount = Math.min(scrollAmount + cardWidth, maxScroll);
      track.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    });

    prevBtn.addEventListener('click', () => {
      const cardWidth = getCardWidth();
      scrollAmount = Math.max(scrollAmount - cardWidth, 0);
      track.scrollTo({ left: scrollAmount, behavior: 'smooth' });
    });

    // Sync scroll amount on manual scroll
    track.addEventListener('scroll', () => {
      scrollAmount = track.scrollLeft;
    }, { passive: true });
  }

  // ---- Contact Form ----
  const contactForm = document.getElementById('contact-form');
  const formSuccess = document.getElementById('form-success');

  if (contactForm && formSuccess) {
    contactForm.addEventListener('submit', async (e) => {
      e.preventDefault();

      // Basic validation
      const name = document.getElementById('contact-name');
      const email = document.getElementById('contact-email');
      const message = document.getElementById('contact-message');

      if (!name.value.trim() || !email.value.trim() || !message.value.trim()) {
        return;
      }

      // Submit via Web3Forms API
      const submitBtn = contactForm.querySelector('.form-submit');
      submitBtn.textContent = 'Sending...';
      submitBtn.disabled = true;

      try {
        const formData = new FormData(contactForm);
        const jsonData = Object.fromEntries(formData);

        const response = await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
          body: JSON.stringify(jsonData)
        });

        const result = await response.json();

        if (result.success) {
          contactForm.style.display = 'none';
          formSuccess.classList.add('visible');
        } else {
          throw new Error(result.message || 'Something went wrong');
        }
      } catch (error) {
        submitBtn.textContent = 'Send Message';
        submitBtn.disabled = false;
        alert('Failed to send message. Please try again or contact us directly via email/WhatsApp.');
        console.error('Form submission error:', error);
      }
    });
  }

  // ---- Smooth Scroll for Anchor Links ----
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', (e) => {
      const target = document.querySelector(anchor.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });

  // ---- Active Nav Link Highlighting ----
  const currentPage = window.location.pathname.split('/').pop() || 'index.html';
  document.querySelectorAll('.nav-links a:not(.nav-cta), .mobile-menu a').forEach(link => {
    const href = link.getAttribute('href');
    if (href === currentPage) {
      link.classList.add('active');
    } else {
      link.classList.remove('active');
    }
  });

});
