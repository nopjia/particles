//---------------------------------------------------------
// MACROS
//---------------------------------------------------------

#define M_PI    3.14159265358979323846264338327950
#define M_2PI   6.28318530717958647692528676655900
#define M_PI2   1.57079632679489661923132169163975

#define EQUALS(A,B) ( abs((A)-(B)) < EPS )
#define EQUALSZERO(A) ( ((A)<EPS) && ((A)>-EPS) )


//---------------------------------------------------------
// UTILS
//---------------------------------------------------------

// source: http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
float rand(vec2 seed) {
    return fract(sin(dot(seed.xy,vec2(12.9898,78.233))) * 43758.5453);
}

float snoise(vec2 v);
float snoise(vec3 v);
vec3 snoiseVec3(vec3 x);
vec3 curlNoise(vec3 p);


//---------------------------------------------------------
// PROGRAM
//---------------------------------------------------------

varying vec2 vUv;

uniform sampler2D tPrev;
uniform sampler2D tCurr;
uniform float uDeltaT;
uniform float uTime;
uniform vec3 uInputPos[4];
uniform vec4 uInputPosFlag;

void main() {

    // read data
    vec3 prevPos = texture2D(tPrev, vUv).rgb;
    vec3 currPos = texture2D(tCurr, vUv).rgb;
    vec3 vel = (currPos - prevPos) / uDeltaT;

    // CALC ACCEL

    vec3 accel = vec3(0.0);

    // target shape
    {
        // sphere, continuous along vUv.y
        vec2 coords = vUv;
        coords.x = coords.x * M_2PI - M_PI; // theta (lat)
        coords.y = coords.y * M_PI;         // phi (long)
        vec3 sphereCoords = vec3(
            sin(coords.y) * cos(coords.x),
            cos(coords.y),
            sin(coords.y) * sin(coords.x)
        );

        float r = 1.0;
        vec3 targetPos = r * sphereCoords;
        targetPos *= 2.0;

        vec3 toCenter = targetPos - currPos;
        float toCenterLength = length(toCenter);
        if (!EQUALSZERO(toCenterLength))
            accel += K_TARGET_ACCEL * toCenter/toCenterLength;
    }

    // input pos

    #define PROCESS_INPUT_POS(FLAG, POS) if ((FLAG) != 0.0) { vec3 toCenter = (POS)-currPos; float toCenterLength = length(toCenter); accel += (toCenter/toCenterLength) * (FLAG)*K_INPUT_ACCEL/toCenterLength; }

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