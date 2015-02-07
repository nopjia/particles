#ifdef SIM_SPHERE

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
        accel += uShapeAccel * toCenter/toCenterLength;
}

#endif