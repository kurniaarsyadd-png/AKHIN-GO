/* ================================================================
   script.js — AKHIN.GO
   JavaScript murni, tanpa library.
   Dibuat sederhana agar mudah dipahami mahasiswa pemula.
   ================================================================ */


/* -----------------------------------------------
   1. ELEMEN YANG SERING DIPAKAI
   Ambil sekali di awal, supaya tidak diulang.
   ----------------------------------------------- */
var navbar    = document.getElementById('navbar');
var hamburger = document.getElementById('hamburger');
var navMenu   = document.getElementById('navMenu');
var navLinks  = document.querySelectorAll('.nav-link');
var sections  = document.querySelectorAll('section[id]');


/* -----------------------------------------------
   2. NAVBAR BERUBAH SAAT SCROLL
   Menambahkan class 'scrolled' supaya navbar
   mendapat background setelah halaman discroll.
   ----------------------------------------------- */
window.addEventListener('scroll', function () {
  if (window.scrollY > 60) {
    navbar.classList.add('scrolled');
  } else {
    navbar.classList.remove('scrolled');
  }
});


/* -----------------------------------------------
   3. HAMBURGER MENU (Mobile)
   Buka/tutup menu saat tombol diklik.
   ----------------------------------------------- */
if (hamburger) {
  hamburger.addEventListener('click', function () {
    hamburger.classList.toggle('active');
    navMenu.classList.toggle('active');
  });
}


/* -----------------------------------------------
   4. SMOOTH SCROLL
   Saat link navbar diklik, halaman scroll halus
   ke section yang dituju, lalu tutup menu mobile.
   ----------------------------------------------- */
var allAnchors = document.querySelectorAll('a[href^="#"]');

allAnchors.forEach(function (link) {
  link.addEventListener('click', function (e) {
    var href = this.getAttribute('href');

    /* abaikan jika href hanya "#" saja */
    if (href === '#') return;

    e.preventDefault();
    var target = document.querySelector(href);

    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }

    /* tutup menu mobile (jika terbuka) */
    if (hamburger) {
      hamburger.classList.remove('active');
      navMenu.classList.remove('active');
    }
  });
});


/* -----------------------------------------------
   5. SCROLL SPY
   Menandai link navbar yang sesuai dengan section
   yang sedang terlihat di layar.
   ----------------------------------------------- */
function updateActiveLink() {
  var scrollPos = window.scrollY + 120;

  sections.forEach(function (section) {
    var top    = section.offsetTop;
    var height = section.offsetHeight;
    var id     = section.getAttribute('id');

    if (scrollPos >= top && scrollPos < top + height) {
      /* hapus 'active' dari semua link */
      navLinks.forEach(function (l) { l.classList.remove('active'); });
      /* tambahkan 'active' ke link yang sesuai */
      var activeLink = document.querySelector('.nav-link[href="#' + id + '"]');
      if (activeLink) activeLink.classList.add('active');
    }
  });
}

/* jalankan saat scroll (dengan sedikit throttling) */
var scrollTimer;
window.addEventListener('scroll', function () {
  clearTimeout(scrollTimer);
  scrollTimer = setTimeout(updateActiveLink, 80);
});


/* -----------------------------------------------
   6. ANIMASI REVEAL (Muncul saat Scroll)
   Menggunakan IntersectionObserver untuk mendeteksi
   elemen yang masuk ke area layar.
   ----------------------------------------------- */
var revealEls = document.querySelectorAll('.reveal');

var revealObserver = new IntersectionObserver(function (entries) {
  entries.forEach(function (entry) {
    if (entry.isIntersecting) {
      entry.target.classList.add('revealed');
      revealObserver.unobserve(entry.target); /* animasi hanya sekali */
    }
  });
}, { threshold: 0.12 });

revealEls.forEach(function (el) {
  revealObserver.observe(el);
});


/* -----------------------------------------------
   7. FALLBACK GAMBAR
   Jika gambar gagal dimuat, tampilkan pesan
   pengganti supaya layout tidak rusak.
   ----------------------------------------------- */
