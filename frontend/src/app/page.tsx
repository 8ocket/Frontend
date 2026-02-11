import Link from 'next/link';

export default function Home() {
  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        minHeight: '100vh',
        gap: 20,
        background: '#f5f5f5',
      }}
    >
      <h1 style={{ fontSize: 48, marginBottom: 10 }}>MindLog</h1>
      <p style={{ fontSize: 18, color: '#666', marginBottom: 30 }}>마음을 기록하다</p>
      <nav style={{ display: 'flex', gap: 20 }}>
        <Link
          href="/sample"
          style={{
            padding: '12px 24px',
            border: '1px solid #333',
            textDecoration: 'none',
            color: '#333',
            borderRadius: 4,
            fontWeight: 600,
          }}
        >
          Emotion Card Generator
        </Link>
      </nav>
    </div>
  );
}
