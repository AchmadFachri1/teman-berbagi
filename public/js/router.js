/**
 * ROUTER UTAMA
 * Menangani navigasi, autentikasi, dan state global
 */

/* ═══════════════════════════════════════════════════════════════
   1. AUTHENTICATION HELPERS
═══════════════════════════════════════════════════════════════ */

// Ambil token dari localStorage
function getAuthToken() {
  return localStorage.getItem('tb_token');
}

// Cek apakah user sudah login
function isAuthenticated() {
  return !!getAuthToken();
}

// Ambil data user yang login
function getCurrentUser() {
  const userStr = localStorage.getItem('tb_user');
  if (!userStr) return null;
  try {
    return JSON.parse(userStr);
  } catch {
    return null;
  }
}

// Logout user
function logout() {
  localStorage.removeItem('tb_token');
  localStorage.removeItem('tb_user');
  showPage('masuk');
  // Tampilkan pesan sukses logout
  const messageDiv = document.createElement('div');
  messageDiv.textContent = 'Anda telah logout';
  messageDiv.style.cssText = 'position:fixed;top:20px;right:20px;background:#4a6741;color:white;padding:12px 24px;border-radius:8px;z-index:9999;animation:fadeOut 3s forwards';
  document.body.appendChild(messageDiv);
  setTimeout(() => messageDiv.remove(), 3000);
}

// Request API dengan autentikasi otomatis
async function authFetch(url, options = {}) {
  const token = getAuthToken();

  const defaultOptions = {
    headers: {
      'Content-Type': 'application/json',
      ...(token && { 'Authorization': `Bearer ${token}` }),
      ...options.headers,
    },
  };

  const mergedOptions = { ...defaultOptions, ...options };
  mergedOptions.headers = { ...defaultOptions.headers, ...options.headers };

  try {
    const response = await fetch(url, mergedOptions);
    const data = await response.json();

    if (!response.ok && response.status === 401) {
      // Token expired atau invalid
      logout();
      throw new Error('Sesi berakhir. Silakan login kembali.');
    }

    return { response, data };
  } catch (error) {
    throw error;
  }
}

/* ═══════════════════════════════════════════════════════════════
   2. STATE GLOBAL
═══════════════════════════════════════════════════════════════ */
let currentPage = 'daftar';
let selectedDonasi = null;
let selectedNominal = 50000;

/** Halaman yang menggunakan navbar putih */
const LIGHT_PAGES = [
  'donasi', 'detail-donasi', 'bayar-donasi', 'sukses-donasi',
  'kewajiban', 'bayar-kewajiban',
  'persepuhan', 'bayar-persepuhan',
  'stipendium', 'bayar-stipendium',
];

/* ═══════════════════════════════════════════════════════════════
   3. DATA DONASI
═══════════════════════════════════════════════════════════════ */
const donasiData = [
  {
    id: 1,
    img: 'https://images.unsplash.com/photo-1448375240586-882707db888b?w=600&q=80',
    title: 'Mari membantu keluarga kita yang berada di sumatra',
    hari: 4, jumlah: 295000, target: 500000,
  },
  {
    id: 2,
    img: 'https://images.unsplash.com/photo-1609234334335-5f6d3a5b3d9a?w=600&q=80',
    title: 'Bantu mereka agar dapat melaksanakan ibadah dengan hikmat',
    hari: 4, jumlah: 295000, target: 500000,
  },
  {
    id: 3,
    img: 'https://images.unsplash.com/photo-1587134160474-2f1b940a5a0d?w=600&q=80',
    title: 'Pengadaan mobile ambulance gratis bagi warga pelosok',
    hari: 20, jumlah: 295000, target: 500000,
  },
  {
    id: 4,
    img: 'https://images.unsplash.com/photo-1547683905-f686c993aae5?w=600&q=80',
    title: 'Mari membantu keluarga kita yang berada di sumatra',
    hari: 4, jumlah: 295000, target: 500000,
  },
  {
    id: 5,
    img: 'https://images.unsplash.com/photo-1624555130581-1d9cca783bc0?w=600&q=80',
    title: 'Saat ini Ibu suri memasuki stadium 3 kanker yang di derita',
    hari: 4, jumlah: 295000, target: 500000,
  },
  {
    id: 6,
    img: 'https://images.unsplash.com/photo-1588859519748-d56d71e67e03?w=600&q=80',
    title: 'Pengadaan mobile ambulance gratis bagi warga pelosok',
    hari: 20, jumlah: 295000, target: 500000,
  },
];

