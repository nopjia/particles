varying vec2 vUv;

uniform sampler2D tPrev;
uniform sampler2D tCurr;
uniform float uDeltaT;
uniform float uTime;
uniform vec3 uInputPos[4];
uniform vec4 uInputPosAccel;

void main() {

    // read data
    vec3 prevPos = texture2D(tPrev, vUv).rgb;
    vec3 currPos = texture2D(tCurr, vUv).rgb;
    vec3 vel = (currPos - prevPos) / uDeltaT;

    // CALC ACCEL

    vec3 accel = vec3(0.0);

    // input pos
    #inject shaders/chunks/SimInputPos.glsl

    // state updates
    vel = K_VEL_DECAY * vel + accel * uDeltaT;
    currPos += vel * uDeltaT;

    // write out
    gl_FragColor = vec4(currPos, 1.0);
}