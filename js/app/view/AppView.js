threadMeUp.AppView = Backbone.View.extend({

	el: $('body'),
	data: null,

	initialize: function() {
		console.log('initializing appview');
		
		var url = 'http://api.dronestre.am/data?callback=?',
			that = this;

		$.ajax({
		   type: 'GET',
		    url: url,
		    async: false,
		    jsonpCallback: 'jsonCallback',
		    contentType: "application/json",
		    dataType: 'jsonp',
		    success: function(json) {
		      that.data = json;
		      that.render();
		    },
		    error: function(e) {
		       console.log(e.message);
		    }
		});



	},

	render: function() {
		var countryDeathsChartView = new threadMeUp.CountryDeathsChartView({
			data: this.data
		});
		countryDeathsChartView.render();
	}
});