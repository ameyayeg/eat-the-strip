import Link from 'next/link'
import Logo from '../../components/Logo/Logo'
import styles from '../home/Home.module.css'

export default function PreviewOption2() {
  return (
    <div style={{ padding: '2rem' }}>
      <header style={{ marginBottom: '1.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <Logo variant="stacked" />
        </div>
      </header>

      <section
        className={styles.heroPanel}
        style={{
          background: "linear-gradient(180deg, rgba(10,10,10,0.15), rgba(10,10,10,0.05)), url('/uploads/pexels-makafood-8984408.jpg') no-repeat center/cover",
          borderRadius: '14px',
        }}
      >
        <div style={{ padding: '2rem', color: '#fff' }}>
          <p className={styles.headingTag} style={{ color: '#fff' }}>Preview</p>
          <h1 style={{ color: '#fff' }}>Stacked mark + wordmark on a darker hero</h1>
          <p style={{ color: '#e6e6e6' }}>This preview shows a stacked mark with the wordmark beside it, placed on a slightly darker hero for better contrast.</p>
        </div>
      </section>

      <div style={{ marginTop: '2rem' }}>
        <Link href="/preview/option-1">← Back to Option 1</Link>
      </div>
    </div>
  )
}
