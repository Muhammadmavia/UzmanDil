// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
// 'starter.controllers' is found in controllers.js
angular.module('starter', ['ionic', 'firebase', 'starter.controllers'])

  .run(function ($ionicPlatform) {
    $ionicPlatform.ready(function () {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      if (window.cordova && window.cordova.plugins.Keyboard) {
        cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
        cordova.plugins.Keyboard.disableScroll(true);

      }
      if (window.StatusBar) {
        // org.apache.cordova.statusbar required
        StatusBar.styleDefault();
      }
    });
  })
  .factory("Auth", function ($firebaseAuth) {
    var usersRef = new Firebase("https//afb.firebaseio.com/");
    return $firebaseAuth(usersRef);
  })
  .controller('AuthCtrl', function ($scope, Auth, $rootScope, $state) {

    $scope.doLogin = function (provider) {
      Auth.$authWithOAuthPopup(provider)
        .then(function (authData) {
          // User successfully logged in
        })
        .catch(function (error) {
          if (error.code === "TRANSPORT_UNAVAILABLE") {
            //Auth.$authWithOAuthPopup("facebook")
            Auth.$authWithOAuthRedirect(provider)
              .then(function (authData) {
                // User successfully logged in. We can log to the console
                // since we’re using a popup here
                console.log(authData);
              });
          } else {
            // Another error occurred
            console.log(error);
          }
        });

    };
    Auth.$onAuth(function (authData) {
      if (authData === null) {
        console.log("Not logged in yet");
      } else {
        console.log("Logged in as", authData.uid);
        console.log(authData);
        authData.provider === 'google' ? authData.data = authData.google : authData.data = authData.facebook;
        $state.go('app.home');
      }
      $rootScope.authData = authData; // This will display the user's name in our view

    });
  })
  .config(function ($stateProvider, $urlRouterProvider) {
    $stateProvider

      .state('app', {
        url: '/app',
        abstract: true,
        templateUrl: 'templates/menu.html',
        controller: 'AppCtrl'
      })

      .state('app.search', {
        url: '/search',
        views: {
          'menuContent': {
            templateUrl: 'templates/search.html'
          }
        }
      })

      .state('app.browse', {
        url: '/browse',
        views: {
          'menuContent': {
            templateUrl: 'templates/browse.html'
          }
        }
      })
      .state('app.auth', {
        url: '/auth',
        views: {
          'menuContent': {
            templateUrl: 'templates/auth.html',
            controller: 'AuthCtrl'
          }
        }
      })
      .state('app.home', {
        url: '/home',
        views: {
          'menuContent': {
            templateUrl: 'templates/home.html',
            //controller : 'AuthCtrl'
          }
        }
      })
      .state('app.playlists', {
        url: '/playlists',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlists.html',
            controller: 'PlaylistsCtrl'
          }
        }
      })

      .state('app.single', {
        url: '/playlists/:playlistId',
        views: {
          'menuContent': {
            templateUrl: 'templates/playlist.html',
            controller: 'PlaylistCtrl'
          }
        }
      });
    // if none of the above states are matched, use this as the fallback
    $urlRouterProvider.otherwise('/app/auth');
  });
