import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

export default function ApprovalsEditViewRejectReasonModal(props) {
    const { reason, showEditViewRejectReasonModal } = props;
    const [value, setValue] = React.useState(reason);
    const [open] = React.useState(showEditViewRejectReasonModal);

    const handleCancel = () => {
        props.handleBackButton(false);
    };

    const handleOk = () => {
        props.handleRejectReason(value);
        props.handleBackButton(false);
    };

    const handleChange = event => {
        setValue(event.target.value);
    };

    return (
        <Dialog
            disableBackdropClick
            disableEscapeKeyDown
            aria-labelledby="confirmation-dialog-title"
            open={open}
        >
            <DialogTitle id="confirmation-dialog-title">Reason</DialogTitle>
            <DialogContent dividers>
                <TextareaAutosize
                    rows={6}
                    aria-label="reason"
                    placeholder="write a reason please..."
                    defaultValue={reason}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="primary">
                    Cancel
                </Button>
                <Button
                    onClick={handleOk}
                    color="primary"
                    disabled={value.length === 0}
                >
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ApprovalsEditViewRejectReasonModal.propTypes = {
    reason: PropTypes.string.isRequired,
    handleBackButton: PropTypes.func.isRequired,
    showEditViewRejectReasonModal: PropTypes.bool.isRequired,
    handleRejectReason: PropTypes.func.isRequired
};
