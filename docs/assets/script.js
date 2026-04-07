document.getElementById('show-more-news').onclick = function() {
    var extras = document.querySelectorAll('.timeline__item--hidden');
    for (var i = 0; i < extras.length; i++) {
        extras[i].style.display = 'flex';
    }
    var visibleItems = document.querySelectorAll('.timeline__item:not(.timeline__item--hidden)');
    var lastVisible = visibleItems[visibleItems.length - 1];
    var line = lastVisible.querySelector('.timeline__line');
    if (line) line.style.display = '';

    this.classList.add('news-toggle--hidden');
    document.getElementById('show-less-news').classList.remove('news-toggle--hidden');
};

document.getElementById('show-less-news').onclick = function() {
    var extras = document.querySelectorAll('.timeline__item--hidden');
    for (var i = 0; i < extras.length; i++) {
        extras[i].style.display = '';
    }
    var visibleItems = document.querySelectorAll('.timeline__item:not(.timeline__item--hidden)');
    var lastVisible = visibleItems[visibleItems.length - 1];
    var line = lastVisible.querySelector('.timeline__line');
    if (line) line.style.display = 'none';

    this.classList.add('news-toggle--hidden');
    document.getElementById('show-more-news').classList.remove('news-toggle--hidden');
    window.scrollTo({
        top: document.querySelector('.news-section').offsetTop,
        behavior: 'smooth'
    });
};

document.addEventListener('DOMContentLoaded', function() {
    var visibleItems = document.querySelectorAll('.timeline__item:not(.timeline__item--hidden)');
    var lastVisible = visibleItems[visibleItems.length - 1];
    var line = lastVisible.querySelector('.timeline__line');
    if (line) line.style.display = 'none';

    var footerLogo = document.querySelector('.footer-logo');
    var fallbackText = document.querySelector('.footer-fallback-text');

    footerLogo.onerror = function() {
        this.style.display = 'none';
        fallbackText.style.display = 'inline-block';
    };

    footerLogo.onload = function() {
        this.style.display = 'block';
        fallbackText.style.display = 'none';
    };
});
