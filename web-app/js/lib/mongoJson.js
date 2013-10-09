/**
 * Based on json2.js and customized to allow some illegal strict JSON representation so that the output is similar to the one
 * provided by the mongo shell.
 *
 * See http://www.JSON.org/js.html
 * See http://www.mongodb.org
 */

function MongoJSON() {}

(function () {
    'use strict';

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = { // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"' : '\\"',
            '\\': '\\\\'
        },
        rep;

// A function used by a Regex replacer to tolerate unquoted keys
    // the value pattern means allows : "strings", true, false, null, {object}, [array], number, -number, numberEpower, numberE-power
    var unquotedKeyPattern = /(\{|,|\[)\s*([a-zA-Z0-9_$]+)\s*: *("[^"\\\n\r]*"|true|false|null|\{.+?\}|\[.+\]|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)\s*(?=,|\}|\])/g;
    function quoteKeys(match, startSymbol, key, value, options) {
        var val = value;
        if(/{|,\s*[a-zA-Z0-9_$]+\s*: *.+?,|}/.test(val)) {
            val = value.replace(unquotedKeyPattern, quoteKeys)
        }
        return startSymbol + '"'+ key +'":' + val;
    }

    // Parsing any mongodb 10Gen JSON types and converts them into their strict JSON equivalent :
    function mongoMarshalling(text) {

//  ObjectId becomes $oid
//  DBRef becomes $ref, $id
//  Date & ISODate become $date
//  Timestamp becomes $timestamp
//  undefined becomes $undefined
//  Regexp becomes $regex & $options
//  #Special case : NumberLong becomes $numberLong, which is NOT a mongo representation, but needed for our own scheme
// TODO
//  BinData
//  Support DBRef with the third parameter (the dbname), and support parsing of the id parameter of the DBRef to allow any mongodb bson type

        // ObjectId
        if(/ObjectId\(.+\)/.test(text)) {
            text = text.replace(/ObjectId\("([a-zA-Z0-9\-]+)"\)/g, '{"$oid":"$1"}');
        }
        // DBRef
        if(/DBRef\(.+\)/.test(text)) {
            text = text.replace(/DBRef\("([a-zA-Z0-9\-]+)", *([^\n\r]*?)\)\s*(?=,|\}|\])/gm, function(match, reference, id){
                return '{"$ref":"'+reference+'", "$id":'+mongoMarshalling(id)+'}';
            });
        }
        // empty Date call are replaced by the current date
        if(/(ISO)?Date\(\)/.test(text)) {
            var date = new Date();
            text = text.replace(/(ISO)?Date\(\)/g, '{"$date":"'+date.toJSON()+'"}');
        }
        // Date & ISODate
        if(/(ISO)?Date\(.*\)/.test(text)) {
            text = text.replace(/(ISO)?Date\("([0-9\-TZ\.:']+)"\)/g, '{"$date":"$2"}');
        }
        // Timestamp
        if(/Timestamp\(.+\)/.test(text)) {
            text = text.replace(/Timestamp\(([0-9]+), ([0-9]+)\)/g, '{"$timestamp":{"t": $1, "i": $2}}');
        }
        // undefined
        if(/[^\r\n{}\[\]]: *undefined/i.test(text)) {
            text = text.replace(/([^\r\n{}\[\]]: *)(undefined)/gi, '$1{"$undefined": true}');
        }
        // # Javascript Big Number Issue
        // A javascript Number cannot be greater than 9007199254740992 (2^53), so if a user inputs a number greater than this
        // without using the NumberLong() syntax, his input will be rounded by Javascript, which may cause unwanted behavior and data corruption
        // if it where used in a update or remove command
        // To prevent this, we marshall all numbers greater than 9007199254740992 as NumberLong()
        if(/[^\r\n{}\[\]]: *[0-9]{16,}/i.test(text)) {
            text = text.replace(/([^\r\n{}\[\]]: *)([0-9]{16,})/gi, function(match, key, number){
                var asNumber = parseInt(number);
                var result = number;
                // Check if the number is too big, then transform it into a NumberLong
                if(asNumber + 1 == asNumber) {
                    result = '{"$numberLong":"'+number+'"}';
                }
                return key + result;
            });
        }
        // NumberLong
        if(/NumberLong\(.+\)/.test(text)) {
            text = text.replace(/NumberLong\("?([0-9]+)"?\)/g, '{"$numberLong":"$1"}');
        }
        // Regexp
        if(/(?::\s*)\/[^\r\n]*?\/[a-zA-Z]*/.test(text)) {
            text = text.replace(/\/([^\r\n]*?)\/([a-zA-Z]*)/g, function(match, pattern, options) {
                return '{"$regex":"'+pattern.replace(/[^\\]"/g, '\\"')+'", "$options": "'+options+'"}'
            });
        }
        /*// unescaped doublequote inside double quote are escaped
         if(/"(.*?)"(.*?)"/gi.test(text)){
         text = text.replace(/"(.*?)"(.*?)"/gi, '"$1\\"$2"');
         }
         // Prevent JS script from executing :
         if(/<script>.*?<\/script>/gi.test(text)) {
         text = text.replace(/<script>(.*?)<\/script>/gi, '&lt;script&gt;$1&lt;/script&gt;');
         }*/

        // Allow keys to tolerate the lack of double quote in certain circumstances
        if(/\{|,\s*[a-zA-Z0-9_$]+\s*: *.+?,|\}/.test(text)) {
            text = text.replace(unquotedKeyPattern, quoteKeys);
        }

        return text;
    }




// If the string contains no control characters, no quote characters, and no
// backslash characters, then we can safely slap some quotes around it.
// Otherwise we must also replace the offending characters with safe escape
// sequences.
    function quote(string) {
        escapable.lastIndex = 0;
        return escapable.test(string) ? '"' + string.replace(escapable, function (a) {
            var c = meta[a];
            return typeof c === 'string'
                ? c
                : '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
        }) + '"' : '"' + string + '"';
    }

    function enclose (value, original, tengenOptions) {
        // If the value has a tengenJSON method, call it to obtain a replacement value.
        if (tengenOptions.useTengen && original && typeof original === 'object' &&
            typeof original.tengenJSON === 'function') {
            value = original.tengenJSON(value, tengenOptions.useTag);
        }
        return value;
    }

    function str(key, holder, options) {
        var tengen = false;
        var tengenTagged = true;
        var escapeHtml = false;
        if(options != undefined) {
            if(options.tengen != undefined) {
                tengen = options.tengen;
            }
            if(options.tengenTag != undefined) {
                tengenTagged = options.tengenTag;
            }
            if(options.escapeHtml != undefined) {
                escapeHtml = options.escapeHtml;
            }
        }

        var tengenOptions = {
            useTengen:tengen != null && tengen != undefined && tengen,
            useTag:tengenTagged
        };
// Produce a string from holder[key].

        var i, // The loop counter.
            k, // The member key.
            v, // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

// If the value has a toJSON method, call it to obtain a replacement value.
        if (value && typeof value === 'object' &&
            typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

// If we were called with a replacer function, then call the replacer to
// obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

// What happens next depends on the value's type.

        switch (typeof value) {
            case 'function':
                if(tengenOptions.useTengen) {
                    return enclose(value.call(), holder[key], tengenOptions);
                } else {
                    return value.call();
                }
            case 'string':
                if(escapeHtml) {
                    value = escapeHtmlChars(value);
                }
                return enclose(quote(value), holder[key], tengenOptions);

            case 'number':

// JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? enclose(String(value), holder[key], tengenOptions) : 'null';

            case 'boolean':
            case 'null':

// If the value is a boolean or null, convert it to a string. Note:
// typeof null does not produce 'null'. The case is included here in
// the remote chance that this gets fixed someday.

                return enclose(String(value), holder[key], tengenOptions);

// If the type is 'object', we might be dealing with an object or an array or
// null.

            case 'object':

// Due to a specification blunder in ECMAScript, typeof null is 'object',
// so watch out for that case.

                if (!value) {
                    return 'null';
                }

// Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

// Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

// The value is an array. Stringify every element. Use null as a placeholder
// for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value, options) || 'null';
                    }

// Join all of the elements together, separated with commas, and wrap them in
// brackets.

                    v = partial.length === 0
                        ? '[]'
                        : gap
                        ? '[\n' + gap + partial.join(',\n' + gap) + '\n' + mind + ']'
                        : '[' + partial.join(',') + ']';
                    gap = mind;
                    return enclose(v, holder[key], tengenOptions);
                }

// If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        if (typeof rep[i] === 'string') {
                            k = rep[i];
                            v = str(k, value, options);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

// Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = str(k, value, options);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

// Join all of the member texts together, separated with commas,
// and wrap them in braces.

                v = partial.length === 0
                    ? '{}'
                    : gap
                    ? '{\n' + gap + partial.join(',\n' + gap) + '\n' + mind + '}'
                    : '{' + partial.join(',') + '}';
                gap = mind;

                return enclose(v, holder[key], tengenOptions);
        }
    }

// If the MongoJSON object does not yet have a stringify method, give it one.

    if (typeof MongoJSON.stringify !== 'function') {
        MongoJSON.stringify = function (value, replacer, space, options) {
// The stringify method takes a value and an optional replacer, and an optional
// space parameter, and returns a JSON text. The replacer can be a function
// that can replace values, or an array of strings that will select the keys.
// A default replacer method can be provided. Use of the space parameter can
// produce text that is more easily readable.
// options include :
// - tengen : a boolean determining if the parser should stringify into a 10gen JSON (BSON) syntax, with the ObjectId, NumberLong, etc. (default to FALSE)
// - escapeHtml : a boolean determining if the content of each entry should be escaping html tags (default to FALSE)

            var i;
            gap = '';
            indent = '';

// If the space parameter is a number, make an indent string containing that
// many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

// If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

// If there is a replacer, it must be a function or an array.
// Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                (typeof replacer !== 'object' ||
                    typeof replacer.length !== 'number')) {
                throw new Error('MongoJSON.stringify');
            }

// Make a fake root object containing our value under the key of ''.
// Return the result of stringifying the value.

            return str('', {'': value}, options);
        };
    }


