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

		function clearFields(el) {
			$(el).find('input[type=text], textarea')
				.val('')
				.parents('.mdl-textfield').removeClass('is-dirty');
			$(el).find('select').find('option').prop('selected', false);
			$(el).find('input[type=radio]').prop('checked', false);
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
			profile['counts'] = counts;
		}

		var skillCount = profile.counts.skillCount,
			projectCount = profile.counts.projectCount,
			educationCount = profile.counts.educationCount,
			learningCount = profile.counts.learningCount,
			servicesCount = profile.counts.servicesCount;

        // --- Skills ---

        $('#add-a-skill-button').on('click', function() {
			//Get skill template
            var skillTemplate = $('#skill-template');

			//Get skills container
            var skillsUl = $('.skills');
			skillCount++;
            var skillsId = skillCount;
            var materializedSkill;

			//Get container and fields for creating a new skill
            //var addSkillContainer = $('#add-a-skill');
            var skillTitle = $('#skill-name').val();
            //var skillTitleValue = $(skillTitle).val();
            var skillRating = $('#skill-rating').val();
            //var skillRatingValue = $(skillRating).val();

			//Get edit dialog and main-content for new skill
			var mainContent;

            //Clone #skill-template element and materialize it
            var clonedSkill = $(skillTemplate)
                .clone(true, true)
                .prop('id', 'skill' + skillsId)
                .removeClass('hide-content');

            materializedSkill = materialize(clonedSkill);
            upgradeMaterialized(materializedSkill);

		//	dialog = $(materializedSkill).find('.editable-content');
			mainContent = $(materializedSkill).find('.main-content');

			//For main content
            $(mainContent).find('span.skill-title')
                .text(skillTitle)
                .attr({
					'data-badge': 0,
					'id': 'skill-title' + skillsId
				});
            $(mainContent).find('li')
                .removeClass('skills-animated')
                .attr('data-percent', skillRating);
            $(mainContent).find('span.skill-range')
                .attr({
                    'data-to': skillRating,
                    'id': 'skill-range' + skillsId
                });

			$(mainContent).find('.edit-skill-button').on('click', function() {
				uploadSkill(skillsId);
				editSkillDialog.showModal();
			});

			//For dialog
            // $(dialog).find('input.skill-range-slider-template')
            //     .attr({
            //         'id': 'skill-range-input' + skillsId,
            //         'name': 'skill-range-input' + skillsId
            //     });
            // $(dialog).find('input.mdl-textfield__input')
            //     .val(skillTitleValue)
			// 	.attr('id', 'skill-title-input' + skillsId);

			//Append new skill to container
            $(skillsUl).append(materializedSkill);

			//Animate progress bar widget
            SEMICOLON.widget.progress();

            //countTo is not called in SEMICOLON.widget.progress() and need to set value for ionRangeSlider
            $(materializedSkill).show(100, function() {
                $(this).find('.main-content span.skill-range').countTo();
                $('#skill-range-input' + skillsId).ionRangeSlider({
                    from: parseInt(skillRating)
                });
            });

            //Add skill to db
            var skillSet = {
				id: 'skill' + skillsId,
                skill: skillTitle,
                rating: skillRating,
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
            $('#skill-rating').data("ionRangeSlider").update({from: 10});
            clearFields(addSkillDialog);
        });

		function uploadSkill(skillId) {
			$(editSkillDialog).attr('data-dataID', skillId);
			var skills = profile.skills;
			var data;

			for (var i = 0; i < skills.length; i++) {
				if (skills[i].id == 'skill' + skillId) {
					data = skills[i];
					break;
				}
			}

			$('#edit-skill-name')
				.val(data.skill)
				.parents('.mdl-textfield').addClass('is-dirty');
			$('#edit-skill-rating').data('ionRangeSlider').update({from: parseInt(data.rating)});
		}

        $('#save-skill-button').on('click', function() {
			//var dialog = $(this).parents('.editable-content');
			var id = $(editSkillDialog).attr('data-dataID');
            var mainContent = $('#skill' + id);
			//var skillId = $(this).parents('.skill-item').attr('id');
            var newSkillName = $('#edit-skill-name').val();
            var newSkillRating = $('#edit-skill-rating').val();

			//Update main content fields
            $(mainContent).find('span.skill-title').text(newSkillName);
            $(mainContent).find('li')
                .removeClass('skills-animated')
                .attr('data-percent', newSkillRating)
                .css('width', '');
            var prev = $(mainContent).find('span.skill-range').attr('data-to');
            $(mainContent).find('span.skill-range').attr({
                'data-to': newSkillRating,
                'data-from': prev
            });
            setTimeout(function() {
                SEMICOLON.widget.progress();
                $(mainContent).find('span.skill-range').countTo({
                    'from': parseInt(prev),
                    'to': parseInt(newSkillRating)
                });
            }, 100);

			//Update skill JSONObject
			var skills = profile.skills;
			for (var i = 0; i < profile.skills.length; i++) {
				if (profile.skills[i].id == 'skill' + id) {
					profile.skills[i].skill = newSkillName;
					profile.skills[i].rating = parseInt(newSkillRating);
					break;
				}
			}

			//Close dialog
			editSkillDialog.close();
			clearFields(editSkillDialog);
			$('#edit-skill-rating').data('ionRangeSlider').update({from: 10});
        });

        // $('.cancel-skill-button').on('click', function() {
        //     $(this).parent('editable-content').addClass('hide-content');
        // });

        $('#delete-skill-button').on('click', function() {
			var id = $(editSkillDialog).attr('data-dataID');
            var skillsItem = $('#skill' + id);

			//Get index of JSONObject in profile.skills JSONArray
			var index = getIndexFromJSONArray(profile.skills, 'skill' + id);

            //Remove skill
            profile.skills.splice(index, 1);
            $(skillsItem).remove();

			//Clear dialog and fields
			clearFields(editSkillDialog);
			$('#edit-skill-rating').data('ionRangeSlider').update({from: 10});
			editSkillDialog.close();
        });

        // --- Projects ---

        $('#add-project-button').on('click', function() {

			//Get values from add dialog
			var projectTitle = $('#project-title').val();
			var projectDateTo = $('#project-date-to').val();
			var projectDateFrom = $('#project-date-from').val();
			var projectDesc = $('#project-desc').val();

			//Get container to append new project
            var projectTimeline = $('#project-timeline');

			//Get new project ID
			projectCount++;
            var projectId = projectCount;

			//Get template to clone
			var projectTemplate = $('#project-template');
            var cloneProject = $(projectTemplate)
                .clone(true, true)
                .attr('id', 'project' + projectId)
                .removeClass('hide-content');

			//Get edit dialog and main-content for new project
			var mainContent;

            // if ($(projectTimeline).hasClass('hide-content')) {
            //     $(projectTimeline).removeClass('hide-content');
            // }

			//Materialize input fields (necessary for MDL Lite)
            var materializedProject = materialize(cloneProject);
            upgradeMaterialized(materializedProject);

			mainContent = $(materializedProject).find('.main-content');

			//Set new values
            $(mainContent).find(".item-title").text(projectTitle);
            $(mainContent).find('.item-period').text(projectDateFrom + ' - ' + projectDateTo);
            $(mainContent).find('.item-description').text(projectDesc);

            // $(dialog).find('.project-title-content')
            //     .attr('id', 'project-title' + projectId)
            //     .val(projectTitle);
            // $(dialog).find('.project-date-to-content')
            //     .attr('id', 'project-date-to' + projectId)
            //     .val(projectDateTo);
            // $(dialog).find('.project-date-from-content')
            //     .attr('id', 'project-date-from' + projectId)
            //     .val(projectDateFrom);
            // $(dialog).find('.project-desc-content')
            //     .attr('id', 'project-desc' + projectId)
            //     .val(projectDesc);

            //Initialize datepicker
            // $(materializedProject).find('.input-date-group-template input').datepicker({
            //     autoclose: true,
            //     viewMode: "years",
            //     minViewMode: 2,
            //     maxViewMode: 2,
            //     format: "yyyy"
            // });

			$(mainContent).find('.edit-project-button').on('click', function() {
				uploadProjectData(projectId);
				editProjectDialog.showModal();
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
			clearFields(addProjectDialog);
            // $('#project-title').val('');
            // $('#project-date-from').val('');
            // $('#project-date-to').val('');
            // $('#project-desc').val('');

        });

		function uploadProjectData(projectId) {
			$(editProjectDialog).attr('data-dataID', projectId);
			var experiences = profile.experiences;
			var data;

			//Find JSONObject with projectId
			//Note: currently there are only 6 projects allowed
			for (var i = 0; i < experiences.length; i++) {
				if (experiences[i].id == 'project' + projectId) {
					data = experiences[i];
					break;
				}
			}

			//Set fields
			$('#edit-project-title')
				.val(data.title)
				.parents('.mdl-textfield').addClass('is-dirty');
			$('#edit-project-date-from').val(data.from);
			$('#edit-project-date-to').val(data.to);
			$('#edit-project-desc')
				.val(data.description)
				.parents('.mdl-textfield').addClass('is-dirty');
		}

        $('.save-project-button').on('click', function() {
			var id = $(editProjectDialog).attr('data-dataID');
            var mainContent = $("#project" + id);

			var newProjectTitle = $('#edit-project-title').val();
			var newProjectDateFrom = $('#edit-project-date-from').val();
			var newProjectDateTo = $('#edit-project-date-to').val();
			var newProjectDesc = $('#edit-project-desc').val();

            $(mainContent).find('.item-title').text(newProjectTitle);
            $(mainContent).find('.item-period')
                .text(newProjectDateFrom + ' - ' + newProjectDateTo);
            $(mainContent).find('.item-description').text(newProjectDesc);

			//Update project JSONObject
			var projects = profile.experiences;
			for (var i = 0; i < profile.experiences.length; i++) {
				if (profile.experiences[i].id ==  'project' + id) {
					profile.experiences[i].title = newProjectTitle;
					profile.experiences[i].from = parseInt(newProjectDateFrom);
					profile.experiences[i].to = parseInt(newProjectDateTo);
					profile.experiences[i].desc = newProjectDesc;
					break;
				}
			}

			//Close and reset dialog
			clearFields(editProjectDialog);
			editProjectDialog.close();
        });

        $('#delete-project-button').on('click', function() {
			var id = $(editProjectDialog).attr('data-dataID');
            var project = $('#project' + id);
            var index = getIndexFromJSONArray(profile.experiences, 'project' + id);

            //Remove project
            profile.experiences.splice(index, 1);
            $(project).remove();

			//Close and reset dialog
			clearFields(editProjectDialog);
			editProjectDialog.close();
        });

        // --- Education ---

        $('#add-edu-button').on('click', function() {
            var eduTimeline = $('#education-timeline');
			educationCount++;
            var eduId = educationCount;

			var mainContent;

            var eduDegreeTitle = $('#edu-degree-title').val();
            var eduInstitution = $('#edu-institution').val();
            var eduDateFrom = $('#edu-date-from').val();
            var eduDateTo = $('#edu-date-to').val();
            var eduDesc = $('#edu-desc').val();

			//Get education template and clone it
            var eduTemplate = $('#education-template');
            var cloneEdu = $(eduTemplate)
                .clone(true, true)
                .attr('id', 'education' + eduId)
                .removeClass('hide-content');

            var materializedEdu = materialize(cloneEdu);
            upgradeMaterialized(materializedEdu);

			mainContent = $(materializedEdu).find('.main-content');

            $(materializedEdu).find(".item-title").text(eduDegreeTitle);
            $(materializedEdu).find('.item-period').text(eduDateFrom + ' - ' + eduDateTo);
            $(materializedEdu).find('.item-description').text(eduDesc);
            $(materializedEdu).find('.item-institute').text(eduInstitution);

			$(mainContent).find('.edit-edu-button').on('click', function() {
				uploadEducation(eduId);
				editEduDialog.showModal();
			});
			$(dialog).find('.close').on('click', function() {
				clearFields(editEduDialog);
				editEduDialog.close();
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
			clearFields(addEduDialog);
        });

		function uploadEducation(eduId) {
			$(editEduDialog).attr('data-dataID', eduId);
			var education = profile.educations;
			var data;

			for (var i = 0; i < education.length; i++) {
				if (education[i].id == 'edu' + eduId) {
					data = education[i];
					break;
				}
			}

			$('#edit-edu-degree-title')
				.val(data.degree)
				.parents('.mdl-textfield').addClass('is-dirty');
			$('#edit-edu-institution')
				.val(data.institute)
				.parents('.mdl-textfield').addClass('is-dirty');
			$('#edit-edu-date-from').val(data.from);
			$('#edit-edu-date-to').val(data.to);
			$('#edit-edu-desc')
				.val(data.description)
				.parents('.mdl-textfield').addClass('is-dirty');
		}

        $('#save-edu-button').on('click', function() {
			var id = $(editEduDialog).attr('data-dataID');
            var mainContent = $('#edu' + id);

			var newEduDegree = $('#edit-edu-degree-title').val();
			var newEduInstitute = $('#edit-edu-institution').val();
			var newEdutDateFrom = $('#edit-edu-date-from').val();
			var newEduDateTo = $('#edit-edu-date-to').val();
			var newEduDesc = $('#edit-edu-desc').val();

            $(mainContent).find('.item-title').text(newEduDegree);
			$(mainContent).find('.item-institute').text(newEduInstitute);
            $(mainContent).find('.item-period')
                .text(newEdutDateFrom + ' - ' + newEduDateTo);
            $(mainContent).find('.item-description').text(newEduDesc);

			//Update education JSONObject
			var projects = profile.educations;
			for (var i = 0; i < profile.educations.length; i++) {
				if (profile.educations[i].id == 'edu' + id) {
					profile.educations[i].degree = newEduDegree;
					profile.educations[i].institute = newEduInstitute;
					profile.educations[i].from = parseInt(newEdutDateFrom);
					profile.educations[i].to = parseInt(newEduDateTo);
					profile.educations[i].description = newEduDesc;
					break;
				}
			}

			//Close dialog
			clearFields(editEduDialog);
			editEduDialog.close();
        });

        $('#delete-edu-button').on('click', function() {
			var id = $(editEduDialog).attr('data-dataID');
			var edu = $('edu' + id);
			var index = getIndexFromJSONArray(profile.educations, 'edu' + id);

			//Remove education
			profile.educations.splice(index, 1);
			$(edu).remove();

			//Clear fields and close dialog
			clearFields(editEduDialog);
			editEduDialog.close();
        });

        // --- Services ---

        $('#add-service-button').on('click', function() {
            var servicesContainer = $('#services-component');
			servicesCount++;
            var serviceId = servicesCount;

			var mainContent;

            var serviceTemplate = $('#service-template');
            var serviceClone = $(serviceTemplate)
                .clone(true, true)
                .attr('id', 'service' + serviceId)
                .removeClass('hide-content');

            var serviceTitle = $('#service-title').val();
            var serviceDesc = $('#service-desc').val();
            var serviceIcon = $('#service-iconpicker').attr('data-selected');

            var materializedService = materialize(serviceClone);
            upgradeMaterialized(materializedService);

			var mainContent = $(materializedService).find('.main-content');

            $(mainContent).find('.service-icon a i').attr('class', 'fa ' + serviceIcon);
            $(mainContent).find('.service-title').text(serviceTitle);
            $(mainContent).find('.service-desc').text(serviceDesc);

            // $(dialog).find('.service-title-content')
            //     .attr('id', 'service-title' + serviceId)
            //     .val(serviceTitle);
            // $(dialog).find('.service-desc-content')
            //     .attr('id', 'service-desc' + serviceId)
            //     .val(serviceDesc);
            // $(dialog).find('.service-icon-content')
            //     .attr('id', 'service-icon' + serviceId)
            //     .iconpicker({
            //         selected: serviceIcon
            //     });

			$(mainContent).find('.edit-service-button').on('click', function() {
				uploadService(serviceId);
				editServiceDialog.showModal();
			});
			$(dialog).find('.close').on('click', function() {
				clearFields(editServiceDialog);
				$('#edit-service-iconpicker').iconpicker('setIcon', 'fa-');
				editServiceDialog.close();
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
            clearFields(addServiceDialog);
            $('#service-iconpicker').iconpicker('setIcon', 'fa-');

        });

		function uploadService(serviceId) {
			$(editServiceDialog).attr('data-dataID', serviceId);
			var services = profile.services;
			var data;

			for (var i = 0; i < services.length; i++) {
				if (services[i].id == 'service' + serviceId) {
					data = services[i];
					break;
				}
			}

			$('#edit-service-title')
				.val(data.service)
				.parents('.mdl-textfield').addClass('is-dirty');
			$('#edit-service-desc')
				.val(data.description)
				.parents('.mdl-textfield').addClass('is-dirty');
			$('#edit-service-iconpicker').iconpicker('setIcon', data.icon);
		}

        $('#save-service-button').on('click', function() {
			var id = $(editServiceDialog).attr('data-dataID');
            var mainContent = $('#service' + id);

			var newServiceTitle = $('#edit-service-title').val();
			var newServiceDesc = $('#edit-service-desc').val();
			var newServiceIcon = $('#edit-service-iconpicker').attr('data-selected');

            $(mainContent).find('.service-title').text(newServiceTitle);
            $(mainContent).find('.service-desc').text(newServiceDesc);
            $(mainContent).find('.service-icon i').attr('class', 'fa ' + newServiceIcon);

			//Update education JSONObject
			var services = profile.services;
			for (var i = 0; i < profile.services.length; i++) {
				if (profile.services[i].id == 'service' + id) {
					profile.services[i].service = newServiceTitle;
					profile.services[i].description = newServiceDesc;
					profile.services[i].icon = newServiceIcon;
					break;
				}
			}

			//Clear fields and close dialog
			clearFields(editServiceDialog);
			$('#edit-service-iconpicker').iconpicker('setIcon', 'fa-');
			editServiceDialog.close();
        });

        $('#delete-service-button').on('click', function() {
			var id = $(editServiceDialog).attr('data-dataID');
            var service = $('#service' + id);
            var index = getIndexFromJSONArray(profile.services, 'service' + id);

            //Remove service
            profile.services.splice(index, 1);
            $(service).remove();

			//Clear fields and close dialog
			clearFields(editServiceDialog);
			$('#edit-service-iconpicker').iconpicker('setIcon', 'fa-');
			editServiceDialog.close();
        });

    });

})}) (jQuery);
