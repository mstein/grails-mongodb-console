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
    this.value = val;

    MongoObjectId.prototype.encloseJSON = function(value) {
        return "<span class=\"mongo-object-id\">ObjectId(" + value + ')</span>';
    };

    MongoObjectId.prototype.toJSON = function() {
        return this.value;
    };

    MongoObjectId.prototype.toString = function() {
        return this.value;
    };
}

/**
 * A binary object, retaining the object size
 * @param size
 * @constructor
 */
function MongoBinaryData(size) {
    this.size = size;

    MongoBinaryData.prototype.encloseJSON = function(value) {
        return "<span class=\"mongo-binary\">[BINARY DATA] (" + this.size + " Bytes)</span>";
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

    MongoReference.prototype.encloseJSON = function(value) {
        return '<a href="#ref" data-ref="'+this.$ref+'" data-id="'+this.$id+'" class="json-link">' + value + '</a>';
    };
}