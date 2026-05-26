import { getSparkBadge } from '../../data/mockData';

export default function SparkBadge({ points, showPoints = false }) {
  const tier = getSparkBadge(points);
  return (
    <span style={{
      display: 'inline-flex',
      alignItems: 'center',
      gap: 4,
      padding: '2px 8px',
      borderRadius: 6,
      fontSize: 11,
      fontWeight: 600,
      letterSpacing: '0.04em',
      textTransform: 'uppercase',
      background: tier.bg,
      color: tier.color,
    }}>
      {tier.star && <span>★</span>}
      {tier.label}
      {showPoints && <span style={{ marginLeft: 4, opacity: 0.8 }}>{points.toLocaleString()} pts</span>}
    </span>
  );
}
