export default function formatElapsedTime(ask_date_time) {
    const date_time = new Date(ask_date_time)
    const now = new Date();
    const milli = now - ask_date_time;
    const mins = Math.floor(milli / (1000 * 60));
    if (mins < 1) {
        return 'just now';
    } else if (mins === 1) {
        return '1 min ago';
    } else if (mins < 60) {
        return `${mins} mins ago`;
    } else if (mins < 1440) {
        const hours = Math.floor(mins / 60);
        return `${hours} ${hours === 1 ? 'hour' : 'hours'} ago`;
    } else {
        const options = { year: 'numeric', month: 'long', day: 'numeric' };
        return date_time.toLocaleDateString(undefined, options);
    }
}