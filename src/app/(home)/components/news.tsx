import { NewsProps } from '@/pages/api/news'
import Link from 'next/link'
import Title from '../../components/title'
import NewsList from '@/app/components/news-list'

interface NewsComponentProps {
  news: NewsProps[]
}

export default function News({ news }: NewsComponentProps) {
  return (
    <section className="max-w-7xl mt-20">
      <Title text="News" />

      <NewsList news={news} />

      <Link
        className="block text-center w-56 font-bold text-yellow-500 hover:text-black uppercase bg-black hover:bg-yellow-500 py-3 mt-9 mb-20 mx-auto"
        href="/news"
      >
        More
      </Link>
    </section>
  )
}