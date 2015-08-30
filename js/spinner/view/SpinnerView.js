threadMeUp.SpinnerView = Backbone.View.extend({

	className: 'loader-container',

	spinnerTemplate: _.template('<div class="loader">Loading…</div>'),

	initialize: function() {
		var that = this;
	},

	render: function() {
		this.$el.html(this.spinnerTemplate());
	},

	remove: function() {
		this.$el.remove();
	}
});