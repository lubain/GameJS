/** @format */

"use strict"; //est un directive qui : -Détecte les erreurs accrue, -Optimisela performance

// Associer la touche Échap à la fermeture de la boîte de dialogue modale.
document.onkeypress = function (evt) {
	evt = evt || window.event;
	var modal = document.getElementsByClassName("modal")[0];
	if (evt.keyCode === 27) {
		modal.style.display = "none";
	}
};

// Lorsque l'utilisateur clique n'importe où en dehors de la boîte de dialogue modale, fermez-la.
window.onclick = function (evt) {
	var modal = document.getElementsByClassName("modal")[0];
	if (evt.target === modal) {
		modal.style.display = "none";
	}
};

function sumArray(array) {
	var sum = 0,
		i = 0;
	for (i = 0; i < array.length; i++) {
		sum += array[i];
	}
	return sum;
}

function isInArray(element, array) {
	if (array.indexOf(element) > -1) {
		return true;
	}
	return false;
}

function shuffleArray(array) {
	var counter = array.length,
		temp,
		index;
	while (counter > 0) {
		index = Math.floor(Math.random() * counter);
		counter--;
		temp = array[counter];
		array[counter] = array[index];
		array[index] = temp;
	}
	return array;
}

function intRandom(min, max) {
	var rand = min + Math.random() * (max + 1 - min);
	return Math.floor(rand);
}

// VARIABLES GLOBAL
var moves = 0,
	winner = 0,
	x = 1,
	o = 3,
	player = x,
	computer = o,
	whoseTurn = x,
	gameOver = false,
	score = {
		ties: 0,
		player: 0,
		computer: 0,
	},
	xText = '<span class="x">&times;</class>',
	oText = '<span class="o">o</class>',
	playerText = xText,
	computerText = oText,
	difficulty = 1,
	choixOp = 1,
	grille = null;

// OBJET GRID

// Constructeur de la grille
//=================
function Grid() {
	// fonction constructeur qui represente une Grille
	this.cells = new Array(9); // crée une propriété cells pour l'objet Grid
}

// Méthodes de la grille
//=============

// Obtenir des cellules libres dans un tableau.
// Renvoie un tableau d'indices dans le tableau d'origine Grid.cells, pas les valeurs.
// des éléments du tableau.
// Leurs valeurs peuvent être accédées en tant que Grid.cells[index].
Grid.prototype.getFreeCellIndices = function () {
	// est une méthode de l'objet Grid.  pour obtenir les indices des cellules de la grille qui sont actuellement vides (non occupées par les joueur ou l'ordinateur)
	var i = 0,
		resultArray = [];
	for (i = 0; i < this.cells.length; i++) {
		if (this.cells[i] === 0) {
			resultArray.push(i);
		}
	}

	return resultArray;
};

// Obtenir une ligne (accepte 0, 1 ou 2 en argument).
// Renvoie les valeurs des éléments.
Grid.prototype.getRowValues = function (index) {
	// est une méthode de l'objet Grid. pour obtenir les valeurs des cellules d'une rangée spécifique de la grille en fonction de l'indice de la rangée fourni en argument.
	if (index !== 0 && index !== 1 && index !== 2) {
		console.error("Wrong arg for getRowValues!");
		return undefined;
	}
	var i = index * 3;
	return this.cells.slice(i, i + 3); //  la méthode slice pour extraire un sous-tableau de this.cells. Le sous-tableau contient les valeurs des trois cellules de la rangée spécifiée
};

// Obtenir une ligne (accepte 0, 1 ou 2 en argument).
// Renvoie un tableau avec les indices, pas leurs valeurs.
Grid.prototype.getRowIndices = function (index) {
	// est une méthode de l'objet Grid. pour obtenir les indices des cellules d'une rangée spécifique de la grille
	if (index !== 0 && index !== 1 && index !== 2) {
		console.error("Wrong arg for getRowIndices!");
		return undefined;
	}
	var row = [];
	index = index * 3;
	row.push(index);
	row.push(index + 1);
	row.push(index + 2);
	return row;
};

