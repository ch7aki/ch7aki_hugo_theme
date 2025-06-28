const searchInput = document.getElementById('overlaySearchInput');
const searchOverlay = document.getElementById('searchOverlay');
const resultsContainer = document.getElementById('searchResults');
const mainContent = document.querySelector('.main-content');

// index.jsonから検索結果を取得し、クエリにマッチする記事をフィルター
async function fetchSearchResults(query) 
{
  const response = await fetch('/index.json');
  const data = await response.json();
  return data.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.content.toLowerCase().includes(query)
  );
}

// 検索オーバーレイ（モーダル）を表示して入力欄にフォーカス
document.getElementById('searchToggle').addEventListener('click', () => 
{
  searchOverlay.classList.remove('hidden');
  searchInput.focus();
});

// ESCキー押下で検索オーバーレイを閉じる
document.addEventListener('keydown', (e) => 
{
  if (e.key === 'Escape') 
  {
    searchOverlay.classList.add('hidden');
  }
});

// オーバーレイの背景（暗転部分）クリックで閉じる
searchOverlay.addEventListener('click', (e) => 
{
  if (e.target.id === 'searchOverlay' || e.target.classList.contains('overlay-bg')) 
  {
    searchOverlay.classList.add('hidden');
  }
});

// 入力欄でEnterキー押下時に検索ページへ遷移（空文字は無視）
searchInput.addEventListener('keydown', (e) => 
{
  if (e.key === 'Enter') {
    const query = e.target.value.trim();
    if (!query) 
    {
      return;
    }
    window.location.href = `/search?q=${encodeURIComponent(query)}`;
  }
});
