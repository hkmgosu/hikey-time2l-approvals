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
        return <h1>Post page: {this.props.referenceId}</h1>;
    }
}

export default Approvals;
