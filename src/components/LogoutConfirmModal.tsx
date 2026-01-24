// src/components/LogoutConfirmModal.tsx
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { AlertTriangle, LogOut } from 'lucide-react';

interface LogoutConfirmModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onConfirm: () => void;
  hasWallet: boolean;
}

export function LogoutConfirmModal({ open, onOpenChange, onConfirm, hasWallet }: LogoutConfirmModalProps) {
  const handleConfirm = () => {
    onConfirm();
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <div className="flex items-center gap-3 mb-2">
            <div className="p-2 bg-destructive/10 rounded-full">
              <AlertTriangle className="w-6 h-6 text-destructive" />
            </div>
            <DialogTitle>Confirm Logout</DialogTitle>
          </div>
          <DialogDescription className="text-sm text-muted-foreground pt-2 space-y-2">
            {hasWallet ? (
              <>
                <p>
                  <strong className="text-foreground">Are you sure you want to logout?</strong>
                </p>
                <p>
                  This will:
                </p>
                <ul className="list-disc list-inside space-y-1 ml-2">
                  <li>Log you out of your account</li>
                  <li>Disconnect your Phantom wallet</li>
                </ul>
                <p className="pt-2">
                  You will need to reconnect your wallet and log in again to continue using the app.
                </p>
              </>
            ) : (
              <p>
                <strong className="text-foreground">Are you sure you want to logout?</strong>
              </p>
            )}
          </DialogDescription>
        </DialogHeader>
        <div className="flex gap-3 pt-4">
          <Button
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1"
          >
            Cancel
          </Button>
          <Button
            onClick={handleConfirm}
            className="flex-1 bg-destructive hover:bg-destructive/90 text-destructive-foreground"
          >
            <LogOut className="w-4 h-4 mr-2" />
            Logout
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
