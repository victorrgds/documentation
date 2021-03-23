import $ from 'jquery';
import Stickyfill from 'stickyfilljs';
import { userDeviceIsMobile } from '../helpers/window-resizer';

console.log('[websites-modules] main-nav.js');

const currentPageIsBlog = document.body.classList.contains('blog');
const blogHeaderDiv = document.querySelector('.header-blog');

// Adds a polyfill for position: sticky for the blog page's search bar sub-header

// Navbar Dropdown Hover
let productMenuOpen = false;

$('li.dropdown').hover(
    function (e) {
        if (!userDeviceIsMobile()) {
            e.stopPropagation();
            // do hover stuff
            $(this).addClass('show');
            $(this).find('.dropdown-menu').addClass('show');
        }
        // Product menu specific script
        if ($(e.target).hasClass('product-menu')) {
            productMenuOpen = false;
        } else if ($(this).hasClass('product-dropdown')) {
            productMenuOpen = true;
        }
        // Product menu specific script
    },
    function (e) {
        if (!userDeviceIsMobile()) {
            e.stopPropagation();
            $('li.dropdown.show .dropdown-menu').removeClass('show');
            $('li.dropdown.show').removeClass('show');
        }

        // Product menu specific script
        if ($(this).hasClass('product-dropdown')) {
            setTimeout(function () {
                productMenuOpen = false;
            }, 100);
        }
        // Product menu specific script
    }
);

// Product menu specific script
$('a.customers-menu').hover(
    function () {
        if (productMenuOpen) {
            $('li.dropdown.product-dropdown').addClass('show');
            $('li.dropdown.product-dropdown').find('.dropdown-menu').addClass('show');
        }
    },
    function () {
        $('li.dropdown.product-dropdown').removeClass('show');
        $('li.dropdown.product-dropdown').find('.dropdown-menu').removeClass('show');
    }
);
// Product menu specific script

// Close mobile menu on click
$('.mobile-close').on('click', function () {
    $('.navbar-collapse').collapse('hide');
});

if (window.pageYOffset > 0 || document.documentElement.scrollTop > 0 || document.body.scrollTop > 0) {
    if (!$('.navbar').hasClass('scrolled')) {
        $('.navbar').addClass('scrolled');
    }
}

$(window).scroll(function () {
    const windowWidth = $(window).width();
    const windowScrollTop = $(window).scrollTop();
    const yAxisScrollLocation = window.scrollY;
    const mainNavWrapper = document.querySelector('.main-nav-wrapper');
    const nav = document.querySelector('nav'); // legacy nav

    if (mainNavWrapper) {
        if (yAxisScrollLocation > 30) {
            mainNavWrapper.classList.add('main-nav-scrolled');
        } else {
            mainNavWrapper.classList.remove('main-nav-scrolled');
        }
    }

    // legacy nav
    if (nav) {
        if (yAxisScrollLocation > 30) {
            nav.classList.add('nav-scrolled');
        } else {
            nav.classList.remove('nav-scrolled');
        }
    }

    if (!$('.navbar').hasClass('navbar-small')) {
        if (windowWidth >= 992) {
            if (!$('body').hasClass('resources') && !$('body').hasClass('blog')) {
                if (windowScrollTop === 0) {
                    $('.navbar').removeClass('compressed');
                    $('.header-blog').removeClass('shrink');
                } else {
                    $('.navbar').addClass('compressed');
                }

                if (windowScrollTop >= 80) {
                    $('.header-blog').addClass('shrink');
                }
            }
        }
    }

    if (windowScrollTop <= 1) {
        $('.navbar').removeClass('scrolled');
    } else {
        $('.navbar').addClass('scrolled');
    }
});

function setSearchBoxHeight() {
    if ($('.search-box').length) {
        // safari is whacked so a min height was set in CSS to ensure proper dimensions of the sticky header
        // (safari calculated it as 36px when it should be 128 and it messed up everything) so this resets that
        $('.search-box').css('minHeight', '18px');
    }
}

// Resize the nav bar when scrolling
function mainNavHandle() {
    const mainNavWrapper = document.querySelector('.main-nav-wrapper');
    const mainNav = document.querySelector('.main-nav');

    if (mainNavWrapper && mainNav) {
        const scrollPositionFromTop = window.scrollY;
        let newMainNavHeight = 0;

        const maxMainNavHeight = 130;

        if (scrollPositionFromTop < maxMainNavHeight / 2) {
            newMainNavHeight = maxMainNavHeight - scrollPositionFromTop;
        } else {
            newMainNavHeight = maxMainNavHeight / 2;
        }

        if (window.innerWidth >= 992) {
            mainNav.style.height = `${newMainNavHeight}px`;
        } else {
            mainNav.style.height = '';
        }
    }
}

window.addEventListener('scroll', mainNavHandle);
window.addEventListener('load', mainNavHandle);
window.addEventListener('resize', mainNavHandle);

if (!$('.navbar').hasClass('navbar-small')) {
    setSearchBoxHeight();
}
