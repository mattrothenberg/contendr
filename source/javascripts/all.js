//= require_tree .

$(document).ready(function() {

	cartodb.createVis('map', 'https://mrothenberg.cartodb.com/api/v2/viz/c00b64f8-efa6-11e4-8b57-0e853d047bba/viz.json')
		.done(function(vis, layers) {
			layers[1].on('featureClick', function(e, latlng, pos, data) {
				console.log(this);
				$('.rubber_stamp').remove();

				var district_id = data.cartodb_id;
				var appInstructionDiv = $('.app-instructions');
				var appPlaceholderMessage= $('.app-placeholder');
				var district_information_container = $('.district-information');
				var district_id_display = $(".district-id");

				console.log(this);

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
					var parsed = NameParse.parse(repName);
					console.log(parsed);
					$('.rep-name').html(repName);

					$.getJSON('http://openstates.org/api/v1/legislators/?apikey=ba9b8faa7fa14a52b22569c402b975c6&state=ga&chamber=upper&district=' + district_id, function(data) {
						$('.rep-img').attr("src", data[0].photo_url);
						$('.rep-figure').append('<div class="rubber_stamp animated bounceInDown">Unopposed</div>');
					})
				});

			})
		});
});