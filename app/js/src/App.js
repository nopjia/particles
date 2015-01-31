var App = function() {

    var _this = this;

    // FUNCTIONS

    this.onWindowResize = function() {
        _this.graphics.setSize(window.innerWidth, window.innerHeight);
    };

    this.frameUpdate = function(dt, t) {
        _this.stats.begin();
        _this.graphics.update(dt);
        _this.stats.end();
    };

    this.fixedUpdate = function(dt, t) {

    };

    // RUN

    window.addEventListener("resize", _this.onWindowResize, false);

    this.container = document.querySelector("#webgl-canvas");
    this.graphics = new RenderContext(this.container);
    this.graphics.init();

    this.stats = new Stats();
    document.body.appendChild(this.stats.domElement);

    this.updateLoop = new UpdateLoop();
    this.updateLoop.frameCallback = this.frameUpdate;
    this.updateLoop.fixedCallback = this.fixedUpdate;
    this.updateLoop.start();

};

App.prototype.constructor = App;