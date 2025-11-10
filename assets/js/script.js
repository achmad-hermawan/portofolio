// =============================
// NAVBAR ACTIVE SCROLL
// =============================
const sections = document.querySelectorAll("section");
const navLinks = document.querySelectorAll("nav a");

window.addEventListener("scroll", () => {
  let current = "";
  sections.forEach(section => {
    const sectionTop = section.offsetTop - 120;
    if (scrollY >= sectionTop) current = section.getAttribute("id");
  });
  navLinks.forEach(link => {
    link.classList.remove("active");
    if (link.getAttribute("href") === `#${current}`) {
      link.classList.add("active");
    }
  });
});

// =============================
// THEME TOGGLE
// =============================
const themeToggle = document.createElement("button");
themeToggle.className = "toggle-theme";
themeToggle.innerHTML = "🌙";
document.querySelector("nav").appendChild(themeToggle);

themeToggle.addEventListener("click", () => {
  const currentTheme = document.documentElement.getAttribute("data-theme");
  if (currentTheme === "dark") {
    document.documentElement.setAttribute("data-theme", "light");
    themeToggle.innerHTML = "🌙";
  } else {
    document.documentElement.setAttribute("data-theme", "dark");
    themeToggle.innerHTML = "☀️";
  }
});

// =============================
// FLOATING NETWORK ANIMATION
// =============================
function createNetwork(canvasId) {
  const canvas = document.createElement("canvas");
  canvas.className = "canvas-bg";
  document.querySelector(`#${canvasId}`).appendChild(canvas);

  const ctx = canvas.getContext("2d");
  let particles = [];
  const numParticles = 40;

  function resize() {
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
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
    ctx.fillStyle = "var(--primary)";
    for (let p of particles) {
      ctx.beginPath();
      ctx.arc(p.x, p.y, 2, 0, Math.PI * 2);
      ctx.fill();
    }
    connectParticles();
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

  function connectParticles() {
    for (let a of particles) {
      for (let b of particles) {
        const dist = Math.hypot(a.x - b.x, a.y - b.y);
        if (dist < 100) {
          ctx.strokeStyle = "rgba(37,99,235,0.2)";
          ctx.lineWidth = 0.5;
          ctx.beginPath();
          ctx.moveTo(a.x, a.y);
          ctx.lineTo(b.x, b.y);
          ctx.stroke();
        }
      }
    }
  }

  resize();
  init();
  draw();
  window.addEventListener("resize", resize);
}

const scrollTopBtn = document.getElementById("scrollTopBtn");
window.addEventListener("scroll", () => {
  if (document.body.scrollTop > 100 || document.documentElement.scrollTop > 100) {
    scrollTopBtn.style.display = "block";
  } else {
    scrollTopBtn.style.display = "none";
  }
});

// Tambahkan network animation ke tiap section
["home", "about", "skills", "projects", "contact"].forEach(id => createNetwork(id));
