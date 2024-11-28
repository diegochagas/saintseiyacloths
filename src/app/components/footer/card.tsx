interface Link {
  href: string
  text: string
}

interface CardProps {
  title: string
  items: Link[]
}

export default function Card({ title, items }: CardProps) {
  return (
    <div className="">
      <h6 className="uppercase font-bold my-2 text-lg">{title}</h6>
      <ul className="">
        {items.map(item => (
          <li key={item.text}>
            <a href={item.href} target="_blank" rel="noopener noreferrer">{item.text}</a>
          </li>
        ))}
      </ul>
    </div>
  )
}