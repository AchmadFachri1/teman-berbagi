/**
 * pages/kewajiban.js
 * ─────────────────────────────────────────────────────────────
 * Tanggung jawab (6 halaman dalam 1 file):
 *   1. #page-kewajiban          — Zakat Fitrah (counter + hitung)
 *   2. #page-bayar-kewajiban    — Form bayar Zakat
 *   3. #page-persepuhan         — Persepuhan (counter + hitung)
 *   4. #page-bayar-persepuhan   — Form bayar Persepuhan
 *   5. #page-stipendium         — Stipendium (counter + hitung)
 *   6. #page-bayar-stipendium   — Form bayar Stipendium
 *
 * Pola yang digunakan:
 *   - Setiap jenis kewajiban punya state (count) dan konstanta harga
 *   - _renderKewajiban(config) membuat template halaman kewajiban generik
 *   - _renderBayar(config) membuat template halaman bayar generik
 *   - _observePage() mendeteksi saat halaman menjadi visible → reset/init
 * ─────────────────────────────────────────────────────────────
 */

document.addEventListener('DOMContentLoaded', () => {

  /* ═══════════════════════════════════════════════════════════
     KONSTANTA & STATE KEWAJIBAN
  ═══════════════════════════════════════════════════════════ */
  const KEWAJIBAN = {
    zakat: {
      harga: 50000,
      satuan: 'Jiwa',
      count: 0,
      pageId: 'kewajiban',
      bayarPageId: 'bayar-kewajiban',
      idJumlah: 'zakatJumlah',
      idNominal: 'zakatNominal',
      idBayarNom: 'bayarKewajibNominal',
      idBuktiTot: 'buktiKewajibTotal',
      idBuktiPrev: 'buktiKewajibPreview',
      idBuktiInp: 'buktiKewajibInput',
    },
    persepuhan: {
      harga: 25000,
      satuan: 'Jiwa',
      count: 0,
      pageId: 'persepuhan',
      bayarPageId: 'bayar-persepuhan',
      idJumlah: 'persepuhanJumlah',
      idNominal: 'persepuhanNominal',
      idBayarNom: 'bayarPersepuhanNominal',
      idBuktiTot: 'buktiPersepuhanTotal',
      idBuktiPrev: 'buktiPersepuhanPreview',
      idBuktiInp: 'buktiPersepuhanInput',
    },
    stipendium: {
      harga: 100000,
      satuan: 'Siswa',
      count: 0,
      pageId: 'stipendium',
      bayarPageId: 'bayar-stipendium',
      idJumlah: 'stipendiumJumlah',
      idNominal: 'stipendiumNominal',
      idBayarNom: 'bayarStipendiumNominal',
      idBuktiTot: 'buktiStipendiumTotal',
      idBuktiPrev: 'buktiStipendiumPreview',
      idBuktiInp: 'buktiStipendiumInput',
    },
  };

  /* ═══════════════════════════════════════════════════════════
     NAVIGATOR — dipanggil dari navbar dropdown (via router.js)
  ═══════════════════════════════════════════════════════════ */
  // Fungsi ini sudah ditangani di router.js via pilihKewajiban()

  /* ═══════════════════════════════════════════════════════════
     1. RENDER SEMUA HALAMAN KEWAJIBAN
  ═══════════════════════════════════════════════════════════ */

  // ─── Zakat Fitrah ─────────────────────────────────────────
  _renderKewajiban({
    pageId: 'page-kewajiban',
    judul: 'Zakat Fitrah',
    sub: 'Sempurnakan ibadah puasa Ramadan dengan tunaikan zakat fitrah.',
    hargaLabel: 'Rp 50.000/Jiwa',
    badgeText: 'ZAKAT\nFITRAH',
    badgeColor: '#2ecc40',
    heroImg: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=800&q=80',
    heroBg: 'linear-gradient(135deg,rgba(20,60,20,.72),rgba(50,100,40,.42))',
    heroDesc: 'Mari sempurnakan\nRamadhan dengan\nmenunaikan kewajiban\nZakat Fitrah kita',
    idJumlah: 'zakatJumlah',
    idNominal: 'zakatNominal',
    key: 'zakat',
    deskripsi: [
      'Zakat fitrah adalah zakat yang harus ditunaikan bagi seorang muzakki yang telah memiliki kemampuan. Zakat fitrah wajib dikeluarkan sekali setahun pada bulan Ramadhan menjelang Idul Fitri.',
      'Besar zakat fitrah yang harus dikeluarkan sebesar satu sha yang setara 2,5 kg beras atau 3,5 liter beras, disesuaikan dengan konsumsi per orang sehari-hari.',
    ],
  });

  // ─── Persepuhan ───────────────────────────────────────────
  _renderKewajiban({
    pageId: 'page-persepuhan',
    judul: 'Persepuhan',
    sub: 'Salurkan persepuhan untuk membantu saudara yang membutuhkan.',
    hargaLabel: 'Rp 25.000/Jiwa',
    badgeText: 'PERSEPUHAN',
    badgeColor: '#f7c948',
    heroImg: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=800&q=80',
    heroBg: 'linear-gradient(135deg,rgba(60,30,10,.72),rgba(100,60,20,.45))',
    heroDesc: 'Tunaikan kewajiban\npersepuhan sebagai\nbentuk kepedulian\nkepada sesama',
    idJumlah: 'persepuhanJumlah',
    idNominal: 'persepuhanNominal',
    key: 'persepuhan',
    deskripsi: [
      'Persepuhan adalah bentuk kewajiban sosial yang bertujuan mempererat tali persaudaraan dan membantu mereka yang membutuhkan.',
      'Dengan menunaikan persepuhan, kita turut berpartisipasi menciptakan keseimbangan sosial dan meringankan beban saudara-saudara kita.',
    ],
  });

  // ─── Stipendium ───────────────────────────────────────────
  _renderKewajiban({
    pageId: 'page-stipendium',
    judul: 'Stipendium',
    sub: 'Bantu pendidikan anak-anak kurang mampu.',
    hargaLabel: 'Rp 100.000/Siswa',
    badgeText: 'STIPENDIUM',
    badgeColor: '#7ee8a0',
    heroImg: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=800&q=80',
    heroBg: 'linear-gradient(135deg,rgba(20,50,30,.75),rgba(40,90,50,.40))',
    heroDesc: 'Investasikan masa\ndepan generasi penerus\nmelalui beasiswa\npendidikan',
    idJumlah: 'stipendiumJumlah',
    idNominal: 'stipendiumNominal',
    key: 'stipendium',
    deskripsi: [
      'Stipendium adalah bantuan dana pendidikan bagi siswa berprestasi namun kurang mampu secara ekonomi.',
      'Setiap kontribusi Anda adalah investasi nyata untuk mencetak generasi penerus yang cerdas dan berakhlak mulia.',
    ],
  });

  /* ═══════════════════════════════════════════════════════════
     2. RENDER SEMUA HALAMAN BAYAR KEWAJIBAN
  ═══════════════════════════════════════════════════════════ */

  _renderBayar({
    pageId: 'page-bayar-kewajiban',
    bannerImg: 'https://images.unsplash.com/photo-1586201375761-83865001e31c?w=300&q=80',
    bannerJudul: 'Zakat Fitrah — Mari sempurnakan Ramadhan',
    idBayarNom: 'bayarKewajibNominal',
    idBuktiTot: 'buktiKewajibTotal',
    idBuktiPrev: 'buktiKewajibPreview',
    idBuktiInp: 'buktiKewajibInput',
    idCopy: 'copyBankZakat',
    labelNama: 'Nama Pembayaran Zakat',
    idNama: 'zakatNama',
    idWa: 'zakatWa',
  });

  _renderBayar({
    pageId: 'page-bayar-persepuhan',
    bannerImg: 'https://images.unsplash.com/photo-1542838132-92c53300491e?w=300&q=80',
    bannerJudul: 'Persepuhan — Bantu sesama yang membutuhkan',
    idBayarNom: 'bayarPersepuhanNominal',
    idBuktiTot: 'buktiPersepuhanTotal',
    idBuktiPrev: 'buktiPersepuhanPreview',
    idBuktiInp: 'buktiPersepuhanInput',
    idCopy: 'copyBankPersepuhan',
    labelNama: 'Nama Pembayaran Persepuhan',
    idNama: 'persepuhanNama',
    idWa: 'persepuhanWa',
  });

  _renderBayar({
    pageId: 'page-bayar-stipendium',
    bannerImg: 'https://images.unsplash.com/photo-1523050854058-8df90110c9f1?w=300&q=80',
    bannerJudul: 'Stipendium — Investasi pendidikan generasi bangsa',
    idBayarNom: 'bayarStipendiumNominal',
    idBuktiTot: 'buktiStipendiumTotal',
    idBuktiPrev: 'buktiStipendiumPreview',
    idBuktiInp: 'buktiStipendiumInput',
    idCopy: 'copyBankStipendium',
    labelNama: 'Nama Pembayar Stipendium',
    idNama: 'stipendiumNama',
    idWa: 'stipendiumWa',
  });

  /* ═══════════════════════════════════════════════════════════
     3. DAFTARKAN OBSERVER & LOGIKA PER KEWAJIBAN
  ═══════════════════════════════════════════════════════════ */
  Object.values(KEWAJIBAN).forEach(k => {
    // Reset counter setiap kali halaman kewajiban dibuka
    _observePage(`page-${k.pageId}`, () => {
      k.count = 0;
      _updateDisplay(k);
    });

    // Isi nominal di halaman bayar setiap kali dibuka
    _observePage(`page-${k.bayarPageId}`, () => {
      const nominal = k.count * k.harga;
      const nomEl = document.getElementById(k.idBayarNom);
      const buktiEl = document.getElementById(k.idBuktiTot);
      if (nomEl) nomEl.textContent = nominal.toLocaleString('id-ID');
      if (buktiEl) buktiEl.textContent = `Rp${nominal.toLocaleString('id-ID')}`;
      // Reset preview bukti ke placeholder
      const prevEl = document.getElementById(k.idBuktiPrev);
      if (prevEl && !prevEl.querySelector('img:not(.bukti-receipt)')) {
        // Biarkan mock receipt tetap tampil
      }
    });
  });

  /* ═══════════════════════════════════════════════════════════
     4. EVENT DELEGATION — tombol counter (+ / −) & bayar
     Semua event dipasang di document sekali saja.
  ═══════════════════════════════════════════════════════════ */
  document.addEventListener('click', e => {
    // Tombol increment / decrement
    const incBtn = e.target.closest('[data-kewajiban-inc]');
    const decBtn = e.target.closest('[data-kewajiban-dec]');
    const bayBtn = e.target.closest('[data-kewajiban-bayar]');
    const rstBtn = e.target.closest('[data-kewajiban-reset]');
    const copyBtn = e.target.closest('[data-copy-bank]');
    const submitBtn = e.target.closest('[data-submit-kewajiban]');

    if (incBtn) {
      const k = KEWAJIBAN[incBtn.dataset.kewajibanInc];
      if (k) { k.count++; _updateDisplay(k); }
    }
    if (decBtn) {
      const k = KEWAJIBAN[decBtn.dataset.kewajibanDec];
      if (k) { k.count = Math.max(0, k.count - 1); _updateDisplay(k); }
    }
    if (bayBtn) {
      const k = KEWAJIBAN[bayBtn.dataset.kewajibanBayar];
      if (!k) return;
      if (k.count === 0) {
        alert(`Silakan tentukan jumlah ${k.satuan.toLowerCase()} terlebih dahulu.`);
        return;
      }
      showPage(k.bayarPageId);
    }
    if (rstBtn) {
      const k = KEWAJIBAN[rstBtn.dataset.kewajibanReset];
      if (k) { k.count = 0; _updateDisplay(k); }
    }
    if (copyBtn) {
      const num = document.querySelector(`[data-copy-bank="${copyBtn.dataset.copyBank}"]`)
        ?.closest('.bayar-bank-card')
        ?.querySelector('.bayar-bank-number')?.textContent;
      if (num) {
        navigator.clipboard.writeText(num).catch(() => { });
        _flashCopyIcon(copyBtn);
      }
    }
    if (submitBtn) {
      showPage('sukses-donasi');
    }
  });

  // Upload bukti — satu listener untuk semua input file kewajiban
  document.addEventListener('change', e => {
    const input = e.target;
    if (!input.dataset.buktiFor) return;
    const file = input.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => {
      const prevEl = document.getElementById(input.dataset.buktiFor);
      if (prevEl) prevEl.innerHTML =
        `<img src="${ev.target.result}" style="width:100%;border-radius:8px;display:block;">`;
    };
    reader.readAsDataURL(file);
  });

  /* ═══════════════════════════════════════════════════════════
     TEMPLATE BUILDERS (privat)
  ═══════════════════════════════════════════════════════════ */

  /**
   * Render halaman kewajiban generik.
   * @param {object} cfg - konfigurasi konten
   */
  function _renderKewajiban(cfg) {
    const el = document.getElementById(cfg.pageId);
    if (!el) return;

    const heroDescHtml = cfg.heroDesc.split('\n').join('<br>');
    const badgeHtml = cfg.badgeText.split('\n').join('<br>');
    const deskHtml = cfg.deskripsi.map(p => `<p>${p}</p>`).join('');
    const ikonKalkulatorSVG = `
      <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round">
        <rect x="3" y="4" width="18" height="16" rx="2"/>
        <line x1="7" y1="9"  x2="17" y2="9"  stroke-width="1.5"/>
        <line x1="7" y1="13" x2="13" y2="13" stroke-width="1.5"/>
        <line x1="7" y1="17" x2="11" y2="17" stroke-width="1.5"/>
      </svg>`;
    const ikonCoinSVG = `
      <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#1a1a1a" stroke-width="2" stroke-linecap="round">
        <circle cx="12" cy="12" r="9"/>
        <path d="M14.5 9.5a2.5 2.5 0 0 0-5 0c0 1.5 1 2 2.5 2.5s2.5 1 2.5 2.5a2.5 2.5 0 0 1-5 0"/>
        <line x1="12" y1="7" x2="12" y2="6"/><line x1="12" y1="18" x2="12" y2="17"/>
      </svg>`;
    const ikonPlusSVG = `
      <svg width="16" height="16" viewBox="0 0 16 16">
        <rect x="6.5" y="0" width="3" height="16" rx="1.5" fill="#1a1a1a"/>
        <rect x="0" y="6.5" width="16" height="3" rx="1.5" fill="#1a1a1a"/>
      </svg>`;
    const ikonMinusSVG = `
      <svg width="16" height="3" viewBox="0 0 16 3">
        <rect width="16" height="3" rx="1.5" fill="#1a1a1a"/>
      </svg>`;
    const ikonRefreshSVG = `
      <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#666" stroke-width="2.2" stroke-linecap="round">
        <polyline points="23 4 23 10 17 10"/>
        <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10"/>
      </svg>`;

    el.innerHTML = `
      <div class="kewajiban-page">
        <div class="kewajiban-hero-wrap">

          <!-- Hero Image -->
          <div class="kewajiban-hero-img">
            <img src="${cfg.heroImg}" alt="${cfg.judul}">
            <div class="kewajiban-hero-overlay" style="background:${cfg.heroBg}">
              <div class="kewajiban-hero-badge" style="color:${cfg.badgeColor}">${badgeHtml}</div>
              <p class="kewajiban-hero-desc">${heroDescHtml}</p>
            </div>
          </div>

          <!-- Form Card -->
          <div class="kewajiban-form-card">
            <h2 class="kewajiban-form-title">${cfg.judul}</h2>
            <p class="kewajiban-form-sub">${cfg.sub} <strong>${cfg.hargaLabel}</strong></p>

            <!-- Counter Jumlah -->
            <div class="kewajiban-field-label">Jumlah ${cfg.satuan.toLowerCase()} yang ingin membayar</div>
            <div class="kewajiban-counter-row">
              <div class="kewajiban-icon-box">${ikonKalkulatorSVG}</div>
              <div class="kewajiban-counter">
                <button class="kewajiban-counter-btn"
                        data-kewajiban-dec="${cfg.key}">${ikonMinusSVG}</button>
                <span class="kewajiban-counter-val" id="${cfg.idJumlah}">—</span>
                <button class="kewajiban-counter-btn"
                        data-kewajiban-inc="${cfg.key}">${ikonPlusSVG}</button>
              </div>
            </div>

            <!-- Nominal -->
            <div class="kewajiban-field-label">Kewajiban yang harus dibayar</div>
            <div class="kewajiban-counter-row">
              <div class="kewajiban-icon-box money">${ikonCoinSVG}</div>
              <div class="kewajiban-nominal-row">
                <span class="kewajiban-nominal-val" id="${cfg.idNominal}">Rp.</span>
                <button class="kewajiban-refresh-btn"
                        data-kewajiban-reset="${cfg.key}">${ikonRefreshSVG}</button>
              </div>
            </div>

            <button class="kewajiban-bayar-btn"
                    data-kewajiban-bayar="${cfg.key}">Bayar Kewajiban</button>
          </div>
        </div>

        <!-- Deskripsi -->
        <div class="kewajiban-desc-block">${deskHtml}</div>
      </div>`;
  }

  /**
   * Render halaman bayar kewajiban generik.
   * @param {object} cfg - konfigurasi konten
   */
  function _renderBayar(cfg) {
    const el = document.getElementById(cfg.pageId);
    if (!el) return;

    el.innerHTML = `
      <div class="bayar-page">
        <div class="bayar-mini-banner">
          <div class="bayar-mini-img"><img src="${cfg.bannerImg}" alt=""></div>
          <div class="bayar-mini-title">${cfg.bannerJudul}</div>
        </div>

        <div class="bayar-section">
          <div class="bayar-section-label">Jumlah Kewajiban Dibayar</div>
          <div class="bayar-kewajiban-nominal">
            Rp. <span id="${cfg.idBayarNom}" class="bkn-green">0</span>
          </div>
        </div>

        <div class="bayar-section">
          <div class="bayar-section-label">No.Bank</div>
          <div class="bayar-bank-card">
            <div class="bayar-bank-logo"><span class="bri-logo">🏦 BRI</span></div>
            <div class="bayar-bank-number">2429529058325025-52</div>
            <button class="bayar-copy-btn" data-copy-bank="${cfg.idCopy}">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="#333" stroke-width="2">
                <rect x="9" y="9" width="13" height="13" rx="2"/>
                <path d="M5 15H4a2 2 0 0 1-2-2V4a2 2 0 0 1 2-2h9a2 2 0 0 1 2 2v1"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="bayar-section">
          <div class="bayar-section-label">Bukti Pembayaran</div>
          <div class="bayar-bukti-area"
               onclick="document.getElementById('${cfg.idBuktiInp}').click()">
            <div class="bayar-bukti-preview" id="${cfg.idBuktiPrev}">
              <div class="bukti-placeholder">
                <div class="bukti-mock-receipt">
                  <div class="bukti-mock-row header">
                    <span>Total Bayar</span>
                    <span id="${cfg.idBuktiTot}">—</span>
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
            <input type="file" id="${cfg.idBuktiInp}" accept="image/*"
                   style="display:none"
                   data-bukti-for="${cfg.idBuktiPrev}">
          </div>
        </div>

        <div class="bayar-section">
          <div class="bayar-section-label-big">Profil Anda</div>
          <div class="bayar-field-label">${cfg.labelNama}</div>
          <input type="text" class="bayar-input" id="${cfg.idNama}" placeholder="Masukkan nama lengkap">
          <div class="bayar-field-label">No.WA</div>
          <input type="text" class="bayar-input" id="${cfg.idWa}" placeholder="Contoh: 0812xxxxxxxx">
        </div>

        <button class="bayar-submit-btn" data-submit-kewajiban="true">LAKUKAN TRANSAKSI</button>
      </div>`;
  }

  /* ═══════════════════════════════════════════════════════════
     UTILITIES PRIVAT
  ═══════════════════════════════════════════════════════════ */

  /** Update tampilan counter & nominal untuk satu kewajiban */
  function _updateDisplay(k) {
    const valEl = document.getElementById(k.idJumlah);
    const nomEl = document.getElementById(k.idNominal);
    if (valEl) valEl.textContent = k.count === 0 ? '—' : k.count;
    if (nomEl) nomEl.textContent = k.count === 0
      ? 'Rp.'
      : `Rp.${(k.count * k.harga).toLocaleString('id-ID')}`;
  }

  /** Animasi ikon centang pada tombol copy */
  function _flashCopyIcon(btn) {
    const orig = btn.innerHTML;
    btn.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none"
      stroke="#4a6741" stroke-width="2.5"><polyline points="20 6 9 17 4 12"/></svg>`;
    setTimeout(() => (btn.innerHTML = orig), 1600);
  }

});

/* ═══════════════════════════════════════════════════════════════
   UTILITY GLOBAL — observasi perubahan class halaman
   (digunakan oleh donasi.js dan kewajiban.js)
   Jika sudah didefinisikan di donasi.js, tidak perlu redefinisi.
═══════════════════════════════════════════════════════════════ */
if (typeof _observePage === 'undefined') {
  function _observePage(pageId, callback) {
    const el = document.getElementById(pageId);
    if (!el) return;
    let last = false;
    new MutationObserver(() => {
      const visible = el.classList.contains('visible');
      if (visible && !last) { last = true; callback(); }
      else if (!visible) { last = false; }
    }).observe(el, { attributes: true, attributeFilter: ['class'] });
  }
}
