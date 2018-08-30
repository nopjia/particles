#ifdef SIM_ROSE_GALAXY
{
    // cylindrical coords
    float radius = vUv.y;
    float theta = vUv.x * M_2PI;

    // outward spiral function
    radius *= M_PI;
    vec3 targetPos = vec3(
        radius * sin(theta),
        radius*radius * sin(4.0*theta + sin(3.0*M_PI*radius+uTime/2.0)) / 10.0,
        radius * cos(theta)
    );

    vec3 toTarget = targetPos - currPos;
    float toTargetLength = length(toTarget);
    accel += uShapeAccel * toTarget/toTargetLength;
}
#endif