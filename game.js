// Each tile has connections: [Top, Right, Bottom, Left] (1 = open, 0 = closed)
const initialLevel = [
  [ { type: 'source', dirs: [0, 1, 0, 0] }, { type: 'wire', dirs: [1, 0, 1, 0] }, { type: 'wire', dirs: [0, 0, 1, 1] }, { type: 'empty', dirs: [0, 0, 0, 0] } ],
  [ { type: 'empty',  dirs: [0, 0, 0, 0] }, { type: 'wire', dirs: [0, 1, 1, 0] }, { type: 'wire', dirs: [1, 0, 1, 0] }, { type: 'empty', dirs: [0, 0, 0, 0] } ],
  [ { type: 'empty',  dirs: [0, 0, 0, 0] }, { type: 'wire', dirs: [1, 1, 0, 0] }, { type: 'wire', dirs: [1, 0, 0, 1] }, { type: 'wire', dirs: [0,1, 1, 0]} ],
  [ { type: 'empty',  dirs: [0, 0, 0, 0] }, { type: 'empty', dirs: [0, 0, 0, 0] }, { type: 'empty', dirs: [0, 0, 0, 0] }, { type: 'target', dirs: [1, 0, 0, 0] } ]
];


let grid = [];

function resetGame() {
  grid = JSON.parse(JSON.stringify(initialLevel));
  scrambleWires();
  render();
}

function scrambleWires() {
  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const tile = grid[r][c];
      if (tile.type === 'wire') {
        // Pick a random number of clockwise turns (0, 1, 2, or 3)
        const turns = Math.floor(Math.random() * 4);
        for (let t = 0; t < turns; t++) {
          tile.dirs.unshift(tile.dirs.pop());
        }
      }
    }
  }
}


// Rotate connections clockwise: [Top, Right, Bottom, Left] -> [Left, Top, Right, Bottom]
function rotateTile(r, c) {
  const tile = grid[r][c];
  if (tile.type !== 'wire') return;
  tile.dirs.unshift(tile.dirs.pop());
  render();
}

// Trace power starting from the source tile at (0, 0)
function checkPower() {
  const powered = Array.from({ length: 4 }, () => Array(4).fill(false));
  const queue = [[0, 0]];
  powered[0][0] = true;

  // Directions: Top, Right, Bottom, Left
  const dr = [-1, 0, 1, 0];
  const dc = [0, 1, 0, -1];
  const opposite = [2, 3, 0, 1]; 

  while (queue.length > 0) {
    const [r, c] = queue.shift();
    const current = grid[r][c];

    for (let i = 0; i < 4; i++) {
      if (current.dirs[i] === 1) {
        const nr = r + dr[i];
        const nc = c + dc[i];
        if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4 && !powered[nr][nc]) {
          if (grid[nr][nc].dirs[opposite[i]] === 1) {
            powered[nr][nc] = true;
            queue.push([nr, nc]);
          }
        }
      }
    }
  }
  return powered;
}

// Draw the visual wire shape
function getWireSymbol(dirs) {
  const key = dirs.join('');
  const shapes = {
    '1010': '┃', '0101': '━',
    '1100': '┗', '0110': '┏', '0011': '┓', '1001': '┛'
  };
  return shapes[key] || '';
}

function render() {
  const gridEl = document.getElementById('grid');
  const statusEl = document.getElementById('status');
  gridEl.innerHTML = '';

  const powered = checkPower();
  let won = false;

  for (let r = 0; r < 4; r++) {
    for (let c = 0; c < 4; c++) {
      const tile = grid[r][c];
      const div = document.createElement('div');
      div.className = 'tile' + (powered[r][c] ? ' powered' : '');

      if (tile.type === 'source') div.textContent = '⚡';
      else if (tile.type === 'target') {
        div.textContent = '💡';
        if (powered[r][c]) won = true;
      } 
      else if (tile.type === 'wire') {
        div.textContent = getWireSymbol(tile.dirs);
        div.onclick = () => rotateTile(r, c);
      }

      gridEl.appendChild(div);
    }
  }

  statusEl.textContent = won ? 'Status: CIRCUIT COMPLETE! 🎉' : 'Status: Disconnected';
  statusEl.style.color = won ? '#76ff03' : '#ffffff';
}

resetGame();
