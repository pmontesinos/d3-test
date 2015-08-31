threadMeUp.ButtonsView = Backbone.View.extend({

	el: $('.buttons'),
	spinner: null,
	appEl: null,
	barChart: null,
	pieChart: null,
	barButton: null,
	pieButton: null,
	data: [],

	events: {
		'click .bar-chart:not(.inactive)': 'renderBarChart',
		'click .pie-chart:not(.inactive)': 'renderPieChart',
	},

	initialize: function(options) {
		_.bindAll(this, 'createBarChart', 'createPieChart');

		var that = this;
		this.spinner = options.spinner;
		this.appEl = options.appEl;
		this.barChart = options.barChart;
		this.pieChart = options.pieChart;
	},

	render: function() {
		this.barButton = this.$el.find('.bar-chart');
		this.pieButton = this.$el.find('.pie-chart');
		this.barButton.addClass('inactive');
	},

	renderBarChart: function() {
		this.spinner.render();
		this.appEl.append(this.spinner.$el);
		this.pieChart.destroy();
		this.loadData(this.createBarChart);

	},

	renderPieChart: function() {
		this.spinner.render();
		this.appEl.append(this.spinner.$el);
		this.barChart.destroy();
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

	createBarChart: function() {
		this.barButton.addClass('inactive');
		this.pieButton.removeClass('inactive');

		this.barChart = new threadMeUp.CountryDeathsChartView({
			appEl: this.appEl,
			data: this.data,
			spinner: this.spinner
		});
		
		this.barChart.render();
		this.appEl.append(this.barChart.$el);
		this.barChart.assembleSvg();
	},

	createPieChart: function() {
		this.pieButton.addClass('inactive');
		this.barButton.removeClass('inactive');

		this.pieChart = new threadMeUp.StrikesPerYearPieView({
			appEl: this.appEl,
			data: this.data,
			spinner: this.spinner
		});
		
		this.pieChart.render();
		this.appEl.append(this.pieChart.$el);
		this.pieChart.assembleSvg();
	}
});