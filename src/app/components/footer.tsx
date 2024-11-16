import Link from "next/link";

export default function Footer() {
  return (
    <footer className="bg-black text-white relative bottom-0">
      <div>
        <section>
          <h2>Saint Seiya Cloths</h2>
        </section>

        <section>
          <div>
            <h6>Socials</h6>
            <ul>
              <li>
                <a href="https://www.instagram.com/saintseiyacloth" target="_blank" rel="noopener noreferrer">Instagram</a>
              </li>
              <li>
                <a href="https://www.facebook.com/saintseiyacloths" target="_blank" rel="noopener noreferrer">Facebook</a>
              </li>
              <li>
                <a href="https://www.x.com/saintseiyacloths" target="_blank" rel="noopener noreferrer">Twitter</a>
              </li>
            </ul>
          </div>
          <div>
            <h6>Menu</h6>
            <ul>
              <li>
                <Link href="/database">Database</Link>
              </li>
              <li>
                <Link href="/history">History</Link>
              </li>
            </ul>
          </div>
        </section>
      </div>

      <hr />

      <p>
        <span>Saint Seiya Cloths</span>
        <span>&nbsp;©&nbsp;</span>
        <span>{new Date().getFullYear()}</span>
        <span>&nbsp;| made by <a href="https://diegochagas.com/" target="_blank">Diego Chagas</a></span>
      </p>
    </footer>
  )
}