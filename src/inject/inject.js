var $document, canvas, context;

chrome.extension.sendMessage({}, function(response) {
	var readyStateCheckInterval = setInterval(function() {
	if (document.readyState === "complete") {
		clearInterval(readyStateCheckInterval);

		// init canvas
		canvas = document.createElement('canvas');
		context = canvas.getContext('2d');
		$document = $(document);
		canvas.id = 'webotate';
		canvas.height = $document.height();
		canvas.width = $document.width();
		canvas.style.backgroundColor = 'transparent';
		canvas.style.position = 'absolute';
		canvas.style.zIndex = 2147483647;
		canvas.style.cursor = 'crosshair';
		// initially canvas is display: none
		canvas.style.display = 'none';
		$('body').prepend(canvas);

		// init canvas events
		initCanvasEvents();

	}
	}, 10);
});

var clickX = [];
var clickY = [];
var clickDrag = [];
var clickColor = [];
var paint;
var colorOrange = '#df4b26', colorBlack = '#000000', colorGreen = '#659b41', colorPurple = '#cb3594';
var curColor = colorOrange;

// toggle visibility of canvas on page action press
chrome.extension.onMessage.addListener(function(request, sender, sendResponse) {
	var display = canvas.style.display;

	if(request.data === 'DisplayToggle') {
		if(display === 'block')
			canvas.style.display = 'none';
		else if(display === 'none')
			canvas.style.display = 'block';
		sendResponse();
	} else if(request.data === 'Clear') {
		clear();
		sendResponse();
	} else if(request.data === 'ColorOrange') {
		curColor = colorOrange;
		sendResponse();
	} else if(request.data === 'ColorBlack') {
		curColor = colorBlack;
		sendResponse();
	} else if(request.data === 'ColorGreen') {
		curColor = colorGreen;
		sendResponse();
	} else if(request.data === 'ColorPurple') {
		curColor = colorPurple;
		sendResponse();
	}
});

function clear() {
	context.clearRect(0, 0, context.canvas.width, context.canvas.height);
	
	// reset all variables
	clickX = [];
	clickY = [];
	clickDrag = [];
	clickColor = [];
	paint = undefined;

	// reset localStorage
	store.remove(location.href);
}

function redraw() {
	//context.clearRect(0, 0, context.canvas.width, context.canvas.height); // Clears the canvas
	for(var i = 0; i < clickX.length; i++) {	
		context.beginPath();
		if(clickDrag[i] && i){
			context.moveTo(clickX[i-1], clickY[i-1]);
		} else {
			context.moveTo(clickX[i]-1, clickY[i]);
		}
		context.lineTo(clickX[i], clickY[i]);
		context.closePath();
		context.strokeStyle = clickColor[i];
		context.stroke();
	}
}

function draw() {
	context.beginPath();
	if(clickDrag[clickX.length - 1])
		context.moveTo(clickX[clickX.length - 2], clickY[clickY.length - 2]);
	else
		context.moveTo(clickX[clickX.length - 1] - 1, clickY[clickY.length - 1]);
	context.lineTo(clickX[clickX.length - 1], clickY[clickY.length - 1]);
	context.closePath();
	context.strokeStyle = curColor;
	context.stroke();
}

function addClick(x, y, dragging)
{
	clickX.push(x);
	clickY.push(y);
	clickDrag.push(dragging);
	clickColor.push(curColor);
}

function initCanvasEvents() {
	var $canvas = $(canvas);

	// init canvas styles
	context.lineJoin = 'round';
	context.lineCap = 'round';
	context.lineWidth = 5;

	// draw any annotations stored in localStorage
	var drawObj = store.get(location.href);
	if(drawObj !== undefined) {
		clickX = drawObj.clickX;
		clickY = drawObj.clickY;
		clickDrag = drawObj.clickDrag;
		clickColor = drawObj.clickColor;
		redraw();
	}

	$canvas.mousedown(function(e) {
		var mouseX = e.pageX - this.offsetLeft;
		var mouseY = e.pageY - this.offsetTop;

		paint = true;
		addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
		draw();
	});

	$canvas.mousemove(function(e) {
		if(paint){
			addClick(e.pageX - this.offsetLeft, e.pageY - this.offsetTop, true);
			context.lineTo(e.pageX - this.offsetLeft, e.pageY - this.offsetTop);
			context.strokeStyle = curColor;
			context.stroke();
		}
	});
	
	$canvas.mouseup(function(e){
		paint = false;
		store.set(location.href, {clickX: clickX, clickY: clickY, clickDrag: clickDrag, clickColor: clickColor});
	});
	
	$canvas.mouseleave(function(e){
		paint = false;
		//store.set(location.href, {clickX: clickX, clickY: clickY, clickDrag: clickDrag});
	});

	// ctrlkey down
	$(document).keydown(function(e) {
		if(e.keyCode === 17 || e.which === 17) {
			canvas.style.pointerEvents = 'none';
			canvas.style.cursor = 'auto';
			e.preventDefault();
		}
	});

	// ctrlkey up
	$(document).keyup(function(e) {
		if(e.keyCode === 17 || e.which === 17) {
			canvas.style.pointerEvents = 'all';
			canvas.style.cursor = 'crosshair';
			e.preventDefault();
		}
	});
}