/**
 * YUI Test Framework
 * @module yuitest
 */

/**
 * The root namespace for YUI Test.
 * @class YUITest
 * @static
 */

var YUITest = {
    version: "@VERSION@"
};


/**
 * Simple custom event implementation.
 * @namespace YUITest
 * @class EventTarget
 * @constructor
 */
YUITest.EventTarget = function(){

    /**
     * Event handlers for the various events.
     * @type Object
     * @private
     * @property _handlers
     * @static
     */
    this._handlers = {};

};
    
YUITest.EventTarget.prototype = {

    //restore prototype
    constructor: YUITest.EventTarget,
            
    //-------------------------------------------------------------------------
    // Event Handling
    //-------------------------------------------------------------------------
    
    /**
     * Adds a listener for a given event type.
     * @param {String} type The type of event to add a listener for.
     * @param {Function} listener The function to call when the event occurs.
     * @return {void}
     * @method attach
     */
    attach: function(type, listener){
        if (typeof this._handlers[type] == "undefined"){
            this._handlers[type] = [];
        }

        this._handlers[type].push(listener);
    },
    
    /**
     * Adds a listener for a given event type.
     * @param {String} type The type of event to add a listener for.
     * @param {Function} listener The function to call when the event occurs.
     * @return {void}
     * @method subscribe
     * @deprecated
     */
    subscribe: function(type, listener){
        this.attach.apply(this, arguments);
    },
    
    /**
     * Fires an event based on the passed-in object.
     * @param {Object|String} event An object with at least a 'type' attribute
     *      or a string indicating the event name.
     * @return {void}
     * @method fire
     */    
    fire: function(event){
        if (typeof event == "string"){
            event = { type: event };
        }
        if (!event.target){
            event.target = this;
        }
        
        if (!event.type){
            throw new Error("Event object missing 'type' property.");
        }
        
        if (this._handlers[event.type] instanceof Array){
            var handlers = this._handlers[event.type];
            for (var i=0, len=handlers.length; i < len; i++){
                handlers[i].call(this, event);
            }
        }            
    },

    /**
     * Removes a listener for a given event type.
     * @param {String} type The type of event to remove a listener from.
     * @param {Function} listener The function to remove from the event.
     * @return {void}
     * @method detach
     */
    detach: function(type, listener){
        if (this._handlers[type] instanceof Array){
            var handlers = this._handlers[type];
            for (var i=0, len=handlers.length; i < len; i++){
                if (handlers[i] === listener){
                    handlers.splice(i, 1);
                    break;
                }
            }
        }            
    },
    
    /**
     * Removes a listener for a given event type.
     * @param {String} type The type of event to remove a listener from.
     * @param {Function} listener The function to remove from the event.
     * @return {void}
     * @method unsubscribe
     * @deprecated
     */
    unsubscribe: function(type, listener){
        this.detach.apply(this, arguments);          
    }    

};


/**
 * Object containing helper methods.
 * @namespace YUITest
 * @class Util
 * @static
 */
YUITest.Util = {

    /**
     * Mixes the own properties from the supplier onto the
     * receiver.
     * @param {Object} receiver The object to receive the properties.
     * @param {Object} supplier The object to supply the properties.
     * @return {Object} The receiver that was passed in.
     * @method mix
     * @static
     */
    mix: function(receiver, supplier){
    
        for (var prop in supplier){
            if (supplier.hasOwnProperty(prop)){
                receiver[prop] = supplier[prop];
            }
        }
        
        return receiver;    
    },
    
    /**
     * Stub for JSON functionality. When the native JSON utility
     * is available, it will be used. Otherwise, a stub object
     * is created. Developers should override YUITest.Util.JSON
     * when attempting to use it in environments where a native
     * JSON utility is unavailable.
     * @property JSON
     * @type JSON
     * @static
     */
    JSON: typeof JSON != "undefined" ? JSON : {
        stringify: function(){
            //TODO: Should include code to do this?
            throw new Error("No JSON utility specified.");
        }    
    }

};
    

/**
 * Error is thrown whenever an assertion fails. It provides methods
 * to more easily get at error information and also provides a base class
 * from which more specific assertion errors can be derived.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace YUITest
 * @class AssertionError
 * @constructor
 */ 
YUITest.AssertionError = function (message){
    
    /**
     * Error message. Must be duplicated to ensure browser receives it.
     * @type String
     * @property message
     */
    this.message = message;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "Assert Error";
};

YUITest.AssertionError.prototype = {

    //restore constructor
    constructor: YUITest.AssertionError,

    /**
     * Returns a fully formatted error for an assertion failure. This should
     * be overridden by all subclasses to provide specific information.
     * @method getMessage
     * @return {String} A string describing the error.
     */
    getMessage : function () {
        return this.message;
    },
    
    /**
     * Returns a string representation of the error.
     * @method toString
     * @return {String} A string representation of the error.
     */
    toString : function () {
        return this.name + ": " + this.getMessage();
    }

};

/**
 * ComparisonFailure is subclass of Error that is thrown whenever
 * a comparison between two values fails. It provides mechanisms to retrieve
 * both the expected and actual value.
 *
 * @param {String} message The message to display when the error occurs.
 * @param {Object} expected The expected value.
 * @param {Object} actual The actual value that caused the assertion to fail.
 * @namespace YUITest 
 * @extends AssertionError
 * @class ComparisonFailure
 * @constructor
 */ 
YUITest.ComparisonFailure = function (message, expected, actual){

    //call superclass
    YUITest.AssertionError.call(this, message);
    
    /**
     * The expected value.
     * @type Object
     * @property expected
     */
    this.expected = expected;
    
    /**
     * The actual value.
     * @type Object
     * @property actual
     */
    this.actual = actual;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "ComparisonFailure";
    
};

//inherit from YUITest.AssertionError
YUITest.ComparisonFailure.prototype = new YUITest.AssertionError;

//restore constructor
YUITest.ComparisonFailure.prototype.constructor = YUITest.ComparisonFailure;

/**
 * Returns a fully formatted error for an assertion failure. This message
 * provides information about the expected and actual values.
 * @method getMessage
 * @return {String} A string describing the error.
 */
YUITest.ComparisonFailure.prototype.getMessage = function(){
    return this.message + "\nExpected: " + this.expected + " (" + (typeof this.expected) + ")"  +
            "\nActual: " + this.actual + " (" + (typeof this.actual) + ")";
};

/**
 * ShouldError is subclass of Error that is thrown whenever
 * a test is expected to throw an error but doesn't.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace YUITest 
 * @extends AssertionError
 * @class ShouldError
 * @constructor
 */ 
YUITest.ShouldError = function (message){

    //call superclass
    YUITest.AssertionError.call(this, message || "This test should have thrown an error but didn't.");
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "ShouldError";
    
};

//inherit from YUITest.AssertionError
YUITest.ShouldError.prototype = new YUITest.AssertionError();

//restore constructor
YUITest.ShouldError.prototype.constructor = YUITest.ShouldError;

/**
 * ShouldFail is subclass of AssertionError that is thrown whenever
 * a test was expected to fail but did not.
 *
 * @param {String} message The message to display when the error occurs.
 * @namespace YUITest 
 * @extends YUITest.AssertionError
 * @class ShouldFail
 * @constructor
 */ 
YUITest.ShouldFail = function (message){

    //call superclass
    YUITest.AssertionError.call(this, message || "This test should fail but didn't.");
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "ShouldFail";
    
};

//inherit from YUITest.AssertionError
YUITest.ShouldFail.prototype = new YUITest.AssertionError();

//restore constructor
YUITest.ShouldFail.prototype.constructor = YUITest.ShouldFail;

/**
 * UnexpectedError is subclass of AssertionError that is thrown whenever
 * an error occurs within the course of a test and the test was not expected
 * to throw an error.
 *
 * @param {Error} cause The unexpected error that caused this error to be 
 *                      thrown.
 * @namespace YUITest 
 * @extends YUITest.AssertionError
 * @class UnexpectedError
 * @constructor
 */  
YUITest.UnexpectedError = function (cause){

    //call superclass
    YUITest.AssertionError.call(this, "Unexpected error: " + cause.message);
    
    /**
     * The unexpected error that occurred.
     * @type Error
     * @property cause
     */
    this.cause = cause;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "UnexpectedError";
    
    /**
     * Stack information for the error (if provided).
     * @type String
     * @property stack
     */
    this.stack = cause.stack;
    
};

//inherit from YUITest.AssertionError
YUITest.UnexpectedError.prototype = new YUITest.AssertionError();

//restore constructor
YUITest.UnexpectedError.prototype.constructor = YUITest.UnexpectedError;

/**
 * UnexpectedValue is subclass of Error that is thrown whenever
 * a value was unexpected in its scope. This typically means that a test
 * was performed to determine that a value was *not* equal to a certain
 * value.
 *
 * @param {String} message The message to display when the error occurs.
 * @param {Object} unexpected The unexpected value.
 * @namespace YUITest 
 * @extends AssertionError
 * @class UnexpectedValue
 * @constructor
 */ 
YUITest.UnexpectedValue = function (message, unexpected){

    //call superclass
    YUITest.AssertionError.call(this, message);
    
    /**
     * The unexpected value.
     * @type Object
     * @property unexpected
     */
    this.unexpected = unexpected;
    
    /**
     * The name of the error that occurred.
     * @type String
     * @property name
     */
    this.name = "UnexpectedValue";
    
};

//inherit from YUITest.AssertionError
YUITest.UnexpectedValue.prototype = new YUITest.AssertionError();

//restore constructor
YUITest.UnexpectedValue.prototype.constructor = YUITest.UnexpectedValue;

/**
 * Returns a fully formatted error for an assertion failure. This message
 * provides information about the expected and actual values.
 * @method getMessage
 * @return {String} A string describing the error.
 */
YUITest.UnexpectedValue.prototype.getMessage = function(){
    return this.message + "\nUnexpected: " + this.unexpected + " (" + (typeof this.unexpected) + ") ";
};


/**
 * Represents a stoppage in test execution to wait for an amount of time before
 * continuing.
 * @param {Function} segment A function to run when the wait is over.
 * @param {int} delay The number of milliseconds to wait before running the code.
 * @class Wait
 * @namespace Test
 * @constructor
 *
 */
YUITest.Wait = function (segment, delay) {
    
    /**
     * The segment of code to run when the wait is over.
     * @type Function
     * @property segment
     */
    this.segment = (typeof segment == "function" ? segment : null);

    /**
     * The delay before running the segment of code.
     * @type int
     * @property delay
     */
    this.delay = (typeof delay == "number" ? delay : 0);        
};

  
/**
 * The Assert object provides functions to test JavaScript values against
 * known and expected results. Whenever a comparison (assertion) fails,
 * an error is thrown.
 * @namespace YUITest
 * @class Assert
 * @static
 */
