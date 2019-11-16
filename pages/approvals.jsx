import React from 'react';
import ApprovalsList from '../components/ApprovalsList';
import approvals from '../app/apiCalls/approvals';

class Approvals extends React.Component {
    static async getInitialProps({ query }) {
        const { userId, referenceId } = query;

        const assetTimeEntries = await approvals(userId, referenceId);

        return { assetTimeEntries };
    }

    constructor(props) {
        super(props);

        this.state = {
            assetTimeEntries: this.props.assetTimeEntries
        };
    }

    render() {
        return (
            <React.Fragment>
                <ApprovalsList assetTimeEntries={this.state.assetTimeEntries} />
            </React.Fragment>
        );
    }
}

export default Approvals;
