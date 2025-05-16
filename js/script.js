const canvas = document.getElementById('bg');
const ctx    = canvas.getContext('2d');

// адаптация под размер окна
function resize() {
  canvas.width  = window.innerWidth;
  canvas.height = window.innerHeight;
}
window.addEventListener('resize', resize);
resize();

// ───── узлы "нейросети" ─────
class Node {
  constructor() { this.reset(); }
  reset() {
    this.x  = Math.random() * canvas.width;
    this.y  = Math.random() * canvas.height;
    this.vx = (Math.random() - 0.5) * 0.5;
    this.vy = (Math.random() - 0.5) * 0.5;
  }
  update() {
    this.x += this.vx; this.y += this.vy;
    if (this.x < 0 || this.x > canvas.width)  this.vx *= -1;
    if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
  }
}
const NODES_COUNT = 80;
const nodes = Array.from({ length: NODES_COUNT }, () => new Node());

// ───── фигуры (включая "соты") ─────
const SHAPES_COUNT = 60;
const shapeTypes = ['square','circle','cross','triangle','dot','hexagon'];
const shapes = Array.from({ length: SHAPES_COUNT }, () => ({
  type:  shapeTypes[Math.floor(Math.random() * shapeTypes.length)],
  x:     Math.random() * canvas.width,
  y:     Math.random() * canvas.height,
  vx:    (Math.random() - 0.5) * 0.8,
  vy:    (Math.random() - 0.5) * 0.8,
  size:  12 + Math.random() * 18,
  color: `hsl(${Math.random() * 360},70%,60%)`
}));

function updateAndDrawShapes() {
  shapes.forEach(s => {
    s.x += s.vx; s.y += s.vy;
    if (s.x < 0 || s.x > canvas.width)  s.vx *= -1;
    if (s.y < 0 || s.y > canvas.height) s.vy *= -1;

    ctx.fillStyle   = s.color;
    ctx.strokeStyle = s.color;
    ctx.lineWidth   = 2;

    switch (s.type) {
      case 'square':
        ctx.fillRect(s.x - s.size/2, s.y - s.size/2, s.size, s.size);
        break;
      case 'circle':
        ctx.beginPath();
        ctx.arc(s.x, s.y, s.size/2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'dot':
        ctx.beginPath();
        ctx.arc(s.x, s.y, 2, 0, Math.PI * 2);
        ctx.fill();
        break;
      case 'cross':
        ctx.beginPath();
        ctx.moveTo(s.x - s.size/2, s.y - s.size/2);
        ctx.lineTo(s.x + s.size/2, s.y + s.size/2);
        ctx.moveTo(s.x + s.size/2, s.y - s.size/2);
        ctx.lineTo(s.x - s.size/2, s.y + s.size/2);
        ctx.stroke();
        break;
      case 'triangle':
        ctx.beginPath();
        ctx.moveTo(s.x,          s.y - s.size/2);
        ctx.lineTo(s.x + s.size/2, s.y + s.size/2);
        ctx.lineTo(s.x - s.size/2, s.y + s.size/2);
        ctx.closePath();
        ctx.fill();
        break;
      case 'hexagon':
        const r = s.size;
        ctx.beginPath();
        for (let i = 0; i < 6; i++) {
          const ang = (Math.PI / 3) * i;
          const px  = s.x + Math.cos(ang) * r;
          const py  = s.y + Math.sin(ang) * r;
          i === 0 ? ctx.moveTo(px, py) : ctx.lineTo(px, py);
        }
        ctx.closePath();
        ctx.fill();
        break;
    }
  });
}

// ───── рендер всего ─────
function draw() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);

  // нейросеть: рёбра
  for (let i = 0; i < nodes.length; i++) {
    const a = nodes[i];
    for (let j = i + 1; j < nodes.length; j++) {
      const b = nodes[j];
      const dx = a.x - b.x, dy = a.y - b.y;
      const dist = Math.hypot(dx, dy);
      if (dist < 150) {
        ctx.strokeStyle = `rgba(255,255,255,${1 - dist/150})`;
        ctx.beginPath();
        ctx.moveTo(a.x, a.y);
        ctx.lineTo(b.x, b.y);
        ctx.stroke();
      }
    }
  }

  // нейросеть: узлы
  nodes.forEach(n => {
    n.update();
    ctx.beginPath();
    ctx.arc(n.x, n.y, 2, 0, Math.PI * 2);
    ctx.fillStyle = '#fff';
    ctx.fill();
  });

  // фигуры и «соты»
  updateAndDrawShapes();

  requestAnimationFrame(draw);
}

draw();
