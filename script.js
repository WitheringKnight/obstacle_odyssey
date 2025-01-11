//11/01/2025 - v1.7.5

//-aggiunto livello corrente 
//-cambiato colore carattere vite 
//-aggiunto un secondo nemico sulla piattaforma roteante 
//-modificato enemy[0] con il foreach 
//-aggiunto il suono dei passi nel secondo livello 

//da fare
//-(opzionale) cambiare background nel gameover
//-(opzionale) stoppare il nemico finchè non sono stati lanciati tutti i proiettili



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
let lives = 3
let Music = new Audio("sounds/Music.mp3") 
Music.loop = true
let Victory = new Audio("sounds/Victory.mp3")
let Death = new Audio("sounds/Death.mp3")
let splash = document.getElementById('splash_screen')
let game = document.getElementById('game')

//creo il caricatore di munizioni
let caricatore_player = []
let proiettili_player = 3

//creo il caricatore di munizioni per il nemico
let caricatore_nemico = []
let proiettili_nemico = 3
	
function init() {
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
                new Platform(1250,350, 3, "img/platform1.png"),
                new Platform(1650, 350, 1, "img/platform1.png"),
                new Platform(3350,350, 3, "img/platform1.png"),
                new Platform(3650, 350, 4, "img/platform1.png")
                ],
            pavements:[ 
                new Pavement(700,535,"img/pavement.png"),
                new Pavement(2000, 535,"img/pavement.png"),
                new Pavement(2350, 535,"img/pavement.png"),
                new Pavement(2750,535,"img/pavement.png"),
                new Pavement(4000,535,"img/pavement.png"),
                new Pavement(4400,535,"img/pavement.png"),
                new Pavement(4800,535,"img/pavement.png")
                ],
            stones:[
                new genericObject(758,  460, "img/sasso2.png")
                ],
            steps:[
                new Audio("sounds/Steps.mp3")
            ],
            Obstacles:[
                new Obstacle(2350,  420,0, "img/cactus.png"),
                new Obstacle(2750,  420,1, "img/cactus.png")
                ], 
            KeyObject:[
                new genericObject(4250, 350, "img/ScuolaBus.png")
            ]

            }, 
            // dati del secondo livello
            {
              backgrounds:[
                  new Layer(0, 0, 0.2, "img/corridoio_scuola.png")
                  ],
              platforms:[     
                  new Platform(1250,350, 3, "img/platform2.png"),
                  new Platform(1650, 350, 1, "img/platform2.png"),
                  new Platform(3350,350, 2, "img/platform2.png"),
                  new Platform(3650, 350, 1, "img/platform2.png"),
                  new Platform(4700, 350, 5, "img/platform2.png")
                  ],
              pavements:[ 
                  new Pavement(700,535,"img/pavement_2.png"),
                  new Pavement(2000, 535,"img/pavement_2.png"),
                  new Pavement(2350, 535,"img/pavement_2.png"),
                  new Pavement(2750, 535,"img/pavement_2.png"),
                  new Pavement(4050, 535,"img/pavement_2.png"),
                  new Pavement(5100, 535,"img/pavement_2.png")
                  ],
              stones:[
                  //new genericObject(758,  460, "img/sasso2.png")
                ],
              steps:[
                    new Audio("sounds/StepsOnWood.mp3")
              ],
              enemies:[
                  new Enemy(2600, 442, true),
                  new Enemy(4700+(200-85)/2, 257, false)
                ],
              KeyObject:[
                    new genericObject(5300, 285, "img/door_2.png")
              ]

            }
        ]
    } 

    //solo secondo livello, da modificare
    if (next == 1)
    {
        for (let i = 0; i < proiettili_nemico; i++)
            caricatore_nemico.push(new Enemy_paperplane())

    }
    

    player = new Player()
    
	animate()
}

