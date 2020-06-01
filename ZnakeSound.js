//#############################  Sound  #############################################
//###################################################################################
window.initialiseSound = function () {
	if (typeof window.audioCtx === 'undefined') {
		window.audioCtx = new AudioContext();

		window.foodBeepOscillator = window.audioCtx.createOscillator();
		window.foodBeepOscillator.frequency.value = 2000;
		window.foodBeepOscillator.connect(window.audioCtx.destination);
		window.foodBeepOscillator.start();
		window.foodBeepOscillator.disconnect();

		window.mouseInBeepOscillator = window.audioCtx.createOscillator();
		window.mouseInBeepOscillator.frequency.value = 3000;
		window.mouseInBeepOscillator.connect(window.audioCtx.destination);
		window.mouseInBeepOscillator.start();
		window.mouseInBeepOscillator.disconnect();

		window.mouseOutBeepOscillator = window.audioCtx.createOscillator();
		window.mouseOutBeepOscillator.frequency.value = 2500;
		window.mouseOutBeepOscillator.connect(window.audioCtx.destination);
		window.mouseOutBeepOscillator.start();
		window.mouseOutBeepOscillator.disconnect();
	};
};
window.foodBeep = function () {
	window.foodBeepOscillator.connect(window.audioCtx.destination);
	setTimeout(function () { window.foodBeepOscillator.disconnect() }, 70);
};

window.mouseInBeep = function () {
	window.mouseInBeepOscillator.connect(window.audioCtx.destination);
	setTimeout(function () { window.mouseInBeepOscillator.disconnect() }, 50);
};

window.mouseOutBeep = function () {
	window.mouseOutBeepOscillator.connect(window.audioCtx.destination);
	setTimeout(function () { window.mouseOutBeepOscillator.disconnect() }, 50);
};
