function getFormateDate(today) {
    // date formate is 25-10-2015
    const date = new Date(today);
    const day = date.getDate();
    const month = date.getMonth() + 1;
    const year = date.getFullYear();
    
    return today.toISOString().split('T')[0];
}

module.exports = getFormateDate