# 夏漢民太空科技中心 (HMSSTC) 網站維護與發佈手冊

這份文件提供兩件事：
1. **內容維護教學**：如何新增/更新文章、圖片與雙語內容。  
2. **新網站發佈教學**：如何從本機建置到正式上線。

## 0) 這個網站使用的技術

- **Astro 5**：網站框架，負責路由、內容頁產生與靜態輸出
- **Astro Content Collections**：管理 `src/content/` 內容與 Frontmatter 欄位驗證
- **TypeScript**：型別定義與開發輔助
- **Tailwind CSS**：樣式系統
- **React（少量元件）**：互動式元件使用（包含 Photo Gallery 的 Lazy Loading + Lightbox）
- **Shiki**：Markdown 程式碼區塊語法高亮
- **Cloudflare R2**：Photo Gallery 圖床（S3 相容物件儲存），詳見 [第 10 節](#10-cloudflare-r2-photo-gallery-整合說明)

此專案在建置時會產生 `dist/`，屬於可部署的靜態網站。

> ⚠️ **注意**：本專案已引入 Cloudflare R2 作為 Photo Gallery 的圖床，雖然網站主體仍是靜態網站，但 Photo Gallery 的圖片資源依賴 Cloudflare R2 服務。交接時請確保 R2 Bucket 存取設定有妥善移轉，詳見第 10 節。

---

## 1) 專案快速概覽

### 主要目錄

- `src/content/`：所有內容資料（Markdown）
  - `news/`：最新消息
  - `missions/`：太空任務
  - `activities/`：活動花絮
  - `members/`：成員資料
- `src/content/images/`：內容圖片來源（可被 Astro 建置時自動優化）
- `src/pages/`：頁面路由
- `src/i18n/`：多語系翻譯設定
- `src/content/config.ts`：各內容類型欄位驗證規則（schema）

### 開發環境需求

- Node.js：建議使用 **LTS 版本（20+）**
- npm：隨 Node.js 安裝

安裝依賴：

```bash
npm install
```

---

## 2) 寫作與上稿 SOP（建議流程）

每次新增內容，建議照以下順序：

1. **準備素材**：標題、日期、摘要、圖片、內文。
2. **建立中文檔**：先完成 `xxx.md`。
3. **建立英文檔（可選）**：再建立 `xxx.en.md`。
4. **本機預覽**：確認列表頁、內頁、圖片都正常。
5. **上線前檢查**：確認日期格式、圖片路徑、連結有效。

---

## 3) 檔名與雙語規則

### 檔名規則

- 中文（預設語系）使用：`slug.md`
- 英文（翻譯檔）使用：`slug.en.md`

範例：

- `cubesat-highschool.md`
- `cubesat-highschool.en.md`

### 雙語載入行為

- 使用者在中文頁面時讀取 `slug.md`
- 切換英文時系統會找 `slug.en.md`
  - 找到：顯示英文內容
  - 找不到：回退顯示中文內容，並提示英文內容未提供

---

## 4) 各內容類型 Frontmatter 範本

請依照 `src/content/config.ts` 的欄位規範填寫。

### A. 最新消息（`src/content/news/`）

```markdown
---
title: "文章標題"
date: "2026-02-16"
excerpt: "列表摘要（建議 30–80 字）"
image: "../images/news/your-image.jpg"
category: "news"
---

## 內文標題

內容...
```

> `category` 可用值：`news`、`announcement`

### B. 太空任務（`src/content/missions/`）

```markdown
---
title: "任務名稱"
date: "2026-02-16"
status: "active"
image: "../images/missions/your-image.jpg"
excerpt: "任務摘要"
order: 1
---

任務內容...
```

> `status` 可用值：`active`、`retired`

### C. 活動花絮（`src/content/activities/`）

```markdown
---
title: "活動名稱"
date: "2026-02-16"
image: "../images/activities/your-image.jpg"
excerpt: "活動摘要"
---

活動內容...
```

### E. Photo Gallery 相簿（`src/content/gallery/`）

相簿資料為 YAML 格式（`.yml`），通常由上傳腳本自動產生，也可手動編輯：

```yaml
title: "相簿標題（中文）"
titleEn: "Album Title (English)"
date: "2026-02-16"
description: "相簿描述（中文）"
descriptionEn: "Album description (English)"
cover: "https://pub-xxxx.r2.dev/gallery/album-name/_cover.webp"
order: 1
photos:
  - url: "https://pub-xxxx.r2.dev/gallery/album-name/photo1.webp"
    caption: "照片說明（中文）"
    captionEn: "Photo caption (English)"
  - url: "https://pub-xxxx.r2.dev/gallery/album-name/photo2.webp"
```

> 建議使用 `tools/upload-photos.mjs` 自動上傳，YAML 會自動產生。詳見第 10 節。

### D. 成員資料（`src/content/members/`）

```markdown
---
name: "王小明"
title: "研究員"
affiliation: "國立成功大學 夏漢民太空科技中心"
image: "../images/members/member-photo.jpg"
email: "name@example.com"
order: 10
---

成員簡介...
```

---

## 5) 圖片管理最佳實務

### 圖片放置位置

請將內容圖片放在 `src/content/images/` 下並依類別分資料夾，例如：

- `src/content/images/news/`
- `src/content/images/missions/`
- `src/content/images/activities/`
- `src/content/images/members/`

這種做法的好處是：Astro 在 `npm run build` 時會自動產生最佳化圖片（壓縮與格式處理），減少檔案大小並提升載入效能。

### 圖片引用方式

- Frontmatter（封面圖）：`image: "../images/news/xxx.jpg"`
- 內文圖片：`![圖說](../images/news/xxx.jpg)`

> 說明：`news/`、`activities/`、`missions/`、`members/` 下的 Markdown 檔，使用 `../images/...` 可正確對應到 `src/content/images/...`。

### 建議規範

- 檔名用英文小寫與 `-`：`cubesat-launch-2026.jpg`
- 單張圖大小盡量控制（建議 < 500KB）以加快載入
- 避免中文檔名與空白，以降低部署環境相容性問題

---

## 6) 本機開發與檢查

### 啟動開發伺服器

```bash
npm run dev
```

### 建置正式版本

```bash
npm run build
```

### 本機預覽正式版本

```bash
npm run preview
```

> 建議每次發佈前至少執行一次 `npm run build`，先抓出格式或內容錯誤。

---

## 7) 新網站發佈教學（正式上線）

本專案預設為 Astro 靜態網站，發佈重點是將建置產生的 `dist/` 上傳到主機。

### Step 1. 更新程式與內容

```bash
git pull
npm install
```

### Step 2. 建置網站

```bash
npm run build
```

成功後會產生 `dist/`。

### Step 3. 發佈前檢查清單

- [ ] 首頁可正常開啟
- [ ] 中英文切換正常
- [ ] 新增文章都出現在列表
- [ ] 文章封面圖與內文圖片皆可顯示
- [ ] 重要連結（聯絡資訊、外部連結）有效

### Step 4. 上傳 `dist/` 到主機

依你的主機類型，將 `dist/` 內容發佈：

- **靜態主機（Nginx/Apache/空間主機）**：上傳 `dist/` 全部檔案到網站根目錄
- **Netlify / Vercel / Cloudflare Pages**：
  - Build command：`npm run build`
  - Publish directory：`dist`

### Step 5. 上線後驗證（Production Smoke Test）

- [ ] 手機與桌機開啟正常
- [ ] 主要頁面：首頁 / 最新消息 / 任務 / 活動 / 成員
- [ ] 新內容可被搜尋與直接連結（slug）正常存取

---

---

## 10) Cloudflare R2 Photo Gallery 整合說明

> 本節對系統交接非常重要，請完整閱讀。

### 架構概述

Photo Gallery 使用 **Cloudflare R2** 作為圖床（圖片儲存服務）。

```
本地圖片（photos/）
    ↓  tools/upload-photos.mjs（壓縮為 WebP → 上傳）
Cloudflare R2 Bucket（hmsstc-photos）
    ↓  公開存取 URL
前端 Gallery 頁面（/gallery）
```

- 網站主體仍為靜態網站，`npm run build` 產生 `dist/`。
- Gallery 圖片 **不** 在 Git 倉庫內，而是存放在 R2 Bucket。
- 相簿 YAML 資料（`src/content/gallery/*.yml`）儲存圖片的 R2 URL，**這些 YAML 需要提交至 Git**。

### .env 設定說明

在根目錄建立 `.env` 檔案（不要提交至 Git）：

```env
# Cloudflare 帳號 ID（從 R2 Endpoint URL 中取得）
CLOUDFLARE_ACCOUNT_ID=your_account_id

# S3 相容 API 存取金鑰（R2 → Manage R2 API Tokens 建立）
R2_ACCESS_KEY_ID=your_access_key_id
R2_SECRET_ACCESS_KEY=your_secret_access_key

# R2 S3 相容 Endpoint（格式：https://<ACCOUNT_ID>.r2.cloudflarestorage.com）
R2_ENDPOINT=https://your_account_id.r2.cloudflarestorage.com

# R2 儲存桶名稱
R2_BUCKET_NAME=hmsstc-photos

# R2 公開存取 URL（需在 Cloudflare R2 控制台啟用公開存取）
# 格式：https://pub-xxxxxxxx.r2.dev  或自訂網域
R2_PUBLIC_URL=https://pub-XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX.r2.dev

# Cloudflare User API Token（管理 API 使用，非必填）
CLOUDFLARE_API_TOKEN=your_api_token
```

### 如何取得上述設定值

1. 登入 [Cloudflare Dashboard](https://dash.cloudflare.com)
2. 進入 **R2 Object Storage**
3. 建立 Bucket（名稱需與 `R2_BUCKET_NAME` 一致）
4. 在 Bucket 設定中啟用**公開存取**（Public Access），取得 `R2_PUBLIC_URL`
5. 在 **Manage R2 API Tokens** 建立具有 Bucket 讀寫權限的 Token，取得 `R2_ACCESS_KEY_ID` 和 `R2_SECRET_ACCESS_KEY`

### 上傳照片流程

```bash
# 1. 在根目錄建立 photos/ 資料夾並放入圖片
mkdir -p photos/your-album-name
# 將圖片複製到 photos/your-album-name/

# 2. 執行上傳腳本（自動壓縮 WebP + 上傳 + 更新 YAML）
node tools/upload-photos.mjs

# 或指定特定相簿
node tools/upload-photos.mjs your-album-name

# 3. 提交 YAML 變更至 Git
git add src/content/gallery/
git commit -m "add: your-album-name 相簿"

# 4. 重新建置並部署
npm run build
```

### 上傳腳本功能說明

`tools/upload-photos.mjs` 支援：

| 功能 | 說明 |
|------|------|
| WebP 壓縮 | 自動將 JPG/PNG 等格式壓縮為 WebP（品質 85，最大寬度 2000px） |
| 自動略過 | 若 R2 上已存在相同路徑，自動跳過不重複上傳 |
| 保留目錄 | 保留原始 `photos/相簿名稱/` 的資料夾結構 |
| 封面圖 | 自動生成 800px 縮圖作為封面（`_cover.webp`） |
| YAML 更新 | 自動更新 `src/content/gallery/相簿名稱.yml` |

### 頁面路由

| URL | 說明 |
|-----|------|
| `/activities` | 活動花絮列表（含 Photo Gallery 入口卡片） |
| `/gallery` | 相簿列表（所有相簿的封面網格） |
| `/gallery/:album-id` | 單一相簿（所有照片 + Lightbox 功能） |

### 注意事項（交接重要）

- **R2 Bucket 存取金鑰**：請在交接時建立新的 API Token，撤銷舊 Token
- **公開存取設定**：確保 Bucket 已啟用公開存取，否則圖片無法顯示
- **photos/ 資料夾**：已加入 `.gitignore`，不會上傳至 GitHub
- **YAML 檔案**：`src/content/gallery/*.yml` 包含 R2 URL，**必須**提交至 Git

---

## 11) 常見問題（FAQ）

### Q1：`npm run dev` 無法啟動？

請先確認：
1. Node.js 版本是否過舊（建議 20+）
2. 是否已執行 `npm install`
3. 是否有 Frontmatter 欄位缺漏（可先跑 `npm run build` 看錯誤訊息）

### Q2：圖片顯示不出來？

- 確認檔案是否真的在 `src/content/images/...`
- 確認 Frontmatter/內文路徑是否使用 `../images/...`
- 確認大小寫一致（部署到 Linux 主機時大小寫會區分）

### Q3：英文頁面沒有翻譯？

請確認是否存在同名的 `slug.en.md`。

---

## 12) 建議維運節奏

- 每次更新內容都建立 PR（方便審稿與回溯）
- 發佈前固定跑一次 `npm run build`
- 每月定期整理未使用圖片，避免資源膨脹

如需再進一步，我可以幫你補一份「維護人員檢查清單版（可直接列印/打勾）」放到 `docs/` 目錄。
