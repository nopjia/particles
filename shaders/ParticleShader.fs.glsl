#inject shaders/chunks/Constants.glsl


varying vec3 vColor;

uniform float uTime;
uniform float uAlpha;

void main() {

    // calc alpha for shape
    vec2 tmpCoord = 0.5 * cos(M_2PI*gl_PointCoord+M_PI) + 0.5;
    float alpha = tmpCoord.x * tmpCoord.y;

    gl_FragColor = vec4(vColor, uAlpha*alpha);
}