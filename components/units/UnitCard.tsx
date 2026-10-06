import Link from 'next/link'
import Image from 'next/image'

interface UnitCardProps {
  id: string
  name: string
  shortName: string
  description: string
  image: string
  slug: string
  index: number
}

export default function UnitCard({
  name,
  shortName,
  description,
  image,
  slug,
  index,
}: UnitCardProps) {
  return (
    <Link
      href={`/${slug}`}
      className="group block bg-white rounded-xl overflow-hidden border border-[var(--color-border)] hover:shadow-lg transition-all duration-200"
    >
      <div className="aspect-[4/3] relative overflow-hidden">
        <Image
          src={image}
          alt={name}
          width={600}
          height={450}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
        <div className="absolute bottom-4 left-4 right-4">
          <span className="text-[var(--color-accent)] font-bold text-sm">
            {String(index + 1).padStart(2, '0')}
          </span>
        </div>
      </div>
      <div className="p-6">
        <h3 className="font-bold text-xl mb-2 text-[var(--color-heading)] group-hover:text-[var(--color-primary)] transition-colors">
          {shortName}
        </h3>
        <p className="text-[var(--color-muted)] text-sm leading-relaxed mb-4">{description}</p>
        <div className="flex items-center gap-2 text-[var(--color-primary)] font-medium text-sm">
          <span>Lihat Data</span>
          <svg
            className="w-4 h-4 group-hover:translate-x-1 transition-transform"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
          </svg>
        </div>
      </div>
    </Link>
  )
}
