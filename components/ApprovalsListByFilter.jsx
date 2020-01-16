/* eslint-disable react/forbid-prop-types */
/* eslint-disable react/no-unused-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import _ from 'lodash';
import TopAppBar from './TopAppBar';
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
    inline: {
        display: 'inline',
        height: 30
    },
    noResult: {
        marginTop: 30
    }
}));

export default function ApprovalsListByFilter(props) {
    const classes = useStyles();
    const { level, assetTimeEntries, loading, translations } = props;

    const handleClick = entriesByFilter => {
        props.handleShowListByFilter(false, entriesByFilter);
    };

    const ApprovalBody = () => {
        if (loading) {
            return (
                <div className={classes.noResult}>
                    <Typography align="center" variant="h6" color="primary">
                        {`${translations.loading} ...`}
                    </Typography>
                </div>
            );
        }
        const filterApprovedByList = [];
        // eslint-disable-next-line array-callback-return
        assetTimeEntries.map(value => {
            if (level === PREAPPROVALS_LEVEL && !value.preApproved.status) {
                if (!value.rejected.status) {
                    filterApprovedByList.push(value);
                }
            }
            if (level === APPROVALS_LEVEL && !value.approved.status) {
                if (!value.rejected.status) {
                    filterApprovedByList.push(value);
                }
            }
            if (level === AUTHORIZATIONS_LEVEL && !value.authorised.status) {
                if (!value.rejected.status) {
                    filterApprovedByList.push(value);
                }
            }
            if (level === REJECTIONS_LEVEL && value.rejected.status) {
                filterApprovedByList.push(value);
            }
        });

        if (filterApprovedByList.length === 0) {
            return (
                <div className={classes.noResult}>
                    <Typography align="center" variant="h6" color="primary">
                        {translations.noResultsFound}
                    </Typography>
                </div>
            );
        }

        const group = _.groupBy(filterApprovedByList, value => value.asset._id);
        let entriesByFilter = [];
        _.mapValues(group, (value, key) =>
            entriesByFilter.push({ _id: key, entries: value })
        );

        entriesByFilter = _.orderBy(
            entriesByFilter,
            ['entries[0].asset.assetId'],
            ['asc']
        );

        return (
            <>
                <List className={classes.root}>
                    {entriesByFilter.map(value => {
                        return (
                            <ListItem
                                key={`item-${value.entries[0].asset.assetId}`}
                                button
                                onClick={() => handleClick(value.entries)}
                                divider
                            >
                                <Grid
                                    container
                                    direction="column"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                >
                                    <Typography
                                        component="span"
                                        variant="h6"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {`${translations.asset}: ${
                                            value.entries.length > 0 &&
                                            value.entries[0].asset.assetId &&
                                            value.entries[0].asset.assetId
                                                .length > 33
                                                ? `${value.entries[0].asset.assetId.substring(
                                                      0,
                                                      33
                                                  )}...`
                                                : value.entries[0].asset.assetId
                                        }`}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {`${translations.entries}: ${value.entries.length}`}
                                    </Typography>
                                </Grid>
                            </ListItem>
                        );
                    })}
                </List>
            </>
        );
    };

    return (
        <>
            <TopAppBar
                title={props.translations.selectAsset}
                position="static"
                enableBackButton={false}
                handleBackButton={() => {}}
            />
            <ApprovalBody />
        </>
    );
}

ApprovalsListByFilter.propTypes = {
    assetTimeEntries: PropTypes.array.isRequired,
    level: PropTypes.string.isRequired,
    handleShowListByFilter: PropTypes.func.isRequired,
    loading: PropTypes.bool.isRequired,
    userLanguage: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired
};
