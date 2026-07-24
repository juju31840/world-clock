function fallbackLetters(city) {
  const letters = (city || '').replace(/[^a-zA-Z]/g, '').slice(0, 2).toUpperCase();
  return letters || '—';
}

function createTextFallback(text, baseClass) {
  const span = document.createElement('span');
  span.className = `${baseClass} ${baseClass}--fallback`;
  span.textContent = text;
  span.setAttribute('aria-hidden', 'true');
  return span;
}

export function createFlagElement(entry, baseClass) {
  const fallbackText = entry.countryCode ? entry.countryCode.toUpperCase() : fallbackLetters(entry.city);

  if (entry.flagPath) {
    const img = document.createElement('img');
    img.className = `${baseClass} ${baseClass}--img`;
    img.src = entry.flagPath;
    img.width = 20;
    img.height = 15;
    img.loading = 'lazy';
    img.alt = '';
    img.addEventListener('error', () => {
      img.replaceWith(createTextFallback(fallbackText, baseClass));
    }, { once: true });
    return img;
  }

  return createTextFallback(fallbackText, baseClass);
}
