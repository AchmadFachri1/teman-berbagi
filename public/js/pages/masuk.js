/**
 * pages/masuk.js
 * Halaman login dengan koneksi ke API backend
 */

document.addEventListener('DOMContentLoaded', () => {
  const pageMasuk = document.getElementById('page-masuk');
  if (!pageMasuk) return;

  pageMasuk.innerHTML = `
    <div class="auth-page">
      <div class="auth-bg"></div>
      <div class="auth-card">
        <h2>MASUK</h2>

        <div class="auth-field">
          <input type="text" id="masukUser" placeholder="Nama Pengguna / Email" autocomplete="off" />
        </div>
        <div class="auth-field">
          <input type="password" id="masukPassword" placeholder="Password" />
        </div>

        <div class="auth-links">
          <span>Lupa Password?&nbsp;</span>
          <span onclick="showPage('daftar')">Daftar</span>
        </div>

        <div class="auth-message" id="masukMessage"></div>

        <button class="auth-btn" id="btnMasuk">MASUK</button>

        <div class="auth-bottom">
          Belum punya Akun? <span onclick="showPage('daftar')">Daftar</span>
        </div>
      </div>
    </div>`;

  const btnMasuk = document.getElementById('btnMasuk');
  if (btnMasuk) {
    btnMasuk.addEventListener('click', handleLogin);
  }

  const passwordInput = document.getElementById('masukPassword');
  if (passwordInput) {
    passwordInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') handleLogin();
    });
  }
});

async function handleLogin() {
  const btn = document.getElementById('btnMasuk');
  const message = document.getElementById('masukMessage');
  const identifier = document.getElementById('masukUser').value.trim();
  const password = document.getElementById('masukPassword').value;

  message.textContent = '';
  message.className = 'auth-message';

  if (!identifier || !password) {
    message.textContent = 'Nama pengguna/email dan password wajib diisi.';
    message.classList.add('error');
    _shakeMasukCard();
    return;
  }

  btn.textContent = 'MASUK...';
  btn.style.opacity = '0.75';
  btn.disabled = true;

  try {
    const response = await fetch('/api/auth/login', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ identifier, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Login gagal.');
    }

    // Simpan token dan data user
    localStorage.setItem('tb_token', result.token);
    localStorage.setItem('tb_user', JSON.stringify(result.user));

    message.textContent = 'Login berhasil! Mengalihkan...';
    message.classList.add('success');

    setTimeout(() => {
      if (typeof showPage === 'function') {
        showPage('donasi');
      } else {
        window.location.href = '/';
      }
    }, 700);
  } catch (error) {
    message.textContent = error.message;
    message.classList.add('error');
    _shakeMasukCard();
  } finally {
    btn.textContent = 'MASUK';
    btn.style.opacity = '1';
    btn.disabled = false;
  }
}

function _shakeMasukCard() {
  const card = document.querySelector('#page-masuk .auth-card');
  if (!card) return;
  card.style.animation = 'shake 0.4s ease';
  setTimeout(() => (card.style.animation = ''), 400);
}