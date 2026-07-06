# AutoWash CV Thesis Website

Static website for the graduation thesis:

**"Thiết kế và chế tạo mô hình rửa xe tự động ứng dụng xử lý ảnh và PLC"**

The site is built with vanilla HTML, CSS, and JavaScript only. It can run by opening `index.html` directly in a browser and is ready for GitHub Pages deployment.

## Files

- `index.html` - Page structure and Vietnamese content.
- `style.css` - Responsive layout, visual system, placeholders, and animations.
- `script.js` - Scroll reveal, active navigation, mobile menu, and workflow highlighting.
- `README.md` - Project notes and deployment instructions.

## Run Locally

Open `index.html` directly in your browser.

No build step, package manager, framework, or server is required.

## Typography

The website uses `Be Vietnam Pro` for clean Vietnamese rendering, with `"Segoe UI"` and `Arial` as fallback fonts if the web font is not available.

## Replace Placeholders

The prototype and demo areas are intentionally coded as placeholders:

- To change the Hero car image, replace `assets/hero-vinfast-detection.jpg` with your own detection screenshot or prototype photo.
- To change the AI Sedan image, replace `assets/ai-sedan-detection.png`.
- To change prototype images, replace `assets/prototype-3d.png`, `assets/prototype-real.png`, and `assets/prototype-wiring.png`.
- The 3D design card opens a CAD detail modal. Update the Google Drive link in `index.html` and replace `assets/cad-drive-qr.png` if the CAD folder changes.
- The electrical wiring card opens a system electrical modal. Update the Google Drive link in `index.html` and replace `assets/electrical-drive-qr.png` if the electrical folder changes.
- To change the demo video, replace `assets/demo-video.mp4` and optionally replace `assets/demo-video-poster.jpg`.
- Update the final "Xem mã nguồn" link in the conclusion section with your real GitHub repository URL.
- Update the `contact-modal` block in `index.html` with your real contact details. Replace `assets/cv-drive-qr.png` if the CV link changes.

## Deploy to GitHub Pages

1. Create a new GitHub repository.
2. Upload these files to the repository root:
   - `index.html`
   - `style.css`
   - `script.js`
   - `README.md`
3. Open the repository on GitHub.
4. Go to **Settings** → **Pages**.
5. Under **Build and deployment**, choose:
   - Source: **Deploy from a branch**
   - Branch: **main**
   - Folder: **/root**
6. Click **Save**.
7. GitHub will publish the website and show the Pages URL after deployment finishes.

## Technical Flow

The website presents the system flow:

Camera → YOLO Detection → Python Processing → Snap7/Ethernet → PLC S7-1200 → Washing Process

Key terms included in the data-transfer section:

- `bytearray`
- `DB1`
- `data_ready`
- `plc_ack`
