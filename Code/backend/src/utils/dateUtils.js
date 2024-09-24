const { format } = require('date-fns');

exports.formatToWeekdayDayMonthYearHrMin = (date) => {
    const formattedDate = format(new Date(date), "E, dd MMM yyyy hh:mm a");
    return formattedDate;
}

exports.formatToYYYYMMdd = (date) => {
    return format(date, 'yyyy-MM-dd');;
}