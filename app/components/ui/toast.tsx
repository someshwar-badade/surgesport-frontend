import * as React from "react"
import * as ToastPrimitive from "@radix-ui/react-toast"
import { cn } from "~/lib/utils"

// Simple toast context/provider using Radix primitives
interface Toast {
  id: number
  title: string
  description?: string
  variant?: "default" | "success" | "error"
}

interface ToastContextValue {
  addToast: (toast: Omit<Toast, "id">) => void
}

const ToastContext = React.createContext<ToastContextValue | undefined>(
  undefined
)

let toastId = 0

export const ToastProvider = ({ children }: { children: React.ReactNode }) => {
  const [toasts, setToasts] = React.useState<Toast[]>([])

  const addToast = (toast: Omit<Toast, "id">) => {
    const id = ++toastId
    setToasts((prev) => [...prev, { id, ...toast }])
  }

  const removeToast = (id: number) => {
    setToasts((prev) => prev.filter((t) => t.id !== id))
  }

  return (
    <ToastContext.Provider value={{ addToast }}>
      {children}
      <ToastPrimitive.Provider>
        <div className="fixed right-4 bottom-4 z-50 flex flex-col gap-2">
          {toasts.map((toast) => (
            <ToastPrimitive.Root
              key={toast.id}
              open
              onOpenChange={(open) => {
                if (!open) removeToast(toast.id)
              }}
              className={cn(
                "w-full max-w-xs rounded-md bg-white p-4 shadow-lg",
                toast.variant === "error"
                  ? "border border-red-500"
                  : "border border-green-500"
              )}
            >
              <ToastPrimitive.Title className="font-medium">
                {toast.title}
              </ToastPrimitive.Title>
              {toast.description && (
                <ToastPrimitive.Description>
                  {toast.description}
                </ToastPrimitive.Description>
              )}
            </ToastPrimitive.Root>
          ))}
          <ToastPrimitive.Viewport />
        </div>
      </ToastPrimitive.Provider>
    </ToastContext.Provider>
  )
}

export function useToast() {
  const context = React.useContext(ToastContext)
  if (!context) {
    throw new Error("useToast must be used within a ToastProvider")
  }
  return context
}
