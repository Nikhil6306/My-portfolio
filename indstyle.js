// ─── Dark Mode Toggle ───
const body        = document.getElementById('mainBody');
const toggleWrap  = document.getElementById('themeToggleWrap');
const modeLabel   = document.getElementById('modeLabel');

// Restore saved preference
if (localStorage.getItem('theme') === 'dark') {
  body.classList.add('dark-mode');
  modeLabel.textContent = 'DARK';
}

toggleWrap.addEventListener('click', () => {
  body.classList.toggle('dark-mode');
  const isDark = body.classList.contains('dark-mode');
  modeLabel.textContent = isDark ? 'DARK' : 'LIGHT';
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
});

// ─── Hamburger / Mobile Menu ───
const hamburger  = document.getElementById('hamburger');
const mobileMenu = document.getElementById('mobileMenu');

hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  mobileMenu.classList.toggle('show');
});

// Close mobile menu when a link is clicked
mobileMenu.querySelectorAll('a').forEach(link => {
  link.addEventListener('click', () => {
    hamburger.classList.remove('open');
    mobileMenu.classList.remove('show');
  });
});

// ─── Active link highlight ───
const navLinks    = document.querySelectorAll('.nav-links a, .mobile-menu a');
navLinks.forEach(link => {
  link.addEventListener('click', function () {
    navLinks.forEach(l => l.classList.remove('active'));
    // Set active on matching links (desktop + mobile)
    const href = this.getAttribute('href');
    document.querySelectorAll(`a[href="${href}"]`).forEach(l => {
      if (!l.classList.contains('btn-signup')) l.classList.add('active');
    });
  });
});



      //#============
      //   thanks-you
      //=============

const likeBtn = document.getElementById('likeBtn');
  const bookmarkBtn = document.getElementById('bookmarkBtn');
  const shareBtn = document.getElementById('shareBtn');
  const commentBtn = document.getElementById('commentBtn');
  const infoBtn = document.getElementById('infoBtn');
  const infoPanel = document.getElementById('infoPanel');
  const commentsPanel = document.getElementById('commentsPanel');
  const commentList = document.getElementById('commentList');
  const commentInput = document.getElementById('commentInput');
  const commentSubmit = document.getElementById('commentSubmit');
  const commentBadge = document.getElementById('commentBadge');
  const toast = document.getElementById('toast');

  let commentCount = 6;

  likeBtn.addEventListener('click', () => {
    likeBtn.classList.toggle('liked');
    const tip = likeBtn.classList.contains('liked') ? 'Liked!' : 'Like';
    likeBtn.setAttribute('data-tip', tip);
    pulse(likeBtn);
  });

  bookmarkBtn.addEventListener('click', () => {
    bookmarkBtn.classList.toggle('bookmarked');
    const tip = bookmarkBtn.classList.contains('bookmarked') ? 'Saved!' : 'Save';
    bookmarkBtn.setAttribute('data-tip', tip);
    pulse(bookmarkBtn);
  });

  shareBtn.addEventListener('click', () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href).catch(() => {});
    }
    showToast('Link copied to clipboard!');
    pulse(shareBtn);
  });

  commentBtn.addEventListener('click', () => {
    commentsPanel.classList.toggle('open');
    infoPanel.classList.remove('open');
    pulse(commentBtn);
  });

  infoBtn.addEventListener('click', () => {
    infoPanel.classList.toggle('open');
    commentsPanel.classList.remove('open');
    pulse(infoBtn);
  });

  commentSubmit.addEventListener('click', postComment);
  commentInput.addEventListener('keydown', e => { if (e.key === 'Enter') postComment(); });

  function postComment() {
    const val = commentInput.value.trim();
    if (!val) return;
    commentCount++;
    commentBadge.textContent = commentCount;
    const item = document.createElement('div');
    item.className = 'comment-item';
    item.innerHTML = `<div class="meta">You · just now</div>${escapeHTML(val)}`;
    commentList.prepend(item);
    commentInput.value = '';
    item.style.animation = 'fadeUp 0.3s ease both';
  }

  function escapeHTML(str) {
    return str.replace(/&/g,'&amp;').replace(/</g,'&lt;').replace(/>/g,'&gt;');
  }

  function pulse(el) {
    el.style.transform = 'scale(0.9)';
    setTimeout(() => el.style.transform = '', 150);
  }

  function showToast(msg) {
    toast.textContent = msg;
    toast.classList.add('show');
    setTimeout(() => toast.classList.remove('show'), 2500);
  }