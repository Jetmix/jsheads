document.addEventListener('DOMContentLoaded', handlePageLoaded);

function initToggler(togglerId, listClassName, isVisibleClassName) {
    if (!togglerId || !listClassName || !isVisibleClassName) return;

    var togglerElem = document.getElementById(togglerId);
    var blockElem = document.querySelector('.' + listClassName);

    function toggleBlock(e) {
        e.preventDefault();
        e.stopPropagation();
        
        blockElem.classList.toggle(isVisibleClassName);
    }

    function closeBlock(e) {
        blockElem.classList.remove(isVisibleClassName);
    }

    togglerElem.addEventListener('click', toggleBlock);
    document.addEventListener('click', closeBlock);
}

function handlePageLoaded() {
    initToggler('menuToggler', 'header-nav', 'header-nav--visible');
}