// If the MongoJSON object does not yet have a parse method, give it one.

    if (typeof MongoJSON.parse !== 'function') {
        MongoJSON.parse = function (text, reviver) {

// The parse method takes a text and an optional reviver function, and returns
// a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

// The walk method is used to recursively walk the resulting structure so
// that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.prototype.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


// Parsing happens in four stages. In the first stage, we replace certain
// Unicode characters with escape sequences. JavaScript handles many characters
// incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

// TenGen conversion phase
// Parsing any mongodb 10Gen JSON types and converts them into their strict JSON equivalent :
            text = mongoMarshalling(text);

// In the second stage, we run the text against regular expressions that look
// for non-JSON patterns. We are especially concerned with '()' and 'new'
// because they can cause invocation, and '=' because it can cause mutation.
// But just to be safe, we want to reject all unexpected forms.

// We split the second stage into 4 regexp operations in order to work around
// crippling inefficiencies in IE's and Safari's regexp engines. First we
// replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
// replace all simple value tokens with ']' characters. Third, we delete all
// open brackets that follow a colon or comma or that begin the text. Finally,
// we look to see that the remaining characters are only whitespace or ']' or
// ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
                .test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
                .replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
                .replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

// In the third stage we use the eval function to compile the text into a
// JavaScript structure. The '{' operator is subject to a syntactic ambiguity
// in JavaScript: it can begin a block or an object literal. We wrap the text
// in parens to eliminate the ambiguity.
                j = eval('(' + text + ')');

// In the optional fourth stage, we recursively walk the new structure, passing
// each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function'
                    ? walk({'': j}, '')
                    : j;
            }

// If the text is not JSON parseable, then a SyntaxError is thrown.
            throw new SyntaxError('MongoJSON.parse on :'+text);
        };
    }

