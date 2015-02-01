var ShaderChunks = {

    basic_vertex: [
        "varying vec2 vUv;",
        "void main() {",
            "vUv = uv;",
            "gl_Position = projectionMatrix * modelViewMatrix * vec4( position, 1.0 );",
        "}"
    ].join("\n"),

    rand: [
        "float rand(vec2 seed) {",
            "return fract(sin(dot(seed.xy,vec2(12.9898,78.233))) * 43758.5453);",
        "}",
    ].join("\n"),

};