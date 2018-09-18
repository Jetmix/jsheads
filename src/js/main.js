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

    function closeBlock() {
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

            updateValue();
        }
    }

    function elementInViewport(el) {
        var rect = el.getBoundingClientRect();

        return (
            rect.top  >= 0 &&
            rect.left >= 0 &&
            rect.top + 100  <= (window.innerHeight || document.documentElement.clientHeight)
        );
    }

    function calcElemRadius(elem) {
        return $(elem).width() / 2;
    }

    function createRatings() {
        $('.rating-elem').each(function(idx, elem) {
            var ratingElement = Circles.create({
                id: elem.id,
                radius: calcElemRadius(elem),
                width: 8,
                text: $(elem).data('value') + '%',
                colors: ['#477593','#fdc839']
            });

            ratingElements.push(ratingElement);
        });
    }

    function updateValue() {
        $('#canvas > .rating-elem-container > .rating-elem').each(function(index, elem) {
            if (ratingElements.length && ratingElements[index]) {
                ratingElements[index].update($(elem).data('value'), 500);
            }
        });
    }

    function updateWidth() {
        $('#canvas > .rating-elem-container').each(function(index, elem) {
            if (ratingElements.length && ratingElements[index]) {
                ratingElements[index].updateRadius(calcElemRadius(elem));
            }
        });
    }

    createRatings();

    $(window).on('scroll', handleScroll);
    $(window).on('resize', updateWidth);
}

function initContacts() {
    var overlay = $('.overlay');
    var modal = $('.modal');
    var contactUsBtn = $('.contact-us-btn');
    var modalCloseBtn = modal.find('.close');

    function toggleModal(e) {
        e.preventDefault();

        overlay.toggleClass('overlay--visible', true);
        modal.toggleClass('modal--visible', true);
    }

    function closeModal(e) {
        e.preventDefault();

        overlay.removeClass('overlay--visible');
        modal.removeClass('modal--visible');
    }

    contactUsBtn.on('click', toggleModal);
    overlay.on('click', closeModal);
    modalCloseBtn.on('click', closeModal);
}

function handlePageLoaded() {
    initToggler('menuToggler', 'header-nav', 'header-nav--visible');

    initRating();
    initContacts();
}