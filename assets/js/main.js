// NAVBAR
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', window.scrollY > 50));

// HAMBURGER
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');
hamburger.addEventListener('click', () => navLinks.classList.toggle('open'));
navLinks.querySelectorAll('a').forEach(a => a.addEventListener('click', () => navLinks.classList.remove('open')));

// TYPED ANIMATION
const words = ['convert', 'inspire', 'perform', 'scale', 'stand out'];
let wi = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typedText');
function type() {
  if (!typedEl) return;
  const word = words[wi];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; return setTimeout(type, 2000); }
  } else {
    typedEl.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; wi = (wi + 1) % words.length; }
  }
  setTimeout(type, deleting ? 55 : 95);
}
type();

// COUNTERS
function animateCounter(el, target, dur) {
  let start = null;
  const step = ts => {
    if (!start) start = ts;
    const p = Math.min((ts - start) / dur, 1);
    el.textContent = Math.floor(p * target);
    if (p < 1) requestAnimationFrame(step);
    else el.textContent = target;
  };
  requestAnimationFrame(step);
}
const cObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { animateCounter(e.target, +e.target.dataset.target, 1800); cObs.unobserve(e.target); } });
}, { threshold: 0.5 });
document.querySelectorAll('.hs-num').forEach(c => cObs.observe(c));

// PROGRESS BARS
const barObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.style.width = e.target.dataset.w; barObs.unobserve(e.target); } });
}, { threshold: 0.3 });
document.querySelectorAll('.hfc-fill').forEach(b => barObs.observe(b));

// SCROLL REVEAL
const revObs = new IntersectionObserver(entries => {
  entries.forEach(e => { if (e.isIntersecting) { e.target.classList.add('visible'); revObs.unobserve(e.target); } });
}, { threshold: 0.1 });
document.querySelectorAll('.reveal').forEach(el => revObs.observe(el));

// CONTACT FORM
const form = document.getElementById('contactForm');
if (form) form.addEventListener('submit', e => {
  e.preventDefault();
  const btn = form.querySelector('button[type="submit"]');
  btn.innerHTML = '<i class="fa-solid fa-circle-check"></i> Message Sent!';
  btn.style.background = '#22c55e';
  setTimeout(() => { btn.innerHTML = 'Send Message <i class="fa-solid fa-paper-plane"></i>'; btn.style.background = ''; }, 3500);
});

// THREE.JS: HERO — TORUS KNOT
(function heroScene() {
  const canvas = document.getElementById('heroCanvas');
  if (!canvas || !window.THREE) return;
  const W = canvas.offsetWidth || 520, H = 420;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.set(0, 0, 7);
  const geo = new THREE.TorusKnotGeometry(1.6, 0.5, 180, 20);
  const mat = new THREE.MeshStandardMaterial({ color: 0x01696f, roughness: 0.3, metalness: 0.6 });
  const mesh = new THREE.Mesh(geo, mat);
  scene.add(mesh);
  const wire = new THREE.Mesh(geo, new THREE.MeshBasicMaterial({ color: 0x01696f, wireframe: true, transparent: true, opacity: 0.1 }));
  scene.add(wire);
  const pGeo = new THREE.BufferGeometry();
  const pPos = new Float32Array(360);
  for (let i = 0; i < 360; i++) pPos[i] = (Math.random() - 0.5) * 10;
  pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
  scene.add(new THREE.Points(pGeo, new THREE.PointsMaterial({ color: 0x01696f, size: 0.05, transparent: true, opacity: 0.4 })));
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dl = new THREE.DirectionalLight(0xffffff, 1.2);
  dl.position.set(5, 5, 5); scene.add(dl);
  const pl = new THREE.PointLight(0xa8f0ed, 1, 20);
  pl.position.set(-4, 3, 3); scene.add(pl);
  let mx = 0, my = 0;
  window.addEventListener('mousemove', e => { mx = (e.clientX / innerWidth - 0.5) * 2; my = (e.clientY / innerHeight - 0.5) * 2; });
  function animate(t) {
    requestAnimationFrame(animate);
    mesh.rotation.x = t * 0.0003 + my * 0.2;
    mesh.rotation.y = t * 0.0006 + mx * 0.2;
    wire.rotation.copy(mesh.rotation);
    renderer.render(scene, camera);
  }
  animate(0);
  window.addEventListener('resize', () => {
    renderer.setSize(canvas.offsetWidth, H);
    camera.aspect = canvas.offsetWidth / H;
    camera.updateProjectionMatrix();
  });
})();

