var ParticleEngine = function(params) {

    var _this = this;

    var _canvas, _stats;
    var _updateLoop;
    var _renderer, _camera, _scene;
    var _sim, _simMat, _initMat, _drawMat;
    var _mouse;
    var _controls, _raycaster;
    var _customUpdate;
    var _pauseSim = false;


    // PARAMS

    params = params || {};
    _size = params.size || 512;
    _simMat = params.simMat || createShaderMaterial(BasicSimShader);
    _initMat = params.initMat || createShaderMaterial(SimInitShader);
    _drawMat = params.drawMat || createShaderMaterial(BasicParticleShader);
    _customUpdate = params.update;


    // EVENTS

    var _onWindowResize = function() {
        _renderer.setSize(window.innerWidth, window.innerHeight);
    };

    var _onFrameUpdate = function(dt, t) {
        _stats.begin();

        if (!_controls.enabled) {
            _mouseUpdate();
            _controls.update();
        }

        if(_customUpdate) _customUpdate(dt, t);

        _renderer.update(dt);

        _stats.end();
    };

    var _onFixedUpdate = function(dt, t) {
        if (!_pauseSim) _sim.update(dt, t);
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

        _mouse = new Mouse(_canvas);

        _renderer = new RenderContext(_canvas);
        _renderer.init();
        _camera = _renderer.getCamera();
        _scene = _renderer.getScene();
    };

    var _sceneInit = function() {
        _sim = new ParticleSimulation(_renderer.getRenderer(), _size, {
            simMat: _simMat,
            initMat: _initMat,
            drawMat: _drawMat
        });
        _scene.add(_sim.getParticleObject());

        _camera.position.set(0,0,8);
        _controls = new THREE.OrbitControls(_camera, _canvas);
        _controls.rotateUp(Math.PI/6);
        _controls.autoRotate = true;
        _controls.autoRotateSpeed = 1.0;
        _controls.enabled = false;  // disable user input

        _raycaster = new THREE.Raycaster();

        _debugBox = document.querySelector("#debug-box");
    };

    var _mouseUpdate = function() {
        // _debugBox.innerHTML = "";

        var mIdMax = Utils.isMobile ? 4 : 1;
        for (var mId=0; mId<mIdMax; mId++) {
            var ms = _mouse.getMouse(mId);
            if (ms.buttons[0] || (mId===0 && ms.buttons[2])) {
                _raycaster.setFromCamera(ms.coords, _camera);

                // from target point to camera
                var pos = _controls.target;
                var nor = pos.clone().sub(_camera.position).normalize();
                var plane = new THREE.Plane(
                    nor, -nor.x*pos.x - nor.y*pos.y - nor.z*pos.z
                );

                // intersect plane
                var point = _raycaster.ray.intersectPlane(plane);

                _simMat.uniforms.uInputPos.value[mId].copy(point);
                _simMat.uniforms.uInputPosFlag.value.setComponent(mId, ms.buttons[0] ? 1 : -1);
            }
            else {
                _simMat.uniforms.uInputPosFlag.value.setComponent(mId, 0);
            }
        }

        // _debugBox.innerHTML +=
        //     "<br>"+_simMat.uniforms.uInputPosFlag.value.x.toFixed(2)
        //     +" "+_simMat.uniforms.uInputPosFlag.value.y.toFixed(2)
        //     +" "+_simMat.uniforms.uInputPosFlag.value.z.toFixed(2)
        //     +" "+_simMat.uniforms.uInputPosFlag.value.w.toFixed(2);
    };


    // PUBLIC FUNCTIONS

    this.start = function() {
        _updateLoop.start();
    };

    this.stop = function() {
        _updateLoop.stop();
    };

    this.pauseSimulation = function(value) {
        _pauseSim = value;
    };

    this.enableCameraAutoRotate = function(value) {
        _controls.autoRotate = value;
    };

    this.enableCameraControl = function(value) {
        _controls.enabled = value;
    };


    // INIT

    _init();

    _sceneInit();

    // expose variables
    this.renderer = _renderer;
    this.scene = _scene;
    this.camera = _camera;
};
