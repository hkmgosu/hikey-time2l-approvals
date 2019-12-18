/* eslint-disable react/forbid-prop-types */
import React from 'react';
import PropTypes from 'prop-types';
import ApprovalsEditViewProjectOptions from './ApprovalsEditViewProjectOptions';
import ApprovalsEditViewTaskOptions from './ApprovalsEditViewTaskOptions';
import ApprovalsEditViewItemsOptions from './ApprovalsEditViewItemsOptions';
import ApprovalsEditViewNoteModal from './ApprovalsEditViewNoteModal';
import ApprovalsEditViewForm from './ApprovalsEditViewForm';
import {
    updateAssetEntry,
    preApproveAssetEntries,
    approveAssetEntries,
    authorizeAssetEntries
} from '../app/apiCalls/approvals';
import {
    PREAPPROVALS_LEVEL,
    APPROVALS_LEVEL,
    AUTHORIZATIONS_LEVEL
} from '../app/constants';

export default function ApprovalsEditView(props) {
    const { level, entry, userId, referenceId, options } = props;

    // views
    const [
        showEditViewProjectOptions,
        setShowEditViewProjectOptions
    ] = React.useState(null);
    const [
        showEditViewTaskOptions,
        setShowEditViewTaskOptions
    ] = React.useState(null);
    const [
        showEditViewItemsOptions,
        setShowEditViewItemsOptions
    ] = React.useState(null);
    const [showEditViewNoteModal, setShowEditViewNoteModal] = React.useState(
        null
    );

    // data
    const [selectedProject, setSelectedProject] = React.useState(
        props.entry.project
    );
    const [selectedTask, setSelectedTask] = React.useState(
        props.entry.task || ''
    );
    const [selectedItems, setSelectedItems] = React.useState(props.entry.items);
    const [selectedStartDate, setSelectedStartDate] = React.useState(
        new Date(props.entry.start)
    );
    const [selectedEndDate, setSelectedEndDate] = React.useState(
        new Date(props.entry.end)
    );
    const [selectedNote, setSelectedNote] = React.useState(props.entry.note);
    const [selectedDuration, setSelectedDuration] = React.useState(
        props.entry.duration
    );

    React.useEffect(() => {
        /* global window */
        window.scrollTo(0, 0);
    });

    const handleListBackButton = () => {
        props.handleEditViewEntry(null);
    };

    const handleUpdate = async () => {
        const actualItems = [];
        selectedItems.map(item => {
            const tempItem = { ...item };
            delete tempItem.active;
            return actualItems.push(tempItem);
        });
        const updateData = {
            _id: entry._id,
            project: {
                projectId: selectedProject.projectId,
                description: selectedProject.description,
                _id: selectedProject._id
            },
            task: selectedTask,
            start: selectedStartDate,
            end: selectedEndDate,
            note: selectedNote,
            items: actualItems,
            duration: selectedDuration,
            rejected: { status: false }
        };

        const res = await updateAssetEntry(userId, referenceId, entry._id, {
            ...entry,
            ...updateData
        });

        const newEntries = [{ ...res.data }];
        await props.assetTimeEntries.map(value => {
            return value._id !== entry._id && newEntries.push(value);
        });

        await props.handleNewEntry({ ...entry, ...res.data });
        await props.handleNewAssetEntries(newEntries);
    };

    const handleApprove = async () => {
        const req = {
            userId,
            referenceId,
            data: [entry._id]
        };
        let res = false;
        if (level === PREAPPROVALS_LEVEL)
            res = await preApproveAssetEntries(
                req.userId,
                req.referenceId,
                req.data
            );
        if (level === APPROVALS_LEVEL)
            res = await approveAssetEntries(
                req.userId,
                req.referenceId,
                req.data
            );
        if (level === AUTHORIZATIONS_LEVEL)
            res = await authorizeAssetEntries(
                req.userId,
                req.referenceId,
                req.data
            );

        if (!res) return;
        const newEntries = [{ ...res.data[0] }];
        await props.assetTimeEntries.map(value => {
            return value._id !== entry._id && newEntries.push(value);
        });
        await props.handleNewAssetEntries(newEntries);
        await props.handleEditViewEntry(null);
    };

    const EditViewBody = () => {
        // cases
        if (showEditViewProjectOptions) {
            return (
                <ApprovalsEditViewProjectOptions
                    handleBackButton={show =>
                        setShowEditViewProjectOptions(show)
                    }
                    projects={props.options.projects}
                    handleSelectedProject={project => {
                        setSelectedProject(project);
                        setSelectedTask(project.tasks[0]);
                        setSelectedItems(project.items);
                    }}
                />
            );
        }

        if (showEditViewTaskOptions) {
            return (
                <ApprovalsEditViewTaskOptions
                    handleBackButton={show => setShowEditViewTaskOptions(show)}
                    tasks={selectedProject.tasks ? selectedProject.tasks : []}
                    handleSelectedTask={task => setSelectedTask(task)}
                />
            );
        }

        if (showEditViewItemsOptions) {
            return (
                <ApprovalsEditViewItemsOptions
                    handleBackButton={show => setShowEditViewItemsOptions(show)}
                    items={selectedItems}
                    handleSelectedItems={items => setSelectedItems(items)}
                />
            );
        }

        if (showEditViewNoteModal) {
            return (
                <ApprovalsEditViewNoteModal
                    handleBackButton={show => setShowEditViewNoteModal(show)}
                    note={selectedNote}
                    showEditViewNoteModal={showEditViewNoteModal}
                    handleSelectedNote={note => setSelectedNote(note)}
                />
            );
        }

        return (
            <ApprovalsEditViewForm
                entry={entry}
                options={options}
                handleBackButton={handleListBackButton}
                handleShowEditViewInputOptions={show =>
                    setShowEditViewItemsOptions(show)
                }
                handleShowEditViewProjectOptions={show =>
                    setShowEditViewProjectOptions(show)
                }
                handleShowEditViewTaskOptions={show =>
                    setShowEditViewTaskOptions(show)
                }
                handleShowEditViewItemsOptions={show =>
                    setShowEditViewItemsOptions(show)
                }
                selectedProject={selectedProject}
                selectedTask={selectedTask}
                selectedItems={selectedItems}
                handleSelectedItems={items => setSelectedItems(items)}
                handleStartDate={date => setSelectedStartDate(date)}
                selectedStartDate={selectedStartDate}
                handleEndDate={date => setSelectedEndDate(date)}
                selectedEndDate={selectedEndDate}
                handleShowEditViewNoteModal={show =>
                    setShowEditViewNoteModal(show)
                }
                selectedDuration={selectedDuration}
                handleSelectedDuration={duration =>
                    setSelectedDuration(duration)
                }
                selectedNote={selectedNote}
                handleUpdate={handleUpdate}
                handleApprove={handleApprove}
                level={level}
            />
        );
    };

    return (
        <>
            <EditViewBody />
        </>
    );
}

ApprovalsEditView.propTypes = {
    userId: PropTypes.string.isRequired,
    referenceId: PropTypes.string.isRequired,
    level: PropTypes.string.isRequired,
    entry: PropTypes.object.isRequired,
    assetTimeEntries: PropTypes.array.isRequired,
    options: PropTypes.object.isRequired,
    handleEditViewEntry: PropTypes.func.isRequired,
    handleNewEntry: PropTypes.func.isRequired,
    handleNewAssetEntries: PropTypes.func.isRequired
};
