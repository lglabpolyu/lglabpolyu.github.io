/**
* Template Name: Personal - v2.1.0
* Template URL: https://bootstrapmade.com/personal-free-resume-bootstrap-template/
* Author: BootstrapMade.com
* License: https://bootstrapmade.com/license/
*/
!(function($) {
  "use strict";

  var routes = {
    '#about': '',
    '#publications': 'publication',
    '#team': 'team',
    '#join': 'join'
  };

  var pathToHash = {
    '': '#about',
    'publication': '#publications',
    'publications': '#publications',
    'team': '#team',
    'join': '#join',
    'join-us': '#join',
    'contact': '#join',
    'contacts': '#join'
  };
  var routeTransitionTimer = null;
  var routeEntryTimer = null;

  function basePath() {
    var path = window.location.pathname.replace(/\/index\.html$/, '/');
    return path.replace(/\/(publication|publications|team|join|join-us|contact|contacts)\/?$/, '/');
  }

  function routePath(hash) {
    var base = basePath();
    var route = routes[hash];
    return route ? base + route : base;
  }

  function hashFromLocation() {
    if (window.location.hash && $(window.location.hash).length) return window.location.hash;
    var params = new URLSearchParams(window.location.search);
    var route = params.get('route');
    if (route && pathToHash[route]) return pathToHash[route];
    var base = basePath();
    var slug = window.location.pathname.replace(base, '').replace(/^\/|\/$/g, '');
    return pathToHash[slug] || '#about';
  }

  function closeMobileNav() {
    if ($('body').hasClass('mobile-nav-active')) {
      $('body').removeClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').fadeOut();
    }
  }

  function showSection(hash, pushRoute, animate) {
    var target = $(hash);
    if (!target.length) return;

    $('.nav-menu .active, .mobile-nav .active').removeClass('active');
    $('.nav-menu, .mobile-nav').find('a[href="' + hash + '"]').parent('li').addClass('active');

    $('#header').addClass('header-top');

    if (pushRoute && window.history && window.history.pushState) {
      window.history.pushState({ hash: hash }, '', routePath(hash));
    }

    closeMobileNav();

    var current = $("section.section-show").first();
    var reducedMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    var shouldAnimate = animate !== false && !reducedMotion && current.length && current.get(0) !== target.get(0);

    clearTimeout(routeTransitionTimer);
    clearTimeout(routeEntryTimer);
    $('body').removeClass('route-transitioning');
    $("section").removeClass('section-leaving section-entering');

    if (!shouldAnimate) {
      $("section").removeClass('section-show');
      target.addClass('section-show');
      return;
    }

    void document.body.offsetWidth;
    $('body').addClass('route-transitioning');
    current.addClass('section-leaving');

    routeTransitionTimer = setTimeout(function() {
      current.removeClass('section-show section-leaving');
      target.addClass('section-show section-entering');

      routeEntryTimer = setTimeout(function() {
        target.removeClass('section-entering');
        $('body').removeClass('route-transitioning');
      }, 420);
    }, 180);
  }

  function startDemoCarousel() {
    var strips = document.querySelectorAll('.demo-strip');
    strips.forEach(function(strip){
      if (strip.dataset.carouselStarted === 'true') return;
      strip.dataset.carouselStarted = 'true';
      var track = strip.querySelector('.demo-track');
      if (!track) return;
      var items = Array.prototype.slice.call(track.children);
      if (items.length <= 1) return;
      items.forEach(function(item){
        var clone = item.cloneNode(true);
        clone.setAttribute('aria-hidden', 'true');
        clone.classList.add('demo-tile-clone');
        track.appendChild(clone);
      });
    });
  }

  // Nav Menu
  $(document).on('click', '.nav-menu a, .mobile-nav a, .hero-actions a', function(e) {
    if (location.pathname.replace(/^\//, '') == this.pathname.replace(/^\//, '') && location.hostname == this.hostname) {
      var hash = this.hash;
      var target = $(hash);
      if (target.length) {
        e.preventDefault();

        if (hash == '#header') {
          $('#header').removeClass('header-top');
          $("section").removeClass('section-show');
          return;
        }

        showSection(hash, true, true);

        return false;

      }
    }
  });

  // Activate/show sections on load with hash links, clean paths, or default to #about
  setTimeout(function() {
    var initialHash = hashFromLocation();
    showSection(initialHash, false, false);
    startDemoCarousel();
    if (window.location.search.indexOf('route=') !== -1 && window.history && window.history.replaceState) {
      window.history.replaceState({ hash: initialHash }, '', routePath(initialHash));
    }
  }, 100);

  document.addEventListener('includes:loaded', function() {
    startDemoCarousel();
  });

  window.addEventListener('popstate', function() {
    showSection(hashFromLocation(), false, true);
  });

  // Mobile Navigation
  if ($('.nav-menu').length) {
    var $mobile_nav = $('.nav-menu').clone().prop({
      class: 'mobile-nav d-lg-none'
    });
    $('body').append($mobile_nav);
    $('body').prepend('<button type="button" class="mobile-nav-toggle d-lg-none"><i class="icofont-navigation-menu"></i></button>');
    $('body').append('<div class="mobile-nav-overly"></div>');

    $(document).on('click', '.mobile-nav-toggle', function(e) {
      $('body').toggleClass('mobile-nav-active');
      $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
      $('.mobile-nav-overly').toggle();
    });

    $(document).click(function(e) {
      var container = $(".mobile-nav, .mobile-nav-toggle");
      if (!container.is(e.target) && container.has(e.target).length === 0) {
        if ($('body').hasClass('mobile-nav-active')) {
          $('body').removeClass('mobile-nav-active');
          $('.mobile-nav-toggle i').toggleClass('icofont-navigation-menu icofont-close');
          $('.mobile-nav-overly').fadeOut();
        }
      }
    });
  } else if ($(".mobile-nav, .mobile-nav-toggle").length) {
    $(".mobile-nav, .mobile-nav-toggle").hide();
  }

  // jQuery counterUp
  $('[data-toggle="counter-up"]').counterUp({
    delay: 10,
    time: 1000
  });

  // Skills section
  $('.skills-content').waypoint(function() {
    $('.progress .progress-bar').each(function() {
      $(this).css("width", $(this).attr("aria-valuenow") + '%');
    });
  }, {
    offset: '80%'
  });

  // Testimonials carousel (uses the Owl Carousel library)
  $(".testimonials-carousel").owlCarousel({
    autoplay: true,
    dots: true,
    loop: true,
    responsive: {
      0: {
        items: 1
      },
      768: {
        items: 2
      },
      900: {
        items: 3
      }
    }
  });

  // Porfolio isotope and filter
  $(window).on('load', function() {
    var portfolioIsotope = $('.portfolio-container').isotope({
      itemSelector: '.portfolio-item',
      layoutMode: 'fitRows'
    });

    $('#portfolio-flters li').on('click', function() {
      $("#portfolio-flters li").removeClass('filter-active');
      $(this).addClass('filter-active');

      portfolioIsotope.isotope({
        filter: $(this).data('filter')
      });
    });

  });

  // Initiate venobox (lightbox feature used in portofilo)
  $(document).ready(function() {
    $('.venobox').venobox();
  });

})(jQuery);
