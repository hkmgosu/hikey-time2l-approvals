import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import ApprovalsEditViewProjectOptions from './ApprovalsEditViewProjectOptions';
import ApprovalsEditViewTaskOptions from './ApprovalsEditViewTaskOptions';
import ApprovalsEditViewItemsOptions from './ApprovalsEditViewItemsOptions';
import ApprovalsEditViewNoteModal from './ApprovalsEditViewNoteModal';
import ApprovalsEditViewForm from './ApprovalsEditViewForm';
import {
    updateAssetEntry,
    preApproveAssetEntries
} from '../app/apiCalls/approvals';

const useStyles = makeStyles(theme => ({
    root: {
        width: '100%',
        backgroundColor: theme.palette.background.paper,
        marginBottom: 120,
        paddingTop: 0
    },
    avatar: {
        width: 60,
        height: 60,
        marginRight: 6
    },
    inline: {
        display: 'inline'
    },
    avatarText: {
        fontWeight: 600
    },
    ListItemAvatar: {
        minWidth: 39
    },
    detailButton: {
        marginLeft: 9
    },
    bottomGrid: {
        top: 'auto',
        bottom: 0,
        position: 'fixed',
        height: 60,
        backgroundColor: '#fff'
    },
    updateButton: {
        margin: 3
    },
    approveButton: {
        backgroundColor: theme.palette.warning.main,
        color: 'white',
        margin: 3
    },
    noResult: {
        marginTop: 30
    },
    projectListItemText: {
        color: 'grey'
    },
    entryAuthorAsset: {
        width: '100%',
        backgroundColor: '#b2b2ca'
    },
    entryDuration: {
        width: '100%',
        color: theme.palette.warning.main,
        minHeight: 30,
        margin: 30
    }
}));

export default function ApprovalsEditView(props) {
    const classes = useStyles();

    const [formError, setFormError] = React.useState(false);
    const [loading, setLoading] = React.useState(false);

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
    const [selectedTask, setSelectedTask] = React.useState(props.entry.task);
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
        window.scrollTo(0, 0);
    }, []);

    const handleListBackButton = () => {
        props.handleEditViewEntry(null);
    };

    const handleShowEditViewInputOptions = () => {
        // list of values to reset
        setShowEditViewProjectOptions(null);
        setShowEditViewTaskOptions(null);
        setShowEditViewItemsOptions(null);
        setShowEditViewNoteModal(null);
    };

    const handleUpdate = async () => {
        const actualItems = [];
        selectedItems.map(item => {
            delete item.active;
            if (item.actual) actualItems.push(item);
        });
        const updateData = {
            _id: props.entry._id,
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
            duration: selectedDuration
        };
        const data = await updateAssetEntry(
            props.userId,
            props.referenceId,
            props.entry._id,
            { ...props.entry, ...updateData }
        );
    };

    const handleApprove = async () => {
        const data = await preApproveAssetEntries(
            props.userId,
            props.referenceId,
            [props.entry._id]
        );
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
                {...props}
                handleBackButton={handleListBackButton}
                handleShowEditViewInputOptions={handleShowEditViewInputOptions}
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
                handleSelectedNote={note => setSelectedNote(note)}
                selectedDuration={selectedDuration}
                handleSelectedDuration={duration =>
                    setSelectedDuration(duration)
                }
                selectedNote={selectedNote}
                handleUpdate={handleUpdate}
                handleApprove={handleApprove}
            />
        );
    };

    return (
        <React.Fragment>
            <EditViewBody />
        </React.Fragment>
    );
}
