(function () {
  var T = window.THREE;
  if (!T) return;
  var reduce = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;

  var black = new T.MeshStandardMaterial({ color: 0x151617, roughness: 0.35, metalness: 0.35 });
  var metal = new T.MeshStandardMaterial({ color: 0xe8e9ea, roughness: 0.3, metalness: 0.7 });

  function lathe(pts, mat) {
    var v = pts.map(function (a) { return new T.Vector2(a[0], a[1]); });
    return new T.Mesh(new T.LatheGeometry(v, 64), mat);
  }
  function cyl(r, h, y, mat) {
    var m = new T.Mesh(new T.CylinderGeometry(r, r, h, 48), mat);
    m.position.y = y;
    return m;
  }
  function labelTex(sub) {
    var c = document.createElement("canvas");
    c.width = 1024; c.height = 256;
    var t = new T.CanvasTexture(c);
    function paint() {
      var x = c.getContext("2d");
      x.fillStyle = "#f2f3f3"; x.fillRect(0, 0, 1024, 256);
      x.fillStyle = "#0c0d0e";
      x.textAlign = "center"; x.textBaseline = "middle";
      [256, 768].forEach(function (cx) {
        x.font = '900 118px "Big Shoulders Display", Impact, sans-serif';
        x.fillText("BRITOS", cx, 92);
        x.fillRect(cx - 170, 158, 80, 4); x.fillRect(cx + 90, 158, 80, 4);
        x.font = '800 22px Montserrat, Arial, sans-serif';
        x.fillText("BARBEARIA", cx, 160);
        x.font = '700 20px Montserrat, Arial, sans-serif';
        x.fillText(sub, cx, 206);
      });
      x.fillRect(0, 0, 1024, 10); x.fillRect(0, 246, 1024, 10);
      t.needsUpdate = true;
    }
    paint();
    if (document.fonts && document.fonts.load) {
      Promise.all([
        document.fonts.load('900 118px "Big Shoulders Display"'),
        document.fonts.load('800 22px Montserrat'),
        document.fonts.load('700 20px Montserrat')
      ]).then(paint, paint);
    }
    return t;
  }
  function label(r, h, y, sub) {
    var m = new T.Mesh(
      new T.CylinderGeometry(r, r, h, 64, 1, true),
      new T.MeshStandardMaterial({ map: labelTex(sub), roughness: 0.6, metalness: 0 })
    );
    m.position.y = y;
    m.rotation.y = -Math.PI / 2;
    return m;
  }
  function spin(t, dt, h, p) {
    h.rotation.y = t * 0.6 + p.x * 0.6;
    h.rotation.x = 0.12 + p.y * 0.2;
  }

  var builders = {
    plaque: function (redraw) {
      var g = new T.Group();
      var w = 2.2, h = 2.6, r = 0.2, x0 = -w / 2, y0 = -h / 2;
      var s = new T.Shape();
      s.moveTo(x0 + r, y0); s.lineTo(x0 + w - r, y0); s.quadraticCurveTo(x0 + w, y0, x0 + w, y0 + r);
      s.lineTo(x0 + w, y0 + h - r); s.quadraticCurveTo(x0 + w, y0 + h, x0 + w - r, y0 + h);
      s.lineTo(x0 + r, y0 + h); s.quadraticCurveTo(x0, y0 + h, x0, y0 + h - r);
      s.lineTo(x0, y0 + r); s.quadraticCurveTo(x0, y0, x0 + r, y0);
      var geo = new T.ExtrudeGeometry(s, { depth: 0.24, bevelEnabled: true, bevelThickness: 0.035, bevelSize: 0.035, bevelSegments: 3 });
      geo.translate(0, 0, -0.12);
      var face = new T.MeshStandardMaterial({ color: 0x17181a, roughness: 0.4, metalness: 0.4 });
      g.add(new T.Mesh(geo, [face, metal]));
      var tex = new T.TextureLoader().load("assets/img/emblema-branco.png", function () { redraw(); });
      var mat = new T.MeshBasicMaterial({ map: tex, transparent: true });
      var front = new T.Mesh(new T.PlaneGeometry(1.6, 1.78), mat);
      front.position.z = 0.16;
      var back = front.clone();
      back.rotation.y = Math.PI; back.position.z = -0.16;
      g.add(front); g.add(back);
      return {
        group: g,
        tick: function (t, dt, hd, p) {
          hd.rotation.y = Math.sin(t * 0.6) * 0.7 + p.x * 0.5;
          hd.rotation.x = p.y * 0.2;
          hd.position.y = Math.sin(t * 1.2) * 0.05;
        }
      };
    },
    jar: function () {
      var g = new T.Group();
      g.add(lathe([[0, 0], [0.95, 0], [1, 0.05], [1, 0.95], [0.98, 1], [0, 1]], black));
      g.add(cyl(1.04, 0.32, 1.16, metal));
      g.add(label(1.008, 0.55, 0.5, "POMADA MATTE"));
      return { group: g, tick: spin };
    },
    oil: function () {
      var g = new T.Group();
      g.add(lathe([[0, 0], [0.58, 0], [0.62, 0.06], [0.62, 1.2], [0.5, 1.5], [0.2, 1.72], [0.2, 2], [0, 2]], black));
      g.add(label(0.625, 0.75, 0.65, "OLEO DE BARBA"));
      g.add(cyl(0.26, 0.3, 2.15, metal));
      var bulb = new T.Mesh(new T.SphereGeometry(0.2, 32, 16), black);
      bulb.scale.y = 1.7; bulb.position.y = 2.5;
      g.add(bulb);
      return { group: g, tick: spin };
    },
    shampoo: function () {
      var g = new T.Group();
      g.add(lathe([[0, 0], [0.7, 0], [0.74, 0.06], [0.74, 1.7], [0.55, 2.1], [0.25, 2.35], [0, 2.35]], black));
      g.add(label(0.745, 1.1, 0.95, "SHAMPOO 3 EM 1"));
      g.add(cyl(0.25, 0.35, 2.5, black));
      g.add(cyl(0.3, 0.5, 2.8, metal));
      var nozzle = new T.Mesh(new T.BoxGeometry(0.5, 0.12, 0.14), metal);
      nozzle.position.set(0.15, 3.12, 0);
      g.add(nozzle);
      return { group: g, tick: spin };
    }
  };

  function mount(canvas, build) {
    var renderer;
    try {
      renderer = new T.WebGLRenderer({ canvas: canvas, antialias: true, alpha: true });
    } catch (e) { return; }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    var scene = new T.Scene();
    var cam = new T.PerspectiveCamera(32, 1, 0.1, 200);
    scene.add(new T.HemisphereLight(0xffffff, 0x444444, 0.9));
    var key = new T.DirectionalLight(0xffffff, 1.1); key.position.set(3, 5, 6); scene.add(key);
    var rim = new T.DirectionalLight(0xffffff, 0.7); rim.position.set(-5, 2, -4); scene.add(rim);

    var model = build(function () { draw(); });
    var holder = new T.Group();
    var box = new T.Box3().setFromObject(model.group);
    var center = box.getCenter(new T.Vector3());
    var sphere = box.getBoundingSphere(new T.Sphere());
    model.group.position.sub(center);
    holder.add(model.group);
    scene.add(holder);

    var p = { x: 0, y: 0, tx: 0, ty: 0 };
    var host = canvas.parentElement;
    if (!reduce) {
      host.addEventListener("pointermove", function (e) {
        var r = host.getBoundingClientRect();
        p.tx = ((e.clientX - r.left) / r.width - 0.5) * 2;
        p.ty = ((e.clientY - r.top) / r.height - 0.5) * 2;
      });
      host.addEventListener("pointerleave", function () { p.tx = 0; p.ty = 0; });
    }

    function draw() {
      model.tick(0, 0, holder, p);
      renderer.render(scene, cam);
    }
    function size() {
      var w = canvas.clientWidth, h = canvas.clientHeight;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      cam.aspect = w / h;
      var vf = cam.fov * Math.PI / 180;
      var tv = Math.tan(vf / 2), th = tv * cam.aspect;
      var d = sphere.radius / Math.sin(Math.atan(Math.min(tv, th))) * 1.02;
      cam.position.set(0, 0, d);
      cam.near = d / 20; cam.far = d * 4;
      cam.updateProjectionMatrix();
      cam.lookAt(0, 0, 0);
      draw();
    }

    var vis = false, last = 0, raf = 0;
    function frame(now) {
      raf = 0;
      if (!vis) return;
      var dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      p.x += (p.tx - p.x) * 0.08;
      p.y += (p.ty - p.y) * 0.08;
      model.tick(now / 1000, dt, holder, p);
      renderer.render(scene, cam);
      raf = requestAnimationFrame(frame);
    }
    if (window.IntersectionObserver) {
      new IntersectionObserver(function (es) {
        vis = es[0].isIntersecting;
        if (vis && !raf && !reduce) { last = performance.now(); raf = requestAnimationFrame(frame); }
      }).observe(canvas);
    }
    if (window.ResizeObserver) new ResizeObserver(size).observe(canvas);
    size();
    if (document.fonts && document.fonts.ready) document.fonts.ready.then(draw);
  }

  var nodes = document.querySelectorAll("canvas[data-model]");
  for (var i = 0; i < nodes.length; i++) {
    var b = builders[nodes[i].getAttribute("data-model")];
    if (b) mount(nodes[i], b);
  }
})();
