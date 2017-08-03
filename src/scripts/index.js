/* global $, google  */
import 'bootstrap';

import dom from './dom';

function debounce(func, wait = 10, immediate = true) {
  let timeout;

  return function (...args) {
    const context = this; 
    const later = function () {
      timeout = null;
      if (!immediate) func.apply(context, args);
    };
    const callNow = immediate && !timeout;
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
    if (callNow) func.apply(context, args);
  };
}

const PAGE_API = (function () {
  function setSmoothScrollingToAnchor() {
    $('a[href*="#"]:not([href="#"])').click(function () {
      if (location.pathname.replace(/^\//, '') === this.pathname.replace(/^\//, '') && location.hostname === this.hostname) {
        const headerHeight = $('.l-header').height();
 
        let target = $(this.hash);
        const closestIsActive = $(this).closest('.is_active');

        if (closestIsActive.length > 0) {
          closestIsActive.removeClass('is_active');
        }

        target = target.length ? target : $(`[name='${this.hash.slice(1)}']`);
        if (target.length) {
          $('html,body').animate({
            scrollTop: target.offset().top - headerHeight,
          }, 1300);
          return false;
        }
      }
    });
  }

  function preventEmptyLink() {
    $('a[href="#"]').on('click', function (e) {
      e.preventDefault();
    });
  }  

  function preventForms() {
    const forms = $('form');

    forms.each(function () {
      $(this).on('submit', function (e) {
        e.preventDefault();
      });
    });
  }

  function navFixed() {
    const scroll = $(window).scrollTop();
    const header = $('.l-header');

    if (scroll >= 200) {
      header.addClass('l-header--is-fixed');
    } else {
      header.removeClass('l-header--is-fixed');
    }
  }  

  function setActiveLink() {
    const scrollPos = $(document).scrollTop();
    const navLinks = $('.navbar-nav a');

    navLinks.each(function () {
      const link = $(this);
      const linkHref = link.attr('href');
      
      if (linkHref.length > 1) {
        const refElement = $(link.attr('href'));
        const refElementTop = refElement.position().top;

        if (refElementTop <= (scrollPos + 170) && refElementTop + refElement.height() > scrollPos) {
          navLinks.removeClass('nav__link--active');
          link.addClass('nav__link--active');
          return false;
        }
      }
    });
  }

  function onScroll() {
    setActiveLink();
    navFixed();
  }

  function mapInit() {
    const myLatLng = { lat: 52.207921, lng: 20.9415443 };

    const map = new google.maps.Map(document.getElementById('contact__map'), {
      zoom: 16,
      center: myLatLng,
      scrollwheel: false,
      styles: [
        { 'featureType': 'all', 'elementType': 'geometry', 'stylers': [ { 'hue': '#ff0000' } ] }, { 'featureType': 'all', 'elementType': 'labels.text.fill', 'stylers': [ { 'color': '#ffffff' } ] }, { 'featureType': 'all', 'elementType': 'labels.text.stroke', 'stylers': [ { 'visibility': 'on' }, { 'color': '#3e606f' }, { 'weight': 2 }, { 'gamma': 0.84 } ] }, { 'featureType': 'all', 'elementType': 'labels.icon', 'stylers': [ { 'visibility': 'off' } ] }, { 'featureType': 'administrative', 'elementType': 'geometry', 'stylers': [ { 'weight': 0.6 }, { 'color': '#1a3541' } ] }, { 'featureType': 'landscape', 'elementType': 'geometry', 'stylers': [ { 'color': '#191f38' } ] }, { 'featureType': 'poi', 'elementType': 'geometry', 'stylers': [ { 'color': '#222942' } ] }, { 'featureType': 'poi.park', 'elementType': 'geometry', 'stylers': [ { 'color': '#222942' } ] }, { 'featureType': 'road', 'elementType': 'geometry', 'stylers': [ { 'color': '#2a314a' }, { 'lightness': -37 } ] }, { 'featureType': 'transit', 'elementType': 'geometry', 'stylers': [ { 'color': '#2b314a' } ] }, { 'featureType': 'water', 'elementType': 'geometry', 'stylers': [ { 'color': '#131932' } ] } 
      ],
    });

    const marker = new google.maps.Marker({
      position: myLatLng,
      map,
      icon: 'marker.png',
    });    
  }

  function init() {
    mapInit();
    onScroll();
    $(document).on('scroll', debounce(onScroll));
    setSmoothScrollingToAnchor();
    preventEmptyLink();
    preventForms();
  }

  return {
    init,
  };
}());

$(document).ready(function () {
  PAGE_API.init();
});
