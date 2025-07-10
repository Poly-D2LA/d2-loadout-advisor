const fs = require("fs");
const path = require("path");
const sharp = require("sharp");

const inputDir = "./images";
const backupDir = "./images-backup";
const extensions = [".jpg", ".jpeg", ".png", ".webp", ".avif"];

if (!fs.existsSync(backupDir)) {
  fs.mkdirSync(backupDir, { recursive: true });
}

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
      console.log(`📦 Backed up: ${relPath}`);

      let format = "jpeg"; // default conversion target
      let outputPath = fullPath;

      if (ext === ".png") {
        format = "png";
        outputPath = fullPath;
      } else {
        outputPath = fullPath.replace(ext, ".jpg");
      }

      sharp(fullPath)
        .toFormat(format, {
          quality: 70,
          progressive: true
        })
        .toFile(outputPath + ".temp")
        .then(() => {
          fs.renameSync(outputPath + ".temp", outputPath);
          console.log(`✅ Compressed${ext !== ".png" ? " & converted" : ""}: ${path.relative(inputDir, outputPath)}`);
        })
        .catch(err => console.error(`❌ Error processing ${relPath}:`, err));
    }
  });
}

walk(inputDir);
