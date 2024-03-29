// ========== Language ===========
// Day, Month
var wordMonth = new Array("January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December");
var wordDay_sun = "Sunday";
var wordDay_mon = "Monday";
var wordDay_tue = "Tuesday";
var wordDay_wed = "Wednesday";
var wordDay_thu = "Thursday";
var wordDay_fri = "Friday";
var wordDay_sat = "Saturday";
// ===============================

// Global Variable
var tiva_timetables = [];
var tiva_current_date = new Date();
var tiva_current_month = tiva_current_date.getMonth() + 1;
var tiva_current_year = tiva_current_date.getFullYear();


// 24 hour fix
function timeTo12HrFormat(time) {
    var time_part_array = time.split(":");
    var ampm = 'AM';

    if (time_part_array[0] >= 12) {
        ampm = 'PM';
    }

    if (time_part_array[0] > 12) {
        time_part_array[0] = time_part_array[0] - 12;
    }

    formatted_time = time_part_array[0] + ':' + time_part_array[1] + ' ' + ampm;

    return formatted_time;
}

function sortByTime(a,b) {
	if (a.start_time < b.start_time) {
		return -1;
	} else if (a.start_time > b.start_time) {
		return 1;
	} else {
		return 0;
	}
}

function sortByEndTime(a,b) {
	if (a.end_time < b.end_time) {
		return -1;
	} else if (a.end_time > b.end_time) {
		return 1;
	} else {
		return 0;
	}
}

function getMinTime(timetables) {
	for (var i = 0; i < timetables.length; i++) {
		if (timetables[i].start_time) {
			return parseInt(timetables[i].start_time, 10);
		}
	}
}

function getMaxTime(timetables) {
	timetables.sort(sortByEndTime);
	for (var i = timetables.length-1; i >= 0; i--) {
		if (timetables[i].end_time) {
			var time = timetables[i].end_time.split(':');
			if (time[1] == '00') {
				return time[0];
			} else {
				return parseInt(time[0], 10) + 1;
			}
		}
	}
}

function calHour(time) {
	var t = time.split(':');
	return parseInt(t[0], 10) + (t[1] / 60);
}

function getPosition(axis, start_time) {
	return parseInt((calHour(start_time) - axis) * 55, 10); // 1 cell top = 55px;
}

function getHeight(start_time, end_time) {
	return parseInt((calHour(end_time) - calHour(start_time)) * 55, 10); // 1 cell = 55px;
}

function checkMulti(timetable, timetables) {
	var count = 1;
	
	for (var i = 0; i < timetables.length; i++) {
		if 	(timetable.id != timetables[i].id) {
			if (((calHour(timetable.start_time) >= calHour(timetables[i].start_time)) && (calHour(timetable.start_time) < calHour(timetables[i].end_time)))
				|| ((calHour(timetables[i].start_time) >= calHour(timetable.start_time)) && (calHour(timetables[i].start_time) < calHour(timetable.end_time)))) {
				count++;
			}
		}
	}
	
	return count;
}

function checkOrder(timetable, timetables) {
	var order = 0;
	
	for (var i = 0; i < timetables.length; i++) {
		if 	(timetable.id > timetables[i].id) {
			if (((calHour(timetable.start_time) >= calHour(timetables[i].start_time)) && (calHour(timetable.start_time) < calHour(timetables[i].end_time)))
				|| ((calHour(timetables[i].start_time) >= calHour(timetable.start_time)) && (calHour(timetables[i].start_time) < calHour(timetable.end_time)))) {
				order++;
			}
		}
	}
	
	return order;
}

function getDayBefore(day, num) {
	var d = new Date();
	return new Date(d.setTime(day.getTime() - (num * 24 * 60 * 60 * 1000)));
}

function getDayAfter(day, num) {
	var d = new Date();
	return new Date(d.setTime(day.getTime() + (num * 24 * 60 * 60 * 1000)));
}

function naviClick(id, btn, weekNum, monthNum, yearNum) {
	createTimetable(jQuery('#' + id), btn, weekNum, monthNum, yearNum);
}

// Get timetables of day
function getTimetables(tiva_timetables, day, month, year) {
	var timetables = [];
	for (var i = 0; i < tiva_timetables.length; i++) {
		if ((tiva_timetables[i].date == day) && (tiva_timetables[i].month == month) && (tiva_timetables[i].year == year)) {
			timetables.push(tiva_timetables[i]);
		}
	}
	
	return timetables;
}

