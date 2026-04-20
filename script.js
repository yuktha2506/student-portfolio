const canvas = document.getElementById('bg');
const ctx = canvas.getContext('2d');
let W, H;
const orbs = [];
const colors = ['#f9c6d0','#dcd0f5','#c3ecd9','#c5e4f7','#fddbc8','#fdf0c2','#e8d5f8','#d0f0e8'];

function resize() {
  W = canvas.width = window.innerWidth;
  H = canvas.height = window.innerHeight;
}

function createOrbs() {
  orbs.length = 0;
  for (let i = 0; i < 18; i++) {
    orbs.push({
      x: Math.random() * W,
      y: Math.random() * H,
      r: 40 + Math.random() * 90,
      color: colors[Math.floor(Math.random() * colors.length)],
      vx: (Math.random() - .5) * .4,
      vy: (Math.random() - .5) * .3,
      phase: Math.random() * Math.PI * 2
    });
  }
}

function draw(t) {
  ctx.clearRect(0, 0, W, H);
  for (const o of orbs) {
    o.phase += .008;
    o.x += o.vx + Math.sin(o.phase) * .3;
    o.y += o.vy + Math.cos(o.phase * .7) * .2;
    if (o.x < -o.r) o.x = W + o.r;
    if (o.x > W + o.r) o.x = -o.r;
    if (o.y < -o.r) o.y = H + o.r;
    if (o.y > H + o.r) o.y = -o.r;
    const g = ctx.createRadialGradient(o.x, o.y, 0, o.x, o.y, o.r);
    g.addColorStop(0, o.color + 'cc');
    g.addColorStop(1, o.color + '00');
    ctx.fillStyle = g;
    ctx.beginPath();
    ctx.arc(o.x, o.y, o.r, 0, Math.PI * 2);
    ctx.fill();
  }
  requestAnimationFrame(draw);
}

resize();
createOrbs();
window.addEventListener('resize', () => { resize(); createOrbs(); });
requestAnimationFrame(draw);

// Scroll reveal
const reveals = document.querySelectorAll('.reveal');
const observer = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) e.target.classList.add('revealed'); });
}, { threshold: .12 });
reveals.forEach(r => observer.observe(r));

// 3D tilt on project cards
document.querySelectorAll('.project-card').forEach(card => {
  card.addEventListener('mousemove', e => {
    const rect = card.getBoundingClientRect();
    const x = (e.clientX - rect.left) / rect.width - .5;
    const y = (e.clientY - rect.top) / rect.height - .5;
    card.style.transform = `rotateY(${x * 14}deg) rotateX(${-y * 10}deg) translateY(-8px)`;
  });
  card.addEventListener('mouseleave', () => {
    card.style.transform = '';
  });
});

// Smooth scroll
document.querySelectorAll('a[href^="#"]').forEach(a => {
  a.addEventListener('click', e => {
    e.preventDefault();
    const t = document.querySelector(a.getAttribute('href'));
    if (t) t.scrollIntoView({ behavior: 'smooth' });
  });
});