YUITest.Assert = {

    /**
     * The number of assertions performed.
     * @property _asserts
     * @type int
     * @private
     */
    _asserts: 0,

    //-------------------------------------------------------------------------
    // Helper Methods
    //-------------------------------------------------------------------------
    
    /**
     * Formats a message so that it can contain the original assertion message
     * in addition to the custom message.
     * @param {String} customMessage The message passed in by the developer.
     * @param {String} defaultMessage The message created by the error by default.
     * @return {String} The final error message, containing either or both.
     * @protected
     * @static
     * @method _formatMessage
     */
    _formatMessage : function (customMessage, defaultMessage) {
        if (typeof customMessage == "string" && customMessage.length > 0){
            return customMessage.replace("{message}", defaultMessage);
        } else {
            return defaultMessage;
        }        
    },
    
    /**
     * Returns the number of assertions that have been performed.
     * @method _getCount
     * @protected
     * @static
     */
    _getCount: function(){
        return this._asserts;
    },
    
    /**
     * Increments the number of assertions that have been performed.
     * @method _increment
     * @protected
     * @static
     */
    _increment: function(){
        this._asserts++;
    },
    
    /**
     * Resets the number of assertions that have been performed to 0.
     * @method _reset
     * @protected
     * @static
     */
    _reset: function(){
        this._asserts = 0;
    },
    
    //-------------------------------------------------------------------------
    // Generic Assertion Methods
    //-------------------------------------------------------------------------
    
    /** 
     * Forces an assertion error to occur.
     * @param {String} message (Optional) The message to display with the failure.
     * @method fail
     * @static
     */
    fail : function (message) {
        throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, "Test force-failed."));
    },       
    
    //-------------------------------------------------------------------------
    // Equality Assertion Methods
    //-------------------------------------------------------------------------    
    
    /**
     * Asserts that a value is equal to another. This uses the double equals sign
     * so type cohersion may occur.
     * @param {Object} expected The expected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areEqual
     * @static
     */
    areEqual : function (expected, actual, message) {
        YUITest.Assert._increment();
        if (expected != actual) {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values should be equal."), expected, actual);
        }
    },
    
    /**
     * Asserts that a value is not equal to another. This uses the double equals sign
     * so type cohersion may occur.
     * @param {Object} unexpected The unexpected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areNotEqual
     * @static
     */
    areNotEqual : function (unexpected, actual, 
                         message) {
        YUITest.Assert._increment();
        if (unexpected == actual) {
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Values should not be equal."), unexpected);
        }
    },
    
    /**
     * Asserts that a value is not the same as another. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} unexpected The unexpected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areNotSame
     * @static
     */
    areNotSame : function (unexpected, actual, message) {
        YUITest.Assert._increment();
        if (unexpected === actual) {
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Values should not be the same."), unexpected);
        }
    },

    /**
     * Asserts that a value is the same as another. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} expected The expected value.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areSame
     * @static
     */
    areSame : function (expected, actual, message) {
        YUITest.Assert._increment();
        if (expected !== actual) {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values should be the same."), expected, actual);
        }
    },    
    
    //-------------------------------------------------------------------------
    // Boolean Assertion Methods
    //-------------------------------------------------------------------------    
    
    /**
     * Asserts that a value is false. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isFalse
     * @static
     */
    isFalse : function (actual, message) {
        YUITest.Assert._increment();
        if (false !== actual) {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be false."), false, actual);
        }
    },
    
    /**
     * Asserts that a value is true. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isTrue
     * @static
     */
    isTrue : function (actual, message) {
        YUITest.Assert._increment();
        if (true !== actual) {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be true."), true, actual);
        }

    },
    
    //-------------------------------------------------------------------------
    // Special Value Assertion Methods
    //-------------------------------------------------------------------------    
    
    /**
     * Asserts that a value is not a number.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNaN
     * @static
     */
    isNaN : function (actual, message){
        YUITest.Assert._increment();
        if (!isNaN(actual)){
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be NaN."), NaN, actual);
        }    
    },
    
    /**
     * Asserts that a value is not the special NaN value.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotNaN
     * @static
     */
    isNotNaN : function (actual, message){
        YUITest.Assert._increment();
        if (isNaN(actual)){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Values should not be NaN."), NaN);
        }    
    },
    
    /**
     * Asserts that a value is not null. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotNull
     * @static
     */
    isNotNull : function (actual, message) {
        YUITest.Assert._increment();
        if (actual === null) {
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Values should not be null."), null);
        }
    },

    /**
     * Asserts that a value is not undefined. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotUndefined
     * @static
     */
    isNotUndefined : function (actual, message) {
        YUITest.Assert._increment();
        if (typeof actual == "undefined") {
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should not be undefined."), undefined);
        }
    },

    /**
     * Asserts that a value is null. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNull
     * @static
     */
    isNull : function (actual, message) {
        YUITest.Assert._increment();
        if (actual !== null) {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be null."), null, actual);
        }
    },
        
    /**
     * Asserts that a value is undefined. This uses the triple equals sign
     * so no type cohersion may occur.
     * @param {Object} actual The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isUndefined
     * @static
     */
    isUndefined : function (actual, message) {
        YUITest.Assert._increment();
        if (typeof actual != "undefined") {
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be undefined."), undefined, actual);
        }
    },    
    
    //--------------------------------------------------------------------------
    // Instance Assertion Methods
    //--------------------------------------------------------------------------    
   
    /**
     * Asserts that a value is an array.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isArray
     * @static
     */
    isArray : function (actual, message) {
        YUITest.Assert._increment();
        var shouldFail = false;
        if (Array.isArray){
            shouldFail = !Array.isArray(actual);
        } else {
            shouldFail = Object.prototype.toString.call(actual) != "[object Array]";
        }
        if (shouldFail){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be an array."), actual);
        }    
    },
   
    /**
     * Asserts that a value is a Boolean.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isBoolean
     * @static
     */
    isBoolean : function (actual, message) {
        YUITest.Assert._increment();
        if (typeof actual != "boolean"){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be a Boolean."), actual);
        }    
    },
   
    /**
     * Asserts that a value is a function.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isFunction
     * @static
     */
    isFunction : function (actual, message) {
        YUITest.Assert._increment();
        if (!(actual instanceof Function)){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be a function."), actual);
        }    
    },
   
    /**
     * Asserts that a value is an instance of a particular object. This may return
     * incorrect results when comparing objects from one frame to constructors in
     * another frame. For best results, don't use in a cross-frame manner.
     * @param {Function} expected The function that the object should be an instance of.
     * @param {Object} actual The object to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isInstanceOf
     * @static
     */
    isInstanceOf : function (expected, actual, message) {
        YUITest.Assert._increment();
        if (!(actual instanceof expected)){
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value isn't an instance of expected type."), expected, actual);
        }
    },
    
    /**
     * Asserts that a value is a number.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNumber
     * @static
     */
    isNumber : function (actual, message) {
        YUITest.Assert._increment();
        if (typeof actual != "number"){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be a number."), actual);
        }    
    },    
    
    /**
     * Asserts that a value is an object.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isObject
     * @static
     */
    isObject : function (actual, message) {
        YUITest.Assert._increment();
        if (!actual || (typeof actual != "object" && typeof actual != "function")){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be an object."), actual);
        }
    },
    
    /**
     * Asserts that a value is a string.
     * @param {Object} actual The value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isString
     * @static
     */
    isString : function (actual, message) {
        YUITest.Assert._increment();
        if (typeof actual != "string"){
            throw new YUITest.UnexpectedValue(YUITest.Assert._formatMessage(message, "Value should be a string."), actual);
        }
    },
    
    /**
     * Asserts that a value is of a particular type. 
     * @param {String} expectedType The expected type of the variable.
     * @param {Object} actualValue The actual value to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isTypeOf
     * @static
     */
    isTypeOf : function (expectedType, actualValue, message){
        YUITest.Assert._increment();
        if (typeof actualValue != expectedType){
            throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Value should be of type " + expectedType + "."), expectedType, typeof actualValue);
        }
    },
    
    //--------------------------------------------------------------------------
    // Error Detection Methods
    //--------------------------------------------------------------------------    
   
    /**
     * Asserts that executing a particular method should throw an error of
     * a specific type. This is a replacement for _should.error.
     * @param {String|Function|Object} expectedError If a string, this
     *      is the error message that the error must have; if a function, this
     *      is the constructor that should have been used to create the thrown
     *      error; if an object, this is an instance of a particular error type
     *      with a specific error message (both must match).
     * @param {Function} method The method to execute that should throw the error.
     * @param {String} message (Optional) The message to display if the assertion
     *      fails.
     * @method throwsError
     * @return {void}
     * @static
     */
    throwsError: function(expectedError, method, message){
        YUITest.Assert._increment();
        var error = false;
    
        try {
            method();        
        } catch (thrown) {
            
            //check to see what type of data we have
            if (typeof expectedError == "string"){
                
                //if it's a string, check the error message
                if (thrown.message != expectedError){
                    error = true;
                }
            } else if (typeof expectedError == "function"){
            
                //if it's a function, see if the error is an instance of it
                if (!(thrown instanceof expectedError)){
                    error = true;
                }
            
            } else if (typeof expectedError == "object" && expectedError !== null){
            
                //if it's an object, check the instance and message
                if (!(thrown instanceof expectedError.constructor) || 
                        thrown.message != expectedError.message){
                    error = true;
                }
            
            } else { //if it gets here, the argument could be wrong
                error = true;
            }
            
            if (error){
                throw new YUITest.UnexpectedError(thrown);                    
            } else {
                return;
            }
        }
        
        //if it reaches here, the error wasn't thrown, which is a bad thing
        throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, "Error should have been thrown."));
    }

};


/**
 * The ArrayAssert object provides functions to test JavaScript array objects
 * for a variety of cases.
 * @namespace YUITest
 * @class ArrayAssert
 * @static
 */
 
YUITest.ArrayAssert = {

    //=========================================================================
    // Private methods
    //=========================================================================
    
    /**
     * Simple indexOf() implementation for an array. Defers to native
     * if available.
     * @param {Array} haystack The array to search.
     * @param {Variant} needle The value to locate.
     * @return {int} The index of the needle if found or -1 if not.
     * @method _indexOf
     * @private
     */
    _indexOf: function(haystack, needle){
        if (haystack.indexOf){
            return haystack.indexOf(needle);
        } else {
            for (var i=0; i < haystack.length; i++){
                if (haystack[i] === needle){
                    return i;
                }
            }
            return -1;
        }
    },
    
    /**
     * Simple some() implementation for an array. Defers to native
     * if available.
     * @param {Array} haystack The array to search.
     * @param {Function} matcher The function to run on each value.
     * @return {Boolean} True if any value, when run through the matcher,
     *      returns true.
     * @method _some
     * @private
     */
    _some: function(haystack, matcher){
        if (haystack.some){
            return haystack.some(matcher);
        } else {
            for (var i=0; i < haystack.length; i++){
                if (matcher(haystack[i])){
                    return true;
                }
            }
            return false;
        }
    },    

    /**
     * Asserts that a value is present in an array. This uses the triple equals 
     * sign so no type cohersion may occur.
     * @param {Object} needle The value that is expected in the array.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method contains
     * @static
     */
    contains : function (needle, haystack, 
                           message) {
        
        YUITest.Assert._increment();               

        if (this._indexOf(haystack, needle) == -1){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value " + needle + " (" + (typeof needle) + ") not found in array [" + haystack + "]."));
        }
    },

    /**
     * Asserts that a set of values are present in an array. This uses the triple equals 
     * sign so no type cohersion may occur. For this assertion to pass, all values must
     * be found.
     * @param {Object[]} needles An array of values that are expected in the array.
     * @param {Array} haystack An array of values to check.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method containsItems
     * @static
     */
    containsItems : function (needles, haystack, 
                           message) {
        YUITest.Assert._increment();               

        //begin checking values
        for (var i=0; i < needles.length; i++){
            if (this._indexOf(haystack, needles[i]) == -1){
                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value " + needles[i] + " (" + (typeof needles[i]) + ") not found in array [" + haystack + "]."));
            }
        }
    },

    /**
     * Asserts that a value matching some condition is present in an array. This uses
     * a function to determine a match.
     * @param {Function} matcher A function that returns true if the items matches or false if not.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method containsMatch
     * @static
     */
    containsMatch : function (matcher, haystack, 
                           message) {
        
        YUITest.Assert._increment();               
        //check for valid matcher
        if (typeof matcher != "function"){
            throw new TypeError("ArrayAssert.containsMatch(): First argument must be a function.");
        }
        
        if (!this._some(haystack, matcher)){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "No match found in array [" + haystack + "]."));
        }
    },

    /**
     * Asserts that a value is not present in an array. This uses the triple equals 
     * Asserts that a value is not present in an array. This uses the triple equals 
     * sign so no type cohersion may occur.
     * @param {Object} needle The value that is expected in the array.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method doesNotContain
     * @static
     */
    doesNotContain : function (needle, haystack, 
                           message) {
        
        YUITest.Assert._increment();               

        if (this._indexOf(haystack, needle) > -1){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
        }
    },

    /**
     * Asserts that a set of values are not present in an array. This uses the triple equals 
     * sign so no type cohersion may occur. For this assertion to pass, all values must
     * not be found.
     * @param {Object[]} needles An array of values that are not expected in the array.
     * @param {Array} haystack An array of values to check.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method doesNotContainItems
     * @static
     */
    doesNotContainItems : function (needles, haystack, 
                           message) {

        YUITest.Assert._increment();               

        for (var i=0; i < needles.length; i++){
            if (this._indexOf(haystack, needles[i]) > -1){
                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
            }
        }

    },
        
    /**
     * Asserts that no values matching a condition are present in an array. This uses
     * a function to determine a match.
     * @param {Function} matcher A function that returns true if the item matches or false if not.
     * @param {Array} haystack An array of values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method doesNotContainMatch
     * @static
     */
    doesNotContainMatch : function (matcher, haystack, 
                           message) {
        
        YUITest.Assert._increment();     
      
        //check for valid matcher
        if (typeof matcher != "function"){
            throw new TypeError("ArrayAssert.doesNotContainMatch(): First argument must be a function.");
        }
        
        if (this._some(haystack, matcher)){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value found in array [" + haystack + "]."));
        }
    },
        
    /**
     * Asserts that the given value is contained in an array at the specified index.
     * This uses the triple equals sign so no type cohersion will occur.
     * @param {Object} needle The value to look for.
     * @param {Array} haystack The array to search in.
     * @param {int} index The index at which the value should exist.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method indexOf
     * @static
     */
    indexOf : function (needle, haystack, index, message) {
    
        YUITest.Assert._increment();     

        //try to find the value in the array
        for (var i=0; i < haystack.length; i++){
            if (haystack[i] === needle){
                if (index != i){
                    YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value exists at index " + i + " but should be at index " + index + "."));                    
                }
                return;
            }
        }
        
        //if it makes it here, it wasn't found at all
        YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value doesn't exist in array [" + haystack + "]."));
    },
        
    /**
     * Asserts that the values in an array are equal, and in the same position,
     * as values in another array. This uses the double equals sign
     * so type cohersion may occur. Note that the array objects themselves
     * need not be the same for this test to pass.
     * @param {Array} expected An array of the expected values.
     * @param {Array} actual Any array of the actual values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method itemsAreEqual
     * @static
     */
    itemsAreEqual : function (expected, actual, 
                           message) {
        
        YUITest.Assert._increment();     
        
        //first check array length
        if (expected.length != actual.length){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length));
        }
       
        //begin checking values
        for (var i=0; i < expected.length; i++){
            if (expected[i] != actual[i]){
                throw new YUITest.Assert.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values in position " + i + " are not equal."), expected[i], actual[i]);
            }
        }
    },
    
    /**
     * Asserts that the values in an array are equivalent, and in the same position,
     * as values in another array. This uses a function to determine if the values
     * are equivalent. Note that the array objects themselves
     * need not be the same for this test to pass.
     * @param {Array} expected An array of the expected values.
     * @param {Array} actual Any array of the actual values.
     * @param {Function} comparator A function that returns true if the values are equivalent
     *      or false if not.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @return {Void}
     * @method itemsAreEquivalent
     * @static
     */
    itemsAreEquivalent : function (expected, actual, 
                           comparator, message) {
        
        YUITest.Assert._increment();     

        //make sure the comparator is valid
        if (typeof comparator != "function"){
            throw new TypeError("ArrayAssert.itemsAreEquivalent(): Third argument must be a function.");
        }
        
        //first check array length
        if (expected.length != actual.length){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length));
        }
        
        //begin checking values
        for (var i=0; i < expected.length; i++){
            if (!comparator(expected[i], actual[i])){
                throw new YUITest.Assert.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values in position " + i + " are not equivalent."), expected[i], actual[i]);
            }
        }
    },
    
    /**
     * Asserts that an array is empty.
     * @param {Array} actual The array to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isEmpty
     * @static
     */
    isEmpty : function (actual, message) {        
        YUITest.Assert._increment();     
        if (actual.length > 0){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should be empty."));
        }
    },    
    
    /**
     * Asserts that an array is not empty.
     * @param {Array} actual The array to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method isNotEmpty
     * @static
     */
    isNotEmpty : function (actual, message) {        
        YUITest.Assert._increment();     
        if (actual.length === 0){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should not be empty."));
        }
    },    
    
    /**
     * Asserts that the values in an array are the same, and in the same position,
     * as values in another array. This uses the triple equals sign
     * so no type cohersion will occur. Note that the array objects themselves
     * need not be the same for this test to pass.
     * @param {Array} expected An array of the expected values.
     * @param {Array} actual Any array of the actual values.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method itemsAreSame
     * @static
     */
    itemsAreSame : function (expected, actual, 
                          message) {
        
        YUITest.Assert._increment();     

        //first check array length
        if (expected.length != actual.length){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Array should have a length of " + expected.length + " but has a length of " + actual.length));
        }
                    
        //begin checking values
        for (var i=0; i < expected.length; i++){
            if (expected[i] !== actual[i]){
                throw new YUITest.Assert.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values in position " + i + " are not the same."), expected[i], actual[i]);
            }
        }
    },
    
    /**
     * Asserts that the given value is contained in an array at the specified index,
     * starting from the back of the array.
     * This uses the triple equals sign so no type cohersion will occur.
     * @param {Object} needle The value to look for.
     * @param {Array} haystack The array to search in.
     * @param {int} index The index at which the value should exist.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method lastIndexOf
     * @static
     */
    lastIndexOf : function (needle, haystack, index, message) {
    
        //try to find the value in the array
        for (var i=haystack.length; i >= 0; i--){
            if (haystack[i] === needle){
                if (index != i){
                    YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value exists at index " + i + " but should be at index " + index + "."));                    
                }
                return;
            }
        }
        
        //if it makes it here, it wasn't found at all
        YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Value doesn't exist in array."));        
    }
    
};


