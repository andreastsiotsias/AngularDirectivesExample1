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
                $scope.fieldid = utilityFunctions.guid();
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
                $scope.fieldid = utilityFunctions.guid();
                console.log("In passwordInputField's controller");
            },
            link: function(scope, el, attr) {
                console.log("In passwordInputField's link");
                }
        }
    });
    
angular.module("directiveExample1").directive('crudButtonGroup', 
    function() {
        return {
            restrict: 'A',
            templateUrl: './templates/CRUDButtonGroup.html',
            replace: true,
            scope: false,
            controller: function($scope, $element, utilityFunctions){
                console.log("In CRUDButtonGroup's controller");
                $scope.createFunction = function () {
                    alert("Create function called from Grid: "+$scope.gridid);
                }
                $scope.retrieveFunction = function () {
                    alert("Retrieve function called from Grid: "+$scope.gridid);
                }
                $scope.updateFunction = function () {
                    alert("Update function called from Grid: "+$scope.gridid);
                }
                $scope.deleteFunction = function () {
                    alert("Delete function called from Grid: "+$scope.gridid);
                }
            },
            link: function(scope, el, attr) {
                console.log("In CRUDButtonGroup's link");
            }
        }
    });
    
angular.module("directiveExample1").directive('grid', 
    function($compile) {
        return {
            restrict: 'A',
            replace: true,
            template: '<div id="{{gridid}}" class="gridcontainer"</div>',
            scope: {},
            controller: function($scope, $element, utilityFunctions){
                console.log("In dataGrid's controller");
                $scope.gridid = utilityFunctions.guid();
                $scope.gridTitle = "Data Set Not Specified";

                $scope.gridOptions = {
                    "autoBind": true,
                    "columnMenu": true,
                    "columns": [
                        {"field": "col1", "title": "No Data To Display", "width": 140, "filterable": false}
                    ],
                    "dataSource" : {
                        "batch": false,
                        "pageSize": 15
                    },
                    "editable": {
                        "mode": "popup"
                    },
                    "filterable": true,
                    "groupable": false,
                    "pageable": {
                        "refresh": true,
                        "pageSizes": [5, 10, 20, 100],
                        "input": true
                    },
                    "resizable": true,
                    "scrollable": true,
                    "selectable": "row",
                    "sortable": true,
                    "toolbar": [
                        {template: '<nav class="navbar navbar-in-grid" style="margin-bottom: 0px;min-height: 20px"></nav>'}
                    ]
                };
            },
            link: function(scope, el, attr) {
                console.log("In dataGrid's link");
                el.kendoGrid(scope.gridOptions);
                scope.grid = el;
                scope.navbar = el[0].querySelector('.navbar-in-grid');
                // create the NAVBAR title and attach it
                var titleElement = angular.element('<h3 navbar-left style="width: 70%;display: inline;padding-top: 25px;">{{gridTitle}}</h3>');
                var compiledTitleElement = $compile(titleElement);
                compiledTitleElement(scope);
                $(scope.navbar).append(titleElement);
                // create the CDRUD buttons and attach to the NAVBAR
                var crudElement = angular.element('<div crud-button-group></div>');
                var compiledCRUDElement = $compile(crudElement);
                compiledCRUDElement(scope);
                $(scope.navbar).append(crudElement);
            }
        }
    });