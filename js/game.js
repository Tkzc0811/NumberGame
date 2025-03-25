// 游戏逻辑
const Game = {
    sum: 0,
    isUserTurn: true,
    gameHistory: [],
    gameId: null,
    isUserFirst: false,
    startTime: null,
    
    // 开始新游戏
    startGame(isUserFirst) {
        this.resetGame();
        this.isUserTurn = isUserFirst;
        this.isUserFirst = isUserFirst;
        this.startTime = new Date();
        this.gameId = Date.now(); // 使用时间戳作为游戏ID
        
        UI.showGameArea();
        UI.updateTurnIndicators(this.isUserTurn);
        
        // 如果AI先手，触发AI移动
        if (!this.isUserTurn) {
            setTimeout(() => this.robotMove(), gameConfig.maxThinkTime);
        }
    },
    
    // 执行移动
    makeMove(number, isHuman) {
        if (isHuman && !this.isUserTurn) return; // 防止用户在AI回合点击
        
        // 记录移动前的总和
        const previousSum = this.sum;
        
        // 更新总和
        this.sum += number;
        UI.updateScore(this.sum);
        
        // 显示数字动画
        Animations.showNumberAnimation(number, isHuman);
        
        // 添加到历史记录
        const player = isHuman ? '你' : 'AI';
        
        // 存储到游戏历史数组，包含更详细的过程描述
        this.gameHistory.push({
            player: player,
            number: number,
            previousSum: previousSum,
            sum: this.sum,
            text: `选择了 ${number}。原来总和为 ${previousSum}，${previousSum} + ${number} = ${this.sum}`
        });
        
        // 添加到历史显示
        UI.addHistoryItem(player, number, this.sum);
        
        // 检查游戏是否应该结束 (sum ≥ 10)
        if (this.sum >= gameConfig.targetSum) {
            this.endGame();
            return;
        }
        
        // 切换回合
        this.isUserTurn = !this.isUserTurn;
        UI.updateTurnIndicators(this.isUserTurn);
        
        // 如果轮到AI，触发AI移动
        if (!this.isUserTurn) {
            // 生成一个随机思考时间，增加真实感
            const thinkTime = Math.random() * 
                (gameConfig.maxThinkTime - gameConfig.minThinkTime) + 
                gameConfig.minThinkTime;
            
            setTimeout(() => this.robotMove(), thinkTime);
        }
    },
    
    // AI移动逻辑
    robotMove() {
        if (this.isUserTurn) return; // 安全检查
        
        let number;
        
        // 修正必胜策略实现
        // 必胜点：0、2、4、6、8、9
        // 必败点：1、3、5、7
        
        switch (this.sum) {
            case 0: // 开局选2，AI先手必胜的关键第一步
                number = 1;
                break;
            case 1: // 处于必败点，尽量拖延
                number = Math.random() < 0.5 ? 1 : 2;
                break;
            case 2: // 必胜点，选2推进到4（而非选1推进到3）
                number = 2;
                break;
            case 3: // 处于必败点，随便选
                number = 1;
                break;
            case 4: // 必胜点，选2推进到6（而非选1推进到5）
                number = Math.random() < 0.5 ? 1 : 2;
            break;
            case 5: // 处于必败点，随便选
                number = 2;
                break;
            case 6: // 必胜点，选1推进到7
                number = 1;
                break;
            case 7: // 处于必败点，随便选
                number = Math.random() < 0.5 ? 1 : 2;
                break;
            case 8: // 必胜点，选2直接获胜
                number = 2;
                break;
            case 9: // 必胜点，选1直接获胜
                number = 1;
                break;
            default:
                // 不应该到达这里，但以防万一
                number = 1;
                break;
        }
        
        // 执行AI移动
        this.makeMove(number, false);
    },
    
    // 结束游戏并确定胜者
    endGame() {
        let winner;
        
        // 修改规则：总和达到或超过10的一方获胜
        winner = this.isUserTurn ? '你' : 'AI';
        
        // 保存游戏记录到本地存储
        this.saveGameToHistory(winner);
        
        // 显示胜利画面
        Animations.showVictory(winner, this.sum, this.gameHistory.length);
    },
    
    // 重置游戏
    resetGame() {
        this.sum = 0;
        this.gameHistory = [];
        UI.updateScore(0);
        UI.clearHistory();
    },
    
    // 保存游戏记录到本地存储
    saveGameToHistory(winner) {
        const gameRecord = {
            id: this.gameId,
            date: new Date().toISOString(),
            startTime: this.startTime.toISOString(),
            endTime: new Date().toISOString(),
            firstPlayer: this.isUserFirst ? '你' : 'AI',
            winner: winner,
            finalSum: this.sum,
            moves: this.gameHistory.length,
            history: this.gameHistory
        };
        
        // 从本地存储获取历史记录
        let gameHistory = JSON.parse(localStorage.getItem('numberGameHistory')) || [];
        
        // 将新游戏记录添加到历史记录数组
        gameHistory.push(gameRecord);
        
        // 存回本地存储
        localStorage.setItem('numberGameHistory', JSON.stringify(gameHistory));
    },
    
    // 获取所有历史游戏记录
    getAllGamesHistory() {
        return JSON.parse(localStorage.getItem('numberGameHistory')) || [];
    },
    
    // 根据ID获取特定游戏记录
    getGameById(gameId) {
        const history = this.getAllGamesHistory();
        return history.find(game => game.id === gameId);
    },
    
    // 获取历史统计信息
    getHistoryStats() {
        const history = this.getAllGamesHistory();
        
        return {
            totalGames: history.length,
            userWins: history.filter(game => game.winner === '你').length,
            aiWins: history.filter(game => game.winner === 'AI').length
        };
    },
    
    // 清除所有历史记录
    clearAllHistory() {
        localStorage.removeItem('numberGameHistory');
        return true;
    }
}; 
