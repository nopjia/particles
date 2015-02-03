#define PS_CAM_MAX_DIST 12.0
#define PS_MAX_SIZE 20.0

uniform sampler2D tPos;

varying vec3 vPos;

void main() {
    vPos = position;

    vec4 posSample = texture2D(tPos, position.xy);
    vec3 pos = posSample.rgb;

    vec3 camToPos = pos - cameraPosition;
    float camDist = length(camToPos);

    // gl_PointSize = max(PS_MAX_SIZE*(1.0-camDist/PS_CAM_MAX_DIST), 1.0);
    gl_PointSize = max(3.0*PS_CAM_MAX_DIST/camDist, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}