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
             $('.intro-image').addClass('intro-image-z-index')
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
        var unreadMessages = [];
        $.ajax({
            type: 'GET',
            url: '/profile/user/messages/fetch',
            success: function(response) {
                console.log(JSON.stringify(response));
                $('#messageCounter').text(response.length);
                for (var index = 0; index < response.length; index++) {
                    unreadMessages.push(response[index].creative);
                }
            }
        });
        $('#notificationLink').click(function () {
            var requestData = {messages: unreadMessages}
            $('#messageCounter').text('');
            $.ajax({
                type: 'POST',
                url: '/profile/user/messages/markread',
                data: requestData,
                success: function(response) {
                    console.log(response);
                }
            });
        })

        /** Typed.js (Text typing effect) */
        $(".typed").typed({
            stringsElement: $(".typed-strings"),
            loop: true,
            backDelay: 2000
        });

        // keep the menuopen in case of profile.ejs
        $('body').toggleClass('menu-open');
        /** Navigation */
        // disable navigation of resume menu in case of profile.ejs

        /* $(".nav-toggle, .resume-close").on('click', function(e) {
            e.preventDefault();
            $('body').toggleClass('menu-open');
        });
        */

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

        var profile;
        var userObj = JSON.parse($('#userProfileObject').text());
        if (userObj.profile)
            profile = userObj.profile;
        else
            profile = {};
        var introText = [];
        if (profile.opportunitySeeking)
            $('#'+profile.opportunitySeeking).attr('checked', 'checked');

        $('#saveMyProfile').on('click', function () {

            var providerId = $('#providerId').val();
            introText.push($('#intro-content-one').val());
            introText.push($('#intro-content-two').val());
            introText.push($('#intro-content-three').val());
            profile['introText'] = introText;
            if ($('#videoResume').text())
                profile['videoResume'] = JSON.parse($('#videoResume').text());
            if ($('#unPaidInternship').is(':checked'))
                profile['opportunitySeeking'] = 'unPaidInternship';
            else if ($('#paidInternship').is(':checked'))
                profile['opportunitySeeking'] = 'paidInternship';
            else if ($('#tempContract').is(':checked'))
                profile['opportunitySeeking'] = 'tempContract';
            else
                profile['opportunitySeeking'] = 'fullTimeHire';

            var requestData = {userProfile: profile, providerId: providerId};

            $.ajax({
                type: 'POST',
                url: '/profile/user/save',
                data: requestData,
                success: function() {
                    alert('Profile saved successfully.');
                }
            });
            return false;
        })
        /** Contact Form */
        $("#submitTheVerificationRequest").on('click', function(e) {
            var error = false;
            if (!$('#display-name').text()) {
                error = true;
                alert('Please enter your full name in the profile');
                e.preventDefault();
                return false;
            } else if (!$('#email').text()) {
                error = true;
                alert('Please enter your email id in the profile');
                e.preventDefault();
                return false;
            } else if (!$("#authenticatorName").val()) {
                error = true;
                alert('Please enter ceeder name');
                e.preventDefault();
                return false;
            } else if (!$('#birthday-content').val()) {
                error = true;
                alert('Please enter your birth month and year');
                e.preventDefault();
                return false;
            } else if (!$("#authenticatorEmail").val()) {
                error = true;
                alert('Please enter ceeder email id');
                e.preventDefault();
                return false;
            } else if (!$("#authenticatorSubject").val()) {
                error = true;
                alert('Please enter subject');
                e.preventDefault();
                return false;
            } else if (!$("#authenticatorMessage").val()) {
                error = true;
                alert('Please enter message');
                e.preventDefault();
                return false;
            } else if (!$("#creativeRegion").select2({
                    tags: true,
                    data: ['Barrie', 'Bay of Quinte', 'Bow Valley', 'Calgary', 'Charlottetown', 'Comox Valley',
                    'Durham Region', 'Edmonton', 'Fredericton', 'Halifax', 'Hamilton', 'Kamloops', 'Kingston', 'Montreal',
                    'Nanaimo', 'Nelson', 'Niagara Falls', 'Ottawa', 'Ottawa Valley', 'Peel Region', 'Peterborough',
                    'Prince George', 'Revelstoke', 'Sarnia Lambton', 'Saskatoon', 'Sault Ste Marie', 'Smithers', 'Toronto',
                    'Vancouver', 'Waterloo', 'Whitehorse', 'Windsor', 'Winnipeg',  'York Region'],
                    width: "85%",
                    maximumSelectionLength: 1,
                    placeholder: "Select from list or type and enter"
                }).find(":selected").data()) {
                alert('Please enter your region');
                e.preventDefault();
                error = true;
                return false;
            }

            var birthday = $('#birthday-content').val().split('/')[0] + '-01-' + $('#birthday-content').val().split('/')[1];
            birthday = new Date(birthday);
            var currentDate = new Date();
            var timeDiff = Math.abs(currentDate.getTime() - birthday.getTime());
            var diffDays = Math.ceil(timeDiff / (1000 * 3600 * 24));
            if (diffDays < 5110) {
                alert('You should be at least 14 years old to create the profile');
                e.preventDefault();
                error = true;
                return false;
            }
            if (!error) {
                var providerId = $('#providerId').val();
                e.preventDefault();
                var message = $("#authenticatorMessage").val();
                var emailData = {
                    fromName: $("#authenticatorName").val(),
                    fromEmail: $('#email').text(),
                    toEmail: $("#authenticatorEmail").val(),
                    subject: $("#authenticatorSubject").val(),
                    message: $("#authenticatorMessage").val()
                };
                introText.push($('#intro-content-one').val());
                introText.push($('#intro-content-two').val());
                introText.push($('#intro-content-three').val());
                profile['introText'] = introText;
                if ($('#videoResume').text())
                    profile['videoResume'] = JSON.parse($('#videoResume').text());
                if ($('#unPaidInternship').is(':checked'))
                    profile['opportunitySeeking'] = 'unPaidInternship';
                else if ($('#paidInternship').is(':checked'))
                    profile['opportunitySeeking'] = 'paidInternship';
                else if ($('#tempContract').is(':checked'))
                    profile['opportunitySeeking'] = 'tempContract';
                else
                    profile['opportunitySeeking'] = 'fullTimeHire';

                profile['residence'] = $("#creativeRegion").select2().find(":selected").data().data.text;
                var requestData = {dataString: emailData, userProfile: profile, providerId: providerId};
                function isValidEmail(emailAddress) {
                    var pattern = new RegExp(/^((([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+(\.([a-z]|\d|[!#\$%&'\*\+\-\/=\?\^_`{\|}~]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])+)*)|((\x22)((((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(([\x01-\x08\x0b\x0c\x0e-\x1f\x7f]|\x21|[\x23-\x5b]|[\x5d-\x7e]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(\\([\x01-\x09\x0b\x0c\x0d-\x7f]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF]))))*(((\x20|\x09)*(\x0d\x0a))?(\x20|\x09)+)?(\x22)))@((([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|\d|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.)+(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])|(([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])([a-z]|\d|-|\.|_|~|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])*([a-z]|[\u00A0-\uD7FF\uF900-\uFDCF\uFDF0-\uFFEF])))\.?$/i);
                    return pattern.test(emailAddress);
                };


                //isValidEmail(email) &&
                if (isValidEmail(emailData.toEmail) && (emailData.message.length > 10) && (emailData.fromName.length > 1)) {
                    $.ajax({
                        type: 'POST',
                        url: '/profile/authentication/request',
                        data: requestData,
                        success: function() {
                            $(".success").fadeIn(1000);
                            $(".error").fadeOut(500);
                            alert('Mail sent successfully.');
                            window.location = '/';
                        }
                    });
                } else {
                    if (!isValidEmail(emailData.toEmail)) {
                        alert('Email must be valid');
                    } else if (!emailData.message.length > 1) {
                        alert('Message must be at least 11 characters long');
                    } else {
                        alert('From must be at least 2 characters long')
                    }
                }
            }

            return false;
        });

        // Editing profile starts here

        // $('#add-passion').on('click', function() {
        //     $('#passion-content').css('display', 'block');
        //     var value = $('#passion-content-display').html();
        //     value = value.replace(/<br\s*[\/]?>/gi, "\n")
        //     $('textarea#passion-content').html(value);
        //     $('#passion-content-display').css('display', 'none');
        //     $('#save-passion').css('display', 'block');
        //     $('#add-passion').css('display', 'none');
        // });

        $('#save-passion').on('click', function () {
            // $('#passion-content').css('display', 'none');
            // $('#passion-content-display').css('display', 'block');
            // $('#save-passion').css('display', 'none');
            // $('#add-passion').css('display', 'block');
            var value = $('textarea#passion-content').val();
            var contentAttr = $('textarea#passion-content').attr('name');
            profile['passion'] = value.replace(/\r?\n/g,'<br/>');
            console.log(profile);
            // $('#passion-content-display').html(value.replace(/\r?\n/g,'<br/>'));
        });

        // $('#edit-displayName').on('click', function () {
        //     $('#display-name').css('display', 'none');
        //     $('#display-name-content').css('display', 'inline-block');
        //     $('#display-name-content').val($('#display-name').text());
        //     $('#edit-displayName').css('display', 'none');
        //     $('#save-displayName').css('display', 'inline-block');
        // });

        $('#save-displayName').on('click', function () {
            // $('#display-name').css('display', 'inline-block');
            // $('#display-name').text($('#display-name-content').val());
            // $('#display-name-content').css('display', 'none');
            // $('#edit-displayName').css('display', 'inline-block');
            // $('#save-displayName').css('display', 'none');
            profile['displayName'] = $('#display-name-content').val();
        });

        // $('#edit-birthday').on('click', function () {
        //     $('#birthday').css('display', 'none');
        //     $('#birthday-content').css('display', 'inline-block');
        //     $('#birthday-content').val($('#birthday').text());
        //     $('#edit-birthday').css('display', 'none');
        //     $('#save-birthday').css('display', 'inline-block');
        // });

        $('#save-birthday').on('click', function () {
            // $('#birthday').css('display', 'inline-block');
            // $('#birthday').text($('#birthday-content').val());
            // $('#birthday-content').css('display', 'none');
            // $('#edit-birthday').css('display', 'inline-block');
            // $('#save-birthday').css('display', 'none');
            profile['birthday'] = $('#birthday-content').val();
        });

        // $('#edit-residence').on('click', function () {
        //     $('#residence').css('display', 'none');
        //     $('#residence-content').css('display', 'inline-block');
        //     $('#residence-content').val($('#residence').text());
        //     $('#edit-residence').css('display', 'none');
        //     $('#save-residence').css('display', 'inline-block');
        // });
				//
        // $('#save-residence').on('click', function () {
        //     $('#residence').css('display', 'inline-block');
        //     $('#residence').text($('#residence-content').val());
        //     $('#residence-content').css('display', 'none');
        //     $('#edit-residence').css('display', 'inline-block');
        //     $('#save-residence').css('display', 'none');
        //     profile['residence'] = $('#residence-content').val();
        // });

        // $('#edit-email').on('click', function () {
        //     $('#email').css('display', 'none');
        //     $('#email-content').css('display', 'inline-block');
        //     $('#email-content').val($('#email').text());
        //     $('#edit-email').css('display', 'none');
        //     $('#save-email').css('display', 'inline-block');
        // });

        $('#save-email').on('click', function () {
            // $('#email').css('display', 'inline-block');
            // $('#email').text($('#email-content').val());
            // $('#email-content').css('display', 'none');
            // $('#edit-email').css('display', 'inline-block');
            // $('#save-email').css('display', 'none');
            profile['email'] = $('#email-content').val();
        });

        $('#add-skills').on('click', function () {
            $('#add-skills').css('display', 'none');
            //$('#skill-rating-content').css('display', 'inline-block');
						$('#add-a-skill').css('display', 'block');
            $('#skill-save-button').css('display', 'block');
        });

        var skillSideCounter = 0;
        var user = JSON.parse($('#userProfileObject').text());
        /*if (user && user.profile && user.profile.skills);
            skillSideCounter = user.profile.skills.length % 2;*/
        $('#skill-save-button').on('click', function () {
            // if ($('#skill-rating-content').val() > 100) {
            //     alert('skill rating cannot be greater than 100%');
            //     return;
            // }

						var ratingValue = parseInt($('#skill-rating-content').val());

						//Create progress bar element

						var rowDiv = document.createElement('div');
						$(rowDiv).attr('class', 'row');
						var colDiv = document.createElement('div');
						$(colDiv).attr('class', 'col-sm-8 col-sm-offset-1');
						var progressDiv = document.createElement('div');
						$(progressDiv).attr('class', 'progress');
						var progressInfoDiv = document.createElement('div');
						$(progressInfoDiv).attr('progress-info');
						var progressBarDiv = document.createElement('div');
            $(progressBarDiv).attr('class', 'progress-bar');
            var span = document.createElement('span')
						$(span).attr('class', 'value');

						$(colDiv).appendTo(rowDiv);
						$(progressDiv).appendTo(colDiv);
						$(progressInfoDiv).appendTo(progressDiv);
						$(progressBarDiv).appendTo(progressDiv);
						$(span).appendTo(progressBarDiv);

            // var divOne = document.createElement('div');
            // $(divOne).attr('class', 'progress');
            // var divTwo = document.createElement('div');
            // $(divTwo).attr('class', 'progress-info');
            // var divThree = document.createElement('div');
            // $(divThree).attr('class', 'progress-bar');
            // var spanOne = document.createElement('span');
            // $(spanOne).attr('class', 'value');
            // $(divTwo).appendTo(divOne);
            // $(divThree).appendTo(divOne);
            // $(spanOne).appendTo(divThree);


            $(progressInfoDiv).html($('#skill-name-content').val());
            $(progressBarDiv).attr('data-percent', ratingValue);
            $(progressBarDiv).css('width', ratingValue + '%')
            $(span).text(ratingValue + '%');

            // if (skillSideCounter % 2 == 0) {
            //     $('#skillLeft').append(divOne);
            //     skillSideCounter = 1;
            // } else {
            //     $('#skillRight').append(divOne);
            //     skillSideCounter = 0;
            // }

						$('#skills-progress-bars').append(rowDiv);

            $('#add-skills').css('display', 'inline-block');
            //$('#skill-name-content').css('display', 'none');
            //$('#skill-rating-content').css('display', 'none');
            $('#skill-save-button').css('display', 'none');
            //console.log($('#skill-name-content').val());
            var skillSet = {skill: $('#skill-name-content').val(), rating: ratingValue}
            if (profile.skills)
                profile.skills.push(skillSet)
            else {
                var skillSetArr = [];
                skillSetArr.push(skillSet);
                profile['skills'] = skillSetArr;
                console.log(profile['skills']);
            }


            $('#skill-name-content').val('');
            //$('#skill-rating-content').val('');
						$("#skill-rating-content").data("ionRangeSlider").update({from: 0});
						$('#add-a-skill').css('display', 'none');
        });

        $('#add-external-links').on('click', function () {
            $('#add-external-links').css('display', 'none');
            $('#external-links-content').css('display', 'inline-block');
            $('#external-links-save-button').css('display', 'block');
        });

        $('#external-links-save-button').on('click', function () {

					var certificationDiv = $('#certification-links');

					var rowDiv = document.createElement('div');
					$(rowDiv).attr('class', 'row');
					var colDiv = document.createElement('div');
					$(colDiv).attr('class', 'col-sm-8 col-sm-offset-1');
					var p = document.createElement('p');
					var anchor = document.createElement('a');
					$(anchor).html($('#external-links-content').val());
					var linkVal = $('#external-links-content').val();
					var linkProtocol = linkVal.substring(0,4);
					if (linkProtocol == 'http')
							$(anchor).attr("href", $('#external-links-content').val());
					else {
							var link = 'http://' + $('#external-links-content').val();
							$(anchor).attr("href", link);
					}

					$(anchor).appendTo(p);
					$(p).appendTo(colDiv);
					$(colDiv).appendTo(rowDiv);
					$(certificationDiv).append(rowDiv);

					// var tr = document.createElement('tr');
					// var tdVerified = document.createElement('td');
					// $(tdVerified).addClass('col-xs-1');
					// var tdLink = document.createElement('td');
					// $(tdLink).addClass('col-xs-10');
					// var tdRemove = document.createElement('td');
					// $(tdRemove).addClass('col-xs-1');
					// $(tdRemove).html('<i class="icon-remove"></i>');
					// var anchor = document.createElement('a');
					// $(anchor).html($('#external-links-content').val());
					// var linkVal = $('#external-links-content').val();
					// var linkProtocol = linkVal.substring(0,4);
					// if (linkProtocol == 'http')
					// 		$(anchor).attr("href", $('#external-links-content').val());
					// else {
					// 		var link = 'http://' + $('#external-links-content').val();
					// 		$(anchor).attr("href", link);
					// }
					//
					// $(anchor).appendTo(tdLink);
					// $(tdVerified).appendTo(tr);
					// $(tdLink).appendTo(tr);
					// $(tdRemove).appendTo(tr);
					// $(table).append(tr);


            // var divOne = document.createElement('div');
            // $(divOne).addClass('row');
            // var divTwo = document.createElement('div');
            // $(divTwo).addClass('col-md-1');
            // var divThree = document.createElement('div');
            // $(divThree).addClass('col-md-11');
            // var anchor = document.createElement('a');
            // $(anchor).html($('#external-links-content').val());
            // var linkVal = $('#external-links-content').val();
            // var linkProtocol = linkVal.substring(0,4);
            // if (linkProtocol == 'http')
            //     $(anchor).attr("href", $('#external-links-content').val());
            // else {
            //     var link = 'http://' + $('#external-links-content').val();
            //     $(anchor).attr("href", link);
            // }
						//
						//
            // $(anchor).appendTo(divThree);
            // $(divTwo).appendTo(divOne);
            // $(divThree).appendTo(divOne);
            // $('#external-links-container').append(divOne);
            $('#add-external-links').css('display', 'inline-block');
            $('#external-links-content').css('display', 'none');
            $('#external-links-save-button').css('display', 'none');

            var externalLinkSet = {link: $('#external-links-content').val()}
            if (profile.externalLinks) {
                profile.externalLinks.push(externalLinkSet);
            }
            else {
                var externalLinksArr = [];
                externalLinksArr.push(externalLinkSet);
                profile['externalLinks'] = externalLinksArr;
            }
            $('#external-links-content').val('');
        });

        $('#add-service').on('click', function () {
            $('#add-service').css('display', 'none');
            $('#service-name-content').css('display', 'block');
            $('#service-description-content').css('display', 'block');
            $('#service-save-button').css('display', 'block');
        });

        var serviceSideCounter = 0;
        $('#service-save-button').on('click', function () {
            var divOne = document.createElement('div');
            $(divOne).attr('class', 'icon-box col-md-6');
            var divTwo = document.createElement('div');
            $(divTwo).attr('class', 'box-icon');
            var icon = document.createElement('i');
            $(icon).attr("class", "icon fa fa-shield");
            var divThree = document.createElement('div');
            $(divThree).attr('class', 'box-content');
            var heading = document.createElement('h4');
            var para = document.createElement('p');

            $(icon).appendTo(divTwo);
            $(heading).appendTo(divThree);
            $(para).appendTo(divThree);
            $(divTwo).appendTo(divOne);
            $(divThree).appendTo(divOne);
            $(heading).text($('#service-name-content').val());
            $(para).text($('#service-description-content').val());

            if (serviceSideCounter % 2 == 0) {
                $('#service-container').append(divOne);
                serviceSideCounter = 1;
            } else {
                $('#service-container').append(divOne);

                serviceSideCounter = 0;
            }

            $('#add-service').css('display', 'block');
            $('#service-name-content').css('display', 'none');
            $('#service-description-content').css('display', 'none');
            $('#service-save-button').css('display', 'none');

            var serivceSet = {service: $('#service-name-content').val(), description: $('#service-description-content').val()}
            if (profile.services)
                profile.services.push(serivceSet)
            else {
                var serviceSetArr = [];
                serviceSetArr.push(serivceSet);
                profile['services'] = serviceSetArr;
            }

            $('#service-name-content').val('');
            $('#service-description-content').val('');

        });

        $('#add-experience').on('click', function () {
            $('#add-experience-container').css('display', 'block');
            $('#add-experience').css('display', 'none');
        });

        var fromDateExperienceStr = '';
        $('#experience-from-year-content').datepicker({
            autoclose: true,
            minViewMode: 1,
            format: 'mm/yyyy'
        }).on('changeDate', function(selected){
            var from = selected['date'].toString();
            from = from.split(' ')
            fromDateExperienceStr = from[1] + ' ' + from[3];
        });

        var toDateExperienceStr;
        $('#experience-to-year-content').datepicker({
            autoclose: true,
            minViewMode: 1,
            format: 'mm/yyyy'
        }).on('changeDate', function(selected) {
            var to = selected['date'].toString();
            to = to.split(' ');
            toDateExperienceStr = to[1] + ' ' + to[3];
        });

        $('#experience-save-button').on('click', function() {
            var listItem = document.createElement('li');
            var heading = document.createElement('h2');
            $(heading).attr('class', 'title')
            var spanOne = document.createElement('span');
            $(spanOne).attr('class', 'time');
            var para = document.createElement('p');

            $(heading).appendTo(listItem);
            $(spanOne).appendTo(listItem);
            $(para).appendTo(listItem);

            $(heading).text($('#experience-name-content').val());
            $(spanOne).text(fromDateExperienceStr + ' - ' + toDateExperienceStr);

            var value = $('textarea#experience-description-content').val();
            var contentAttr = $('textarea#experience-description-content').attr('name');
            $(para).html(value.replace(/\r?\n/g,'<br/>'));

            $('#experience-timeline').append(listItem);
            $('#add-experience').css('display', 'block');
            $('#add-experience-container').css('display', 'none');

            var experienceSet = {company: $('#experience-name-content').val(),
                                 from: fromDateExperienceStr,
                                 to: toDateExperienceStr,
                                 description: value.replace(/\r?\n/g,'<br/>') }
            if (profile.experiences)
                profile.experiences.push(experienceSet)
            else {
                var experienceSetArr = [];
                experienceSetArr.push(experienceSet);
                profile['experiences'] = experienceSetArr;
            }

            $('#experience-name-content').val('');
            $('#experience-from-year-content').val('');
            $('#experience-to-year-content').val('');
            $('#experience-description-content').val('');
        });

        $('#add-education').on('click', function () {
            if (profile.educations && profile.educations.length == 2) {
                alert('Please add top two educational details');
                return;
            }
            $('#add-education-container').css('display', 'block');
            $('#add-education').css('display', 'none');
        });

        var fromDateEducationStr = '';
        $('#education-from-year-content').datepicker({
            autoclose: true,
            minViewMode: 1,
            format: 'mm/yyyy'
        }).on('changeDate', function(selected){
            var from = selected['date'].toString();
            from = from.split(' ')
            fromDateEducationStr = from[1] + ' ' + from[3];
        });

        var toDateEducationStr;
        $('#education-to-year-content').datepicker({
            autoclose: true,
            minViewMode: 1,
            format: 'mm/yyyy'
        }).on('changeDate', function(selected) {
            var to = selected['date'].toString();
            to = to.split(' ');
            toDateEducationStr = to[1] + ' ' + to[3];
        });

        $('#education-save-button').on('click', function() {
            var listItem = document.createElement('li');
            var heading = document.createElement('h2');
            $(heading).attr('class', 'title')
            var spanOne = document.createElement('span');
            $(spanOne).attr('class', 'time');
            var para = document.createElement('p');

            $(heading).appendTo(listItem);
            $(spanOne).appendTo(listItem);
            $(para).appendTo(listItem);

            $(heading).text($('#education-name-content').val());
            $(spanOne).text(fromDateEducationStr + ' - ' + toDateEducationStr);

            var value = $('textarea#education-description-content').val();
            var contentAttr = $('textarea#education-description-content').attr('name');
            $(para).html(value.replace(/\r?\n/g,'<br/>'));

            $('#education-timeline').append(listItem);
            $('#add-education').css('display', 'block');
            $('#add-education-container').css('display', 'none');

            var educationSet = {institute: $('#education-name-content').val(),
                                 from: fromDateEducationStr,
                                 to: toDateEducationStr,
                                 description: value.replace(/\r?\n/g,'<br/>') }
            if (profile.educations)
                profile.educations.push(educationSet)
            else {
                var educationSetArr = [];
                educationSetArr.push(educationSet);
                profile['educations'] = educationSetArr;
            }

            $('#education-name-content').val('');
            $('#education-from-year-content').val('');
            $('#education-to-year-content').val('');
            $('#education-description-content').val('');

        });


        $('#add-portfolio').on('click', function () {
            $('#add-portfolio-container').css('display', 'block');
            $('#add-portfolio').css('display', 'none');
        });

        var fromDatePortfolioStr = '';
        $('#portfolio-from-year-content').datepicker({
            autoclose: true,
            minViewMode: 1,
            format: 'mm/yyyy'
        }).on('changeDate', function(selected){
            var from = selected['date'].toString();
            from = from.split(' ')
            fromDatePortfolioStr = from[1] + ' ' + from[3];
        });

        var toDatePortfolioStr;
        $('#portfolio-to-year-content').datepicker({
            autoclose: true,
            minViewMode: 1,
            format: 'mm/yyyy'
        }).on('changeDate', function(selected) {
            var to = selected['date'].toString();
            to = to.split(' ');
            toDatePortfolioStr = to[1] + ' ' + to[3];
        });

        $('#portfolio-save-button').on('click', function() {
            var listItem = document.createElement('li');
            var heading = document.createElement('h2');
            $(heading).attr('class', 'title')
            var spanOne = document.createElement('span');
            $(spanOne).attr('class', 'time');
            var para = document.createElement('p');
            var paraLink = document.createElement('p');

            $(heading).appendTo(listItem);
            $(spanOne).appendTo(listItem);
            $(para).appendTo(listItem);
            $(paraLink).appendTo(listItem);

            $(heading).text($('#portfolio-title-content').val());
            $(spanOne).text(fromDatePortfolioStr + ' - ' + toDatePortfolioStr);

            var value = $('textarea#portfolio-description-content').val();
            var contentAttr = $('textarea#portfolio-description-content').attr('name');
            $(para).html(value.replace(/\r?\n/g,'<br/>'));
            $(paraLink).html($('#portfolio-link').val());

            $('#portfolio-timeline').append(listItem);
            $('#add-portfolio').css('display', 'block');
            $('#add-portfolio-container').css('display', 'none');

            var portfolioSet = {title: $('#portfolio-title-content').val(),
                                 from: fromDatePortfolioStr,
                                 to: toDatePortfolioStr,
                                 description: value.replace(/\r?\n/g,'<br/>'),
                                 link: $('#portfolio-link').val() }
            if (profile.portfolios)
                profile.portfolios.push(portfolioSet)
            else {
                var portfolioSetArr = [];
                portfolioSetArr.push(portfolioSet);
                profile['portfolios'] = portfolioSetArr;
            }

            $('#portfolio-title-content').val('');
            $('#portfolio-from-year-content').val('');
            $('#portfolio-to-year-content').val('');
            $('#portfolio-description-content').val('');
            $('#portfolio-link').val('');

        });


        $('#add-freind-reference').on('click', function() {
            $('#freind-reference-content').css('display', 'block');
            var value = $('#freind-reference-content-display').html();
            value = value.replace(/<br\s*[\/]?>/gi, "\n")

            $('textarea#freind-reference-content').html(value);
            $('#freind-reference-content-display').css('display', 'none');
            $('#save-freind-reference').css('display', 'block');
            $('#add-freind-reference').css('display', 'none');
        });

        $('#save-freind-reference').on('click', function () {
            $('#freind-reference-content').css('display', 'none');
            $('#freind-reference-content-display').css('display', 'block');
            $('#save-freind-reference').css('display', 'none');
            $('#add-freind-reference').css('display', 'block');
            var value = $('textarea#freind-reference-content').val();
            var contentAttr = $('textarea#freind-reference-content').attr('name');
            profile['friendReference'] = value.replace(/\r?\n/g,'<br/>');
            $('#freind-reference-content-display').html(value.replace(/\r?\n/g,'<br/>'));
        });

        //$('#passion-content-display').html( $('#passion-content-display').text().replace(/<br\s*[\/]?>/gi, "\n"));
        // set the radio button as per the option selected by the user
    });

})(jQuery);
