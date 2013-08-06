var app = null;
var canvas = null;
$(document).ready(function()
{
	canvas = document.getElementById('c');
	app = new Astris(canvas);
	
	app.start();
});
