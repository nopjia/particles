varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform vec4 uColor;

// source: http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
float rand(vec2 seed) {
    return fract(sin(dot(seed.xy,vec2(12.9898,78.233))) * 43758.5453);
}

void main() {
    // vec3 pos = vec3(vUv.x, vUv.y, rand(vUv));
    vec3 pos = vec3(vUv.x, vUv.y, 0.0);

    // transform
    vec3 center = vec3(0.0, 0.0, 0.0);
    vec3 size = vec3(1.0, 1.0, 1.0);
    pos = pos*size + center - size/2.0;

    gl_FragColor = vec4(vec3(pos), 1.0);
}