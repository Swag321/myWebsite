# swagatadhikary.com

My personal portfolio — a fully static site with zero build steps. Open `index.html` in a browser and it works.

## ✏️ How to update the site (no coding required)

**Every word on the site lives in one file: [`content.js`](content.js).**

To add a new job, project, skill, or edit your bio:

1. Go to `content.js` on GitHub and click the ✏️ pencil icon (or open it in any text editor).
2. Find the section you want (they're labeled: `ABOUT ME`, `WORK EXPERIENCE`, `PROJECTS`...).
3. Edit the text between the quotes. To add a new entry, copy an existing block from `{` to `},` and edit it.
4. Commit / save. If the site is hosted on GitHub Pages, it redeploys itself in ~1 minute.

**Golden rules:** keep the `"quotes"`, keep the trailing `commas`, and if the page goes blank, undo your last edit.

To swap your photo: drop a new image file in the repo and change the `photo:` line in `content.js` to its filename.

## 🔐 The Vault (hidden button)

There's a hidden login gate for linking to private stuff (local LLM, NAS, etc.):

- **Open it:** click the green status dot in the footer **3 times**, or press **Ctrl + Shift + L**.
- **Default login:** `swagat` / `changeme123` — **change this!**
- **To change credentials:** open the site, press F12 → Console, run `vaultHash("your-new-password")`, and paste the printed hash into the `vault` section of `content.js`. Do the same for the username.
- **To change where it goes:** edit `vault.url` in `content.js`.

> ⚠️ This gate is a front door, not a lock. The credential hashes are visible in the page source, so anything genuinely private (your LLM, your NAS) must **also** require its own login — see [HOSTING.md → Securing the Vault](HOSTING.md#securing-the-vault).

## 📁 What's what

| File | Purpose |
|---|---|
| `content.js` | **All your info. The only file you edit.** |
| `index.html` | Page structure |
| `css/style.css` | Design/styling |
| `js/main.js` | Animations + rendering + vault logic |
| `Dockerfile`, `nginx.conf` | Container image for Docker/Kubernetes hosting |
| `k8s/` | Kubernetes manifests (deployment, service, ingress) |
| `HOSTING.md` | Step-by-step hosting guide, from free → full AWS/Kubernetes |

## 🚀 Hosting

See [HOSTING.md](HOSTING.md) — it walks through four levels, from GitHub Pages (free, 5 minutes) up to Kubernetes on AWS with a load balancer.

Quick local preview:

```bash
python3 -m http.server 8000
# then open http://localhost:8000
```
