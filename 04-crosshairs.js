//##################################  Crosshairs  ####################################
//####################################################################################
Game.prototype.initialiseCrosshairs = function () {
    let targets = document.getElementsByClassName('target');
    let me = this;

	Array.prototype.forEach.call(targets, function (item) {
		let cornerTopLeft = document.createElement('div');
		cornerTopLeft.classList.add('corners', 'corner-top-left');
		item.appendChild(cornerTopLeft);
		let cornerTopRight = document.createElement('div');
		cornerTopRight.classList.add('corners', 'corner-top-right');
		item.appendChild(cornerTopRight);
		let cornerBottomLeft = document.createElement('div');
		cornerBottomLeft.classList.add('corners', 'corner-bottom-left');
		item.appendChild(cornerBottomLeft);
		let cornerBottomRight = document.createElement('div');
		cornerBottomRight.classList.add('corners', 'corner-bottom-right');
		item.appendChild(cornerBottomRight);
		item.onmouseenter = () => me.sound.mouseInBeep();  // Could replace with global event listeners!
		item.onmouseleave = () => me.sound.mouseOutBeep();
	});
};
