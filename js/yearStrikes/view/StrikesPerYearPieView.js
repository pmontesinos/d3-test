threadMeUp.StrikesPerYearPieView = Backbone.View.extend({

	className: 'svg-container',
	data: [],
	appEl: null,
	spinner: null,
	width: null,
	height: null,
	radius: null,
	group: null,
	color: null,
	arc: null,
	pie: null,
	tip: null,
	margin: {top: 20, right: 30, bottom: 30, left: 40},
	x: null,
	title: 'Drone Strikes Per Year in the Mid-East',

	svgTemplate: _.template('<svg class="pie chart"></svg>'),

	initialize: function(options) {
		_.bindAll(this, 'resize');
		
		var rawData = options.data.strike;
		this.spinner = options.spinner;
		this.appEl = options.appEl;

		this.formatData(rawData);
	},

	render: function() {
		this.spinner.remove();
		this.$el.html(this.svgTemplate());
		this.appEl.find('h1').text(this.title);
	},

	formatData: function(rawData) {
		var yearsArray = _.pluck(rawData, 'date');

		yearsArray = _.map(yearsArray, function(index) {
			var date = new Date(index);
			var year = date.getFullYear();
			return year;
		});

		var strikes = _.countBy(yearsArray, function(year) {
			return year.toString();
		});

		this.data = _.map(strikes, function(value, key) {
			var obj = {
				'year': key,
				'strikes': value
			};

			return obj;
		});
	},

	assembleSvg: function() {
		var that = this;

		this.width = parseInt(d3.select(this.$el[0]).style('width'), 10) - this.margin.left - this.margin.right,
    	this.height = parseInt(d3.select(this.$el[0]).style('height'), 10) - this.margin.top - this.margin.bottom;
    	this.radius = Math.min(this.width, this.height) / 2;

    	this.color = d3.scale.category20c();

    	this.tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([50, -30])
		  .html(function(d) {
		    return "<h1>Year: " + d.data.year + "</h1><span style='color:red'>" + d.data.strikes + "</span>";
		  });

    	this.chart = d3.select(this.$el.find('svg')[0])
			.attr('width', this.width)
			.attr('height', this.height);

		this.group = this.chart
			.append('g')
			.attr('transform', 'translate(' + (this.width / 2) +  ',' + (this.height / 2) + ')');

		this.chart.call(this.tip);

		this.arc = d3.svg.arc()
			.outerRadius(this.radius);

		this.pie = d3.layout.pie()
			.value(function(d) { return d.strikes; })
			.sort(null);

		this.path = this.group.selectAll("path")
				.data(this.pie(this.data))
				.enter()
				.append('path')
				.attr('class', 'slice')
				.attr('d', this.arc)
				.attr('fill', function(d, i) { 
					return that.color(d.data.strikes);
				})
				.on('mouseover', this.tip.show)
      			.on('mouseout', this.tip.hide);

      	d3.select(window).on('resize', this.resize); 
	},

	resize: function() {
		var that = this;

		this.width = parseInt(d3.select(this.$el[0]).style('width'), 10) - this.margin.left - this.margin.right,
    	this.height = parseInt(d3.select(this.$el[0]).style('height'), 10) - this.margin.top - this.margin.bottom;
    	this.radius = Math.min(this.width, this.height) / 2;

    	this.color = d3.scale.category20c();

    	this.tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([50, -30])
		  .html(function(d) {
		    return "<h1>Year: " + d.data.year + "</h1><span style='color:red'>" + d.data.strikes + "</span>";
		  });

    	this.chart = d3.select(this.$el.find('svg')[0])
			.attr('width', this.width)
			.attr('height', this.height);


		this.chart.call(this.tip);

		d3.select(this.$el[0]).selectAll('g')
			.remove();

		this.group = this.chart
			.append('g')
			.attr('transform', 'translate(' + (this.width / 2) +  ',' + (this.height / 2) + ')');

		this.arc = d3.svg.arc()
			.outerRadius(this.radius);

		this.pie = d3.layout.pie()
			.value(function(d) { return d.strikes; })
			.sort(null);

		this.path = this.group.selectAll("path")
			.data(this.pie(this.data));

		this.path
			.enter()
			.append('path');

		this.path
			.exit()
			.remove();

		this.path
			.attr('fill', function(d, i) { 
				return that.color(d.data.strikes);
			})
			.attr('class', 'slice')
			.attr('d', this.arc)
			.on('mouseover', this.tip.show)
      		.on('mouseout', this.tip.hide);
	},

	destroy: function() {
		this.undelegateEvents();

		this.$el.removeData().unbind();

		this.chart.selectAll("*").remove();

		this.remove();  
		Backbone.View.prototype.remove.call(this);
	}
});