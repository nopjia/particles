"use strict";

var PhysicsRenderer = function(renderer, shader, size) {

    // PRIVATE VARS

    var _this = this;

    var _renderer = renderer;
    var _size = size;

    var _target1, _target2, _target3;
    var _simPass;

    var _currUpdateTarget = 1;

    // PRIVATE FUNCTIONS

    var _checkSupport = function() {
        var gl = renderer.context;

        if ( gl.getExtension( "OES_texture_float" ) === null ) {
            console.error("PhysicsRenderer: OES_texture_float not supported.");
            return;
        }

        if ( gl.getParameter( gl.MAX_VERTEX_TEXTURE_IMAGE_UNITS ) === 0 ) {
            console.error("PhysicsRenderer: Vertex shader textures not supported.");
            return;
        }
    };

    var _updateUniforms = function() {
        // TODO_NOP
    };

    // PUBLIC FUNCTIONS

    this.update = function() {
        if (_currUpdateTarget === 1) {
            _simPass.material.uniforms.tPrev.value = _target2;
            _simPass.material.uniforms.tCurr.value = _target3;
            _simPass.render(_renderer, _target1);
        }
        else if (_currUpdateTarget === 2) {
            _simPass.material.uniforms.tPrev.value = _target3;
            _simPass.material.uniforms.tCurr.value = _target1;
            _simPass.render(_renderer, _target2);
        }
        else if (_currUpdateTarget === 3) {
            _simPass.material.uniforms.tPrev.value = _target1;
            _simPass.material.uniforms.tCurr.value = _target2;
            _simPass.render(_renderer, _target3);
        }
        else {
            console.error("PhysicsRenderer: something's wrong!");
        }

        // update uniforms
        _updateUniforms();

        // increment target
        _currUpdateTarget++;
        if (_currUpdateTarget > 3)
            _currUpdateTarget = 1;
    };

    this.registerUniform = function(uniform) {
        // TODO_NOP
    };

    this.getUniforms = function() {
        return _simPass.material.uniforms;
    };

    // INITIALIZATION

    _checkSupport();

    // init shader pass

    _simPass = new ShaderPass(shader);

    // init targets

    _target1 = new THREE.WebGLRenderTarget(_size, _size, {
        minFilter: THREE.NearestFilter,
        magFilter: THREE.NearestFilter,
        format: THREE.RGBAFormat,
        type:THREE.FloatType,
        stencilBuffer: false
    });
    _target2 = _target1.clone();
    _target3 = _target1.clone();

    // TODO_NOP: clear / reset textures

};

PhysicsRenderer.prototype.constructor = PhysicsRenderer;