/* ============ NAVBAR ============ */
const navbar = document.getElementById('navbar');
window.addEventListener('scroll', () => navbar.classList.toggle('scrolled', scrollY > 40));
const burger = document.getElementById('burger');
const navLinks = document.getElementById('navLinks');
burger.addEventListener('click', () => navLinks.classList.toggle('open'));

/* ============ TYPED ANIMATION ============ */
const words = ['experiences','brands','products','startups','futures'];
let wi = 0, ci = 0, del = false;
const tel = document.getElementById('typedText');
function type() {
  const w = words[wi];
  if (!del) { tel.textContent = w.slice(0,++ci); if (ci===w.length){del=true;return setTimeout(type,1800);} }
  else { tel.textContent = w.slice(0,--ci); if (ci===0){del=false;wi=(wi+1)%words.length;} }
  setTimeout(type, del?60:110);
}
type();

/* ============ COUNTER ANIMATION ============ */
const counters = [{el:'c1',target:200},{el:'c2',target:98},{el:'c3',target:15}];
const cObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{
    if(!e.isIntersecting) return;
    const {target,el} = counters.find(c=>c.el===e.target.id)||{};
    if(!target) return;
    let s=null;
    const step=ts=>{ if(!s)s=ts; const p=Math.min((ts-s)/1600,1); document.getElementById(el).textContent=Math.floor(p*target); if(p<1)requestAnimationFrame(step); };
    requestAnimationFrame(step);
    cObs.unobserve(e.target);
  });
},{threshold:.5});
counters.forEach(c=>{ const el=document.getElementById(c.el); if(el) cObs.observe(el); });

/* ============ SCROLL REVEAL ============ */
const revealObs = new IntersectionObserver(entries=>{
  entries.forEach(e=>{ if(e.isIntersecting){ e.target.classList.add('visible'); revealObs.unobserve(e.target); } });
},{threshold:.1});
document.querySelectorAll('.reveal').forEach(el=>revealObs.observe(el));

/* ============ CONTACT FORM ============ */
const form = document.getElementById('contactForm');
if(form) form.addEventListener('submit',e=>{
  e.preventDefault();
  const btn=form.querySelector('button[type="submit"]');
  btn.textContent='Sent! We\'ll be in touch soon.';
  btn.style.background='#10b981';
  setTimeout(()=>{btn.innerHTML='Send Message <i class="fa-solid fa-paper-plane"></i>';btn.style.background='';},3500);
});

