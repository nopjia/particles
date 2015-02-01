var ParticleShader = {

    uniforms: {
        "tPos": { type: "t", value: null },
        "uColor": { type: "v4", value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
    },

    vertexShader: [
        "uniform sampler2D tPos;",
        "void main() {",
            "vec4 pos = texture2D(tPos, position.xy);",
            "gl_PointSize = 3.0;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( pos.xyz, 1.0 );",
        "}"
    ].join("\n"),

    fragmentShader: [
        "uniform vec4 uColor;",
        "void main() {",
            "gl_FragColor = uColor;",
        "}",
    ].join("\n")

};