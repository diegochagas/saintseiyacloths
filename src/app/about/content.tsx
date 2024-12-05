import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function Content() {
  const t = useTranslations()

  return (
    <div className="my-28 md:my-48">
      <div className="flex w-full flex-col">
        <div className="max-w-7xl m-6">
          <h1 className="uppercase font-extrabold text-4xl sm:text-6xl md:text-8xl">{t('title.about')}</h1>
        </div>

        <div className="flex justify-center relative max-w-7xl">
          <div className="bg-white p-5 flex flex-wrap justify-center gap-10">
            <figure className="lg:order-2">
              <Image src="/history/manga-classic.jpg" width={234} height={370} alt="Cover of Saint Seiya first manga" />
            </figure>

            <div className="flex flex-wrap gap-4 justify-center max-w-2xl">
              {Array.from({ length: 4 }).map((_, i) => (
                <p key={`paragraph-${i}`} className="flex justify-between">{t(`page.about.paragraph.${i}`)}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}