//#############################  Sound  #############################################
//###################################################################################
function initialiseSound(){
	audioCtx = new AudioContext();

	foodBeepOscillator = audioCtx.createOscillator();
	foodBeepOscillator.frequency.value = 2000;
	foodBeepOscillator.connect(audioCtx.destination);
	foodBeepOscillator.start();
	foodBeepOscillator.disconnect();
	
	mouseInBeepOscillator = audioCtx.createOscillator();
	mouseInBeepOscillator.frequency.value = 3000;
	mouseInBeepOscillator.connect(audioCtx.destination);
	mouseInBeepOscillator.start();
	mouseInBeepOscillator.disconnect();
	
	mouseOutBeepOscillator = audioCtx.createOscillator();
	mouseOutBeepOscillator.frequency.value = 2500;
	mouseOutBeepOscillator.connect(audioCtx.destination);
	mouseOutBeepOscillator.start();
	mouseOutBeepOscillator.disconnect();
}
function foodBeep(){
	foodBeepOscillator.connect(audioCtx.destination);
	setTimeout(function(){foodBeepOscillator.disconnect();},70);
};

function mouseInBeep(){
	mouseInBeepOscillator.connect(audioCtx.destination);
	setTimeout(function(){mouseInBeepOscillator.disconnect();},50);
};

function mouseOutBeep(){
	mouseOutBeepOscillator.connect(audioCtx.destination);
	setTimeout(function(){mouseOutBeepOscillator.disconnect();},50);
};

