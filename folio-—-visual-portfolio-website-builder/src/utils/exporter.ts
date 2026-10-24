import JSZip from 'jszip';
import { Portfolio } from '../types/portfolio';
import { sanitizeCustomCss, sanitizePlainText } from './portfolioLogic';

function escapeHtml(str: string): string {
  return sanitizePlainText(str || '')
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

export function generateStaticCss(portfolio: Portfolio): string {
  const { theme } = portfolio;
  const userCss = sanitizeCustomCss(theme.customCss || '');
  return `
:root {
  --primary: ${theme.primary};
  --secondary: ${theme.secondary};
  --bg: ${theme.background};
  --surface: ${theme.surface};
  --text: ${theme.text};
  --muted: ${theme.mutedText};
  --heading-font: '${theme.headingFont}', sans-serif;
  --body-font: '${theme.bodyFont}', sans-serif;
  --mono-font: '${theme.monoFont}', monospace;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
body {
  background-color: var(--bg);
  color: var(--text);
  font-family: var(--body-font);
  line-height: 1.65;
  -webkit-font-smoothing: antialiased;
}
a { color: var(--primary); text-decoration: none; }
a:hover { text-decoration: underline; }
.container { max-width: 1040px; margin: 0 auto; padding: 0 1.5rem; }
header {
  border-bottom: 1px solid rgba(148, 163, 184, 0.2);
  padding: 1.25rem 0;
  position: sticky;
  top: 0;
  backdrop-filter: blur(12px);
  background: var(--bg);
  z-index: 20;
}
header .nav-inner { display: flex; align-items: center; justify-content: space-between; gap: 1.5rem; }
header .brand { font-family: var(--heading-font); font-weight: 700; font-size: 1.15rem; color: var(--text); }
header nav { display: flex; gap: 1.5rem; font-size: 0.875rem; }
header nav a { color: var(--muted); }
section { padding: 4rem 0; border-bottom: 1px solid rgba(148, 163, 184, 0.14); }
h1, h2, h3 { font-family: var(--heading-font); color: var(--text); line-height: 1.15; }
h1 { font-size: clamp(2.25rem, 4.5vw, 3.75rem); margin-bottom: 1rem; }
h2 { font-size: 1.75rem; margin-bottom: 0.5rem; }
.subtitle { color: var(--muted); margin-bottom: 2rem; font-size: 0.95rem; }
.grid-2 { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 1.5rem; margin-top: 1.5rem; }
.card {
  background: var(--surface);
  border: 1px solid rgba(148, 163, 184, 0.2);
  border-radius: 14px;
  padding: 1.5rem;
}
.card img { width: 100%; border-radius: 10px; margin-bottom: 1rem; object-fit: cover; max-height: 240px; }
.meta { font-family: var(--mono-font); font-size: 0.78rem; color: var(--muted); margin-bottom: 0.5rem; }
.btn {
  display: inline-block;
  background: var(--primary);
  color: #fff;
  padding: 0.65rem 1.35rem;
  border-radius: 8px;
  font-weight: 600;
  font-size: 0.875rem;
  border: none;
  cursor: pointer;
}
footer { padding: 2.5rem 0; color: var(--muted); font-size: 0.82rem; text-align: center; }
@media print {
  header, .no-print { display: none !important; }
  section { padding: 1.5rem 0; page-break-inside: avoid; }
}
${userCss}
`.trim();
}

export function generateStaticHtml(portfolio: Portfolio, externalCss = false): string {
  const { profile, seo, sections, theme, settings } = portfolio;
  const visibleSections = [...sections].filter((s) => s.visible).sort((a, b) => a.order - b.order);

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'Person',
    name: profile.name,
    jobTitle: profile.headline,
    email: profile.email,
    telephone: profile.phone,
    address: {
      '@type': 'PostalAddress',
      addressLocality: profile.location,
    },
  };

  const renderSectionHtml = (sec: (typeof visibleSections)[0]) => {
    if (sec.type === 'hero') {
      return `
      <section id="hero">
        <div class="container">
          <p class="meta">${escapeHtml(sec.data?.greeting || portfolio.profession)}</p>
          <h1>${escapeHtml(profile.name)}</h1>
          <p class="subtitle" style="font-size:1.15rem;max-width:680px;">${escapeHtml(profile.headline)}</p>
          <div style="margin-top:1.5rem;display:flex;gap:1rem;">
            <a class="btn" href="#projects">${escapeHtml(portfolio.layout.heroStyle.primaryCtaText || 'View Work')}</a>
            <a class="btn" style="background:transparent;border:1px solid var(--muted);color:var(--text);" href="#contact">${escapeHtml(portfolio.layout.heroStyle.secondaryCtaText || 'Contact')}</a>
          </div>
        </div>
      </section>`;
    }

    if (sec.type === 'about') {
      const facts = Array.isArray(sec.data?.quickFacts) ? sec.data.quickFacts : [];
      return `
      <section id="about">
        <div class="container">
          <h2>${escapeHtml(sec.title)}</h2>
          <p style="margin-top:1rem;white-space:pre-line;">${escapeHtml(sec.data?.bio || '')}</p>
          ${
            facts.length > 0
              ? `<div class="grid-2" style="margin-top:1.5rem;">
                  ${facts
                    .map(
                      (f: any) =>
                        `<div class="card"><div class="meta">${escapeHtml(f.label)}</div><strong>${escapeHtml(f.value)}</strong></div>`
                    )
                    .join('')}
                </div>`
              : ''
          }
        </div>
      </section>`;
    }

    if (sec.type === 'projects') {
      const items = Array.isArray(sec.data?.items) ? sec.data.items : [];
      return `
      <section id="projects">
        <div class="container">
          <h2>${escapeHtml(sec.title)}</h2>
          ${sec.subtitle ? `<p class="subtitle">${escapeHtml(sec.subtitle)}</p>` : ''}
          <div class="grid-2">
            ${items
              .map(
                (p: any) => `
              <article class="card">
                ${p.coverImage ? `<img src="${p.coverImage}" alt="${escapeHtml(p.coverAlt || p.title)}" />` : ''}
                <div class="meta">${escapeHtml(p.category || 'Project')} ${p.metrics ? `· ${escapeHtml(p.metrics)}` : ''}</div>
                <h3>${escapeHtml(p.title)}</h3>
                <p style="margin:0.65rem 0;color:var(--muted);font-size:0.9rem;">${escapeHtml(p.description)}</p>
                <div class="meta">${(p.tags || []).map(escapeHtml).join(' · ')}</div>
              </article>`
              )
              .join('')}
          </div>
        </div>
      </section>`;
    }

    if (sec.type === 'skills') {
      const items = Array.isArray(sec.data?.items) ? sec.data.items : [];
      return `
      <section id="skills">
        <div class="container">
          <h2>${escapeHtml(sec.title)}</h2>
          <div class="grid-2">
            ${items
              .map(
                (sk: any) => `
              <div class="card" style="padding:1rem 1.25rem;">
                <div style="display:flex;justify-content:space-between;">
                  <strong>${escapeHtml(sk.name)}</strong>
                  <span class="meta">${Number(sk.level || 85)}%</span>
                </div>
                <div class="meta">${escapeHtml(sk.category || '')}</div>
              </div>`
              )
              .join('')}
          </div>
        </div>
      </section>`;
    }

    if (sec.type === 'contact') {
      const email = sec.data?.email || profile.email;
      const actionAttr = settings.formEndpoint
        ? `action="${escapeHtml(settings.formEndpoint)}" method="POST"`
        : `action="mailto:${escapeHtml(email)}" method="GET" enctype="text/plain"`;
      return `
      <section id="contact">
        <div class="container">
          <h2>${escapeHtml(sec.title)}</h2>
          <p class="subtitle">${escapeHtml(email)} · ${escapeHtml(profile.location)}</p>
          <form class="card" ${actionAttr} style="max-width:560px;">
            <div style="margin-bottom:1rem;">
              <label style="display:block;font-size:0.8rem;margin-bottom:0.25rem;">Your Name</label>
              <input type="text" name="name" required style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid #334155;background:var(--bg);color:var(--text);" />
            </div>
            <div style="margin-bottom:1rem;">
              <label style="display:block;font-size:0.8rem;margin-bottom:0.25rem;">Your Email</label>
              <input type="email" name="email" required style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid #334155;background:var(--bg);color:var(--text);" />
            </div>
            <div style="margin-bottom:1rem;">
              <label style="display:block;font-size:0.8rem;margin-bottom:0.25rem;">Message</label>
              <textarea name="body" rows="4" required style="width:100%;padding:0.6rem;border-radius:6px;border:1px solid #334155;background:var(--bg);color:var(--text);"></textarea>
            </div>
            <button type="submit" class="btn">Send Inquiry</button>
          </form>
        </div>
      </section>`;
    }

    const items = Array.isArray(sec.data?.items) ? sec.data.items : [];
    return `
    <section id="${escapeHtml(sec.type)}">
      <div class="container">
        <h2>${escapeHtml(sec.title)}</h2>
        <div class="grid-2">
          ${items
            .map(
              (item: any) => `
            <div class="card">
              <div class="meta">${escapeHtml(item.company || item.institute || item.issuer || item.date || '')}</div>
              <h3>${escapeHtml(item.role || item.degree || item.title || item.name || item.caption || '')}</h3>
              <p style="margin-top:0.5rem;color:var(--muted);font-size:0.9rem;">
                ${escapeHtml(
                  item.description ||
                    item.quote ||
                    item.summary ||
                    (Array.isArray(item.bullets) ? item.bullets.join(' • ') : '')
                )}
              </p>
            </div>`
            )
            .join('')}
        </div>
      </div>
    </section>`;
  };

  const cssBlock = externalCss
    ? `<link rel="stylesheet" href="styles.css" />`
    : `<style>${generateStaticCss(portfolio)}</style>`;

  return `<!DOCTYPE html>
<html lang="${escapeHtml(seo.language || 'en')}">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>${escapeHtml(seo.title || `${profile.name} — Portfolio`)}</title>
  <meta name="description" content="${escapeHtml(seo.description || profile.headline)}" />
  <meta name="keywords" content="${escapeHtml((seo.keywords || []).join(', '))}" />
  <meta property="og:title" content="${escapeHtml(seo.title || profile.name)}" />
  <meta property="og:description" content="${escapeHtml(seo.description || profile.headline)}" />
  <meta property="og:type" content="website" />
  <link rel="preconnect" href="https://fonts.googleapis.com" />
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
  <link href="https://fonts.googleapis.com/css2?family=${encodeURIComponent(theme.headingFont)}:wght@600;700&family=${encodeURIComponent(theme.bodyFont)}:wght@400;500;600&display=swap" rel="stylesheet" />
  <script type="application/ld+json">${JSON.stringify(jsonLd)}</script>
  ${cssBlock}
</head>
<body>
  <header>
    <div class="container nav-inner">
      <a href="#hero" class="brand">${escapeHtml(profile.name)}</a>
      <nav>
        ${visibleSections
          .filter((s) => s.type !== 'hero')
          .slice(0, 5)
          .map((s) => `<a href="#${escapeHtml(s.type)}">${escapeHtml(s.title)}</a>`)
          .join('')}
      </nav>
    </div>
  </header>
  <main>
    ${visibleSections.map(renderSectionHtml).join('\n')}
  </main>
  <footer>
    <div class="container">
      <p>© ${new Date().getFullYear()} ${escapeHtml(profile.name)}. All rights reserved.${
    settings.showMadeWithFolio ? ' · Built with FOLIO' : ''
  }</p>
    </div>
  </footer>
  ${externalCss ? '<script src="script.js"></script>' : ''}
</body>
</html>`;
}

