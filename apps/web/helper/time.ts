import { formatDistanceToNow } from "date-fns";

export function timeAgo(timestamp: Date) {
    if(timestamp) {
        return formatDistanceToNow(new Date(timestamp), { addSuffix: true });
    } else {
        return null
    }
}

