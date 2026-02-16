# 夏漢民太空科技中心 (HMSSTC) 網站維護與發佈手冊

這份文件提供兩件事：
1. **內容維護教學**：如何新增/更新文章、圖片與雙語內容。  
2. **新網站發佈教學**：如何從本機建置到正式上線。

## 0) 這個網站使用的技術

- **Astro 5**：網站框架，負責路由、內容頁產生與靜態輸出
- **Astro Content Collections**：管理 `src/content/` 內容與 Frontmatter 欄位驗證
- **TypeScript**：型別定義與開發輔助
- **Tailwind CSS**：樣式系統
- **React（少量元件）**：互動式元件使用
- **Shiki**：Markdown 程式碼區塊語法高亮

此專案在建置時會產生 `dist/`，屬於可部署的靜態網站。

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

## 8) 常見問題（FAQ）

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

## 9) 建議維運節奏

- 每次更新內容都建立 PR（方便審稿與回溯）
- 發佈前固定跑一次 `npm run build`
- 每月定期整理未使用圖片，避免資源膨脹

如需再進一步，我可以幫你補一份「維護人員檢查清單版（可直接列印/打勾）」放到 `docs/` 目錄。
