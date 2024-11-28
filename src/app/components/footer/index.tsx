import menu from '../../../pages/api/data/menu.json'
import socials from '../../../pages/api/data/socials.json'
import Card from './card'

export default function Footer() {
  return (
    <footer className="bg-black text-white relative bottom-0 z-10 px-5 py-9">
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-5">
        <h1 className="sm:col-span-2 uppercase font-black text-3xl">Saint Seiya Cloths</h1>
        <Card {...socials} />
        <Card {...menu} />
      </div>

      <hr className="mt-5" />

      <small className="text-xs uppercase flex flex-col p-5 lg:pb-10">
        <span>Saint Seiya © {new Date().getFullYear()}</span>
        <span>Made by <a className="hover:font-bold" href="https://diegochagas.com/" target="_blank">Diego Chagas</a></span>
      </small>
    </footer>
  )
}