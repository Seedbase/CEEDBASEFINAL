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
                $('.messageCounter').text(response.length);
                // for (var index = 0; index < response.length; index++) {
                //     unreadMessages.push(response[index].creative);
                // }
				if (response.length > 0) {
					unreadMessages.push(response);
				}
            }
        });
        $('#notificationLink').click(function () {
            var requestData = {messages: unreadMessages};
            $('.messageCounter').text('0');

			//Display unreadMessages
			var messageUl = $('#messageUl');
			var messageTemplate = $('#messageTemplate');
			var unreadMessage;

			for (var i = 0; i < unreadMessages.length; i++) {
				unreadMessage = $(messageTemplate)
					.clone()
					.removeClass('hide-content');
				$(unreadMessage).find('#messageName').text(unreadMessages[i].client.companyName);
				$(unreadMessage).find('#messageDesc').text(unreadMessages[i].client.message);
				$(messageUl).append(unreadMessage);
			}

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
        var profile,
			introText;
        var userObj = JSON.parse($('#userProfileObject').text());

        if (userObj.profile) {
            profile = userObj.profile;
        } else {
            profile = {};
        }

		if (profile.introText) {
			introText = profile.introText;
		} else {
			introText = [];
		}

		if (profile.residence) {
			$('#creativeRegion').val(profile.residence);
			$('#creativeRegion').trigger('change');
		}

        if (profile.opportunitySeeking) {
            $('#' + profile.opportunitySeeking).attr('checked', 'checked');
        }

		function updateProfile() {
			var providerId = $('#providerId').val();
			var message = $("#authenticatorMessage").val();
			//TODO: allow user to change email
			var emailData = {
				fromName: $("#authenticatorName").val(),
				fromEmail: userObj.email,
				toEmail: $("#authenticatorEmail").val(),
				subject: $("#authenticatorSubject").val(),
				message: $("#authenticatorMessage").val()
			};

			//Update Counts
			profile.counts.skillCount = skillCount;
			profile.counts.projectCount = projectCount;
			profile.counts.learningCount = learningCount;
			profile.counts.educationCount = educationCount;
			profile.counts.servicesCount = servicesCount;

			//Introtext
			/*
				Note that introText[0] is the same as profile.displayName
				profile.displayName appears in profile.ejs
			*/
			introText.push($('#introText1').val());
			introText.push($('#introText2').val());
			introText.push($('#introText3').val());
			profile['introText'] = introText;

			profile['displayName'] = $('#introText1').val();

			//Video Resume
			if ($('#videoResume').text()) {
				profile['videoResume'] = JSON.parse($('#videoResume').text());
			}

			//Opportunities
			profile['opportunitySeeking'] = $('input[name=opportunityOption]:checked').val();

			//Region
			profile['residence'] = $("#creativeRegion").select2().find(":selected").data().data.text;

			//Passion
			profile['passion'] = $('#passion').val();

			//requestData
			var requestData = {
				dataString: emailData,
				userProfile: profile,
				providerId: providerId
			};

			return requestData;
		}

        /**
         * Contact Form
         */
        $('#submitTheVerificationRequest').on('click', function(e) {

            //Validate before submission
			var validateContactForm = validateMDLFields(document.querySelector('#contactForm'));
			var validateIntro = validateMDLFields(document.querySelector('#intro-profile'))

			e.preventDefault();

			if (validateContactForm && validateIntro) {
				var requestData = updateProfile();

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
			}
        });

		/**
		Save Profile
		*/
		$('#saveProfile').on('click', function(e) {
			e.preventDefault();

			//Validate before submission
			//var validateContactForm = validateMDLFields(document.querySelector('#contactForm'));
			var validateIntro = validateMDLFields(document.querySelector('#intro-profile'));

			if (validateIntro) {
				var requestData = updateProfile();

				$.ajax({
					type: 'POST',
					url: '/profile/user/save',
					data: requestData,
					success: function() {
						alert('Profile saved successfully.');
					}
				});

			}
		});

        /**
         * Editing the profile
         */

	 	/*
	 	For MDL Lite -> need to "materialize" MDL components after programmatically changing their values
		"template-shield-" prefix is added to components so that they don't "materialize" on load,
		but only when their values have changed programmatically
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

		//Used to grab index of JSON object
		//Note that JSONObjects in jsonArray (in user.profile) are in ascending order
		function getIndexFromJSONArray(jsonArray, id) {
			for (var i = 0; i < jsonArray.length; i++) {
				if (id == jsonArray[i].id) {
					return i;
				}
			}
		}

		// //Clear MDL textfield components in el
		// function clearFields(el) {
		// 	$(el).find('input[type=text], textarea')
		// 		.val('')
		// 		.parents('.mdl-textfield').removeClass('is-dirty');
		// 	$(el).find('select').find('option').prop('selected', false);
		// 	$(el).find('input[type=radio]').prop('checked', false);
		// }

		//Validate MDL textfield components in el
		function validateFields(el) {
			//var submit = false;
			// Check the validity state and update field accordingly.
			el.querySelectorAll("input[data-required], textarea[data-required]").forEach(function (e) {
				e.setAttribute('required', true);
				e.parentElement.MaterialTextfield.checkValidity();
			   // if (e.parentElement.MaterialTextfield.input_.validity.valid && $(e).val() != "") {
				//    submit = true;
			   // } else {
				//    submit = false;
				//    break;
			   // }
			});

			//return submit;
		}

		function validateMDLFields(el) {
			var submit = false;
			var mdlTextfields = el.querySelectorAll('input, textarea');
			for (var i = 0; i < mdlTextfields.length; i++) {
				if ($(mdlTextfields[i]).parents('.mdl-textfield').hasClass('is-invalid')) {
					submit = false;
					break;
				} else {
					submit = true;
				}
			}
			return submit;
		}

		//Validate bootstrap iconpicker
		function validateServiceIconpicker(el) {
			var submit = false;
			//Check that an icon has been selected
			var iconpickers = el.querySelectorAll('div.service-iconpicker');
			for (var i = 0; i < iconpickers.length; i++) {
				var error = $(iconpickers[i]).siblings('.mdl-textfield__error')[0];
				if ($(iconpickers[i]).attr('data-selected') == 'empty') {
					$(error).css('visibility', 'visible');
					submit = false;
					break;
				} else {
					$(error).css('visibility', 'hidden');
					submit = true;
				}
			}
			// el.querySelectorAll("div.service-iconpicker[data-required]").forEach(function(e) {
			// 	var error = $(e).siblings('.mdl-textfield__error');
			// 	if ($(e).attr('data-selected') != 'empty') {
			// 		submit = true;
			// 		$(error).css('visibility', 'hidden');
			// 	} else {
			// 		submit = false;
			// 		$(error).css('visibility', 'visible');
			// 	}
			// });

			return submit;
		}

		// function removeRequired(el) {
		// 	el.querySelectorAll("input[data-required], textarea[data-required]").forEach(function(e) {
		// 		e.setAttribute('required', false);
		// 		$(e.parentElement).removeClass('is-invalid');
		// 	});
		// 	clearFields(el);
		// }

		//Counts for maintaining how many skills have been created
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

			validateFields(addSkillDialog);

			var canAdd = validateMDLFields(addSkillDialog);

			if (canAdd) {
				//Get skill template
	            var skillTemplate = $('#skill-template');

				//Get skills container
	            var skillsUl = $('.skills');
				skillCount++;
	            var skillsId = skillCount;
	            var materializedSkill;

				//Get container and fields for creating a new skill
	            var skillTitle = $('#skill-name').val();
	            var skillRating = $('#skill-rating').val();

				//Get edit dialog and main-content for new skill
				var mainContent;

	            //Clone #skill-template element and materialize it
	            var clonedSkill = $(skillTemplate)
	                .clone(true, true)
	                .prop('id', 'skill' + skillsId)
	                .removeClass('hide-content');

	            materializedSkill = materialize(clonedSkill);
	            upgradeMaterialized(materializedSkill);

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

				//Append new skill to container
	            $(skillsUl).append(materializedSkill);

	            //countTo is not called in SEMICOLON.widget.progress() and need to set value for ionRangeSlider
	            $(materializedSkill).show(100, function() {
					$('#skill-range-input' + skillsId).ionRangeSlider({
	                    from: parseInt(skillRating)
	                });
					//Animate progress bar widget
		            SEMICOLON.widget.progress();
	                $(this).find('.main-content span.skill-range').countTo();
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
				//removeRequired(addSkillDialog);
			}
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
			var id = $(editSkillDialog).attr('data-dataID');
            var mainContent = $('#skill' + id);

			validateFields(editSkillDialog);

			var canSave = validateMDLFields(editSkillDialog);

			if (canSave) {
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
			}
        });

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

			validateFields(addProjectDialog);

			var canAdd = validateMDLFields(addProjectDialog);

			if (canAdd) {
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

				//Materialize input fields (necessary for MDL Lite)
	            var materializedProject = materialize(cloneProject);
	            upgradeMaterialized(materializedProject);

				mainContent = $(materializedProject).find('.main-content');

				//Set new values
	            $(mainContent).find(".item-title").text(projectTitle);
	            $(mainContent).find('.item-period').text(projectDateFrom + ' - ' + projectDateTo);
	            $(mainContent).find('.item-description').text(projectDesc);

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
			}

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

        $('#save-project-button').on('click', function() {
			var id = $(editProjectDialog).attr('data-dataID');
            var mainContent = $("#project" + id);

			validateFields(editProjectDialog);

			var canSave = validateMDLFields(editProjectDialog);

			if (canSave) {
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
			}
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

		// --- Learning ---

        $('#add-learning-button').on('click', function() {

			validateFields(addLearningDialog);

			var canAdd = validateMDLFields(addLearningDialog);

			if (canAdd) {
				//Get values from add dialog
				var learningTitle = $('#learning-title').val();
				var learningDateTo = $('#learning-date-to').val();
				var learningDateFrom = $('#learning-date-from').val();
				var learningDesc = $('#learning-desc').val();

				//Get container to append new learning
				var learningTimeline = $('#learning-timeline');

				//Get new learning ID
				learningCount++;
				var learningId = learningCount;

				//Get template to clone
				var learningTemplate = $('#learning-template');
				var cloneLearning = $(learningTemplate)
					.clone(true, true)
					.attr('id', 'learning' + learningId)
					.removeClass('hide-content');

				//Get edit dialog and main-content for new project
				var mainContent;

				//Materialize input fields (necessary for MDL Lite)
				var materializedLearning = materialize(cloneLearning);
				upgradeMaterialized(materializedLearning);

				mainContent = $(materializedLearning).find('.main-content');

				//Set new values
				$(mainContent).find(".item-title").text(learningTitle);
				$(mainContent).find('.item-period').text(learningDateFrom + ' - ' + learningDateTo);
				$(mainContent).find('.item-description').text(learningDesc);

				$(mainContent).find('.edit-learning-button').on('click', function() {
					uploadLearningData(learningId);
					editLearningDialog.showModal();
				});

				//Add project to DB
				var learningSet = {
					id: 'learning' + learningId,
					title: learningTitle,
					from: learningDateFrom,
					to: learningDateTo,
					description: learningDesc,
					verifiedCount: 0
				};

				if (profile.externalLinks) {
					profile.externalLinks.push(learningSet);
				} else {
					var learningSetArr = [];
					learningSetArr.push(learningSet);
					profile['externalLinks'] = learningSetArr;
				}

				$(learningTimeline).append(materializedLearning);

				//Reset input fields
				clearFields(addLearningDialog);
			}

        });

		function uploadLearningData(learningId) {
			$(editLearningDialog).attr('data-dataID', learningId);
			var links = profile.externalLinks;
			var data;

			//Find JSONObject with learningId
			//Note: currently there are only 6 learning allowed
			for (var i = 0; i < links.length; i++) {
				if (links[i].id == 'learning' + learningId) {
					data = links[i];
					break;
				}
			}

			//Set fields
			$('#edit-learning-title')
				.val(data.title)
				.parents('.mdl-textfield').addClass('is-dirty');
			$('#edit-learning-date-from').val(data.from);
			$('#edit-learning-date-to').val(data.to);
			$('#edit-learning-desc')
				.val(data.description)
				.parents('.mdl-textfield').addClass('is-dirty');
		}


        $('#save-learning-button').on('click', function() {
			var id = $(editLearningDialog).attr('data-dataID');
            var mainContent = $("#learning" + id);

			validateFields(editLearningDialog);

			var canSave = validateMDLFields(editLearningDialog);

			if (canSave) {
				var newLearningTitle = $('#edit-learning-title').val();
				var newLearningDateFrom = $('#edit-learning-date-from').val();
				var newLearningDateTo = $('#edit-learning-date-to').val();
				var newLearningDesc = $('#edit-learning-desc').val();

	            $(mainContent).find('.item-title').text(newLearningTitle);
	            $(mainContent).find('.item-period')
	                .text(newLearningDateFrom + ' - ' + newLearningDateTo);
	            $(mainContent).find('.item-description').text(newLearningDesc);

				//Update project JSONObject
				var projects = profile.externalLinks;
				for (var i = 0; i < profile.externalLinks.length; i++) {
					if (profile.externalLinks[i].id ==  'learning' + id) {
						profile.externalLinks[i].title = newLearningTitle;
						profile.externalLinks[i].from = parseInt(newLearningDateFrom);
						profile.externalLinks[i].to = parseInt(newLearningDateTo);
						profile.externalLinks[i].desc = newLearningDesc;
						break;
					}
				}

				//Close and reset dialog
				clearFields(editLearningDialog);
				editLearningDialog.close();
			}
        });

        $('#delete-learning-button').on('click', function() {
			var id = $(editLearningDialog).attr('data-dataID');
            var learning = $('#learning' + id);
            var index = getIndexFromJSONArray(profile.externalLinks, 'learning' + id);

            //Remove project
            profile.externalLinks.splice(index, 1);
            $(learning).remove();

			//Close and reset dialog
			clearFields(editLearningDialog);
			editLearningDialog.close();
        });

        // --- Education ---

        $('#add-edu-button').on('click', function() {

			validateFields(addEduDialog);

			var canAdd = validateMDLFields(addEduDialog);

			if (canAdd) {
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
				// $(editEduDialog).find('.close').on('click', function() {
				// 	clearFields(editEduDialog);
				// 	editEduDialog.close();
				// });

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
			}
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

			validateFields(editEduDialog);

			var canSave = validateMDLFields(editEduDialog);

			if (canSave) {
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
			}
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

			validateFields(addServiceDialog);

			var canAdd = validateMDLFields(addServiceDialog);
			var validateIconpicker = validateServiceIconpicker(addServiceDialog);

			if (canAdd && validateIconpicker) {
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

	            $(mainContent).find('.service-icon i').attr('class', 'fa ' + serviceIcon);
	            $(mainContent).find('.service-title').text(serviceTitle);
	            $(mainContent).find('.service-desc').text(serviceDesc);

				$(mainContent).find('.edit-service-button').on('click', function() {
					uploadService(serviceId);
					editServiceDialog.showModal();
				});
				// $(editServiceDialog).find('.close').on('click', function() {
				// 	clearFields(editServiceDialog);
				// 	$('#edit-service-iconpicker').iconpicker('setIcon', 'fa-');
				// 	editServiceDialog.close();
				// });

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
	            $('#service-iconpicker').iconpicker('setIcon', 'empty');
			}

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

			validateFields(editServiceDialog);

			var canSave = validateMDLFields(editServiceDialog) && validateServiceIconpicker(editServiceDialog);

			if (canSave) {
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
				$('#edit-service-iconpicker').iconpicker('setIcon', 'empty');
				editServiceDialog.close();
			}
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
			$('#edit-service-iconpicker').iconpicker('setIcon', 'empty');
			editServiceDialog.close();
        });

		/* --- Manage Account --- */

		$('#saveEmail').on('click', function(e) {
			e.preventDefault();
			userObj['email'] = $('#changeEmail').val();
		});

		$('#cancelEmail').on('click', function(e) {
			e.preventDefault();
			$('#changeEmail').val(userObj.email);
		});

    });

})}) (jQuery);
