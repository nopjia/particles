var SimInitShader = {

    uniforms: {
        "tDiffuse": { type: "t", value: null },
        "uColor": { type: "f", value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) }
    },

    vertexShader: Utils.loadTextFile("js/src/shaders/Basic.vs.glsl"),

    fragmentShader: Utils.loadTextFile("js/src/shaders/SimInitShader.fs.glsl")

};