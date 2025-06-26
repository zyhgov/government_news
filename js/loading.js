  // 提前设置提示
  window.addEventListener('DOMContentLoaded', function () {
    const stats = document.getElementById('stats');
    if (stats) stats.textContent = '数据加载中，请稍候...';
  });

  // 真实加载完成后切换显示内容
  window.addEventListener('load', function () {
    const loading = document.getElementById('loadingPage');
    const main = document.getElementById('mainContent');

    // 渐变隐藏加载页
    loading.style.opacity = '0';
    setTimeout(() => {
      loading.style.display = 'none';
      main.style.display = 'block';
      main.style.opacity = '1';
    }, 500); // 0.5秒后完全切换
  });

  // 超时保护（10秒后强制进入主页面）
  setTimeout(function () {
    const loading = document.getElementById('loadingPage');
    const main = document.getElementById('mainContent');
    if (loading.style.display !== 'none') {
      console.warn('页面加载超时，强制显示主内容。');
      loading.style.display = 'none';
      main.style.display = 'block';
      main.style.opacity = '1';
    }
  }, 10000); // 超过10秒还没加载就强制显示