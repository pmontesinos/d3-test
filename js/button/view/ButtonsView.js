threadMeUp.ButtonsView = Backbone.View.extend({

	el: $('.buttons'),
	spinner: null,
	appEl: null,
	data: [],

	events: {
		'click .bar-chart': 'renderBarChart',
		'click .pie-chart': 'renderPieChart',
	},

	initialize: function(options) {
		_.bindAll(this, 'createBarChart', 'createPieChart');

		var that = this;
		this.spinner = options.spinner;
		this.appEl = options.appEl;
	},

	render: function() {},

	renderBarChart: function() {
		this.$el.append(this.spinner.render());
		this.emptySvg();
		this.loadData(this.createBarChart);
	},

	renderPieChart: function() {
		this.$el.append(this.spinner.render());
		this.emptySvg();
		this.loadData(this.createPieChart);
	},

	loadData: function(callback) {
		var droneData = new threadMeUp.AppModel(),
			that = this;

		droneData.fetch({
			success: function(model, response, options) {
				that.data = response;
				callback();
			},
			error: function() {
				console.log('trouble loading data');
			}
		});
	},

	emptySvg: function() {
		d3.select('.chart').selectAll("*").remove();
	},


	createBarChart: function() {

		var countryDeathsChartView = new threadMeUp.CountryDeathsChartView({
			data: this.data,
			spinner: this.spinner
		});
		countryDeathsChartView.render();
	},

	createPieChart: function() {
		var strikesPerYearPieView = new threadMeUp.StrikesPerYearPieView({
			data: this.data,
			spinner: this.spinner
		});
		strikesPerYearPieView.render();
	}
});