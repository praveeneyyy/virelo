# Contributing to VIRELO 🚀

Thank you for your interest in contributing to **VIRELO**! We are thrilled to welcome you to our open-source community.

VIRELO is an open-source, privacy-first universal media downloader and transcoding workstation. **This project is 100% open to contributions** from developers, designers, translators, and documentation writers of all skill levels.

---

## 🌟 How the Contribution Workflow Works

We follow the standard GitHub **Fork & Pull Request** workflow:

```
[Fork Repository] ➔ [Clone Locally] ➔ [Create Feature Branch]
        ➔ [Make Changes & Test] ➔ [Push to Fork] ➔ [Open Pull Request]
        ➔ [Maintainer Review] ➔ [Merge to Main! 🎉]
```

> **A message from the maintainer:**  
> *"Create a fork, create your branch, push your improvements, and open a Pull Request. I will personally check, review, and merge it!"*  
> — **Praveen kumar** ([@praveeneyyy](https://github.com/praveeneyyy))

---

## 🛠️ Step-by-Step Contribution Guide

### Step 1: Fork the Repository
1. Navigate to the official VIRELO repository: [https://github.com/praveeneyyy/virelo](https://github.com/praveeneyyy/virelo)
2. In the top-right corner of the page, click the **Fork** button to create a copy under your GitHub account.

### Step 2: Clone Your Fork Locally
Clone your newly created fork to your local computer:
```bash
git clone https://github.com/<your-username>/virelo.git
cd virelo
```

Add the original upstream repository as a remote so you can sync upstream changes anytime:
```bash
git remote add upstream https://github.com/praveeneyyy/virelo.git
git fetch upstream
```

### Step 3: Create a Dedicated Feature Branch
Never make changes directly on `main`. Always create a descriptive branch:
```bash
git checkout -b feature/your-feature-name
# or for bug fixes:
git checkout -b fix/issue-description
```

### Step 4: Set Up Your Development Environment
Make sure you have:
- **Python**: 3.12 or newer
- **Node.js**: 20 or newer
- **FFmpeg**: Installed and available on your system `PATH`

Install dependencies:
```bash
# Backend dependencies
pip install -r requirements.txt

# Frontend dependencies
cd frontend
npm install
cd ..
```

Run the development servers concurrently with the unified runner:
```bash
python run_dev.py
```
- Frontend hot-reloads at: `http://localhost:5173`
- Backend API & interactive OpenAPI docs at: `http://localhost:8000/docs`

### Step 5: Implement Your Changes
When contributing code, please keep our core architectural tenets in mind:
1. **Zero-Server-Storage Privacy**:
   - Media files belong exclusively on the user's client device.
   - Any server-side temporary scratch files must remain strictly ephemeral and be purged immediately after streaming to the client browser.
2. **Speed & Efficiency**:
   - Prefer unthrottled direct HTTPS streams over throttled HLS wherever possible.
   - Utilize stream-copy muxing (`-c:v copy -c:a copy`) when re-encoding is not strictly required.
3. **Safe Harbor Compliance**:
   - We support statutory personal Fair Use (**17 U.S.C. § 107**).
   - **Never** introduce DRM circumvention (Widevine, FairPlay), paywall circumvention, or unauthorized subscriber credential bypasses.
4. **Clean Code & Type Safety**:
   - Python code should adhere to PEP 8 and Pydantic v2 schemas.
   - Frontend code should use TypeScript, React hooks, and Tailwind CSS.

### Step 6: Test Your Changes
Before committing, ensure all automated tests pass and the production build compiles cleanly:

```bash
# 1. Run Python unit test suite
python -m unittest discover -s tests -p "test_*.py"

# 2. Verify Frontend production build
cd frontend
npm run build
cd ..
```

If you add new features or endpoints, please include corresponding unit tests in the `tests/` directory.

### Step 7: Commit Your Changes
Write clear, concise commit messages following the Conventional Commits convention:
```bash
git add .
git commit -m "feat: add support for new audio format extraction"
# or
git commit -m "fix: resolve edge-case in thumbnail parsing"
```

### Step 8: Push to Your Fork
Push your branch to your GitHub fork:
```bash
git push origin feature/your-feature-name
```

### Step 9: Open a Pull Request
1. Go to your fork on GitHub: `https://github.com/<your-username>/virelo`
2. You will see a banner prompting **"Compare & pull request"**. Click it.
3. Fill out the Pull Request details:
   - **Title**: Brief summary of what your PR introduces.
   - **Description**: Detail what changes you made, what problem it solves, and how you tested it.
   - Reference any relevant open issues (e.g., `Closes #12`).
4. Click **Create pull request**.

### Step 10: Review and Merge! 🎉
The maintainer will review your Pull Request promptly:
- We may offer feedback or discuss ideas to ensure high code quality.
- Once approved, the maintainer will **merge** your PR into the `main` branch.
- Your name will be added to `CONTRIBUTORS.md` celebrating your contribution to VIRELO!

---

## 💡 Ways to Contribute

You do not need to be a senior backend engineer to contribute! We welcome:
- 🌐 **New Platform Extractors**: Testing or improving compatibility across 1,700+ websites.
- 🎨 **UI/UX Refinements**: Modernizing components, improving responsiveness, or enhancing accessibility.
- ⚡ **Performance Improvements**: Optimizing download chunking, caching, or frontend bundle sizes.
- 📝 **Documentation & Guides**: Improving setup guides, translations, FAQ entries, or architecture documentation.
- 🐛 **Bug Reports & Fixes**: Submitting reproducible bug reports or fixing identified issues.

---

## 📬 Need Help or Have Questions?

Feel free to open an issue on GitHub or reach out directly:
- **GitHub Issues**: [https://github.com/praveeneyyy/virelo/issues](https://github.com/praveeneyyy/virelo/issues)
- **Maintainer**: Praveen kumar ([praveensky2006@gmail.com](mailto:praveensky2006@gmail.com))

Happy coding, and thank you for making VIRELO better for everyone! 🚀
