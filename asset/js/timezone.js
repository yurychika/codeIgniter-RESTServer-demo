console.log(angular.module('project'));
window.currentGMT = new Date().getTimezoneOffset() / -60;

window.getTimeByTimezone = function(timezone) {
	var timezone = parseInt(timezone.substr(3));
	offset = timezone - currentGMT;
	var date = new Date();
	date = new Date(date.getTime() + offset * 3600 * 1000);
	return moment(date).format('MMMM Do YYYY, HH:mm:ss a');
}

Array.prototype.delete = function(id){
	var len = this.length;
	for(var i = 0; i < len; i++){
		if(this[i].hasOwnProperty('id') && this[i].id === id){
			this.splice(i, 1);
			return this;
		}
	}
	return this;
}

Array.prototype.getById = function(id){
	var len = this.length;
	for(var i = 0; i < len; i++){
		if(this[i].hasOwnProperty('id') && this[i].id === id){
			// var o = {};
			// for(var k in this[i]){
			// 	if(this[i].hasOwnProperty(k)){
			// 		o[k] = this[i][k];
			// 	}
			// }
			// return o
			return this[i];
		}
	}
	return null;
}

Array.prototype.replaceById = function(id, r){
	var len = this.length;
	for(var i = 0; i < len; i++){
		if(this[i].hasOwnProperty('id') && this[i].id === id){
			this[i] = r;
			return true;
		}
	}
	return false;
}

angular.module('project')
.factory('Timezone', function($http, User, $interval){
	var service = {

		data: [],

		errors: [],

		initialized: false,

		//GET
		get: function(callback){
			if(service.initialized){
				callback();
				return;
			}
			$http({
				method: 'GET',
				url: siteUrl + '/REST/timezone/get',
				headers: {
					'X-API-KEY': User.apikey
				}
			})
			.success(function(data) {
				if (data.error) {
					service.errors.push('Error happens');
				} else {
					service.data = data.data;
					service.data.forEach(function(data) {
						data.currentTime = getTimeByTimezone(data.timezone);
						console.log(data.timezone, data.currentTime);
					});
					service.initialized = true;
					callback();
				}
			})
			.error(function(data){
				alert(data.error);
			});
		},

		//POST
		add: function(name, city, timezone, callback) {
			var data = {name: name, city: city, timezone: timezone, apikey: User.apikey};

			$http({
				method: 'POST',
				url: siteUrl + '/REST/timezone/add',
				headers: {
					'X-API-KEY': User.apikey
				},
				data: data
			})
			.success(function(data){
				if(data.status === 'success'){
					service.data.push(data.data);
				}
				callback(true);
			})
			.error(function(data){
				alert(data.error);
			});

		},

		// addComment: function(id, comment, callback){
		// 	var data = {id: id, comment: comment};

		// 	$http.post(siteUrl + '/REST/expense/addComment', data)
		// 	.success(function(data){
		// 		if(data.status === 'success'){
		// 			service.data.getById(id).comments.push(data.data);
		// 			callback(true);
		// 		}
		// 	})
		// 	.error(function(){
		// 		callback(false);
		// 	});

		// },

		//PUT
		update: function(timezone, callback){
			var data = {
				id: timezone.id,
				name: timezone.name,
				city: timezone.city,
				timezone: timezone.timezone,
				apikey: User.apikey
			};

			return $http({
				method: 'PUT',
				url: siteUrl + '/REST/timezone/update',
				headers: {
					'X-API-KEY': User.apikey
				},
				data: data
			});

			// $http.put(siteUrl + '/REST/timezone/update', data)
		},

		//DELETE
		delete: function(id, callback){
			var data = {id: id, apikey: User.apikey};
			return $http({
				method: 'POST',
				url: siteUrl + '/REST/timezone/delete/id/' + id,
				headers: {
					'X-API-KEY': User.apikey
				},
				data: data
			})
			// return $http.delete(siteUrl + '/REST/timezone/delete/id/' + id)
		}
	};
	$interval(function() {
		service.data.forEach(function(data) {
			// console.log(data);
			data.currentTime = getTimeByTimezone(data.timezone);
		});
		// console.log('update time');
	}, 1000);
	// service.get(function(data){});
	return service;
})

