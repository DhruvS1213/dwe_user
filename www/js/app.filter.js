'use strict';
angular.module('dweUser')
    .filter('trustAsHtml', function($sce) { 
        return $sce.trustAsHtml; 
    });