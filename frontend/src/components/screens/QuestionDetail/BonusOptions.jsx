import { useState } from 'react';

export default function BonusOptions() {
  const [open, setOpen]     = useState(false);
  const [link, setLink]     = useState({ url: '', label: '' });
  const [links, setLinks]   = useState([]);
  const [file, setFile]     = useState(null);

  const addLink = () => {
    if (link.url.trim()) {
      setLinks(prev => [...prev, link]);
      setLink({ url: '', label: '' });
    }
  };

  return (
    <div style={{
      border: '1px solid var(--color-border)',
      borderRadius: 8, marginTop: 8,
    }}>
      {/* Toggle row */}
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: '100%', display: 'flex', alignItems: 'center', justifyContent: 'space-between',
          padding: '10px 14px', background: 'none', border: 'none', cursor: 'pointer',
          borderRadius: open ? '8px 8px 0 0' : 8,
          background: 'var(--color-surface)',
        }}
      >
        <span style={{ fontSize: 13, fontWeight: 500, color: 'var(--color-text-2)' }}>
          Add bonus contributions
        </span>
        <span style={{
          fontSize: 14, color: 'var(--color-text-3)',
          transform: open ? 'rotate(180deg)' : 'none',
          transition: 'transform 0.2s',
        }}>
          ▾
        </span>
      </button>

      {open && (
        <div style={{ padding: '14px 14px', display: 'flex', flexDirection: 'column', gap: 12 }}>
          {/* Links */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              + Add Link
            </p>
            <div style={{ display: 'flex', gap: 8 }}>
              <input
                className="form-input"
                placeholder="https://…"
                value={link.url}
                onChange={e => setLink(p => ({ ...p, url: e.target.value }))}
                style={{ flex: 2 }}
              />
              <input
                className="form-input"
                placeholder="Label"
                value={link.label}
                onChange={e => setLink(p => ({ ...p, label: e.target.value }))}
                style={{ flex: 1 }}
              />
              <button type="button" className="btn-ghost" onClick={addLink} style={{ flexShrink: 0 }}>Add</button>
            </div>
            {links.map((l, i) => (
              <div key={i} style={{ display: 'flex', gap: 6, marginTop: 6, alignItems: 'center', fontSize: 12 }}>
                <span style={{ color: 'var(--color-accent)' }}>🔗</span>
                <a href={l.url} target="_blank" rel="noreferrer" style={{ color: 'var(--color-primary)' }}>
                  {l.label || l.url}
                </a>
              </div>
            ))}
          </div>

          {/* File attach */}
          <div>
            <p style={{ fontSize: 12, fontWeight: 500, color: 'var(--color-text-3)', marginBottom: 8, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              + Attach File
            </p>
            <input
              type="file"
              accept=".pdf,image/*"
              onChange={e => setFile(e.target.files?.[0] || null)}
              style={{ fontSize: 13, color: 'var(--color-text-2)' }}
            />
            {file && (
              <p style={{ fontSize: 12, color: 'var(--color-text-3)', marginTop: 4 }}>
                📎 {file.name}
              </p>
            )}
          </div>

          {/* Tip */}
          <p style={{
            fontSize: 12, color: 'var(--color-accent)', fontWeight: 500,
            background: 'rgba(232,160,32,0.1)', padding: '8px 12px', borderRadius: 6,
          }}>
            ⚡ Adding references earns +5 Spark points
          </p>
        </div>
      )}
    </div>
  );
}
