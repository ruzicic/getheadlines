const Slideout = require('slideout');

document.addEventListener('DOMContentLoaded', function () {
    document.body.removeAttribute('unresolved');

    // Register Slideout.js - off canvas menu
    const mainElem = document.getElementById('main');
    const menuElem = document.getElementById('mobileMenu');
    const toggleButton = document.getElementById('toggleButton');
    const hamburgerMenu = document.getElementsByClassName('hamburger')[0];

    const close = event => {
        event.preventDefault();
        mobileMenu.close();
    }

    const mobileMenu = new Slideout({
        panel: mainElem,
        menu: menuElem,
        padding: 256,
        tolerance: 110,
        side: 'right',
        easing: 'cubic-bezier(.32,2,.55,.27)'
    });

    // Toggle button
    toggleButton.addEventListener('click', () => mobileMenu.toggle());

    // Animate hamburger button & add event listener on main element (to close menu)
    mobileMenu
        .on('beforeopen', () => hamburgerMenu.classList.add('hamburgerActive'))
        .on('open', () => mainElem.addEventListener('click', close))
        .on('beforeclose', () => {
            hamburgerMenu.classList.remove('hamburgerActive');
            mainElem.removeEventListener('click', close);
        });
});
