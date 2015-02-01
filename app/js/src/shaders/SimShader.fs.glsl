#define K_VEL_DECAY 0.99
#define K_ACCEL 5.0

varying vec2 vUv;

uniform sampler2D tPrev;
uniform sampler2D tCurr;
uniform float uDeltaT;
uniform float uTime;

void main() {

    // read data
    vec3 prevPos = texture2D(tPrev, vUv).rgb;
    vec3 currPos = texture2D(tCurr, vUv).rgb;
    vec3 vel = (currPos - prevPos) / uDeltaT;

    // CALC FORCE

    // target shape
    vec3 targetPos = vec3(
        vUv.x,
        sin(vUv.x*10.0)*sin(vUv.y*10.0),
        vUv.y);
    vec3 targetCenter = vec3(0.0, 0.0, 0.0);
    vec3 targetSize = vec3(10.0, 1.0, 10.0);
    targetPos = targetPos*targetSize + targetCenter - targetSize/2.0;

    vec3 toCenter = targetPos - currPos;
    float toCenterLength = length(toCenter);
    vec3 accel = (toCenter/toCenterLength) * K_ACCEL * toCenterLength;

    // state updates
    vel = K_VEL_DECAY * vel + accel * uDeltaT;
    currPos += vel * uDeltaT;

    // write out
    gl_FragColor = vec4(currPos, 1.0);
}