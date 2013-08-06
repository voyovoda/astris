function pr(d)
{
	console.log(d);
}

function App(canvas)
{
	this.version = "0.1";
	this.running = false;
	this.frameCount = 0;
	this.canvas = canvas;
	
	
	this.nStars = 20;
	this.nAliens = 10;
	this.playerSpeed = 16;
	this.playerHeight = 16;

	this.alienImage = new Image();
	this.alienImage.src = "images/alien.png";
	this.alienImage.width = 32;
	this.alienImage.height = 32;
	
	this.starsX = [];
	this.starsY = [];
	
	for(var ctr = 0;ctr < this.nStars;ctr++)
	{
		this.starsX[ctr] = Math.random() * this.canvas.width;
		this.starsY[ctr] = Math.random() * this.canvas.height;
	}

	
	this.aliensX = [];
	this.aliensY = [];
	

	for(var ctr = 0;ctr < this.nAliens;ctr++)
	{
		this.aliensX[ctr] = (ctr * 64) + 10;
		this.aliensY[ctr] = (Math.random() * 50) + 50;
	}
	
	this.playerX = (this.canvas.width - 32)/2;
	this.playerY = this.canvas.height - 32;
	
	this.nAliensDestroyed = 0;
	
	canvas.addEventListener('keydown',this.keydown.bind(this),false);
	canvas.addEventListener('click',this.click.bind(this),false);
	canvas.addEventListener('blur',this.blur.bind(this),false);
	
	//this.nMissiles = 3;
	this.missileX = -100;
	this.missileY = -100;

	this.requestAnimationFrameSupported = (window.requestAnimationFrame);
	this.renderIntervalID = 0;
	
	this.ticks = 0;
	
	//speeds in pps
	this.missileSpeed = 400;
	
	var context = canvas.getContext('2d');
	context.webkitImageSmoothingEnabled=false;
}

App.prototype.init = function()
{

}

App.prototype.renderBackground = function(context)
{
	context.fillStyle = "#FFFFFF";
	
	for(var ctr = 0;ctr < this.nStars;ctr++)
	{
		//this.starsX[ctr] += Math.random() * 1;
		
		//if(this.starsX[ctr] > 640)
		//	this.starsX[ctr] = 0;
		
		context.fillRect(
			this.starsX[ctr],
			this.starsY[ctr],
			1,1);
	}
}

App.prototype.renderFrame = function()
{
	var context = this.canvas.getContext("2d");
	
	var now = (new Date).getTime();
	var delta = (now - this.lastFrameTicks) / 1000;
	this.lastFrameTicks = now;
	
	context.clearRect(0,0,640,480);
	this.renderBackground(context);
	
	context.font = "16px beeb";
	context.fillStyle = "#FFFFFF";
	context.fillText("Aliens destroyed: " + this.nAliensDestroyed,20,20);
	
	
	for(var ctr = 0;ctr < this.nAliens;ctr++)
	{
		context.drawImage(
			this.alienImage,
			this.aliensX[ctr],
			this.aliensY[ctr],
			32,32);
	}
	
	context.font = this.playerHeight + "px beeb";
	context.fillStyle = "#FFFF00";
	context.fillText("A",this.playerX,this.playerY);
	
	context.fillStyle = "#FF0000";
	context.fillText("!",this.missileX,this.missileY);
	
	this.frameCount++;

	this.missileY -= this.missileSpeed * delta;

	if(this.running && this.requestAnimationFrameSupported)
		requestAnimationFrame(this.renderFrame.bind(this));
}

App.prototype.start = function()
{
	this.canvas.focus();
	this.running = true;
	this.ticks = 0;
		
	if(this.requestAnimationFrameSupported)
		requestAnimationFrame(this.renderFrame.bind(this));
	else
		this.renderIntervalID = setInterval(this.renderFrame.bind(this),50);
}

App.prototype.stop = function()
{
	this.running = false;
	if(!this.requestAnimationFrameSupported)
	{
		clearInterval(this.renderIntervalID);
		this.renderIntervalID = 0;
	}
}

App.prototype.moveLeft = function()
{
	this.playerX -= this.playerSpeed;
}

App.prototype.moveRight = function()
{
	this.playerX += this.playerSpeed;
}

App.prototype.fire = function()
{
	this.missileX = this.playerX;
	this.missileY = this.playerY - this.playerHeight;
}

App.prototype.escape = function(event)
{

}





App.prototype.click = function(event)
{
	if(this.running)
		this.stop();
	else
		this.start();
}

App.prototype.blur = function(event)
{
	this.canvas.focus();
}

App.prototype.keydown = function(event)
{
	switch(event.keyCode)
	{
		case 37://left
			this.moveLeft();
			break;
		case 39://right
			this.moveRight();
			break;
		case 32://space
			this.fire();
			break;
		case 27:
			this.escape();
			break;
	}
}

app = null;

$(document).ready(function()
{
	app = new App(document.getElementById('c'));
	
	console.log(app);
	app.start();
});
