const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = "./images";
const backupDir = "./images-backup";
const extensions = [".jpg", ".jpeg", ".png", ".webp"];

// Ensure backup base exists
if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

// Recursively walk through directories
function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach(entry => {
    const fullPath = path.join(dir, entry.name);
    const relPath = path.relative(inputDir, fullPath);
    const backupPath = path.join(backupDir, relPath);

    if (entry.isDirectory()) {
      fs.mkdirSync(backupPath, { recursive: true });
      walk(fullPath);
    } else if (entry.isFile()) {
      const ext = path.extname(entry.name).toLowerCase();
      if (!extensions.includes(ext)) return;

      // Backup original
      fs.copyFileSync(fullPath, backupPath);
      console.log(`📁 Backed up: ${relPath}`);

      // Compress and overwrite
sharp(fullPath)
  .toFormat(ext === ".png" ? "png" : "jpeg", {
    quality: 70,
    progressive: true
  })
  .toFile(fullPath + ".temp") // write to temp file first
  .then(() => {
    fs.renameSync(fullPath + ".temp", fullPath); // overwrite original
    console.log(`✅ Compressed and replaced: ${relPath}`);
  })
  .catch(err => console.error(`❌ Error: ${relPath}`, err));

    }
  });
}

walk(inputDir);
