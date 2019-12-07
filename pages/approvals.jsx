import React from 'react';
import ApprovalsList from '../components/ApprovalsList';
import ApprovalsEditView from '../components/ApprovalsEditView';
import { listAllAssetEntries } from '../app/apiCalls/approvals';
import ApprovalsListByFilter from '../components/ApprovalsListByFilter';

class Approvals extends React.Component {
    static async getInitialProps({ query }) {
        const { userId, referenceId } = query;

        const data = await listAllAssetEntries(userId, referenceId);

        return {
            userId,
            referenceId,
            assetTimeEntries: data.assetTimeEntries,
            options: { projects: data.projects }
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            assetTimeEntries: this.props.assetTimeEntries,
            options: this.props.options,
            entry: null,
            isFilterList: true
        };
    }

    componentDidMount() {
        window.scrollTo(0, 0);
        const filterApprovedByList = [];
        this.props.assetTimeEntries.map(value => {
            if (!value.preApproved) filterApprovedByList.push(value);
        });
        this.setState({ assetTimeEntries: filterApprovedByList });
    }

    handleEditViewEntry = async entry => {
        const assetEntry = entry && {
            ...entry,
            ...{
                project:
                    (await this.props.options.projects.find(
                        value => entry.project.projectId === value.projectId
                    )) || entry.project
            }
        };
        await this.setState({ entry: assetEntry });
    };

    render() {
        const ApprovalsBody = () => {
            if (this.state.isFilterList) {
                return (
                    <ApprovalsListByFilter
                        assetTimeEntries={this.state.assetTimeEntries}
                        handleShowListByFilter={async (
                            show,
                            entriesByFilter
                        ) => {
                            await this.setState({
                                isFilterList: show,
                                assetTimeEntries: [...entriesByFilter]
                            });
                        }}
                        userId={this.props.userId}
                        referenceId={this.props.referenceId}
                    />
                );
            } else {
                return !this.state.entry ? (
                    <ApprovalsList
                        assetTimeEntries={this.state.assetTimeEntries}
                        defaultEntriesList={this.props.assetTimeEntries}
                        handleEditViewEntry={this.handleEditViewEntry}
                        handleShowListByFilter={(show, updatedList) => {
                            const filterApprovedByList = [];
                            updatedList.map(value => {
                                if (!value.preApproved)
                                    filterApprovedByList.push(value);
                            });
                            this.setState({
                                isFilterList: show,
                                assetTimeEntries: filterApprovedByList
                            });
                        }}
                        userId={this.props.userId}
                        referenceId={this.props.referenceId}
                        handleUpdateFilteredList={entries =>
                            this.setState({ assetTimeEntries: entries })
                        }
                    />
                ) : (
                    <ApprovalsEditView
                        entry={this.state.entry}
                        handleEditViewEntry={this.handleEditViewEntry}
                        options={this.state.options}
                        userId={this.props.userId}
                        referenceId={this.props.referenceId}
                    />
                );
            }
        };

        return (
            <React.Fragment>
                <ApprovalsBody />
            </React.Fragment>
        );
    }
}

export default Approvals;
