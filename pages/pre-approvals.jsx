import React from 'react';
import PropTypes from 'prop-types';
import ApprovalsList from '../components/ApprovalsList';
import ApprovalsEditView from '../components/ApprovalsEditView';
import { listEntriesForPreApproval } from '../app/apiCalls/approvals';
import ApprovalsListByFilter from '../components/ApprovalsListByFilter';
import {
    PREAPPROVALS_LEVEL,
    APPROVALS_LEVEL,
    AUTHORIZATIONS_LEVEL
} from '../app/constants';

class PreApprovals extends React.Component {
    static async getInitialProps({ query }) {
        const { userId, referenceId } = query;

        const res = await listEntriesForPreApproval(userId, referenceId);

        return {
            userId,
            referenceId,
            assetTimeEntries: res.assetTimeEntries,
            options: { projects: res && res.projects },
            level: PREAPPROVALS_LEVEL
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            assetTimeEntries: [],
            defualtAssetTimeEntries: this.props.assetTimeEntries,
            options: this.props.options,
            entry: null,
            isFilterList: true
        };
    }

    async componentDidMount() {
        const filterApprovedByList = [];
        // eslint-disable-next-line array-callback-return
        this.props.assetTimeEntries.map(value => {
            if (
                this.props.level === PREAPPROVALS_LEVEL &&
                !value.preApproved.status
            )
                if (!value.rejected.status) filterApprovedByList.push(value);
            if (this.props.level === APPROVALS_LEVEL && !value.approved.status)
                if (!value.rejected.status) filterApprovedByList.push(value);
            if (
                this.props.level === AUTHORIZATIONS_LEVEL &&
                !value.authorised.status
            )
                if (!value.rejected.status) filterApprovedByList.push(value);
        });
        await this.setState({
            assetTimeEntries: filterApprovedByList
        });
    }

    async handleEditViewEntry(entry) {
        let assetEntry = null;
        if (entry) {
            assetEntry = {
                ...entry,
                ...{
                    project:
                        ((await this.props.options.projects) &&
                            this.props.options.projects.find(
                                value =>
                                    entry.project.projectId === value.projectId
                            )) ||
                        entry.project
                }
            };
        }
        await this.setState({ entry: assetEntry });
    }

    render() {
        const PreApprovalsBody = () => {
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
                        level={this.props.level}
                    />
                );
            }
            return !this.state.entry ? (
                <ApprovalsList
                    assetTimeEntries={this.state.assetTimeEntries}
                    defaultEntriesList={this.props.assetTimeEntries}
                    // eslint-disable-next-line react/jsx-no-bind
                    handleEditViewEntry={this.handleEditViewEntry.bind(this)}
                    handleShowListByFilter={async (show, updatedList) => {
                        const newList = [];
                        // eslint-disable-next-line array-callback-return
                        this.state.defualtAssetTimeEntries.map(original => {
                            const insertItem = updatedList.find(
                                item => item._id === original._id
                            );
                            if (insertItem) {
                                newList.push(insertItem);
                            } else newList.push(original);
                        });

                        await this.setState({
                            isFilterList: show,
                            assetTimeEntries: newList,
                            defualtAssetTimeEntries: newList
                        });
                    }}
                    userId={this.props.userId}
                    referenceId={this.props.referenceId}
                    level={this.props.level}
                    handleUpdateFilteredList={entries =>
                        this.setState({ assetTimeEntries: entries })
                    }
                />
            ) : (
                <ApprovalsEditView
                    entry={this.state.entry}
                    // eslint-disable-next-line react/jsx-no-bind
                    handleEditViewEntry={this.handleEditViewEntry.bind(this)}
                    options={this.state.options}
                    userId={this.props.userId}
                    referenceId={this.props.referenceId}
                    level={this.props.level}
                    assetTimeEntries={this.state.assetTimeEntries}
                    handleNewAssetEntries={async assetTimeEntries => {
                        await this.setState({ assetTimeEntries });
                    }}
                    handleNewEntry={async entry => {
                        await this.setState({ entry });
                    }}
                />
            );
        };

        return (
            <>
                <PreApprovalsBody />
            </>
        );
    }
}

PreApprovals.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    assetTimeEntries: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    options: PropTypes.object.isRequired,
    level: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    referenceId: PropTypes.string.isRequired
};

export default PreApprovals;
