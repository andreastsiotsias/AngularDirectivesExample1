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
                $scope.createButton = null;
                $scope.createLink = null;
                $scope.retrieveLink = null;
                $scope.updateLink = null;
                $scope.deleteLink = null;
                $scope.clearLink = null;
                //
                $scope.createFunction = function () {
                    console.log("Create function called from Grid: "+$scope.gridid);
                    $($scope.createModal).modal({backdrop:'static',keyboard:false, show:true});
                    $scope.clearSelectionsFunction();
                };
                //
                $scope.checkCreateButton = function () {
                    if ($scope.gridOptions.createAllowed) {
                        $scope.createButton.prop("disabled", false);
                    }
                    else {
                        $scope.createButton.prop("disabled", true);
                    }
                };
                //
                $scope.checkCreateLink = function () {
                    if ($scope.gridOptions.createAllowed) {
                        $scope.createLink.show();
                    }
                    else {
                        $scope.createLink.hide();
                    }
                };
                //
                $scope.retrieveFunction = function () {
                    console.log("Retrieve function called on row: "+$scope.selectedRowID);
                };
                //
                $scope.checkRetrieveLink = function () {
                    //console.log ("check retrieve button was polled - it has value: "+$scope.isRowSelected);
                    if ($scope.isRowSelected && $scope.gridOptions.retrieveAllowed) {
                        $scope.retrieveLink.show();
                    }
                    else {
                        //console.log ("--> Retrieve FALSE");
                        $scope.retrieveLink.hide();
                    }     
                };
                //
                $scope.updateFunction = function () {
                    console.log("Update function called on row: "+$scope.selectedRowID);
                    $scope.clearSelectionsFunction();
                };
                //
                $scope.checkUpdateLink = function () {
                    if ($scope.isRowSelected && $scope.gridOptions.updateAllowed) {
                        $scope.updateLink.show();
                    }
                    else {
                        $scope.updateLink.hide();
                    }
                };
                //
                $scope.deleteFunction = function () {
                    var uid = $scope.selectedRowID;
                    console.log("Delete function called on row: "+uid);
                    if (confirm("Are you sure ?")) {
                        var dataRow = $scope.grid.data("kendoGrid").dataSource.getByUid(uid);
                        $scope.grid.data("kendoGrid").dataSource.remove(dataRow);
                        $scope.clearSelectionsFunction();
                    }
                };
                //
                $scope.checkDeleteLink = function () {
                    if ($scope.isRowSelected && $scope.gridOptions.deleteAllowed) {
                        $scope.deleteLink.show();
                    }
                    else {
                        $scope.deleteLink.hide();
                    }
                };
                //
                $scope.clearSelectionsFunction = function () {
                    //alert("Clear function called from Grid: "+$scope.gridid);
                    $scope.grid.data("kendoGrid").clearSelection();
                };
                //
                $scope.checkClearLink = function () {
                    //console.log ("check clear button was polled - it has value: "+$scope.isRowSelected);
                    if ($scope.isRowSelected) {
                        $scope.clearLink.show();
                    }
                    else {
                        $scope.clearLink.hide();
                    }
                };
                //
                $scope.fireButtonCheckers = function () {
                    //console.log ("Firing button checkers");
                    $scope.checkCreateButton();
                    $scope.checkCreateLink();
                    $scope.checkRetrieveLink();
                    $scope.checkUpdateLink();
                    $scope.checkDeleteLink();
                    $scope.checkClearLink();
                };
                //
                $scope.loadNewGrid = function () {
                    console.log ("Loading sample new grid");
                    $($scope.grid).data("kendoGrid").destroy();
                    $($scope.grid).empty();
                    console.log("Destroyed and emptied old grid .....");
                    $scope.gridOptions = {
                        createAllowed: true,
                        retrieveAllowed: true,
                        updateAllowed: true,
                        deleteAllowed: true,
                        dataSource: {
                            type: "odata",
                            transport: {
                                read: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Customers"
                            },
                            pageSize: 20
                        },
                        columns: [{
                            field: "ContactName",
                            title: "Contact Name",
                            width: 200
                        }, {
                            field: "ContactTitle",
                            title: "Contact Title"
                        }, {
                            field: "CompanyName",
                            title: "Company Name"
                        }, {
                            field: "Country",
                            width: 150
                        }],
                        "title": "Contacts"
                    };
                    //$($scope.grid).kendoGrid($scope.gridOptions);
                    $scope.createGrid($scope.grid,$scope.gridOptions);
                    console.log("Refreshed grid ..............");
                };
            },
            link: function(scope, el, attr) {
                console.log("In CRUDButtonGroup's link");
                //printObject(el,"CRUD Element");
                scope.createButton = $(el[0].querySelector('.grid-create-button'));
                scope.createLink = $(el[0].querySelector('.grid-create-link'));
                scope.retrieveLink = $(el[0].querySelector('.grid-retrieve-link'));
                scope.updateLink = $(el[0].querySelector('.grid-update-link'));
                scope.deleteLink = $(el[0].querySelector('.grid-delete-link'));
                scope.clearLink = $(el[0].querySelector('.grid-clear-link'));
                // manage CRUD buttons visibility
                scope.fireButtonCheckers();
                
            }
        }
    });
    
