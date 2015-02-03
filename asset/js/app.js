// var qs = document.querySelectorAll;

angular.module('project', ['ngRoute'])

.constant('VALID_USERNAME', /^[a-zA-Z0-9_]*$/)

.factory('List', function($http) {
	var service = {
		list:  [
			{name:'gee', age: 25}, 
			{name:'yury', age:25}
		]

	};
	return service;
})

.factory('User', function($http, $q) {
	console.log(123);
	var service = {

		islogin: window.islogin,

		apikey: window.apikey,

		username: '',

		signup: function(username, password, callback){
			$http({
				method: 'post',
				data: $.param({username: username, password: password}),
				url: siteUrl + '/REST/user/signup',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(callback)
			.error(function(){});
		},

		login: function(username, password, callback){
			$http({
				method: 'post',
				data: $.param({username: username, password: password}),
				url: siteUrl + '/REST/user/login',
				headers: {'Content-Type': 'application/x-www-form-urlencoded'}
			})
			.success(callback)
			.error(function(){});

			// .post(siteUrl + '/REST/user/login', {username: username, password: password})
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
	.when('/timezone',{
		controller: 'timezoneController',
		templateUrl: 'asset/timezone/timezone.html'
	})	
	.when('/add',{
		controller: 'timezoneController',
		templateUrl: 'asset/timezone/add.html'
	})	
	.when('/edit/:id',{
		controller: 'timezoneEditController',
		templateUrl: 'asset/timezone/edit.html'
	})
	.otherwise({
		redirectTo: '/'
	});
})

.controller('indexController', function($scope, List, $location, User, VALID_USERNAME){
	$scope.errors = [];
	//$scope.inputName  = '';

	$scope.list = List.list;
	
	if(User.islogin){
		$location.path('/timezone');
	}

	$scope.goToSignUp = function() {
		$location.path('/signup');
	};

	$scope.login = function() {
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

		if (!username || !password) {
			this.errors.push('No fields should be empty');
		}
		if (username.length > 20 || password.length > 20) {
			this.errors.push('Username or password should not exceed 20 character');
		}

		this.username = username;
		this.password = password;
		return !this.errors.length;
	};

	var _loginCallback = function(data){
		if(data.status == 'fail') {
			$scope.errors.push('Wrong username or password!');
		} else {
			User.islogin = true;
			User.apikey = data.apikey;
			console.log('apikey is', data.apikey);
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

.controller('signupController', function($scope, User, $location, $http, VALID_USERNAME){
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
		if(data.error === 'duplicate') {
			$scope.errors.push('Username exists, please choose another username');
		} else {
			User.islogin = true;
			User.username = this.username;
			User.apikey = data.apikey;
			console.log('apikey is', User.apikey);
			$location.path('/');
		}
	};
	//sign up form validation
	var _validate = function(){
		var username = $('#username').val().trim(), error, valid = false,
			password = $('#password').val().trim(),
			password2 = $('#password2').val().trim();

		if (!username || !password || !password2) {
			this.errors.push('No fields should be empty');
		} else if (password !== password2) {
			this.errors.push('Please confirm your password');
		} else if (username.length > 20 || password.length > 20) {
			this.errors.push('Username or password should not exceed 20 chars.');
		} else if (!VALID_USERNAME.test(username)) {
			this.errors.push('Username should be only consists of letters, numbers or "_"');
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
