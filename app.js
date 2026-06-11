
(function () {
    const triggers = document.querySelectorAll('[data-scope][href]');
    const gallerySection = document.getElementById('gallery');
    const detailView = document.getElementById('detail-view');
    const detailFrame = document.getElementById('detail-frame');
    const detailTitle = document.getElementById('detail-title');
    const backBtn = document.getElementById('back-to-gallery');
    const allCards = Array.from(document.querySelectorAll('main .card'))
        .filter(c => c !== detailView);

    let activeScope = null;

    function hideForScope(scope) {
        if (scope === 'all') {
            allCards.forEach(c => { c.hidden = true; });
        } else {
            gallerySection.hidden = true;
        }
    }

    function restoreForScope(scope) {
        if (scope === 'all') {
            allCards.forEach(c => { c.hidden = false; });
        } else {
            gallerySection.hidden = false;
        }
    }

    function openDetail(url, title, scope, pushHash) {        
        if (activeScope && activeScope !== scope) {
            restoreForScope(activeScope);
        }
        activeScope = scope;
        hideForScope(scope);

        detailFrame.src = url;
        detailTitle.textContent = title || 'Szczegóły';
        detailView.hidden = false;

        if (pushHash) {
            const name = url.replace(/^.*\//, '').replace(/\.html$/, '');
            history.pushState({ page: name, scope: scope }, '',
                '#view=' + scope + ':' + name);
        }
        detailView.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }

    function closeDetail(pushHash) {
        detailView.hidden = true;
        detailFrame.src = 'about:blank';
        if (activeScope) {
            restoreForScope(activeScope);
            activeScope = null;
        }
        if (pushHash) {
            history.pushState({}, '', '#');
        }
        window.scrollTo({ top: 0, behavior: 'smooth' });
    }

    triggers.forEach(function (el) {
        el.addEventListener('click', function (e) {
            e.preventDefault();
            openDetail(
                el.getAttribute('href'),
                el.dataset.title,
                el.dataset.scope || 'gallery',
                true
            );
        });
    });

    backBtn.addEventListener('click', function () {
        closeDetail(true);
    });

    detailFrame.addEventListener('load', function () {
        try {
            const doc = detailFrame.contentDocument;
            if (doc && doc.title && detailFrame.src !== 'about:blank'
                && !detailFrame.src.endsWith('about:blank')) {
                detailTitle.textContent = doc.title;
            }
        } catch (_) {
            
        }
    });

    function syncFromHash() {
        const match = location.hash.match(/^#view=([a-z]+):([a-z0-9_-]+)$/i);
        if (match) {
            const scope = match[1];
            const name = match[2];
            const link = document.querySelector(
                '[data-scope="' + scope + '"][href$="' + name + '.html"]'
            );
            if (link) {
                openDetail(link.getAttribute('href'), link.dataset.title, scope, false);
                return;
            }
        }
        if (!detailView.hidden) {
            closeDetail(false);
        }
    }

    window.addEventListener('popstate', syncFromHash);
    syncFromHash();
})();
