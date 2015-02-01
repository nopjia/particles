var PassShader = {

    uniforms: {
        "tDiffuse": { type: "t", value: null },
        "uColor": { type: "f", value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) }
    },

    vertexShader: ShaderChunks.basic_vertex,

    fragmentShader: [
        "uniform sampler2D tDiffuse;",
        "uniform vec4 uColor;",
        "varying vec2 vUv;",
        ShaderChunks.rand,
        "void main() {",
            "vec3 col = vec3(0.0);",
            "col = vec3(vUv.x, vUv.y, rand(vUv));",
            "gl_FragColor = vec4(vec3(col), 1.0);",
        "}",
    ].join("\n")

};