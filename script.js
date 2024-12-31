//28/12/2024 - v1.6.5

//changelog
//aggiunto movimento al nemico (ty myself)
//ottimizzazione del codice
//ci salvi chi può



//prendo l'indirizzo di memoria del tag canvas tramite una funziona definita nell'oggetto document
const canvas = document.querySelector('canvas')
//ottengo le istruzioni di disegno dall'oggetto canvas e le metto in c
const c = canvas.getContext('2d')
const fps = 80
//accedo alla proprietà innerWidth e innerHeight dell'oggetto window 
canvas.width = window.innerWidth
canvas.height = window.innerHeight
//imposto la gravità del livello
const gravity = 0.5
let next = 1
let levels = {}
let gameSpeed = 4
let gameFrame = 0
let lives = 3
let Music = new Audio("sounds/Music.mp3") 
Music.loop = true
let Victory = new Audio("sounds/Victory.mp3")
let Death = new Audio("sounds/Death.mp3")
let Steps = new Audio("sounds/Steps.mp3")
let splash = document.getElementById('splash_screen')
let game = document.getElementById('game')

//creo il caricatore di munizioni
let caricatore_player = []
let proiettili_player = 3

//creo il caricatore di munizioni per il nemico
let caricatore_nemico = []
let proiettili_nemico = 3
	
