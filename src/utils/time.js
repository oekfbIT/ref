// utils/time.js
export const getElapsedTime = (startTime) => {
    if (!startTime) return 0;

    const start = new Date(startTime);
    const now = new Date();
    const elapsedMilliseconds = now - start;

    const elapsedSeconds = Math.floor(elapsedMilliseconds / 1000);

    return elapsedSeconds;
};
