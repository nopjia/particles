var SimDebugShader = {

    uniforms: {
        "tTarget1": { type: "t", value: null },
        "tTarget2": { type: "t", value: null },
        "tTarget3": { type: "t", value: null },
    },

    vertexShader: Utils.loadTextFile("shaders/Basic.vs.glsl"),

    fragmentShader: [
        "varying vec2 vUv;",
        "uniform sampler2D tTarget1;",
        "uniform sampler2D tTarget2;",
        "uniform sampler2D tTarget3;",
        "void main() {",
            "if (vUv.x < 0.33) {",
                "gl_FragColor = texture2D(tTarget1, vec2(vUv.x/0.33, vUv.y));",
            "}",
            "else if (vUv.x < 0.66) {",
                "gl_FragColor = texture2D(tTarget2, vec2((vUv.x-0.33) * 3.0, vUv.y));",
            "}",
            "else {",
                "gl_FragColor = texture2D(tTarget3, vec2((vUv.x-0.66) * 3.0, vUv.y));",
            "}",
        "}",
    ].join("\n")

};