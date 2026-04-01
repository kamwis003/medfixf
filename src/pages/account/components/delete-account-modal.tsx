import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Alert, AlertDescription } from '@/components/ui/alert'
import { Trash2, AlertTriangle } from 'lucide-react'

interface IDeleteAccountModalProps {
  isDeleteModalOpen: boolean
  onDeleteModalClose: () => void
  onDeleteAccountConfirm: () => void
  isDeleting: boolean
}

export const DeleteAccountModal = ({
  isDeleteModalOpen,
  onDeleteModalClose,
  onDeleteAccountConfirm,
  isDeleting,
}: IDeleteAccountModalProps) => {
  const { t } = useTranslation()
  const [confirmationText, setConfirmationText] = useState<string>('')
  const [isConfirmed, setIsConfirmed] = useState<boolean>(false)

  const handleConfirmationChange = (value: string) => {
    setConfirmationText(value)
    setIsConfirmed(value === 'DELETE')
  }

  const handleClose = () => {
    setConfirmationText('')
    setIsConfirmed(false)
    onDeleteModalClose()
  }

  const handleConfirm = () => {
    if (isConfirmed) {
      onDeleteAccountConfirm()
    }
  }

  return (
    <Dialog open={isDeleteModalOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-destructive flex items-center gap-2">
            <Trash2 className="h-5 w-5" />
            {t('account.deleteAccount.title')}
          </DialogTitle>
          <DialogDescription>{t('account.deleteAccount.description')}</DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          <Alert variant="destructive">
            <AlertTriangle className="h-4 w-4" />
            <AlertDescription>{t('account.deleteAccount.warning')}</AlertDescription>
          </Alert>

          <div className="space-y-2">
            <Label htmlFor="confirmation">{t('account.deleteAccount.confirmationLabel')}</Label>
            <Input
              id="confirmation"
              type="text"
              value={confirmationText}
              onChange={e => handleConfirmationChange(e.target.value)}
              placeholder="DELETE"
              className="font-mono"
            />
            <p className="text-muted-foreground text-xs">
              {t('account.deleteAccount.confirmationHint')}
            </p>
          </div>

          <div className="border-muted rounded-lg border p-3">
            <p className="text-muted-foreground text-sm">
              <strong>{t('account.deleteAccount.affectedData.title')}:</strong>
            </p>
            <ul className="text-muted-foreground mt-2 space-y-1 text-xs">
              <li>• {t('account.deleteAccount.affectedData.profile')}</li>
              <li>• {t('account.deleteAccount.affectedData.billing')}</li>
              <li>• {t('account.deleteAccount.affectedData.data')}</li>
            </ul>
          </div>
        </div>

        <DialogFooter className="flex flex-col gap-2 sm:flex-row">
          <Button
            variant="outline"
            onClick={handleClose}
            disabled={isDeleting}
            className="w-full sm:w-auto"
          >
            {t('common.cancel')}
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isConfirmed || isDeleting}
            className="w-full sm:w-auto"
          >
            {isDeleting ? (
              <>
                <Trash2 className="mr-2 h-4 w-4 animate-spin" />
                {t('account.deleteAccount.deleting')}
              </>
            ) : (
              <>
                <Trash2 className="mr-2 h-4 w-4" />
                {t('account.deleteAccount.confirm')}
              </>
            )}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
