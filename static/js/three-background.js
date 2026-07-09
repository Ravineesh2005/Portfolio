(function() {
  const container = document.getElementById('threejs-container');
  if (!container) return;

  const width  = container.clientWidth  || window.innerWidth;
  const height = container.clientHeight || window.innerHeight;

  const scene    = new THREE.Scene();
  const camera   = new THREE.PerspectiveCamera(60, width / height, 0.1, 1000);
  camera.position.z = 1;

  const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
  renderer.setSize(width, height);
  renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
  container.appendChild(renderer.domElement);

  // ── STAR LAYERS (far, mid, near for parallax depth) ──────────────────────
  function makeStarLayer(count, size, speed, spread) {
    const geo = new THREE.BufferGeometry();
    const pos = new Float32Array(count * 3);
    const vel = new Float32Array(count);      // individual y-drift speed

    for (let i = 0; i < count; i++) {
      pos[i * 3]     = (Math.random() - 0.5) * spread;   // x
      pos[i * 3 + 1] = (Math.random() - 0.5) * spread;   // y
      pos[i * 3 + 2] = (Math.random() - 0.5) * spread;   // z
      vel[i] = speed + (Math.random() - 0.5) * speed * 0.4;
    }

    geo.setAttribute('position', new THREE.BufferAttribute(pos, 3));

    const mat = new THREE.PointsMaterial({
      size,
      color: new THREE.Color(0xffffff),
      transparent: true,
      opacity: size > 0.06 ? 0.9 : 0.55,
      sizeAttenuation: true
    });

    const pts = new THREE.Points(geo, mat);
    pts.userData = { vel, count, spread };
    scene.add(pts);
    return pts;
  }

  // Three depth layers: far (tiny, slow), mid, near (big, fast)
  const farStars  = makeStarLayer(800,  0.025, 0.003, 30);
  const midStars  = makeStarLayer(400,  0.055, 0.008, 20);
  const nearStars = makeStarLayer(150,  0.10,  0.018, 14);

  // A handful of cyan tinted "accent" stars
  const accentGeo = new THREE.BufferGeometry();
  const accentPos = new Float32Array(60 * 3);
  for (let i = 0; i < 60; i++) {
    accentPos[i * 3]     = (Math.random() - 0.5) * 25;
    accentPos[i * 3 + 1] = (Math.random() - 0.5) * 25;
    accentPos[i * 3 + 2] = (Math.random() - 0.5) * 25;
  }
  accentGeo.setAttribute('position', new THREE.BufferAttribute(accentPos, 3));
  const accentMat = new THREE.PointsMaterial({
    size: 0.08,
    color: new THREE.Color(0x00e8ff),
    transparent: true,
    opacity: 0.7,
    sizeAttenuation: true
  });
  const accentStars = new THREE.Points(accentGeo, accentMat);
  scene.add(accentStars);

  // ── ANIMATE ───────────────────────────────────────────────────────────────
  function driftLayer(layer) {
    const pos  = layer.geometry.attributes.position;
    const { vel, count, spread } = layer.userData;
    const half = spread / 2;

    for (let i = 0; i < count; i++) {
      // drift upward (stars "rising" past camera — night sky in motion)
      pos.array[i * 3 + 1] += vel[i];
      // wrap around when star drifts off the top
      if (pos.array[i * 3 + 1] > half) {
        pos.array[i * 3 + 1] = -half;
      }
    }
    pos.needsUpdate = true;
  }

  function animate() {
    requestAnimationFrame(animate);

    driftLayer(farStars);
    driftLayer(midStars);
    driftLayer(nearStars);

    // slow lateral drift for accent stars (twinkle feel)
    const t = Date.now() * 0.0003;
    accentStars.rotation.y = Math.sin(t) * 0.04;
    accentStars.rotation.x = Math.cos(t * 0.7) * 0.02;

    renderer.render(scene, camera);
  }

  window.addEventListener('resize', () => {
    const w = container.clientWidth || window.innerWidth;
    const h = container.clientHeight || window.innerHeight;
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.setSize(w, h);
  });

  animate();
})();
