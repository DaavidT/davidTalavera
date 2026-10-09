# Quick Start — Testing the New Portfolio

## 🚀 How to Preview Locally

### 1. Start the Dev Server
```bash
cd davidTalavera
npm run dev
```

Then open: **http://localhost:3000**

### 2. What You'll See

**Hero** (top of page)
- Full-screen matrix animation running
- Your name + title overlay (bottom-left area)
- Animated scroll indicator at the bottom
- Try moving your mouse around → see color trails in the matrix

**Scroll Down** (watch parallax in action)
- Hero text moves up as you scroll
- Scroll indicator fades out after scrolling ~300px

**About** (first section)
- Bio paragraph + stats grid
- Cards with subtle background

**Experience** (second section)
- Project grid (3 columns on desktop)
- Featured portfolio pieces below
- Hover over cards → they lift up slightly

**Skills** (third section)
- Technology categories with tags
- Glassmorphic cards

**Contact** (red section)
- Call-to-action text
- Email button (primary action)
- Social links below

**Footer**
- Quick navigation to each section

---

## ✅ Test Checklist (Quick)

### Desktop (1920px or bigger)
- [ ] Animation renders smoothly (no stuttering)
- [ ] Parallax text moves as you scroll
- [ ] All sections have proper spacing
- [ ] Cards hover effect works (lift + background change)
- [ ] Links open properly

### Tablet (iPad-size, ~768px)
- [ ] Layout adjusts to 1-2 column grid
- [ ] Text sizes are readable
- [ ] Padding/margins are balanced

### Mobile (iPhone-size, ~375px)
- [ ] Everything stacks to 1 column
- [ ] Hero animation still renders
- [ ] No horizontal scroll
- [ ] Tap links work properly
- [ ] Text is readable (not too small)

### Theme
- [ ] Dark mode works (system default or toggle)
- [ ] Light mode works
- [ ] Animation adapts to theme

---

## 🔧 Quick Adjustments (If Needed)

### Animation Too Slow?
File: `davidTalavera/src/scripts/parallax.ts` line 17
```typescript
const parallaxAmount = scrollY * 0.7;
// Try 0.5 for slower, 1.0 for faster
```

### Scroll Indicator Fades Too Early?
File: `davidTalavera/src/pages/index.astro` (search for "opacity")
```typescript
const opacity = Math.max(0, 1 - window.scrollY / 300);
// Try 500 instead of 300 for later fade
```

### Contact Email Wrong?
File: `davidTalavera/src/pages/index.astro` (search for "Send me an email")
```astro
<a href="mailto:your-email@example.com" ...>
```

### Stats Numbers Wrong?
File: `davidTalavera/src/pages/index.astro` (search for "Years of experience")
```astro
<div class="stat-value">10+</div>  <!-- Change these numbers -->
```

---

## 📁 File Changes Summary

**New/Modified:**
- `src/pages/index.astro` ← Complete rewrite (old was 44 lines → new is 450+ lines)

**Copied from animation project:**
- `src/components/PixelBackground.astro`
- `src/scripts/matrix-grid.ts`
- `src/scripts/parallax.ts`
- `src/scripts/pixel-grid.ts`

**Documentation (for reference):**
- `INTEGRATION_SUMMARY.md` (technical details)
- `PRE_REVIEW_CHECKLIST.md` (full testing guide)

---

## ⚡ Performance Tips

- Animation pauses when tab not visible (good for battery)
- Respects `prefers-reduced-motion` setting
- All animations use CSS `transform` + `opacity` (GPU-accelerated)
- No render-blocking scripts

---

## 🔗 Navigation

All sections are accessible via:
1. **Scroll naturally** — Just scroll down page
2. **Footer links** — Click footer to jump to sections
3. **Anchor links** — Direct URLs like `/#about`, `/#experience`, etc.

---

## 📞 Ready to Test?

1. Run `npm run dev` in the `davidTalavera` folder
2. Open http://localhost:3000
3. Try scrolling, hovering, switching themes
4. Check mobile view (DevTools → toggle device toolbar)
5. Let me know what adjustments you'd like!

No commits until you've reviewed and approved. ✌️

---

## Common Questions

**Q: Will this break my existing pages?**
A: No! `/experience`, `/blog`, `/skills` routes still work. This only changes the homepage.

**Q: Can I keep using my old nav/layout?**
A: The old nav components are still there if you want to use them on other pages.

**Q: Is the animation heavy?**
A: No, it's canvas-based and optimized. Won't drain battery on mobile.

**Q: Can I customize the animation colors?**
A: Yes! Check `PixelBackground.astro` — the `--pb-ambient` CSS variable controls it.

**Q: What about SEO?**
A: All proper meta tags are set via BaseLayout. OpenGraph + Twitter cards included.

---

Enjoy! Let me know once you've tested. 🚀
