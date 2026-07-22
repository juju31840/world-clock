export function createFlagElement(entry, baseClass) {
  if (entry.flagPath) {
    const img = document.createElement('img');
    img.className = `${baseClass} ${baseClass}--img`;
    img.src = entry.flagPath;
    img.width = 20;
    img.height = 15;
    img.loading = 'lazy';
    img.alt = '';
    return img;
  }

  const span = document.createElement('span');
  span.className = `${baseClass} ${baseClass}--fallback`;
  span.textContent = '🌐';
  span.setAttribute('aria-hidden', 'true');
  return span;
}
