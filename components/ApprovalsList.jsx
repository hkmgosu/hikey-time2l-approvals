import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import ListItemAvatar from '@material-ui/core/ListItemAvatar';
import Typography from '@material-ui/core/Typography';
import Checkbox from '@material-ui/core/Checkbox';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowRight from '@material-ui/icons/KeyboardArrowRight';
import Button from '@material-ui/core/Button';
import TopAppBar from '../components/TopAppBar';

import moment from 'moment';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginBottom: 120
    },
    avatar: {
        fontSize: 'small',
        textAlign: 'center',
        color: 'black'
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
        position: 'fixed',
        top: 'auto',
        bottom: 30
    },
    rejectButton: {
        backgroundColor: theme.palette.error.main,
        color: 'white',
        margin: 3
    },
    approveButton: {
        backgroundColor: theme.palette.warning.main,
        color: 'white',
        margin: 3
    },
    noResult: {
        marginTop: 30
    }
}));

export default function ApprovalList(props) {
    const classes = useStyles();
    const [checked, setChecked] = React.useState([1]);

    const handleToggle = value => () => {
        const currentIndex = checked.indexOf(value);
        const newChecked = [...checked];

        if (currentIndex === -1) {
            newChecked.push(value);
        } else {
            newChecked.splice(currentIndex, 1);
        }

        setChecked(newChecked);
    };

    const ApprovalBody = () => {
        if (!props.assetTimeEntries) {
            return (
                <div className={classes.noResult}>
                    <Typography align="center" variant="h2" color="primary">
                        NO RESULT
                    </Typography>
                </div>
            );
        }

        return (
            <React.Fragment>
                <List className={classes.root}>
                    {props.assetTimeEntries.map((value, index) => {
                        const labelId = `checkbox-list-secondary-label-${index}`;
                        return (
                            <ListItem key={index}>
                                <ListItemAvatar
                                    className={classes.ListItemAvatar}
                                >
                                    <span>
                                        <Typography
                                            className={classes.title}
                                            variant="caption"
                                            color="primary"
                                            noWrap
                                        >
                                            {moment(
                                                value.created.datetime
                                            ).format('MMM')}
                                        </Typography>
                                        <Typography
                                            className={classes.title}
                                            variant="subtitle2"
                                            color="primary"
                                            noWrap
                                        >
                                            {moment(
                                                value.created.datetime
                                            ).format('DD')}
                                        </Typography>
                                    </span>
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
                                        variant="caption"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {`${moment(
                                            value.start
                                        ).hour()}:${moment(
                                            value.start
                                        ).minute()} - ${moment(
                                            value.end
                                        ).hour()}:${moment(
                                            value.end
                                        ).minute()}`}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {value.project.projectId}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {`${value.asset.assetId} (${value.asset.type})`}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {value.duration}
                                    </Typography>
                                </Grid>
                                <Grid
                                    container
                                    direction="row"
                                    justify="flex-end"
                                    alignItems="center"
                                    spacing={3}
                                >
                                    <Checkbox
                                        edge="end"
                                        color="primary"
                                        onChange={handleToggle(value)}
                                        checked={checked.indexOf(value) !== -1}
                                        inputProps={{
                                            'aria-labelledby': labelId
                                        }}
                                    />
                                    <IconButton
                                        className={classes.detailButton}
                                        aria-label="detail"
                                    >
                                        <KeyboardArrowRight />
                                    </IconButton>
                                </Grid>
                            </ListItem>
                        );
                    })}
                </List>
                <Grid
                    container
                    direction="row"
                    justify="center"
                    alignItems="center"
                    spacing={3}
                    className={classes.bottomGrid}
                >
                    <Button
                        variant="contained"
                        className={classes.rejectButton}
                        size="large"
                    >
                        Reject
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.approveButton}
                        size="large"
                    >
                        Approve
                    </Button>
                </Grid>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <TopAppBar title="Select record" position="static" />
            <ApprovalBody />
        </React.Fragment>
    );
}
