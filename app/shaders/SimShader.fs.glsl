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

void main() {

    // read data
    vec3 prevPos = texture2D(tPrev, vUv).rgb;
    vec3 currPos = texture2D(tCurr, vUv).rgb;
    vec3 vel = (currPos - prevPos) / uDeltaT;

    // CALC ACCEL

    vec3 accel = vec3(0.0);

    float portionHaveTarget = 0.8;

    // target shape
    if (vUv.y < portionHaveTarget) {
        // vec3 targetPos = vec3(
        //     coords.x,
        //     0.0,//sin(vUv.x*10.0)*sin(vUv.y*10.0),
        //     coords.y);

        // cylindrical coords
        float radius = vUv.y / portionHaveTarget;
        float theta = vUv.x * M_2PI;

        // outward spiral function
        radius *= M_PI;
        vec3 targetPos = vec3(
            radius * sin(theta),
            radius*radius * sin(4.0*theta + sin(3.0*M_PI*radius+uTime/2.0)) / 10.0,
            radius * cos(theta)
        );

        // vec2 coords = vUv;
        // coords.x = coords.x * M_2PI - M_PI; // theta (lat)
        // coords.y = coords.y * M_PI;         // phi (long)
        // vec3 sphereCoords = vec3(
        //     sin(coords.x) * cos(coords.y),
        //     cos(coords.x),
        //     sin(coords.x) * sin(coords.y)
        // );

        // float r = 0.5 + cos(coords.x);
        // // r += 0.5 * snoise(10.0*sphereCoords + 5.0*uTime);
        // vec3 targetPos = r * sphereCoords;
        // targetPos *= 2.0;

        vec3 toCenter = targetPos - currPos;
        float toCenterLength = length(toCenter);
        accel += K_TARGET_ACCEL * toCenter/toCenterLength;
    }

    // noise
    else {
        float noiseTime = uTime;
        accel += 0.05 * curlNoise(currPos);// + vec3(sin(noiseTime), cos(noiseTime), sin(noiseTime)*cos(noiseTime)));
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