/**
 * The ObjectAssert object provides functions to test JavaScript objects
 * for a variety of cases.
 * @namespace YUITest
 * @class ObjectAssert
 * @static
 */
YUITest.ObjectAssert = {

    /**
     * Asserts that an object has all of the same properties
     * and property values as the other.
     * @param {Object} expected The object with all expected properties and values.
     * @param {Object} actual The object to inspect.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method areEqual
     * @static
     * @deprecated
     */
    areEqual: function(expected, actual, message) {
        YUITest.Assert._increment();         

        for (var name in expected){
            if (expected.hasOwnProperty(name)){
                if (expected[name] != actual[name]){
                    throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, "Values should be equal for property " + name), expected[name], actual[name]);
                }            
            }
        }           
    },
    
    /**
     * Asserts that an object has a property with the given name.
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method hasKey
     * @static
     * @deprecated Use ownsOrInheritsKey() instead
     */    
    hasKey: function (propertyName, object, message) {
        YUITest.ObjectAssert.ownsOrInheritsKey(propertyName, object, message);   
    },
    
    /**
     * Asserts that an object has all properties of a reference object.
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method hasKeys
     * @static
     * @deprecated Use ownsOrInheritsKeys() instead
     */    
    hasKeys: function (properties, object, message) {
        YUITest.ObjectAssert.ownsOrInheritsKeys(properties, objects, message);
    },
    
    /**
     * Asserts that a property with the given name exists on an object's prototype.
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method inheritsKey
     * @static
     */    
    inheritsKey: function (propertyName, object, message) {
        YUITest.Assert._increment();               
        if (!(propertyName in object && !object.hasOwnProperty(propertyName))){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + propertyName + "' not found on object instance."));
        }     
    },
    
    /**
     * Asserts that all properties exist on an object prototype.
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method inheritsKeys
     * @static
     */    
    inheritsKeys: function (properties, object, message) {
        YUITest.Assert._increment();        
        for (var i=0; i < properties.length; i++){
            if (!(propertyName in object && !object.hasOwnProperty(properties[i]))){
                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + properties[i] + "' not found on object instance."));
            }      
        }
    },
    
    /**
     * Asserts that a property with the given name exists on an object instance (not on its prototype).
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsKey
     * @static
     */    
    ownsKey: function (propertyName, object, message) {
        YUITest.Assert._increment();               
        if (!object.hasOwnProperty(propertyName)){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + propertyName + "' not found on object instance."));
        }     
    },
    
    /**
     * Asserts that all properties exist on an object instance (not on its prototype).
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsKeys
     * @static
     */    
    ownsKeys: function (properties, object, message) {
        YUITest.Assert._increment();        
        for (var i=0; i < properties.length; i++){
            if (!object.hasOwnProperty(properties[i])){
                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + properties[i] + "' not found on object instance."));
            }      
        }
    },
    
    /**
     * Asserts that an object owns no properties.
     * @param {Object} object The object to check.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsNoKeys
     * @static
     */    
    ownsNoKeys : function (object, message) {
        YUITest.Assert._increment();  
        var count = 0,
            name;
        for (name in object){
            if (object.hasOwnProperty(name)){
                count++;
            }
        }
        
        if (count !== 0){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Object owns " + count + " properties but should own none."));        
        }

    },

    /**
     * Asserts that an object has a property with the given name.
     * @param {String} propertyName The name of the property to test.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsOrInheritsKey
     * @static
     */    
    ownsOrInheritsKey: function (propertyName, object, message) {
        YUITest.Assert._increment();               
        if (!(propertyName in object)){
            YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + propertyName + "' not found on object."));
        }    
    },
    
    /**
     * Asserts that an object has all properties of a reference object.
     * @param {Array} properties An array of property names that should be on the object.
     * @param {Object} object The object to search.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method ownsOrInheritsKeys
     * @static
     */    
    ownsOrInheritsKeys: function (properties, object, message) {
        YUITest.Assert._increment();  
        for (var i=0; i < properties.length; i++){
            if (!(properties[i] in object)){
                YUITest.Assert.fail(YUITest.Assert._formatMessage(message, "Property '" + properties[i] + "' not found on object."));
            }      
        }
    }     
};



/**
 * The DateAssert object provides functions to test JavaScript Date objects
 * for a variety of cases.
 * @namespace  YUITest
 * @class DateAssert
 * @static
 */
 
YUITest.DateAssert = {

    /**
     * Asserts that a date's month, day, and year are equal to another date's.
     * @param {Date} expected The expected date.
     * @param {Date} actual The actual date to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method datesAreEqual
     * @static
     */
    datesAreEqual : function (expected, actual, message){
        YUITest.Assert._increment();        
        if (expected instanceof Date && actual instanceof Date){
            var msg = "";
            
            //check years first
            if (expected.getFullYear() != actual.getFullYear()){
                msg = "Years should be equal.";
            }
            
            //now check months
            if (expected.getMonth() != actual.getMonth()){
                msg = "Months should be equal.";
            }                
            
            //last, check the day of the month
            if (expected.getDate() != actual.getDate()){
                msg = "Days of month should be equal.";
            }                
            
            if (msg.length){
                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, msg), expected, actual);
            }
        } else {
            throw new TypeError("YUITest.DateAssert.datesAreEqual(): Expected and actual values must be Date objects.");
        }
    },

    /**
     * Asserts that a date's hour, minutes, and seconds are equal to another date's.
     * @param {Date} expected The expected date.
     * @param {Date} actual The actual date to test.
     * @param {String} message (Optional) The message to display if the assertion fails.
     * @method timesAreEqual
     * @static
     */
    timesAreEqual : function (expected, actual, message){
        YUITest.Assert._increment();
        if (expected instanceof Date && actual instanceof Date){
            var msg = "";
            
            //check hours first
            if (expected.getHours() != actual.getHours()){
                msg = "Hours should be equal.";
            }
            
            //now check minutes
            if (expected.getMinutes() != actual.getMinutes()){
                msg = "Minutes should be equal.";
            }                
            
            //last, check the seconds
            if (expected.getSeconds() != actual.getSeconds()){
                msg = "Seconds should be equal.";
            }                
            
            if (msg.length){
                throw new YUITest.ComparisonFailure(YUITest.Assert._formatMessage(message, msg), expected, actual);
            }
        } else {
            throw new TypeError("YUITest.DateAssert.timesAreEqual(): Expected and actual values must be Date objects.");
        }
    }
    
};

/**
 * Creates a new mock object.
 * @namespace YUITest
 * @class Mock
 * @constructor
 * @param {Object} template (Optional) An object whose methods
 *      should be stubbed out on the mock object.
 */
YUITest.Mock = function(template){

    //use blank object is nothing is passed in
    template = template || {};
    
    var mock,
        name;
    
    //try to create mock that keeps prototype chain intact
    //fails in the case of ActiveX objects
    try {
        function f(){}
        f.prototype = template;
        mock = new f();
    } catch (ex) {
        mock = {};
    }

    //create stubs for all methods
    for (name in template){
        if (template.hasOwnProperty(name)){
            if (typeof template[name] == "function"){
                mock[name] = function(name){
                    return function(){
                        YUITest.Assert.fail("Method " + name + "() was called but was not expected to be.");
                    };
                }(name);
            }
        }
    }

    //return it
    return mock;    
};
    
/**
 * Assigns an expectation to a mock object. This is used to create
 * methods and properties on the mock object that are monitored for
 * calls and changes, respectively.
 * @param {Object} mock The object to add the expectation to.
 * @param {Object} expectation An object defining the expectation. For
 *      a method, the keys "method" and "args" are required with
 *      an optional "returns" key available. For properties, the keys
 *      "property" and "value" are required.
 * @return {void}
 * @method expect
 * @static
 */ 
YUITest.Mock.expect = function(mock /*:Object*/, expectation /*:Object*/){

    //make sure there's a place to store the expectations
    if (!mock.__expectations) {
        mock.__expectations = {};
    }

    //method expectation
    if (expectation.method){
        var name = expectation.method,
            args = expectation.args || [],
            result = expectation.returns,
            callCount = (typeof expectation.callCount == "number") ? expectation.callCount : 1,
            error = expectation.error,
            run = expectation.run || function(){},
            i;
            
        //save expectations
        mock.__expectations[name] = expectation;
        expectation.callCount = callCount;
        expectation.actualCallCount = 0;
            
        //process arguments
        for (i=0; i < args.length; i++){
             if (!(args[i] instanceof YUITest.Mock.Value)){
                args[i] = YUITest.Mock.Value(YUITest.Assert.areSame, [args[i]], "Argument " + i + " of " + name + "() is incorrect.");
            }       
        }
    
        //if the method is expected to be called
        if (callCount > 0){
            mock[name] = function(){   
                try {
                    expectation.actualCallCount++;
                    YUITest.Assert.areEqual(args.length, arguments.length, "Method " + name + "() passed incorrect number of arguments.");
                    for (var i=0, len=args.length; i < len; i++){
                        args[i].verify(arguments[i]);
                    }                

                    run.apply(this, arguments);
                    
                    if (error){
                        throw error;
                    }
                } catch (ex){
                    //route through TestRunner for proper handling
                    YUITest.TestRunner._handleError(ex);
                }
                
                return result;
            };
        } else {
        
            //method should fail if called when not expected
            mock[name] = function(){
                try {
                    YUITest.Assert.fail("Method " + name + "() should not have been called.");
                } catch (ex){
                    //route through TestRunner for proper handling
                    YUITest.TestRunner._handleError(ex);
                }                    
            };
        }
    } else if (expectation.property){
        //save expectations
        mock.__expectations[name] = expectation;
    }
};

/**
 * Verifies that all expectations of a mock object have been met and
 * throws an assertion error if not.
 * @param {Object} mock The object to verify..
 * @return {void}
 * @method verify
 * @static
 */ 
YUITest.Mock.verify = function(mock){    
    try {
    
        for (var name in mock.__expectations){
            if (mock.__expectations.hasOwnProperty(name)){
                var expectation = mock.__expectations[name];
                if (expectation.method) {
                    YUITest.Assert.areEqual(expectation.callCount, expectation.actualCallCount, "Method " + expectation.method + "() wasn't called the expected number of times.");
                } else if (expectation.property){
                    YUITest.Assert.areEqual(expectation.value, mock[expectation.property], "Property " + expectation.property + " wasn't set to the correct value."); 
                }                
            }
        }

    } catch (ex){
        //route through TestRunner for proper handling
        YUITest.TestRunner._handleError(ex);
    }
};

/**
 * Creates a new value matcher.
 * @param {Function} method The function to call on the value.
 * @param {Array} originalArgs (Optional) Array of arguments to pass to the method.
 * @param {String} message (Optional) Message to display in case of failure.
 * @namespace YUITest.Mock
 * @class Value
 * @constructor
 */
