import Topbar from '../../Topbar/Topbar';
import Avatar from '../../shared/Avatar';
import SparkBadge from '../../shared/SparkBadge';
import { MOCK_USERS, MOCK_ANSWERS } from '../../../data/mockData';

const CURRENT_USER_ID = 'u2';

const PODIUM_ORDER = [1, 0, 2]; // 2nd, 1st, 3rd index
const PODIUM_HEIGHT = [80, 110, 60];
const PODIUM_LABEL  = ['2nd', '1st', '3rd'];
const PODIUM_COLOR  = ['var(--color-text-3)', 'var(--color-accent)', '#CD7F32'];

function buildRankings() {
  return [...MOCK_USERS]
    .map(u => ({
      ...u,
      answersGiven:   MOCK_ANSWERS.filter(a => a.authorId === u.id).length,
      acceptedAnswers: MOCK_ANSWERS.filter(a => a.authorId === u.id && a.accepted).length,
    }))
    .sort((a, b) => b.spark - a.spark)
    .map((u, i) => ({ ...u, rank: i + 1 }));
}

export default function Leaderboard() {
  const rankings = buildRankings();
  const top3     = rankings.slice(0, 3);
  const myRank   = rankings.find(u => u.id === CURRENT_USER_ID);

  return (
    <div style={{ minHeight: '100svh', background: 'var(--color-surface)' }}>
      <Topbar />

      <div style={{ maxWidth: 860, margin: '0 auto', padding: '36px 24px' }}>

        {/* Header */}
        <div style={{ textAlign: 'center', marginBottom: 48 }}>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: 32, fontWeight: 700, marginBottom: 8 }}>
            ⚡ Spark Achievement Leaderboard
          </h1>
          <p style={{ color: 'var(--color-text-3)', fontSize: 15 }}>
            Top contributors ranked by Spark points earned through questions, answers, and expert reviews.
          </p>
        </div>

        {/* Podium */}
        <div style={{ display: 'flex', alignItems: 'flex-end', justifyContent: 'center', gap: 24, marginBottom: 48 }}>
          {PODIUM_ORDER.map((idx, pos) => {
            const user = top3[idx];
            if (!user) return null;
            return (
              <div key={user.id} style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 10 }}>
                {/* Avatar + crown */}
                <div style={{ position: 'relative' }}>
                  {pos === 1 && (
                    <div style={{ position: 'absolute', top: -22, left: '50%', transform: 'translateX(-50%)', fontSize: 22 }}>
                      👑
                    </div>
                  )}
                  <Avatar user={user} size={pos === 1 ? 60 : 48} />
                </div>
                <p style={{ fontFamily: 'var(--font-display)', fontWeight: 600, fontSize: 14, textAlign: 'center', color: 'var(--color-text-1)' }}>
                  {user.name}
                </p>
                <span style={{
                  background: 'rgba(232,160,32,0.15)', color: 'var(--color-accent)',
                  padding: '3px 10px', borderRadius: 20, fontSize: 12, fontWeight: 700,
                }}>
                  {user.spark.toLocaleString()} pts
                </span>
                {/* Podium block */}
                <div style={{
                  width: pos === 1 ? 110 : 90,
                  height: PODIUM_HEIGHT[pos],
                  background: PODIUM_COLOR[pos],
                  borderRadius: '6px 6px 0 0',
                  display: 'flex', alignItems: 'center', justifyContent: 'center',
                  color: '#fff', fontFamily: 'var(--font-display)', fontWeight: 700,
                  fontSize: pos === 1 ? 20 : 16,
                  opacity: 0.9,
                }}>
                  {PODIUM_LABEL[pos]}
                </div>
              </div>
            );
          })}
        </div>

        {/* Rankings table */}
        <div className="card" style={{ overflow: 'hidden', marginBottom: 16 }}>
          <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: 14 }}>
            <thead>
              <tr style={{ background: 'var(--color-surface)' }}>
                {['Rank', 'Contributor', 'Spark Points', 'Answers', 'Accepted', 'Badge'].map(h => (
                  <th key={h} style={{
                    padding: '12px 16px', textAlign: h === 'Rank' ? 'center' : 'left',
                    fontWeight: 600, color: 'var(--color-text-3)', fontSize: 11,
                    textTransform: 'uppercase', letterSpacing: '0.04em',
                    borderBottom: '1px solid var(--color-border)',
                  }}>{h}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {rankings.map(u => {
                const isTop3 = u.rank <= 3;
                const isMe   = u.id === CURRENT_USER_ID;
                return (
                  <tr
                    key={u.id}
                    style={{
                      background: isMe ? 'rgba(26,39,68,0.05)' : isTop3 ? 'rgba(232,160,32,0.05)' : 'transparent',
                      borderBottom: '1px solid var(--color-border)',
                      borderLeft: isMe ? '3px solid var(--color-primary)' : 'none',
                    }}
                  >
                    <td style={{ padding: '14px 16px', textAlign: 'center', fontWeight: 700, color: isTop3 ? 'var(--color-accent)' : 'var(--color-text-3)', fontFamily: 'var(--font-display)' }}>
                      {u.rank === 1 ? '🥇' : u.rank === 2 ? '🥈' : u.rank === 3 ? '🥉' : `#${u.rank}`}
                    </td>
                    <td style={{ padding: '14px 16px' }}>
                      <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
                        <Avatar user={u} size={32} />
                        <div>
                          <p style={{ fontWeight: 600, color: 'var(--color-text-1)', fontSize: 14 }}>
                            {u.name} {isMe && <span style={{ fontSize: 11, color: 'var(--color-text-3)' }}>(you)</span>}
                          </p>
                          <p style={{ fontSize: 11, color: 'var(--color-text-3)', textTransform: 'capitalize' }}>{u.role}</p>
                        </div>
                      </div>
                    </td>
                    <td style={{ padding: '14px 16px', fontWeight: 700, color: 'var(--color-accent)', fontFamily: 'var(--font-display)' }}>
                      {u.spark.toLocaleString()}
                    </td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text-2)' }}>{u.answersGiven}</td>
                    <td style={{ padding: '14px 16px', color: 'var(--color-text-2)' }}>{u.acceptedAnswers}</td>
                    <td style={{ padding: '14px 16px' }}>
                      <SparkBadge points={u.spark} />
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Badge tiers legend */}
        <div className="card" style={{ padding: 20 }}>
          <h3 style={{ fontFamily: 'var(--font-display)', fontSize: 14, marginBottom: 14, color: 'var(--color-text-1)' }}>Badge Tiers</h3>
          <div style={{ display: 'flex', gap: 20, flexWrap: 'wrap' }}>
            {[
              { range: '0–99 pts',    tier: 0,   label: 'Newcomer' },
              { range: '100–499 pts', tier: 100, label: 'Contributor' },
              { range: '500–999 pts', tier: 500, label: 'Expert' },
              { range: '1000+ pts',   tier: 1000, label: 'Champion' },
            ].map(t => (
              <div key={t.label} style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
                <SparkBadge points={t.tier} />
                <span style={{ fontSize: 12, color: 'var(--color-text-3)' }}>{t.range}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
