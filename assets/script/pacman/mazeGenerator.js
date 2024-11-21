/** @format */

function generateMaze(rows, cols) {
	const maze = new Array(rows).fill(null).map(() => new Array(cols).fill(0)); // initialisation

	maze[18][21] = 3
	maze[19][21] = 3
	maze[19][20] = 3
	maze[19][22] = 3

	let pos = []

	function backtrack(x, y) {
		maze[y][x] = 1; // Marquer le point courant comme chemin (1)
		const directions = shuffleArray([
			{ dx: 0, dy: -1 }, // Haut
			{ dx: 0, dy: 1 }, // Bas
			{ dx: -1, dy: 0 }, // Gauche
			{ dx: 1, dy: 0 }, // Droite
		]);
		
		pos.push({"x": x, "y": y})

		for (const { dx, dy } of directions) {
			const nx = x + dx * 2;
			const ny = y + dy * 2;

			if (
				nx >= 0 &&
				nx < cols &&
				ny >= 0 &&
				ny < rows &&
				maze[ny][nx] === 0
			) {
				maze[y + dy][x + dx] = 1;
				backtrack(nx, ny);
			}
		}
	}

	function shuffleArray(array) {
		for (let i = array.length - 1; i > 0; i--) {
			const j = Math.floor(Math.random() * (i + 1));
			[array[i], array[j]] = [array[j], array[i]];
		}
		return array;
	}

	backtrack(39, 39);
	return {"maze":maze,"pos":pos};
}
