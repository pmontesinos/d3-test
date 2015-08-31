threadMeUp.AppView = Backbone.View.extend({

	el: $('.container'),
	data: null,
	spinnerView: null,

	initialize: function() {
		this.spinnerView = new threadMeUp.SpinnerView();
	},

	render: function() {
		
		this.spinnerView.render();
		this.$el.append(this.spinnerView.$el);

		var that = this,
			droneData = new threadMeUp.AppModel();

		droneData.fetch({
			success: function(model, response, options) {
				that.data = response;
				that.renderApp();
			},
			error: function() {
				console.log('trouble loading data');
			}
		});
	},

	renderApp: function() {
		
		var countryDeathsChartView = new threadMeUp.CountryDeathsChartView({
			appEl: this.$el,
			data: this.data,
			spinner: this.spinnerView
		});

		var strikesPerYearPieView = new threadMeUp.StrikesPerYearPieView({
			appEl: this.$el,
			data: this.data,
			spinner: this.spinnerView
		});

		var buttonsView = new threadMeUp.ButtonsView({
			appEl: this.$el,
			spinner: this.spinnerView,
			barChart: countryDeathsChartView,
			pieChart: strikesPerYearPieView
		});

		buttonsView.render();

		countryDeathsChartView.render();
		this.$el.append(countryDeathsChartView.$el);
		countryDeathsChartView.assembleSvg();
	}
});