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

    MongoObjectId.prototype.toStrictJSON = function() {
        return {"$oid":this.value};
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

    MongoReference.prototype.encloseJSON = function(value) {
        return '<a href="#ref" data-ref="'+this.$ref+'" data-id="'+this.$id+'" class="json-link">' + value + '</a>';
    };
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
    }
    if(val == null) {
        val = undefined;
    }
    return val;
}

// only the double $$ keys are removed
function commonJsonReplacer(key, value) {
    var val = value;
    if (/^\$\$+/.test(key)) {
        val = undefined;
    }
    return val;
}