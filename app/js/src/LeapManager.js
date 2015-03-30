var LeapManager = function(renderer, camera, transform) {
    var _renderer = renderer;
    var _camera = camera;
    var _tmat = transform;


    // PUBLIC

    this.followCamera = true;

    // read-only
    this.frame = undefined;
    this.palmPositions = [new THREE.Vector3(), new THREE.Vector3()];
    this.jointPositions = []; for (var i=0; i<50; i++) this.jointPositions.push(new THREE.Vector3());
    this.activeHandCount = 0;
    this.activeJointCount = 0;

    // FUNCTIONS

    this.update = function() {
        // update leapRoot transform
        if (this.followCamera)
            _root.matrix.multiplyMatrices(_camera.matrix, _tmat);
        else
            _root.matrix.copy(_tmat);
        _root.matrixWorldNeedsUpdate = true;

        this.frame = _controller.frame();

        // TODO_NOP: dangerous much? reset things to undefined
        this.palmPositions[0].set();
        this.palmPositions[1].set();
        for (var i=0; i<50; i++)
            this.jointPositions[i].set();

        this.activeHandCount = this.frame.hands.length;
        this.activeJointCount = this.activeHandCount * 25;

        // extract palm positions
        for (var h=0; h<this.frame.hands.length; h++) {
            var rawpos = this.frame.hands[h].palmPosition;
            this.palmPositions[h].set(rawpos[0],rawpos[1],rawpos[2]);
            this.palmPositions[h].applyMatrix4(_root.matrix);
        }

        // extract joint positions
        var jointIdx = 0;
        for (var h=0; h<this.frame.hands.length; h++) {
            var hand = this.frame.hands[h];
            for (var f=0; f<hand.fingers.length; f++) {
                var finger = hand.fingers[f];
                for (var j=0; j<finger.positions.length; j++) {
                    var rawpos = finger.positions[j];
                    this.jointPositions[jointIdx].set(rawpos[0],rawpos[1],rawpos[2]);
                    this.jointPositions[jointIdx].applyMatrix4(_root.matrix);
                    jointIdx++;
                }
            }
        }
    };

    this.render = function(renderTarget, forceClear) {
        _renderer.render(_scene, _camera, renderTarget, forceClear);
    };

    this.setCamera = function(camera) {
        _camera = camera;
    };

    this.setRenderer = function(renderer) {
        _renderer = renderer;
    };

    this.setTransform = function(mat) {
        _tmat = mat;
    };


    // INIT

    var _scene = new THREE.Scene();
    _scene.overrideMaterial = new THREE.MeshBasicMaterial({
        color: 0xffffff,
        opacity: 0.25,
    });

    var _root = new THREE.Object3D();
    _root.matrixAutoUpdate = false;
    _scene.add(_root);

    var _controller = new Leap.Controller();
    _controller.use('boneHand', {
        render: function() {},
        scene: _root,
        arm: false,
    }).connect();
};