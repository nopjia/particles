{
#ifdef SIM_TEXTURE

#define K_NOISE_ACCEL 0.1

vec4 targetCol = texture2D(tTarget, vUv);

if (targetCol.a > 0.0) {
    vec3 toTarget = targetCol.rgb - currPos;
    float toTargetLength = length(toTarget);
    if (!EQUALSZERO(toTargetLength))
        accel += uShapeAccel * toTarget/toTargetLength;
}
else {
    accel += K_NOISE_ACCEL * curlNoise(currPos);
}
#endif
}