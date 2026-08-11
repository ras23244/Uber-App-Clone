const VALID_TRANSITIONS = {
    pending: ['accepted', 'cancelled'],
    accepted: ['ongoing', 'cancelled'],
    ongoing: ['completed'],
    completed: [],
    cancelled: []
};

module.exports.canTransition = (currentStatus, newStatus) => {
    if (!VALID_TRANSITIONS[currentStatus]) {
        return false;
    }
    return VALID_TRANSITIONS[currentStatus].includes(newStatus);
};

module.exports.VALID_TRANSITIONS = VALID_TRANSITIONS;
