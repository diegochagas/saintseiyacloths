import { ArtistProps } from '@/pages/api/artists'
import Image from 'next/image'

export default async function Artists() {
	const artistsResponse = await fetch('http://localhost:3000/api/artists')
	const artists: ArtistProps[] = await artistsResponse.json()

  return (
    <div className="bg-gray-100 px-5 py-12">
      <h3 className="uppercase text-center font-bold text-lg">Schemes by</h3>
      <h2 className="uppercase text-center font-bold text-4xl">Artist</h2>
      <ul className="grid grid-cols-4">
        {artists.map(artist => (
          <li className="text-zinc-800 text-sm" key={artist.name}>
            <a className="flex artists-center gap-2" href={`/artists/${artist.id}`}>
              {artist.image && <Image className="w-10" src={artist.image} alt={artist.name} width={229} height={217} />}

              <b>{artist.name}</b>
            </a>
          </li>
        ))}
      </ul>
    </div>
  )
}