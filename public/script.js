class ChessGame {
    constructor() {
        // Estado do jogo
        this.board = [];
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.selectedSquare = null;
        this.moveHistory = [];
        this.gameActive = true;
        this.checkPosition = null;
        
        // Cronômetros dos jogadores (em segundos)
        this.whiteTime = 600; // 10 minutos
        this.blackTime = 600; // 10 minutos
        this.activeTimer = null;
        this.timerRunning = false;
        
        // Inicializar jogo
        this.initBoard();
        this.initEventListeners();
        this.startGameTimer();
        this.renderBoard();
        this.updateTimersDisplay();
    }
    
    initBoard() {
        // Inicializar tabuleiro vazio
        for (let i = 0; i < 8; i++) {
            this.board[i] = [];
            for (let j = 0; j < 8; j++) {
                this.board[i][j] = null;
            }
        }
        
        // Colocar peças brancas (parte de baixo - linha 7)
        this.placePiece(7, 0, 'torre', 'white');
        this.placePiece(7, 1, 'cavalo', 'white');
        this.placePiece(7, 2, 'bispo', 'white');
        this.placePiece(7, 3, 'rainha', 'white');
        this.placePiece(7, 4, 'rei', 'white');
        this.placePiece(7, 5, 'bispo', 'white');
        this.placePiece(7, 6, 'cavalo', 'white');
        this.placePiece(7, 7, 'torre', 'white');
        
        // Peões brancos (linha 6)
        for (let i = 0; i < 8; i++) {
            this.placePiece(6, i, 'peao', 'white');
        }
        
        // Colocar peças pretas (parte de cima - linha 0)
        this.placePiece(0, 0, 'torre', 'black');
        this.placePiece(0, 1, 'cavalo', 'black');
        this.placePiece(0, 2, 'bispo', 'black');
        this.placePiece(0, 3, 'rainha', 'black');
        this.placePiece(0, 4, 'rei', 'black');
        this.placePiece(0, 5, 'bispo', 'black');
        this.placePiece(0, 6, 'cavalo', 'black');
        this.placePiece(0, 7, 'torre', 'black');
        
        // Peões pretos (linha 1)
        for (let i = 0; i < 8; i++) {
            this.placePiece(1, i, 'peao', 'black');
        }
    }
    
    placePiece(row, col, type, color) {
        this.board[row][col] = {
            type: type,
            color: color,
            hasMoved: false
        };
    }
    
    getPieceEmoji(piece) {
        if (!piece) return '';
        
        const emojis = {
            'rei': { 'white': '♔', 'black': '♚' },
            'rainha': { 'white': '♕', 'black': '♛' },
            'torre': { 'white': '♖', 'black': '♜' },
            'bispo': { 'white': '♗', 'black': '♝' },
            'cavalo': { 'white': '♘', 'black': '♞' },
            'peao': { 'white': '♙', 'black': '♟' }
        };
        
        return emojis[piece.type][piece.color];
    }
    
    startGameTimer() {
        // Iniciar timer do jogador atual (brancas começam)
        this.timerRunning = true;
        this.activeTimer = setInterval(() => {
            if (this.timerRunning && this.gameActive) {
                if (this.currentPlayer === 'white') {
                    this.whiteTime--;
                    if (this.whiteTime <= 0) {
                        this.whiteTime = 0;
                        this.timeOut('black');
                    }
                } else {
                    this.blackTime--;
                    if (this.blackTime <= 0) {
                        this.blackTime = 0;
                        this.timeOut('white');
                    }
                }
                this.updateTimersDisplay();
            }
        }, 1000);
    }
    
    stopTimer() {
        if (this.activeTimer) {
            clearInterval(this.activeTimer);
            this.activeTimer = null;
        }
        this.timerRunning = false;
    }
    
    pauseTimer() {
        this.timerRunning = false;
    }
    
    resumeTimer() {
        if (this.gameActive) {
            this.timerRunning = true;
        }
    }
    
    switchTimer() {
        this.timerRunning = true;
    }
    
    timeOut(winner) {
        this.gameActive = false;
        this.stopTimer();
        this.showVictory(`${winner === 'white' ? 'Brancas' : 'Pretas'} (Tempo Esgotado!)`);
    }
    
    formatTime(seconds) {
        const minutes = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${minutes.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    }
    
    updateTimersDisplay() {
        const whiteTimerElement = document.getElementById('whiteTimer');
        const blackTimerElement = document.getElementById('blackTimer');
        
        if (whiteTimerElement) {
            whiteTimerElement.textContent = this.formatTime(this.whiteTime);
            if (this.whiteTime <= 60) {
                whiteTimerElement.classList.add('time-warning');
            } else {
                whiteTimerElement.classList.remove('time-warning');
            }
        }
        
        if (blackTimerElement) {
            blackTimerElement.textContent = this.formatTime(this.blackTime);
            if (this.blackTime <= 60) {
                blackTimerElement.classList.add('time-warning');
            } else {
                blackTimerElement.classList.remove('time-warning');
            }
        }
        
        // Destacar timer ativo
        if (whiteTimerElement && blackTimerElement) {
            if (this.currentPlayer === 'white' && this.timerRunning) {
                whiteTimerElement.classList.add('active-timer');
                blackTimerElement.classList.remove('active-timer');
            } else if (this.currentPlayer === 'black' && this.timerRunning) {
                blackTimerElement.classList.add('active-timer');
                whiteTimerElement.classList.remove('active-timer');
            }
        }
    }
    
    isValidMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        if (!piece) return false;
        
        const targetPiece = this.board[toRow][toCol];
        
        // Não pode capturar peça da mesma cor
        if (targetPiece && targetPiece.color === piece.color) return false;
        
        const deltaRow = toRow - fromRow;
        const deltaCol = toCol - fromCol;
        
        switch(piece.type) {
            case 'peao':
                const direction = piece.color === 'white' ? -1 : 1;
                const startRow = piece.color === 'white' ? 6 : 1;
                
                // Movimento para frente
                if (deltaCol === 0 && deltaRow === direction && !targetPiece) return true;
                
                // Movimento inicial de duas casas
                if (deltaCol === 0 && deltaRow === 2 * direction && fromRow === startRow && !targetPiece && !this.board[fromRow + direction][fromCol]) return true;
                
                // Captura diagonal
                if (Math.abs(deltaCol) === 1 && deltaRow === direction && targetPiece) return true;
                break;
                
            case 'torre':
                if (deltaRow === 0 || deltaCol === 0) {
                    return this.isClearPath(fromRow, fromCol, toRow, toCol);
                }
                break;
                
            case 'cavalo':
                return (Math.abs(deltaRow) === 2 && Math.abs(deltaCol) === 1) ||
                       (Math.abs(deltaRow) === 1 && Math.abs(deltaCol) === 2);
                       
            case 'bispo':
                if (Math.abs(deltaRow) === Math.abs(deltaCol)) {
                    return this.isClearPath(fromRow, fromCol, toRow, toCol);
                }
                break;
                
            case 'rainha':
                if (deltaRow === 0 || deltaCol === 0 || Math.abs(deltaRow) === Math.abs(deltaCol)) {
                    return this.isClearPath(fromRow, fromCol, toRow, toCol);
                }
                break;
                
            case 'rei':
                if (Math.abs(deltaRow) <= 1 && Math.abs(deltaCol) <= 1) {
                    return true;
                }
                break;
        }
        
        return false;
    }
    
    isClearPath(fromRow, fromCol, toRow, toCol) {
        const deltaRow = Math.sign(toRow - fromRow);
        const deltaCol = Math.sign(toCol - fromCol);
        
        let currentRow = fromRow + deltaRow;
        let currentCol = fromCol + deltaCol;
        
        while (currentRow !== toRow || currentCol !== toCol) {
            if (this.board[currentRow][currentCol]) return false;
            currentRow += deltaRow;
            currentCol += deltaCol;
        }
        
        return true;
    }
    
    isKingInCheck(color) {
        // Encontrar a posição do rei
        let kingRow = -1, kingCol = -1;
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.board[i][j];
                if (piece && piece.type === 'rei' && piece.color === color) {
                    kingRow = i;
                    kingCol = j;
                    break;
                }
            }
        }
        
        if (kingRow === -1) return false;
        
        // Verificar se alguma peça adversária pode atacar o rei
        const opponentColor = color === 'white' ? 'black' : 'white';
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.board[i][j];
                if (piece && piece.color === opponentColor) {
                    if (this.isValidMove(i, j, kingRow, kingCol)) {
                        this.checkPosition = { row: kingRow, col: kingCol };
                        return true;
                    }
                }
            }
        }
        
        this.checkPosition = null;
        return false;
    }
    
    makeMove(fromRow, fromCol, toRow, toCol) {
        const piece = this.board[fromRow][fromCol];
        const capturedPiece = this.board[toRow][toCol];
        
        if (!this.isValidMove(fromRow, fromCol, toRow, toCol)) return false;
        
        // Simular movimento para verificar se não deixa o rei em xeque
        const boardBackup = JSON.parse(JSON.stringify(this.board));
        
        // Realizar movimento temporário
        this.board[toRow][toCol] = { ...piece, hasMoved: true };
        this.board[fromRow][fromCol] = null;
        
        // Verificar se o rei fica em xeque
        if (this.isKingInCheck(piece.color)) {
            // Desfazer movimento
            this.board = boardBackup;
            return false;
        }
        
        // Registrar movimento
        const pieceEmoji = this.getPieceEmoji(piece);
        const moveDescription = `${pieceEmoji} ${String.fromCharCode(97 + fromCol)}${8 - fromRow} → ${String.fromCharCode(97 + toCol)}${8 - toRow}`;
        this.moveHistory.unshift(moveDescription);
        this.updateMoveHistory();
        
        // Adicionar efeito de captura
        if (capturedPiece) {
            this.addCaptureEffect(toRow, toCol);
        }
        
        // Verificar promoção de peão
        if (piece.type === 'peao' && (toRow === 0 || toRow === 7)) {
            this.board[toRow][toCol].type = 'rainha';
        }
        
        // Após mover, pausar o timer e aguardar o jogador apertar o botão
        this.pauseTimer();
        
        // Destacar o botão do próximo jogador
        this.highlightNextPlayerButton();
        
        // Limpar seleção
        this.selectedPiece = null;
        this.selectedSquare = null;
        
        this.renderBoard();
        
        return true;
    }
    
    highlightNextPlayerButton() {
        const nextPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        const buttons = document.querySelectorAll('.timer-button');
        buttons.forEach(btn => {
            btn.classList.remove('highlight');
            if (btn.dataset.player === nextPlayer) {
                btn.classList.add('highlight');
            }
        });
    }
    
    confirmMove(player) {
        // Verificar se é a vez do jogador correto
        if (player !== this.currentPlayer) {
            alert(`Aguardando a jogada do ${this.currentPlayer === 'white' ? 'Brancas' : 'Pretas'}!`);
            return;
        }
        
        // Verificar se o jogo está ativo
        if (!this.gameActive) return;
        
        // Parar destaque do botão
        const buttons = document.querySelectorAll('.timer-button');
        buttons.forEach(btn => btn.classList.remove('highlight'));
        
        // Mudar jogador
        this.currentPlayer = this.currentPlayer === 'white' ? 'black' : 'white';
        this.updateTurn();
        
        // Verificar xeque-mate
        if (this.isKingInCheck(this.currentPlayer)) {
            this.showCheckEffect();
            
            if (this.isCheckmate(this.currentPlayer)) {
                this.gameActive = false;
                this.stopTimer();
                const winner = this.currentPlayer === 'white' ? 'Pretas' : 'Brancas';
                this.showVictory(`${winner} (Xeque-Mate!)`);
                return;
            }
        }
        
        // Continuar o timer
        this.resumeTimer();
        
        // Atualizar display dos timers
        this.updateTimersDisplay();
        
        // Renderizar tabuleiro
        this.renderBoard();
    }
    
    isCheckmate(color) {
        // Verificar se há algum movimento que tire o rei do xeque
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const piece = this.board[i][j];
                if (piece && piece.color === color) {
                    for (let k = 0; k < 8; k++) {
                        for (let l = 0; l < 8; l++) {
                            if (this.isValidMove(i, j, k, l)) {
                                // Simular movimento
                                const boardBackup = JSON.parse(JSON.stringify(this.board));
                                
                                this.board[k][l] = { ...piece, hasMoved: true };
                                this.board[i][j] = null;
                                
                                const stillInCheck = this.isKingInCheck(color);
                                
                                this.board = boardBackup;
                                
                                if (!stillInCheck) {
                                    return false;
                                }
                            }
                        }
                    }
                }
            }
        }
        return true;
    }
    
    getValidMoves(row, col) {
        const validMoves = [];
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                if (this.isValidMove(row, col, i, j)) {
                    // Verificar se o movimento não deixa o rei em xeque
                    const piece = this.board[row][col];
                    
                    // Simular movimento
                    const boardBackup = JSON.parse(JSON.stringify(this.board));
                    this.board[i][j] = { ...piece, hasMoved: true };
                    this.board[row][col] = null;
                    
                    const kingSafe = !this.isKingInCheck(piece.color);
                    
                    // Restaurar
                    this.board = boardBackup;
                    
                    if (kingSafe) {
                        validMoves.push({ row: i, col: j });
                    }
                }
            }
        }
        return validMoves;
    }
    
    updateMoveHistory() {
        const historyDiv = document.getElementById('moveHistory');
        if (historyDiv) {
            historyDiv.innerHTML = this.moveHistory.slice(0, 20).map((move, index) => 
                `<div class="move-item">${index + 1}. ${move}</div>`
            ).join('');
            
            // Auto-scroll para o topo
            const moveHistoryContainer = document.querySelector('.move-history');
            if (moveHistoryContainer) {
                moveHistoryContainer.scrollTop = 0;
            }
        }
    }
    
    updateTurn() {
        const turnDiv = document.getElementById('turn');
        if (turnDiv) {
            turnDiv.textContent = this.currentPlayer === 'white' ? 'Brancas' : 'Pretas';
            turnDiv.setAttribute('data-player', this.currentPlayer);
        }
        
        // Atualizar destaque dos timers
        this.updateTimersDisplay();
    }
    
    resetGame() {
        this.stopTimer();
        this.board = [];
        this.currentPlayer = 'white';
        this.selectedPiece = null;
        this.selectedSquare = null;
        this.moveHistory = [];
        this.gameActive = true;
        this.checkPosition = null;
        this.whiteTime = 600;
        this.blackTime = 600;
        
        this.initBoard();
        this.startGameTimer();
        this.renderBoard();
        this.updateTurn();
        this.updateMoveHistory();
        this.updateTimersDisplay();
        
        const victoryOverlay = document.querySelector('.victory-overlay');
        if (victoryOverlay) {
            victoryOverlay.remove();
        }
        
        // Remover destaque dos botões
        const buttons = document.querySelectorAll('.timer-button');
        buttons.forEach(btn => btn.classList.remove('highlight'));
    }
    
    addCaptureEffect(row, col) {
        const squares = document.querySelectorAll('.square');
        const index = row * 8 + col;
        if (squares[index]) {
            squares[index].classList.add('capturing');
            setTimeout(() => {
                squares[index].classList.remove('capturing');
            }, 400);
        }
    }
    
    showCheckEffect() {
        if (this.checkPosition) {
            const squares = document.querySelectorAll('.square');
            const index = this.checkPosition.row * 8 + this.checkPosition.col;
            if (squares[index]) {
                squares[index].classList.add('check');
                setTimeout(() => {
                    squares[index].classList.remove('check');
                }, 1000);
            }
        }
    }
    
    showVictory(message) {
        const overlay = document.createElement('div');
        overlay.className = 'victory-overlay';
        overlay.innerHTML = `
            <div class="victory-card">
                <div style="font-size: 4rem;">🏆</div>
                <h2>Fim de Jogo!</h2>
                <p>${message}</p>
                <button onclick="location.reload()">Jogar Novamente</button>
            </div>
        `;
        document.body.appendChild(overlay);
    }
    
    initEventListeners() {
        const resetBtn = document.getElementById('resetBtn');
        if (resetBtn) {
            resetBtn.addEventListener('click', () => {
                this.resetGame();
            });
        }
        
        const whiteTimerBtn = document.getElementById('whiteTimerBtn');
        const blackTimerBtn = document.getElementById('blackTimerBtn');
        
        if (whiteTimerBtn) {
            whiteTimerBtn.addEventListener('click', () => {
                this.confirmMove('white');
            });
        }
        
        if (blackTimerBtn) {
            blackTimerBtn.addEventListener('click', () => {
                this.confirmMove('black');
            });
        }
    }
    
    renderBoard() {
        const boardElement = document.getElementById('chessboard');
        if (!boardElement) return;
        
        boardElement.innerHTML = '';
        
        for (let i = 0; i < 8; i++) {
            for (let j = 0; j < 8; j++) {
                const square = document.createElement('div');
                // Alternância correta das cores
                const isLight = (i + j) % 2 === 0;
                square.className = `square ${isLight ? 'light' : 'dark'}`;
                square.dataset.row = i;
                square.dataset.col = j;
                
                const piece = this.board[i][j];
                if (piece) {
                    const emoji = this.getPieceEmoji(piece);
                    square.textContent = emoji;
                    square.style.display = 'flex';
                    square.style.alignItems = 'center';
                    square.style.justifyContent = 'center';
                    square.style.cursor = 'pointer';
                    square.title = `${piece.type} ${piece.color === 'white' ? 'Branca' : 'Preta'}`;
                }
                
                if (this.selectedSquare && 
                    this.selectedSquare.row === i && 
                    this.selectedSquare.col === j) {
                    square.classList.add('selected');
                }
                
                square.addEventListener('click', (e) => {
                    this.handleSquareClick(i, j);
                });
                
                boardElement.appendChild(square);
            }
        }
        
        // Mostrar movimentos válidos
        if (this.selectedPiece) {
            const validMoves = this.getValidMoves(this.selectedPiece.row, this.selectedPiece.col);
            validMoves.forEach(move => {
                const square = boardElement.children[move.row * 8 + move.col];
                if (square) {
                    square.classList.add('valid-move');
                }
            });
        }
    }
    
    handleSquareClick(row, col) {
        if (!this.gameActive) return;
        
        const piece = this.board[row][col];
        
        // Se não há peça selecionada e clicou em uma peça da cor atual
        if (!this.selectedPiece && piece && piece.color === this.currentPlayer) {
            this.selectedPiece = { row, col };
            this.selectedSquare = { row, col };
            this.renderBoard();
            return;
        }
        
        // Se há uma peça selecionada
        if (this.selectedPiece) {
            const fromRow = this.selectedPiece.row;
            const fromCol = this.selectedPiece.col;
            
            if (this.makeMove(fromRow, fromCol, row, col)) {
                this.selectedPiece = null;
                this.selectedSquare = null;
                this.renderBoard();
            } else {
                // Movimento inválido, limpar seleção
                this.selectedPiece = null;
                this.selectedSquare = null;
                this.renderBoard();
                
                // Se clicou em outra peça válida, selecionar ela
                if (piece && piece.color === this.currentPlayer) {
                    this.selectedPiece = { row, col };
                    this.selectedSquare = { row, col };
                    this.renderBoard();
                }
            }
        }
    }
}

// Iniciar jogo quando a página carregar
document.addEventListener('DOMContentLoaded', () => {
    new ChessGame();
});