import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

interface ListItemProps {
  id?: string
  image?: string
  cloth?: string
  name?: string
}

export default function ListItem({ id, image = '/cloth-schemes/others/no-scheme.jpg', cloth, name }: ListItemProps) {
  const t = useTranslations()

  return (
    <li className="flex flex-col items-center">
      <Link className="w-full group" href={`/news/${id}`}>
        <small className="capitalize font-bold">{cloth}</small>
        <figure className="h-28 overflow-hidden">
          <Image
            className="w-full h-full object-contain group-hover:scale-110 duration-300"
            src={image}
            alt={t('saintClothScheme')}
            width={542}
            height={400}
          />
        </figure>
        <small className="font-semibold">{name ?? `${t('unknown')} ${t('character')}`}</small>
      </Link>
    </li>
  )
}