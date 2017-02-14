angular.module('dweUser', ['ionic', 'ui.router'])

.controller('dweUserCtrl', ['$scope','$sce','$http','$ionicModal', '$ionicSlideBoxDelegate','$ionicPopup' ,'$timeout','appConstants' ,function($scope, $sce, $http,$ionicModal,$ionicSlideBoxDelegate, $ionicPopup ,$timeout, appConstants){
    console.log('user-view controller');
    console.log('timer test', appConstants.timerValue);
    var vm = this;
    var temp = Math.floor((Math.random() * 100) + 1);
    vm.data = {};
    vm.smileyImages=["img/happy.png","img/middle.png","img/sad.png"];
    vm.data.imgArray=[];
    vm.imageDescription = [];
    vm.imageLabel = [];
    vm.videoPath = [];
    vm.feedbackObjectDisplay = {};
    var imageModalTimer;
    var videoModalTimer;
    vm.selectedEmotion = -1;
    vm.demoId = appConstants.demoId;
    vm.instructions = [];
    vm.instructionImages = [];
    vm.instructionDescription = [];
    vm.showDiv = 0;
    vm.showFunctionDiv = 0;
    vm.showOther = 0;
    vm.funcTrouble = 0;

    var sysDate = new Date().toLocaleString(); 
    vm.feedbackDropdown=[
    {
        "id" : 1,
        "name" : "The overall solution"
    },
    {
        "id" : 2,
        "name" : "A specific functionality"
    },
    {
        "id" : 3,
        "name" : "Both"
    }
    ];
    vm.functionality = [
    {
        "id" : 1,
        "name" : "User Experience"
    },
    {
        "id" : 2,
        "name" : "User Interface"
    }

    ];
    vm.trouble = [
    {
        "id":1,
        "name":"Overall Solution not working"
    },
    {
        "id":2,
        "name":"Specific functionality not working"
    },
    {
        "id":3,
        "name":"App not working"
    },
    {
        "id":4,
        "name":"Other"
    }
    ]
    var setupSlider = function() {
        vm.data.sliderOptions = {
            initialSlide: 0,
            direction: 'horizontal', 
            speed: 300,
            slidesPerView: 3,
            pageination:true
        };
    };

    vm.htmlToPlaintext = function( text ) {
        return text ? String( text ).replace( /<[^>]+>/gm, '' ) : '';
    }


    vm.selectImage = function ( $index ) {
        console.log('inside');
        vm.showDiv = 1;
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
        vm.feedbackChoice='';
        vm.functionalityType='';
        $scope.modal3.show();
        vm.feedbackUserName = '';
        vm.feedbackUserEmail = '';
        vm.feedbackUserComments = '';
        vm.selectedEmotion = -1;
        vm.showDiv = 0;
        vm.showFunctionDiv = 0;

    };

    //function to hide the Feedback Modal
    vm.closeModalFeedback = function() {
        console.log('closing modal');
        $scope.modal3.hide();
    };   

    //function to execute when Feedback is submitted
    vm.submitFeedback = function() {
        var funcName;
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
        
            
        if(typeof(vm.functionalityType.name) === 'undefined'){
            console.log('here');
            funcName = 'NA';
        }
        else{
            funcName = vm.functionalityType.name;
        }

         if(vm.feedbackUserComments.length == 0){
            console.log('here');
            userComment = 'NA';
        }
        else{
            userComment = vm.feedbackUserComments;
        }



        $http.post(appConstants.url + '/api/feedbacks', {demoId: vm.demoId, feedbackType: vm.feedbackChoice.name, functionality: funcName , experience: emotion ,comments: userComment, dateTime : sysDate }).success(function(res){
                var alertPopup = $ionicPopup.alert({
                    title: 'Thank-you',
                    template: 'Response recorded Successfully !!'
                });

                alertPopup.then(function(res) {
                   vm.closeModalFeedback();
                   
                });
        });
        
    };


    vm.selectOption = function(){
        
        if (vm.feedbackChoice.id == 2 || vm.feedbackChoice.id == 3)
        {
            vm.showFunctionDiv = 1;
        }
        else
        {
            vm.showFunctionDiv = 0;
            vm.functionalityType = ' ';

        }

    }


    vm.selectIssue = function () {

        if(vm.troubleChoice.id == 2)
        {
            vm.funcTrouble = 1;
            vm.showOther=0;
        }
        else if (vm.troubleChoice.id == 4)
        {
            vm.showOther = 1;
            vm.funcTrouble = 0;

        }
        else{
             vm.showOther = 0;
            vm.funcTrouble = 0;
        }


    }

    vm.selectTrouble = function(){
        console.log('Trouble Issue',vm.troubleFunctionality);
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
        vm.showOther = 0;
        vm.funcTrouble = 0;
        vm.troubleChoice='';
        vm.troubleFunctionality = '';
        $scope.modal4.show();      
};


//Instruct Modal


 $ionicModal.fromTemplateUrl('templates/modalInstruct.html', function($ionicModal) {
        $scope.modal5 = $ionicModal;
    }, {
        scope: $scope,
        animation: 'slide-in-up'
});

$scope.openInstructModal = function(index) {
        console.log(vm.instructions);
        for(var i=0;i<vm.instructions[index].length;i++){
            console.log(vm.instructions[index][i].subImgPath);
            vm.instructionImages.push(vm.instructions[index][i].subImgPath);
            vm.instructionDescription.push(vm.instructions[index][i].subImageDescription);
        }

        console.log('open');
        vm.startImageTimer();
        $scope.modal5.show();    
        $ionicSlideBoxDelegate.$getByHandle('inst').slide(0);
        $scope.modal.hide();
        
  
};

$scope.closeModalInstruct = function(){
        console.log('close');
        vm.startImageTimer();
        $scope.modal5.hide();
        vm.instructionImages = [];
        vm.instructionDescription = [];
        $scope.modal.show();  
         
}


vm.submittroubleTicket = function() {
   
    if(typeof(vm.troubleFunctionality.name) === 'undefined'){
            console.log('here');
            troubleFunc = 'NA';
        }
        else{
            troubleFunc = vm.troubleFunctionality.name;
        }

         if(typeof(vm.troubleFunctionality.name) === 'undefined'){
            console.log('here');
            troubleComment = 'NA';
        }
        else{
            troubleComment = vm.troubleTicketUserComments;
        }


        $http.post(appConstants.url + '/api/troubleTickets', {demoId: vm.demoId,issue: vm.troubleChoice.name, functionality : troubleFunc ,comments: troubleComment , dateTime : sysDate }).success(function(res){
                var alertPopup = $ionicPopup.alert({
                    title: 'Thank-you',
                    template: 'Ticket recorded Successfully !!'
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
            vm.TroubleHeading = vm.htmlToPlaintext(content.title); 
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
                vm.instructions.push(content.imageDetail[i].subImages);

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


   $http({
        method: 'GET',
        url: appConstants.url + '/api/feedbacks' 
    }).then(function successCallback(resp)
    {
        content = resp.data;
        for(var i=0;i<content.length;i++)
       {

            if(content[i].demoId == appConstants.demoId)
            {
            vm.feedbackObjectDisplay[i] = content[i];
            }
       }

        console.log('inside get content for feedback',vm.feedbackObjectDisplay);
    
       
    }, function errorCallback(response)
        {
            console.log('error');
        });

     $http({
        method: 'GET',
        url: appConstants.url + '/api/feedbacks' 
    }).then(function successCallback(resp)
    {
        content = resp.data;
        for(var i=0;i<content.length;i++)
       {

            if(content[i].demoId == appConstants.demoId)
            {
            vm.feedbackObjectDisplay[i] = content[i];
            }
       }

        console.log('inside get content for feedback',vm.feedbackObjectDisplay);
    
       
    }, function errorCallback(response)
        {
            console.log('error');
        });


}])


