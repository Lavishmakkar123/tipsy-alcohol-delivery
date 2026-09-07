import { AuthPanels } from "@/components/blocks/auth-panels"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"

export function AuthDialog({
  open,
  onOpenChange,
}: {
  open: boolean
  onOpenChange: (open: boolean) => void
}) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-2xl">
        <DialogHeader>
          <DialogTitle>Sign in to Tipsy</DialogTitle>
          <DialogDescription>
            We ask for your delivery address so we can show what&apos;s available near you.
          </DialogDescription>
        </DialogHeader>
        <AuthPanels onDone={() => onOpenChange(false)} />
      </DialogContent>
    </Dialog>
  )
}
