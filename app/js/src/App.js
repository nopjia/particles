var App = function() {

    var _this = this;

    var _renderer, _stats, _canvas, _updateLoop;

    var _SIM_SIZE = 128;

    var _sim;

    var _copyPass;

    // EVENTS

    var _onWindowResize = function() {
        _renderer.setSize(window.innerWidth, window.innerHeight);
    };

    var _onFrameUpdate = function(dt, t) {
        _stats.begin();
        // _renderer.update(dt);
        _copyPass.render(_renderer.getRenderer());
        _stats.end();
    };

    var _onFixedUpdate = function(dt, t) {
        _sim.update(dt, t);
    };

    // PRIVATE FUNCTIONS

    var _init = function() {
        window.addEventListener("resize", _onWindowResize, false);

        _canvas = document.querySelector("#webgl-canvas");
        _renderer = new RenderContext(_canvas);
        _renderer.init();

        _stats = new Stats();
        document.body.appendChild(_stats.domElement);

        _updateLoop = new UpdateLoop();
        _updateLoop.frameCallback = _onFrameUpdate;
        _updateLoop.fixedCallback = _onFixedUpdate;
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

    var _geo, _mat, _particles;

    var _customInit = function() {
        _sim = new PhysicsRenderer(
            _renderer.getRenderer(),
            SimShader,
            _SIM_SIZE
        );

        _geo = _createParticleGeometry(_SIM_SIZE);
        _mat = new THREE.ShaderMaterial(ParticleShader);
        _particles = new THREE.PointCloud(_geo, _mat);
        _particles.frustumCulled = false;
        _renderer.getScene().add(_particles);
        _sim.registerUniform(_mat.uniforms.tPos);

        _copyPass = new ShaderPass(THREE.CopyShader);
        _sim.registerUniform(_copyPass.material.uniforms.tDiffuse);
    };

    // INIT

    _init();

    // AUTHOR INIT

    _customInit();

    // RUN
    _updateLoop.start();

};

App.prototype.constructor = App;