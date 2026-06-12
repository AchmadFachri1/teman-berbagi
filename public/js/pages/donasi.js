/**
 * pages/donasi.js
 * ─────────────────────────────────────────────────────────────
 * Tanggung jawab (4 halaman dalam 1 file):
 *   1. #page-donasi        — grid kartu donasi
 *   2. #page-detail-donasi — detail program + tab (Tentang / Info / Dermawan)
 *   3. #page-bayar-donasi  — pilih nominal, bukti bayar, profil
 *   4. #page-sukses-donasi — konfirmasi transaksi berhasil
 *
 * Semua halaman di-render saat DOMContentLoaded.
 * Data diambil dari donasiData[] yang didefinisikan di router.js.
 * ─────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════════════════════
     1. HALAMAN DONASI — Grid kartu program
  ═══════════════════════════════════════════════════════════ */
  document.getElementById('page-donasi').innerHTML = `
    <div class="donasi-page">
      <div class="donasi-section-title">Sedikit dari Kita, Berarti Banyak untuk Mereka</div>
      <div class="donasi-grid" id="donasiGrid"></div>
    </div>`;

  // Render grid menggunakan donasiData dari router.js
  // MutationObserver mendeteksi saat halaman menjadi aktif/visible
  _observePage('page-donasi', () => {
    const grid = document.getElementById('donasiGrid');
    if (!grid || grid.children.length > 0) return; // sudah dirender

    donasiData.forEach((item, idx) => {
      const pct = Math.round((item.jumlah / item.target) * 100);
      const card = document.createElement('div');
      card.className = 'donasi-card';
      card.style.animationDelay = `${idx * 0.07}s`;
      card.innerHTML = `
        <img class="donasi-card-img" src="${item.img}" alt="${item.title}" loading="lazy">
        <div class="donasi-card-body">
          <div class="donasi-card-title">${item.title}</div>
          <div class="donasi-card-hari">Hari tersisa: <span>${item.hari}</span></div>
          <div class="donasi-progress-label">Donasi terkumpul</div>
          <div class="donasi-progress-track">
            <div class="donasi-progress-fill" style="width:${pct}%"></div>
          </div>
          <div class="donasi-amount-row">
            <div>
              <div class="donasi-amount-sub">Terkumpul</div>
              <div class="donasi-amount-val">Rp ${item.jumlah.toLocaleString('id-ID')}</div>
            </div>
            <div style="text-align:right">
              <div class="donasi-amount-sub">Target</div>
              <div class="donasi-amount-val">Rp ${item.target.toLocaleString('id-ID')}</div>
            </div>
          </div>
        </div>`;

      card.addEventListener('click', () => {
        selectedDonasi = item;
        showPage('detail-donasi');
      });
      grid.appendChild(card);
    });
  });

  /* ═══════════════════════════════════════════════════════════
     2. HALAMAN DETAIL DONASI
  ═══════════════════════════════════════════════════════════ */
  document.getElementById('page-detail-donasi').innerHTML = `
    <div class="detail-page">
      <div class="detail-hero">
        <div class="detail-hero-img-wrap">
          <img id="detailHeroImg" src="" alt="">
        </div>
        <div class="detail-hero-card">
          <h2 id="detailTitle"></h2>
          <div class="detail-meta-row">
            <span class="detail-meta-label">Hari tersisa:</span>
            <span class="detail-meta-val" id="detailHari"></span>
          </div>
          <div class="detail-progress-label">Donasi terkumpul</div>
          <div class="detail-progress-track">
            <div class="detail-progress-fill" id="detailProgressFill"></div>
          </div>
          <div class="detail-amount-row">
            <div>
              <div class="detail-amount-sub">Terkumpul</div>
              <div class="detail-amount-val green" id="detailJumlah"></div>
            </div>
            <div style="text-align:right">
              <div class="detail-amount-sub">Target</div>
              <div class="detail-amount-val green" id="detailTarget"></div>
            </div>
          </div>
          <button class="detail-donate-btn" id="btnDonasiSekarang">Lakukan Berdonasi</button>
        </div>
      </div>

      <!-- Tab Bar -->
      <div class="detail-tabs-bar">
        <span class="detail-tab active" id="dtab-tentang"   onclick="switchDetailTab('tentang')">Tentang</span>
        <span class="detail-tab"        id="dtab-informasi" onclick="switchDetailTab('informasi')">Informasi</span>
        <span class="detail-tab"        id="dtab-dermawan"  onclick="switchDetailTab('dermawan')">Dermawan</span>
      </div>

      <!-- Tab: Tentang -->
      <div class="detail-tab-content active" id="dcontent-tentang">
        <div class="detail-text-body">
          <p>Dengan berbagi, kita bisa membantu mereka yang membutuhkan mulai dari memenuhi
             kebutuhan pangan, membantu pendidikan, mendukung pembangunan rumah ibadah,
             hingga meringankan beban hidup masyarakat kurang mampu.</p>
          <p>Setiap donasi yang Sahabat berikan bukan sekadar bantuan materi, tetapi juga
             menjadi sumber harapan, kebahagiaan, dan masa depan yang lebih baik bagi mereka.</p>
        </div>
      </div>

      <!-- Tab: Informasi -->
      <div class="detail-tab-content" id="dcontent-informasi">
        <div class="info-article-list">
          <div class="info-article">
            <img src="https://images.unsplash.com/photo-1593113598332-cd288d649433?w=500&q=80" alt="">
            <p>Saat ini masyarakat yang mengalami bencana banjir sangat membutuhkan bantuan dari kita.</p>
          </div>
          <div class="info-article reverse">
            <p>Beberapa ibu hamil dan bayi sangat membutuhkan nutrisi akibat dari bencana yang melanda.</p>
            <img src="https://images.unsplash.com/photo-1532629345422-7515f3d16bb6?w=500&q=80" alt="">
          </div>
        </div>
      </div>

      <!-- Tab: Dermawan -->
      <div class="detail-tab-content" id="dcontent-dermawan">
        <div class="dermawan-list" id="dermawanList"></div>
      </div>
    </div>`;

  // Isi data detail saat halaman detail aktif
  _observePage('page-detail-donasi', () => {
    const d = selectedDonasi;
    if (!d) return;

    document.getElementById('detailHeroImg').src = d.img;
    document.getElementById('detailTitle').textContent = d.title;
    document.getElementById('detailHari').textContent = `${d.hari} hari`;
    document.getElementById('detailJumlah').textContent = `Rp ${d.jumlah.toLocaleString('id-ID')}`;
    document.getElementById('detailTarget').textContent = `Rp ${d.target.toLocaleString('id-ID')}`;
    document.getElementById('detailProgressFill').style.width =
      Math.round((d.jumlah / d.target) * 100) + '%';

    // Reset ke tab pertama
    switchDetailTab('tentang');

    // Render daftar dermawan (dummy)
    const dermawanData = [
      { nama: 'Ayu Rahmawati', tipe: 'Donasi', jumlah: 100000, gender: 'female' },
      { nama: 'Rahman Hakim', tipe: 'Donasi', jumlah: 200000, gender: 'male' },
      { nama: 'Rina Sari', tipe: 'Donasi', jumlah: 50000, gender: 'female' },
      { nama: 'Hamba Allah', tipe: 'Donasi', jumlah: 100000, gender: 'male' },
    ];
    document.getElementById('dermawanList').innerHTML = dermawanData.map(dw => `
      <div class="dermawan-item">
        <div class="dermawan-avatar ${dw.gender}"></div>
        <div class="dermawan-info">
          <div class="dermawan-name">${dw.nama}</div>
          <div class="dermawan-type">${dw.tipe}</div>
        </div>
        <div class="dermawan-amount">Rp.${dw.jumlah.toLocaleString('id-ID')}</div>
      </div>`).join('');
  });

  // Tombol donasi → pindah ke halaman bayar
  document.addEventListener('click', e => {
    if (e.target.id === 'btnDonasiSekarang') showPage('bayar-donasi');
  });

  // Fungsi switch tab detail (global agar bisa dipanggil dari onclick)
  window.switchDetailTab = function (name) {
    document.querySelectorAll('#page-detail-donasi .detail-tab').forEach(t => t.classList.remove('active'));
    document.querySelectorAll('#page-detail-donasi .detail-tab-content').forEach(c => c.classList.remove('active'));
    document.getElementById(`dtab-${name}`).classList.add('active');
    document.getElementById(`dcontent-${name}`).classList.add('active');
  };

  /* ═══════════════════════════════════════════════════════════
     3. HALAMAN BAYAR DONASI
  ═══════════════════════════════════════════════════════════ */
  document.getElementById('page-bayar-donasi').innerHTML = `
    <div class="bayar-page">
      <div class="bayar-mini-banner">
        <div class="bayar-mini-img">
          <img id="bayarMiniImg" src="" alt="">
        </div>
        <div class="bayar-mini-title" id="bayarMiniTitle">—</div>
      </div>

      <div class="bayar-section">
        <div class="bayar-section-label">Masukan Nominal</div>
        <div class="bayar-nominal-display" id="nominalDisplay">Rp.50.000</div>
        <div class="bayar-section-label">Pilih Nominal</div>
        <div class="nominal-grid" id="nominalGrid">
          <button class="nominal-btn"        data-val="10000">Rp.10.000</button>
          <button class="nominal-btn active" data-val="50000">Rp.50.000</button>
          <button class="nominal-btn"        data-val="100000">Rp.100.000</button>
          <button class="nominal-btn"        data-val="150000">Rp.150.000</button>
          <button class="nominal-btn"        data-val="200000">Rp.200.000</button>
          <button class="nominal-btn"        data-val="250000">Rp.250.000</button>
        </div>
      </div>

      <div class="bayar-section">
        <div class="bayar-section-label">No.Bank</div>
        <div class="bayar-bank-card">
          <div class="bayar-bank-logo"><span class="bri-logo">🏦 BRI</span></div>
          <div class="bayar-bank-number" id="bankNumber">2429529058325025-52</div>
          <button class="bayar-copy-btn" id="btnCopyBank">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2">
              <rect x="9" y="9" width="13" height="13" rx="2"/>
              <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
            </svg>
          </button>
        </div>
      </div>

      <div class="bayar-section">
        <div class="bayar-section-label">Bukti Pembayaran</div>
        <div class="bayar-bukti-area" id="bayarBuktiArea">
          <div class="bayar-bukti-preview" id="buktiPreview">
            <div class="bukti-placeholder">
              <div class="bukti-mock-receipt">
                <div class="bukti-mock-row header">
                  <span>Total Bayar</span><span id="buktiTotal">Rp50.000</span>
                </div>
                <div class="bukti-mock-row"><span>Metode</span><span>Saldo DANA</span></div>
                <div class="bukti-mock-row"><span>Nama</span><span>Wa·····ah</span></div>
              </div>
              <div class="bukti-camera-btn">
                <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#555" stroke-width="2">
                  <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 0 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
                  <circle cx="12" cy="13" r="4"/>
                </svg>
              </div>
            </div>
          </div>
          <input type="file" id="buktiInput" accept="image/*" style="display:none">
        </div>
      </div>

      <div class="bayar-section">
        <div class="bayar-section-label-big">Profil Anda</div>
        <div class="bayar-field-label">Nama</div>
        <input type="text" class="bayar-input" id="profileNama" placeholder="Nama lengkap">
        <div class="bayar-field-label">No.WA</div>
        <input type="text" class="bayar-input" id="profileWa" placeholder="Contoh: 0812xxxxxxxx">
      </div>

      <button class="bayar-submit-btn" id="btnSubmitDonasi">LAKUKAN TRANSAKSI</button>
    </div>`;

  // Isi data banner saat halaman bayar aktif
  _observePage('page-bayar-donasi', () => {
    const d = selectedDonasi;
    if (d) {
      document.getElementById('bayarMiniImg').src = d.img;
      document.getElementById('bayarMiniTitle').textContent = d.title;
    }
    // Reset nominal ke default
    _setNominalDonasi(50000);
  });

  // Nominal grid: delegasi event
  document.getElementById('nominalGrid').addEventListener('click', e => {
    const btn = e.target.closest('.nominal-btn');
    if (!btn) return;
    _setNominalDonasi(parseInt(btn.dataset.val, 10), btn);
  });

  // Copy no. rekening
  document.getElementById('btnCopyBank').addEventListener('click', () => {
    const num = document.getElementById('bankNumber').textContent;
    navigator.clipboard.writeText(num).catch(() => { });
    _flashCopyBtn('btnCopyBank');
  });

  // Upload bukti
  document.getElementById('bayarBuktiArea').addEventListener('click', () =>
    document.getElementById('buktiInput').click()
  );
  document.getElementById('buktiInput').addEventListener('change', e => {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      document.getElementById('buktiPreview').innerHTML =
        `<img src="${ev.target.result}" style="width:100%;border-radius:8px;display:block;">`;
    };
    reader.readAsDataURL(file);
  });

  // Submit transaksi
  document.getElementById('btnSubmitDonasi').addEventListener('click', () => {
    showPage('sukses-donasi');
  });

  /* ═══════════════════════════════════════════════════════════
     4. HALAMAN SUKSES DONASI
  ═══════════════════════════════════════════════════════════ */
  document.getElementById('page-sukses-donasi').innerHTML = `
    <div class="sukses-page">
      <div class="sukses-content">
        <h1 class="sukses-title">TERIMAKASIH TELAH MELAKUKAN DONASI</h1>
        <p class="sukses-subtitle">Pembayaran kamu sedang diproses</p>
        <div class="sukses-spinner"><div class="sukses-spinner-ring"></div></div>
        <div class="sukses-status-label">STATUS</div>
        <div class="sukses-status-badge">BERHASIL</div>
        <button class="sukses-back-btn" id="btnKembaliDonasi">Kembali ke Beranda</button>
      </div>
    </div>`;

  document.getElementById('btnKembaliDonasi').addEventListener('click', () => {
    showPage('donasi');
  });

  /* ═══════════════════════════════════════════════════════════
     HELPERS PRIVAT
  ═══════════════════════════════════════════════════════════ */

  /** Set nominal yang dipilih dan update tampilan */
  function _setNominalDonasi(amount, activeBtn) {
    selectedNominal = amount;
    document.querySelectorAll('#nominalGrid .nominal-btn').forEach(b => b.classList.remove('active'));
    if (activeBtn) {
      activeBtn.classList.add('active');
    } else {
      // Set tombol 50.000 sebagai default
      document.querySelector('#nominalGrid [data-val="50000"]')?.classList.add('active');
    }
    const fmt = amount.toLocaleString('id-ID');
    const dispEl = document.getElementById('nominalDisplay');
    const totalEl = document.getElementById('buktiTotal');
    if (dispEl) dispEl.textContent = `Rp.${fmt}`;
    if (totalEl) totalEl.textContent = `Rp${fmt}`;
  }

  /** Animasi ikon centang saat copy berhasil */
  function _flashCopyBtn(btnId) {
    const btn = document.getElementById(btnId);
    if (!btn) return;
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="#4a6741" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    setTimeout(() => {
      btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
        stroke="#333" stroke-width="2"><rect x="9" y="9" width="13" height="13" rx="2"/>
        <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/></svg>`;
    }, 1600);
  }
});

/* ═══════════════════════════════════════════════════════════════
   UTILITY — Observer halaman aktif
   Dipanggil sekali per halaman; callback dijalankan setiap kali
   halaman tersebut mendapat class 'visible' dari router.
═══════════════════════════════════════════════════════════════ */
function _observePage(pageId, callback) {
  const el = document.getElementById(pageId);
  if (!el) return;
  let lastVisible = false;
  new MutationObserver(() => {
    const isVisible = el.classList.contains('visible');
    if (isVisible && !lastVisible) {
      lastVisible = true;
      callback();
    } else if (!isVisible) {
      lastVisible = false;
    }
  }).observe(el, { attributes: true, attributeFilter: ['class'] });
}