.controller('timezoneController', function($scope, User, Timezone, $location, $http){
	$scope.errors = [];
	$scope.timezones = [];

	var _getCallback = function(data){
		$scope.timezones = Timezone.data;
	};

	var _addCallback = function(success){
		// if(data.status === 'success'){
		// 	$scope.expenses.push(data.data);
		if(success){
			$location.path('/timezone');
		}
		// }

	};

	var _validate = function() {
		var name = $('#name').val(),
			city = $('#city').val(),
			timezone = $('#timezone').val();
			// date = $('#date').val(),
			// time = $('#time').val();

		if (!name || !city || !timezone) {
			this.errors.push('No fields should be empty!');
		}
		if (name.length > 20 || city.length > 20) {
			this.errors.push('Name or city should not exceed 20 chars!');
		}
		this.name = name;
		this.city = city;
		this.timezone = timezone;
		// this.date = date;
		// this.time = time;
		return !this.errors.length;
	};

	if(!User.islogin){
		$location.path('/');
		return;
	}
	
	Timezone.get(_getCallback);


	$scope.goToAdd = function(){
		$location.path('/add');
	};

	$scope.goToEdit = function(id){
		$location.path('/edit/' + id);
	};

	$scope.add = function(){
		if (_validate.apply(this, null)) {
			Timezone.add(this.name, this.city, this.timezone, _addCallback)
		}
	};

	$scope.delete = function(id){
		var _deleteCallback = function(success){
			// if(data.status === 'success'){
			// 	$location.path('/');
			// }
			// $scope.timezones = Timezone.data;

			if (success) {
				console.log(Timezone.data);
			} else {
				// $scope.errors.push('Item already has been deleted!');
				// alert('item already has been deleted!');

			}

		};
			// 		.success(function(data) {
			// 	if (data.status === 'success') {
			// 		service.data.delete(id);
			// 		callback(true);
			// 	} else {
			// 		if(data.status === 'not exists'){
			// 			service.data.delete(id);
			// 			callback(false);
			// 		}
			// 	}
			// })
			// .error(function(){});
		Timezone.delete(id).success(function(data) {
			if (data.status === 'success') {
			} else if (data.status === 'not exists') {
				alert('Item not exists or item has been deleted');
			}
			Timezone.data.delete(id);
		}).error(function(data) {
			alert(data.error);
		});
	};


	$scope.logout = function(){
		var callback = function(){
			Timezone.data = [];
			Timezone.initialized = false;
			
			$location.path('/');
		};
		User.logout(callback);
	};

	$scope.inputFocus = function(){
		this.errors = [];
	};
})

.controller('timezoneEditController', function($scope, User, Timezone, $location, $http, $routeParams){
	$scope.errors = [];
	$scope.timezone = null;

	var _getCallback = function(data){
		var timezone = Timezone.data.getById(id);
		var o = {};

		for(var k in timezone){
			if(timezone.hasOwnProperty(k)){
				o[k] = timezone[k];
			}
		}
		$scope.timezone = o;
		// console.log($scope.timezone);
	};

	var _addCallback = function(success){
		// if(data.status === 'success'){
		// 	$scope.expenses.push(data.data);
		if(success){
		$location.path('/timezone');
		}
		// }

	};

	var _validate = function(){
		var name = $('#name').val(),
			city = $('#city').val(),
			timezone = $('#timezone').val();

		if (!name || !city || !timezone) {
			this.errors.push('No fields should be empty!');
		}
		// this.name = name;
		// this.city = city;
		// this.timezone = timezone;

		return !this.errors.length;
	};

	id = $routeParams.id;
	if(id === undefined || id === ''){
		$location.path('/');
	}

	if(!User.islogin){
		$location.path('/');
	}

	Timezone.get(_getCallback);

	$scope.goToAdd = function(){
		$location.path('/add');
	};

	$scope.update = function(){
		var _updateCallback = function(success){
			if(success){
				$location.path('/');
			}
		};

		if (_validate.apply(this, null)) {
			Timezone.update(this.timezone).success(function(data) {
				if (data.status === 'success') {
					Timezone.data.replaceById(id, data.data);
					// callback(data.data);
				} else if (data.status === 'no auth') {
					alert("You are not allowed to edit this item");
				} else if (data.status === 'not exists') {
					alert("Item does not exists");
				}
				$location.path('/timezone');
			}).error(function(data){
				//TBC
				alert(data.error)
			});
		}
	};

	$scope.addComment = function(){
		var c = $('#comment').val();
		if(!c){
			return;
		}
		var callback = function(data){
			if(data){
				$scope.expense.comments.push(data);
			}
		};
		Expense.addComment(this.expense.id, c, callback);
	};

	$scope.delete = function(id){
		var _deleteCallback = function(data){
			// if(data.status === 'success'){
			// 	$location.path('/');
			// }
		};
		Expense.delete(id, _deleteCallback);
	};

	$scope.logout = function(){
		var callback = function(){
			Timezone.data = [];
			Timezone.initialized = false;

			$location.path('/');
		};
		User.logout(callback);
	};

	$scope.inputFocus = function(){
		this.errors = [];
	};

});



