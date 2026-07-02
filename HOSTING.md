# Hosting Guide — from free to full AWS/Kubernetes

Your site is **static** (just HTML/CSS/JS files — no server code), which means it can be hosted almost anywhere, for almost nothing. This guide is a ladder: each level teaches you a real infrastructure skill. Honest note up front: **levels 3–4 are wildly overkill for a portfolio site** — that's exactly why they're great for learning. You get real AWS/Kubernetes experience with a workload that can't hurt anyone if you break it.

---

## Level 0 — Run it locally (right now)

```bash
cd myWebsite
python3 -m http.server 8000
# open http://localhost:8000
```

---

## Level 1 — GitHub Pages (free, 5 minutes) ⭐ do this first

1. On GitHub: repo → **Settings → Pages**.
2. Source: **Deploy from a branch** → branch `main`, folder `/ (root)` → Save.
3. Your site is live at `https://swag321.github.io/mywebsite/` in ~1 minute.
4. Bonus: every edit to `content.js` on GitHub auto-redeploys. This is what makes the "update like a normie" workflow real.

**Custom domain:** in the same Pages settings, add `swagatadhikary.com`, then at your DNS provider create a `CNAME` record pointing `www` → `swag321.github.io` and `A` records for the apex to GitHub's IPs (185.199.108.153, .109., .110., .111.). HTTPS is automatic.

*What you learn: DNS records, CNAME vs A records, TLS certificates (for free).*

---

## Level 2 — AWS S3 + CloudFront (the "real world" static stack)

This is how a huge share of production static sites actually run.

**Concepts:** S3 = object storage that can serve files. CloudFront = a CDN — ~400 edge locations that cache your files near your visitors. This *is* a form of load balancing: traffic is distributed geographically instead of across servers.

```bash
# 1. Make a bucket and upload the site
aws s3 mb s3://swagatadhikary.com
aws s3 sync . s3://swagatadhikary.com \
  --exclude ".git/*" --exclude "k8s/*" --exclude "Dockerfile" \
  --exclude "nginx.conf" --exclude "*.md"

# 2. Create a CloudFront distribution (easiest via console):
#    Origin: your bucket (use "Origin access control" so the bucket stays private)
#    Default root object: index.html
#    Viewer protocol policy: Redirect HTTP to HTTPS

# 3. Free TLS cert: AWS Certificate Manager (must be in us-east-1 for CloudFront)

# 4. Point your domain at CloudFront with a Route 53 ALIAS record
```

Redeploying after a `content.js` edit:

```bash
aws s3 cp content.js s3://swagatadhikary.com/content.js
aws cloudfront create-invalidation --distribution-id YOUR_ID --paths "/content.js"
```

Cost: pennies/month. *What you learn: S3, CDNs/edge caching, ACM certificates, Route 53, cache invalidation.*

---

## Level 3 — Docker + a single server (EC2)

Now you run your own web server. The repo already has the `Dockerfile` and `nginx.conf`.

```bash
# locally, prove it works:
docker build -t portfolio .
docker run -p 8080:80 portfolio     # → http://localhost:8080
```

Then on AWS:

1. Launch a **t4g.nano EC2** instance (~$3/mo) with Amazon Linux; open ports 80/443 in its security group.
2. Install docker: `sudo dnf install -y docker && sudo systemctl enable --now docker`
3. Push your image to **ECR** (AWS's registry), pull it on the instance, `docker run -d -p 80:80 ...`
4. Point DNS at the instance's Elastic IP.

**Want a real load balancer here?** Launch *two* instances, put an **Application Load Balancer (ALB)** in front, attach both to a **target group**, and terminate TLS at the ALB with an ACM cert. Kill one instance and watch traffic keep flowing — that's the whole point of an LB, and seeing it happen teaches you more than any diagram.

*What you learn: containers, image registries, EC2, security groups, ALBs, target groups, health checks.*

---

## Level 4 — Kubernetes on AWS (EKS) 🎓 the big one

The `k8s/` folder has everything, commented line-by-line. The mental model:

```
Internet → AWS Load Balancer → Service → Pods (2 replicas of your nginx container)
                                            ↑ Deployment keeps these alive
```

- **Deployment** (`k8s/deployment.yaml`) — "run 2 copies of my container, restart them if they die, roll out updates with zero downtime."
- **Service** (`k8s/service.yaml`) — one stable address that load-balances across the pods. `type: LoadBalancer` makes AWS provision a real ELB for you. **This is where load balancers stop being an abstract concept.**
- **Ingress** (`k8s/ingress.yaml`, optional) — one load balancer shared by many services, routed by hostname. This is how you'd later add `llm.swagatadhikary.com` or `nas.swagatadhikary.com` on the same LB.

```bash
# 1. Create a cluster (~15 min; eksctl is the easy button)
eksctl create cluster --name swagat-web --region us-east-1 \
  --nodes 2 --node-type t3.small

# 2. Build & push the image to ECR
aws ecr create-repository --repository-name portfolio
docker build -t portfolio .
docker tag portfolio:latest <ACCOUNT>.dkr.ecr.us-east-1.amazonaws.com/portfolio:v1
aws ecr get-login-password | docker login --username AWS --password-stdin <ACCOUNT>.dkr.ecr.us-east-1.amazonaws.com
docker push <ACCOUNT>.dkr.ecr.us-east-1.amazonaws.com/portfolio:v1

# 3. Edit k8s/deployment.yaml → set the image to the ECR URL, then:
kubectl apply -f k8s/deployment.yaml -f k8s/service.yaml

# 4. Get your load balancer's address:
kubectl get service portfolio       # EXTERNAL-IP column → point DNS at it

# 5. Play. This is the actual learning part:
kubectl get pods                    # see your 2 replicas
kubectl delete pod <one-of-them>    # watch k8s instantly replace it
kubectl scale deployment portfolio --replicas=5
kubectl rollout restart deployment portfolio   # zero-downtime redeploy
```

⚠️ **Cost warning:** EKS control plane is ~$73/month + nodes + LB (~$100/mo total). Spin it up, learn for a weekend, then `eksctl delete cluster --name swagat-web`. For a free k8s playground first, run [minikube](https://minikube.sigs.k8s.io/) or [k3s](https://k3s.io/) on your own machine with these exact same manifests.

*What you learn: clusters/nodes/pods, deployments, services, ingress, rolling updates, self-healing, kubectl.*

---

## My recommendation

**Host the real site on Level 1 or 2** (free/cheap, zero maintenance, always up). **Do Levels 3–4 as time-boxed learning projects** with the same repo — the site is a perfect guinea pig. Putting a portfolio permanently on EKS is paying $100/mo for what GitHub Pages does for free; doing it for a weekend is the cheapest AWS course you'll ever take.

---

## Securing the Vault

The hidden button's login gate runs in the browser, so treat it as a doorbell, not a lock. When you're ready to wire it to your local LLM / NAS:

1. **Never expose your home services directly to the internet.** Instead use one of:
   - **Tailscale** (easiest): your services stay private; only your devices on the tailnet can reach them. Set `vault.url` to the Tailscale address (e.g. `http://homelab:3000`) — it'll work on your devices and fail for everyone else.
   - **Cloudflare Tunnel + Access**: exposes `llm.yourdomain.com` publicly but puts Cloudflare's own login (email/SSO) in front. No open ports on your router.
2. **The service itself should require auth too** — e.g. Open WebUI has built-in logins; NAS UIs have their own users.
3. The site's vault modal then becomes exactly what it should be: a cool front door for you, while real security lives on the services behind it.

This layered setup (edge auth → network auth → app auth) is itself a classic infrastructure pattern: *defense in depth*.
