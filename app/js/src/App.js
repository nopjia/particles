var App = function() {

    var _SIM_SIZE = 512;

    var _this = this;

    var _canvas, _stats;
    var _updateLoop;
    var _renderer, _camera, _scene;
    var _sim, _simMat, _initMat, _drawMat;
    var _mouse;

    var _controls, _raycaster;

    // EVENTS

    var _onWindowResize = function() {
        _renderer.setSize(window.innerWidth, window.innerHeight);
    };

    var _onFrameUpdate = function(dt, t) {
        _stats.begin();

        _mouseUpdate();
        _controls.update();
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

        _stats = new Stats();
        document.body.appendChild(_stats.domElement);

        _updateLoop = new UpdateLoop();
        _updateLoop.frameCallback = _onFrameUpdate;
        _updateLoop.fixedCallback = _onFixedUpdate;

        _canvas = document.querySelector("#webgl-canvas");

        _mouse = new Mouse();

        _renderer = new RenderContext(_canvas);
        _renderer.init();
        _camera = _renderer.getCamera();
        _scene = _renderer.getScene();
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

        _sim = new SimulationRenderer(
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
        _scene.add(particles);

        _camera.position.set(0,0,8);
        _controls = new THREE.OrbitControls(_camera, _canvas);
        _controls.rotateUp(Math.PI/6);
        _controls.autoRotate = true;
        _controls.autoRotateSpeed = 1.0;
        _controls.enabled = false;  // disable user input

        _raycaster = new THREE.Raycaster();
    };

    var _mouseUpdate = function() {
        if (_mouse.buttons[0]) {
            _raycaster.setFromCamera(_mouse.coords, _camera);

            // from target point to camera
            var pos = _controls.target;
            var nor = pos.clone().sub(_camera.position).normalize();
            var plane = new THREE.Plane(
                nor, -nor.x*pos.x - nor.y*pos.y - nor.z*pos.z
            );

            // intersect plane
            var point = _raycaster.ray.intersectPlane(plane);

            _simMat.uniforms.uInputPos.value.copy(point);
            _simMat.uniforms.uInputPosEnabled.value = 1;
        }
        else {
            _simMat.uniforms.uInputPosEnabled.value = 0;
        }
    };

    // INIT

    _init();

    // AUTHOR INIT

    _sceneInit();

    // RUN
    _updateLoop.start();

};

App.prototype.constructor = App;