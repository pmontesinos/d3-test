threadMeUp.CountryDeathsChartView = Backbone.View.extend({

	el: $('.deaths-per-country'),
	data: [],
	width: null,
	height: null,
	margin: {top: 20, right: 30, bottom: 30, left: 40},
	x: null,

	initialize: function(options) {
		_.bindAll(this, 'resize');
		
		var rawData = options.data.strike;

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

	render: function() {
		this.assembleSvg();
		//this.$el.text(this.data);
	},

	assembleSvg: function() {
		this.width = parseInt(d3.select('main').style('width'), 10) - this.margin.left - this.margin.right,
    	this.height = parseInt(d3.select('main').style('height'), 10) - this.margin.top - this.margin.bottom;
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


		this.chart = d3.select(this.$el[0])
		    .attr("width", this.width + this.margin.left + this.margin.right)
		    .attr("height", this.height + this.margin.top + this.margin.bottom)
		    .append("g")
		    .attr("transform", "translate(" + this.margin.left + "," + this.margin.top + ")");


		this.x.domain(
			this.data.map(function(d) { 
				return d.country; 
		}));

		this.y.domain([0, d3.max(this.data, function(d) { 
			return d.totalDeaths; 
		})]);

		var barWidth = this.width / this.data.length;
/*
		var bar = chart.selectAll("g")
			.data(this.data)
			.enter()
			.append("g")
			.attr("transform", function(d) { 
				return "translate(" + x(d.country) + ",0)"; 
			});

		var rect = bar.append("rect")
	      .attr("y", function(d) { return y(d.totalDeaths); })
	      .attr("height", function(d) { return tempHeight - y(d.totalDeaths); })
	      .attr("width", x.rangeBand());

		var text = bar.append("text")
		  .attr("x", x.rangeBand() / 2)
		  .attr("y", function(d) { return y(d.totalDeaths) + 3; })
		  .attr("dy", ".75em")
		  .text(function(d) { return d.totalDeaths; });

*/
		this.chart.call(this.tip);

		this.chart.append("g")
			.attr("class", "x axis")
			.attr("transform", "translate(0," + this.height + ")")
			.call(this.xAxis);

		this.chart.append("g")
			.attr("class", "y axis")
			.call(this.yAxis)
			.append("text")
			.attr("transform", "rotate(-90)")
			.attr("y", 6)
			.attr("dy", ".71em")
			.style("text-anchor", "end")
			.text("Total Deaths by Drone Strike");



		this.bar = this.chart.selectAll(".bar")
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
	  			.style("fill","blue")
	  			.duration(500);
			});

			
			d3.select(window).on('resize', this.resize); 
		},

		resize: function() {
			var that = this;

			this.width = parseInt(d3.select(this.$el[0]).style('width'), 10);
			this.width = this.width - this.margin.left - this.margin.right;

			this.x.range([0, this.width]);

			d3.select(this.$el[0])
			.style('height', (this.height + this.margin.top + this.margin.bottom) + 'px')
			.style('width', (that.x.rangeExtent()[1] + this.margin.left + this.margin.right) + 'px');

			this.chart.selectAll('rect')
			.attr('height', function(d) { return that.x(d.totalDeaths); });

			// update median ticks
			var median = d3.median(this.chart.selectAll('.bar').data(), 
			function(d) { return d.totalDeaths; });


			// update axes
			this.chart.select('.x.axis').call(this.xAxis.orient('top'));
			this.chart.select('.x.axis').call(this.xAxis.orient('bottom'));

			

		}
});