// Get timetables of day
function getTimetablesDay(tiva_timetables, day) {
	var timetables = [];
	for (var i = 0; i < tiva_timetables.length; i++) {
		if (tiva_timetables[i].day == day) {
			timetables.push(tiva_timetables[i]);
		}
	}
	
	return timetables;
}

// Get timetables of week
function getTimetablesWeek(tiva_timetables, first_day, last_day) {
	var date_check;
	
	var timetables = [];
	for (var i = 0; i < tiva_timetables.length; i++) {
		date_check = new Date(tiva_timetables[i].year, Number(tiva_timetables[i].month) - 1, tiva_timetables[i].date);
		if ((first_day.getTime() <= date_check.getTime()) && (date_check.getTime() <= last_day.getTime())) {
			timetables.push(tiva_timetables[i]);
		}
	}
	
	return timetables;
}

// Change month or year on calendar
function createTimetable(el, btn, weekNum, monthNum, yearNum) {
	// Variable
	var firstDate;
	var firstDay;
	var lastDate;
	var numbDays;
	var firstDateWeek;
	var todayDate = new Date();

	if (btn == "prevyr") {
		yearNum--;
	} else if (btn == "nextyr") {
		yearNum++;
	} else if (btn == "prevmo") {
		monthNum--;
	} else if (btn == "nextmo") {
		monthNum++;
	} else if (btn == "prevwe") {
		firstDateWeek = new Date(weekNum);
		weekNum = getDayBefore(firstDateWeek, 7);
	} else if (btn == "nextwe") {
		firstDateWeek = new Date(weekNum);
		weekNum = getDayAfter(firstDateWeek, 7);
	}

	if (monthNum == 0) {
		monthNum = 12;
		yearNum--;
	} else if (monthNum == 13) {
		monthNum = 1;
		yearNum++
	}
	
	// Get first day and number days of month
	firstDate = new Date(yearNum, monthNum - 1, 1);
	var date_start = (typeof el.attr('data-start') != "undefined") ? el.attr('data-start') : 'sunday';
	if (date_start == 'sunday') {
		firstDay = firstDate.getDay() + 1;
	} else {
		firstDay = (firstDate.getDay() == 0) ? 7 : firstDate.getDay();
	}
	
	lastDate = new Date(yearNum, monthNum, 0);
	numbDays = lastDate.getDate();
	
	// Create calendar
	var view = (typeof el.attr('data-view') != 'undefined') ? el.attr('data-view') : 'month';
	if (view == 'week') {
		timetableWeek(el, tiva_timetables, weekNum);
	} else if (view == 'list') {
		timetableList(el, tiva_timetables, weekNum);
	} else {
		timetableMonth(el, tiva_timetables, firstDay, numbDays, monthNum, yearNum);
	}
}

