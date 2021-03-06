/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import ApprovalsList from '../components/ApprovalsList';
import ApprovalsEditView from '../components/ApprovalsEditView';
import { listEntriesForReSubmit } from '../app/apiCalls/approvals';
import ApprovalsListByFilter from '../components/ApprovalsListByFilter';
import { REJECTIONS_LEVEL } from '../app/constants';

class Rejections extends React.Component {
    static async getInitialProps({ query }) {
        const { userId, referenceId } = query;

        const res = await listEntriesForReSubmit(userId, referenceId);

        return {
            userId,
            referenceId,
            assetTimeEntries: res.assetTimeEntries,
            options: { projects: res && res.projects },
            userLanguage: res.user.profile.language,
            translations: res.lang,
            level: REJECTIONS_LEVEL
        };
    }

    constructor(props) {
        super(props);

        this.state = {
            assetTimeEntries: [],
            defaultAssetTimeEntries: this.props.assetTimeEntries,
            options: this.props.options,
            userLanguage: this.props.userLanguage,
            translations: this.props.translations,
            entry: null,
            isFilterList: true,
            loading: true
        };
    }

    async componentDidMount() {
        const filterApprovedByList = [];
        await this.props.assetTimeEntries.forEach(value => {
            if (value.rejected.status) filterApprovedByList.push(value);
        });
        await this.setState({
            assetTimeEntries: filterApprovedByList,
            loading: false
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
        const RejectionsBody = () => {
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
                        loading={this.state.loading}
                        setLoading={loading => this.setState({ loading })}
                        translations={this.state.translations}
                        userLanguage={this.state.userLanguage}
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
                        this.state.defaultAssetTimeEntries.map(original => {
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
                            defaultAssetTimeEntries: newList
                        });
                    }}
                    userId={this.props.userId}
                    referenceId={this.props.referenceId}
                    level={this.props.level}
                    handleUpdateFilteredList={entries =>
                        this.setState({ assetTimeEntries: entries })
                    }
                    translations={this.state.translations}
                    userLanguage={this.state.userLanguage}
                />
            ) : (
                <ApprovalsEditView
                    translations={this.state.translations}
                    userLanguage={this.state.userLanguage}
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
                        let assetEntry = null;
                        if (entry) {
                            assetEntry = {
                                ...entry,
                                ...{
                                    project:
                                        ((await this.props.options.projects) &&
                                            this.props.options.projects.find(
                                                value =>
                                                    entry.project.projectId ===
                                                    value.projectId
                                            )) ||
                                        entry.project
                                }
                            };
                        }
                        await this.setState({ entry: assetEntry });
                    }}
                    loading={this.state.loading}
                    setLoading={loading => this.setState({ loading })}
                />
            );
        };

        return (
            <>
                <RejectionsBody />
            </>
        );
    }
}

Rejections.propTypes = {
    // eslint-disable-next-line react/forbid-prop-types
    assetTimeEntries: PropTypes.array.isRequired,
    // eslint-disable-next-line react/forbid-prop-types
    options: PropTypes.object.isRequired,
    level: PropTypes.string.isRequired,
    userId: PropTypes.string.isRequired,
    referenceId: PropTypes.string.isRequired,
    userLanguage: PropTypes.string.isRequired,
    translations: PropTypes.object.isRequired
};

export default Rejections;
