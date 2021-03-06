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
import TextField from '@material-ui/core/TextField';
import Button from '@material-ui/core/Button';
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
    }
}));

export default function ApprovalsEditViewItemsOptions(props) {
    const { translations } = props;
    const classes = useStyles();
    const [filteredOptions, setFilteredOptions] = React.useState(props.items);

    const handleBackButton = () => {
        props.handleBackButton(null);
    };

    const handleSelectedItem = () => {
        props.handleSelectedItems(filteredOptions);
        props.handleBackButton(null);
    };

    const handleFilteredOptions = async event => {
        const filtered = props.items.filter(op => {
            return (
                op &&
                op.name
                    .toLowerCase()
                    .search(event.target.value.toLowerCase()) !== -1
            );
        });
        setFilteredOptions(filtered);
    };

    const handleItemActual = async event => {
        const actualItems = [];
        // eslint-disable-next-line array-callback-return
        await filteredOptions.map(op => {
            if (op && op.name.toLowerCase() === event.target.name) {
                actualItems.push({ ...op, actual: event.target.value });
            } else actualItems.push({ ...op });
        });
        await setFilteredOptions(actualItems);
    };

    return (
        <>
            <TopAppBar
                title={translations.chooseItems}
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
                            placeholder={translations.searchItems}
                            required
                            inputProps={{ 'aria-label': translations.search }}
                            onChange={handleFilteredOptions}
                        />
                    </Paper>
                </ListItem>
                {filteredOptions.map(option => {
                    return (
                        <ListItem key={`option-${option.name}`} divider>
                            <Grid
                                container
                                direction="row"
                                justify="space-between"
                                alignItems="center"
                            >
                                <Grid
                                    container
                                    direction="column"
                                    justify="flex-start"
                                    alignItems="flex-start"
                                    style={{ width: 'auto' }}
                                >
                                    <Typography
                                        component="span"
                                        variant="h6"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {`${
                                            option.name &&
                                            option.name.length > 18
                                                ? `${option.name.substring(
                                                      0,
                                                      18
                                                  )}...`
                                                : option.name
                                        }`}
                                    </Typography>
                                    <Typography
                                        component="span"
                                        variant="caption"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {`${
                                            option.category &&
                                            option.category.length > 18
                                                ? `${option.category.substring(
                                                      0,
                                                      18
                                                  )}...`
                                                : option.category || ''
                                        }`}
                                    </Typography>
                                </Grid>
                                <Grid
                                    container
                                    direction="column"
                                    justify="center"
                                    alignItems="center"
                                    style={{ width: 'auto' }}
                                >
                                    <TextField
                                        size="small"
                                        label=""
                                        type="number"
                                        variant="outlined"
                                        name={option.name.toLowerCase()}
                                        defaultValue={option.actual}
                                        onChange={event =>
                                            handleItemActual(event)
                                        }
                                        style={{ width: 60 }}
                                    />
                                    <Typography
                                        component="span"
                                        variant="caption"
                                        className={classes.inline}
                                        color="textPrimary"
                                    >
                                        {option.unitOfMeasure}
                                    </Typography>
                                </Grid>
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
                    color="primary"
                    className={classes.updateButton}
                    size="large"
                    onClick={handleSelectedItem}
                >
                    {translations.update}
                </Button>
            </Grid>
        </>
    );
}

ApprovalsEditViewItemsOptions.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    items: PropTypes.array.isRequired,
    handleSelectedItems: PropTypes.func.isRequired,
    handleBackButton: PropTypes.func.isRequired,
    translations: PropTypes.object.isRequired
};