// Create timetable week
function timetableWeek(el, tiva_timetables, firstDayWeek) {
	var firstWeek = new Date(firstDayWeek);
	var firstWeekDate = firstWeek.getDate();
	var firstWeekMonth = firstWeek.getMonth() + 1;
	var firstWeekYear = firstWeek.getFullYear();
	
	var lastWeek = getDayAfter(firstWeek, 6);
	var lastWeekDate = lastWeek.getDate();
	var lastWeekMonth = lastWeek.getMonth() + 1;
	var lastWeekYear = lastWeek.getFullYear();
	
	var dayArr;
	var d;
	var date;
	var month;
	var year;
	
	var first;
	var last;
	var header_time;
		
	// Set wordDay
	var wordDay;
	var date_start = (typeof el.attr('data-start') != "undefined") ? el.attr('data-start') : 'sunday';
	var timetableString = "";
	
	if (date_start == 'sunday') {
		wordDay = new Array(wordDay_sun, wordDay_mon, wordDay_tue, wordDay_wed, wordDay_thu, wordDay_fri, wordDay_sat);
		dayArr = new Array("sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday");
	} else { // Start with Monday
		wordDay = new Array(wordDay_mon, wordDay_tue, wordDay_wed, wordDay_thu, wordDay_fri, wordDay_sat, wordDay_sun);
		dayArr = new Array("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday");
	}
	
	var week_nav;
	if ((firstWeekMonth != lastWeekMonth) && (firstWeekYear != lastWeekYear)) {
		week_nav = wordMonth[firstWeekMonth - 1].substring(0, 3) + ' ' + firstWeekDate + ', ' + firstWeekYear 
		+ ' - ' + wordMonth[lastWeekMonth - 1].substring(0, 3) + ' ' + lastWeekDate + ', ' + lastWeekYear;
	} else if (firstWeekMonth != lastWeekMonth) {
		week_nav = wordMonth[firstWeekMonth - 1].substring(0, 3) + ' ' + firstWeekDate + ' - ' + wordMonth[lastWeekMonth - 1].substring(0, 3) + ' ' + lastWeekDate + ', ' + firstWeekYear;
	} else {
		week_nav = wordMonth[firstWeekMonth - 1].substring(0, 3) + ' ' + firstWeekDate + ' - ' + lastWeekDate + ', ' + firstWeekYear;
	}
	
	if (!(el.attr('data-nav') == 'hide') && !(el.attr('data-mode') == 'day')) {
		timetableString += 	'<div class="time-navigation">'
								+ '<span class="navi-icon navi-prev" onClick="naviClick(\'' + el.attr('id') + '\', \'prevwe\', \'' + firstWeek + '\', ' + firstWeekMonth + ', ' + firstWeekYear + ')">&#10094;</span>'	
								+ '<span class="navi-time">' + week_nav + '</span>'
								+ '<span class="navi-icon navi-next" onClick="naviClick(\'' + el.attr('id') + '\', \'nextwe\', \'' + firstWeek + '\', ' + firstWeekMonth + ', ' + firstWeekYear + ')">&#10095;</span>'
							+ '</div>';
	}
	
	// Get timetables week
	if (!(el.attr('data-mode') == 'day')) {
		tiva_timetables = getTimetablesWeek(tiva_timetables, new Date(firstWeekYear, firstWeekMonth - 1, firstWeekDate), new Date(lastWeekYear, lastWeekMonth - 1, lastWeekDate));
	}
	
	// Get min, max time
	var min_time = getMinTime(tiva_timetables) ? getMinTime(tiva_timetables) : 8;
	var max_time = getMaxTime(tiva_timetables) ? getMaxTime(tiva_timetables) : 15;
	var show_time = (el.attr('data-header-time') == 'hide') ? '' : 'show-time'; 
	
	timetableString += '<div class="timetable-week ' + show_time + '">';
		timetableString += '<div class="timetable-axis">';
			for (var n = min_time; n <= max_time; n++) {
				var hour = (n < 10) ? '0' + n : n;
				timetableString += '<div class="axis-item">' + hour + ':00</div>';
			}
		timetableString += '</div>';
	
		timetableString += '<div class="timetable-columns">';
			for (var m = 0; m < wordDay.length; m++) {
				// Caculate date of week
				d = getDayAfter(firstWeek, m);
				date = d.getDate();
				month = d.getMonth() + 1;
				year = d.getFullYear();
				header_time = (el.attr('data-header-time') == 'hide') ? '' : '<br><span>' + wordMonth[month - 1].substring(0, 3) + ' ' + date + ', ' + year + '</span>';
				
				first = (m == 0) ? 'first-column' : '';
				last = (m == wordDay.length - 1) ? 'last-column' : '';
				
				timetableString += '<div class="timetable-column">';
					// Header
					if (screen.width > 768) {
						timetableString += '<div class="timetable-column-header ' + last + '">' + wordDay[m] + header_time + '</div>';
					} else {
						timetableString += '<div class="timetable-column-header ' + last + '">' + wordDay[m].substring(0, 3) + header_time + '</div>';
					}
				
					// Content
					timetableString += '<div class="timetable-column-content">';					
						// Get timetables of day
						if (el.attr('data-mode') == 'day') {
							var timetables = getTimetablesDay(tiva_timetables, dayArr[m]);
						} else {
							var timetables = getTimetables(tiva_timetables, date, month, year);
						}
						for (var t = 0; t < timetables.length; t++) {
							if (timetables[t].start_time && timetables[t].end_time) {
								// Image
								if (timetables[t].image) {
									var timetable_image = '<div class="timetable-image"><img src="timetable/images/' + timetables[t].image + '" alt="' + timetables[t].name + '" /></div>';
								} else {
									var timetable_image = '';
								}
								
								// End time
								if (timetables[t].end_time) {
									var timetable_end_time = ' - ' + timetables[t].end_time;
								} else {
									var timetable_end_time = '';
								}
								
								// Position
								var position = getPosition(min_time, timetables[t].start_time);
								var height = getHeight(timetables[t].start_time, timetables[t].end_time);
								
								// Width of timetable
								var item_width = (checkMulti(timetables[t], timetables) > 1) ? 'width:' + (100 / checkMulti(timetables[t], timetables)) + '%;' : '';
								var item_left = (checkOrder(timetables[t], timetables) > 0) ? 'left:' + (checkOrder(timetables[t], timetables) * (100 / checkMulti(timetables[t], timetables))) + '%' : '';
								
								timetableString += 	'<div class="timetable-item">'
														+ '<a class="timetable-title color-' + timetables[t].color + '" style="top:' + position + 'px; height:' + height + 'px; ' + item_width + item_left + '" href="#' + el.attr('id') + '-popup-' + timetables[t].id + '" class="open-popup-link">'
															+ '<div class="timetable-title-wrap">'
																+ '<div class="timetable-name">' + timetables[t].name + '</div>'
																+ '<div class="timetable-time">' + timeTo12HrFormat(timetables[t].start_time) + ' - ' + timeTo12HrFormat(timetables[t].end_time) + '</div>'
															+ '</div>'
														+ '</a>'
														+ '<div id="' + el.attr('id') + '-popup-' + timetables[t].id + '" class="timetable-popup zoom-anim-dialog mfp-hide">'
															+ '<div class="popup-header color-' + timetables[t].color + '">'
																+ timetables[t].name
															+ '</div>'
															+ '<div class="popup-body">'
																+ timetable_image
																+ '<div class="timetable-desc">' + timetables[t].description + '</div>'
															+ '</div>'
														+ '</div>'
													+ '</div>';
							}
						}
					timetableString += '</div>';
					
					// Grid
					timetableString += '<div class="timetable-column-grid">';
						for (var n = min_time; n < max_time; n++) {
							timetableString += '<div class="grid-item ' + first + '"></div>';
						}
					timetableString += '</div>';
				timetableString += '</div>';
			}
		timetableString += '</div>';
		
	timetableString += '</div>';

	el.html(timetableString);
	
	// Popup
	el.find('.timetable-title').magnificPopup({
		type: 'inline',
		removalDelay: 800,
		mainClass: 'my-mfp-zoom-in'
	});
}

