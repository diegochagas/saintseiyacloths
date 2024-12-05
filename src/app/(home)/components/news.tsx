import { NewsProps } from '@/pages/api/news'
import Link from 'next/link'
import Title from './title'
import NewsList from '@/app/components/news-list'
import { useTranslations } from 'next-intl'

interface NewsComponentProps {
  news: NewsProps[]
}

export default function News({ news }: NewsComponentProps) {
  const t = useTranslations()

  return (
    <section className="max-w-7xl mt-20">
      <h2 className="uppercase text-3xl sm:text-6xl lg:text-8xl xl:text-9xl font-extrabold">
        {t('subTitle.highlights')}
      </h2>

      <NewsList news={news} />

      <Link
        className="block text-center w-56 font-bold text-yellow-500 hover:text-black uppercase bg-black hover:bg-yellow-500 py-3 mt-9 mb-20 mx-auto"
        href="/news"
      >
        {t('button.more')}
      </Link>
    </section>
  )
}