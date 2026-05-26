import { useState } from 'react';
import { Link } from 'react-router-dom';
import { FAQ_LANDING_ITEMS } from '../../../data/mockData';

function AccordionItem({ item, isOpen, onToggle }) {
  return (
    <div style={{
      borderBottom: '1px solid var(--color-border)',
      overflow: 'hidden',
    }}>
      <button
        onClick={onToggle}
        style={{
          width: '100%', display: 'flex', alignItems: 'center',
          justifyContent: 'space-between', gap: 12,
          padding: '18px 0', background: 'none', border: 'none',
          textAlign: 'left', cursor: 'pointer',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 16, color: 'var(--color-text-1)' }}>
            {item.title}
          </span>
          {item.required && (
            <span className="badge badge-danger">Required</span>
          )}
        </div>
        <span style={{
          fontSize: 18, color: 'var(--color-text-3)',
          transform: isOpen ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
          flexShrink: 0,
        }}>
          ▾
        </span>
      </button>

      <div style={{
        maxHeight: isOpen ? 400 : 0,
        overflow: 'hidden',
        transition: 'max-height 0.3s ease',
      }}>
        <div style={{ paddingBottom: 20, color: 'var(--color-text-2)', lineHeight: 1.7, fontSize: 15 }}>
          {item.body}
          {item.cta && (
            <div style={{ marginTop: 14 }}>
              <Link to={item.cta.href} className="btn-primary" style={{ display: 'inline-flex' }}>
                {item.cta.label}
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default function LandingPage() {
  const [openId, setOpenId] = useState(null);

  const toggle = (id) => setOpenId(prev => prev === id ? null : id);

  return (
    <div style={{ minHeight: '100svh', display: 'flex', flexDirection: 'column' }}>

      {/* Topbar */}
      <header style={{
        background: 'var(--color-bg)',
        borderBottom: '1px solid var(--color-border)',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto', padding: '0 24px',
          display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          height: 60,
        }}>
          <span style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 18, color: 'var(--color-primary)' }}>
            ⚡ FAQ Portal
          </span>
          <Link to="/login" className="btn-primary">Login</Link>
        </div>
      </header>

      {/* Hero */}
      <section style={{
        background: 'linear-gradient(135deg, var(--color-primary) 0%, #243360 100%)',
        color: '#fff',
        padding: '64px 24px',
        textAlign: 'center',
      }}>
        <div style={{ maxWidth: 640, margin: '0 auto' }}>
          <h1 style={{
            fontFamily: 'var(--font-display)', fontSize: 42, fontWeight: 700,
            color: '#fff', marginBottom: 16, lineHeight: 1.15,
          }}>
            Get Answers, Share Knowledge
          </h1>
          <p style={{ fontSize: 17, opacity: 0.85, lineHeight: 1.65, marginBottom: 28 }}>
            A crowdsourced FAQ portal where students, experts, and admins collaborate
            to resolve questions quickly. Earn Spark points for every contribution.
          </p>
          <Link to="/login" className="btn-accent" style={{ fontSize: 15, padding: '12px 28px' }}>
            Join the Community →
          </Link>
        </div>
      </section>

      {/* Accordion */}
      <main style={{ flex: 1, maxWidth: 720, margin: '48px auto', padding: '0 24px', width: '100%' }}>
        <h2 style={{ fontFamily: 'var(--font-display)', fontSize: 22, marginBottom: 24, color: 'var(--color-text-1)' }}>
          Frequently Asked Questions
        </h2>

        <div className="card" style={{ padding: '0 24px' }}>
          {FAQ_LANDING_ITEMS.map(item => (
            <AccordionItem
              key={item.id}
              item={item}
              isOpen={openId === item.id}
              onToggle={() => toggle(item.id)}
            />
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer style={{
        background: 'var(--color-primary)',
        color: 'rgba(255,255,255,0.75)',
        padding: '40px 24px',
      }}>
        <div style={{
          maxWidth: 1100, margin: '0 auto',
          display: 'grid', gridTemplateColumns: '1fr 1fr 1fr',
          gap: 32,
        }}>
          <div>
            <p style={{ fontFamily: 'var(--font-display)', fontWeight: 700, color: '#fff', fontSize: 16, marginBottom: 8 }}>⚡ FAQ Portal</p>
            <p style={{ fontSize: 13, lineHeight: 1.6 }}>
              A community-powered knowledge base for students and educators.
            </p>
          </div>
          <div>
            <p style={{ fontWeight: 600, color: '#fff', marginBottom: 10, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Quick Links</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['About the University', 'KYC Requirements', 'Course Refund'].map(l => (
                <Link key={l} to="/login" style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)', hover: 'color:#fff' }}>{l}</Link>
              ))}
            </div>
          </div>
          <div>
            <p style={{ fontWeight: 600, color: '#fff', marginBottom: 10, fontSize: 13, textTransform: 'uppercase', letterSpacing: '0.05em' }}>Support</p>
            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              {['Contact Us', 'Privacy Policy', 'Terms of Service'].map(l => (
                <span key={l} style={{ fontSize: 13, color: 'rgba(255,255,255,0.7)' }}>{l}</span>
              ))}
            </div>
          </div>
        </div>
        <div style={{ maxWidth: 1100, margin: '24px auto 0', paddingTop: 20, borderTop: '1px solid rgba(255,255,255,0.12)', textAlign: 'center', fontSize: 12 }}>
          © 2025 FAQ Portal. All rights reserved.
        </div>
      </footer>
    </div>
  );
}
