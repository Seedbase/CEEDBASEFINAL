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
        $('#verify-client').on("click", function (e) {
            if (!$('#clientEmail').val() || !$('#clientPhone').val()) {
                alert("please complete the required details");
                return false;
            } else {
                e.preventDefault();
                var clientData = {};
                clientData['clientEmail'] = $('#clientEmail').val();
                clientData['clientPhone'] = $('#clientPhone').val();
                $.ajax({
                    type: 'POST',
                    url: '/client/verify/registration',
                    data: clientData,
                    success: function(res) {
                        console.log(res+", , ");
                        $(".success").fadeIn(1000);
                        $(".error").fadeOut(500);

                        console.log($('#user-registration-confirmation').val());
                    }
                });
            }

            
            return false;
        });
       
    });

})(jQuery);
