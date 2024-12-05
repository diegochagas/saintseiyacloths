import { useTranslations } from 'next-intl'
import Image from 'next/image'

export default function Banner() {
  const t = useTranslations()
  return (
    <section className="bg-black w-full flex justify-center">
      <Image
        className="w-full md:hidden"
        src="/banners/saint-seiya-cloths-banner-vertical.jpg"
        width={960}
        height={1400}
        alt={t('bannerVertical')}
      />

      <Image
        className="hidden md:block max-w-7xl"
        src="/banners/saint-seiya-cloths-banner-horizontal.jpg"
        width={1920}
        height={1080}
        alt={t('bannerHorizontal')}
      />
    </section>
  )
}