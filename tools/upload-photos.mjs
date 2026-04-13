#!/usr/bin/env node
/**
 * HMSSTC Photo Upload Script
 * ===========================
 * 將 photos/ 資料夾內的圖片壓縮成 WebP 格式並上傳至 Cloudflare R2。
 * 上傳完成後自動更新 src/content/gallery/ 內的 YAML 相簿資料。
 *
 * 使用方式：
 *   node tools/upload-photos.mjs [相簿名稱]
 *
 * 範例：
 *   node tools/upload-photos.mjs                  # 上傳 photos/ 下所有相簿
 *   node tools/upload-photos.mjs arn-meeting-photos  # 只上傳指定相簿
 *
 * 目錄結構（平鋪模式）：
 *   photos/
 *     icgpsro-2025/        ← 相簿名稱
 *       photo1.jpg
 *       photo2.png
 *
 * 目錄結構（資料夾模式，子資料夾自動變成 folders）：
 *   photos/
 *     arn-meeting-photos/
 *       09.15/             ← 各子資料夾會成為 YAML 內的 folder 項目
 *         DSC001.jpg
 *       09.16/
 *         DSC002.jpg
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

/** 取得相簿頂層的直屬子資料夾清單（不遞迴）。有子資料夾代表要用 folders 模式。 */
function getSubFolders(albumDir) {
  return readdirSync(albumDir)
    .filter((name) => statSync(join(albumDir, name)).isDirectory())
    .sort();
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

/** 僅解析 YAML 頂層的純量欄位（title, date, cover 等），不碰 photos/folders 陣列。 */
function parseYamlMeta(content) {
  const result = {};
  for (const line of content.split("\n")) {
    if (line.startsWith("#") || line.trim() === "" || line.startsWith(" ") || line.startsWith("-")) continue;
    const m = line.match(/^(\w[\w.]*?):\s*(.+)$/);
    if (m) {
      result[m[1]] = m[2].trim().replace(/^["']|["']$/g, "");
    }
  }
  return result;
}

/** 將相簿資料序列化為 YAML 字串，支援 folders 與 photos 兩種模式。 */
function buildYaml(albumId, albumData) {
  const lines = [];
  lines.push(`title: ${JSON.stringify(albumData.title)}`);
  if (albumData.titleEn) lines.push(`titleEn: ${JSON.stringify(albumData.titleEn)}`);
  lines.push(`date: ${JSON.stringify(albumData.date)}`);
  if (albumData.description) lines.push(`description: ${JSON.stringify(albumData.description)}`);
  if (albumData.descriptionEn) lines.push(`descriptionEn: ${JSON.stringify(albumData.descriptionEn)}`);
  lines.push(`cover: ${JSON.stringify(albumData.cover || "")}`);
  if (albumData.order !== undefined) lines.push(`order: ${albumData.order}`);

  if (albumData.folders && albumData.folders.length > 0) {
    lines.push(`photos: []`);
    lines.push(`folders:`);
    for (const folder of albumData.folders) {
      lines.push(`  - name: ${JSON.stringify(folder.name)}`);
      if (folder.nameEn) lines.push(`    nameEn: ${JSON.stringify(folder.nameEn)}`);
      lines.push(`    cover: ${JSON.stringify(folder.cover || "")}`);
      lines.push(`    photos:`);
      for (const photo of folder.photos) {
        lines.push(`      - url: ${JSON.stringify(photo.url)}`);
        if (photo.caption) lines.push(`        caption: ${JSON.stringify(photo.caption)}`);
        if (photo.captionEn) lines.push(`        captionEn: ${JSON.stringify(photo.captionEn)}`);
      }
    }
  } else {
    lines.push(`photos:`);
    for (const photo of albumData.photos || []) {
      lines.push(`  - url: ${JSON.stringify(photo.url)}`);
      if (photo.caption) lines.push(`    caption: ${JSON.stringify(photo.caption)}`);
      if (photo.captionEn) lines.push(`    captionEn: ${JSON.stringify(photo.captionEn)}`);
    }
  }

  return lines.join("\n") + "\n";
}

function loadExistingYaml(albumId) {
  const yamlPath = join(GALLERY_CONTENT_DIR, `${albumId}.yml`);
  if (existsSync(yamlPath)) {
    try {
      const content = readFileSync(yamlPath, "utf-8");
      const meta = parseYamlMeta(content);
      return {
        title: meta.title || albumId,
        titleEn: meta.titleEn,
        date: meta.date || new Date().toISOString().split("T")[0],
        description: meta.description,
        descriptionEn: meta.descriptionEn,
        cover: meta.cover || "",
        order: meta.order ? Number(meta.order) : undefined,
        photos: [],
        folders: [],
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
    folders: [],
  };
}

// ─── 主程式 ──────────────────────────────────────────────────────────────────

/**
 * 上傳單一批次照片（一個資料夾）並回傳照片 URL 清單與 cover URL。
 * @param {string[]} images       本地完整路徑清單
 * @param {string}   albumDir     相簿根目錄（用來計算相對路徑）
 * @param {string}   albumName    相簿 slug
 * @param {boolean}  needCover    是否需要產生 _cover.webp（整個相簿的 cover）
 * @returns {{ photos: {url:string}[], cover: string, uploaded: number, skipped: number }}
 */
async function uploadImages(images, albumDir, albumName, needCover = false) {
  const photos = [];
  let cover = "";
  let uploaded = 0;
  let skipped = 0;
  const total = images.length;

  for (const [i, imagePath] of images.entries()) {
    const relPath = relative(albumDir, imagePath);
    const nameWithoutExt = relPath.replace(/\.[^/.]+$/, "").replace(/\\/g, "/");
    const r2Key = `gallery/${albumName}/${nameWithoutExt}.webp`;
    const publicUrl = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${r2Key}`;

    process.stdout.write(`    [${i + 1}/${total}] ${relPath} ... `);

    if (await fileExistsOnR2(r2Key)) {
      process.stdout.write("已存在，跳過\n");
      skipped++;
      photos.push({ url: publicUrl });
      if (!cover && i === 0) cover = publicUrl;
      continue;
    }

    try {
      const tempPath = await compressToWebP(imagePath, false);
      await uploadToR2(tempPath, r2Key);
      process.stdout.write("上傳成功 ✓\n");
      uploaded++;
      photos.push({ url: publicUrl });

      if (!cover && i === 0) {
        cover = publicUrl;
        if (needCover) {
          const coverKey = `gallery/${albumName}/_cover.webp`;
          const coverPublicUrl = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${coverKey}`;
          const coverTempPath = await compressToWebP(imagePath, true);
          await uploadToR2(coverTempPath, coverKey);
          cover = coverPublicUrl;
        }
      }
    } catch (err) {
      process.stdout.write(`失敗 ✗ (${err.message})\n`);
    }
  }

  return { photos, cover, uploaded, skipped };
}

async function processAlbum(albumName) {
  const albumDir = join(PHOTOS_DIR, albumName);
  const subFolders = getSubFolders(albumDir);
  const albumData = loadExistingYaml(albumName);
  let totalUploaded = 0;
  let totalSkipped = 0;

  // ── 資料夾模式（有子資料夾） ──────────────────────────────────────────────
  if (subFolders.length > 0) {
    const totalImages = findImages(albumDir).length;
    log(`\n📂 處理相簿：${albumName}（資料夾模式，${subFolders.length} 個子資料夾，共 ${totalImages} 張圖片）`);

    const newFolders = [];
    let albumCover = albumData.cover || "";

    for (const folderName of subFolders) {
      const folderDir = join(albumDir, folderName);
      const images = findImages(folderDir);

      if (images.length === 0) {
        log(`  ⚠️  子資料夾 ${folderName} 沒有圖片，跳過。`, "warning");
        continue;
      }

      log(`  📁 子資料夾：${folderName}（${images.length} 張）`);

      const needAlbumCover = !albumCover;
      const { photos, cover, uploaded, skipped } = await uploadImages(
        images, albumDir, albumName, needAlbumCover
      );

      if (needAlbumCover && cover) {
        albumCover = cover.replace(/_cover\.webp$/, `_cover.webp`);
        const coverKey = `gallery/${albumName}/_cover.webp`;
        albumCover = `${R2_PUBLIC_URL.replace(/\/$/, "")}/${coverKey}`;
      }

      newFolders.push({
        name: folderName,
        cover: cover,
        photos,
      });

      totalUploaded += uploaded;
      totalSkipped += skipped;
    }

    albumData.folders = newFolders;
    albumData.photos = [];
    albumData.cover = albumCover || (newFolders[0]?.cover ?? "");

  // ── 平鋪模式（無子資料夾） ────────────────────────────────────────────────
  } else {
    const images = findImages(albumDir);

    if (images.length === 0) {
      log(`${albumName}: 沒有找到圖片，跳過。`, "warning");
      return;
    }

    log(`\n📂 處理相簿：${albumName}（${images.length} 張圖片）`);

    const needAlbumCover = !albumData.cover;
    const { photos, cover, uploaded, skipped } = await uploadImages(
      images, albumDir, albumName, needAlbumCover
    );

    albumData.photos = photos;
    albumData.folders = [];
    if (cover) albumData.cover = cover;
    totalUploaded = uploaded;
    totalSkipped = skipped;
  }

  mkdirSync(GALLERY_CONTENT_DIR, { recursive: true });
  const yamlPath = join(GALLERY_CONTENT_DIR, `${albumName}.yml`);
  writeFileSync(yamlPath, buildYaml(albumName, albumData), "utf-8");

  log(`  完成：新增 ${totalUploaded} 張，跳過 ${totalSkipped} 張`, "success");
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
