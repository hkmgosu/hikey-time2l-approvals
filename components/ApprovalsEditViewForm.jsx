import React from 'react';
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
import TopAppBar from './TopAppBar';
import {
    MuiPickersUtilsProvider,
    KeyboardTimePicker,
    KeyboardDatePicker
} from '@material-ui/pickers';
import MomentUtils from '@date-io/moment';
import moment from 'moment';

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
    }
}));

export default function ApprovalsEditViewForm(props) {
    const classes = useStyles();
    const [project, setProject] = React.useState(props.selectedProject);
    const [task, setTask] = React.useState(props.selectedTask);
    const [startDate, setStartDate] = React.useState(props.selectedStartDate);
    const [endDate, setEndDate] = React.useState(props.selectedEndDate);
    const [items, setItems] = React.useState(props.selectedItems);
    const [note, setNote] = React.useState(props.selectedNote);
    const [duration, setDuration] = React.useState(props.selectedDuration);
    const [formError, setFormError] = React.useState(props.formError);
    const [loading, setLoading] = React.useState(props.loading);

    React.useEffect(() => {
        handleDuration();
        window.scrollTo(0, 0);
    });

    const handleBackButton = () => {
        props.handleBackButton();
    };

    const handleDuration = async () => {
        const duration = await moment.duration(
            moment(endDate).diff(moment(startDate))
        );
        await props.handleSelectedDuration(
            `${parseInt(duration.asDays())} days ${duration.hours()}h ${
                duration.minute < 10
                    ? '0' + duration.minutes()
                    : duration.minutes()
            }min`
        );
    };

    const actualItems = [];
    if (items && items.length > 0) {
        items.map((value, index) => {
            if (!value.actual) return;
            actualItems.push(
                <Typography
                    key={`item-${index}`}
                    component="span"
                    variant="body2"
                    className={classes.inline}
                    color="textPrimary"
                >
                    {`${
                        value.name && value.name.length > 18
                            ? value.name.substring(0, 18) + '...'
                            : value.name
                    }: ${value.actual}`}
                </Typography>
            );
        });
    } else
        actualItems.push(
            <Typography
                key={`item-${0}`}
                component="span"
                variant="body2"
                style={{ color: 'grey ' }}
            >
                {`Optional: Please select a project with items`}
            </Typography>
        );

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
                {`Optional: Please select items`}
            </Typography>
        );
    };

    return (
        <React.Fragment>
            <TopAppBar
                title="Timesheet"
                position="static"
                enableBackButton={true}
                handleBackButton={handleBackButton}
            />
            <React.Fragment>
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
                    <ListItem style={{ padding: 0 }} divider={true}>
                        <Typography
                            align="center"
                            variant="h6"
                            className={classes.entryDuration}
                        >
                            {`Total: ${duration}`}
                        </Typography>
                    </ListItem>
                    <ListItem divider={true}>
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
                                PROJECT
                            </Typography>
                            <Typography
                                component="span"
                                variant="body2"
                                className={classes.inline}
                                color="textPrimary"
                            >
                                {`${project.projectId} (${project.description})`}
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            style={{
                                width: 48
                            }}
                        >
                            <IconButton
                                className={classes.detailButton}
                                aria-label="select a project"
                                onClick={() =>
                                    props.handleShowEditViewProjectOptions(
                                        props.options.projects
                                    )
                                }
                            >
                                <KeyboardArrowRight />
                            </IconButton>
                        </Grid>
                    </ListItem>
                    <ListItem divider={true}>
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
                                TASK
                            </Typography>
                            {task ? (
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.inline}
                                    color="textPrimary"
                                >
                                    {task}
                                </Typography>
                            ) : (
                                <Typography
                                    component="span"
                                    variant="body2"
                                    style={{ color: 'grey ' }}
                                >
                                    {`Optional: Please select a task`}
                                </Typography>
                            )}
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            style={{
                                width: 48
                            }}
                        >
                            <IconButton
                                className={classes.detailButton}
                                aria-label="select a task"
                                onClick={() =>
                                    props.handleShowEditViewTaskOptions(
                                        project.tasks ? project.tasks : []
                                    )
                                }
                            >
                                <KeyboardArrowRight />
                            </IconButton>
                        </Grid>
                    </ListItem>
                    <ListItem divider={true}>
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
                                ITEMS
                            </Typography>
                            <ActualItems />
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            style={{
                                width: 48
                            }}
                        >
                            <IconButton
                                className={classes.detailButton}
                                aria-label="detail"
                                onClick={() =>
                                    props.handleShowEditViewItemsOptions(items)
                                }
                            >
                                <KeyboardArrowRight />
                            </IconButton>
                        </Grid>
                    </ListItem>
                    <ListItem divider={true}>
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
                                START DATE
                            </Typography>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardDatePicker
                                    id="date-picker-start"
                                    format="DD/MM/YYYY"
                                    emptyLabel=""
                                    value={startDate}
                                    onChange={value => {
                                        props.handleStartDate(new Date(value));
                                    }}
                                    onAccept={value => {}}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                    InputAdornmentProps={{
                                        'aria-label': 'change start date',
                                        className: classes.dateTimeIcon
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change start date'
                                    }}
                                    keyboardIcon={<KeyboardArrowRight />}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </ListItem>
                    <ListItem divider={true}>
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
                                START TIME
                            </Typography>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardTimePicker
                                    id="date-picker-start"
                                    emptyLabel=""
                                    value={startDate}
                                    onChange={async value => {
                                        props.handleStartDate(new Date(value));
                                    }}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                    InputAdornmentProps={{
                                        'aria-label': 'change start date',
                                        className: classes.dateTimeIcon
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change start date'
                                    }}
                                    keyboardIcon={<KeyboardArrowRight />}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </ListItem>
                    <ListItem divider={true}>
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
                                END DATE
                            </Typography>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardDatePicker
                                    id="date-picker-end"
                                    format="DD/MM/YYYY"
                                    emptyLabel=""
                                    value={endDate}
                                    minDate={startDate}
                                    minDateMessage={`Date should not be before start date`}
                                    onChange={value => {
                                        props.handleEndDate(new Date(value));
                                    }}
                                    onError={(error, value) => {
                                        setFormError(error ? true : false);
                                    }}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                    InputAdornmentProps={{
                                        'aria-label': 'change start date',
                                        className: classes.dateTimeIcon
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change start date'
                                    }}
                                    keyboardIcon={<KeyboardArrowRight />}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </ListItem>
                    <ListItem divider={true}>
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
                                END TIME
                            </Typography>
                            <MuiPickersUtilsProvider utils={MomentUtils}>
                                <KeyboardTimePicker
                                    id="time-picker-end"
                                    minDateMessage={`Date should not be before start time`}
                                    onError={(error, value) => {
                                        setFormError(error ? true : false);
                                    }}
                                    emptyLabel=""
                                    value={endDate}
                                    minDate={startDate}
                                    onChange={value => {
                                        props.handleEndDate(new Date(value));
                                    }}
                                    InputProps={{
                                        disableUnderline: true
                                    }}
                                    InputAdornmentProps={{
                                        'aria-label': 'change start date',
                                        className: classes.dateTimeIcon
                                    }}
                                    KeyboardButtonProps={{
                                        'aria-label': 'change start date'
                                    }}
                                    keyboardIcon={<KeyboardArrowRight />}
                                />
                            </MuiPickersUtilsProvider>
                        </Grid>
                    </ListItem>
                    <ListItem divider={true}>
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
                                NOTES
                            </Typography>
                            <Typography
                                component="span"
                                variant="body2"
                                style={{ color: 'grey ' }}
                            >
                                {!note
                                    ? `Optional: Please enter a note`
                                    : `change the note of this timesheet`}
                            </Typography>
                        </Grid>
                        <Grid
                            container
                            direction="row"
                            justify="flex-end"
                            alignItems="center"
                            style={{
                                width: 48
                            }}
                        >
                            <IconButton
                                className={classes.detailButton}
                                aria-label="detail"
                                onClick={() =>
                                    props.handleShowEditViewNoteModal(true)
                                }
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
                        disabled={formError}
                    >
                        Update
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.approveButton}
                        size="large"
                        onClick={props.handleApprove}
                    >
                        Approve
                    </Button>
                </Grid>
            </React.Fragment>
        </React.Fragment>
    );
}
