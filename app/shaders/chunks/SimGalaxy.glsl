// require:
// shaders/chunks/NoiseFuncs.glsl

#define K_NUM_ARMS 7.0
#define K_HEIGHT 1.0
#define K_SPIN_SPEED 0.25

#define K_NOISE_ACCEL 0.1

#ifdef SIM_GALAXY

// cylindrical coords
float radius = vUv.y;
float theta = vUv.x * M_2PI;

float randVal = rand(vec2(theta, radius));

// jitter coords
radius += randVal * 0.5;
theta += randVal * 0.5;

float radialArms = sin(K_NUM_ARMS * theta);

float heightParam = K_HEIGHT                              // height constant
                  * (rand(vec2(radius, theta))/2.0-0.5)   // provide unit thickness with rand
                  * cos(radius*M_PI/2.0);                 // taper along radius using cosine curve

float spinParam = theta                   // angle parameter
                + radius*radius           // twist at rate r^2
                - K_SPIN_SPEED * uTime;   // spin at constant speed

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