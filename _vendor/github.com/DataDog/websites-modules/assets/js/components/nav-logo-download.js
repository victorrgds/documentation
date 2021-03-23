const ddLogo = document.querySelector('.js-logo-download');
const ddLogoDwnDiv = document.querySelector('.js-logo-download-div');
const downloadLogoBtn = document.querySelector('.js-logo-download-btn');

if (ddLogo) {
    // mouse right click to trigger logo download div to be displayed
    ddLogo.addEventListener('contextmenu', function (event) {
        ddLogoDwnDiv.style.display = ddLogoDwnDiv.style.display === 'none' ? 'block' : 'none';
        event.preventDefault();
    });

    // mouse click + mouse right click to hide logo download div
    window.addEventListener('click', () => {
        ddLogoDwnDiv.style.display = ddLogoDwnDiv.style.display === 'block' ? 'none' : 'none';
    });

    downloadLogoBtn.addEventListener('click', (e) => {
        e.preventDefault();
        window.location = 'https://www.datadoghq.com/about/resources/';
    });

    // modal window close on window resize
    window.addEventListener('resize', () => {
        ddLogoDwnDiv.style.display = ddLogoDwnDiv.style.display === 'block' ? 'none' : 'none';
    });
}
