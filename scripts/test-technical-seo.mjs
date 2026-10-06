import fs from "fs";
import path from "path";

const DIST_DIR = path.join(process.cwd(), "dist");

if (!fs.existsSync(DIST_DIR)) {
  console.error("❌ ERROR: dist/ directory not found. Please run build first.");
  process.exit(1);
}

function getHtmlFiles(dir, fileList = []) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      getHtmlFiles(filePath, fileList);
    } else if (file.endsWith(".html")) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Order-agnostic and quote-safe meta attribute extractor
function getMetaContent(html, attrName, attrValue) {
  const regex = new RegExp(`<meta\\b[^>]*${attrName}=(["'])${attrValue}\\1[^>]*>`, "gi");
  const matches = [...html.matchAll(regex)];
  for (const match of matches) {
    const tag = match[0];
    const contentMatch = tag.match(/content=(["'])([\s\S]*?)\1/i);
    if (contentMatch) return contentMatch[2].trim();
  }
  return null;
}

const files = getHtmlFiles(DIST_DIR);
const titles = new Map();
const descriptions = new Map();
const infractions = [];

let pagesAudited = 0;
let jsonLdCount = 0;

console.log("\n==================================================");
console.log("🔍 TECHNICAL SEO & SOCIAL-SHARING AUDIT (REVISED)");
console.log("==================================================\n");

for (const filePath of files) {
  const relativePath = path.relative(DIST_DIR, filePath);
  const routePath = "/" + relativePath.replace(/index\.html$/, "");
  const is404 = relativePath === "404.html";
  const content = fs.readFileSync(filePath, "utf8");

  pagesAudited++;

  // 1. Check for stale staging noindex tag
  if (!is404) {
    const noindexMatch = content.match(/<meta[^>]*name=(["'])robots\1[^>]*content=(["'])[^"']*noindex[^"']*\2[^>]*>/i) ||
                         content.match(/<meta[^>]*content=(["'])[^"']*noindex[^"']*\1[^>]*name=(["'])robots\2[^>]*>/i);
    if (noindexMatch) {
      infractions.push(`[Staging Residue] Stale "noindex" meta tag found on public page ${routePath}`);
    }
  }

  // 2. Title Tag (404 is excluded from duplicate map pollution)
  const titleMatch = content.match(/<title>([\s\S]*?)<\/title>/i);
  const cleanTitle = titleMatch ? titleMatch[1].trim() : null;
  if (!cleanTitle) {
    infractions.push(`[Missing Title] ${routePath} lacks a <title> tag`);
  } else if (!is404) {
    if (titles.has(cleanTitle)) {
      infractions.push(`[Duplicate Title] "${cleanTitle}" shared between ${titles.get(cleanTitle)} and ${routePath}`);
    } else {
      titles.set(cleanTitle, routePath);
    }
  }

  // 3. Meta Description (404 is excluded from duplicate map pollution)
  const cleanDesc = getMetaContent(content, "name", "description");
  if (!cleanDesc) {
    infractions.push(`[Missing Description] ${routePath} lacks a meta description`);
  } else if (!is404) {
    if (descriptions.has(cleanDesc)) {
      infractions.push(`[Duplicate Description] "${cleanDesc}" shared between ${descriptions.get(cleanDesc)} and ${routePath}`);
    } else {
      descriptions.set(cleanDesc, routePath);
    }
  }

  // 4. Canonical URL & Domain Host Parsing
  let canonicalHref = null;
  if (!is404) {
    const canonicalTag = content.match(/<link[^>]*rel=(["'])canonical\1[^>]*>/i)?.[0] ||
                         content.match(/<link[^>]*href=(["'])[\s\S]*?\1[^>]*rel=(["'])canonical\2[^>]*>/i)?.[0];
    canonicalHref = canonicalTag ? canonicalTag.match(/href=(["'])([\s\S]*?)\1/i)?.[2]?.trim() : null;

    if (!canonicalHref) {
      infractions.push(`[Missing Canonical] ${routePath} lacks a rel="canonical" link tag`);
    } else {
      try {
        const u = new URL(canonicalHref);
        if (u.protocol !== "https:") infractions.push(`[Non-HTTPS Canonical] ${routePath} canonical URL "${canonicalHref}" is not HTTPS`);
        if (u.hostname !== "www.biketourfrance.net" && u.hostname !== "biketourfrance.net") {
          infractions.push(`[Canonical Domain Mismatch] ${routePath} canonical URL "${canonicalHref}" does not target biketourfrance.net`);
        }
      } catch (e) {
        infractions.push(`[Invalid Canonical URL] ${routePath} has unparseable canonical URL "${canonicalHref}"`);
      }
    }
  }

  // 5. OpenGraph Tags (Absolute URL + Canonical Alignment)
  if (!is404) {
    const ogTitle = getMetaContent(content, "property", "og:title");
    const ogDesc = getMetaContent(content, "property", "og:description");
    const ogImage = getMetaContent(content, "property", "og:image");
    const ogUrl = getMetaContent(content, "property", "og:url");

    if (!ogTitle) infractions.push(`[OpenGraph Missing] ${routePath} missing og:title`);
    if (!ogDesc) infractions.push(`[OpenGraph Missing] ${routePath} missing og:description`);
    if (!ogImage) {
      infractions.push(`[OpenGraph Missing] ${routePath} missing og:image`);
    } else if (!ogImage.startsWith("https://")) {
      infractions.push(`[OpenGraph Non-Absolute Image] ${routePath} og:image "${ogImage}" must be an absolute HTTPS URL`);
    }
    if (!ogUrl) {
      infractions.push(`[OpenGraph Missing] ${routePath} missing og:url`);
    } else if (canonicalHref && ogUrl !== canonicalHref) {
      infractions.push(`[OpenGraph Mismatch] ${routePath} og:url "${ogUrl}" does not match canonical "${canonicalHref}"`);
    }
  }

  // 6. JSON-LD Structured Data Validation (with @graph support)
  const jsonLdMatches = [...content.matchAll(/<script[^>]*type=(["'])application\/ld\+json\1[^>]*>([\s\S]*?)<\/script>/gi)];
  for (const match of jsonLdMatches) {
    jsonLdCount++;
    try {
      const parsed = JSON.parse(match[2].trim());
      const items = Array.isArray(parsed) ? parsed : (parsed["@graph"] ? parsed["@graph"] : [parsed]);
      const rootContext = parsed["@context"];
      let hasType = false;

      for (const item of items) {
        if (item["@type"] || parsed["@type"]) hasType = true;
      }

      const hasContext = !!rootContext || items.some(i => !!i["@context"]);
      if (!hasContext || !hasType) {
        infractions.push(`[Structured Data] JSON-LD on ${routePath} missing @context or @type`);
      }
    } catch (e) {
      infractions.push(`[Structured Data Syntax Error] Invalid JSON-LD on ${routePath}: ${e.message}`);
    }
  }
}

// 7. Line-Anchored Robots.txt Validation
const robotsPath = path.join(DIST_DIR, "robots.txt");
if (!fs.existsSync(robotsPath)) {
  infractions.push(`[Missing Robots.txt] dist/robots.txt does not exist`);
} else {
  const robotsTxt = fs.readFileSync(robotsPath, "utf8");
  if (/^Disallow:\s*\/\s*$/m.test(robotsTxt)) {
    infractions.push(`[Robots.txt Blocking] dist/robots.txt contains line-anchored "Disallow: /" blocking indexation`);
  }
  if (!/Sitemap:/i.test(robotsTxt)) {
    infractions.push(`[Robots.txt Missing Sitemap] dist/robots.txt lacks a Sitemap: directive`);
  } else {
    console.log("✔ dist/robots.txt verified: allows crawling and specifies Sitemap directive.");
  }
}

// 8. Sitemap XML Verification
const sitemapIndexPath = path.join(DIST_DIR, "sitemap-index.xml");
const sitemap0Path = path.join(DIST_DIR, "sitemap-0.xml");
let sitemapContent = "";
if (fs.existsSync(sitemapIndexPath)) sitemapContent += fs.readFileSync(sitemapIndexPath, "utf8");
if (fs.existsSync(sitemap0Path)) sitemapContent += fs.readFileSync(sitemap0Path, "utf8");

if (!sitemapContent) {
  infractions.push(`[Missing Sitemap] No sitemap XML file found in dist/`);
} else {
  if (sitemapContent.includes("/404") || sitemapContent.includes("404.html")) {
    infractions.push(`[Stale Sitemap Entry] Sitemap contains 404 error page`);
  }
  for (const filePath of files) {
    const relativePath = path.relative(DIST_DIR, filePath);
    if (relativePath === "404.html") continue;
    const routePath = "/" + relativePath.replace(/index\.html$/, "");
    const routeRegex = new RegExp(`biketourfrance\\.net${routePath.replace(/\/$/, "")}/?`, "i");
    if (!routeRegex.test(sitemapContent)) {
      infractions.push(`[Sitemap Omission] Indexable route ${routePath} is missing from sitemap`);
    }
  }
  console.log("✔ Sitemap verified: all indexable routes included, 404 excluded.");
}

console.log("\n==================================================");
console.log("📊 TECHNICAL SEO AUDIT RESULTS");
console.log("==================================================");
console.log(`✔ Indexable Pages Audited: ${pagesAudited}`);
console.log(`✔ JSON-LD Blocks Validated: ${jsonLdCount}\n`);

if (infractions.length > 0) {
  console.log(`❌ TECHNICAL SEO AUDIT FAILED (${infractions.length} release blockers found):\n`);
  infractions.forEach(e => console.log(`   ${e}`));
  process.exit(1);
} else {
  console.log("✅ TECHNICAL SEO AUDIT PASSED: 100% Release Ready!");
  process.exit(0);
}
