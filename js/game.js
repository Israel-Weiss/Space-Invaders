'use strict'

const BOARD_SIZE = 14
const ALIENS_ROW_LENGTH = 8
const ALIENS_ROW_COUNT = 3
const HERO = '🤖'
const ALIEN = '👾'
const LASER = '📍'
const SKY = 'SKY'
const WALL = 'WALL'
const FLOOR = 'FLOOR'

var gBoard
var gGame

function init() {
	clearInterval(gIntervalAliens)
	gGame = { isOn: true, aliensCount: 0, score: 0 }
	gGame.aliensCount = 0
	var board = gBoard = createBoard()
	createHero(board)
	createAliens(board)
	renderBoard(board)
	gGame.score = 0
	document.querySelector('.win').style.display = 'none'
	document.querySelector('.score').innerText = 'Score: ' + gGame.score
	gAliensTopRowIdx = 0
    gAliensBottomRowIdx = gAliensTopRowIdx + (ALIENS_ROW_COUNT - 1)
	moveAliensLeft(board)
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
	clearInterval(gIntervalAliens)
	document.querySelector('.win').style.display = 'block'
	gGame.isOn = false
}

function gameOver() {
	clearInterval(gIntervalAliens)
	document.querySelector('.win').style.display = 'block'
	gGame.isOn = false
}

