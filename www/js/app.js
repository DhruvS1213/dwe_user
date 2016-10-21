// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('dweUser', ['ionic'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.controller('dweUserCtrl', ['$sce','$http', function($sce, $http, $ionicSlideBoxDelegate){
  var vm = this;
    var temp = Math.floor((Math.random() * 100) + 1);
    vm.imageArray = new Array();
     

    console.log('user-view controller');
    vm.myInterval = 3000;
    
    $http({
        method: 'GET',
        url: 'http://localhost:3000/getHeading'
    }).then(function successCallback(resp)
    {
        console.log("'" + resp.data + "'");
        vm.userHeadingRequest = resp.data;
        console.log('Sucess!!');
    }, function errorCallback(response)
        {
            console.log('error');
        });

    $http({
        method: 'GET',
        url: 'http://localhost:3000/getPage'
    }).then(function successCallback(resp)
        {
            vm.userContentRequest = resp.data;
            console.log('Sucess!!');
        }, function errorCallback(response)
        {
            console.log('error');
        });

        $http({
        method: 'GET',
        url: 'http://localhost:3000/getImageAddress'
    }).then(function successCallback(response)
        {
            //vm.imageArray = response.data.split(',');
            vm.imageArray = response.data;
        }, function errorCallback(error)
        {
            console.log('error');
        });

    vm.videoSRC =  $sce.trustAsResourceUrl("http://localhost:3000/uploads/vid.mp4?t="+ temp);
}])

.filter('trustAsHtml', function($sce) { 
    return $sce.trustAsHtml; 
});