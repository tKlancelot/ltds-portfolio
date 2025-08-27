import * as THREE from 'three';

export function renderThreeScene(selector = '#three-container') {

    const el = typeof selector === 'string' ? document.querySelector(selector) : selector;
    if (!el) return;

    // Renderer transparent
    el.innerHTML = '';
    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    renderer.setClearColor(0x000000, 0); // alpha 0 => fond transparent
    el.appendChild(renderer.domElement);

    // Scene + Camera
    const scene = new THREE.Scene();
    scene.background = null; // important pour la transparence
    const camera = new THREE.PerspectiveCamera(50, 1, 0.1, 100);
    camera.position.set(0, 0, 5);

    // Un peu de lumière pour le relief (facultatif car on est en MeshBasic)
    scene.add(new THREE.AmbientLight(0xffffff, 0.35));
    const dir = new THREE.DirectionalLight(0xffffff, 0.9);
    dir.position.set(3, 4, 5);
    scene.add(dir);

    // Halo blanc “box-shadow” sans composer : plusieurs coquilles Additive
    function makeWhiteGlow(geo,color = 0xffffff, layers = [
        { scale: 1.01, opacity: 0.1 },
        { scale: 1.01, opacity: 0.3 },
    ]) {
        const g = new THREE.Group();
        for (const { scale, opacity } of layers) {
        const mat = new THREE.MeshBasicMaterial({
            color: color,              // halo blanc vif
            transparent: true,
            opacity,
            depthWrite: false,
            side: THREE.BackSide,         // on rend la “coquille” extérieure
            blending: THREE.AdditiveBlending,
        });
        const shell = new THREE.Mesh(geo.clone().scale(scale, scale, scale), mat);
        g.add(shell);
        }
        return g;
    }

    // Objets
    const group = new THREE.Group();
    function createObjects() {
        // CUBE (vert)
        {
            const geo = new THREE.BoxGeometry(1, 1, 1);
    
            const frame = new THREE.LineSegments(
            new THREE.EdgesGeometry(geo),
            new THREE.LineBasicMaterial({ color: 0xE74C3C })
            );
    
            const paint = new THREE.Mesh(
            geo,
            new THREE.MeshBasicMaterial({
                color: 0xE74C3C,
                transparent: true,
                opacity: 0.1,
                depthWrite: false,
                side: THREE.DoubleSide,
            })
            );
    
            const cube = new THREE.Group();
            cube.add(makeWhiteGlow(geo, 0xE74C3C));
            cube.add(paint);
            cube.add(frame);
            cube.position.set(-1.6, -0.1, -0.8);
            cube.rotation.y = Math.PI * 0.2;
            cube.name = 'cube';
            group.add(cube);
        }
    
        // SPHÈRE (bleu)
        {
            const geo = new THREE.SphereGeometry(0.7, 16, 12);
    
            const frame = new THREE.LineSegments(
            new THREE.WireframeGeometry(geo),
            new THREE.LineBasicMaterial({ color: 0x6087FF }) // rgb(96,135,255)
            );
    
            const paint = new THREE.Mesh(
            geo,
            new THREE.MeshBasicMaterial({
                color: 0x6087FF,
                transparent: true,
                opacity: 0.1,
                depthWrite: false,
                side: THREE.DoubleSide,
            })
            );
    
            const sphere = new THREE.Group();
            sphere.add(makeWhiteGlow(geo, 0x6087FF));
            sphere.add(paint);
            sphere.add(frame);
            sphere.position.set(1.6, -0.18, -0.6);
            sphere.name = 'sphere';
            group.add(sphere);
        }
    
        // PYRAMIDE (vert)
        {
            const geo = new THREE.ConeGeometry(1.2, 1.6, 4, 1, true);
    
            const frame = new THREE.LineSegments(
            new THREE.EdgesGeometry(geo),
            new THREE.LineBasicMaterial({ color: 0xFFD02A })
            );
            
    
            const paint = new THREE.Mesh(
            geo,
            new THREE.MeshBasicMaterial({
                color: 0xFFD02A,
                transparent: true,
                opacity: 0.1,
                depthWrite: false,
                side: THREE.DoubleSide,
            })
            );
    
            const pyramid = new THREE.Group();
            pyramid.add(makeWhiteGlow(geo, 0xFFD02A));
            pyramid.add(paint);
            pyramid.add(frame);
            pyramid.rotation.y = Math.PI * 0.25;
            pyramid.position.set(0.0, 0.1, 1);
            pyramid.name = 'pyramid';
            group.add(pyramid);
        }
    
        // Centrer le contenu
        {
            const box = new THREE.Box3().setFromObject(group);
            const c = box.getCenter(new THREE.Vector3());
            group.position.sub(c);
        }
        scene.add(group);
    }

    createObjects();

    // Render helpers
    function render() {
        renderer.render(scene, camera);
    }

    function animate() {
        requestAnimationFrame(animate);

        // rotation très lente (axe Y)
        group.rotation.y += 0.0016; // ajuste la vitesse: 0.001 = très lent, 0.01 = plus rapide

        renderer.render(scene, camera);
    }
    animate();

    function resize() {
        const r = el.getBoundingClientRect();
        const w = Math.max(1, r.width), h = Math.max(1, r.height || 320);
        renderer.setSize(w, h, false);
        camera.aspect = w / h;
        camera.updateProjectionMatrix();
        render();
    }
    new ResizeObserver(resize).observe(el);
    if (!el.style.height && el.clientHeight === 0) el.style.height = '320px';
    resize();

    // Anim "lift" via IntersectionObserver (rejoue à chaque entrée)
    const dy = 2, dur = 1000;
    const io = new IntersectionObserver((entries) => {
        const entry = entries[0];
        if (entry.isIntersecting) {
        const startY = group.position.y - dy;
        group.position.y = startY;
        const t0 = performance.now();
        (function step(now) {
            const t = Math.min(1, (now - t0) / dur);
            const e = 1 - Math.pow(1 - t, 3); // easeOutCubic
            group.position.y = startY + dy * e;
            render();
            if (t < 1) requestAnimationFrame(step);
        })(t0);
        } else {
        io.unobserve(entry.target);
        setTimeout(() => io.observe(entry.target), 0);
        }
    }, { threshold: 0.25 });
    io.observe(el);


}
