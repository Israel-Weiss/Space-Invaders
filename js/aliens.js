'use strict'

const ALIEN_SPEED = 400
var gIntervalAliens

var gAliensTopRowIdx
var gAliensBottomRowIdx
var gIsAlienFreeze = true

function createAliens(board) {
    for (var i = 0; i < ALIENS_ROW_COUNT; i++) {
        for (var j = board.length - ALIENS_ROW_LENGTH; j < board.length; j++) {
            board[i][j].gameObject = ALIEN
            gGame.aliensCount++
        }
    }
}

function handleAlienHit(pos) {
    clearInterval(gLaserInterval)
    gGame.aliensCount--

    updateScore(10)
    updateCell(pos)

    gHero.isShoot = false
    if (gGame.aliensCount === 0) gameDone()
    if (IsEmptyRow(gBoard, gAliensBottomRowIdx)) gAliensBottomRowIdx--
}

function IsEmptyRow(board, rowIdx) {
    for (var j = 1; j < board[rowIdx].length - 1; j++) {
        if (board[rowIdx][j].gameObject === ALIEN) return
    }
    return true
}

function moveAliensRight(board) {
    if (!gGame.isOn)return
    gIntervalAliens = setInterval(() => {
        shiftBoardRight(board, gAliensBottomRowIdx, gAliensTopRowIdx)
        if (checkRightEdge(board, gAliensTopRowIdx, gAliensBottomRowIdx)) {
            clearInterval(gIntervalAliens)
            setTimeout(() => {
                shiftBoardDown(board, gAliensBottomRowIdx, gAliensTopRowIdx)
                moveAliensLeft(board)
            }, ALIEN_SPEED)
        }
    }, ALIEN_SPEED)
}

function moveAliensLeft(board) {
    if (!gGame.isOn)return
    gIntervalAliens = setInterval(() => {
        shiftBoardLeft(board, gAliensBottomRowIdx, gAliensTopRowIdx)
        if (checkLeftEdge(board, gAliensTopRowIdx, gAliensBottomRowIdx)) {
            clearInterval(gIntervalAliens)
            setTimeout(() => {
                shiftBoardDown(board, gAliensBottomRowIdx, gAliensTopRowIdx)
                moveAliensRight(board)
            }, ALIEN_SPEED)

        }
    }, ALIEN_SPEED)
}

function shiftBoardRight(board, fromI, toI) {
    for (var i = fromI; i >= toI; i--) {
        for (var j = board[0].length - 3; j > 0; j--) {
            if (board[i][j].gameObject !== ALIEN) continue
            if (board[i][j + 1].gameObject) continue
            updateCell({ i, j })
            updateCell({ i, j: j + 1 }, ALIEN, ALIEN)
        }
    }
}

function shiftBoardLeft(board, fromI, toI) {
    for (var i = fromI; i >= toI; i--) {
        for (var j = 2; j < board[0].length - 1; j++) {
            if (board[i][j].gameObject !== ALIEN) continue
            if (board[i][j - 1].gameObject) continue
            updateCell({ i, j })
            updateCell({ i, j: j - 1 }, ALIEN, ALIEN)
        }
    }
}

function shiftBoardDown(board, fromI, toI) {
    for (var i = fromI; i >= toI; i--) {
        for (var j = 1; j < board[0].length - 1; j++) {
            if (board[i][j].gameObject !== ALIEN) continue
            if (board[i + 1][j].gameObject) continue
            updateCell({ i, j })
            updateCell({ i: i + 1, j }, ALIEN, ALIEN)
        }
    }
    gAliensTopRowIdx++
    gAliensBottomRowIdx++
    if (gAliensBottomRowIdx === board.length - 2) gameOver()
}

function checkRightEdge(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        if (board[i][board.length - 1].gameObject === ALIEN) return true
    }
}

function checkLeftEdge(board, fromI, toI) {
    for (var i = fromI; i <= toI; i++) {
        if (board[i][1].gameObject === ALIEN) return true
    }
}
