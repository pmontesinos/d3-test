threadMeUp.DroneCollection = Backbone.Collection.extend({

	model: threadMeUp.DroneModel(),

	url: 'http://api.dronestre.am/data'
});