/* ═══════════════════════════════════════════════════════════════
   4. ROUTER — showPage() dengan proteksi autentikasi
═══════════════════════════════════════════════════════════════ */

/**
 * Navigasi ke halaman tertentu dengan proteksi autentikasi
 * @param {string} pageName
 */
function showPage(pageName) {
  // Daftar halaman yang memerlukan login
  const protectedPages = ['donasi', 'detail-donasi', 'bayar-donasi', 'sukses-donasi',
    'kewajiban', 'bayar-kewajiban', 'persepuhan', 'bayar-persepuhan',
    'stipendium', 'bayar-stipendium'];

  // Cek autentikasi untuk halaman yang dilindungi
  if (!isAuthenticated() && protectedPages.includes(pageName)) {
    originalShowPage('masuk');
    return;
  }

  originalShowPage(pageName);
}

// Simpan fungsi asli
const originalShowPage = (pageName) => {
  // Sembunyikan halaman lama
  const oldEl = document.getElementById(`page-${currentPage}`);
  if (oldEl) {
    oldEl.classList.remove('visible');
    setTimeout(() => oldEl.classList.remove('active'), 380);
  }

  currentPage = pageName;

  // Tampilkan halaman baru
  const newEl = document.getElementById(`page-${pageName}`);
  if (newEl) {
    newEl.classList.add('active');
    newEl.offsetHeight; // reflow agar animasi CSS terpicu
    requestAnimationFrame(() => newEl.classList.add('visible'));
  }

  _updateNav(pageName);
  _updateUserDisplay();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// Override showPage
window.showPage = showPage;

/* ═══════════════════════════════════════════════════════════════
   5. NAVBAR & USER DISPLAY
═══════════════════════════════════════════════════════════════ */
function _updateNav(pageName) {
  const isLight = LIGHT_PAGES.includes(pageName);

  const mainNav = document.getElementById('mainNav');
  const mainNavLight = document.getElementById('mainNavLight');

  if (mainNav) mainNav.style.display = isLight ? 'none' : 'flex';
  if (mainNavLight) mainNavLight.style.display = isLight ? 'flex' : 'none';

  // Highlight link aktif di navbar dark
  document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active-nav'));
  if (pageName === 'tentang') document.getElementById('navTentang')?.classList.add('active-nav');
  if (pageName === 'kontak') document.getElementById('navKontak')?.classList.add('active-nav');

  if (isLight) _syncLightTab(pageName);
}

function _syncLightTab(pageName) {
  const tabMap = {
    'donasi': 'lnDonasi',
    'detail-donasi': 'lnDonasi',
    'bayar-donasi': 'lnDonasi',
    'sukses-donasi': 'lnDonasi',
    'kewajiban': 'lnKewajiban',
    'bayar-kewajiban': 'lnKewajiban',
    'persepuhan': 'lnKewajiban',
    'bayar-persepuhan': 'lnKewajiban',
    'stipendium': 'lnKewajiban',
    'bayar-stipendium': 'lnKewajiban',
  };
  const activeId = tabMap[pageName];

  ['lnDonasi', 'lnKewajiban', 'lnDerma', 'lnPilar'].forEach(id => {
    const el = document.getElementById(id);
    if (!el) return;
    if (id === activeId) {
      el.classList.add('nav-pill');
      el.classList.remove('nav-light-link');
    } else {
      el.classList.remove('nav-pill');
      el.classList.add('nav-light-link');
    }
  });
}

function _updateUserDisplay() {
  const user = getCurrentUser();
  const userInfoDiv = document.getElementById('navUserInfo');
  const userNameSpan = document.getElementById('userNameDisplay');

  if (user && user.username && userInfoDiv) {
    userNameSpan.textContent = `Halo, ${user.username}`;
    userInfoDiv.style.display = 'flex';
  } else if (userInfoDiv) {
    userInfoDiv.style.display = 'none';
  }
}

// Fungsi global untuk navbar
window.navTab = function (el, target) {
  const drop = document.getElementById('kewajibDropdown');
  if (target === 'kewajiban-menu') {
    drop.classList.toggle('open');
    return;
  }
  if (drop) drop.classList.remove('open');
  showPage(target);
};

window.pilihKewajiban = function (jenis) {
  const drop = document.getElementById('kewajibDropdown');
  if (drop) drop.classList.remove('open');
  const tujuan = { 'zakat-fitrah': 'kewajiban', 'persepuhan': 'persepuhan', 'stipendium': 'stipendium' };
  if (tujuan[jenis]) showPage(tujuan[jenis]);
};

window.logout = logout;

// Tutup dropdown kewajiban saat klik di luar
document.addEventListener('click', e => {
  const drop = document.getElementById('kewajibDropdown');
  const btn = document.getElementById('lnKewajiban');
  if (drop && !drop.contains(e.target) && e.target !== btn) drop.classList.remove('open');
});

/* ═══════════════════════════════════════════════════════════════
   6. SEARCH
═══════════════════════════════════════════════════════════════ */
window.openSearch = function () {
  const overlay = document.getElementById('searchOverlay');
  if (overlay) {
    overlay.classList.add('open');
    setTimeout(() => document.getElementById('searchOverlayInput')?.focus(), 160);
    setTimeout(() => document.addEventListener('click', _outsideSearchClick), 50);
  }
};

window.closeSearch = function () {
  const overlay = document.getElementById('searchOverlay');
  if (overlay) overlay.classList.remove('open');
  const results = document.getElementById('searchResults');
  if (results) results.classList.remove('open');
  const input = document.getElementById('searchOverlayInput');
  if (input) input.value = '';
  document.removeEventListener('click', _outsideSearchClick);
};

window.triggerSearch = function () {
  const val = document.getElementById('searchOverlayInput')?.value.trim();
  if (val) handleSearch(val);
};

function handleSearch(query) {
  const resultsEl = document.getElementById('searchResults');
  const innerEl = document.getElementById('searchResultsInner');
  if (!query.trim()) {
    if (resultsEl) resultsEl.classList.remove('open');
    return;
  }

  const filtered = donasiData.filter(d =>
    d.title.toLowerCase().includes(query.toLowerCase())
  );

  if (filtered.length === 0) {
    innerEl.innerHTML = `<div style="padding:16px 24px;color:#999;font-size:13px;">
      Tidak ada hasil untuk "<strong>${query}</strong>"</div>`;
  } else {
    const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')})`, 'gi');
    innerEl.innerHTML = filtered.map(d => `
      <div class="search-result-item" onclick="selectedDonasi=donasiData.find(x=>x.id===${d.id});closeSearch();showPage('detail-donasi')">
        <img class="search-result-img" src="${d.img}" alt="">
        <div class="search-result-text">${d.title.replace(re, '<strong>$1</strong>')}</div>
      </div>`).join('');
  }
  resultsEl.classList.add('open');
}

function _outsideSearchClick(e) {
  const overlay = document.getElementById('searchOverlay');
  const trigger = document.getElementById('searchTriggerBtn');
  if (overlay && !overlay.contains(e.target) && e.target !== trigger) closeSearch();
}

// Ekspor global
window.donasiData = donasiData;
window.selectedDonasi = selectedDonasi;
window.selectedNominal = selectedNominal;
window.getAuthToken = getAuthToken;
window.isAuthenticated = isAuthenticated;
window.getCurrentUser = getCurrentUser;
window.authFetch = authFetch;