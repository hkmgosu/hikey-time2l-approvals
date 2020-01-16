/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Avatar from '@material-ui/core/Avatar';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Button from '@material-ui/core/Button';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';
import TopAppBar from './TopAppBar';
import ApprovalsEditViewRejectReasonModal from './ApprovalsEditViewRejectReasonModal';
import {
    APPROVALS_LEVEL,
    AUTHORIZATIONS_LEVEL,
    REJECTIONS_LEVEL,
    PREAPPROVALS_LEVEL
} from '../app/constants';
import 'moment/locale/de';
import 'moment/locale/es';

moment.locale('en'); // it is required to select default locale manually

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginBottom: 120,
        paddingTop: 0
    },
    avatar: {
        width: 60,
        height: 60,
        marginRight: 6
    },
    inline: {
        display: 'inline'
    },
    avatarText: {
        fontWeight: 600
    },
    ListItemAvatar: {
        minWidth: 39
    },
    detailButton: {
        marginLeft: 9
    },
    bottomGrid: {
        top: 'auto',
        bottom: 0,
        position: 'fixed',
        height: 60,
        backgroundColor: '#fff'
    },
    updateButton: {
        margin: 3
    },
    approveButton: {
        backgroundColor: theme.palette.warning.main,
        color: 'white',
        margin: 3
    },
    noResult: {
        marginTop: 30
    },
    projectListItemText: {
        color: 'grey'
    },
    entryAuthorAsset: {
        width: '100%',
        backgroundColor: '#b2b2ca'
    },
    entryDuration: {
        width: '100%',
        color: theme.palette.warning.main,
        minHeight: 30,
        margin: 30
    },
    dateTimeIcon: {
        paddingRight: 0,
        paddingTop: 0,
        marginBottom: 9
    },
    disableTextColor: {
        color: 'gray'
    }
}));

