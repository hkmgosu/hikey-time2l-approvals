import { createMuiTheme } from '@material-ui/core/styles';

// Create a theme instance.
export default createMuiTheme({
    palette: {
        primary: {
            main: '#00004d'
        },
        secondary: {
            main: '#19857b'
        },
        error: {
            main: '#f23200'
        },
        warning: {
            main: '#ff9000'
        },
        background: {
            default: '#fff'
        }
    }
});
