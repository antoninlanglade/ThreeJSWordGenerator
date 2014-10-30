var Webgl = (function(){
    
    function Webgl(width, height){
        var self = this;

        this.blocks = [];
        this.coords = [];
        
        this.size = {
            width : width,
            height : height
        };

        this.currentIndex = 0;
        this.sentence = null;
        
        this.boxSize = {
            width : 15,
            height : 15,
            depth : 15
        };

        this.box = {
            width : 5,
            height : 7
        };
        
        this.spaceLetter = 30;
        this.spaceLine = 20;
        
        this.colors = ['#27ae60','#2980b9','#e74c3c','#f1c40f'];
         
        this.init();
    };
    Webgl.prototype.init = function(){
        var self = this;

        $.get( "src/js/objects/letters.json", function( data ) {
            self.data = data;
            if(this.sentence != null){
                this.sentenceHandler(this.sentence);
            }
        });

        // Basic three.js setup
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(50, this.size.width / this.size.height, 1, 10000);
        this.camera.position.z = 1000;

        this.renderer = new THREE.WebGLRenderer({ antialias: true , alpha : true});
        this.renderer.setSize(this.size.width, this.size.height);
        
        // Ambiant light for texture on Boxes
        this.ambiantLight = new THREE.AmbientLight(0xFFFFFF);
        this.scene.add(this.ambiantLight);
        self.renderer.setClearColor(0x000000 , 0);

        // Change Color
        var colorIndex = 1;
        var $body = $('body');
        setInterval(function(){
            TweenMax.to($body, 0.5, {
                backgroundColor : self.colors[colorIndex],
                ease : Quad.easeOut
            });
            // self.renderer.setClearColor(self.colors[colorIndex] , 1);
            colorIndex<self.colors.length-1?colorIndex++:colorIndex=0;
        },2000);

    };
    Webgl.prototype.sentenceHandler = function(sentence){
        var self = this;
        var coords = [];

        this.arrayOfWords = sentence.split(' ');
        this.arrayOfChars = [];
        this.arrayOfWords.forEach(function(item){
            self.arrayOfChars.push(item.split(''));
        });

        var offset = {
            vertical : (self.arrayOfChars.length * (self.box.height * self.boxSize.height) + self.spaceLine * (self.arrayOfChars.length - 1)) /2,
            horizontal : 0
        };

        // Delete blank
        for(var i = 0; i < self.arrayOfChars.length; i++){
            if(self.arrayOfChars[i].length == 0){
                self.arrayOfChars.splice(i,1);
            }
        }

        self.arrayOfChars.forEach(function(item){
            var countWord = item.length;

            // Offset Horizontal of a block
            offset.horizontal = - (countWord * (self.box.width*self.boxSize.width) + countWord * self.spaceLetter) / 2;

            item.forEach(function(subitem){

                if(self.data[subitem]){

                    var verticalOffset = offset.vertical;

                    self.data[subitem].forEach(function(item){
                        var horizontalOffset = offset.horizontal;

                        item.forEach(function(item){

                            if(item == 1){
                                    // Create Coords of new points
                                    coords.push([horizontalOffset, verticalOffset]);
                            }
                            // Change Row Position into line
                            horizontalOffset += self.boxSize.width;
                        });
                        // Change line
                        verticalOffset -= self.boxSize.height ;
                    });
                }
                offset.horizontal += (self.box.width*self.boxSize.width) + self.spaceLetter;
            });

            // Offset Vertical of a line
            offset.vertical -= (self.box.height*self.boxSize.height) + self.spaceLine;
        });

        this.createBlock(coords);

    };
    Webgl.prototype.createBlock = function(coords){
        var self = this;

        var nblocks = 0;
        if (coords.length < self.blocks.length) {
            // Delete blocks
            var start = coords.length;
            var end = self.blocks.length - coords.length;

            for(var i = start; i < self.blocks.length; i++) {
                
                var position = self.getRandomPosition();

                TweenMax.to(self.blocks[i].position , 0.5, {
                    x : position.x, 
                    y : position.y
                });
                TweenMax.to(self.blocks[i].particleMaterial , 0.5, { 
                    opacity : 0,
                    ease : Expo.easeInOut, 
                    delay : i*0.0005,
                    onComplete : function(block){
                        self.scene.remove(block);        
                    }, onCompleteParams:[self.blocks[i]]
                });
            }
            
            self.blocks.splice(start, end);
        } else {
            // Add blocks
            var block,
                xRandom,
                yRandom;

            nblocks = coords.length - self.blocks.length;
            
            for (var i = 0; i < nblocks; i++) {
                block = new Square(self.boxSize);
                
                var position = self.getRandomPosition();

                block.position.x = position.x;
                block.position.y = position.y;
                block.position.z = 0;

                self.scene.add(block);
                self.blocks.push(block);
            };
        }

        self.coords = _.shuffle(coords);

        self.coords.forEach(function (coord, i) {
            var xSign = Math.floor((Math.random() * 2));
            var zSign = Math.floor((Math.random() * 2));
            TweenMax.to(self.blocks[i].position , 1.35, {
                bezier : [{ x : xSign==0?-(Math.random() * 2)*700:(Math.random() * 2)*700, y : 0 , z : zSign==0?-(Math.random() * 2)*700:(Math.random() * 2)*700},{ x : coord[0] , y : coord[1], z : 0}],
                ease : Quad.easeOut, 
                delay : i*0.0005
            });
            TweenMax.to(self.blocks[i].particleMaterial , 0.5, {
                opacity : 1,
                ease : Expo.easeInOut, 
                delay : i*0.0005
            });
        });
    };
    Webgl.prototype.getRandomPosition = function(){
        xRandom = Math.floor((Math.random() * 400));
        yRandom = Math.floor((Math.random() * 400));
        zRandom = Math.floor((Math.random() * 400));
        xSign = Math.floor((Math.random() * 2));
        ySign = Math.floor((Math.random() * 2));
        zSign = Math.floor((Math.random() * 2));

        return {
            x : xSign==0?-xRandom:xRandom,
            y : ySign==0?-yRandom:yRandom,
            z : ySign==0?-yRandom:zRandom
        };
    };
    Webgl.prototype.resize = function(width, height) {
        this.camera.aspect = width / height;
        this.camera.updateProjectionMatrix();
        this.renderer.setSize(width, height);
        
        this.size = {
            width : width,
            height : height
        };

    };
    Webgl.prototype.render = function() {    
        var self = this;
        this.renderer.render(this.scene, this.camera);
        if(self.blocks){
            self.blocks.forEach(function(item){
                var rotate = Math.floor((Math.random() * 2));
                item.update(rotate);
            });
        }
    };

    return Webgl;

})();