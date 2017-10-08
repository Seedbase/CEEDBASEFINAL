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
     * Document Ready
     */
    $(document).ready(function() {
        /** Typed.js (Text typing effect) */
        var users = JSON.parse($('#all-creatives-profile').text());
        var clickedIndex = -1;
        $("#creative-profile-slider .row div").on("click", function () {
            var indexString = this.id;
            indexString = indexString.split('-');
            clickedIndex = parseInt(indexString[3]);
            var user = users[clickedIndex];
            if (user && user.profile) {
                console.log('user ' + JSON.stringify(user));
                if (user.profile.introText[0]) {
                    $('#intro-Text').css('display', 'inline-block');
                    $('#intro-Text-1').text(user.profile.introText[0]);
                    $('#intro-Text-2').text(user.profile.introText[1]);
                    $('#intro-Text-3').text(user.profile.introText[2]);

                    $('.typed').typed({
                        stringsElement: $('.typed-strings'),
                        loop: true,
                        backDelay: 2000
                    });
                }

                $('#passion-content-display').html(user.profile.passion);
                $('#display-name').text(user.displayName);
                $('#birthday').text(user.profile.birthday);
                $('#residence').text(user.profile.residence);
                $('#email').text(user.email);

            }
        });

        $('#redirect-to-creative-profile').on('click', function () {
            window.location = '/profile/view?userId='+users[clickedIndex]._id;
        });
        $('#intro-text-new').css('display', 'none');
        $('#passion-content-display').html($('#passion-content-display').html());
        $('#freind-reference-content-display').html($('#freind-reference-content-display').html());

    });

})(jQuery);
