// require:
// shaders/chunks/NoiseFuncs.glsl

#define K_NOISE_ACCEL 0.05

#ifdef SIM_ROSE_GALAXY

float portionHaveTarget = 0.8;

// target shape
if (vUv.y < portionHaveTarget) {

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

    vec3 toCenter = targetPos - currPos;
    float toCenterLength = length(toCenter);
    accel += uShapeAccel * toCenter/toCenterLength;
}

// noise
else {
    float noiseTime = uTime;
    accel += K_NOISE_ACCEL * curlNoise(currPos);// + vec3(sin(noiseTime), cos(noiseTime), sin(noiseTime)*cos(noiseTime)));
}

#endif

#ifdef SIM_NOISE
    //float noiseTime = uTime;
    accel += K_NOISE_ACCEL * curlNoise(currPos);
    // + vec3(sin(noiseTime), cos(noiseTime), sin(noiseTime)*cos(noiseTime)));
#endif