//= require_tree .

$(document).ready(function() {

	init(); 

	function init() {
		splashModal();
		generateMap();
		injectSVG();
		fabSplashModalTrigger();
		// modalCloseBehavior();
	}

	function splashModal() {

		$("#splashModal").openModal({
			complete: function() { 

				if ( $("#fab").hasClass("hide") ) {
					$("#fab").toggleClass("hide");
				}

				if ( $('.rep-card').hasClass("fadeOutDown")  && $('.rep-card').hasClass("initialized")  ) {
					$('.rep-card').toggleClass('fadeOutDown fadeInUp');
				}
			} 
		});
	}

	function fabSplashModalTrigger() {
		$("#fabSplashModalTrigger").on("click", function(event) {

			if ( $(".rep-card").hasClass('initialized') ) {
				$('.rep-card').removeClass("fadeInUp").toggleClass('fadeOutDown');
			}

			event.preventDefault();
			splashModal();
		})
	}

	function injectSVG() {
		// Elements to inject
		var mySVGsToInject = $('img.inject-me');

		// Do the injection
		SVGInjector(mySVGsToInject);
	}

	function clearRepCard() {
		$('.rubber_stamp').remove();

		// Remove party affiliation
		$('.rep-party').removeClass("democrat").removeClass("republican");

		// Remove name
		$('.rep-name').html("");
		$('.rep-email').attr("href", "").html("");

	}

	function generateMap() {
		cartodb.createVis('map', 'https://mrothenberg.cartodb.com/api/v2/viz/c00b64f8-efa6-11e4-8b57-0e853d047bba/viz.json')
			.done(function(vis, layers) {
				layers[1].on('featureClick', function(e, latlng, pos, data) {
					$('.rep-card').addClass("initialized");
					if ( $( '.rep-card' ).hasClass('hide') ) {
						$('.rep-card').removeClass("hide");
					} else {
						$('.rep-card').removeClass("fadeInUp").toggleClass("fadeOutDown");
						clearRepCard();
						$('.rep-card').removeClass("fadeOutDown").toggleClass("fadeInUp");
						// one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', doSomething);
					}
					

					var district_id = data.cartodb_id;
					var appInstructionDiv = $('.app-instructions');
					var appPlaceholderMessage= $('.app-placeholder');
					var district_information_container = $('.district-information');
					var district_id_display = $(".district-id");

					// Hide your kids, hide your instructions
					$(appInstructionDiv).addClass("hide");

					if ( $(district_information_container).hasClass("hide") ) {
						$(district_information_container).removeClass("hide");
						$(district_id_display).html(district_id);
					} else {
						$(district_id_display).html(district_id);
					}

					$.getJSON('https://'+ 'mrothenberg' +'.cartodb.com/api/v2/sql/?q='+ 'SELECT representative from georgia_senate_merge where cartodb_id = ' + district_id, function(data) {
						var repName = data.rows[0].representative;

						$.getJSON('http://openstates.org/api/v1/legislators/?apikey=ba9b8faa7fa14a52b22569c402b975c6&state=ga&chamber=upper&district=' + district_id, function(data) {
							// $('.rep-headshot').attr("src", data[0].photo_url);

							$('.rep-card .card-image').css("background", 'url(' + data[0].photo_url + ') no-repeat center center');

							if ( data[0].party == "Democratic" ) {
								$('.rep-party').addClass("democrat");
							} else if ( data[0].party == "Republican" ) {
								$('.rep-party').addClass("republican");
							} else {}

							$('.rep-name').html(data[0].full_name);
							$('.rep-email').html(data[0].email).attr("href", "mailto:" + data[0].email);
							$('.rep-stamp').append('<div class="rubber_stamp animated bounceInDown">Unopposed</div>');

						})

					});

				})
			});
	}
});