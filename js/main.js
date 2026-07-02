/* ============================================================
   Swagat Adhikary — site engine
   Reads everything from content.js (window.SITE) and renders it.
   You should NOT need to edit this file to update your info.
   ============================================================ */

(function () {
  "use strict";
  const S = window.SITE || {};
  const $ = (id) => document.getElementById(id);

  /* ---------- tiny helpers ---------- */
  const el = (tag, cls, text) => {
    const n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  };

  /* ================= RENDER FROM CONTENT ================= */

  // basics
  document.title = `${S.name} — Software Engineer`;
  if (S.firstName) $("navName").textContent = S.firstName[0] || "S";
  $("heroName").textContent = S.name || "";
  $("heroTagline").textContent = S.tagline || "";
  $("footerName").textContent = S.name || "";
  $("contactBtn").href = `mailto:${S.email || ""}`;

  // hero links (github / linkedin / email)
  const heroLinks = $("heroLinks");
  (S.links || []).forEach((l) => {
    const a = el("a", null, `[ ${l.label} ]`);
    a.href = l.url;
    a.target = "_blank";
    a.rel = "noopener";
    heroLinks.appendChild(a);
  });
  if (S.email) {
    const a = el("a", null, "[ Email ]");
    a.href = `mailto:${S.email}`;
    heroLinks.appendChild(a);
  }

  // about
  const aboutText = $("aboutText");
  ((S.about && S.about.paragraphs) || []).forEach((p) => {
    aboutText.appendChild(el("p", null, p));
  });
  if (S.about && S.about.photo) $("aboutPhoto").src = S.about.photo;

  // stats
  const statsWrap = $("stats");
  (S.stats || []).forEach((st) => {
    const card = el("div", "stat");
    const val = el("div", "stat-value", "0");
    val.dataset.target = st.value;
    val.dataset.suffix = st.suffix || "";
    card.appendChild(val);
    card.appendChild(el("div", "stat-label", st.label));
    statsWrap.appendChild(card);
  });

  // experience timeline
  const timeline = $("timeline");
  (S.experience || []).forEach((job) => {
    const item = el("div", "tl-item reveal");
    const card = el("div", "tl-card");

    const head = el("div", "tl-head");
    const role = el("div", "tl-role");
    role.appendChild(document.createTextNode(job.role + " "));
    const at = el("span", "at", "@ " + job.company);
    role.appendChild(at);
    head.appendChild(role);
    head.appendChild(el("div", "tl-dates mono", job.dates));
    card.appendChild(head);
    card.appendChild(el("div", "tl-location", job.location || ""));

    const ul = el("ul", "tl-points");
    (job.points || []).forEach((p) => ul.appendChild(el("li", null, p)));
    card.appendChild(ul);

    if (job.tech && job.tech.length) {
      const tags = el("div", "tags");
      job.tech.forEach((t) => tags.appendChild(el("span", "tag", t)));
      card.appendChild(tags);
    }
    item.appendChild(card);
    timeline.appendChild(item);
  });

  // projects
  const grid = $("projectsGrid");
  (S.projects || []).forEach((pr) => {
    const card = el("div", "project-card reveal");

    const top = el("div", "project-top");
    top.appendChild(el("span", "project-folder", "🗂"));
    const links = el("div", "project-links");
    (pr.links || []).forEach((l) => {
      const a = el("a", null, l.label + " ↗");
      a.href = l.url;
      a.target = "_blank";
      a.rel = "noopener";
      links.appendChild(a);
    });
    top.appendChild(links);
    card.appendChild(top);

    card.appendChild(el("h3", "project-name", pr.name));
    card.appendChild(el("div", "project-year mono", pr.year || ""));
    card.appendChild(el("p", "project-desc", pr.description || ""));
    if (pr.award) card.appendChild(el("div", "project-award", pr.award));

    if (pr.tech && pr.tech.length) {
      const tags = el("div", "tags");
      pr.tech.forEach((t) => tags.appendChild(el("span", "tag", t)));
      card.appendChild(tags);
    }

    // spotlight follows the mouse
    card.addEventListener("mousemove", (e) => {
      const r = card.getBoundingClientRect();
      card.style.setProperty("--mx", `${e.clientX - r.left}px`);
      card.style.setProperty("--my", `${e.clientY - r.top}px`);
    });

    grid.appendChild(card);
  });

  // skills
  const skillsGrid = $("skillsGrid");
  (S.skills || []).forEach((group) => {
    const g = el("div", "skill-group reveal");
    g.appendChild(el("div", "skill-cat", group.category));
    const items = el("div", "skill-items");
    (group.items || []).forEach((s) => items.appendChild(el("span", "skill-chip", s)));
    g.appendChild(items);
    skillsGrid.appendChild(g);
  });

  // education
  const eduGrid = $("educationGrid");
  (S.education || []).forEach((ed) => {
    const c = el("div", "edu-card reveal");
    c.appendChild(el("div", "edu-school", ed.school));
    c.appendChild(el("div", "edu-degree", ed.degree));
    c.appendChild(el("div", "edu-dates mono", ed.dates || ""));
    const ul = el("ul", "edu-details");
    (ed.details || []).forEach((d) => ul.appendChild(el("li", null, d)));
    c.appendChild(ul);
    eduGrid.appendChild(c);
  });

  /* ================= TYPEWRITER ================= */
  const roles = S.roles && S.roles.length ? S.roles : ["Software Engineer"];
  const tw = $("typewriter");
  let rIdx = 0, cIdx = 0, deleting = false;
  (function type() {
    const word = roles[rIdx];
    tw.textContent = word.slice(0, cIdx);
    let delay = deleting ? 40 : 85;
    if (!deleting && cIdx === word.length) { delay = 1600; deleting = true; }
    else if (deleting && cIdx === 0) { deleting = false; rIdx = (rIdx + 1) % roles.length; delay = 350; }
    else cIdx += deleting ? -1 : 1;
    setTimeout(type, delay);
  })();

  /* ================= PARTICLE CONSTELLATION ================= */
  const canvas = $("particles");
  const ctx = canvas.getContext("2d");
  let particles = [], W, H;
  const mouse = { x: null, y: null };
  const reduceMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  function resize() {
    W = canvas.width = canvas.offsetWidth;
    H = canvas.height = canvas.offsetHeight;
    const count = Math.min(110, Math.floor((W * H) / 14000));
    particles = Array.from({ length: count }, () => ({
      x: Math.random() * W,
      y: Math.random() * H,
      vx: (Math.random() - 0.5) * 0.4,
      vy: (Math.random() - 0.5) * 0.4,
      r: Math.random() * 1.6 + 0.4,
    }));
  }
  resize();
  window.addEventListener("resize", resize);
  canvas.parentElement.addEventListener("mousemove", (e) => {
    const rect = canvas.getBoundingClientRect();
    mouse.x = e.clientX - rect.left;
    mouse.y = e.clientY - rect.top;
  });
  canvas.parentElement.addEventListener("mouseleave", () => { mouse.x = mouse.y = null; });

  function drawParticles() {
    ctx.clearRect(0, 0, W, H);
    for (const p of particles) {
      p.x += p.vx; p.y += p.vy;
      if (p.x < 0 || p.x > W) p.vx *= -1;
      if (p.y < 0 || p.y > H) p.vy *= -1;
      ctx.beginPath();
      ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
      ctx.fillStyle = "rgba(34, 211, 238, 0.5)";
      ctx.fill();
    }
    // connect close particles (and the mouse)
    const nodes = mouse.x != null ? particles.concat([{ x: mouse.x, y: mouse.y }]) : particles;
    for (let i = 0; i < nodes.length; i++) {
      for (let j = i + 1; j < nodes.length; j++) {
        const dx = nodes[i].x - nodes[j].x, dy = nodes[i].y - nodes[j].y;
        const d2 = dx * dx + dy * dy;
        if (d2 < 120 * 120) {
          ctx.beginPath();
          ctx.moveTo(nodes[i].x, nodes[i].y);
          ctx.lineTo(nodes[j].x, nodes[j].y);
          ctx.strokeStyle = `rgba(140, 170, 255, ${0.14 * (1 - d2 / 14400)})`;
          ctx.lineWidth = 1;
          ctx.stroke();
        }
      }
    }
    requestAnimationFrame(drawParticles);
  }
  if (!reduceMotion) drawParticles();

  /* ================= SCROLL EFFECTS ================= */

  // reveal on scroll
  const observer = new IntersectionObserver(
    (entries) => entries.forEach((e) => {
      if (e.isIntersecting) { e.target.classList.add("visible"); observer.unobserve(e.target); }
    }),
    { threshold: 0.12 }
  );
  document.querySelectorAll(".reveal").forEach((n) => observer.observe(n));

  // animated stat counters
  const statObserver = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      statObserver.unobserve(e.target);
      const target = +e.target.dataset.target;
      const suffix = e.target.dataset.suffix;
      const dur = 1400, t0 = performance.now();
      (function tick(t) {
        const k = Math.min(1, (t - t0) / dur);
        const eased = 1 - Math.pow(1 - k, 3);
        e.target.textContent = Math.round(target * eased) + suffix;
        if (k < 1) requestAnimationFrame(tick);
      })(t0);
    });
  }, { threshold: 0.5 });
  document.querySelectorAll(".stat-value").forEach((n) => statObserver.observe(n));

  // progress bar + nav border
  const bar = $("progressBar");
  const nav = $("nav");
  window.addEventListener("scroll", () => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    bar.style.width = (max > 0 ? (window.scrollY / max) * 100 : 0) + "%";
    nav.classList.toggle("scrolled", window.scrollY > 10);
  }, { passive: true });

  // scroll-spy: highlight the section you're in
  const sections = document.querySelectorAll("section[id]");
  const navAnchors = document.querySelectorAll(".nav-links a");
  const spy = new IntersectionObserver((entries) => {
    entries.forEach((e) => {
      if (!e.isIntersecting) return;
      navAnchors.forEach((a) =>
        a.classList.toggle("active", a.getAttribute("href") === "#" + e.target.id));
    });
  }, { rootMargin: "-40% 0px -55% 0px" });
  sections.forEach((s) => spy.observe(s));

  // mobile burger
  const burger = $("navBurger");
  const navLinks = $("navLinks");
  burger.addEventListener("click", () => navLinks.classList.toggle("open"));
  navLinks.addEventListener("click", (e) => {
    if (e.target.tagName === "A") navLinks.classList.remove("open");
  });

  // cursor glow
  const glow = $("cursorGlow");
  window.addEventListener("mousemove", (e) => {
    glow.style.left = e.clientX + "px";
    glow.style.top = e.clientY + "px";
  }, { passive: true });

  /* ================= THE VAULT ================= */
  const V = S.vault || {};
  const overlay = $("vaultOverlay");
  const vaultModal = overlay.querySelector(".vault-modal");
  const vaultError = $("vaultError");

  if (V.title) $("vaultTitle").textContent = V.title;
  if (V.subtitle) $("vaultSubtitle").textContent = V.subtitle;

  async function sha256(text) {
    const data = new TextEncoder().encode(text);
    const buf = await crypto.subtle.digest("SHA-256", data);
    return Array.from(new Uint8Array(buf))
      .map((b) => b.toString(16).padStart(2, "0"))
      .join("");
  }

  // helper for generating new credential hashes from the console:
  //   vaultHash("my-new-password")
  window.vaultHash = (text) => sha256(text).then((h) => { console.log(h); return h; });

  function openVault() {
    overlay.hidden = false;
    vaultError.hidden = true;
    $("vaultUser").value = "";
    $("vaultPass").value = "";
    $("vaultUser").focus();
  }
  function closeVault() { overlay.hidden = true; }

  // trigger 1: click the footer status dot 3 times quickly
  let dotClicks = 0, dotTimer;
  $("statusDot").addEventListener("click", () => {
    dotClicks++;
    clearTimeout(dotTimer);
    dotTimer = setTimeout(() => { dotClicks = 0; }, 1200);
    if (dotClicks >= 3) { dotClicks = 0; openVault(); }
  });

  // trigger 2: Ctrl+Shift+L anywhere
  window.addEventListener("keydown", (e) => {
    if (e.ctrlKey && e.shiftKey && e.code === "KeyL") { e.preventDefault(); openVault(); }
    if (e.key === "Escape" && !overlay.hidden) closeVault();
  });

  $("vaultClose").addEventListener("click", closeVault);
  overlay.addEventListener("click", (e) => { if (e.target === overlay) closeVault(); });

  $("vaultForm").addEventListener("submit", async (e) => {
    e.preventDefault();
    if (!window.crypto || !crypto.subtle) {
      vaultError.textContent = "⚠ needs HTTPS (or localhost) to authenticate";
      vaultError.hidden = false;
      return;
    }
    const [u, p] = await Promise.all([
      sha256($("vaultUser").value.trim()),
      sha256($("vaultPass").value),
    ]);
    if (u === V.usernameHash && p === V.passwordHash) {
      vaultError.hidden = true;
      vaultModal.querySelector(".vault-icon").textContent = "🔓";
      $("vaultTitle").textContent = "access granted";
      setTimeout(() => { window.location.href = V.url || "/"; }, 600);
    } else {
      vaultError.textContent = "⛔ access denied";
      vaultError.hidden = false;
      vaultModal.classList.add("shake");
      setTimeout(() => vaultModal.classList.remove("shake"), 450);
    }
  });
})();
