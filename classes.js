let debug = 0

class Player{
    constructor(){
        this.position = {
            x: (window.screen.width-77)/2,
            y: 100
        }
		
        this.velocity = {
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

		//creo il caricatore di munizioni
		this.caricatore_player = []
		this.proiettili_player = 3
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
		if (lives == 0)
		{
			next = 0
			this.gameover = true
			printText(c, "red" , 24, "Game Over! Non ti sei diplomato", canvas.width/2, canvas.height/2)
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
			if(left_pressed)
			{
				this.framesY = 3
				this.framesX++
			}
			else if(right_pressed)
			{
				this.framesY = 2
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

        //condizione che controlla se il giocatore esce fuori dal fondo della pagina
        if(this.position.y + this.height + this.velocity.y <= canvas.height){
            //istruzione che aggiunge la gravità
            this.velocity.y += gravity
        }
        else 
			gameOver(this)
        	
		}
    }
}

class Enemy{
    constructor(x, y, movable){
        this.position = {
            x, 
            y
		}

		this.rotating_x = x
		this.const_y = y

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
		//hitbox
		this.hitbox_width = this.width * 7
		this.hitbox_posX = this.hitbox_width
        this.debugFrameColor = 'black'
		this.stopWalking  = false
		this.goingR = false
		this.sinistra = true
		this.destra = false
		this.outOfBullets = false
		this.tempoSinistro = 0
		this.tempoDestro = 0
		this.movable = movable
		this.rot_speed = 0
		this.squeezed = false

		//creo il caricatore di munizioni per il nemico
		this.caricatore_nemico = []
		this.proiettili_nemico = 3

		for (let i = 0; i < this.proiettili_nemico; i++)
			this.caricatore_nemico.push(new Enemy_paperplane())

	}

    draw()
	{
		
        c.drawImage(this.sprite,this.width * this.framesX,this.height * this.framesY,this.width,this.height,this.position.x,this.position.y,
            this.width,this.height)

		if (!this.goingR) {
			this.hitbox_posX = this.position.x + 77
			this.hitbox_posX -= this.hitbox_width
		}
		else 
			this.hitbox_posX = this.position.x
		

		if (debug)
		{
			c.strokeStyle = this.debugFrameColor
			c.beginPath();
			c.rect(this.hitbox_posX, this.position.y, this.hitbox_width, this.height);
			c.stroke();
		}
    }
	update(player)
	{
		const playerBottom = player.position.y + player.height;
		const playerTop = player.position.y;
		const playerLeft = player.position.x;
		const playerRight = player.position.x + player.width;

		const thisBottom = this.position.y + this.height;
		const thisTop = this.position.y;
		const thisLeft = this.position.x;
		const thisRight = this.position.x + this.width;

		this.elapsedFrames++

		// Controllo collisione dal basso del giocatore
		if (
			playerBottom >= thisTop &&
			playerTop < thisTop &&
			playerRight > thisLeft &&
			playerLeft < thisRight &&
			player.velocity.y > 0.5
		) {
			Death.play()
			this.squeezed = true
			this.caricatore_nemico = []
			this.debugFrameColor = "red"
		}

		if(this.movable)
		{
			if (this.sinistra && !this.stopWalking)
			{	
				this.goingR = false;
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
			else if (this.destra && ! this.stopWalking)
			{
				this.goingR = true;
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
		}
		else 
		{
			if (player.position.x > this.position.x)
			{
				this.framesY = 0
				this.goingR = true
			}

			this.position.x = this.rotating_x + 75 * Math.cos(this.rot_speed)
			this.position.y = this.const_y + 75 * Math.sin(this.rot_speed)
			this.rot_speed += 0.05
		}

		//controllo le collisioni del giocatore col nemico
		if (player.position.x < this.hitbox_posX + this.hitbox_width && player.position.x + player.width > this.hitbox_posX) {
			//this.debugFrameColor = 'red'
			this.stopWalking = true

			sparaAeroplanino(this); // Chiama la funzione asincrona

			if (!this.outOfBullets) {
				this.goingR ? this.framesY = 4 : this.framesY = 5
			}
			else {
				if (this.goingR)
					this.framesY = 0
			    else
					this.framesY = 1
			}

		}
		else {
			if (this.outOfBullets) {
				this.stopWalking = false
				this.debugFrameColor = 'black'
			}
		}

		if(this.elapsedFrames % this.frameBuffer == 0)
		{
			this.framesX++
			this.elapsedFrames = 0
		}
			
			if (this.framesX > 7)
			    this.framesX = 0
  
    }
}

class Enemy_paperplane
{
    constructor()
	{
        this.position = {
            x: 0,
            y: 0
		}

		this.hitbox = {
			width: 35,
			height: 20

		}
		
        this.velocity = {
            x: 2,
            y: 0
        }
        
		//sprite
        this.sprite = new Image()
        this.sprite.onload
        this.sprite.src = "img/paperplane.png"

        this.frameBuffer = 10
		this.elapsedFrames = 0
        this.framesX = 0
        this.framesY = 0

        //imposto l'altezza e la larghezza del singolo fotogramma
        this.width = 77
        this.height = 95

		//flag che controlla se il proiettile può apparire sullo schermo
		this.available = true

		this.debugFrameColor = 'black'

		//flag che controlla la direzione dell'aeroplanino 
		this.goingR = false
    }

    draw()
	{
		if (! this.available)
        c.drawImage(this.sprite,this.width * this.framesX,this.height * this.framesY,this.width,this.height,this.position.x,this.position.y,
            this.width,this.height)

		if (debug && !this.available)
		{
			c.strokeStyle = this.debugFrameColor
			c.beginPath();
			c.rect(this.position.x+35, this.position.y+10, this.hitbox.width, this.hitbox.height);
			c.stroke();
		}
    }

    update(player)
	{
		//collisione giocatore -> aeroplanino

		const playerBottom = player.position.y + player.height;
		const playerTop = player.position.y;
		const playerLeft = player.position.x;
		const playerRight = player.position.x + player.width;

		const thisBottom = this.position.y + this.hitbox.height;
		const thisTop = this.position.y;
		const thisLeft = this.position.x + 30;
		const thisRight = this.position.x + this.hitbox.width + 30;

		if (!this.available)
		{
			// Controllo collisione dal basso del giocatore
			if (
				playerBottom >= thisTop &&
				playerTop < thisTop &&
				playerRight > thisLeft &&
				playerLeft < thisRight
			) 
			{
				gameOver(player)
				return
			}
			

			// Controllo collisione frontale (da destra)
			if (
				playerRight >= thisLeft &&
				playerLeft < thisLeft &&
				playerBottom > thisTop &&
				playerTop < thisBottom
			) 
			{
				gameOver(player)
				return
			}
			

			// Controllo collisione laterale (da sinistra)
			if (
				playerLeft <= thisRight &&
				playerRight > thisRight &&
				playerBottom > thisTop &&
				playerTop < thisBottom
			) 
			{
				gameOver(player)
				return
			}
			

			// Controllo collisione dall'alto
			if (
				playerTop <= thisBottom &&
				playerBottom > thisBottom &&
				playerRight > thisLeft &&
				playerLeft < thisRight
			) 
			{
				gameOver(player)
				return
			}
			
		}
		this.debugFrameColor = 'black'; // Nessuna collisione

		if (!this.available && !this.goingR)
		{
			this.position.x -= 5
			this.framesY = 1
		}
		else if (!this.available)
		{
			this.position.x += 5
			this.framesY = 0
		}
		
		if (this.position.x < 0 || this.position.x > canvas.width)
			this.available = true
		

		this.elapsedFrames++
		
		if(this.elapsedFrames % this.frameBuffer == 0)
		{
			this.framesX++
			this.elapsedFrames = 0
		}
			
			if (this.framesX > 7)
			    this.framesX = 0
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
		this.rotating_x = x
		this.const_y = y

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
		this.rot_speed = 0
    }
	move_platform(dir){
		switch (dir)
		{
			//verticale
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
			//verticale inverso
			case 2:
				if (this.sopra) {
					this.position.y += 1.5;
					this.tempoSinistro += 1;

					if (this.tempoSinistro >= 100) {
						this.sopra = false;
						this.sotto = true;
						this.tempoSinistro = 0;
					}
				}
				if (this.sotto) {
					this.position.y -= 1.5;
					this.tempoDestro += 1;

					if (this.tempoDestro >= 100) {
						this.sopra = true;
						this.sotto = false;
						this.tempoDestro = 0;
					}
				}
			break
			//orizzontale
			case 3:
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
			case 4:
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
			//circolare
			case 5:
				this.position.x = this.rotating_x + 75 * Math.cos(this.rot_speed)
				this.position.y = this.const_y + 75 * Math.sin(this.rot_speed)
				this.rot_speed += 0.05
			break
			//circolare inverso
			case 6:

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
	//collisione col cactus e giocatore
	update(player)
	{
		if(player.position.y + player.height >= this.position.y
			&& player.position.y + player.height + player.velocity.y >= this.position.y 
			&& player.position.x + player.width >= this.position.x + 30
			&& player.position.x + player.width <= this.position.x + this.image.width + 30)
		{
			player.gameover = true
			lives--
		      setTimeout(init, 25)
			return
		}

		if(this.movable != 0)
			this.move_Obstacle(this.movable)
		
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
		this.image = new Image()
		this.image.onload = () => {
			this.width = this.image.width;
			this.height = this.image.height;
		}
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
