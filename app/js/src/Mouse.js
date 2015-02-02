var Mouse = function() {
    var _this = this;

    this.buttons = [];
    this.x = 0;
    this.y = 0;
    this.dx = 0;
    this.dy = 0;
    this.coords = new THREE.Vector2();

    var _mouseUpdate = function() {
        _this.dx = event.pageX - _this.x;
        _this.dy = event.pageY - _this.y;
        _this.x = event.pageX;
        _this.y = event.pageY;

        _this.coords.x = _this.x / window.innerWidth * 2 - 1;
        _this.coords.y = _this.y / window.innerHeight * -2 + 1;
    };

    var _onMouseMove = function(e) {
        _mouseUpdate();
        event.preventDefault();
    };

    var _onMouseDown = function(e) {
        _mouseUpdate();
        _this.buttons[event.button] = true;
        event.preventDefault();
    };

    var _onMouseUp = function(e) {
        _mouseUpdate();
        _this.buttons[event.button] = false;
        event.preventDefault();
    };

    window.addEventListener("mousemove", _onMouseMove, false);
    window.addEventListener("mousedown", _onMouseDown, false);
    window.addEventListener("mouseup", _onMouseUp, false);
};