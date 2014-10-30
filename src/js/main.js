var webgl, gui, rotX = 0, rotZ = 0;

$(document).ready(init);
var stats = new Stats();
  
function init(){
    webgl = new Webgl(window.innerWidth, window.innerHeight);
    $('.three').append(webgl.renderer.domElement);

    stats.setMode(1); // 0: fps, 1: ms    
    // align top-left
    stats.domElement.style.position = 'absolute';
    stats.domElement.style.left = '0px';
    stats.domElement.style.bottom = '0px';

    document.body.appendChild( stats.domElement );

    $(window).on('resize', resizeHandler);
    submitHandler(webgl);
    animate();

    var $title = $('.title');
    var $container = $('.container');

    TweenMax.to($title, 0.75, {
        delay : 0.5,
        left : '50%',
        ease : Expo.easeInOut,
        onComplete : function(){
            TweenMax.to($title, 0.75, {
                delay : 0.5,
                left : '120%',
                onComplete : function(){
                    $('input[name="sentence"').focus();
                }
            });
            $container.css({
                '-webkit-filter': 'none',
                'filter': 'none'
            });
        }
    });

    $('body').on('mousemove', function(e) {
        var posX = e.pageX,
            posY = e.pageY,
            width = window.innerWidth,
            height = window.innerHeight;

            rotX =  ( (Math.cos((posX - width/2)/(width/2)*Math.PI/3.5))) * 1000;
            rotZ =  ( (Math.sin((posX - width/2)/(width/2)*Math.PI/3.5))) * 1000;
             
    });

}
function mouseHandler(){

}
function resizeHandler() {
    webgl.resize(window.innerWidth, window.innerHeight);
}

function submitHandler(webgl){
	console.log('ok');
    
	$('#formSentence').on('submit',function(e){
		e.preventDefault();
		webgl.sentenceHandler($('input[name="sentence"]').val().trim().toLowerCase());

	});
    var audio0 = new Audio();
    audio0.src = "assets/audio/type0.mp3";
    audio0.volume = 0.20;
    var audio1 = new Audio();
    audio1.src = "assets/audio/type1.mp3";
    audio1.volume = 0.20;
    var audio2 = new Audio();
    audio2.src = "assets/audio/type2.mp3";
    audio2.volume = 0.20;

    var audios = [audio0,audio1,audio2]


    var indexAudio = 0
    $('input[name="sentence"]').on('keypress', function(){
            audios[indexAudio].currentTime = 0;
            audios[indexAudio].play();    
            if(indexAudio < audios.length - 1){
                indexAudio += 1;
            }
            else{
                indexAudio = 0;
            }
    });
};

function animate() {
    requestAnimationFrame(animate);

    stats.begin();
    stats.end();
    // webgl.camera.position.set(rotZ, 0, rotX);
    webgl.camera.position.x += (rotZ - webgl.camera.position.x) * 0.1;
    webgl.camera.position.z += (rotX - webgl.camera.position.z) * 0.1;
    webgl.camera.lookAt(new THREE.Vector3(0,0,0));
    webgl.render();

    
}