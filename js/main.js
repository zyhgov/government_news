let currentCategory = 'all';
let currentSort = 'desc'; // 默认按日期降序
let currentIndex = 0;
const perPage = 6;

// 判断是否为外链
function isExternalLink(url) {
  try {
    const currentDomain = window.location.hostname;
    const link = new URL(url, window.location.href);
    return !link.hostname.endsWith(currentDomain);
  } catch (e) {
    return false; // 如果解析失败，视为内链
  }
}
// 高亮关键词
function highlightKeyword(text, keyword) {
  if (!keyword) return text;
  const escaped = keyword.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(escaped, 'gi');
  return text.replace(regex, match => `<span class="highlight">${match}</span>`);
}

// 渲染分类标签
function categoryLabel(category) {
  switch (category) {
    case 'news': return '资讯';
    case 'government': return '政务';
    case 'encyclopedia': return '百科';
    case 'tech': return '技术';
    case 'science': return '科技';
    case 'blog': return '博客';
    case 'insight': return '观察';
    default: return '其他';

  }
}
const startTime = performance.now();  // 查询开始时间
function showLoading() {
    $('#loading').show();
}

function hideLoading() {
    $('#loading').hide();
}
// 渲染新闻列表
function renderNews(reset = false) {
  showLoading(); // 显示加载动画

  const $list = $('#news-list');
  if (reset) {
    $list.empty();
    currentIndex = 0;
    $('#no-more').hide();
  }

  let filtered = newsData.filter(item =>
    currentCategory === 'all' || item.category === currentCategory
  );

  const keyword = $('#searchInput').val().trim().toLowerCase();
  if (keyword) {
    filtered = filtered.filter(item =>
      item.title.toLowerCase().includes(keyword) ||
      item.desc.toLowerCase().includes(keyword)
    );
  }

// 根据不同排序方式排序
filtered.sort((a, b) => {
  if (currentSort === 'id_desc') {
    return (a.id || 0) - (b.id || 0); // 按 ID 升序
  } else if (currentSort === 'id_asc') {
    return (b.id || 0) - (a.id || 0); // 按 ID 降序
  } else if (currentSort === 'asc') {
    return new Date(a.date) - new Date(b.date); // 按日期升序
  } else {
    return new Date(b.date) - new Date(a.date); // 按日期降序，默认情况
  }
});



  const nextItems = filtered.slice(currentIndex, currentIndex + perPage);

  if (nextItems.length === 0 && currentIndex === 0) {
    $list.html('<div class="no-result">没有找到相关内容。</div>');
    $('#load-more').hide();
    $('#no-more').hide();
    hideLoading(); // 没有数据时关闭加载动画
    return;
  }

  nextItems.forEach(item => {
    const title = highlightKeyword(item.title, keyword);
    const desc = highlightKeyword(item.desc, keyword);
    const link = item.link ? item.link : '#';

const html = `
  <div class="news-item news-item-clickable" onclick="handleNewsClick('${link}')">
    <div class="news-image">
      <img src="${item.img || '/img/default.jpg'}" alt="MPD">
    </div>
    <div class="news-content">
      <div class="news-meta">${categoryLabel(item.category)} ｜ ${item.date}</div>
      <div class="news-id">档案编号：${item.id || '-'}</div>
      <div class="news-title">${title}</div>
      <div class="news-desc">${desc}</div>
    </div>
  </div>
`;
    $list.append(html);
  });

  currentIndex += perPage;

  if (currentIndex >= filtered.length) {
    $('#load-more').hide();
    $('#no-more').show();
  } else {
    $('#load-more').show();
    $('#no-more').hide();
  }

  const endTime = performance.now();
  const usedTime = ((endTime - startTime) / 1000).toFixed(2);
  const totalCount = filtered.length;

  $('#stats').html(`数据库共找到 ${totalCount} 条数据，用时 ${usedTime} 秒`);

  hideLoading(); // 渲染完成后隐藏加载动画
}



$(document).ready(function () {
  renderNews(true);

  // 分类按钮切换
  $('.tab').on('click', function () {
    $('.tab').removeClass('active');
    $(this).addClass('active');
    currentCategory = $(this).data('category');
    renderNews(true);
  });

  // 排序切换
  $('#sortSelect').on('change', function () {
    currentSort = $(this).val();
    renderNews(true);
  });

  // 加载更多
  $('#load-more').on('click', function () {
    renderNews(false);
  });

  // 搜索框
  $('#searchInput').on('input', function () {
    renderNews(true);
  });
});



let pendingRedirectUrl = null;
let countdownInterval = null;

// 显示弹窗并开始倒计时
function showConfirmModal(url) {
  pendingRedirectUrl = url;
  document.getElementById('confirmModal').style.display = 'flex';

  let count = 5;
  const countdownEl = document.getElementById('countdown');
  countdownEl.textContent = count;

  // 清除旧倒计时
  if (countdownInterval) clearInterval(countdownInterval);

  // 开始倒计时
  countdownInterval = setInterval(() => {
    count--;
    countdownEl.textContent = count;
    if (count <= 0) {
      clearInterval(countdownInterval);
      window.open(pendingRedirectUrl, '_blank');
      hideConfirmModal();
    }
  }, 1000);
}

// 隐藏弹窗
function hideConfirmModal() {
  pendingRedirectUrl = null;
  document.getElementById('confirmModal').style.display = 'none';
  if (countdownInterval) clearInterval(countdownInterval);
}

// 手动点击确定跳转
function confirmRedirect() {
  if (pendingRedirectUrl) {
    window.open(pendingRedirectUrl, '_blank');
    hideConfirmModal();
  }
}

// 绑定按钮点击
document.addEventListener('DOMContentLoaded', function () {
  const btn = document.getElementById('confirmRedirectBtn');
  if (btn) {
    btn.onclick = confirmRedirect;
  }
});

function handleNewsClick(url) {
  if (isExternalLink(url)) {
    showConfirmModal(url);
  } else {
    window.open(url, '_blank');
  }
}