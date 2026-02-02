export function safeMembershipCheck(item: string, container: string[]) {
    for(const el of container) {
        if (el.toLowerCase() == item.toLowerCase()) return true
    }
    return false;
}