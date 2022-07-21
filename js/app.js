'use strict'

var WALL = 'WALL'
var FLOOR = 'FLOOR'
var BALL = 'BALL'
var GAMER = 'GAMER'
var GLUE = 'GLUE'

var GAMER_IMG = '<img src="img/gamer.png" />'
var GAMERP_IMG = '<img src="img/gamer-purple.png" />'
var BALL_IMG = '<img src="img/ball.png" />'
var GLUE_IMG = '<img src="img/candy.png" />'

var gBoard
var gGamerPos
var gameOn
var gAddBallId
var gBallCount
var gAddGlueId
var gClearGlueId
var gGlueCount
var elWin = document.querySelector('.win')

function initGame() {
	gGamerPos = { i: 2, j: 9 }
	gBoard = buildBoard()
	renderBoard(gBoard)
	gameOn = true
	gBallCount = 0
	renderBallCount()
	gGlueCount = 0
	elWin.style.display = 'none'

	if (gAddBallId) clearInterval(gAddBallId)
	gAddBallId = setInterval(() => {
		addBall(gBoard)
	}, 1500)

	if (gAddGlueId) clearInterval(gAddGlueId)
	if (gClearGlueId) clearTimeout(gClearGlueId)
	gAddGlueId = setInterval(() => {
		addGlue(gBoard)
	}, 5000)
}

function buildBoard() {
	var board = createMat(10, 12)

	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			var cell = { type: FLOOR, gameElement: null }

			if (i === 0 && j !== 5
				|| i === board.length - 1 && j !== 5
				|| j === 0 && i !== 5
				|| j === board[0].length - 1 && i !== 5) {
				cell.type = WALL
			}
			board[i][j] = cell
		}
	}
	board[gGamerPos.i][gGamerPos.j].gameElement = GAMER

	return board
}

function renderBoard(board) {
	var strHTML = ''
	for (var i = 0; i < board.length; i++) {
		var strRow = '<tr>\n'
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j]
			var cellClass = 'cell-' + i + '-' + j

			if (currCell.type === FLOOR) cellClass += ' floor'
			else if (currCell.type === WALL) cellClass += ' wall'

			strRow += '\t<td class="cell ' + cellClass +
				'"  onclick="moveTo(' + i + ',' + j + ')" >\n'

			if (currCell.gameElement === GAMER) strRow += GAMER_IMG

			strRow += '\t</td>\n'
		}
		strRow += '</tr>\n'
		strHTML += strRow
	}
	var elBoard = document.querySelector('.board')
	elBoard.innerHTML = strHTML
}

function addBall(board) {
	if (gBallCount + gGlueCount < (gBoard.length - 2) * gBoard[0].length - 3) var condition = true

	while (condition) {
		var i = getRandomInt(1, board.length - 1)
		var j = getRandomInt(1, board[0].length - 1)
		var cell = gBoard[i][j]

		if (!cell.gameElement) {
			cell.gameElement = BALL
			renderCell({ i, j }, BALL_IMG)
			gBallCount++
			renderBallCount()
			condition = false
		}
	}
}

function addGlue(board) {
	if (gBallCount + gGlueCount < (gBoard.length - 2) * (gBoard[0].length - 3)) var condition = true

	while (condition) {
		var i = getRandomInt(1, board.length - 1)
		var j = getRandomInt(1, board[0].length - 1)
		var cell = gBoard[i][j]

		if (!cell.gameElement) {
			cell.gameElement = GLUE
			renderCell({ i, j }, GLUE_IMG)
			gGlueCount++
			condition = false

			gClearGlueId = setTimeout(() => {
				clearGlue({ i, j })
			}, 3000)
		}
	}
}

function clearGlue(location) {
	gBoard[location.i][location.j].gameElement = null
	gGlueCount--
	renderCell(location, null)
}

function moveTo(i, j) {
	if (!gameOn) return

	var iDiff = Math.abs(i - gGamerPos.i)
	var jDiff = Math.abs(j - gGamerPos.j)
	if (((iDiff === 1 && j === gGamerPos.j) || 
	(jDiff === 1  && i === gGamerPos.i)) === false) return

	if (i === -1) i = 9
	else if (i === 10) i = 0
	else if (j === -1) j = 11
	else if (j === 12) j = 0

	var targetCell = gBoard[i][j]
	if (targetCell.type === WALL) return

	if (targetCell.gameElement === GLUE) {
		glueStuck({ i, j })
		return
	}
	if (targetCell.gameElement === BALL) ballEat()

	step({ i, j }, GAMER_IMG)
}

function step(newLOcation, img) {
	gBoard[gGamerPos.i][gGamerPos.j].gameElement = null
	renderCell(gGamerPos, '')

	gGamerPos.i = newLOcation.i
	gGamerPos.j = newLOcation.j
	gBoard[gGamerPos.i][gGamerPos.j].gameElement = GAMER
	renderCell(gGamerPos, img)
}

function ballEat() {
	gBallCount--
	renderBallCount()
	playSound()
	if (gBallCount === 0) gameOver()
}

function glueStuck(location) {
	clearTimeout(gClearGlueId)
	gameOn = false
	setTimeout(() => {
		release(location)
	}, 3000)
	step(location, GAMERP_IMG)
	gGlueCount--
}

function release(location) {
	gBoard[location.i][location.j].gameElement = GAMER
	renderCell(gGamerPos, GAMER_IMG)
	gameOn = true
}


function renderCell(location, value) {
	var cellSelector = '.cell-' + location.i + '-' + location.j
	var elCell = document.querySelector(cellSelector)
	elCell.innerHTML = value
}

function renderBallCount() {
	var count = document.querySelector('p')
	count.innerText = 'Balls left: ' + gBallCount
}

function gameOver() {
	clearInterval(gAddBallId)
	clearInterval(gAddGlueId)
	if (gClearGlueId) clearTimeout(gClearGlueId)
	elWin.style.display = 'block'
	gameOn = false
}

function playSound() {
    var sound = new Audio("audio/poyon.mp3")
    sound.play()
}



