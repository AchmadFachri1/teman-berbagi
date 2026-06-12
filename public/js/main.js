/**
 * main.js
 * ─────────────────────────────────────────────────────────────
 * Tanggung jawab:
 *   - Animasi splash screen (grid, glow, teks huruf per huruf, bar)
 *   - Menutup splash dan memulai aplikasi ke halaman 'daftar'
 *
 * DOMContentLoaded memastikan semua elemen HTML sudah siap
 * sebelum manipulasi DOM dilakukan.
 * ─────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {
  _animateBrandName();

  // Tutup splash setelah 3 detik, lalu navigasi ke halaman daftar
  setTimeout(() => {
    const splash = document.getElementById('splash');
    splash.classList.add('exit');
    setTimeout(() => {
      splash.classList.add('hidden');
      showPage('daftar');
    }, 700);
  }, 3000);
});

/**
 * Animasi teks "Teman Berbagi" — tiap huruf muncul bergiliran
 * @private
 */
function _animateBrandName() {
  const el = document.getElementById('splashBrandName');
  const text = 'Teman Berbagi';
  el.innerHTML = '';

  [...text].forEach((ch, i) => {
    const span = document.createElement('span');
    span.textContent = ch === ' ' ? '\u00A0' : ch;
    span.style.animationDelay = `${0.9 + i * 0.06}s`;
    el.appendChild(span);
  });
}
