import { forwardRef, useRef, useState } from 'react'
import HTMLFlipBook from 'react-pageflip'
import './App.css'

const pageImages = import.meta.glob('/pages/*.{jpg,jpeg,png,webp}', {
  eager: true,
  query: '?url',
  import: 'default',
})

const pages = Object.entries(pageImages)
  .sort(([pathA], [pathB]) => {
    const getNumber = (value) => {
      const match = value.match(/(\d+)(?=\.[a-z]+$)/i)
      return match ? Number(match[1]) : Number.MAX_SAFE_INTEGER
    }
    return getNumber(pathA) - getNumber(pathB) || pathA.localeCompare(pathB)
  })
  .map(([, url]) => url)

const ImagePage = forwardRef(({ src, index }, ref) => (
  <div ref={ref} className="page">
    <img src={src} alt={`صفحة ${index + 1}`} className="page-img" draggable={false} />
  </div>
))
ImagePage.displayName = 'ImagePage'

function App() {
  const bookRef = useRef(null)
  const [currentPage, setCurrentPage] = useState(0)
  const hasPages = pages.length > 0
  const lastPage = hasPages ? pages.length - 1 : 0
  const progress = hasPages ? Math.round(((currentPage + 1) / pages.length) * 100) : 0
  const pageLabel = hasPages ? `صفحة ${currentPage + 1} / ${pages.length}` : 'لا توجد صفحات حالياً'

  const goNext = () => bookRef.current?.pageFlip()?.flipNext()
  const goPrev = () => bookRef.current?.pageFlip()?.flipPrev()
  const goFirst = () => bookRef.current?.pageFlip()?.flip(0)
  const goLast = () => bookRef.current?.pageFlip()?.flip(lastPage)

  const helpText = hasPages
    ? 'لإضافة صور جديدة: انسخ أي صورة داخل public/pages وسيتم عرضها تلقائياً.'
    : 'أضف صور الصفحات داخل مجلد public/pages لتظهر تلقائياً هنا.'

  return (
    <main className="app" dir="rtl">
      <header className="topbar">
        <div className="brand">
          <p className="brand-sub">كتالوج أعمالنا</p>
          <h1>الأمين للبرجولات</h1>
        </div>
        <div className="meta">
          <span>{pageLabel}</span>
          <span className="meta-pct">{progress}%</span>
        </div>
      </header>

      <div className="progress-track" aria-hidden>
        <div className="progress-fill" style={{ width: `${progress}%` }} />
      </div>

      {hasPages ? (
        <section className="book-shell">
          <HTMLFlipBook
            ref={bookRef}
            width={420}
            height={595}
            size="stretch"
            minWidth={260}
            maxWidth={520}
            minHeight={360}
            maxHeight={740}
            maxShadowOpacity={0.5}
            showCover
            mobileScrollSupport
            flippingTime={700}
            onFlip={(e) => setCurrentPage(e.data)}
            className="flipbook"
            drawShadow
            usePortrait={false}
            startZIndex={10}
            autoSize
            showPageCorners
            swipeDistance={30}
          >
            {pages.map((src, i) => (
              <ImagePage key={src} src={src} index={i} />
            ))}
          </HTMLFlipBook>
        </section>
      ) : (
        <section className="book-shell empty-state">
          <p>لا يوجد أي صور داخل الكتالوج حالياً.</p>
        </section>
      )}

      <nav className="controls">
        <button onClick={goLast} disabled={!hasPages || currentPage === lastPage}>الأخير ⏭</button>
        <button onClick={goNext} disabled={!hasPages || currentPage === lastPage}>التالي ▶</button>
        <button onClick={goPrev} disabled={!hasPages || currentPage === 0}>◀ السابق</button>
        <button onClick={goFirst} disabled={!hasPages || currentPage === 0}>⏮ الأول</button>
      </nav>

      <footer className="hint">{helpText}</footer>
    </main>
  )
}

export default App
