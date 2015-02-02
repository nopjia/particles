var SimShader = {

    uniforms: {
        "tPrev": { type: "t", value: null },
        "tCurr": { type: "t", value: null },
        "uDeltaT": { type: "f", value: 0.0 },
        "uTime": { type: "f", value: 0.0 },
        "uInputPos": { type: "v3", value: new THREE.Vector3(0,0,0) },
        "uInputPosEnabled": { type: "i", value: 0 },
    },

    vertexShader: ShaderChunks.basic_vertex,

    fragmentShader: Utils.loadTextFile("js/src/shaders/SimShader.fs.glsl")

};