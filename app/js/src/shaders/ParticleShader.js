var ParticleShader = {

    uniforms: {
        "tPos": { type: "t", value: null },
        "uColor": { type: "v4", value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
        "uTime" : { type: "f", value: 0.0 },
    },

    vertexShader: Utils.loadTextFile("js/src/shaders/ParticleShader.vs.glsl"),

    fragmentShader: Utils.loadTextFile("js/src/shaders/ParticleShader.fs.glsl")

};