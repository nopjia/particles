var MapRasterizer = function() {

    var _data, _size;

    function _getDataIndex(x, y) {
        return (x + y*_size) * 4;
    }

    function _setData(x, y, r, g, b, a) {
        var idx = (x + y*_size) * 4;
        _data[idx    ] = r;
        _data[idx + 1] = g;
        _data[idx + 2] = b;
        _data[idx + 3] = a;
    }

    var _fillScanLine = function(x1, x2, y) {
        // swap order if necessary
        if (x1 > x2) {
            var tmpX = x1;
            x1 = x2;
            x2 = tmpX;
        }
        for (var x=x1; x<=x2; x++) {
            _setData(x, y, 1.0, 0.0, 0.0, 1.0);     // TODO_NOP: check int rounding
        }
        _setData(x1, y, 1.0, 1.0, 1.0, 1.0);
        _setData(x2, y, 1.0, 1.0, 1.0, 1.0);
    };

    var _fillFlatTriangle = function(v1, v2, v3) {
        var invslope1 = (v2.x - v1.x) / (v2.y - v1.y);
        var invslope2 = (v3.x - v1.x) / (v3.y - v1.y);

        var curx1 = v1.x;
        var curx2 = v1.x;

        for (var scanlineY = v1.y; scanlineY <= v2.y; scanlineY++) {
            _fillScanLine(Math.round(curx1), Math.round(curx2), scanlineY);
            curx1 += invslope1;
            curx2 += invslope2;
        }
    };

    var _fillTriangle = function(v1, v2, v3) {

        // sort verts by y
        var tmpV;
        if (v1.y < v2.y) {
            if (v3.y < v1.y)    { tmpV=v1; v1=v3; v3=tmpV; }
        } else {
            if (v2.y < v3.y)    { tmpV=v1; v1=v2; v2=tmpV; }
            else                { tmpV=v1; v1=v3; v3=tmpV; }
        }
        if (v3.y < v2.y)        { tmpV=v2; v2=v3; v3=tmpV; }

        if (v2.y === v3.y) {
            _fillFlatTriangle(v1, v2, v3);
        }
        else if (v1.y === v2.y) {
            _fillFlatTriangle(v3, v2, v1);
        }
        else {
            var v4 = new THREE.Vector2((v1.x + ((v2.y - v1.y) / (v3.y - v1.y)) * (v3.x - v1.x)), v2.y);
            _fillFlatTriangle(v1, v2, v4);
            _fillFlatTriangle(v3, v2, v4);
        }
    };


    this.parse = function(geo, size) {
        if (!geo || !size) return;
        if (!geo.attributes.uv) {
            console.log("ERROR: geometry has no UV");
            return;
        }

        var data = new Float32Array(size*size*4);
        _data = data;
        _size = size;

        // test
        // for (var i=0; i<size; i++) for (var j=0; j<size; j++) {
        //     _setData(i, j, i/size, j/size, Math.random(), 1);
        // }

        var vertCount = geo.attributes.position.array.length / 3;
        var triCount = vertCount / 3;
        var posArray = geo.attributes.position.array;
        var uvArray = geo.attributes.uv.array;

        function getPos(vertIdx) {
            return new THREE.Vector3(
                posArray[vertIdx*3]
            );
        }

        for (var i=0; i<triCount; i++) {
            var vertIdx = i*3;
            var pos1 = new THREE.Vector3(posArray[vertIdx*3], posArray[vertIdx*3+1], posArray[vertIdx*3+2]);
            var uv1  = new THREE.Vector2(Math.floor(uvArray[vertIdx*3]*size), Math.floor(uvArray[vertIdx*3+1]*size));
            vertIdx++;
            var pos2 = new THREE.Vector3(posArray[vertIdx*3], posArray[vertIdx*3+1], posArray[vertIdx*3+2]);
            var uv2  = new THREE.Vector2(Math.floor(uvArray[vertIdx*3]*size), Math.floor(uvArray[vertIdx*3+1]*size));
            vertIdx++;
            var pos3 = new THREE.Vector3(posArray[vertIdx*3], posArray[vertIdx*3+1], posArray[vertIdx*3+2]);
            var uv3  = new THREE.Vector2(Math.floor(uvArray[vertIdx*3]*size), Math.floor(uvArray[vertIdx*3+1]*size));

            _fillTriangle(uv1, uv2, uv3);
        }

        return {
            data: data,
            size: size
        };
    };


};