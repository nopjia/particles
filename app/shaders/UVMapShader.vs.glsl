varying vec3 vPos;

void main() {
    vPos = position;
    vec2 drawUV = uv * 2.0 - 1.0;
    gl_Position = vec4(drawUV.x, drawUV.y, 0.0, 1.0);
}