export async function downloadStaticSiteZip(portfolio: Portfolio): Promise<void> {
  const zip = new JSZip();
  const slug = portfolio.settings.customSlug || portfolio.profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');

  zip.file('index.html', generateStaticHtml(portfolio, true));
  zip.file('styles.css', generateStaticCss(portfolio));
  zip.file(
    'script.js',
    `// FOLIO Exported Portfolio Interactive Script\nconsole.log("Portfolio loaded for ${portfolio.profile.name}");\n`
  );
  zip.file('portfolio.json', JSON.stringify(portfolio, null, 2));
  zip.file(
    'README.md',
    `# ${portfolio.profile.name} — Portfolio Website\n\nGenerated with FOLIO Visual Portfolio Builder.\n\n## How to Host\n1. **Netlify Drop**: Drag and drop this unzipped folder onto https://app.netlify.com/drop\n2. **GitHub Pages**: Push these files to a GitHub repository and enable GitHub Pages in Settings -> Pages.\n3. **Vercel**: Run \`npx vercel\` inside this folder.\n`
  );

  const blob = await zip.generateAsync({ type: 'blob' });
  triggerBlobDownload(blob, `${slug || 'portfolio'}-static-site.zip`);
}

export function downloadSingleHtml(portfolio: Portfolio): void {
  const slug = portfolio.settings.customSlug || portfolio.profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const html = generateStaticHtml(portfolio, false);
  const blob = new Blob([html], { type: 'text/html;charset=utf-8' });
  triggerBlobDownload(blob, `${slug || 'portfolio'}.html`);
}

export function downloadPortfolioJson(portfolio: Portfolio): void {
  const slug = portfolio.settings.customSlug || portfolio.profile.name.toLowerCase().replace(/[^a-z0-9]+/g, '-');
  const blob = new Blob([JSON.stringify(portfolio, null, 2)], {
    type: 'application/json;charset=utf-8',
  });
  triggerBlobDownload(blob, `${slug || 'portfolio'}.folio.json`);
}

function triggerBlobDownload(blob: Blob, filename: string): void {
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  setTimeout(() => URL.revokeObjectURL(url), 1000);
}
