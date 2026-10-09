/**
 * Parallax effect for hero section
 * Moves the fixed hero text up as you scroll
 */

export function initParallax(): void {
  const hero = document.querySelector('.hero') as HTMLElement | null;
  const parallaxText = document.querySelector('.pixel-background__text') as HTMLElement | null;

  if (!hero || !parallaxText) return;

  function updateParallax(): void {
    const scrollY = window.scrollY;
    const heroHeight = hero.offsetHeight;

    // Move the text up by 70% of scroll, starting from the centered position
    const parallaxAmount = scrollY * 0.7;
    
    parallaxText.style.transform = `translateY(calc(-50% - ${parallaxAmount}px))`;
  }

  window.addEventListener('scroll', updateParallax, { passive: true });
  updateParallax(); // Initial call
}
