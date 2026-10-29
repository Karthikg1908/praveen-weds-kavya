# 💜 Praveen & Kavya — Wedding Invitation

> **Release V42.6.54:** refined the video invitation section wording to “A Little Note From Us”, “Our Wedding Film”, and “A glimpse of the love, laughter, and traditions we can’t wait to share with you.” Mobile autoplay behavior and all other features remain unchanged.

> **Release V42.6.53:** improved mobile video autoplay. The video is muted and inline from page load, starts when 90% visible, retries when buffering completes, and retains native controls so guests can unmute or start playback manually if their device blocks autoplay. All other features remain unchanged.


> **Release V42.6.52:** video invitation auto-plays when at least 90% of its frame is visible, with a muted fallback when required by the browser. The opening button reads “View Invitation”; all existing wedding features and the 2.5-second curtain reveal are preserved.

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
- Compact, swipeable photo carousel with arrows, 3.5-second auto-advance, and full-screen lightbox navigation
- Compact mobile navigation dropdown with accessible open/close control and tap-outside dismissal
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

The site uses Google Fonts and some remotely hosted Unsplash imagery. An internet connection is needed for those remote assets; local fallback imagery is included. The hero and gallery can use local images in `assets/` (for example, `hero-photo.JPG` and `gallery.JPG` through `gallery-5.JPG`). Remote sample images remain as fallbacks when a local photo is not present. Keep the exact filename capitalization on GitHub Pages.

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
- V42.6.50 keeps all existing wedding features and the 2.5-second curtain reveal, with compacted source whitespace and a more usable mobile navigation dropdown.

---

**✦ Thoughtfully crafted by Karthi ✦**


## Our Moments gallery

The gallery is a ten-photo carousel with touch swipe, previous/next arrows, slide indicators, automatic advance every 3.5 seconds, and a tap-to-open lightbox. Autoplay pauses while the gallery is off-screen, the browser tab is hidden, or the lightbox is open.

### Personal image files

Place personal images in `assets/` using these exact filenames (including capitalization): `gallery.JPG`, `gallery-2.JPG`, `gallery-3.JPG`, `gallery-4.JPG`, `gallery-5.JPG`, `gallery6.jpg`, `gallery7.jpg`, `gallery8.jpg`, `gallery9.jpg`, and `gallery10.jpg`. The gallery uses these local files first and falls back to sample photos if a file is missing. Keep your own photo files when replacing site code from the ZIP. The hero background uses `assets/hero-photo.JPG` when present.


## Latest visual refinements — V42.6.52
- Tightened spacing around the Wedding Days, Countdown, Memories in the Making, and Where We Celebrate sections.
- Updated the hero names to “Praveen weds Kavya”.
- Centered the mobile header monogram as `P ♥ K` and added a subtle reduced-motion-aware heartbeat.
- Preserved the existing 2.5-second curtain opening, navigation links, gallery carousel, music, venue details, and WhatsApp preview.


## V42.6.52 — Section spacing and heart monogram
- Tightened the vertical gap before the Wedding Days, Countdown, Memories in the Making, and Where We Celebrate sections.
- Hero title now reads “Praveen weds Kavya”.
- On mobile, the P ♥ K brand mark is centered in the header; the heart is red and has a subtle heartbeat motion. Reduced-motion preferences disable the heartbeat.
- Existing 2.5-second curtain opening, gallery slider, navigation links, wedding details, and WhatsApp preview are preserved.


## V42.6.52 — Video visibility autoplay and invitation CTA
- Video invitation starts when at least 90% of its frame is visible. If audible autoplay is blocked by the browser, playback retries muted; guests can use the native video controls for sound.
- Video pauses when it fully leaves the viewport and can resume on return unless the guest deliberately paused it while in view.
- Video intro copy now reads “Here's a glimpse of the celebration to come.”
- Opening button now reads “View Invitation” while retaining the petite ivory design and existing 2.5-second curtain animation.


## V42.6.52 — Video auto-play and invitation button
- The video invitation attempts playback when at least 90% of the video frame is visible and pauses when it fully leaves the viewport.
- Browsers that block audible auto-play trigger a muted retry; viewers can unmute from the standard video controls.
- Video invitation copy now reads “Here's a glimpse of the celebration to come.”
- The welcome-screen CTA now reads “View Invitation”; its petite ivory styling and existing 2.5-second curtain opening remain unchanged.
