const fs = require("fs");
const path = require("path");

const OUT_DIR = path.join(process.cwd(), "out");

function isTxtFile(name) {
  return name.toLowerCase().endsWith(".txt");
}

function isRobotsTxt(name) {
  return name.toLowerCase() === "robots.txt";
}

function walkAndDeleteTxt(dir) {
  let stat;
  try {
    stat = fs.statSync(dir);
  } catch {
    return;
  }
  if (!stat.isDirectory()) return;

  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    const fullPath = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      walkAndDeleteTxt(fullPath);
    } else if (ent.isFile() && isTxtFile(ent.name) && !isRobotsTxt(ent.name)) {
      fs.unlinkSync(fullPath);
    }
  }
}

if (!fs.existsSync(OUT_DIR)) {
  process.exit(0);
}

walkAndDeleteTxt(OUT_DIR);
process.exit(0);
