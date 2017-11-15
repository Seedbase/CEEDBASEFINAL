/*
Theme: RENO
Author: CSSLoss.com
Author URI: http://www.cssloss.com/
Version: 1.0
=============================================
*/

(function($) {
    "use strict";

    /**
     * Window Load
     */
    $(window).on('load', function() {

        /** Loader */
        var loader = $(".loader");
        var wHeight = $(window).height();
        var wWidth = $(window).width();
        var i = 0;

        /** Center loader on half screen */
        loader.css({
            top: wHeight / 2 - 2.5,
            left: wWidth / 2 - 200
        })

        do {
            loader.animate({
                width: i
            }, 10)
            i += 3;
        } while (i <= 400)
        if (i === 402) {
            loader.animate({
                left: 0,
                width: '100%'
            })
            loader.animate({
                top: '0',
                height: '100vh'
            })
        }

        /** This line hide loader and show content */
        setTimeout(function() {
            $(".loader-wrapper").fadeOut('fast');
            (loader).fadeOut('fast');
            /*Set time in milisec */
             $('.intro-image').addClass('intro-image-z-index');
        }, 3500);


        /** Background Image
        ----------------------------*/
        $(".bg-image").each(function() {
            var $imgPath = $(this).attr('data-image');
            $(this).css('background-image', 'url(' + $imgPath + ')');
        });

        /** Portfolio Isotope */
        $(".gallery").isotope({
            itemSelector: '.gallery-item',
                percentPosition: true,
        });

        // isotope click function
        $(".gallery-menu ul li button").on('click', function(e) {
            e.preventDefault();
            $(".gallery-menu ul li button").removeClass("active");
            $(this).addClass("active");

            var selector = $(this).attr('data-filter');
            $(".gallery").isotope({
                filter: selector,
                animationOptions: {
                    duration: 750,
                    easing: 'linear',
                    queue: false,
                }
            });
            return false;
        });

    });


    /**
     * Document Ready
     */
    $(document).ready(function() {

        /** Typed.js (Text typing effect) */
        $(".typed").typed({
            stringsElement: $(".typed-strings"),
            loop: true,
            backDelay: 2000
        });

        /** Navigation */
        // disable navigation of resume menu in case of profile.ejs

        $(".nav-toggle, .resume-close").on('click', function(e) {
            e.preventDefault();
            $('body').toggleClass('menu-open');
        });

        /** Custom Scrollbar */
        $(".section-resume").mCustomScrollbar({
            theme: 'minimal-dark',
            axis: 'y'
        });


        /** Progress Bar */
        $(".progress-bar").each(function() {
            var $imgPath = $(this).attr('data-percent');
            $(this).css('width', $imgPath + '%');
        });


        // magnific popup for portfolio
        $(".popup-image").magnificPopup({
            type: 'image',
        });

        $(".popup-video").magnificPopup({
            type: 'iframe',
            iframe: {
                markup: '<div class="mfp-iframe-scaler">' + '<div class="mfp-close"></div>' + '<iframe class="mfp-iframe" frameborder="0" allowfullscreen></iframe>' + '</div>',

                patterns: {
                    youtube: {
                        index: 'youtube.com/',
                        id: 'v=',
                        src: 'http://www.youtube.com/embed/%id%?autoplay=1'
                    },
                    vimeo: {
                        index: 'vimeo.com/',
                        id: '/',
                        src: '//player.vimeo.com/video/%id%?autoplay=1'
                    },
                    gmaps: {
                        index: '//maps.google.',
                        src: '%id%&output=embed'
                    }
                },

                srcAction: 'iframe_src',
            }
        });


        $("#authenticateTheProfile").on('click', function(e) {
            console.log($('#authenticatorOrganisationName').val());
            if (!$('#authenticatorName').val() || !$('#authenticatorEmail').val() || !$('#authenticatorOrganisationName').val()) {
                alert('Please enter all required details');
                return false;
            }
            var profile;
            var userObj = JSON.parse($('#userProfileObject').text());
            e.preventDefault();
            if (userObj.profile) {
                if (userObj.profile.skills) {
                    for (var index = 0; index < userObj.profile.skills.length; index++) {
                        if ($('#skill'+index).hasClass('verified'))) {
						//if ($('#skill'+index).is(":checked")) {
                             userObj.profile.skills[index].isAuthenticated = true;
                            userObj.profile.skills[index].authenticatedBy = $('#authenticatorOrganisationName').val();
                            userObj.isUserSkillsAuthenticated = true;
                        }
                    }
                }

                if (userObj.profile.externalLinks) {
                    for (var index = 0; index < userObj.profile.externalLinks.length; index++) {
                        if ($('#externalLink'+index).is(":checked")) {
                            userObj.profile.externalLinks[index].isAuthenticated = true;
                            userObj.profile.externalLinks[index].authenticatedBy = $('#authenticatorOrganisationName').val();
                            userObj.isUserExternalLinksAuthenticated = true;
                        }
                    }
                }

                if (userObj.profile.services) {
                    for (var index = 0; index < userObj.profile.services.length; index++) {
                        if ($('#service'+index).hasClass('verified')) {
						//if ($('#service'+index).is(":checked")) {
                            userObj.profile.services[index].isAuthenticated = true;
                            userObj.profile.services[index].authenticatedBy = $('#authenticatorOrganisationName').val();
                            userObj.isUserServicesAuthenticated = true;
                        }
                    }
                }

                if (userObj.profile.portfolios) {
                    for (var index = 0; index < userObj.profile.portfolios.length; index++) {
                        if ($('#portfolio'+index).is(":checked")) {
                            userObj.profile.portfolios[index].isAuthenticated = true;
                            userObj.profile.portfolios[index].authenticatedBy = $('#authenticatorOrganisationName').val();
                            userObj.isUserPortfoliosAuthenticated = true;
                        }
                    }
                }

                if (userObj.profile.experiences) {
                    for (var index = 0; index < userObj.profile.experiences.length; index++) {
                        //if ($('#experience'+index).is(":checked")) {
						if ($('#experience'+index).hasClass('verified')) {
                            userObj.profile.experiences[index].isAuthenticated = true;
                            userObj.profile.experiences[index].authenticatedBy = $('#authenticatorOrganisationName').val();
                            userObj.isUserExperiencesAuthenticated = true;
                        }
                    }
                }
            }

            var requestData = {
                user: userObj
            };

            $.ajax({
                type: 'POST',
                url: '/profile/authenticate/user',
                data: requestData,
                success: function() {
                    alert('Authentication successful.');
                    window.location = '/';
                },
                error: function () {
                    alert('Something went wrong');
                }
            });

            return false;
        });

        $('#authenticateWholeProfile').on('click', function (e) {
            console.log('dsdssdsd');
            if (!$('#wholeProfileAuthenticatorName').val() || !$('#wholeProfileAuthenticatorEmail').val() || !$('#wholeProfileAuthenticatorOrganisationName')) {
                alert('Please enter all required details');
                return false;
            }
            var userObj = JSON.parse($('#userProfileObject').text());
            var authenticatorObj = {
                name: $('#wholeProfileAuthenticatorName').val(),
                email: $('#wholeProfileAuthenticatorEmail').val(),
                organisation: $('#wholeProfileAuthenticatorOrganisationName').val()
            }
            var requestData = {
                user: userObj,
                authenticator: authenticatorObj
            };

            console.log(requestData);
            $.ajax({
                type: 'POST',
                url: '/profile/authenticate/complete/user',
                data: requestData,
                success: function() {
                    alert('Authentication successful.');
                    window.location = '/';
                },
                error: function () {
                    alert('Something went wrong');
                }
            });
            return false;
        });

        $('#intro-text-new').css('display', 'none');
        $('#passion-content-display').html($('#passion-content-display').html());
        $('#freind-reference-content-display').html($('#freind-reference-content-display').html());


        $('#flipToProfile').on('click', function () {
            if($('#image-section').hasClass('intro-image')) {
                setTimeout(function() {
                    $('#image-section').removeClass('intro-image');
                    $('#image-section').addClass('intro-image-new-margin');
                    $('#intro-text-new').css('display', 'block');
                    $('#intro-text-section').css('display', 'none');
                }, 400);

            } else {
                setTimeout(function() {
                    $('#image-section').addClass('intro-image');
                    $('#image-section').removeClass('intro-image-new-margin');
                    $('#intro-text-new').css('display', 'none');
                    $('#intro-text-section').css('display', 'block');
                }, 200);

            }

        });
    });

})(jQuery);
