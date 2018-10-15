document.addEventListener('DOMContentLoaded', handlePageLoaded);

function initToggler(togglerId, listClassName, isVisibleClassName) {
    if (!togglerId || !listClassName) return;

    var togglerElem = $('#' + togglerId);
    var blockElem = $('.' + listClassName);

    function toggleBlock(e) {
        e.preventDefault();
        e.stopPropagation();

        function slideCallback() {
            $(this).toggleClass(isVisibleClassName);
        }
        
        blockElem.slideToggle(200, slideCallback);
    }

    function closeBlock() {
        function closeCallback() {
            $(this).removeClass(isVisibleClassName);
        }

        blockElem.slideUp(200, closeCallback);
    }

    togglerElem.on('click', toggleBlock);
    $(document).on('click', closeBlock);
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

    function closeModal() {
        overlay.removeClass('overlay--visible');
        modal.removeClass('modal--visible');
    }

    function handleCloseModal(e) {
        e.preventDefault();

        closeModal();
    }

    contactUsBtn.on('click', toggleModal);
    overlay.on('click', handleCloseModal);
    modalCloseBtn.on('click', handleCloseModal);

    function initFormValidation() {
        $.validate({
            lang: 'es',
            modules: 'security'
        });
    }
    
    function initContactForm() {
        var contactForm = $('form.contacts');
        var fieldName = $('form.contacts [name="name"]');
        var fieldEmail = $('form.contacts [name="email"]');
        var fieldMessage = $('form.contacts [name="message"]');
    
        function createStatusMessage(data, className) {
            var statusMessageTemplate = '' +
                '<div class="contacts__item row status-message">' +
                '<p class="col-sm-12 status-message ' + className + '">' +
                data +
                '</p>' +
                '</div>';
    
            contactForm.append($(statusMessageTemplate));
        }
    
        function removeStatusMessage() {
            contactForm.find('.status-message').remove();
        }
    
        function handleFormSubmit(e) {
            e.preventDefault();
    
            removeStatusMessage();
            createStatusMessage('Sending message', 'in-progress');
    
            $.ajax({
                method: "POST",
                url: "/contacts",
                data: {
                    name: fieldName.val(),
                    email: fieldEmail.val(),
                    message: fieldMessage.val()
                }
            })
            .done(function(data) {
                removeStatusMessage();
                createStatusMessage(data.responseJSON.data, 'success');

                setTimeout(closeModal, 2000);
            })
            .fail(function(data) {
                removeStatusMessage();
                createStatusMessage(data.responseJSON.data, 'error');
            });
        }
    
        contactForm.on('submit', handleFormSubmit);
    }

    initFormValidation();
    initContactForm();
}

function initSlider() {
    $('.selected-list').slick({
        centerMode: true,
        centerPadding: '12px',
        slidesToShow: 3,
        prevArrow: '<a href="javascript:void(0);" class="slick-prev slick-arrow"><i class="icon icon-arrow-left"></i></a>',
        nextArrow: '<a href="javascript:void(0);" class="slick-next slick-arrow"><i class="icon icon-arrow-right"></i></a>',
        responsive: [
            {
                breakpoint: 768,
                settings: {
                    centerMode: true,
                    centerPadding: '12px',
                    slidesToShow: 2
                }
            },
            {
                breakpoint: 480,
                settings: {
                    centerMode: true,
                    centerPadding: '12px',
                    slidesToShow: 1
                }
            }
        ]
    });
}

function handlePageLoaded() {
    initToggler('menuToggler', 'header-nav', 'header-nav--visible');

    initRating();
    initContacts();
    initSlider();
}
