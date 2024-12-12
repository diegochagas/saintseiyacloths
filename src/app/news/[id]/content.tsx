import Error from '@/app/components/error'
import Icon from '@/app/components/icons'
import { NewsProps } from '@/pages/api/news'
import { useTranslations } from 'next-intl'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

interface ContentProps {
  data: NewsProps
  error: any
  url: string
}

export default function Content({ data, error, url }: ContentProps) {
  const t = useTranslations()
  const router = useRouter()

  return (
    <div className="my-28 md:my-48 w-full flex justify-center flex-col items-center">
      <div className="flex w-full max-w-7xl">
        <h1 className="uppercase font-extrabold text-6xl md:text-8xl">{t('news')}</h1>
      </div>

      <div className="flex flex-col justify-center relative bg-zinc-100 w-full my-5 py-10 px-6 items-center">
        <div className="flex justify-center items-center w-full max-w-4xl">
          <div className="flex flex-col w-full">
            <span className="font-bold text-lg block my-5">{data.date}</span>
            
            <div>
              <span className="font-bold text-xl text-white uppercase bg-black px-10 py-0.5">
                {t(data.saint.history.midia.name)}
              </span>
            </div>
            
            <h2 className="mt-5 text-3xl font-extrabold">{data.saint.character.name}</h2>
            
            <div className="bg-neutral-400 my-5 md:my-10 p-4 md:p-8">
              <h1 className="text-2xl font-bold">{data.saint.history.name}</h1>
            </div>
            
            <p>{t(`newsDescription.${data.saint.id}`)}</p>
            
            <figure className="flex flex-col items-center my-5">
              <Image className="border-2 border-black" src={data.saint.image} width={536} height={400} alt={t('saintClothScheme')} />
            
              <figcaption>
                <small className="font-semibold capitalize">{data.saint.cloth?.name || t('unknownCloth')}</small>
              </figcaption>
            </figure>
              
            <ul className="flex flex-col gap-2 ml-4 mt-10">
              <li className="list-disc">
                <h6 className="font-bold text-lg">{t('god')}</h6>
                <p className="">{data.saint.god?.name}</p>
              </li>
              <li className="list-disc">
                <h6 className="font-bold text-lg">{t('class')}</h6>
                <p className="">{t(data.saint.group.class)}</p>
              </li>
              <li className="list-disc">
                <h6 className="font-bold text-lg">{t('rank')}</h6>
                <p className="">{t(data.saint.rank)}</p>
              </li>
            </ul>

            <div className="relative self-end">
              <h3 className="absolute top-6 md:top-14 -left-1 md:left-1 font-extrabold text-4xl md:text-6xl -rotate-6 uppercase">{t('share')}</h3>
              
              <Image className="w-full max-w-lg" src="/banners/bg_share.png" alt={t('shareImage')} width={1044} height={398} />
              
              <a
                className="absolute -bottom-2 left-16 md:left-32 w-12 h-12 md:w-20 md:h-20 rounded-full border-4 border-black flex items-center justify-center bg-white group"
                href={`http://www.facebook.com/share.php?u=${url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className="w-5 md:w-10 md:group-hover:w-12 h-auto" name="facebook" />
              </a>
              
              <a
                className="absolute -bottom-2 left-32 md:left-60 w-12 h-12 md:w-20 md:h-20 rounded-full border-4 border-black flex items-center justify-center bg-white group"
                href={`http://twitter.com/share?url=${url}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <Icon className="w-5 md:w-10 md:group-hover:w-12 h-auto" name="x" />
              </a>
            </div>
            
            <div className="mt-20 mb-20 mx-auto flex justify-center md:justify-end">
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