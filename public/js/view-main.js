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

		//Register all dialogs to polyfill
		var dialogAll = document.querySelectorAll('dialog');
		$(dialogAll).each(function() {
			var dialog = this;
			if (!dialog.show) {
				dialogPolyfill.registerDialog(dialog);
			}
			dialog.querySelector('.close').addEventListener('click', function() {
				dialog.close();
			});
		});

		var pokeOrShowInterestDialog = document.querySelector('dialog#show-interest-user-profile');
		var pokeOrShowInterestDialogButton = document.querySelector('#pokeOrShowInterest');
		pokeOrShowInterestDialogButton.addEventListener('click', function() {
			pokeOrShowInterestDialog.showModal();
		});

        var possibleResponses = ["client-not-found", "client-not-verified", "client-found"];
        $('#verify-client-registration').on('click', function (e) {
            if (!$('#client-email-id').val()) {
                alert('please enter valid email id');
                return false;
            } else {
                var possibleResponses = ["client-not-found", "client-not-verified", "client-found"]
                var clientEmail = $('#client-email-id').val();
                $.ajax({
                    type: 'GET',
                    url: '/client/verify/registration?clientEmail=' + clientEmail,
                    success: function(response) {
                        for (var index = 0; index < possibleResponses.length; index ++) {
							$('#'+possibleResponses[index]).css('display', 'none');
						}
                        $('#'+response).css('display', 'block');
                        if (response == 'client-found') {
                            $('#verify-client-registration').css('display', 'none');
                            $('#poke-button').css('display', 'block');
                        }
                    },
                    error: function (error) {
                        alert('Something went wrong. Please try again');
                    }
                });
            }
        });

        $('#poke-button').on('click', function () {
            var clientMessageToCreative = '';
            var message = $('textarea#client-message-to-creative').val();
            var contentAttr = $('textarea#client-message-to-creative').attr('name');
            clientMessageToCreative = message.replace(/\r?\n/g,'<br/>');
            var userId = location.search.split('=')[1];
            var requestData = {message: clientMessageToCreative, userId: userId, clientEmail: $('#client-email-id').val()}
            $.ajax({
                type: 'POST',
                url: '/user/profile/interest',
                data: requestData,
                success: function(response) {
                    alert('Your interest is registered and email sent to the creative. We will get back to you soon!');
                    pokeOrShowInterestDialog.close();
                    for (var index = 0; index < possibleResponses.length; index ++)
                        $('#'+possibleResponses[index]).css('display', 'none');
                    $('#client-email-id').val('');
                    $('#client-message-to-creative').val('');
                    $('#poke-button').css('display', 'none');
                    $('#verify-client-registration').css('display', 'block');
                },
                error: function (error) {
                    alert('Something went wrong. Please try again');
                }
            });

        });

        $('#rsendClientVerificationemail').on('click', function () {
            var requestData = {clientEmail: $('#client-email-id').val(), user: JSON.parse($('#userProfileObject').text())};
            $.ajax({
                type: 'POST',
                url: '/client/verification/resendemail',
                data: requestData,
                success: function(response) {
                    alert('Mail resent successfully');
                },
                error: function (error) {
                    alert('Something went wrong. Please try again');
                }
            });
        });

        // $('#passion-content-display').html($('#passion-content-display').html());
        // $('#freind-reference-content-display').html($('#freind-reference-content-display').html());
        //
        //
        // $('#flipToProfile').on('click', function () {
        //     if($('#image-section').hasClass('intro-image')) {
        //         setTimeout(function() {
        //             $('#image-section').removeClass('intro-image');
        //             $('#image-section').addClass('intro-image-new-margin');
        //             $('#intro-text-new').css('display', 'none');
        //             $('#intro-text-section').css('display', 'block');
        //         }, 400);
        //
        //     } else {
        //         setTimeout(function() {
        //             $('#image-section').addClass('intro-image');
        //             $('#image-section').removeClass('intro-image-new-margin');
        //             $('#intro-text-new').css('display', 'block');
        //             $('#intro-text-section').css('display', 'none');
        //         }, 200);
        //
        //     }
        //
        // });
    });

})(jQuery);
