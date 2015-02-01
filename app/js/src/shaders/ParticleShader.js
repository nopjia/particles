var ParticleShader = {

    uniforms: {
        "tPos": { type: "t", value: null },
        "uColor": { type: "v4", value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
    },

    vertexShader: [
        "uniform sampler2D tPos;",
        "void main() {",
            "gl_PointSize = 1.0;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( texture2D(tPos, position.xy).rgb, 1.0 );",
        "}"
    ].join("\n"),

    fragmentShader: [
        "uniform vec4 uColor;",
        "void main() {",
            "gl_FragColor = uColor;",
        "}",
    ].join("\n")

};