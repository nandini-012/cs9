function ApiStatusBadge({ status }) {
  return (
    <p className="mb-3 inline-flex rounded-full bg-cyan-500/10 px-3 py-1 text-sm font-semibold text-cyan-600 ring-1 ring-cyan-500/20 dark:text-cyan-300">
      Tailwind ready | {status}
    </p>
  )
}

export default ApiStatusBadge
