{
#ifdef SIM_GALAXY

#define K_NUM_ARMS 7.0
#define K_HEIGHT 0.5
#define K_SPIN_SPEED 0.25

#define K_NOISE_ACCEL 0.1

// cylindrical coords
float radius = vUv.y;
float theta = vUv.x * M_2PI;

float randVal = rand(vec2(theta, radius));

// jitter coords
radius += randVal * 0.5;
theta += randVal * 0.5;

float radialArms = sin(K_NUM_ARMS * theta);

float taperComponent = cos(0.6*radius*M_PI/2.0);
taperComponent *= taperComponent;
float heightParam = K_HEIGHT                              // height constant
                  * (rand(vec2(radius, theta))-0.5)   // provide unit thickness with rand
                  * taperComponent;                 // taper along radius using cosine curve

float spinParam = theta                   // angle parameter
                + radius*radius           // twist at rate r^2
                - K_SPIN_SPEED * uTime;   // spin at constant speed

vec3 targetPos = vec3(
    radius * sin(spinParam),
    heightParam,
    radius * cos(spinParam)
);
targetPos *= 3.0;

vec3 toTarget = targetPos - currPos;
float toTargetLength = length(toTarget);
accel += uShapeAccel * toTarget/toTargetLength
    * (radialArms/2.0+0.5)  // gravity stronger in arms
    * randVal;    // randomize gravity prevents banding


// noise
float noiseTime = uTime;
accel += K_NOISE_ACCEL * curlNoise(currPos);// + vec3(sin(noiseTime), cos(noiseTime), sin(noiseTime)*cos(noiseTime)));

#endif
}