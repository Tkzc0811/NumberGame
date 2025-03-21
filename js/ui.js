// UI相关函数
const UI = {
    elements: {}, // 存储所有UI元素引用
    
    // 初始化UI元素引用
    init() {
        // 获取所有需要的DOM元素
        this.elements = {
            userFirstBtn: document.getElementById('userFirstBtn'),
            robotFirstBtn: document.getElementById('robotFirstBtn'),
            roleSelection: document.getElementById('roleSelection'),
            gameArea: document.getElementById('gameArea'),
            victoryModal: document.getElementById('victoryModal'),
            historyModal: document.getElementById('historyModal'),
            victoryScreen: document.getElementById('victoryScreen'),
            playAgain: document.getElementById('playAgain'),
            viewHistory: document.getElementById('viewHistory'),
            closeHistoryBtns: document.querySelectorAll('.close-history-btn'),
            status: document.getElementById('status'),
            result: document.getElementById('result'),
            historyList: document.getElementById('historyList'),
            victoryHistoryList: document.getElementById('victoryHistoryList'),
            userIndicator: document.getElementById('userIndicator'),
            robotIndicator: document.getElementById('robotIndicator'),
            userControls: document.getElementById('userControls'),
            moveCount: document.getElementById('moveCount'),
            finalResult: document.getElementById('finalResult'),
            victoryMessage: document.getElementById('victoryMessage'),
            btn1: document.getElementById('btn1'),
            btn2: document.getElementById('btn2')
        };
        
        // 绑定UI事件
        this.bindEvents();
    },
    
    // 绑定UI事件
    bindEvents() {
        // 角色选择按钮事件
        this.elements.userFirstBtn.addEventListener('click', () => Game.startGame(true));
        this.elements.robotFirstBtn.addEventListener('click', () => Game.startGame(false));
        
        // 数字按钮事件
        this.elements.btn1.addEventListener('click', () => Game.makeMove(1, true));
        this.elements.btn2.addEventListener('click', () => Game.makeMove(2, true));
        
        // 模态框相关事件
        this.elements.playAgain.addEventListener('click', () => {
            Game.resetGame();
            this.hideVictoryModal();
            this.showRoleSelection();
        });
        
        this.elements.viewHistory.addEventListener('click', () => {
            this.elements.victoryScreen.style.display = 'none';
            this.elements.historyModal.style.display = 'block';
        });
        
        this.elements.closeHistoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.elements.historyModal.style.display = 'none';
                this.elements.victoryScreen.style.display = 'block';
            });
        });
        
        // 点击模态框背景关闭
        this.elements.victoryModal.addEventListener('click', (e) => {
            if (e.target === this.elements.victoryModal) {
                this.hideVictoryModal();
            }
        });
    },
    
    // 显示角色选择
    showRoleSelection() {
        this.elements.roleSelection.style.display = 'block';
        this.elements.gameArea.style.display = 'none';
    },
    
    // 显示游戏区域
    showGameArea() {
        this.elements.roleSelection.style.display = 'none';
        this.elements.gameArea.style.display = 'block';
    },
    
    // 显示胜利模态框
    showVictoryModal() {
        this.elements.victoryModal.classList.add('active');
        this.elements.victoryScreen.style.display = 'block';
        this.elements.historyModal.style.display = 'none';
        document.body.style.overflow = 'hidden';
    },
    
    // 隐藏胜利模态框
    hideVictoryModal() {
        this.elements.victoryModal.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    // 更新玩家回合指示器
    updateTurnIndicators(isUserTurn) {
        if (isUserTurn) {
            this.elements.status.textContent = "你的回合！选择1或2。";
            this.elements.status.className = "status-area user-turn";
            this.elements.userIndicator.classList.add('active');
            this.elements.robotIndicator.classList.remove('active');
            this.elements.userControls.style.pointerEvents = 'auto';
        } else {
            this.elements.status.innerHTML = "AI思考中<span class='ai-thinking'></span>";
            this.elements.status.className = "status-area ai-turn";
            this.elements.robotIndicator.classList.add('active');
            this.elements.userIndicator.classList.remove('active');
            this.elements.userControls.style.pointerEvents = 'none';
        }
    },
    
    // 更新分数显示
    updateScore(value) {
        this.elements.result.textContent = value.toString();
    },
    
    // 添加历史记录项
    addHistoryItem(player, number, sum) {
        const historyItem = document.createElement('div');
        historyItem.className = `history-item ${player === '你' ? 'user-move' : 'robot-move'}`;
        
        const moveNumber = document.createElement('div');
        moveNumber.className = 'move-number';
        moveNumber.textContent = number;
        
        const moveTextElem = document.createElement('div');
        moveTextElem.className = 'move-text';
        moveTextElem.textContent = `${player} 添加了 ${number}。总和: ${sum}`;
        
        historyItem.appendChild(moveNumber);
        historyItem.appendChild(moveTextElem);
        this.elements.historyList.appendChild(historyItem);
        
        // 自动滚动到底部
        const container = document.querySelector('.history-list-container');
        if (container) {
            container.scrollTop = container.scrollHeight;
        }
    },
    
    // 清空历史记录
    clearHistory() {
        this.elements.historyList.innerHTML = '';
    },
    
    // 更新胜利信息
    updateVictoryInfo(winner, sum, moveCount) {
        this.elements.finalResult.textContent = `最终总和: ${sum}`;
        this.elements.moveCount.textContent = `总步数: ${moveCount}`;
        
        const isTie = sum === 0 && moveCount === 0; // 添加平局情况判断
        
        if (winner === '你') {
            this.elements.victoryMessage.textContent = '🎉 你获胜了！🎉';
            this.elements.victoryMessage.className = 'victory-message user-wins';
        } else {
            this.elements.victoryMessage.textContent = '🤖 AI获胜！🎉';
            this.elements.victoryMessage.className = 'victory-message robot-wins';
        }
    }
}; 
