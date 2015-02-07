#inject shaders/chunks/Constants.glsl

#define PS_CAM_MAX_DIST 12.0

varying vec3 vColor;

uniform sampler2D tPos;
uniform float uTime;
uniform float uPointSize;
uniform vec3 uColor1;
uniform vec3 uColor2;
uniform float uColorFreq;
uniform float uColorSpeed;

void main() {
    vColor = mix(uColor1, uColor2, sin(uColorSpeed*uTime + uColorFreq*position.z*M_2PI)/2.0+0.5);

    vec4 posSample = texture2D(tPos, position.xy);
    vec3 pos = posSample.rgb;

    vec3 camToPos = pos - cameraPosition;
    float camDist = length(camToPos);

    gl_PointSize = max(uPointSize * PS_CAM_MAX_DIST/camDist, 1.0);

    gl_Position = projectionMatrix * modelViewMatrix * vec4(pos, 1.0);
}