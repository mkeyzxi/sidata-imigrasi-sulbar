import Link from "next/link";
import Image from "next/image";

const units = [
  {
    id: "01",
    name: "KANWIL\nSULBAR",
    href: "/kanwil-sulbar",
    image:
      "https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "02",
    name: "MAMUJU",
    href: "/imigrasi-mamuju",
    image:
      "https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80",
  },
  {
    id: "03",
    name: "POLMAN",
    href: "/imigrasi-polman",
    image:
      "https://images.unsplash.com/photo-1589829545856-d10d557cf95f?auto=format&fit=crop&w=1200&q=80",
  },
];

export default function Home() {
  return (
    <main className="landing-shell">
      <div className="landing-inner">
        <div className="landing-header">
          <div className="landing-badge">
            <span className="landing-dot" />
            portal data keimigrasian
          </div>
          <h1 className="landing-title">
            SI DATA
            <span className="landing-title-highlight">IMIGRASI SULBAR</span>
          </h1>
        </div>

        <div className="unit-grid">
          {units.map((unit, index) => (
            <Link key={unit.href} href={unit.href} className="unit-card">
              <div className="unit-card-image-wrap">
                <Image
                  src={unit.image}
                  alt={unit.name}
                  fill
                  className="unit-card-image"
                />
                <div className="unit-card-overlay" />
                <div className="unit-card-body">
                  <div className="unit-card-topline">
                    <span className="unit-card-label">Unit {index + 1}</span>
                    <span className="unit-card-id">{unit.id}</span>
                  </div>
                  <h2 className="unit-card-title">
                    {unit.name.split("\n").map((line) => (
                      <span key={line} className="unit-card-title-line">
                        {line}
                      </span>
                    ))}
                  </h2>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div>
    </main>
  );
}
