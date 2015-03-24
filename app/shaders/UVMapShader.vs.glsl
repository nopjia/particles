varying vec3 vPos;

#ifdef USE_MORPHTARGETS
    uniform float morphTargetInfluences[ 4 ];
#endif

void main() {

#ifdef USE_MORPHTARGETS
    vec3 morphed = vec3( 0.0 );
    morphed += ( morphTarget0 - position ) * morphTargetInfluences[ 0 ];
    morphed += ( morphTarget1 - position ) * morphTargetInfluences[ 1 ];
    morphed += ( morphTarget2 - position ) * morphTargetInfluences[ 2 ];
    morphed += ( morphTarget3 - position ) * morphTargetInfluences[ 3 ];
    morphed += position;

    vPos = (modelMatrix * vec4(morphed, 1.0)).xyz;
#else
    vPos = (modelMatrix * vec4(position, 1.0)).xyz;
#endif

    vec2 drawUV = uv * 2.0 - 1.0;
    gl_Position = vec4(drawUV.x, drawUV.y, 0.0, 1.0);
}