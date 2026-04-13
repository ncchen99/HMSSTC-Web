import { useState, useEffect, useRef, useCallback } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";

interface Photo {
  url: string;
  caption?: string;
  captionEn?: string;
}

interface Folder {
  name: string;
  nameEn?: string;
  cover?: string;
  photos: Photo[];
}

interface PhotoGalleryProps {
  photos?: Photo[];
  folders?: Folder[];
  albumTitle?: string;
}

function LazyImage({
  src,
  alt,
  onClick,
  onLoadStart,
  onLoadEnd,
}: {
  src: string;
  alt: string;
  onClick: () => void;
  onLoadStart: () => void;
  onLoadEnd: () => void;
}) {
  const [loaded, setLoaded] = useState(false);
  const [inView, setInView] = useState(false);
  const imgRef = useRef<HTMLDivElement>(null);
  const startedRef = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setInView(true);
          if (!startedRef.current) {
            startedRef.current = true;
            onLoadStart();
          }
          observer.disconnect();
        }
      },
      { rootMargin: "200px" }
    );
    if (imgRef.current) observer.observe(imgRef.current);
    return () => observer.disconnect();
  }, [onLoadStart]);

  return (
    <div
      ref={imgRef}
      onClick={onClick}
      className="relative overflow-hidden rounded-lg cursor-pointer group bg-gray-100 aspect-square"
    >
      {inView && (
        <img
          src={src}
          alt={alt}
          loading="lazy"
          decoding="async"
          onLoad={() => {
            setLoaded(true);
            onLoadEnd();
          }}
          className={`w-full h-full object-cover transition-all duration-500 group-hover:scale-110 ${
            loaded ? "opacity-100" : "opacity-0"
          }`}
        />
      )}
      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors duration-300" />
    </div>
  );
}

function FolderCard({
  folder,
  lang,
  onClick,
}: {
  folder: Folder;
  lang: string;
  onClick: () => void;
}) {
  const [coverLoaded, setCoverLoaded] = useState(false);
  const coverImgRef = useRef<HTMLImageElement>(null);
  const displayName = lang === "en" && folder.nameEn ? folder.nameEn : folder.name;

  useEffect(() => {
    if (coverImgRef.current?.complete) {
      setCoverLoaded(true);
    }
  }, []);

  return (
    <button
      onClick={onClick}
      className="group relative bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-500 border border-gray-100 text-left w-full"
    >
      <div className="relative h-44 overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200">
        {folder.cover ? (
          <>
            {!coverLoaded && (
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="w-8 h-8 border-2 border-gray-300 border-t-tech-blue rounded-full animate-spin" />
              </div>
            )}
            <img
              ref={coverImgRef}
              src={folder.cover}
              alt={displayName}
              loading="lazy"
              onLoad={() => setCoverLoaded(true)}
              className={`w-full h-full object-cover group-hover:scale-110 transition-transform duration-700 ${
                coverLoaded ? "opacity-100" : "opacity-0"
              }`}
            />
          </>
        ) : (
          <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-tech-blue/20 to-tech-blue/40">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1} stroke="currentColor" className="w-12 h-12 text-tech-blue/50">
              <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
            </svg>
          </div>
        )}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-300" />
        <div className="absolute bottom-2 right-2 bg-black/60 text-white text-xs px-2 py-1 rounded-full flex items-center gap-1 backdrop-blur-sm">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-3 h-3">
            <path strokeLinecap="round" strokeLinejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z" />
          </svg>
          <span>{folder.photos.length}</span>
        </div>
      </div>
      <div className="p-4">
        <h3 className="font-semibold text-gray-800 group-hover:text-tech-blue transition-colors duration-200 flex items-center gap-2">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={1.5} stroke="currentColor" className="w-4 h-4 text-gray-400 flex-shrink-0">
            <path strokeLinecap="round" strokeLinejoin="round" d="M3.75 9.776c.112-.017.227-.026.344-.026h15.812c.117 0 .232.009.344.026m-16.5 0a2.25 2.25 0 0 0-1.883 2.542l.857 6a2.25 2.25 0 0 0 2.227 1.932H19.05a2.25 2.25 0 0 0 2.227-1.932l.857-6a2.25 2.25 0 0 0-1.883-2.542m-16.5 0V6A2.25 2.25 0 0 1 6 3.75h3.879a1.5 1.5 0 0 1 1.06.44l2.122 2.12a1.5 1.5 0 0 0 1.06.44H18A2.25 2.25 0 0 1 20.25 9v.776" />
          </svg>
          {displayName}
        </h3>
      </div>
    </button>
  );
}

