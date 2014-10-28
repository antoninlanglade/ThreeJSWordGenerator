var Webgl = (function(){
    
    function Webgl(width, height){
        var self = this;

        this.letterBlocks = [];
        
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

        this.arrayOfWords = sentence.split(' ');
        this.arrayOfChars = [];
        this.arrayOfWords.forEach(function(item){
            self.arrayOfChars.push(item.split(''));
        });
        for(var i = 0; i < self.arrayOfChars.length; i++){
            if(self.arrayOfChars[i].length == 0){
                self.arrayOfChars.splice(i,1);
            }
        }
        this.prepareBlocks();
    };
    Webgl.prototype.prepareBlocks = function(){
        var self = this;
        var offset = {
            vertical : (self.arrayOfChars.length * (self.box.height * self.boxSize.height) + self.spaceLine * (self.arrayOfChars.length - 1)) /2,
            horizontal : 0
        };

        self.arrayOfChars.forEach(function(item){
            var countWord = item.length;

            // Offset Horizontal of a block
            offset.horizontal = - (countWord * (self.box.width*self.boxSize.width) + countWord * self.spaceLetter) / 2;

            item.forEach(function(subitem){

                    self.createBlock(subitem, offset, function(){});    

                offset.horizontal += (self.box.width*self.boxSize.width) + self.spaceLetter;
            });

            // Offset Vertical of a line
            offset.vertical -= (self.box.height*self.boxSize.height) + self.spaceLine;
        });
        self.firstTime = false;
    };
    Webgl.prototype.createBlock = function(letter, offset, callback){
        var self = this;
        if(self.data[letter]){
            var blocks = [],
            verticalOffset = offset.vertical;

            if(self.firstTime == false){
                this.reorderArray = _.flatten(self.letterBlocks);
            }

            self.data[letter].forEach(function(item){
                var horizontalOffset = offset.horizontal;

                item.forEach(function(item){

                    if(item == 1){
                        if(self.firstTime == false) {
                            // Reorder Object
                            self.reorderBlocks(horizontalOffset, verticalOffset)
                        }
                        else{
                            // Create object
                            var block = new Square(self.boxSize);
                            block.position.set(horizontalOffset, verticalOffset, 0);
                            self.scene.add(block);
                            blocks.push(block);
                        }
                    }
                    // Change Row Position into line
                    horizontalOffset += self.boxSize.width ;
                });

                // Change line
                verticalOffset -= self.boxSize.height ;
            });
            self.letterBlocks.push(blocks);
        }
        callback.call(self);
    };
    Webgl.prototype.reorderBlocks = function(horizontalOffset, verticalOffset){
        var self = this;

        // var randomLetter = Math.floor((Math.random() * self.letterBlocks.length ));
        
        
        TweenMax.to(self.reorderArray[self.currentIndex].position , 1, {
            x : horizontalOffset, 
            y : verticalOffset
        });
        
        self.currentIndex++;
        // console.log(randomLetter,randomBlock);
        // console.log('start',self.letterBlocks);
        // // TODO

        // self.letterBlocks[randomLetter].splice(randomBlock,1);

        // console.log('end',self.letterBlocks);
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
        if(self.letterBlocks){
            self.letterBlocks.forEach(function(item){
                item.forEach(function(item){
                    var rotate = Math.floor((Math.random() * 2));
                    item.update(rotate);
                });
            });
        }
    };

    return Webgl;

})();