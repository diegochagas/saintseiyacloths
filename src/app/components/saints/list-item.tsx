import Image from 'next/image'

interface ListItemProps {
  image: string
  cloth?: string
  name?: string
}

export default function ListItem({ image, cloth, name }: ListItemProps) {
  return (
    <li className="group flex flex-col items-center">
      <small className="capitalize font-bold">{cloth || 'Unknown cloth'}</small>
      <figure className="h-28 overflow-hidden">
        <Image
          className="w-full h-full"
          src={image}
          alt="Saint image"
          width={542}
          height={400}
        />
      </figure>
      <small className="font-semibold">{name ?? 'Unknown saint'}</small>
    </li>
  )
}