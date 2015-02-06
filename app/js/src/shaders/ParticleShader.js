var ParticleShader = {

    uniforms: {
        "tPos": { type: "t", value: null },
        "uColor": { type: "v4", value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
        "uTime" : { type: "f", value: 0.0 },
    },

    vertexShader: Utils.loadTextFile(
        Utils.isMobile ?
        "js/src/shaders/ParticleShaderMobile.vs.glsl" :
        "js/src/shaders/ParticleShader.vs.glsl"
    ),

    fragmentShader: Utils.loadTextFile(
        Utils.isMobile ?
        "js/src/shaders/ParticleShaderMobile.fs.glsl" :
        "js/src/shaders/ParticleShader.fs.glsl"
    )

};