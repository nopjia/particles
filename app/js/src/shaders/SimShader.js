var SimShader = {

    defines: {
        "MULTIPLE_INPUT": Utils.isMobile ? "" : undefined,
        "K_VEL_DECAY": "0.99",
        "K_INPUT_ACCEL": "2.0"
    },

    uniforms: {
        "tPrev": { type: "t", value: null },
        "tCurr": { type: "t", value: null },
        "uDeltaT": { type: "f", value: 0.0 },
        "uTime": { type: "f", value: 0.0 },
        "uInputPos": { type: "v3v", value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()] },
        "uInputPosFlag": { type: "v4", value: new THREE.Vector4(0,0,0,0) },
    },

    vertexShader: ShaderChunks.basic_vertex,

    fragmentShader: Utils.loadTextFile(
        "js/src/shaders/SimShader.fs.glsl"
    )

};

var BasicSimShader = {
    defines: SimShader.defines,
    uniforms: SimShader.uniforms,
    vertexShader: ShaderChunks.basic_vertex,
    fragmentShader: Utils.loadTextFile(
        "js/src/shaders/BasicSimShader.fs.glsl"
    )
};