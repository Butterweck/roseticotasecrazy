const canvas = document.querySelector('canvas')
const c = canvas.getContext('2d')

function getRandomInt(max) {
  return Math.floor(Math.random() * max);
}

canvas.width = innerWidth - 11
canvas.height = innerHeight - 11

const bg = new Image()
bg.src = './img/bg.png'

const logo = new Image()
logo.src = './img/tasecrazy.png'

const man = new Image()
man.src = './img/man.png'

const pod = new Image()
pod.src = './img/pod.png'

const gameover = new Image()
gameover.src = './img/gameover.png'

class Player {
	constructor() {
		
		this.width = 100
		this.height = 100
		
		this.position = {
			x: (canvas.width / 2) - (this.width / 2),
			y: canvas.height - this.height - 20
		}
		
		this.velocity = {
			x: 0
		}
		
		this.firing = false
		
		this.lives = 9
		this.score = 0
		this.gameover = false
		
		const image1 = new Image()
		image1.src = './img/rose1.png'
		
		const image2 = new Image()
		image2.src = './img/rose2.png'
		
		const image1left = new Image()
		image1left.src = './img/rose1left.png'
		
		const image2left = new Image()
		image2left.src = './img/rose2left.png'
		
		const imagetase = new Image()
		imagetase.src = './img/rosetase.png'
		
		const imagetaseleft = new Image()
		imagetaseleft.src = './img/rosetaseleft.png'
		
		this.image1 = image1
		this.image2 = image2
		this.imagetase = imagetase
		this.image1left = image1left
		this.image2left = image2left
		this.imagetaseleft = imagetaseleft
		this.currentImage = 1
		this.orientation = 'right'
	}
	
	switchImages() {
		if (this.currentImage == 1) {
			this.currentImage = 2
		} else if (this.currentImage == 2) {
			this.currentImage = 1
		}
	}
	
	draw() {
		if (this.orientation == 'right') {
			if (this.firing) {
				c.drawImage(this.imagetase, this.position.x, this.position.y, this.width, this.height)
			} else {
				if (this.currentImage == 1) {
					c.drawImage(this.image1, this.position.x, this.position.y, this.width, this.height)
				} else if (this.currentImage == 2) {
					c.drawImage(this.image2, this.position.x, this.position.y, this.width, this.height)
				}
			}
		} else if (this.orientation == 'left') {
			if (this.firing) {
				c.drawImage(this.imagetaseleft, this.position.x, this.position.y, this.width, this.height)
			} else {
				if (this.currentImage == 1) {
					c.drawImage(this.image1left, this.position.x, this.position.y, this.width, this.height)
				} else if (this.currentImage == 2) {
					c.drawImage(this.image2left, this.position.x, this.position.y, this.width, this.height)
				}
			}
		}
	}
	
	update() {
		this.draw()
		this.position.x += this.velocity.x
	}
}

class Finn {
	constructor(xstart, yvelocity, xvelocity) {
		
		this.width = 100
		this.height = 100
		
		this.position = {
			x: xstart,
			y: 0
		}
		
		this.velocity = {
			x: xvelocity,
			y: yvelocity
		}
		
		this.tased = false
		this.escaped = false
		this.tasedAt = 0
		this.accounted = false
		
		const image1 = new Image()
		image1.src = './img/finn1.png'
		
		const image2 = new Image()
		image2.src = './img/finn2.png'
		
		const imagetase = new Image()
		imagetase.src = './img/finntase.png'
		
		const imagepod = new Image()
		imagepod.src = './img/pod.png'
		
		this.image1 = image1
		this.image2 = image2
		this.imagetase = imagetase
		this.imagepod = imagepod
		this.currentImage = 1
	}
	
	switchImages() {
		if (this.currentImage == 1) {
			this.currentImage = 2
		} else if (this.currentImage == 2) {
			this.currentImage = 1
		}
	}
	