YUITest.Mock.Value = function(method, originalArgs, message){
    if (this instanceof YUITest.Mock.Value){
        this.verify = function(value){
            var args = [].concat(originalArgs || []);
            args.push(value);
            args.push(message);
            method.apply(null, args);
        };
    } else {
        return new YUITest.Mock.Value(method, originalArgs, message);
    }
};

/**
 * Predefined matcher to match any value.
 * @property Any
 * @static
 * @type Function
 */
YUITest.Mock.Value.Any        = YUITest.Mock.Value(function(){});

/**
 * Predefined matcher to match boolean values.
 * @property Boolean
 * @static
 * @type Function
 */
YUITest.Mock.Value.Boolean    = YUITest.Mock.Value(YUITest.Assert.isBoolean);

/**
 * Predefined matcher to match number values.
 * @property Number
 * @static
 * @type Function
 */
YUITest.Mock.Value.Number     = YUITest.Mock.Value(YUITest.Assert.isNumber);

/**
 * Predefined matcher to match string values.
 * @property String
 * @static
 * @type Function
 */
YUITest.Mock.Value.String     = YUITest.Mock.Value(YUITest.Assert.isString);

/**
 * Predefined matcher to match object values.
 * @property Object
 * @static
 * @type Function
 */
YUITest.Mock.Value.Object     = YUITest.Mock.Value(YUITest.Assert.isObject);

/**
 * Predefined matcher to match function values.
 * @property Function
 * @static
 * @type Function
 */
YUITest.Mock.Value.Function   = YUITest.Mock.Value(YUITest.Assert.isFunction);

/**
 * Test case containing various tests to run.
 * @param template An object containing any number of test methods, other methods,
 *                 an optional name, and anything else the test case needs.
 * @class TestCase
 * @namespace YUITest
 * @constructor
 */
YUITest.TestCase = function (template) {
    
    /**
     * Special rules for the test case. Possible subobjects
     * are fail, for tests that should fail, and error, for
     * tests that should throw an error.
     */
    this._should = {};
    
    //copy over all properties from the template to this object
    for (var prop in template) {
        this[prop] = template[prop];
    }    
    
    //check for a valid name
    if (typeof this.name != "string"){
        this.name = "testCase" + (+new Date());
    }

};
        
YUITest.TestCase.prototype = {  

    //restore constructor
    constructor: YUITest.TestCase,

    /**
     * Resumes a paused test and runs the given function.
     * @param {Function} segment (Optional) The function to run.
     *      If omitted, the test automatically passes.
     * @return {Void}
     * @method resume
     */
    resume : function (segment) {
        YUITest.TestRunner.resume(segment);
    },

    /**
     * Causes the test case to wait a specified amount of time and then
     * continue executing the given code.
     * @param {Function} segment (Optional) The function to run after the delay.
     *      If omitted, the TestRunner will wait until resume() is called.
     * @param {int} delay (Optional) The number of milliseconds to wait before running
     *      the function. If omitted, defaults to zero.
     * @return {Void}
     * @method wait
     */
    wait : function (segment, delay){
		delay = (typeof delay == "number" ? delay : 10000);
        if (typeof segment == "function"){
            throw new YUITest.Wait(segment, delay);
        } else {
            throw new YUITest.Wait(function(){
                YUITest.Assert.fail("Timeout: wait() called but resume() never called.");
            }, delay);
        }
    },
    
    //-------------------------------------------------------------------------
    // Assertion Methods
    //-------------------------------------------------------------------------

    /**
     * Asserts that a given condition is true. If not, then a YUITest.AssertionError object is thrown
     * and the test fails.
     * @method assert
     * @param {Boolean} condition The condition to test.
     * @param {String} message The message to display if the assertion fails.
     */
    assert : function (condition, message){
        YUITest.Assert._increment();
        if (!condition){
            throw new YUITest.AssertionError(YUITest.Assert._formatMessage(message, "Assertion failed."));
        }    
    },
    
    /**
     * Forces an assertion error to occur. Shortcut for YUITest.Assert.fail().
     * @method fail
     * @param {String} message (Optional) The message to display with the failure.
     */
    fail: function (message) {    
        YUITest.Assert.fail(message);
    },
    
    //-------------------------------------------------------------------------
    // Stub Methods
    //-------------------------------------------------------------------------

    /**
     * Function to run once before tests start to run.
     * This executes before the first call to setUp().
     */
    init: function(){
        //noop
    },
    
    /**
     * Function to run once after tests finish running.
     * This executes after the last call to tearDown().
     */
    destroy: function(){
        //noop
    },


    /**
     * Function to run before each test is executed.
     * @return {Void}
     * @method setUp
     */
    setUp : function () {
        //noop
    },
    
    /**
     * Function to run after each test is executed.
     * @return {Void}
     * @method tearDown
     */
    tearDown: function () {    
        //noop
    }
};


    
/**
 * A test suite that can contain a collection of TestCase and TestSuite objects.
 * @param {String||Object} data The name of the test suite or an object containing
 *      a name property as well as setUp and tearDown methods.
 * @namespace YUITest
 * @class TestSuite
 * @constructor
 */
YUITest.TestSuite = function (data) {

    /**
     * The name of the test suite.
     * @type String
     * @property name
     */
    this.name = "";

    /**
     * Array of test suites and test cases.
     * @type Array
     * @property items
     * @private
     */
    this.items = [];

    //initialize the properties
    if (typeof data == "string"){
        this.name = data;
    } else if (data instanceof Object){
        for (var prop in data){
            if (data.hasOwnProperty(prop)){
                this[prop] = data[prop];
            }
        }
    }

    //double-check name
    if (this.name === ""){
        this.name = "testSuite" + (+new Date());
    }

};
    
YUITest.TestSuite.prototype = {
    
    //restore constructor
    constructor: YUITest.TestSuite,
    
    /**
     * Adds a test suite or test case to the test suite.
     * @param {YUITest.TestSuite||YUITest.TestCase} testObject The test suite or test case to add.
     * @return {Void}
     * @method add
     */
    add : function (testObject) {
        if (testObject instanceof YUITest.TestSuite || testObject instanceof YUITest.TestCase) {
            this.items.push(testObject);
        }
        return this;
    },
    
    //-------------------------------------------------------------------------
    // Stub Methods
    //-------------------------------------------------------------------------

    /**
     * Function to run before each test is executed.
     * @return {Void}
     * @method setUp
     */
    setUp : function () {
    },
    
    /**
     * Function to run after each test is executed.
     * @return {Void}
     * @method tearDown
     */
    tearDown: function () {
    }
    
};

/**
 * An object object containing test result formatting methods.
 * @namespace YUITest
 * @class TestFormat
 * @static
 */
YUITest.TestFormat = function(){
    
    /* (intentionally not documented)
     * Basic XML escaping method. Replaces quotes, less-than, greater-than,
     * apostrophe, and ampersand characters with their corresponding entities.
     * @param {String} text The text to encode.
     * @return {String} The XML-escaped text.
     */
    function xmlEscape(text){
    
        return text.replace(/[<>"'&]/g, function(value){
            switch(value){
                case "<":   return "&lt;";
                case ">":   return "&gt;";
                case "\"":  return "&quot;";
                case "'":   return "&apos;";
                case "&":   return "&amp;";
            }
        });
    
    }
        
        
    return {
    
        /**
         * Returns test results formatted as a JSON string. Requires JSON utility.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} A JSON-formatted string of results.
         * @method JSON
         * @static
         */
        JSON: function(results) {
            return YUITest.Util.JSON.stringify(results);
        },
        
        /**
         * Returns test results formatted as an XML string.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} An XML-formatted string of results.
         * @method XML
         * @static
         */
        XML: function(results) {

            function serializeToXML(results){
                var xml = "<" + results.type + " name=\"" + xmlEscape(results.name) + "\"";
                
                if (typeof(results.duration)=="number"){
                    xml += " duration=\"" + results.duration + "\"";
                }
                
                if (results.type == "test"){
                    xml += " result=\"" + results.result + "\" message=\"" + xmlEscape(results.message) + "\">";
                } else {
                    xml += " passed=\"" + results.passed + "\" failed=\"" + results.failed + "\" ignored=\"" + results.ignored + "\" total=\"" + results.total + "\">";
                    for (var prop in results){
                        if (results.hasOwnProperty(prop)){
                            if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                xml += serializeToXML(results[prop]);
                            }
                        }
                    }       
                }

                xml += "</" + results.type + ">";
                
                return xml;    
            }

            return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + serializeToXML(results);

        },


        /**
         * Returns test results formatted in JUnit XML format.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} An XML-formatted string of results.
         * @method JUnitXML
         * @static
         */
        JUnitXML: function(results) {

            function serializeToJUnitXML(results){
                var xml = "";
                    
                switch (results.type){
                    //equivalent to testcase in JUnit
                    case "test":
                        if (results.result != "ignore"){
                            xml = "<testcase name=\"" + xmlEscape(results.name) + "\" time=\"" + (results.duration/1000) + "\">";
                            if (results.result == "fail"){
                                xml += "<failure message=\"" + xmlEscape(results.message) + "\"><![CDATA[" + results.message + "]]></failure>";
                            }
                            xml+= "</testcase>";
                        }
                        break;
                        
                    //equivalent to testsuite in JUnit
                    case "testcase":
                    
                        xml = "<testsuite name=\"" + xmlEscape(results.name) + "\" tests=\"" + results.total + "\" failures=\"" + results.failed + "\" time=\"" + (results.duration/1000) + "\">";
                        
                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    xml += serializeToJUnitXML(results[prop]);
                                }
                            }
                        }            
                        
                        xml += "</testsuite>";
                        break;
                    
                    //no JUnit equivalent, don't output anything
                    case "testsuite":
                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    xml += serializeToJUnitXML(results[prop]);
                                }
                            }
                        }                                                     
                        break;
                        
                    //top-level, equivalent to testsuites in JUnit
                    case "report":
                    
                        xml = "<testsuites>";
                    
                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    xml += serializeToJUnitXML(results[prop]);
                                }
                            }
                        }            
                        
                        xml += "</testsuites>";            
                    
                    //no default
                }
                
                return xml;
         
            }

            return "<?xml version=\"1.0\" encoding=\"UTF-8\"?>" + serializeToJUnitXML(results);
        },
    
        /**
         * Returns test results formatted in TAP format.
         * For more information, see <a href="http://testanything.org/">Test Anything Protocol</a>.
         * @param {Object} result The results object created by TestRunner.
         * @return {String} A TAP-formatted string of results.
         * @method TAP
         * @static
         */
        TAP: function(results) {
        
            var currentTestNum = 1;

            function serializeToTAP(results){
                var text = "";
                    
                switch (results.type){

                    case "test":
                        if (results.result != "ignore"){

                            text = "ok " + (currentTestNum++) + " - " + results.name;
                            
                            if (results.result == "fail"){
                                text = "not " + text + " - " + results.message;
                            }
                            
                            text += "\n";
                        } else {
                            text = "#Ignored test " + results.name + "\n";
                        }
                        break;
                        
                    case "testcase":
                    
                        text = "#Begin testcase " + results.name + "(" + results.failed + " failed of " + results.total + ")\n";
                                        
                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    text += serializeToTAP(results[prop]);
                                }
                            }
                        }            
                        
                        text += "#End testcase " + results.name + "\n";
                        
                        
                        break;
                    
                    case "testsuite":

                        text = "#Begin testsuite " + results.name + "(" + results.failed + " failed of " + results.total + ")\n";                
                    
                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    text += serializeToTAP(results[prop]);
                                }
                            }
                        }                                                      

                        text += "#End testsuite " + results.name + "\n";
                        break;

                    case "report":
                    
                        for (var prop in results){
                            if (results.hasOwnProperty(prop)){
                                if (results[prop] && typeof results[prop] == "object" && !(results[prop] instanceof Array)){
                                    text += serializeToTAP(results[prop]);
                                }
                            }
                        }              
                        
                    //no default
                }
                
                return text;
         
            }

            return "1.." + results.total + "\n" + serializeToTAP(results);
        }
    
    };
}();

/**
 * An object object containing coverage result formatting methods.
 * @namespace YUITest
 * @class CoverageFormat
 * @static
 */
YUITest.CoverageFormat = {

    /**
     * Returns the coverage report in JSON format. This is the straight
     * JSON representation of the native coverage report.
     * @param {Object} coverage The coverage report object.
     * @return {String} A JSON-formatted string of coverage data.
     * @method JSON
     * @namespace YUITest.CoverageFormat
     */
    JSON: function(coverage){
        return YUITest.Util.JSON.stringify(coverage);
    },
    
    /**
     * Returns the coverage report in a JSON format compatible with
     * Xdebug. See <a href="http://www.xdebug.com/docs/code_coverage">Xdebug Documentation</a>
     * for more information. Note: function coverage is not available
     * in this format.
     * @param {Object} coverage The coverage report object.
     * @return {String} A JSON-formatted string of coverage data.
     * @method XdebugJSON
     * @namespace YUITest.CoverageFormat
     */    
    XdebugJSON: function(coverage){
    
        var report = {};
        for (var prop in coverage){
            if (coverage.hasOwnProperty(prop)){
                report[prop] = coverage[prop].lines;
            }
        }

        return YUITest.Util.JSON.stringify(coverage);
    }

};


/**
 * An object object containing methods to simulate browser events.
 * @namespace YUITest
 * @class Event
 * @static
 */
