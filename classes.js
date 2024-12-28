let debug = 1

class Player{
    constructor(){
        this.position = {
            x: 100,
            y: 100
        }
		
        this.velocity = {
            x: 0,
            y: 0
        }
        
        this.sprite = new Image()
        this.sprite.onload
        this.sprite.src = "img/player.png"

        this.frameBuffer = 5
		this.elapsedFrames = 0
        this.framesX = 0
        this.framesY = 0
        //imposto l'altezza e la larghezza del singolo fotogramma
        this.width = 77
        this.height = 95
        this.debugFrameColor = 'black'
        this.gameover = false
		this.can_jump = true
		this.goingR = true
    }
    draw(){
        c.drawImage(this.sprite,this.width * this.framesX,this.height * this.framesY,this.width,this.height,this.position.x,this.position.y,
            this.width,this.height)
		if(debug)
		{
			c.strokeStyle = this.debugFrameColor
			c.beginPath();
			c.rect(this.position.x, this.position.y, this.width, this.height);
			c.stroke();
		}
    }
    update(){
		if(lives == 0){
			//next = 0
			this.gameover = true
			printText(c, "red" , 24, "Game Over! Non ti sei diplomato", 0)
			Death.play()
			setTimeout(function(){
			lives = 3
			splash.style.display = "block"
			game.style.display = "none"
			},1500)
		}
		else{
		this.elapsedFrames++
		if(this.elapsedFrames % this.frameBuffer == 0){
			if(left_pressed || right_pressed){
				this.framesX++
			}
			else{
				this.framesX++
				if(this.goingR)
					this.framesY = 0
				else
					this.framesY = 1
			}
			this.elapsedFrames = 0
		}
		
        if (this.framesX > 7)
            this.framesX = 0

        this.position.y += this.velocity.y
        this.position.x += this.velocity.x

        //condizione che controlla se il giocatore esce fuori dal fondo della pagina
        if(this.position.y + this.height + this.velocity.y <= canvas.height){
            //istruzione che aggiunge la gravità
            this.velocity.y += gravity
        }
        else{ 
			this.gameover = true
			lives--
            setTimeout(init, 25)
        }	
		}
    }
}

class Enemy{
    constructor(x, y){
        this.position = {
            x, 
            y
        }
		
        this.velocity = {
            x: 0,
            y: 0
        }
        
        this.sprite = new Image()
        this.sprite.onload
        this.sprite.src = "img/enemy.png"

        this.frameBuffer = 5
		this.elapsedFrames = 0
        this.framesX = 0
        this.framesY = 0
        //imposto l'altezza e la larghezza del singolo fotogramma
        this.width = 77
        this.height = 95
        this.debugFrameColor = 'black'
        this.gameover = false
		this.can_jump = false
		this.goingR = true
		this.sinistra = true
		this.destra = false
		this.tempoSinistro = 0
		this.tempoDestro = 0
    }
    draw()
	{
		
        c.drawImage(this.sprite,this.width * this.framesX,this.height * this.framesY,this.width,this.height,this.position.x,this.position.y,
            this.width,this.height)
		if(debug)
		{
			c.strokeStyle = this.debugFrameColor
			c.beginPath();
			c.rect(this.position.x, this.position.y, this.width, this.height);
			c.stroke();
		}
    }
    update(){
		console.log("nemico = " + this.position.x)
		this.elapsedFrames++
		if (this.sinistra)
		{	
			this.framesY = 3
			this.position.x -= 5;
			this.tempoSinistro += 1; 

			if (this.tempoSinistro >= 120)
			{ 
				this.sinistra = false;
				this.destra = true;
				this.tempoSinistro = 0;
				this.elapsedFrames = 0
			}
		}
		if (this.destra)
		{
			this.framesY = 2
			this.position.x += 5;
			this.tempoDestro += 1; 

			if (this.tempoDestro >= 120) 
			{ 
				this.sinistra = true;
				this.destra = false;
				this.tempoDestro = 0;
				this.elapsedFrames = 0
			}
		}
		if(this.elapsedFrames % this.frameBuffer == 0)
		{
			this.framesX++
			this.elapsedFrames = 0
		}
			
			if (this.framesX > 7)
			    this.framesX = 0

			// il nemico sta fermo

			//else{
			//	this.framesX++
			//	if(this.goingR)
			//		this.framesY = 0
			//	else
			//		this.framesY = 1
			//}
			//this.elapsedFrames = 0
		
		

        
    }
}

class Pavement{
    constructor(x,y, source){
        this.position={
            x,
            y
        }
        this.image = new Image()
        this.image.onload
        this.image.src = source
    }
    draw(){
        c.drawImage(this.image,this.position.x,this.position.y,
            this.image.width,this.image.height)
    }

}

