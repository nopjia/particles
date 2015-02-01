var ParticleShader = {

    uniforms: {
        "tPos": { type: "t", value: null },
        "uColor": { type: "v4", value: new THREE.Vector4(1.0, 1.0, 1.0, 1.0) },
    },

    vertexShader: [
        //"uniform sampler2D tPos;",
        "varying vec3 vPos;",
        "void main() {",
            "vPos = position;",
            // "vec3 pos = texture2D(tPos, position.xy).xyz;",
            "gl_PointSize = 5.0;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
    ].join("\n"),

    fragmentShader: [
        "uniform sampler2D tPos;",
        "uniform vec4 uColor;",
        "varying vec3 vPos;",
        "void main() {",
            "gl_FragColor = uColor * texture2D(tPos, vPos.xy);",
            // "gl_FragColor = vec4(vPos.x, vPos.y, 0.0, 1.0);",
        "}",
    ].join("\n")

};