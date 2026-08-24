async function includeHTML(selector, url) {
  console.log('includes');
  const el = document.querySelector(selector);
  if (!el) return;
  const res = await fetch(url);
  el.innerHTML = await res.text();
}

document.addEventListener('DOMContentLoaded', async () => {
  await Promise.all([
    includeHTML('#site-header', 'partials/header.html'),
    includeHTML('#site-footer', 'partials/footer.html')
  ]);
  console.log('partials loaded');
  document.dispatchEvent(new Event('partialsLoaded'));
});

function toggleMenu() {
  const navLinks = document.getElementById('navLinks');
  const menuBtn = document.querySelector('.menu-btn');
  const isOpen = navLinks.classList.toggle('active');
  menuBtn.textContent = isOpen ? '✕' : '☰';
}

function updateHeaderScrollState() {
    const header = document.querySelector('header');
    if (!header) return;
    header.classList.toggle('scrolled', window.scrollY > 0);
}

document.addEventListener('partialsLoaded', updateHeaderScrollState);
window.addEventListener('scroll', updateHeaderScrollState, { passive: true });
window.addEventListener('load', updateHeaderScrollState);