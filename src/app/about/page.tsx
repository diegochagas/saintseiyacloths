export default async function About() {
  const response = await fetch('http://localhost:3000/api/about')
  const about = await response.json()

  return (
    <div>
      <h1>{about.title}</h1>

      {about.paragraphs.map((text: string) => (
        <p key={text}>{text}</p>
      ))}
    </div>
  )
}