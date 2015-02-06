uniform sampler2D tPos;
uniform float uTime;

varying vec4 vColor;

void main() {
    vColor = vec4(1.0, 0.6, 0.1, 1.0);
    vColor.b += sin(uTime*2.0 + position.z*4.0) / 2.0 + 0.5;

    gl_PointSize = 5.0;

    gl_Position = projectionMatrix * modelViewMatrix * vec4(texture2D(tPos, position.xy).rgb, 1.0);
}