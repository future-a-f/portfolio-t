/* Basic site JS helpers
 * - Smooth scroll fallback for same-page anchors
 * - Skip-link focus handling for accessibility
 * - Dark mode toggle functionality
 * - Particle animation system
 * - Advanced UI interactions
 */

// Dark mode functionality
function initDarkMode() {
  const themeToggle = document.querySelector('.theme-toggle');
  const body = document.body;
  const html = document.documentElement;
  
  // Check for saved theme preference or default to light mode
  const currentTheme = localStorage.getItem('theme') || 'light';
  if (currentTheme === 'dark') {
    body.classList.add('dark-mode');
    themeToggle.querySelector('span').textContent = '☀️';
  }
  
  // Theme toggle functionality
  if (themeToggle) {
    themeToggle.addEventListener('click', function() {
      body.classList.toggle('dark-mode');
      const isDarkMode = body.classList.contains('dark-mode');
      
      // Update icon
      themeToggle.querySelector('span').textContent = isDarkMode ? '☀️' : '🌙';
      
      // Save preference
      localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
      
      // Add transition effect
      body.style.transition = 'all 0.3s ease';
      setTimeout(() => {
        body.style.transition = '';
      }, 300);
    });
  }
}

// Particle animation system
function initParticles() {
  const particlesContainer = document.querySelector('.particles');
  if (!particlesContainer) return;
  
  const particleCount = 20;
  const particles = [];
  
  for (let i = 0; i < particleCount; i++) {
    createParticle();
  }
  
  function createParticle() {
    const particle = document.createElement('div');
    particle.className = 'particle';
    
    // Random size
    const size = Math.random() * 4 + 2;
    particle.style.width = size + 'px';
    particle.style.height = size + 'px';
    
    // Random position
    particle.style.left = Math.random() * 100 + '%';
    
    // Random animation duration and delay
    const duration = Math.random() * 10 + 10;
    const delay = Math.random() * 10;
    particle.style.animationDuration = duration + 's';
    particle.style.animationDelay = delay + 's';
    
    particlesContainer.appendChild(particle);
    particles.push(particle);
  }
}

// Enhanced skill bar animations
function initSkillBars() {
  const skillBars = document.querySelectorAll('.skill-fill');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const skillFill = entry.target;
        const skillLevel = skillFill.getAttribute('data-skill-level') || '85';
        skillFill.style.width = skillLevel + '%';
        observer.unobserve(skillFill);
      }
    });
  }, { threshold: 0.5 });
  
  skillBars.forEach(bar => observer.observe(bar));
}

// Timeline animations
function initTimeline() {
  const timelineItems = document.querySelectorAll('.timeline-item');
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
      if (entry.isIntersecting) {
        setTimeout(() => {
          entry.target.classList.add('visible');
        }, index * 200);
        observer.unobserve(entry.target);
      }
    });
  }, { threshold: 0.1 });
  
  timelineItems.forEach(item => observer.observe(item));
}

// Floating action button functionality
function initFAB() {
  const fab = document.querySelector('.fab');
  if (!fab) return;
  
  fab.addEventListener('click', function() {
    // Scroll to top or open contact modal
    window.scrollTo({ top: 0, behavior: 'smooth' });
  });
}

// Enhanced micro-interactions
function initMicroInteractions() {
  // Add ripple effect to buttons
  const buttons = document.querySelectorAll('.btn-primary, .btn-secondary');
  
  buttons.forEach(button => {
    button.addEventListener('click', function(e) {
      const ripple = document.createElement('span');
      ripple.className = 'ripple';
      
      const rect = this.getBoundingClientRect();
      const size = Math.max(rect.width, rect.height);
      const x = e.clientX - rect.left - size / 2;
      const y = e.clientY - rect.top - size / 2;
      
      ripple.style.width = ripple.style.height = size + 'px';
      ripple.style.left = x + 'px';
      ripple.style.top = y + 'px';
      
      this.appendChild(ripple);
      
      setTimeout(() => {
        ripple.remove();
      }, 600);
    });
  });
}