// Create timetable week
function timetableList(el, tiva_timetables, firstDayWeek) {
	var firstWeek = new Date(firstDayWeek);
	var firstWeekDate = firstWeek.getDate();
	var firstWeekMonth = firstWeek.getMonth() + 1;
	var firstWeekYear = firstWeek.getFullYear();
	
	var lastWeek = getDayAfter(firstWeek, 6);
	var lastWeekDate = lastWeek.getDate();
	var lastWeekMonth = lastWeek.getMonth() + 1;
	var lastWeekYear = lastWeek.getFullYear();
	
	var dayArr;
	var d;
	var date;
	var month;
	var year;
	
	var first;
	var last;
	var header_time;
		
	// Set wordDay
	var wordDay;
	var date_start = (typeof el.attr('data-start') != "undefined") ? el.attr('data-start') : 'sunday';
	var timetableString = "";
	
	if (date_start == 'sunday') {
		wordDay = new Array(wordDay_sun, wordDay_mon, wordDay_tue, wordDay_wed, wordDay_thu, wordDay_fri, wordDay_sat);
		dayArr = new Array("sunday", "monday", "tuesday", "wednesday", "thursday", "friday", "saturday");
	} else { // Start with Monday
		wordDay = new Array(wordDay_mon, wordDay_tue, wordDay_wed, wordDay_thu, wordDay_fri, wordDay_sat, wordDay_sun);
		dayArr = new Array("monday", "tuesday", "wednesday", "thursday", "friday", "saturday", "sunday");
	}
	
	var week_nav;
	if ((firstWeekMonth != lastWeekMonth) && (firstWeekYear != lastWeekYear)) {
		week_nav = wordMonth[firstWeekMonth - 1].substring(0, 3) + ' ' + firstWeekDate + ', ' + firstWeekYear 
		+ ' - ' + wordMonth[lastWeekMonth - 1].substring(0, 3) + ' ' + lastWeekDate + ', ' + lastWeekYear;
	} else if (firstWeekMonth != lastWeekMonth) {
		week_nav = wordMonth[firstWeekMonth - 1].substring(0, 3) + ' ' + firstWeekDate + ' - ' + wordMonth[lastWeekMonth - 1].substring(0, 3) + ' ' + lastWeekDate + ', ' + firstWeekYear;
	} else {
		week_nav = wordMonth[firstWeekMonth - 1].substring(0, 3) + ' ' + firstWeekDate + ' - ' + lastWeekDate + ', ' + firstWeekYear;
	}
	
	if (!(el.attr('data-nav') == 'hide') && !(el.attr('data-mode') == 'day')) {
		timetableString += 	'<div class="time-navigation">'
								+ '<span class="navi-icon navi-prev" onClick="naviClick(\'' + el.attr('id') + '\', \'prevwe\', \'' + firstWeek + '\', ' + firstWeekMonth + ', ' + firstWeekYear + ')">&#10094;</span>'	
								+ '<span class="navi-time">' + week_nav + '</span>'
								+ '<span class="navi-icon navi-next" onClick="naviClick(\'' + el.attr('id') + '\', \'nextwe\', \'' + firstWeek + '\', ' + firstWeekMonth + ', ' + firstWeekYear + ')">&#10095;</span>'
							+ '</div>';
	}
	
	var timetables;
	timetableString += '<div class="timetable-list">';
		for (var m = 0; m < wordDay.length; m++) {
			// Caculate date of week
			d = getDayAfter(firstWeek, m);
			date = d.getDate();
			month = d.getMonth() + 1;
			year = d.getFullYear();
			
			// Get timetables of day
			if (el.attr('data-mode') == 'day') {
				timetables = getTimetablesDay(tiva_timetables, dayArr[m]);
			} else {
				timetables = getTimetables(tiva_timetables, date, month, year);
			}
						
			if (timetables.length > 0) {
				timetableString += '<div class="timetable-day">';
					// Header
					header_time = (el.attr('data-header-time') == 'hide') ? '' : '<span>' + wordMonth[month - 1].substring(0, 3) + ' ' + date + ', ' + year + '</span>';
					timetableString += '<div class="timetable-header">' + wordDay[m] + header_time + '</div>';
					
					// Get timetables of day
					timetableString += '<div class="timetable-content">';
						for (var t = 0; t < timetables.length; t++) {
							if (timetables[t].start_time && timetables[t].end_time) {
								// Image
								if (timetables[t].image) {
									var timetable_image = '<div class="timetable-image"><img src="timetable/images/' + timetables[t].image + '" alt="' + timetables[t].name + '" /></div>';
								} else {
									var timetable_image = '';
								}
								
								// End time
								if (timetables[t].end_time) {
									var timetable_end_time = ' - ' + timetables[t].end_time;
								} else {
									var timetable_end_time = '';
								}
														
								timetableString += 	'<div class="timetable-item">'
														+ '<span class="timetable-color color-' + timetables[t].color + '"></span>'
														+ '<a class="timetable-title" href="#' + el.attr('id') + '-popup-' + timetables[t].id + '" class="open-popup-link">'
															+ '<span class="timetable-time">' + timetables[t].start_time + timetable_end_time + '</span>'
															+ '<span class="timetable-name">' + timetables[t].name + '</span>'
														+ '</a>'
														+ '<div id="' + el.attr('id') + '-popup-' + timetables[t].id + '" class="timetable-popup zoom-anim-dialog mfp-hide">'
															+ '<div class="popup-header color-' + timetables[t].color + '">'
																+ timetables[t].name
															+ '</div>'
															+ '<div class="popup-body">'
																+ timetable_image
																+ '<div class="timetable-time color-' + timetables[t].color + '">' + timetables[t].start_time + timetable_end_time + '</div>'
																+ '<div class="timetable-desc">' + timetables[t].description + '</div>'
															+ '</div>'
														+ '</div>'
													+ '</div>';
							}
						}
					timetableString += '</div>';	
				timetableString += '</div>';
			}
		}	
	timetableString += '</div>';

	el.html(timetableString);
	
	// Popup
	el.find('.timetable-title').magnificPopup({
		type: 'inline',
		removalDelay: 800,
		mainClass: 'my-mfp-zoom-in'
	});
}

