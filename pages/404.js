import Link from 'next/link'

export default function Custom404() {
  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}
    >
      <div
        style={{
          textAlign: 'center',
          maxWidth: '600px',
          padding: '2rem',
        }}
      >
        <h1>404 - Page Not Found</h1>
        <p>The page you're looking for couldn't be found. 🙁</p>
      </div>
    </div>
  )
}
