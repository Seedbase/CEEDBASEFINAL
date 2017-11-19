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

		function getIndexFromJSONArray(jsonArray, id) {
			for (var i = 0; i < jsonArray.length; i++) {
				if (id == jsonArray[i].id) {
					return i;
				}
			}
		}

		//Counts for maintaining how many skills have been Created
		var counts = {
			skillCount: 0,
			projectCount: 0,
			educationCount: 0,
			learningCount: 0,
			servicesCount: 0
		}

		if (!profile.counts) {
			var countSetArr = [];
			countSetArr.push(counts);
			profile['counts'] = countSetArr;
		}

		var skillCount = profile.counts.skillCount,
			projectCount = profile.counts.projectCount,
			educationCount = profile.counts.educationCount,
			learningCount = profile.counts.learningCount
			servicesCount = profile.counts.servicesCount;


        // --- Skills ---

        $('#add-a-skill-button').on('click', function() {
			//Get skill template
            var skillTemplate = $('#skill-template');

			//Get skills container
            var skillsUl = $('.skills');
            //var skillsCount = $(skillsUl).children('.skill-item').length;
            var skillsId = skillCount + 1;
            var materializedSkill;

			//Get container and fields for creating a new skill
            var addSkillContainer = $('#add-a-skill');
            var skillTitle = $(addSkillContainer).find('input#skill-name');
            var skillTitleValue = $(skillTitle).val();
            var skillRating = $(addSkillContainer).find('input#skill-rating-content');
            var skillRatingValue = $(skillRating).val();

			//Get edit dialog and main-content for new skill
			var dialog;
			var mainContent;

            //Clone #skill-template element and materialize it
            var clonedSkill = $(skillTemplate)
                .clone(true, true)
                .prop('id', 'skill' + skillsId)
                .removeClass('hide-content');

            materializedSkill = materialize(clonedSkill);
            upgradeMaterialized(materializedSkill);

			dialog = $(materializedSkill).find('.editable-content');
			mainContent = $(materializedSkill).find('.main-content');

			//For main content
            $(mainContent).find('span.skill-title')
                .text(skillTitleValue)
                .attr({
					'data-badge': 0,
					'id': 'skill-title' + skillsId
				});
            $(mainContent).find('li')
                .removeClass('skills-animated')
                .attr('data-percent', skillRatingValue);
            $(mainContent).find('span.skill-range')
                .attr({
                    'data-to': skillRatingValue,
                    'id': 'skill-range' + skillsId
                });
			$(mainContent).find('.edit-skill-button').on('click', function() {
				dialog[0].showModal();
			});

			//For dialog
            $(dialog).find('input.skill-range-slider-template')
                .attr({
                    'id': 'skill-range-input' + skillsId,
                    'name': 'skill-range-input' + skillsId
                });
            $(dialog).find('input.mdl-textfield__input')
                .val(skillTitleValue)
				.attr('id', 'skill-title-input' + skillsId);
			$(dialog).find('.close').on('click', function() {
				dialog[0].close();
			});

			//Append new skill to container
            $(skillsUl).append(materializedSkill);

			//Animate progress bar widget
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
				id: 'skill' + skillsId,
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
            $('#skill-rating-content').data("ionRangeSlider").update({from: 10});
            $('#skill-name').val('');
        });

        $('.save-skill-button').on('click', function() {
			var dialog = $(this).parents('.editable-content');
            var mainContent = $(dialog).siblings('.main-content');
			var skillId = $(this).parents('.skill-item').attr('id');
            var newSkillName = $(dialog).find('.mdl-textfield__input').val();
            var newSkillRatingValue = $(dialog).find('.skill-range-slider-template').val();

			//Update main content fields
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

			//Update skill JSONObject
			var skills = profile.skills;
			for (var i = 0; i < profile.skills.length; i++) {
				if (profile.skills[i].id == skillId) {
					profile.skills[i].skill = newSkillName;
					profile.skills[i].rating = parseInt(newSkillRatingValue);
					break;
				}
			}

			//Close dialog
			dialog[0].close();
        });

        // $('.cancel-skill-button').on('click', function() {
        //     $(this).parent('editable-content').addClass('hide-content');
        // });

        $('.skill-item .remove-content').on('click', function() {
            var skillsItem = $(this).parents('.skill-item');
			var skillId = $(skillsItem).attr('id');

			//Get index of JSONObject in profile.skills JSONArray
			var index = getIndexFromJSONArray(profile.skills, skillId);

            //Remove skill
            profile.skills.splice(index, 1);
            $(skillsItem).remove();
        });

        // --- Projects ---

        $('#add-project-button').on('click', function() {
			var addProjectContainer = $('#add-a-project');
			var projectTitle = $('#project-title').val();
			var projectDateTo = $('#project-date-to').val();
			var projectDateFrom = $('#project-date-from').val();
			var projectDesc = $('#project-desc').val();

            var projectTimeline = $('#project-timeline');
            //var projectCount = $(projectTimeline).children('.timeline-item').length;
            var projectId = projectCount + 1;

			var dialog;
			var mainContent;

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

			dialog = $(materializedProject).find('dialog.editable-content');
			mainContent = $(materializedProject).find('.main-content');

            $(mainContent).find(".item-title").text(projectTitle);
            $(mainContent).find('.item-period').text(projectDateFrom + ' - ' + projectDateTo);
            $(mainContent).find('.item-description').text(projectDesc);

            $(dialog).find('.project-title-content')
                .attr('id', 'project-title' + projectId)
                .val(projectTitle);
            $(dialog).find('.project-date-to-content')
                .attr('id', 'project-date-to' + projectId)
                .val(projectDateTo);
            $(dialog).find('.project-date-from-content')
                .attr('id', 'project-date-from' + projectId)
                .val(projectDateFrom);
            $(dialog).find('.project-desc-content')
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

			$(mainContent).find('.edit-project-button').on('click', function() {
				dialog[0].showModal();
			});
			$(dialog).find('.close').on('click', function() {
				dialog[0].close();
			});

            //Add project to DB
            var experienceSet = {
				id: 'project' + projectId,
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
            var dialog = $(this).parents('.editable-content');
            var mainContent = $(dialog).siblings('.main-content');
			var projectId = $(this).parents('.timeline-item').attr('id');

			var newProjectTitle = $(dialog).find('.project-title-content').val();
			var newProjectDateFrom = $(dialog).find('.project-date-from-content').val();
			var newProjectDateTo = $(dialog).find('.project-date-to-content').val();
			var newProjectDesc = $(dialog).find('.project-desc-content').val();

            $(mainContent).find('.item-title').text(newProjectTitle);
            $(mainContent).find('.item-period')
                .text(newProjectDateFrom + ' - ' + newProjectDateTo);
            $(mainContent).find('.item-description').text(newProjectDesc);

			//Update project JSONObject
			var projects = profile.experiences;
			for (var i = 0; i < profile.experiences.length; i++) {
				if (profile.experiences[i].id ==  projectId) {
					profile.experiences[i].title = newProjectTitle;
					profile.experiences[i].from = parseInt(newProjectDateFrom);
					profile.experiences[i].to = parseInt(newProjectDateTo);
					profile.experiences[i].desc = newProjectDesc;
					break;
				}
			}

			//Close dialog
			dialog[0].close();
        });

        $('.project-item .remove-content').on('click', function() {
            var project = $(this).parents('.timeline-item');
			var projectId = $(project).attr('id');
            var index = getIndexFromJSONArray(profile.experiences, projectId);

            //Remove skill
            profile.experiences.splice(index, 1);
            $(project).remove();
        });

        // --- Education ---

        $('#add-edu-content').on('click', function() {
            var eduTimeline = $('#education-timeline');
            var eduId = educationCount + 1;

			var dialog;
			var mainContent;

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

			dialog = $(materializedEdu).find('.editable-content');
			mainContent = $(materializedEdu).find('.main-content');

            $(materializedEdu).find(".item-title").text(eduDegreeTitle);
            $(materializedEdu).find('.item-period').text(eduDateFrom + ' - ' + eduDateTo);
            $(materializedEdu).find('.item-description').text(eduDesc);
            $(materializedEdu).find('.item-institute').text(eduInstitution);

            $(dialog).find('.edu-degree-title-content')
                .attr('id', 'education-title' + eduId)
                .val(eduDegreeTitle);
            $(dialog).find('.edu-institution-content')
                .attr('id', 'education-institution' + eduId)
                .val(eduInstitution);
            $(dialog).find('.edu-date-from-content')
                .attr('id', 'education-date-from' + eduId)
                .val(eduDateFrom);
            $(dialog).find('.edu-date-to-content')
                .attr('id', 'education-date-to' + eduId)
                .val(eduDateTo);
            $(dialog).find('.edu-desc-content')
                .attr('id', 'education-desc' + eduId)
                .val(eduDesc);

			$(mainContent).find('.edit-edu-button').on('click', function() {
				dialog[0].showModal();
			});
			$(dialog).find('.close').on('click', function() {
				dialog[0].close();
			});

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
				id: 'edu' + eduId,
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

        $('.save-edu-button').on('click', function() {
			var dialog = $(this).parents('.editable-content');
            var mainContent = $(dialog).siblings('.main-content');
			var eduId = $(this).parents('.education-item').attr('id');

			var newEduDegree = $(dialog).find('.edu-degree-title-content').val();
			var newEduInstitute = $(dialog).find('.edu-institution-content').val();
			var newEdutDateFrom = $(dialog).find('.edu-date-from-content').val();
			var newEduDateTo = $(dialog).find('.edu-date-to-content').val();
			var newEduDesc = $(dialog).find('.edu-desc-content').val();

            $(mainContent).find('.item-title').text(newEduDegree);
			$(mainContent).find('.item-institute').text(newEduInstitute);
            $(mainContent).find('.item-period')
                .text(newEdutDateFrom + ' - ' + newEduDateTo);
            $(mainContent).find('.item-description').text(newEduDesc);

			//Update education JSONObject
			var projects = profile.educations;
			for (var i = 0; i < profile.educations.length; i++) {
				if (profile.educations[i].id == eduId) {
					profile.educations[i].degree = newEduDegree;
					profile.educations[i].institute = newEduInstitute;
					profile.educations[i].from = parseInt(newEdutDateFrom);
					profile.educations[i].to = parseInt(newEdutDateTo);
					profile.educations[i].description = newEduDesc;
					break;
				}
			}

			//Close dialog
			dialog[0].close();
        });

        $('.education-item .remove-content').on('click', function() {
			var edu = $(this).parents('.education-item');
			var eduId = $(edu).attr('id');
			var index = getIndexFromJSONArray(profile.educations, eduId);

			//Remove education
			profile.educations.splice(index, 1);
			$(edu).remove();
        });

        // --- Services ---

        $('#add-service-content').on('click', function() {
            var servicesContainer = $('#services-component');
            var serviceId = servicesCount + 1;

			var dialog;
			var mainContent;

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

			var dialog = $(materializedService).find('.editable-content');
			var mainContent = $(materializedService).find('.main-content');

            $(mainContent).find('.service-icon a i').attr('class', 'fa ' + serviceIcon);
            $(mainContent).find('.service-title').text(serviceTitle);
            $(mainContent).find('.service-desc').text(serviceDesc);

            $(dialog).find('.service-title-content')
                .attr('id', 'service-title' + serviceId)
                .val(serviceTitle);
            $(dialog).find('.service-desc-content')
                .attr('id', 'service-desc' + serviceId)
                .val(serviceDesc);
            $(dialog).find('.service-icon-content')
                .attr('id', 'service-icon' + serviceId)
                .iconpicker({
                    selected: serviceIcon
                });

			$(mainContent).find('.edit-service-button').on('click', function() {
				dialog[0].showModal();
			});
			$(dialog).find('.close').on('click', function() {
				dialog[0].close();
			});

            $(servicesContainer).append(materializedService);
            $(mainContent).find('.feature-box').removeClass('not-animated').addClass('animated');

            var serviceSet = {
				id: "service" + serviceId,
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
            var dialog = $(this).parents('.editable-content');
            var mainContent = $(dialog).siblings('.main-content');
			var serviceId = $(mainContent).parents('.service-item').attr('id');

			var newServiceTitle = $(dialog).find('.service-title-content').val();
			var newServiceDesc = $(dialog).find('.service-desc-content').val();
			var newServiceIcon = $(dialog).find('.service-icon-content').attr('data-selected');

            $(mainContent).find('.service-title').text(newServiceTitle);
            $(mainContent).find('.service-desc').text(newServiceDesc);
            $(mainContent).find('.service-icon i').attr('class', 'fa ' + newServiceIcon);

			//Update education JSONObject
			var services = profile.services;
			for (var i = 0; i < profile.services.length; i++) {
				if (profile.services[i].id == serviceId) {
					profile.services[i].service = newServiceTitle;
					profile.services[i].description = newServiceDesc;
					profile.services[i].icon = newServiceIcon;
					break;
				}
			}

			//Close dialog
			dialog[0].close();
        });

        $('.service-item .remove-content').on('click', function() {
            var service = $(this).parents('.service-item');
			var serviceId = $(service).attr('id');
            var index = getIndexFromJSONArray(profile.services, serviceId);

            //Remove service
            profile.services.splice(index, 1);
            $(service).remove();
        });

    });

})}) (jQuery);
