var App = function() {

    var _this = this;

    var _SIM_SIZE = 128;

    var _sim;

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
        // _sim.update(dt); // TODO_NOP: shit's broke
    };

    // PRIVATE FUNCTIONS

    var _init = function() {
        window.addEventListener("resize", _onWindowResize, false);

        _this.canvas = document.querySelector("#webgl-canvas");
        _this.renderer = new RenderContext(_this.canvas);
        _this.renderer.init();

        _this.stats = new Stats();
        document.body.appendChild(_this.stats.domElement);

        _this.updateLoop = new UpdateLoop();
        _this.updateLoop.frameCallback = _onFrameUpdate;
        _this.updateLoop.fixedCallback = _onFixedUpdate;
    };

    var _createParticleGeometry = function(size) {
        var ATTR_WIDTH = 3;
        var geo = new THREE.BufferGeometry();
        var pos = new Float32Array(size*size*ATTR_WIDTH);
        for (var x=0; x<size; x++)
        for (var y=0; y<size; y++) {
            var idx = x*ATTR_WIDTH + y*size*ATTR_WIDTH;
            pos[idx]   = x/size;
            pos[idx+1] = y/size;
            pos[idx+2] = 0.0;   // TODO_NOP unused
        }
        geo.addAttribute("position", new THREE.BufferAttribute(pos, ATTR_WIDTH));
        return geo;
    };

    var _customInit = function() {
        _sim = new PhysicsRenderer(
            _this.renderer.getRenderer(),
            SimShader,
            _SIM_SIZE
        );

        var geo = _createParticleGeometry(_SIM_SIZE);
        var mat = new THREE.ShaderMaterial(ParticleShader);
        var particles = new THREE.PointCloud(geo, mat);
        particles.frustumCulled = false;
        _this.renderer.getScene().add(particles);
        _sim.registerUniform(mat.uniforms.tPos);
    };

    // INIT

    _init();

    // AUTHOR INIT

    _customInit();

    // RUN
    this.updateLoop.start();

};

App.prototype.constructor = App;