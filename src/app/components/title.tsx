interface TitleProps {
  text: string
}

export default function Title({ text }: TitleProps) {
  return (
    <h2 className="uppercase text-3xl sm:text-6xl lg:text-8xl xl:text-9xl font-extrabold">
      {text}
    </h2>
  )
}