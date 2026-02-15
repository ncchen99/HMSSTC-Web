# 夏漢民太空科技中心 (HMSSTC) 網站維護指南

本文件旨在協助維護人員管理網站內容，包括新增新聞、活動花絮、太空任務以及管理圖片資源。

## 📂 專案結構概覽

- **`src/content/`**: 存放所有的文章內容（Markdown 檔案）。
  - `news/`: 最新消息
  - `missions/`: 太空任務
  - `activities/`: 活動花絮
  - `members/`: 團隊成員資料
- **`public/images/`**: 存放所有的靜態圖片資源。在此處的圖片可以透過 `/images/檔名` 的路徑在網站任何地方存取。
- **`src/pages/`**: 網站頁面結構。
- **`src/i18n/`**: 多語言翻譯設定。

---

## 📝 如何新增/管理文章

本網站使用 Markdown 檔案來管理內容。

### 1. 新增「最新消息」 (News)

前往 `src/content/news/` 目錄，建立新的 `.md` 檔案。

**檔案命名規則：**
- **中文版（預設）**：使用具描述性的英文檔名，例如 `new-satellite-launch.md`
- **英文版（翻譯）**：使用相同的檔名，加上 `.en` 後綴，例如 `new-satellite-launch.en.md`

**文章格式 (Frontmatter)：**

每個 Markdown 檔案的開頭都必須包含 Frontmatter 設定區塊（用 `---` 包夾）：

```markdown
---
title: "文章標題"
date: "2025-09-25"
excerpt: "簡短的摘要說明，會顯示在列表頁。"
image: "/images/your-image.jpg"
category: "news"
---

## 文章內容標題

這是文章的內文...
```

### 2. 多語言 (雙語) 系統運作方式

系統會自動尋找對應的翻譯檔案並在同一頁面載入。

- 當使用者瀏覽中文版時，顯示 `filename.md` 的內容。
- 當使用者切換至英文版時，系統會自動檢查是否存在 `filename.en.md`。
  - **若存在**：顯示英文版內容。
  - **若不存在**：顯示中文版內容，並提示 "Content not available in English."。

**注意：** 英文版檔案的 `date` 與 `image` 建議與中文版保持一致，但在 `[slug].astro` 的邏輯中，若有英文版，也會優先使用英文版的標題與日期。

---

## 🖼️ 圖片管理與插入教學

所有的圖片建議統一存放於 **`public/images/`** 資料夾中。

### 1. 上傳圖片
將您的 `.jpg`, `.png`, `.webp` 等圖片檔案放入專案根目錄下的 `public/images/` 資料夾。

### 2. 在文章設定 (Frontmatter) 中使用圖片
在 Markdown 檔案頂部的設定區塊中，`image` 欄位請使用絕對路徑 `/images/檔名`：

```yaml
image: "/images/satellite-launch.jpg"
```

### 3. 在文章內文 (Markdown) 中插入圖片
在文章內容中，使用標準 Markdown 語法，同樣使用 `/images/` 開頭的路徑：

```markdown
![圖片描述文字](/images/meeting-photo.jpg)

*可以在圖片下方加上斜體說明文字*
```

### 4. 為什麼不放在 `src/content/images`？
雖然 Astro 支援在 `src` 中引用圖片進行優化，但為了讓 Markdown 寫作更直覺且相容性更高（特別是在雙語切換與 CMS 管理情境下），將圖片統一放在 `public` 資料夾並透過絕對路徑引用是最穩定的做法。

---

## 🚀 開發與部署

**啟動本地開發伺服器：**
```bash
npm run dev
```

**建立生產版本：**
```bash
npm run build
```

**預覽生產版本：**
```bash
npm run preview
```
