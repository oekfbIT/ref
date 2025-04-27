// utils/time.js
export const getElapsedTime = (startTime) => {
    if (!startTime) return 0;

    // Ensure startTime is treated as local time
    const [datePart, timePart] = startTime.split('T');
    const [year, month, day] = datePart.split('-');
    const [hour = 0, minute = 0, second = 0] = timePart?.split(':') || [];

    const start = new Date(
        parseInt(year),
        parseInt(month) - 1,
        parseInt(day),
        parseInt(hour),
        parseInt(minute),
        parseInt(second)
    );

    const now = new Date(); // local time
    const elapsedMilliseconds = now - start;
    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);

    return elapsedSeconds;
};
