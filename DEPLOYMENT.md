# Deployment Guide — NRI TDP Germany

How **www.tdpgermany.org** is hosted, and exactly how to deploy changes.

---

## 1. The big picture

This site is a plain **static website** (HTML, CSS, JavaScript — no server, no
database). It is hosted **free** on **GitHub Pages** and reached through a custom
domain bought from **GoDaddy**.

```
   Your computer                GitHub                         Visitor
   ────────────                 ──────                         ───────
   edit files  ──git push──►  repo: tdpgermany77-sudo/tdp-germany
                                     │
                                     │ GitHub Pages serves the `main` branch
                                     ▼
                              <user>.github.io  ──── DNS (GoDaddy) ────►  www.tdpgermany.org
```

The three moving parts:

| Part | What it is | Where |
|------|------------|-------|
| **Code** | The website files | GitHub repo `tdpgermany77-sudo/tdp-germany` |
| **Hosting** | Serves the files over HTTPS, free | GitHub Pages (built from the `main` branch) |
| **Domain** | The address people type | GoDaddy domain `tdpgermany.org` |

The link between hosting and domain is **DNS** (set at GoDaddy) plus the
**`CNAME`** file in this repo.

---

## 2. Deploying a change (day-to-day)

> **This is the part you do all the time.** Once the one-time setup in
> sections 3–4 is done, deploying is just a push.

1. Make your edits locally.
2. Commit and push to the **`main`** branch:

   ```bash
   git add -A
   git commit -m "Describe what changed"
   git push origin main
   ```

3. Wait **1–2 minutes**. GitHub Pages automatically rebuilds and publishes.
4. Open **https://www.tdpgermany.org** and **hard-refresh** to bypass the cache:
   - Windows/Linux: `Ctrl + Shift + R`
   - Mac: `Cmd + Shift + R`

That's it. There is no separate "build" or "upload" step — pushing to `main`
**is** the deploy.

You can watch the deploy status at:
`https://github.com/tdpgermany77-sudo/tdp-germany/actions` (the **pages-build-deployment**
job).

---

## 3. One-time setup — GitHub Pages

Done once per repo. (Already configured for this site — documented here so it can
be re-created or moved.)

1. Push the website so the files are on the **`main`** branch (the `index.html`
   must be at the **repo root**).
2. On GitHub: **repo → Settings → Pages**.
3. Under **Build and deployment**:
   - **Source:** *Deploy from a branch*
   - **Branch:** `main`  •  **Folder:** `/ (root)`
   - Save.
4. GitHub gives a temporary URL like `https://tdpgermany77-sudo.github.io/tdp-germany/`.
   Confirm the site loads there first.
5. Add the custom domain (section 4), then tick **Enforce HTTPS** once the
   certificate is issued.

### The `CNAME` file
This repo contains a file named **`CNAME`** at the root with exactly:

```
www.tdpgermany.org
```

This tells GitHub Pages which custom domain to answer for. **Do not delete it** —
GitHub re-creates it from the *Settings → Pages → Custom domain* field, and if it
goes missing the custom domain unbinds. (It is committed to the repo so a fresh
clone/redeploy keeps the domain.)

---

## 4. One-time setup — GoDaddy DNS (connecting the domain)

This points the GoDaddy domain at GitHub Pages.

1. Log in to **GoDaddy → My Products → Domains → tdpgermany.org → DNS / Manage
   DNS**.
2. Add the records below.

### a) `www` subdomain → GitHub Pages  (this is the primary domain)

| Type  | Name  | Value                          | TTL   |
|-------|-------|--------------------------------|-------|
| CNAME | `www` | `tdpgermany77-sudo.github.io`  | 1 hr  |

> Note the trailing host is `<github-username>.github.io` — **not** the repo URL.

### b) Apex / root `tdpgermany.org` → GitHub Pages  (so the bare domain also works and redirects to `www`)

Add these four **A** records (all Name `@`), pointing at GitHub's Pages servers:

| Type | Name | Value             |
|------|------|-------------------|
| A    | `@`  | `185.199.108.153` |
| A    | `@`  | `185.199.109.153` |
| A    | `@`  | `185.199.110.153` |
| A    | `@`  | `185.199.111.153` |

(Optional, for IPv6 visitors — add these **AAAA** records, Name `@`:)

