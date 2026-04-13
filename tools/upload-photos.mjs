#!/usr/bin/env node
/**
 * HMSSTC Photo Upload Script
 * ===========================
 * 將 photos/ 資料夾內的圖片壓縮成 WebP 格式並上傳至 Cloudflare R2。
 * 上傳完成後自動更新 src/content/gallery/ 內的 YAML 相簿資料。
 *
 * 使用方式：
 *   node tools/upload-photos.mjs [資料夾名稱]
 *
 * 範例：
 *   node tools/upload-photos.mjs                # 上傳 photos/ 下所有相簿
 *   node tools/upload-photos.mjs icgpsro-2025   # 只上傳指定相簿
 *
 * 目錄結構：
 *   photos/
 *     icgpsro-2025/        ← 相簿名稱（會對應 src/content/gallery/icgpsro-2025.yml）
 *       photo1.jpg
 *       photo2.png
 *     ncku-forum-2024/
 *       ...
 */

import { createReadStream, existsSync, mkdirSync, readdirSync, statSync, readFileSync, writeFileSync } from "fs";
import { join, extname, basename, relative, dirname } from "path";
import { fileURLToPath } from "url";
import { createHash } from "crypto";
import { tmpdir } from "os";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);
const ROOT = join(__dirname, "..");

// ─── 載入環境變數 ───────────────────────────────────────────────────────────
const envPath = join(ROOT, ".env");
if (!existsSync(envPath)) {
  console.error("❌ 找不到 .env 檔案，請先建立並填入 Cloudflare R2 設定。");
  process.exit(1);
}

const envContent = readFileSync(envPath, "utf-8");
const env = Object.fromEntries(
  envContent
    .split("\n")
    .filter((line) => line.includes("=") && !line.startsWith("#"))
    .map((line) => {
      const [key, ...rest] = line.split("=");
      return [key.trim(), rest.join("=").trim()];
    })
);

const {
  CLOUDFLARE_ACCOUNT_ID,
  R2_ACCESS_KEY_ID,
  R2_SECRET_ACCESS_KEY,
  R2_ENDPOINT,
  R2_BUCKET_NAME,
  R2_PUBLIC_URL,
} = env;

const missingVars = [
  "CLOUDFLARE_ACCOUNT_ID",
  "R2_ACCESS_KEY_ID",
  "R2_SECRET_ACCESS_KEY",
  "R2_ENDPOINT",
  "R2_BUCKET_NAME",
  "R2_PUBLIC_URL",
].filter((v) => !env[v] || env[v].includes("XXXXXXX"));

if (missingVars.length > 0) {
  console.error(`❌ .env 中以下設定尚未填入：\n   ${missingVars.join(", ")}`);
  console.error("   請參考 README.md 的「Cloudflare R2 設定說明」章節。");
  process.exit(1);
}

// ─── 動態 import（確保環境變數已載入）────────────────────────────────────────
const { S3Client, PutObjectCommand, HeadObjectCommand } = await import("@aws-sdk/client-s3");
const sharp = (await import("sharp")).default;

const s3 = new S3Client({
  region: "auto",
  endpoint: R2_ENDPOINT,
  credentials: {
    accessKeyId: R2_ACCESS_KEY_ID,
    secretAccessKey: R2_SECRET_ACCESS_KEY,
  },
});

// ─── 設定 ────────────────────────────────────────────────────────────────────
const PHOTOS_DIR = join(ROOT, "photos");
const GALLERY_CONTENT_DIR = join(ROOT, "src/content/gallery");
const SUPPORTED_EXTENSIONS = [".jpg", ".jpeg", ".png", ".gif", ".webp", ".avif", ".tiff", ".bmp"];
const WEBP_QUALITY = 85;
const MAX_WIDTH = 2000;
const COVER_MAX_WIDTH = 800;

// ─── 輔助函式 ────────────────────────────────────────────────────────────────

function log(msg, level = "info") {
  const icons = { info: "ℹ️ ", success: "✅", warning: "⚠️ ", error: "❌" };
  console.log(`${icons[level] || "  "} ${msg}`);
}

function getAlbumDirs(targetAlbum) {
  if (!existsSync(PHOTOS_DIR)) {
    log(`找不到 photos/ 資料夾，請在根目錄建立並放入圖片。`, "error");
    log(`  mkdir -p photos/your-album-name`, "info");
    process.exit(1);
  }

  return readdirSync(PHOTOS_DIR)
    .filter((name) => {
      const fullPath = join(PHOTOS_DIR, name);
      return statSync(fullPath).isDirectory() && (!targetAlbum || name === targetAlbum);
    });
}

