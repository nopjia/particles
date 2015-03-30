var LeapManager = function(renderer, camera) {
    var _renderer = renderer;
    var _camera = camera;

    var _LEAP_SCALE = new THREE.Vector3(0.01,0.01,0.01);
    var _LEAP_POSITION = new THREE.Vector3(0.0, -2.0, -5.0);

    var _tmat = new THREE.Matrix4();
    _tmat.scale(_LEAP_SCALE);
    _tmat.setPosition(_LEAP_POSITION);

    var _scene = new THREE.Scene();
    _scene.overrideMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.25,
    });

    var _root = new THREE.Object3D();
    _root.matrixAutoUpdate = false;
    _scene.add(_root);

    var _leapController = new Leap.Controller();
    _leapController.use('boneHand', {
        render: function() {},
        scene: _root,
        arm: false,
    }).connect();

    this.update = function() {
        // update leapRoot transform
        _root.matrix.multiplyMatrices(_camera.matrix, _tmat);
        _root.matrixWorldNeedsUpdate = true;
    };

    this.render = function(renderTarget, forceClear) {
        _renderer.render(_scene, _camera, renderTarget, forceClear);
    };

    this.setCamera = function(camera) {
        _camera = camera;
    };

    this.setRenderer = function(renderer) {
        _renderer = renderer;
    };

    this.setTransform = function(mat) {
        _tmat = mat;
    };
};