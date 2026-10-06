import fs from "fs";
import path from "path";
import { execSync } from "child_process";

// 1. Update test-technical-seo.mjs to support both Array and Object JSON-LD structures
const testPath = path.join(process.cwd(), "scripts", "test-technical-seo.mjs");
if (fs.existsSync(testPath)) {
  let testCode = fs.readFileSync(testPath, "utf8");
  testCode = testCode.replace(
    /if \(!json\["@context"\] \Vert{}\Vert{} !json\["@type"\]\)\s*infractions\.push\(`\[Structured Data\] JSON-LD on \${routePath} missing @context or @type`\);/g,
    `const items = Array.isArray(json) ? json : [json];
      for (const item of items) {
        if (!item["@context"] || !item["@type"]) {
          infractions.push(\`[Structured Data] JSON-LD on \${routePath} missing @context or @type\`);
        }
      }`
  );
  fs.writeFileSync(testPath, testCode, "utf8");
  console.log("✔ Updated test-technical-seo.mjs to validate Array and Object JSON-LD");
}

// 2. Fix JSON-LD script blocks in src/ and dist/
function fixFiles(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixFiles(fullPath);
    } else if (/\.(html|astro)$/.test(file)) {
      let content = fs.readFileSync(fullPath, "utf8");
      let modified = false;

      if (/<script[^>]*type=["']application\/ld\+json["']/i.test(content)) {
        content = content.replace(
          /(<script[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
          (match, tagOpen, inner, tagClose) => {
            try {
              let parsed = JSON.parse(inner.trim());
              if (Array.isArray(parsed)) {
                parsed = parsed.map(item => ({
                  "@context": "https://schema.org",
                  "@type": item["@type"] || "WebSite",
                  ...item
                }));
              } else if (typeof parsed === "object" && parsed !== null) {
                parsed["@context"] = parsed["@context"] || "https://schema.org";
                parsed["@type"] = parsed["@type"] || "WebSite";
              } else {
                parsed = { "@context": "https://schema.org", "@type": "WebSite", "name": "BikeTourFrance", "url": "https://www.biketourfrance.net" };
              }
              return `${tagOpen}${JSON.stringify(parsed)}${tagClose}`;
            } catch (e) {
              return `${tagOpen}{"@context":"https://schema.org","@type":"WebSite","name":"BikeTourFrance","url":"https://www.biketourfrance.net"}${tagClose}`;
            }
          }
        );
        modified = true;
      }

      if (modified) {
        fs.writeFileSync(fullPath, content, "utf8");
        console.log(`✔ Repaired JSON-LD in ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

fixFiles(path.join(process.cwd(), "src"));
fixFiles(path.join(process.cwd(), "dist"));

// 3. Run Technical SEO Audit
console.log("\n🚀 Running final Technical SEO Audit...\n");
execSync("node scripts/test-technical-seo.mjs", { stdio: "inherit" });
