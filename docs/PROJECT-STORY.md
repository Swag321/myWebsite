# swagatadhikary.com — The Full Story

*How a 4-year-old static page became a modern portfolio, everything that broke along the way,
and how this site actually works under the hood.*

---

## 1. Where it started

The original site (2022) was a single hand-written `index.html` + `stylesheet.css` from when I was
first learning HTML/CSS — high-school resume content, placeholder images, hardcoded everything.
Updating it meant editing HTML by hand. It had been deployed to GitHub Pages years ago via a custom
domain setup I'd since completely forgotten (this becomes important in Act 3).

**Goals for the rebuild:**

1. Look genuinely impressive — a portfolio that *demonstrates* frontend ability, not just lists it.
2. Be updatable by a non-coder. New job? New project? One file, no code.
3. Hide a personal easter egg: an auth-gated button linking to my homelab (Jarvis3 — local LLM,
   photos, passwords) that's useless to anyone who isn't me.
4. Be a vehicle for learning real infrastructure: AWS, Docker, Kubernetes, load balancers.

---

## 2. Architecture — how the site works

### The one-file content system

The core design decision: **all content lives in [`content.js`](../content.js), and the site renders
itself from it at page load.** `index.html` is just a skeleton of empty sections; `js/main.js` reads
`window.SITE` and builds the DOM.

```
content.js  (data: name, jobs, projects, skills, vault config…)
     │
index.html  (empty shells: <div id="timeline">, <div id="projectsGrid">…)
     │
js/main.js  (reads window.SITE → creates DOM nodes → wires animations)
```

Why a `.js` file instead of `.json`? Two practical reasons:

- **JSON can't have comments.** `content.js` is full of plain-English instructions
  ("copy this block from `{` to `},` to add a job") — that's what makes it normie-editable.
- **`fetch("content.json")` fails on the `file://` protocol** (CORS), so a JSON version
  couldn't be previewed by double-clicking `index.html`. A `<script src="content.js">` tag works
  everywhere, no server needed.

There is deliberately **no build step** — no npm, no bundler, no framework. The repo *is* the
deployable artifact. That's what makes "edit `content.js` on github.com → commit → live in a
minute" possible.

### The visual layer

All vanilla CSS/JS (~600 lines CSS, ~400 lines JS):

| Feature | How it works |
|---|---|
| Particle constellation hero | `<canvas>` + `requestAnimationFrame`; ~100 drifting points, lines drawn between pairs closer than 120px (including the mouse as a node) |
| Typewriter roles | `setTimeout` state machine cycling through `SITE.roles`, typing/deleting per character |
| Scroll-reveal sections | `IntersectionObserver` adds a `.visible` class → CSS transitions from `opacity:0; translateY(28px)` |
| Animated stat counters | Second `IntersectionObserver` + eased `requestAnimationFrame` count-up when scrolled into view |
| Scroll-spy nav | Third `IntersectionObserver` with `rootMargin: -40% 0px -55%` highlighting the section in the viewport middle |
| Project card spotlight | `mousemove` writes `--mx`/`--my` CSS variables; a `radial-gradient` positioned at those coordinates fades in on hover |
| Cursor glow | Fixed 500px radial gradient following `mousemove` (disabled on touch devices via `@media (hover: none)`) |
| Reduced motion | `prefers-reduced-motion` disables the particles and reveal animations |

### The Vault (the hidden button)

A login gate hidden behind two triggers: **triple-clicking the green status dot in the footer**, or
**Ctrl + Shift + L**. Credentials are checked as SHA-256 hashes (`crypto.subtle.digest`) against
hashes stored in `content.js` — the plaintext never appears in the source. On success it reveals a
**launchpad** of homelab links (configured in `vault.links`):

