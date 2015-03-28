var App = function() {
    var _gui, _guiFields;
    var _engine;
    var _currPreset = "galaxy"; // initial preset
    var _uvAnim;

    // DEFINES

    var _params = {
        size: 512,
        simMat: createShaderMaterial(SimShader),
        drawMat: createShaderMaterial(ParticleShader),
        update: undefined,  // defined later in the file
    };

    var _simModes = [
        "SIM_PLANE",
        "SIM_CUBE",
        "SIM_DISC",
        "SIM_SPHERE",
        "SIM_BALL",
        "SIM_ROSE_GALAXY",
        "SIM_GALAXY",
        "SIM_NOISE",
        "SIM_TEXTURE"
    ];

    var _meshes = {
        bear:      { scale:0.025, yOffset:-2.50, speed:0.05, url:"models/bear.json" },
        bison:     { scale:0.020, yOffset:-2.00, speed:0.10, url:"models/bison.json" },
        // deer:      { scale:0.040, yOffset:-2.00, speed:0.10, url:"models/deer.json" },
        // dog:       { scale:0.040, yOffset:-1.65, speed:0.10, url:"models/retriever.json" },
        // fox:       { scale:0.070, yOffset:-1.50, speed:0.10, url:"models/fox.json" },
        horse:     { scale:0.020, yOffset:-1.75, speed:0.08, url:"models/horse.json" },
        panther:   { scale:0.030, yOffset:-1.70, speed:0.10, url:"models/panther.json" },
        // rabbit:    { scale:0.040, yOffset:-1.00, speed:0.05, url:"models/rabbit.json" },
        wolf:      { scale:0.040, yOffset:-1.70, speed:0.10, url:"models/wolf.json" },
    };

    var _presets = {
        "none":    { "user gravity":3, "shape gravity":1, _shape:"" },
        "noise":   { "user gravity":3, "shape gravity":1, _shape:"SIM_NOISE" },
        "plane":   { "user gravity":4, "shape gravity":3, _shape:"SIM_PLANE" },
        "sphere":  { "user gravity":4, "shape gravity":3, _shape:"SIM_SPHERE" },
        "galaxy":  { "user gravity":3, "shape gravity":1, _shape:"SIM_GALAXY" },
        "petals":  { "user gravity":3, "shape gravity":2, _shape:"SIM_ROSE_GALAXY" },
        "bear":    { "user gravity":4, "shape gravity":5, _shape:_meshes.bear },
        "bison":   { "user gravity":4, "shape gravity":5, _shape:_meshes.bison },
        // "deer":    { "user gravity":4, "shape gravity":5, _shape:_meshes.deer },
        // "dog":     { "user gravity":4, "shape gravity":5, _shape:_meshes.dog },
        // "fox":     { "user gravity":4, "shape gravity":5, _shape:_meshes.fox },
        "horse":   { "user gravity":4, "shape gravity":5, _shape:_meshes.horse },
        "panther": { "user gravity":4, "shape gravity":5, _shape:_meshes.panther },
        // "rabbit":  { "user gravity":4, "shape gravity":5, _shape:_meshes.rabbit },
        "wolf":    { "user gravity":4, "shape gravity":5, _shape:_meshes.wolf },
    };


    // FUNCTIONS

    var _setSimMode = function(name) {
        _simModes.forEach(function(s) {
            delete _params.simMat.defines[s];
        });
        if (name)
            _params.simMat.defines[name] = "";
        _params.simMat.needsUpdate = true;
    };

    var _setPreset = function(name) {
        var preset = _presets[name];

        // set shape
        if (preset._shape.length >= 0) {
            _setSimMode(preset._shape);
        }
        else {
            _uvAnim.setMesh(preset._shape.mesh);
            _setSimMode("SIM_TEXTURE");
        }

        _guiFields["user gravity"]  = _params.simMat.uniforms.uInputAccel.value = preset["user gravity"];
        _guiFields["shape gravity"] = _params.simMat.uniforms.uShapeAccel.value = preset["shape gravity"];
    };

    var _takeScreenshot = function() {
        _engine.renderer.getImageData(function(dataUrl) {
            var url = Utils.dataUrlToBlobUrl(dataUrl);
            Utils.openUrlInNewWindow(url, window.innerWidth, window.innerHeight);
        });
    };


    // UPDATE

    var _update = _params.update = function(dt,t) {
        _params.drawMat.uniforms.uTime.value = t;  // for ParticleShader.vs
        _uvAnim.update(dt,t);
    };


    // INIT

    var _init = function() {
        _engine = new ParticleEngine(_params);

        _uvAnim = new UVMapAnimator(_engine.renderer.getRenderer(), _params.size);
        _params.simMat.uniforms.tTarget = { type: "t", value: _uvAnim.target };
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
            "shape": _currPreset,
            "paused": false,
            "camera rotate": true,
            "camera control": false,
            "screenshot": _takeScreenshot,
        };

        _gui.add(_guiFields, "shape", Object.keys(_presets))
            .onFinishChange(_setPreset);

        var fAppearance = _gui.addFolder("Appearance");
        fAppearance.addColor(_guiFields, "color1").onChange(function(value) {
            if (value[0] === "#") value = Utils.hexToRgb(value);
            _params.drawMat.uniforms.uColor1.value.x = value[0] / 255.0;
            _params.drawMat.uniforms.uColor1.value.y = value[1] / 255.0;
            _params.drawMat.uniforms.uColor1.value.z = value[2] / 255.0;
        });
        fAppearance.addColor(_guiFields, "color2").onChange(function(value) {
            if (value[0] === "#") value = Utils.hexToRgb(value);
            _params.drawMat.uniforms.uColor2.value.x = value[0] / 255.0;
            _params.drawMat.uniforms.uColor2.value.y = value[1] / 255.0;
            _params.drawMat.uniforms.uColor2.value.z = value[2] / 255.0;
        });
        fAppearance.add(_guiFields, "alpha", 0, 1).onChange(function(value) {
            _params.drawMat.uniforms.uAlpha.value = value;
        });
        fAppearance.add(_guiFields, "color speed", -10, 10).onChange(function(value) {
            _params.drawMat.uniforms.uColorSpeed.value = value;
        });
        fAppearance.add(_guiFields, "color freq", 0, 5).onChange(function(value) {
            _params.drawMat.uniforms.uColorFreq.value = value;
        });
        fAppearance.add(_guiFields, "point size", 1, 10).onChange(function(value) {
            _params.drawMat.uniforms.uPointSize.value = value;
        });

        var fPhysics = _gui.addFolder("Physics");
        fPhysics.add(_guiFields, "user gravity", 0, 10)
        .listen()
        .onChange(function(value) {
            _params.simMat.uniforms.uInputAccel.value = value;
        });
        fPhysics.add(_guiFields, "shape gravity", 0, 10)
        .listen()
        .onChange(function(value) {
            _params.simMat.uniforms.uShapeAccel.value = value;
        });

        var fControls = _gui.addFolder("Controls");
        fControls.add(_guiFields, "paused").onChange(function(value) {
            _engine.pauseSimulation(value);
        }).listen();
        fControls.add(_guiFields, "camera rotate").onChange(function(value) {
            _engine.enableCameraAutoRotate(value);
        });
        fControls.add(_guiFields, "camera control").onChange(function(value) {
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

    var _loadMeshes = function() {
        var loader = new THREE.JSONLoader(true);
        Object.keys(_meshes).forEach(function(k) {
            loader.load(_meshes[k].url, function(geometry) {
                var mesh = new THREE.MorphAnimMesh(geometry);  // no material
                mesh.scale.set(_meshes[k].scale,_meshes[k].scale,_meshes[k].scale);
                mesh.position.y = _meshes[k].yOffset;
                mesh.duration = 1000 / _meshes[k].speed;
                _meshes[k].mesh = mesh;
            });
        });
    };



    // RUN PROGRAM

    _loadMeshes();
    _init();
    _initUI();
    _initKeyboard();
    _setPreset(_currPreset);
    _engine.start();

};