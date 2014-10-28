var webgl, gui;

$(document).ready(init);

function init(){
    webgl = new Webgl(window.innerWidth, window.innerHeight);
    $('.three').append(webgl.renderer.domElement);

    gui = new dat.GUI();
    gui.close();

    $(window).on('resize', resizeHandler);
    submitHandler(webgl);
    animate();
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
};

function animate() {
    requestAnimationFrame(animate);
    webgl.render();
}