uniform sampler2D tPos;

void main() {
    gl_PointSize = POINT_SIZE;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(texture2D(tPos, position.xy).rgb, 1.0);
}