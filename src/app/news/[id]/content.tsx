import Error from '@/app/components/error'
import { NewsProps } from '@/pages/api/news'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'

interface ContentProps {
  data: NewsProps
  error?: any
}

export default function Content({ data, error }: ContentProps) {
  const t = useTranslations()

  return (
    <div className="my-28 md:my-48 w-full flex justify-center flex-col items-center">
      <div className="flex w-full max-w-7xl">
        <h1 className="uppercase font-extrabold text-6xl md:text-8xl">{t('news')}</h1>
      </div>

      <div className="flex flex-col justify-center relative bg-zinc-100 w-full my-5 py-10 px-6 items-center">
        <div className="flex justify-center items-center w-full max-w-4xl">
          <div className="">
            <span className="font-bold text-lg block my-5">{new Date(data.date).toLocaleDateString()}</span>
            
            <span className="font-bold text-xl text-white uppercase bg-black px-10 py-0.5">
              {t(data.saint.history.midia.name)}
            </span>
            
            <h2 className="mt-5 text-3xl font-extrabold">{t(`newsTitle.${data.saint.id}`)}</h2>
            
            <div className="bg-neutral-400 my-5 md:my-10 p-4 md:p-8">
              <h1 className="text-2xl font-bold">{data.saint.character.name} - {data.saint.history.name}</h1>
            </div>
            
            <p>{t(`newsDescription.${data.saint.id}`)}</p>
            
            <figure className="flex flex-col items-center my-5">
              <Image className="border-2 border-black" src={data.saint.image} width={536} height={400} alt={t('saintClothScheme')} />
            
              <figcaption>
                <small className="font-semibold capitalize">{data.saint.cloth?.name || t('unknownCloth')}</small>
              </figcaption>
            </figure>
            
            <div className="mt-9 mb-20 mx-auto flex justify-center md:justify-end">
              <Link
                className="block text-center w-60 font-extrabold text-yellow-500 hover:text-black uppercase bg-black hover:bg-yellow-500 py-3"
                href="/news"
              >
                {t('backToNewsList')}
              </Link>
            </div>
          </div>
        </div>

        {error && (
          <Error>
            <p>{t('errorFetchingData')} {error}</p>
          </Error>
        )}
      </div>
    </div>
  )
}