	draw() {
		if (this.tased) {
			c.drawImage(this.imagetase, this.position.x, this.position.y, this.width, this.height)
		} else if (this.escaped) {
			c.drawImage(this.imagepod, this.position.x, this.position.y, this.width, this.height)
		} else {
			if (this.currentImage == 1) {
				c.drawImage(this.image1, this.position.x, this.position.y, this.width, this.height)
			} else if (this.currentImage == 2) {
				c.drawImage(this.image2, this.position.x, this.position.y, this.width, this.height)
			}
		}
	}
	
	update() {
		this.draw()
		this.position.y += this.velocity.y
		this.position.x += this.velocity.x
	}
}

class Pod {
	constructor(xstart, yvelocity) {
		
		this.width = 100
		this.height = 100
		
		this.position = {
			x: xstart,
			y: 0
		}
		
		this.velocity = {
			y: yvelocity
		}
		
		this.tased = false
		this.accounted = false
		
		const imagepod = new Image()
		imagepod.src = './img/poddown.png'
		
		this.imagepod = imagepod
	}
	
	draw() {
		c.drawImage(this.imagepod, this.position.x, this.position.y, this.width, this.height)
	}
	
	update() {
		this.draw()
		this.position.y += this.velocity.y
	}
}

const player = new Player()
const finns = []
const pods = []
const keys = {
	arrowLeft: {
		pressed: false
	},
	arrowRight: {
		pressed: false
	},
	space: {
		pressed: false
	},
	enter: {
		pressed: false
	}
}

let levellength = 5000
let finnspawnrate = 120
let podspawnrate = 1000
let finnspeed = 3
let podspeed = 5
let finnverticalspeed = 0
let finnspeedrandom = false
let firstfinn = false
let firstfinnat = 0

