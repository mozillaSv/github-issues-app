// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('githubIssuesApp', ['ionic', 'ngCordova'])

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
}])

.controller('redirectCtrl', ['$rootScope', '$state', function($rootScope, $state){
  console.log($rootScope.user);
  $state.go('home');
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
.factory('userService', ['$rootScope', '$state', '$cordovaOauth',
  function($rootScope, $state, $cordovaOauth) {
    var provider = 'github';

    var service = {
      isLoggedIn: function() {
        return $rootScope.userStatus;
      },
      login: function() {
        $cordovaOauth.github('27879518b3200cb586da', '3451fe872df74723655133d8e2c20c68417a4079', ['email'])
          .then(function(data){
            console.log(data);
            $rootScope.user = data;
            $rootScope.$apply($rootScope.user);
            $rootScope.userStatus = true;

            $state.go('home');
          }, function(err){
            alert(err);
          });
      },
      logout: function() {

        console.log("logut");
      }
    };

    return service;
  }
]);
