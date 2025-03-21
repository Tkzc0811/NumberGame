// 动画和视觉效果
const Animations = {
    // 显示数字动画
    showNumberAnimation(number, isHuman) {
        const animatedNumber = document.createElement('div');
        animatedNumber.className = `number-animation ${isHuman ? 'user-number' : 'robot-number'}`;
        animatedNumber.textContent = `+${number}`;
        
        // 计算位置 - 从当前玩家的区域中心开始
        const playerIndicator = isHuman ? UI.elements.userIndicator : UI.elements.robotIndicator;
        const rect = playerIndicator.getBoundingClientRect();
        const startX = rect.left + rect.width / 2;
        const startY = rect.top + rect.height / 2;
        
        // 设置位置并确保可见
        animatedNumber.style.left = `${startX}px`;
        animatedNumber.style.top = `${startY}px`;
        
        document.body.appendChild(animatedNumber);
        
        // 动画结束后移除元素
        setTimeout(() => {
            if (animatedNumber && animatedNumber.parentNode) {
                animatedNumber.parentNode.removeChild(animatedNumber);
            }
        }, gameConfig.animationDuration);
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
        
        // 显示模态框
        UI.showVictoryModal();
        
        // 只在玩家获胜时创建彩带效果
        if (winner === '你') {
            this.createConfetti();
        }
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
