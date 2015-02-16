importScripts("../lib/three70.js");
importScripts("../lib/OBJLoader.js");
importScripts("WorkerFunctions.js");
importScripts("MapRasterizer.js");

var rasterizer = new MapRasterizer();

WorkerFunctions.test = function(url, size) {

    console.log("loading " + url + "...");

    var loader = new THREE.OBJLoader();
    loader.load(url, function (object) {
        var geo = object.children[0].geometry;
        postMessage(rasterizer.parse(geo, size));
    });

};

onmessage = WorkerFunctions.onMessage;