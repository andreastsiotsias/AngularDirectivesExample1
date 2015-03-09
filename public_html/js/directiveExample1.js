/**
 * This is the module definition
 */
angular.module("directiveExample1", [ "kendo.directives", "utilities.tsiotsias.uk" ]);

angular.module("directiveExample1").controller ("MainCtrl", ['$scope',
    function($scope) {
        $scope.testvar = "a sample string from MainCtrl";
        console.log("In MainCtrl");
    }]);

angular.module("directiveExample1").directive('exampleDirective', 
    function() {
        return {
            restrict: 'EA',
            template: '<p>Hello {{var1}} !</p><p>Hello {{var2}} !</p><p>Hello isolated {{isovar}} !</p>',
            scope: {
                isovar: '='
            },
            controller: function($scope, $element){
                $scope.var1 = "In Directive's Controller ";
                console.log("In directive's controller");
                console.log("Controller function Isolated : "+$scope.isovar);
                $scope.isovar = "a sample tinkered value from the directive's controller";
            },
            link: function(scope, el, attr) {
                scope.var2 = "In directive's link";
                console.log("In directive's link");
                console.log("Link function Isolated : "+scope.isovar);
            }
        }
    });
