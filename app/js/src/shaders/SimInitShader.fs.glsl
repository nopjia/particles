#define M_PI    3.14159265358979323846264338327950
#define M_2PI   6.28318530717958647692528676655900
#define M_PI2   1.57079632679489661923132169163975

varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform vec4 uColor;

// source: http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
float rand(vec2 seed) {
    return fract(sin(dot(seed.xy,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    // vec3 pos = vec3(vUv.x, vUv.y, rand(vUv));

    // square sheet
    // vec3 pos = vec3(vUv.x, vUv.y, 0.0);
    // vec3 center = vec3(0.0, 0.0, 0.0);
    // vec3 size = vec3(1.0, 1.0, 1.0);
    // pos = pos*size + center - size/2.0;

    // sphere, continuous along vUv.y
    vec2 coords = vUv;
    coords.x = coords.x * M_2PI - M_PI; // theta (lat)
    coords.y = coords.y * M_PI;         // phi (long)
    vec3 sphereCoords = vec3(
        sin(coords.y) * cos(coords.x),
        cos(coords.y),
        sin(coords.y) * sin(coords.x)
    );
    vec3 pos = sphereCoords;

    gl_FragColor = vec4(vec3(pos), 1.0);
}