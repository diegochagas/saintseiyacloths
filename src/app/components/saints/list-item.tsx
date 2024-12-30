import { useTranslations } from 'next-intl'
import Image from 'next/image'

interface ListItemProps {
  image?: string
  cloth?: string
  name?: string
}

export default function ListItem({ image = '/cloth-schemes/others/no-scheme.jpg', cloth, name }: ListItemProps) {
  const t = useTranslations()

  return (
    <li className="group flex flex-col items-center">
      <small className="capitalize font-bold">{cloth ?? `${t('unknown')} ${t('cloth')}`}</small>
      <figure className="h-28 overflow-hidden">
        <Image
          className="w-full h-full"
          src={image}
          alt={t('saintClothScheme')}
          width={542}
          height={400}
        />
      </figure>
      <small className="font-semibold">{name ?? `${t('unknown')} ${t('character')}`}</small>
    </li>
  )
}