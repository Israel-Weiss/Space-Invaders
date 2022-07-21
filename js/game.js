'use strict'

var BOARD_SIZE = 14
var ALIENS_ROW_LENGTH = 8
var ALIENS_ROW_COUNT = 3
const HERO = '🤖'
const ALIEN = '👾'
var LASER = '📍'
const SKY = 'SKY'
const WALL = 'WALL'
const FLOOR = 'FLOOR'

var gBoard
var gGame

function init() {
	clearInterval(gIntervalAliens)
	clearTimeout(gTimeOutlAliens)
	gGame = { isOn: false, aliensCount: 0, score: 0, }

	gBoard = createBoard()
	createHero(gBoard)
	createAliens(gBoard)
	renderBoard(gBoard)

	gGame.score = 0
	document.querySelector('.modal').style.display = 'none'
	document.querySelector('.score').innerText = 'Score: ' + gGame.score
	document.querySelector('.super-mode').innerText = 'Super mode: ' + gHero.superModeCount
	gAliensTopRowIdx = 0
	gAliensBottomRowIdx = gAliensTopRowIdx + (ALIENS_ROW_COUNT - 1)
}

function levelGame(level) {
	if (level === 1) {

		BOARD_SIZE = 10
		ALIENS_ROW_LENGTH = 6
		ALIENS_ROW_COUNT = 2
		ALIEN_SPEED = 800
		LASER_SPEED = 120

	} else if (level === 2) {

		BOARD_SIZE = 14
		ALIENS_ROW_LENGTH = 8
		ALIENS_ROW_COUNT = 3
		ALIEN_SPEED = 500
		LASER_SPEED = 80

	} else if (level = 1) {

		BOARD_SIZE = 16
		ALIENS_ROW_LENGTH = 10
		ALIENS_ROW_COUNT = 4
		ALIEN_SPEED = 300
		LASER_SPEED = 40
	} 
	
	init()
}

function restartGame() {
	init()
	startGame()
}

function startGame() {
	if (gGame.isOn) return
	gGame.isOn = true
	playSoundStart()
	moveAliensLeft(gBoard)
}

function createBoard() {
	var board = createMat(BOARD_SIZE + 1, BOARD_SIZE + 2)

	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			var cell = { type: SKY, gameObject: null }

			if (i === board.length - 1) cell = FLOOR
			if (j === 0 || j === board[0].length - 1) cell = WALL

			board[i][j] = cell
		}
	}
	return board
}

function renderBoard(board) {
	var strHTML = ''
	for (var i = 0; i < board.length; i++) {
		for (var j = 0; j < board[0].length; j++) {
			var currCell = board[i][j]

			var cellClass = 'cell-' + i + '-' + j
			if (currCell === FLOOR) cellClass += ' floor'
			else if (currCell === WALL) cellClass += ' wall'

			strHTML += `\t<td class="cell ${cellClass}">\n`

			if (currCell.gameObject === ALIEN) strHTML += ALIEN
			if (currCell.gameObject === HERO) strHTML += HERO

			strHTML += '\t</td>\n'
		}
		strHTML += '</tr>\n'
	}
	document.querySelector('.board').innerHTML = strHTML
}

function updateCell(pos, gameObject = null, display = '') {
	gBoard[pos.i][pos.j].gameObject = gameObject

	var cellSelector = '.cell-' + pos.i + '-' + pos.j
	document.querySelector(cellSelector).innerHTML = display
}

function renderCell(location, value) {
	var cellSelector = '.cell-' + location.i + '-' + location.j
	var elCell = document.querySelector(cellSelector)
	elCell.innerHTML = value
}

function updateScore(diff) {
	gGame.score += diff
	document.querySelector('.score').innerText = 'Score: ' + gGame.score
}

function gameDone() {
	playSoundWin()
	gGame.isOn = false
	var elModal = document.querySelector('.modal')
	elModal.innerHTML = '👑 YOU WON!👑<br><button onmousedown="restartGame()">restart</button>'
	elModal.style.backgroundColor = 'rgb(9, 241, 28)'
	elModal.style.color = 'rgb(5, 34, 121)'
	elModal.style.display = 'block'
}

function gameOver() {
	playSoundLos()
	gGame.isOn = false
	var elModal = document.querySelector('.modal')
	elModal.innerHTML = 'GAME OVER!!<br><button onmousedown="restartGame()">restart</button>'
	elModal.style.backgroundColor = 'red'
	elModal.style.color = 'yellow'
	elModal.style.display = 'block'
}
