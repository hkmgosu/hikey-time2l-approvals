import React from 'react';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';
import IconButton from '@material-ui/core/IconButton';
import KeyboardArrowLeft from '@material-ui/icons/KeyboardArrowLeft';

const useStyles = makeStyles(theme => ({
    root: {
        flexGrow: 1
    },
    menuButton: {
        marginRight: theme.spacing(2)
    },
    title: {
        flexGrow: 1
    }
}));

export default function TopAppBar(props) {
    const classes = useStyles();

    return (
        <div className={classes.root}>
            <AppBar position={props.position}>
                <Toolbar>
                    {props.enableBackButton && (
                        <IconButton
                            edge="start"
                            className={classes.menuButton}
                            color="inherit"
                            aria-label="menu"
                            onClick={() => props.handleBackButton(null)}
                        >
                            <KeyboardArrowLeft />
                        </IconButton>
                    )}
                    <Typography
                        variant="subtitle1"
                        align="center"
                        className={classes.title}
                        style={{
                            marginLeft: props.enableBackButton
                                ? '-45px'
                                : 'inherit'
                        }}
                    >
                        {props.title}
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}

TopAppBar.propTypes = {
    position: PropTypes.string.isRequired,
    enableBackButton: PropTypes.bool.isRequired,
    handleBackButton: PropTypes.func.isRequired,
    title: PropTypes.string.isRequired
};
