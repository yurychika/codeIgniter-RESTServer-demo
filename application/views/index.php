<!doctype html>
<html ng-app='project'>
<title>Timezone Viewer</title>
<style type='text/css'>
body,div,p,h1,h2,h3,ul,li{
	margin: 0;
	padding: 0;
}
body{
	font-family: arial;
	color: #555;
}
.error{
	font-weight: bold;
	font-size: 13px;
	color: red;
}

li{
	list-style: none outside none;
	/*display: inline-block;*/
	margin: 0;
}


</style>

<head>
	<link rel='stylesheet' href='asset/css/bootstrap/bootstrap.min.css'>
	<script type='text/javascript'>
		var siteUrl = "<?php echo site_url('');?>";
		var islogin = <?php echo $isLoggedIn ?>;
	</script>
	<script type='text/javascript' src='asset/js/jquery/jquery-2.0.3.min.js'></script>
	<script type='text/javascript' src='asset/js/angular.js'></script>
	<script type='text/javascript' src='asset/js/angular-1.2.5/angular-resource.js'></script>
	<script type='text/javascript' src='asset/js/angular-1.2.5/angular-route.js'></script>
	<script type='text/javascript' src='asset/js/app.js'></script>
	<script type='text/javascript' src='asset/js/timezone.js'></script>
	<script type='text/javascript'>
		function myController($scope) {
			$scope.myname = 'gee';
			$scope.age = '25';
			//$scope.inputName  = '';

			$scope.list = [
				{name:'gee', age: 25},
				{name:'yury', age:25}
			]

			$scope.getCount = function() {
				console.log('in getting name');
				return this.list.length;
			}

			$scope.addPerson = function() {
				console.log(this === $scope);
				console.log($scope);
				this.list.push({name: this.inputName, age: 25});
			}
		}

	</script>
</head>
<body>
	<!-- <button ng-click='count = count+1' ng-init="count=0">click</button> -->
	<div ng-view class='container'>
<!-- 	<div ng-controller='testController'>
		text is {{name}}
		count is {{getCount()}}
		<button ng-click="name=name+11">click</button>
	</div> -->

</body>
<!-- <body ng-controller='myController'>
	<p>There is <span>{{getCount()}}</span> people in the current list!<p>


	<input type='text' ng-model='inputName'><button ng-click='addPerson()'>add</button>
	hello {{inputName}}

	<ul ng-repeat='person in list'>
		<li>{{person.name}}</li>
		<li>{{person.age}}</li>
	</ul>
</body> -->
</html>
