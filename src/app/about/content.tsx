import { ContentProps } from "./page";

export default function Content({ title, paragraphs }: ContentProps) {
  return (
    <div className="my-28 md:my-48">
      <div className="flex w-full flex-col">
        <div className="max-w-7xl m-6">
          <h1 className="uppercase font-extrabold text-4xl sm:text-6xl md:text-8xl">{title}</h1>
        </div>

        <div className="flex justify-center relative max-w-7xl">
          <div className="bg-white p-5">
            <div className="flex flex-wrap gap-4 justify-center">
              {paragraphs.map((text: string) => (
                <p key={text} className="flex justify-between">{text}</p>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}