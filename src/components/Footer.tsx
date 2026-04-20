import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <h3>
              <span style={{ color: '#FF8C00' }}>🔥</span> Hot Wheels Legends
            </h3>
            <p>
              The ultimate destination for Hot Wheels collectors, customizers,
              and speed enthusiasts. Built by fans, for fans. Every car has a
              story. Every collector has a legend.
            </p>
          </div>

          <div className="footer-col">
            <h4>Explore</h4>
            <Link href="/">Home</Link>
            <Link href="/rare-collection/">Rare Collection</Link>
            <Link href="/history/">History</Link>
            <Link href="/garage/">The Garage</Link>
            <Link href="/tracks/">Tracks</Link>
          </div>

          <div className="footer-col">
            <h4>Collect</h4>
            <a href="#">Treasure Hunts</a>
            <a href="#">Super Treasure Hunts</a>
            <a href="#">Car Culture</a>
            <a href="#">Premium Sets</a>
          </div>

          <div className="footer-col">
            <h4>Community</h4>
            <a href="#">Discord</a>
            <a href="#">Reddit</a>
            <a href="#">Instagram</a>
            <a href="#">YouTube</a>
          </div>
        </div>

        <div className="footer-bottom">
          <span>© {new Date().getFullYear()} Hot Wheels Legends. Fan Project.</span>
          <span style={{ letterSpacing: '0.3em', textTransform: 'uppercase', fontFamily: 'var(--font-heading)', fontSize: '0.65rem' }}>
            Legends Never Die
          </span>
        </div>
      </div>
    </footer>
  );
}
