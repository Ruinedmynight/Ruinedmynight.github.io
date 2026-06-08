// ==========================================
// Star Particle System
// ==========================================

(function initStars() {
  var sky = document.getElementById('starry-sky');
  if (!sky) return;
  var fragment = document.createDocumentFragment();
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
    fragment.appendChild(star);
  }
  sky.appendChild(fragment);
})();


// ==========================================
// Mobile Menu Toggle
// ==========================================

(function initMenu() {
  var toggle = document.querySelector('.menu-toggle');
  var nav = document.querySelector('.nav-links');
  if (!toggle || !nav) return;

  toggle.addEventListener('click', function () {
    nav.classList.toggle('open');
    toggle.classList.toggle('active');
  });

  nav.querySelectorAll('a').forEach(function (link) {
    link.addEventListener('click', function () {
      nav.classList.remove('open');
      toggle.classList.remove('active');
    });
  });

  document.addEventListener('click', function (e) {
    if (!e.target.closest('.header-inner')) {
      nav.classList.remove('open');
      toggle.classList.remove('active');
    }
  });
})();


// ==========================================
// Dark / Light Mode Toggle
// ==========================================

(function initThemeToggle() {
  var html = document.documentElement;
  var stored = localStorage.getItem('theme');

  if (stored === 'light') {
    html.setAttribute('data-theme', 'light');
  }

  var toggle = document.createElement('button');
  toggle.className = 'theme-toggle';
  toggle.setAttribute('aria-label', '切换主题');
  toggle.textContent = stored === 'light' ? '暗' : '明';

  // Update star colors when theme changes
  function updateStars(isLight) {
    var stars = document.querySelectorAll('.star');
    stars.forEach(function (s) {
      if (isLight) {
        s.style.background = 'rgba(82,122,140,0.25)';
        s.style.boxShadow = 'none';
      } else {
        s.style.background = 'rgba(106,143,160,0.5)';
        s.style.boxShadow = Math.random() > 0.7 ? '0 0 4px rgba(106,143,160,0.3)' : 'none';
      }
    });
  }

  var headerLeft = document.querySelector('.header-left');
  if (headerLeft) {
    headerLeft.appendChild(toggle);
  }

  toggle.addEventListener('click', function () {
    var isDark = html.getAttribute('data-theme') !== 'light';
    if (isDark) {
      html.setAttribute('data-theme', 'light');
      localStorage.setItem('theme', 'light');
      toggle.textContent = '暗';
      updateStars(true);
    } else {
      html.removeAttribute('data-theme');
      localStorage.setItem('theme', 'dark');
      toggle.textContent = '明';
      updateStars(false);
    }
  });
})();


// ==========================================
// Search Overlay
// ==========================================

