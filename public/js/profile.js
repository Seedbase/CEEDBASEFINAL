/**
 * profile.js
 * JS for profile.ejs
 *
 * Adapted from: RENO theme
 * Author: CSSLoss.com
 * Author URI: http://www.cssloss.com/
 * Version: 1.0
 */

(function($) {
    "use strict";

    /**
     * Window Load
     */
    $(window).on('load', function () {

        /** Loader */
        var loader = $(".loader");
        var wHeight = $(window).height();
        var wWidth = $(window).width();
        var i = 0;

        /** Center loader on half screen */
        loader.css({
            top: wHeight / 2 - 2.5,
            left: wWidth / 2 - 200
        });

        do {
            loader.animate({
                width: i
            }, 10);
            i += 3;
        } while (i <= 400);
        if (i === 402) {
            loader.animate({
                left: 0,
                width: '100%'
            });
            loader.animate({
                top: '0',
                height: '100vh'
            });
        };

        /** This line hide loader and show content */
        setTimeout(function () {
            $(".loader-wrapper").fadeOut('fast');
            (loader).fadeOut('fast');
        }, 3500);


    /**
     * Document Ready
     */
    $(document).ready(function() {
        var unreadMessages = [];
        $.ajax({
            type: 'GET',
            url: '/profile/user/messages/fetch',
            success: function (response) {
                console.log(JSON.stringify(response));
                $('#messageCounter').text(response.length);
                for (var index = 0; index < response.length; index++) {
                    unreadMessages.push(response[index].creative);
                }
            }
        });
        $('#notificationLink').click(function () {
            var requestData = {messages: unreadMessages};
            $('#messageCounter').text('');
            $.ajax({
                type: 'POST',
                url: '/profile/user/messages/markread',
                data: requestData,
                success: function (response) {
                    console.log(response);
                }
            });
        });

        //Getting user profile
        var profile;
        var userObj = JSON.parse($('#userProfileObject').text());

        if (userObj.profile) {
            profile = userObj.profile;
        } else {
            profile = {};
        }
        var introText = [];

        if (profile.opportunitySeeking) {
            $('#' + profile.opportunitySeeking).attr('checked', 'checked');
        }

        /**
         * Contact Form
         */
        $('#submitTheVerificationRequest').on('click', function(e) {

            //TODO: validation!!!!

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

            //Introtext
            profile.displayName = $('#introText1').val();
            introText.push($('#introText1').val());
            introText.push($('#introText2').val());
            introText.push($('#introText3').val());

            //Opportunities
            profile['opportunitySeeking'] = $('input[name=opportunityOption]:checked').val();

            //Region
            profile['residence'] = $("#creativeRegion").select2().find(":selected").data().data.text;

            //requestData
            var requestData = {
                dataString: emailData,
                userProfile: profile,
                providerId: providerId
            };

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
        });

        /**
         * Editing the profile
         */

        function materialize(el) {
            $(el).find('input[class*=template-shield-], button[class*=template-shield-], label[class*=template-shield-], span[class*=template-shield-], textarea[class*=template-shield-], div[class*=template-shield-]').each(function(index) {
                //Remove template-shield- prefix
                var classes = $(this).prop('className').replace(/template-shield-/g, '');
                $(this).prop('className', classes);
            });

            return el;
        }

        function upgradeMaterialized(el) {
            $(el).find('.mdl-textfield, .mdl-button').each(function() {
                componentHandler.upgradeElement(this);
                $(this).addClass('is-dirty');
            });
        }

        function clean(obj) {
            var propNames = Object.getOwnPropertyNames(obj);
            for (var i = 0; i < propNames.length; i++) {
                var propName = propNames[i];
                if (obj[propName] === null || obj[propName] === undefined) {
                    delete obj[propName];
                }
            }
        }


        // --- Skills ---

        $('#add-a-skill-button').on('click', function() {
            var skillTemplate = $('#skill-template');
            var skillsUl = $('.skills');
            var skillsCount = $(skillsUl).children('.skill-item').length;
            var skillsId = skillsCount + 1;
            var materializedSkill;
            var addSkillContainer = $('#add-a-skill');
            var skillTitle = $(addSkillContainer).find('input#skill-name');
            var skillTitleValue = $(skillTitle).val();
            var skillRating = $(addSkillContainer).find('input#skill-rating-content');
            var skillRatingValue = $(skillRating).val();

            //Clone #skill-template element and materialize it
            var clonedSkill = $(skillTemplate)
                .clone(true, true)
                .prop('id', 'skill' + skillsId)
                .removeClass('hide-content');

            materializedSkill = materialize(clonedSkill);
            upgradeMaterialized(materializedSkill);

            $(materializedSkill).find('.main-content span.skill-title')
                .text(skillTitleValue)
                .attr('data-badge', 0);
            $(materializedSkill).find('.main-content li')
                .removeClass('skills-animated')
                .attr('data-percent', skillRatingValue);
            $(materializedSkill).find('.main-content span.skill-range')
                .attr({
                    'data-to': skillRatingValue,
                    'id': 'skill-range' + skillsId
                });

            $(materializedSkill).find('.editable-content input.skill-range-slider-template')
                .attr({
                    'id': 'skill-range-input' + skillsId,
                    'name': 'skill-range-input' + skillsId
                });
            $(materializedSkill).find('.editable-content input.mdl-textfield__input')
                .val(skillTitleValue);

            $(skillsUl).append(materializedSkill);
            SEMICOLON.widget.progress();

            //countTo is not called in SEMICOLON.widget.progress() and need to set value for ionRangeSlider
            $(materializedSkill).show(100, function() {
                $(this).find('.main-content span.skill-range').countTo();
                $('#skill-range-input' + skillsId).ionRangeSlider({
                    from: parseInt(skillRatingValue)
                });
            });

            //Add skill to db
            var skillSet = {
                skill: $(skillTitle).val(),
                rating: skillRatingValue,
                verifiedCount: 0
            };

            if (profile.skills) {
                profile.skills.push(skillSet);
            } else {
                var skillSetArr = [];
                skillSetArr.push(skillSet);
                profile['skills'] = skillSetArr;
            }

            //Reset input fields for creating a new skill
            $('#skill-rating-content').data("ionRangeSlider").update({from: 0});
            $('#skill-name').val('');
        });

        $('.save-skill-button').on('click', function() {
            var editableContent = $(this).parents('.editable-content');
            var mainContent = $(editableContent).siblings('.main-content');
            var newSkillName = $(editableContent).find('.mdl-textfield__input').val();
            var newSkillRatingValue = $(editableContent).find('.skill-range-slider-template').val();

            $(mainContent).find('span.skill-title').text(newSkillName);
            $(mainContent).find('li')
                .removeClass('skills-animated')
                .attr('data-percent', newSkillRatingValue)
                .css('width', '');
            var prev = $(mainContent).find('span.skill-range').attr('data-to');
            $(mainContent).find('span.skill-range').attr({
                'data-to': newSkillRatingValue,
                'data-from': prev
            });
            setTimeout(function() {
                SEMICOLON.widget.progress();
                $(mainContent).find('span.skill-range').countTo({
                    'from': parseInt(prev),
                    'to': parseInt(newSkillRatingValue)
                });
            }, 100);

            $(editableContent).addClass('hide-content');
            $(mainContent).removeClass('hide-content');
        });

        $('.cancel-skill-button').on('click', function() {
            $(this).parent('editable-content').addClass('hide-content');
        });

        $('.skill-item .remove-content').on('click', function() {
            var skillsItem = $(this).parents('.skill-item');
            var index = $(skillsItem).parent().index();

            //Remove skill
            profile.skills.splice(index - 1, 1);
            $(skillsItem).remove();
        });

        // --- Projects ---

        $('#add-project-button').on('click', function() {
            var addButtonContent = $(this).parents('.add-button-content')[0];
            var projectTitle = $(addButtonContent).find('#project-title').val();
            var projectDateTo = $(addButtonContent).find('#project-date-to').val();
            var projectDateFrom = $(addButtonContent).find('#project-date-from').val();
            var projectDesc = $(addButtonContent).find('#project-desc').val();

            var projectTimeline = $('#project-timeline');
            var projectCount = $(projectTimeline).children('.timeline-item').length;
            var projectId = projectCount + 1;

            if ($(projectTimeline).hasClass('hide-content')) {
                $(projectTimeline).removeClass('hide-content');
            }

            var projectTemplate = $('#project-template');
            var cloneProject = $(projectTemplate)
                .clone(true, true)
                .attr('id', 'project' + projectId)
                .removeClass('hide-content');

            var materializedProject = materialize(cloneProject);
            upgradeMaterialized(materializedProject);

            $(materializedProject).find('.mdl-badge').attr('data-badge', 0);
            $(materializedProject).find(".item-title").text(projectTitle);
            $(materializedProject).find('.item-period').text(projectDateFrom + ' - ' + projectDateTo);
            $(materializedProject).find('.item-description').text(projectDesc);

            $(materializedProject).find('.editable-content .project-title-content')
                .attr('id', 'project-title' + projectId)
                .val(projectTitle);
            $(materializedProject).find('.editable-content .project-date-to-content')
                .attr('id', 'project-date-to' + projectId)
                .val(projectDateTo);
            $(materializedProject).find('.editable-content .project-date-from-content')
                .attr('id', 'project-date-from' + projectId)
                .val(projectDateFrom);
            $(materializedProject).find('.editable-content .project-desc-content')
                .attr('id', 'project-desc' + projectId)
                .val(projectDesc);

            //Initialize datepicker
            $(materializedProject).find('.input-date-group-template input').datepicker({
                autoclose: true,
                viewMode: "years",
                minViewMode: 2,
                maxViewMode: 2,
                format: "yyyy"
            });

            //Add project to DB
            var experienceSet = {
                title: projectTitle,
                from: projectDateFrom,
                to: projectDateTo,
                description: projectDesc,
                verifiedCount: 0
            };
            if (profile.experiences) {
                profile.experiences.push(experienceSet);
            } else {
                var experienceSetArr = [];
                experienceSetArr.push(experienceSet);
                profile['experiences'] = experienceSetArr;
            }

            $(projectTimeline).append(materializedProject);

            //Reset input fields
            $('#project-title').val('');
            $('#project-date-from').val('');
            $('#project-date-to').val('');
            $('#project-desc').val('');

        });

        $('.save-project-button').on('click', function() {
            var editableContent = $(this).parents('.editable-content');
            var mainContent = $(editableContent).siblings('.main-content');

            $(mainContent).find('.item-title').text($(editableContent).find('.project-title-content').val());
            $(mainContent).find('.item-period')
                .text($(editableContent).find('.project-date-from-content').val() + ' - ' + $(editableContent).find('.project-date-to-content').val());
            $(mainContent).find('.item-description').text($(editableContent).find('.project-desc-content').val());

            $(editableContent).addClass('hide-content');
            $(mainContent).removeClass('hide-content');

        });

        $('.project-item .remove-content').on('click', function() {
            var project = $(this).parents('.timeline-item');
            var index = $(project).parent().index();

            //Remove skill
            profile.experiences.splice(index - 1, 1);
            $(project).remove();
        });

        // --- Education ---

        $('#add-edu-content').on('click', function() {
            var eduTimeline = $('#education-timeline');
            var eduCount = $(eduTemplate).children('.timeline-item').length;
            var eduId = eduCount + 1;

            var eduDegreeTitle = $('#edu-degree-title').val();
            var eduInstitution = $('#edu-institution').val();
            var eduDateFrom = $('#edu-date-from').val();
            var eduDateTo = $('#edu-date-to').val();
            var eduDesc = $('#edu-desc').val();

            var eduTemplate = $('#education-template');
            var cloneEdu = $(eduTemplate)
                .clone(true, true)
                .attr('id', 'education' + eduId)
                .removeClass('hide-content');

            var materializedEdu = materialize(cloneEdu);
            upgradeMaterialized(materializedEdu);

            $(materializedEdu).find(".item-title").text(eduDegreeTitle);
            $(materializedEdu).find('.item-period').text(eduDateFrom + ' - ' + eduDateTo);
            $(materializedEdu).find('.item-description').text(eduDesc);
            $(materializedEdu).find('.item-span').text(eduInstitution);

            $(materializedEdu).find('.editable-content .edu-degree-title-content')
                .attr('id', 'education-title' + eduId)
                .val(eduDegreeTitle);
            $(materializedEdu).find('.editable-content .edu-institution-content')
                .attr('id', 'education-institution' + eduId)
                .val(eduInstitution);
            $(materializedEdu).find('.editable-content .edu-date-from-content')
                .attr('id', 'education-date-from' + eduId)
                .val(eduDateFrom);
            $(materializedEdu).find('.editable-content .edu-date-to-content')
                .attr('id', 'education-date-to' + eduId)
                .val(eduDateTo);
            $(materializedEdu).find('.editable-content .edu-desc-content')
                .attr('id', 'education-desc' + eduId)
                .val(eduDesc);

            //Initialize datepicker
            $(materializedEdu).find('.input-date-group-template input').datepicker({
                autoclose: true,
                viewMode: "years",
                minViewMode: 2,
                maxViewMode: 2,
                format: "yyyy"
            });

            $(eduTimeline).append(materializedEdu);

            var educationSet = {
                degree: eduDegreeTitle,
                institute: eduInstitution,
                from: eduDateFrom,
                to: eduDateTo,
                description: eduDesc,
                verifiedCount: 0
            };

            if (profile.educations) {
                profile.educations.push(educationSet);
            } else {
                var educationSetArr = [];
                educationSetArr.push(educationSet);
                profile['educations'] = educationSetArr;
            }

            //Reset input fields for creating a new education item
            $('#edu-degree-title').val('');
            $('#edu-institution').val('');
            $('#edu-date-from').val('');
            $('#edu-date-to').val('');
            $('#edu-desc').val('');

        });

        $('.save-edu-content').on('click', function() {
            var editableContent = $(this).parents('.editable-content');
            var mainContent = $(editableContent).siblings('.main-content');

            $(mainContent).find('.item-title').text($(editableContent).find('.edu-degree-title-content').val());
            $(mainContent).find('.item-period')
                .text($(editableContent).find('.edu-date-from-content').val() + ' - ' + $(editableContent).find('.edu-date-to-content').val());
            $(mainContent).find('.item-span').text($(editableContent).find('.edu-institution-content').val());
            $(mainContent).find('.item-description').text($(editableContent).find('.edu-desc-content').val());

            $(editableContent).addClass('hide-content');
            $(mainContent).removeClass('hide-content');
        });

        $('.education-item .remove-content').on('click', function() {
            var project = $(this).parents('.timeline-item');
            var index = $(project).parent().index();

            //Remove skill
            profile.educations.splice(index - 1, 1);
            $(project).remove();
        });

        // --- Services ---

        $('#add-service-content').on('click', function() {
            var servicesContainer = $('#services-component');
            var servicesCount = $(servicesContainer).children('.service-item').length;
            var serviceId = servicesCount + 1;

            var serviceTemplate = $('#service-template');
            var serviceClone = $(serviceTemplate)
                .clone(true, true)
                .attr('id', 'service' + serviceId)
                .removeClass('hide-content');

            var serviceTitle = $('#service-title').val();
            var serviceDesc = $('#service-desc').val();
            var serviceIcon = $('#service-icon-selector').attr('data-selected');

            var materializedService = materialize(serviceClone);
            upgradeMaterialized(materializedService);

            $(materializedService).find('.main-content .service-icon a i').attr('class', 'fa ' + serviceIcon);
            $(materializedService).find('.main-content .service-title').text(serviceTitle);
            $(materializedService).find('.main-content .service-desc').text(serviceDesc);

            $(materializedService).find('.editable-content .service-title-content')
                .attr('id', 'service-title' + serviceId)
                .val(serviceTitle);
            $(materializedService).find('.editable-content .service-desc-content')
                .attr('id', 'service-desc' + serviceId)
                .val(serviceDesc);
            $(materializedService).find('.editable-content .service-icon-content')
                .attr('id', 'service-icon' + serviceId)
                .iconpicker({
                    selected: serviceIcon
                });

            $(servicesContainer).append(materializedService);
            $(materializedService).find('.feature-box').removeClass('not-animated').addClass('animated');

            var serviceSet = {
                service: serviceTitle,
                description: serviceDesc,
                icon: serviceIcon,
                verifiedCount: 0
            };

            if (profile.services) {
                profile.services.push(serviceSet);
            } else {
                var serviceSetArr = [];
                serviceSetArr.push(serviceSet);
                profile['services'] = serviceSetArr;
            }

            //Reset input fields for creating a new service item
            $('#service-title').val('');
            $('#service-desc').val('');
            $('#service-icon-selector').iconpicker({
                selected: false
            });

        });

        $('.save-service-content').on('click', function() {
            var editableContent = $(this).parents('.editable-content');
            var mainContent = $(editableContent).siblings('.main-content');

            $(mainContent).find('.service-title').text($(editableContent).find('.service-title-content').val());
            $(mainContent).find('.service-desc').text($(editableContent).find('.service-desc-content').val());
            $(mainContent).find('.service-icon i').attr('class', 'fa ' + $(editableContent).find('.service-icon-content').attr('data-selected'));

            $(editableContent).addClass('hide-content');
            $(mainContent).removeClass('hide-content');
        });

        $('.service-item .remove-content').on('click', function() {
            var service = $(this).parents('.service-item');
            var index = $(service).parent().index();

            //Remove service
            profile.services.splice(index - 1, 1);
            $(service).remove();
        });

        $('.cancel-project-button, .cancel-edu-content, .cancel-service-content').on('click', function() {
            var editableContent = $(this).parents('.editable-content');
            $(editableContent).addClass('hide-content');
            $(editableContent).siblings('.main-content').removeClass('hide-content');
            $(editableContent).parents('.hover-component').removeClass('add-box-shadow');
        });

		// --- Portfolio ---
		// $('#add-a-new-portfolio-button').on('click', function() {
		// 	var portfolioTemplate = $('#portfolio-template');
		// 	var portfolioClone = $(portfolioTempalte)
		// 		.clone('')
		// });

    });

})}) (jQuery);
