// source: http://stackoverflow.com/questions/4200224/random-noise-functions-for-glsl
float rand(vec2 seed) {
    return fract(sin(dot(seed.xy,vec2(12.9898,78.233))) * 43758.5453);
}
