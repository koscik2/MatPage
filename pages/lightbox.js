(function () {
    function open(src, alt) {
        const overlay = document.createElement('div');
        overlay.className = 'lightbox';
        overlay.innerHTML =
            '<button class="lightbox-close" aria-label="Zamknij">&times;</button>' +
            '<img src="' + src + '" alt="' + (alt || '') + '" />';

        function close() {
            overlay.classList.remove('open');
            setTimeout(() => overlay.remove(), 200);
            document.removeEventListener('keydown', onKey);
        }
        function onKey(e) { if (e.key === 'Escape') close(); }

        overlay.addEventListener('click', close);
        document.addEventListener('keydown', onKey);
        document.body.appendChild(overlay);
        requestAnimationFrame(() => overlay.classList.add('open'));
    }

    document.addEventListener('click', function (e) {
        const img = e.target.closest('.gallery img');
        if (!img) return;
        e.preventDefault();
        open(img.getAttribute('src'), img.getAttribute('alt'));
    });
})();
