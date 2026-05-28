import React, { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import publicAxios from '@/api/axios'
import { Badge, Button, Card, Modal, Textarea } from '@/components/ui'

interface FlaggedItem {
  id: string
  target_type: string
  reason: string
  description?: string
  status: string
  created_at: string
  reported_by: string
  target: Record<string, unknown>
}

const STATUS_COLORS: Record<string, string> = {
  pending: 'bg-yellow-100 text-yellow-800',
  approved: 'bg-green-100 text-green-800',
  rejected: 'bg-red-100 text-red-800',
}

const TYPE_LABELS: Record<string, string> = {
  question: 'Question',
  answer: 'Answer',
  comment: 'Comment',
  spurti: 'Spurti',
  user: 'User',
}

export const AdminQueryReview: React.FC = () => {
  const navigate = useNavigate()
  const { id } = useParams<{ id: string }>()

  const [queue, setQueue] = useState<FlaggedItem[]>([])
  const [selected, setSelected] = useState<FlaggedItem | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [actionLoading, setActionLoading] = useState(false)
  const [actionModal, setActionModal] = useState(false)
  const [moderationAction, setModerationAction] = useState<'approve' | 'reject' | 'warn'>('approve')
  const [actionReason, setActionReason] = useState('')

  useEffect(() => {
    fetchQueue()
  }, [])

  useEffect(() => {
    if (id && queue.length > 0) {
      const item = queue.find((q) => q.id === id)
      if (item) setSelected(item)
    }
  }, [id, queue])

  const fetchQueue = async () => {
    try {
      setLoading(true)
      const res = await publicAxios.get('/api/moderation/queue?status=pending')
      setQueue(res.data.items || [])
    } catch (err: unknown) {
      setError('Failed to load moderation queue')
    } finally {
      setLoading(false)
    }
  }

  const handleAction = async () => {
    if (!selected) return
    setActionLoading(true)
    try {
      await publicAxios.patch('/api/moderation/content', {
        targetType: selected.target_type,
        targetId: selected.target.id,
        action: moderationAction,
        reason: actionReason,
      })
      setActionModal(false)
      setActionReason('')
      setSelected(null)
      fetchQueue()
    } catch (err: unknown) {
      alert('Failed to apply moderation action')
    } finally {
      setActionLoading(false)
    }
  }

  const renderTargetBody = (item: FlaggedItem) => {
    const t = item.target
    if (!t) return null

    switch (item.target_type) {
      case 'question':
        return (
          <div className="space-y-2">
            <p className="font-medium text-gray-900">{t.question as string}</p>
            <p className="text-sm text-gray-600 line-clamp-3">{t.answer as string}</p>
            {t.tags && Array.isArray(t.tags) && (
              <div className="flex flex-wrap gap-1">
                {(t.tags as string[]).map((tag) => (
                  <Badge key={tag} variant="secondary" className="text-xs">
                    {tag}
                  </Badge>
                ))}
              </div>
            )}
          </div>
        )
      case 'answer':
        return (
          <p className="text-sm text-gray-700 line-clamp-4">{t.body as string}</p>
        )
      case 'comment':
        return (
          <p className="text-sm text-gray-700 line-clamp-4">{t.body as string}</p>
        )
      case 'spurti':
        return (
          <div className="space-y-1">
            <p className="font-medium text-sm">{t.title as string}</p>
            <p className="text-xs text-gray-500">{t.description as string}</p>
          </div>
        )
      default:
        return <p className="text-sm text-gray-500">Unknown content type</p>
    }
  }

  const formatDate = (dateStr: string) =>
    new Date(dateStr).toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-4 border-indigo-600 border-t-transparent rounded-full animate-spin" />
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate('/admin')}
            className="text-sm text-gray-500 hover:text-gray-700 transition-colors"
          >
            ← Dashboard
          </button>
          <h1 className="text-2xl font-semibold text-gray-900">
            Moderation Queue
          </h1>
          <Badge className={STATUS_COLORS['pending']}>
            {queue.length} pending
          </Badge>
        </div>
        <button
          onClick={fetchQueue}
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
        >
          Refresh
        </button>
      </div>

      {error && (
        <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
          {error}
        </div>
      )}

      {queue.length === 0 ? (
        <Card className="p-12 text-center">
          <p className="text-gray-500 text-lg">🎉 No pending items in the moderation queue.</p>
          <p className="text-gray-400 text-sm mt-1">Check back later or monitor for new flags.</p>
        </Card>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Queue list */}
          <div className="lg:col-span-1 space-y-3">
            {queue.map((item) => (
              <Card
                key={item.id}
                className={`p-4 cursor-pointer transition-all hover:shadow-md ${
                  selected?.id === item.id
                    ? 'ring-2 ring-indigo-500 border-indigo-200'
                    : 'hover:border-gray-300'
                }`}
                onClick={() => setSelected(item)}
              >
                <div className="flex items-start justify-between gap-2">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge className="text-xs">{TYPE_LABELS[item.target_type] || item.target_type}</Badge>
                      <span className={`w-2 h-2 rounded-full ${item.status === 'pending' ? 'bg-yellow-400' : 'bg-gray-300'}`} />
                    </div>
                    <p className="text-sm font-medium text-gray-900 truncate capitalize">
                      {item.reason}
                    </p>
                    <p className="text-xs text-gray-400 mt-1">
                      {formatDate(item.created_at)}
                    </p>
                  </div>
                </div>
              </Card>
            ))}
          </div>

          {/* Detail panel */}
          <div className="lg:col-span-2">
            {selected ? (
              <Card className="p-6 space-y-5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <Badge className="text-sm">{TYPE_LABELS[selected.target_type]}</Badge>
                    <Badge className={STATUS_COLORS[selected.status]}>
                      {selected.status}
                    </Badge>
                  </div>
                  <span className="text-xs text-gray-400">
                    {formatDate(selected.created_at)}
                  </span>
                </div>

                {/* Flag details */}
                <div className="p-4 bg-gray-50 rounded-lg space-y-2">
                  <div>
                    <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                      Reason
                    </label>
                    <p className="text-sm font-medium text-gray-900 mt-0.5 capitalize">
                      {selected.reason}
                    </p>
                  </div>
                  {selected.description && (
                    <div>
                      <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                        Description
                      </label>
                      <p className="text-sm text-gray-700 mt-0.5">{selected.description}</p>
                    </div>
                  )}
                </div>

                {/* Target content */}
                <div>
                  <label className="text-xs font-semibold text-gray-500 uppercase tracking-wide">
                    Content
                  </label>
                  <div className="mt-2 p-4 bg-white border border-gray-200 rounded-lg">
                    {renderTargetBody(selected)}
                  </div>
                </div>

                {/* Reporter */}
                {selected.reported_by && (
                  <p className="text-xs text-gray-400">
                    Flagged by user: {selected.reported_by}
                  </p>
                )}

                {/* Action buttons */}
                {selected.status === 'pending' && (
                  <div className="flex items-center gap-3 pt-4 border-t border-gray-100">
                    <Button
                      variant="primary"
                      onClick={() => { setModerationAction('approve'); setActionModal(true) }}
                    >
                      ✓ Approve
                    </Button>
                    <Button
                      variant="danger"
                      onClick={() => { setModerationAction('reject'); setActionModal(true) }}
                    >
                      ✕ Reject
                    </Button>
                    <Button
                      variant="secondary"
                      onClick={() => { setModerationAction('warn'); setActionModal(true) }}
                    >
                      ⚠ Warn User
                    </Button>
                  </div>
                )}
              </Card>
            ) : (
              <Card className="p-12 text-center text-gray-400">
                Select an item from the queue to review
              </Card>
            )}
          </div>
        </div>
      )}

      {/* Confirmation modal */}
      <Modal
        open={actionModal}
        onClose={() => setActionModal(false)}
        title={`Confirm ${moderationAction.charAt(0).toUpperCase() + moderationAction.slice(1)}`}
      >
        <div className="space-y-4">
          <p className="text-sm text-gray-600">
            Are you sure you want to <strong>{moderationAction}</strong> this {selected?.target_type}?
            {moderationAction === 'warn' && ' This will send a warning notification to the user.'}
          </p>
          <Textarea
            label="Reason (optional)"
            value={actionReason}
            onChange={(e) => setActionReason(e.target.value)}
            placeholder="Add a reason or notes for this action..."
            rows={3}
          />
          <div className="flex justify-end gap-3">
            <Button variant="secondary" onClick={() => setActionModal(false)}>
              Cancel
            </Button>
            <Button
              variant={moderationAction === 'reject' ? 'danger' : 'primary'}
              loading={actionLoading}
              onClick={handleAction}
            >
              Confirm
            </Button>
          </div>
        </div>
      </Modal>
    </div>
  )
}

export default AdminQueryReview