```
2606:50c0:8000::153
2606:50c0:8001::153
2606:50c0:8002::153
2606:50c0:8003::153
```

3. **Remove conflicting records** GoDaddy adds by default:
   - Delete any **"Parked"** A record on `@` that points to a GoDaddy IP.
   - Delete the default **CNAME `www` → `@`** if it exists (the new CNAME above
     replaces it).
   - Turn off GoDaddy **Domain Forwarding** if it's on (it conflicts with the A
     records).
4. Save. DNS changes can take **a few minutes to a few hours** to propagate.

### How it resolves
- Visitor types `www.tdpgermany.org` → GoDaddy CNAME → `tdpgermany77-sudo.github.io`
  → GitHub Pages serves the site.
- Visitor types `tdpgermany.org` (no www) → GoDaddy A records → GitHub Pages →
  GitHub **redirects to `www.tdpgermany.org`** (because the `CNAME` file uses `www`).

### HTTPS
After DNS resolves, go back to **GitHub → Settings → Pages** and enable
**Enforce HTTPS**. GitHub issues a free Let's Encrypt certificate automatically
(can take up to ~24h the first time). After that the site is served over
`https://`.

---

## 5. The gallery auto-build (GitHub Action)

The photo gallery is **folder-driven** — you don't edit code to add photos.

- Drop photos into folders under `eventsandgallery/event-gallery/<Year>/<Album>/`.
- On push to `main`, the workflow **`.github/workflows/build-gallery.yml`** runs
  `tools/build-gallery.py`, which regenerates `eventsandgallery/gallery.json`
  (the manifest the site reads) and commits it back automatically.
- You can also run it by hand locally before pushing:

  ```bash
  python3 tools/build-gallery.py
  ```

> Large original photos are optimized to `.webp` and the heavy originals are kept
> out of the repo (see `.gitignore`). The build script prefers the `.webp`
> versions automatically.

---

## 6. Common tasks & troubleshooting

**My change isn't showing up.**
- Confirm the push landed on `main`: `git log origin/main -1`.
- Check the deploy finished: repo → **Actions** → *pages-build-deployment* is green.
- **Hard-refresh** the browser (`Cmd/Ctrl + Shift + R`). Browser/CDN cache is the
  #1 cause of "I don't see my change."

**Site shows "404" or GitHub's default page.**
- Make sure `index.html` is at the **repo root** on `main`.
- Settings → Pages → Source must be **`main` / root**.

**Custom domain stopped working / "domain's DNS record could not be retrieved".**
- Check the **`CNAME`** file still exists at the repo root and reads
  `www.tdpgermany.org`.
- Re-enter the domain in Settings → Pages → Custom domain and save.
- Verify the GoDaddy records in section 4 are intact (GoDaddy sometimes re-adds a
  parked record).

**HTTPS padlock missing / certificate error.**
- Wait — first issuance can take up to 24h. Then toggle **Enforce HTTPS** off and
  on in Settings → Pages.

**Check what DNS is currently returning:**
```bash
dig www.tdpgermany.org +short      # should show tdpgermany77-sudo.github.io + GitHub IPs
dig tdpgermany.org +short          # should show the four 185.199.108–111.153 IPs
```

---

## 7. Quick reference

| Thing | Value |
|-------|-------|
| Repo | `https://github.com/tdpgermany77-sudo/tdp-germany` |
| Deploy branch | `main` (root folder) |
| Live URL | `https://www.tdpgermany.org` |
| GitHub Pages URL | `https://tdpgermany77-sudo.github.io/tdp-germany/` |
| Custom-domain file | `CNAME` → `www.tdpgermany.org` |
| Domain registrar | GoDaddy (`tdpgermany.org`) |
| `www` DNS | CNAME → `tdpgermany77-sudo.github.io` |
| apex DNS | A → `185.199.108.153` / `.109` / `.110` / `.111` `.153` |
| Deploy command | `git push origin main` |

---

## 8. Run the site locally (before deploying)

```bash
cd tdp-germany
python3 -m http.server 8000
# then open:
#   http://localhost:8000/index.html   (the website)
#   http://localhost:8000/Launch.html  (the launch intro)
```

This serves the exact files that will be deployed, so you can preview changes
before pushing to `main`.
