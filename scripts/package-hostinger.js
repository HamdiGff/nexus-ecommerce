const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const standaloneDir = path.join(rootDir, ".next", "standalone");
const staticSource = path.join(rootDir, ".next", "static");
const staticDest = path.join(standaloneDir, ".next", "static");
const publicSource = path.join(rootDir, "public");
const publicDest = path.join(standaloneDir, "public");
const zipOutput = path.join(rootDir, "hostinger-deploy.zip");

console.log("=== PREPARING HOSTINGER DEPLOYMENT PACKAGE ===");

// 1. Verify standalone folder exists
if (!fs.existsSync(standaloneDir)) {
  console.error("Error: .next/standalone folder not found. Running build first...");
  execSync("npm.cmd run build", { cwd: rootDir, stdio: "inherit" });
}

// 2. Copy .next/static to .next/standalone/.next/static
console.log("1. Copying static assets...");
if (fs.existsSync(staticSource)) {
  fs.cpSync(staticSource, staticDest, { recursive: true });
  console.log("   ✓ Copied .next/static -> .next/standalone/.next/static");
}

// 3. Copy public folder if exists
console.log("2. Copying public assets...");
if (fs.existsSync(publicSource)) {
  fs.cpSync(publicSource, publicDest, { recursive: true });
  console.log("   ✓ Copied public -> .next/standalone/public");
} else {
  fs.mkdirSync(publicDest, { recursive: true });
}

// 4. Create Hostinger .htaccess file for reverse proxy / Node app if needed
const htaccessContent = `# Hostinger LiteSpeed / Apache Proxy to Node.js App
DirectoryIndex disabled
RewriteEngine On

# Redirect traffic to Node.js running on internal port (default Hostinger port or 3000)
RewriteRule ^$ http://127.0.0.1:3000/ [P,L]
RewriteCond %{REQUEST_FILENAME} !-f
RewriteCond %{REQUEST_FILENAME} !-d
RewriteRule ^(.*)$ http://127.0.0.1:3000/$1 [P,L]
`;
fs.writeFileSync(path.join(standaloneDir, ".htaccess"), htaccessContent, "utf8");
console.log("3. Created .htaccess routing file in package");

// 5. Create Hostinger startup ecosystem config (ecosystem.config.js) for PM2 / VPS / Node manager
const ecosystemContent = `module.exports = {
  apps: [
    {
      name: "nexus-store",
      script: "server.js",
      env: {
        NODE_ENV: "production",
        PORT: process.env.PORT || 3000
      }
    }
  ]
};
`;
fs.writeFileSync(path.join(standaloneDir, "ecosystem.config.js"), ecosystemContent, "utf8");
console.log("4. Created ecosystem.config.js for PM2/Node manager");

// 6. Zip standalone contents using PowerShell Compress-Archive
console.log("5. Creating hostinger-deploy.zip...");
if (fs.existsSync(zipOutput)) {
  fs.unlinkSync(zipOutput);
}

try {
  execSync(
    `powershell -Command "Compress-Archive -Path '${standaloneDir}\\*' -DestinationPath '${zipOutput}' -Force"`,
    { cwd: rootDir, stdio: "inherit" }
  );
  console.log(`\nSUCCESS! Deployment archive created:`);
  console.log(`-> ${zipOutput}`);
} catch (err) {
  console.error("Zip compression failed, files are ready inside .next/standalone directory directly.", err);
}
