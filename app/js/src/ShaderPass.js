var cloneDefines = function(src) {
    var dst = {};
    for (var d in src) {
        dst[d] = src[d];
    }
    return dst;
};

var createShaderMaterial = function(shader) {
    return new THREE.ShaderMaterial({
        defines: cloneDefines(shader.defines),
        uniforms: THREE.UniformsUtils.clone(shader.uniforms),
        vertexShader: shader.vertexShader,
        fragmentShader: shader.fragmentShader
    });
};

// can pass in shader or material

var ShaderPass = function(shader) {
    if (shader instanceof THREE.Material)
        this.material = shader;
    else
        this.material = createShaderMaterial(shader);

    this.material.blending = THREE.NoBlending;
    this.material.depthWrite = false;
    this.material.depthTest = false;

    // http://michaldrobot.com/2014/04/01/gcn-execution-patterns-in-full-screen-passes/
    var triangle = new THREE.BufferGeometry();
    var p = new Float32Array(9);
    p[0] = -1; p[1] = -1; p[2] = 0;
    p[3] =  3; p[4] = -1; p[5] = 0;
    p[6] = -1; p[7] =  3; p[8] = 0;
    var uv = new Float32Array(6);
    uv[0] = 0; uv[1] = 0;
    uv[2] = 2; uv[3] = 0;
    uv[4] = 0; uv[5] = 2;
    triangle.addAttribute("position", new THREE.BufferAttribute(p, 3));
    triangle.addAttribute("uv", new THREE.BufferAttribute(uv, 2));

    this.mesh = new THREE.Mesh(triangle, this.material);
    this.scene  = new THREE.Scene();
    this.scene.add(this.mesh);
    this.camera = new THREE.OrthographicCamera( -1, 1, 1, -1, 0, 1 );

    this.clear = false;
};

ShaderPass.prototype.render = function(renderer, writeBuffer) {
    renderer.render(this.scene, this.camera, writeBuffer, this.clear);
};