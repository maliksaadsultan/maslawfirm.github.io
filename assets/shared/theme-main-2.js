(function($){
    "use strict";

    /*--------------------------------
    Animate Text Style
    ----------------------------------*/
    if ($('.animate_text_style').length && $.fn.textillate) {
        $('.animate_text_style').textillate({
            loop: true,
        });
    }

    $("body.header-sticky header").addClass("animated");
    $(window).on('scroll',function() {
        var scroll = $(window).scrollTop();
        if (scroll < 245) {
            $("body.header-sticky header").removeClass("is-sticky");
        }else{
            $("body.header-sticky header").addClass("is-sticky");
        }
    });

    $("header.header-sticky").addClass("animated");
    $(window).on('scroll',function() {
        var scroll = $(window).scrollTop();
        if (scroll < 245) {
            $("header.header-sticky").removeClass("is-sticky");
        }else{
            $("header.header-sticky").addClass("is-sticky");
        }
    });

    var top_offset = 0;
    if ( $('.header-area').length ) {
        if ( $('body').hasClass('logged-in') ) {
            top_offset = $('.header-area').height() + 32;
        } else {
            top_offset = $('.header-area').height() - 0;
        }
    }

    if ($('.primary-nav-one-page nav').length && $.fn.onePageNav) {
        $('.primary-nav-one-page nav').onePageNav({
            scrollOffset: top_offset,
            scrollSpeed: 750,
            easing: 'swing',
            currentClass: 'active',
        });
    }

    if ($('.primary-nav-wrap nav').length) {
        $('body').scrollspy({target: ".primary-nav-wrap nav"});
    }

    if ($(".primary-nav-one-page nav ul li").length) {
        $(".primary-nav-one-page nav ul li:first-child").addClass("active");
    }

    if ($('.primary-nav-wrap > nav > ul > li').length) {
        $('.primary-nav-wrap > nav > ul > li').slice(-2).addClass('last-elements');
    }

    /*-- Mobile Menu --*/
    // Define mobile_menu_data with a safe default if not defined
    var mobileMenuData = typeof mobile_menu_data !== 'undefined' ? mobile_menu_data : { menu_width: "991" };

    if ($('.primary-nav-wrap nav').length && $.fn.meanmenu) {
        $('.primary-nav-wrap nav').meanmenu({
            meanScreenWidth: mobileMenuData.menu_width,
            meanMenuContainer: '.mobile-menu',
            meanMenuClose: '<i class="fa fa-times"></i>',
            meanMenuOpen: '<i class="fa fa-bars"></i>',
            meanRevealPosition: 'right',
            meanMenuCloseSize: '25px',
        });
    }

    /*
     * Header Transparent
     */
    function headerTransparentTopbar(){
        var headerTopbarHeight = 0;
        if ($('.header-top-area').length) {
            headerTopbarHeight = $('.header-top-area').innerHeight();
        }
        var trigger = $('.main-header.header-transparent');
        var bodyTrigger = $('body.logged-in .main-header.header-transparent');

        if ( trigger.length && trigger.parents().find('.header-top-area').length ) {
            trigger.css('top', headerTopbarHeight + 'px');
        }
        if ( bodyTrigger.length && bodyTrigger.parents().find('.header-top-area').length ) {
            bodyTrigger.css('top', (headerTopbarHeight + 32) + 'px' );
        }
    }
    headerTransparentTopbar();

    /**
     * ScrollUp
     */
    function backToTop(){
        var didScroll = false;
        var scrollTrigger = $('#back-to-top');

        if (scrollTrigger.length) {
            scrollTrigger.on('click',function(e) {
                $('body,html').animate({ scrollTop: "0" });
                e.preventDefault();
            });
        }

        $(window).scroll(function() {
            didScroll = true;
        });

        setInterval(function() {
            if( didScroll ) {
                didScroll = false;
                if (scrollTrigger.length) {
                    if ( $(window).scrollTop() > 250 ) {
                        scrollTrigger.css('right',20);
                    } else {
                        scrollTrigger.css('right','-50px');
                    }
                }
            }
        }, 250);
    }
    backToTop();

    /**
     * Wow init
     */
    if (typeof WOW !== 'undefined' && $.fn.WOW) {
        new WOW().init();
    }

    /**
     * Magnific Popup video popup
     */
    if ($('a.video-popup').length && $.fn.magnificPopup) {
        $('a.video-popup').magnificPopup({
            type: 'iframe',
            closeOnContentClick: false,
            closeBtnInside: false,
            mainClass: 'mfp-with-zoom mfp-img-mobile',
            image: {
                verticalFit: true,
                titleSrc: function(item) {
                    return item.el.attr('title') + ' &middot; <a class="image-source-link" href="'+item.el.attr('data-source')+'" target="_blank">image source</a>';
                }
            },
            gallery: {
                enabled: false
            },
            zoom: {
                enabled: true,
                duration: 300,
                opener: function(element) {
                    return element.find('img');
                }
            }
        });
    }

    /**
     * Blog Gallery Post
     */
    if ($('.blog-gallery').length && $.fn.owlCarousel) {
        $('.blog-gallery').owlCarousel({
            loop:true,
            nav:true,
            navText:['<i class="fa fa-angle-left"></i>','<i class="fa fa-angle-right"></i>'],
            responsive:{
                0:{
                    items:1
                },
                768:{
                    items:1
                },
                1000:{
                    items:1
                }
            }
        });
    }

    /**
     * Enable Footer Fixed effect
     */
    function fixedFooter(){
        var fooCheck = $('footer').hasClass('fixed-footer-enable');
        if(fooCheck){
            $('.site-wrapper').addClass('fixed-footer-active');
        }
        var FooterHeight = $('footer.fixed-footer-enable').height();
        var winWidth = $(window).width();
        if( winWidth > 991 ){
            $('.fixed-footer-active').css({'margin-bottom': FooterHeight});
            $('.fixed-footer-active .site-content').css({'background': '#ffffff'});
        } else{
            $('footer').removeClass('fixed-footer-enable');
        }
    }
    fixedFooter();

    /**
     * Page Preloading Effects
     */
    $(window).on('load', function(){
        $(".loading-init").fadeOut(500);
    });

    /**
     * Blog Masonry
     */
    if ($('.blog-masonry').length && $.fn.imagesLoaded && $.fn.isotope) {
        $('.blog-masonry').imagesLoaded( function() {
            // init Isotope
            var $grid = $('.blog-masonry').isotope({
                itemSelector: '.grid-item',
                percentPosition: true,
                masonry: {
                    columnWidth: '.grid-item',
                }
            });
        });
    }

})(jQuery);