// Obtenir les valeurs d'une colonne
Grid.prototype.getColumnValues = function (index) {
	if (index !== 0 && index !== 1 && index !== 2) {
		console.error("Wrong arg for getColumnValues!");
		return undefined;
	}
	var i,
		column = [];
	for (i = index; i < this.cells.length; i += 3) {
		column.push(this.cells[i]);
	}
	return column;
};

// Obtenir les indices d'une colonne
Grid.prototype.getColumnIndices = function (index) {
	if (index !== 0 && index !== 1 && index !== 2) {
		console.error("Wrong arg for getColumnIndices!");
		return undefined;
	}
	var i,
		column = [];
	for (i = index; i < this.cells.length; i += 3) {
		column.push(i);
	}
	return column;
};

// Obtenir les cellules de la diagonale
// arg 0 : depuis le coin supérieur gauche
// arg 1 : depuis le coin supérieur droit
Grid.prototype.getDiagValues = function (arg) {
	var cells = [];
	if (arg !== 1 && arg !== 0) {
		console.error("Wrong arg for getDiagValues!");
		return undefined;
	} else if (arg === 0) {
		cells.push(this.cells[0]);
		cells.push(this.cells[4]);
		cells.push(this.cells[8]);
	} else {
		cells.push(this.cells[2]);
		cells.push(this.cells[4]);
		cells.push(this.cells[6]);
	}
	return cells;
};

// Obtenir les cellules de la diagonale
// arg 0 : depuis le coin supérieur gauche
// arg 1 : depuis le coin supérieur droit
Grid.prototype.getDiagIndices = function (arg) {
	if (arg !== 1 && arg !== 0) {
		console.error("Wrong arg for getDiagIndices!");
		return undefined;
	} else if (arg === 0) {
		return [0, 4, 8];
	} else {
		return [2, 4, 6];
	}
};

// Obtenir le premier indice avec deux éléments consécutifs (accepte 'computer' ou 'player' en argument)
Grid.prototype.getFirstWithTwoInARow = function (agent) {
	if (agent !== computer && agent !== player) {
		console.error(
			"Function getFirstWithTwoInARow accepts only player or computer as argument."
		);
		return undefined;
	}
	var sum = agent * 2,
		freeCells = shuffleArray(this.getFreeCellIndices());
	for (var i = 0; i < freeCells.length; i++) {
		for (var j = 0; j < 3; j++) {
			var rowV = this.getRowValues(j);
			var rowI = this.getRowIndices(j);
			var colV = this.getColumnValues(j);
			var colI = this.getColumnIndices(j);
			if (sumArray(rowV) == sum && isInArray(freeCells[i], rowI)) {
				return freeCells[i];
			} else if (sumArray(colV) == sum && isInArray(freeCells[i], colI)) {
				return freeCells[i];
			}
		}
		for (j = 0; j < 2; j++) {
			var diagV = this.getDiagValues(j);
			var diagI = this.getDiagIndices(j);
			if (sumArray(diagV) == sum && isInArray(freeCells[i], diagI)) {
				return freeCells[i];
			}
		}
	}
	return false;
};

Grid.prototype.reset = function () {
	for (var i = 0; i < this.cells.length; i++) {
		this.cells[i] = 0;
	}
	return true;
};

// exécuté lorsque la page se charge
function initialize() {
	grille = new Grid(); // pour initialiser les propriétés de l'objet.
	moves = 0;
	winner = 0;
	gameOver = false;
	whoseTurn = player; // par défaut, cela peut changer
	for (var i = 0; i <= grille.cells.length - 1; i++) {
		grille.cells[i] = 0;
	}
	// setTimeout(assignRoles, 500);
	setTimeout(showOptions, 500);
}