(function initSearch() {
  var headerLeft = document.querySelector('.header-left');
  if (!headerLeft) return;

  // Create toggle button
  var toggle = document.createElement('button');
  toggle.className = 'search-toggle';
  toggle.setAttribute('aria-label', '搜索');
  toggle.innerHTML =
    '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">' +
      '<circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>' +
    '</svg>';
  headerLeft.appendChild(toggle);

  // Build overlay
  var overlay = document.createElement('div');
  overlay.className = 'search-overlay';
  overlay.innerHTML =
    '<div class="search-overlay-inner">' +
      '<input type="text" class="search-input" placeholder="搜索文章..." autofocus>' +
      '<ul class="search-results"></ul>' +
    '</div>' +
    '<button class="search-close" aria-label="关闭搜索">\u2715</button>';
  document.body.appendChild(overlay);

  var input = overlay.querySelector('.search-input');
  var results = overlay.querySelector('.search-results');
  var close = overlay.querySelector('.search-close');

  function open() {
    overlay.classList.add('open');
    document.body.style.overflow = 'hidden';
    setTimeout(function () { input.focus(); }, 100);
  }

  function closeSearch() {
    overlay.classList.remove('open');
    document.body.style.overflow = '';
    input.value = '';
    results.innerHTML = '';
  }

  toggle.addEventListener('click', open);
  close.addEventListener('click', closeSearch);

  overlay.addEventListener('click', function (e) {
    if (e.target === overlay) closeSearch();
  });

  document.addEventListener('keydown', function (e) {
    if (e.key === 'Escape' && overlay.classList.contains('open')) closeSearch();
    if (e.key === '/' && !overlay.classList.contains('open') && !e.target.matches('input, textarea')) {
      e.preventDefault();
      open();
    }
  });

  // Debounced search
  var debounceTimer;
  input.addEventListener('input', function () {
    clearTimeout(debounceTimer);
    debounceTimer = setTimeout(performSearch, 200);
  });

  function performSearch() {
    var query = input.value.trim().toLowerCase();
    if (!query) {
      results.innerHTML = '';
      return;
    }

    // Get posts from cache
    if (typeof postsCache === 'undefined' || !postsCache) {
      results.innerHTML = '<li class="no-results">加载文章中...</li>';
      return;
    }

    var filtered = postsCache.filter(function (post) {
      return (post.title && post.title.toLowerCase().indexOf(query) !== -1) ||
             (post.categories && post.categories.some(function (c) { return c.toLowerCase().indexOf(query) !== -1; })) ||
             (post.tags && post.tags.some(function (t) { return t.toLowerCase().indexOf(query) !== -1; })) ||
             (post.excerpt && post.excerpt.toLowerCase().indexOf(query) !== -1);
    }).slice(0, 20);

    if (!filtered.length) {
      results.innerHTML = '<li class="no-results">未找到匹配的文章</li>';
      return;
    }

    results.innerHTML = filtered.map(function (post) {
      var catHtml = post.categories && post.categories.length
        ? '<span class="result-category">' + post.categories.join(', ') + '</span>'
        : '';
      return '<li class="search-result-item">' +
        '<a href="' + postUrl(post.slug) + '">' + post.title + '</a>' +
        '<div class="search-result-meta">' +
          catHtml +
          '<span>' + (post.dateObj ? post.dateObj.display : '') + '</span>' +
        '</div>' +
      '</li>';
    }).join('');
  }
})();


// ==========================================
// YAML Frontmatter Parser
// ==========================================

