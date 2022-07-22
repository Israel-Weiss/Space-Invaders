'use strict'

function createMat(ROWS, COLS) {
	var mat = []
	for (var i = 0; i < ROWS; i++) {
		var row = []
		for (var j = 0; j < COLS; j++) {
			row.push('')
		}
		mat.push(row)
	}
	return mat
}

function getElCell(pos) {
	return document.querySelector('.cell-' + location.i + '-' + location.j);
}

function getRandomIntInclusive(min, max) {
return Math.floor(Math.random() * (max - min + 1) + min)
}