//09/07/2023 - v1.6

//changelog
//aggiunto movimento giocatore da fermo
//aggiunto schermata iniziale
//ottimizzazione del codice
//ci salvi chi può



//prendo l'indirizzo di memoria del tag canvas tramite una funziona definita nell'oggetto document
const canvas = document.querySelector('canvas')
//ottengo le istruzioni di disegno dall'oggetto canvas e le metto in c
const c = canvas.getContext('2d')
const fps = 95
//accedo alla proprietà innerWidth e innerHeight dell'oggetto window 
canvas.width = window.innerWidth
canvas.height = window.innerHeight
//imposto la gravità del livello
const gravity = 0.5
let gameSpeed = 4
let gameFrame = 0
let lives = 3
let vittoria = new Audio("audio.mp3")
let morte = new Audio("morte.mp3")
let passo = new Audio("passo.mp3")
let splash = document.getElementById('splash_screen')
let game = document.getElementById('game')
	
function init(){
	
	gameFrame = 0
    
    let levels = {
        level: [
          {
            backgrounds: [
              {
				  x: 0, y:0, speedMod: 0.2, src: "img/mountains.png"
				},
				{
				   x:0, y: 300, speedMod: 0.5, src: "img/trees.png"
				 }],
            platforms: [
               {x: 450, y: 300, speedMod: 0, src: "img/platform1.png"
			   },
               {x: 1250, y: 350, speedMod: 2, src: "img/platform1.png"
			   },
               {x: 1650, y: 350, speedMod: 1, src: "img/platform1.png"
			  },
               {x: 3350,y: 350, speedMod: 2, src: "img/platform1.png"
			  },
               {x: 3650, y: 350, speedMod: 3, src: "img/platform1.png"
				}],
            pavements: [
                {x:0,y:535, src:"img/pavement.png"},
                {x:700,y:535,src:"img/pavement.png"},
                {x:2000, y:535,src:"img/pavement.png"},
                {x:2350, y:535,src:"img/pavement.png"},
                {x:2750,y: 535,src:"img/pavement.png"},
                {x:4000,y: 535,src:"img/pavement.png"},
               ],
            object: [
                {x:150,  y:478, src: "img/sasso1.png"},
                {x:758,  y:460, src: "img/sasso2.png"},
                {x:4250,  y:460, src: "img/premio.png"}
            ],
            enemies:[
                {x:2350,  y: 420, speedMod: 0, src: "img/cactus.png"},
                {x:2750,  y: 420, speedMod: 1, src: "img/cactus.png"}
            ]
          }] // ricomincia con background per il secondo livello
          } 
    player = new Player()
	animate()
}
//creo il game over
function printText(ctx, color, size, text1, pos){
	ctx.fillStyle = color
    ctx.font = "bold " + size + "px" + " sans-serif"
    ctx.textAlign = "center" // posizione x
    ctx.textBaseline = "middle" // posizione y
	if(pos == 0)
		ctx.fillText(text1, canvas.width / 2, canvas.height / 2)
	else
		ctx.fillText(text1, canvas.width / 2, 20)

}

//variabili che gestiscono la pressione e il rilascio dei tasti
up_pressed = false
right_pressed = false
left_pressed = false
down_pressed = false

function animate(){
	if (player.gameover)
		return

    setTimeout(() =>{
        window.requestAnimationFrame(animate)
        }, 1000 / fps)
    c.clearRect(0,0, canvas.width, canvas.height)
    if((left_pressed || right_pressed) && player.can_jump)
	passo.play()
    Background.forEach((Layer) =>{
		Layer.update()
		Layer.draw()
	})
    pavements.forEach((pavement) =>{
        pavement.draw()
    })
	 stone.forEach((stone) =>{
        stone.draw()
    })
	player.update()
	player.draw()
    platforms.forEach((platform) =>{
		 platform.update(player)
        platform.draw()
    })
   
    enemies.forEach((enemy) =>{
		enemy.update(player)
        enemy.draw()
    })
	printText(c, "white" , 24, "Current lives: " + lives, 1)
    
    //controllo le collisioni del giocatore 
    if(right_pressed && player.position.x < 400){
        player.velocity.x = 5
    }
    else if(left_pressed && player.position.x > 100){
        player.velocity.x = -5
    }
    else{
        player.velocity.x = 0
        if(right_pressed){
			gameFrame--
            platforms.forEach((platform) =>{
            platform.position.x -= 5
               })
            pavements.forEach((pavement) =>{
            pavement.position.x -= 5
        })
        stone.forEach((stone) =>{
            stone.position.x -= 5
        })
        enemies.forEach((enemy) =>{
            enemy.position.x -= 5
        })
        }
        else if(left_pressed){
			if(pavements[0].position.x == 0){
				inc = 0
				stop = 0
			}
			else{
				inc = 5
				stop = 1
			}
			gameFrame+= stop
            platforms.forEach((platform) =>{
            platform.position.x += inc
            })
            pavements.forEach((pavement) =>{
            pavement.position.x += inc
            })
            stone.forEach((stone) =>{
                stone.position.x += inc
        })
        enemies.forEach((enemy) =>{
            enemy.position.x += inc
        })
        }
    }
     //collisioni sul pavimento
    pavements.forEach((pavement) =>{
    if(player.position.y + player.height <= pavement.position.y 
        && player.position.y + player.height + player.velocity.y >= pavement.position.y 
        //controllo se il giocatore oltrepassa i bordi della piattaforma e lo faccio cadere
        && player.position.x + player.width >= pavement.position.x 
        && player.position.x + 40 <= pavement.position.x + pavement.image.width
        )
        {
            player.velocity.y = 0
            player.can_jump = true 
            player.debugFrameColor = 'black'
		}
    })
	
        if(player.position.y + player.height >= stone[2].position.y
            && player.position.y + player.height + player.velocity.y >= stone[2].position.y 
            && player.position.x + player.width >= stone[2].position.x + 30 
            && player.position.x + player.width <= stone[2].position.x + stone[2].image.width + 30
            )
            {
                player.gameover = true
                lives = 3
				printText(c, "red" , 24, "Complimenti! ti sei diplomato!", 0)
				vittoria.play()
				setTimeout(init, 3500)
            }
}

window.addEventListener('keydown',(event)=>{
   	if(window.getComputedStyle(splash).display == "block"){
		splash.style.display = "none"
		game.style.display = "block"
		init()
	}
	else{
	switch(event.key){
        case 'w':
			if(!up_pressed && player.can_jump){
            player.can_jump = false
            up_pressed = true
            player.velocity.y = -15
            }
			
        break
        case 'a':
            left_pressed = true
            player.framesY = 3
			player.goingR = false
        break
        case 's':
            down_pressed = true
        break
        case 'd':
            right_pressed = true
            player.framesY = 2
			player.goingR = true
        break
    }
	}

})

window.addEventListener('keyup',(event)=>{
    switch(event.key){
        case 'w':
            up_pressed = false
        break

        case 'a':
            left_pressed = false
            player.velocity.x = 0
        break

        case 's':
            down_pressed = false
        break

        case 'd':
            right_pressed = false
            player.velocity.x = 0
        break
    }

})
