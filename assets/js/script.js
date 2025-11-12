/**
 * Menunggu hingga seluruh konten HTML dimuat sebelum menjalankan script
 * Ini adalah praktik terbaik untuk menghindari error 'element not found'
 */
window.addEventListener('DOMContentLoaded', () => {

  // Panggil semua fungsi inisialisasi
  setupScrollListeners();
  setupThemeToggle();
  setupCanvasAnimations();
  registerServiceWorker();

});

// =============================
// MODUL 1: SCROLLING
// (Navbar Active & Scroll-to-Top)
// =============================
function setupScrollListeners() {
  const sections = document.querySelectorAll("section");
  const navLinks = document.querySelectorAll("nav a");
  const scrollTopBtn = document.getElementById("scrollTopBtn");

  // Jika elemen tidak ditemukan, hentikan fungsi
  if (!scrollTopBtn || sections.length === 0 || navLinks.length === 0) {
    console.warn("Elemen untuk scroll listener tidak ditemukan.");
    return;
  }

  // Gabungan event listener untuk performa
  window.addEventListener("scroll", () => {
    // 1. Logika untuk Scroll-to-Top
    if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
      scrollTopBtn.style.display = "block";
    } else {
      scrollTopBtn.style.display = "none";
    }

    // 2. Logika untuk Navbar Active
    let current = "";
    const scrollYWithOffset = window.scrollY + 121; // Offset 120px + 1px

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.clientHeight;
      if (scrollYWithOffset >= sectionTop && scrollYWithOffset < sectionTop + sectionHeight) {
        current = section.getAttribute("id");
      }
    });

    navLinks.forEach(link => {
      link.classList.remove("active");
      const linkHref = link.getAttribute("href");
      if (linkHref === `#${current}`) {
        link.classList.add("active");
      }
    });
  });

  // Fungsi klik untuk tombol Scroll-to-Top
  scrollTopBtn.onclick = () => {
    document.body.scrollTop = 0; // Untuk Safari
    document.documentElement.scrollTop = 0; // Untuk Chrome, Firefox, dll.
  };
}


// =============================
// MODUL 2: THEME TOGGLE
// (Dengan Ikon Font Awesome)
// =============================
function setupThemeToggle() {
  const nav = document.querySelector("nav");
  if (!nav) {
    console.warn("Elemen <nav> tidak ditemukan untuk theme toggle.");
    return;
  }

  const themeToggle = document.createElement("button");
  themeToggle.className = "toggle-theme";
  themeToggle.setAttribute("aria-label", "Toggle dark mode");

  const themeIcon = document.createElement("i");
  
  // Set tema awal ke 'light' (sesuai kode Anda)
  document.documentElement.setAttribute("data-theme", "light");
  themeIcon.className = "fas fa-moon";

  themeToggle.appendChild(themeIcon);
  nav.appendChild(themeToggle);

  // Logika klik
  themeToggle.addEventListener("click", () => {
    const currentTheme = document.documentElement.getAttribute("data-theme");
    
    if (currentTheme === "dark") {
      document.documentElement.setAttribute("data-theme", "light");
      themeIcon.className = "fas fa-moon";
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      themeIcon.className = "fas fa-sun";
    }
  });
}


// =============================
// MODUL 3: CANVAS NETWORK ANIMATION
// =============================
function setupCanvasAnimations() {
  /**
   * Peringatan Performa: Menjalankan 5 animasi canvas terpisah
   * bisa sangat membebani CPU, terutama di perangkat mobile.
   *
   * Rekomendasi: Pertimbangkan untuk hanya menjalankan ini
   * di satu section saja, misalnya createNetwork("home");
   */
  ["home", "about", "skills", "projects", "contact"].forEach(id => createNetwork(id));
}

/**
 * Fungsi createNetwork (Diperbaiki agar membaca warna dari CSS)
 */
function createNetwork(canvasId) {
  const parentSection = document.querySelector(`#${canvasId}`);
  if (!parentSection) return; // Hentikan jika section tidak ditemukan

  const canvas = document.createElement("canvas");
  canvas.className = "canvas-bg";
  parentSection.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];
  const numParticles = 40;

  // --- Fungsi Helper untuk Konversi Warna ---
  function hexToRgba(hex, alpha) {
    // Hapus tanda #
    hex = hex.replace('#', '');
    // Konversi hex ke R, G, B
    const r = parseInt(hex.substring(0, 2), 16);
    const g = parseInt(hex.substring(2, 4), 16);
    const b = parseInt(hex.substring(4, 6), 16);
    return `rgba(${r}, ${g}, ${b}, ${alpha})`;
  }
  // ------------------------------------------

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
    init(); // Panggil init agar partikel di-reset saat resize
  }

  function init() {
    particles = [];
    for (let i = 0; i < numParticles; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        dx: (Math.random() - 0.5) * 0.5,
        dy: (Math.random() - 0.5) * 0.5,
      });
    }
  }

  function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    
    // === PERBAIKAN PENTING ===
    // Baca warna --primary dari CSS, BUKAN hard-code.
    // Ini memastikan animasi berubah warna saat dark mode aktif.
    const computedStyles = getComputedStyle(document.documentElement);
    const particleColorHex = computedStyles.getPropertyValue('--primary').trim();
    
    // Buat warna garis dengan opacity dari warna hex
    const lineColorRgba = hexToRgba(particleColorHex, 0.2);

    ctx.fillStyle = particleColorHex;
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    connectParticles(lineColorRgba);
    moveParticles();
    requestAnimationFrame(draw);
  }

  function moveParticles() {
    for (let p of particles) {
      p.x += p.dx;
      p.y += p.dy;
      if (p.x < 0 || p.x > canvas.width) p.dx *= -1;
      if (p.y < 0 || p.y > canvas.height) p.dy *= -1;
    }
  }

  function connectParticles(lineColor) {
    for (let a of particles) {
      for (let b of particles) {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 100) {
          ctx.strokeStyle = lineColor; // Menggunakan warna dinamis
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  resize(); // Memanggil resize pertama kali (yang juga memanggil init)
  draw(); // Mulai animasi
  window.addEventListener("resize", resize); // Tambah listener untuk resize
}


// =============================
// MODUL 4: SERVICE WORKER (PWA)
// =============================
function registerServiceWorker() {
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', () => {
      navigator.serviceWorker.register('/sw.js')
        .then((registration) => {
          console.log('Service Worker berhasil didaftarkan:', registration.scope);
        })
        .catch((error) => {
          console.log('Pendaftaran Service Worker gagal:', error);
        });
    });
  }
}