export default function ApprovalsEditViewForm(props) {
    const classes = useStyles();
    const [project] = React.useState(props.selectedProject);
    const [task] = React.useState(props.selectedTask);
    const [startDate] = React.useState(props.selectedStartDate);
    const [endDate] = React.useState(props.selectedEndDate);
    const [items] = React.useState(props.selectedItems);
    const [note] = React.useState(props.selectedNote);
    const [duration] = React.useState(props.selectedDuration);
    const [showStartDate, setShowStartDate] = React.useState(false);
    const [showEndDate, setShowEndDate] = React.useState(false);
    const [showStartTime, setShowStartTime] = React.useState(false);
    const [showEndTime, setShowEndTime] = React.useState(false);
    const [formError, setFormError] = React.useState(false);
    const [
        showEditViewRejectReasonModal,
        setShowEditViewRejectReasonModal
    ] = React.useState(false);
    const [rejectReason] = React.useState(props.selectedRejectReason);
    const { level, options, loading, translations, userLanguage } = props;

    moment.locale(userLanguage);

    const handleBackButton = () => {
        props.handleBackButton();
    };

    const handleDuration = async () => {
        const durationTemp = await moment.duration(
            moment(endDate).diff(moment(startDate))
        );
        await props.handleSelectedDuration(
            `${parseInt(durationTemp.asDays(), 10)} ${
                translations.days
            } ${durationTemp.hours()}h ${
                durationTemp.minute < 10
                    ? `0${durationTemp.minutes()}`
                    : durationTemp.minutes()
            }min`
        );
    };

    React.useEffect(() => {
        handleDuration();
    });

    const actualItems = [];
    if (items && items.length > 0) {
        items.forEach(value => {
            if (!value.actual) return;
            actualItems.push(
                <Typography
                    key={`item-${value.name}`}
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                    style={
                        [PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(level)
                            ? {}
                            : { color: 'gray' }
                    }
                >
                    {`${
                        value.name && value.name.length > 18
                            ? `${value.name.substring(0, 18)}...`
                            : value.name
                    }: ${value.actual}`}
                </Typography>
            );
        });
    } else {
        actualItems.push(
            <Typography
                key={`item-${0}`}
                component="span"
                variant="body2"
                style={{ color: 'grey ' }}
            >
                {[PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(level)
                    ? translations.pleaseSelectProjectWithItems
                    : translations.noItemsAssigned}
            </Typography>
        );
    }

    const ActualItems = () => {
        return actualItems.length > 0 ? (
            actualItems
        ) : (
            <Typography
                key={`item-${0}`}
                component="span"
                variant="body2"
                style={{ color: 'grey ' }}
            >
                {[PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(level)
                    ? translations.pleaseSelectItems
                    : translations.noItemsAssigned}
            </Typography>
        );
    };

    const enableEditButtonStyle = {
        display: [APPROVALS_LEVEL, AUTHORIZATIONS_LEVEL].includes(level)
            ? 'none'
            : 'inherit'
    };

    const handleApproveButtonText = () => {
        if (level === AUTHORIZATIONS_LEVEL) {
            return translations.authorise;
        }
        if (level !== REJECTIONS_LEVEL) {
            return translations.approve;
        }
        return translations.reSubmit;
    };

    return (
        <>
            <TopAppBar
                title={translations.timesheet}
                position="static"
                enableBackButton
                handleBackButton={handleBackButton}
            />
            <>
                <List className={classes.root}>
                    <ListItem style={{ padding: 0 }}>
                        <Typography
                            align="center"
                            component="span"
                            variant="caption"
                            color="primary"
                            className={classes.entryAuthorAsset}
                        >
                            {`${props.entry.created.author} - ${props.entry.asset.assetId}`}
                        </Typography>
                    </ListItem>
                    <ListItem style={{ padding: 0 }} divider>
                        <Typography
                            align="center"
                            variant="h6"
                            className={classes.entryDuration}
                        >
                            {`${translations.total}: ${duration}`}
                        </Typography>
                    </ListItem>

                    {level === REJECTIONS_LEVEL && (
                        <ListItem divider button>
                            <ListItemAvatar
                                className={classes.ListItemAvatar}
                                onClick={() =>
                                    setShowEditViewRejectReasonModal(true)
                                }
                            >
                                <Avatar
                                    alt="Project"
                                    src="/static/icons/Icons_AppInterface-8.svg"
                                    className={classes.avatar}
                                />
                            </ListItemAvatar>
                            <Grid
                                container
                                direction="column"
                                justify="space-around"
                                alignItems="flex-start"
                                spacing={0}
                                onClick={() =>
                                    setShowEditViewRejectReasonModal(true)
                                }
                            >
                                <Typography
                                    component="span"
                                    variant="overline"
                                    className={classes.inline}
                                    color="error"
                                >
                                    {translations.rejected}
                                </Typography>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.inline}
                                    color="textPrimary"
                                >
                                    {translations.clickHereToSeeDetails}
                                </Typography>
                            </Grid>
                            <Grid
                                container
                                direction="row"
                                justify="flex-end"
                                alignItems="center"
                                style={{ width: 48, ...enableEditButtonStyle }}
                                onClick={() =>
                                    setShowEditViewRejectReasonModal(true)
                                }
                            >
                                <IconButton
                                    className={classes.detailButton}
                                    aria-label={
                                        translations.clickHereToSeeDetails
                                    }
                                >
                                    <KeyboardArrowRight />
                                </IconButton>
                            </Grid>
                            <ApprovalsEditViewRejectReasonModal
                                handleBackButton={show =>
                                    setShowEditViewRejectReasonModal(show)
                                }
                                reason={rejectReason}
                                showEditViewRejectReasonModal={
                                    showEditViewRejectReasonModal
                                }
                                handleRejectReason={false}
                                translations={props.translations}
                            />
                        </ListItem>
                    )}
                    <ListItem
                        divider
                        button={[PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                            level
                        )}
                        onClick={() =>
                            [PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                                level
                            ) &&
                            props.handleShowEditViewProjectOptions(
                                options.projects
                            )
                        }
                    >
                        <ListItemAvatar className={classes.ListItemAvatar}>
                            <Avatar
                                alt="Project"
                                src="/static/icons/Icons_AppInterface-4.svg"
                                className={classes.avatar}
                            />
                        </ListItemAvatar>
                        <Grid
                            container
                            direction="column"
                            justify="space-around"
                            alignItems="flex-start"
                            spacing={0}
                        >
                            <Typography
                                component="span"
                                variant="overline"
                                className={classes.inline}
                                color="textPrimary"
                            >
                                {translations.project.toUpperCase()}
                            </Typography>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                                style={
                                    [
                                        PREAPPROVALS_LEVEL,
                                        REJECTIONS_LEVEL
                                    ].includes(level)
                                        ? {}
                                        : { color: 'gray' }
                                }
                            >
                                {`${project.projectId} ${
                                    project.description
                                        ? `(${project.description})`
                                        : ''
                                }`}
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            style={{ width: 48, ...enableEditButtonStyle }}
                        >
                            <IconButton
                                className={classes.detailButton}
                                aria-label={translations.selectProject}
                            >
                                <KeyboardArrowRight />
                            </IconButton>
                        </Grid>
                    </ListItem>
                    <ListItem
                        divider
                        button={[PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                            level
                        )}
                        onClick={() =>
                            [PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                                level
                            ) &&
                            props.handleShowEditViewTaskOptions(
                                project.tasks || []
                            )
                        }
                    >
                        <ListItemAvatar className={classes.ListItemAvatar}>
                            <Avatar
                                alt="Task"
                                src="/static/icons/Icons_AppInterface-8.svg"
                                className={classes.avatar}
                            />
                        </ListItemAvatar>
                        <Grid
                            container
                            direction="column"
                            justify="space-around"
                            alignItems="flex-start"
                            spacing={0}
                        >
                            <Typography
                                component="span"
                                variant="overline"
                                className={classes.inline}
                                color="textPrimary"
                            >
                                {translations.task.toUpperCase()}
                            </Typography>
                            {task ? (
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.inline}
                                    color="textPrimary"
                                    style={
                                        [
                                            PREAPPROVALS_LEVEL,
                                            REJECTIONS_LEVEL
                                        ].includes(level)
                                            ? {}
                                            : { color: 'gray' }
                                    }
                                >
                                    {typeof task === 'string' ? task : task.id}
                                </Typography>
                            ) : (
                                <Typography
                                    component="span"
                                    variant="body2"
                                    style={{ color: 'gray ' }}
                                >
                                    {level === PREAPPROVALS_LEVEL
                                        ? translations.pleaseSelectTask
                                        : translations.noTaskAssigned}
                                </Typography>
                            )}
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            style={{ width: 48, ...enableEditButtonStyle }}
                        >
                            <IconButton
                                className={classes.detailButton}
                                aria-label={translations.selectTask}
                            >
                                <KeyboardArrowRight />
                            </IconButton>
                        </Grid>
                    </ListItem>
                    <ListItem
                        divider
                        button={[PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                            level
                        )}
                        onClick={() =>
                            [PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                                level
                            ) && props.handleShowEditViewItemsOptions(items)
                        }
                    >
                        <ListItemAvatar className={classes.ListItemAvatar}>
                            <Avatar
                                alt="Items"
                                src="/static/icons/screen/icon-items.svg"
                                className={classes.avatar}
                            />
                        </ListItemAvatar>
                        <Grid
                            container
                            direction="column"
                            justify="space-around"
                            alignItems="flex-start"
                            spacing={0}
                        >
                            <Typography
                                component="span"
                                variant="overline"
                                className={classes.inline}
                                color="textPrimary"
                            >
                                {translations.items.toUpperCase()}
                            </Typography>
                            <ActualItems />
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            style={{ width: 48, ...enableEditButtonStyle }}
                        >
                            <IconButton
                                className={classes.detailButton}
                                aria-label="detail"
                            >
                                <KeyboardArrowRight />
                            </IconButton>
                        </Grid>
                    </ListItem>
                    <ListItem
                        divider
                        button={[PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                            level
                        )}
                        onClick={() => {
                            if (
                                [PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                                    level
                                )
                            ) {
                                if (!showStartDate) setShowStartDate(true);
                            }
                        }}
                    >
                        <ListItemAvatar className={classes.ListItemAvatar}>
                            <Avatar
                                alt="Start Time"
                                src="/static/icons/Icons_AppInterface-1.svg"
                                className={classes.avatar}
                            />
                        </ListItemAvatar>
                        <Grid container direction="column" spacing={0}>
                            <Typography
                                component="span"
                                variant="overline"
                                className={classes.inline}
                                color="textPrimary"
                            >
                                {translations.startDate}
                            </Typography>
                            <MuiPickersUtilsProvider
                                libInstance={moment}
                                utils={MomentUtils}
                                locale={userLanguage.toLowerCase()}
                            >
                                <KeyboardDatePicker
                                    id="date-picker-start"
                                    format="DD/MM/YYYY"
                                    cancelLabel={translations.cancel}
                                    strictCompareDates
                                    emptyLabel=""
                                    value={startDate}
                                    onClose={() => setShowStartDate(false)}
                                    onChange={value => {
                                        props.handleStartDate(new Date(value));
                                    }}
                                    onError={error => {
                                        if (error) setFormError(error);
                                    }}
                                    InputProps={{
                                        disableUnderline: true,
                                        readOnly: true
                                    }}
                                    InputAdornmentProps={{
                                        'aria-label':
                                            translations.changeStartDate,
                                        className: classes.dateTimeIcon
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label':
                                            translations.changeStartDate,
                                        disabled: [
                                            APPROVALS_LEVEL,
                                            AUTHORIZATIONS_LEVEL
                                        ].includes(level)
                                    }}
                                    keyboardIcon={(
                                        <KeyboardArrowRight
                                            style={enableEditButtonStyle}
                                        />
                                      )}
                                    disabled={[
                                        APPROVALS_LEVEL,
                                        AUTHORIZATIONS_LEVEL
                                    ].includes(level)}
                                    open={showStartDate}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </ListItem>
                    <ListItem
                        divider
                        button={[PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                            level
                        )}
                        onClick={() => {
                            if (
                                [PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                                    level
                                )
                            ) {
                                if (!showStartTime) setShowStartTime(true);
                            }
                        }}
                    >
                        <ListItemAvatar className={classes.ListItemAvatar}>
                            <Avatar
                                alt="Start Date"
                                src="/static/icons/Icons_AppInterface-1.svg"
                                className={classes.avatar}
                            />
                        </ListItemAvatar>
                        <Grid
                            container
                            direction="column"
                            justify="space-around"
                            spacing={0}
                        >
                            <Typography
                                component="span"
                                variant="overline"
                                className={classes.inline}
                                color="textPrimary"
                            >
                                {translations.startTime.toUpperCase()}
                            </Typography>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardTimePicker
                                    id="time-picker-start"
                                    ampm={false}
                                    emptyLabel=""
                                    value={startDate}
                                    onChange={async value => {
                                        props.handleStartDate(new Date(value));
                                        setShowStartDate(false);
                                    }}
                                    strictCompareDates
                                    onError={error => {
                                        if (error) setFormError(error);
                                    }}
                                    InputProps={{
                                        disableUnderline: true,
                                        readOnly: true
                                    }}
                                    InputAdornmentProps={{
                                        'aria-label':
                                            translations.changeStartTime,
                                        className: classes.dateTimeIcon
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label':
                                            translations.changeStartTime,
                                        disabled: [
                                            APPROVALS_LEVEL,
                                            AUTHORIZATIONS_LEVEL
                                        ].includes(level)
                                    }}
                                    keyboardIcon={(
                                        <KeyboardArrowRight
                                            style={enableEditButtonStyle}
                                        />
                                      )}
                                    disabled={[
                                        APPROVALS_LEVEL,
                                        AUTHORIZATIONS_LEVEL
                                    ].includes(level)}
                                    open={showStartTime}
                                    onClose={() => setShowStartTime(false)}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </ListItem>
                    <ListItem
                        divider
                        button={[PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                            level
                        )}
                        onClick={() => {
                            if (
                                [PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                                    level
                                )
                            ) {
                                if (!showEndDate) setShowEndDate(true);
                            }
                        }}
                    >
                        <ListItemAvatar className={classes.ListItemAvatar}>
                            <Avatar
                                alt="End Date"
                                src="/static/icons/Icons_AppInterface-2.svg"
                                className={classes.avatar}
                            />
                        </ListItemAvatar>
                        <Grid
                            container
                            direction="column"
                            justify="space-around"
                            spacing={0}
                        >
                            <Typography
                                component="span"
                                variant="overline"
                                className={classes.inline}
                                color="textPrimary"
                            >
                                {translations.endDate.toUpperCase()}
                            </Typography>
                            <MuiPickersUtilsProvider
                                libInstance={moment}
                                utils={MomentUtils}
                                locale={userLanguage.toLowerCase()}
                            >
                                <KeyboardDatePicker
                                    id="date-picker-end"
                                    cancelLabel={translations.cancel}
                                    format="DD/MM/YYYY"
                                    emptyLabel=""
                                    value={endDate}
                                    minDate={startDate}
                                    minDateMessage={
                                        translations.minEndDateErrorMessage
                                    }
                                    onChange={value => {
                                        props.handleEndDate(new Date(value));
                                    }}
                                    strictCompareDates
                                    onError={error => {
                                        if (error) setFormError(error);
                                    }}
                                    InputProps={{
                                        disableUnderline: true,
                                        readOnly: true
                                    }}
                                    InputAdornmentProps={{
                                        'aria-label':
                                            translations.changeEndDate,
                                        className: classes.dateTimeIcon
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label':
                                            translations.changeEndDate,
                                        disabled: [
                                            APPROVALS_LEVEL,
                                            AUTHORIZATIONS_LEVEL
                                        ].includes(level)
                                    }}
                                    keyboardIcon={(
                                        <KeyboardArrowRight
                                            style={enableEditButtonStyle}
                                        />
                                      )}
                                    disabled={[
                                        APPROVALS_LEVEL,
                                        AUTHORIZATIONS_LEVEL
                                    ].includes(level)}
                                    open={showEndDate}
                                    onClose={() => setShowEndDate(false)}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </ListItem>
                    <ListItem
                        divider
                        button={[PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                            level
                        )}
                        onClick={() => {
                            if (
                                [PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                                    level
                                )
                            ) {
                                if (!showEndTime) setShowEndTime(true);
                            }
                        }}
                    >
                        <ListItemAvatar className={classes.ListItemAvatar}>
                            <Avatar
                                alt="End Time"
                                src="/static/icons/Icons_AppInterface-2.svg"
                                className={classes.avatar}
                            />
                        </ListItemAvatar>
                        <Grid
                            container
                            direction="column"
                            justify="space-around"
                            spacing={0}
                        >
                            <Typography
                                component="span"
                                variant="overline"
                                className={classes.inline}
                                color="textPrimary"
                            >
                                {translations.endTime.toUpperCase()}
                            </Typography>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardTimePicker
                                    id="time-picker-end"
                                    ampm={false}
                                    minDateMessage="Date should not be before start time"
                                    emptyLabel=""
                                    value={endDate}
                                    minDate={startDate}
                                    onChange={value => {
                                        props.handleEndDate(new Date(value));
                                    }}
                                    strictCompareDates
                                    onError={error => {
                                        if (error) setFormError(error);
                                    }}
                                    InputProps={{
                                        disableUnderline: true,
                                        readOnly: true
                                    }}
                                    InputAdornmentProps={{
                                        'aria-label':
                                            translations.changeEndTime,
                                        className: classes.dateTimeIcon
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label':
                                            translations.changeEndTime,
                                        disabled: [
                                            APPROVALS_LEVEL,
                                            AUTHORIZATIONS_LEVEL
                                        ].includes(level)
                                    }}
                                    keyboardIcon={(
                                        <KeyboardArrowRight
                                            style={enableEditButtonStyle}
                                        />
                                      )}
                                    disabled={[
                                        APPROVALS_LEVEL,
                                        AUTHORIZATIONS_LEVEL
                                    ].includes(level)}
                                    open={showEndTime}
                                    onClose={() => setShowEndTime(false)}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </ListItem>
                    <ListItem
                        divider
                        button={[PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                            level
                        )}
                        onClick={() =>
                            [PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(
                                level
                            ) && props.handleShowEditViewNoteModal(true)
                        }
                    >
                        <ListItemAvatar className={classes.ListItemAvatar}>
                            <Avatar
                                alt="Note"
                                src="/static/icons/Icons_AppInterface-5.svg"
                                className={classes.avatar}
                            />
                        </ListItemAvatar>
                        <Grid
                            container
                            direction="column"
                            justify="space-around"
                            alignItems="flex-start"
                            spacing={0}
                        >
                            <Typography
                                component="span"
                                variant="overline"
                                className={classes.inline}
                                color="textPrimary"
                            >
                                {translations.notes.toUpperCase()}
                            </Typography>
                            <Typography
                                component="span"
                                variant="body2"
                                style={
                                    [
                                        PREAPPROVALS_LEVEL,
                                        REJECTIONS_LEVEL
                                    ].includes(level) && note
                                        ? {}
                                        : { color: 'gray' }
                                }
                            >
                                {note || translations.pleaseEnterNote}
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            style={{ width: 48, ...enableEditButtonStyle }}
                        >
                            <IconButton
                                className={classes.detailButton}
                                aria-label="detail"
                            >
                                <KeyboardArrowRight />
                            </IconButton>
                        </Grid>
                    </ListItem>
                </List>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    className={classes.bottomGrid}
                >
                    <Button
                        variant="contained"
                        color="primary"
                        className={classes.updateButton}
                        size="large"
                        onClick={props.handleUpdate}
                        style={enableEditButtonStyle}
                        disabled={loading || formError.length > 0}
                    >
                        {loading ? translations.loading : translations.update}
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.approveButton}
                        size="large"
                        onClick={props.handleApprove}
                        style={{
                            backgroundColor:
                                level !== AUTHORIZATIONS_LEVEL
                                    ? classes.approveButton.backgroundColor
                                    : '#A3CF00'
                        }}
                        disabled={loading || formError.length > 0}
                    >
                        {loading
                            ? translations.loading
                            : handleApproveButtonText()}
                    </Button>
                </Grid>
            </>
        </>
    );
}

ApprovalsEditViewForm.propTypes = {
    level: PropTypes.string.isRequired,
    entry: PropTypes.object.isRequired,
    options: PropTypes.object.isRequired,
    handleApprove: PropTypes.func.isRequired,
    handleUpdate: PropTypes.func.isRequired,
    handleBackButton: PropTypes.func.isRequired,
    selectedProject: PropTypes.object.isRequired,
    selectedDuration: PropTypes.string.isRequired,
    handleSelectedDuration: PropTypes.func.isRequired,
    selectedEndDate: PropTypes.instanceOf(Date).isRequired,
    handleEndDate: PropTypes.func.isRequired,
    selectedItems: PropTypes.array.isRequired,
    selectedStartDate: PropTypes.instanceOf(Date).isRequired,
    handleStartDate: PropTypes.func.isRequired,
    selectedTask: PropTypes.oneOfType([PropTypes.string, PropTypes.object])
        .isRequired,
    selectedNote: PropTypes.string.isRequired,
    selectedRejectReason: PropTypes.string.isRequired,
    handleShowEditViewItemsOptions: PropTypes.func.isRequired,
    handleShowEditViewNoteModal: PropTypes.func.isRequired,
    handleShowEditViewProjectOptions: PropTypes.func.isRequired,
    handleShowEditViewTaskOptions: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    translations: PropTypes.object.isRequired,
    userLanguage: PropTypes.string.isRequired
};
