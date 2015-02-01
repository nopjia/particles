varying vec3 vPos;

uniform vec4 uColor;
uniform float uTime;

void main() {

    // calc color

    vec3 color = vec3(1.0, 0.6, 0.1);
    color += vec3( sin(uTime + vPos.z*2.0) );

    // calc alpha

    float alpha = 4.0 *
        (gl_PointCoord.x < 0.5 ? gl_PointCoord.x : 1.0-gl_PointCoord.x) *
        (gl_PointCoord.y < 0.5 ? gl_PointCoord.y : 1.0-gl_PointCoord.y);

    gl_FragColor = uColor * vec4(color, alpha);
}