// THREE.JS: CUBE SECTION
(function cubeScene() {
  const canvas = document.getElementById('cube3d');
  if (!canvas || !window.THREE) return;
  const W = canvas.offsetWidth || 500, H = 400;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(50, W / H, 0.1, 100);
  camera.position.set(0, 0, 8);
  const group = new THREE.Group();
  const cGeo = new THREE.BoxGeometry(2, 2, 2);
  const cube = new THREE.Mesh(cGeo, new THREE.MeshStandardMaterial({ color: 0x01696f, roughness: 0.4, metalness: 0.5 }));
  group.add(cube);
  group.add(new THREE.LineSegments(new THREE.EdgesGeometry(cGeo), new THREE.LineBasicMaterial({ color: 0x0c4e54 })));
  for (let i = 0; i < 6; i++) {
    const mini = new THREE.Mesh(new THREE.BoxGeometry(0.3,0.3,0.3), new THREE.MeshStandardMaterial({ color: 0xb0e8e6, roughness: 0.3, metalness: 0.7 }));
    const a = (i / 6) * Math.PI * 2;
    mini.position.set(Math.cos(a) * 2.8, Math.sin(a) * 2.8, 0);
    mini.userData.a = a;
    group.add(mini);
  }
  scene.add(group);
  scene.add(new THREE.AmbientLight(0xffffff, 0.5));
  const dl2 = new THREE.DirectionalLight(0xffffff, 1); dl2.position.set(5,8,5); scene.add(dl2);
  const pl2 = new THREE.PointLight(0xa8f0ed, 1.5, 20); pl2.position.set(-4,4,4); scene.add(pl2);
  let t2 = 0;
  (function loop() {
    requestAnimationFrame(loop); t2 += 0.012;
    cube.rotation.x = t2 * 0.5; cube.rotation.y = t2 * 0.7;
    group.children.forEach((c, i) => { if (i > 1) { const a = c.userData.a + t2 * 0.8; c.position.set(Math.cos(a)*2.8, Math.sin(a)*2.8, Math.sin(a*0.5)*0.5); c.rotation.x += 0.03; } });
    renderer.render(scene, camera);
  })();
})();

// THREE.JS: ABOUT SPHERE
(function sphereScene() {
  const canvas = document.getElementById('aboutSphere');
  if (!canvas || !window.THREE) return;
  const W = canvas.offsetWidth || 520, H = 420;
  const renderer = new THREE.WebGLRenderer({ canvas, alpha: true, antialias: true });
  renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
  renderer.setSize(W, H);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45, W / H, 0.1, 100);
  camera.position.set(0, 0, 7);
  const iGeo = new THREE.IcosahedronGeometry(2.2, 1);
  const ico = new THREE.Mesh(iGeo, new THREE.MeshStandardMaterial({ color: 0x01696f, roughness: 0.35, metalness: 0.55 }));
  scene.add(ico);
  scene.add(new THREE.Mesh(iGeo, new THREE.MeshBasicMaterial({ wireframe: true, color: 0x0c4e54, transparent: true, opacity: 0.25 })));
  scene.add(new THREE.Mesh(new THREE.TorusGeometry(3, 0.03, 8, 80), new THREE.MeshBasicMaterial({ color: 0xa8f0ed, transparent: true, opacity: 0.4 })));
  scene.add(new THREE.AmbientLight(0xffffff, 0.6));
  const dl3 = new THREE.DirectionalLight(0xffffff, 1.2); dl3.position.set(5,5,5); scene.add(dl3);
  (function loop(t) {
    requestAnimationFrame(loop);
    ico.rotation.y = t * 0.0004;
    ico.rotation.x = Math.sin(t * 0.0002) * 0.3;
    renderer.render(scene, camera);
  })(0);
})();