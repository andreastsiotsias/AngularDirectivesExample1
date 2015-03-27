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
                //
                $scope.createFunction = function () {
                    //$($scope.createModal).modal({backdrop:'static',keyboard:false, show:true});
                    var insertItem = {
                        "ContactName": "A NEW Andreas Tsiotsias",
                        "ContactTitle": "Technical Advocate",
                        "CompanyName": "IBM UK Ltd",
                        "Country": "UK-GB"
                    };
                    $scope.gridDataSource.insert(0, insertItem);
                    insertItem = {
                        "ContactName": "Andrew Blake",
                        "ContactTitle": "Software Client Architect",
                        "CompanyName": "IBM UK Ltd",
                        "Country": "UK-GB"
                    };
                    $scope.gridDataSource.insert(0, insertItem);
                    $scope.gridIsDirty = true;
                };
                //
                $scope.retrieveFunction = function () {
                };
                //
                $scope.updateFunction = function () {
                    $scope.gridIsDirty = true;
                    var dataRow = $scope.grid.data("kendoGrid").dataSource.getByUid($scope.selectedRowID);
                    var columnName = "ContactName";
                    var columnValue = "Andreas Stylianos Tsiotsias";
                    dataRow.set(columnName, columnValue);
                    //dataRow.dirty = true;
                    $scope.clearSelectionsFunction();
                };
                //
                $scope.deleteFunction = function () {
                    var uid = $scope.selectedRowID;
                    if (confirm("Are you sure ?")) {
                        var dataRow = $scope.grid.data("kendoGrid").dataSource.getByUid(uid);
                        $scope.grid.data("kendoGrid").dataSource.remove(dataRow);
                        //dataRow.dirty = true;
                        $scope.clearSelectionsFunction();
                        $scope.gridIsDirty = true;
                    }
                };
                //
                $scope.clearSelectionsFunction = function () {
                    $scope.grid.data("kendoGrid").clearSelection();
                };
                //
                $scope.saveFunction = function () {
                    console.log ("Called saveFunction");
                    $scope.gridIsDirty = false;
                    $scope.grid.data("kendoGrid").dataSource.sync();
                    //printObject ($scope.grid.data("kendoGrid").dataSource, "Data Source");
                };
                //
                $scope.loadNewGrid = function () {
                    $($scope.grid).data("kendoGrid").destroy();
                    $($scope.grid).empty();
                    $scope.gridIsDirty = false;
                    $scope.gridOptions = {
                        createAllowed: true,
                        retrieveAllowed: true,
                        updateAllowed: true,
                        deleteAllowed: true,
                        dataSource: {
                            schema: {
                                model: {
                                    id: "uid",
                                    uniqueKey: ["ContactName","ContatTitle"],
                                    fields: {
                                        "ContactName": {
                                            "type": "string",
                                            "nullable": false
                                        },
                                        "ContactTitle": {
                                            "type": "string",
                                            "nullable": false
                                        },
                                        "CompanyName": {
                                            "type": "string",
                                            "nullable": false
                                        },
                                        "Country": {
                                            "type": "string",
                                            "nullable": false
                                        }
                                    }
                                },
                            },
                            type: "odata",
                            serverFiltering: true,
                            transport: {
                                read: {
                                    url: "http://demos.telerik.com/kendo-ui/service/Northwind.svc/Customers"
                                },
                                create: {
                                    url: "./CustomersCreate.json",
                                    type: "GET",
                                    dataType: "json"
                                },
                                destroy: {
                                    url: "./CustomersDestroy.json",
                                    type: "GET",
                                    dataType: "json"
                                },
                                update: {
                                    url: "./CustomersUpdate.json",
                                    type: "POST",
                                    dataType: "json",
                                    contentType: "application/json"
                                }
                                //,
                                //parameterMap: function(options, operation) {
                                //    //console.log ("Parameter Map type: "+operation);
                                //   if (operation == "read") {
                                //       return {
                                //           $format: "json",
                                //           $inlinecount: "allpages"
                                //       }
                                //    }
                                //    else {
                                //      console.log("Saved On:"+options.savedOn);
                                //       //printObject(options, "Options");
                                //       //printObject(options.__metadata,"__metadata");
                                //       return {options: kendo.stringify(options)};
                                //   }
                                //}
                            },
                            batch: true,
                            pageSize: 20
                        },
                        columns: [{
                            field: "uid",
                            title: "Unique ID"
                        }, {
                            field: "ContactName",
                            title: "Contact Name"
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
                        title: "Contacts"
                    };
                    //
                    $scope.createGrid($scope.grid,$scope.gridOptions);
                };
            },
            link: function(scope, el, attr) {
            }
        };
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
                $scope.areRowsSelected = false;
                $scope.rowsSelected = 0;
                $scope.selectedRowID = "";
                $scope.selectedRowData = {};
                $scope.gridIsDirty = false;
                $scope.gridDataSource;
                $scope.gridDataSourceChangeLog = [];
                //
                $scope.createGrid = function (a,b) {
                    $scope.initialiseGrid (a,b);
                };
                // make this function 'local' so it can be invoked by the link function of the directive
                printObject = function (a,b) {
                    utilityFunctions.printObjectContents(a,b);
                };
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
                // initialise scope-wide variables
                scope.grid = el;
                // initialise directive-wide variables
                var gridHeight;
                var dataArea;
                var otherElements;
                var otherElementsHeight;
                var gridDataSource;
                var selgrid;
                var selectedRow;
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
                    // add the grid datasource change events handler
                    manageGridDataSourceChange();
                };
                //
                // now call the grid initialisation
                scope.initialiseGrid(scope.grid,scope.gridOptions);
                //
                // initialise the grid row selection event management
                function manageRowSelectionEvents () {
                    $(scope.grid).data("kendoGrid").bind("change",gridSelection);
                }
                //
                // initialise the grid data source change event management
                function manageGridDataSourceChange () {
                    scope.gridDataSource = $(scope.grid).data("kendoGrid").dataSource;
                    scope.gridDataSource.bind("change",gridDataSourceChange);
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
                    scope.$apply (function() {
                        scope.gridIsDirty = false;
                        scope.areRowsSelected = false;
                        scope.rowsSelected = 0;
                        scope.selectedRowID = "";
                        scope.selectedRowData = {};
                    });
                }
                //
                // deal with selection in grid
                function gridSelection (e) {
                    selgrid = $(scope.grid).data("kendoGrid");
                    selectedRow = selgrid.select();
                        
                    if (selectedRow.length === 1) {
                        var selectedRowModel = selgrid.dataItem(selectedRow);
                        scope.$apply (function() {
                            scope.areRowsSelected = true;
                            scope.rowsSelected = selectedRow.length;
                            scope.selectedRowData = angular.copy(selectedRowModel);
                            delete scope.selectedRowData._events;
                            delete scope.selectedRowData.__metadata;
                            delete scope.selectedRowData.parent;
                            scope.selectedRowID = scope.selectedRowData.uid;
                        });
                    }
                    else if (selectedRow.length > 1) {
                        scope.$apply (function() {
                            scope.areRowsSelected = true;
                            scope.rowsSelected = selectedRow.length;
                        });
                    }
                    else {
                        scope.areRowsSelected = false;
                        scope.rowsSelected = 0;
                        scope.selectedRowData = {};
                        scope.selectedRowID = "";
                    }
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
                    dataArea = scope.grid.find(".k-grid-content");
                    resizeGrid();
                    // deal with overall window resize events
                    window.addEventListener ("resize",resizeGrid);
                };
                //
                // ResizeGrid Function
                function resizeGrid () {
                    gridHeight = $(scope.grid).height();
                    dataArea.height(gridHeight - otherElementsHeight);
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
                    gridConfig.selectable = "multiple";  // enable row selection in grid
                    gridConfig.sortable = true;  // allow sorting by clicking on column headers
                    gridConfig.toolbar = [
                        {template: '<nav class="navbar navbar-in-grid" style="margin-bottom: 0px; min-height: 20px"></nav>'}
                    ];
                }
                //
                // capture and process data source change events
                function gridDataSourceChange (evt) {
                    console.log ("Change event: "+evt.action);
                    if (evt.action) {
                        printObject(evt, "Change Event");
                        printObject(evt.items[0], "Change Items");
                        //printObject(evt.sender.options, "Change Sender");
                    }
                    if (! evt.action) {
                        // we assume that it is a pager-initiated function; hence, we assume selections have been cleared
                        scope.$apply (function() {
                            scope.areRowsSelected = false;
                            scope.rowsSelected = 0;
                            scope.selectedRowData = {};
                            scope.selectedRowID = "";
                        });
                    }
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
                $scope.popupTitle = 'Creating Record - '+$scope.gridTitle;
                //
                // deal with save button event from the modal
                $scope.saveCreate = function () {
                    $($scope.createModal).modal('hide');
                    $scope.gridIsDirty = true;
                }
            },
            link: function(scope, el, attr) {
                }
        }
    });
