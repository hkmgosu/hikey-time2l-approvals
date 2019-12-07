import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import List from '@material-ui/core/List';
import ListItem from '@material-ui/core/ListItem';
import Typography from '@material-ui/core/Typography';
import Grid from '@material-ui/core/Grid';
import IconButton from '@material-ui/core/IconButton';
import TopAppBar from './TopAppBar';
import InputBase from '@material-ui/core/InputBase';
import Paper from '@material-ui/core/Paper';
import SearchIcon from '@material-ui/icons/Search';

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
    projectListItemText: {
        color: 'grey'
    }
}));

export default function ApprovalsEditViewProjectOptions(props) {
    const classes = useStyles();
    const [filteredOptions, setFilteredOptions] = React.useState(
        props.projects
    );

    const handleBackButton = () => {
        props.handleBackButton(null);
    };

    const handleSelectedProject = project => {
        props.handleSelectedProject(project);
        props.handleBackButton(null);
    };

    const handleFilteredOptions = async event => {
        const filtered = props.projects.filter(op => {
            return (
                op.projectId
                    .toLowerCase()
                    .search(event.target.value.toLowerCase()) !== -1
            );
        });
        setFilteredOptions(filtered);
    };

    return (
        <React.Fragment>
            <TopAppBar
                title={`Choose a project`}
                position="static"
                enableBackButton={true}
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
                            placeholder={`search a project...`}
                            required
                            inputProps={{ 'aria-label': 'search...' }}
                            onChange={handleFilteredOptions}
                        />
                    </Paper>
                </ListItem>
                {filteredOptions.map((option, index) => {
                    return option.crews ? (
                        option.crews.map((crew, indexCrew) => {
                            return (
                                <ListItem
                                    key={indexCrew}
                                    divider={true}
                                    button
                                    onClick={() => {
                                        handleSelectedProject(option);
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
                                            {`${option.projectId} (${option.description})`}
                                        </Typography>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={
                                                classes.projectListItemText
                                            }
                                        >
                                            {`${option.description || '-'}`}
                                        </Typography>
                                        <Typography
                                            component="span"
                                            variant="body2"
                                            className={
                                                classes.projectListItemText
                                            }
                                        >
                                            {`Team: ${crew.crewId}`}
                                        </Typography>
                                    </Grid>
                                </ListItem>
                            );
                        })
                    ) : (
                        <ListItem
                            key={index}
                            divider={true}
                            button
                            onClick={() => {
                                handleSelectedProject(option);
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
                                    {option.projectId}
                                </Typography>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.projectListItemText}
                                >
                                    {`${option.description || '-'}`}
                                </Typography>
                                <Typography
                                    component="span"
                                    variant="body2"
                                    className={classes.projectListItemText}
                                >
                                    {`Team: -`}
                                </Typography>
                            </Grid>
                        </ListItem>
                    );
                })}
            </List>
        </React.Fragment>
    );
}