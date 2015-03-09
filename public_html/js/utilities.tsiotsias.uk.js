/* 
 * To change this license header, choose License Headers in Project Properties.
 * To change this template file, choose Tools | Templates
 * and open the template in the editor.
 */                                                                                                                                                                                                  
angular.module('utilities.tsiotsias.uk', [])
    .factory("utilityServices", function() {                                                                                                                                                  
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

