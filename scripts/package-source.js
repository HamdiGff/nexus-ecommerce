const fs = require("fs");
const path = require("path");
const { execSync } = require("child_process");

const rootDir = path.resolve(__dirname, "..");
const tempDir = path.join(rootDir, "temp_hostinger_src");
const zipOutput = path.join(rootDir, "hostinger-source.zip");

if (fs.existsSync(tempDir)) fs.rmSync(tempDir, { recursive: true, force: true });
if (fs.existsSync(zipOutput)) fs.unlinkSync(zipOutput);

fs.mkdirSync(tempDir);

// Items to include for Hostinger Cloud Build
const items = [
  "src",
  "public",
  "prisma",
  "package.json",
  "package-lock.json",
  "tsconfig.json",
  "next.config.ts",
  "postcss.config.mjs",
  ".env.example"
];

items.forEach(item => {
  const src = path.join(rootDir, item);
  const dest = path.join(tempDir, item);
  if (fs.existsSync(src)) {
    fs.cpSync(src, dest, { recursive: true });
    console.log(`Copied ${item}`);
  }
});

// Also provide a fallback .env for the build step
const envContent = `DATABASE_URL="postgresql://postgres:postgres@localhost:5432/custom_ecommerce?schema=public"
NEXT_PUBLIC_APP_URL="https://olive-hare-765754.hostingersite.com"
NEXTAUTH_SECRET="random-secret-key-12345"
NEXTAUTH_URL="https://olive-hare-765754.hostingersite.com"
`;
fs.writeFileSync(path.join(tempDir, ".env"), envContent, "utf8");

console.log("Compressing source code archive...");
execSync(`powershell -Command "Compress-Archive -Path '${tempDir}\\*' -DestinationPath '${zipOutput}' -Force"`, {
  cwd: rootDir,
  stdio: "inherit"
});

fs.rmSync(tempDir, { recursive: true, force: true });
console.log(`\nCreated Hostinger Source ZIP successfully at:\n${zipOutput}`);
