var App = function() {

    var _params, _gui, _guiFields, _engine;
    var _customUpdate;

    var _currShape; // to display in GUI on init


    // ENGINE PRESETS

    var BasicPreset = function() {
        this.size = Utils.isMobile ? 128 : 512;
        var _drawMat = this.drawMat = createShaderMaterial(BasicParticleShader);
        var _color = new THREE.Color(1.0, 0.5, 0.3);
        var _alpha = 0.3;
        this.update = function(dt, t) {
            _color.offsetHSL(0.1*dt, 0.0, 0.0);
            _drawMat.uniforms.uColor.value.set(_color.r, _color.g, _color.b, _alpha);
        };
    };

    var Preset = function() {
        this.size = 512;
        this.simMat = createShaderMaterial(SimShader);
        var _drawMat = this.drawMat = createShaderMaterial(ParticleShader);
        this.update = function(dt, t) {
            _drawMat.uniforms.uTime.value = t;  // for ParticleShader.vs
            if (_customUpdate) _customUpdate(dt, t);
        };
    };


    // SHAPE PRESETS

    var _DEFAULT_SHAPE = "galaxy";

    var _presetShapes = {
        "none":   "SIM_NO_SHAPE",
        "plane":  "SIM_PLANE",
        "cube":   "SIM_CUBE",
        "disc":   "SIM_DISC",
        "sphere": "SIM_SPHERE",
        "ball":   "SIM_BALL",
        "petals": "SIM_ROSE_GALAXY",
        "galaxy": "SIM_GALAXY",
        "noise":  "SIM_NOISE",
        "object": "SIM_TEXTURE",
    };

    var _switchShape = function(name) {
        if (!_presetShapes[name]) return;

        Object.keys(_presetShapes).forEach(function(k) {
            delete _params.simMat.defines[_presetShapes[k]];
        });
        _params.simMat.defines[_presetShapes[name]] = "";
        _params.simMat.needsUpdate = true;

        _currShape = name;
    };


    // FUNCTIONS

    var _takeScreenshot = function() {
        _engine.renderer.getImageData(function(dataUrl) {
            var url = Utils.dataUrlToBlobUrl(dataUrl);
            Utils.openUrlInNewWindow(url, window.innerWidth, window.innerHeight);
        });
    };


    // INIT FUNCTIONS

    var _init = function() {
        // choose preset
        var preset = Utils.isMobile ? BasicPreset : Preset;
        _params = new preset();

        // routing, configure params
        var routeName = window.location.hash.length > 0 ?
            window.location.hash.substr(1) : "";
        console.log("route: " + routeName);

        if (!_presetShapes[routeName]) {
            window.location.hash = "";  // fix address bar
            routeName = _DEFAULT_SHAPE;  // default shape
        }

        if (!Utils.isMobile) _switchShape(routeName);

        // init engine, with params
        _engine = new ParticleEngine(_params);
    };

    var _initUI = function() {
        _gui = new dat.GUI();
        _guiFields = {
            "color1": [_params.drawMat.uniforms.uColor1.value.x*255, _params.drawMat.uniforms.uColor1.value.y*255, _params.drawMat.uniforms.uColor1.value.z*255],
            "color2": [_params.drawMat.uniforms.uColor2.value.x*255, _params.drawMat.uniforms.uColor2.value.y*255, _params.drawMat.uniforms.uColor2.value.z*255],
            "alpha": _params.drawMat.uniforms.uAlpha.value,
            "color speed": _params.drawMat.uniforms.uColorSpeed.value,
            "color freq": _params.drawMat.uniforms.uColorFreq.value,
            "point size": _params.drawMat.uniforms.uPointSize.value,
            "user gravity": _params.simMat.uniforms.uInputAccel.value,
            "shape gravity": _params.simMat.uniforms.uShapeAccel.value,
            "shape": _currShape,
            "paused": false,
            "camera rotate": true,
            "camera control": false,
            "screenshot": _takeScreenshot,
        };

        _gui.addColor(_guiFields, "color1").onChange(function(value) {
            if (value[0] === "#") value = Utils.hexToRgb(value);
            _params.drawMat.uniforms.uColor1.value.x = value[0] / 255.0;
            _params.drawMat.uniforms.uColor1.value.y = value[1] / 255.0;
            _params.drawMat.uniforms.uColor1.value.z = value[2] / 255.0;
        });
        _gui.addColor(_guiFields, "color2").onChange(function(value) {
            if (value[0] === "#") value = Utils.hexToRgb(value);
            _params.drawMat.uniforms.uColor2.value.x = value[0] / 255.0;
            _params.drawMat.uniforms.uColor2.value.y = value[1] / 255.0;
            _params.drawMat.uniforms.uColor2.value.z = value[2] / 255.0;
        });
        _gui.add(_guiFields, "alpha", 0, 1).onChange(function(value) {
            _params.drawMat.uniforms.uAlpha.value = value;
        });
        _gui.add(_guiFields, "color speed", -10, 10).onChange(function(value) {
            _params.drawMat.uniforms.uColorSpeed.value = value;
        });
        _gui.add(_guiFields, "color freq", 0, 5).onChange(function(value) {
            _params.drawMat.uniforms.uColorFreq.value = value;
        });
        _gui.add(_guiFields, "point size", 1, 10).onChange(function(value) {
            _params.drawMat.uniforms.uPointSize.value = value;
        });
        _gui.add(_guiFields, "user gravity", 0, 10).onChange(function(value) {
            _params.simMat.uniforms.uInputAccel.value = value;
        });
        _gui.add(_guiFields, "shape gravity", 0, 10).onChange(function(value) {
            _params.simMat.uniforms.uShapeAccel.value = value;
        });
        _gui.add(_guiFields, "shape", Object.keys(_presetShapes))
            .onFinishChange(_switchShape);
        _gui.add(_guiFields, "paused").onChange(function(value) {
            _engine.pauseSimulation(value);
        }).listen();
        _gui.add(_guiFields, "camera rotate").onChange(function(value) {
            _engine.enableCameraAutoRotate(value);
        });
        _gui.add(_guiFields, "camera control").onChange(function(value) {
            _engine.enableCameraControl(value);
        }).listen();
        _gui.add(_guiFields, "screenshot");
    };

    var _initKeyboard = function() {

        // pause simulation
        Mousetrap.bind("space", function() {
            _guiFields.paused = !_guiFields.paused;
            _engine.pauseSimulation(_guiFields.paused);
            return false;
        });

        // mouse camera control
        Mousetrap.bind(["alt", "option"], function() {
            _guiFields["camera control"] = true;
            _engine.enableCameraControl(true);
            return false;
        }, "keydown");
        Mousetrap.bind(["alt", "option"], function() {
            _guiFields["camera control"] = false;
            _engine.enableCameraControl(false);
            return false;
        }, "keyup");

    };


    // RUN PROGRAM

    _init();

    if (!Utils.isMobile) {
        _initUI();
        _initKeyboard();

        // TODO_NOP TEST

        var uvAnim = new UVMapAnimator(_engine.renderer.getRenderer(), _params.size);
        _params.simMat.uniforms.tTarget = { type: "t", value: uvAnim.target };
        _customUpdate = uvAnim.update;

        var url = "models/wolf.json";
        var loader = new THREE.JSONLoader(true);
        loader.load(url, function(geometry) {
            var mesh = new THREE.MorphAnimMesh(geometry);
            var scale = 0.04;
            mesh.scale.set(scale,scale,scale);
            mesh.position.y -= 1;
            mesh.duration = 1000 / 0.1;
            uvAnim.setMesh(mesh);
        });
    }

    _engine.start();
};