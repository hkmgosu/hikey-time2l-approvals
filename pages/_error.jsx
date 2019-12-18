import React from 'react';
import PropTypes from 'prop-types';

class Error extends React.Component {
    static getInitialProps({ res, err }) {
        let statusCode;

        if (res) {
            statusCode = res.statusCode;
        } else {
            statusCode = err ? err.statusCode : null;
        }

        return { statusCode };
    }

    render() {
        return (
            <p>
                {this.props.statusCode
                    ? `An error ${this.props.statusCode} occurred on server (╯°□°)╯︵ ┻━┻`
                    : 'An error occurred on client'}
            </p>
        );
    }
}

Error.propTypes = {
    statusCode: PropTypes.string
};

Error.defaultProps = {
    statusCode: null
};

export default Error;
