/**
 * This is the module definition
 */
angular.module("directiveExample1", [ "kendo.directives", "utility.services" ]);

angular.module("directiveExample1").controller ("MainCtrl", ['$scope', 'jsonpHTTPDataService', 'utilityFunctions',
    function($scope, jsonpHTTPDataService, utilityServices) {
        $scope.testvar = "A sample string from MainCtrl";
        console.log("In MainCtrl");
        
        $scope.mainCtrlCallback = function () {
            alert ("This is the Main Controller Callback - ");
        }
        console.log("Calling JSONP");
        var httpDataPromise = jsonpHTTPDataService.getData("./Goods.json");
        httpDataPromise.then(function(result) {  // this is only run after $http completes
            var httpData = result;
            console.log("httpData = "+JSON.stringify(httpData.data));
            $scope.goods = result.data;
        });
                
}]);

angular.module("directiveExample1").directive('exampleDirective', 
    function() {
        return {
            restrict: 'EA',
            templateUrl: './templates/emailInput.html',
            scope: {
                isovar: '=',
                cbk: '&callback'
            },
            controller: function($scope, $element){
                $scope.var1 = "In Directive's Controller ";
                console.log("In directive's controller");
                console.log("Controller function Isolated : "+$scope.isovar);
                $scope.isovar = "a sample tinkered value from the directive's controller";
                //$scope.cbk();
            },
            link: function(scope, el, attr) {
                scope.var2 = "In directive's link";
                console.log("In directive's link");
                console.log("Link function Isolated : "+scope.isovar);
            }
        }
    });
    
angular.module("directiveExample1").directive('emailInputField', 
    function() {
        return {
            restrict: 'A',
            templateUrl: './templates/emailInputField.html',
            replace: true,
            scope: {},
            controller: function($scope, $element, utilityFunctions){
                $scope.rowid = utilityFunctions.guid();
                console.log("In emailInputField's controller");
            },
            link: function(scope, el, attr) {
                console.log("In emailInputField's link");
                }
        }
    });
    
angular.module("directiveExample1").directive('passwordInputField', 
    function() {
        return {
            restrict: 'A',
            templateUrl: './templates/passwordInputField.html',
            replace: true,
            scope: {},
            controller: function($scope, $element, utilityFunctions){
                $scope.rowid = utilityFunctions.guid();
                console.log("In passwordInputField's controller");
            },
            link: function(scope, el, attr) {
                console.log("In passwordInputField's link");
                }
        }
    });