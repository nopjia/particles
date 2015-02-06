uniform sampler2D tPos;

void main() {
    gl_PointSize = 5.0;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(texture2D(tPos, position.xy).rgb, 1.0);
}