// Create timetable month
function timetableMonth(el, tiva_timetables, firstDay, numbDays, monthNum, yearNum) {
	// Set wordDay
	var todaysDate = tiva_current_date.getDate();
	var wordDay;
	var date_start = (typeof el.attr('data-start') != "undefined") ? el.attr('data-start') : 'sunday';
	var timetableString = "";
	var daycounter = 0;
	
	if (date_start == 'sunday') {
		wordDay = new Array(wordDay_sun, wordDay_mon, wordDay_tue, wordDay_wed, wordDay_thu, wordDay_fri, wordDay_sat);
	} else { // Start with Monday
		wordDay = new Array(wordDay_mon, wordDay_tue, wordDay_wed, wordDay_thu, wordDay_fri, wordDay_sat, wordDay_sun);
	}
	
	if (!(el.attr('data-nav') == 'hide')) {
		timetableString += 	'<div class="time-navigation">'
								+ '<span class="navi-icon navi-prev" onClick="naviClick(\'' + el.attr('id') + '\', \'prevmo\', \'\', ' + monthNum + ', ' + yearNum + ')">&#10094;</span>'	
								+ '<span class="navi-time">' + wordMonth[monthNum - 1] + '&nbsp;&nbsp;' + yearNum + '</span>'
								+ '<span class="navi-icon navi-next" onClick="naviClick(\'' + el.attr('id') + '\', \'nextmo\', \'\', ' + monthNum + ', ' + yearNum + ')">&#10095;</span>'
							+ '</div>';
	}
	
	timetableString += '<table class="timetable-month">';
	timetableString += '<tbody>';
	
	timetableString += '<tr>';
	for (var m = 0; m < wordDay.length; m++) {
		if (screen.width > 768) {
			timetableString += '<th class="timetable-header">' + wordDay[m] + '</th>';
		} else {
			timetableString += '<th class="timetable-header">' + wordDay[m].substring(0, 3) + '</th>';
		}
	}
	timetableString += '</tr>';

	var thisDate = 1;
	var class_today;
	
	for (var i = 1; i <= 6; i++) {
		var k = (i - 1) * 7 + 1;
		if (k < (firstDay + numbDays)) {
			timetableString += '<tr>';
			for (var x = 1; x <= 7; x++) {
				daycounter = (thisDate - firstDay) + 1;
				thisDate++;
				
				class_today = ((todaysDate == daycounter) && (tiva_current_month == monthNum) && (tiva_current_year == yearNum)) ? 'today' : '';
				timetableString += '<td class="calendar-day ' + class_today + '">';
					if ((daycounter <= numbDays) && (daycounter >= 1)) {
						timetableString += '<div class="calendar-daycounter">' + daycounter + '</div>';
					}
					
					// Get timetables of day
					var timetables = getTimetables(tiva_timetables, daycounter, monthNum, yearNum);
					for (var t = 0; t < timetables.length; t++) {
						// Image
						if (timetables[t].image) {
							var timetable_image = '<div class="timetable-image"><img src="timetable/images/' + timetables[t].image + '" alt="' + timetables[t].name + '" /></div>';
						} else {
							var timetable_image = '';
						}
						
						// End time
						if (timetables[t].end_time) {
							var timetable_end_time = ' - ' + timetables[t].end_time;
						} else {
							var timetable_end_time = '';
						}

						timetableString += 	'<div class="timetable-item">'
												+ '<span class="timetable-color color-' + timetables[t].color + '"></span>'
												+ '<a class="timetable-title" href="#' + el.attr('id') + '-popup-' + timetables[t].id + '" class="open-popup-link">'
													+ '<span class="timetable-time">' + timetables[t].start_time + '</span>'
													+ '<span class="timetable-name">' + timetables[t].name + '</span>'
												+ '</a>'
												+ '<div id="' + el.attr('id') + '-popup-' + timetables[t].id + '" class="timetable-popup zoom-anim-dialog mfp-hide">'
													+ '<div class="popup-header color-' + timetables[t].color + '">'
														+ timetables[t].name
													+ '</div>'
													+ '<div class="popup-body">'
														+ timetable_image
														+ '<div class="timetable-time color-' + timetables[t].color + '">' + timetables[t].start_time + timetable_end_time + '</div>'
														+ '<div class="timetable-desc">' + timetables[t].description + '</div>'
													+ '</div>'
												+ '</div>'
											+ '</div>';
					}
				timetableString += '</td>';
			}
			timetableString += '</tr>';
		}
	}
	timetableString += '</tbody>';
	timetableString += '</table>';
	
	el.html(timetableString);
	
	// Popup
	el.find('.timetable-title').magnificPopup({
		type: 'inline',
		removalDelay: 800,
		mainClass: 'my-mfp-zoom-in'
	});
	
	thisDate = 1;
}

