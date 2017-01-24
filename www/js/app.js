angular.module('dweUser', ['ionic', 'ui.router'])

.controller('dweUserCtrl', ['$scope','$sce','$http','$ionicModal', '$ionicSlideBoxDelegate', '$timeout','appConstants' ,function($scope, $sce, $http,$ionicModal,$ionicSlideBoxDelegate, $timeout, appConstants){
    console.log('user-view controller');
    console.log('timer test', appConstants.timerValue);
    var vm = this;
    var temp = Math.floor((Math.random() * 100) + 1);
    vm.data = {};
    vm.data.imgArray=[];
    vm.imageDescription = [];
    vm.videoPath = [];
    var imageModalTimer;
    var videoModalTimer;
    var demoId;
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

    //Feedback Modal
    $ionicModal.fromTemplateUrl('templates/modalFeedback.html', function($ionicModal) {
        $scope.modal3 = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
    });
    
    $ionicModal.fromTemplateUrl('templates/modalTrouble.html', function($ionicModal) {
        $scope.modal4 = $ionicModal;
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

    //function to open Feedback Modal
    $scope.openFeedbackModal = function() {
        $scope.modal3.show();
        vm.feedbackUserName = '';
        vm.feedbackUserEmail = '';
        vm.feedbackUserComments = '';
    };

 
    //function to hide the Feedback Modal
    vm.closeModalFeedback = function() {
        $scope.modal3.hide();
    }   

    //function to execute when Feedback is submitted
    vm.submitFeedback = function() {
        $http.post('http://localhost:9000/api/feedbacks', {demoId: demoId, userName: vm.feedbackUserName, email: vm.feedbackUserEmail, comments: vm.feedbackUserComments }).success(function(res){
                alert("Feedback Recorded Successfully");
        });
    };




    //Trouble Modal open
    $scope.openTroubleModal = function() {
        console.log('open');
        $scope.modal4.show();
       
    };

    //Close trouble modal
    vm.closeModalTrouble = function() {
        $scope.modal4.hide();
    } 

    vm.submittroubleTicket = function() {
        $http.post('http://localhost:9000/api/troubleTickets', {demoId: demoId, userName: vm.troubleTicketUserName, comments: vm.troubleTicketUserComments }).success(function(res){
                alert("Ticket Recorded Successfully");
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
 
    
    vm.myInterval = 3000;
    
    vm.populateData= function(contents) { 
      if(contents.title === undefined){
            vm.userHeadingRequest = '';
        }
        else{
            vm.userHeadingRequest = contents.title;    
        }

        if(contents.textContent === undefined){
            vm.userContentRequest = '';    
        }
        else{
            vm.userContentRequest = contents.textContent;    
        }

        if(contents.imageDetail === undefined){
            vm.data.imgArray = [];

        }
        else{
            for(var i=0;i<resp.data[0].imageDetail.length; i++){
                vm.data.imgArray[i] = contents.imageDetail[i].imagePath;
                console.log(vm.data.imgArray);
                vm.imageDescription[i] = contents.imageDetail[i].imageDescription;
            }
        }

        if(contents.videoContent === undefined || contents.videoContent.length == 0){
            vm.videoPath = [];
        }
        else{
            var me = contents.videoContent.split(",");
            console.log(me);
            for(i in me)
            {
                vm.videoPath.push($sce.trustAsResourceUrl(me[i]));
            }
            console.log('video paths',vm.videoPath);
        }  

    }


    $http({
        method: 'GET',
        url: 'http://localhost:9000/api/contents/'+ appConstants.demoId
    }).then(function successCallback(resp)
    {
        console.log(resp);
        var contents = resp.data;
        console.log('response');
        console.log(resp.data);
        vm.populateData(contents);
        console.log('Sucess!!');
    }, function errorCallback(response)
        {
            console.log('error');
    });    
    
    

//feedback modal


}])


