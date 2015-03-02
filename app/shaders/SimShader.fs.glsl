#inject shaders/chunks/Constants.glsl
#inject shaders/chunks/Rand.glsl
#inject shaders/chunks/NoiseFuncs.glsl


varying vec2 vUv;

uniform sampler2D tPrev;
uniform sampler2D tCurr;
uniform float uDeltaT;
uniform float uTime;
uniform vec3 uInputPos[4];
uniform vec4 uInputPosFlag;
uniform float uInputAccel;
uniform float uShapeAccel;

#ifdef SIM_TEXTURE
uniform sampler2D tTarget;
#endif

void main() {

    // read data
    vec3 prevPos = texture2D(tPrev, vUv).rgb;
    vec3 currPos = texture2D(tCurr, vUv).rgb;
    vec3 vel = (currPos - prevPos) / uDeltaT;

    // CALC ACCEL

    vec3 accel = vec3(0.0);

    #inject shaders/chunks/SimBasicShapes.glsl
    #inject shaders/chunks/SimRoseGalaxy.glsl
    #inject shaders/chunks/SimGalaxy.glsl
    #inject shaders/chunks/SimTextureTarget.glsl

    // input pos

    #define PROCESS_INPUT_POS(FLAG, POS) if ((FLAG) != 0.0) { vec3 toCenter = (POS)-currPos; float toCenterLength = length(toCenter); accel += (toCenter/toCenterLength) * (FLAG)*uInputAccel/toCenterLength; }

    PROCESS_INPUT_POS(uInputPosFlag.x, uInputPos[0]);
    #ifdef MULTIPLE_INPUT
        PROCESS_INPUT_POS(uInputPosFlag.y, uInputPos[1]);
        PROCESS_INPUT_POS(uInputPosFlag.z, uInputPos[2]);
        PROCESS_INPUT_POS(uInputPosFlag.w, uInputPos[3]);
    #endif

    // state updates
    vel = K_VEL_DECAY * vel + accel * uDeltaT;
    currPos += vel * uDeltaT;

    // write out
    gl_FragColor = vec4(currPos, 1.0);
}