// Exécuté lorsque le joueur clique sur l'une des cellules de la table.
function cellClicked(id) {
	// The last character of the id corresponds to the numeric index in Grid.cells:
	var idName = id.toString();
	var cell = parseInt(idName[idName.length - 1]);
	if (choixOp === 1) {
		if (grille.cells[cell] > 0 || whoseTurn !== player || gameOver) {
			// cell is already occupied or something else is wrong
			return false;
		}
		moves += 1;
		document.getElementById(id).innerHTML = playerText;
		// randomize orientation (for looks only)
		var rand = Math.random();
		if (rand < 0.3) {
			document.getElementById(id).style.transform = "rotate(180deg)";
		} else if (rand > 0.6) {
			document.getElementById(id).style.transform = "rotate(90deg)";
		}
		document.getElementById(id).style.cursor = "default";
		grille.cells[cell] = player;
		// Test if we have a winner:
		if (moves >= 5) {
			winner = checkWin();
		}
		if (winner === 0 && choixOp === 1) {
			whoseTurn = computer;
			makeComputerMove();
		}
		return true;
	} else {
		if (grille.cells[cell] > 0 || gameOver) {
			return false;
		}
		if (whoseTurn === player) {
			// Le joueur actuel joue
			moves += 1;
			document.getElementById(id).innerHTML = playerText;
			document.getElementById(id).style.cursor = "default";
			grille.cells[cell] = player;
		} else {
			// L'autre joueur joue
			moves += 1;
			document.getElementById(id).innerHTML = computerText;
			document.getElementById(id).style.cursor = "default";
			grille.cells[cell] = computer;
		}

		// Test si nous avons un gagnant
		if (moves >= 5) {
			winner = checkWin();
		}

		if (winner === 0) {
			// Alternez entre les joueurs
			whoseTurn = whoseTurn === player ? computer : player;
		}
	}
}

// Executed when player hits restart button.
// ask should be true if we should ask users if they want to play as X or O
function restartGame(ask) {
	if (choixOp === 1) {
		if (moves > 0) {
			var response = confirm("Are you sure you want to start over?");
			if (response === false) {
				return;
			}
		}
	}
	gameOver = false;
	moves = 0;
	winner = 0;
	whoseTurn = x;
	grille.reset();
	for (var i = 0; i <= 8; i++) {
		var id = "cell" + i.toString();
		document.getElementById(id).innerHTML = "";
		document.getElementById(id).style.cursor = "pointer";
		document.getElementById(id).classList.remove("win-color");
	}
	if (ask === true) {
		// setTimeout(assignRoles, 200);
		setTimeout(showOptions, 200);
	} else if (whoseTurn == computer) {
		if (choixOp === 1) {
			setTimeout(makeComputerMove, 800);
		}
	}
}

