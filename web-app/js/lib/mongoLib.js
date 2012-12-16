/**
 * A file regrouping few MongoDB-specific object mainly use for the custom JSON stringify and a few action on the UI
 *
 */

/**
 * The unique ObjectId for a document
 * @param val The value of the id
 * @constructor
 */
function MongoObjectId(val) {
    this.$oid = val;

    MongoObjectId.prototype.tengenJSON = function(value) {
        return '<span class="mongo-object-id">ObjectId("' + this.$oid + '")</span>';
    };

    MongoObjectId.prototype.toStrictJSON = function() {
        return this;
    };

    MongoObjectId.prototype.toJSON = function() {
        return this;
    };

    MongoObjectId.prototype.toString = function() {
        return this.$oid;
    };
}

/**
 * A binary object, retaining the object size
 * @param size
 * @constructor
 */
function MongoBinaryData(size) {
    this.size = size;

    MongoBinaryData.prototype.tengenJSON = function(value) {
        return "<span class=\"mongo-binary\">BinData(" + this.size + " Bytes)</span>";
    };

    MongoBinaryData.prototype.toJSON = function() {
        return "";
    };
}

/**
 * A Mongo reference (DBRef)
 * @param colRef
 * @param idRef
 * @constructor
 */
function MongoReference(colRef, idRef) {
    this.$ref = colRef;
    this.$id = idRef;

    MongoReference.prototype.toJSON = function() {
        return this;
    };

    MongoReference.prototype.tengenJSON = function(value) {
        return '<a href="#ref" data-ref="'+this.$ref+'" data-id="'+this.$id+'" class="json-link">' + value + '</a>';
    };
}

/**
 * A Mongo long number (NumberLong)
 * @param stringLong The long as a String
 * @constructor
 */
function MongoNumberLong(stringLong) {
    this.$numberLong = stringLong;

    MongoNumberLong.prototype.toJSON = function() {
        // Warning : The function return is only supported by the de MongoJSON parser !
        var self = this;
        return function() { return self.$numberLong };
    };

    MongoNumberLong.prototype.tengenJSON = function(value) {
        return '<span class="mongo-number-long">NumberLong("' + this.$numberLong + '")</span>';
    };

    MongoNumberLong.prototype.toStrictJSON = function() {
        // Warning : The function return is only supported by the de MongoJSON parser !
        var self = this;
        return function() { return self.$numberLong };
    };

    MongoNumberLong.prototype.toString = function() {
        return this.$numberLong;
    };
}

/**
 * A Mongo date (ISODate)
 * @param stringDate The date as a String, in the iso format like : 2012-12-07T14:15:06Z
 * @constructor
 */
function MongoISODate(stringDate) {
    this.$date = stringDate;

    MongoISODate.prototype.toJSON = function() {
        return {"$date":this.$date};
    };

    MongoISODate.prototype.tengenJSON = function(value) {
        return '<span class="mongo-iso-date">ISODate("' + this.$date + '")</span>';
    };

    MongoISODate.prototype.toStrictJSON = function() {
        return {"$date":this.$date};
    };
}

// only the double $$ keys are removed
function commonJsonReplacer(key, value) {
    var val = value;
    if (/^\$\$+/.test(key)) {
        val = undefined;
    }
    return val;
}
