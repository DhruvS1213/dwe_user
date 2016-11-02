// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('dweUser', ['ionic'])

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

 
    $ionicModal.fromTemplateUrl('templates/modal.html', {
        scope: $scope,
        animation: 'slide-in-up'
    }).then(function(modal) {
        $scope.modal = modal;
    });

    vm.closeModal = function() {
        console.log('closemodal function');
      $scope.modal.hide();
    };

    vm.goToSlide = function(index) {
        console.log('goto slide function')
      $scope.modal.show();
      $ionicSlideBoxDelegate.slide(index);
    };    

    vm.closeModalVideo = function() {
        console.log('closemodal function');
      $scope.modal2.hide();
    };
 
    
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
            vm.data.imgArray = response.data;
            console.log(vm.data.imgArray);
        }, function errorCallback(error)
        {
            console.log('error');
    });

    // $http({
    //     method: 'GET',
    //     url: 'http://localhost:3000/getImageDescription'
    // }).then(function successCallback(response){
    //         vm.imageDescription = response.data;
    //         console.log(vm.imageDescription);
    // }, function errorCallback(error){
    //     console.log('error in fetching image description');
    // });

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
            url: 'http://localhost:3000/getVideoAddress'
        }).then(function successCallback(response){
            for(video in response.data)
            {
                vm.videoPath.push($sce.trustAsResourceUrl(response.data[video]));
            }
            console.log('video paths',vm.videoPath);
        }, function errorCallback(err){
            console.log('error in fetching video paths');
        })



    // Video Modal
    $ionicModal.fromTemplateUrl('templates/modalVideo.html', function($ionicModal) {
        $scope.modal2 = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });
    
    $scope.openModalVideo = function() {
        $scope.modal2.show();
    }

}])


.filter('trustAsHtml', function($sce) { 
    return $sce.trustAsHtml; 
});