function findImages(dir) {
  const results = [];
  function walk(current) {
    for (const name of readdirSync(current)) {
      const fullPath = join(current, name);
      const stat = statSync(fullPath);
      if (stat.isDirectory()) {
        walk(fullPath);
      } else if (SUPPORTED_EXTENSIONS.includes(extname(name).toLowerCase())) {
        results.push(fullPath);
      }
    }
  }
  walk(dir);
  return results.sort();
}

async function fileExistsOnR2(key) {
  try {
    await s3.send(new HeadObjectCommand({ Bucket: R2_BUCKET_NAME, Key: key }));
    return true;
  } catch {
    return false;
  }
}

async function compressToWebP(inputPath, iscover = false) {
  const tempFile = join(tmpdir(), `hmsstc-${createHash("md5").update(inputPath).digest("hex")}.webp`);
  const maxWidth = iscover ? COVER_MAX_WIDTH : MAX_WIDTH;

  await sharp(inputPath)
    .rotate()
    .resize({ width: maxWidth, withoutEnlargement: true })
    .webp({ quality: WEBP_QUALITY })
    .toFile(tempFile);

  return tempFile;
}

async function uploadToR2(localPath, r2Key) {
  const fileContent = readFileSync(localPath);
  await s3.send(
    new PutObjectCommand({
      Bucket: R2_BUCKET_NAME,
      Key: r2Key,
      Body: fileContent,
      ContentType: "image/webp",
      CacheControl: "public, max-age=31536000, immutable",
    })
  );
}

