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
        }, 3500);

    });

    /**
     * Document Ready
     */
    $(document).ready(function() {

		var profile;
		var userObj = JSON.parse($('#userProfileObject').text());

		//Register all dialogs to polyfill
		var dialogAll = document.querySelectorAll('dialog');
		$(dialogAll).each(function() {
			var dialog = this;
			if (!dialog.show) {
				dialogPolyfill.registerDialog(dialog);
			}
			dialog.querySelector('.close, .ok-close').addEventListener('click', function() {
				dialog.close();
			});
		});

		var authenticateWholeProfileDialog = document.querySelector('dialog#authenticate-whole-user-profile');

		setTimeout(function() {
			authenticateWholeProfileDialog.showModal();
		}, 3800);

		//Make all radio buttons,  unclickable
		$(':radio').click(function(){
		    return false;
		});

		$('#creativeRegion').select2({
			data: ['', 'Barrie', 'Bay of Quinte', 'Bow Valley', 'Calgary', 'Charlottetown', 'Comox Valley',
				'Durham Region', 'Edmonton', 'Fredericton', 'Halifax', 'Hamilton', 'Kamloops', 'Kingston', 'Montreal',
				'Nanaimo', 'Nelson', 'Niagara Falls', 'Ottawa', 'Ottawa Valley', 'Peel Region', 'Peterborough',
				'Prince George', 'Revelstoke', 'Sarnia Lambton', 'Saskatoon', 'Sault Ste Marie', 'Smithers', 'Toronto',
				'Vancouver', 'Waterloo', 'Whitehorse', 'Windsor', 'Winnipeg', 'York Region'],
			placeholder: function () {
				$(this).data('placeholder');
			}
		}).enable(false);

		if (userObj.profile.residence) {
			$('#creativeRegion').val(userObj.profile.residence);
			$('#creativeRegion').trigger('change');
		}

        if (userObj.profile.opportunitySeeking) {
            $('#' + userObj.profile.opportunitySeeking).attr('checked', true);
        }

		//Handle event when user clicks on "here" in dialog -> allow user to authenticate the complete profile
		$('#authenticateProfileAnchor').on('click', function(e) {
			e.preventDefault();

			//Close dialog
			authenticateWholeProfileDialog.close();

			//Check checkbox
			var checkbox = document.querySelector('#authenticateProfileCheckbox');
			checkbox.setAttribute('checked', true);
			checkbox.parentElement.MaterialCheckbox.check();

			$('html,body').animate({
		        scrollTop: $("#contact").offset().top},
		        'slow');

		});

        $("#authenticateTheProfile").on('click', function(e) {
			e.preventDefault();

			var authenticatorOrganisationName = $('#authenticatorOrganisationName').val();
			var authenticatorName = $('#authenticatorName').val();
			var authenticatorEmail = $('#authenticatorEmail').val();

            //console.log($('#authenticatorOrganisationName').val());
            if (!authenticatorName || !authenticatorEmail || !authenticatorOrganisationName) {
                alert('Please enter all required details');
                return false;
            }

			//Check if checkbox is checked
			//When checked, update all verifiedCount properties in all items
			//If not checked, only update verifiedCount property of items that have been verified
			var isChecked = $('#authenticateProfileCheckbox').prop('checked');
			var count;

			/*
			TODO: there may be many authentications - currently only the recent authenticatorOrganisationName is recorded
			may need to modify to include list of authenticators for skill, learning, service, education, and project element in profile
			*/

            if (userObj.profile) {
                if (userObj.profile.skills) {
                    for (var index = 0; index < userObj.profile.skills.length; index++) {
						if (isChecked || $('#skill'+(index+1)).hasClass('verified')) {
                            userObj.profile.skills[index].isAuthenticated = true;
                            userObj.profile.skills[index].authenticatedBy = authenticatorOrganisationName;
                            userObj.isUserSkillsAuthenticated = true;
							count = parseInt(userObj.profile.skills[index].verifiedCount);
							userObj.profile.skills[index].verifiedCount = count + 1;
                        }
                    }
                }

                if (userObj.profile.externalLinks) {
                    for (var index = 0; index < userObj.profile.externalLinks.length; index++) {
                        if (isChecked || $('#learning'+(index+1)).hasClass('verified')) {
                            userObj.profile.externalLinks[index].isAuthenticated = true;
                            userObj.profile.externalLinks[index].authenticatedBy = authenticatorOrganisationName;
                            userObj.isUserExternalLinksAuthenticated = true;
							count = parseInt(userObj.profile.externalLinks[index].verifiedCount);
							userObj.profile.externalLinks[index].verifiedCount = count + 1;
                        }
                    }
                }

                if (userObj.profile.services) {
                    for (var index = 0; index < userObj.profile.services.length; index++) {
                        if (isChecked || $('#service'+(index+1)).hasClass('verified')) {
                            userObj.profile.services[index].isAuthenticated = true;
                            userObj.profile.services[index].authenticatedBy = authenticatorOrganisationName;
                            userObj.isUserServicesAuthenticated = true;
							count = parseInt(userObj.profile.services[index].verifiedCount);
							userObj.profile.services[index].verifiedCount = count + 1;
                        }
                    }
                }

                // if (userObj.profile.portfolios) {
                //     for (var index = 0; index < userObj.profile.portfolios.length; index++) {
                //         if ($('#portfolio'+index).is(":checked")) {
                //             userObj.profile.portfolios[index].isAuthenticated = true;
                //             userObj.profile.portfolios[index].authenticatedBy = $('#authenticatorOrganisationName').val();
                //             userObj.isUserPortfoliosAuthenticated = true;
                //         }
                //     }
                // }

                if (userObj.profile.experiences) {
                    for (var index = 0; index < userObj.profile.experiences.length; index++) {
						if (isChecked || $('#project'+(index+1)).hasClass('verified')) {
                            userObj.profile.experiences[index].isAuthenticated = true;
                            userObj.profile.experiences[index].authenticatedBy = authenticatorOrganisationName;
                            userObj.isUserExperiencesAuthenticated = true;
							count = parseInt(userObj.profile.experiences[index].verifiedCount);
							userObj.profile.experiences[index].verifiedCount = count + 1;
                        }
                    }
                }
            }

			var requestData,
				authenticatorObj;

			if (isChecked) {

				authenticatorObj = {
	                name: authenticatorName,
	                email: authenticatorEmail,
	                organisation: authenticatorOrganisationName
	            };

				requestData = {
	                user: userObj,
	                authenticator: authenticatorObj
	            };

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

			} else {
				requestData = {
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
			}

			console.log(isChecked);
			console.log(requestData);

            return false;
        });

        // $('#authenticateWholeProfile').on('click', function (e) {
        //     console.log('dsdssdsd');
        //     if (!$('#wholeProfileAuthenticatorName').val() || !$('#wholeProfileAuthenticatorEmail').val() || !$('#wholeProfileAuthenticatorOrganisationName')) {
        //         alert('Please enter all required details');
        //         return false;
        //     }
        //     var userObj = JSON.parse($('#userProfileObject').text());
        //     var authenticatorObj = {
        //         name: $('#wholeProfileAuthenticatorName').val(),
        //         email: $('#wholeProfileAuthenticatorEmail').val(),
        //         organisation: $('#wholeProfileAuthenticatorOrganisationName').val()
        //     }
        //     var requestData = {
        //         user: userObj,
        //         authenticator: authenticatorObj
        //     };
        //
        //     console.log(requestData);
        //     $.ajax({
        //         type: 'POST',
        //         url: '/profile/authenticate/complete/user',
        //         data: requestData,
        //         success: function() {
        //             alert('Authentication successful.');
        //             window.location = '/';
        //         },
        //         error: function () {
        //             alert('Something went wrong');
        //         }
        //     });
        //     return false;
        // });

        // $('#intro-text-new').css('display', 'none');
        // $('#passion-content-display').html($('#passion-content-display').html());
        // $('#freind-reference-content-display').html($('#freind-reference-content-display').html());
        //
        //
        // $('#flipToProfile').on('click', function () {
        //     if($('#image-section').hasClass('intro-image')) {
        //         setTimeout(function() {
        //             $('#image-section').removeClass('intro-image');
        //             $('#image-section').addClass('intro-image-new-margin');
        //             $('#intro-text-new').css('display', 'block');
        //             $('#intro-text-section').css('display', 'none');
        //         }, 400);
        //
        //     } else {
        //         setTimeout(function() {
        //             $('#image-section').addClass('intro-image');
        //             $('#image-section').removeClass('intro-image-new-margin');
        //             $('#intro-text-new').css('display', 'none');
        //             $('#intro-text-section').css('display', 'block');
        //         }, 200);
        //
        //     }
        //
        // });
    });

})(jQuery);