angular.module("directiveExample1").directive('grid', 
    function($compile) {
        return {
            restrict: 'A',
            replace: true,
            template: '<div id="{{gridid}}"></div>',
            scope: {},
            controller: function($scope, $element, utilityFunctions){
                console.log("In Grid's controller");
                $scope.gridid = utilityFunctions.guid();
                $scope.gridTitle = "Data Set Not Specified";
                $scope.isRowSelected = false;
                $scope.selectedRowID = "";
                $scope.selectedRowData = {};
                $scope.createGrid = function (a,b) {
                    $scope.initialiseGrid (a,b);
                };
                // make this function 'local' so it can be invoked by the link function of the directive
                printObject = function (a,b) {
                    utilityFunctions.printObjectContents(a,b);
                };
                // 
                //
                $scope.gridOptions = {
                    createAllowed: false,
                    retrieveAllowed: false,
                    updateAllowed: false,
                    deleteAllowed: false,
                    "columns": [
                        {"field": "col1", "title": "No Data To Display", "width": 140, "filterable": false}
                    ],
                    "dataSource" : {
                        "batch": false,
                        "pageSize": 15
                    },
                    "title": "Empty data set"
                };
            },
            link: function(scope, el, attr) {
                console.log("In Grid's link");
                // initialise scope-wide variables
                scope.grid = el;
                // initialise directive-wide variables
                var dataArea;
                var otherElementsHeight;
                //
                // Grid initialisation function
                scope.initialiseGrid = function (elem, gridConfig) {
                    //
                    // constrain some of the grid options
                    // to ensure we get a consistent look & feel and
                    // that some key elements and behaviour is
                    // guaranteed
                    constrainGrid(gridConfig);
                    // create the KENDO grid
                    elem.kendoGrid(gridConfig);
                    // set the title from the grid configuration array
                    scope.gridTitle = gridConfig.title;
                    createNavbarControls();
                    createModals();
                    // and make sure it fits snugly and adapts to window resizing
                    initialiseResizeGrid();
                    // manage the pager reset button events
                    manageResetPagerButton();
                    // add the row selection event handler
                    manageRowSelectionEvents();
                };
                //
                // now call the grid initialisation
                scope.initialiseGrid(scope.grid,scope.gridOptions);
                //
                // initialise the grid row selection event management
                function manageRowSelectionEvents () {
                    $(scope.grid).data("kendoGrid").bind("change",gridSelection);
                    // and reset the row selections
                    scope.isRowSelected = false;
                    scope.selectedRowID = "";
                    scope.selectedRowData = {};
                }
                //
                // initialise the reset on pager button event management
                function manageResetPagerButton () {
                    scope.pagerRefreshButton = scope.grid[0].querySelector('.k-pager-refresh');
                    $(scope.pagerRefreshButton).bind("click",pagerRefreshClicked);
                }
                //
                // reset on pager button click handler - resets grid selection variables
                function pagerRefreshClicked () {
                    console.log ("Refresh was clicked");
                    scope.isRowSelected = false;
                    scope.selectedRowID = "";
                    scope.selectedRowData = {};
                }
                //
                // deal with selection in grid
                function gridSelection (e) {
                    selgrid = $(scope.grid).data("kendoGrid");
                    selectedRow = selgrid.select();
                    console.log("Grid row selection called");
                    //printObject(selectedRow,"Selected Row");
                    if (selectedRow.length === 1) {
                        selectedRowModel = selgrid.dataItem(selectedRow);
                        //printObject(selectedRowModel,"Selected Row Data");
                        scope.isRowSelected = true;
                        scope.selectedRowData = angular.copy(selectedRowModel);
                        delete scope.selectedRowData._events;
                        delete scope.selectedRowData.__metadata;
                        delete scope.selectedRowData.parent;
                        //printObject(scope.selectedRowData,"scope.selectedRowData");
                        scope.selectedRowID = scope.selectedRowData.uid;
                        console.log("Selected row uid: "+scope.selectedRowID);
                    }
                    else {
                        scope.isRowSelected = false;
                        scope.selectedRowData = {};
                        scope.selectedRowID = "";
                        console.log("Deselected Row");
                    }
                    // and fire the button checkers
                    scope.fireButtonCheckers();
                }
                //
                // create the grid's NAVBAR and add the CRUD buttons and TITLE
                function createNavbarControls () {
                    scope.navbar = scope.grid[0].querySelector('.navbar-in-grid');
                    // create the NAVBAR title and attach it
                    var titleElement = angular.element('<h3 navbar-left style="width: 70%;display: inline; bottom: 0px; margin-bottom: 2px; position: absolute; overflow: hidden">Data Set: {{gridTitle}}</h3>');
                    var compiledTitleElement = $compile(titleElement);
                    compiledTitleElement(scope);
                    $(scope.navbar).append(titleElement);
                    // create the CDRUD buttons and attach to the NAVBAR
                    var crudElement = angular.element('<div crud-button-group></div>');
                    var compiledCRUDElement = $compile(crudElement);
                    compiledCRUDElement(scope);
                    $(scope.navbar).append(crudElement);
                };
                //
                // create the MODAL to go with the grid
                function createModals () {
                    var createModalElement = angular.element('<div grid-create-modal></div>');
                    var compiledGridCreateModalElement = $compile(createModalElement);
                    compiledGridCreateModalElement(scope);
                    $(scope.grid).append(createModalElement);
                    scope.createModal = createModalElement;
                };
                //
                // initiliase variables for grid resize events and management
                function initialiseResizeGrid () {
                    // first, compute the 'other elements' height
                    otherElements = scope.grid.children().not(".k-grid-content");
                    otherElementsHeight = 0;
                    otherElements.each(function(){
                        otherElementsHeight += $(this).outerHeight();
                    });
                    // adjust otherElementsHeight ...... kludge ..... seems that adding 13 pixels to it makes it work OK ... Spooky !!!!!
                    otherElementsHeight += 13;
                    //console.log("Other elements height = "+otherElementsHeight);
                    dataArea = scope.grid.find(".k-grid-content");
                    resizeGrid();
                    // deal with overall window resize events
                    window.addEventListener ("resize",resizeGrid);
                };
                //
                // ResizeGrid Function
                function resizeGrid () {
                    //console.log ('Grid was resized');
                    gridHeight = $(scope.grid).height();
                    console.log("New Grid element height = "+gridHeight);
                    dataArea.height(gridHeight - otherElementsHeight);
                    console.log("Set dataArea height to : "+dataArea.height());
                };
                //
                // Constrain / Adjust Grid Options
                function constrainGrid (gridConfig) {
                    if (!gridConfig.title) {
                        gridConfig.title = 'Data Set: Unspecified';
                    }
                    gridConfig.allowCopy = true; // allow copy to clipboard
                    gridConfig.autoBind = true;  // bind to datasource automatically
                    gridConfig.columnResizeHandleWidth = 5; // set the column grasp handle to 5 pixels
                    gridConfig.columnMenu = true;  // show the column functions twistie (filtering, sorting, etc.)
                    gridConfig.editable = false;  // disable the default editing of fields/rows - we do our own
                    gridConfig.filterable = true;  // allow filtering of data
                    gridConfig.filterable.mode = "menu";  // force filtering to popup a menu
                    gridConfig.groupable = false;  // prevent grouping of values - screws up formatting
                    gridConfig.mobile = false;  // switch off adaptive rendering for the time being
                    gridConfig.navigatable = false;  // disable keyboard navigation - it's not required (yet)
                    gridConfig.pageable = {
                        refresh: true,
                        messages: {
                            refresh: "Reload Data Set",
                            display: "Showing {0} to {1} from {2} records",
                            empty: "No records to display",
                            itemsPerPage: "records per page"
                        },
                        info: true,
                        pageSizes: [5,10,20,100],
                        pageSize: 10,
                        buttonCount: 3,
                        input: true
                    };                           // show pager at bottom and set defaults for it
                    gridConfig.reorderable = false;  // prevent user from reordering the columns
                    gridConfig.resizable = true;  // allow resizing of columns
                    gridConfig.scrollable = true;  // enable scrolling when the rows exceed visible area
                    gridConfig.selectable = "row";  // enable row selection in grid
                    gridConfig.sortable = true;  // allow sorting by clicking on column headers
                    gridConfig.toolbar = [
                        {template: '<nav class="navbar navbar-in-grid" style="margin-bottom: 0px; min-height: 20px"></nav>'}
                    ];
                }
            }
        };
    });
    
angular.module("directiveExample1").directive('gridCreateModal', 
    function() {
        return {
            restrict: 'A',
            templateUrl: './templates/gridCreateModal.html',
            replace: true,
            scope: false,
            controller: function($scope, $element, utilityFunctions){
                console.log("In gridCreateModal's controller");
                $scope.popupTitle = 'Creating Record - '+$scope.gridTitle;
                $scope.saveCreate = function () {
                    console.log("Save in CREATE function called from Grid: "+$scope.gridid);
                    $($scope.createModal).modal('hide');
                }
            },
            link: function(scope, el, attr) {
                console.log("In gridCreateModal's link");
                }
        }
    });