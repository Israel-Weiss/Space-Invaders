'use strict'

var LASER_SPEED = 80

var gHero
var gLaserInterval
var gLaserPos

function createHero(board) {
	var heroPos = { i: board.length - 2, j: Math.ceil(board[0].length / 2) }
	gHero = { pos: heroPos, isShoot: false, superMode: false, superModeCount: 3 }
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
		case 'n':
		case 'מ':
			clearNegs(gBoard, gLaserPos)
			break
		case 'x':
		case 'ס':
			startSuperMode(gBoard, gLaserPos)
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
	playSoundShoot()
	gHero.isShoot = true

	var nextPos = { i: pos.i - 1, j: pos.j }
	if (gBoard[nextPos.i][nextPos.j].gameObject === ALIEN) {
		handleAlienHit(nextPos)
		return
	}
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
		if (gHero.superMode) stopSuperMode()
		return
	}
	var nextPos = { i: pos.i - 1, j: pos.j }
	if (gBoard[nextPos.i][nextPos.j].gameObject === ALIEN) {
		handleAlienHit(nextPos)
		return
	}
	if (gBoard[nextPos.i][nextPos.j].gameObject === CANDIE) {
		handleCandieHit(nextPos)
		return
	}
	updateCell(nextPos, LASER, LASER)

	gLaserPos.i--
}

function clearNegs(board, pos) {
	if (!gHero.isShoot) return
	playSoundNegs()
	gHero.isShoot = false
	clearInterval(gLaserInterval)
	updateCell(pos)
	if (gHero.superMode) stopSuperMode()

	for (var i = pos.i - 1; i <= pos.i + 1; i++) {
		if (i < 0 || i === board.length - 2) continue
		for (var j = pos.j - 1; j <= pos.j + 1; j++) {
			if (j < 1 || j === board[i].length - 1) continue
			if (i === pos.i && j === pos.j) continue

			if (board[i][j].gameObject === ALIEN) {
				handleAlienHit({ i, j }, false)
			}
		}
	}
}

function startSuperMode() {
	if (!gHero.isShoot || gHero.superMode || !gHero.superModeCount) return
	playSoundSuperMode()
	gHero.superMode = true
	clearInterval(gLaserInterval)
	gLaserInterval = setInterval(() => {
		blinkLaser(gLaserPos)
	}, LASER_SPEED / 2)
	LASER = '💡'
	document.querySelector('.super-mode').innerText = 'Super mode: ' + --gHero.superModeCount
}

function stopSuperMode() {
	gHero.superMode = false
	LASER = '📍'
}

function handleCandieHit(pos) {
    playSoundCandieHit()
    clearInterval(gLaserInterval)

    updateScore(50)
    updateCell(pos)

    gHero.isShoot = false
    if (gHero.superMode) stopSuperMode()
	freezeEliens()
}

