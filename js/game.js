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
        
        // 优化后的AI策略：尽量让总和变为3的倍数(3,6,9)
        // 这样可以控制游戏节奏，迫使对手处于不利位置
        
        // 如果当前总和是8，AI选1避免直接失败
        if (this.sum === 8) {
            number = 1;
        } 
        // 如果当前总和是9，AI已无法避免失败，随机选择
        else if (this.sum === 9) {
            number = Math.random() < 0.5 ? 1 : 2;
        }
        // 如果可以直接让总和变为3、6或9（3的倍数），则这样做
        else if ((this.sum + 1) % 3 === 0) {
            number = 1;
        }
        else if ((this.sum + 2) % 3 === 0) {
            number = 2;
        }
        // 如果无法直接达到3的倍数，选择更安全的数字
        else {
            // 如果当前是7，选1更安全，避免玩家直接达到10
            if (this.sum === 7) {
                number = 1;
            }
            // 一般情况下，选1比选2更保守
            else {
                number = Math.random() < 0.7 ? 1 : 2; // 倾向于选1
            }
        }
        
        // 执行AI移动
        this.makeMove(number, false);
    },
    
    // 结束游戏并确定胜者
    endGame() {
        let winner;
        
        // 修改规则：总和达到或超过10的一方失败
        winner = this.isUserTurn ? 'AI' : '你';
        
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
