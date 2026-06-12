/**
 * pages/daftar.js
 * Halaman registrasi dengan koneksi ke API backend
 */

document.addEventListener('DOMContentLoaded', () => {
  const pageDaftar = document.getElementById('page-daftar');
  if (!pageDaftar) return;

  pageDaftar.innerHTML = `
    <div class="auth-page">
      <div class="auth-bg"></div>
      <div class="auth-card">
        <h2>DAFTAR</h2>

        <div class="auth-field">
          <input type="text" id="daftarNama" placeholder="Nama Pengguna" autocomplete="off" />
        </div>
        <div class="auth-field">
          <input type="email" id="daftarEmail" placeholder="Email" autocomplete="off" />
        </div>
        <div class="auth-field">
          <input type="date" id="daftarTanggal" />
        </div>
        <div class="auth-field">
          <input type="password" id="daftarPassword" placeholder="Password minimal 6 karakter" />
        </div>

        <div class="auth-links">
          <span onclick="showPage('masuk')">Sudah punya Akun? Masuk</span>
        </div>

        <div class="auth-message" id="daftarMessage"></div>

        <button class="auth-btn" id="btnDaftar">DAFTAR</button>
      </div>
    </div>`;

  const btnDaftar = document.getElementById('btnDaftar');
  if (btnDaftar) {
    btnDaftar.addEventListener('click', handleRegister);
  }

  const passwordInput = document.getElementById('daftarPassword');
  if (passwordInput) {
    passwordInput.addEventListener('keydown', (event) => {
      if (event.key === 'Enter') handleRegister();
    });
  }
});

async function handleRegister() {
  const btn = document.getElementById('btnDaftar');
  const message = document.getElementById('daftarMessage');
  const username = document.getElementById('daftarNama').value.trim();
  const email = document.getElementById('daftarEmail').value.trim();
  const tanggalLahir = document.getElementById('daftarTanggal').value;
  const password = document.getElementById('daftarPassword').value;

  message.textContent = '';
  message.className = 'auth-message';

  if (!username || !email || !tanggalLahir || !password) {
    message.textContent = 'Semua field wajib diisi.';
    message.classList.add('error');
    _shakeDaftarCard();
    return;
  }

  if (password.length < 6) {
    message.textContent = 'Password minimal 6 karakter.';
    message.classList.add('error');
    _shakeDaftarCard();
    return;
  }

  btn.textContent = 'MENDAFTAR...';
  btn.style.opacity = '0.75';
  btn.disabled = true;

  try {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, tanggalLahir, password }),
    });

    const result = await response.json();

    if (!response.ok) {
      throw new Error(result.message || 'Registrasi gagal.');
    }

    // Simpan token dan data user
    localStorage.setItem('tb_token', result.token);
    localStorage.setItem('tb_user', JSON.stringify(result.user));

    message.textContent = 'Registrasi berhasil! Mengalihkan...';
    message.classList.add('success');

    setTimeout(() => {
      if (typeof showPage === 'function') {
        showPage('donasi');
      } else {
        window.location.href = '/';
      }
    }, 800);
  } catch (error) {
    message.textContent = error.message;
    message.classList.add('error');
    _shakeDaftarCard();
  } finally {
    btn.textContent = 'DAFTAR';
    btn.style.opacity = '1';
    btn.disabled = false;
  }
}

function _shakeDaftarCard() {
  const card = document.querySelector('#page-daftar .auth-card');
  if (!card) return;
  card.style.animation = 'shake 0.4s ease';
  setTimeout(() => (card.style.animation = ''), 400);
}