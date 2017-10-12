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
     var blogs = [];
     var months = ['Jan', 'Feb', 'Mar', 'April', 'May', 'June', 'July', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    $(document).ready(function() {
        var currentBlogIndex = 0;
        $.ajax({
            type: 'GET',
            url: '/api/admin/blog/fetch',
            success: function(response) {
                blogs = response;                
                $('#blogTitleHeading').html(blogs[0].title);
                var date = new Date(blogs[0].created);
                console.log(date);
                var dateToshow = date.getDate() + '-' + months[date.getMonth()] + '-' + date.getFullYear();
                $('#blogDateData').append(dateToshow);
                $('#blogCreatorData').append(blogs[0].creator);
                if (blogs[0].image) {
                    var originalPath = blogs[0].image.url;
                    var result = originalPath.substr(originalPath.indexOf("public") + 6);
                    $('#blogImageData').attr("src", result);
                }
                $('#blogContentData').html(blogs[0].content);
                currentBlogIndex = 0;
                createRecentBlogData(blogs);
            }
        });

        $('#showNextBlog').on("click", function (e) {
            e.preventDefault();
            if (currentBlogIndex == 0)
                alert('no more older blogs');
            else {
                currentBlogIndex--;
                var date = new Date(blogs[currentBlogIndex].created);
                var dateToshow = date.getDate() + '-' + months[date.getMonth()] + '-' + date.getFullYear();
                $('#blogDateData').append(dateToshow);
                $('#blogCreatorData').append(blogs[currentBlogIndex].creator);
                if (blogs[currentBlogIndex].image) {
                    var originalPath = blogs[currentBlogIndex].image.url;
                    var result = originalPath.substr(originalPath.indexOf("public") + 6);
                    $('#blogImageData').attr("src", result);
                }
                $('#blogContentData').html(blogs[currentBlogIndex].content);
            }
        })

        $('#showPrevioustBlog').on("click", function (e) {
             console.log(JSON.stringify(blogs));
            e.preventDefault();
            if (currentBlogIndex == (blogs.length - 1))
                alert('no more older blogs');
            else {
                currentBlogIndex++;
                $('#blogTitleHeading').html(blogs[currentBlogIndex].title);
                var date = new Date(blogs[currentBlogIndex].created);
                var dateToshow = date.getDate() + '-' + months[date.getMonth()] + '-' + date.getFullYear();
                $('#blogDateData').append(dateToshow);
                $('#blogCreatorData').append(blogs[currentBlogIndex].creator);
                if (blogs[currentBlogIndex].image) {
                    var originalPath = blogs[currentBlogIndex].image.url;
                    var result = originalPath.substr(originalPath.indexOf("public") + 6);
                    $('#blogImageData').attr("src", result);
                }
                $('#blogContentData').html(blogs[currentBlogIndex].content);
            }
        });

        function createRecentBlogData(blogs) {
            console.log(JSON.stringify(blogs));
            var length = blogs.length > 3 ? 3 : blogs.length;
            for (var index = 0; index < length; index ++) {
                var divOne = document.createElement('div');
                $(divOne).attr("class", "spost clearfix");
                
                var divTwo = document.createElement('div');
                $(divTwo).attr("class", "entry-image");
                $(divTwo).appendTo(divOne);
                
                var anchorOne = document.createElement('a');
                $(anchorOne).attr("class", "nobg");
                $(anchorOne).appendTo(divTwo);
                if (blogs[index].image) {
                    var imageOne = document.createElement('img');
                    $(imageOne).attr("class", "img-circle");
                    var originalPath = blogs[index].image.url;
                    var result = originalPath.substr(originalPath.indexOf("public") + 6);
                    $(imageOne).attr("src", result);
                    $(imageOne).attr("alt", blogs[index].image.name);
                    $(imageOne).appendTo(anchorOne);
                }
                
                var divThree = document.createElement('div');
                $(divThree).attr("class", "entry-c");
                $(divThree).appendTo(divOne);
                
                var divFour = document.createElement('div');
                $(divFour).attr("class", "entry-title");
                $(divFour).appendTo(divThree);
                
                var heading = document.createElement('h4');
                var anchorTwo = document.createElement('a');
                $(anchorTwo).text(blogs[index].title);
                $(anchorTwo).attr("id", index);
                $(anchorTwo).css("cursor", "pointer");
                $(anchorTwo).attr("class", "recentBlogDynamic");
                $(anchorTwo).appendTo(heading);
                $(heading).appendTo(divFour);
                
                var unorderList = document.createElement('ul');
                $(unorderList).attr("class", "entry-meta");
                var listITemOne = document.createElement('li');
                var date = new Date(blogs[index].created);
                var dateToshow = date.getDate() + '-' + months[date.getMonth()] + '-' + date.getFullYear();
                $(listITemOne).html(dateToshow);
                $(listITemOne).appendTo(unorderList); 
                $(unorderList).appendTo(divThree);
                $('#recent-post-list-sidebar').append(divOne);
            }
        }

        $('body').on('click', 'a.recentBlogDynamic', function() {
            currentBlogIndex = parseInt(this.id);;
            $('#blogTitleHeading').html(blogs[currentBlogIndex].title);
            var date = new Date(blogs[currentBlogIndex].created);
            var dateToshow = date.getDate() + '-' + months[date.getMonth()] + '-' + date.getFullYear();
            $('#blogDateData').append(dateToshow);
            $('#blogCreatorData').append(blogs[currentBlogIndex].creator);
            if (blogs[currentBlogIndex].image) {
                var originalPath = blogs[currentBlogIndex].image.url;
                var result = originalPath.substr(originalPath.indexOf("public") + 6);
                $('#blogImageData').attr("src", result);
            }
            $('#blogContentData').html(blogs[currentBlogIndex].content);
        });
    });
})(jQuery);
