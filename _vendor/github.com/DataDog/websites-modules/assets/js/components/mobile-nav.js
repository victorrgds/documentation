// MOBILE MENU

const mobileOverlay = document.querySelector('#mobile-nav-bg');
const mobileMenu = document.querySelector('#mobile-nav');
const mobileNavbarToggler = document.querySelector('.navbar-toggler');

let mobileToggle = false;

function mobileToggleIconToggle(e) {
    e.preventDefault();
    mobileToggle = !mobileToggle;
    mobileOverlay.classList.toggle('mobile-bg-open');
    mobileMenu.classList.toggle('mobile-menu-open');
    document.body.classList.toggle('body-noscroll');
    mobileNavbarToggler.classList.toggle('open');
}

window.addEventListener('resize', function () {
    const { innerWidth } = window;

    if (mobileMenu && mobileNavbarToggler) {
        if (innerWidth >= 991) {
            mobileOverlay.classList.remove('mobile-bg-open');
            mobileMenu.classList.remove('mobile-menu-open');
            document.body.classList.remove('body-noscroll');
            mobileNavbarToggler.classList.remove('open');
            mobileMenu.style.right = '-500px';
        }
    }
});

if (mobileNavbarToggler) {
    mobileNavbarToggler.addEventListener('click', mobileToggleIconToggle);
}