export default function PhotoGallery({ photos = [], folders, albumTitle }: PhotoGalleryProps) {
  const [selectedFolderIndex, setSelectedFolderIndex] = useState<number | null>(null);
  const [lightboxIndex, setLightboxIndex] = useState<number | null>(null);
  const [lang, setLang] = useState<string>("zh-TW");
  const [loadingCount, setLoadingCount] = useState(0);
  const [showInfo, setShowInfo] = useState(false);
  const [downloading, setDownloading] = useState(false);
  const [direction, setDirection] = useState(0);

  useEffect(() => {
    const stored = localStorage.getItem("hmsstc-lang") || "zh-TW";
    setLang(stored);

    const handleLangChange = () => {
      setLang(localStorage.getItem("hmsstc-lang") || "zh-TW");
    };
    window.addEventListener("hmsstc-lang-change", handleLangChange);
    return () => window.removeEventListener("hmsstc-lang-change", handleLangChange);
  }, []);

  const activePhotos =
    folders && selectedFolderIndex !== null
      ? folders[selectedFolderIndex].photos
      : photos;

  const handleLoadStart = useCallback(() => {
    setLoadingCount((c) => c + 1);
  }, []);

  const handleLoadEnd = useCallback(() => {
    setLoadingCount((c) => Math.max(0, c - 1));
  }, []);

  useEffect(() => {
    setLoadingCount(0);
  }, [selectedFolderIndex]);

  useEffect(() => {
    if (!folders || folders.length === 0) return;
    if (selectedFolderIndex !== null) {
      const folder = folders[selectedFolderIndex];
      window.dispatchEvent(
        new CustomEvent("hmsstc-folder-open", {
          detail: {
            name: lang === "en" && folder.nameEn ? folder.nameEn : folder.name,
            nameZh: folder.name,
            nameEn: folder.nameEn || folder.name,
            photoCount: folder.photos.length,
          },
        })
      );
    } else {
      window.dispatchEvent(new CustomEvent("hmsstc-folder-close"));
    }
  }, [selectedFolderIndex, folders, lang]);

  useEffect(() => {
    const handleFolderBack = () => {
      setSelectedFolderIndex(null);
      setLightboxIndex(null);
    };
    window.addEventListener("hmsstc-folder-back", handleFolderBack);
    return () => window.removeEventListener("hmsstc-folder-back", handleFolderBack);
  }, []);

  const openLightbox = useCallback((index: number) => {
    setLightboxIndex(index);
    setShowInfo(false);
    document.body.style.overflow = "hidden";
  }, []);

  const closeLightbox = useCallback(() => {
    setLightboxIndex(null);
    setShowInfo(false);
    document.body.style.overflow = "";
  }, []);

  const handleDownload = useCallback(async (url: string) => {
    const filename = url.split("/").pop()?.split("?")[0] || "photo.jpg";
    setDownloading(true);

    const triggerBlobDownload = (blob: Blob) => {
      const blobUrl = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = blobUrl;
      a.download = filename;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      setTimeout(() => URL.revokeObjectURL(blobUrl), 1000);
    };

    try {
      // cache: "no-store" 繞過瀏覽器快取的無 CORS 版本，直接對 CDN 發帶 Origin 的請求
      const res = await fetch(url, { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      triggerBlobDownload(await res.blob());
    } catch {
      // Canvas fallback：用 cache-buster 讓瀏覽器重新發帶 crossOrigin 的請求
      try {
        const blob = await new Promise<Blob>((resolve, reject) => {
          const img = new Image();
          img.crossOrigin = "anonymous";
          img.onload = () => {
            const canvas = document.createElement("canvas");
            canvas.width = img.naturalWidth;
            canvas.height = img.naturalHeight;
            const ctx = canvas.getContext("2d");
            if (!ctx) { reject(new Error("no ctx")); return; }
            ctx.drawImage(img, 0, 0);
            const ext = filename.split(".").pop()?.toLowerCase();
            const mime = ext === "png" ? "image/png" : "image/jpeg";
            canvas.toBlob(
              (b) => (b ? resolve(b) : reject(new Error("toBlob failed"))),
              mime,
              0.92
            );
          };
          img.onerror = () => reject(new Error("img load failed"));
          img.src = `${url}${url.includes("?") ? "&" : "?"}_dl=${Date.now()}`;
        });
        triggerBlobDownload(blob);
      } catch {
        window.open(url, "_blank");
      }
    } finally {
      setDownloading(false);
    }
  }, []);

  const goNext = useCallback(() => {
    setDirection(1);
    setLightboxIndex((prev) =>
      prev !== null ? (prev + 1) % activePhotos.length : null
    );
    setShowInfo(false);
  }, [activePhotos.length]);

  const goPrev = useCallback(() => {
    setDirection(-1);
    setLightboxIndex((prev) =>
      prev !== null ? (prev - 1 + activePhotos.length) % activePhotos.length : null
    );
    setShowInfo(false);
  }, [activePhotos.length]);

  const slideVariants = {
    enter: (dir: number) => ({ x: dir > 0 ? "100%" : "-100%" }),
    center: { x: 0 },
    exit: (dir: number) => ({ x: dir < 0 ? "100%" : "-100%" }),
  };

  useEffect(() => {
    const handleKey = (e: KeyboardEvent) => {
      if (lightboxIndex === null) return;
      if (e.key === "Escape") closeLightbox();
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    };
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [lightboxIndex, closeLightbox, goNext, goPrev]);

  if (folders && folders.length > 0 && selectedFolderIndex === null) {
    return (
      <div>
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4 sm:gap-5">
          {folders.map((folder, index) => (
            <FolderCard
              key={folder.name}
              folder={folder}
              lang={lang}
              onClick={() => setSelectedFolderIndex(index)}
            />
          ))}
        </div>
      </div>
    );
  }

  if (activePhotos.length === 0) {
    return (
      <div className="text-center py-16 text-gray-400">
        <svg
          xmlns="http://www.w3.org/2000/svg"
          fill="none"
          viewBox="0 0 24 24"
          strokeWidth={1}
          stroke="currentColor"
          className="w-16 h-16 mx-auto mb-4 opacity-30"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25h.008v.008h-.008V8.25Zm.375 0a.375.375 0 1 1-.75 0 .375.375 0 0 1 .75 0Z"
          />
        </svg>
        <p data-i18n="gallery.noPhotos">此相簿尚無照片</p>
      </div>
    );
  }

  const currentPhoto = lightboxIndex !== null ? activePhotos[lightboxIndex] : null;
  const currentCaption =
    currentPhoto &&
    (lang === "en"
      ? currentPhoto.captionEn || currentPhoto.caption
      : currentPhoto.caption);

  return (
    <>
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-2 sm:gap-3">
        {activePhotos.map((photo, index) => {
          const caption =
            lang === "en"
              ? photo.captionEn || photo.caption
              : photo.caption;
          return (
            <LazyImage
              key={photo.url}
              src={photo.url}
              alt={caption || albumTitle || "照片"}
              onClick={() => openLightbox(index)}
              onLoadStart={handleLoadStart}
              onLoadEnd={handleLoadEnd}
            />
          );
        })}
      </div>

      {loadingCount > 0 && (
        <div className="flex justify-center py-10">
          <div className="w-8 h-8 border-2 border-gray-300 border-t-tech-blue rounded-full animate-spin" />
        </div>
      )}

      {lightboxIndex !== null && currentPhoto && createPortal(
        <div
          className="fixed inset-0 z-[9999] bg-black/65 backdrop-blur-xl flex flex-col"
          onClick={closeLightbox}
        >
          {/* 頂部按鈕列：資訊、下載、關閉 */}
          <div
            className="relative z-10 flex-shrink-0 flex items-center justify-end gap-2 px-4 pt-4 pb-2"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 資訊按鈕 + Tooltip */}
            <div className="relative">
              <button
                onClick={() => setShowInfo((v) => !v)}
                className={`text-white/70 hover:text-white transition-colors p-2 rounded-full hover:bg-white/10 ${
                  showInfo ? "bg-white/20 text-white" : "bg-white/5"
                }`}
                aria-label="照片資訊"
              >
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="m11.25 11.25.041-.02a.75.75 0 0 1 1.063.852l-.708 2.836a.75.75 0 0 0 1.063.853l.041-.021M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9-3.75h.008v.008H12V8.25Z" />
                </svg>
              </button>

              {/* Tooltip 卡片 */}
              {showInfo && (
                <div className="fixed top-16 left-1/2 -translate-x-1/2 sm:absolute sm:translate-x-0 sm:left-auto sm:top-full sm:right-0 sm:mt-2.5 z-50 w-64 bg-black/70 backdrop-blur-md rounded-xl border border-white/10 shadow-2xl overflow-hidden">
                  {/* 向上箭頭（僅桌面顯示） */}
                  <div className="hidden sm:block absolute -top-[7px] right-[13px] w-3.5 h-3.5 bg-black/70 border-t border-l border-white/10 rotate-45 rounded-tl-sm" />
                  <div className="px-4 py-3.5 space-y-2.5">
                    {currentCaption && (
                      <div>
                        <p className="text-[10px] font-medium text-white/35 uppercase tracking-wider mb-1">
                          {lang === "en" ? "Caption" : "說明"}
                        </p>
                        <p className="text-white/85 text-sm leading-snug">{currentCaption}</p>
                      </div>
                    )}
                    <div className="flex items-center justify-between gap-4">
                      <div>
                        <p className="text-[10px] font-medium text-white/35 uppercase tracking-wider mb-1">
                          {lang === "en" ? "No." : "編號"}
                        </p>
                        <p className="text-white/85 text-sm tabular-nums">
                          {lightboxIndex + 1} <span className="text-white/40">/</span> {activePhotos.length}
                        </p>
                      </div>
                    </div>
                    <div>
                      <p className="text-[10px] font-medium text-white/35 uppercase tracking-wider mb-1">
                        {lang === "en" ? "Filename" : "檔案名稱"}
                      </p>
                      <p className="text-white/55 text-[11px] font-mono break-all leading-relaxed">
                        {currentPhoto.url.split("/").pop()?.split("?")[0] ?? currentPhoto.url}
                      </p>
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* 下載按鈕 */}
            <button
              onClick={() => handleDownload(currentPhoto.url)}
              disabled={downloading}
              className="text-white/70 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10 disabled:opacity-50"
              aria-label="下載照片"
              title={lang === "en" ? "Download" : "下載照片"}
            >
              {downloading ? (
                <div className="w-6 h-6 border-2 border-white/40 border-t-white rounded-full animate-spin" />
              ) : (
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                  <path strokeLinecap="round" strokeLinejoin="round" d="M3 16.5v2.25A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75V16.5M16.5 12 12 16.5m0 0L7.5 12m4.5 4.5V3" />
                </svg>
              )}
            </button>

            {/* 關閉按鈕 */}
            <button
              onClick={closeLightbox}
              className="text-white/70 hover:text-white transition-colors p-2 bg-white/5 rounded-full hover:bg-white/10"
              aria-label="關閉"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" d="M6 18 18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          {/* 圖片滑動區（flex-1 佔滿剩餘空間） */}
          <div
            className="flex-1 relative overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* 左右導航按鈕（手機隱藏） */}
            <button
              onClick={(e) => { e.stopPropagation(); goPrev(); }}
              className="hidden sm:flex absolute left-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 p-2 bg-white/10 rounded-full hover:bg-white/20"
              aria-label="上一張"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="M15.75 19.5 8.25 12l7.5-7.5" />
              </svg>
            </button>
            <button
              onClick={(e) => { e.stopPropagation(); goNext(); }}
              className="hidden sm:flex absolute right-4 top-1/2 -translate-y-1/2 text-white/70 hover:text-white transition-colors z-10 p-2 bg-white/10 rounded-full hover:bg-white/20"
              aria-label="下一張"
            >
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" strokeWidth={2} stroke="currentColor" className="w-8 h-8">
                <path strokeLinecap="round" strokeLinejoin="round" d="m8.25 4.5 7.5 7.5-7.5 7.5" />
              </svg>
            </button>

            {/* 圖片動畫容器 */}
            <AnimatePresence initial={false} custom={direction}>
              <motion.div
                key={lightboxIndex}
                custom={direction}
                variants={slideVariants}
                initial="enter"
                animate="center"
                exit="exit"
                transition={{ x: { type: "spring", stiffness: 300, damping: 30 } }}
                className="absolute inset-0 flex items-center justify-center px-4 sm:px-20 cursor-grab active:cursor-grabbing"
                drag="x"
                dragConstraints={{ left: 0, right: 0 }}
                dragElastic={0.15}
                onDragEnd={(_, { offset, velocity }) => {
                  if (offset.x < -50 || velocity.x < -300) goNext();
                  else if (offset.x > 50 || velocity.x > 300) goPrev();
                }}
              >
                <img
                  src={currentPhoto.url}
                  alt={currentCaption || ""}
                  className="max-w-full max-h-full object-contain rounded-lg shadow-2xl select-none pointer-events-none"
                  draggable={false}
                />
              </motion.div>
            </AnimatePresence>
          </div>

          {/* 說明文字與頁碼 */}
          <div
            className="flex-shrink-0 text-center px-4 py-4"
            onClick={(e) => e.stopPropagation()}
          >
            {currentCaption && (
              <p className="text-white/80 text-sm">{currentCaption}</p>
            )}
            <p className="text-white/40 text-xs mt-1">
              {lightboxIndex + 1} / {activePhotos.length}
            </p>
          </div>

        </div>,
        document.body
      )}
    </>
  );
}
