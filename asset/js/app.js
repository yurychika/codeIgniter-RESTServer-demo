var qs = document.querySelectorAll;

angular.module('project', ['ngRoute'])

.factory('List', function($http){
	var service = {
		list:  [
			{name:'gee', age: 25}, 
			{name:'yury', age:25}
		]

	};
	return service;
})

.factory('User', function($http, $q){
	console.log(123);
	var service = {

		islogin: window.islogin,

		username: '',

		signup: function(username, password, callback){
			// $http.post('/api/user/signup')
			$http.post(siteUrl + '/REST/user/signup', {username: username, password: password})
				.success(callback)
				.error(function(){
				});
		},

		login: function(username, password, callback){
			$http.post(siteUrl + '/REST/user/login', {username: username, password: password})
				.success(callback)
				.error(function(){

				});

		},

		logout: function(callback){
			$http.get(siteUrl + '/REST/user/logout')
				.success(function(){
					service.islogin = false;
					callback();
				})
				.error(function(){

				});
		},

		checkAuth: function(callback){
			var d = $q.defer();

			$http.get(siteUrl + '/REST/user/login')
				.success(function(data){
					if(data.status === 'true'){
						service.islogin = true;
						callback();
						d.resolve();
					}else{
						service.islogin = false;
					}
				})
				.error(function(){
					d.reject();
				});

		}

	};
	return service;
})

.config(function($routeProvider){
	$routeProvider
	.when('/', {
		controller: 'indexController',
		templateUrl: 'asset/login.html'
	})
	.when('/signup', {
		controller: 'signupController',
		templateUrl: 'asset/signup.html'
	})
	.when('/expense',{
		controller: 'expenseController',
		templateUrl: 'asset/expense/expense.html'
	})	
	.when('/add',{
		controller: 'expenseController',
		templateUrl: 'asset/expense/add.html'
	})	
	.when('/edit/:id',{
		controller: 'expenseEditController',
		templateUrl: 'asset/expense/edit.html'
	})
	.otherwise({
		redirectTo: '/'
	});
})

.controller('indexController', function($scope, List, $location, User){
		$scope.errors = [];
		//$scope.inputName  = '';

		$scope.list = List.list;
		
		if(User.islogin){
			$location.path('/expense');
		}

	 	$scope.goToSignUp = function(){
	 		$location.path('/signup');
	 	};

	 	$scope.login = function(){
	 		this.errors = [];
	 		if(_validate.apply(this, null)){
	 			User.login(this.username, this.password, _loginCallback);
	 		}

	 	};

	 	$scope.inputFocus = function(){
	 		this.errors = [];
	 	};

 	 	var _validate = function(){
	 		var username = $('#username').val(), error, valid = false,
	 			password = $('#password').val();

	 		if(!username || !password){
	 			this.errors.push('No fields should be empty');
	 		}
	 		this.username = username;
	 		this.password = password;
	 		return !this.errors.length;
	 	};

	 	var _loginCallback = function(data){
	 		if(data.status == 'fail'){
	 			$scope.errors.push('Wrong username or password!');
	 		}else{
	 			User.islogin = true;
	 			User.username = this.username;
	 			$location.path('/expense');
	 		}
	 	};
	 	$scope.addPerson = function(){
	 		console.log(this === $scope);
	 		console.log($scope);
	 		this.list.push({name: this.inputName, age: 25});
	 	}		
})

.controller('signupController', function($scope, User, $location, $http){
	 	$scope.errors = [];

	 	$scope.signup = function(){
	 		$location.path('/detail/1');
	 	};

	 	$scope.username = '';
	 	$scope.password = '';

	 	$scope.signup = function(){
	 		this.errors = [];
	 		if(_validate.apply(this, null)){

	 			User.signup(this.username, this.password, _signupCallback);
	 		}
	 	};

	 	$scope.addPerson = function(){
	 		console.log(this === $scope);
	 		console.log($scope);
	 		this.list.push({name: this.inputName, age: 25});
	 	};

	 	$scope.inputFocus = function(){
	 		this.errors = [];
	 	};

	 	var _signupCallback = function(data){
	 		console.log(data);
	 		if(data.error === 'duplicate user'){
	 			$scope.errors.push('Duplicate user, please choose another username');
			}else{
				User.islogin = true;
				User.username = this.username;
				$location.path('/');
			}
	 	};
	 	//sign up form validation
 	 	var _validate = function(){
	 		var username = $('#username').val(), error, valid = false,
	 			password = $('#password').val(),
	 			password2 = $('#password2').val();

	 		if(!username || !password || !password2){
	 			this.errors.push('No fields should be empty');
	 		}
	 		if(password !== password2){
	 			this.errors.push('Please confirm your password');
	 		}
	 		this.username = username;
	 		this.password = password;
	 		return !this.errors.length;
	 	};
})


.controller('listController', function($scope, List){
		console.log('list is');
		console.log(List);

		$scope.myname = 'gee';
		$scope.age = '25';
		//$scope.inputName  = '';

		$scope.list = List.list;

	 	$scope.getCount = function(){
	 		console.log('in getting count');
	 		return this.list.length;
	 	};

	 	$scope.getName = function(){
	 		console.log('in getting name');
	 		return '123';
	 	}

	 	$scope.addPerson = function(){
	 		console.log(this === $scope);
	 		console.log($scope);
	 		this.list.push({name: this.inputName, age: 25});
	 	}		
})


.controller('testController', function($scope, $routeParams){
	$scope.name = 'test controller';

	$scope.getCount = function(){
		return $scope.name.length;
	}
});
