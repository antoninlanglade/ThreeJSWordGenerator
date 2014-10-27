var Webgl = (function(){
    
    function Webgl(width, height){
        var self = this;
        
        this.word = 'abc';
        this.letterBlocks = [];
        this.arrayOfChars = this.word.split('');
        console.log(this.arrayOfChars);
        
        this.boxSize = {
            width : 20,
            height : 20,
            depth : 20
        };
        
        this.getJSON(function(){
            self.createBlock('b',function(){

            });

        });
        
        this.colors = [0x27ae60,0x2980b9,0xe74c3c,0xf1c40f];
        
        // Basic three.js setup
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(50, width / height, 1, 10000);
        this.camera.position.z = 500;
        
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(width, height);
        
        
        
        this.ambiantLight = new THREE.AmbientLight(0xFFFFFF);
        this.scene.add(this.ambiantLight);
        self.renderer.setClearColor(0x27ae60 , 1);
        setInterval(function(){
            var color = self.colors[Math.floor((Math.random() * 3))];
            self.renderer.setClearColor(color , 1);
        },1000);
    }
    Webgl.prototype.getJSON = function(callback){
        var self = this;
        $.get( "src/js/objects/letters.json", function( data ) {
          self.data = data;
          callback.call(self);
        });
    };

    Webgl.prototype.createBlock = function(letter, callback){
        var self = this;
        if(self.data[letter]){
            var blocks = [];
            console.log('existing letter');
            var verticalOffset = 200;
            self.data[letter].forEach(function(item){
                var horizontalOffset = -200;

                item.forEach(function(item){

                    if(item == 1){

                        // Add object
                        var block = new Square(self.boxSize);
                        block.position.set(horizontalOffset, verticalOffset, 0);
                        self.scene.add(block);
                        blocks.push(block);
                    }
                    // Change Row Position into line
                    horizontalOffset += self.boxSize.width ;
                });

                // Change line
                verticalOffset -= self.boxSize.height ;
            });
            self.letterBlocks.push(blocks);
            console.log(self.letterBlocks);
        }
        callback.call(self);
        
    };

    Webgl.prototype.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
    };

    Webgl.prototype.render = function() {    
        var self = this;
        this.renderer.render(this.scene, this.camera);
        self.letterBlocks.forEach(function(item){
            item.forEach(function(item){
                item.update();
            });
        });

    };

    return Webgl;

})();