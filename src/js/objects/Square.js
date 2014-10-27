var Square = (function(){

    function Square(params){
        THREE.Object3D.call(this);
        
        var geometry = new THREE.BoxGeometry(params.width, params.height, params.depth);
        var material = new THREE.MeshLambertMaterial({map : THREE.ImageUtils.loadTexture('./assets/img/shader-front.png')});
        this.mesh = new THREE.Mesh(geometry, material);
        this.add(this.mesh);
    }

    Square.prototype = new THREE.Object3D;
    Square.prototype.constructor = Square;

    Square.prototype.update = function() {
        this.mesh.rotation.y += 0.01;
        // this.mesh.rotation.y += 0.01;
    };

    return Square;
})();