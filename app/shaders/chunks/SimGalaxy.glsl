// require:
// shaders/chunks/NoiseFuncs.glsl

#define K_NOISE_ACCEL 0.1

#ifdef SIM_GALAXY

// cylindrical coords
float radius = vUv.y;
float theta = vUv.x * M_2PI;

float randVal = rand(vec2(theta, radius));

// jitter coords
radius += randVal * 0.5;
theta += randVal * 0.5;

float unitThickness = (rand(vec2(radius, theta))-0.5);
float radialTaper = cos(radius*M_PI/2.0);
float radialArms = sin(5.0*theta);
float heightParam = 0.5 * unitThickness * radialTaper;

float spinParam = theta + radius*radius - uTime/4.0;

vec3 targetPos = vec3(
    radius * sin(spinParam),
    heightParam,
    radius * cos(spinParam)
);
targetPos *= 4.0;

vec3 toCenter = targetPos - currPos;
float toCenterLength = length(toCenter);
accel += uShapeAccel * toCenter/toCenterLength
    * (radialArms/2.0+0.5)  // gravity stronger in arms
    * randVal;    // randomize gravity prevents banding


// noise
float noiseTime = uTime;
accel += K_NOISE_ACCEL * curlNoise(currPos);// + vec3(sin(noiseTime), cos(noiseTime), sin(noiseTime)*cos(noiseTime)));

#endif