function parseFrontmatter(mdText) {
  var meta = { title: '', categories: [], date: '', tags: [], excerpt: '' };
  var match = mdText.match(/^---\s*\n([\s\S]*?)\n---\s*\n/);
  if (!match) return { meta: meta, body: mdText };

  var yaml = match[1];
  var body = mdText.slice(match[0].length);

  yaml.split('\n').forEach(function (line) {
    var sep = line.indexOf(': ');
    if (sep === -1) return;
    var key = line.slice(0, sep).trim();
    var val = line.slice(sep + 2).trim();

    if (key === 'tags') {
      val = val.replace(/^\[|\]$/g, '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
      meta.tags = val;
    } else if (key === 'categories') {
      var cats = val.replace(/^\[|\]$/g, '').split(',').map(function (t) { return t.trim(); }).filter(Boolean);
      meta.categories = cats.length ? cats : [''];
    } else if (key === 'title' || key === 'category' || key === 'date' || key === 'excerpt') {
      meta[key] = val;
    }
  });

  return { meta: meta, body: body };
}


// ==========================================
// Date Formatting
// ==========================================

function formatDate(dateStr) {
  var date = new Date(dateStr);
  if (isNaN(date.getTime())) {
    return { display: dateStr, monthYear: dateStr, day: '' };
  }
  var months = ['January','February','March','April','May','June','July','August','September','October','November','December'];
  var month = months[date.getMonth()];
  var year = date.getFullYear();
  var day = date.getDate();
  return {
    display: month + ' ' + day + ', ' + year,
    monthYear: month + ' ' + year,
    day: String(day)
  };
}


// ==========================================
// Blog Data Engine
// ==========================================

var POSTS_JSON = 'posts/posts.json';
var postsCache = null;

async function fetchPosts(force) {
  if (postsCache && !force) return postsCache;

  try {
    var res = await fetch(POSTS_JSON);
    if (!res.ok) throw new Error('HTTP ' + res.status);
    var slugs = await res.json();

    var posts = [];
    for (var i = 0; i < slugs.length; i++) {
      try {
        var mdRes = await fetch('posts/' + slugs[i] + '.md');
        if (!mdRes.ok) continue;
        var mdText = await mdRes.text();
        var parsed = parseFrontmatter(mdText);
        posts.push({ slug: slugs[i], dateObj: formatDate(parsed.meta.date), ...parsed.meta });
      } catch (err) {
        console.warn('Failed to load ' + slugs[i] + '.md:', err);
      }
    }

    postsCache = posts;
    return posts;
  } catch (err) {
    console.error('Failed to load posts:', err);
    return [];
  }
}

function getSlug() {
  var params = new URLSearchParams(window.location.search);
  return params.get('slug');
}

function postUrl(slug) {
  return 'post.html?slug=' + encodeURIComponent(slug);
}


// ==========================================
// Index Page: Render Post List
// ==========================================

async function initIndex() {
  var container = document.getElementById('post-list');
  if (!container) return;

  var posts = await fetchPosts();
  if (!posts.length) {
    container.innerHTML = '<p style="color:var(--color-text-muted);text-align:center;padding:48px 0;">暂无文章</p>';
    return;
  }

  container.innerHTML = posts.map(function (post) {
    return '<article class="post-card">' +
      '<div class="post-meta">' +
        '<span class="post-category">' + post.categories.join(', ') + '</span>' +
        '<span style="color:var(--color-text-muted)">' + post.dateObj.display + '</span>' +
      '</div>' +
      '<h2><a href="' + postUrl(post.slug) + '">' + post.title + '</a></h2>' +
      '<p class="post-excerpt">' + post.excerpt + '</p>' +
      '<a href="' + postUrl(post.slug) + '" class="read-more">阅读全文</a>' +
    '</article>';
  }).join('');
}


// ==========================================
// Sidebar: Categories, Recent Posts, Tags
// ==========================================

async function initSidebar() {
  var sidebar = document.querySelector('.sidebar');
  if (!sidebar) return;

  var posts = await fetchPosts();
  if (!posts.length) return;

  // Categories
  var catWidget = sidebar.querySelector('#sidebar-categories');
  if (catWidget) {
    var catMap = {};
    posts.forEach(function (p) {
      p.categories.forEach(function (cat) {
        catMap[cat] = (catMap[cat] || 0) + 1;
      });
    });
    catWidget.innerHTML = Object.entries(catMap).map(function (pair) {
      return '<li><a href="#">' + pair[0] + '</a><span class="count">' + pair[1] + '</span></li>';
    }).join('');
  }

  // Recent posts
  var recentWidget = sidebar.querySelector('#sidebar-recent');
  if (recentWidget) {
    var recent = posts.slice(0, 5);
    recentWidget.innerHTML = recent.map(function (p) {
      return '<li>' +
        '<div class="recent-title"><a href="' + postUrl(p.slug) + '">' + p.title + '</a></div>' +
        '<div class="recent-date">' + p.dateObj.display + '</div>' +
      '</li>';
    }).join('');
  }

  // Tags
  var tagsWidget = sidebar.querySelector('#sidebar-tags');
  if (tagsWidget) {
    var tagSet = new Set();
    posts.forEach(function (p) { p.tags.forEach(function (t) { tagSet.add(t); }); });
    tagsWidget.innerHTML = Array.from(tagSet).map(function (tag) {
      return '<a href="#">' + tag + '</a>';
    }).join('');
  }
}


// ==========================================
// Post Page: Load and Render Markdown
// ==========================================

async function initPost() {
  var container = document.getElementById('post-content');
  if (!container) return;

  var slug = getSlug();
  if (!slug) {
    container.innerHTML = '<p style="color:var(--color-text-muted)">未指定文章</p>';
    return;
  }

  try {
    var mdRes = await fetch('posts/' + slug + '.md');
    if (!mdRes.ok) throw new Error('HTTP ' + mdRes.status);
    var mdText = await mdRes.text();

    var parsed = parseFrontmatter(mdText);
    var meta = parsed.meta;
    var body = parsed.body;

    document.title = (meta.title || slug) + ' — 深度睡眠';
    var metaDesc = document.querySelector('meta[name="description"]');
    if (metaDesc) metaDesc.content = meta.excerpt || '';

    var headerEl = document.getElementById('post-header');
    var fmDate = formatDate(meta.date);
    if (headerEl) {
      headerEl.innerHTML =
        '<div class="post-meta">' +
          '<span class="post-category">' + (meta.categories ? meta.categories.join(', ') : '') + '</span>' +
          '<span style="color:var(--color-text-muted)">' + ' · ' + fmDate.display + '</span>' +
        '</div>' +
        '<h1>' + (meta.title || slug) + '</h1>';
    }

    container.innerHTML = marked.parse(body);

    if (typeof hljs !== 'undefined') {
      container.querySelectorAll('pre code').forEach(function (block) { hljs.highlightElement(block); });
    }
    container.querySelectorAll('img').forEach(function (img) { img.loading = 'lazy'; });

    var posts = await fetchPosts();
    var idx = posts.findIndex(function (p) { return p.slug === slug; });
    var prev = idx > 0 ? posts[idx - 1] : null;
    var next = (idx < posts.length - 1 && idx !== -1) ? posts[idx + 1] : null;

    var navEl = document.getElementById('post-nav');
    if (navEl) {
      navEl.innerHTML =
        (prev
          ? '<a href="' + postUrl(prev.slug) + '" class="prev">' +
            '<span class="nav-label">\u2190 上一篇</span>' + prev.title +
          '</a>'
          : '<div></div>') +
        (next
          ? '<a href="' + postUrl(next.slug) + '" class="next">' +
            '<span class="nav-label">下一篇 \u2192</span>' + next.title +
          '</a>'
          : '<div></div>');
    }
  } catch (err) {
    console.error('Failed to load post:', err);
    container.innerHTML = '<p style="color:var(--color-text-muted)">文章未找到</p>';
  }
}


// ==========================================
// Archive Page: Group Posts by Month
// ==========================================

async function initArchive() {
  var container = document.getElementById('archive-list');
  if (!container) return;

  var posts = await fetchPosts();
  if (!posts.length) {
    container.innerHTML = '<p style="color:var(--color-text-muted);text-align:center;padding:48px 0;">暂无文章</p>';
    return;
  }

  var groups = {};
  posts.forEach(function (p) {
    var key = p.dateObj.monthYear;
    if (!groups[key]) groups[key] = [];
    groups[key].push(p);
  });

  var sortedMonths = Object.keys(groups).sort(function (a, b) {
    return new Date(b) - new Date(a);
  });

  container.innerHTML = sortedMonths.map(function (month) {
    return '<div class="archive-month">' +
      '<h2 class="archive-month-title">' + month + '</h2>' +
      '<ul class="archive-list">' +
        groups[month].map(function (p) {
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


// ==========================================
// Scroll Effects: Header Shadow + Progress
// ==========================================

(function initScrollEffects() {
  var header = document.querySelector('.site-header');
  var progressBar = document.querySelector('.progress-bar');
  var ticking = false;

  window.addEventListener('scroll', function () {
    if (!ticking) {
      requestAnimationFrame(function () {
        var scrollY = window.scrollY;

        if (header) {
          header.classList.toggle('scrolled', scrollY > 10);
        }

        if (progressBar) {
          var docHeight = document.documentElement.scrollHeight - window.innerHeight;
          var progress = docHeight > 0 ? (scrollY / docHeight) * 100 : 0;
          progressBar.style.width = progress + '%';
        }

        ticking = false;
      });
      ticking = true;
    }
  });
})();


// ==========================================
// Page Initialization
// ==========================================

document.addEventListener('DOMContentLoaded', function () {
  initSidebar();

  if (document.getElementById('post-list')) {
    initIndex();
  }

  if (document.getElementById('post-content')) {
    initPost();
  }

  if (document.getElementById('archive-list')) {
    initArchive();
  }
});
