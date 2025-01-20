import React, { useState } from 'react';

const ScheduleDropdown = ({ onTimeSelect }) => {
    const [selectedTime, setSelectedTime] = useState('');

    const handleChange = (event) => {
        setSelectedTime(event.target.value);
        onTimeSelect(event.target.value);
    };

    const generateTimeSlots = () => {
        const times = [];
        let hour = 8; // Start time (e.g., 8 AM)
        while (hour <= 17) { // End time (e.g., 5 PM)
            times.push(`${hour}:00`);
            hour++;
        }
        return times;
    };

    return (
        <div>
            <label htmlFor="timeSlot">Select Time: </label>
            <select id="timeSlot" value={selectedTime} onChange={handleChange}>
                {generateTimeSlots().map((time) => (
                    <option key={time} value={time}>
                        {time}
                    </option>
                ))}
            </select>
        </div>
    );
};

export default ScheduleDropdown;
