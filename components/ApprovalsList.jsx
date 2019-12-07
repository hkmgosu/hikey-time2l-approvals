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
import {
    preApproveAssetEntries,
    rejectAssetEntries
} from '../app/apiCalls/approvals';

import moment from 'moment';
import _ from 'lodash';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginBottom: 120,
        paddingTop: 0
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
        top: 'auto',
        bottom: 0,
        position: 'fixed',
        height: 60,
        backgroundColor: '#fff'
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
    },
    entryAsset: {
        width: '100%',
        backgroundColor: '#b2b2ca'
    }
}));

export default function ApprovalList(props) {
    const classes = useStyles();
    const [formError, setFormError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);
    const [checked, setChecked] = React.useState([]);
    const [approvalList, setApprovalList] = React.useState(
        _.orderBy(props.assetTimeEntries, ['start'], ['desc'])
    );
    const [newEntriesList, setNewEntriesList] = React.useState(
        props.defaultEntriesList
    );

    React.useEffect(() => {
        window.scrollTo(0, 0);
        const filterApprovedByList = [];
        approvalList.map(value => {
            if (!value.preApproved) filterApprovedByList.push(value);
        });
        setApprovalList(filterApprovedByList);
    }, []);

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

    const handleApprove = async () => {
        setLoading(true);
        const res = await preApproveAssetEntries(
            props.userId,
            props.referenceId,
            checked
        );

        checked.map((entryId, index) => {
            let entry = approvalList.find(value => entryId === value._id);
            if (entry) {
                _.remove(approvalList, value => value._id === entry._id);
                _.remove(newEntriesList, value => value._id === entry._id);
                entry = {
                    ...entry,
                    ...res.data.find(value => entryId === value._id)
                };
                approvalList.push(entry);
                newEntriesList.push(entry);
            }
        });
        setLoading(false);
        const filterApprovedByList = [];
        approvalList.map(value => {
            if (!value.preApproved) filterApprovedByList.push(value);
        });
        props.handleUpdateFilteredList(filterApprovedByList);
    };

    const handleReject = async () => {
        const data = await rejectAssetEntries(
            props.userId,
            props.referenceId,
            checked
        );
    };

    const handleBackButton = () => {
        props.handleShowListByFilter(true, newEntriesList);
    };

    const ApprovalBody = () => {
        if (!approvalList) {
            return (
                <div className={classes.noResult}>
                    <Typography align="center" variant="h4" color="primary">
                        NO RESULT
                    </Typography>
                </div>
            );
        }

        return (
            <React.Fragment>
                <List className={classes.root}>
                    {approvalList.map((value, index) => {
                        const labelId = `checkbox-list-secondary-label-${index}`;
                        return (
                            <ListItem key={index} divider={true}>
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
                                            {moment(value.end).format('MMM')}
                                        </Typography>
                                        <Typography
                                            className={classes.title}
                                            variant="subtitle2"
                                            color="primary"
                                            noWrap
                                        >
                                            {moment(value.end).format('DD')}
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
                                        {`${moment(value.start).hour()}:${
                                            moment(value.start).minute() < 10
                                                ? '0' +
                                                  moment(value.start).minute()
                                                : moment(value.start).minute()
                                        } - ${moment(value.end).hour()}:${
                                            moment(value.end).minute() < 10
                                                ? '0' +
                                                  moment(value.end).minute()
                                                : moment(value.end).minute()
                                        }`}
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
                                        onChange={handleToggle(value._id)}
                                        checked={
                                            checked.indexOf(value._id) !== -1
                                        }
                                        inputProps={{
                                            'aria-labelledby': labelId
                                        }}
                                    />
                                    <IconButton
                                        className={classes.detailButton}
                                        aria-label="detail"
                                        onClick={() =>
                                            props.handleEditViewEntry(value)
                                        }
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
                    className={classes.bottomGrid}
                >
                    <Button
                        variant="contained"
                        className={classes.rejectButton}
                        size="large"
                        onClick={handleReject}
                    >
                        Reject
                    </Button>
                    <Button
                        variant="contained"
                        className={classes.approveButton}
                        size="large"
                        onClick={handleApprove}
                        disabled={loading}
                    >
                        Approve
                    </Button>
                </Grid>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <TopAppBar
                title="Select record"
                position="static"
                enableBackButton={true}
                handleBackButton={handleBackButton}
            />
            <ListItem style={{ padding: 0 }}>
                <Typography
                    align="center"
                    component="span"
                    variant="caption"
                    color="primary"
                    className={classes.entryAsset}
                >
                    {`${approvalList[0].asset.assetId}`}
                </Typography>
            </ListItem>
            <ApprovalBody />
        </React.Fragment>
    );
}
