#define M_PI    3.14159265358979323846264338327950
#define M_2PI   6.28318530717958647692528676655900
#define M_PI2   1.57079632679489661923132169163975

varying vec3 vColor;

uniform vec4 uColor;
uniform float uTime;

void main() {

    // calc alpha for shape
    vec2 tmpCoord = 0.5 * cos(M_2PI*gl_PointCoord+M_PI) + 0.5;
    float alpha = tmpCoord.x * tmpCoord.y;

    gl_FragColor = uColor * vec4(vColor, alpha);
}