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
    var clientData = {};
    $(document).ready(function() {
        $('#next-step-one').on("click", function (e) {
            clientData['companyName'] = $('#clientCompanyName').val();
            clientData['email'] = $('#clientEmail').val();
            clientData['phone'] = $('#clientPhone').val();
            if ($('#swt2').is(':checked'))
                clientData['reachBy'] = 'email';
            else
                clientData['reachBy'] = 'phone';
            if ($('#howDidClientHearOptionOne').is(':selected'))
                clientData['howDidClientHear'] = 'Website';
            else if ($('#howDidClientHearOptionTwo').is(':selected'))
                clientData['howDidClientHear'] = 'Social Media';
            else
                clientData['howDidClientHear'] = 'Word of Mouth';
        });
        var jobData = {};
        var jobs = [];
        $('#next-step-two').on("click", function () {
            
            jobData['jobTitle'] = $('#clientJobTitle').val();
            if ($('#clientJobTypeOptionOne').is(':checked'))
                jobData['jobType'] = 'Unpaid Internship';
            else if ($('#clientJobTypeOptionTwo').is(':checked'))
                jobData['jobType'] = 'Paid Internship';
             else if ($('#clientJobTypeOptionThree').is(':checked'))
                jobData['jobType'] = 'Temporary Contract';
             else 
                jobData['jobType'] = 'Full Time Hire';
            jobData['jobLocation'] = $('#clientJobLocation').val();
            jobData['jobRateOfPay'] = $('#clientJobRateOfPay').val();
            if ($('#clientJobRateOfPayTypeOptionOne').is(':selected'))
                jobData['jobRateOfPayType'] = 'per hour';
            else if ($('#clientJobRateOfPayTypeOptionTwo').is(':selected'))
                jobData['jobRateOfPayType'] = 'perday';
            else if ($('#clientJobRateOfPayTypeOptionThree').is(':selected'))
                jobData['jobRateOfPayType'] = 'per month';
            else
                jobData['jobRateOfPayType'] = 'per year';
            jobData['jobDescription'] = $('#clientJobDescription').val();

            
        });

        $('#next-step-complete').on("click", function () {
            var jobDataFileUrls = [];
            if ($('#jobUploaduploadFileOne').text())
                jobDataFileUrls.push(JSON.parse($('#jobUploaduploadFileOne').text()));
            if ($('#jobUploaduploadFileTwo').text())
                jobDataFileUrls.push(JSON.parse($('#jobUploaduploadFileTwo').text()));
            if ($('#jobUploaduploadFileThree').text())
                jobDataFileUrls.push(JSON.parse($('#jobUploaduploadFileThree').text()));
            if ($('#jobUploaduploadFileFour').text())
                jobDataFileUrls.push(JSON.parse($('#jobUploaduploadFileFour').text()));
            if ($('#jobUploaduploadFileFive').text())
                jobDataFileUrls.push(JSON.parse($('#jobUploaduploadFileFive').text()));

            jobData['jobFileUrls'] = jobDataFileUrls;
            jobs.push(jobData);
            clientData['jobs'] = jobs;
            if (!clientData.companyName || !clientData.email || !clientData.phone) {
                alert("please complete the required details");
                return false;
            }
            $.ajax({
                type: 'POST',
                url: '/api/client/profile/request',
                data: clientData,
                success: function(response) {
                    $(".success").fadeIn(1000);
                    $(".error").fadeOut(500);
                    if (response == 'success') {
                        alert('Profile saved successfully');
                        window.location = '/';
                    }
                }
            });
        });
       
    });

})(jQuery);
