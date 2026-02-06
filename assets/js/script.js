/* Basic site JS helpers
 * - Smooth scroll fallback for same-page anchors
 * - Skip-link focus handling for accessibility
 * - Navigation functionality (drawer, active link, back-to-top)
 * - Accessible project image lightbox
 */

// Initialize everything when DOM is loaded
document.addEventListener('DOMContentLoaded', function () {

  // Smooth scroll for same-page anchors (fallback for older browsers)
  document.querySelectorAll('a[href^="#"]').forEach(function (anchor) {
    anchor.addEventListener('click', function (e) {
      var href = this.getAttribute('href');
      if (href && href.length > 1) {
        var target = document.querySelector(href);
        if (target) {
          e.preventDefault();
          var navHeight = document.querySelector('.site-nav').offsetHeight;
          var targetPosition = target.offsetTop - navHeight - 20;
          window.scrollTo({
            top: targetPosition,
            behavior: 'smooth'
          });
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

  // Focusable elements selector for focus trap
  var focusableSelector = 'a[href], button:not([disabled]), textarea, input, select, [tabindex]:not([tabindex="-1"])';
  var lastFocusedBeforeDrawer = null;

  function openDrawer() {
    lastFocusedBeforeDrawer = document.activeElement;
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
    if (lastFocusedBeforeDrawer && typeof lastFocusedBeforeDrawer.focus === 'function') {
      lastFocusedBeforeDrawer.focus();
    } else {
      navToggle.focus();
    }
  }

  // Populate mobile drawer and footer quick-links from the single source (#nav-menu)
  function populateMenus() {
    var navMenu = document.getElementById('nav-menu');
    var drawerMenu = document.getElementById('drawer-menu');
    var footerMenu = document.getElementById('footer-links');
    if (!navMenu) return;
    var links = navMenu.querySelectorAll('a');

    if (drawerMenu) {
      drawerMenu.innerHTML = '';
      links.forEach(function (link) {
        var li = document.createElement('li');
        var a = link.cloneNode(true);
        a.setAttribute('role', 'menuitem');
        li.appendChild(a);
        drawerMenu.appendChild(li);
      });
    }

    if (footerMenu) {
      footerMenu.innerHTML = '';
      links.forEach(function (link) {
        var li = document.createElement('li');
        var a = link.cloneNode(true);
        li.appendChild(a);
        footerMenu.appendChild(li);
      });
    }

    // Ensure the drawer closes when a link is activated
    if (drawerMenu) {
      drawerMenu.querySelectorAll('a').forEach(function (link) {
        link.addEventListener('click', closeDrawer);
      });
    }
  }

  populateMenus();

  if (navToggle && navDrawer) {
    navToggle.addEventListener('click', function () {
      if (navDrawer.classList.contains('open')) closeDrawer(); else openDrawer();
    });

    navOverlay.addEventListener('click', closeDrawer);
    if (drawerClose) drawerClose.addEventListener('click', closeDrawer);

    document.addEventListener('keydown', function (e) {
      if (!navDrawer.classList.contains('open')) return;

      if (e.key === 'Escape') {
        closeDrawer();
        return;
      }

      if (e.key === 'Tab') {
        var focusable = navDrawer.querySelectorAll(focusableSelector);
        if (!focusable.length) return;
        var first = focusable[0];
        var last = focusable[focusable.length - 1];

        if (e.shiftKey) {
          if (document.activeElement === first) {
            e.preventDefault();
            last.focus();
          }
        } else {
          if (document.activeElement === last) {
            e.preventDefault();
            first.focus();
          }
        }
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
          if (link) { link.classList.add('active'); link.setAttribute('aria-current', 'page'); }
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
    lb.setAttribute('aria-hidden', 'true');
    lb.innerHTML = '<div class="lb-inner" role="dialog" aria-label="Image viewer"><button class="lb-close" aria-label="Close">×</button><img alt=""><div class="lb-caption"></div></div>';
    document.body.appendChild(lb);
    var lbImg = lb.querySelector('img');
    var lbCaption = lb.querySelector('.lb-caption');
    var lbClose = lb.querySelector('.lb-close');
    var lastTrigger = null;

    projectLinks.forEach(function (link) {
      link.addEventListener('click', function (e) {
        e.preventDefault();
        var href = this.getAttribute('href');
        var caption = this.querySelector('.project-meta h3') ? this.querySelector('.project-meta h3').textContent : '';
        lastTrigger = this;
        lbImg.src = href;
        lbCaption.innerHTML = '<strong>' + caption + '</strong>';
        lb.classList.add('open');
        lb.setAttribute('aria-hidden', 'false');
        document.body.style.overflow = 'hidden';
        lbClose.focus();
      });
    });

    function closeLB() {
      lb.classList.remove('open');
      lb.setAttribute('aria-hidden', 'true');
      document.body.style.overflow = '';
      if (lastTrigger && typeof lastTrigger.focus === 'function') {
        lastTrigger.focus();
      }
    }

    lb.addEventListener('click', function (e) {
      if (e.target === lb || e.target === lbClose) closeLB();
    });
    document.addEventListener('keydown', function (e) {
      if (e.key === 'Escape' && lb.classList.contains('open')) closeLB();
    });
  }

});