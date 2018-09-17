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

function initRating() {
    var $canvas = $('#canvas')[0];
    var ratingElementCreated = false;

    var ratingElements = [];

    function handleScroll() {
        if (!ratingElementCreated && elementInViewport($canvas)) {
            ratingElementCreated = true;

            createRatings();
        }
    }

    function elementInViewport(el) {
        var rect = el.getBoundingClientRect();

        return (
            rect.top  >= 0 &&
            rect.left >= 0 &&
            rect.top  <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    function calcElemRadius(elem) {
        return $(elem).width() / 2;
    }

    function createRatings() {
        $('.rating-elem').each(function(idx, elem) {
            var value = $(elem).data('value');

            var ratingElement = Circles.create({
                id: elem.id,
                value: value,
                radius: calcElemRadius(elem),
                width: 8,
                text: value + '%',
                colors: ['#477593','#fdc839']
            });

            ratingElements.push(ratingElement);
        });
    }

    function updateWidth() {
        $('#canvas > .rating-elem-container').each(function(index, elem) {
            ratingElements[index].updateRadius(calcElemRadius(elem));
        });
    }

    $(window).on('scroll', handleScroll);
    $(window).on('resize', updateWidth);
}

function handlePageLoaded() {
    initToggler('menuToggler', 'header-nav', 'header-nav--visible');

    initRating();
}