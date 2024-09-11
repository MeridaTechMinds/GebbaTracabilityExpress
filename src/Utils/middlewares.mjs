export const loggging = (request, response, next) => {
    console.log(
        `${request.method}:: ${process.env.PROTOCAL}://${request.get('host')}/${request.url}`);
    next();
}
export const getCurrentDate = () => {
    let newDate = new Date()
    const formattedDate = newDate.toLocaleString('en-US', {
        year: 'numeric', // Full year (e.g., "2024")
        month: 'long', // Full month name (e.g., "August")
        day: 'numeric', // Day of the month (e.g., "30")
        hour: 'numeric', // Hour (e.g., "2 PM")
        minute: 'numeric', // Minute (e.g., "30")
        second: 'numeric', // Second (e.g., "45")
        hour12: true // 12-hour clock format with AM/PM
    });
    return formattedDate
}