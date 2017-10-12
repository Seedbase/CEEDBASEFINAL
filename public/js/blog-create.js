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

        $('#blog-create-button').on("click", function () {
            if (!$('#adminSecret-content').val()) {
                alert('enter admin secret');
                return false;
            }
            var adminSecret = $('#adminSecret-content').val();
            var blog = {};
            blog['title'] = $('#blog-title-content').val();
            var value = $('textarea#blog-content-content').val();
            var contentAttr = $('textarea#blog-content-content').attr('name');
            blog['content'] = value.replace(/\r?\n/g,'<br/>');
            console.log($('#blogImageUplaodData').text());
            if ($('#blogImageUplaodData').text() != '')
                blog['image'] = JSON.parse($('#blogImageUplaodData').text());
            blog['creator'] = 'admin';
            var requestData = {blog: blog, adminSecret: adminSecret};

            $.ajax({
                type: 'POST',
                url: '/api/admin/blog/create',
                data: requestData,
                success: function(response) {
                    if (response == 'success') {
                        alert('Blog created successfully');
                        window.location = '/';
                    }
                }
            });
        })
    });
})(jQuery);
