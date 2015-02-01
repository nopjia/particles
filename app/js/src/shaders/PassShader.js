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
        "void main() {",
            "gl_FragColor = vec4(vUv.x, vUv.y, 0.0, 1.0);",
        "}",
    ].join("\n")

};