// =============================
// HELPER ELEMENTS
// =============================
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");
const scrollTopBtn = document.getElementById("scrollTopBtn");

// =============================
// GABUNGAN SCROLL LISTENER (Performa Lebih Baik)
// (Untuk Navbar Active & Scroll-to-Top)
// =============================
window.addEventListener("scroll", () => {
  // 1. Logika untuk Scroll-to-Top
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }

  // 2. Logika untuk Navbar Active
  let current = "";
  sections.forEach(section => {
    // Menggunakan offset 120px Anda untuk header
    const sectionTop = section.offsetTop - 120; 
    if (scrollY >= sectionTop) {
      current = section.getAttribute("id");
    }
  });

  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// =============================
// FUNGSI KLIK SCROLL-TO-TOP
// =============================
scrollTopBtn.onclick = function() {
  document.body.scrollTop = 0; // Untuk Safari
  document.documentElement.scrollTop = 0; // Untuk Chrome, Firefox, dll.
}

// =============================
// THEME TOGGLE (Versi Diperbaiki dengan Ikon Font Awesome)
// =============================
const themeToggle = document.createElement("button");
themeToggle.className = "toggle-theme";
themeToggle.setAttribute("aria-label", "Toggle dark mode");

const themeIcon = document.createElement("i");
themeIcon.className = "fas fa-moon"; // Ikon default (mode terang)

themeToggle.appendChild(themeIcon);
document.querySelector("nav").appendChild(themeToggle);

// Set tema awal saat memuat halaman (opsional, tapi bagus)
// Untuk saat ini, kita set default ke 'light'
document.documentElement.setAttribute("data-theme", "light");

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  
  if (currentTheme === "dark") {
    // Jika gelap -> ubah ke terang
    document.documentElement.setAttribute("data-theme", "light");
    themeIcon.className = "fas fa-moon";
  } else {
    // Jika terang -> ubah ke gelap
    document.documentElement.setAttribute("data-theme", "dark");
    themeIcon.className = "fas fa-sun";
  }
});

// =============================
// FLOATING NETWORK ANIMATION (Diperbaiki untuk Dark Mode)
// =============================
function createNetwork(canvasId) {
  const canvas = document.createElement("canvas");
  canvas.className = "canvas-bg";
  
  const parentSection = document.querySelector(`#${canvasId}`);
  if (!parentSection) return; // Hentikan jika section tidak ditemukan
  parentSection.appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];
  const numParticles = 40;

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
    
    // PERBAIKAN: Cek tema saat ini untuk menentukan warna
    const currentTheme = document.documentElement.getAttribute("data-theme");
    let particleColor, lineColor;

    if (currentTheme === "dark") {
      particleColor = "#3b82f6"; // var(--primary) versi dark
      lineColor = "rgba(59, 130, 246, 0.2)";
    } else {
      particleColor = "#2563eb"; // var(--primary) versi light
      lineColor = "rgba(37, 99, 235, 0.2)";
    }

    ctx.fillStyle = particleColor;
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    connectParticles(lineColor);
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

// Peringatan: Menjalankan 5 animasi canvas terpisah bisa jadi berat
// untuk beberapa perangkat. Jika terasa lambat, pertimbangkan
// untuk hanya menjalankannya di section 'home'.
["home", "about", "skills", "projects", "contact"].forEach(id => createNetwork(id));