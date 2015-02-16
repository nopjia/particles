/**
 * func     {String} - name of function to call, if exists
 * funcArgs {Array}  - array of parameters to pass to func
 * code     {String} - code to execute using eval()
 */

var WorkerFunctions = {};

WorkerFunctions.onMessage = function(e) {
    if (e.data.func) {
        var func = WorkerFunctions[e.data.func];
        if (func) func.apply(this, e.data.funcArgs);
        else postMessage("ERROR: no function matches e.data.func");
    }

    if (e.data.code) {
        postMessage(eval(e.data.code));
    }
};

WorkerFunctions.close = function() {
    close();
    postMessage("Worker closed");
};

WorkerFunctions.hello = function() {
    postMessage("Hello World!");
};