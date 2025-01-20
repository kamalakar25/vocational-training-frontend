import React, { useState, useEffect } from 'react';

import AttendancePercentage from '../components/AttendancePercentage';

// Profile Management Component
const ProfileManagement = ({ profile, onUpdateProfile }) => {
    const [editMode, setEditMode] = useState(false);
    const [editedProfile, setEditedProfile] = useState(profile);
    const [timeError, setTimeError] = useState('');

    const handleInputChange = (e) => {
        const { name, value } = e.target;
        setEditedProfile({ ...editedProfile, [name]: value });
    };

    const handleFileChange = (e) => {
        const file = e.target.files[0];
        if (file && !file.type.startsWith('image/')) {
            alert('Please upload a valid image file.');
            return;
        }
        setEditedProfile({ ...editedProfile, profilePic: URL.createObjectURL(file) });
    };

    const handleSubjectChange = (e, index) => {
        const value = e.target.value;
        const updatedSubjects = [...editedProfile.subjects];
        updatedSubjects[index].subjectName = value;
        setEditedProfile({ ...editedProfile, subjects: updatedSubjects });
    };

    const handleTimeChange = (e, index) => {
        const value = e.target.value;
        const updatedSubjects = [...editedProfile.subjects];
        updatedSubjects[index].time = value;

        // Validate the time difference
        if (!validateTimeDifference(updatedSubjects)) {
            setTimeError('Times must be at least 1 hour apart.');
            return;
        }

        setTimeError('');
        setEditedProfile({ ...editedProfile, subjects: updatedSubjects });
    };

    const validateTimeDifference = (subjects) => {
        // Check for time conflicts
        const times = subjects.map((subject) => subject.time);
        for (let i = 0; i < times.length; i++) {
            for (let j = i + 1; j < times.length; j++) {
                const time1 = new Date(`1970-01-01T${times[i]}:00`);
                const time2 = new Date(`1970-01-01T${times[j]}:00`);
                const diff = Math.abs(time2 - time1);
                if (diff < 60 * 60 * 1000) {
                    return false;
                }
            }
        }
        return true;
    };

    const handleRemoveSubject = (index) => {
        const updatedSubjects = editedProfile.subjects.filter((_, i) => i !== index);
        setEditedProfile({ ...editedProfile, subjects: updatedSubjects });
    };

    const handleAddSubject = () => {
        const newSubject = { subjectName: '', time: '' };
        setEditedProfile({
            ...editedProfile,
            subjects: [...editedProfile.subjects, newSubject],
        });
    };

    const toggleEditMode = () => {
        setEditMode(!editMode);
        if (editMode) {
            onUpdateProfile(editedProfile); // Save changes when exiting edit mode
        }
    };

    return (
        <div style={styles.profileContainer}>
            <h3 style={styles.sectionTitle}>Profile Management</h3>
            <div style={styles.profileDetails}>
                <img
                    src={editedProfile.profilePic || '/default-profile.png'}
                    alt="Profile"
                    style={styles.profilePic}
                />
                <input type="file" onChange={handleFileChange} style={styles.fileInput} />
            </div>
            <div style={styles.formGroup}>
                <label>Name:</label>
                <input
                    type="text"
                    name="name"
                    value={editedProfile.name}
                    disabled={!editMode}
                    onChange={handleInputChange}
                    style={styles.inputField}
                />
            </div>
            <div style={styles.formGroup}>
                <label>Specialization:</label>
                <input
                    type="text"
                    name="specialization"
                    value={editedProfile.specialization}
                    disabled={!editMode}
                    onChange={handleInputChange}
                    style={styles.inputField}
                />
            </div>
            <div style={styles.formGroup}>
                <label>Subjects:</label>
                <div>
                    {editedProfile.subjects.map((subject, index) => (
                        <div key={index} style={styles.subjectRow}>
                            <input
                                type="text"
                                value={subject.subjectName}
                                onChange={(e) => handleSubjectChange(e, index)}
                                disabled={!editMode}
                                style={styles.subjectInput}
                            />
                            <input
                                type="time"
                                value={subject.time}
                                onChange={(e) => handleTimeChange(e, index)}
                                disabled={!editMode}
                                style={styles.subjectInput}
                            />
                            {editMode && (
                                <button
                                    onClick={() => handleRemoveSubject(index)}
                                    style={styles.removeButton}
                                >
                                    Remove
                                </button>
                            )}
                        </div>
                    ))}
                </div>
                {timeError && <div style={styles.error}>{timeError}</div>}
            </div>
            {editMode && (
                <div>
                  <button onClick={handleAddSubject} style={{ ...styles.addButton, marginTop: '10px', marginBottom: '10px' }}>
    Add Subject
</button>

                </div>
            )}
            <button onClick={toggleEditMode} style={styles.editButton}>
                {editMode ? 'Save Changes' : 'Edit Profile'}
            </button>
        </div>
    );
};