YUITest.Event = (function() {

    var
     
    //mouse events supported
    mouseEvents = {
        click:      1,
        dblclick:   1,
        mouseover:  1,
        mouseout:   1,
        mousedown:  1,
        mouseup:    1,
        mousemove:  1
    },
    
    //key events supported
    keyEvents   = {
        keydown:    1,
        keyup:      1,
        keypress:   1
    },
    
    //HTML events supported
    uiEvents  = {
        blur:       1,
        change:     1,
        focus:      1,
        resize:     1,
        scroll:     1,
        select:     1
    },
    
    //events that bubble by default
    bubbleEvents = {
        scroll:     1,
        resize:     1,
        reset:      1,
        submit:     1,
        change:     1,
        select:     1,
        error:      1,
        abort:      1,
        
        //also mouse events
        click:      1,
        dblclick:   1,
        mouseover:  1,
        mouseout:   1,
        mousedown:  1,
        mouseup:    1,
        mousemove:  1,
        
        //and keyboard events
        keydown:    1,
        keyup:      1,
        keypress:   1        
        
    },
    
    //the object to return
    object,
    
    //used for property name iteration
    prop;

    /*
     * Note: Intentionally not for YUIDoc generation.
     * Simulates a key event using the given event information to populate
     * the generated event object. This method does browser-equalizing
     * calculations to account for differences in the DOM and IE event models
     * as well as different browser quirks. Note: keydown causes Safari 2.x to
     * crash.
     * @method simulateKeyEvent
     * @private
     * @static
     * @param {HTMLElement} target The target of the given event.
     * @param {String} type The type of event to fire. This can be any one of
     *      the following: keyup, keydown, and keypress.
     * @param {Boolean} bubbles (Optional) Indicates if the event can be
     *      bubbled up. DOM Level 3 specifies that all key events bubble by
     *      default. The default is true.
     * @param {Boolean} cancelable (Optional) Indicates if the event can be
     *      canceled using preventDefault(). DOM Level 3 specifies that all
     *      key events can be cancelled. The default 
     *      is true.
     * @param {Window} view (Optional) The view containing the target. This is
     *      typically the window object. The default is window.
     * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
     *      is pressed while the event is firing. The default is false.
     * @param {int} keyCode (Optional) The code for the key that is in use. 
     *      The default is 0.
     * @param {int} charCode (Optional) The Unicode code for the character
     *      associated with the key being used. The default is 0.
     */
    function simulateKeyEvent(target /*:HTMLElement*/, type /*:String*/, 
                                 bubbles /*:Boolean*/,  cancelable /*:Boolean*/,    
                                 view /*:Window*/,
                                 ctrlKey /*:Boolean*/,    altKey /*:Boolean*/, 
                                 shiftKey /*:Boolean*/,   metaKey /*:Boolean*/, 
                                 keyCode /*:int*/,        charCode /*:int*/) /*:Void*/                             
    {
        //check target    
        if (!target){
            throw new Error("simulateKeyEvent(): Invalid target.");
        }
        
        //check event type
        if (typeof type == "string"){
            type = type.toLowerCase();
            switch(type){
                case "textevent": //DOM Level 3
                    type = "keypress";
                    break;
                case "keyup":
                case "keydown":
                case "keypress":
                    break;
                default:
                    throw new Error("simulateKeyEvent(): Event type '" + type + "' not supported.");
            }
        } else {
            throw new Error("simulateKeyEvent(): Event type must be a string.");
        }
        
        //setup default values
        if (typeof bubbles != "boolean"){
            bubbles = true; //all key events bubble
        }
        if (typeof cancelable != "boolean"){
            cancelable = true; //all key events can be cancelled
        }
        if (typeof view != "object" || view == null){
            view = window; //view is typically window
        }
        if (typeof ctrlKey != "boolean"){
            ctrlKey = false;
        }
        if (typeof altKey != "boolean"){
            altKey = false;
        }
        if (typeof shiftKey != "boolean"){
            shiftKey = false;
        }
        if (typeof metaKey != "boolean"){
            metaKey = false;
        }
        if (typeof keyCode != "number"){
            keyCode = 0;
        }
        if (typeof charCode != "number"){
            charCode = 0; 
        }

        //try to create a mouse event
        var customEvent = null;
            
        //check for DOM-compliant browsers first
        if (typeof document.createEvent == "function"){
        
            try {
                
                //try to create key event
                customEvent = document.createEvent("KeyEvents");
                
                /*
                 * Interesting problem: Firefox implemented a non-standard
                 * version of initKeyEvent() based on DOM Level 2 specs.
                 * Key event was removed from DOM Level 2 and re-introduced
                 * in DOM Level 3 with a different interface. Firefox is the
                 * only browser with any implementation of Key Events, so for
                 * now, assume it's Firefox if the above line doesn't error.
                 */
                // @TODO: Decipher between Firefox's implementation and a correct one.
                customEvent.initKeyEvent(type, bubbles, cancelable, view, ctrlKey,
                    altKey, shiftKey, metaKey, keyCode, charCode);       
                
            } catch (ex){

                /*
                 * If it got here, that means key events aren't officially supported. 
                 * Safari/WebKit is a real problem now. WebKit 522 won't let you
                 * set keyCode, charCode, or other properties if you use a
                 * UIEvent, so we first must try to create a generic event. The
                 * fun part is that this will throw an error on Safari 2.x. The
                 * end result is that we need another try...catch statement just to
                 * deal with this mess.
                 */
                try {

                    //try to create generic event - will fail in Safari 2.x
                    customEvent = document.createEvent("Events");

                } catch (uierror /*:Error*/){

                    //the above failed, so create a UIEvent for Safari 2.x
                    customEvent = document.createEvent("UIEvents");

                } finally {

                    customEvent.initEvent(type, bubbles, cancelable);

                    //initialize
                    customEvent.view = view;
                    customEvent.altKey = altKey;
                    customEvent.ctrlKey = ctrlKey;
                    customEvent.shiftKey = shiftKey;
                    customEvent.metaKey = metaKey;
                    customEvent.keyCode = keyCode;
                    customEvent.charCode = charCode;
          
                }          
             
            }
            
            //fire the event
            target.dispatchEvent(customEvent);

        } else if (typeof document.createEventObject != "undefined"){ //IE
        
            //create an IE event object
            customEvent = document.createEventObject();
            
            //assign available properties
            customEvent.bubbles = bubbles;
            customEvent.cancelable = cancelable;
            customEvent.view = view;
            customEvent.ctrlKey = ctrlKey;
            customEvent.altKey = altKey;
            customEvent.shiftKey = shiftKey;
            customEvent.metaKey = metaKey;
            
            /*
             * IE doesn't support charCode explicitly. CharCode should
             * take precedence over any keyCode value for accurate
             * representation.
             */
            customEvent.keyCode = (charCode > 0) ? charCode : keyCode;
            
            //fire the event
            target.fireEvent("on" + type, customEvent);  
                    
        } else {
            throw new Error("simulateKeyEvent(): No event simulation framework present.");
        }
    }

    /*
     * Note: Intentionally not for YUIDoc generation.
     * Simulates a mouse event using the given event information to populate
     * the generated event object. This method does browser-equalizing
     * calculations to account for differences in the DOM and IE event models
     * as well as different browser quirks.
     * @method simulateMouseEvent
     * @private
     * @static
     * @param {HTMLElement} target The target of the given event.
     * @param {String} type The type of event to fire. This can be any one of
     *      the following: click, dblclick, mousedown, mouseup, mouseout,
     *      mouseover, and mousemove.
     * @param {Boolean} bubbles (Optional) Indicates if the event can be
     *      bubbled up. DOM Level 2 specifies that all mouse events bubble by
     *      default. The default is true.
     * @param {Boolean} cancelable (Optional) Indicates if the event can be
     *      canceled using preventDefault(). DOM Level 2 specifies that all
     *      mouse events except mousemove can be cancelled. The default 
     *      is true for all events except mousemove, for which the default 
     *      is false.
     * @param {Window} view (Optional) The view containing the target. This is
     *      typically the window object. The default is window.
     * @param {int} detail (Optional) The number of times the mouse button has
     *      been used. The default value is 1.
     * @param {int} screenX (Optional) The x-coordinate on the screen at which
     *      point the event occured. The default is 0.
     * @param {int} screenY (Optional) The y-coordinate on the screen at which
     *      point the event occured. The default is 0.
     * @param {int} clientX (Optional) The x-coordinate on the client at which
     *      point the event occured. The default is 0.
     * @param {int} clientY (Optional) The y-coordinate on the client at which
     *      point the event occured. The default is 0.
     * @param {Boolean} ctrlKey (Optional) Indicates if one of the CTRL keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} altKey (Optional) Indicates if one of the ALT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} shiftKey (Optional) Indicates if one of the SHIFT keys
     *      is pressed while the event is firing. The default is false.
     * @param {Boolean} metaKey (Optional) Indicates if one of the META keys
     *      is pressed while the event is firing. The default is false.
     * @param {int} button (Optional) The button being pressed while the event
     *      is executing. The value should be 0 for the primary mouse button
     *      (typically the left button), 1 for the terciary mouse button
     *      (typically the middle button), and 2 for the secondary mouse button
     *      (typically the right button). The default is 0.
     * @param {HTMLElement} relatedTarget (Optional) For mouseout events,
     *      this is the element that the mouse has moved to. For mouseover
     *      events, this is the element that the mouse has moved from. This
     *      argument is ignored for all other events. The default is null.
     */
    function simulateMouseEvent(target /*:HTMLElement*/, type /*:String*/, 
                                   bubbles /*:Boolean*/,  cancelable /*:Boolean*/,    
                                   view /*:Window*/,        detail /*:int*/, 
                                   screenX /*:int*/,        screenY /*:int*/, 
                                   clientX /*:int*/,        clientY /*:int*/,       
                                   ctrlKey /*:Boolean*/,    altKey /*:Boolean*/, 
                                   shiftKey /*:Boolean*/,   metaKey /*:Boolean*/, 
                                   button /*:int*/,         relatedTarget /*:HTMLElement*/) /*:Void*/
    {
        
        //check target   
        if (!target){
            throw new Error("simulateMouseEvent(): Invalid target.");
        }
        
        //check event type
        if (typeof type == "string"){
            type = type.toLowerCase();
            
            //make sure it's a supported mouse event
            if (!mouseEvents[type]){
                throw new Error("simulateMouseEvent(): Event type '" + type + "' not supported.");
            }
        } else {
            throw new Error("simulateMouseEvent(): Event type must be a string.");
        }
        
        //setup default values
        if (typeof bubbles != "boolean"){
            bubbles = true; //all mouse events bubble
        }
        if (typeof cancelable != "boolean"){
            cancelable = (type != "mousemove"); //mousemove is the only one that can't be cancelled
        }
        if (typeof view != "object" || view != null){
            view = window; //view is typically window
        }
        if (typeof detail != "number"){
            detail = 1;  //number of mouse clicks must be at least one
        }
        if (typeof screenX != "number"){
            screenX = 0; 
        }
        if (typeof screenY != "number"){
            screenY = 0; 
        }
        if (typeof clientX != "number"){
            clientX = 0; 
        }
        if (typeof clientY != "number"){
            clientY = 0; 
        }
        if (typeof ctrlKey != "boolean"){
            ctrlKey = false;
        }
        if (typeof altKey != "boolean"){
            altKey = false;
        }
        if (typeof shiftKey != "boolean"){
            shiftKey = false;
        }
        if (typeof metaKey != "boolean"){
            metaKey = false;
        }
        if (typeof button != "number"){
            button = 0; 
        }

        //try to create a mouse event
        var customEvent /*:MouseEvent*/ = null;
            
        //check for DOM-compliant browsers first
        if (typeof document.createEvent == "function"){
        
            customEvent = document.createEvent("MouseEvents");
        
            //Safari 2.x (WebKit 418) still doesn't implement initMouseEvent()
            if (customEvent.initMouseEvent){
                customEvent.initMouseEvent(type, bubbles, cancelable, view, detail,
                                     screenX, screenY, clientX, clientY, 
                                     ctrlKey, altKey, shiftKey, metaKey, 
                                     button, relatedTarget);
            } else { //Safari
            
                //the closest thing available in Safari 2.x is UIEvents
                customEvent = document.createEvent("UIEvents");
                customEvent.initEvent(type, bubbles, cancelable);
                customEvent.view = view;
                customEvent.detail = detail;
                customEvent.screenX = screenX;
                customEvent.screenY = screenY;
                customEvent.clientX = clientX;
                customEvent.clientY = clientY;
                customEvent.ctrlKey = ctrlKey;
                customEvent.altKey = altKey;
                customEvent.metaKey = metaKey;
                customEvent.shiftKey = shiftKey;
                customEvent.button = button;
                customEvent.relatedTarget = relatedTarget;
            }
            
            /*
             * Check to see if relatedTarget has been assigned. Firefox
             * versions less than 2.0 don't allow it to be assigned via
             * initMouseEvent() and the property is readonly after event
             * creation, so in order to keep YAHOO.util.getRelatedTarget()
             * working, assign to the IE proprietary toElement property
             * for mouseout event and fromElement property for mouseover
             * event.
             */
            if (relatedTarget && !customEvent.relatedTarget){
                if (type == "mouseout"){
                    customEvent.toElement = relatedTarget;
                } else if (type == "mouseover"){
                    customEvent.fromElement = relatedTarget;
                }
            }
            
            //fire the event
            target.dispatchEvent(customEvent);

        } else if (typeof document.createEventObject != "undefined"){ //IE
        
            //create an IE event object
            customEvent = document.createEventObject();
            
            //assign available properties
            customEvent.bubbles = bubbles;
            customEvent.cancelable = cancelable;
            customEvent.view = view;
            customEvent.detail = detail;
            customEvent.screenX = screenX;
            customEvent.screenY = screenY;
            customEvent.clientX = clientX;
            customEvent.clientY = clientY;
            customEvent.ctrlKey = ctrlKey;
            customEvent.altKey = altKey;
            customEvent.metaKey = metaKey;
            customEvent.shiftKey = shiftKey;

            //fix button property for IE's wacky implementation
            switch(button){
                case 0:
                    customEvent.button = 1;
                    break;
                case 1:
                    customEvent.button = 4;
                    break;
                case 2:
                    //leave as is
                    break;
                default:
                    customEvent.button = 0;                    
            }    

            /*
             * Have to use relatedTarget because IE won't allow assignment
             * to toElement or fromElement on generic events. This keeps
             * YAHOO.util.customEvent.getRelatedTarget() functional.
             */
            customEvent.relatedTarget = relatedTarget;
            
            //fire the event
            target.fireEvent("on" + type, customEvent);
                    
        } else {
            throw new Error("simulateMouseEvent(): No event simulation framework present.");
        }
    }

    /*
     * Note: Intentionally not for YUIDoc generation.
     * Simulates a UI event using the given event information to populate
     * the generated event object. This method does browser-equalizing
     * calculations to account for differences in the DOM and IE event models
     * as well as different browser quirks.
     * @method simulateHTMLEvent
     * @private
     * @static
     * @param {HTMLElement} target The target of the given event.
     * @param {String} type The type of event to fire. This can be any one of
     *      the following: click, dblclick, mousedown, mouseup, mouseout,
     *      mouseover, and mousemove.
     * @param {Boolean} bubbles (Optional) Indicates if the event can be
     *      bubbled up. DOM Level 2 specifies that all mouse events bubble by
     *      default. The default is true.
     * @param {Boolean} cancelable (Optional) Indicates if the event can be
     *      canceled using preventDefault(). DOM Level 2 specifies that all
     *      mouse events except mousemove can be cancelled. The default 
     *      is true for all events except mousemove, for which the default 
     *      is false.
     * @param {Window} view (Optional) The view containing the target. This is
     *      typically the window object. The default is window.
     * @param {int} detail (Optional) The number of times the mouse button has
     *      been used. The default value is 1.
     */
    function simulateUIEvent(target /*:HTMLElement*/, type /*:String*/, 
                                   bubbles /*:Boolean*/,  cancelable /*:Boolean*/,    
                                   view /*:Window*/,        detail /*:int*/) /*:Void*/
    {
        
        //check target   
        if (!target){
            throw new Error("simulateUIEvent(): Invalid target.");
        }
        
        //check event type
        if (typeof type == "string"){
            type = type.toLowerCase();
            
            //make sure it's a supported mouse event
            if (!uiEvents[type]){
                throw new Error("simulateUIEvent(): Event type '" + type + "' not supported.");
            }
        } else {
            throw new Error("simulateUIEvent(): Event type must be a string.");
        }
        
        //try to create a mouse event
        var customEvent = null;    
        
        
        //setup default values
        if (typeof bubbles != "boolean"){
            bubbles = (type in bubbleEvents);  //not all events bubble
        }
        if (typeof cancelable != "boolean"){
            cancelable = (type == "submit"); //submit is the only one that can be cancelled
        }
        if (typeof view != "object" || view != null){
            view = window; //view is typically window
        }
        if (typeof detail != "number"){
            detail = 1;  //usually not used but defaulted to this
        }
            
        //check for DOM-compliant browsers first
        if (typeof document.createEvent == "function"){
        
            //just a generic UI Event object is needed
            customEvent = document.createEvent("UIEvents");
            customEvent.initUIEvent(type, bubbles, cancelable, view, detail);
            
            //fire the event
            target.dispatchEvent(customEvent);

        } else if (typeof document.createEventObject != "undefined"){ //IE
        
            //create an IE event object
            customEvent = document.createEventObject();
            
            //assign available properties
            customEvent.bubbles = bubbles;
            customEvent.cancelable = cancelable;
            customEvent.view = view;
            customEvent.detail = detail;

            //fire the event
            target.fireEvent("on" + type, customEvent);
                    
        } else {
            throw new Error("simulateUIEvent(): No event simulation framework present.");
        }
    }


    /**
     * Allows event simulation for browser-based events.
     * @namespace YUITest
     * @class Event
     * @static
     */
    object = {
    
        /**
         * Simulates the event with the given name on a target.
         * @param {HTMLElement} target The DOM element that's the target of the event.
         * @param {String} type The type of event to simulate (i.e., "click").
         * @param {Object} options (Optional) Extra options to copy onto the event object.
         * @return {void}
         * @method simulate
         * @static
         * @deprecated
         */
        simulate: function(target, type, options){

            options = options || {};
            
            if (mouseEvents[type]){
                simulateMouseEvent(target, type, options.bubbles,
                    options.cancelable, options.view, options.detail, options.screenX,        
                    options.screenY, options.clientX, options.clientY, options.ctrlKey,
                    options.altKey, options.shiftKey, options.metaKey, options.button,         
                    options.relatedTarget);        
            } else if (keyEvents[type]){
                simulateKeyEvent(target, type, options.bubbles,
                    options.cancelable, options.view, options.ctrlKey,
                    options.altKey, options.shiftKey, options.metaKey, 
                    options.keyCode, options.charCode);   
            } else if (uiEvents[type]){
                simulateUIEvent(target, type, options.bubbles,
                    options.cancelable, options.view, options.detail);        
             } else {
                throw new Error("simulate(): Event '" + type + "' can't be simulated.");
            }
        }
    };

    //create the convenience methods for mouse events
    for (prop in mouseEvents){
        if (mouseEvents.hasOwnProperty(prop)){
            object[prop] = (function(type){
                return function(target, options){
                    options = options || {};
                    simulateMouseEvent(target, type, options.bubbles,
                        options.cancelable, options.view, options.detail, options.screenX,        
                        options.screenY, options.clientX, options.clientY, options.ctrlKey,
                        options.altKey, options.shiftKey, options.metaKey, options.button,         
                        options.relatedTarget);
                };
            })(prop);
        }
    }

    //create the convenience methods for key events
    for (prop in keyEvents){
        if (keyEvents.hasOwnProperty(prop)){
            object[prop] = (function(type){
                return function(target, options){
                    options = options || {};
                    simulateKeyEvent(target, type, options.bubbles,
                        options.cancelable, options.view, options.ctrlKey,
                        options.altKey, options.shiftKey, options.metaKey, 
                        options.keyCode, options.charCode);
                };
            })(prop);
        }
    }

    //create the convenience methods for key events
    for (prop in uiEvents){
        if (uiEvents.hasOwnProperty(prop)){
            object[prop] = (function(type){
                return function(target, options){
                    options = options || {};
                    simulateUIEvent(target, type, options.bubbles,
                        options.cancelable, options.view, options.detail); 
                };
            })(prop);
        }
    }

    return object;

})();

    
    /**
     * An object capable of sending test results to a server.
     * @param {String} url The URL to submit the results to.
     * @param {Function} format (Optiona) A function that outputs the results in a specific format.
     *      Default is YUITest.TestFormat.XML.
     * @constructor
     * @namespace YUITest
     * @class Reporter
     */
    YUITest.Reporter = function(url, format) {
    
        /**
         * The URL to submit the data to.
         * @type String
         * @property url
         */
        this.url = url;
    
        /**
         * The formatting function to call when submitting the data.
         * @type Function
         * @property format
         */
        this.format = format || YUITest.TestFormat.XML;
    
        /**
         * Extra fields to submit with the request.
         * @type Object
         * @property _fields
         * @private
         */
        this._fields = new Object();
        
        /**
         * The form element used to submit the results.
         * @type HTMLFormElement
         * @property _form
         * @private
         */
        this._form = null;
    
        /**
         * Iframe used as a target for form submission.
         * @type HTMLIFrameElement
         * @property _iframe
         * @private
         */
        this._iframe = null;
    };
    
    YUITest.Reporter.prototype = {
    
        //restore missing constructor
        constructor: YUITest.Reporter,
    
        /**
         * Adds a field to the form that submits the results.
         * @param {String} name The name of the field.
         * @param {Variant} value The value of the field.
         * @return {Void}
         * @method addField
         */
        addField : function (name, value){
            this._fields[name] = value;    
        },
        
        /**
         * Removes all previous defined fields.
         * @return {Void}
         * @method addField
         */
        clearFields : function(){
            this._fields = new Object();
        },
    
        /**
         * Cleans up the memory associated with the TestReporter, removing DOM elements
         * that were created.
         * @return {Void}
         * @method destroy
         */
        destroy : function() {
            if (this._form){
                this._form.parentNode.removeChild(this._form);
                this._form = null;
            }        
            if (this._iframe){
                this._iframe.parentNode.removeChild(this._iframe);
                this._iframe = null;
            }
            this._fields = null;
        },
    
        /**
         * Sends the report to the server.
         * @param {Object} results The results object created by TestRunner.
         * @return {Void}
         * @method report
         */
        report : function(results){
        
            //if the form hasn't been created yet, create it
            if (!this._form){
                this._form = document.createElement("form");
                this._form.method = "post";
                this._form.style.visibility = "hidden";
                this._form.style.position = "absolute";
                this._form.style.top = 0;
                document.body.appendChild(this._form);
            
                //IE won't let you assign a name using the DOM, must do it the hacky way
                try {
                    this._iframe = document.createElement("<iframe name=\"yuiTestTarget\" />");
                } catch (ex){
                    this._iframe = document.createElement("iframe");
                    this._iframe.name = "yuiTestTarget";
                }
    
                this._iframe.src = "javascript:false";
                this._iframe.style.visibility = "hidden";
                this._iframe.style.position = "absolute";
                this._iframe.style.top = 0;
                document.body.appendChild(this._iframe);
    
                this._form.target = "yuiTestTarget";
            }
    
            //set the form's action
            this._form.action = this.url;
        
            //remove any existing fields
            while(this._form.hasChildNodes()){
                this._form.removeChild(this._form.lastChild);
            }
            
            //create default fields
            this._fields.results = this.format(results);
            this._fields.useragent = navigator.userAgent;
            this._fields.timestamp = (new Date()).toLocaleString();
    
            //add fields to the form
            for (var prop in this._fields){
                var value = this._fields[prop];
                if (this._fields.hasOwnProperty(prop) && (typeof value != "function")){
                    var input = document.createElement("input");
                    input.type = "hidden";
                    input.name = prop;
                    input.value = value;
                    this._form.appendChild(input);
                }
            }
    
            //remove default fields
            delete this._fields.results;
            delete this._fields.useragent;
            delete this._fields.timestamp;
            
            if (arguments[1] !== false){
                this._form.submit();
            }
        
        }
    
    };


