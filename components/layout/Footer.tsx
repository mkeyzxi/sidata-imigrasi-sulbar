import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-[var(--color-primary-dark)] text-white mt-20">
      <div className="max-w-[1280px] mx-auto px-6 lg:px-10 py-16">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex flex-col gap-1 mb-4">
              <span className="font-bold text-xl">SI DATA IMIGRASI SULBAR</span>
              <span className="text-sm opacity-80">
                Sistem Informasi Data Keimigrasian Terintegrasi
              </span>
            </div>
            <p className="text-sm opacity-90 leading-relaxed max-w-md">
              Portal informasi dan data keimigrasian terintegrasi di wilayah
              Sulawesi Barat yang menampilkan data dari Kanwil Sulbar, Imigrasi
              Mamuju, dan Imigrasi Polman.
            </p>
          </div>

          {/* Links */}
          <div>
            <h3 className="font-semibold mb-4">Navigasi</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/" className="opacity-90 hover:opacity-100 hover:underline">
                  Beranda
                </Link>
              </li>
              <li>
                <Link href="/#unit-kerja" className="opacity-90 hover:opacity-100 hover:underline">
                  Unit Kerja
                </Link>
              </li>
              <li>
                <Link href="/kegiatan" className="opacity-90 hover:opacity-100 hover:underline">
                  Kegiatan
                </Link>
              </li>
              <li>
                <Link href="/data" className="opacity-90 hover:opacity-100 hover:underline">
                  Data
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="font-semibold mb-4">Unit Kerja</h3>
            <ul className="space-y-3 text-sm">
              <li>
                <Link href="/kanwil-sulbar" className="opacity-90 hover:opacity-100 hover:underline">
                  Kanwil Sulbar
                </Link>
              </li>
              <li>
                <Link href="/imigrasi-mamuju" className="opacity-90 hover:opacity-100 hover:underline">
                  Imigrasi Mamuju
                </Link>
              </li>
              <li>
                <Link href="/imigrasi-polman" className="opacity-90 hover:opacity-100 hover:underline">
                  Imigrasi Polman
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="border-t border-white/20 mt-12 pt-8 text-sm opacity-80 text-center">
          <p>
            © {new Date().getFullYear()} SI DATA IMIGRASI SULBAR. Data Simulasi - Prototype.
          </p>
        </div>
      </div>
    </footer>
  );
}