//variabili che gestiscono la pressione e il rilascio dei tasti
up_pressed = false
right_pressed = false
left_pressed = false
down_pressed = false
function animate() {

	if (player.gameover)
		return

    //setTimeout(() =>{
    //    window.requestAnimationFrame(animate)
    //}, 1000 / fps)

    window.requestAnimationFrame(animate)

    c.clearRect(0,0, canvas.width, canvas.height)
    if ((left_pressed || right_pressed) && player.can_jump)
    {
        levels.level[next].steps.forEach(step => {
            step.play()
        })
    }
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
    levels.level[next].KeyObject.forEach(KeyObject => {
        KeyObject.draw()
    })
	player.update()
    player.draw()

    if (caricatore_nemico && next == 1)
    {
        caricatore_nemico.forEach(proiettile => {
            proiettile.update(player)
            proiettile.draw()
        })
    }
    
    levels.level[next].enemies.forEach(enemy => {
        enemy.update(player)
        enemy.draw()
    })
    
    levels.level[next].platforms.forEach(platform =>{
        platform.update(player)
        platform.draw()
    })
    if(levels.level[next].Obstacles)  
        levels.level[next].Obstacles.forEach(Obstacle =>{
            Obstacle.update(player)
            Obstacle.draw()
    })
    printText(c, "#404040", 24, "Lives: " + lives, canvas.width / 2, 20)
    printText(c, "#404040" , 24, "Current level: " + (next+1), 120, 20)
    
    if (right_pressed)
    {
        inc = 5
        stop = 1

        if (next == 1) {
            for (let i = 0; i < caricatore_nemico.length; i++)
            {
                if (!caricatore_nemico[i].available && caricatore_nemico[i].goingR)
                    caricatore_nemico[i].position.x -= 3
                else
                    caricatore_nemico[i].position.x -= inc
            }
        }

        //questo forEach serve ad uniformare la velocita di
        //scorrimento in entrambe le direzioni
        levels.level[next].backgrounds.forEach((layer) => {
		    gameFrame-= stop
        })

        levels.level[next].platforms.forEach((platform) => {
            if (platform.movable == 5)
                platform.rotating_x -= inc
            else
                platform.position.x -= inc
        })
        levels.level[next].pavements.forEach((pavement) =>{
            pavement.position.x -= inc
        })

        if (levels.level[next].enemies)
        {
            levels.level[next].enemies.forEach(enemy => {
                if(enemy.movable)
                    enemy.position.x -= inc
                else
                    enemy.rotating_x -= inc
            })
        }

        levels.level[next].stones.forEach((stone) =>{
            stone.position.x -= inc
        })
        levels.level[next].KeyObject.forEach((keyobject) => {
            keyobject.position.x -= inc
        })
        if(levels.level[next].Obstacles)  
        levels.level[next].Obstacles.forEach((Obstacle) =>{
            Obstacle.position.x -= inc
        })
    }
    else if (left_pressed)
    {
        inc = 5
        stop = 1
        
        if (next == 1)
        {
            for (let i = 0; i < caricatore_nemico.length; i++)
            {
                if (!caricatore_nemico[i].available && !caricatore_nemico[i].goingR)
                    caricatore_nemico[i].position.x += 3
                else
                    caricatore_nemico[i].position.x += inc
                
            }
        }

        levels.level[next].backgrounds.forEach((layer) => { 
            if (layer.x < 0)
		        gameFrame+= stop
        })
        levels.level[next].platforms.forEach((platform) => {
            if (platform.movable == 5)
                platform.rotating_x += inc
            else
                platform.position.x += inc
        })
        levels.level[next].pavements.forEach((pavement) =>{
        pavement.position.x += inc
        })
        levels.level[next].stones.forEach((stone) =>{
            stone.position.x += inc
        })
        levels.level[next].KeyObject.forEach((keyobject) => {
            keyobject.position.x += inc
        })
        if (levels.level[next].enemies)
        {
            levels.level[next].enemies.forEach(enemy => {
                if (enemy.movable)
                    enemy.position.x += inc
                else
                    enemy.rotating_x += inc
            })
        }
        if(levels.level[next].Obstacles)
            levels.level[next].Obstacles.forEach((Obstacle) =>{
                Obstacle.position.x += inc
            })
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

    next == 0 ? offset_x = 309 : offset_x = 30 
        if(player.position.y + player.height >= levels.level[next].KeyObject[0].position.y
            && player.position.y + player.height + player.velocity.y >= levels.level[next].KeyObject[0].position.y 
            && player.position.x + player.width >= levels.level[next].KeyObject[0].position.x + offset_x 
            && player.position.x + player.width <= levels.level[next].KeyObject[0].position.x + levels.level[next].KeyObject[0].image.width + offset_x
            )
            {
                Music.pause()
                player.gameover = true
                caricatore_nemico = []
                lives = 3
				printText(c, "red" , 24, "Livello " + (next+1) + " completato!", canvas.width/2, canvas.height/2)
				Victory.play()
                if(next != 1)
                    next +=1
                else
                    next = 0
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
        break

        case 's':
            down_pressed = false
        break

        case 'd':
            right_pressed = false
        break
    }

})

//funzioni
    
async function sparaAeroplanino(enemy)
{
    if (contaAvailable() == 3)
    {
        enemy.outOfBullets = false

        for (let i = 0; i < caricatore_nemico.length; i++)
        {
            if (i == 0)
            {
                caricatore_nemico[i].available = false
                caricatore_nemico[i].goingR = enemy.goingR
                caricatore_nemico[i].position.x = enemy.position.x
                caricatore_nemico[i].position.y = enemy.position.y

            }
            else
            {
                await new Promise(resolve => {
                    setTimeout(() => {
                        caricatore_nemico[i].available = false
                        caricatore_nemico[i].goingR = enemy.goingR
                        caricatore_nemico[i].position.x = enemy.position.x
                        caricatore_nemico[i].position.y = enemy.position.y
                        resolve(); // Risolvi la promessa quando il setTimeout è finito
                    }, 1000);
                });
            }
        }
        enemy.outOfBullets = true
    }
}

function contaAvailable() {
    let conta = 0
    for (let i = 0; i < caricatore_nemico.length; i++) {
        if (caricatore_nemico[i].available)
            conta++
    }
    return conta
}

function printText(ctx, color, size, text1, x, y) {
    ctx.fillStyle = color
    ctx.font = "bold " + size + "px" + " sans-serif"
    ctx.textAlign = "center" // posizione x
    ctx.textBaseline = "middle" // posizione y
    ctx.fillText(text1, x, y)
    

}

function gameOver(player)
{
    player.gameover = true
    lives--
    caricatore_nemico = []
    setTimeout(init, 25)
}