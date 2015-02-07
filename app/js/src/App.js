var App = function() {

    var _params, _gui, _guiFields;

    // TODO_NOP: clean up this stuff, do this better
    var _customSetup = {
        basic: function() {}
    };

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
        this.simMat.defines.SIM_ROSE_GALAXY = "";
        var _drawMat = this.drawMat = createShaderMaterial(ParticleShader);
        this.update = function(dt, t) {
            _drawMat.uniforms.uTime.value = t;
        };
    };

    var _init = function() {
        var routeName = window.location.hash.length > 0 ?
            window.location.hash.substr(1) : "";

        console.log("route: " + routeName);

        // fix address bar
        if (!_customSetup[routeName]) window.location.hash = "";

        var preset = Utils.isMobile ? BasicPreset : Preset;

        _params = window.params = new preset();
    };

    var _switchShape = function(name) {
        delete _params.simMat.defines.SIM_PLANE;
        delete _params.simMat.defines.SIM_SPHERE;
        delete _params.simMat.defines.SIM_ROSE_GALAXY;
        delete _params.simMat.defines.SIM_NOISE;

        switch (name) {
            case "plane":
                _params.simMat.defines.SIM_PLANE = ""; break;
            case "sphere":
                _params.simMat.defines.SIM_SPHERE = ""; break;
            case "galaxy":
                _params.simMat.defines.SIM_ROSE_GALAXY = ""; break;
            case "noise":
                _params.simMat.defines.SIM_NOISE = ""; break;
        }

        _params.simMat.needsUpdate = true;
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
            "shape": "galaxy"
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
        _gui.add(_guiFields, "color speed", 0, 10).onChange(function(value) {
            _params.drawMat.uniforms.uColorSpeed.value = value;
        });
        _gui.add(_guiFields, "color freq", 0, 5).onChange(function(value) {
            _params.drawMat.uniforms.uColorFreq.value = value;
        });
        _gui.add(_guiFields, "point size", 1, 10).onChange(function(value) {
            _params.drawMat.uniforms.uPointSize.value = value;
        });
        _gui.add(_guiFields, "user gravity", 0, 10).onFinishChange(function(value) {
            _params.simMat.uniforms.uInputAccel.value = value;
        });
        _gui.add(_guiFields, "shape gravity", 0, 2).onFinishChange(function(value) {
            _params.simMat.uniforms.uShapeAccel.value = value;
        });

        _gui.add(_guiFields, "shape", ["none", "plane", "sphere", "galaxy", "noise"])
            .onFinishChange(_switchShape);

    };

    _init();

    !Utils.isMobile && _initUI();

    var engine = new ParticleEngine(_params);

};