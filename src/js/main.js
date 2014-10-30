var webgl, gui;

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

    TweenMax.to($('.title'), 0.75, {
        delay : 0.5,
        left : '50%',
        ease : Expo.easeInOut,
        onComplete : function(){
            TweenMax.to($('.title'), 0.75, {
                delay : 0.5,
                left : '120%',
            });
        }
    });
}

function resizeHandler() {
    webgl.resize(window.innerWidth, window.innerHeight);
}

function submitHandler(webgl){
	console.log('ok');
    $('input[name="sentence"').focus();
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
    stats.begin();
    stats.end();
    requestAnimationFrame(animate);
    webgl.render();
}