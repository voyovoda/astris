function rand(min,max)
{
	return Math.random() * (max - min) + min;
}

function cl(str)
{
	console.log(str);
}

function Rect()
{
	this.top = 0;
	this.left = 0;
	this.width = 0;
	this.height = 0;
}

Rect.prototype.toString = function()
{
//	return '(' + this.top + ',' + this.left + ")(" + this.
}

function Alien()
{
	this.x = 0;
	this.y = 0;
	
	this.AlienState = 
	{
		Unknown : 0,
		Alive : 1,
		Hit : 2,
		Dead : 3
	};
	
	this.alive = this.AlienState.Unknown;
}

function Star()
{
	this.x = 0;
	this.y = 0;
}

function Player()
{
	this.x = 0;
	this.y = 0;
	this.height = 0;
	this.speed = 0;
}

function Missile()
{
	this.x = 0;
	this.y = 0;
	this.active = false;
	this.speed = 0;
}

function Astris(canvas)
{
	this.nAliens = 10;
	this.aliens = [];
	this.score = 0;
	
	this.nStars = 40;
	this.stars = [];
	
	this.player = new Player();
	this.player.speed = 16;
	this.player.height = 16;

	this.alienImage = new Image();
	this.alienImage.src = "images/alien.png";
	this.alienImage.width = 32;
	this.alienImage.height = 32;
	
	this.explosionImage = new Image();
	this.explosionImage.src = "images/explosion.png";
	this.explosionImage.width = 32;
	this.explosionImage.height = 32;
	
	this.missile = new Missile();
	this.missile.x = -100;
	this.missile.y = -100;
	this.missile.speed = 32;
	
	
	this.requestAnimationFrameSupported = (window.requestAnimationFrame);
	this.renderIntervalID = 0;
	this.renderIntervalSpeed = 50;
	
	this.updateIntervalID = 0;
	this.updateIntervalSpeed = 1;
	this.updateTicks = 0;

	this.canvas = canvas;
	canvas.addEventListener('keydown',this.keydown.bind(this),false);
	canvas.addEventListener('click',this.click.bind(this),false);
	canvas.addEventListener('blur',this.blur.bind(this),false);
	
	var context = canvas.getContext('2d');
	context.webkitImageSmoothingEnabled=false;
	
	this.GameState = {
		NotRunning : 0,
		Intro : 1,
		Running : 2,
		Paused : 3,
		Won : 4,
		Lost : 5
		};
	
	this.state = this.GameState.NotRunning;
}

Astris.prototype.renderStarfield = function(context)
{
	context.fillStyle = "#FFFFFF";
	for(var ctr = 0;ctr < this.nStars;ctr++)
	{
		context.fillRect(this.stars[ctr].x,this.stars[ctr].y,1,1);
	}
}

Astris.prototype.renderIntro = function(context)
{
	context.font = "16px beeb";
	context.fillStyle = "#FFFFFF";
	context.fillText('You are a lone Space Pilot protecting',50,40);
	context.fillText('the planet Earth.',40,60);
	context.fillText('In a few moments you will be under',40,80);
	context.fillText('attack by aliens from the planet VARGON.',40,100);
	context.fillText('Your mission is to prevent any',40,140);
	context.fillText('Vargonian ship from landing.',40,160);
	
	context.fillText('`Z` MOVES STARFIGHTER LEFT',100,240);
	context.fillText('`X` MOVES STARFIGHTER RIGHT',100,270);
	context.fillText('PRESS SPACE-BAR TO FIRE LASER',100,300);
	context.fillText('Press any key to engage enemy',100,400);
}

Astris.prototype.renderLose = function(context)
{
	context.font = "16px beeb";
	context.fillStyle = "#FFFFFF";
	context.fillText('you are teh lose',50,40);
}

Astris.prototype.renderWon = function(context)
{
	context.font = "16px beeb";
	context.fillStyle = "#FFFFFF";
	context.fillText('you are teh win',50,40);
}

Astris.prototype.renderRunning = function(context)
{
	this.renderStarfield(context);
	
	context.font = "16px beeb";
	context.fillStyle = "#FFFFFF";
	context.fillText("Aliens destroyed: " + this.score,20,20);


	context.font = this.playerHeight + "px beeb";
	context.fillStyle = "#FFFF00";
	context.fillText("A",this.player.x,this.player.y);

	if(this.missile.y != -100)
	{
		context.fillStyle = "#FF0000";
		context.fillText("!",this.missile.x,this.missile.y);
	}

	for(var ctr = 0;ctr < this.nAliens;ctr++)
	{
		if(this.aliens[ctr].state == this.aliens[ctr].AlienState.Alive)
			context.drawImage(this.alienImage,this.aliens[ctr].x,this.aliens[ctr].y,32,32);
		else if(this.aliens[ctr].state == this.aliens[ctr].AlienState.Hit)
			context.drawImage(this.explosionImage,this.aliens[ctr].x,this.aliens[ctr].y,32,32);
	}
	
}

Astris.prototype.renderFrame = function()
{
	var context = this.canvas.getContext("2d");
	context.clearRect(0,0,640,480);
	
	switch(this.state)
	{
		case this.GameState.Intro: this.renderIntro(context); break;
		case this.GameState.Running: this.renderRunning(context); break;
		case this.GameState.Won: this.renderWon(context); break;
		case this.GameState.Lost: this.renderLost(context); break;
	}
	
	if(this.state != this.GameState.NotRunning && this.requestAnimationFrameSupported)
		requestAnimationFrame(this.renderFrame.bind(this));
}

