var UVMapper = function(renderer) {
    var _renderer = renderer;

    var _camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );   // not really used
    var _scene  = new THREE.Scene();

    var _mat = createShaderMaterial(UVMapShader);
    _mat.side = THREE.DoubleSide;
    _mat.blending = THREE.NoBlending;
    _mat.depthTest = false;
    _mat.depthWrite = false;
    _mat.morphTargets = true;
    _scene.overrideMaterial = _mat;

    this.render = function(mesh, target) {
        // might need to make geo, so don't steal from its original parent
        _scene.add(mesh);
        _renderer.render(_scene, _camera, target, true);
        _scene.remove(mesh);
    };

    this.createTarget = function(size) {
        var target = new THREE.WebGLRenderTarget(size, size, {
            minFilter: THREE.LinearFilter,
            magFilter: THREE.LinearFilter,
            format: THREE.RGBAFormat,
            type: THREE.FloatType,
            depthBuffer: false,
            stencilBuffer: false
        });
        target.generateMipmaps = false;

        return target;
    };

    this.createMap = function(mesh, size) {
        var target = this.createTarget(size);
        this.render(mesh, target);
        return target;
    };
};