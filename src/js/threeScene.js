import * as THREE from 'three';
import { EffectComposer } from 'three/examples/jsm/postprocessing/EffectComposer.js';
import { RenderPass } from 'three/examples/jsm/postprocessing/RenderPass.js';
import { UnrealBloomPass } from 'three/examples/jsm/postprocessing/UnrealBloomPass.js';

export function renderThreeScene(selector = '#three-container') {

    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;

    // 1) Renderer (transparent) + canvas unique
    el.innerHTML = '';
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace; 

    // force transparent background
    renderer.setClearColor(0x000000, 0);
    renderer.setClearAlpha(1);

    el.appendChild(renderer.domElement);

    // 2) Scene + Camera
    const scene = new THREE.Scene();

    scene.background = new THREE.Color(0x000000);
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

        // Composer post-processing
    const composer = new EffectComposer(renderer);
    const renderPass = new RenderPass(scene, camera);
    // renderPass.clear = false;
    composer.addPass(renderPass);

    const bloomPass = new UnrealBloomPass(
        new THREE.Vector2(0.5, 0.5),
        1.8, 0.6, 0.1
    );

    function makeHalo(geo, color) {
        return new THREE.Mesh(
            geo.clone().scale(1.04, 1.04, 1.04),  // un peu plus grand que l’objet
            new THREE.MeshBasicMaterial({
            color,
            transparent: true,
            opacity: 0.6,        // très léger
            depthWrite: false,
            side: THREE.BackSide  // rendu extérieur seulement
            })
        );
    }

    // 3) Objets (wireframe) dans un group
    function createObjects(scene) {
        const group = new THREE.Group();

        // CUBE
        {
            const geo = new THREE.BoxGeometry(1, 1, 1);

            const edges = new THREE.EdgesGeometry(geo);
            const frame = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0x2E9E5B })
            );

            const paint = new THREE.Mesh(
            geo,
            new THREE.MeshBasicMaterial({
                color: 0x2E9E5B,
                transparent: true,
                opacity: 0.15,
                depthWrite: false,
                side: THREE.DoubleSide
            })
            );

            const cube = new THREE.Group();
            cube.add(paint);
            cube.add(frame);
            cube.add(makeHalo(geo, 0x2E9E5B));
            cube.position.set(-1.6, -0.1, -0.2);
            cube.name = 'cube';
            group.add(cube);
        }

        // SPHÈRE
        {
            const geo = new THREE.SphereGeometry(0.7, 16, 12);

            const wire = new THREE.WireframeGeometry(geo);
            const frame = new THREE.LineSegments(
            wire,
            new THREE.LineBasicMaterial({ color: 0x3b82f6 })
            );

            const paint = new THREE.Mesh(
            geo,
            new THREE.MeshBasicMaterial({
                color: 0x3b82f6,
                transparent: true,
                opacity: 0.12,
                depthWrite: false,
                side: THREE.DoubleSide
            })
            );

            const sphere = new THREE.Group();
            sphere.add(paint);
            sphere.add(frame);
            sphere.add(makeHalo(geo, 0x3b82f6));
            sphere.position.set(1.6, -0.18, -0.6);
            sphere.name = 'sphere';
            group.add(sphere);
        }

        // PYRAMIDE
        {
            const geo = new THREE.ConeGeometry(1.2, 1.7, 4, 1, true);

            const edges = new THREE.EdgesGeometry(geo);
            const frame = new THREE.LineSegments(
            edges,
            new THREE.LineBasicMaterial({ color: 0xE74C3C })
            );

            const paint = new THREE.Mesh(
            geo,
            new THREE.MeshBasicMaterial({
                color: 0xE74C3C,
                transparent: true,
                opacity: 0.12,
                depthWrite: false,
                side: THREE.DoubleSide
            })
            );

            const pyramid = new THREE.Group();
            pyramid.add(paint);
            pyramid.add(frame);
            pyramid.add(makeHalo(geo, 0xE74C3C));
            pyramid.rotation.y = Math.PI * 0.25;
            pyramid.position.set(0.0, 0.1, 0.6);
            pyramid.name = 'pyramid';
            group.add(pyramid);
        }

        // centre tout le group
        const box = new THREE.Box3().setFromObject(group);
        const c = box.getCenter(new THREE.Vector3());
        group.position.sub(c);

        scene.add(group);
        return group;
    }

    const group = createObjects(scene);

    // 4) Centrer le contenu sur l’origine (6 lignes, no magic)
    {
        const box = new THREE.Box3().setFromObject(group);
        const c = box.getCenter(new THREE.Vector3());
        group.position.sub(c);
    }

    composer.addPass(bloomPass);
    // addLights(scene);

    // 5) Render util
    const render = () => {
        composer.render();
    };



    // 6) Resize
    const resize = () => {
        const r = el.getBoundingClientRect();
        const w = Math.max(1, r.width), h = Math.max(1, r.height || 320);
        renderer.setSize(w, h, false);
        composer.setSize(w, h);      // <- important pour garder le bon alpha
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        render();
    };

    new ResizeObserver(resize).observe(el);
    if (!el.style.height && el.clientHeight === 0) el.style.height = '320px';
    resize();

    // 7) Anim "lift" à chaque entrée
    const dy = 2;
    const dur = 1000;

    const io = new IntersectionObserver((entries) => {
    const entry = entries[0];

    // Quand on entre -> rejoue l'anim
    if (entry.isIntersecting) {
        const startY = group.position.y - dy; // toujours repartir un peu plus bas
        group.position.y = startY;
        const t0 = performance.now();

        function step(now) {
        const t = Math.min(1, (now - t0) / dur);
        const e = 1 - Math.pow(1 - t, 3); // easing cubic
        group.position.y = startY + dy * e;
        render();
        if (t < 1) requestAnimationFrame(step);
        }

        requestAnimationFrame(step);
    }

    // Quand on sort -> on unobserve puis re-observe pour rejouer au prochain retour
    if (!entry.isIntersecting) {
        io.unobserve(entry.target);
        // petit hack: réobserve immédiatement pour réactiver la détection
        setTimeout(() => io.observe(entry.target), 0);
    }
    }, { threshold: 0.25 });

    io.observe(el);

    // rendu initial
    render();
}

