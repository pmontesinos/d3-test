threadMeUp.CountryDeathsChartView = Backbone.View.extend({

	className: 'svg-container',
	data: [],
	spinner: null,
	appEl: null,
	width: null,
	height: null,
	margin: {top: 20, right: 30, bottom: 30, left: 40},
	x: null,
	title: 'Total Deaths By Drone Strike Per Country',

	svgTemplate: _.template('<svg class="bar chart"></svg>'),

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
		var countriesObj = _.groupBy(rawData, 'country');
		var countries = _.keys(countriesObj);

		var sums = [];

		_.each(countriesObj, function(country) {
			var allDeaths = _.pluck(country, 'deaths_max');
			
			var sum = _.reduce(allDeaths, function(memo, num) { 
				var convertedNumber = parseInt(num);
				return ($.isNumeric(convertedNumber) ? memo + convertedNumber : memo);
			}, 0);

			sums.push(sum);
		});

		for (var i = 0; i < countries.length; i++) {
			var obj = {
				'country': countries[i],
				'totalDeaths': sums[i]
			};

			this.data.push(obj);
		}

		this.data = _.sortBy(this.data, 'country');
	},

	assembleSvg: function() {
		this.width = parseInt(d3.select(this.$el[0]).style('width'), 10) - this.margin.left - this.margin.right,
    	this.height = parseInt(d3.select(this.$el[0]).style('height'), 10) - this.margin.top - this.margin.bottom;
    	var tempHeight = this.height,
    	that = this;

		this.x = d3.scale.ordinal()
    		.rangeRoundBands([0, this.width], .3);

		this.y = d3.scale.linear()
    		.range([this.height, 0]);

    	
		this.xAxis = d3.svg.axis()
		    .scale(this.x)
		    .orient("bottom");

		this.yAxis = d3.svg.axis()
			.scale(this.y)
			.orient("left");

		this.tip = d3.tip()
		  .attr('class', 'd3-tip')
		  .offset([-10, 0])
		  .html(function(d) {
		    return "<strong>Total Deaths:</strong> <span style='color:red'>" + d.totalDeaths + "</span>";
		  });


		this.chart = d3.select(this.$el.find('svg')[0])
		    .attr("width", this.width + this.margin.left + this.margin.right)
		    .attr("height", this.height + this.margin.top + this.margin.bottom);

		this.mainGroup = this.chart.append("g")
		    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


		this.x.domain(
			this.data.map(function(d) { 
				return d.country; 
		}));

		this.y.domain([0, d3.max(this.data, function(d) { 
			return d.totalDeaths; 
		})]);


		this.chart.call(this.tip);

		this.mainGroup.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + this.height + ")")
			.call(this.xAxis);

		this.mainGroup.append("g")
			.attr("class", "y axis")
			.call(this.yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Total Deaths by Drone Strike");



		this.bar = this.mainGroup.selectAll(".bar")
			.data(this.data)
			.enter()
			.append("rect")
			.attr("class", "bar")
			.attr("x", function(d) { return that.x(d.country); })
			.attr("y", function(d) { return tempHeight; })
			.attr("height", function(d) { return 0; })
			.attr("width", this.x.rangeBand())
			.on('mouseover', this.tip.show)
      		.on('mouseout', this.tip.hide)
			.transition()
			.duration(500) 
			.attr("height", function(d) { return tempHeight - that.y(d.totalDeaths); })
			.attr("y", function(d) { return that.y(d.totalDeaths); })
			.each("end", function() {
				d3.select(this)
				.transition()
	  			.style("fill","#5A527B")
	  			.duration(500);
			});

			
			d3.select(window).on('resize', this.resize); 
		},

		resize: function() {
			var that = this;

			this.width = parseInt(d3.select(this.$el[0]).style('width'), 10) - this.margin.left - this.margin.right;
			this.height = parseInt(d3.select(this.$el[0]).style('height'), 10) - this.margin.top - this.margin.bottom;

			this.x.rangeBands([0, this.width], 0.3);
			d3.select('.x.axis')
				.attr("transform", "translate(0," + this.height + ")")
				.call(this.xAxis);

			this.y.range([this.height, 0]);
			d3.select('.y.axis').call(this.yAxis);
			this.yAxis.ticks(Math.max(this.height/50, 2));

			this.chart
				.attr("width", this.width + this.margin.left + this.margin.right)
		    	.attr("height", this.height + this.margin.top + this.margin.bottom);

			this.bar = this.mainGroup.selectAll(".bar")
				.data(this.data);

			this.bar
				.enter()
				.append('rect');

			this.bar
				.exit()
				.remove();

			this.bar
				.transition()
				.attr("class", "bar")
				.attr("x", function(d) { return that.x(d.country); })
				.attr("width", this.x.rangeBand())
				.attr("height", function(d) { return that.height - that.y(d.totalDeaths); })
				.attr("y", function(d) { return that.y(d.totalDeaths); });
		},

		destroy: function() {
			this.undelegateEvents();

			this.$el.removeData().unbind();

			this.chart.selectAll("*").remove();

			this.remove();  
			Backbone.View.prototype.remove.call(this);
		}
});