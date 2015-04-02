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
                    //***** LEAVE THIS ALONE ****** $($scope.createModal).modal({backdrop:'static',keyboard:false, show:true});
                    var insertItem = {
                        "Code": "30-1234",
                        "Version": "A",
                        "Maturity": "Created",
                        "Title": "A sample item for testing purposes"
                    };
                    $scope.gridDataSource.insert(0, insertItem);
                    // get the UID of the new row and use it to populate the change log
                    var dataRow = $scope.grid.data("kendoGrid").dataSource.at(0);
                    //console.log ("New Item: "+JSON.stringify(dataRow));
                    var dataRowTruncated = JSON.parse(JSON.stringify(dataRow));
                    //dataRow.changeLog = {operation: "INSERT", uid_reference: dataRow.get("uid"), record: []};
                    addToChangeLog (dataRow, "INSERT", dataRowTruncated);
                    $scope.gridIsDirty = true;
                    $scope.gridChangesPending++;
                };
                //
                $scope.retrieveFunction = function () {
                };
                //
                $scope.updateFunction = function () {
                    $scope.gridIsDirty = true;
                    var dataRow = $scope.grid.data("kendoGrid").dataSource.getByUid($scope.selectedRowID[0]);
                    //dataRow.changeLog = {operation: "UPDATE", uid_reference: dataRow.get("uid"), record: []};
                    var columnName = "Version";
                    var columnValue = "--A";
                    //dataRow.changeLog.record[0] = {column: columnName, oldValue: dataRow.get(columnName), newValue: columnValue};
                    addToChangeLog (dataRow, "UPDATE", {column: columnName, oldValue: dataRow.get(columnName), newValue: columnValue});
                    dataRow.set(columnName, columnValue);
                    var columnName = "Maturity";
                    var columnValue = "Unknown";
                    //dataRow.changeLog.record[1] = {column: columnName, oldValue: dataRow.get(columnName), newValue: columnValue};
                    // **** NEED TO FIX THIS **** addToChangeLogRecord (dataRow.changeLog, {column: columnName, oldValue: dataRow.get(columnName), newValue: columnValue});
                    dataRow.set(columnName, columnValue);
                    //dataRow.dirty = true;
                    $scope.clearSelectionsFunction();
                    $scope.gridChangesPending++;
                };
                //
                $scope.deleteFunction = function () {
                    if (confirm("Are you sure ?")) {
                        for (i=0; i<$scope.selectedRowID.length; i++) {
                            var dataRow = $scope.grid.data("kendoGrid").dataSource.getByUid($scope.selectedRowID[i]);
                            //dataRow.changeLog = {operation: "DELETE", uid_reference: dataRow.get("uid"), record: []};
                            console.log ("Unique Key is: "+$scope.resolveUniqueKey(dataRow.get("uid")));
                            addToChangeLog (dataRow, "DELETE", {});
                            $scope.grid.data("kendoGrid").dataSource.remove(dataRow);
                        }
                        $scope.gridChangesPending=$scope.gridChangesPending+$scope.selectedRowID.length;
                        $scope.clearSelectionsFunction();
                        $scope.gridIsDirty = true;
                    }
                };
                //
                addToChangeLog = function (dataRow, oper, record_data) {
                    switch (oper) {
                        case "INSERT":
                        {
                            // In the INSERT case, just re-initiliase the attribute as there will be only 1 INSERT event
                            dataRow.changeLogForINSERT = [];
                            var uid_ref = dataRow.get("uid");
                            dataRow.changeLogINSERT = {operation: oper, uid_reference: uid_ref, 
                                uniqueKey: JSON.parse($scope.resolveUniqueKey(uid_ref)), record: []};
                            addToChangeLogRecord (dataRow.changeLogINSERT,record_data);
                        }
                            break;
                        case "UPDATE":
                        {
                            
                            if (!dataRow.changeLogForUPDATE) {
                                dataRow.changeLogForUPDATE = [];
                            }
                        }
                            break;
                        case "DELETE":
                        {
                            // In the INSERT case, just re-initiliase the attribute as there will be only 1 INSERT event
                            dataRow.changeLogForDELETE = [];
                            var uid_ref = dataRow.get("uid");
                            dataRow.changeLogDELETE = {operation: oper, uid_reference: uid_ref, 
                                uniqueKey: JSON.parse($scope.resolveUniqueKey(uid_ref)), record: []};
                            addToChangeLogRecord (dataRow.changeLogDELETE,record_data);
                        }
                            break;
                    }
                    if (!dataRow.changeLog) {
                        dataRow.changeLog = [];
                    }
                    var nextChangeLogEntry = dataRow.changeLog.length;
                    dataRow.changeLog[nextChangeLogEntry] = {operation: oper, uid_reference: dataRow.get("uid"), record: []};
                    addToChangeLogRecord (dataRow.changeLog[nextChangeLogEntry],record_data);
                }
                //
                addToChangeLogRecord = function (changeLog, record_data) {
                    var nextChangeLogRecord = changeLog.record.length;
                    changeLog.record[nextChangeLogRecord]=record_data;
                }
                //
                $scope.clearSelectionsFunction = function () {
                    $scope.grid.data("kendoGrid").clearSelection();
                };
                //
                $scope.saveFunction = function () {
                    console.log ("Called saveFunction");
                    $scope.gridIsDirty = false;
                    $scope.gridChangesPending = 0;
                    $scope.grid.data("kendoGrid").dataSource.sync();
                };
                //
                $scope.loadNewGrid = function () {
                    $($scope.grid).data("kendoGrid").destroy();
                    $($scope.grid).empty();
                    $scope.gridIsDirty = false;
                    $scope.gridChangesPending = 0;
                    $scope.gridOptions = {
                        createAllowed: true,
                        retrieveAllowed: true,
                        updateAllowed: true,
                        deleteAllowed: true,
                        dataSource: {
                            schema: {
                                model: {
                                    id: "uid",
                                    uniqueKey: ["Code","Version"],
                                    fields: {
                                        "Code": {
                                            "type": "string",
                                            "nullable": false
                                        },
                                        "Version": {
                                            "type": "string",
                                            "nullable": false
                                        },
                                        "Maturity": {
                                            "type": "string",
                                            "nullable": false
                                        },
                                        "Title": {
                                            "type": "string",
                                            "nullable": false
                                        }
                                    }
                                },
                            },
                            transport: {
                                read: {
                                    url: "./Goods.json"
                                },
                                create: {
                                    url: "http://localhost:8080/ATDataGridWork/GoodsOperations",
                                    dataType: "jsonp",
                                    contentType: "application/json"
                                },
                                destroy: {
                                    url: "http://localhost:8080/ATDataGridWork/GoodsOperations",
                                    dataType: "jsonp",
                                    contentType: "application/json"
                                },
                                update: {
                                    url: "http://localhost:8080/ATDataGridWork/GoodsOperations",
                                    dataType: "jsonp",
                                    contentType: "application/json"
                                }
                                ,
                                parameterMap: function(options, operation) {
                                    //console.log ("Parameter Map type: "+operation);
                                   if (operation == "read") {
                                       return {
                                           $format: "json",
                                           $inlinecount: "allpages"
                                       };
                                    }
                                    else {
                                        console.log("Number of Models: "+options.models.length);
                                        for (i=0;i<options.models.length;i++) {
                                            console.log ("---> models["+i+"]:"+options.models[i].changeLog);
                                        }
                                        //printObject(options.models[0], "Options.Models.0");
                                        return {
                                            numberOfChanges: options.models.length,
                                            changes: kendo.stringify(options.models[0].changeLog)
                                            //options: kendo.stringify("{}")};
                                        };
                                    }
                                }
                            },
                            batch: true,
                            pageSize: 20
                        },
                        columns: [{
                            field: "uid",
                            title: "Unique ID"
                        }, {
                            field: "Code",
                            title: "Part Code"
                        }, {
                            field: "Version",
                            title: "Revison"
                        }, {
                            field: "Maturity",
                            title: "Status"
                        }, {
                            field: "Title",
                            title: "Description"
                        }],
                        title: "Goods"
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
                $scope.selectedRowID = [];
                $scope.gridIsDirty = false;
                $scope.gridDataSource;
                $scope.gridChangesPending = 0;
                //
                $scope.createGrid = function (a,b) {
                    $scope.initialiseGrid (a,b);
                };
                // resolve the unique key
                $scope.resolveUniqueKey = function (uidForKey) {
                    // function returnes the JSON object of the resolved unique key as a STRING
                    var rowData = $scope.gridDataSource.getByUid(uidForKey);
                    if (!$scope.gridOptions.dataSource.schema.model.uniqueKey) {
                        // if this has not been defined, then we use the whole record
                        return JSON.stringify(rowData);
                    }
                    else {
                        // Looks like key has been defined
                        var resolvedKey = copyObject (rowData,$scope.gridOptions.dataSource.schema.model.uniqueKey);
                        return JSON.stringify(resolvedKey);
                    }
                };
                // copyObject - selectively copies attributes from one object to another
                function copyObject (obj,attrs) {
                    var newObj = {};
                    for (var key in obj) {
                        if (attrs.indexOf(key) > -1) {
                            newObj[key] = obj[key];
                        }
                    }
                    return newObj;
                }
                //
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
                    scope.gridDataSource.bind("sync",gridDataSourceSync);
                    scope.gridDataSource.bind("error",gridDataSourceError);
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
                        scope.selectedRowID = [];
                    });
                }
                //
                // deal with selection in grid
                function gridSelection (e) {
                    selgrid = $(scope.grid).data("kendoGrid");
                    selectedRow = selgrid.select();
                    scope.rowsSelected = selectedRow.length;
                    // process selections (or de-selections)
                    if (selectedRow.length > 0) {
                        for (i=0; i<selectedRow.length; i++) {
                            var selectedRowModel = selgrid.dataItem(selectedRow[i]);
                            scope.$apply (function() {
                                scope.areRowsSelected = true;
                                scope.selectedRowID[i] = selectedRowModel.uid;
                            });
                            //console.log ("Selected Row UID["+i+"]:"+scope.selectedRowID[i]);
                        }
                    }
                    else {
                        scope.areRowsSelected = false;
                        scope.selectedRowID = [];
                        //console.log ("No Rows Selected");
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
                    console.log ("Datasource CHANGE event: "+evt.action);
                    if (evt.action) {
                        //printObject(evt, "Change Event");
                        //printObject(evt.items[0], "Change Items");
                        console.log ("---> Affected Items: "+evt.items.length);
                        //printObject(evt.sender.options, "Change Sender");
                    }
                    if (! evt.action) {
                        // we assume that it is a pager-initiated function; hence, we assume selections have been cleared
                        scope.$apply (function() {
                            scope.areRowsSelected = false;
                            scope.rowsSelected = 0;
                            scope.selectedRowID = [];
                        });
                    }
                }
                // capture and process data source sync (response from server OK) events
                function gridDataSourceSync () {
                    console.log ("Datasource SYNC completed OK");
                }
                // capture and process data source error (response from server NOT OK) events
                function gridDataSourceError (evt) {
                    console.log ("Datasource Server-Comms Error: "+evt.status);
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
