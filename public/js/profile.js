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
            var introText = [];
        }

        if (profile.opportunitySeeking) {
            $('#' + profile.opportunitySeeking).attr('checked', 'checked');
        }

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

            $(materializedSkill).find('.main-content span.skill-title').text(skillTitleValue);
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
                .val(skillTitleValue)
                .parent().addClass('is-dirty');

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
                rating: skillRatingValue
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

            $(materializedProject).find(".item-title").text(projectTitle);
            $(materializedProject).find('.item-period').text(projectDateFrom + ' - ' + projectDateTo);
            $(materializedProject).find('.item-description').text(projectDesc);

            $(materializedProject).find('.editable-content .project-title-content')
                .attr('id', 'project-title' + projectId)
                .val(projectTitle)
                .parent().addClass('is-dirty');
            $(materializedProject).find('.editable-content .project-date-to-content')
                .attr('id', 'project-date-to' + projectId)
                .val(projectDateTo)
                .parent().addClass('is-dirty');
            $(materializedProject).find('.editable-content .project-date-from-content')
                .attr('id', 'project-date-from' + projectId)
                .val(projectDateFrom)
                .parent().addClass('is-dirty');
            $(materializedProject).find('.editable-content .project-desc-content')
                .attr('id', 'project-desc' + projectId)
                .val(projectDesc)
                .parent().addClass('is-dirty');

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
                description: projectDesc
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
                .val(eduDegreeTitle)
                .parent().addClass('is-dirty');
            $(materializedEdu).find('.editable-content .edu-institution-content')
                .attr('id', 'education-institution' + eduId)
                .val(eduInstitution)
                .parent().addClass('is-dirty');
            $(materializedEdu).find('.editable-content .edu-date-from-content')
                .attr('id', 'education-date-from' + eduId)
                .val(eduDateFrom)
                .parent().addClass('is-dirty');
            $(materializedEdu).find('.editable-content .edu-date-to-content')
                .attr('id', 'education-date-to' + eduId)
                .val(eduDateTo)
                .parent().addClass('is-dirty');
            $(materializedEdu).find('.editable-content .edu-desc-content')
                .attr('id', 'education-desc' + eduId)
                .val(eduDesc)
                .parent().addClass('is-dirty');

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
                description: eduDesc
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

        $('.cancel-project-button, .cancel-edu-content').on('click', function() {
            var editableContent = $(this).parents('.editable-content');
            $(editableContent).addClass('hide-content');
            $(editableContent).siblings('.main-content').removeClass('hide-content');
        });

    });

})}) (jQuery);