/* ============ THREE.JS — HERO 3D: SHAPES + EYE CENTER ============ */
(function initHero3D(){
  const canvas = document.getElementById('threeHero');
  if(!canvas || typeof THREE==='undefined') return;
  const w = canvas.parentElement.clientWidth;
  const h = canvas.parentElement.clientHeight || 480;
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setSize(w,h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setClearColor(0x000000,0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(45,w/h,0.1,100);
  camera.position.set(0,0,8);

  // Lights
  scene.add(new THREE.AmbientLight(0xffffff,0.8));
  const dl = new THREE.DirectionalLight(0xffffff,1.4); dl.position.set(5,8,5); scene.add(dl);
  const dl2 = new THREE.DirectionalLight(0x5b5ef4,0.8); dl2.position.set(-5,-3,2); scene.add(dl2);
  const dl3 = new THREE.DirectionalLight(0xf43f5e,0.4); dl3.position.set(3,-5,-3); scene.add(dl3);

  // Floating shapes
  const shapes = [];
  const geometries = [
    new THREE.BoxGeometry(0.8,0.8,0.8),
    new THREE.OctahedronGeometry(0.5),
    new THREE.TetrahedronGeometry(0.55),
    new THREE.BoxGeometry(0.5,0.5,0.5),
    new THREE.OctahedronGeometry(0.38),
    new THREE.BoxGeometry(0.6,0.6,0.6),
    new THREE.TetrahedronGeometry(0.42),
    new THREE.OctahedronGeometry(0.45),
  ];
  const colors = [0x5b5ef4,0x8b8ef8,0xf43f5e,0x10b981,0x5b5ef4,0xa5b4fc,0xf43f5e,0x34d399];
  const positions = [
    [2.5,1.2,0],[1,-1.5,1],[-1.5,1.8,-1],[3,-0.5,-2],
    [-2.5,-1,0],[0.5,2.5,-1.5],[-1,0.5,1.5],[2,-2,0.5]
  ];
  geometries.forEach((geo,i)=>{
    const mat = new THREE.MeshPhongMaterial({color:colors[i],transparent:true,opacity:0.82,shininess:80});
    const mesh = new THREE.Mesh(geo,mat);
    mesh.position.set(...positions[i]);
    mesh.rotation.set(Math.random()*Math.PI,Math.random()*Math.PI,0);
    scene.add(mesh);
    shapes.push({
      mesh,
      speed:{x:(Math.random()-.5)*.006, y:(Math.random()-.5)*.006},
      float:{offset:Math.random()*Math.PI*2, amp:.15+Math.random()*.1}
    });
  });

  // Load Eye GLB at center — sirf float, no rotation
  let eyeModel = null;
  let eyeBaseY = 0;
  const eyeFloatOffset = Math.random() * Math.PI * 2;
  const LoaderClass = (typeof GLTFLoader!=='undefined') ? GLTFLoader
                    : (typeof THREE.GLTFLoader!=='undefined') ? THREE.GLTFLoader
                    : null;
  if(LoaderClass){
    const loader = new LoaderClass();
    loader.load('./assets/3d/blue_eyeball_free.glb', function(gltf){
      eyeModel = gltf.scene;
      const box = new THREE.Box3().setFromObject(eyeModel);
      const size = new THREE.Vector3(); box.getSize(size);
      const scale = 2.2 / Math.max(size.x, size.y, size.z);
      eyeModel.scale.setScalar(scale);
      const center = new THREE.Vector3(); box.getCenter(center);
      eyeModel.position.copy(center.multiplyScalar(-scale));
      eyeBaseY = eyeModel.position.y;
      scene.add(eyeModel);
      console.log('%c Eye loaded in hero!', 'color:#5b5ef4;font-weight:bold');
    }, undefined, err=>console.warn('GLB load error:', err));
  }

  let mx=0, my=0;
  window.addEventListener('mousemove',e=>{
    mx=(e.clientX/window.innerWidth-.5)*.6;
    my=(e.clientY/window.innerHeight-.5)*.6;
  });

  const clock = new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    const t = clock.getElapsedTime();
    shapes.forEach(s=>{
      s.mesh.rotation.x += s.speed.x;
      s.mesh.rotation.y += s.speed.y;
      s.mesh.position.y += Math.sin(t+s.float.offset)*0.002*s.float.amp*5;
    });
    // Eye: sirf upar neeche float — bilkul shapes jaise, no rotation
    if(eyeModel){
      eyeModel.position.y = eyeBaseY + Math.sin(t + eyeFloatOffset) * 0.15;
    }
    camera.position.x += (mx - camera.position.x)*0.04;
    camera.position.y += (-my - camera.position.y)*0.04;
    renderer.render(scene,camera);
  }
  animate();

  window.addEventListener('resize',()=>{
    const nw=canvas.parentElement.clientWidth, nh=canvas.parentElement.clientHeight||480;
    camera.aspect=nw/nh; camera.updateProjectionMatrix();
    renderer.setSize(nw,nh);
  });
})();

/* ============ THREE.JS — TECH SECTION: PARTICLES + TORUS ============ */
(function initTech3D(){
  const canvas = document.getElementById('techCanvas');
  if(!canvas || typeof THREE==='undefined') return;
  const w = canvas.parentElement.clientWidth, h = 460;
  const renderer = new THREE.WebGLRenderer({canvas, alpha:true, antialias:true});
  renderer.setSize(w,h);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio,2));
  renderer.setClearColor(0x000000,0);
  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera(60,w/h,0.1,200);
  camera.position.set(0,0,30);

  const count=280;
  const pos=new Float32Array(count*3);
  for(let i=0;i<count;i++){
    const theta=Math.acos(2*Math.random()-1), phi=2*Math.PI*Math.random(), r=8+Math.random()*6;
    pos[i*3]=r*Math.sin(theta)*Math.cos(phi);
    pos[i*3+1]=r*Math.sin(theta)*Math.sin(phi);
    pos[i*3+2]=r*Math.cos(theta);
  }
  const pGeo=new THREE.BufferGeometry();
  pGeo.setAttribute('position',new THREE.BufferAttribute(pos,3));
  const points=new THREE.Points(pGeo,new THREE.PointsMaterial({color:0x5b5ef4,size:0.18,transparent:true,opacity:0.7}));
  scene.add(points);

  const torus=new THREE.Mesh(new THREE.TorusGeometry(10,0.05,8,80),new THREE.MeshBasicMaterial({color:0x5b5ef4,wireframe:true,opacity:.15,transparent:true})); scene.add(torus);
  const torus2=new THREE.Mesh(new THREE.TorusGeometry(12,0.04,8,80),new THREE.MeshBasicMaterial({color:0xf43f5e,wireframe:true,opacity:.1,transparent:true})); torus2.rotation.x=Math.PI/3; scene.add(torus2);

  let mx=0;
  window.addEventListener('mousemove',e=>{ mx=(e.clientX/window.innerWidth-.5); });
  const clock2=new THREE.Clock();
  function animate(){
    requestAnimationFrame(animate);
    const t=clock2.getElapsedTime();
    points.rotation.y=t*0.07+mx*0.3; points.rotation.x=t*0.04;
    torus.rotation.z=t*0.05; torus2.rotation.y=t*0.06;
    renderer.render(scene,camera);
  }
  animate();
  window.addEventListener('resize',()=>{ const nw=canvas.parentElement.clientWidth; camera.aspect=nw/h; camera.updateProjectionMatrix(); renderer.setSize(nw,h); });
})();
