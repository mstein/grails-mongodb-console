// This json filter will not remove the $ref, $id, etc. keys from the server response
    MongoDBConsoleModule.filter('commonJson', function () {
        return function (input) {
            return MongoJSON.stringify(input, commonJsonReplacer,'  ', {tengen:true, escapeHtml:true});
        }
    })
    .filter('fileSize', function ($filter) {
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
    })
    .filter('duration', function(){
        return function(input, precision, alwaysDisplayAll) {
            if(!input) return "";

            var inputNumber;
            var stringResult = "";
            if(typeof input === "string") {
                inputNumber = parseFloat(input);
            } else {
                // Assume its already an number
                inputNumber = input;
            }

            // The field that may or may not be displayed
            var selectedFields = {months:false, days:false, hours: false, minutes: false, seconds: false, millis: false};

            // Determine if a field should be displayed if its equals zero
            alwaysDisplayAll = alwaysDisplayAll != undefined ? alwaysDisplayAll : false;

            // List of supported fields
            var fields = [
                {name:"months", ratio: 2592000000, label:{short:"M", single:"month", plural:"months"}},
                {name:"days", ratio: 86400000, label:{short:"d", single:"day", plural:"days"}},
                {name:"hours", ratio: 3600000, label:{short:"h", single:"hour", plural:"hours"}},
                {name:"minutes", ratio: 60000, label:{short:"min", single:"minute", plural:"minutes"}},
                {name:"seconds", ratio: 1000, label:{short:"s", single:"second", plural:"seconds"}},
                {name:"millis", ratio: 1, label:{short:"ms", single:"millisecond", plural:"milliseconds"}}
            ];

            // If the user has specified a custom list of fields, then use them
            if(precision != undefined && precision != null && precision.trim() != "") {
                var userSelection = precision.split(',');
                for(i=0; i < userSelection.length; i++) {
                    selectedFields[userSelection[i].trim()] = true
                }
            } else {
                // The default behavior is to use all fields except the millis
                selectedFields.months = true;
                selectedFields.days = true;
                selectedFields.hours = true;
                selectedFields.minutes = true;
                selectedFields.seconds = true;
            }

            // Assumes that the input is millis
            for(i=0; i < fields.length; i++) {
                if(selectedFields[fields[i].name]) {
                    var currentFieldValue = Math.floor(inputNumber / fields[i].ratio);
                    if(currentFieldValue != 0 || (currentFieldValue == 0 && alwaysDisplayAll)) {
                        stringResult += "" + currentFieldValue + fields[i].label.short + " ";
                    }
                    inputNumber = (inputNumber % fields[i].ratio);
                }
            }

            return stringResult;
        }
    })
    ;