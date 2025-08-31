// scripts/generate-robots.mjs
import 'dotenv/config';
import { writeFileSync } from 'fs';
import { resolve } from 'path';

const SITE_URL = (process.env.SITE_URL || '').replace(/\/$/, '');
const DISALLOW_ALL = process.env.DISALLOW_ALL === '1';

if (!SITE_URL && !DISALLOW_ALL) {
  throw new Error('SITE_URL is required unless DISALLOW_ALL=1');
}

const content = DISALLOW_ALL
  ? `User-agent: *\nDisallow: /\n`
  : `User-agent: *\nAllow: /\n\nSitemap: ${SITE_URL}/sitemap.xml\n`;

writeFileSync(resolve('public', 'robots.txt'), content);
console.log('✅ robots.txt generated:', DISALLOW_ALL ? '[DISALLOW ALL]' : SITE_URL);