import Splide from '@splidejs/splide';
import '@splidejs/splide/css'; // optionnel si tu veux le CSS par défaut
import { cards } from '../datas/cards-data.js';
import { applyPageGradient } from '../utils/uiUtils.js';
import * as THREE from 'three';

export default async function initHomePage(params) {

    console.log('🏠 Script home.js chargé avec params:', params);


    // Initialisation du carousel Splide
    const carousel = document.querySelector('.splide');
    if (carousel) {
        try {
            const splide = new Splide(carousel, {
                type: 'fade',
                autoplay: false,
                wheel: false,
                speed: 400,
                arrows: false,
                rewind: true,
                interval: 6000,
                perPage: 1
            });
            splide.mount();
            console.log('✅ Splide monté avec succès');
        } catch (error) {
            console.error('❌ Erreur lors du montage de Splide:', error);
        }
    } else {
        console.warn('⚠️ Élément .splide introuvable : le carousel ne sera pas monté');
    }

    const grid = document.querySelector('.ltds-card-grid');

    const shuffleCards = () => {
        // melanger toutes les cartes at random 
        const children = Array.from(grid.children);
        children.sort(() => Math.random() - 0.5);
        grid.innerHTML = '';
        children.forEach(child => grid.appendChild(child));
    }


    cards.forEach(({ title, subtitle, content, extraClass, href, categ }) => {
        const el = document.createElement('ltds-card');
        if (title) el.setAttribute('title', title);
        if (subtitle) el.setAttribute('subtitle', subtitle);
        if (content) el.setAttribute('content', content);
        if (extraClass) el.setAttribute('extra-class', extraClass);
        if (categ) el.setAttribute('extra-class', 'ltds-card--' + categ);
        if (href) el.setAttribute('href', href);
        grid.appendChild(el);
        shuffleCards();
    });



    // copy npm button 
    let btn = document.querySelector('#copy-npm');
    if (btn) {
        btn.addEventListener('click', () => {
            let span = btn.querySelector('span');
            navigator.clipboard.writeText('npm i @tarik-leviathan/ltds');
            span.textContent = 'Copied !';
            setTimeout(() => {
                span.textContent = 'npm i @tarik-leviathan/ltds';
            }, 2000);
        });
    }


    /* ----------------------------- Utils sizing ----------------------------- */
function ensureContainerHeight(container, fallback = 320) {
  const hasHeight =
    container.clientHeight > 0 ||
    parseFloat(getComputedStyle(container).height) > 0 ||
    getComputedStyle(container).aspectRatio !== 'auto';
  if (!hasHeight) container.style.height = `${fallback}px`;
}

function getContainerSize(container) {
  const cs = getComputedStyle(container);
  const w = container.clientWidth || parseFloat(cs.width) || 300;
  const h = container.clientHeight || parseFloat(cs.height) || 320;
  return { w: Math.max(1, Math.floor(w)), h: Math.max(1, Math.floor(h)) };
}

/* ------------------------------ Renderer -------------------------------- */
function createRenderer(container) {
  container.querySelectorAll('canvas').forEach((c) => c.remove());
  const { w, h } = getContainerSize(container);
  const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
  renderer.outputColorSpace = THREE.SRGBColorSpace;
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  renderer.setSize(w, h);
  renderer.domElement.classList.add('three');
  container.appendChild(renderer.domElement);
  return { renderer, size: { w, h } };
}

/* -------------------------- Scene + Camera ------------------------------ */
function createSceneAndCamera(size) {
  const scene = new THREE.Scene();
  scene.background = null; // <- pas de fond

  const camera = new THREE.PerspectiveCamera(60, size.w / size.h, 0.1, 100);
  camera.position.set(0, 0, 12);
  camera.lookAt(0, 0, 0);
  return { scene, camera };
}

/* -------------------------------- Lights -------------------------------- */
function addLights(scene) {
  // facultatif pour les lignes (elles ne prennent pas la lumière), on laisse soft
  scene.add(new THREE.AmbientLight(0xffffff, 0.35));
}

/* ----------------------- Center + Camera fitting ------------------------ */
function centerGroupAtOrigin(group) {
  group.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(group);
  const center = new THREE.Vector3();
  box.getCenter(center);
  group.position.sub(center);
  group.updateWorldMatrix(true, true);
}

function fitCameraToObject(camera, object3D, offset = 2) {
  object3D.updateWorldMatrix(true, true);
  const box = new THREE.Box3().setFromObject(object3D);
  const size = box.getSize(new THREE.Vector3());
  const center = box.getCenter(new THREE.Vector3());

  // aligne la caméra sur le centre
  camera.position.set(center.x, center.y, camera.position.z);
  camera.lookAt(center);

  // distance pour encadrer verticalement
  const halfY = size.y * 0.5;
  const fov = THREE.MathUtils.degToRad(camera.fov);
  const dist = (halfY / Math.tan(fov / 2)) * offset;

  camera.position.set(center.x, center.y, center.z + dist);

  const halfDiag = size.length() * 0.5;
  camera.near = Math.max(0.01, dist - halfDiag * 2);
  camera.far = dist + halfDiag * 2;
  camera.updateProjectionMatrix();
}

/* ------------------------- Scaling vs container ------------------------- */
/** Met le group à l’échelle relative à la largeur du conteneur.
 *  - baseWidth = 400px → échelle 1
 *  - si container fait 300px → échelle = 300/400 = 0.75
 *  - au-dessus de 400px, on garde 1 pour éviter d’agrandir (adapte si tu veux)
 */
function scaleGroupToContainer(container, group, baseWidth = 400) {
  const w = getContainerSize(container).w;
  const s = Math.min(1, w / baseWidth);
  group.scale.set(s, s, s);
  group.updateWorldMatrix(true, true);
}

/* ---------------------------- Create objects ---------------------------- */
function createObjects(scene) {
  const group = new THREE.Group();

  // cube (gauche, 2e plan, un peu plus bas)
  {
    const geo = new THREE.BoxGeometry(0.4, 0.4, 0.4);
    const edges = new THREE.EdgesGeometry(geo);
    const cube = new THREE.LineSegments(
      edges,
      new THREE.LineBasicMaterial({ color: 0xef4444 })
    );
    cube.position.set(-0.5, 0, -0.1);
    group.add(cube);
  }

  // sphère (droite, 3e plan, un peu plus bas)
  {
    const geo = new THREE.SphereGeometry(0.25, 12, 12);
    const wire = new THREE.WireframeGeometry(geo);
    const sphere = new THREE.LineSegments(
      wire,
      new THREE.LineBasicMaterial({ color: 0x3b82f6 })
    );
    sphere.position.set(0.5, 0, -0.1);
    group.add(sphere);
  }

  // pyramide (centre, plus haut, devant)
  {
    const geo = new THREE.ConeGeometry(0.5, 0.6, 4);
    const edges = new THREE.EdgesGeometry(geo);
    const pyramid = new THREE.LineSegments(
      edges,
      new THREE.MeshBasicMaterial({ color: 0x22c55e })
    );
    pyramid.rotation.y = Math.PI * 0.25;
    pyramid.position.set(0.0, 0, 0);
    group.add(pyramid);
  }

  centerGroupAtOrigin(group);
  scene.add(group);
  return group;
}

/* ------------------------------- Render --------------------------------- */
function renderOnce(renderer, scene, camera) {
  renderer.render(scene, camera);
}

/* --------------------------- Resize handling ---------------------------- */
function setupResizeObserver(container, renderer, camera, scene, group) {
  const ro = new ResizeObserver(() => {
    const { w, h } = getContainerSize(container);
    renderer.setSize(w, h);
    camera.aspect = w / h;

    // re-scale selon container et refit caméra
    scaleGroupToContainer(container, group, 400);
    fitCameraToObject(camera, group, 2);

    renderer.render(scene, camera);
  });
  ro.observe(container);
  return ro;
}

/* --------------------------------- Init --------------------------------- */
function renderThreeCard(selector = '#three-container') {
  const container = document.querySelector(selector);
  if (!container) return () => {};

  ensureContainerHeight(container);

  const { renderer, size } = createRenderer(container);
  const { scene, camera } = createSceneAndCamera(size);

  addLights(scene);
  const group = createObjects(scene);

  // échelle initiale vs largeur du conteneur + cadrage caméra
  scaleGroupToContainer(container, group, 400);
  fitCameraToObject(camera, group, 1.15);

  renderOnce(renderer, scene, camera);

  const ro = setupResizeObserver(container, renderer, camera, scene, group);

  return () => {
    ro.disconnect();
    renderer.dispose();
    while (container.firstChild) container.removeChild(container.firstChild);
  };
}

// Appel direct
renderThreeCard('#three-container');

}