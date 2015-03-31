{
#define PROCESS_INPUT_POS(ACC, POS) if ((ACC) != 0.0) { vec3 toCenter = (POS)-currPos; float toCenterLength = length(toCenter); accel += (toCenter/toCenterLength) * (ACC)*uInputAccel/toCenterLength; }

PROCESS_INPUT_POS(uInputPosAccel.x, uInputPos[0]);
#ifdef MULTIPLE_INPUT
    PROCESS_INPUT_POS(uInputPosAccel.y, uInputPos[1]);
    PROCESS_INPUT_POS(uInputPosAccel.z, uInputPos[2]);
    PROCESS_INPUT_POS(uInputPosAccel.w, uInputPos[3]);
#endif
}