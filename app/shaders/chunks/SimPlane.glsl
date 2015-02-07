#ifdef SIM_PLANE

{
    vec2 coords = vUv*2.0 - 1.0;
    vec3 targetPos = vec3(coords.x, 0.0, coords.y);
    targetPos *= 3.0;

    vec3 toCenter = targetPos - currPos;
    float toCenterLength = length(toCenter);
    if (!EQUALSZERO(toCenterLength))
        accel += uShapeAccel * toCenter/toCenterLength;
}

#endif