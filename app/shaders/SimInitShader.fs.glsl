#inject shaders/chunks/Constants.glsl
#inject shaders/chunks/Rand.glsl


varying vec2 vUv;

uniform sampler2D tDiffuse;
uniform vec4 uColor;

void main() {
    // vec3 pos = vec3(vUv.x, vUv.y, rand(vUv));

    // square sheet
    // vec3 pos = vec3(vUv.x, vUv.y, 0.0);
    // vec3 center = vec3(0.0, 0.0, 0.0);
    // vec3 size = vec3(1.0, 1.0, 1.0);
    // pos = pos*size + center - size/2.0;

    // sphere, continuous along vUv.y
    // vec2 coords = vUv;
    // coords.x = coords.x * M_2PI - M_PI; // theta (lat)
    // coords.y = coords.y * M_PI;         // phi (long)
    // vec3 sphereCoords = vec3(
    //     sin(coords.y) * cos(coords.x),
    //     cos(coords.y),
    //     sin(coords.y) * sin(coords.x)
    // );
    // vec3 pos = sphereCoords * rand(vUv);

    // sphere coords, rand radius, offset y+0.5 for snoise vel
    vec2 coords = vUv;
    coords.x = coords.x * M_2PI - M_PI;
    coords.y = mod(coords.y+0.5, 1.0) * M_PI;
    vec3 sphereCoords = vec3(
        sin(coords.y) * cos(coords.x),
        cos(coords.y),
        sin(coords.y) * sin(coords.x)
    );
    vec3 pos = sphereCoords * rand(vUv);
    pos *= 5.0;

    gl_FragColor = vec4(pos, 1.0);
}