- 🤖 **Jarvis** — Open WebUI at `http://100.106.68.111:3000` (local LLM + RAG, the
  [jarvis3](https://github.com/Swag321/jarvis3) stack)
- 📸 **Immich** — photo library at `:2283`
- 🔑 **Vaultwarden** — passwords at `:11001` (HTTPS via Caddy)

**Honest security model** — the vault is a *doorbell, not a lock*. The hashes are visible in page
source and client-side auth can always be bypassed. Real security is layered behind it
(*defense in depth*):

1. **Network layer:** the links use Tailscale IPs (`100.x.y.z`), which only resolve on devices
   signed into my tailnet. Publishing them leaks nothing — they aren't routable from the internet.
2. **App layer:** Open WebUI, Immich, and Vaultwarden each have their own real logins.
3. **Cosmetic layer:** the vault modal keeps the links out of casual view.

To rotate credentials: run `vaultHash("new-password")` in the browser console on the site and paste
the output into `content.js`.

### Infrastructure artifacts (the learning half)

The repo doubles as an infra classroom — see [HOSTING.md](../HOSTING.md) for the full ladder:

- **`Dockerfile` + `nginx.conf`** — containerized nginx serving the site with gzip, cache headers,
  security headers, a `/healthz` endpoint, and the themed `404.html` as `error_page`.
- **`k8s/`** — commented Kubernetes manifests: a `Deployment` (2 replicas, rolling updates,
  liveness/readiness probes), a `Service` of `type: LoadBalancer` (provisions a real AWS ELB),
  and an optional `Ingress` (one load balancer shared by many hostnames).
- **`HOSTING.md`** — a four-level hosting guide: GitHub Pages (free) → S3 + CloudFront →
  Docker on EC2 behind an ALB → EKS. The recommendation: *host* on level 1, *learn* on levels 3–4
  with a time-boxed cluster you tear down after.

The production site runs on **GitHub Pages** (level 1): free, zero-maintenance, auto-deploys on
every push to `main`, and edits to `content.js` made in the GitHub web editor go live in ~1 minute.

---

## 3. The custom domain saga (the obstacles)

Getting `main.swagatadhikary.com` to serve the new site took longer than building the site.
The confusion — and the lesson — comes from the fact that **"CNAME" names two completely
different things**:

| Thing | Lives where | Says what |
|---|---|---|
| DNS **CNAME record** | Domain registrar (Squarespace) | "`main.swagatadhikary.com` is an alias for `swag321.github.io`" → routes browsers to **GitHub's servers** |
| **CNAME file** | A repo's root | "Requests arriving at GitHub for this hostname belong to **this repo**" — one repo per domain, first claim wins |

GitHub Pages serves millions of sites from one fleet of servers (fronted by the Fastly CDN), routed
by the HTTP `Host` header — which is itself a nice load-balancing/multi-tenancy lesson:

```
browser → DNS (CNAME record) → GitHub/Fastly edge → "which repo claimed this Host?" (CNAME file) → content
```

### What went wrong, blow by blow

1. **The 404.** After merging the redesign and enabling Pages, `main.swagatadhikary.com` returned
   GitHub's 404. Diagnosis: DNS still resolved correctly to `swag321.github.io` (the years-old
   record never broke), but *no repo claimed the hostname* — so GitHub had nowhere to route it.

2. **The ghost claim.** We added a `CNAME` file to this repo… and the domain started serving the
   **old 2022 portfolio**. Not a caching issue (it survived incognito). Cause: my forgotten
   **`swag321.github.io` user-site repo** still held the domain claim from years ago and was
   serving its own stale copy of the old site. Its claim silently beat ours the whole time —
   and it also explains why our deploys kept failing with the maddeningly vague
   `Deployment failed, try again later`.

3. **The red herring.** An even older account (`Swagat321` / `swagat321.github.io` — note the
   different username) looked suspicious but had no CNAME and no claim. Irrelevant.

4. **The half-transfer.** Deleting the old repo's `CNAME` file released the claim — deploy logs
   flipped from `…/myWebsite/` to `https://main.swagatadhikary.com/` as the target, proving the
   transfer registered. But deploys *still* failed: the domain binding was in a stale
   half-transferred state on GitHub's side.

5. **The fix.** In the repo's **Settings → Pages**, removing the custom domain and re-typing it
   forced GitHub to re-run its whole registration pipeline: DNS verification → claim → TLS
   certificate issuance (the "Enforce HTTPS" checkbox unlocking was the tell that it worked).
   One more deploy after that went green, published to the domain root, and the site was live.

   > Re-saving the domain field is the "turn it off and on again" of GitHub Pages domains.

### Lessons worth keeping

- **DNS records and domain claims are independent systems.** DNS being right proves nothing about
  which repo GitHub will serve. Debug them separately.
- **One hostname, one repo.** If a domain serves stale content that survives incognito, some other
  repo owns the claim. User-site repos (`<username>.github.io`) are the usual suspects.
- **`Deployment failed, try again later` around domain changes** almost always means the claim is
  contested or mid-transfer — fix the domain state, then push any commit to retry.
- **The `www`/apex distinction matters:** subdomains (like `main.`) use CNAME records; bare apex
  domains can't, and need A records to GitHub's four IPs (`185.199.108–111.153`). The exact steps
  to move this site to bare `swagatadhikary.com` are in
  [HOSTING.md](../HOSTING.md#the-custom-domain-saga--how-mainswagatadhikarycom-actually-works).

---

## 4. Current state

| Piece | Status |
|---|---|
| Live site | `https://main.swagatadhikary.com` (GitHub Pages, HTTPS enforced) |
| Content updates | Edit `content.js` on github.com → commit → live in ~1 min |
| Vault | Triple-click footer dot / Ctrl+Shift+L → launchpad to Jarvis, Immich, Vaultwarden over Tailscale |
| SEO | Open Graph + Twitter cards, canonical URL, `robots.txt`, `sitemap.xml`, themed `404.html` |
| Containerized | `docker build -t portfolio . && docker run -p 8080:80 portfolio` |
| Kubernetes-ready | `kubectl apply -f k8s/` on any cluster (manifests fully commented) |

**Possible next steps:** move to the bare apex domain (Squarespace DNS change), expose Jarvis to
non-Tailscale users via Caddy + HTTPS (sketched in jarvis3's OPERATIONS notes), or run the k8s
manifests on a weekend EKS cluster as an AWS learning exercise.
