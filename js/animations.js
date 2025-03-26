// 动画和视觉效果
const Animations = {
    // 显示数字动画
    showNumberAnimation(number, isHuman) {
        const animatedNumber = document.createElement('div');
        animatedNumber.className = `number-animation ${isHuman ? 'user-number' : 'robot-number'}`;
        animatedNumber.textContent = `+${number}`;
        
        // 将数字显示在状态区域的上方
        const statusArea = document.querySelector('.status-area');
        const rect = statusArea.getBoundingClientRect();
        
        // 计算状态区域的中心点，并向上偏移
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top - 80; // 状态区域上方80px
        
        // 设置数字动画的位置
        animatedNumber.style.left = `${centerX}px`;
        animatedNumber.style.top = `${centerY}px`;
        
        document.body.appendChild(animatedNumber);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (animatedNumber && animatedNumber.parentNode) {
                animatedNumber.parentNode.removeChild(animatedNumber);
            }
        }, gameConfig.animationDuration);
        
        // 返回动画持续时间
        return gameConfig.animationDuration;
    },
    
    // 创建胜利庆祝效果
    createConfetti() {
        const colors = ['#f00', '#0f0', '#00f', '#ff0', '#0ff', '#f0f'];
        
        for (let i = 0; i < gameConfig.confettiCount; i++) {
            const confetti = document.createElement('div');
            confetti.className = 'confetti';
            confetti.style.left = Math.random() * 100 + 'vw';
            confetti.style.backgroundColor = colors[Math.floor(Math.random() * colors.length)];
            confetti.style.animationDuration = (Math.random() * 3 + 2) + 's';
            document.body.appendChild(confetti);
            
            // 动画后移除彩带
            setTimeout(() => {
                if (confetti && confetti.parentNode) {
                    confetti.parentNode.removeChild(confetti);
                }
            }, 5000);
        }
    },
    
    // 显示胜利画面
    showVictory(winner, sum, moveCount) {
        // 准备历史记录
        this.prepareHistoryList();
        
        // 更新胜利信息
        UI.updateVictoryInfo(winner, sum, moveCount);
        
        // 确保显示提示文本
        document.querySelector('.prompt-text').style.display = 'block';
        
        // 延迟显示模态框，等待最后一个数字动画完成
        setTimeout(() => {
            // 显示模态框
            UI.showVictoryModal();
            
            // 只在玩家获胜时创建彩带效果
            if (winner === '你') {
                this.createConfetti();
            }
        }, gameConfig.animationDuration);
    },
    
    // 准备历史记录列表
    prepareHistoryList() {
        // 清除胜利历史列表
        UI.elements.victoryHistoryList.innerHTML = '';
        
        // 创建历史流容器
        const historyFlow = document.createElement('div');
        historyFlow.className = 'history-flow';
        
        // 从存储的数组重建完整历史
        Game.gameHistory.forEach((move, index) => {
            // 创建流程项容器
            const flowItem = document.createElement('div');
            flowItem.className = 'flow-item';
            
            // 创建步骤元素
            const flowStep = document.createElement('div');
            flowStep.className = `flow-step ${move.player === '你' ? 'user-step' : 'ai-step'}`;
            flowStep.textContent = `${move.player === '你' ? '你' : 'AI'}:${move.number}`;
            flowItem.appendChild(flowStep);
            
            // 添加箭头（如果不是最后一步）
            if (index < Game.gameHistory.length - 1) {
                const arrow = document.createElement('div');
                arrow.className = 'flow-arrow';
                flowItem.appendChild(arrow);
            }
            
            // 添加到流程图
            historyFlow.appendChild(flowItem);
        });
        
        // 将整个流程图添加到胜利历史列表
        UI.elements.victoryHistoryList.appendChild(historyFlow);
    },
    
    // 设置彩带样式
    setupConfettiStyle() {
        // 确保彩带样式存在 - 已移到CSS文件中
    }
}; 
