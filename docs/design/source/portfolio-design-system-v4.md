DESIGN SYSTEM — Portfolio
Status of this document: v4, re-derived from the code supplied in the Oct 2026 snapshot, not from intent.
v3 described the repo before the colour tokens were re-tuned, layout.tsx gained its metadata / JSON-LD / theme script, the Header mobile menu became inert, and the Home page gained the LogoLoop tech strip. This version describes what the code renders today.
Sections marked As-built describe what exists. Sections marked Rule are constraints for future work.
Where the two disagree, As-built wins for "what exists", Rule wins for "what to do next". Never "fix" an As-built item unless the task asks for it (see §13).
Contrast ratios were computed from the hex values with the WCAG 2.x formula; class names were read from the source. Nothing here was measured in a browser.

Verification scope of v4. Re-read line by line this pass: app/layout.tsx, app/page.tsx, app/globals.css, components/Header/header.tsx, components/Footer/footer.tsx, package.json, tailwind.config.js. Everything about components and routes not in that list (About, Contact, Blog, Services, WorkCards, TextPressure, TextLoop internals, BlurText, FallingText, PixelTransition, MorphSlider, Magnet, LogoLoop internals) is carried over from v3 and marked (v3) where it matters. Treat (v3) claims as last-known, and re-verify them when you touch that file.
1. Design Intent
A personal front-end developer portfolio that feels made by a person, not assembled from a SaaS template.
Core qualities:
- expressive, variable-axis typography as the memorable moment (the hero);
- monospace body voice;
- warm two-mode palette (cream ↔ deep navy) with one coral accent;
- editorial split layouts, generous whitespace;
- interactive motion that responds to the visitor (pointer, hover, touch, scroll), not motion that plays on its own;
- experimental but usable, responsive first.
Craft is communicated through details, not decoration. Spend the boldness in one place: the hero. Everything around it stays quiet.
2. Visual Foundation (As-built)
2.1 Palette — token-driven
Colours are CSS custom properties in app/globals.css (:root for light, html.dark for dark). <body> in layout.tsx carries no colour classes; globals.css sets body { color: var(--text-primary); background-color: var(--background); }. The body has no permanent colour transition any more (see §2.4).
Role (vocabulary)	Token	Light	Dark	Where it appears
canvas	--background (also --surface)	#EDDBB5 cream	#1B3E5C navy	page background
ink (default text)	--text-primary (= --foreground)	#2A5A44 deep green	#F2B138 gold	default body text, TextPressure, TextLoop, LogoLoop, header brand label, footer brand name
hard ink	--text-tertiary	#000000	#FFFFFF	footer text, CTA hover fill (v3); about/page.tsx also forces text-black dark:text-white on its <main> (v3)
accent	--accent	#FA6B48 coral	#FA6B48 coral	hover nav/footer links, Home CTA fill, Home name + role line, ribbon, scrollbar thumb, toggle border; card titles, tab pill, carousel dot (v3)
accent-text	--accent-text	#A8340C	#FF9A7C	text that must be accent-coloured and readable; in the files re-read this pass, used only for the active nav link (Header)
CTA	--cta-bg / -text / -hover-bg / -hover-text	#FA6B48 / #000 / #000 / #FA6B48	#C8440F / #FFF / #FFF / #C8440F	Home CTA uses -text, -hover-bg, -hover-text; its resting fill is --accent, not --cta-bg (see D20)
chrome — header	--nav-background / --nav-text	#FDFBF7 / #000	#0a0a0a / #FFF	Header, mobile menu
chrome — footer	--footer-background	#FDFBF7	#0a0a0a	Footer
theme toggle	--nav-toggle-bg / -text / -hover-text	#000 / #FFF / #4B5563	#FFF / #000 / #D1D5DB	square toggle button (its content is two <img>s, so the -text tokens have no visible effect)
hairline	--border	ink @ 20% (rgba(42,90,68,.20))	gold @ 20%	footer rules, scrollbar track
muted	--muted	#386850 (solid)	gold @ 90%	footer copyright
accent gradient	--gradient-accent	#FA6B48 → #FACC15	#FACC15 → #FA6B48	theme-toggle hover only
inverted surface	(literal classes) (v3)	bg-gray-900 (WorkCards) · bg-black (Contact, Services)	bg-white (WorkCards, Contact) · bg-[#FDFBF7] (Services)	cards; accent used for titles/pills on top of it
pixel	(literal)	#D2D2D4 (Home passes #d2d2d4)	same	PixelTransition overlay; idle face #09090b
slider	(literal) (v3)	#0c0c0e	same	MorphSlider / LazyMorphSlider background and placeholder
ribbon	(literal)	#FA6B48	same	TextLoop ribbon, passed as a prop from Home


Components on the canvas that use literal hex instead of tokens (v3): WorkCards placeholder/image wells and focus-ring offsets (#EDDBB5 / #1B3E5C), About portrait well, Contact/WorkCards/About accent (#FA6B48), Home ribbon (#FA6B48). Keep new work on the tokens where one exists; do not mass-convert existing literals unasked.
Important characteristics of the current system
1. There are still three surface systems: canvas (cream/navy), chrome (header/footer: warm off-white #FDFBF7 ↔ #0a0a0a), and inverted cards (v3). The inverted family is not uniform: WorkCards use gray-900, Contact and Services use black, and in dark mode Services uses #FDFBF7 while the others use white. Treat this as the current look; do not "harmonize" it unasked.
2. Dark mode is class-based (.dark on <html>) and the tokens follow that class. @custom-variant dark (&:where(.dark, .dark *)) is what makes Tailwind's dark: utilities follow it. There are no prefers-color-scheme variables; the OS theme is ignored on purpose (§2.4).
3. The canonical accent is #FA6B48. TextPressure still supports a colorCycle prop (v3), but Home does not use it, and Home passes textColor="" / strokeColor="" so the hero colour comes from CSS (var(--text-primary)).
4. Tokens with no reference in the files re-read this pass (Header, Footer, Home, layout, globals): --surface, --surface-elevated, --text-secondary, --card-background, --input-background, --focus-ring, --interactive-hover, --footer-text, --footer-muted, --footer-border, --cta-bg, and the --font-mono variable. Some may be used by the (v3) component files I did not re-read: grep var(--…) across app/ before deleting or wiring any of them.
5. Two tokens exist that v3 did not know about: --accent-text (readable accent for text) and the --cta-* family. They are the project's own answer to D1 and D3; adopt them in new work (see §2.2 Rule).
2.2 Measured contrast (WCAG 2.x, computed from the real values)
Pair	Ratio	Verdict
ink on canvas, light (#2A5A44 / #EDDBB5)	5.82	AA
ink on canvas, dark (#F2B138 / #1B3E5C)	5.88	AA
hard ink on canvas (black / cream)	15.4	AAA
hard ink on canvas (white / navy)	11.1	AAA
--muted on canvas, light (#386850 / #EDDBB5)	4.72	AA
--text-secondary on canvas, light (unused)	4.98	AA
accent on canvas, light (#FA6B48 / #EDDBB5) — Home name	2.12	fails, even for large text
accent on canvas, dark (#FA6B48 / #1B3E5C) — Home name	3.84	large text only
accent @ 80% opacity on canvas, light — Home role line	1.87	fails
accent @ 80% opacity on canvas, dark — Home role line	2.88	fails
accent-text on canvas, light (#A8340C / #EDDBB5)	4.87	AA
accent-text on canvas, dark (#FF9A7C / #1B3E5C)	5.38	AA
accent on header/footer, light (#FA6B48 / #FDFBF7) — nav hover, footer link hover, logo-label hover	2.80	fails AA
accent on header/footer, dark (#FA6B48 / #0a0a0a)	6.85	AA
accent-text on header, light (#A8340C / #FDFBF7) — active nav link	6.43	AA
accent-text on header, dark (#FF9A7C / #0a0a0a) — active nav link	9.58	AAA
ink on header/footer, light (#2A5A44 / #FDFBF7) — brand label, footer name	7.68	AAA
ink on header/footer, dark (#F2B138 / #0a0a0a)	10.48	AAA
--muted on footer, light (#386850 / #FDFBF7) — copyright	6.22	AA
--muted on footer, dark (gold @ 90% / #0a0a0a) — copyright	8.57	AAA
footer text: black on #FDFBF7 / white on #0a0a0a	20.3 / 19.8	AAA
black on accent (Home CTA label, light)	7.26	AAA
accent on black (Home CTA hover, light)	7.26	AAA
white on accent (Home CTA label, dark: --cta-text over bg-[var(--accent)])	2.89	fails AA
white on --cta-bg dark (#C8440F) — what the token pair was designed for	4.90	AA
#C8440F on white (Home CTA hover, dark)	4.90	AA
black on accent (Contact/Blog hover fill) (v3)	7.26	AAA
accent on black / on gray-900 (card titles) (v3)	7.26 / 6.13	AAA
gray-950 on white (dark-mode card titles) (v3)	≈19	AAA
gray-500 on navy (blog date, dark) (v3)	2.30	fails


Rule: accent works best as a fill or border with black text on it, or as text on black/near-black. For accent-coloured text on the canvas or on the light header, use --accent-text, not --accent. For a CTA fill use the pair --cta-bg + --cta-text (so dark mode gets #C8440F + white = 4.90), not --accent + white. Do not introduce new small --accent text on the light canvas or header. Do not put white text on a #FA6B48 fill in new work. Long-form or small copy on the canvas uses ink (now AA) or hard ink.
2.3 Colour usage rules
Use accent for: hover navigation, primary CTA fill, selected states (carousel dot, active tab pill), titles/pills on inverted cards, small icons, the ribbon, scrollbar thumb, toggle border.
Use --accent-text for the active nav state and for any new accent-coloured text.
Do not turn whole sections, backgrounds, or body text into accent.
Do not add a second accent. Do not introduce gradients as decoration (the only gradient is the theme-toggle hover; leave it).
2.4 Theme switching (As-built + Rule)
- Default is always light. The inline script in <head> (layout.tsx) reads localStorage.theme; only the value "dark" adds the dark class to <html>. A thrown localStorage access falls back to light. The OS/phone theme is deliberately not consulted so the light palette never changes by itself.
- Chrome "Auto Dark Mode" is blocked two ways: viewport.colorScheme = "only light" in layout.tsx and color-scheme: only light on :root. html.dark sets color-scheme: dark, which wins while the site's own toggle is on.
- Toggle (header.tsx): flips the class, writes localStorage.theme ("dark" / "light"), and adds html.theme-transition for 250 ms. While that class is present, globals.css forces an 180 ms transition on background-color, color, border-color, text-decoration-color, fill, stroke for every element, with !important, so the whole page crossfades at once. Under prefers-reduced-motion: reduce the transition is none. A timer ref is cleared on unmount.
- Rule: do not give body or * a permanent colour transition (late-arriving CSS or the dark class would animate as a colour "break" on first load). Do not reintroduce prefers-color-scheme variables. Do not switch dark-mode icons with JS state; keep using dark:hidden / hidden dark:block.
- The Header, Footer and Home all assume this mechanism. Any new component that animates colour on its own must not fight the !important toggle transition.
3. Typography (As-built)
Voice	Family	How it is loaded	Used for
Body / UI	JetBrains Mono	next/font/google in layout.tsx, weight: "400" only, one instance, variable: "--font-mono"; .variable on <html>, .className on <body>	everything by default
Hero display	Roboto Flex (variable: opsz, wdth; wght automatic)	next/font/google in app/page.tsx, variable: "--font-roboto-flex", applied on the hero <section>; TextPressure reads var(--font-roboto-flex), "Roboto Flex" (v3)	the "Combine Ideas, Craft & Innovate" hero only


Facts to know before touching type:
- layout.tsx now loads exactly one font (JetBrains Mono). Montserrat_Alternates is gone.
- The hero font is self-hosted by next/font and preloaded only on /. Do not bring back a runtime Google Fonts @import (v3: TextPressure's fontUrl defaults to "").
- Only weight 400 of JetBrains Mono is loaded, so font-bold / font-semibold render as browser-synthesized bold. In the files re-read this pass it is used by the Header logo label (font-bold), the Footer brand name (font-bold) and the Home name (font-bold); About/Contact/Blog/WorkCards titles also use it (v3). Real bold means loading a weight range — a deliberate change, not a drive-by.
- --font-mono is exposed on <html> but nothing in the reviewed CSS reads it, and the body uses jetbrainsMono.className rather than a font-mono class. Its name matches Tailwind v4's own --font-mono theme variable; do not repurpose it.
- app/fonts/Geist*.woff are unused (v3). Do not reintroduce Montserrat Alternates or Geist.
- Roboto Flex only exists on the hero. Do not spread it into body copy.
- The document language is <html lang="en">, while metadata, JSON-LD and several alt texts are Indonesian (D19).
Scale in use:
- Hero: driven by TextPressure (minFontSize={36}, italic, width, weight, flex; component also has a width-based fallback table (v3)). Mobile = 5 stacked lines, ≥sm = 2 lines.
- Name ribbon: TextLoop fontSize={30}, fontWeight={400}, letterSpacing={12}, uppercase, curviness={10}, ribbonWidth={40}, separator ✦, text "Aria ✦ Aji ✦ Perkasa ✦ Wibowo", colour via text-[var(--text-primary)]. (The v3 values 50 / 600 / 9 / speed 90 are obsolete.)
- Name: text-[clamp(30px,7vw,83px)], font-bold, leading-none. Role line: clamp(20px,4vw,32px).
- Page statement (contact/blog): text-xl → md:2xl → lg:3xl → xl:4xl → 2xl:5xl, leading-[150%] (v3).
- About body: clamp(15px, 0.9vw + 11px, 24px) at leading-[170%] lg:leading-[200%], max-w-[65ch]; tabs clamp(14px, 0.5vw + 11px, 20px) (v3).
- WorkCards: section title text-3xl sm:4xl lg:5xl with tracking-[-0.05em]; card title text-xl; card body text-xs sm:text-sm (v3).
- Home body: text-sm lg:text-lg.
- Header: logo label text-xl; nav links inherit body size. Footer: brand text-lg lg:text-3xl, address and links text-xs lg:text-sm, copyright text-xs lg:text-sm.
Rule: new type scales use clamp() or the existing responsive steps; no fixed pixel sizes that can overflow at 375px. Keep line lengths under ~80 characters for body copy. Sentence case for UI copy; do not add ALL-CAPS eyebrow labels or numbered markers unless the content is truly a sequence (Services "Proses Kerja" is). The uppercase TextLoop ribbon is an existing decorative exception, not a pattern.
4. Layout (As-built + Rule)
4.1 Global shell
<html lang="en" class="{jetbrainsMono.variable} dark?"  scrollbar-gutter: stable>
  <head>  inline theme script (runs before paint)
  <body class="{jetbrainsMono.className} flex min-h-dvh flex-col"  overflow-x: clip>
    <script type="application/ld+json">   schema.org Person
    <Header/>                       fixed, z-50
    <main class="w-full min-w-0 flex-1 overflow-x-clip">  {children}  </main>
    <Footer/>                       mt-auto
- site-container (@utility in globals.css): width:100%; max-width:110rem; margin-inline:auto; padding-inline: clamp(1rem, 4vw, 2rem). Used by Header, Footer, the Home sections and the blog post article (v3). Its comment says "1440px" but 110rem is 1760px; the real cap is 1760px. The comment above it also claims it is the "only" width rule for the whole site, which is no longer true (D15).
- Pages that do not use it and keep their own horizontal padding (v3): About (px-[20px] xl:px-[100px] 2xl:px-[150px]), Contact and Blog (px-[20px] xl:px-[100px] 2xl:px-[220px]), Services (container mx-auto px-4), WorkCards (px-5 sm:px-8 lg:px-12 xl:px-20 inside max-w-[1500px]). Two width systems coexist. Do not "unify" unasked.
- The Home img-section and the LogoLoop strip are deliberately full-bleed (no site-container).
- Because the layout already wraps {children} in <main>, About, Contact, Blog (and blog/layout.tsx) render a nested <main> (v3, D9).
4.2 Home composition
hero-section   site-container  min-h-dvh  pt-15   <h1 sr-only> + TextPressure (aria-hidden; 5 lines <sm, 2 lines ≥sm)
img-section    my-10  full-bleed
                 MorphSlider via LazyMorphSlider  h-[550px] md:h-[800px]  (WebGL "melt", autoplay 6s, 4 images, no captions)
                 Name ribbon (mt-15): TextLoop (wave, reverse, speed 50, ribbon #FA6B48, pause on hover)
second-section site-container  my-14 md:mt-0 lg:mt-50 lg:mb-70 lg:mx-15   12-col grid at lg
                 copy + BlurText "Aria Aji" + FallingText "Front-end Developer" + Magnet CTA  |  PixelTransition portrait (order-first on mobile)
tech strip     (bare <div>, full-bleed)   LogoLoop — 8 react-icons marks, speed 80, left, pause + scale on hover, fade-out edges
third-section  site-container  lg:mt-60 + landscape: overrides   WorkCards ("Projects & Works")
- Hero accessibility: the page's only <h1> is sr-only and holds the exact hero text. Both TextPressure variants are aria-hidden, so the text is not read twice. Keep this pattern if the hero changes.
- LazyMorphSlider (v3): next/dynamic (ssr:false), mounted only when within 400px of the viewport (IntersectionObserver); the wrapper has the slider's own colour (#0c0c0e) so there is no layout shift. Keep it lazy; the slider is below the fold. Home forces [&_canvas]:object-contain [&_img]:object-contain on the wrapper.
- Tech strip (new, LogoLoop): React, TypeScript, JavaScript, Vite, Tailwind CSS, Shopify, Next.js, Git, as react-icons/si glyphs with external hrefs. Props: logoHeight={50}, gap={60}, pauseOnHover, scaleOnHover, fadeOut, ariaLabel="Tech stack", colour via text-[var(--text-primary)]. It is wrapped in a <div className=""> (empty class) and sits outside any section. Its fadeOutColor is var(--bg-primary), a token that does not exist (D17).
- Hero and Home use Tailwind v4 numeric spacing (pt-15, mt-15, lg:mt-50, lg:mb-70, lg:mt-60, lg:mx-15, landscape:mb-120); these are valid in v4 and not typos.
- The Home CTA is centred with flex justify-center + w-fit around Magnet. The link is button inline-flex … rounded-full bg-[var(--accent)] p-3 text-[var(--cta-text)] hover:bg-[var(--cta-hover-bg)] hover:text-[var(--cta-hover-text)], copy "Let's Collaborate".
- The portrait is a PixelTransition (gridSize={27}, animationStepDuration={0.4}, class custom-pixel-card) between a peacock mark (on #09090b) and a photo; rendered circular via CSS (v3). Both are plain <img> with Indonesian alt text.
- landscape: variants on the third section exist to keep short landscape phones from clipping; leave them.
- Home body copy is English; image alt texts are Indonesian ("Ikon burung merak", "Foto Aria Aji"), and MorphSlider captions are the placeholder "hai" (hidden by showCaptions={false}).
4.3 WorkCards (reworked) (v3)
- Section id="works": header row (title + one-line blurb), a native scroll-snap carousel (snap-x snap-mandatory, 85% basis on mobile with a peek of the next card, 2-up at sm, 3-up at md), a controls row, then a footer row ("More experiments and projects" + "View GitHub" pill in a Magnet).
- The carousel is a role="region" with aria-roledescription="carousel", tabIndex=0 and ←/→ key handling; slides are role="group". No autoplay. Dots + arrows only render when there is more than one "page"; dots have a 44px hit height. Wrap-around: next at the end jumps to the first, prev at the start jumps to the last.
- Card: inverted surface, thumbnail well (aspect-[1.35/1]), accent category pill, year, title, description. Real thumbnails exist for Kovsen, Hubton, Chain Peek; Titis has none and, like any broken image, falls back to ProjectPlaceholder (cream/navy well with grid, two circles, accent dot, category + title). Cards with an href open in a new tab; Titis has no link and renders as a non-interactive <article>.
4.4 Other routes (v3)
- About — split layout: portrait on the left (sticky from sm, clip-path reveal on load, hover/pointer + scroll parallax on photo and an accent offset frame), tabs on the right. Four tabs (Bio / Career / Academy / Open Source) with a sliding accent pill as the active indicator (active tab text is black on accent; inactive is 70% opacity). Panels share one grid cell so height is stable; items rise in sequence; bio sentences get an accent underline sweep, hover fills them. Full ARIA tablist with ←/→/↑/↓/Home/End. Page <main> uses min-h-dvh.
- Contact — statement + three inverted cards (Phone → WhatsApp, Email → Gmail compose, Address → Google Maps), real <a target="_blank" rel="noopener noreferrer"> links in a <ul>. Cards stagger in once when scrolled into view; hover/focus fills with accent and black text; visible focus-visible outline. Still md:h-screen.
- Blog — post list as double-bordered cards inside a scroll-custom scroll area (h-full overflow-y-auto), accent fill on hover with black text. Still h-screen. Post page: site-container max-w-4xl, prose dark:prose-invert (D13: confirmed this pass — package.json has no @tailwindcss/typography). Markdown is rendered with marked + dompurify.
- Services — pricing cards (inverted, GSAP + ScrollTrigger entrance), add-ons as divided rows, numbered process, WhatsApp CTAs. Indonesian copy. Reachable from the desktop nav, mobile nav and footer (confirmed in header.tsx / footer.tsx).
- About/Team — empty scaffold, not linked, not in the sitemap.
4.5 Rules
- Stacked on small screens, split on larger ones; never force a desktop grid onto 375px.
- Prefer min-h-dvh over h-screen. About already does; Contact (md:h-screen), Blog (h-screen) and Team still use the old form and can clip or double-scroll on short or 16:10 screens — verify if touched.
- Large screens (1440+): use extra width for whitespace and controlled max-widths, not bigger everything.
- New page-level sections should use site-container unless the page is deliberately on the older padding steps or a deliberate full-bleed (img-section, tech strip).
- Numeric Tailwind v4 spacing can be very large (gap-180 = 45rem). Check the rendered value before using a number above ~96 (D18).
5. Responsive Rules
Breakpoints (defined in globals.css @theme): xs 375 · sm 640 · md 768 · lg 1024 · xl 1440 · 2xl 1920.
- This is how they are defined today. Tailwind v4 (tailwindcss ^4.0.12, @tailwindcss/postcss) reads them from --breakpoint-* inside @theme; tailwind.config.js is not loaded (no @config in the CSS) and is effectively a dead file. Its screens match the @theme values; its darkMode: 'class' is replaced by the @custom-variant dark line; its purge / variants keys are Tailwind v2 leftovers that v4 ignores. So xl: switches at 1440, 2xl: at 1920, and xs: classes work.
- tailwind-scrollbar (^4.0.2) is loaded through @plugin 'tailwind-scrollbar' in the CSS. The config file also requires it with { nocompatible: true }, but that never runs.
- Do not add @config back "to be safe": it would define the same screens twice and load the scrollbar plugin twice. If the dead file is removed, that is its own cleanup task.
- v4 default-theme utilities still apply where no override exists (spacing scale, landscape: variant, etc.).
Mobile (375+): readability, touch targets (WorkCards dots/arrows and About tabs are ≥44px (v3); the Header toggle ≈34px and hamburger 40px are not — D21), no horizontal scroll, simplified motion, stacked layout, accessible nav.
Tablet (640–1023): split layouts appear; controlled type growth; WorkCards 2-up. The Header switches from hamburger to full nav at md (768).
Desktop (1024+): expressive composition, pointer effects (TextPressure, Magnet, FallingText hover, PixelTransition hover, About portrait parallax (v3)).
Large (1440+): whitespace and max-widths.
Prefer CSS/Tailwind for responsiveness. JS width checks that remain (v3): WorkCards (matchMedia("(max-width: 639px)"), only to disable Magnet) and TextPressure (innerWidth font-size fallback). Do not add more.
6. Motion (As-built inventory + Rule)
Motion hierarchy: 1 page/section entrance → 2 hero typography → 3 interactive feedback → 4 navigation transitions → 5 decoration. Decoration never competes with the hero.
Rows for Header, the theme toggle and LogoLoop's props come from the files re-read this pass; all other rows are carried from v3.
Component	Tech	Trigger	Cleanup	Reduced motion	Notes
TextPressure (v3)	rAF loop, mouse/touch/scroll listeners	pointer or scroll "kick"	✅ rAF, listeners, observer	✅ listeners not attached; one static frame	Loop runs only while visible (IntersectionObserver). Home mounts both hero variants (5 + 2 instances) and hides one with CSS, so the hidden set is idle. Colour is pure CSS (var(--text-primary) / html.dark).
TextLoop (v3)	GSAP tween on SVG textPath offsets	continuous	✅ tween.kill(), observer, listeners	✅ static, no tween	Pauses on hover and when off-screen. Intentional exception to "no new looping effects".
LogoLoop (new, unverified)	not supplied; Home passes speed={80}, pauseOnHover, scaleOnHover, fadeOut	continuous	❓ not read	❓ not read	A second continuous loop on the same page. Verify it pauses off-screen and under prefers-reduced-motion before relying on it (D17).
BlurText (v3)	@react-spring/web + IntersectionObserver	enters viewport	✅ observer	❌ none	Letter-by-letter name. Short text only.
FallingText (v3)	Matter.js engine + own rAF	hover (one-shot)	✅ rAF cancelled; render/runner stopped; world/engine cleared	❌ none	Expensive. One instance only.
PixelTransition (v3)	GSAP (killTweensOf, delayed call)	hover (pointer) / click (coarse pointer)	⚠️ tweens killed at start of each run; unmount cleanup not verified	❌ none	Touch detection: ontouchstart / maxTouchPoints / pointer: coarse.
MorphSlider (v3)	ogl WebGL shader + GSAP	autoplay 6s (pauses off-screen / on hover), pointer drag, arrows/dots	✅ engine destroyed, listeners removed	✅	DPR capped at 1.5. Lazy-loaded by LazyMorphSlider. Best-behaved animation component.
Magnet (v3)	window mousemove → rAF-throttled direct style writes	pointer near element	✅ listener + rAF	❌ none	No React state per mouse move. Disabled in WorkCards on mobile.
WorkCards carousel (v3)	native scroll-snap; scroll + ResizeObserver for dot state	swipe / arrows / dots / keys	✅	✅ scrollTo uses auto; hover lift has motion-reduce	No autoplay, no timers.
Contact cards (v3)	CSS transition + IntersectionObserver	scroll into view (once)	✅ observer	✅ motion-reduce classes	Staggered 120ms steps.
About page (v3)	CSS keyframes/transitions; pointer + scroll parallax via CSS variables	tab click, hover, pointer, scroll	✅	✅ CSS media query + JS guard	Only transform / opacity / background-size / clip-path.
Services page (v3)	GSAP + ScrollTrigger in gsap.context	scroll	✅	✅ shows final state	Reference implementation for scoped context + reduced motion.
Header	CSS transform/background transitions; rAF-throttled scroll handler	scroll direction, hover, menu toggle	✅ rAF ×2, listener, mousedown listener, toggle timer	❌ none	Transitions are none until two animation frames after mount (isReady), then transform 300ms, background-color 180ms. Mobile panel: 500 ms cubic-bezier(0.22,1,0.36,1) on max-height/transform/opacity/visibility with a forced 180 ms on background-color. Logo label reveal: 500 ms on width/margin/transform/opacity, 180 ms on colour.
Theme toggle	html.theme-transition class for 250 ms + global 180 ms colour transition (CSS)	click	✅ timer cleared on unmount	✅ CSS media query sets transition: none	See §2.4. The toggle button itself uses transition-colors duration-[180ms].


Rules
- Every substantial animation system needs a reduced-motion strategy: skip heavy timelines, show the final state, never leave content invisible. Copy the Services / About pattern.
- Prefer transform and opacity; scope GSAP with gsap.context() and ctx.revert(); use gsap.matchMedia() for breakpoint variants.
- Loops must stop when off-screen (see TextPressure, TextLoop, MorphSlider).
- Do not add new continuous/looping effects. TextLoop was the one granted exception; LogoLoop has since been added, so the page now has two. Treat that as the ceiling, not as a precedent.
- Do not add fade-and-slide-up to every section — one orchestrated moment beats scattered reveals.
- Do not duplicate a Matter.js simulation.
- Do not migrate React Spring (BlurText) or Matter.js (FallingText) to GSAP for consistency.
7. Component Patterns (As-built)
Primary CTA (pill) — Home: rounded-full bg-[var(--accent)] text-[var(--cta-text)] hover:bg-[var(--cta-hover-bg)] hover:text-[var(--cta-hover-text)], p-3, wrapped in Magnet, centred by a flex justify-center parent with a w-fit child. Light mode: black on coral, hover coral on black (both 7.26). Dark mode: white on coral at rest (2.89 — D20), hover #C8440F on white (4.90). WorkCards' "View GitHub" is the same pill with min-h-11 px-6 py-3 and explicit focus rings; Services CTAs use WhatsApp links (v3). Whether those two have moved to the --cta-* tokens is not re-verified (v3 had them on text-black dark:text-white, which is the same 2.89 failure — D3).
Inverted card (v3) — bg-gray-900|black dark:bg-white|#FDFBF7, text flips, accent for title and category pill. Contact: hover/focus fills accent with black text. WorkCards: lifts 4px on hover. Services: no hover fill.
Nav link — rest: text-[var(--nav-text)]; hover: text-[var(--accent)] + underline (offset 1); active route: text-[var(--accent-text)] + underline + font-medium (readable, §2.2). isActive matches the exact path or any href/ prefix. Services is a normal nav item. Colour changes use transition-colors duration-[180ms].
Theme toggle — square (rounded-xl, p-1, 1px accent border) button using the --nav-toggle-* tokens and --gradient-accent on hover. Two 24×24 next/image icons swapped purely with dark:hidden / hidden dark:block; no JS state, so it is correct on first paint. aria-label="Toggle dark mode"; it carries no pressed state. Rendered size ≈34px (D21). One instance in the desktop nav, one beside the hamburger on mobile.
Hamburger — 40×40 button, three h-[2px] w-6 bars that morph to an ✕; aria-label="Toggle menu" with aria-expanded. Panel is inert when closed (see §8).
Carousel controls (WorkCards) (v3) — 44px outlined round arrows with SVG chevrons (accent fill on hover), dot buttons 44px tall with an 8px dot; active dot = accent and elongated (w-6).
Tabs (About) (v3) — pill buttons (min-h-[44px], rounded-full), sliding accent indicator measured from the active button (ResizeObserver + document.fonts.ready), inactive at 70% opacity.
Scrollbar — .scroll-custom: 8px, thumb var(--accent) (pill radius), track var(--border). Also .scrollbar::-webkit-scrollbar { display: block } for the plugin.
Blog card (v3) — outer border-4 border-black dark:border-gray-600 (hover fills black / gray-200), inner border-2 border-black/40 dark:border-gray-400 that fills accent on hover with black text.
Logo (Header) — peacock-black.webp (eager, fetchPriority="high", the LCP candidate) / peacock-white.webp (lazy), swapped by dark: classes; both are plain <img> with intrinsic width={112} height={79} and w-14 h-auto, alt="peacock". The brand label "Aria Aji" (underlined, ink, accent on hover) reveals on hover, focus-within, or while the mobile menu is open. If the logo files change size, update LOGO_WIDTH / LOGO_HEIGHT in header.tsx.
Logo (Footer) — brand text "Perkasa Wibowo" (underlined, font-bold, ink, accent on hover); the peacock mark is hidden until group-hover / group-focus-within, black or white by theme. Do not "correct" either name.
Tech strip — see §4.2 (LogoLoop).
Focus (v3) — WorkCards, Contact, About tabs/links and Services CTAs have explicit focus-visible rings or outlines (black in light, white in dark, offset to the canvas colour where needed). Reuse that pattern for new interactive elements. The Header, Footer and Home CTA do not (D14).
8. Interaction & Accessibility Baseline
Every interactive element needs: visible hover on pointer devices, usable touch behaviour, keyboard focus, adequate target size (≥44px where practical), a clear active state. Never make critical information hover-only.
Known gaps (do not silently fix unrelated ones; fix in the area you are already touching):
- No explicit :focus-visible styling on Header links/toggle/hamburger, Footer links, Blog cards, or the Home CTA; they rely on browser defaults.
- Header mobile menu: resolved this cycle — the panel is inert and invisible while closed, so its links are no longer tabbable. Still missing: Escape-to-close and returning focus to the hamburger.
- The theme toggle has an aria-label but no aria-pressed, so assistive tech cannot tell which mode is on.
- Header toggle (≈34px) and hamburger (40px) are below the 44px target (D21).
- The Header logo link's accessible name is built from the two images' alt="peacock" plus the visually collapsed "Aria Aji" text; the visible label is hidden until hover/focus.
- PixelTransition hover/click and FallingText hover are pointer-first; the info they carry is decorative, so keep it that way.
- Hero is pointer-driven; on touch it relies on touchmove. Keep the text readable at rest. Because the hero is aria-hidden and mirrored by an sr-only <h1>, do not change one without the other.
- LogoLoop logos are external links inside a moving strip; confirm they are keyboard-reachable and that the strip stops for reduced motion (D17).
- Header nav uses --nav-text; the hero must stay legible under the transparent header on / (the header turns solid after any scroll, on other routes, or when the menu opens).
9. Header, Footer (Global)
Header — fixed (top-0 inset-x-0 z-50 py-2); transparent on / until scrolled, otherwise --nav-background (isSolid = menuOpen || pathname !== '/' || scrolled); hides on scroll down after 100px and returns on any scroll up or when y ≤ 100 (rAF-throttled, one stable passive listener; initial state computed on mount, transitions enabled two frames later so a mid-page refresh does not animate). Mobile menu (max-h-96 slide, inert when closed) closes on outside mousedown, on link click, and on route change. Dark-mode toggle writes localStorage.theme and toggles the 250 ms theme-transition class. Nav on every breakpoint: About, Services, Contact, Blog (desktop md:flex, space-x-12). Uses site-container. Logo images are plain <img>; the toggle icons use next/image.
Footer — --footer-background, border-t var(--border), mt-auto; two-column grid at md (gap-1, lg:gap-180 — see D18) with brand name + logo reveal and address on the left, quick links (About, Services, Contact, Blog) and socials (GitHub, LinkedIn, X, all target="_blank" rel="noopener noreferrer") on the right, then a hairline and the copyright line with the current year (--muted). Every link is now inside an <li>. Address: "Jl. Terusan Prof. DR. Sutami No. 23, Bandung, West Java, Indonesia." It is marked 'use client' although it has no state or effects. Its text colour is --text-tertiary (the extra dark:text-[var(--text-tertiary)] class is redundant).
Header/Footer/globals.css/layout.tsx are global: any change requires checking every route (/, /about, /services, /contact, /blog, /blog/[slug]).
9.1 Metadata & structured data (As-built, in layout.tsx)
- metadataBase https://ariaaji.com; title default "Aria Aji — Frontend Developer", template %s | Aria Aji; Indonesian description; keyword list; canonical /; Open Graph (id_ID, /og-image.webp 1200×630) and Twitter summary_large_image; robots index/follow with max-image-preview: large, max-snippet: -1.
- One JSON-LD Person block in <body>: name, url, jobTitle, Bandung address, sameAs (GitHub, LinkedIn, X, Instagram), knowsAbout.
- The Footer's LinkedIn URL (linkedin.com/in/aria-aji) differs from the JSON-LD one (linkedin.com/in/aria-aji-627668156/), and Instagram appears only in JSON-LD (D19). Fuller SEO/metadata tracking lives in ARCHITECTURE.md §14.
10. Working With the frontend-design Skill
The repo ships Anthropic's frontend-design skill (.claude/skills/frontend-design, pinned in skills-lock.json). It tells the agent to make bold, distinctive choices and explicitly lists a warm cream background + terracotta accent among the "default AI look" clusters to avoid. This portfolio's cream + coral is a pinned brief, not a default the agent drifted into. The skill itself says the brief's own words win.
Therefore:
1. This file is the brief. The palette in §2 and the type voices in §3 are fixed inputs, not proposals for the skill to improve on.
2. Use frontend-design for new sections/pages or a requested redesign — never for small fixes, and never to re-pick colours or fonts.
3. When the skill proposes a token plan, it must be expressed in the existing tokens and type voices (including --accent-text and --cta-*); if a proposal contradicts §2/§3, drop the proposal.
4. The skill's own guidance that is compatible and should be followed: one memorable moment, restrained everything else, no template chrome (eyebrow labels, A · B · C meta strings, → on every link), sentence-case active-voice copy, quality floor (responsive to 375px, visible focus, reduced motion).
11. Visual QA Checklist
For every visual change:
- [ ] Light mode · [ ] Dark mode (toggle, then hard refresh: no colour flash; also confirm the toggle crossfade still lasts ~180 ms)
- [ ] 375 · 768 · 1024 · 1440 (and 1920 for hero/global changes); also a 16:10 viewport (e.g. 1440×900) and a short landscape phone for anything using h-screen / min-h-dvh
- [ ] Footer between 1024 and 1440 (D18)
- [ ] Keyboard navigation and visible focus
- [ ] Hover states (pointer) and touch behaviour (coarse pointer)
- [ ] Reduced motion (DevTools → Rendering → Emulate prefers-reduced-motion), including the tech strip
- [ ] No horizontal overflow
- [ ] No obvious layout shift (MorphSlider placeholder, carousel, fonts, header logo)
- [ ] No animation stuck after unmount / route change
- [ ] Console clean
- [ ] Contrast: new text/background pairs computed, not eyeballed (§2.2); text in accent uses --accent-text
Route matrix for global changes: /, /about, /services, /contact, /blog, /blog/<slug>.
12. Design Debt
Resolved since v3 (do not re-open or "fix again")
Light-mode ink darkened (#488067 → #2A5A44, 3.38 → 5.82) · --muted fixed (footer copyright 2.44 → 6.22 light, 8.57 dark) · --accent-text added and used for the active nav link (6.43 light / 9.58 dark on the header) · --cta-* token family added and wired into the Home CTA label and hover · body no longer has a permanent colour transition; theme crossfade is a toggle-scoped theme-transition class (with reduced-motion off-switch) · Montserrat_Alternates removed from layout.tsx · Header collapsed mobile panel is inert (no longer tabbable) · Footer social links wrapped in <li> · Footer mt-4] typo fixed · Header scroll state and transitions gated by isReady so mid-page refresh does not animate · Header logo now carries intrinsic width/height and an LCP-priority image · hero has a single sr-only <h1> with the animated copies aria-hidden · layout.tsx now ships metadataBase, title template, Open Graph, Twitter, robots, canonical and JSON-LD · theme default is always light with Chrome Auto Dark Mode blocked.
Carried from v3's resolved list: Tailwind breakpoints come from @theme · colours are tokens and follow .dark · stray accent hexes and unused colorCycle removed from Home · duplicate JetBrains Mono instance removed · hero font self-hosted via next/font · TextPressure loop is visibility-gated with reduced-motion support · FallingText rAF is cancelled · Magnet no longer sets React state per mouse move · WorkCards rebuilt · Contact cards are real links with focus styles · Services is in the nav and footer · Header no longer logs to the console or re-subscribes its scroll listener · Home hero typo fixed · CTA hard-coded margins replaced by flex centring · About on min-h-dvh with ARIA tabs.
Open (report; do not fix unasked)
Numbers D1–D16 are kept from v3 so existing references still work; D17+ are new.
#	Item	Where
D1	Light-canvas accent text still fails: Home name 2.12, role line at 80% opacity 1.87 (dark: 3.84 / 2.88); accent on the #FDFBF7 header/footer for hover states 2.80. --accent-text (4.87 canvas / 6.43 header, light) exists but only the active nav uses it. Ink (5.82) and --muted (6.22) no longer fail.	app/page.tsx, header.tsx, footer.tsx
D2	Three surface systems; inverted-card family not uniform (gray-900 / black / #FDFBF7) (v3)	WorkCards, Contact, Services, chrome
D3	dark:text-white on accent-filled CTAs = 2.89:1. Home CTA reworked to tokens but still fails (see D20). WorkCards "View GitHub" and Services CTAs: not re-verified.	Home CTA, Services CTAs (v3), WorkCards "View GitHub" (v3)
D4	Only JetBrains Mono 400 loaded → synthesized bold; --font-mono exposed but unreferenced in the reviewed CSS; app/fonts Geist unused (v3). (Montserrat_Alternates part is resolved.)	layout.tsx, app/fonts
D5	tailwind.config.js is not loaded (dead file with v2 keys); breakpoints, dark variant and scrollbar plugin live in globals.css — re-confirmed	tailwind.config.js
D6	Unused tokens in the files re-read (list in §2.1 item 4, now including --cta-bg) and literal hex duplicating tokens (v3); @utility text-balance redefines a Tailwind v4 built-in; a blanket img, video, canvas, svg { transition: none } rule sits in @layer utilities	globals.css, WorkCards, About, Contact
D7	Home mounts both hero variants (7 TextPressure instances, one set idle) — re-confirmed	app/page.tsx
D8	No reduced-motion handling in BlurText, FallingText, PixelTransition, Magnet (v3) and Header (re-confirmed: its transitions are unconditional). LogoLoop unknown.	those components
D9	blog/layout.tsx is a placeholder that renders a literal "Admin Layout" <header> on every blog page; About/Contact/Blog (+ blog/layout.tsx) render a <main> inside the layout's <main> (v3; root <main> re-confirmed)	blog/layout.tsx, about, contact, blog
D10	md:h-screen (Contact) and h-screen (Blog, Team) can clip or double-scroll across 16:9 vs 16:10 and short phones (v3)	contact/page.tsx, blog/page.tsx, about/team/page.tsx
D11	Invalid/no-op classes (v3): md:pt[49px] (missing -), lg:flex-1-reverse (Contact, Blog), text-md (Services). (Footer mt-4] is resolved.)	those files
D12	Junk assets: *:Zone.Identifier files, duplicate jpeg/webp pairs (v3)	public/assets/img
D13	prose / dark:prose-invert used on blog posts but no typography plugin is installed (re-confirmed from package.json), so post bodies render with reset headings and lists; blog dates are gray-500 on navy (2.30) (v3)	blog/[slug]/page.tsx, MarkdownContent.tsx, blog/page.tsx
D14	Missing focus-visible on Header/Footer/Blog cards/Home CTA; mobile menu has no Escape-to-close (the tabbable-when-closed and footer <li> parts are resolved)	Header, Footer, Blog
D15	site-container comment says 1440px but the value is 110rem (1760px), and calls itself the "only" width rule while About/Contact/Blog/Services/WorkCards use their own	globals.css and pages
D16	Large blocks of commented-out code (v3)	blog/page.tsx, contact/page.tsx, Contact/contact.tsx, about/page.tsx, services/page.tsx, WorkCard/workcard.tsx
D17	LogoLoop fadeOutColor="var(--bg-primary)": that token is not defined anywhere (the canvas token is --background), so the fade edge cannot match the canvas in either theme. It is also a second continuous loop (after TextLoop) whose off-screen and reduced-motion behaviour is unverified, and the strip sits in a bare <div className=""> outside any section.	app/page.tsx, LogoLoop
D18	Footer lg:gap-180 = 45rem. By arithmetic (container padding 32px + inner px-[20px]), the two columns get ~100px each at 1024px and ~308px each at 1440px, so the brand row, address and link rows are likely to wrap or crowd between lg and xl. Computed, not seen in a browser.	footer.tsx
D19	Language and identity consistency: <html lang="en"> while description, OG locale (id_ID), JSON-LD address and several alts are Indonesian; Footer LinkedIn URL differs from the JSON-LD sameAs URL; Instagram is in sameAs but not in the footer; MorphSlider captions are the placeholder "hai". (Overlaps ARCHITECTURE.md §14.)	layout.tsx, footer.tsx, app/page.tsx
D20	Home CTA in dark mode: label --cta-text (white) sits on bg-[var(--accent)] = 2.89:1, although --cta-bg (#C8440F) + white = 4.90 was defined for exactly this. Switching the resting fill to var(--cta-bg) would change light mode not at all (--cta-bg = #FA6B48) but would darken the dark-mode fill, so it is a visible change and needs a request.	app/page.tsx
D21	Header touch targets: theme toggle ≈34px (24px icon + p-1 + 1px border), hamburger 40×40; both under the 44px target. Toggle has no aria-pressed.	header.tsx


D9 is a visible bug rather than a taste issue; surface it whenever the blog is touched. D17 is a likely broken reference rather than a taste issue; surface it whenever the Home tech strip is touched.
13. Design Decision Rule
1. Preserve the as-built look unless the task asks otherwise.
2. When two implementations look equivalent, pick the one with: fewer dependencies → less runtime work → easier maintenance → better accessibility → closer to the existing architecture.
3. Report debt you notice (§12) in the final response; fix it only if it is inside the code you are already changing and the fix cannot alter the rendered result.
4. Do not optimize for novelty.
14. Stack & Tooling Snapshot (As-built, from package.json)
Area	What is installed	Design-relevant notes
Framework	next ^15.5.24, react / react-dom ^19.1.0, typescript ^5.8.3	App Router; next/font/google for both fonts
Styling	tailwindcss ^4.0.12, @tailwindcss/postcss ^4.0.12, postcss ^8, tailwind-scrollbar ^4.0.2	CSS-first config in globals.css; no @tailwindcss/typography (D13)
Motion	gsap ^3.12.7, @react-spring/web ^10.1.2, matter-js ^0.20.0, ogl ^1.0.11	GSAP: TextLoop, PixelTransition, MorphSlider, Services (v3); React Spring: BlurText; Matter.js: FallingText; ogl: MorphSlider
Icons	react-icons ^5.7.0	Used on Home by the tech strip (react-icons/si); only brand glyphs, no UI icons
Content	marked ^15.0.11, dompurify ^3.2.5 (+ types)	Blog markdown pipeline
Hosting	@opennextjs/cloudflare ^1.20.7, wrangler ^4.147.0	preview / deploy scripts build with OpenNext for Cloudflare; remember this when considering image optimisation or runtime-only APIs
Scripts	dev, build, start, lint, debug, preview, deploy, cf-typegen	


Rule: a new dependency for a design effect needs the same justification as a new loop in §6: fewer dependencies wins (§13.2). react-icons is already present; do not add a second icon set.
15. New Additions Since v4 (As-built)
15.1 LogoLoop — Tech Stack Marquee (new)
A continuous horizontal marquee of technology logos added to the Home page below the hero.
Location: app/components/LogoLoop/LogoLoop.tsx, imported via LazyLogoLoop in app/components/Lazy/LazySections.tsx, composed in app/page.tsx.
Props used on Home:
- logos: 8 items from react-icons/si (React, TypeScript, JavaScript, Vite, Tailwind CSS, Shopify, Next.js, Git) with external hrefs.
- speed={80}, direction="left", logoHeight={50}, gap={60}
- pauseOnHover, scaleOnHover, fadeOut, fadeOutColor="var(--bg-primary)"
- ariaLabel="Tech stack", className="text-[var(--text-primary)]"
Behaviour:
- CSS-first animation loop using requestAnimationFrame with exponential smoothing (SMOOTH_TAU: 0.25).
- Duplicates the logo list enough times to fill the viewport plus headroom (MIN_COPIES: 2, COPY_HEADROOM: 2).
- Pauses on hover when pauseOnHover is true (Home uses it).
- Optional edge fades (fadeOut) using a CSS gradient whose colour comes from fadeOutColor (currently var(--bg-primary) — this token does not exist, see D17).
- Respects prefers-reduced-motion: reduce by setting transform: translate3d(0,0,0) and stopping the rAF loop.
- Images and SVG icons are loaded lazily; ResizeObserver + image onload recalculate copy count.
- Each logo is an external link (target="_blank" rel="noopener noreferrer") with focus-visible outline.
Caveats (do not fix unasked):
- fadeOutColor="var(--bg-primary)" references a non-existent token (canvas is --background).
- Second continuous loop on the same page (after TextLoop); off-screen pause and reduced-motion behaviour should be verified.
- Rendered inside a bare <div className=""> outside any <section>.
- The component is client-side only and code-split via next/dynamic.
15.2 Lazy Loading Wrapper — OnView + Lazy* components (new)
app/components/Lazy/LazySections.tsx introduces a reusable OnView component that defers heavy client components until they are near the viewport or the user first interacts (scroll, pointer, key, touch). It uses IntersectionObserver with a configurable rootMargin (default 400px 0px) and an optional loadOnFirstInput flag.
Exported lazy wrappers used on Home:
- LazyBlurText — wraps BlurText; fallback is a static <p> with the text.
- LazyFallingText — wraps FallingText; fallback is a static centred <div> with the text.
- LazyLogoLoop — wraps LogoLoop; fallback is an empty <div> with the same height as the logo row (calculated from logoHeight and scaleOnHover).
- DeferredMorphSlider — wraps LazyMorphSlider (which already wraps MorphSlider); rootMargin="0px", loadOnFirstInput, no fallback (the page wrapper already reserves the height).
This pattern keeps the initial HTML semantic for SEO, avoids layout shift (fallbacks reserve space), and defers heavy JS (Matter.js, GSAP, WebGL, React Spring) until needed.
15.3 Updated Colour Tokens (globals.css)
New tokens added in app/globals.css since v3, now documented in §2.1:
- --accent-text — readable accent for text (light #A8340C, dark #FF9A7C); used for active nav link.
- --cta-bg, --cta-text, --cta-hover-bg, --cta-hover-text — CTA token family. Light: #FA6B48 / #000 / #000 / #FA6B48; Dark: #C8440F / #FFF / #FFF / #C8440F. Home CTA uses bg-[var(--accent)] + text-[var(--cta-text)] + hover tokens; resting fill is still --accent, not --cta-bg (see D20).
15.4 WorkCards — Rebuilt Carousel (v3, re-confirmed)
- Native CSS scroll-snap (snap-x snap-mandatory), no autoplay.
- Responsive basis: mobile 85% + peek, sm 2-up, md 3-up.
- Full ARIA: role="region" aria-roledescription="carousel", keyboard arrows, wrap-around next/prev.
- Dots + arrows only when more than one page; dots have 44px hit height.
- Placeholder fallback (ProjectPlaceholder) uses canvas tokens (#EDDBB5 / #1B3E5C) with subtle grid and accent dot; Titis has no thumbnail and falls back to it.
- Cards with href open in new tab; Titis has no link and renders as <article>.
- "View GitHub" CTA uses the pill pattern (bg-[var(--accent)] text-[var(--cta-text)] hover:bg-[var(--cta-hover-bg)] hover:text-[var(--cta-hover-text)]) with Magnet (disabled on mobile via matchMedia("(max-width: 639px)")).
15.5 Contact Cards — Real Links + Staggered Entrance (v3, re-confirmed)
- Three cards: Phone → WhatsApp, Email → Gmail compose, Address → Google Maps.
- Real <a target="_blank" rel="noopener noreferrer"> links inside a <ul>.
- Staggered entrance via IntersectionObserver (once, 120ms steps).
- Hover/focus fills with accent (#FA6B48) and black text; visible focus-visible outline.
- motion-reduce classes disable transitions/animations.
15.6 About Page — ARIA Tabs + Portrait Parallax (v3, re-confirmed)
- Four tabs (Bio / Career / Academy / Open Source) with sliding accent pill indicator.
- Full keyboard support: ←/→/↑/↓/Home/End.
- Panels share one grid cell for stable height; items rise in sequence.
- Bio sentences get accent underline sweep on entrance; hover fills with accent + black text.
- Portrait: sticky from sm, clip-path reveal on load, hover/pointer + scroll parallax via CSS variables (--mx, --my, --scroll).
- prefers-reduced-motion handled via CSS media query + JS guard.
15.7 Services Page — GSAP + ScrollTrigger (v3, re-confirmed)
- Pricing cards (inverted surfaces), add-ons as divided rows, numbered process steps.
- GSAP entrance animations scoped with gsap.context() and cleaned up on unmount.
- Reduced-motion branch: gsap.set final state immediately.
- WhatsApp CTAs use literal bg-[#FA6B48] text-black dark:text-white (not the --cta-* tokens; contrast 2.89 in dark — D3).
15.8 Header — Inert Mobile Menu + Ready-Gated Transitions (v3, re-confirmed)
- Mobile panel uses inert={!isMobileMenuOpen} so links are not tabbable when closed.
- Transitions (transform 300ms, background-color 180ms) enabled only after two animation frames (isReady) to avoid mid-page-refresh animation.
- Scroll hide/show: hides after 100px down, shows on any up or y ≤ 100; rAF-throttled.
- Theme toggle: flips .dark on <html>, writes localStorage.theme, adds html.theme-transition for 250ms (global 180ms colour crossfade).
- Logo images are plain <img> with intrinsic width/height; light logo eager + fetchPriority="high" (LCP candidate), dark logo lazy.
15.9 Footer — <li> Wrapped Links + Current Year (v3, re-confirmed)
- All links wrapped in <li> inside <ul>.
- Copyright uses new Date().getFullYear() and --muted token.
- Marked 'use client' but has no state/effects (could drop the directive; leave unless editing).
15.10 Blog — Client-Side Markdown + Missing Typography Plugin (v3, re-confirmed)
- MarkdownContent parses Markdown in useEffect (empty server HTML for article body — SEO gap).
- prose / dark:prose-invert classes used but @tailwindcss/typography not installed.
- Blog dates use text-gray-500 on navy (2.30 contrast — fails).
- [slug] page uses generateStaticParams from posts/data.ts; generateMetadata sets only title.
- blog/layout.tsx is a placeholder rendering "Admin Layout" header (visible bug — D9).
16. Updated Visual QA Checklist (extends §11)
For every visual change, additionally verify:
- [ ] LogoLoop tech strip: pauses on hover, stops under reduced motion, fades edges correctly (check fadeOutColor token), external links keyboard-reachable.
- [ ] Lazy components: fallbacks reserve correct height, no layout shift when heavy component mounts, IntersectionObserver triggers at expected scroll position.
- [ ] WorkCards carousel: scroll-snap works at all breakpoints, dots/arrows appear only when needed, wrap-around works, keyboard navigation, focus styles.
- [ ] Contact cards: staggered entrance once, hover/focus fill + focus ring, real links open correctly.
- [ ] About tabs: indicator slides correctly, keyboard nav, panel content stable height, portrait parallax (pointer + scroll) works.
- [ ] Services: GSAP entrance animations, reduced-motion shows final state immediately, WhatsApp links open.
- [ ] Header: mobile menu inert when closed, Escape-to-close (missing — D14), focus return to hamburger (missing), theme toggle crossfade 180ms + 250ms class, logo LCP priority.
- [ ] Footer: links in <li>, social target="_blank" rel="noopener noreferrer", year current.
- [ ] Blog: "Admin Layout" not visible (D9), post metadata per post (missing), OG image exists (/og-image.webp missing — D14 in ARCHITECTURE.md).