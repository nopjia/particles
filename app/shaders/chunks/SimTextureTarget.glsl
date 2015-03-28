{
#ifdef SIM_TEXTURE

#define K_NOISE_ACCEL 0.1
#define K_UV_OFFSET 0.02

// jitter uv
vec2 uvOffset = vec2(
    rand(vec2(vUv.x, vUv.y+uTime)),
    rand(vec2(vUv.x+uTime, vUv.y))
);

vec4 targetCol = texture2D(tTarget, vUv + uvOffset*K_UV_OFFSET);

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