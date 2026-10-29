(() => {
"use strict";
const qs = (selector, root = document) => root.querySelector(selector);
const qsa = (selector, root = document) => [...root.querySelectorAll(selector)];
const cover = qs("#luxuryCover");
const openInvitation = qs("#openInvitation");
const openingFrameShell = qs("#openingFrameShell");
const siteHeader = qs("#siteHeader");
const siteNav = qs("#siteNav");
const menuBtn = qs("#menuBtn");
const backToTop = qs("#backToTop");
const petalLayer = qs("#petalLayer");
const pageLoader = qs("#pageLoader");
const backgroundMusic = qs("#backgroundMusic");
const musicToggle = qs("#musicToggle");
const videoInviteSection = qs("#video-invite");
const weddingVideo = qs(".wedding-video");
const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
// -------------------------------------------------------
// FAST ESSENTIAL-ASSET LOADER
// Shows only until the opening/hero has a usable image and fonts are ready.
// A short timeout prevents slow external networks from holding the guest.
// -------------------------------------------------------
function dismissPageLoader() {
if (!pageLoader || pageLoader.classList.contains("is-ready")) return;
pageLoader.classList.add("is-ready");
window.setTimeout(() => pageLoader.remove(), prefersReducedMotion ? 0 : 420);
}
function waitForImage(src) {
if (!src) return Promise.resolve();
return new Promise(resolve => {
const probe = new Image();
let settled = false;
const finish = () => {
if (settled) return;
settled = true;
resolve();
};
probe.onload = finish;
probe.onerror = finish;
probe.decoding = "async";
probe.src = src;
if (probe.complete) finish();
});
}
function delay(ms) {
return new Promise(resolve => window.setTimeout(resolve, ms));
}
const heroPreload = qs('link[data-v40-hero-preload="true"]');
const remoteHeroReady = waitForImage(heroPreload?.href);
const localFallbackReady = waitForImage("assets/image-fallback.webp");
const fastFontsReady = document.fonts?.ready
? Promise.race([document.fonts.ready, delay(480)])
: Promise.resolve();
const essentialVisualsReady = Promise.all([
localFallbackReady,
Promise.race([remoteHeroReady, delay(720)]),
fastFontsReady
]);
Promise.race([
essentialVisualsReady,
delay(1250)
]).then(() => {
requestAnimationFrame(() => {
requestAnimationFrame(dismissPageLoader);
});
});
// -------------------------------------------------------
// BACKGROUND MUSIC
// Starts from the seal click, fades around Video Invitation,
// and resumes after the video ends or the guest scrolls away.
// -------------------------------------------------------
const MUSIC_VOLUME = 0.28;
const MUSIC_FADE_MS = prefersReducedMotion ? 0 : 720;
let musicEnabled = true;
let musicUnlocked = false;
let videoSectionActive = false;
let videoPlaybackCompleted = false;
let videoVisibilityRatio = 0;
let videoAutoplaySuppressed = false;
let videoAutoplayRequestPending = false;
let musicFadeFrame = 0;
let musicFadeToken = 0;
function refreshMusicButton() {
if (!musicToggle || !backgroundMusic) return;
const playing = !backgroundMusic.paused && !backgroundMusic.ended;
musicToggle.classList.toggle("is-playing", playing);
musicToggle.classList.toggle("is-muted", !musicEnabled);
musicToggle.setAttribute("aria-pressed", String(!musicEnabled));
musicToggle.setAttribute(
"aria-label",
musicEnabled ? "Mute background music" : "Play background music"
);
musicToggle.title = musicEnabled ? "Mute background music" : "Play background music";
}
function cancelMusicFade() {
musicFadeToken += 1;
if (musicFadeFrame) cancelAnimationFrame(musicFadeFrame);
musicFadeFrame = 0;
}
function fadeMusicTo(targetVolume, duration = MUSIC_FADE_MS, onComplete) {
if (!backgroundMusic) return;
cancelMusicFade();
const token = musicFadeToken;
const startVolume = backgroundMusic.volume;
const target = Math.max(0, Math.min(1, targetVolume));
if (duration <= 0 || Math.abs(startVolume - target) < 0.005) {
backgroundMusic.volume = target;
onComplete?.();
refreshMusicButton();
return;
}
const startedAt = performance.now();
const step = now => {
if (token !== musicFadeToken) return;
const progress = Math.min(1, (now - startedAt) / duration);
const eased = 1 - Math.pow(1 - progress, 3);
backgroundMusic.volume = startVolume + (target - startVolume) * eased;
if (progress < 1) {
musicFadeFrame = requestAnimationFrame(step);
} else {
musicFadeFrame = 0;
backgroundMusic.volume = target;
onComplete?.();
refreshMusicButton();
}
};
musicFadeFrame = requestAnimationFrame(step);
}
function shouldBackgroundMusicPlay() {
if (!backgroundMusic || !musicUnlocked || !musicEnabled || document.hidden) {
return false;
}
const videoCurrentlyPlaying =
weddingVideo &&
!weddingVideo.paused &&
!weddingVideo.ended;
if (videoCurrentlyPlaying) return false;
if (videoSectionActive && !videoPlaybackCompleted) return false;
return true;
}
function fadeOutAndPauseMusic() {
if (!backgroundMusic || backgroundMusic.paused) {
refreshMusicButton();
return;
}
fadeMusicTo(0, MUSIC_FADE_MS, () => {
backgroundMusic.pause();
backgroundMusic.volume = 0;
refreshMusicButton();
});
}
function fadeInBackgroundMusic() {
if (!backgroundMusic || !shouldBackgroundMusicPlay()) return;
cancelMusicFade();
backgroundMusic.volume = 0;
const playPromise = backgroundMusic.play();
if (playPromise && typeof playPromise.then === "function") {
playPromise
.then(() => fadeMusicTo(MUSIC_VOLUME))
.catch(refreshMusicButton);
} else {
fadeMusicTo(MUSIC_VOLUME);
}
}
function syncBackgroundMusic() {
if (!backgroundMusic) return;
if (!shouldBackgroundMusicPlay()) {
fadeOutAndPauseMusic();
return;
}
if (backgroundMusic.paused) {
fadeInBackgroundMusic();
} else {
fadeMusicTo(MUSIC_VOLUME);
}
}
function unlockAndStartBackgroundMusic() {
if (!backgroundMusic) return;
musicUnlocked = true;
musicEnabled = true;
cancelMusicFade();
backgroundMusic.volume = prefersReducedMotion ? MUSIC_VOLUME : 0.06;
const playPromise = backgroundMusic.play();
if (playPromise && typeof playPromise.then === "function") {
playPromise
.then(() => {
refreshMusicButton();
fadeMusicTo(MUSIC_VOLUME, prefersReducedMotion ? 0 : 700);
})
.catch(refreshMusicButton);
} else {
refreshMusicButton();
fadeMusicTo(MUSIC_VOLUME, prefersReducedMotion ? 0 : 700);
}
}
if (musicToggle && backgroundMusic) {
musicToggle.addEventListener("click", () => {
musicEnabled = !musicEnabled;
if (musicEnabled) {
musicUnlocked = true;
syncBackgroundMusic();
} else {
cancelMusicFade();
fadeOutAndPauseMusic();
}
refreshMusicButton();
});
backgroundMusic.addEventListener("play", refreshMusicButton);
backgroundMusic.addEventListener("pause", refreshMusicButton);
}
if (videoInviteSection && "IntersectionObserver" in window) {
const videoMusicObserver = new IntersectionObserver(
entries => {
const entry = entries[0];
videoSectionActive =
entry.isIntersecting && entry.intersectionRatio >= 0.28;
if (!videoSectionActive && weddingVideo?.ended) {
videoPlaybackCompleted = true;
}
syncBackgroundMusic();
},
{
threshold: [0, 0.28, 0.55]
}
);
videoMusicObserver.observe(videoInviteSection);
}
function setVideoFocus(active) {
videoInviteSection?.classList.toggle("is-video-playing", Boolean(active));
}
if (weddingVideo) {
// Mobile Safari/Chrome generally allow viewport-triggered autoplay only when
// the video is muted and plays inline from the moment the element is created.
weddingVideo.muted = true;
weddingVideo.defaultMuted = true;
weddingVideo.playsInline = true;
weddingVideo.setAttribute("muted", "");
weddingVideo.setAttribute("playsinline", "");
weddingVideo.setAttribute("webkit-playsinline", "");
weddingVideo.addEventListener("play", () => {
videoPlaybackCompleted = false;
setVideoFocus(true);
syncBackgroundMusic();
});
weddingVideo.addEventListener("ended", () => {
videoPlaybackCompleted = true;
setVideoFocus(false);
syncBackgroundMusic();
});
weddingVideo.addEventListener("pause", () => {
setVideoFocus(false);
// Respect a deliberate pause while the video is in view. A visibility
// pause or rejected play request must not count as a deliberate pause.
if (videoVisibilityRatio >= 0.9 && !weddingVideo.ended && !videoAutoplayRequestPending) {
videoAutoplaySuppressed = true;
}
syncBackgroundMusic();
});
// If the phone finishes buffering after becoming visible, try again then.
weddingVideo.addEventListener("canplay", () => {
if (videoVisibilityRatio >= 0.9 && weddingVideo.paused && !weddingVideo.ended && !videoAutoplaySuppressed) {
tryAutoPlayWeddingVideo();
}
});
}
// Start muted when 90% of the video frame is visible. Muted-first is essential
// on mobile, where audible autoplay is commonly denied even after a retry.
// The native controls remain enabled so guests can unmute or pause manually.
// Pause once the frame fully leaves the viewport; resume when it returns.
async function tryAutoPlayWeddingVideo() {
if (!weddingVideo || videoAutoplayRequestPending || videoAutoplaySuppressed || weddingVideo.ended || videoVisibilityRatio < 0.9) return;
videoAutoplayRequestPending = true;
try {
weddingVideo.muted = true;
weddingVideo.defaultMuted = true;
const playRequest = weddingVideo.play();
if (playRequest && typeof playRequest.then === "function") await playRequest;
} catch (_) {
// Some devices (for example, when Low Power Mode blocks autoplay) can still
// deny playback. Keep native controls available for a reliable manual start.
} finally {
videoAutoplayRequestPending = false;
}
}
if (weddingVideo && "IntersectionObserver" in window) {
const weddingVideoVisibilityObserver = new IntersectionObserver(entries => {
const entry = entries[0];
videoVisibilityRatio = entry.intersectionRatio;
const sufficientlyVisible = entry.isIntersecting && entry.intersectionRatio >= 0.9;
if (sufficientlyVisible) {
if (weddingVideo.paused && !weddingVideo.ended && !videoAutoplaySuppressed) {
tryAutoPlayWeddingVideo();
}
} else if (!entry.isIntersecting || entry.intersectionRatio <= 0.01) {
if (!weddingVideo.paused) weddingVideo.pause();
videoAutoplaySuppressed = false;
}
}, { threshold: [0, 0.5, 0.75, 0.9] });
weddingVideoVisibilityObserver.observe(weddingVideo);
}
document.addEventListener("visibilitychange", syncBackgroundMusic);
// -------------------------------------------------------
// OPENING
// -------------------------------------------------------
let isOpening = false;
function finishOpening() {
if (!cover) return;
cover.classList.add("is-hidden");
cover.setAttribute("aria-hidden", "true");
document.body.classList.remove("no-scroll");
document.body.classList.add("opening-complete");
window.scrollTo(0, 0);
launchOpeningPetals();
window.setTimeout(() => {
cover.style.display = "none";
}, prefersReducedMotion ? 0 : 520);
}
// V42.6.42: one uninterrupted curtain reveal. The panels begin
// moving on the first render after the tap; finishing is synchronized
// with the actual 2.5-second motion, with a safety fallback only.
function enterWedding() {
if (isOpening) return;
isOpening = true;
if (!cover || !openingFrameShell) {
finishOpening();
return;
}
openInvitation?.setAttribute("aria-disabled", "true");
openInvitation?.setAttribute("tabindex", "-1");
const leftCurtain = qs(".silk-curtain-left", cover);
const rightCurtain = qs(".silk-curtain-right", cover);
let completed = false;
let safetyTimer;
const done = () => {
if (completed) return;
completed = true;
window.clearTimeout(safetyTimer);
leftCurtain?.removeEventListener("animationend", onEnd);
rightCurtain?.removeEventListener("animationend", onEnd);
finishOpening();
};
const onEnd = event => {
if (event.target === leftCurtain && event.animationName === "v42641ContinuousLeft") {
done();
} else if (event.target === rightCurtain && event.animationName === "v42641ContinuousRight" && !leftCurtain) {
done();
}
};
// Do not delay activation, pause at the end, or use separate
// completion/fade timelines that interrupt the visible movement.
leftCurtain?.addEventListener("animationend", onEnd);
rightCurtain?.addEventListener("animationend", onEnd);
cover.classList.add(
"opening-active", "curtain-activated", "curtain-opening", "opening-frame-splitting"
);
// Only used if animation events do not fire (e.g. browser throttling).
safetyTimer = window.setTimeout(done, 2900);
}
if (openInvitation) {
openInvitation.addEventListener("click", () => {
unlockAndStartBackgroundMusic();
enterWedding();
});
} else {
document.body.classList.remove("no-scroll");
document.body.classList.add("opening-complete");
}
// -------------------------------------------------------
// HEADER / MENU / BACK TO TOP / PROGRESS
// -------------------------------------------------------
const scrollProgress = qs("#scrollProgress");
const scrollProgressFill = qs("#scrollProgressFill");
const scrollProgressFlower = qs("#scrollProgressFlower");
let scrollTicking = false;
function updateScrollUI() {
const y = window.scrollY || document.documentElement.scrollTop || 0;
siteHeader?.classList.toggle("scrolled", y > 40);
backToTop?.classList.toggle("show", y > 520);
if (scrollProgress && scrollProgressFill && scrollProgressFlower) {
const max = document.documentElement.scrollHeight - window.innerHeight;
const progress = max > 0 ? Math.min(1, Math.max(0, y / max)) : 0;
scrollProgressFill.style.transform = `scaleY(${progress})`;
scrollProgressFlower.style.top = `${progress * 100}%`;
scrollProgress.classList.toggle("visible", y > 120);
}
scrollTicking = false;
}
function requestScrollUIUpdate() {
if (scrollTicking) return;
scrollTicking = true;
requestAnimationFrame(updateScrollUI);
}
updateScrollUI();
window.addEventListener("scroll", requestScrollUIUpdate, { passive: true });
window.addEventListener("resize", requestScrollUIUpdate, { passive: true });
backToTop?.addEventListener("click", () => {
window.scrollTo({ top: 0, behavior: prefersReducedMotion ? "auto" : "smooth" });
});
if (menuBtn && siteNav) {
const setNavOpen = open => {
siteNav.classList.toggle("open", open);
menuBtn.setAttribute("aria-expanded", String(open));
menuBtn.setAttribute("aria-label", open ? "Close navigation menu" : "Open navigation menu");
};
menuBtn.addEventListener("click", () => {
setNavOpen(!siteNav.classList.contains("open"));
});
qsa("a", siteNav).forEach(link => {
link.addEventListener("click", () => setNavOpen(false));
});
document.addEventListener("pointerdown", event => {
if (!siteNav.classList.contains("open")) return;
if (siteNav.contains(event.target) || menuBtn.contains(event.target)) return;
setNavOpen(false);
}, { passive: true });
}
// -------------------------------------------------------
// COUNTDOWN
// -------------------------------------------------------
const countdownRoot = qs(".countdown");
const countdownNodes = {
days: qs("#days"),
hours: qs("#hours"),
minutes: qs("#minutes"),
seconds: qs("#seconds")
};
const muhurthamTime = new Date("2026-12-02T09:30:00+05:30").getTime();
const weddingDateKey = "2026-12-02";
const weddingDayBanner = qs("#weddingDayBanner");
let countdownTimer = null;
let countdownState = "counting";
function getIndiaDateKey(date = new Date()) {
const parts = new Intl.DateTimeFormat("en-CA", {
timeZone: "Asia/Kolkata",
year: "numeric",
month: "2-digit",
day: "2-digit"
}).formatToParts(date);
const values = Object.fromEntries(parts.map(part => [part.type, part.value]));
return `${values.year}-${values.month}-${values.day}`;
}
function renderCountdownMessage(message, symbol = "♥", state = "special") {
if (!countdownRoot || countdownState === state) return;
countdownState = state;
countdownRoot.innerHTML = `
      <div class="count-card countdown-complete countdown-special-state" style="grid-column:1/-1">
        <span>${symbol}</span>
        <small>${message}</small>
      </div>`;
}
function updateCountdown() {
if (!countdownRoot) return;
const indiaDateKey = getIndiaDateKey();
const isWeddingDay = indiaDateKey === weddingDateKey;
const isAfterWeddingDay = indiaDateKey > weddingDateKey;
if (weddingDayBanner) weddingDayBanner.hidden = !isWeddingDay;
if (isWeddingDay) {
renderCountdownMessage("Today Is The Day ♥", "✦", "wedding-day");
return;
}
if (isAfterWeddingDay) {
renderCountdownMessage("Thank You for Celebrating With Us", "♥", "after-wedding");
return;
}
const distance = Math.max(0, muhurthamTime - Date.now());
const values = {
days: Math.floor(distance / 86400000),
hours: Math.floor(distance / 3600000) % 24,
minutes: Math.floor(distance / 60000) % 60,
seconds: Math.floor(distance / 1000) % 60
};
Object.entries(values).forEach(([key, value]) => {
if (countdownNodes[key]) {
countdownNodes[key].textContent = String(value).padStart(2, "0");
}
});
}
updateCountdown();
if (countdownRoot) {
countdownTimer = window.setInterval(updateCountdown, 1000);
}
// -------------------------------------------------------
// REVEAL ON SCROLL
// -------------------------------------------------------
const revealItems = qsa(".reveal, .reveal-left, .reveal-right");
if ("IntersectionObserver" in window && !prefersReducedMotion) {
const revealObserver = new IntersectionObserver(
entries => {
entries.forEach(entry => {
if (!entry.isIntersecting) return;
entry.target.classList.add("visible");
revealObserver.unobserve(entry.target);
});
},
{ threshold: 0.12, rootMargin: "0px 0px -4% 0px" }
);
revealItems.forEach(item => revealObserver.observe(item));
} else {
revealItems.forEach(item => item.classList.add("visible"));
}
// -------------------------------------------------------
// BRIEF OPENING PETALS
// -------------------------------------------------------
function launchOpeningPetals() {
if (!petalLayer || prefersReducedMotion) return;
petalLayer.replaceChildren();
petalLayer.classList.add("active");
const count = window.innerWidth < 640 ? 12 : 20;
const types = ["rose", "jasmine", "champagne"];
for (let index = 0; index < count; index += 1) {
const petal = document.createElement("span");
petal.className = `flower-petal ${types[index % types.length]}`;
petal.style.setProperty("--left", `${Math.random() * 100}%`);
petal.style.setProperty("--delay", `${(Math.random() * 1.1).toFixed(2)}s`);
petal.style.setProperty("--duration", `${(3 + Math.random() * 1.5).toFixed(2)}s`);
petal.style.setProperty("--drift", `${(-65 + Math.random() * 130).toFixed(0)}px`);
petal.style.setProperty("--spin", `${(180 + Math.random() * 460).toFixed(0)}deg`);
petal.style.setProperty("--scale", `${(0.7 + Math.random() * 0.5).toFixed(2)}`);
petalLayer.appendChild(petal);
}
window.setTimeout(() => {
petalLayer.classList.remove("active");
petalLayer.replaceChildren();
}, 5000);
}
// -------------------------------------------------------
// GALLERY LIGHTBOX
// -------------------------------------------------------
const galleryItems = qsa(".gallery .lightbox-item");
const galleryCarousel = qs("#momentsCarousel");
const galleryPrevious = qs("#galleryPrevious");
const galleryNext = qs("#galleryNext");
const galleryDots = qs("#galleryCarouselDots");
let activeGallerySlideIndex = 0;
let galleryAutoplayTimer = 0;
let galleryTouchStartX = 0;
let galleryTouchStartY = 0;
let gallerySuppressClickUntil = 0;
const galleryAutoplayPauseReasons = new Set(["offscreen"]);
const GALLERY_AUTOPLAY_MS = 3500;
const photoLightbox = qs("#photoLightbox");
const lightboxImage = qs("#lightboxImage");
const lightboxCounter = qs("#lightboxCounter");
const lightboxClose = qs("#lightboxClose");
const lightboxPrev = qs("#lightboxPrev");
const lightboxNext = qs("#lightboxNext");
let currentPhotoIndex = 0;
let touchStartX = 0;
let previouslyFocusedElement = null;
// Preload and decode gallery images after the essential page assets are ready.
// This keeps first paint light while making lightbox swipes feel immediate.
const galleryPreloadCache = new Map();
function gallerySourceAt(index) {
const item = galleryItems[index];
const image = item ? qs("img", item) : null;
return image ? (image.currentSrc || image.getAttribute("src") || "") : "";
}
function preloadGalleryPhoto(index) {
if (!galleryItems.length) return Promise.resolve();
const normalizedIndex = (index + galleryItems.length) % galleryItems.length;
const src = gallerySourceAt(normalizedIndex);
if (!src) return Promise.resolve();
if (galleryPreloadCache.has(src)) return galleryPreloadCache.get(src);
const task = new Promise(resolve => {
const image = new Image();
image.decoding = "async";
image.fetchPriority = "low";
image.onload = async () => {
try {
if (typeof image.decode === "function") await image.decode();
} catch (_) {
// The browser cache is still useful even if decode() rejects.
}
resolve();
};
image.onerror = resolve;
image.src = src;
if (image.complete) image.onload();
});
galleryPreloadCache.set(src, task);
return task;
}
function warmAdjacentGalleryPhotos(index) {
preloadGalleryPhoto(index);
preloadGalleryPhoto(index + 1);
preloadGalleryPhoto(index - 1);
}
function pauseGalleryAutoplay(reason) {
galleryAutoplayPauseReasons.add(reason);
if (galleryAutoplayTimer) window.clearTimeout(galleryAutoplayTimer);
galleryAutoplayTimer = 0;
}
function scheduleGalleryAutoplay() {
if (galleryAutoplayTimer) window.clearTimeout(galleryAutoplayTimer);
galleryAutoplayTimer = 0;
if (!galleryCarousel || galleryItems.length < 2 || document.hidden || galleryAutoplayPauseReasons.size) return;
galleryAutoplayTimer = window.setTimeout(() => {
galleryAutoplayTimer = 0;
if (document.hidden || galleryAutoplayPauseReasons.size) return;
setGallerySlide(activeGallerySlideIndex + 1, 1, false);
scheduleGalleryAutoplay();
}, GALLERY_AUTOPLAY_MS);
}
function resumeGalleryAutoplay(reason) {
galleryAutoplayPauseReasons.delete(reason);
scheduleGalleryAutoplay();
}
function setGallerySlide(index, direction = 1, resetAutoplay = true) {
if (!galleryItems.length) return;
activeGallerySlideIndex = (index + galleryItems.length) % galleryItems.length;
galleryItems.forEach((item, itemIndex) => {
const active = itemIndex === activeGallerySlideIndex;
item.classList.remove("is-active");
item.style.setProperty("--gallery-enter-x", active ? (direction < 0 ? "-28px" : "28px") : (direction < 0 ? "28px" : "-28px"));
item.setAttribute("aria-hidden", String(!active));
item.setAttribute("aria-current", String(active));
item.tabIndex = active ? 0 : -1;
if (active) {
void item.offsetWidth;
item.classList.add("is-active");
}
});
if (galleryDots) {
qsa(".gallery-carousel-dot", galleryDots).forEach((dot, dotIndex) => {
const active = dotIndex === activeGallerySlideIndex;
dot.setAttribute("aria-pressed", String(active));
dot.setAttribute("aria-label", `${active ? "Current photo" : "Show photo"} ${dotIndex + 1} of ${galleryItems.length}`);
});
}
warmAdjacentGalleryPhotos(activeGallerySlideIndex);
if (resetAutoplay) scheduleGalleryAutoplay();
}
function moveGallerySlide(step) {
setGallerySlide(activeGallerySlideIndex + step, step, true);
}
function warmFullGallery() {
// A carousel only needs the visible image and its neighbors warmed; avoid
// pulling every gallery image onto a phone before the guest reaches it.
if (galleryCarousel) {
warmAdjacentGalleryPhotos(activeGallerySlideIndex);
return;
}
galleryItems.forEach((_, index) => preloadGalleryPhoto(index));
}
if (galleryCarousel && galleryItems.length) {
galleryItems.forEach((item, index) => {
const active = index === 0;
item.classList.toggle("is-active", active);
item.setAttribute("aria-hidden", String(!active));
item.setAttribute("aria-current", String(active));
item.tabIndex = active ? 0 : -1;
});
if (galleryDots) {
galleryDots.replaceChildren();
galleryItems.forEach((_, index) => {
const dot = document.createElement("button");
dot.type = "button";
dot.className = "gallery-carousel-dot";
dot.setAttribute("aria-label", `Show photo ${index + 1} of ${galleryItems.length}`);
dot.setAttribute("aria-pressed", String(index === 0));
dot.addEventListener("click", () => setGallerySlide(index, index >= activeGallerySlideIndex ? 1 : -1, true));
galleryDots.appendChild(dot);
});
}
galleryPrevious?.addEventListener("click", () => moveGallerySlide(-1));
galleryNext?.addEventListener("click", () => moveGallerySlide(1));
if (window.matchMedia("(hover: hover) and (pointer: fine)").matches) {
galleryCarousel.addEventListener("mouseenter", () => pauseGalleryAutoplay("pointer"));
galleryCarousel.addEventListener("mouseleave", () => resumeGalleryAutoplay("pointer"));
}
galleryCarousel.addEventListener("touchstart", event => {
galleryTouchStartX = event.changedTouches[0]?.clientX ?? 0;
galleryTouchStartY = event.changedTouches[0]?.clientY ?? 0;
}, { passive: true });
galleryCarousel.addEventListener("touchend", event => {
const endX = event.changedTouches[0]?.clientX ?? galleryTouchStartX;
const endY = event.changedTouches[0]?.clientY ?? galleryTouchStartY;
const dx = endX - galleryTouchStartX;
const dy = endY - galleryTouchStartY;
if (Math.abs(dx) < 44 || Math.abs(dx) < Math.abs(dy) * 1.2) return;
gallerySuppressClickUntil = Date.now() + 450;
moveGallerySlide(dx < 0 ? 1 : -1);
}, { passive: true });
galleryCarousel.addEventListener("keydown", event => {
if (event.key === "ArrowLeft") {
event.preventDefault();
moveGallerySlide(-1);
} else if (event.key === "ArrowRight") {
event.preventDefault();
moveGallerySlide(1);
}
});
/* Pause the carousel briefly while a guest touches, clicks, or navigates it. */
const galleryInteractionRegion = qs("#gallery") || galleryCarousel;
let galleryInteractionResumeTimer = 0;
const pauseGalleryForInteraction = () => {
pauseGalleryAutoplay("interaction");
if (galleryInteractionResumeTimer) window.clearTimeout(galleryInteractionResumeTimer);
galleryInteractionResumeTimer = 0;
};
const resumeGalleryAfterInteraction = () => {
if (galleryInteractionResumeTimer) window.clearTimeout(galleryInteractionResumeTimer);
galleryInteractionResumeTimer = window.setTimeout(() => {
galleryInteractionResumeTimer = 0;
resumeGalleryAutoplay("interaction");
}, 1100);
};
galleryInteractionRegion?.addEventListener("pointerdown", pauseGalleryForInteraction, { passive: true });
galleryInteractionRegion?.addEventListener("pointerup", resumeGalleryAfterInteraction, { passive: true });
galleryInteractionRegion?.addEventListener("pointercancel", resumeGalleryAfterInteraction, { passive: true });
galleryInteractionRegion?.addEventListener("keydown", event => {
if (["ArrowLeft", "ArrowRight", "Enter", " "].includes(event.key)) {
pauseGalleryForInteraction();
resumeGalleryAfterInteraction();
}
});
if ("IntersectionObserver" in window) {
const galleryVisibilityObserver = new IntersectionObserver(entries => {
const visible = Boolean(entries[0]?.isIntersecting);
if (visible) {
resumeGalleryAutoplay("offscreen");
warmAdjacentGalleryPhotos(activeGallerySlideIndex);
} else {
pauseGalleryAutoplay("offscreen");
}
}, { threshold: 0.18 });
galleryVisibilityObserver.observe(galleryCarousel);
} else {
resumeGalleryAutoplay("offscreen");
}
document.addEventListener("visibilitychange", () => {
if (document.hidden) pauseGalleryAutoplay("page-hidden");
else resumeGalleryAutoplay("page-hidden");
});
}
if (galleryItems.length) {
const scheduleGalleryWarmup = () => {
if ("requestIdleCallback" in window) {
window.requestIdleCallback(warmFullGallery, { timeout: 2200 });
} else {
window.setTimeout(warmFullGallery, 900);
}
};
if (document.readyState === "complete") scheduleGalleryWarmup();
else window.addEventListener("load", scheduleGalleryWarmup, { once: true });
}
function renderLightboxPhoto(direction = 0) {
if (!lightboxImage || galleryItems.length === 0) return;
const source = qs("img", galleryItems[currentPhotoIndex]);
if (!source) return;
lightboxImage.classList.remove("slide-next", "slide-prev");
void lightboxImage.offsetWidth;
if (direction > 0) lightboxImage.classList.add("slide-next");
if (direction < 0) lightboxImage.classList.add("slide-prev");
lightboxImage.src = source.currentSrc || source.src;
lightboxImage.alt = source.alt || "Wedding memory";
if (lightboxCounter) {
lightboxCounter.textContent = `${currentPhotoIndex + 1} / ${galleryItems.length}`;
}
}
function openLightbox(index) {
if (!photoLightbox || galleryItems.length === 0) return;
pauseGalleryAutoplay("lightbox");
previouslyFocusedElement = document.activeElement;
currentPhotoIndex = index;
warmAdjacentGalleryPhotos(currentPhotoIndex);
renderLightboxPhoto();
photoLightbox.classList.add("open");
photoLightbox.setAttribute("aria-hidden", "false");
document.body.classList.add("lightbox-open");
lightboxClose?.focus({ preventScroll: true });
}
function closeLightbox() {
if (!photoLightbox) return;
photoLightbox.classList.remove("open");
photoLightbox.setAttribute("aria-hidden", "true");
document.body.classList.remove("lightbox-open");
resumeGalleryAutoplay("lightbox");
if (lightboxImage) {
lightboxImage.classList.remove("slide-next", "slide-prev");
}
if (previouslyFocusedElement instanceof HTMLElement) {
previouslyFocusedElement.focus({ preventScroll: true });
}
}
function moveLightbox(step) {
if (galleryItems.length === 0) return;
currentPhotoIndex = (currentPhotoIndex + step + galleryItems.length) % galleryItems.length;
warmAdjacentGalleryPhotos(currentPhotoIndex);
renderLightboxPhoto(step);
}
galleryItems.forEach((item, index) => {
item.addEventListener("click", event => {
if (Date.now() < gallerySuppressClickUntil) {
event.preventDefault();
event.stopPropagation();
return;
}
if (!item.classList.contains("is-active")) return;
openLightbox(index);
});
item.addEventListener("keydown", event => {
if (event.key !== "Enter" && event.key !== " ") return;
event.preventDefault();
openLightbox(index);
});
});
lightboxClose?.addEventListener("click", closeLightbox);
lightboxPrev?.addEventListener("click", () => moveLightbox(-1));
lightboxNext?.addEventListener("click", () => moveLightbox(1));
photoLightbox?.addEventListener("click", event => {
if (event.target instanceof Element && event.target.hasAttribute("data-lightbox-close")) {
closeLightbox();
}
});
document.addEventListener("keydown", event => {
if (!photoLightbox?.classList.contains("open")) return;
if (event.key === "Escape") {
closeLightbox();
return;
}
if (event.key === "ArrowLeft") {
moveLightbox(-1);
return;
}
if (event.key === "ArrowRight") {
moveLightbox(1);
return;
}
// Keep keyboard focus inside the open photo viewer.
if (event.key === "Tab") {
const focusable = [lightboxClose, lightboxPrev, lightboxNext].filter(Boolean);
if (!focusable.length) return;
const first = focusable[0];
const last = focusable[focusable.length - 1];
if (event.shiftKey && document.activeElement === first) {
event.preventDefault();
last.focus();
} else if (!event.shiftKey && document.activeElement === last) {
event.preventDefault();
first.focus();
}
}
});
photoLightbox?.addEventListener(
"touchstart",
event => {
touchStartX = event.changedTouches[0]?.clientX ?? 0;
},
{ passive: true }
);
photoLightbox?.addEventListener(
"touchend",
event => {
const endX = event.changedTouches[0]?.clientX ?? touchStartX;
const distance = endX - touchStartX;
if (Math.abs(distance) < 45) return;
moveLightbox(distance < 0 ? 1 : -1);
},
{ passive: true }
);
// -------------------------------------------------------
// TOUCH EVENT CARD FOCUS — one implementation only
// -------------------------------------------------------
const eventTimeline = qs(".royal-date-timeline");
const eventCards = qsa(".royal-date-item");
function clearEventFocus() {
eventCards.forEach(card => card.classList.remove("is-focused"));
eventTimeline?.classList.remove("has-mobile-focus");
}
if (window.matchMedia("(hover: none)").matches) {
eventCards.forEach(card => {
card.addEventListener("click", () => {
const alreadyFocused = card.classList.contains("is-focused");
clearEventFocus();
if (!alreadyFocused) {
card.classList.add("is-focused");
eventTimeline?.classList.add("has-mobile-focus");
}
});
});
document.addEventListener("click", event => {
if (!(event.target instanceof Element)) return;
if (event.target.closest(".royal-date-item")) return;
clearEventFocus();
});
}
// -------------------------------------------------------
// SHARE INVITATION
// Native share sheet on supported mobile devices; clipboard fallback elsewhere.
// -------------------------------------------------------
const shareInvitationButton = qs("#shareInvitationButton");
const shareInvitationLabel = qs("#shareInvitationLabel");
const shareInvitationStatus = qs("#shareInvitationStatus");
async function copyInvitationLink(url) {
if (navigator.clipboard && window.isSecureContext) {
await navigator.clipboard.writeText(url);
return;
}
const helper = document.createElement("textarea");
helper.value = url;
helper.setAttribute("readonly", "");
helper.style.position = "fixed";
helper.style.opacity = "0";
document.body.appendChild(helper);
helper.select();
document.execCommand("copy");
helper.remove();
}
if (shareInvitationButton) {
shareInvitationButton.addEventListener("click", async () => {
const shareUrl = "https://karthikg1908.github.io/praveen-weds-kavya/?v=4248";
const shareData = {
title: "Praveen & Kavya | Wedding Invitation",
text: "Join us as we celebrate the wedding of Praveen & Kavya on 02 December 2026.",
url: shareUrl
};
if (navigator.share) {
try {
await navigator.share(shareData);
if (shareInvitationStatus) shareInvitationStatus.textContent = "Invitation shared ♥";
return;
} catch (error) {
if (error?.name === "AbortError") return;
}
}
try {
await copyInvitationLink(shareUrl);
if (shareInvitationLabel) shareInvitationLabel.textContent = "Link Copied ✓";
if (shareInvitationStatus) shareInvitationStatus.textContent = "Invitation link copied to clipboard";
window.setTimeout(() => {
if (shareInvitationLabel) shareInvitationLabel.textContent = "Invite Your Loved Ones Along";
if (shareInvitationStatus) shareInvitationStatus.textContent = "";
}, 2600);
} catch {
if (shareInvitationStatus) shareInvitationStatus.textContent = "Please copy the page link from your browser.";
}
});
}
// -------------------------------------------------------
// HOSTED-PAGE RELIABILITY
// -------------------------------------------------------
qsa('img[data-remote-image="true"]').forEach(img => {
const markLoaded = () => img.classList.add("image-loaded");
img.addEventListener("load", markLoaded, { once: true });
img.addEventListener("error", () => {
img.classList.add("image-load-error");
const parent = img.parentElement;
if (parent) parent.classList.add("has-image-error");
const fallback = img.dataset.fallbackSrc;
const fallbackUrl = fallback ? new URL(fallback, document.baseURI).href : "";
const localFallbackUrl = new URL("assets/image-fallback.webp", document.baseURI).href;
img.removeAttribute("data-remote-image");
if (fallbackUrl && img.src !== fallbackUrl) {
  // Try the intended/sample photo first; if that is offline too, use the local fallback.
  img.addEventListener("error", () => {
    if (img.src !== localFallbackUrl) img.src = localFallbackUrl;
  }, { once: true });
  img.src = fallbackUrl;
} else if (img.src !== localFallbackUrl) {
  img.src = localFallbackUrl;
}
}, { once: true });
if (img.complete && img.naturalWidth > 0) markLoaded();
});
// Close the mobile navigation with Escape.
document.addEventListener("keydown", event => {
if (event.key !== "Escape") return;
if (siteNav?.classList.contains("open")) {
siteNav.classList.remove("open");
menuBtn?.setAttribute("aria-expanded", "false");
menuBtn?.setAttribute("aria-label", "Open navigation menu");
menuBtn?.focus({ preventScroll: true });
}
});
// Restore UI correctly after browser back/forward cache navigation.
window.addEventListener("pageshow", requestScrollUIUpdate);
// -------------------------------------------------------
// MINI NAV ACTIVE SECTION
// -------------------------------------------------------
const miniNavLinks = qsa("#siteNav .mini-nav-link");
const miniNavTargets = miniNavLinks
.map(link => {
const selector = link.getAttribute("href");
return selector && selector.startsWith("#")
? document.querySelector(selector)
: null;
})
.filter(Boolean);
if ("IntersectionObserver" in window && miniNavTargets.length) {
const navObserver = new IntersectionObserver(
entries => {
const visible = entries
.filter(entry => entry.isIntersecting)
.sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
if (!visible) return;
miniNavLinks.forEach(link => {
const active = link.getAttribute("href") === `#${visible.target.id}`;
link.classList.toggle("is-active", active);
if (active) link.setAttribute("aria-current", "location");
else link.removeAttribute("aria-current");
});
},
{
rootMargin: "-28% 0px -58% 0px",
threshold: [0.02, 0.15, 0.35]
}
);
miniNavTargets.forEach(section => navObserver.observe(section));
}
})();