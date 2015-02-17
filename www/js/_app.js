// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('githubIssuesApp', ['ionic'])

.config(function($stateProvider, $urlRouterProvider){
  $stateProvider
    .state('home', {
      url: '/',
      templateUrl: 'templates/home.html',
      controller: 'homeCtrl',
      data: {
        authenticate: true
      }
    })
    .state('signin', {
      url: '/signin',
      templateUrl: 'templates/signin.html',
      controller: 'signInCtrl',
      data: {
        authenticate: false
      }
    });

  $urlRouterProvider.otherwise('/signin');
})

.run(function($ionicPlatform, $rootScope, $state, userService) {
  $ionicPlatform.ready(function() {
    // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
    // for form inputs)
    if(window.cordova && window.cordova.plugins.Keyboard) {
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });

  // UI Router Authentication Check
  $rootScope.$on('$stateChangeStart',
    function(event, toState, toParams, fromState, fromParams){
      console.log('state change start');
      if(toState.data.authenticate && !userService.isLoggedIn()){
        event.preventDefault();
        $state.transitionTo('signin');
      }
    }
  );
})

/**
 * Home controller
 */
.controller('homeCtrl', ['$scope', 'userService', function($scope, userService){
  $scope.logout = userService.logout;
}])

/**
 * sign in controller
 */
.controller('signInCtrl', ['$scope', 'userService', function($scope, userService){
  $scope.signIn = userService.login;
  /*$scope.signIn = function(){
    alert('sigin');
  }*/
}])

/**
 * App Service
 */
.factory('appService', ['$http', function($http){
  var service = {
    post: function(url, params, success){
      $http
        .post(url, params)
        .success(success)
        .error(function(data, status){console.log(status);});
    }
  }
  return service;
}])

/**
 * User service
 */
.factory('userService', ['$rootScope', '$state', function($rootScope, $state) {
  var provider = 'github';
  // Hello.js Functions
  hello.init(
    {github:'27879518b3200cb586da'},
    {
      oauth_proxy : 'https://auth-server.herokuapp.com/proxy'      
    }
  );

  var service = {
    isLoggedIn: function() {
      return $rootScope.userStatus;
    },
    login: function() {
      hello('github').login(function(){
        hello('github').api('/me').on('complete', function(data){
          alert('Hello '+data.name);
          $rootScope.user = data;
          $rootScope.$apply($rootScope.user);
          $rootScope.userStatus = true;

          $state.go('home');
        });
      });
    },
    logout: function() {
      hello(provider).logout().then(function(){
        $rootScope.user = null;
        $rootScope.userStatus = false;
        $state.go('signin');
      }, function(){
        alert('error when logout!');
      });
    }
  };

  return service;
}]);
