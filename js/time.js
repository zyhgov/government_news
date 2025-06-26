        // 设置网站开始运行的时间（请根据实际上线日期修改）
        const startDate = new Date('2025-01-01T00:00:00').getTime(); // 替换为你自己的上线时间

        function updateRunningTime() {
            const now = new Date().getTime();
            const diff = now - startDate;

            const days = Math.floor(diff / (1000 * 60 * 60 * 24));
            const hours = Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
            const minutes = Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60));
            const seconds = Math.floor((diff % (1000 * 60)) / 1000);

            document.getElementById('running-time').textContent =
                `平稳运行 : ${days} 天 ${hours} 时 ${minutes} 分 ${seconds} 秒`;
        }

        // 初始调用一次
        updateRunningTime();

        // 每秒钟更新一次
        setInterval(updateRunningTime, 1000);