function init(){
    Music.play()
	gameFrame = 0
    levels = {
        level: [
            {
            backgrounds:[
				new Layer(0, 0, 0.2, "img/mountains.png"),
                new Layer(0, 300, 0.5, "img/trees.png")
				],
            platforms:[     
                new Platform(450, 300, 0,"img/platform1.png"),
                new Platform(1250,350, 2, "img/platform1.png"),
                new Platform(1650, 350, 1, "img/platform1.png"),
                new Platform(3350,350, 2, "img/platform1.png"),
                new Platform(3650, 350, 3, "img/platform1.png")
                ],
            pavements:[ 
                new Pavement(0,535,"img/pavement.png"),
                new Pavement(700,535,"img/pavement.png"),
                new Pavement(2000, 535,"img/pavement.png"),
                new Pavement(2350, 535,"img/pavement.png"),
                new Pavement(2750,535,"img/pavement.png"),
                new Pavement(4000,535,"img/pavement.png")
                ],
            stones:[
                new genericObject(150,  478, "img/sasso1.png"),
                new genericObject(758,  460, "img/sasso2.png"),
                new genericObject(4250,  460, "img/premio.png")
                ],
            Obstacles:[
                new Obstacle(2350,  420,0, "img/cactus.png"),
                new Obstacle(2750,  420,1, "img/cactus.png")
                ]
            }, 
            // dati del secondo livello
            {
              backgrounds:[
                  new Layer(0, 0, 0.2, "img/mountains.png"),
                  new Layer(0, 300, 0.5, "img/trees.png")
                  ],
              platforms:[     
                  //new Platform(450, 300, 0,"img/platform1.png"),
                  new Platform(1250,350, 2, "img/platform1.png"),
                  new Platform(1650, 350, 1, "img/platform1.png"),
                  new Platform(3350,350, 2, "img/platform1.png"),
                  new Platform(3650, 350, 3, "img/platform1.png")
                  ],
              pavements:[ 
                  //new Pavement(0,535,"img/pavement.png"),
                  new Pavement(700,535,"img/pavement.png"),
                  new Pavement(2000, 535,"img/pavement.png"),
                  new Pavement(2350, 535,"img/pavement.png"),
                  new Pavement(2750,535,"img/pavement.png"),
                  new Pavement(4000,535,"img/pavement.png")
                  ],
              stones:[
                  //new genericObject(150,  478, "img/sasso1.png"),
                  new genericObject(758,  460, "img/sasso2.png"),
                  new genericObject(4250,  460, "img/premio.png")
                  ],
              enemies:[
                  new Enemy(2600, 442)
              ]
            }
        ]
    } 

    for(let i = 0; i<proiettili_nemico; i++)
	{	
        caricatore_nemico.push(new Enemy_paperplane())
	}

    player = new Player()
    console.log(caricatore_nemico)

    //if(next > 0)
    //    enemy = new Enemy(500, 420)
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
        Steps.play()
    levels.level[next].backgrounds.forEach(Layer =>{
        Layer.update()
        Layer.draw()
    })
    levels.level[next].pavements.forEach(pavement =>{
        pavement.draw()
    })
	levels.level[next].stones.forEach(stone =>{
        stone.draw()
    })
	player.update()
	player.draw()
    if(levels.level[next].enemies){
        levels.level[next].enemies[0].update(player)
        levels.level[next].enemies[0].draw()
    }
    //if(next > 0){
    //    enemy.update()
	//    enemy.draw()
    //}
    levels.level[next].platforms.forEach(platform =>{
        platform.update(player)
        platform.draw()
    })
    //console.log(levels.level[next].enemies)
    if(levels.level[next].Obstacles)  
        levels.level[next].Obstacles.forEach(Obstacle =>{
            Obstacle.update(player)
            Obstacle.draw()
    })
	printText(c, "white" , 24, "Current lives: " + lives, 1)
    
    //controllo le collisioni del giocatore 
    if(right_pressed && player.position.x < (window.screen.width-77)/2){
        player.velocity.x = 5
    }
    else if(left_pressed && player.position.x > (window.screen.width-144)/2){
        player.velocity.x = -5
    }
    else{
        player.velocity.x = 0
        if(right_pressed){
			gameFrame--
            levels.level[next].platforms.forEach((platform) =>{
            platform.position.x -= 5
            })
            levels.level[next].pavements.forEach((pavement) =>{
            pavement.position.x -= 5
            //console.log(enemy.position.x)
        })
        if(levels.level[next].enemies){
            levels.level[next].enemies[0].position.x -= 5
            //console.log(enemy.position.x)
        }
        levels.level[next].stones.forEach((stone) =>{
            stone.position.x -= 5
        })
        if(levels.level[next].Obstacles)  
            levels.level[next].Obstacles.forEach((Obstacle) =>{
                Obstacle.position.x -= 5
            })
        }
        else if(left_pressed){
			if(levels.level[next].pavements[0].position.x == 0){
				inc = 0
				stop = 0
			}
			else{
				inc = 5
				stop = 1
			}
			gameFrame+= stop
            levels.level[next].platforms.forEach((platform) =>{
            platform.position.x += inc
            })
            levels.level[next].pavements.forEach((pavement) =>{
            pavement.position.x += inc
            })
            levels.level[next].stones.forEach((stone) =>{
                stone.position.x += inc
        })
        if(levels.level[next].enemies){
            levels.level[next].enemies[0].position.x += inc
            //console.log(enemy.position.x)
        }
        if(levels.level[next].Obstacles)
            levels.level[next].Obstacles.forEach((Obstacle) =>{
                Obstacle.position.x += inc
            })
        }
    }
     //collisioni sul pavimento
    levels.level[next].pavements.forEach((pavement) =>{
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
	
        if(player.position.y + player.height >= levels.level[next].stones[1].position.y
            && player.position.y + player.height + player.velocity.y >= levels.level[next].stones[1].position.y 
            && player.position.x + player.width >= levels.level[next].stones[1].position.x + 30 
            && player.position.x + player.width <= levels.level[next].stones[1].position.x + levels.level[next].stones[1].image.width + 30
            )
            {
                /*if(next != 1)
                    next +=1
                else
                    next = 0*/
                Music.pause()
                player.gameover = true
                lives = 3
				printText(c, "red" , 24, "Complimenti! ti sei diplomato!", 0)
				Victory.play()
				setTimeout(init, 5000)
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
			player.goingR = false
        break
        case 's':
            down_pressed = true
        break
        case 'd':
            right_pressed = true
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
