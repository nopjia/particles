var App = function() {

    var _this = this;

    var _canvas, _stats;
    var _updateLoop;
    var _renderer;
    var _sim, _simMat, _initMat, _drawMat;

    var _SIM_SIZE = 256;

    // EVENTS

    var _onWindowResize = function() {
        _renderer.setSize(window.innerWidth, window.innerHeight);
    };

    var _onFrameUpdate = function(dt, t) {
        _stats.begin();

        _drawMat.uniforms.uTime.value = t;
        _renderer.update(dt);

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
            var idx = x + y*size;
            pos[ATTR_WIDTH*idx]   = (x+0.5)/size;       // +0.5 to be at center of texel
            pos[ATTR_WIDTH*idx+1] = (y+0.5)/size;
            pos[ATTR_WIDTH*idx+2] = idx/(size*size);    // extra: normalized id
        }
        geo.addAttribute("position", new THREE.BufferAttribute(pos, ATTR_WIDTH));
        return geo;
    };

    var _sceneInit = function() {
        _simMat = createShaderMaterial(SimShader);

        _initMat = createShaderMaterial(SimInitShader);

        _sim = new PhysicsRenderer(
            _renderer.getRenderer(),
            _simMat,
            _initMat,
            _SIM_SIZE
        );

        _drawMat = createShaderMaterial(ParticleShader);
        _drawMat.uniforms.uColor.value.set(1.0, 1.0, 1.0, 0.2);
        _drawMat.blending = THREE.AdditiveBlending;
        _drawMat.transparent = true;
        _drawMat.depthTest = false;
        _drawMat.depthWrite = false;
        _sim.registerUniform(_drawMat.uniforms.tPos);

        var geo = _createParticleGeometry(_SIM_SIZE);
        var particles = new THREE.PointCloud(geo, _drawMat);
        particles.frustumCulled = false;
        _renderer.getScene().add(particles);
    };

    // INIT

    _init();

    // AUTHOR INIT

    _sceneInit();

    // RUN
    _updateLoop.start();

};

App.prototype.constructor = App;