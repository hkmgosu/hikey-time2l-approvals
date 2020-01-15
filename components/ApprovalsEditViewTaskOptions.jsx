/* eslint-disable react/no-unused-prop-types */
/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';
import TopAppBar from './TopAppBar';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginBottom: 120,
        paddingTop: 0
    },
    inline: {
        display: 'inline'
    },
    searchItem: {
        padding: 6,
        backgroundColor: '#dedede'
    },
    searchPaper: {
        padding: '2px 4px',
        display: 'flex',
        alignItems: 'center',
        width: '100%'
    },
    searchInput: {
        marginLeft: 3
    },
    taskListItemText: {
        color: 'grey'
    }
}));

export default function ApprovalsEditViewTaskOptions(props) {
    const classes = useStyles();
    const { tasks, translations } = props;
    const [filteredOptions, setFilteredOptions] = React.useState(tasks);

    const handleBackButton = () => {
        props.handleBackButton(null);
    };

    const handleSelectedTask = task => {
        props.handleSelectedTask(task);
        props.handleBackButton(null);
    };

    const handleFilteredOptions = async event => {
        const filtered = tasks.filter(op => {
            return (
                op.id.toLowerCase().search(event.target.value.toLowerCase()) !==
                -1
            );
        });
        setFilteredOptions(filtered);
    };

    return (
        <>
            <TopAppBar
                title={translations.chooseTask}
                position="static"
                enableBackButton
                handleBackButton={handleBackButton}
            />
            <List className={classes.root}>
                <ListItem className={classes.searchItem}>
                    <Paper component="form" className={classes.searchPaper}>
                        <SearchIcon style={{ color: '#aaa' }} />
                        <InputBase
                            autoFocus
                            autoComplete="true"
                            fullWidth
                            className={classes.searchInput}
                            placeholder={`${translations.searchTask} ...`}
                            required
                            inputProps={{ 'aria-label': translations.search }}
                            onChange={handleFilteredOptions}
                        />
                    </Paper>
                </ListItem>
                {filteredOptions.map(option => {
                    return (
                        <ListItem
                            key={`option-${option.id}`}
                            divider
                            button
                            onClick={() => {
                                handleSelectedTask(option);
                            }}
                        >
                            <Grid
                                container
                                direction="column"
                                justify="space-around"
                                alignItems="flex-start"
                                spacing={0}
                            >
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.inline}
                                    color="textPrimary"
                                >
                                    {option.id}
                                </Typography>
                            </Grid>
                        </ListItem>
                    );
                })}
            </List>
        </>
    );
}

ApprovalsEditViewTaskOptions.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    tasks: PropTypes.array.isRequired,
    handleBackButton: PropTypes.func.isRequired,
    handleSelectedTask: PropTypes.func.isRequired,
    translations: PropTypes.object.isRequired
};
