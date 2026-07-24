import Link from 'next/link'
import Logo from '../../components/Logo/Logo'
import Image from 'next/image'
import styles from '../home/Home.module.css'

export default function PreviewOption1() {
  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Logo variant="wordmark-compact" />
        </div>
      </header>

      <section
        className={styles.heroPanel}
        style={{
          background: "linear-gradient(180deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)), url('/uploads/pexels-makafood-8984408.jpg') no-repeat center/cover",
          borderRadius: '14px',
        }}
      >
        <div style={{ padding: '2rem', color: '#111' }}>
          <p className={styles.headingTag}>Preview</p>
          <h1 style={{ color: '#111' }}>Compact wordmark + light hero overlay</h1>
          <p style={{ color: '#444' }}>This preview shows the compact black wordmark with a lighter hero overlay for a modern, airy feel.</p>
        </div>
      </section>

      <div style={{ marginTop: '2rem' }}>
        <Link href="/logo-previews">See other logo previews</Link>
      </div>
    </div>
  )
}
