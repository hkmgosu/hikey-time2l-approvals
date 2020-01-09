/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
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
import moment from 'moment';
import _ from 'lodash';
import TopAppBar from './TopAppBar';
import ApprovalsEditViewRejectReasonModal from './ApprovalsEditViewRejectReasonModal';
import {
    preApproveAssetEntries,
    rejectAssetEntries,
    approveAssetEntries,
    authorizeAssetEntries
} from '../app/apiCalls/approvals';
import {
    PREAPPROVALS_LEVEL,
    APPROVALS_LEVEL,
    AUTHORIZATIONS_LEVEL,
    REJECTIONS_LEVEL
} from '../app/constants';

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

export default function ApprovalsList(props) {
    const classes = useStyles();
    const [loading, setLoading] = React.useState(false);
    const [checked, setChecked] = React.useState([]);
    const [approvalList, setApprovalList] = React.useState(
        _.orderBy(props.assetTimeEntries, ['start'], ['desc'])
    );
    const [newEntriesList, setNewEntriesList] = React.useState(
        props.defaultEntriesList
    );
    const [
        showEditViewRejectReasonModal,
        setShowEditViewRejectReasonModal
    ] = React.useState(false);
    const [rejectReason, setRejectReason] = React.useState('');

    const { level, handleEditViewEntry, translations, userLanguage } = props;

    moment.locale(userLanguage);

    React.useEffect(() => {
        /* global window */
        window.scrollTo(0, 0);
        const filterApprovedByList = [];
        approvalList.forEach(value => {
            if (level === PREAPPROVALS_LEVEL && !value.preApproved.status)
                if (!value.rejected.status) filterApprovedByList.push(value);
            if (level === APPROVALS_LEVEL && !value.approved.status)
                if (!value.rejected.status) filterApprovedByList.push(value);
            if (level === AUTHORIZATIONS_LEVEL && !value.authorised.status)
                if (!value.rejected.status) filterApprovedByList.push(value);
            if (level === REJECTIONS_LEVEL && value.rejected.status)
                filterApprovedByList.push(value);
        });
        setNewEntriesList(approvalList);
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
        const req = {
            userId: props.userId,
            referenceId: props.referenceId,
            checked
        };
        let res = false;
        if ([PREAPPROVALS_LEVEL, REJECTIONS_LEVEL].includes(level)) {
            res = await preApproveAssetEntries(
                req.userId,
                req.referenceId,
                checked
            );
        }
        if (level === APPROVALS_LEVEL) {
            res = await approveAssetEntries(
                req.userId,
                req.referenceId,
                checked
            );
        }
        if (level === AUTHORIZATIONS_LEVEL) {
            res = await authorizeAssetEntries(
                req.userId,
                req.referenceId,
                checked
            );
        }

        if (!res) return;
        checked.forEach(entryId => {
            let entry = approvalList.find(value => entryId === value._id);
            if (entry) {
                _.remove(approvalList, appItem => appItem._id === entry._id);
                _.remove(newEntriesList, newItem => newItem._id === entry._id);
                entry = {
                    ...entry,
                    ...res.data.find(resItem => entryId === resItem._id)
                };
                approvalList.push(entry);
                newEntriesList.push(entry);
            }
        });

        setLoading(false);
        props.handleUpdateFilteredList(approvalList);
    };

    const handleReject = async reason => {
        setLoading(true);
        setRejectReason(reason);
        const res = await rejectAssetEntries(
            props.userId,
            props.referenceId,
            checked,
            reason
        );

        if (!res) return;

        checked.forEach(entryId => {
            let entry = approvalList.find(value => entryId === value._id);
            if (entry) {
                _.remove(approvalList, appItem => appItem._id === entry._id);
                _.remove(newEntriesList, newItem => newItem._id === entry._id);
                entry = {
                    ...entry,
                    ...res.data.find(resItem => entryId === resItem._id)
                };
                approvalList.push(entry);
                newEntriesList.push(entry);
            }
        });
        setLoading(false);
        props.handleUpdateFilteredList(approvalList);
    };

    const handleBackButton = () => {
        props.handleShowListByFilter(true, newEntriesList);
    };

    const ApprovalBody = () => {
        if (!approvalList || approvalList.length === 0) {
            return (
                <div className={classes.noResult}>
                    <Typography align="center" variant="h6" color="primary">
                        {translations.noResultsFound}
                    </Typography>
                </div>
            );
        }

        const enableRejectButtonStyle = {
            display: level === PREAPPROVALS_LEVEL ? 'none' : 'inherit'
        };

        const handleApproveButtonText = () => {
            if (loading) return translations.loading;
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
                <List className={classes.root}>
                    {approvalList.length > 0 &&
                        approvalList.map((value, index) => {
                            const key = `item-${value.asset.assetId}-${index}`;
                            return (
                                <ListItem key={key} divider button>
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
                                                {moment(value.end).format(
                                                    'MMM'
                                                )}
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
                                        onClick={() => {
                                            handleEditViewEntry(value);
                                        }}
                                    >
                                        <Typography
                                            component="span"
                                            variant="caption"
                                            className={classes.inline}
                                            color="textPrimary"
                                        >
                                            {`${moment(value.start).hour()}:${
                                                moment(value.start).minute() <
                                                10
                                                    ? `0${moment(
                                                          value.start
                                                      ).minute()}`
                                                    : moment(
                                                          value.start
                                                      ).minute()
                                            } - ${moment(value.end).hour()}:${
                                                moment(value.end).minute() < 10
                                                    ? `0${moment(
                                                          value.end
                                                      ).minute()}`
                                                    : moment(value.end).minute()
                                            }`}
                                        </Typography>
                                        {level === REJECTIONS_LEVEL && (
                                            <Typography
                                                className={classes.title}
                                                variant="subtitle2"
                                                color="error"
                                                noWrap
                                            >
                                                {translations.rejected}
                                            </Typography>
                                        )}
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
                                        style={{ width: '50%' }}
                                    >
                                        <Checkbox
                                            edge="end"
                                            color="primary"
                                            onChange={handleToggle(value._id)}
                                            checked={
                                                checked.indexOf(value._id) !==
                                                -1
                                            }
                                            inputProps={{
                                                'aria-labelledby': key
                                            }}
                                        />
                                        <IconButton
                                            className={classes.detailButton}
                                            aria-label="detail"
                                            onClick={() => {
                                                handleEditViewEntry(value);
                                            }}
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
                    {level !== REJECTIONS_LEVEL && (
                        <Button
                            variant="contained"
                            className={classes.rejectButton}
                            size="large"
                            onClick={() =>
                                setShowEditViewRejectReasonModal(true)
                            }
                            disabled={loading || checked.length === 0}
                            style={enableRejectButtonStyle}
                        >
                            {translations.reject}
                        </Button>
                    )}
                    <Button
                        variant="contained"
                        className={classes.approveButton}
                        size="large"
                        onClick={handleApprove}
                        disabled={loading || checked.length === 0}
                        style={{
                            backgroundColor:
                                level !== AUTHORIZATIONS_LEVEL
                                    ? classes.approveButton.backgroundColor
                                    : '#A3CF00'
                        }}
                    >
                        {handleApproveButtonText()}
                    </Button>
                </Grid>
                <ApprovalsEditViewRejectReasonModal
                    handleBackButton={show =>
                        setShowEditViewRejectReasonModal(show)
                    }
                    reason={rejectReason}
                    showEditViewRejectReasonModal={
                        showEditViewRejectReasonModal
                    }
                    handleRejectReason={reason => {
                        handleReject(reason);
                    }}
                    translations={translations}
                />
            </>
        );
    };

    return (
        <>
            <TopAppBar
                title={translations.selectRecord}
                position="static"
                enableBackButton
                handleBackButton={handleBackButton}
            />
            <ApprovalBody />
        </>
    );
}

ApprovalsList.propTypes = {
    assetTimeEntries: PropTypes.array.isRequired,
    defaultEntriesList: PropTypes.array.isRequired,
    level: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    referenceId: PropTypes.string.isRequired,
    handleEditViewEntry: PropTypes.func.isRequired,
    handleShowListByFilter: PropTypes.func.isRequired,
    handleUpdateFilteredList: PropTypes.func.isRequired,
    userLanguage: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired
};
