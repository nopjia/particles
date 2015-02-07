// require:
// shaders/chunks/NoiseFuncs.glsl

#ifdef SIM_ROSE_GALAXY

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

#endif