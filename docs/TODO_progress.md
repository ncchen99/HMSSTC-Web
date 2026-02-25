# HMSSTC-Web 任務進度追蹤 (To-Do List)

## 1. 更新團隊成員資料
- [x] 擷取 林建宏 資料 (中/英) (已完成)
- [x] 擷取 陳炳志 資料 (中/英)
- [x] 擷取 趙怡欽 資料 (中/英)
- [x] 擷取 詹劭勳 資料 (中/英)
- [x] 擷取 吳志勇 資料 (中/英)
- [x] 擷取 李約亨 資料 (中/英)
- [x] 擷取 林家祥 資料 (中/英)
- [x] 擷取 林昭宏 資料 (中/英)
- [x] 擷取 曾子榜 資料 (中/英)
- [x] 擷取 陳佳宏 資料 (中/英)
- [x] 新增 林佳廷
- [x] 新增 陳世平
- [x] 新增 林子軒
- [x] 新增 蔡佩吟
- [x] 將所有團隊成員資料整理轉換為 Markdown，並更新至網頁內容檔中。

## 2. 新增資議委員區塊
- [x] 擷取 葉永烜 資料 (中/英)
- [x] 擷取 劉正彥 資料 (中/英)
- [x] 擷取 趙吉光 資料 (中/英)
- [x] 擷取 小山孝一郎 資料 (中/英)
- [x] 整理資議委員資料並轉換為 Markdown。
- [x] 於首頁或關於我們頁面中新增「資議委員」區塊（UI 開發）。

## 3. 網頁細節修正
- [x] 修改頁尾 Footer：「HSIA HAN MING Space Science and Technology Center」 -> 「HAN-MING HSIA Space Science and Technology Center」

## 4. 更新成員頭像
- [x] 新增一個 To-Do List
- [x] 開啟 Sub-agent 在指定的網頁中抓取老師們的圖片
- [x] 將圖片儲存到本地端 `src/content/images/members` 作為他們的頭像

## 狀態紀錄
- 2026-02-26: 任務開始，建立 TODO 列表。啟動 Sub-Agent 及自動抓取工具進行資料蒐集。
- 2026-02-26: 成功取得所有人員資料並產生 36 份 中/英 Markdown 檔案。新增 category 至 config.ts，並更新 index.astro 增加資議委員區塊，最後修正 Footer 英文名稱與錯字。
- 2026-02-26: 新增更新成員圖片任務，啟動 Browser Sub-agent 抓取圖片。
- 2026-02-26: 已使用 Sub-agent 及 Python 腳本成功抓取大部分成員以及諮議委員圖片，儲存至本地端並更新了 Markdown 檔案的 `image:` 屬性。
