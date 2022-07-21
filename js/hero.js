'use strict'

const LASER_SPEED = 30

var gHero
var gLaserInterval
var gLaserPos

function createHero(board) {
	var heroPos = { i: board.length - 2, j: Math.ceil(board[0].length / 2) }
	gHero = { pos: heroPos, isShoot: false }
	board[gHero.pos.i][gHero.pos.j].gameObject = HERO
}

function handleKey(ev) {
	if (!gGame.isOn) return

	switch (ev.key) {
		case 'ArrowLeft':
		case 'a':
			moveHero(-1)
			break
		case 'ArrowRight':
		case 'd':
			moveHero(1)
			break
		case ' ':
			shoot(gHero.pos)
			break
	}
}

function moveHero(dir) {
	var nextCol = gHero.pos.j + dir
	var nextCell = gBoard[gHero.pos.i][nextCol]
	if (nextCell.type !== SKY) return

	updateCell(gHero.pos)

	gHero.pos.j = nextCol
	updateCell(gHero.pos, HERO, HERO)
}

function shoot(pos) {
	if (gHero.isShoot) return
	gHero.isShoot = true

	var nextPos = { i: pos.i - 1, j: pos.j }
	updateCell(nextPos, LASER, LASER)
	gLaserPos = nextPos

	gLaserInterval = setInterval(() => {
		blinkLaser(gLaserPos)
	}, LASER_SPEED)
}

function blinkLaser(pos) {
	updateCell(pos)

	if (gLaserPos.i === 0) {
		clearInterval(gLaserInterval)
		gHero.isShoot = false
		return
	}
	var nextPos = { i: pos.i - 1, j: pos.j }
	if (gBoard[nextPos.i][nextPos.j].gameObject === ALIEN) {
		handleAlienHit(nextPos)
		return
	}
	updateCell(nextPos, LASER, LASER)

	gLaserPos.i--
}