// A convenience method to use the parser with the tengen reviver automatically
    if(typeof MongoJSON.parseTengen !== 'function') {
        MongoJSON.parseTengen = function(value) {
            return MongoJSON.parse(value, mongoJsonReviver);
        }
    }

    /**
     * Extension to the JSON parser to allow mongo-formatted JSON,
     * which may be traditional strict JSON or mongo extended JSON ($oid, $ref, $id, ...).
     *
     * @param key
     * @param value
     * @return
     */
    function mongoJsonReviver(key, value){
        var val = value;
        if(value != null && typeof value === 'object') {
            if(value['$oid'] != null) {
                val = new MongoObjectId(value['$oid']);
            }
            if(value['$data'] != null) {
                val = new MongoBinaryData(value['$data'].size);
            }
            if(value['$ref'] != null) {
                val = new MongoReference(value['$ref'], value['$id']);
            }
            if(value['$numberLong'] != null) {
                val = new MongoNumberLong(value['$numberLong']);
            }
            if(value['$date']) {
                val = new MongoISODate(value["$date"]);
            }
        }
        return val;
    }

    var entityMap = {
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '\\': "&#92;",
        '"': '&#92;&quot;',
        "'": '&#39;',
        "/": '&#x2F;'
    };

    function escapeHtmlChars(string) {
        return String(string).replace(/[&<>\\\"'\/]/g, function (s) {
            return entityMap[s];
        });
    }
}());