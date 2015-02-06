/**
 * params = {
 *   simMat: THREE.Material,
 *   initMat: THREE.Material,
 *   drawMat: THREE.Material
 * }
 */
var ParticleSimulation = function(renderer, size, params) {
    var _this = this;
    var _size = size;
    var _sim, _simMat, _initMat, _drawMat, _particles;

    params = params || {};

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

    var _init = function() {
        _simMat = params.simMat || createShaderMaterial(SimShader);

        _initMat = params.initMat || createShaderMaterial(SimInitShader);

        _sim = new SimulationRenderer(
            renderer,
            _simMat,
            _initMat,
            _size
        );

        _drawMat = params.drawMat || createShaderMaterial(ParticleShader);
        _drawMat.blending = THREE.AdditiveBlending;
        _drawMat.transparent = true;
        _drawMat.depthTest = false;
        _drawMat.depthWrite = false;
        _sim.registerUniform(_drawMat.uniforms.tPos);

        var geo = _createParticleGeometry(_size);
        _particles = new THREE.PointCloud(geo, _drawMat);
        _particles.frustumCulled = false;
    };

    this.getParticleObject = function() {
        return _particles;
    };

    _init();


    this.update = _sim.update;
};