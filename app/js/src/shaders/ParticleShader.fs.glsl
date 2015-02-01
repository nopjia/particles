#define M_PI 3.1415926535897932

varying vec3 vPos;

uniform vec4 uColor;
uniform float uTime;

void main() {

    // calc color

    vec3 color = vec3(1.0, 0.6, 0.1);
    color += vec3( sin(uTime + vPos.z*2.0) );

    // calc alpha

    vec2 tmpCoord = 0.5 * cos(2.0*M_PI*gl_PointCoord+M_PI) + 0.5;
    float alpha = tmpCoord.x * tmpCoord.y;

    gl_FragColor = uColor * vec4(color, alpha);
}