/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import Button from '@material-ui/core/Button';
import DialogTitle from '@material-ui/core/DialogTitle';
import DialogContent from '@material-ui/core/DialogContent';
import DialogActions from '@material-ui/core/DialogActions';
import Dialog from '@material-ui/core/Dialog';
import TextareaAutosize from '@material-ui/core/TextareaAutosize';

export default function ApprovalsEditViewNoteModal(props) {
    const [value, setValue] = React.useState(props.note);
    const [open] = React.useState(props.showEditViewNoteModal);
    const { translations } = props;

    const handleCancel = () => {
        props.handleBackButton(null);
    };

    const handleOk = () => {
        props.handleSelectedNote(value);
        props.handleBackButton(null);
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
            <DialogTitle id="confirmation-dialog-title">Note</DialogTitle>
            <DialogContent dividers>
                <TextareaAutosize
                    rows={6}
                    aria-label={translations.note}
                    placeholder={translations.writeNote}
                    defaultValue={props.note}
                    onChange={handleChange}
                />
            </DialogContent>
            <DialogActions>
                <Button autoFocus onClick={handleCancel} color="primary">
                    {translations.cancel}
                </Button>
                <Button onClick={handleOk} color="primary">
                    Ok
                </Button>
            </DialogActions>
        </Dialog>
    );
}

ApprovalsEditViewNoteModal.propTypes = {
    note: PropTypes.string.isRequired,
    handleBackButton: PropTypes.func.isRequired,
    showEditViewNoteModal: PropTypes.bool.isRequired,
    handleSelectedNote: PropTypes.func.isRequired,
    translations: PropTypes.object.isRequired
};
