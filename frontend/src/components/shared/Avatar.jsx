export default function Avatar({ user, size = 32 }) {
  const initials = user?.avatarInitials || user?.name?.split(' ').map(n => n[0]).join('').slice(0,2).toUpperCase() || '?';
  return (
    <div
      className="avatar"
      style={{ width: size, height: size, fontSize: size * 0.375 }}
      title={user?.name}
    >
      {initials}
    </div>
  );
}
