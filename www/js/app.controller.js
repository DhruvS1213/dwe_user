angular.module('dweUser', ['ionic', 'ui.router'])

.controller('dweUserCtrl', ['$scope','$sce','$http','$ionicModal', '$ionicSlideBoxDelegate','$ionicPopup' ,'$timeout','appConstants' ,function($scope, $sce, $http,$ionicModal,$ionicSlideBoxDelegate, $ionicPopup ,$timeout, appConstants){
    console.log('user-view controller');
    console.log('timer test', appConstants.timerValue);
    var vm = this;
    var temp = Math.floor((Math.random() * 100) + 1);
    vm.data = {};
    vm.smileyImages=["img/happy.png","img/middle.png","img/sad.png"]
    vm.data.imgArray=[];
    vm.imageDescription = [];
    vm.imageLabel = [];
    vm.videoPath = [];
    var imageModalTimer;
    var videoModalTimer;
    vm.selectedEmotion = -1;
    vm.demoId = appConstants.demoId;
    var setupSlider = function() {
        vm.data.sliderOptions = {
            initialSlide: 0,
            direction: 'horizontal', 
            speed: 300,
            slidesPerView: 3,
            pageination:true
        };
    };

    vm.selectImage = function ( $index ) {
        console.log('inside');
      if(vm.selectedEmotion === $index) {
         vm.selectedEmotion = $index;
         console.log($index);
      } else {
          console.log('index',$index);
          vm.selectedEmotion = $index;
      }
    }
        
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

    //Feedback Modal
    $ionicModal.fromTemplateUrl('templates/modalFeedback.html', function($ionicModal) {
        $scope.modal3 = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });
    
    vm.startImageTimer = function(){
       imageModalTimer =  $timeout(function () {
            vm.closeModal();
            }, appConstants.timerValue);
        console.log('release: timer started');
    };

    vm.stopImageTimer = function(){
        $timeout.cancel(imageModalTimer);
        console.log('touch: timer stopped');
    };

    vm.startVideoTimer = function(){
       videoModalTimer = $timeout(function(){
            vm.closeModalVideo();
        }, appConstants.timerValue);
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

    //function to open Feedback Modal
    $scope.openFeedbackModal = function() {
        $scope.modal3.show();
        vm.feedbackUserName = '';
        vm.feedbackUserEmail = '';
        vm.feedbackUserComments = '';
        vm.selectedEmotion = -1;
    };

    //function to hide the Feedback Modal
    vm.closeModalFeedback = function() {
        console.log('closing modal');
        $scope.modal3.hide();
    };   

    //function to execute when Feedback is submitted
    vm.submitFeedback = function() {
        var emotion;
        if (vm.selectedEmotion === 0) {
            emotion = 'Happy';
        }

        if( vm.selectedEmotion === 1) {
            emotion = 'Neutral';
        }

        if ( vm.selectedEmotion === 2 ) {
            emotion = "Sad";
        }
        

        $http.post(appConstants.url + '/api/feedbacks', {demoId: vm.demoId, userName: vm.feedbackUserName, email: vm.feedbackUserEmail, experience: emotion ,comments: vm.feedbackUserComments }).success(function(res){
                var alertPopup = $ionicPopup.alert({
                    title: 'Thank-you',
                    template: 'Response recorded Successfully !!'
                });

                alertPopup.then(function(res) {
                   vm.closeModalFeedback();
                   
                });
        });
        
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
 
    
//Smiley Functions

vm.happySelect=function(){
    console.log('happy');
    vm.happy=1;
    vm.middle=0;
    vm.sad=0;
}

vm.middleSelect=function(){
    console.log('middle');
    vm.happy=0;
    vm.middle=1;
    vm.sad=0;

}

vm.sadSelect=function(){
    console.log('sad');
    vm.happy=0;
    vm.middle=0;
    vm.sad=1;

}

//Trouble Modal
 $ionicModal.fromTemplateUrl('templates/modalTrouble.html', function($ionicModal) {
        $scope.modal4 = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });

 $scope.openTroubleModal = function() {
        console.log('open');
        $scope.modal4.show();
       
    };


    vm.submittroubleTicket = function() {
        
        $http.post(appConstants.url + '/api/troubleTickets', {demoId: vm.demoId, userName: vm.troubleTicketUserName ,comments: vm.troubleTicketUserComments }).success(function(res){
                var alertPopup = $ionicPopup.alert({
                    title: 'Thank-you',
                    template: 'Response recorded Successfully !!'
                });

                alertPopup.then(function(res) {
                   vm.closeModalTrouble();
                   
                });
        });
    };

    //Close trouble modal
vm.closeModalTrouble = function() {
        $scope.modal4.hide();
    } 

    vm.myInterval = 3000;
    
    $http({
        method: 'GET',
        url: appConstants.url + '/api/contents/' + appConstants.demoId
    }).then(function successCallback(resp)
    {
        content = resp.data;
        console.log(content.title);
        if(content.title === undefined){
            vm.userHeadingRequest = '';
        }
        else{
            vm.userHeadingRequest = content.title;    
        }

        if(content.textContent === undefined){
            vm.userContentRequest = '';    
        }
        else{
            vm.userContentRequest = content.textContent;    
        }

        if(content.imageDetail === undefined){
            vm.data.imgArray = [];

        }
        else{
            for(var i=0;i<content.imageDetail.length; i++){
                vm.data.imgArray[i] =content.imageDetail[i].imagePath;
                console.log(vm.data.imgArray);
                vm.imageDescription[i] = content.imageDetail[i].imageDescription;
                vm.imageLabel[i] = content.imageDetail[i].label;

            }
        }

        if(content.videoContent === undefined || content.videoContent.length == 0){
            vm.videoPath = [];
        }
        else{
            var me = content.videoContent.split(",");
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




}])


