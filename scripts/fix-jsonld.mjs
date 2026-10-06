import fs from "fs";
import path from "path";

function fixJsonLdInDir(dir) {
  if (!fs.existsSync(dir)) return;
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      fixJsonLdInDir(fullPath);
    } else if (/\.(html|astro)$/.test(file)) {
      let content = fs.readFileSync(fullPath, "utf8");
      let modified = false;

      content = content.replace(
        /(<script[^>]*type=["']application\/ld\+json["'][^>]*>)([\s\S]*?)(<\/script>)/gi,
        (match, tagOpen, inner, tagClose) => {
          modified = true;
          try {
            let data = JSON.parse(inner.trim());
            if (Array.isArray(data)) {
              data = data.map(item => ({
                "@context": item["@context"] || "https://schema.org",
                "@type": item["@type"] || "WebSite",
                ...item
              }));
            } else if (typeof data === "object" && data !== null) {
              data["@context"] = data["@context"] || "https://schema.org";
              data["@type"] = data["@type"] || "WebSite";
            } else {
              data = { "@context": "https://schema.org", "@type": "WebSite", "name": "BikeTourFrance", "url": "https://www.biketourfrance.net" };
            }
            return `${tagOpen}${JSON.stringify(data)}${tagClose}`;
          } catch (e) {
            return `${tagOpen}{"@context":"https://schema.org","@type":"WebSite","name":"BikeTourFrance","url":"https://www.biketourfrance.net"}${tagClose}`;
          }
        }
      );

      if (modified) {
        fs.writeFileSync(fullPath, content, "utf8");
        console.log(`✔ Injected valid Schema @context & @type into: ${path.relative(process.cwd(), fullPath)}`);
      }
    }
  }
}

console.log("🛠️ Repairing JSON-LD Schema Objects...\n");
fixJsonLdInDir(path.join(process.cwd(), "src"));
fixJsonLdInDir(path.join(process.cwd(), "dist"));
console.log("\n✅ JSON-LD repairs complete.\n");
