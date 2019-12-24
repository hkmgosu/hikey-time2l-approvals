import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';
import { REJECTIONS_LEVEL } from '../app/constants';

export default function ApprovalsEditViewRejectReasonModal(props) {
    const { reason, showEditViewRejectReasonModal } = props;
    const [value, setValue] = React.useState(props.reason);

    const handleCancel = () => {
        props.handleBackButton(false);
    };

    const handleOk = () => {
        if (props.handleRejectReason) props.handleRejectReason(value);
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
            open={showEditViewRejectReasonModal}
        >
            <DialogTitle id="confirmation-dialog-title">Reason</DialogTitle>
            <DialogContent dividers>
                <TextareaAutosize
                    rows={6}
                    aria-label="reason"
                    placeholder="write a reason please..."
                    defaultValue={reason}
                    onChange={handleChange}
                    disabled={!props.handleRejectReason}
                />
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="primary">
                    {`${!props.handleRejectReason ? 'Back' : 'Cancel'}`}
                </Button>
                <Button
                    onClick={handleOk}
                    color="primary"
                    disabled={value.length === 0 || !props.handleRejectReason}
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
    // eslint-disable-next-line react/forbid-prop-types
    handleRejectReason: PropTypes.any.isRequired
};
