"use strict";

var App = function() {

    var _this = this;

    // EVENTS

    var _onWindowResize = function() {
        _this.renderer.setSize(window.innerWidth, window.innerHeight);
    };

    var _onFrameUpdate = function(dt, t) {
        _this.stats.begin();
        _this.renderer.update(dt);
        _this.stats.end();
    };

    var _onFixedUpdate = function(dt, t) {

    };

    // RUN

    window.addEventListener("resize", _onWindowResize, false);

    this.canvas = document.querySelector("#webgl-canvas");
    this.renderer = new RenderContext(this.canvas);
    this.renderer.init();

    this.stats = new Stats();
    document.body.appendChild(this.stats.domElement);

    this.updateLoop = new UpdateLoop();
    this.updateLoop.frameCallback = _onFrameUpdate;
    this.updateLoop.fixedCallback = _onFixedUpdate;
    this.updateLoop.start();

};

App.prototype.constructor = App;