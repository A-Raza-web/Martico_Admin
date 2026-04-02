import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import Button from '@mui/material/Button';

function CategoryDeleteDialog({ open, onClose, onConfirm, categoryName }) {
    return (
        <Dialog
            open={open}
            onClose={onClose}
            aria-labelledby="alert-dialog-title"
            aria-describedby="alert-dialog-description"
        >
            <DialogTitle id="alert-dialog-title">
                {"Delete Category?"}
            </DialogTitle>
            <DialogContent>
                <div id="alert-dialog-description">
                    Are you sure you want to delete the category <strong>{categoryName}</strong>? This action cannot be undone.
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

export default CategoryDeleteDialog;
