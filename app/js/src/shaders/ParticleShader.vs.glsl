#define CAM_FOV 45.0

uniform sampler2D tPos;

varying vec3 vPos;

void main() {
    vPos = position;

    vec4 posSample = texture2D(tPos, position.xy);
    vec3 pos = posSample.rgb;

    vec3 camToPos = pos - cameraPosition;

    gl_PointSize = max(CAM_FOV / length(camToPos), 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}