var ParticleShader = {

    uniforms: {
        "tPos": { type: "t", value: null },
        "uColor": { type: "v4", value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
    },

    vertexShader: [
        "uniform sampler2D tPos;",
        "varying vec3 vPos;",
        "void main() {",
            "vPos = position;",
            "vec3 pos = texture2D(tPos, position.xy).xyz;",
            "gl_PointSize = 3.0;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( pos, 1.0 );",
        "}"
    ].join("\n"),

    fragmentShader: [
        "uniform vec4 uColor;",
        "varying vec3 vPos;",
        "void main() {",
            "gl_FragColor = uColor * vec4(0.0, 0.0, vPos.z, 1.0);",
        "}",
    ].join("\n")

};