// The core logic of the game AI:
function makeComputerMove() {
	if (gameOver) {
		return false;
	}
	var cell = -1, //  pour stocker l'indice de la cellule que l'ordinateur choisira
		tab = [], // pour stocker les indices des cellules disponibles
		corners = [0, 2, 6, 8]; // pour stocker les indices des coins de la grille
	if (moves >= 3) {
		// gère la stratégie de l'ordinateur lorsque le nombre de coups joués est supérieur ou égal à 3. L'ordinateur commence par chercher s'il peut gagner en jouant son prochain coup en utilisant grille.getFirstWithTwoInARow(computer). S'il ne peut pas gagner, il vérifie s'il doit bloquer le joueur en utilisant grille.getFirstWithTwoInARow(player). Si aucune des deux situations ne s'applique, il décide d'occuper le centre s'il est disponible (cellule 4) ou de choisir une cellule libre au hasard
		cell = grille.getFirstWithTwoInARow(computer);
		if (cell === false) {
			cell = grille.getFirstWithTwoInARow(player);
		}
		if (cell === false) {
			if (grille.cells[4] === 0 && difficulty == 1) {
				cell = 4;
			} else {
				tab = grille.getFreeCellIndices();
				cell = tab[intRandom(0, tab.length - 1)];
			}
		}
		// Éviter une situation de cercle vicieux :
		if (
			moves == 3 &&
			grille.cells[4] == computer &&
			player == x &&
			difficulty == 1
		) {
			if (
				grille.cells[7] == player &&
				(grille.cells[0] == player || grille.cells[2] == player)
			) {
				tab = [6, 8];
				cell = tab[intRandom(0, 1)];
			} else if (
				grille.cells[5] == player &&
				(grille.cells[0] == player || grille.cells[6] == player)
			) {
				tab = [2, 8];
				cell = tab[intRandom(0, 1)];
			} else if (
				grille.cells[3] == player &&
				(grille.cells[2] == player || grille.cells[8] == player)
			) {
				tab = [0, 6];
				cell = tab[intRandom(0, 1)];
			} else if (
				grille.cells[1] == player &&
				(grille.cells[6] == player || grille.cells[8] == player)
			) {
				tab = [0, 2];
				cell = tab[intRandom(0, 1)];
			}
		} else if (
			moves == 3 &&
			grille.cells[4] == player &&
			player == x &&
			difficulty == 1
		) {
			if (grille.cells[2] == player && grille.cells[6] == computer) {
				cell = 8;
			} else if (
				grille.cells[0] == player &&
				grille.cells[8] == computer
			) {
				cell = 6;
			} else if (
				grille.cells[8] == player &&
				grille.cells[0] == computer
			) {
				cell = 2;
			} else if (
				grille.cells[6] == player &&
				grille.cells[2] == computer
			) {
				cell = 0;
			}
		}
	} else if (moves === 1 && grille.cells[4] == player && difficulty == 1) {
		// Si le joueur est X et a joué au centre, jouez l'un des coins.
		cell = corners[intRandom(0, 3)];
	} else if (
		moves === 2 &&
		grille.cells[4] == player &&
		computer == x &&
		difficulty == 1
	) {
		// Si le joueur est O et a joué au centre, prenez deux coins opposés.
		if (grille.cells[0] == computer) {
			cell = 8;
		} else if (grille.cells[2] == computer) {
			cell = 6;
		} else if (grille.cells[6] == computer) {
			cell = 2;
		} else if (grille.cells[8] == computer) {
			cell = 0;
		}
	} else if (moves === 0 && intRandom(1, 10) < 8) {
		// Si l'ordinateur est X, commencez par l'un des coins parfois.
		cell = corners[intRandom(0, 3)];
	} else {
		// Choisissez le centre du plateau si possible.
		if (grille.cells[4] === 0 && difficulty == 1) {
			cell = 4;
		} else {
			tab = grille.getFreeCellIndices();
			cell = tab[intRandom(0, tab.length - 1)];
		}
	}
	var id = "cell" + cell.toString();
	document.getElementById(id).innerHTML = computerText;
	document.getElementById(id).style.cursor = "default";
	// Effectuez une rotation aléatoire des marques sur le plateau pour leur donner un aspect aléatoire.
	// comme s'ils étaient écrits à la main.
	var rand = Math.random();
	if (rand < 0.3) {
		document.getElementById(id).style.transform = "rotate(180deg)";
	} else if (rand > 0.6) {
		document.getElementById(id).style.transform = "rotate(90deg)";
	}
	grille.cells[cell] = computer;
	moves += 1;
	if (moves >= 5) {
		winner = checkWin();
	}
	if (winner === 0 && !gameOver) {
		whoseTurn = player;
	}
}

// Vérifiez si le jeu est terminé et déterminez le gagnant.
function checkWin() {
	// Elle parcourt la grille pour rechercher des combinaisons gagnantes dans les lignes, les colonnes et les diagonales
	winner = 0;

	// les lignes
	for (var i = 0; i <= 2; i++) {
		var row = grille.getRowValues(i);
		if (row[0] > 0 && row[0] == row[1] && row[0] == row[2]) {
			if (row[0] == computer) {
				score.computer++;
				winner = computer;
			} else {
				score.player++;
				winner = player;
			}
			// Donnez à la rangée/colonne/diagonale gagnante une couleur de fond différente.
			var tmpAr = grille.getRowIndices(i);
			for (var j = 0; j < tmpAr.length; j++) {
				var str = "cell" + tmpAr[j];
				document.getElementById(str).classList.add("win-color");
			}
			setTimeout(endGame, 1000, winner);
			return winner;
		}
	}

	// les colones
	for (i = 0; i <= 2; i++) {
		var col = grille.getColumnValues(i);
		if (col[0] > 0 && col[0] == col[1] && col[0] == col[2]) {
			if (col[0] == computer) {
				score.computer++;
				winner = computer;
			} else {
				score.player++;
				winner = player;
			}
			// Donnez à la rangée/colonne/diagonale gagnante une couleur de fond différente
			var tmpAr = grille.getColumnIndices(i);
			for (var j = 0; j < tmpAr.length; j++) {
				var str = "cell" + tmpAr[j];
				document.getElementById(str).classList.add("win-color");
			}
			setTimeout(endGame, 1000, winner);
			return winner;
		}
	}

	// diagonals
	for (i = 0; i <= 1; i++) {
		var diagonal = grille.getDiagValues(i);
		if (
			diagonal[0] > 0 &&
			diagonal[0] == diagonal[1] &&
			diagonal[0] == diagonal[2]
		) {
			if (diagonal[0] == computer) {
				score.computer++;
				winner = computer;
			} else {
				score.player++;
				winner = player;
			}
			// Donnez à la rangée/colonne/diagonale gagnante une couleur de fond différente.
			var tmpAr = grille.getDiagIndices(i);
			for (var j = 0; j < tmpAr.length; j++) {
				var str = "cell" + tmpAr[j];
				document.getElementById(str).classList.add("win-color");
			}
			setTimeout(endGame, 1000, winner);
			return winner;
		}
	}

	// Si nous n'avons pas encore désigné un gagnant à ce stade et que le plateau est plein, c'est un match nul.
	var tab = grille.getFreeCellIndices();
	if (tab.length === 0) {
		winner = 10;
		score.ties++;
		endGame(winner);
		return winner;
	}

	return winner;
}

