// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('dweUser', ['ionic', 'ui.router'])

.run(function($ionicPlatform) {
  $ionicPlatform.ready(function() {
    if(window.cordova && window.cordova.plugins.Keyboard) {
    
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if(window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})

.config(function($stateProvider, $urlRouterProvider){
    $urlRouterProvider.otherwise('/home');
    $stateProvider
        .state('home', {
            url: '/home',
            templateUrl: 'templates/home.html'
        });
})



.controller('dweUserCtrl', ['$scope','$sce','$http','$ionicModal', '$ionicSlideBoxDelegate', function($scope, $sce, $http,$ionicModal,$ionicSlideBoxDelegate){
    console.log('user-view controller');
    var vm = this;
    var temp = Math.floor((Math.random() * 100) + 1);
    vm.data = {};
    vm.imageDescription = [];
    vm.videoPath = [];

    var setupSlider = function() {
        vm.data.sliderOptions = {
            initialSlide: 0,
            direction: 'horizontal', 
            speed: 300,
            slidesPerView: 3,
            pageination:true
        };
    };
        
    setupSlider();

    //Image modal
    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    // Video Modal
    $ionicModal.fromTemplateUrl('templates/modalVideo.html', function($ionicModal) {
        $scope.modal2 = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });
    
    $scope.openModalVideo = function() {
        $scope.modal2.show();
    };

    vm.closeModal = function() {
        console.log('closemodal function');
        $scope.modal.hide();
    };

    vm.stopVideo = function(){
      $('video').each(function(){
            this.pause();
            this.currentTime = 0;
        });  
    };

    vm.goToSlide = function(index) {
        console.log('goto slide function')
      $scope.modal.show();
      $ionicSlideBoxDelegate.slide(index);
    };    

    vm.closeModalVideo = function() {
        console.log('closemodal function');
        $('video').each(function(){
            this.pause();
            this.currentTime = 0;
        }); 
        $scope.modal2.hide();
    };

    vm.slide = function(index) {
        console.log('slide pager');
        $ionicSlideBoxDelegate.slide(index);
    };
 
    
    vm.myInterval = 3000;
    
    $http({
        method: 'GET',
        url: 'http://localhost:9000/api/contents'
    }).then(function successCallback(resp)
    {
        console.log(resp.data[0].title);
        vm.userHeadingRequest = resp.data[0].title;
        console.log('Sucess!!');
    }, function errorCallback(response)
        {
            console.log('error');
        });

    $http({
        method: 'GET',
        url: 'http://localhost:9000/api/contents'
    }).then(function successCallback(resp)
        {
            vm.userContentRequest = resp.data[0].textContent;
            console.log('Sucess!!');
        }, function errorCallback(response)
        {
            console.log('error');
    });

    $http({
        method: 'GET',
        url: 'http://localhost:9000/api/contents'
    }).then(function successCallback(response)
        {
            console.log(response.data[0].imageContent);
            var my = response.data[0].imageContent.split(",");
            console.log(my);
            vm.data.imgArray = my;
            console.log(vm.data.imgArray);
        }, function errorCallback(error)
        {
            console.log('error');
    });

    $http({
        method: 'GET',
        url: 'http://localhost:3000/getImgJSON'
    }).then(function successCallback(res){
        console.log('json object recieved');
        vm.imgJSON = res.data;
        console.log(vm.imgJSON);
        for(var i=0;i<vm.imgJSON.length;i++)
        {
            vm.imageDescription[i] = vm.imgJSON[i].description;
        }
    });

        $http({
            method:'GET',
            url: 'http://localhost:9000/api/contents'
        }).then(function successCallback(response){
          
                console.log(response.data[0].videoContent);
                var me = response.data[0].videoContent.split(",");
                console.log(me);
                for(i in me)
                {
                vm.videoPath.push($sce.trustAsResourceUrl(me[i]));
            }
            console.log('video paths',vm.videoPath);
        }, function errorCallback(err){
            console.log('error in fetching video paths');
        })



    

}])


.filter('trustAsHtml', function($sce) { 
    return $sce.trustAsHtml; 
});