var Square = (function(){

    function Square(params){
        THREE.Object3D.call(this);
        this.width = params.width;
        this.height = params.height;

        var geometry = new THREE.BoxGeometry(params.width, params.height, params.depth);
        var material = new THREE.MeshLambertMaterial({map : THREE.ImageUtils.loadTexture('./assets/img/shader-front.png')});
        this.mesh = new THREE.Mesh(geometry, material);

        // this.add(this.mesh);
        this.particleSystem();
    };

    Square.prototype = new THREE.Object3D;
    Square.prototype.constructor = Square;

    Square.prototype.particleSystem = function(){
        var self = this;

        var particles = 60,
         geometry = new THREE.BufferGeometry(),
         color = new THREE.Color(),
         positions = new Float32Array( particles * 3 ),
         colors = new Float32Array( particles * 3 );

        var n = self.width, n2 = n / 2; // The width and height Value of the cube

        for ( var i = 0; i < positions.length; i += 3 ) {

            // positions

            var x = Math.random() * n - n2;
            var y = Math.random() * n - n2;
            var z = Math.random() * n - n2;

            positions[ i ]     = x;
            positions[ i + 1 ] = y;
            positions[ i + 2 ] = z;

            // colors

            var vx = ( x / n ) + 0.5;
            var vy = ( y / n ) + 0.5;
            var vz = ( z / n ) + 0.5;

            color.setRGB( vx, vy, vz );

            colors[ i ]     = color.r;
            colors[ i + 1 ] = color.g;
            colors[ i + 2 ] = color.b;

        }

        geometry.addAttribute( 'position', new THREE.BufferAttribute( positions, 3 ) );
        geometry.addAttribute( 'color', new THREE.BufferAttribute( colors, 3 ) );

        geometry.computeBoundingSphere();

        this.particleMaterial = new THREE.PointCloudMaterial( { size: 3, vertexColors: THREE.VertexColors } );

        this.particleMaterial.needsUpdate = true;
        this.particleMaterial.transparent = true;
        this.particleMaterial.opacity = 0;

        particleSystem = new THREE.PointCloud( geometry, this.particleMaterial );
        self.add(particleSystem);
    };

    Square.prototype.update = function(rotate) {
        if(rotate == 0){
            this.rotation.x += 0.01;    
        }
        else if(rotate == 1){
            this.rotation.y += 0.01;    
        }
        // this.mesh.rotation.y += 0.01;
    };

    return Square;
})();