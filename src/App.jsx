import { useEffect, useRef, useState } from "react";
import * as THREE from "three";
import { Mail, ArrowUpRight, Box, Layers, Sparkles } from "lucide-react";

export default function App() {
  const canvasRef = useRef(null);
  const [time, setTime] = useState("");

  // Live clock
  useEffect(() => {
    const update = () => {
      const now = new Date();
      const h = String(now.getHours()).padStart(2, "0");
      const m = String(now.getMinutes()).padStart(2, "0");
      setTime(`${h}:${m} JST`);
    };
    update();
    const id = setInterval(update, 1000);
    return () => clearInterval(id);
  }, []);

  // Three.js scene
  useEffect(() => {
    if (!canvasRef.current) return;

    const canvas = canvasRef.current;
    const scene = new THREE.Scene();
    scene.fog = new THREE.Fog(0x0a0a0a, 5, 15);

    const camera = new THREE.PerspectiveCamera(
      50,
      canvas.clientWidth / canvas.clientHeight,
      0.1,
      100
    );
    camera.position.set(0, 0, 6);

    const renderer = new THREE.WebGLRenderer({ canvas, antialias: true, alpha: true });
    renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));

    // Wireframe icosahedron - represents 3D/XR
    const geometry = new THREE.IcosahedronGeometry(1.8, 1);
    const material = new THREE.MeshBasicMaterial({
      color: 0xffffff,
      wireframe: true,
      transparent: true,
      opacity: 0.4,
    });
    const shape = new THREE.Mesh(geometry, material);
    scene.add(shape);

    // Inner glowing core
    const coreGeo = new THREE.IcosahedronGeometry(0.6, 0);
    const coreMat = new THREE.MeshBasicMaterial({
      color: 0xff5722,
      wireframe: true,
    });
    const core = new THREE.Mesh(coreGeo, coreMat);
    scene.add(core);

    // Particles
    const particleGeo = new THREE.BufferGeometry();
    const count = 200;
    const positions = new Float32Array(count * 3);
    for (let i = 0; i < count * 3; i++) {
      positions[i] = (Math.random() - 0.5) * 12;
    }
    particleGeo.setAttribute("position", new THREE.BufferAttribute(positions, 3));
    const particleMat = new THREE.PointsMaterial({
      color: 0xffffff,
      size: 0.02,
      transparent: true,
      opacity: 0.6,
    });
    const particles = new THREE.Points(particleGeo, particleMat);
    scene.add(particles);

    // Mouse interaction
    let mouseX = 0;
    let mouseY = 0;
    const onMouseMove = (e) => {
      const rect = canvas.getBoundingClientRect();
      mouseX = ((e.clientX - rect.left) / rect.width - 0.5) * 2;
      mouseY = ((e.clientY - rect.top) / rect.height - 0.5) * 2;
    };
    canvas.addEventListener("mousemove", onMouseMove);

    // Resize handler
    const onResize = () => {
      camera.aspect = canvas.clientWidth / canvas.clientHeight;
      camera.updateProjectionMatrix();
      renderer.setSize(canvas.clientWidth, canvas.clientHeight);
    };
    window.addEventListener("resize", onResize);

    // Animation loop
    let frameId;
    const animate = () => {
      shape.rotation.x += 0.002;
      shape.rotation.y += 0.003;
      core.rotation.x -= 0.005;
      core.rotation.y -= 0.007;
      particles.rotation.y += 0.0005;

      // Subtle camera follow
      camera.position.x += (mouseX * 0.5 - camera.position.x) * 0.05;
      camera.position.y += (-mouseY * 0.5 - camera.position.y) * 0.05;
      camera.lookAt(0, 0, 0);

      renderer.render(scene, camera);
      frameId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(frameId);
      canvas.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("resize", onResize);
      geometry.dispose();
      material.dispose();
      coreGeo.dispose();
      coreMat.dispose();
      particleGeo.dispose();
      particleMat.dispose();
      renderer.dispose();
    };
  }, []);

  const projects = [
    {
      no: "01",
      title: "HELP.AR",
      type: "Unity / AR Foundation",
      desc: "身近な機械の操作を直感的に支援するモバイルARアプリ。物体認識とUXの両立をテーマに開発中。",
      tag: "UNITY",
      icon: Sparkles,
    },
    {
      no: "02",
      title: "3D Portfolio",
      type: "React / Three.js",
      desc: "このサイト。XRエンジニアとしての玄関として、サイト自体を3Dインタラクティブに設計。",
      tag: "WEB",
      icon: Layers,
    },
    {
      no: "03",
      title: "Coming Soon",
      type: "Unity / WebXR",
      desc: "次の作品を企画中。AR/XR技術の発展的な応用に挑戦予定。",
      tag: "UNITY",
      icon: Box,
    },
  ];

  const skills = {
    "XR / 3D": ["Three.js", "Unity(学習中)", "AR Foundation(学習中)"],
    Languages: ["Python", "Java", "C", "JavaScript"],
    Web: ["React", "Tailwind CSS", "Vite"],
    Tools: ["Git", "GitHub", "VS Code"],
  };

  return (
    <div className="min-h-screen bg-neutral-950 text-neutral-100" style={{ fontFamily: "Georgia, 'Times New Roman', serif" }}>
      {/* Top Bar */}
      <header className="border-b border-neutral-800 px-6 py-4 flex justify-between items-center text-[10px] uppercase tracking-[0.3em]" style={{ fontFamily: "'Courier New', monospace" }}>
        <span className="text-neutral-500">Portfolio / 2026</span>
        <span className="text-neutral-500 hidden sm:block">XR Engineer</span>
        <span className="text-neutral-400">{time}</span>
      </header>

      {/* Hero with 3D canvas */}
      <section className="relative border-b border-neutral-800 overflow-hidden">
        <div className="absolute inset-0 z-0">
          <canvas ref={canvasRef} className="w-full h-full" />
        </div>

        <div className="relative z-10 px-6 md:px-12 py-24 md:py-40 max-w-6xl mx-auto pointer-events-none">
          <p className="text-[10px] uppercase tracking-[0.4em] mb-8 text-orange-400" style={{ fontFamily: "'Courier New', monospace" }}>
            ◉ XR · AR · Spatial Computing
          </p>
          <h1 className="text-5xl md:text-8xl leading-[0.95] font-light tracking-tight">
            Designing<br />
            <em className="italic font-normal text-orange-400">spatial</em> experiences<br />
            for the next web.
          </h1>
          <div className="mt-12 max-w-xl text-neutral-300 text-lg leading-relaxed">
            芝浦工業大学 情報工学コース 卜部颯斗です。
            AR/XR技術を研究テーマに、スマホARからARグラスまで、
            空間に情報を編み込むアプリケーションを開発しています。
          </div>
          <div className="mt-10 flex gap-4 flex-wrap pointer-events-auto">
            <a href="#projects" className="bg-orange-500 text-neutral-950 px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-orange-400 transition inline-flex items-center gap-2" style={{ fontFamily: "'Courier New', monospace" }}>
              View Work <ArrowUpRight size={14} />
            </a>
            <a href="#contact" className="border border-neutral-600 px-6 py-3 text-xs uppercase tracking-[0.3em] hover:bg-neutral-100 hover:text-neutral-950 hover:border-neutral-100 transition" style={{ fontFamily: "'Courier New', monospace" }}>
              Contact
            </a>
          </div>
          <p className="mt-16 text-xs text-neutral-500 italic">
            ↑ マウスを動かしてみてください
          </p>
        </div>
      </section>

      {/* Projects */}
      <section id="projects" className="px-6 md:px-12 py-20 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto">
          <div className="flex items-baseline justify-between mb-16">
            <h2 className="text-3xl md:text-5xl font-light italic">Selected Work</h2>
            <span className="text-[10px] uppercase tracking-[0.3em] text-neutral-500" style={{ fontFamily: "'Courier New', monospace" }}>
              {projects.length} Projects
            </span>
          </div>
          <div className="border-t border-neutral-800">
            {projects.map((p) => {
              const Icon = p.icon;
              return (
                <div key={p.no} className="border-b border-neutral-800 px-2 md:px-4 py-10 grid grid-cols-12 gap-4 group hover:bg-neutral-900 transition cursor-pointer">
                  <div className="col-span-2 md:col-span-1 text-sm text-neutral-500" style={{ fontFamily: "'Courier New', monospace" }}>
                    {p.no}
                  </div>
                  <div className="col-span-10 md:col-span-5">
                    <div className="flex items-center gap-3 mb-2">
                      <Icon size={18} className="text-orange-400" />
                      <h3 className="text-2xl md:text-3xl">{p.title}</h3>
                      <span className="text-[10px] px-2 py-0.5 border border-neutral-700 text-neutral-400" style={{ fontFamily: "'Courier New', monospace" }}>
                        {p.tag}
                      </span>
                    </div>
                    <p className="text-[10px] uppercase tracking-[0.3em] text-neutral-500" style={{ fontFamily: "'Courier New', monospace" }}>
                      {p.type}
                    </p>
                  </div>
                  <div className="col-span-12 md:col-span-5 text-neutral-300 text-sm leading-relaxed">
                    {p.desc}
                  </div>
                  <div className="col-span-12 md:col-span-1 flex md:justify-end items-start">
                    <ArrowUpRight size={20} className="group-hover:rotate-45 group-hover:text-orange-400 transition" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Skills */}
      <section className="px-6 md:px-12 py-20 border-b border-neutral-800">
        <div className="max-w-6xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-light italic mb-16">Toolbox</h2>
          <div className="grid md:grid-cols-4 gap-8">
            {Object.entries(skills).map(([cat, items]) => (
              <div key={cat}>
                <h3 className="text-[10px] uppercase tracking-[0.3em] mb-4 pb-2 border-b border-neutral-700 text-orange-400" style={{ fontFamily: "'Courier New', monospace" }}>
                  {cat}
                </h3>
                <ul className="space-y-2">
                  {items.map((s) => (
                    <li key={s} className="text-lg text-neutral-200">{s}</li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Contact */}
      <section id="contact" className="px-6 md:px-12 py-20 md:py-32 bg-neutral-100 text-neutral-950">
        <div className="max-w-6xl mx-auto">
          <p className="text-[10px] uppercase tracking-[0.4em] mb-6 text-neutral-500" style={{ fontFamily: "'Courier New', monospace" }}>
            ◉ Let's Build Together
          </p>
          <h2 className="text-4xl md:text-7xl font-light italic mb-12">
            空間を編む仕事、<br />一緒にしませんか。
          </h2>
          <div className="flex flex-col md:flex-row gap-6 md:gap-12">
            <a href="mailto:al24007@shibaura-it.ac.jp" className="flex items-center gap-3 text-lg hover:text-orange-500 transition group">
              <Mail size={20} />
              al24007@shibaura-it.ac.jp
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition" />
            </a>
            <a href="https://github.com/ka1se1" className="flex items-center gap-3 text-lg hover:text-orange-500 transition group">
              github.com/ka1se1
              <ArrowUpRight size={16} className="group-hover:rotate-45 transition" />
            </a>
          </div>
        </div>
      </section>

      <footer className="px-6 py-6 text-[10px] uppercase tracking-[0.3em] flex justify-between bg-neutral-950 text-neutral-600 border-t border-neutral-800" style={{ fontFamily: "'Courier New', monospace" }}>
        <span>Built with Three.js</span>
        <span>2026 ◉</span>
      </footer>
    </div>
  );
}
