// UI相关函数
const UI = {
    elements: {}, // 存储所有UI元素引用
    isViewingFromAllHistory: false, // 标记是否是从全部历史进入游戏详情
    previousSum: 0, // 记录上一步的总和
    
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
            allHistoryModal: document.getElementById('allHistoryModal'),
            confirmClearModal: document.getElementById('confirmClearModal'),
            victoryScreen: document.getElementById('victoryScreen'),
            playAgain: document.getElementById('playAgain'),
            viewHistory: document.getElementById('viewHistory'),
            closeHistoryBtns: document.querySelectorAll('.close-history-btn'),
            closeAllHistoryBtns: document.querySelectorAll('.close-all-history-btn'),
            clearHistoryBtn: document.getElementById('clearHistoryBtn'),
            confirmClearBtn: document.getElementById('confirmClearBtn'),
            cancelClearBtn: document.getElementById('cancelClearBtn'),
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
            btn2: document.getElementById('btn2'),
            startGameBtn: document.getElementById('startGameBtn'),
            showAllHistoryBtn: document.getElementById('showAllHistoryBtn'),
            allGamesTableBody: document.getElementById('allGamesTableBody'),
            totalGames: document.getElementById('totalGames'),
            userWins: document.getElementById('userWins'),
            aiWins: document.getElementById('aiWins')
        };
        
        // 绑定UI事件
        this.bindEvents();
        
        // 初始化previousSum
        this.previousSum = 0;
    },
    
    // 绑定UI事件
    bindEvents() {
        // 角色选择按钮事件
        this.elements.userFirstBtn.addEventListener('click', () => {
            this.toggleRoleSelection('user');
        });
        
        this.elements.robotFirstBtn.addEventListener('click', () => {
            this.toggleRoleSelection('robot');
        });
        
        // 开始游戏按钮
        this.elements.startGameBtn.addEventListener('click', () => {
            const isUserFirst = this.elements.userFirstBtn.classList.contains('selected');
            Game.startGame(isUserFirst);
        });
        
        // 查看历史对局按钮
        this.elements.showAllHistoryBtn.addEventListener('click', () => {
            this.showAllHistoryModal();
        });
        
        // 清除历史记录按钮
        this.elements.clearHistoryBtn.addEventListener('click', () => {
            this.showConfirmClearModal();
        });
        
        // 确认清除历史记录
        this.elements.confirmClearBtn.addEventListener('click', () => {
            if (Game.clearAllHistory()) {
                this.hideConfirmClearModal();
                // 显示提示消息
                alert('历史记录已清除！');
                // 如果正在查看历史，更新历史记录列表
                if (this.elements.allHistoryModal.classList.contains('active')) {
                    this.updateHistoryStats();
                    this.updateAllGamesTable();
                }
            }
        });
        
        // 取消清除历史记录
        this.elements.cancelClearBtn.addEventListener('click', () => {
            this.hideConfirmClearModal();
        });
        
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
            this.isViewingFromAllHistory = false;
            this.elements.victoryScreen.style.display = 'none';
            this.elements.historyModal.style.display = 'block';
        });
        
        this.elements.closeHistoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.elements.historyModal.style.display = 'none';
                
                // 根据来源决定返回到哪里
                if (this.isViewingFromAllHistory) {
                    // 返回到历史对局列表
                    this.hideVictoryModal();
                    this.showAllHistoryModal();
                } else {
                    // 返回到胜利界面
                    this.elements.victoryScreen.style.display = 'block';
                }
            });
        });
        
        this.elements.closeAllHistoryBtns.forEach(btn => {
            btn.addEventListener('click', () => {
                this.hideAllHistoryModal();
            });
        });
        
        // 点击模态框背景关闭
        this.elements.victoryModal.addEventListener('click', (e) => {
            if (e.target === this.elements.victoryModal) {
                this.hideVictoryModal();
            }
        });
        
        this.elements.allHistoryModal.addEventListener('click', (e) => {
            if (e.target === this.elements.allHistoryModal) {
                this.hideAllHistoryModal();
            }
        });
        
        this.elements.confirmClearModal.addEventListener('click', (e) => {
            if (e.target === this.elements.confirmClearModal) {
                this.hideConfirmClearModal();
            }
        });
    },
    
    // 显示确认清除模态框
    showConfirmClearModal() {
        this.elements.confirmClearModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    // 隐藏确认清除模态框
    hideConfirmClearModal() {
        this.elements.confirmClearModal.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    // 切换角色选择
    toggleRoleSelection(role) {
        if (role === 'user') {
            this.elements.userFirstBtn.classList.add('selected');
            this.elements.robotFirstBtn.classList.remove('selected');
        } else {
            this.elements.robotFirstBtn.classList.add('selected');
            this.elements.userFirstBtn.classList.remove('selected');
        }
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
    
    // 显示所有历史对局模态框
    showAllHistoryModal() {
        // 更新历史统计信息
        this.updateHistoryStats();
        
        // 更新历史游戏列表
        this.updateAllGamesTable();
        
        // 显示模态框
        this.elements.allHistoryModal.classList.add('active');
        document.body.style.overflow = 'hidden';
    },
    
    // 隐藏所有历史对局模态框
    hideAllHistoryModal() {
        this.elements.allHistoryModal.classList.remove('active');
        document.body.style.overflow = '';
    },
    
    // 更新历史统计信息
    updateHistoryStats() {
        const stats = Game.getHistoryStats();
        this.elements.totalGames.textContent = stats.totalGames;
        this.elements.userWins.textContent = stats.userWins;
        this.elements.aiWins.textContent = stats.aiWins;
    },
    
    // 更新历史游戏表格
    updateAllGamesTable() {
        const allGames = Game.getAllGamesHistory();
        
        // 清空表格
        this.elements.allGamesTableBody.innerHTML = '';
        
        // 如果没有游戏记录，显示提示信息
        if (allGames.length === 0) {
            const row = document.createElement('tr');
            const cell = document.createElement('td');
            cell.colSpan = 6;
            cell.textContent = '暂无游戏记录';
            cell.style.textAlign = 'center';
            cell.style.padding = '20px';
            row.appendChild(cell);
            this.elements.allGamesTableBody.appendChild(row);
            return;
        }
        
        // 按时间倒序排列游戏记录
        allGames.sort((a, b) => new Date(b.date) - new Date(a.date));
        
        // 填充表格
        allGames.forEach((game, index) => {
            const row = document.createElement('tr');
            
            // 对局编号
            const numberCell = document.createElement('td');
            numberCell.textContent = index + 1;
            row.appendChild(numberCell);
            
            // 时间
            const dateCell = document.createElement('td');
            const gameDate = new Date(game.date);
            dateCell.textContent = gameDate.toLocaleString('zh-CN', {
                year: 'numeric',
                month: '2-digit',
                day: '2-digit',
                hour: '2-digit',
                minute: '2-digit'
            });
            row.appendChild(dateCell);
            
            // 先手
            const firstPlayerCell = document.createElement('td');
            firstPlayerCell.textContent = game.firstPlayer;
            firstPlayerCell.style.fontWeight = 'bold';
            if (game.firstPlayer === '你') {
                firstPlayerCell.style.color = 'var(--primary-color)';
            } else {
                firstPlayerCell.style.color = 'var(--secondary-color)';
            }
            row.appendChild(firstPlayerCell);
            
            // 获胜方
            const winnerCell = document.createElement('td');
            winnerCell.textContent = game.winner;
            winnerCell.style.fontWeight = 'bold';
            if (game.winner === '你') {
                winnerCell.style.color = 'var(--primary-color)';
            } else {
                winnerCell.style.color = 'var(--secondary-color)';
            }
            row.appendChild(winnerCell);
            
            // 步数
            const movesCell = document.createElement('td');
            movesCell.textContent = game.moves;
            row.appendChild(movesCell);
            
            // 查看按钮
            const actionCell = document.createElement('td');
            const viewButton = document.createElement('button');
            viewButton.className = 'view-game-btn';
            viewButton.textContent = '查看';
            viewButton.addEventListener('click', () => this.showGameDetails(game.id));
            actionCell.appendChild(viewButton);
            row.appendChild(actionCell);
            
            this.elements.allGamesTableBody.appendChild(row);
        });
    },
    
    // 显示特定游戏的详细信息
    showGameDetails(gameId) {
        // 获取游戏记录
        const game = Game.getGameById(gameId);
        if (!game) return;
        
        // 清空历史记录列表
        this.elements.victoryHistoryList.innerHTML = '';
        
        // 更新标题和信息
        document.querySelector('.history-modal-title').textContent = 
            `游戏记录 - ${new Date(game.date).toLocaleString('zh-CN')}`;
        this.elements.moveCount.textContent = `总步数: ${game.moves}`;
        
        // 填充历史记录
        game.history.forEach(move => {
            const historyItem = document.createElement('div');
            historyItem.className = `history-item ${move.player === '你' ? 'user-move' : 'robot-move'}`;
            
            const moveNumber = document.createElement('div');
            moveNumber.className = 'move-number';
            moveNumber.textContent = move.number;
            
            const moveText = document.createElement('div');
            moveText.className = 'move-text';
            
            // 根据player选择不同的CSS类
            const numberClass = move.player === '你' ? 'user-added-number' : 'ai-added-number';
            
            // 使用更详细的过程描述和增强显示效果
            if (move.hasOwnProperty('previousSum')) {
                // 新格式的历史记录，包含详细过程并使用增强显示
                moveText.innerHTML = `
                    ${move.player} 选择了 <span class="${numberClass}">${move.number}</span>。
                    原来总和为 <span class="prev-sum">${move.previousSum}</span>，
                    <span class="prev-sum">${move.previousSum}</span> 
                    <span class="math-symbol">+</span> 
                    <span class="${numberClass}">${move.number}</span> 
                    <span class="math-symbol">=</span> 
                    <span class="new-sum">${move.sum}</span>
                `;
            } else {
                // 老格式的历史记录，简单显示但仍应用一些样式
                moveText.innerHTML = `
                    ${move.player} 添加了 <span class="${numberClass}">${move.number}</span>。
                    总和: <span class="new-sum">${move.sum}</span>
                `;
            }
            
            historyItem.appendChild(moveNumber);
            historyItem.appendChild(moveText);
            this.elements.victoryHistoryList.appendChild(historyItem);
        });
        
        // 设置标记表示从历史列表进入
        this.isViewingFromAllHistory = true;
        
        // 关闭全部历史模态框，显示单个游戏历史
        this.hideAllHistoryModal();
        this.elements.victoryModal.classList.add('active');
        this.elements.victoryScreen.style.display = 'none';
        this.elements.historyModal.style.display = 'block';
        document.body.style.overflow = 'hidden';
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
        // 创建离线文档片段，减少DOM操作
        const fragment = document.createDocumentFragment();
        
        // 创建历史项容器
        const historyItem = document.createElement('div');
        historyItem.className = `history-item ${player === '你' ? 'user-move' : 'robot-move'}`;
        
        // 创建数字标记
        const moveNumber = document.createElement('div');
        moveNumber.className = 'move-number';
        moveNumber.textContent = number;
        
        // 创建文本内容区域
        const moveTextElem = document.createElement('div');
        moveTextElem.className = 'move-text';
        
        // 根据player选择不同的CSS类
        const numberClass = player === '你' ? 'user-added-number' : 'ai-added-number';
        
        // 使用HTML结构和CSS类来增强显示效果
        moveTextElem.innerHTML = `
            ${player} 选择了 <span class="${numberClass}">${number}</span>。
            原来总和为 <span class="prev-sum">${this.previousSum}</span>，
            <span class="prev-sum">${this.previousSum}</span> 
            <span class="math-symbol">+</span> 
            <span class="${numberClass}">${number}</span> 
            <span class="math-symbol">=</span> 
            <span class="new-sum">${sum}</span>
        `;
        
        // 将元素添加到文档片段
        historyItem.appendChild(moveNumber);
        historyItem.appendChild(moveTextElem);
        fragment.appendChild(historyItem);
        
        // 在添加之前，先获取当前容器的scrollHeight
        const container = document.querySelector('.history-list-container');
        const wasAtBottom = container && (container.scrollTop + container.clientHeight >= container.scrollHeight - 20);
        
        // 一次性将所有内容添加到DOM，减少重排
        this.elements.historyList.appendChild(fragment);
        
        // 更新previousSum为当前sum，为下一步做准备
        this.previousSum = sum;
        
        // 只有在用户滚动到底部附近时才执行自动滚动
        if (wasAtBottom && container) {
            // 使用setTimeout延迟执行滚动，避免与页面更新冲突
            setTimeout(() => {
                container.scrollTo({
                    top: container.scrollHeight,
                    behavior: 'smooth'
                });
            }, 50);
        }
    },
    
    // 清空历史记录
    clearHistory() {
        this.elements.historyList.innerHTML = '';
        this.previousSum = 0; // 重置previousSum
    },
    
    // 更新胜利信息
    updateVictoryInfo(winner, sum, moveCount) {
        this.elements.finalResult.textContent = `最终总和: ${sum}`;
        this.elements.moveCount.textContent = `总步数: ${moveCount}`;
        
        const isTie = sum === 0 && moveCount === 0;
        
        if (winner === '你') {
            this.elements.victoryMessage.textContent = '🎉 你获胜了！🎉';
            this.elements.victoryMessage.className = 'victory-message user-wins';
            // 添加胜利类，用于CSS样式区分
            this.elements.victoryScreen.classList.add('win');
            this.elements.victoryScreen.classList.remove('lose');
        } else {
            this.elements.victoryMessage.textContent = '😢 你输了！';
            this.elements.victoryMessage.className = 'victory-message robot-wins';
            // 添加失败类，用于CSS样式区分
            this.elements.victoryScreen.classList.add('lose');
            this.elements.victoryScreen.classList.remove('win');
        }
        
        const promptText = document.querySelector('.prompt-text');
        if (winner === '你') {
            promptText.textContent = '恭喜你完成了这一局！想挑战自己吗？';
            promptText.classList.remove('lose');
        } else {
            promptText.textContent = '别气馁，再来一局试试看？';
            promptText.classList.add('lose');
        }
    }
}; 
