var BasicParticleShader = {

    defines: {
        "POINT_SIZE": "1.0"
    },

    uniforms: {
        "tPos": { type: "t", value: null },
        "uColor": { type: "v4", value: new THREE.Vector4(1.0, 0.6, 0.1, 0.2) },
        "uTime" : { type: "f", value: 0.0 },
    },

    vertexShader: Utils.loadTextFile(
        "js/src/shaders/BasicParticleShader.vs.glsl"
    ),

    fragmentShader: Utils.loadTextFile(
        "js/src/shaders/BasicParticleShader.fs.glsl"
    )

};