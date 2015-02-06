var SimShader = {

    uniforms: {
        "tPrev": { type: "t", value: null },
        "tCurr": { type: "t", value: null },
        "uDeltaT": { type: "f", value: 0.0 },
        "uTime": { type: "f", value: 0.0 },
        "uInputPos": { type: "v3v", value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()] },
        "uInputPosFlag": { type: "v4", value: new THREE.Vector4(0,0,0,0) },
    },

    vertexShader: ShaderChunks.basic_vertex,

    fragmentShader: Utils.loadTextFile("js/src/shaders/SimShader.fs.glsl")

};