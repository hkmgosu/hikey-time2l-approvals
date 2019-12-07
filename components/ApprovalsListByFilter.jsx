import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import TopAppBar from './TopAppBar';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';

import moment from 'moment';
import _ from 'lodash';

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
    const [approvalList, setApprovalList] = React.useState(
        _.orderBy(props.assetTimeEntries, ['start'], ['desc'])
    );

    const handleClick = entriesByFilter => {
        props.handleShowListByFilter(false, entriesByFilter);
    };

    const ApprovalBody = () => {
        if (!props.assetTimeEntries) {
            return (
                <div className={classes.noResult}>
                    <Typography align="center" variant="h4" color="primary">
                        NO RESULT
                    </Typography>
                </div>
            );
        }

        const filterApprovedByList = [];
        props.assetTimeEntries.map(value => {
            if (!value.preApproved) filterApprovedByList.push(value);
        });

        let group = _.groupBy(filterApprovedByList, value => value.asset._id);
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
            <React.Fragment>
                <List className={classes.root}>
                    {entriesByFilter.map((value, index) => {
                        return (
                            <ListItem
                                key={index}
                                button
                                onClick={() => handleClick(value.entries)}
                                divider={true}
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
                                        {`Asset: ${
                                            value.entries[0].asset.assetId &&
                                            value.entries[0].asset.assetId
                                                .length > 33
                                                ? value.entries[0].asset.assetId.substring(
                                                      0,
                                                      33
                                                  ) + '...'
                                                : value.entries[0].asset.assetId
                                        }`}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="body2"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {`entries: ${value.entries.length}`}
                                    </Typography>
                                </Grid>
                            </ListItem>
                        );
                    })}
                </List>
            </React.Fragment>
        );
    };

    return (
        <React.Fragment>
            <TopAppBar title="Select Asset" position="static" />
            <ApprovalBody />
        </React.Fragment>
    );
}
