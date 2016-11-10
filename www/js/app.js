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

.controller('dweUserCtrl', ['$scope','$sce','$http', '$templateCache','$ionicModal', '$ionicSlideBoxDelegate', '$timeout', function($scope, $sce, $http, $templateCache,$ionicModal,$ionicSlideBoxDelegate, $timeout){
    console.log('user-view controller');
    var vm = this;
    var temp = Math.floor((Math.random() * 100) + 1);
    vm.data = {};
    vm.imageDescription = [];
    vm.videoPath = [];
    var imageModalTimer;
    var videoModalTimer;
    
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

    //Image Modal
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
    
    vm.startImageTimer = function(){
       imageModalTimer =  $timeout(function () {
            vm.closeModal();
            }, 10000);
        console.log('release: timer started');
    };

    vm.stopImageTimer = function(){
        $timeout.cancel(imageModalTimer);
        console.log('touch: timer stopped');
    };

    vm.startVideoTimer = function(){
       videoModalTimer = $timeout(function(){
            vm.closeModalVideo();
        }, 10000);
       console.log('video timer started');
    };

    vm.stopVideoTimer = function(){
        $timeout.cancel(videoModalTimer);
        console.log('video timer stoped');
    };

    vm.initializeListener = function(index){
        document.getElementById('my-video' + index).addEventListener('ended', myHandler1, false)
        function myHandler1(e){
            console.log('video ended...');
            vm.startVideoTimer();
        }

        document.getElementById('my-video'+ index).addEventListener('pause', myHandler3, false)
        function myHandler3(e){
            console.log('video paused...');
            vm.startVideoTimer();
        }        

        document.getElementById('my-video' + index).addEventListener('playing', myHandler2, false)
        function myHandler2(e){
            console.log('video playing...');
            vm.stopVideoTimer();
        }
    };


    $scope.openModalVideo = function(index) {
        $scope.modal2.show();
        $ionicSlideBoxDelegate.slide(index);
        vm.initializeListener(index);
    };

    vm.closeModal = function() {
        console.log('closemodal function');
        $scope.modal.hide();
    };

    vm.slide = function(index) {
        console.log('slide pager');
        $ionicSlideBoxDelegate.slide(index);
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

    vm.stopVideo = function(){
      $('video').each(function(){
            this.pause();
            this.currentTime = 0;
        });  
    };
 
    
    vm.myInterval = 3000;
    

     vm.data.imgArray = ['img/img-2.jpg','img/img-3.jpg','img/img-4.jpg','img/img-5.jpg']
     vm.imageDescription = ['Personally, after having a car for several years, I’ve gone without for the past several years that I’ve lived in Stockholm. And whenever we thought about getting one, the counterpoint always was ‘What’s the point? We only need it for maybe one day a month tops, and having it here in the city will end up costing us money.’ But with the 01, we could lend it to friends without a hassle, or even try to balance the cost of it out by being part of the car-sharing solution.', 'Christine helps drive the social media activation of the Networked Society and believes in all things connected. A communicator and storyteller by trade, she has been excited about the future since she was a kid—and is still waiting for her self-driving flying car. Follow Christine on Twitter @christineluby', 'As 4G LTE and smartphones have penetrated the developed markets, the world has started to prepare for 5G. So what are the five most important innovations we can expect with 5G?', 'Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet. Lorem ipsum dolor sit amet, consetetur sadipscing elitr, sed diam nonumy eirmod tempor invidunt ut labore et dolore magna aliquyam erat, sed diam voluptua. At vero eos et accusam et justo duo dolores et ea rebum. Stet clita kasd gubergren, no sea takimata sanctus est Lorem ipsum dolor sit amet.'];

    vm.videoPath.push($sce.trustAsResourceUrl('//www.kaltura.com/p/1614541/sp/0/playManifest/entryId/1_vc8f3h2d/format/url/flavorParamId/487111/video'));
    vm.videoPath.push($sce.trustAsResourceUrl('//www.kaltura.com/p/1614541/sp/0/playManifest/entryId/1_2pg51cnc/format/url/flavorParamId/487111/video'));

}])


.filter('trustAsHtml', function($sce) { 
    return $sce.trustAsHtml; 
});