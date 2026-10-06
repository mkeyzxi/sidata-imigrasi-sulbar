import Image from 'next/image'
import {formatDate} from '@/lib/utils/format'

interface ActivityCardProps {
  title: string
  date: string
  bidang?: string
  location: string
  description: string
  image: string
}

export default function ActivityCard({
  title,
  date,
  bidang,
  location,
  description,
  image,
}: ActivityCardProps) {
  return (
    <div className="bg-white rounded-xl overflow-hidden border border-[var(--color-border)] hover:shadow-md transition-shadow">
      <div className="aspect-[16/10] relative overflow-hidden">
        <Image
          src={image}
          alt={title}
          width={600}
          height={375}
          className="w-full h-full object-cover"
        />
      </div>
      <div className="p-6">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-xs font-semibold text-[var(--color-muted)] uppercase tracking-wide">
            {formatDate(date)}
          </span>
          {bidang && (
            <>
              <span className="text-[var(--color-muted)]">•</span>
              <span className="text-xs text-[var(--color-muted)]">{bidang}</span>
            </>
          )}
        </div>
        <h3 className="font-bold text-lg mb-2 text-[var(--color-heading)] line-clamp-2">{title}</h3>
        <p className="text-sm text-[var(--color-muted)] mb-3 line-clamp-2">{description}</p>
        <div className="flex items-center gap-1.5 text-sm text-[var(--color-muted)]">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
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
}
