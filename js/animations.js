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
        
        // 从存储的数组重建完整历史
        Game.gameHistory.forEach(move => {
            const historyItem = document.createElement('div');
            historyItem.className = `history-item ${move.player === '你' ? 'user-move' : 'robot-move'}`;
            
            const moveNumber = document.createElement('div');
            moveNumber.className = 'move-number';
            moveNumber.textContent = move.number;
            
            const moveText = document.createElement('div');
            moveText.className = 'move-text';
            moveText.textContent = `${move.player} ${move.text}`;
            
            historyItem.appendChild(moveNumber);
            historyItem.appendChild(moveText);
            UI.elements.victoryHistoryList.appendChild(historyItem);
        });
    },
    
    // 设置彩带样式
    setupConfettiStyle() {
        // 确保彩带样式存在 - 已移到CSS文件中
    }
}; 
