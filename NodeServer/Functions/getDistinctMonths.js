const getDistinctMonths = (data) => {
    const monthsSet = new Set();

    data.forEach(rent => {
        rent.fromDate.forEach(date => {
            const month = new Date(date).toLocaleString("default", { month: "short" });
            monthsSet.add(month);
        });
    });

    return Array.from(monthsSet).sort((a, b) => {
        const monthOrder = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
        return monthOrder.indexOf(a) - monthOrder.indexOf(b);
    });
};

module.exports = getDistinctMonths;