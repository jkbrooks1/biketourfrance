import fs from "fs";
import path from "path";

function processDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (/\.(html|astro|jsx|tsx)$/.test(file)) {
      let content = fs.readFileSync(fullPath, "utf8");
      let modified = false;

      // 1. Remove/replace noindex meta tags
      if (/noindex/i.test(content)) {
        content = content.replace(/<meta[^>]*name=["']robots["'][^>]*content=["'][^"']*noindex[^"']*["'][^>]*>/gi, '<meta name="robots" content="index, follow" />');
        content = content.replace(/content=["']noindex,?\s*nofollow,?\s*noarchive["']/gi, 'content="index, follow"');
        content = content.replace(/content=["']noindex["']/gi, 'content="index, follow"');
        modified = true;
      }

      // 2. Inject valid @context and @type into empty JSON-LD blocks
      if (/<script[^>]*type=["']application\/ld\+json["']/i.test(content)) {
        content = content.replace(
          /<script[^>]*type=["']application\/ld\+json["'][^>]*>\s*\{\s*\}\s*<\/script>/gi,
          '<script type="application/ld+json">{"@context":"https://schema.org","@type":"WebSite","name":"BikeTourFrance","url":"https://www.biketourfrance.net"}</script>'
        );
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, "utf8");
        console.log(`✔ Patched SEO tags in: ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

console.log("🛠️ Purging stale staging tags & updating JSON-LD across src/ and dist/...\n");
processDir(path.join(process.cwd(), "src"));
processDir(path.join(process.cwd(), "dist"));
console.log("\n✅ Source and dist SEO patches applied.\n");
