import reactLogo from '../../assets/react.svg'
import viteLogo from '../../assets/vite.svg'

const socialLinks = [
  {
    href: 'https://github.com/vitejs/vite',
    icon: 'github-icon',
    label: 'GitHub',
  },
  {
    href: 'https://chat.vite.dev/',
    icon: 'discord-icon',
    label: 'Discord',
  },
  {
    href: 'https://x.com/vite_js',
    icon: 'x-icon',
    label: 'X.com',
  },
  {
    href: 'https://bsky.app/profile/vite.dev',
    icon: 'bluesky-icon',
    label: 'Bluesky',
  },
]

function NextSteps() {
  return (
    <section id="next-steps">
      <div id="docs">
        <svg className="icon" role="presentation" aria-hidden="true">
          <use href="/icons.svg#documentation-icon"></use>
        </svg>
        <h2>Documentation</h2>
        <p>Your questions, answered</p>
        <ul>
          <li>
            <a href="https://vite.dev/" target="_blank" rel="noreferrer">
              <img className="logo" src={viteLogo} alt="" />
              Explore Vite
            </a>
          </li>
          <li>
            <a href="https://react.dev/" target="_blank" rel="noreferrer">
              <img className="button-icon" src={reactLogo} alt="" />
              Learn more
            </a>
          </li>
        </ul>
      </div>
      <div id="social">
        <svg className="icon" role="presentation" aria-hidden="true">
          <use href="/icons.svg#social-icon"></use>
        </svg>
        <h2>Connect with us</h2>
        <p>Join the Vite community</p>
        <ul>
          {socialLinks.map((link) => (
            <li key={link.label}>
              <a href={link.href} target="_blank" rel="noreferrer">
                <svg className="button-icon" role="presentation" aria-hidden="true">
                  <use href={`/icons.svg#${link.icon}`}></use>
                </svg>
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}

export default NextSteps
