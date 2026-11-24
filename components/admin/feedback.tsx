'use client'

import { useState } from 'react'
import {
  Check,
  X,
  AlertCircle,
  Info,
  Loader2,
  Trash2,
} from 'lucide-react'

export type ToastType = 'success' | 'error' | 'info'

export type Toast = {
  id: number
  type: ToastType
  message: string
}

/**
 * Kumpulan hook & komponen kecil untuk UX CRUD di admin.
 * - useToasts(): manajemen daftar toast + helper push
 * - <ToastViewport toasts={} onDismiss={} /> : render toast di pojok
 * - useConfirmDialog(): konfirmasi hapus / aksi destruktif
 * - <ConfirmDialog state={} onConfirm={} onCancel={} />
 */

export function useToasts() {
  const [toasts, setToasts] = useState<Toast[]>([])

  const push = (type: ToastType, message: string) => {
    const id = Date.now() + Math.random()
    setToasts((prev) => [...prev, { id, type, message }])
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id))
    }, 4000)
  }

  const dismiss = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return { toasts, push, dismiss }
}

const TOAST_STYLES: Record<ToastType, { bg: string; icon: React.ComponentType<React.SVGProps<SVGSVGElement>> }> = {
  success: { bg: 'bg-green-500', icon: Check },
  error: { bg: 'bg-red-500', icon: AlertCircle },
  info: { bg: 'bg-blue-500', icon: Info },
}

export function ToastViewport({
  toasts,
  onDismiss,
}: {
  toasts: Toast[]
  onDismiss: (id: number) => void
}) {
  return (
    <div className="fixed top-4 right-4 z-[60] space-y-2 w-80 pointer-events-none">
      {toasts.map((t) => {
        const s = TOAST_STYLES[t.type]
        const Icon = s.icon
        return (
          <div
            key={t.id}
            className={`px-4 py-3 rounded-xl shadow-lg flex items-center gap-3 text-sm font-medium text-white pointer-events-auto ${s.bg}`}
            role="alert"
          >
            <Icon className="w-4 h-4 shrink-0" />
            <span className="flex-1">{t.message}</span>
            <button
              onClick={() => onDismiss(t.id)}
              className="opacity-70 hover:opacity-100"
              aria-label="Tutup notifikasi"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          </div>
        )
      })}
    </div>
  )
}

export type ConfirmState = {
  open: boolean
  title: string
  description: string
  confirmLabel?: string
  cancelLabel?: string
  loading?: boolean
  danger?: boolean
}

export function useConfirmDialog(initial?: { title: string; description: string }) {
  const [state, setState] = useState<ConfirmState>({
    open: false,
    title: initial?.title ?? '',
    description: initial?.description ?? '',
    loading: false,
    danger: false,
  })

  const openDialog = (opts: {
    title: string
    description: string
    confirmLabel?: string
    cancelLabel?: string
    danger?: boolean
  }) => {
    setState({ ...opts, open: true, loading: false })
  }

  const closeDialog = () => setState((s) => ({ ...s, open: false, loading: false }))

  const confirmAction = () => setState((s) => ({ ...s, open: false, loading: false }))

  return { state, openDialog, closeDialog, confirmAction }
}

export function ConfirmDialog({
  state,
  onConfirm,
  onCancel,
}: {
  state: ConfirmState
  onConfirm: () => void
  onCancel: () => void
}) {
  if (!state.open) return null
  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-[60] p-4">
      <div className="bg-surface rounded-2xl shadow-xl max-w-sm w-full p-6">
        <div className="flex items-start gap-3">
          <div
            className={`w-10 h-10 rounded-full flex items-center justify-center shrink-0 ${
              state.danger ? 'bg-red-100' : 'bg-blue-100'
            }`}
          >
            {state.danger ? (
              <Trash2 className={`w-5 h-5 ${state.danger ? 'text-red-600' : 'text-blue-600'}`} />
            ) : (
              <AlertCircle className="w-5 h-5 text-blue-600" />
            )}
          </div>
          <div>
            <h3 className="text-base font-bold text-heading mb-1">{state.title}</h3>
            <p className="text-sm text-text/60">{state.description}</p>
          </div>
        </div>

        <div className="flex gap-3 mt-6">
          <button
            onClick={onCancel}
            disabled={state.loading}
            className="flex-1 py-2.5 bg-background text-heading font-bold rounded-xl hover:bg-muted transition-colors disabled:opacity-50"
          >
            {state.cancelLabel || 'Batal'}
          </button>
          <button
            onClick={onConfirm}
            disabled={state.loading}
            className={`flex-1 py-2.5 text-white font-bold rounded-xl transition-colors disabled:opacity-50 flex items-center justify-center gap-2 ${
              state.danger ? 'bg-red-500 hover:bg-red-600' : 'bg-primary-dark hover:bg-primary'
            }`}
          >
            {state.loading && <Loader2 className="w-4 h-4 animate-spin" />}
            {state.confirmLabel || 'Ya, Lanjutkan'}
          </button>
        </div>
      </div>
    </div>
  )
}

export default useToasts
