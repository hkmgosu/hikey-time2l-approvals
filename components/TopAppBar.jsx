import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import AppBar from '@material-ui/core/AppBar';
import Toolbar from '@material-ui/core/Toolbar';
import Typography from '@material-ui/core/Typography';

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
                    <Typography
                        variant="subtitle1"
                        align="center"
                        className={classes.title}
                    >
                        {props.title}
                    </Typography>
                </Toolbar>
            </AppBar>
        </div>
    );
}
