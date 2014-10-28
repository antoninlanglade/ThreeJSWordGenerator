var Webgl = (function(){
    
    function Webgl(width, height){
        var self = this;

        this.blocks = [];
        this.coords = [];
        
        this.size = {
            width : width,
            height : height
        };
        this.firstTime = true;

        this.currentIndex = 0;
        this.sentence = null;
        
        this.boxSize = {
            width : 15,
            height : 15,
            depth : 15
        };
        this.spaceLetter = 30;
        this.spaceLine = 20;
        this.box = {
            width : 5,
            height : 7
        };

        this.getJSON(function(){
            if(this.sentence != null){
                this.sentenceHandler(this.sentence);
            }
        });
        
        this.colors = [0x27ae60,0x2980b9,0xe74c3c,0xf1c40f];
        
        // Basic three.js setup
        this.scene = new THREE.Scene();
        
        this.camera = new THREE.PerspectiveCamera(50, this.size.width / this.size.height, 1, 10000);
        this.camera.position.z = 1000;

        this.renderer = new THREE.WebGLRenderer({ antialias: true });
        this.renderer.setSize(width, height);
        
        // Ambiant light for texture on Boxes
        this.ambiantLight = new THREE.AmbientLight(0xFFFFFF);
        this.scene.add(this.ambiantLight);
        self.renderer.setClearColor(0x27ae60 , 1);

        // Change Color
        var colorIndex = 0;
        setInterval(function(){
            self.renderer.setClearColor(self.colors[colorIndex] , 1);
            colorIndex<self.colors.length?colorIndex++:colorIndex=0;
        },2000);
    };
    Webgl.prototype.getJSON = function(callback){
        var self = this;
        $.get( "src/js/objects/letters.json", function( data ) {
          self.data = data;
          callback.call(self);
        });
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

                    // if(self.firstTime == false){
                    //     console.log(self.letterBlocks);

                    // }

                    self.data[subitem].forEach(function(item){
                        var horizontalOffset = offset.horizontal;

                        item.forEach(function(item){

                            if(item == 1){
                                // if(self.firstTime == false) {
                                //     // Reorder Object
                                //     self.reorderBlocks(horizontalOffset, verticalOffset)
                                // }
                                // else{
                                    // Create object
                                    coords.push([horizontalOffset, verticalOffset]);
                                // }
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


        // Return [[ligne, colonne], [ligne, colonne], .....]
        // Animate ()
        // this.blocks = [];

        // 

        this.prepareBlocks();
    };
    Webgl.prototype.prepareBlocks = function(){
        var self = this;
        
        
        self.firstTime = false;
    };
    Webgl.prototype.createBlock = function(coords){
        var self = this;

        var nblocks = 0;

        if (coords.length < self.blocks.length) {
            //supprimer des blocks
            var start = coords.length;
            var end = self.blocks.length - coords.length;

            for(var i = start; i < self.blocks.length; i++) {
                self.scene.remove(self.blocks[i]);
            }
            self.blocks.splice(start, end);
        } else {
            //rajourter des
            nblocks = coords.length - self.blocks.length;

            for (var i = 0; i < nblocks; i++) {
                var block = new Square(self.boxSize);
                self.scene.add(block);
                self.blocks.push(block);
            };
        }

        self.coords = _.shuffle(coords);

        self.coords.forEach(function (coord, i) {
            TweenMax.to(self.blocks[i].position , 1, {
                x: coord[0], 
                y: coord[1]
            });
        });
    };
    // Webgl.prototype.reorderBlocks = function(horizontalOffset, verticalOffset){
    //     var self = this;
        
    //     if(self.currentIndex < self.letterBlocks.length){
    //         TweenMax.to(self.letterBlocks[self.currentIndex].position , 1, {
    //             x : horizontalOffset, 
    //             y : verticalOffset
    //         });
            
    //         self.currentIndex++;
    //     }
    //     else{
    //         var block = new Square(self.boxSize);
    //         block.position.set(horizontalOffset, verticalOffset, 0);
    //         self.scene.add(block);
    //         self.letterBlocks.push(block);
    //     }
    // };
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