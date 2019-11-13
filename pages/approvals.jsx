import React from 'react';

class Approvals extends React.Component {
    static async getInitialProps({ query }) {
        console.log({ query });

        return {
            userId: query.userId,
            referenceId: query.referenceId
        };
    }
    render() {
        return (
            <div>
                <h1>Path parameters: </h1>
                <h2>userId: {this.props.userId} </h2>
                <h2>referenceId: {this.props.referenceId} </h2>
            </div>
        );
    }
}

export default Approvals;
