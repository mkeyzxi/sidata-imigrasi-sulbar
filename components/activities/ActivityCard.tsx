import Image from 'next/image'
import Link from 'next/link'
import {Images} from 'lucide-react'
import {formatDate} from '@/lib/utils/format'
import {Building2} from 'lucide-react'

interface ActivityCardProps {
  id?: string | number
  title: string
  date: string
  bidang?: string
  location?: string
  description?: string
  image?: string
  gallery?: string[]
  unit?: string
}

export default function ActivityCard({
  id,
  title,
  date,
  location = 'Sulawesi Barat',
  description = '',
  image = 'https://images.unsplash.com/photo-1521737711867-e3b97375f902?w=600&q=80',
  gallery,
  unit,
}: ActivityCardProps) {
  const images =
    gallery && gallery.length > 0
      ? gallery.slice(0, 3)
      : [image]

  const Card = (
    <div className="bg-white rounded-xl overflow-hidden border border-[var(--color-border)] hover:shadow-md transition-shadow h-full flex flex-col">
      <div className="aspect-[16/10] relative overflow-hidden bg-muted shrink-0">
        {images.length === 1 ? (
          <Image
            src={images[0]}
            alt={title}
            fill
            sizes="(max-width: 768px) 100vw, 33vw"
            className="object-cover"
          />
        ) : images.length === 2 ? (
          <div className="grid grid-cols-2 gap-0.5 w-full h-full">
            {images.map((src, idx) => (
              <div key={`${src}-${idx}`} className="relative w-full h-full overflow-hidden">
                <Image
                  src={src}
                  alt={`${title} — foto ${idx + 1}`}
                  fill
                  sizes="(max-width: 768px) 50vw, 18vw"
                  className="object-cover"
                />
              </div>
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-3 grid-rows-2 gap-0.5 w-full h-full">
            <div className="col-span-2 row-span-2 relative w-full h-full overflow-hidden">
              <Image
                src={images[0]}
                alt={`${title} — foto 1`}
                fill
                sizes="(max-width: 768px) 66vw, 22vw"
                className="object-cover"
              />
            </div>
            <div className="col-span-1 row-span-1 relative w-full h-full overflow-hidden">
              <Image
                src={images[1]}
                alt={`${title} — foto 2`}
                fill
                sizes="(max-width: 768px) 33vw, 12vw"
                className="object-cover"
              />
            </div>
            <div className="col-span-1 row-span-1 relative w-full h-full overflow-hidden">
              <Image
                src={images[2]}
                alt={`${title} — foto 3`}
                fill
                sizes="(max-width: 768px) 33vw, 12vw"
                className="object-cover"
              />
            </div>
          </div>
        )}

        {images.length > 1 && (
          <span className="absolute bottom-2.5 right-2.5 inline-flex items-center gap-1 px-2.5 py-1 rounded-full bg-black/70 backdrop-blur-xs text-white text-[10px] font-bold tracking-wider uppercase z-10">
            <Images className="w-3 h-3" />
            {images.length} Foto
          </span>
        )}
      </div>

      <div className="p-6 flex-1 flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between gap-2 mb-3">
            <span className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">
              {formatDate(date)}
            </span>
            {unit && (
              <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full bg-surface border border-border shadow-xs">
                <Building2 className="w-3 h-3 text-accent" />
                <span className="text-[10px] font-bold text-text/70 uppercase tracking-wider">
                  {unit}
                </span>
              </div>
            )}
          </div>
          <h3 className="font-bold text-lg mb-2 text-[var(--color-heading)] line-clamp-2">{title}</h3>
          <p className="text-sm text-[var(--color-muted)] mb-3 line-clamp-2">{description}</p>
        </div>
        <div className="flex items-center gap-1.5 text-sm text-[var(--color-muted)] mt-2">
          <svg className="w-4 h-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
            />
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
            />
          </svg>
          <span>{location}</span>
        </div>
      </div>
    </div>
  )

  if (id) {
    return (
      <Link href={`/kegiatan/${id}`} className="block h-full">
        {Card}
      </Link>
    )
  }
  return Card
}