let frames = 0
function animate() {
	requestAnimationFrame(animate)
	if (keys.enter.pressed) {
		player.started = true
	}
	if (!player.started) {
		c.drawImage(bg, 0 , 0, bg.width * 0.5, bg.height * 0.5)
		c.drawImage(logo, canvas.width / 2 - logo.width / 2 , canvas.height / 2 - 300, logo.width, logo.height)
		c.drawImage(man, canvas.width / 2 - man.width / 2  , canvas.height / 2 , man.width, man.height)
	} else {
		if (player.gameover) {
			c.drawImage(bg, 0 , 0, bg.width * 0.5, bg.height * 0.5)
			c.drawImage(logo, canvas.width / 2 - logo.width / 2 , canvas.height / 2 - 300, logo.width, logo.height)
			c.drawImage(gameover, canvas.width / 2 - man.width / 2  , canvas.height / 2 , man.width, man.height)
			c.fillStyle = 'grey'
			c.fillRect(canvas.width / 2 + 50, canvas.height / 2 + 170, 200, 50);
			c.fillStyle = 'black'
			c.font = '30px courier-new';
			c.fillText(player.score, canvas.width / 2 + 70, canvas.height / 2 + 205)
			finns.forEach((finn, index) => {
				if (finn.escaped) {
					finn.update()
				}
			})
		} else {
			c.drawImage(bg, 0 , 0, bg.width * 0.5, bg.height * 0.5)
			c.fillStyle = 'black'
			c.font = '20px courier-new';
			score = "Score: " + player.score
			lives = "Escape Pods left: " + player.lives + " x"
			c.fillText(score, canvas.width - 150, 40)
			c.fillText(lives, 50, 40)
			c.drawImage(pod, 220, 10, pod.width * 0.2, pod.height * 0.2)
			if (firstfinn && frames < firstfinnat + 150) {
				c.font = '40px courier-new';
				c.fillText('The first Finn is away!', canvas.width / 2 - 200, canvas.height / 2)
			}	
			
			if (frames == levellength * 1) {
				finnspawnrate = 90
			}
			if (frames == levellength * 2) {
				finnspeedrandom = true
				podspawnrate = 2000
			}
			if (frames == levellength * 3) {
				finnspeed = 4
				podspeed = 6
			}
			if (frames == levellength * 4) {
				finnspawnrate = 70
			}
			if (frames == levellength * 5) {
				finnverticalspeed = 2
			}
			if (frames == levellength * 6) {
				finnspeed = 5
				podspawnrate = 10000
			}
			if (frames == levellength * 7) {
				finnspeed = 7
				finnverticalspeed = 3
			}
			
			player.update()
			if (player.lives <= 0) {
				player.gameover = true
			}
			
			coin = getRandomInt(10)
			if (frames % finnspawnrate === 0) {
				if (coin % 2 === 0) {
					xspeed = finnverticalspeed
				} else {
					xspeed = finnverticalspeed * -1
				}
				yspeed = finnspeed
				if (finnspeedrandom) {
					coin2 = getRandomInt(21)
					if (coin2 % 7 === 0) {
						yspeed += 1
					}
				}
				finns.push(new Finn(getRandomInt(canvas.width - 100), yspeed, xspeed))
			}
			
			finns.forEach((finn, index) => {
				
				if (finn.position.x <= 0 || finn.position.x >= canvas.width - 100) {
					finn.velocity.x = finn.velocity.x * -1
				}
				
				if (frames % 12 === 0) {
					finn.switchImages()
				}
				
				if (finn.position.y > canvas.height) {
					finn.escaped = true
					finn.velocity.y = -15
					finn.velocity.x = 0
					player.lives -= 1
					if (!firstfinnat) {
						firstfinn = true
						firstfinnat = frames
					}
				}
				
				if (finn.position.x >= player.position.x - player.width / 2 && finn.position.x <= player.position.x + player.width / 2 && finn.position.y >= player.position.y - player.height && finn.position.y <= canvas.height && player.firing && !finn.escaped) {
					finn.tased = true
					finn.tasedAt = frames
					finn.velocity.y = 0
					finn.velocity.x = 0
				}
				
				if (finn.tased && !finn.accounted) {
					player.score += 94
					finn.accounted = true
				}
				
				if ((finn.tased && finn.tasedAt + 250 <= frames) || (finn.escaped && finn.position.y < -20)) {
					finns.splice(index, 1)
				} else {
					finn.update()
				}
				
			})
			
			if (frames % podspawnrate === 0) {
				pods.push(new Pod(getRandomInt(canvas.width - 100), podspeed))
			}
			
			pods.forEach((pod, index) => {
				
				if (pod.accounted) {
					pods.splice(index, 1)
				} else {
					pod.update()
				}
				if (pod.position.x >= player.position.x - player.width / 2 && pod.position.x <= player.position.x + player.width / 2 && pod.position.y >= player.position.y - player.height && pod.position.y <= canvas.height && player.firing) {
					pod.tased = true
					pod.velocity.y = 0
				}
				if (pod.tased && !pod.accounted) {
					player.lives += 1
					pod.accounted = true
				}
			})
			
			if (keys.arrowLeft.pressed && player.position.x >= 0) {
				player.velocity.x = -5
				player.firing = false
				player.orientation = 'left'
				if (frames % 12 === 0) {
					player.switchImages()
				}
			} else if (keys.arrowRight.pressed && player.position.x + player.width <= canvas.width) {
				player.velocity.x = 5
				player.firing = false
				player.orientation = 'right'
				if (frames % 12 === 0) {
					player.switchImages()
				}
			} else if (keys.space.pressed) {
				player.firing = true
				player.velocity.x = 0
			} else {
				player.firing = false
				player.velocity.x = 0
			}
		}
	}
	frames++
}

animate()

addEventListener('keydown', ({key}) => {
	switch (key) {
		case 'ArrowLeft':
			keys.arrowLeft.pressed = true
			break
		case 'ArrowRight':
			keys.arrowRight.pressed = true
			break
		case ' ':
			keys.space.pressed = true
			break
		case 'Enter':
			keys.enter.pressed = true
			break
	}
})

addEventListener('keyup', ({key}) => {
	switch (key) {
		case 'ArrowLeft':
			keys.arrowLeft.pressed = false
			break
		case 'ArrowRight':
			keys.arrowRight.pressed = false
			break
		case ' ':
			keys.space.pressed = false
			break
		case 'Enter':
			keys.enter.pressed = false
			break
	}
})