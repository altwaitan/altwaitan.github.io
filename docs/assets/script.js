document.getElementById('show-more-news').onclick = function() {
    var extras = document.querySelectorAll('.news-extra');
    for (var i = 0; i < extras.length; i++) {
        extras[i].style.display = 'list-item';
    }
    this.style.display = 'none';
    document.getElementById('show-less-news').style.display = 'inline-block';
};
document.getElementById('show-less-news').onclick = function() {
    var extras = document.querySelectorAll('.news-extra');
    for (var i = 0; i < extras.length; i++) {
        extras[i].style.display = 'none';
    }
    this.style.display = 'none';
    document.getElementById('show-more-news').style.display = 'inline-block';
    window.scrollTo({
        top: document.querySelector('.news-section').offsetTop,
        behavior: 'smooth'
    });
};

// Handle footer logo fallback
document.addEventListener('DOMContentLoaded', function() {
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
