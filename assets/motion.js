/* Sovereign Music Australia · motion and interaction.
   Three jobs: the hero particle waveform, scroll reveals, and choose-your-path branching.
   All vanilla, all guarded for prefers-reduced-motion. */

(function () {
  const reduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  /* ---------- scroll reveals ---------- */
  const revealables = document.querySelectorAll(".reveal");
  if (revealables.length) {
    if (reduced || !("IntersectionObserver" in window)) {
      revealables.forEach((el) => el.classList.add("lit"));
    } else {
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("lit");
              io.unobserve(e.target);
            }
          });
        },
        { threshold: 0.12 }
      );
      revealables.forEach((el) => io.observe(el));
    }
  }

  /* ---------- choose-your-path branching ----------
     Buttons: <button class="choice" data-choice="x" data-group="g">
     Branches: <div data-branch="x" data-group="g">  (group optional) */
  const firstChoiceOfGroup = new Map();
  document.querySelectorAll("button.choice[data-choice]").forEach((btn) => {
    const g = btn.dataset.group || "";
    if (!firstChoiceOfGroup.has(g)) firstChoiceOfGroup.set(g, btn);
    btn.setAttribute("aria-pressed", "false");
    btn.addEventListener("click", () => {
      const group = btn.dataset.group || "";
      const pick = btn.dataset.choice;
      document
        .querySelectorAll(`button.choice[data-choice]${group ? `[data-group="${group}"]` : ""}`)
        .forEach((b) => b.setAttribute("aria-pressed", String(b === btn)));
      document
        .querySelectorAll(`[data-branch]${group ? `[data-group="${group}"]` : ""}`)
        .forEach((sec) => sec.classList.toggle("open", sec.dataset.branch === pick));
    });
  });
  /* open each group's first branch so no section sits empty before a click */
  firstChoiceOfGroup.forEach((btn) => btn.click());

  /* ---------- dials ----------
     <input type="range" class="dial" data-out="idOfOutput"> shows live value.
     A container with [data-band-readout] maps the first dial's value to a band name. */
  const bandFor = (v) => {
    if (v >= 85) return "Handmade";
    if (v >= 55) return "Human-led";
    if (v >= 20) return "AI-led";
    return "Autonomous";
  };
  document.querySelectorAll("input.dial").forEach((dial) => {
    const out = dial.dataset.out ? document.getElementById(dial.dataset.out) : null;
    const readout = dial.closest(".dial-wrap")?.querySelector("[data-band-readout]");
    const paint = () => {
      const v = Number(dial.value);
      if (out) out.textContent = `${v}% human`;
      if (readout) readout.textContent = bandFor(v);
    };
    dial.addEventListener("input", paint);
    paint();
  });

  /* ---------- animated chart bars ---------- */
  document.querySelectorAll(".chart-bar .fill").forEach((bar, i) => {
    if (reduced) return;
    const target = bar.style.getPropertyValue("--v") || "0.5";
    bar.style.setProperty("--v", "0");
    setTimeout(() => {
      bar.style.transition = "transform 1.1s cubic-bezier(0.2, 0.8, 0.2, 1)";
      bar.style.setProperty("--v", target.trim());
    }, 250 + i * 120);
  });

  /* ---------- hero canvas: gold particle waveform ---------- */
  const canvas = document.getElementById("hero-canvas");
  if (!canvas || reduced) return;
  const ctx = canvas.getContext("2d");
  if (!ctx) return;

  let w, h, dpr;
  const N = 90;
  const particles = [];
  for (let i = 0; i < N; i++) {
    particles.push({
      x: i / (N - 1),
      phase: Math.random() * Math.PI * 2,
      speed: 0.4 + Math.random() * 0.7,
      amp: 0.35 + Math.random() * 0.65,
      r: 1 + Math.random() * 2.1,
      hue: Math.random() < 0.72 ? "gold" : "royal",
    });
  }

  function size() {
    dpr = Math.min(window.devicePixelRatio || 1, 2);
    w = canvas.clientWidth;
    h = canvas.clientHeight;
    canvas.width = w * dpr;
    canvas.height = h * dpr;
    ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
  }
  size();
  window.addEventListener("resize", size);

  let t = 0;
  function frame() {
    t += 0.008;
    ctx.clearRect(0, 0, w, h);
    const midY = h * 0.62;
    ctx.beginPath();
    for (let i = 0; i < N; i++) {
      const p = particles[i];
      const x = p.x * w;
      const wave =
        Math.sin(p.x * 7 + t * 2.1 * p.speed + p.phase) * 26 * p.amp +
        Math.sin(p.x * 17 - t * 1.3) * 9;
      const y = midY + wave;
      if (i === 0) ctx.moveTo(x, y);
      else ctx.lineTo(x, y);
      p._y = y;
      p._x = x;
    }
    ctx.strokeStyle = "rgba(227, 185, 76, 0.12)";
    ctx.lineWidth = 1;
    ctx.stroke();

    for (const p of particles) {
      ctx.beginPath();
      ctx.arc(p._x, p._y, p.r, 0, Math.PI * 2);
      ctx.fillStyle =
        p.hue === "gold"
          ? "rgba(227, 185, 76, 0.75)"
          : "rgba(139, 108, 255, 0.65)";
      ctx.shadowColor = p.hue === "gold" ? "rgba(227,185,76,0.8)" : "rgba(139,108,255,0.8)";
      ctx.shadowBlur = 7;
      ctx.fill();
      ctx.shadowBlur = 0;
    }
    requestAnimationFrame(frame);
  }
  requestAnimationFrame(frame);
})();
