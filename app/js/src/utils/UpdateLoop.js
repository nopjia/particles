// TODO: timer sync issue between fixed and frame (?)

var UpdateLoop = function() {

    var _this = this;

    var _timer = 0.0;
    var _timeScale = 1.0;
    var _fixedTimer = 0.0;
    var _fixedTimeRemainder = 0.0;
    var _FIXED_TIME_STEP = 0.02;
    var _FIXED_TIME_STEP_MAX = 0.2;

    var _clock = new Clock(false);

    var _requestId;

    // PRIVATE FUNCTIONS

    var _fixedUpdate = function() {
        var fixedDt = _FIXED_TIME_STEP * _timeScale;

        _fixedTimer += fixedDt;

        _this.fixedCallback(fixedDt, _fixedTimer);
    };

    var _frameUpdate = function() {
        var frameDt = _clock.getDelta();

        _timer += frameDt * _timeScale;
        _fixedTimeRemainder += frameDt;

        // cap remainder
        if (_fixedTimeRemainder > _FIXED_TIME_STEP_MAX) {
            _fixedTimeRemainder = _FIXED_TIME_STEP_MAX;
        }

        // loop remainder
        while (_fixedTimeRemainder > _FIXED_TIME_STEP) {
            _fixedUpdate();
            _fixedTimeRemainder -= _FIXED_TIME_STEP;
        }

        _this.frameCallback(frameDt, _timer);
    };

    var _loop = function() {
        _frameUpdate();
        _requestId = window.requestAnimationFrame(_loop);
    };

    // PUBLIC FUNCTIONS

    this.start = function() {
        if (!_requestId) {
            _clock.start();
            _loop();
        }
    };

    this.stop = function() {
        if (_requestId) {
            window.cancelAnimationFrame(_requestId);
            _requestId = undefined;
            _clock.stop();
        }
    };

    this.setTimeScale = function(scale) {
        _timeScale = Math.max(scale, 0);
    };

    // EMPTY FUNCTIONS TO SET

    this.fixedCallback = function(dt, t) {};
    this.frameCallback = function(dt, t) {};

};

UpdateLoop.prototype.constructor = UpdateLoop;