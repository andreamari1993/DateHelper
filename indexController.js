$(document).ready(function () {
    let date = new Date();

    //https://www.jqueryscript.net/time-clock/Clean-jQuery-Date-Time-Picker-Plugin-datetimepicker.html
    $('#date_start').datetimepicker({
        // options here
    });

    $('#date_end').datetimepicker({
        // options here
    });

    $('#epoch').datetimepicker({
        // options here
    });

    $('#footer-copyright').html('Andrea Marinoni - Copyright © ' + date.getFullYear() + ' Tutti i diritti sono riservati');

});

function padTo2Digits(num) {
    return num.toString().padStart(2, '0');
}

function formatDate(date) {
    return (
        [
            date.getFullYear(),
            padTo2Digits(date.getMonth() + 1),
            padTo2Digits(date.getDate()),
        ].join('/') +
        ' ' +
        [
            padTo2Digits(date.getHours()),
            padTo2Digits(date.getMinutes()),
            padTo2Digits(date.getSeconds()),
        ].join(':')
    );
}

function clearDiff() {
    $('#date_start').val('');
    $('#date_end').val('');

    $("#missing_days").html('');
    $("#not_working_days").html('');
    $("#working_days").html('');
    $("#missing_seconds").html('');
    $("#missing_hours").html('');
}

function setToday() {
    let date = new Date();
    $('#date_start').val(formatDate(date));
    $('#date_end').val(formatDate(date));
}

function isValidField(value) {
    if (value === '' || value === null || value === undefined) {
        return false;
    }
    return true;
}

function raiseValidationError(fieldName) {
    alert('The field with name \'' + fieldName + '\' is required!');
}

function containsOnlyNumbers(str) {
    //return /^[0-9]+$/.test(str);
}

function calculateDiff() {
    let fromStr = $('#date_start').val();
    if (!isValidField(fromStr)) {
        raiseValidationError('From');
        return;
    }

    let toStr = $('#date_end').val();
    if (!isValidField(toStr)) {
        raiseValidationError('To');
        return;
    }

    let from = new Date(fromStr);
    let to = new Date(toStr);

    if (to < from) {
        alert('The end date can\'t be lower than start date!');
        return;
    }

    const diffTime = Math.abs(to - from);

    console.log(diffTime / 1000); //time in seconds
    console.log((diffTime / 1000) / 3600); //time in hours

    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    let not_working_days = get_not_working_days_count(from, to);
    let working_days = get_working_days_count(from, to);
    let missingSeconds = diffTime / 1000;
    let missingHours = (diffTime / 1000) / 3600;

    $("#missing_days").html('Missing days: ' + diffDays);
    $("#not_working_days").html('Non working days: ' + not_working_days);
    $("#working_days").html('Working days: ' + working_days);
    $("#missing_seconds").html('Working seconds: ' + missingSeconds);
    $("#missing_hours").html('Missing hours: ' + missingHours);
}


/* Start epoch region*/

function setEpochToday() {
    let date = new Date();

    $('#epoch').val(formatDate(date));
}

function calculateEpoch() {
    let epochStr = $("#epoch").val();
    if (!isValidField(epochStr)) {
        raiseValidationError('Date');
        return;
    }

    let epochDate = new Date(epochStr);
    let epochs = getEpochs(epochDate);

    console.log(epochDate);
    console.log(epochs);

    $("#epoch_result").html('Epochs:' + epochs);
}

function clearDateToEpoch() {
    $("#epoch").val('');
    $("#epoch_result").html('');
}

/* End epoch region*/


/* Start epoch to date region*/

function setEpochDateToday() {
    let now = new Date();
    let today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    $("#epoch_date").val(getEpochs(today));
}

function setEpochDateNow() {
    let date = new Date();
    $("#epoch_date").val(getEpochs(date));
}

function calculateEpochToDate() {
    let epoch = $("#epoch_date").val();
    if (!isValidField(epoch)) {
        raiseValidationError('Epochs');
        return;
    }
    // The 0 there is the key, which sets the date to the epoch
    var date = new Date(0);
    date.setUTCSeconds(epoch);
    console.log(date);

    $('#epoch_to_date_result').html(formatDate(date));
}

function clearEpochToDate() {
    $("#epoch_date").val('');
    $("#epoch_to_date_result").html('');
}
/* End epoch to date region*/

function getEpochs(date) {
    return parseInt(date.getTime() / 1000);
}

function get_not_working_days_count(startDate, endDate) {
    let nonBusinessDays = 0;
    let currentDate = new Date(startDate.getTime());
    while (currentDate < endDate) {
        if (currentDate.getDay() == 0 || currentDate.getDay() == 6) nonBusinessDays += 1;
        currentDate = addDays(currentDate, 1);
    }
    console.log('nonBusinessDays:' + nonBusinessDays);
    return nonBusinessDays;
}

function get_working_days_count(startDate, endDate) {

    var result = 0;
    let currentDate = new Date(startDate.getTime());
    while (currentDate <= endDate) {
        const dayOfWeek = currentDate.getDay();
        if (dayOfWeek !== 0 && dayOfWeek !== 6) result++;
        currentDate.setDate(currentDate.getDate() + 1);
    }
    console.log('businessDays:' + result);
    return result;
}

function addDays(date, days) {
    date.setDate(date.getDate() + days);
    return date;
}