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



.controller('dweUserCtrl', ['$scope','$sce','$http','$ionicModal', '$ionicSlideBoxDelegate', '$timeout', function($scope, $sce, $http,$ionicModal,$ionicSlideBoxDelegate, $timeout){
    console.log('user-view controller');
    var vm = this;
    var temp = Math.floor((Math.random() * 100) + 1);
    vm.data = {};
    vm.data.imgArray=[];
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
    }

    vm.initializeListener = function(index){
        console.log('inside initialize listner');
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
    }



    $scope.openModalVideo = function(index) {
        $scope.modal2.show();
        $ionicSlideBoxDelegate.slide(index);
        vm.initializeListener(index);
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
        console.log(resp.data[0]);
        console.log(resp.data[0].title);
        if(resp.data[0].title === undefined){
            vm.userHeadingRequest = '';
        }
        else{
            vm.userHeadingRequest = resp.data[0].title;    
        }

        if(resp.data[0].textContent === undefined){
            vm.userContentRequest = '';    
        }
        else{
            vm.userContentRequest = resp.data[0].textContent;    
        }

        if(resp.data[0].imageDetail === undefined){
            vm.data.imgArray = [];

        }
        else{
            for(var i=0;i<resp.data[0].imageDetail.length; i++){
                vm.data.imgArray[i] = resp.data[0].imageDetail[i].imagePath;
                console.log(vm.data.imgArray);
                vm.imageDescription[i] = resp.data[0].imageDetail[i].imageDescription;
            }
        }

        if(resp.data[0].videoContent === undefined || resp.data[0].videoContent.length == 0){
            vm.videoPath = [];
        }
        else{
            var me = resp.data[0].videoContent.split(",");
            console.log(me);
            for(i in me)
            {
                vm.videoPath.push($sce.trustAsResourceUrl(me[i]));
            }
            console.log('video paths',vm.videoPath);
        }
        console.log('Sucess!!');
    }, function errorCallback(response)
        {
            console.log('error');
        });

//feedback modal

$ionicModal.fromTemplateUrl('templates/modalFeedback.html', function($ionicModal) {
    $scope.modalFeedback = $ionicModal;
}, {
    // Use our scope for the scope of the modal to keep it simple
    scope: $scope,
    // The animation we want to use for the modal entrance
    animation: 'slide-in-up'
});

$scope.openModalFeedback = function() {
    $scope.modalFeedback.show();
}

vm.closeModalFeedback = function() {
        console.log('closemodal function');
        $scope.modalFeedback.hide();
    };

}])


.filter('trustAsHtml', function($sce) { 
    return $sce.trustAsHtml; 
});