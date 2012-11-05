// This json filter will not remove the $ref, $id, etc. keys from the server response
var MongoDBViewerModule = angular.module('MongoDBViewerModule', []);

    MongoDBViewerModule.filter('commonJson', function () {
        return function (input) {
            return MongoJSON.stringify(input, commonJsonReplacer,'  ', true);
        }
    }).
    filter('fileSize', function ($filter) {
        return function (input) {
            var inputNumber;
            var stringResult = "";
            if(typeof input === "string") {
                inputNumber = parseFloat(input);
            } else {
                // Assume its already an number
                inputNumber = input;
            }

            b = 1024;
            kb = 1024 * 1024;
            mb = 1024 * 1024 * 1024;
            gb = 1024 * 1024 * 1024 * 1024;
            tb = 1024 * 1024 * 1024 * 1024 * 1024;

            // TODO : localization (Bytes, Octets, ...?)
            // Bytes
            if(inputNumber < b) {
                stringResult = "" + inputNumber + " B"
            } else if(inputNumber >= b && inputNumber < kb) {
                stringResult = "" + $filter('number')(inputNumber / b, 2) + " KB"
            } else if(inputNumber >= kb && inputNumber < mb) {
                stringResult = "" + $filter('number')( inputNumber / kb, 2) + " MB"
            } else if(inputNumber >= mb && inputNumber < gb) {
                stringResult = "" + $filter('number')( inputNumber / mb, 2) + " GB"
            } else {
                stringResult = "" + $filter('number')( inputNumber / gb, 2) + " TB"
            }

            return stringResult;
        }
    });