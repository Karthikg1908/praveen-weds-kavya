# 💜 Praveen & Kavya — Wedding Invitation

[![Visit Wedding Invitation](https://img.shields.io/badge/View-Live%20Invitation-7A5A94?style=for-the-badge)](https://karthikg1908.github.io/praveen-weds-kavya/)
[![Hosted on GitHub Pages](https://img.shields.io/badge/Hosted%20on-GitHub%20Pages-36304B?style=for-the-badge&logo=github)](https://github.com/karthikg1908/praveen-weds-kavya)
[![HTML CSS JavaScript](https://img.shields.io/badge/Built%20with-HTML%20%7C%20CSS%20%7C%20JS-C9A878?style=for-the-badge)](#technical-details)

**ಶ್ರೀ ಗಣೇಶನ ಅನುಗ್ರಹದೊಂದಿಗೆ**  
**Praveen & Kavya**  
*ಎರಡು ಹೃದಯಗಳ ಶುಭ ಸಂಗಮ*

Welcome to a celebration of love, togetherness, and a beautiful new beginning.

[**View the wedding invitation →**](https://karthikg1908.github.io/praveen-weds-kavya/)

![Praveen and Kavya wedding invitation preview](assets/praveen-kavya-wedding-preview-v2.jpg)

## Wedding celebrations

| Occasion | Date | Time |
| --- | --- | --- |
| **Reception** | Tuesday, 1 December 2026 | 6:30 PM onwards |
| **Muhurtham** | Wednesday, 2 December 2026 | 9:30 AM |
| **Beegara Oota** | Sunday, 13 December 2026 | 12:30 PM onwards |

**Wedding venue:** Purvaja Samudhaya Bhavana, Magadi–Kunigal Road, Aladakattepalya, Karnataka.  
[Get directions to the wedding venue](https://www.google.com/maps/search/?api=1&query=Purvaja+Samudhaya+Bhavana+Aladakattepalya)

**Beegara Oota venue:** HB Function Hall, Magadi Main Road, Kamakshipalya, Bengaluru.  
[Get directions to Beegara Oota](https://www.google.com/maps/search/?api=1&query=HB+Function+Hall+Magadi+Main+Road+Kamakshipalya)

## Invitation highlights

- Cinematic floral welcome card with Ganesha blessing in Kannada
- Smooth **2.5-second continuous** ivory-lavender curtain reveal
- Premium lavender, plum, ivory, and champagne-gold design
- Embedded wedding video and background music with playback controls
- Couple introduction, event dates, and live muhurtham countdown
- Photo gallery with full-screen lightbox navigation
- Wedding and Beegara Oota locations with Google Maps directions
- One-tap invitation sharing, including a WhatsApp-friendly preview
- Wedding-day quick actions and responsive mobile layout

## Technical details

This is a **static website** written in **HTML, CSS, and JavaScript**. No Node.js, build pipeline, database, login, or paid hosting is required.

```text
praveen-weds-kavya/
├── index.html                         # Pages and social preview metadata
├── style.css                          # Layout, colors and animations
├── script.js                          # Interactions and countdown
├── background-music.mp3               # Background music
├── wedding-invite.mp4                 # Wedding invitation video
├── assets/                            # Icons, photos, curtains and social preview
└── README.md                          # This guide
```

The site uses Google Fonts and some remotely hosted Unsplash imagery. An internet connection is needed for those remote assets; local fallback imagery is included. To replace the sample photographs, update the image URLs in `index.html` and relevant CSS while retaining the gallery structure.

## Publish with GitHub Pages

1. Upload all files and the `assets` folder to the **root** of the `praveen-weds-kavya` repository (not inside an extra extracted folder).
2. In GitHub, open **Settings → Pages**.
3. Select **Deploy from a branch**, branch **`main`**, folder **`/ (root)`**, then save.
4. Open the [live invitation](https://karthikg1908.github.io/praveen-weds-kavya/) after deployment.

For local preview, open `index.html` in a browser. If browser security restrictions affect local media or links, run a simple local server:

```bash
python -m http.server 8000
```

Then visit `http://localhost:8000/`.

## WhatsApp sharing preview

The page uses Open Graph (`og:title`, `og:description`, `og:image`, `og:url`) metadata and a **1200 × 630** social preview image at:

`assets/praveen-kavya-wedding-preview-v2.jpg`

The metadata points to the GitHub Pages URL for this repository. When sharing, use the **public GitHub Pages link** rather than a file URL or a repository download link. WhatsApp may cache older previews; after deploying changes, allow the preview cache to refresh before retesting. Keep the image published at the path used by `og:image`.

## Important notes

- Please keep `index.html`, `style.css`, `script.js`, `background-music.mp3`, `wedding-invite.mp4`, and the referenced assets together.
- The curtain animation and interactive sections depend on the existing HTML class names, CSS, and JavaScript; avoid renaming them without updating references.
- This cleanup release retains the appearance and behavior of **V42.6.48** while removing obsolete revision notes and unreferenced assets.

---

**✦ Thoughtfully crafted by Karthi ✦**
