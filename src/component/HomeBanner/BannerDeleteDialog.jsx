import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function BannerDeleteDialog({ open, onClose, onConfirm, bannerId }) {
  return (
    <Dialog
      open={open}
      onClose={onClose}
      aria-labelledby="banner-delete-title"
      aria-describedby="banner-delete-description"
    >
      <DialogTitle id="banner-delete-title">
        {"Delete Banner?"}
      </DialogTitle>
      <DialogContent>
        <div id="banner-delete-description">
          Are you sure you want to delete this banner{bannerId ? ` (${bannerId})` : ''}? This action cannot be undone.
        </div>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Cancel</Button>
        <Button onClick={onConfirm} color="error" autoFocus>
          Delete
        </Button>
      </DialogActions>
    </Dialog>
  );
}

export default BannerDeleteDialog;
