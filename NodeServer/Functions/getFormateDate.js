function getFormateDate(today) {
    return today.toISOString().split('T')[0];
}

module.exports = getFormateDate