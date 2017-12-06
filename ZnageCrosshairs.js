//##################################  Crosshairs  ####################################
//####################################################################################
window.initialiseCrosshairs = function(){
	var targets = document.getElementsByClassName('target');

	Array.prototype.forEach.call(targets, function(item){
		var cornerTopLeft = document.createElement('div');
		cornerTopLeft.classList.add('corners','corner-top-left');
		item.appendChild(cornerTopLeft);
		var cornerTopRight = document.createElement('div');
		cornerTopRight.classList.add('corners','corner-top-right');
		item.appendChild(cornerTopRight);
		var cornerBottomLeft = document.createElement('div');
		cornerBottomLeft.classList.add('corners','corner-bottom-left');
		item.appendChild(cornerBottomLeft);
		var cornerBottomRight = document.createElement('div');
		cornerBottomRight.classList.add('corners','corner-bottom-right');
		item.appendChild(cornerBottomRight);
		item.onmouseenter = mouseInBeep;  // Could replace with global event listeners!
		item.onmouseleave = mouseOutBeep;
	});
};
