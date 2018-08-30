var Mouse = function(dom) {
    var _this = this;

    this.buttons = [];
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.coords = new THREE.Vector2();

    var _mouseStructs = [];

    var MouseStruct = function MouseStruct() {
        this.x = 0;
        this.y = 0;
        this.dx = 0;
        this.dy = 0;
        this.coords = new THREE.Vector2();
        this.buttons = [];
    };


    // MOUSE

    var _mouseUpdate = function(e, idx) {
        var ms = _this.getMouse(idx || 0);

        ms.dx = e.pageX - ms.x;
        ms.dy = e.pageY - ms.y;
        ms.x = e.pageX;
        ms.y = e.pageY;

        ms.coords.x = ms.x / dom.clientWidth * 2 - 1;
        ms.coords.y = ms.y / dom.clientHeight * -2 + 1;
    };

    var _onMouseMove = function(e) {
        _mouseUpdate(e);
        // e.preventDefault();
    };

    var _onMouseDown = function(e) {
        _mouseUpdate(e);
        _this.getMouse().buttons[e.button] = true;
        // e.preventDefault();
    };

    var _onMouseUp = function(e) {
        _mouseUpdate(e);
        _this.getMouse().buttons[e.button] = false;
        // e.preventDefault();
    };


    // TOUCH

    var _onTouchMove = function(e) {
        var touches = e.changedTouches;
        for (var i=0; i<touches.length; i++) {
            _mouseUpdate(touches[i], touches[i].identifier);
        }
        e.preventDefault();
    };

    var _onTouchDown = function(e) {
        var touches = e.changedTouches;
        for (var i=0; i<touches.length; i++) {
            _mouseUpdate(touches[i], touches[i].identifier);
            _this.getMouse(touches[i].identifier).buttons[0] = true;
        }
        e.preventDefault();
    };

    var _onTouchUp = function(e) {
        var touches = e.changedTouches;
        for (var i=0; i<touches.length; i++) {
            _mouseUpdate(touches[i], touches[i].identifier);
            _this.getMouse(touches[i].identifier).buttons[0] = false;
        }
        e.preventDefault();
    };


    // PUBLIC FUNCTIONS

    this.getLength = function() {
        return _mouseStructs.length;
    };

    this.getMouse = function(idx) {
        idx = idx || 0;
        if (idx >= _mouseStructs.length)
            _mouseStructs[idx] = new MouseStruct();

        return _mouseStructs[idx];
    };


    // BIND EVENTS

    dom.addEventListener("mousemove", _onMouseMove, false);
    dom.addEventListener("mousedown", _onMouseDown, false);
    dom.addEventListener("mouseup", _onMouseUp, false);

    dom.addEventListener("touchmove", _onTouchMove, false);
    dom.addEventListener("touchstart", _onTouchDown, false);
    dom.addEventListener("touchend", _onTouchUp, false);
    dom.addEventListener("touchleave", _onTouchUp, false);
    dom.addEventListener("touchcancel", _onTouchUp, false);
};