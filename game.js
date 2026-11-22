const initialLevel = [
  [ { type: 'source', dirs: [0, 1, 0, 0] }, { type: 'wire', dirs: [1, 0, 1, 0] }, { type: 'wire', dirs: [0, 0, 1, 1] }, { type: 'empty', dirs: [0,0,0,0] } ],
  [ { type: 'empty', dirs: [0,0,0,0] },   { type: 'wire', dirs: [0, 1, 0, 1] }, { type: 'wire', dirs: [1, 0, 1, 0] }, { type: 'empty', dirs: [0,0,0,0] } ],
  [ { type: 'empty', dirs: [0,0,0,0] },   { type: 'wire', dirs: [1, 1, 0, 0] }, { type: 'wire', dirs: [0, 1, 1, 0] }, { type: 'wire', dirs: [0, 0, 1, 1] } ],
  [ { type: 'empty', dirs: [0,0,0,0] },   { type: 'empty', dirs: [0,0,0,0] },   { type: 'empty', dirs: [0,0,0,0] },   { type: 'target', dirs: [1, 0, 0, 0] } ]
];

let grid = [];

function resetGame() {
    grid = JSON.parse(JSON.stringify(initialLevel));
    render();
}

function rotateTile(r, c) {
    const tile = grid[r][c];
    if (tile.type !== 'wire') return;
    tile.dirs.unshift(tile.dirs.pop());
    render();
}

function checkPower() {
    const powered = Array.from({length: 4}, () => Array(4).fill(false));
    const queue = [[0,0]];
    powered[0][0] = true;
    const dr = [-1, 0, 1, 0];
    const dc = [0, 1, 0, -1];
    const opposite = [2, 3, 0, 1];
    while (queue.length > 0) {
        const [r, c] = queue.shift();
        const current = grid [r][c];
        for (let i= 0; i<4; i++) {
            if (current.dirs[i] === 1) {
                const nr = r + dr[i];
                const nc = c + dc[i];
                if (nr >= 0 && nr < 4 && nc >= 0 && nc < 4 && !powered[nr][nc]) {
                    if (grid[nr][nc].dirs[opposite[i]] === 1) {
                        powered[nr][nc] = true;
                        queue.push([nr][nc]);
                    }
                }
            }
        }
    }
    return powered;
}

function getWireSymbol(dirs) {
    const key = dirs.join('');
    const shapes = {
       '1010': '|', '0101': '-',
       '1100': '┌', '0110': '┐', 
       '0011': '┘', '1001': '└',
    };
    return shapes[key] || '';
}