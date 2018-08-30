var UVMapAnimator = function(renderer, size) {
    var _this = this;
    var _mesh;
    var _mapper = new UVMapper(renderer);
    var _speed = 1.0;

    this.target = _mapper.createTarget(size);

    this.update = function(dt, t) {
        if (!_mesh) return;

        _mesh.updateAnimation(dt * 1000);
        _mapper.render(_mesh, _this.target);
    };

    this.setMesh = function(mesh) {
        _mesh = mesh;
    };
};