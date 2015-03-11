/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */                                                                                                                                                                                                  
angular.module('utility.services', []);

angular.module('utility.services')
    .factory("utilityFunctions", function() {                                                                                                                                                  
        return {
            getType: function(elem) {
                return Object.prototype.toString.call(elem).slice(8, -1).toLowerCase();
            },
            html2DOM: function(html) {
                var el = document.createElement('div');
                el.innerHTML = html;
                return el;
            },
            printObjectContents: function(obj) {
                var keys = Object.keys(obj);
                console.log("<------ Printing Object contents");
                for (var i = 0; i < keys.length; i++) {
                    console.log("Object key : "+keys[i]+" value : "+obj[keys[i]]);
                }
                console.log("------->");
            },
            guid: function () {
                function s4() {
                    return Math.floor((1 + Math.random()) * 0x10000)
                        .toString(16)
                        .substring(1);
                }
                return s4() + s4() + '-' + s4() + '-' + s4() + '-' +
                    s4() + '-' + s4() + s4() + s4();
            }
        };
    });

angular.module('utility.services')
    .factory('jsonpHTTPDataService', function($http) {
        var getData = function(URL) {
            //return $http.jsonp("http://angularjs.org/greet.php?callback=JSON_CALLBACK&name=Super%20Hero").
            return $http.jsonp(URL).
                success(function(result) {
                    console.log("JSONP Request succeeded");
                    //console.log("Result : "+JSON.stringify(result));
                    return result;
                }).
                error(function (result) {
                    console.log("Request failed");
                });
            };
        return { getData: getData };
        
});

angular.module('utility.services')
    .factory('getHTTPDataService', function($http) {
        var getData = function(URL) {
            return $http.get(URL).
                success(function(result) {
                    console.log("GET Request succeeded");
                    //console.log("Result : "+JSON.stringify(result));
                    return result;
                }).
                error(function (result) {
                    console.log("Request failed");
                });
            };
        return { getData: getData };
});