document.querySelectorAll('img').forEach(function (img) {
  img.addEventListener('error', function () {
    this.style.display = 'none';
    var fb = document.createElement('div');
    fb.className = 'img-fallback';
    fb.textContent = 'Gambar belum ditambahkan';
    this.parentNode.insertBefore(fb, this.nextSibling);
  });
});


/* ================================================================
   8. KODE KHUSUS HALAMAN BELAJAR (belajar.html)
   Hanya berjalan jika elemen-nya ada di halaman.

   Alur navigasi:
   - Klik bab di sidebar → tampilkan bab, buka sub-bab-nya
   - Klik sub-bab di sidebar → tampilkan konten sub-bab saja
   ================================================================ */

var sidebarBtn  = document.getElementById('sidebarToggle');
var sidebar     = document.getElementById('belajarSidebar');
var babLinks    = document.querySelectorAll('.bab-link');
var babContents = document.querySelectorAll('.bab-content');
var subLists    = document.querySelectorAll('.sub-bab-list');
var subLinks    = document.querySelectorAll('.sub-bab-link');


/* --- Toggle sidebar di mobile --- */
if (sidebarBtn && sidebar) {
  sidebarBtn.addEventListener('click', function () {
    sidebar.classList.toggle('active');
  });
}


/* --- Klik bab di sidebar --- */
if (babLinks.length > 0) {
  babLinks.forEach(function (link) {
    link.addEventListener('click', function () {
      var babId = this.getAttribute('data-bab');

      /* 1) tandai bab yang diklik */
      babLinks.forEach(function (l) { l.classList.remove('active'); });
      this.classList.add('active');

      /* 2) sembunyikan semua bab, tampilkan yang dipilih */
      babContents.forEach(function (c) { c.style.display = 'none'; });
      var target = document.getElementById('bab-' + babId);
      if (target) target.style.display = 'block';

      /* 3) tampilkan sub-bab list yang sesuai, sembunyikan lainnya */
      subLists.forEach(function (list) {
        if (list.getAttribute('data-parent') === babId) {
          list.classList.add('active');
        } else {
          list.classList.remove('active');
        }
      });

      /* 4) reset: tampilkan sub-bab pertama, sembunyikan lainnya */
      if (target) {
        target.querySelectorAll('.subbab-panel').forEach(function (p, i) {
          if (i === 0) p.classList.add('active');
          else p.classList.remove('active');
        });
      }
      subLinks.forEach(function (s) {
        var subParent = s.closest('.sub-bab-list');
        if (subParent && subParent.getAttribute('data-parent') === babId) {
          /* aktifkan yang pertama saja */
          if (s === subParent.querySelector('.sub-bab-link')) {
            s.classList.add('active');
          } else {
            s.classList.remove('active');
          }
        } else {
          s.classList.remove('active');
        }
      });

      /* 5) tutup sidebar di mobile & scroll ke atas */
      if (sidebar) sidebar.classList.remove('active');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    });
  });
}


/* --- Klik sub-bab di sidebar ---
   Hanya menampilkan konten sub-bab yang diklik,
   yang lain disembunyikan.                          */
if (subLinks.length > 0) {
  subLinks.forEach(function (btn) {
    btn.addEventListener('click', function (e) {
      e.stopPropagation(); /* jangan trigger klik bab */

      var subId = this.getAttribute('data-sub');

      /* cari sub-bab list parent untuk scope per bab */
      var parentList = this.closest('.sub-bab-list');

      /* hapus active dari semua sub-bab link dalam bab ini */
      if (parentList) {
        parentList.querySelectorAll('.sub-bab-link').forEach(function (b) {
          b.classList.remove('active');
        });
      }

      /* tandai yang diklik */
      this.classList.add('active');

      /* sembunyikan semua panel, tampilkan yang dipilih */
      var allPanels = document.querySelectorAll('.subbab-panel');
      allPanels.forEach(function (p) { p.classList.remove('active'); });
      var targetPanel = document.getElementById('sub-' + subId);
      if (targetPanel) targetPanel.classList.add('active');

      /* tutup sidebar di mobile */
      if (sidebar) sidebar.classList.remove('active');
    });
  });
}