var UVMapAnimator = function(renderer, url, size) {
    var _this = this;
    var _mesh;
    var _mapper = new UVMapper(renderer);
    var _speed = 1.0;

    this.target = _mapper.createTarget(size);

    var _loader = new THREE.JSONLoader( true );
    _loader.load(url, function(geometry) {
        _mesh = new THREE.MorphAnimMesh(geometry, new THREE.MeshBasicMaterial({ color: 0x00ff00, wireframe: true, morphTargets:true }));
        _mesh.scale.set(0.05,0.05,0.05);
        _mesh.position.y -= 1;
        _mesh.duration = 1000 / _speed;
    });

    this.update = function(dt, t) {
        if (!_mesh) return;

        _mesh.updateAnimation(dt * 1000);
        _mapper.render(_mesh, _this.target);
    };

    this.setSpeed = function(speed) {
        _speed = speed;
        if (_mesh)
            _mesh.duration = 1000 / _speed;
    };
};