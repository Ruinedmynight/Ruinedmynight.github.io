// ==========================================
// 深度睡眠 · 主脚本
// ==========================================

/* ---------- 工具函数 ---------- */

function $(sel, ctx) { return (ctx || document).querySelector(sel); }
function $$(sel, ctx) { return Array.from((ctx || document).querySelectorAll(sel)); }

function html(str) {
  var t = document.createElement('template');
  t.innerHTML = str.trim();
  return t.content.firstChild;
}

var _fetchCache = {};

function cachedFetch(url) {
  if (_fetchCache[url]) return _fetchCache[url];
  return _fetchCache[url] = fetch(url).then(function(r) {
    if (!r.ok) throw new Error('HTTP ' + r.status);
    return r.text();
  });
}

function parseFrontmatter(text) {
  var meta = {}, body = text;
  var m = text.match(/^---\n([\s\S]*?)\n---\n([\s\S]*)$/);
  if (m) {
    body = m[2];
    (m[1].match(/(.+?):\s*(.*)/g) || []).forEach(function(line) {
      var idx = line.indexOf(':');
      var key = line.slice(0, idx).trim();
      var val = line.slice(idx + 1).trim();
      if (val.startsWith('[') && val.endsWith(']')) {
        val = val.slice(1, -1).split(',').map(function(s) { return s.trim().replace(/^['"]|['"]$/g, ''); });
      } else {
        val = val.replace(/^['"]|['"]$/g, '');
      }
      meta[key] = val;
    });
  }
  return { meta: meta, body: body };
}

function formatDate(dateStr) {
  if (!dateStr) return { display: '', monthYear: '', day: '' };
  var d = new Date(dateStr);
  if (isNaN(d.getTime())) return { display: dateStr, monthYear: dateStr, day: '' };
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var m = months[d.getMonth()];
  return {
    display: m + ' ' + d.getDate() + ', ' + d.getFullYear(),
    monthYear: m + ' ' + d.getFullYear(),
    day: d.getDate() + ''
  };
}

function postUrl(slug) {
  return 'post.html?slug=' + encodeURIComponent(slug);
}

/* ---------- 文章数据 ---------- */

var POST_SLUGS = [
  '删除-Win10-中网络名称后边的数字',
  '开启Windows10和11系统隐藏的高性能模式',
  '隐藏Windows安全通知',
  '解决猎杀对决启动游戏黑屏的问题'
];

var _postsCache = null;

async function getPosts() {
  if (_postsCache) return _postsCache;
  var posts = [];
  for (var i = 0; i < POST_SLUGS.length; i++) {
    var slug = POST_SLUGS[i];
    try {
      var mdText = await cachedFetch('posts/' + encodeURIComponent(slug) + '.md');
      var parsed = parseFrontmatter(mdText);
      var meta = parsed.meta;
      var categories = meta.categories || meta.category || [];
      if (typeof categories === 'string') categories = [categories];
      var tags = meta.tags || [];
      if (typeof tags === 'string') tags = [tags];
      var dateObj = formatDate(meta.date);
      posts.push({
        slug: slug,
        title: meta.title || slug,
        date: meta.date || '',
        dateObj: dateObj,
        categories: categories,
        tags: tags,
        excerpt: meta.excerpt || ''
      });
    } catch(e) { /* 跳过失败 */ }
  }
  posts.sort(function(a, b) { return new Date(b.date) - new Date(a.date); });
  _postsCache = posts;
  return posts;
}

/* ---------- Starry Sky ---------- */

(function initStars() {
  var sky = document.getElementById('starry-sky');
  if (!sky) return;
  var frag = document.createDocumentFragment();
  for (var i = 0; i < 80; i++) {
    var star = document.createElement('div');
    star.className = 'star';
    var size = 1 + Math.random() * 2.5;
    var isAccent = Math.random() > 0.7;
    star.style.cssText =
      'left:' + (Math.random() * 100) + '%;' +
      'top:' + (Math.random() * 100) + '%;' +
      'width:' + size + 'px;height:' + size + 'px;' +
      'animation-delay:' + (Math.random() * 6) + 's;' +
      'animation-duration:' + (2 + Math.random() * 4) + 's;' +
      (isAccent ? 'background:rgba(106,143,160,0.6);box-shadow:0 0 4px rgba(106,143,160,0.3);' : '');
    frag.appendChild(star);
  }
  sky.appendChild(frag);
})();

/* ---------- 主题切换 ---------- */

(function initTheme() {
  var htmlEl = document.documentElement;
  var stored = localStorage.getItem('theme');
  if (stored === 'light') htmlEl.setAttribute('data-theme', 'light');

  var btn = document.createElement('button');
  btn.className = 'theme-toggle';
  btn.setAttribute('aria-label', '切换主题');

  function setTheme(light) {
    if (light) {
      htmlEl.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
    } else {
      htmlEl.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
    }
    btn.textContent = light ? '暗' : '明';
  }

  setTheme(stored === 'light');

  var right = $('.header-right');
  if (right) right.appendChild(btn);

  btn.addEventListener('click', function() {
    setTheme(htmlEl.getAttribute('data-theme') !== 'light');
  });
})();

/* ---------- 搜索 ---------- */

(function initSearch() {
  var right = $('.header-right');
  if (!right) return;

  var toggleBtn = html(
    '<button class="search-toggle" aria-label="搜索">' +
      '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
        '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' +
      '</svg>' +
    '</button>'
  );
  right.appendChild(toggleBtn);

  var overlay = html(
    '<div class="search-overlay">' +
      '<div class="search-overlay-inner">' +
        '<input type="text" class="search-input" placeholder="搜索文章..." autofocus>' +
        '<ul class="search-results"></ul>' +
      '</div>' +
      '<button class="search-close" aria-label="关闭搜索">✕</button>' +
    '</div>'
  );
  document.body.appendChild(overlay);

  var input = overlay.querySelector('.search-input');
  var results = overlay.querySelector('.search-results');
  var close = overlay.querySelector('.search-close');

  function open() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function() { input.focus(); }, 100);
  }

  function closeSearch() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    input.value = '';
    results.innerHTML = '';
  }

  toggleBtn.addEventListener('click', function(e) {
    e.stopPropagation();
    if (overlay.classList.contains('open')) { closeSearch(); return; }
    open();
  });

  close.addEventListener('click', closeSearch);
  overlay.addEventListener('click', function(e) {
    if (e.target === overlay) closeSearch();
  });

  input.addEventListener('keydown', function(e) {
    if (e.key === 'Escape') closeSearch();
  });

  var searchTimer;
  input.addEventListener('input', function() {
    clearTimeout(searchTimer);
    var q = input.value.trim().toLowerCase();
    searchTimer = setTimeout(function() {
      if (q.length < 1) { results.innerHTML = ''; return; }
      getPosts().then(function(posts) {
        var matched = posts.filter(function(p) {
          return p.title.toLowerCase().indexOf(q) !== -1 ||
            p.excerpt.toLowerCase().indexOf(q) !== -1 ||
            p.tags.some(function(t) { return t.toLowerCase().indexOf(q) !== -1; }) ||
            p.categories.some(function(c) { return c.toLowerCase().indexOf(q) !== -1; });
        });
        results.innerHTML = !matched.length
          ? '<li class="search-no-results">未找到相关文章</li>'
          : matched.map(function(p) {
              return '<li><a href="' + postUrl(p.slug) + '">' +
                '<span class="search-result-title">' + p.title + '</span>' +
                '<span class="search-result-meta">' + p.dateObj.display + (p.categories.length ? ' · ' + p.categories.join(', ') : '') + '</span>' +
              '</a></li>';
            }).join('');
      });
    }, 150);
  });
})();

/* ---------- 移动端菜单 ---------- */

(function initMenu() {
  var toggle = $('.menu-toggle');
  var nav = $('.nav-links');
  if (!toggle || !nav) return;

  function close() {
    nav.classList.remove('open');
    toggle.classList.remove('active');
  }

  toggle.addEventListener('click', function(e) {
    e.stopPropagation();
    nav.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  $$('a', nav).forEach(function(link) {
    link.addEventListener('click', close);
  });

  document.addEventListener('click', function(e) {
    if (!e.target.closest('.header-inner')) close();
  });
})();

/* ---------- 渲染首页 ---------- */

async function renderIndex() {
  var container = document.getElementById('post-list');
  if (!container) return;
  var posts = await getPosts();
  if (!posts.length) {
    container.innerHTML = '<p style="color:var(--color-text-muted);text-align:center;padding:64px 0;">暂无文章</p>';
    return;
  }
  container.innerHTML = posts.map(function(p) {
    return '<article class="post-card">' +
      '<div class="post-card-meta">' +
        '<span class="post-category">' + p.categories.join(', ') + '</span>' +
        '<time>' + p.dateObj.display + '</time>' +
      '</div>' +
      '<h2><a href="' + postUrl(p.slug) + '">' + p.title + '</a></h2>' +
      (p.excerpt ? '<p>' + p.excerpt + '</p>' : '') +
      '<div class="post-card-tags">' +
        p.tags.map(function(t) { return '<span class="tag">#' + t + '</span>'; }).join('') +
      '</div>' +
    '</article>';
  }).join('');
}

/* ---------- 渲染侧边栏 ---------- */

async function renderSidebar() {
  var posts = await getPosts();

  // 分类
  var catEl = document.getElementById('sidebar-categories');
  if (catEl) {
    var catMap = {};
    posts.forEach(function(p) { p.categories.forEach(function(c) { catMap[c] = (catMap[c] || 0) + 1; }); });
    var cats = Object.keys(catMap).sort();
    catEl.innerHTML = cats.length
      ? cats.map(function(c) {
          return '<li><a href="?category=' + encodeURIComponent(c) + '">' + c + ' <span class="cat-count">' + catMap[c] + '</span></a></li>';
        }).join('')
      : '<li style="color:var(--color-text-muted);font-size:0.875rem;">暂无分类</li>';
  }

  // 最近文章
  var recentEl = document.getElementById('sidebar-recent');
  if (recentEl) {
    recentEl.innerHTML = posts.slice(0, 5).map(function(p) {
      return '<li><a href="' + postUrl(p.slug) + '">' + p.title + '</a></li>';
    }).join('');
  }

  // 标签云
  var tagEl = document.getElementById('sidebar-tags');
  if (tagEl) {
    var tagMap = {};
    posts.forEach(function(p) { p.tags.forEach(function(t) { tagMap[t] = (tagMap[t] || 0) + 1; }); });
    var tags = Object.keys(tagMap).sort();
    tagEl.innerHTML = tags.length
      ? tags.map(function(t) {
          var count = tagMap[t];
          var size = count <= 1 ? '0.8rem' : count <= 2 ? '0.9rem' : '1rem';
          return '<a href="?tag=' + encodeURIComponent(t) + '" style="font-size:' + size + ';opacity:' + Math.min(1, 0.5 + count * 0.2) + '">#' + t + '</a>';
        }).join('')
      : '<span style="color:var(--color-text-muted);font-size:0.875rem;">暂无标签</span>';
  }
}

/* ---------- 渲染文章详情 ---------- */

async function renderPost() {
  var container = document.getElementById('post-content');
  if (!container) return;

  var params = new URLSearchParams(window.location.search);
  var slug = params.get('slug');
  if (!slug) {
    container.innerHTML = '<p style="color:var(--color-text-muted)">未指定文章</p>';
    return;
  }

  try {
    var mdText = await cachedFetch('posts/' + encodeURIComponent(slug) + '.md');
    var parsed = parseFrontmatter(mdText);
    var meta = parsed.meta;

    document.title = (meta.title || slug) + ' — 深度睡眠';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = meta.excerpt || '';

    var categories = meta.categories || meta.category || [];
    if (typeof categories === 'string') categories = [categories];
    var fd = formatDate(meta.date);

    var headerEl = document.getElementById('post-header');
    if (headerEl) {
      headerEl.innerHTML =
        '<div class="post-meta">' +
          '<span class="post-category">' + categories.join(', ') + '</span>' +
          '<span style="color:var(--color-text-muted)"> · ' + fd.display + '</span>' +
        '</div>' +
        '<h1>' + (meta.title || slug) + '</h1>';
    }

    container.innerHTML = marked.parse(parsed.body);

    if (typeof hljs !== 'undefined') {
      $$('pre code', container).forEach(function(block) { hljs.highlightElement(block); });
    }
    $$('img', container).forEach(function(img) { img.loading = 'lazy'; });

    // 上下篇导航
    var posts = await getPosts();
    var idx = posts.findIndex(function(p) { return p.slug === slug; });
    var prev = idx > 0 ? posts[idx - 1] : null;
    var next = (idx < posts.length - 1 && idx !== -1) ? posts[idx + 1] : null;

    var navEl = document.getElementById('post-nav');
    if (navEl) {
      navEl.innerHTML =
        (prev
          ? '<a href="' + postUrl(prev.slug) + '" class="prev"><span class="nav-label">← 上一篇</span>' + prev.title + '</a>'
          : '<div></div>') +
        (next
          ? '<a href="' + postUrl(next.slug) + '" class="next"><span class="nav-label">下一篇 →</span>' + next.title + '</a>'
          : '<div></div>');
    }
  } catch(err) {
    console.error('Failed to load post:', err);
    container.innerHTML = '<p style="color:var(--color-text-muted)">文章未找到</p>';
  }
}

/* ---------- 渲染归档 ---------- */

async function renderArchive() {
  var container = document.getElementById('archive-list');
  if (!container) return;
  var posts = await getPosts();
  if (!posts.length) {
    container.innerHTML = '<p style="color:var(--color-text-muted);text-align:center;padding:48px 0;">暂无文章</p>';
    return;
  }

  var groups = {};
  posts.forEach(function(p) {
    var key = p.dateObj.monthYear;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });

  var sortedMonths = Object.keys(groups).sort(function(a, b) { return new Date(b) - new Date(a); });

  container.innerHTML = sortedMonths.map(function(month) {
    return '<div class="archive-month">' +
      '<h2 class="archive-month-title">' + month + '</h2>' +
      '<ul class="archive-list">' +
        groups[month].map(function(p) {
          return '<li class="archive-item">' +
            '<span class="archive-day">' + p.dateObj.day + '</span>' +
            '<a href="' + postUrl(p.slug) + '">' + p.title + '</a>' +
            '<span class="archive-category">' + p.categories.join(', ') + '</span>' +
          '</li>';
        }).join('') +
      '</ul>' +
    '</div>';
  }).join('');
}

/* ---------- 阅读进度 & 头部阴影 ---------- */

(function initScrollEffects() {
  var header = $('.site-header');
  var progressBar = $('.progress-bar');
  var ticking = false;

  window.addEventListener('scroll', function() {
    if (ticking) return;
    requestAnimationFrame(function() {
      var sy = window.scrollY;
      if (header) header.classList.toggle('scrolled', sy > 10);
      if (progressBar) {
        var docH = document.documentElement.scrollHeight - window.innerHeight;
        progressBar.style.width = (docH > 0 ? (sy / docH) * 100 : 0) + '%';
      }
      ticking = false;
    });
    ticking = true;
  });
})();

/* ---------- 启动 ---------- */

document.addEventListener('DOMContentLoaded', function() {
  renderSidebar();
  if (document.getElementById('post-list')) renderIndex();
  if (document.getElementById('post-content')) renderPost();
  if (document.getElementById('archive-list')) renderArchive();
});