function announceWinner(text) {
	document.getElementById("winText").innerHTML = text;
	document.getElementById("winAnnounce").style.display = "block";
	setTimeout(closeModal, 1400, "winAnnounce");
}

function askUser(text) {
	document.getElementById("questionText").innerHTML = text;
	document.getElementById("userFeedback").style.display = "block";
}

function showOptions() {
	if (player == o) {
		document.getElementById("rx").checked = false;
		document.getElementById("ro").checked = true;
	} else if (player == x) {
		document.getElementById("rx").checked = true;
		document.getElementById("ro").checked = false;
	}
	if (difficulty === 0) {
		document.getElementById("r0").checked = true;
		document.getElementById("r1").checked = false;
	} else {
		document.getElementById("r0").checked = false;
		document.getElementById("r1").checked = true;
	}
	document.getElementById("choix").style.display = "block";
	document.getElementById("optionsDlg").style.display = "block";
}

function getOptions() {
	var diffs = document.getElementsByName("difficulty");
	for (var i = 0; i < diffs.length; i++) {
		if (diffs[i].checked) {
			difficulty = parseInt(diffs[i].value);
			break;
		}
	}
	if (document.getElementById("rx").checked === true) {
		player = x;
		computer = o;
		whoseTurn = player;
		playerText = xText;
		computerText = oText;
	} else {
		player = o;
		computer = x;
		whoseTurn = computer;
		playerText = oText;
		computerText = xText;
		if (choixOp == 1) setTimeout(makeComputerMove, 400);
	}
	document.getElementById("optionsDlg").style.display = "none";
	document.getElementById("option").style.display = "none";
	document.getElementById("choix").style.display = "block";
}
function getMode() {
	var choix = document.getElementsByName("choix");
	for (var i = 0; i < choix.length; i++) {
		if (choix[i].checked) {
			choixOp = parseInt(choix[i].value);
			break;
		}
	}

	document.getElementById("choix").style.display = "none";
	if (choixOp === 1) {
		document.getElementById("option").style.display = "block";
	} else {
		document.getElementById("optionsDlg").style.display = "none";
	}
}

function closeModal(id) {
	document.getElementById(id).style.display = "none";
}

function endGame(who) {
	if (who == player) {
		announceWinner("Congratulations, you won!");
	} else if (who == computer) {
		announceWinner("Computer wins!");
	} else {
		announceWinner("It's a tie!");
	}
	gameOver = true;
	whoseTurn = 0;
	moves = 0;
	winner = 0;
	document.getElementById("computer_score").innerHTML = score.computer;
	document.getElementById("tie_score").innerHTML = score.ties;
	document.getElementById("player_score").innerHTML = score.player;
	for (var i = 0; i <= 8; i++) {
		var id = "cell" + i.toString();
		document.getElementById(id).style.cursor = "default";
	}
	setTimeout(restartGame, 800);
}
