import Link from 'next/link'

export default function Header() {
  return (
    <header className="flex fixed w-full justify-between top-0 p-4 text-zinc-800 bg-white uppercase font-bold">
      <div>
        <Link href="/">Saint Seiya Cloths LOGO</Link>
      </div>
      
      <ul className="flex gap-9">
        <li>
          <Link href="/database">Database</Link>
        </li>
        <li>
          <Link href="/history">History</Link>
        </li>
      </ul>
    </header>
  )
}