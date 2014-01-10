console.log(angular.module('project'));

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

.factory('Expense', function($http, User){
	var service = {

		data: [],

		errors: [],

		initialized: false,

		get: function(callback){
			if(service.initialized){
				callback();
				return;
			}
			$http.get(siteUrl + '/REST/expense/get')
			.success(function(data){
				if(data.error){
		 			service.errors.push('Error happens');
		 		}else{
		 			service.data = data.data;
		 			service.initialized = true;
		 			callback();
		 		}				
			})
			.error(function(){});
		},

		add: function(title, amount, desc, date, time, callback){
			var data = {title: title, amount: amount, desc: desc, date: date, time: time};

			$http.post(siteUrl + '/REST/expense/add', data)
			.success(function(data){
				if(data.status === 'success'){
					service.data.push(data.data);
				}
				callback(true);
			})
			.error(function(){
				callback(false);
			});

		},

		update: function(expense, callback){
			var data = {
				id: expense.id,
				title: expense.title, 
				amount: expense.amount, 
				desc: expense.desc, 
				date: expense.date, 
				time: expense.time
			};

			$http.post(siteUrl + '/REST/expense/update', data)
			.success(function(data){
				if(data.status === 'success'){
					service.data.replaceById(id, data.data);
					callback(true);
				}
			})
			.error(function(){
				callback(false);
			});

		},		

		delete: function(id, callback){
			var data = {id: id};

			$http.post(siteUrl + '/REST/expense/delete', data)
			.success(function(data){
				if(data.status === 'success'){
					service.data.delete(id);
				}
			})
			.error(function(){});
		}

	};

	service.get(function(data){
 
 
	});
	return service;
})

.controller('expenseController', function($scope, User, Expense, $location, $http){
	 	$scope.errors = [];
	 	$scope.expenses = [];

		var _getCallback = function(data){
 			$scope.expenses = Expense.data;
	 	};

	 	var _addCallback = function(success){
	 		// if(data.status === 'success'){
	 		// 	$scope.expenses.push(data.data);
	 		if(success){
				$location.path('/expense');
	 		}
	 		// }

	 	};

	 	var _validate = function(){
	 		var title = $('#title').val(),
	 			amount = $('#amount').val(),
	 			desc = $('#desc').val(),
	 			date = $('#date').val(),
	 			time = $('#time').val();

	 		if(!title || !amount || !desc || !date || !time){
	 			this.errors.push('No fields should be empty!');
	 		}
	 		this.title = title;
	 		this.amount = amount;
	 		this.desc = desc;
	 		this.date = date;
	 		this.time = time;

	 		return !this.errors.length;
	 	};

	 	Expense.get(_getCallback);

	 	if(!User.islogin){
	 		$location.path('/');
	 	}

	 	$scope.goToAdd = function(){
	 		$location.path('/add');
	 	};

 		$scope.goToEdit = function(id){
 			$location.path('/edit/' + id);
	 	};

	 	$scope.add = function(){
	 		if(_validate.apply(this, null)){
	 			Expense.add(this.title, this.amount, this.desc, this.date, this.time, _addCallback)
	 		}
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
	 			Expense.data = [];
	 			Expense.initialized = false;
	 			
	 			$location.path('/');
	 		};
	 		User.logout(callback);
	 	};


	 	$scope.inputFocus = function(){
	 		this.errors = [];
	 	};

})

.controller('expenseEditController', function($scope, User, Expense, $location, $http, $routeParams){
	 	$scope.errors = [];
	 	$scope.expense = null;

		var _getCallback = function(data){
 			var expense = Expense.data.getById(id);
			var o = {};

			for(var k in expense){
				if(expense.hasOwnProperty(k)){
					o[k] = expense[k];
				}
			}
			$scope.expense = o;
						
 			$scope.expense.date = $scope.expense.create_time.split(' ')[0];
 			$scope.expense.amount = parseInt($scope.expense.amount, 10);
 			$scope.expense.time = $scope.expense.create_time.split(' ')[1];

 			console.log($scope.expense);
	 	};

	 	var _addCallback = function(success){
	 		// if(data.status === 'success'){
	 		// 	$scope.expenses.push(data.data);
	 		if(success){
				$location.path('/expense');
	 		}
	 		// }

	 	};

	 	var _validate = function(){
	 		var title = $('#title').val(),
	 			amount = $('#amount').val(),
	 			desc = $('#desc').val(),
	 			date = $('#date').val(),
	 			time = $('#time').val();

	 		if(!title || !amount || !desc || !date || !time){
	 			this.errors.push('No fields should be empty!');
	 		}
	 		this.title = title;
	 		this.amount = amount;
	 		this.desc = desc;
	 		this.date = date;
	 		this.time = time;

	 		return !this.errors.length;
	 	};

	 	id = $routeParams.id;
	 	if(id === undefined || id === ''){
	 		$location.path('/');
	 	}

	 	if(!User.islogin){
	 		$location.path('/');
	 	}

	 	Expense.get(_getCallback);

	 	$scope.goToAdd = function(){
	 		$location.path('/add');
	 	};

	 	$scope.update = function(){
	 		var _updateCallback = function(success){
	 			if(success){
	 				$location.path('/');
	 			}
	 		};

	 		if(_validate.apply(this, null)){
	 			Expense.update(this.expense, _updateCallback)
	 		}
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
	 			Expense.data = [];
	 			Expense.initialized = false;
	 			
	 			$location.path('/');
	 		};
	 		User.logout(callback);
	 	};

	 	$scope.inputFocus = function(){
	 		this.errors = [];
	 	};

});