class Platform{
    constructor(x,y, movable, source){
        this.position={
            x,
            y
        }
        this.movable = movable
        this.image = new Image()
        this.image.onload
        this.image.src = source
		this.sotto = true
		this.sopra = false
		this.sinistra = true
		this.destra = false
		this.tempoSinistro = 0
		this.tempoDestro = 0
    }
	move_platform(dir){
		switch(dir){
		case 1:
			if (this.sopra){	
			this.position.y -= 1.5;
			this.tempoSinistro += 1; 

			if (this.tempoSinistro >= 100) { 
				this.sopra = false;
				this.sotto = true;
				this.tempoSinistro = 0; 
			}
		}
		if (this.sotto){
			this.position.y += 1.5;
			this.tempoDestro += 1; 

			if (this.tempoDestro >= 100) { 
				this.sopra = true;
				this.sotto = false;
				this.tempoDestro = 0; 
			}
		}
		break
		//orizzontale
		case 2:
		if (this.sinistra){	
			this.position.x -= 1.5;
			this.tempoSinistro += 1; 

			if (this.tempoSinistro >= 100) { 
				this.sinistra = false;
				this.destra = true;
				this.tempoSinistro = 0; 
			}
		}
		if (this.destra){
			this.position.x += 1.5;
			this.tempoDestro += 1; 

			if (this.tempoDestro >= 100) { 
				this.sinistra = true;
				this.destra = false;
				this.tempoDestro = 0; 
			}
		}
		break
		//orizzontale inverso
		case 3:
		if (this.sinistra){	
			this.position.x += 1.5;
			this.tempoSinistro += 1; 

			if (this.tempoSinistro >= 100) { 
				this.sinistra = false;
				this.destra = true;
				this.tempoSinistro = 0; 
			}
		}
		if (this.destra){
			this.position.x -= 1.5;
			this.tempoDestro += 1; 

			if (this.tempoDestro >= 100) { 
				this.sinistra = true;
				this.destra = false;
				this.tempoDestro = 0; 
			}
		}
		break
		}
	}
	update(player){
		if (player.position.x < this.position.x + this.image.width && player.position.x + player.width > this.position.x &&
			player.position.y < this.position.y -10 + this.image.height && player.position.y + player.height > this.position.y-10)
        {
			if (player.position.y < this.position.y)
			{
				player.velocity.y = 0
				player.position.y = this.position.y - player.height
				player.can_jump = true
				player.debugFrameColor = 'red'
			}
			else
				player.velocity.y = 10
		}
		if(this.movable != 0)
			this.move_platform(this.movable)
	}
    draw(){
        c.drawImage(this.image,this.position.x,this.position.y,
            this.image.width,this.image.height)
    }
}
class genericObject{
    constructor(x,y, source){
        this.position={
            x,
            y
        }
        this.image = new Image()
        this.image.onload
        this.image.src = source
    }
    draw(){
        c.drawImage(this.image,this.position.x,this.position.y,
            this.image.width,this.image.height)
    }

}

class Obstacle{
    constructor(x,y,movable, source){
        this.position={
            x,
            y
        }
		this.movable = movable
        this.image = new Image()
        this.image.onload
        this.image.src = source
		this.sinistra = true
		this.destra = false
		this.tempoSinistro = 0
		this.tempoDestro = 0
    }
	move_Obstacle(dir){
		console.log(dir)
		switch(dir){
		//orizzontale
		case 1:
		if (this.sinistra){	
			this.position.x -= 2.5;
			this.tempoSinistro += 1; 

			if (this.tempoSinistro >= 120) { 
				this.sinistra = false;
				this.destra = true;
				this.tempoSinistro = 0; 
			}
		}
		if (this.destra){
			this.position.x += 2.5;
			this.tempoDestro += 1; 

			if (this.tempoDestro >= 120) { 
				this.sinistra = true;
				this.destra = false;
				this.tempoDestro = 0; 
			}
		}
		break
		}
	}
	update(player){
		if(lives == 0){
			player.gameover = true
			printText(c, "red" , 24, "Game Over! Non ti sei diplomato", 0)
			Death.play()
			setTimeout(function(){
			lives = 3
			splash.style.display = "block"
			game.style.display = "none"
			},1500)
		}
		else{
			if(player.position.y + player.height >= this.position.y
				&& player.position.y + player.height + player.velocity.y >= this.position.y 
				&& player.position.x + player.width >= this.position.x + 30
				&& player.position.x + player.width <= this.position.x + this.image.width + 30){
			player.gameover = true
			lives--
            setTimeout(init, 25)
			return
			}
		if(this.movable != 0)
			this.move_Obstacle(this.movable)
		}
	}
    draw(){
        c.drawImage(this.image,this.position.x,this.position.y,
            this.image.width,this.image.height)
    }

}

class Layer{
    constructor(x , y, speedMod, source){
		this.x = x
        this.y = y
		this.width = 1788
		this.height = 545
		this.image = new Image()
        this.image.onload
        this.image.src = source
        this.speedMod = speedMod
        this.speed = gameSpeed * this.speedMod
    }
    update(){
		this.speed = gameSpeed * this.speedMod
		this.x = gameFrame * this.speed % this.width
	}
	draw(){
        c.drawImage(this.image,this.x,this.y,this.width,this.height)
		c.drawImage(this.image,this.x + this.width-1,this.y,this.width,this.height)
    }

}
