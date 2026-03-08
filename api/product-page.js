const API_URL = process.env.API_URL || process.env.VITE_API_URL || 'http://localhost:4000/api/v1';

const trimTrailingSlash = (value = '') => value.replace(/\/+$/, '');

const escapeHtml = (value = '') => String(value)
  .replace(/&/g, '&amp;')
  .replace(/</g, '&lt;')
  .replace(/>/g, '&gt;')
  .replace(/"/g, '&quot;')
  .replace(/'/g, '&#39;');

const escapeJsonForHtml = (value = '') => String(value).replace(/</g, '\\u003c');

const getHeader = (req, name) => {
  const value = req.headers[name];
  if (Array.isArray(value)) return value[0] || '';
  return value || '';
};

const getSiteOrigin = (req) => {
  const configured = trimTrailingSlash(process.env.SITE_URL || process.env.VITE_SITE_URL || '');
  if (configured) return configured;

  const protocol = getHeader(req, 'x-forwarded-proto').split(',')[0] || 'https';
  const host = getHeader(req, 'x-forwarded-host') || getHeader(req, 'host');
  return `${protocol}://${host}`;
};

const upsertTag = (html, regex, replacement) => {
  if (regex.test(html)) return html.replace(regex, replacement);
  return html.replace('</head>', `  ${replacement}\n  </head>`);
};

const injectMeta = ({ html, title, description, imageUrl, canonicalUrl, pageUrl, product }) => {
  const safeTitle = escapeHtml(title);
  const safeDescription = escapeHtml(description);
  const safeImageUrl = escapeHtml(imageUrl);
  const safeCanonicalUrl = escapeHtml(canonicalUrl);
  const safePageUrl = escapeHtml(pageUrl);
  const jsonLd = escapeJsonForHtml(JSON.stringify({
    '@context': 'https://schema.org',
    '@type': 'Product',
    name: product.name,
    description,
    image: imageUrl ? [imageUrl] : [],
    offers: {
      '@type': 'Offer',
      price: product.price,
      priceCurrency: product.currency || 'AOA',
      availability: product.stock > 0 ? 'https://schema.org/InStock' : 'https://schema.org/OutOfStock',
      url: canonicalUrl,
    },
  }));

  let nextHtml = html;
  nextHtml = nextHtml.replace(/<title>[\s\S]*?<\/title>/i, `<title>${safeTitle}</title>`);
  nextHtml = upsertTag(nextHtml, /<meta\s+name=["']description["'][^>]*>/i, `<meta name="description" content="${safeDescription}" />`);
  nextHtml = upsertTag(nextHtml, /<link\s+rel=["']canonical["'][^>]*>/i, `<link rel="canonical" href="${safeCanonicalUrl}" />`);
  nextHtml = upsertTag(nextHtml, /<meta\s+property=["']og:title["'][^>]*>/i, `<meta property="og:title" content="${safeTitle}" />`);
  nextHtml = upsertTag(nextHtml, /<meta\s+property=["']og:description["'][^>]*>/i, `<meta property="og:description" content="${safeDescription}" />`);
  nextHtml = upsertTag(nextHtml, /<meta\s+property=["']og:type["'][^>]*>/i, `<meta property="og:type" content="product" />`);
  nextHtml = upsertTag(nextHtml, /<meta\s+property=["']og:url["'][^>]*>/i, `<meta property="og:url" content="${safePageUrl}" />`);
  nextHtml = upsertTag(nextHtml, /<meta\s+property=["']og:image["'][^>]*>/i, `<meta property="og:image" content="${safeImageUrl}" />`);
  nextHtml = upsertTag(nextHtml, /<meta\s+name=["']twitter:title["'][^>]*>/i, `<meta name="twitter:title" content="${safeTitle}" />`);
  nextHtml = upsertTag(nextHtml, /<meta\s+name=["']twitter:description["'][^>]*>/i, `<meta name="twitter:description" content="${safeDescription}" />`);
  nextHtml = upsertTag(nextHtml, /<meta\s+name=["']twitter:image["'][^>]*>/i, `<meta name="twitter:image" content="${safeImageUrl}" />`);
  nextHtml = upsertTag(nextHtml, /<meta\s+name=["']twitter:card["'][^>]*>/i, `<meta name="twitter:card" content="summary_large_image" />`);
  nextHtml = nextHtml.replace('</head>', `  <script type="application/ld+json">${jsonLd}</script>\n  </head>`);
  return nextHtml;
};

const getId = (req) => {
  const raw = req.query?.id;
  if (Array.isArray(raw)) return raw[0] || '';
  return raw || '';
};

export default async function handler(req, res) {
  const productId = getId(req);
  const siteOrigin = getSiteOrigin(req);
  const productUrl = `${siteOrigin}/products/${encodeURIComponent(productId)}`;

  try {
    const [productRes, indexRes] = await Promise.all([
      fetch(`${trimTrailingSlash(API_URL)}/products/${encodeURIComponent(productId)}`, {
        headers: { Accept: 'application/json' },
      }),
      fetch(`${siteOrigin}/`, {
        headers: { Accept: 'text/html' },
      }),
    ]);

    const baseHtml = await indexRes.text();
    if (!productRes.ok) {
      res.setHeader('Content-Type', 'text/html; charset=utf-8');
      res.status(productRes.status || 404).send(baseHtml);
      return;
    }

    const data = await productRes.json();
    const product = data.product;
    const title = product?.name || 'Produto';
    const description = product?.description || `Veja ${title} na YetuStore.`;
    const imageUrl = product?.imageUrl
      ? new URL(product.imageUrl, `${siteOrigin}/`).toString()
      : `${siteOrigin}/logo.png`;

    const html = injectMeta({
      html: baseHtml,
      title,
      description,
      imageUrl,
      canonicalUrl: productUrl,
      pageUrl: productUrl,
      product: {
        name: title,
        price: product?.price || 0,
        currency: product?.currency || 'AOA',
        stock: product?.stock || 0,
      },
    });

    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.setHeader('Cache-Control', 'public, s-maxage=300, stale-while-revalidate=86400');
    res.status(200).send(html);
  } catch {
    const fallback = `<!doctype html><html lang="pt"><head><meta charset="UTF-8" /><meta http-equiv="refresh" content="0;url=${escapeHtml(productUrl)}" /></head><body></body></html>`;
    res.setHeader('Content-Type', 'text/html; charset=utf-8');
    res.status(200).send(fallback);
  }
}