// Loading animation
function showLoadingAnimation() {
  const loader = document.createElement('div');
  loader.className = 'page-loader';
  loader.innerHTML = '<div class="loader-spinner"></div>';
  document.body.appendChild(loader);
  
  setTimeout(() => {
    loader.classList.add('fade-out');
    setTimeout(() => {
      loader.remove();
    }, 500);
  }, 1000);
}

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {
  // Show loading animation
  showLoadingAnimation();
  
  // Initialize all features
  initDarkMode();
  initParticles();
  initSkillBars();
  initTimeline();
  initFAB();
  initMicroInteractions();
  
  // Smooth scroll for same-page anchors (fallback for older browsers)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && href.length > 1) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          target.scrollIntoView({ behavior: 'smooth' });
          // Set focus for accessibility
          target.setAttribute('tabindex', '-1');
          target.focus({ preventScroll: true });
          target.removeAttribute('tabindex');
        }
      }
    });
  });

  // Move focus to main when skip link is used
  var skip = document.querySelector('.skip-link');
  if (skip) {
    skip.addEventListener('click', function () {
      var main = document.getElementById('main');
      if (main) {
        main.setAttribute('tabindex', '-1');
        main.focus();
        main.removeAttribute('tabindex');
      }
    });
  }

  // Navigation: off-canvas drawer + auto-hide on scroll
  var nav = document.querySelector('.site-nav');
  var navToggle = document.querySelector('.nav-toggle');
  var navDrawer = document.getElementById('nav-drawer');
  var navOverlay = document.querySelector('.nav-overlay');
  var drawerClose = navDrawer ? navDrawer.querySelector('.drawer-close') : null;

  function openDrawer() {
    navDrawer.classList.add('open');
    navOverlay.classList.add('open');
    navToggle.classList.add('open');
    navToggle.setAttribute('aria-expanded', 'true');
    navDrawer.setAttribute('aria-hidden', 'false');
    document.body.style.overflow = 'hidden';
    if (drawerClose) drawerClose.focus();
  }
  function closeDrawer() {
    navDrawer.classList.remove('open');
    navOverlay.classList.remove('open');
    navToggle.classList.remove('open');
    navToggle.setAttribute('aria-expanded', 'false');
    navDrawer.setAttribute('aria-hidden', 'true');
    document.body.style.overflow = '';
    navToggle.focus();
  }

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', function () {
      if (navDrawer.classList.contains('open')) closeDrawer(); else openDrawer();
    });

    navOverlay.addEventListener('click', closeDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

    navDrawer.querySelectorAll('a').forEach(function (link) {
      link.addEventListener('click', closeDrawer);
    });

    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && navDrawer.classList.contains('open')) {
        closeDrawer();
      }
    });
  }

  // Add scrolled class and auto-hide behavior
  var lastScroll = 0;
  var navHidden = false;
  window.addEventListener('scroll', function () {
    var y = window.scrollY || window.pageYOffset;

    // scrolled shadow/background
    if (y > 10) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }

    // auto-hide on scroll down, show on scroll up
    if (y > lastScroll && y > 120 && !navHidden) {
      nav.classList.add('hidden');
      navHidden = true;
    } else if (y < lastScroll && navHidden) {
      nav.classList.remove('hidden');
      navHidden = false;
    }

    lastScroll = y;
  });

  // Back-to-top button behavior
  var backToTop = document.querySelector('.back-to-top');
  if (backToTop) {
    backToTop.addEventListener('click', function () {
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    window.addEventListener('scroll', function () {
      var y = window.scrollY || window.pageYOffset;
      if (y > 400) {
        backToTop.classList.add('show');
      } else {
        backToTop.classList.remove('show');
      }
    });
  }

  // Reveal-on-scroll using IntersectionObserver
  var reveals = document.querySelectorAll('.reveal');
  if ('IntersectionObserver' in window && reveals.length) {
    var ro = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
          ro.unobserve(entry.target);
        }
      });
    }, { threshold: 0.12 });
    reveals.forEach(function (r) { ro.observe(r); });
  } else {
    reveals.forEach(function (r) { r.classList.add('visible'); });
  }

  // Active nav link updating based on visible section
  var sections = document.querySelectorAll('main > section[id]');
  var navLinks = document.querySelectorAll('.nav-menu a');
  if ('IntersectionObserver' in window && sections.length) {
    var sectionObserver = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = entry.target.getAttribute('id');
        var link = document.querySelector('.nav-menu a[href="#' + id + '"]');
        if (entry.isIntersecting) {
          navLinks.forEach(function (l) { l.classList.remove('active'); l.removeAttribute('aria-current'); });
          if (link) { link.classList.add('active'); link.setAttribute('aria-current','page'); }
        }
      });
    }, { threshold: 0.52 });
    sections.forEach(function (s) { sectionObserver.observe(s); });
  }

  // Simple image lightbox for project thumbnails
  var projectLinks = document.querySelectorAll('.project-card a');
  if (projectLinks.length) {
    var lb = document.createElement('div');
    lb.className = 'lightbox';
    lb.setAttribute('aria-hidden','true');
    lb.innerHTML = '<div class="lb-inner" role="dialog" aria-label="Image viewer"><button class="lb-close" aria-label="Close">×</button><img alt=""><div class="lb-caption"></div></div>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img');
    var lbCaption = lb.querySelector('.lb-caption');
    var lbClose = lb.querySelector('.lb-close');

    projectLinks.forEach(function(link) {
      link.addEventListener('click', function(e) {
        e.preventDefault();
        var href = this.getAttribute('href');
        var caption = this.querySelector('.project-meta h3') ? this.querySelector('.project-meta h3').textContent : '';
        lbImg.src = href;
        lbCaption.innerHTML = '<strong>' + caption + '</strong>';
        lb.classList.add('open');
        lb.setAttribute('aria-hidden','false');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
      });
    });

    function closeLB() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden','true');
      document.body.style.overflow = '';
    }

    lb.addEventListener('click', function(e) {
      if (e.target === lb || e.target === lbClose) closeLB();
    });
    document.addEventListener('keydown', function(e){
      if (e.key === 'Escape' && lb.classList.contains('open')) closeLB();
    });
  }

});