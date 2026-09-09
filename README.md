# Your apology letter site

Open `index.html` in a browser to preview it (double-click the file, or drag it into a browser tab). To publish it, you can drop the whole folder onto a static host like Netlify, Vercel, or GitHub Pages, or just email/AirDrop the folder to her.

## What to edit, and where

**1. The letter text** — `index.html`, inside `<div class="letter__body">`. Each paragraph is its own `<p class="letter__p">`. Replace the placeholder wording with your own; add or remove paragraphs freely, the scroll-reveal animation applies automatically to whatever `.letter__p` elements exist.

**2. Your name** — `index.html`, look for `<span id="senderName">[Your Name]</span>` near the bottom of the letter.

**3. Colors** — `style.css`, top of the file under `1. TOKENS`. Everything on the page reads from these six variables, so changing them restyles the whole site.

**4. Music** — put an MP3 in `assets/`, then in `index.html` uncomment and edit this line inside the `#bgMusic` element:
```html
<source src="assets/music.mp3" type="audio/mpeg">
```
Until you add a file, the music button gives a gentle "nothing here yet" nudge instead of doing nothing silently.

**5. Sound effects** — same idea, for `#sfxOpen` (plays when the envelope opens) and `#sfxClick` (plays when the letter is closed). Both are optional; leave them empty if you'd rather keep it silent.

## Notes
- Nothing autoplays — audio only starts after she taps the music button, which is required by every browser anyway.
- The site respects "reduce motion" accessibility settings automatically.
- Fully responsive; the envelope and letter both scale down for mobile.