function parseYaml(content) {
  const result = {};
  const lines = content.split("\n");
  let currentKey = null;
  let inArray = false;
  let arrayItems = [];

  for (const line of lines) {
    if (line.startsWith("#") || line.trim() === "") continue;

    const arrayItemMatch = line.match(/^- (.+)$/);
    const keyValueMatch = line.match(/^(\w[\w.]*?):\s*(.*)$/);

    if (arrayItemMatch && inArray) {
      const val = arrayItemMatch[1].trim().replace(/^["']|["']$/g, "");
      arrayItems.push(val);
    } else if (keyValueMatch) {
      if (inArray && currentKey) {
        result[currentKey] = arrayItems;
      }
      inArray = false;
      arrayItems = [];
      currentKey = keyValueMatch[1];
      const val = keyValueMatch[2].trim();
      if (val === "") {
        inArray = true;
      } else {
        result[currentKey] = val.replace(/^["']|["']$/g, "");
      }
    }
  }
  if (inArray && currentKey) {
    result[currentKey] = arrayItems;
  }
  return result;
}

function buildYaml(albumId, albumData) {
  const lines = [];
  lines.push(`title: ${JSON.stringify(albumData.title)}`);
  if (albumData.titleEn) lines.push(`titleEn: ${JSON.stringify(albumData.titleEn)}`);
  lines.push(`date: ${JSON.stringify(albumData.date)}`);
  if (albumData.description) lines.push(`description: ${JSON.stringify(albumData.description)}`);
  if (albumData.descriptionEn) lines.push(`descriptionEn: ${JSON.stringify(albumData.descriptionEn)}`);
  lines.push(`cover: ${JSON.stringify(albumData.cover || "")}`);
  if (albumData.order !== undefined) lines.push(`order: ${albumData.order}`);
  lines.push(`photos:`);
  for (const photo of albumData.photos) {
    lines.push(`  - url: ${JSON.stringify(photo.url)}`);
    if (photo.caption) lines.push(`    caption: ${JSON.stringify(photo.caption)}`);
    if (photo.captionEn) lines.push(`    captionEn: ${JSON.stringify(photo.captionEn)}`);
  }
  return lines.join("\n") + "\n";
}

function loadExistingYaml(albumId) {
  const yamlPath = join(GALLERY_CONTENT_DIR, `${albumId}.yml`);
  if (existsSync(yamlPath)) {
    try {
      const content = readFileSync(yamlPath, "utf-8");
      const parsed = parseYaml(content);
      return {
        title: parsed.title || albumId,
        titleEn: parsed.titleEn,
        date: parsed.date || new Date().toISOString().split("T")[0],
        description: parsed.description,
        descriptionEn: parsed.descriptionEn,
        cover: parsed.cover || "",
        order: parsed.order ? Number(parsed.order) : undefined,
        photos: [],
      };
    } catch {
      // ignore parse errors
    }
  }
  return {
    title: albumId,
    date: new Date().toISOString().split("T")[0],
    cover: "",
    photos: [],
  };
}

// ─── 主程式 ──────────────────────────────────────────────────────────────────

async function processAlbum(albumName) {
  const albumDir = join(PHOTOS_DIR, albumName);
  const images = findImages(albumDir);

  if (images.length === 0) {
    log(`${albumName}: 沒有找到圖片，跳過。`, "warning");
    return;
  }

  log(`\n📂 處理相簿：${albumName}（${images.length} 張圖片）`);

  const albumData = loadExistingYaml(albumName);
  const existingUrls = new Set((albumData.photos || []).map((p) => p.url));
  const newPhotos = [...(albumData.photos || [])];
  let coverUrl = albumData.cover || "";
  let uploadCount = 0;
  let skipCount = 0;

  for (const [i, imagePath] of images.entries()) {
    const relPath = relative(albumDir, imagePath);
    const nameWithoutExt = relPath.replace(/\.[^/.]+$/, "").replace(/\\/g, "/");
    const r2Key = `gallery/${albumName}/${nameWithoutExt}.webp`;
    const publicUrl = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${r2Key}`;

    process.stdout.write(`  [${i + 1}/${images.length}] ${relPath} ... `);

    if (await fileExistsOnR2(r2Key)) {
      process.stdout.write("已存在，跳過\n");
      skipCount++;
      if (!existingUrls.has(publicUrl)) {
        newPhotos.push({ url: publicUrl });
        existingUrls.add(publicUrl);
      }
      if (!coverUrl && i === 0) coverUrl = publicUrl;
      continue;
    }

    try {
      const isCover = i === 0 && !coverUrl;
      const tempPath = await compressToWebP(imagePath, isCover);
      await uploadToR2(tempPath, r2Key);
      process.stdout.write("上傳成功 ✓\n");
      uploadCount++;

      if (!existingUrls.has(publicUrl)) {
        newPhotos.push({ url: publicUrl });
        existingUrls.add(publicUrl);
      }
      if (!coverUrl && i === 0) {
        const coverKey = `gallery/${albumName}/_cover.webp`;
        const coverPublicUrl = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${coverKey}`;
        const coverTempPath = await compressToWebP(imagePath, true);
        await uploadToR2(coverTempPath, coverKey);
        coverUrl = coverPublicUrl;
      }
    } catch (err) {
      process.stdout.write(`失敗 ✗ (${err.message})\n`);
    }
  }

  albumData.photos = newPhotos;
  albumData.cover = coverUrl;

  mkdirSync(GALLERY_CONTENT_DIR, { recursive: true });
  const yamlPath = join(GALLERY_CONTENT_DIR, `${albumName}.yml`);
  writeFileSync(yamlPath, buildYaml(albumName, albumData), "utf-8");

  log(`  完成：新增 ${uploadCount} 張，跳過 ${skipCount} 張`, "success");
  log(`  YAML 已更新：src/content/gallery/${albumName}.yml`, "info");
}

async function main() {
  const targetAlbum = process.argv[2];
  console.log("🚀 HMSSTC Photo Upload Script");
  console.log(`   Bucket: ${R2_BUCKET_NAME}`);
  console.log(`   Public URL: ${R2_PUBLIC_URL}`);
  if (targetAlbum) console.log(`   目標相簿: ${targetAlbum}`);
  console.log("");

  const albums = getAlbumDirs(targetAlbum);
  if (albums.length === 0) {
    if (targetAlbum) {
      log(`找不到相簿 "${targetAlbum}"，請確認 photos/${targetAlbum}/ 存在。`, "error");
    } else {
      log(`photos/ 資料夾內沒有子資料夾，請建立相簿資料夾並放入圖片。`, "warning");
    }
    process.exit(1);
  }

  for (const albumName of albums) {
    await processAlbum(albumName);
  }

  console.log("\n✅ 上傳完成！");
  console.log("   接下來請執行以下指令重新建置網站：");
  console.log("   npm run build");
}

main().catch((err) => {
  console.error("❌ 發生錯誤：", err.message);
  process.exit(1);
});
