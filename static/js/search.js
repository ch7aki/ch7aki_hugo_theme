// 指定クエリでindex.jsonから記事検索
async function fetchSearchResults(query) 
{
  const response = await fetch('/index.json');
  const data = await response.json();
  query = query.toLowerCase();
  return data.filter(item =>
    item.title.toLowerCase().includes(query) ||
    item.content.toLowerCase().includes(query)
  );
}

// URLクエリパラメータ取得
function getQueryParam(param) 
{
  return new URLSearchParams(window.location.search).get(param);
}

// ページネーションのHTMLを生成（現在ページはspan、他はリンク）
function renderPagination(currentPage, totalPages, query) 
{
  const links = [];
  for (let i = 1; i <= totalPages; i++) 
  {
    if (i === currentPage) 
    {
      links.push(`<span class="current">${i}</span>`);
    } 
    else 
    {
      links.push(`<a href="?q=${encodeURIComponent(query)}&page=${i}">${i}</a>`);
    }
  }
  return `<div style="text-align: center;">
            <nav class="pagination" style="display: inline-block;">
              ${links.join(' ')}
            </nav>
          </div>`;
}

// 1記事分のHTMLを作成
function renderArticleItem(item) 
{
  const dateStr = item.date ? new Date(item.date).toISOString().slice(0, 10) : '';
  const tagsHtml = item.tags
    ? `<span class="tags">${item.tags.map(tag => `<a href="/tags/${encodeURIComponent(tag)}" class="tag">#${tag}</a>`).join('')}</span>`
    : '';
  return `
    <div class="article-item">
      <div class="article-meta">
        <time datetime="${item.date || ''}">${dateStr}</time>
        ${tagsHtml}
      </div>
      <h2><a href="${item.permalink}">${item.title}</a></h2>
      <p>${item.summary}</p>
    </div>
  `;
}

// 検索結果のリストとページネーション描画
function renderResults(results, page = 1, perPage = 5) 
{
  const totalPages = Math.ceil(results.length / perPage);
  const start = (page - 1) * perPage;
  const paginated = results.slice(start, start + perPage);

  if (results.length === 0) 
  {
    articleList.innerHTML = '<p>該当ワードを含む記事はありません。</p>';
    paginationControls.innerHTML = '';
    return;
  }
  document.getElementById('articleList').innerHTML = paginated.map(renderArticleItem).join('');
  const query = getQueryParam('q') || '';
  document.getElementById('paginationControls').innerHTML = renderPagination(page, totalPages, query);
}

// ページ読み込み時にクエリ取得し、検索して結果表示
(async () => 
  {
    const query = getQueryParam('q');
    if (!query) 
    {
      // クエリがない場合は検索結果表示しない
      return;
    }
    document.getElementById('searchQueryDisplay').textContent = `検索語句: 「${query}」`;
    const results = await fetchSearchResults(query);
    const page = parseInt(getQueryParam('page')) || 1;
    renderResults(results, page);
})();
