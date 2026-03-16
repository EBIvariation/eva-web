(function overrideCookieBanner() {
    function init() {
        var link = document.querySelector('#cookie-banner .text a');
        if (!link) {
            setTimeout(init, 100);
            return;
        }
        link.href = 'files/Privacy_Notice_The_European_Variation_Archive.pdf';
        link.textContent = 'Privacy Notice';
        link.target = '_blank';
    }
    init();
})();