Astris.prototype.update = function()
{
	if(this.state != this.GameState.Running)
		return;
	this.updateTicks++;
	
	if(this.updateTicks % 400 == 0)
	{
		for(var ctr = 0;ctr < this.nAliens;ctr++)
		{
			this.aliens[ctr].x += (rand(1,3)-2) * 64;
			this.aliens[ctr].y += 32;
			
			if(this.aliens[ctr].x > 620)
				this.aliens[ctr].x = 620;
			if(this.aliens[ctr].x < 10)
				this.aliens[ctr].x = 10;

			if(this.aliens[ctr].y > (this.canvas.height - this.player.height) && this.aliens[ctr].alive)
			{
				console.log('lost');
				this.state = this.GameState.Lose;
			}
		}
	}
	if(this.updateTicks % 10 == 0)
	{
		if(this.missile.y != -100)
		{
			if(this.missile.y < 0)
			{
				this.missile.y = -100;
				console.log('missed');
			}
			else
			{
				this.missile.y -= this.missile.speed;
			
				for(var ctr = 0;ctr < this.nAliens;ctr++)
				{
					if(
						this.aliens[ctr].state == this.aliens[ctr].AlienState.Alive
						&&
						(this.missile.y >= this.aliens[ctr].y && this.missile.y <= (this.aliens[ctr].y + this.alienImage.height))
						&&
						(this.missile.x >= this.aliens[ctr].x && this.missile.x <= (this.aliens[ctr].x + this.alienImage.width))
						)
					{
						console.log('hit');
						this.missile.y = -100;
						this.aliens[ctr].state = this.aliens[ctr].AlienState.Hit;
						this.score++;
						
						if(this.score >= this.nAliens)
						{
							this.state = this.GameState.Won;
							console.log('won');
						}
					}
					//console.log(this.missile, this.aliens[ctr]);
				}
			}
		}
	}
	if(this.updateTicks % 100 == 0)
	{
		for(var ctr = 0;ctr < this.nAliens;ctr++)
		{
			if(this.aliens[ctr].state == this.aliens[ctr].AlienState.Hit)
				this.aliens[ctr].state = this.aliens[ctr].AlienState.Dead;
		}
	}
}
Astris.prototype.init = function()
{
	for(var ctr = 0;ctr < this.nAliens;ctr++)
	{
		var a = new Alien();
		a.x = (ctr * 64) + 10;
		a.y =  (Math.random() * 50) + 50;
		a.state = a.AlienState.Alive;
		this.aliens[ctr] = a;
	}
	
	for(var ctr = 0;ctr < this.nStars;ctr++)
	{
		var s = new Star();
		s.x = Math.random() * this.canvas.width;
		s.y = Math.random() * this.canvas.height;
		this.stars[ctr] = s;
	}
	
	
	this.player.x = (this.canvas.width - 32)/2;
	this.player.y = this.canvas.height - 32;
}

Astris.prototype.clearTimeouts = function()
{
	if(this.requestAnimationFrameSupported)
		clearInterval(this.renderIntervalID);
	clearInterval(this.updateIntervalID);
	
	this.renderIntervalID = this.updateIntervalID = 0;
}

Astris.prototype.start = function()
{
	if(this.state == this.GameState.NotRunning)
		this.init();
	
	if(this.requestAnimationFrameSupported)
		requestAnimationFrame(this.renderFrame.bind(this));
	else
		this.renderIntervalID = setInterval(this.renderFrame.bind(this),this.renderIntervalSpeed);
		
	this.updateIntervalID = setInterval(this.update.bind(this),this.updateIntervalSpeed);
	this.updateTicks = 0;
	
	if(this.state == this.GameState.NotRunning)
		this.state = this.GameState.Intro;
	else
		this.state = this.GameState.Running;
	
	this.canvas.focus();
	
	console.log(this);
}

Astris.prototype.pause = function()
{
	if(this.state == this.GameState.Running)
	{
		this.clearTimeouts();
		this.state = this.GameState.Paused;
	}
}

Astris.prototype.stop = function()
{
	this.clearTimeouts();
	this.state = this.GameState.NotRunning;
}

Astris.prototype.moveLeft = function()
{
	this.player.x -= this.player.speed;
}

Astris.prototype.moveRight = function()
{
	this.player.x += this.player.speed;
}

Astris.prototype.fire = function()
{
	if(this.missile.y == -100)
	{
		this.missile.x = this.player.x;
		this.missile.y = this.player.y - this.player.height;
	}
	//console.log('fire');
}






Astris.prototype.click = function(event)
{
	switch(this.state)
	{
		case this.GameState.NotRunning:
		case this.GameState.Paused:
			this.start();
			break;
			
		case this.GameState.Intro:
			this.state = this.GameState.Running;
			break;
			
		case this.GameState.Running:
			this.pause();
			break;
			
		case this.GameState.Won:
		case this.GameState.Lose:
			this.state = this.GameState.NotRunning;
			this.start();
			break;
	}



	var str = '';
	switch(this.state)
	{
		case this.GameState.NotRunning: str = 'NotRunning'; break;
		case this.GameState.Intro: str = 'Intro'; break;
		case this.GameState.Running: str = 'Running'; break;
		case this.GameState.Paused: str = 'Paused'; break;
		case this.GameState.Won: str = 'Won'; break;
		case this.GameState.Lost: str = 'Lost'; break;
	}
	console.log(str);
}

Astris.prototype.blur = function(event)
{
	this.canvas.focus();
}

Astris.prototype.keydown = function(event)
{
	switch(event.keyCode)
	{
		case 90://z
		case 37://left
			this.moveLeft();
			break;
		case 88://x
		case 39://right
			this.moveRight();
			break;
		case 32://space
			this.fire();
			break;
		case 27:
			this.escape();
			break;
			
		case 87: // w
			this.state = this.GameState.Win;
			break;
			
		case 76: // l
			this.state = this.GameState.Lose;
			break;

	}
	//cl(event);
}