// Trainer Schedule for the Next Day Component
const TrainerNextDaySchedule = ({ schedule, onUpdateSchedule }) => {
    const [editedSchedule, setEditedSchedule] = useState(schedule);
    const [savedSchedule, setSavedSchedule] = useState([]);

    const handleTimeChange = (e, index) => {
        const { value } = e.target;
        const updatedSchedule = [...editedSchedule];
        updatedSchedule[index].time = value;

        // Validate the time difference
        if (!validateTimeDifference(updatedSchedule)) {
            alert('Times must be at least 1 hour apart.');
            return;
        }

        setEditedSchedule(updatedSchedule);
        onUpdateSchedule(updatedSchedule);
    };

    const validateTimeDifference = (schedule) => {
        const times = schedule.map((subject) => subject.time);
        for (let i = 0; i < times.length; i++) {
            for (let j = i + 1; j < times.length; j++) {
                const time1 = new Date(`1970-01-01T${times[i]}:00`);
                const time2 = new Date(`1970-01-01T${times[j]}:00`);
                const diff = Math.abs(time2 - time1);
                if (diff < 60 * 60 * 1000) {
                    return false;
                }
            }
        }
        return true;
    };

    const saveSchedule = () => {
        setSavedSchedule(editedSchedule);
    };

    return (
        <div style={styles.scheduleContainer}>
            <h3 style={styles.sectionTitle}>Trainer Schedule (Next Day)</h3>
            <div>
                {editedSchedule.map((subject, index) => (
                    <div key={index} style={styles.scheduleRow}>
                        <div style={styles.scheduleItem}>{subject.name}</div>
                        <div style={styles.scheduleItem}>
                            <input
                                type="time"
                                value={subject.time}
                                onChange={(e) => handleTimeChange(e, index)}
                                style={styles.timeInput}
                            />
                        </div>
                    </div>
                ))}
            </div>
            <button onClick={saveSchedule} style={styles.saveButton}>
                Save Schedule
            </button>
            {savedSchedule.length > 0 && (
                <div style={styles.savedSchedule}>
                    <h4>Saved Schedule:</h4>
                    <ul>
                        {savedSchedule.map((subject, index) => (
                            <li key={index}>
                                {subject.name}: {subject.time}
                            </li>
                        ))}
                    </ul>
                </div>
            )}
        </div>
    );
};

const SchedulePage = () => {
    const [attendance, setAttendance] = useState(85); // Example attendance value
    const [profile, setProfile] = useState({
        name: 'John Doe',
        specialization: 'IT & ITS',
        profilePic: '/default-profile.png',
        subjects: [
            { subjectName: 'IT & ITS', time: '9:00 AM' },
            { subjectName: 'Agriculture', time: '10:00 AM' },
            { subjectName: 'BFSI', time: '11:00 AM' },
            { subjectName: 'Retail', time: '12:00 PM' },
            { subjectName: 'E&H', time: '1:00 PM' },
            { subjectName: 'Automobile', time: '2:00 PM' },
            { subjectName: 'Hotel Management', time: '3:00 PM' },
        ],
    });

    const [schedule, setSchedule] = useState([
        { name: 'IT & ITS', time: '0:00 AM' },
        { name: 'Agriculture', time: '0:00 AM' },
        { name: 'BFSI', time: '0:00 AM' },
        { name: 'Retail', time: '0:00 PM' },
        { name: 'E&H', time: '0:00 PM' },
        { name: 'Automobile', time: '0:00 PM' },
        { name: 'Hotel Management', time: '0:00 PM' },
    ]);

    const handleProfileUpdate = (updatedProfile) => {
        setProfile(updatedProfile);
    };

    const handleScheduleUpdate = (updatedSchedule) => {
        setSchedule(updatedSchedule);
    };

    return (
        <div style={styles.container}>
            <ProfileManagement profile={profile} onUpdateProfile={handleProfileUpdate} />
            <TrainerNextDaySchedule schedule={schedule} onUpdateSchedule={handleScheduleUpdate} />
            <AttendancePercentage attendance={attendance} />
        </div>
    );
};

const styles = {
    container: {
        padding: '20px',
        backgroundColor: '#f4f7fb',
        borderRadius: '8px',
    },
    sectionTitle: {
        color: '#333',
        fontSize: '22px',
        marginBottom: '15px',
    },
    profileContainer: {
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        marginBottom: '20px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    profileDetails: {
        marginBottom: '15px',
        display: 'flex',
        alignItems: 'center',
    },
    profilePic: {
        width: '100px',
        height: '100px',
        borderRadius: '50%',
        marginRight: '20px',
    },
    fileInput: {
        padding: '5px',
    },
    formGroup: {
        marginBottom: '15px',
    },
    inputField: {
        width: '100%',
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #ddd',
    },
    subjectRow: {
        marginBottom: '10px',
    },
    subjectInput: {
        padding: '8px',
        marginRight: '10px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        width: '100px',
    },
    addButton: {
        backgroundColor: '#28a745',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    editButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    removeButton: {
        backgroundColor: '#dc3545',
        color: 'white',
        padding: '5px 10px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    error: {
        color: 'red',
        fontSize: '14px',
    },
    scheduleContainer: {
        padding: '20px',
        backgroundColor: '#ffffff',
        borderRadius: '10px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
    },
    scheduleRow: {
        display: 'flex',
        marginBottom: '10px',
    },
    scheduleItem: {
        flex: '1',
    },
    timeInput: {
        padding: '8px',
        borderRadius: '5px',
        border: '1px solid #ddd',
        width: '120px',
    },
    saveButton: {
        backgroundColor: '#007bff',
        color: 'white',
        padding: '10px 20px',
        borderRadius: '5px',
        cursor: 'pointer',
    },
    savedSchedule: {
        marginTop: '20px',
    },
};

export default SchedulePage;
