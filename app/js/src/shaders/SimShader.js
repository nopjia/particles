var SimShader = {

    defines: {
        "M_PI":  "3.14159265358979323846264338327950",
        "M_2PI": "6.28318530717958647692528676655900",
        "M_PI2": "1.57079632679489661923132169163975",
        "EPS":   "0.0001",

        "EQUALS(A,B)": "( abs((A)-(B)) < EPS )",
        "EQUALSZERO(A)": "( ((A)<EPS) && ((A)>-EPS) )",

        "MULTIPLE_INPUT": Utils.isMobile ? "" : undefined,
        "K_VEL_DECAY": "0.99",
        "K_INPUT_ACCEL": "2.0",
        "K_TARGET_ACCEL": "0.2"
    },

    uniforms: {
        "tPrev": { type: "t", value: null },
        "tCurr": { type: "t", value: null },
        "uDeltaT": { type: "f", value: 0.0 },
        "uTime": { type: "f", value: 0.0 },
        "uInputPos": { type: "v3v", value: [new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3(), new THREE.Vector3()] },
        "uInputPosFlag": { type: "v4", value: new THREE.Vector4(0,0,0,0) },
    },

    vertexShader: Utils.loadTextFile("js/src/shaders/Basic.vs.glsl"),

    fragmentShader: Utils.loadTextFile(
        "js/src/shaders/SimShader.fs.glsl"
    )

};

var BasicSimShader = {
    defines: SimShader.defines,
    uniforms: SimShader.uniforms,
    vertexShader: SimShader.vertexShader,
    fragmentShader: Utils.loadTextFile(
        "js/src/shaders/BasicSimShader.fs.glsl"
    )
};

var SphereSimShader = {
    defines: SimShader.defines,
    uniforms: SimShader.uniforms,
    vertexShader: SimShader.vertexShader,
    fragmentShader: Utils.loadTextFile(
        "js/src/shaders/SphereSimShader.fs.glsl"
    )
};