/**
 * Runs pages containing test suite definitions.
 * @namespace YUITest
 * @class PageManager
 * @static
 */
YUITest.PageManager = YUITest.Util.mix(new YUITest.EventTarget(), {

    /**
     * Constant for the testpagebegin custom event
     * @property TEST_PAGE_BEGIN_EVENT
     * @static
     * @type string
     * @final
     */
    TEST_PAGE_BEGIN_EVENT /*:String*/ : "testpagebegin",

    /**
     * Constant for the testpagecomplete custom event
     * @property TEST_PAGE_COMPLETE_EVENT
     * @static
     * @type string
     * @final
     */
    TEST_PAGE_COMPLETE_EVENT /*:String*/ : "testpagecomplete",

    /**
     * Constant for the testmanagerbegin custom event
     * @property TEST_MANAGER_BEGIN_EVENT
     * @static
     * @type string
     * @final
     */
    TEST_MANAGER_BEGIN_EVENT /*:String*/ : "testmanagerbegin",

    /**
     * Constant for the testmanagercomplete custom event
     * @property TEST_MANAGER_COMPLETE_EVENT
     * @static
     * @type string
     * @final
     */
    TEST_MANAGER_COMPLETE_EVENT /*:String*/ : "testmanagercomplete",

    //-------------------------------------------------------------------------
    // Private Properties
    //-------------------------------------------------------------------------
    
    
    /**
     * The URL of the page currently being executed.
     * @type String
     * @private
     * @property _curPage
     * @static
     */
    _curPage: null,
    
    /**
     * The frame used to load and run tests.
     * @type Window
     * @private
     * @property _frame
     * @static
     */
    _frame: null,
    
    /**
     * The timeout ID for the next iteration through the tests.
     * @type int
     * @private
     * @property _timeoutId
     * @static
     */
    _timeoutId: 0,
    
    /**
     * Array of pages to load.
     * @type String[]
     * @private
     * @property _pages
     * @static
     */
    _pages: [],
    
    /**
     * Aggregated results
     * @type Object
     * @private
     * @property _results
     * @static
     */
    _results: null,
    
    //-------------------------------------------------------------------------
    // Private Methods
    //-------------------------------------------------------------------------
    
    /**
     * Handles TestRunner.COMPLETE_EVENT, storing the results and beginning
     * the loop again.
     * @param {Object} data Data about the event.
     * @return {Void}
     * @method _handleTestRunnerComplete
     * @private
     * @static
     */
    _handleTestRunnerComplete : function (data /*:Object*/) /*:Void*/ {

        this.fire(this.TEST_PAGE_COMPLETE_EVENT, {
            page: this._curPage,
            results: data.results
        });
    
        //save results
        //this._results[this.curPage] = data.results;
        
        //process 'em
        this._processResults(this._curPage, data.results);
        
    
        //if there's more to do, set a timeout to begin again
        if (this._pages.length){
            this._timeoutId = setTimeout(function(){
                YUITest.TestManager._run();
            }, 1000);
        } else {
            this.fire(this.TEST_MANAGER_COMPLETE_EVENT, this._results);
        }
    },
    
    /**
     * Processes the results of a test page run, outputting log messages
     * for failed tests.
     * @return {Void}
     * @method _processResults
     * @private
     * @static
     */
    _processResults : function (page, results){

        var r = this._results;
        
        r.passed += results.passed;
        r.failed += results.failed;
        r.ignored += results.ignored;
        r.total += results.total;
        r.duration += results.duration;
        
        if (results.failed){
            r.failedPages.push(page);
        } else {
            r.passedPages.push(page);
        }
        
        results.name = page;
        results.type = "page";
        
        r[page] = results;
    },
    
    /**
     * Loads the next test page into the iframe.
     * @return {Void}
     * @method _run
     * @static
     * @private
     */
    _run : function () /*:Void*/ {
    
        //set the current page
        this._curPage = this._pages.shift();

        this.fire(this.TEST_PAGE_BEGIN_EVENT, this._curPage);
        
        //load the frame - destroy history in case there are other iframes that
        //need testing
        this._frame.location.replace(this._curPage);
    
    },
        
    //-------------------------------------------------------------------------
    // Public Methods
    //-------------------------------------------------------------------------
    
    /**
     * Signals that a test page has been loaded. This should be called from
     * within the test page itself to notify the TestManager that it is ready.
     * @return {Void}
     * @method load
     * @static
     */
    load : function () /*:Void*/ {
        if (parent.YUITest.PageManager !== this){
            parent.YUITest.PageManager.load();
        } else {
            
            if (this._frame) {
                //assign event handling
                var TestRunner = this._frame.YUITest.TestRunner;

                TestRunner.subscribe(TestRunner.COMPLETE_EVENT, this._handleTestRunnerComplete, this, true);
                
                //run it
                TestRunner.run();
            }
        }
    },
    
    /**
     * Sets the pages to be loaded.
     * @param {String[]} pages An array of URLs to load.     
     * @return {Void}
     * @method setPages
     * @static
     */
    setPages : function (pages /*:String[]*/) /*:Void*/ {
        this._pages = pages;
    },
    
    /**
     * Begins the process of running the tests.
     * @return {Void}
     * @method start
     * @static
     */
    start : function () /*:Void*/ {

        if (!this._initialized) {

            /**
             * Fires when loading a test page
             * @event testpagebegin
             * @param curPage {string} the page being loaded
             * @static
             */
            
            /**
             * Fires when a test page is complete
             * @event testpagecomplete
             * @param obj {page: string, results: object} the name of the
             * page that was loaded, and the test suite results
             * @static
             */
            
            /**
             * Fires when the test manager starts running all test pages
             * @event testmanagerbegin
             * @static
             */
            
            /**
             * Fires when the test manager finishes running all test pages.  External
             * test runners should subscribe to this event in order to get the
             * aggregated test results.
             * @event testmanagercomplete
             * @param obj { pages_passed: int, pages_failed: int, tests_passed: int
             *              tests_failed: int, passed: string[], failed: string[],
             *              page_results: {} }
             * @static
             */
            
            //create iframe if not already available
            if (!this._frame){
                var frame /*:HTMLElement*/ = document.createElement("iframe");
                frame.style.visibility = "hidden";
                frame.style.position = "absolute";
                document.body.appendChild(frame);
                this._frame = frame.contentWindow || frame.contentDocument.parentWindow;
            }

            this._initialized = true;
        }


        // reset the results cache
        this._results = {
        
            passed: 0,
            failed: 0,
            ignored: 0,
            total: 0,
            type: "report",
            name: "YUI Test Results",
            duration: 0,
            failedPages:[],
            passedPages:[]
            /*
            // number of pages that pass
            pages_passed: 0,
            // number of pages that fail
            pages_failed: 0,
            // total number of tests passed
            tests_passed: 0,
            // total number of tests failed
            tests_failed: 0,
            // array of pages that passed
            passed: [],
            // array of pages that failed
            failed: [],
            // map of full results for each page
            page_results: {}*/
        };

        this.fire(this.TEST_MANAGER_BEGIN_EVENT, null);
        this._run();
    
    },

    /**
     * Stops the execution of tests.
     * @return {Void}
     * @method stop
     * @static
     */
    stop : function () /*:Void*/ {
        clearTimeout(this._timeoutId);
    }

});

    
    /**
     * Runs test suites and test cases, providing events to allowing for the
     * interpretation of test results.
     * @namespace YUITest
     * @class TestRunner
     * @static
     */
    YUITest.TestRunner = function(){
    
        /**
         * A node in the test tree structure. May represent a TestSuite, TestCase, or
         * test function.
         * @param {Variant} testObject A TestSuite, TestCase, or the name of a test function.
         * @class TestNode
         * @constructor
         * @private
         */
        function TestNode(testObject){
        
            /**
             * The TestSuite, TestCase, or test function represented by this node.
             * @type Variant
             * @property testObject
             */
            this.testObject = testObject;
            
            /**
             * Pointer to this node's first child.
             * @type TestNode
             * @property firstChild
             */        
            this.firstChild = null;
            
            /**
             * Pointer to this node's last child.
             * @type TestNode
             * @property lastChild
             */        
            this.lastChild = null;
            
            /**
             * Pointer to this node's parent.
             * @type TestNode
             * @property parent
             */        
            this.parent = null; 
       
            /**
             * Pointer to this node's next sibling.
             * @type TestNode
             * @property next
             */        
            this.next = null;
            
            /**
             * Test results for this test object.
             * @type object
             * @property results
             */                
            this.results = {
                passed : 0,
                failed : 0,
                total : 0,
                ignored : 0,
                duration: 0
            };
            
            //initialize results
            if (testObject instanceof YUITest.TestSuite){
                this.results.type = "testsuite";
                this.results.name = testObject.name;
            } else if (testObject instanceof YUITest.TestCase){
                this.results.type = "testcase";
                this.results.name = testObject.name;
            }
           
        }
        
        TestNode.prototype = {
        
            /**
             * Appends a new test object (TestSuite, TestCase, or test function name) as a child
             * of this node.
             * @param {Variant} testObject A TestSuite, TestCase, or the name of a test function.
             * @return {Void}
             */
            appendChild : function (testObject){
                var node = new TestNode(testObject);
                if (this.firstChild === null){
                    this.firstChild = this.lastChild = node;
                } else {
                    this.lastChild.next = node;
                    this.lastChild = node;
                }
                node.parent = this;
                return node;
            }       
        };
    
        /**
         * Runs test suites and test cases, providing events to allowing for the
         * interpretation of test results.
         * @namespace Test
         * @class Runner
         * @static
         */
        function TestRunner(){
        
            //inherit from EventTarget
            YUITest.EventTarget.call(this);
            
            /**
             * Suite on which to attach all TestSuites and TestCases to be run.
             * @type YUITest.TestSuite
             * @property masterSuite
             * @static
             * @private
             */
            this.masterSuite = new YUITest.TestSuite("yuitests" + (new Date()).getTime());        
    
            /**
             * Pointer to the current node in the test tree.
             * @type TestNode
             * @private
             * @property _cur
             * @static
             */
            this._cur = null;
            
            /**
             * Pointer to the root node in the test tree.
             * @type TestNode
             * @private
             * @property _root
             * @static
             */
            this._root = null;
            
            /**
             * Indicates if the TestRunner will log events or not.
             * @type Boolean
             * @property _log
             * @private
             * @static
             */
            this._log = true;
            
            /**
             * Indicates if the TestRunner is waiting as a result of
             * wait() being called.
             * @type Boolean
             * @property _waiting
             * @private
             * @static
             */
            this._waiting = false;
            
            /**
             * Indicates if the TestRunner is currently running tests.
             * @type Boolean
             * @private
             * @property _running
             * @static
             */
            this._running = false;
            
            /**
             * Holds copy of the results object generated when all tests are
             * complete.
             * @type Object
             * @private
             * @property _lastResults
             * @static
             */
            this._lastResults = null;       
        }
        
        TestRunner.prototype = YUITest.Util.mix(new YUITest.EventTarget(), {
        
            //restore prototype
            constructor: YUITest.TestRunner,
        
            //-------------------------------------------------------------------------
            // Constants
            //-------------------------------------------------------------------------
             
            /**
             * Fires when a test case is opened but before the first 
             * test is executed.
             * @event testcasebegin
             * @static
             */         
            TEST_CASE_BEGIN_EVENT : "testcasebegin",
            
            /**
             * Fires when all tests in a test case have been executed.
             * @event testcasecomplete
             * @static
             */        
            TEST_CASE_COMPLETE_EVENT : "testcasecomplete",
            
            /**
             * Fires when a test suite is opened but before the first 
             * test is executed.
             * @event testsuitebegin
             * @static
             */        
            TEST_SUITE_BEGIN_EVENT : "testsuitebegin",
            
            /**
             * Fires when all test cases in a test suite have been
             * completed.
             * @event testsuitecomplete
             * @static
             */        
            TEST_SUITE_COMPLETE_EVENT : "testsuitecomplete",
            
            /**
             * Fires when a test has passed.
             * @event pass
             * @static
             */        
            TEST_PASS_EVENT : "pass",
            
            /**
             * Fires when a test has failed.
             * @event fail
             * @static
             */        
            TEST_FAIL_EVENT : "fail",
            
            /**
             * Fires when a test has been ignored.
             * @event ignore
             * @static
             */        
            TEST_IGNORE_EVENT : "ignore",
            
            /**
             * Fires when all test suites and test cases have been completed.
             * @event complete
             * @static
             */        
            COMPLETE_EVENT : "complete",
            
            /**
             * Fires when the run() method is called.
             * @event begin
             * @static
             */        
            BEGIN_EVENT : "begin",                           

            //-------------------------------------------------------------------------
            // Test Tree-Related Methods
            //-------------------------------------------------------------------------
    
            /**
             * Adds a test case to the test tree as a child of the specified node.
             * @param {TestNode} parentNode The node to add the test case to as a child.
             * @param {YUITest.TestCase} testCase The test case to add.
             * @return {Void}
             * @static
             * @private
             * @method _addTestCaseToTestTree
             */
           _addTestCaseToTestTree : function (parentNode, testCase){
                
                //add the test suite
                var node = parentNode.appendChild(testCase),
                    prop,
                    testName;
                
                //iterate over the items in the test case
                for (prop in testCase){
                    if ((prop.indexOf("test") === 0 || prop.indexOf(" ") > -1) && typeof testCase[prop] == "function"){
                        node.appendChild(prop);
                    }
                }
             
            },
            
            /**
             * Adds a test suite to the test tree as a child of the specified node.
             * @param {TestNode} parentNode The node to add the test suite to as a child.
             * @param {YUITest.TestSuite} testSuite The test suite to add.
             * @return {Void}
             * @static
             * @private
             * @method _addTestSuiteToTestTree
             */
            _addTestSuiteToTestTree : function (parentNode, testSuite) {
                
                //add the test suite
                var node = parentNode.appendChild(testSuite);
                
                //iterate over the items in the master suite
                for (var i=0; i < testSuite.items.length; i++){
                    if (testSuite.items[i] instanceof YUITest.TestSuite) {
                        this._addTestSuiteToTestTree(node, testSuite.items[i]);
                    } else if (testSuite.items[i] instanceof YUITest.TestCase) {
                        this._addTestCaseToTestTree(node, testSuite.items[i]);
                    }                   
                }            
            },
            
            /**
             * Builds the test tree based on items in the master suite. The tree is a hierarchical
             * representation of the test suites, test cases, and test functions. The resulting tree
             * is stored in _root and the pointer _cur is set to the root initially.
             * @return {Void}
             * @static
             * @private
             * @method _buildTestTree
             */
            _buildTestTree : function () {
            
                this._root = new TestNode(this.masterSuite);
                //this._cur = this._root;
                
                //iterate over the items in the master suite
                for (var i=0; i < this.masterSuite.items.length; i++){
                    if (this.masterSuite.items[i] instanceof YUITest.TestSuite) {
                        this._addTestSuiteToTestTree(this._root, this.masterSuite.items[i]);
                    } else if (this.masterSuite.items[i] instanceof YUITest.TestCase) {
                        this._addTestCaseToTestTree(this._root, this.masterSuite.items[i]);
                    }                   
                }            
            
            }, 
        
            //-------------------------------------------------------------------------
            // Private Methods
            //-------------------------------------------------------------------------
            
            /**
             * Handles the completion of a test object's tests. Tallies test results 
             * from one level up to the next.
             * @param {TestNode} node The TestNode representing the test object.
             * @return {Void}
             * @method _handleTestObjectComplete
             * @private
             */
            _handleTestObjectComplete : function (node) {
                if (typeof node.testObject == "object" && node !== null){
                
                    if (node.parent){
                        node.parent.results.passed += node.results.passed;
                        node.parent.results.failed += node.results.failed;
                        node.parent.results.total += node.results.total;                
                        node.parent.results.ignored += node.results.ignored;       
                        node.parent.results[node.testObject.name] = node.results;
                    }
                
                    if (node.testObject instanceof YUITest.TestSuite){
                        node.testObject.tearDown();
                        node.results.duration = (new Date()) - node._start;
                        this.fire({ type: this.TEST_SUITE_COMPLETE_EVENT, testSuite: node.testObject, results: node.results});
                    } else if (node.testObject instanceof YUITest.TestCase){
                        node.testObject.destroy();
                        node.results.duration = (new Date()) - node._start;
                        this.fire({ type: this.TEST_CASE_COMPLETE_EVENT, testCase: node.testObject, results: node.results});
                    }      
                } 
            },                
            
            //-------------------------------------------------------------------------
            // Navigation Methods
            //-------------------------------------------------------------------------
            
            /**
             * Retrieves the next node in the test tree.
             * @return {TestNode} The next node in the test tree or null if the end is reached.
             * @private
             * @static
             * @method _next
             */
            _next : function () {
            
                if (this._cur === null){
                    this._cur = this._root;
                } else if (this._cur.firstChild) {
                    this._cur = this._cur.firstChild;
                } else if (this._cur.next) {
                    this._cur = this._cur.next;            
                } else {
                    while (this._cur && !this._cur.next && this._cur !== this._root){
                        this._handleTestObjectComplete(this._cur);
                        this._cur = this._cur.parent;
                    }
                    
                    this._handleTestObjectComplete(this._cur);               
                        
                    if (this._cur == this._root){
                        this._cur.results.type = "report";
                        this._cur.results.timestamp = (new Date()).toLocaleString();
                        this._cur.results.duration = (new Date()) - this._cur._start;   
                        this._lastResults = this._cur.results;
                        this._running = false;                         
                        this.fire({ type: this.COMPLETE_EVENT, results: this._lastResults});
                        this._cur = null;
                    } else {
                        this._cur = this._cur.next;                
                    }
                }
            
                return this._cur;
            },
            
            /**
             * Runs a test case or test suite, returning the results.
             * @param {YUITest.TestCase|YUITest.TestSuite} testObject The test case or test suite to run.
             * @return {Object} Results of the execution with properties passed, failed, and total.
             * @private
             * @method _run
             * @static
             */
            _run : function () {
            
                //flag to indicate if the TestRunner should wait before continuing
                var shouldWait = false;
                
                //get the next test node
                var node = this._next();
                
                if (node !== null) {
                
                    //set flag to say the testrunner is running
                    this._running = true;
                    
                    //eliminate last results
                    this._lastResult = null;                  
                
                    var testObject = node.testObject;
                    
                    //figure out what to do
                    if (typeof testObject == "object" && testObject !== null){
                        if (testObject instanceof YUITest.TestSuite){
                            this.fire({ type: this.TEST_SUITE_BEGIN_EVENT, testSuite: testObject });
                            node._start = new Date();
                            testObject.setUp();
                        } else if (testObject instanceof YUITest.TestCase){
                            this.fire({ type: this.TEST_CASE_BEGIN_EVENT, testCase: testObject });
                            node._start = new Date();
                            testObject.init();
                        }
                        
                        //some environments don't support setTimeout
                        if (typeof setTimeout != "undefined"){                    
                            setTimeout(function(){
                                YUITest.TestRunner._run();
                            }, 0);
                        } else {
                            this._run();
                        }
                    } else {
                        this._runTest(node);
                    }
    
                }
            },
            
            _resumeTest : function (segment) {
            
                //get relevant information
                var node = this._cur;                
                
                //we know there's no more waiting now
                this._waiting = false;
                
                //if there's no node, it probably means a wait() was called after resume()
                if (!node){
                    //TODO: Handle in some way?
                    //console.log("wait() called after resume()");
                    //this.fire("error", { testCase: "(unknown)", test: "(unknown)", error: new Error("wait() called after resume()")} );
                    return;
                }
                
                var testName = node.testObject;
                var testCase = node.parent.testObject;
            
                //cancel other waits if available
                if (testCase.__yui_wait){
                    clearTimeout(testCase.__yui_wait);
                    delete testCase.__yui_wait;
                }

                //get the "should" test cases
                var shouldFail = (testCase._should.fail || {})[testName];
                var shouldError = (testCase._should.error || {})[testName];
                
                //variable to hold whether or not the test failed
                var failed = false;
                var error = null;
                    
                //try the test
                try {
                
                    //run the test
                    segment.apply(testCase);                    
                
                    //if the test hasn't already failed and doesn't have any asserts...
                    if(YUITest.Assert._getCount() == 0){
                        throw new YUITest.AssertionError("Test has no asserts.");
                    }                                                        
                    //if it should fail, and it got here, then it's a fail because it didn't
                     else if (shouldFail){
                        error = new YUITest.ShouldFail();
                        failed = true;
                    } else if (shouldError){
                        error = new YUITest.ShouldError();
                        failed = true;
                    }
                               
                } catch (thrown){

                    //cancel any pending waits, the test already failed
                    if (testCase.__yui_wait){
                        clearTimeout(testCase.__yui_wait);
                        delete testCase.__yui_wait;
                    }                    
                
                    //figure out what type of error it was
                    if (thrown instanceof YUITest.AssertionError) {
                        if (!shouldFail){
                            error = thrown;
                            failed = true;
                        }
                    } else if (thrown instanceof YUITest.Wait){
                    
                        if (typeof thrown.segment == "function"){
                            if (typeof thrown.delay == "number"){
                            
                                //some environments don't support setTimeout
                                if (typeof setTimeout != "undefined"){
                                    testCase.__yui_wait = setTimeout(function(){
                                        YUITest.TestRunner._resumeTest(thrown.segment);
                                    }, thrown.delay);
                                    this._waiting = true;
                                } else {
                                    throw new Error("Asynchronous tests not supported in this environment.");
                                }
                            }
                        }
                        
                        return;
                    
                    } else {
                        //first check to see if it should error
                        if (!shouldError) {                        
                            error = new YUITest.UnexpectedError(thrown);
                            failed = true;
                        } else {
                            //check to see what type of data we have
                            if (typeof shouldError == "string"){
                                
                                //if it's a string, check the error message
                                if (thrown.message != shouldError){
                                    error = new YUITest.UnexpectedError(thrown);
                                    failed = true;                                    
                                }
                            } else if (typeof shouldError == "function"){
                            
                                //if it's a function, see if the error is an instance of it
                                if (!(thrown instanceof shouldError)){
                                    error = new YUITest.UnexpectedError(thrown);
                                    failed = true;
                                }
                            
                            } else if (typeof shouldError == "object" && shouldError !== null){
                            
                                //if it's an object, check the instance and message
                                if (!(thrown instanceof shouldError.constructor) || 
                                        thrown.message != shouldError.message){
                                    error = new YUITest.UnexpectedError(thrown);
                                    failed = true;                                    
                                }
                            
                            }
                        
                        }
                    }
                    
                }
                
                //fire appropriate event
                if (failed) {
                    this.fire({ type: this.TEST_FAIL_EVENT, testCase: testCase, testName: testName, error: error });
                } else {
                    this.fire({ type: this.TEST_PASS_EVENT, testCase: testCase, testName: testName });
                }
                
                //run the tear down
                testCase.tearDown();
                
                //reset the assert count
                YUITest.Assert._reset();
                
                //calculate duration
                var duration = (new Date()) - node._start;
                
                //update results
                node.parent.results[testName] = { 
                    result: failed ? "fail" : "pass",
                    message: error ? error.getMessage() : "Test passed",
                    type: "test",
                    name: testName,
                    duration: duration
                };
                
                if (failed){
                    node.parent.results.failed++;
                } else {
                    node.parent.results.passed++;
                }
                node.parent.results.total++;
    
                //set timeout not supported in all environments
                if (typeof setTimeout != "undefined"){
                    setTimeout(function(){
                        YUITest.TestRunner._run();
                    }, 0);
                } else {
                    this._run();
                }
            
            },
            
            /**
             * Handles an error as if it occurred within the currently executing
             * test. This is for mock methods that may be called asynchronously
             * and therefore out of the scope of the TestRunner. Previously, this
             * error would bubble up to the browser. Now, this method is used
             * to tell TestRunner about the error. This should never be called
             * by anyplace other than the Mock object.
             * @param {Error} error The error object.
             * @return {Void}
             * @method _handleError
             * @private
             * @static
             */
            _handleError: function(error){
            
                if (this._waiting){
                    this._resumeTest(function(){
                        throw error;
                    });
                } else {
                    throw error;
                }           
            
            },
                    
            /**
             * Runs a single test based on the data provided in the node.
             * @param {TestNode} node The TestNode representing the test to run.
             * @return {Void}
             * @static
             * @private
             * @name _runTest
             */
            _runTest : function (node) {
            
                //get relevant information
                var testName = node.testObject;
                var testCase = node.parent.testObject;
                var test = testCase[testName];
                
                //get the "should" test cases
                var shouldIgnore = (testCase._should.ignore || {})[testName];
                
                //figure out if the test should be ignored or not
                if (shouldIgnore){
                
                    //update results
                    node.parent.results[testName] = { 
                        result: "ignore",
                        message: "Test ignored",
                        type: "test",
                        name: testName
                    };
                    
                    node.parent.results.ignored++;
                    node.parent.results.total++;
                
                    this.fire({ type: this.TEST_IGNORE_EVENT,  testCase: testCase, testName: testName });
                    
                    //some environments don't support setTimeout
                    if (typeof setTimeout != "undefined"){                    
                        setTimeout(function(){
                            YUITest.TestRunner._run();
                        }, 0);              
                    } else {
                        this._run();
                    }
    
                } else {
                
                    //mark the start time
                    node._start = new Date();
                
                    //run the setup
                    testCase.setUp();
                    
                    //now call the body of the test
                    this._resumeTest(test);                
                }
    
            },            

            //-------------------------------------------------------------------------
            // Misc Methods
            //-------------------------------------------------------------------------   

            /**
             * Retrieves the name of the current result set.
             * @return {String} The name of the result set.
             * @method getName
             */
            getName: function(){
                return this.masterSuite.name;
            },         

            /**
             * The name assigned to the master suite of the TestRunner. This is the name
             * that is output as the root's name when results are retrieved.
             * @param {String} name The name of the result set.
             * @return {Void}
             * @method setName
             */
            setName: function(name){
                this.masterSuite.name = name;
            },            
            
            //-------------------------------------------------------------------------
            // Public Methods
            //-------------------------------------------------------------------------   
        
            /**
             * Adds a test suite or test case to the list of test objects to run.
             * @param testObject Either a TestCase or a TestSuite that should be run.
             * @return {Void}
             * @method add
             * @static
             */
            add : function (testObject) {
                this.masterSuite.add(testObject);
                return this;
            },
            
            /**
             * Removes all test objects from the runner.
             * @return {Void}
             * @method clear
             * @static
             */
            clear : function () {
                this.masterSuite = new YUITest.TestSuite("yuitests" + (new Date()).getTime());
            },
            
            /**
             * Indicates if the TestRunner is waiting for a test to resume
             * @return {Boolean} True if the TestRunner is waiting, false if not.
             * @method isWaiting
             * @static
             */
            isWaiting: function() {
                return this._waiting;
            },
            
            /**
             * Indicates that the TestRunner is busy running tests and therefore can't
             * be stopped and results cannot be gathered.
             * @return {Boolean} True if the TestRunner is running, false if not.
             * @method isRunning
             */
            isRunning: function(){
                return this._running;
            },
            
            /**
             * Returns the last complete results set from the TestRunner. Null is returned
             * if the TestRunner is running or no tests have been run.
             * @param {Function} format (Optional) A test format to return the results in.
             * @return {Object|String} Either the results object or, if a test format is 
             *      passed as the argument, a string representing the results in a specific
             *      format.
             * @method getResults
             */
            getResults: function(format){
                if (!this._running && this._lastResults){
                    if (typeof format == "function"){
                        return format(this._lastResults);                    
                    } else {
                        return this._lastResults;
                    }
                } else {
                    return null;
                }
            },            
            
            /**
             * Returns the coverage report for the files that have been executed.
             * This returns only coverage information for files that have been
             * instrumented using YUI Test Coverage and only those that were run
             * in the same pass.
             * @param {Function} format (Optional) A coverage format to return results in.
             * @return {Object|String} Either the coverage object or, if a coverage
             *      format is specified, a string representing the results in that format.
             * @method getCoverage
             */
            getCoverage: function(format){
                if (!this._running && typeof _yuitest_coverage == "object"){
                    if (typeof format == "function"){
                        return format(_yuitest_coverage);                    
                    } else {
                        return _yuitest_coverage;
                    }
                } else {
                    return null;
                }            
            },
            
            /**
             * Resumes the TestRunner after wait() was called.
             * @param {Function} segment The function to run as the rest
             *      of the haulted test.
             * @return {Void}
             * @method resume
             * @static
             */
            resume : function (segment) {
                if (this._waiting){
                    this._resumeTest(segment || function(){});
                } else {
                    throw new Error("resume() called without wait().");
                }
            },
        
            /**
             * Runs the test suite.
             * @param {Boolean} oldMode (Optional) Specifies that the <= 2.8 way of
             *      internally managing test suites should be used.             
             * @return {Void}
             * @method run
             * @static
             */
            run : function (oldMode) {
                
                //pointer to runner to avoid scope issues 
                var runner = YUITest.TestRunner;
                
                //if there's only one suite on the masterSuite, move it up
                if (!oldMode && this.masterSuite.items.length == 1 && this.masterSuite.items[0] instanceof YUITest.TestSuite){
                    this.masterSuite = this.masterSuite.items[0];
                }                
    
                //build the test tree
                runner._buildTestTree();
                            
                //set when the test started
                runner._root._start = new Date();
                
                //fire the begin event
                runner.fire(runner.BEGIN_EVENT);
           
                //begin the testing
                runner._run();
            }    
        });
        
        return new TestRunner();
        
    }();

