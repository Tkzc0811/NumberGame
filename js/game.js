// 游戏逻辑
const Game = {
    sum: 0,
    isUserTurn: true,
    gameHistory: [],
    
    // 开始新游戏
    startGame(isUserFirst) {
        this.resetGame();
        this.isUserTurn = isUserFirst;
        
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
        
        // 更新总和
        this.sum += number;
        UI.updateScore(this.sum);
        
        // 显示数字动画
        Animations.showNumberAnimation(number, isHuman);
        
        // 添加到历史记录
        const player = isHuman ? '你' : 'AI';
        
        // 存储到游戏历史数组
        this.gameHistory.push({
            player: player,
            number: number,
            sum: this.sum,
            text: `添加了 ${number}。总和: ${this.sum}`
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
        
        // 必胜策略实现
        // 必胜点：0、2、4、6、8、9
        // 必败点：1、3、5、7
        
        switch (this.sum) {
            case 0: // 开局选2
                number = 2;
                break;
            case 1: // 在1处于必败点，但需要尽量拖延
                number = 2; // 选择2，推进到3
                break;
            case 2: // 必胜点，选1推进到3
                number = 1;
                break;
            case 3: // 处于必败点，随便选
                number = Math.random() < 0.5 ? 1 : 2;
                break;
            case 4: // 必胜点，选1推进到5
                number = 1;
                break;
            case 5: // 处于必败点，随便选
                number = Math.random() < 0.5 ? 1 : 2;
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
        
        // 显示胜利画面
        Animations.showVictory(winner, this.sum, this.gameHistory.length);
    },
    
    // 重置游戏
    resetGame() {
        this.sum = 0;
        this.gameHistory = [];
        UI.updateScore(0);
        UI.clearHistory();
    }
}; 