jQuery(document).ready(function(){
	jQuery('.tiva-timetable').each(function(index) {
		// Set id for timetable
		jQuery(this).attr('id', 'timetable-' + (index + 1));
		
		// Get timetables from json file or ajax php
		var source = (typeof jQuery(this).attr('data-source') != 'undefined') ? jQuery(this).attr('data-source') : 'json';
		var view = (typeof jQuery(this).attr('data-view') != 'undefined') ? jQuery(this).attr('data-view') : 'month';
		if ((jQuery(this).attr('data-mode') == 'day') && ((view == 'week') || (view == 'list'))) {
			var mode = 'day';
		} else {
			var mode = 'date';
		}
		
		var timetable_contain = jQuery(this);
		
		if (source == 'json') { // Get timetables from json file
			if (mode == 'day') {
				var timetable_json = 'timetable/timetables_day.json';
			} else {
				var timetable_json = 'timetable/timetables_date.json';
			}
			
			jQuery.getJSON(timetable_json, function(data) {
				// Init timetables variable
				tiva_timetables = [];
				
				for (var i = 0; i < data.items.length; i++) {
					tiva_timetables.push(data.items[i]);
				}
				
				// Sort timetables by date
				tiva_timetables.sort(sortByTime);
				
				for (var j = 0; j < tiva_timetables.length; j++) {
					tiva_timetables[j].id = j;
				}
				
				// Create timetable
				var todayDate = new Date();
				var date_start = (typeof timetable_contain.attr('data-start') != "undefined") ? timetable_contain.attr('data-start') : 'sunday';
				if (date_start == 'sunday') {
					var tiva_current_week = new Date(todayDate.setDate(tiva_current_date.getDate() - todayDate.getDay()));
				} else {
					var today_date = (todayDate.getDay() == 0) ? 7 : todayDate.getDay();
					var tiva_current_week = new Date(todayDate.setDate(tiva_current_date.getDate() - today_date + 1));
				}
				createTimetable(timetable_contain, 'current', tiva_current_week, tiva_current_month, tiva_current_year);
			});
		} else { // Get timetables from php file via ajax : timetables/timetables.php
			jQuery.ajax({
				url: 'timetable/timetables.php',
				dataType: 'json',
				data: '',
				beforeSend : function(){
					timetable_contain.html('<div class="loading"><img src="assets/images/loading.gif" /></div>');
				},
				success: function(data) {
					// Init timetables variable
					tiva_timetables = [];
				
					for (var i = 0; i < data.length; i++) {
						tiva_timetables.push(data[i]);
					}
					
					// Sort timetables by date
					tiva_timetables.sort(sortByTime);
				
					for (var j = 0; j < tiva_timetables.length; j++) {
						tiva_timetables[j].id = j;
					}
					
					// Create timetable
					var todayDate = new Date();
					var date_start = (typeof timetable_contain.attr('data-start') != "undefined") ? timetable_contain.attr('data-start') : 'sunday';
					if (date_start == 'sunday') {
						var tiva_current_week = new Date(todayDate.setDate(tiva_current_date.getDate() - todayDate.getDay()));
					} else {
						var today_date = (todayDate.getDay() == 0) ? 7 : todayDate.getDay();
						var tiva_current_week = new Date(todayDate.setDate(tiva_current_date.getDate() - today_date + 1));
					}
					createTimetable(timetable_contain, 'current', tiva_current_week, tiva_current_month, tiva_current_year);
				}
			});	
		}
	});
});