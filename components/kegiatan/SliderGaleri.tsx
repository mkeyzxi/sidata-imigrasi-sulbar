'use client'

import { useState, useCallback, useEffect, useRef } from 'react'
import Image from 'next/image'
import { ChevronLeft, ChevronRight, ZoomIn, X } from 'lucide-react'

type SliderGaleriProps = {
  images: string[]
  alt?: string
  /** Nama placeholder untuk caption tiap gambar */
  captions?: string[]
}

export default function SliderGaleri({ images, alt = 'Dokumentasi kegiatan', captions }: SliderGaleriProps) {
  const [index, setIndex] = useState(0)
  const [lightbox, setLightbox] = useState(false)
  const rootRef = useRef<HTMLDivElement>(null)

  const count = images.length
  const safeIndex = count > 0 ? index % count : 0

  const go = useCallback(
    (dir: 1 | -1) => {
      if (count > 1) setIndex((i) => (i + dir + count) % count)
    },
    [count],
  )

  // Autoplay (hanya saat slider terlihat di viewport & lebih dari 1 slide)
  useEffect(() => {
    if (count < 2) return
    const el = rootRef.current
    if (!el || typeof IntersectionObserver === 'undefined') {
      const timer = setInterval(() => setIndex((i) => (i + 1) % count), 6000)
      return () => clearInterval(timer)
    }
    let timer: ReturnType<typeof setInterval> | null = null
    const start = () => {
      if (!timer) timer = setInterval(() => setIndex((i) => (i + 1) % count), 6000)
    }
    const stop = () => {
      if (timer) {
        clearInterval(timer)
        timer = null
      }
    }
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => (entry.isIntersecting ? start() : stop()))
      },
      {threshold: 0.3},
    )
    observer.observe(el)
    return () => {
      observer.disconnect()
      stop()
    }
  }, [count])

  if (count === 0) return null

  return (
    <div ref={rootRef}>
      {/* Slider utama */}
      <div className="relative rounded-3xl overflow-hidden bg-muted shadow-sm select-none">
        <div className="aspect-[16/9] sm:aspect-[21/9] w-full">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setLightbox(true)}
              className={`absolute inset-0 cursor-zoom-in ${i === safeIndex ? 'z-10' : 'z-0'}`}
              aria-label={`Perbesar gambar ${i + 1}`}
            >
              <Image
                src={src}
                alt={`${alt} — ${captions?.[i] ?? `Image ${i + 1}`}`}
                fill
                className={`object-cover transition-opacity duration-700 ${i === safeIndex ? 'opacity-100' : 'opacity-0'}`}
                priority={i === 0}
              />
            </button>
          ))}
        </div>

        {/* Overlay caption & kontrol */}
        <div className="absolute inset-0 z-20 pointer-events-none">
          <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent p-4 sm:p-6">
            <div className="flex items-end justify-between gap-4">
              <div>
                {captions && captions[safeIndex] && (
                  <p className="text-white/90 text-xs sm:text-sm font-bold uppercase tracking-wider mb-1">
                    {captions[safeIndex]}
                  </p>
                )}
                <p className="text-white/60 text-[10px] sm:text-xs font-medium tracking-wider uppercase">
                  Dokumentasi {safeIndex + 1} / {count}
                </p>
              </div>
              <div className="flex items-center gap-2 pointer-events-auto">
                {count > 1 && (
                  <>
                    <button
                      onClick={() => go(-1)}
                      className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                      aria-label="Gambar sebelumnya"
                    >
                      <ChevronLeft className="w-5 h-5" />
                    </button>
                    <button
                      onClick={() => go(1)}
                      className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                      aria-label="Gambar berikutnya"
                    >
                      <ChevronRight className="w-5 h-5" />
                    </button>
                  </>
                )}
                <button
                  onClick={() => setLightbox(true)}
                  className="w-9 h-9 rounded-full bg-white/15 backdrop-blur-sm text-white flex items-center justify-center hover:bg-white/30 transition-colors"
                  aria-label="Perbesar"
                >
                  <ZoomIn className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>

          {/* Indikator titik */}
          {count > 1 && (
            <div className="absolute bottom-2 right-4 sm:right-6 flex items-center gap-1.5 pointer-events-auto sm:bottom-auto sm:top-4 sm:right-auto sm:left-6">
              {images.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setIndex(i)}
                  aria-label={`Lihat gambar ${i + 1}`}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    i === safeIndex ? 'w-6 bg-accent' : 'w-1.5 bg-white/50 hover:bg-white/80'
                  }`}
                />
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Thumbnail galeri */}
      {count > 1 && (
        <div className="mt-4 grid grid-cols-3 gap-3">
          {images.map((src, i) => (
            <button
              key={i}
              onClick={() => setIndex(i)}
              className={`relative aspect-[16/10] rounded-xl overflow-hidden transition-all duration-300 ${
                i === safeIndex
                  ? 'ring-2 ring-accent ring-offset-2 ring-offset-background'
                  : 'opacity-60 hover:opacity-100'
              }`}
              aria-label={`Pilih gambar ${i + 1}`}
            >
              <Image
                src={src}
                alt={captions?.[i] ?? `Dokumentasi ${i + 1}`}
                fill
                className="object-cover"
                sizes="200px"
              />
            </button>
          ))}
        </div>
      )}

      {/* Lightbox */}
      {lightbox && (
        <div
          className="fixed inset-0 z-[60] bg-black/90 flex items-center justify-center p-4 sm:p-8"
          onClick={() => setLightbox(false)}
        >
          <button
            className="absolute top-4 right-4 w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/25 transition-colors z-20"
            onClick={(e) => {
              e.stopPropagation()
              setLightbox(false)
            }}
            aria-label="Tutup perbesar"
          >
            <X className="w-5 h-5" />
          </button>
          <div
            className="relative w-full max-w-5xl"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="aspect-[16/9] rounded-2xl overflow-hidden">
              <Image src={images[safeIndex]} alt={alt} fill className="object-contain bg-black" />
            </div>
            <div className="flex items-center justify-center gap-3 mt-4">
              {count > 1 && (
                <>
                  <button
                    onClick={() => go(-1)}
                    className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/25 transition-colors"
                    aria-label="Sebelumnya"
                  >
                    <ChevronLeft className="w-5 h-5" />
                  </button>
                  <span className="text-white/70 text-xs font-bold tracking-wider uppercase">
                    {safeIndex + 1} / {count}
                  </span>
                  <button
                    onClick={() => go(1)}
                    className="w-10 h-10 rounded-full bg-white/10 text-white flex items-center justify-center hover:bg-white/25 transition-colors"
                    aria-label="Berikutnya"
                  >
                    <ChevronRight className="w-5 h-5" />
                  </button>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
