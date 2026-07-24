import Logo from '../components/Logo/Logo'
import Link from 'next/link'

export default function LogoPreviews() {
  return (
    <div style={{ padding: '2rem' }}>
      <h1>Logo previews</h1>
      <p>Three logo concepts for review: compact wordmark, stacked mark, and icon.</p>
      <div style={{ display: 'flex', gap: '2rem', marginTop: '2rem', alignItems: 'center' }}>
        <div style={{ textAlign: 'center' }}>
          <Logo variant="wordmark-compact" />
          <div>Compact wordmark</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Logo variant="stacked" />
          <div>Stacked mark + wordmark</div>
        </div>
        <div style={{ textAlign: 'center' }}>
          <Logo variant="icon" />
          <div>Subtle icon</div>
        </div>
      </div>
      <div style={{ marginTop: '2rem' }}>
        <Link href="/home">← Back to home</Link>
      </div>
    </div>
  )
}
