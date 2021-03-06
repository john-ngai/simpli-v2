// Return an array of hours from start to end, excluding the end_time.
const getTimeRange = (start_time, end_time) => {
  const range = [];

  // CASE #1: If starting and ending hours are both in the morning,
  if (start_time.includes('a') && end_time.includes('a')) {
    start_time = start_time.split(/(?=a)/g);
    end_time = end_time.split(/(?=a)/g);
    // CASE #1.1: If the ending hour is 12 AM. 
    if (Number(end_time[0]) === 12 && end_time[1] === 'am') {
      console.log(true);
      // Add the morning hours to the range, from start to end.
      for (let hour = start_time[0]; hour <= 11; hour++) {
        range.push(`${hour}am`);
      }
      range.push('12pm');
      // Add the afternoon hours to the range, from 1 PM to 11 PM.
      for (let hour = 1; hour < 12; hour++) {
        range.push(`${hour}pm`);
      }
      // CASE #1.2: If the ending hour is NOT 12 AM.
    } else {
      let hour = Number(start_time[0]);
      // Add the morning hours to the range, from start to end.
      range.push(`${hour}am`);
      hour++;
      while (hour < Number(end_time[0])) {
        range.push(`${hour}am`);
        hour++;
      }
    }
  }

  // CASE #2: If the starting hour is in the morning and the ending hour is in the afternoon,
  if (start_time.includes('a') && end_time.includes('p')) {
    start_time = start_time.split(/(?=a)/g);
    end_time = end_time.split(/(?=p)/g);
    // Add the morning hours to the range, from start to 11 AM.
    for (let hour = start_time[0]; hour <= 11; hour++) {
      range.push(`${hour}am`);
    }
    // If the ending hour is NOT 12 PM,
    if (Number(end_time[0]) !== 12) {
      range.push('12pm');
      // Add the afternoon hours to the range, from 1pm to the end.
      for (let hour = 1; hour < end_time[0]; hour++) {
        range.push(`${hour}pm`);
      }
    }
  }

  // CASE #3: If time starting and ending hours are both in the afternoon,
  if (start_time.includes('p') && end_time.includes('p')) {
    start_time = start_time.split(/(?=p)/g);
    end_time = end_time.split(/(?=p)/g);
    // If the starting hour is 12 PM,
    if (Number(start_time[0]) === 12 && start_time[1] === 'pm') {
      range.push('12pm');
      for (let hour = 1; hour < end_time[0]; hour++) {
        range.push(`${hour}pm`);
      }
      // If the starting hour is NOT 12 PM,
    } else {
      let hour = Number(start_time[0]);
      // Add the afternoon hours to the range, from start to end.
      range.push(`${hour}pm`);
      hour++;
      while (hour < Number(end_time[0])) {
        range.push(`${hour}pm`);
        hour++;
      }
    }
  }

  // CASE #4: If the starting hour is in the afternoon and the ending hour is in the morning,
  if (start_time.includes('p') && end_time.includes('a')) {
    start_time = start_time.split(/(?=p)/g);
    end_time = end_time.split(/(?=a)/g);
    // If the starting hour is 12 PM,
    if (Number(start_time[0]) === 12 && start_time[1] === 'pm') {
      range.push('12pm');
      for (let hour = 1; hour < end_time[0]; hour++) {
        range.push(`${hour}pm`);
      }
      // If the starting hour is NOT 12 PM,
    } else {
      let hour = Number(start_time[0]);
      // Add the afternoon hours to the range, from start to end.
      range.push(`${hour}pm`);
      hour++;
      while (hour < Number(end_time[0])) {
        range.push(`${hour}pm`);
        hour++;
      }
    }
  }

  return range;
}
exports.getTimeRange = getTimeRange;

// Return the schedule object with a timeRange property added to each item. 
const addTimeRange = schedule => {
  const result = schedule;
  Object.values(result).forEach(item => {
    const timeRange = getTimeRange(item['start_time'], item['end_time']);
    result[item.id].timeRange = timeRange;
  });
  return result;
}
exports.addTimeRange = addTimeRange;

// Return the schedule with only the items with the given time (hour) period.
const getfilteredSchedule = (schedule, time) => {
  const result = {};
  Object.values(schedule).forEach(item => {
    if (item.timeRange.includes(time)) {
      result[item.id] = item
    }
  });
  return result;
}
exports.getfilteredSchedule = getfilteredSchedule;

// Return the scheduled tasks for each day for a given time (hour) period.
const getScheduledTasks = (filteredSchedule, time) => {
  const scheduledTasks = {
    sun: {},
    mon: {},
    tues: {},
    wed: {},
    thurs: {},
    fri: {},
    sat: {}
  }
  for (const item of Object.values(filteredSchedule)) {
    const day_id = item['day_id'];
    const start_time = item.timeRange[0];
    const lastHour = item.timeRange[item.timeRange.length - 1];

    switch (day_id) {
      case 1:
        scheduledTasks.sun.id = item.id;
        scheduledTasks.sun['deliverable_id'] = item['deliverable_id'];
        scheduledTasks.sun['task_id'] = item.task.id;
        scheduledTasks.sun.completed = item.task.completed;
        if (start_time === time) {
          scheduledTasks.sun.name = item.task.name;
          scheduledTasks.sun.description = item.task.description;
        }
        if (lastHour === time) {
          scheduledTasks.sun.lastHour = true;
        }
        break;

      case 2:
        scheduledTasks.mon.id = item.id;
        scheduledTasks.mon['deliverable_id'] = item['deliverable_id'];
        scheduledTasks.mon['task_id'] = item.task.id;
        scheduledTasks.mon.completed = item.task.completed;
        if (start_time === time) {
          scheduledTasks.mon.name = item.task.name;
          scheduledTasks.mon.description = item.task.description;
        }
        if (lastHour === time) {
          scheduledTasks.mon.lastHour = true;
        }
        break;

      case 3:
        scheduledTasks.tues.id = item.id;
        scheduledTasks.tues['deliverable_id'] = item['deliverable_id'];
        scheduledTasks.tues['task_id'] = item.task.id;
        scheduledTasks.tues.completed = item.task.completed;
        if (start_time === time) {
          scheduledTasks.tues.name = item.task.name;
          scheduledTasks.tues.description = item.task.description;
        }
        if (lastHour === time) {
          scheduledTasks.tues.lastHour = true;
        }
        break;

      case 4:
        scheduledTasks.wed.id = item.id;
        scheduledTasks.wed['deliverable_id'] = item['deliverable_id'];
        scheduledTasks.wed['task_id'] = item.task.id;
        scheduledTasks.wed.completed = item.task.completed;
        if (start_time === time) {
          scheduledTasks.wed.name = item.task.name;
          scheduledTasks.wed.description = item.task.description;
        }
        if (lastHour === time) {
          scheduledTasks.wed.lastHour = true;
        }
        break;

      case 5:
        scheduledTasks.thurs.id = item.id;
        scheduledTasks.thurs['deliverable_id'] = item['deliverable_id'];
        scheduledTasks.thurs['task_id'] = item.task.id;
        scheduledTasks.thurs.completed = item.task.completed;
        if (start_time === time) {
          scheduledTasks.thurs.name = item.task.name;
          scheduledTasks.thurs.description = item.task.description;
        }
        if (lastHour === time) {
          scheduledTasks.thurs.lastHour = true;
        }
        break;

      case 6:
        scheduledTasks.fri.id = item.id;
        scheduledTasks.fri['deliverable_id'] = item['deliverable_id'];
        scheduledTasks.fri['task_id'] = item.task.id;
        scheduledTasks.fri.completed = item.task.completed;
        if (start_time === time) {
          scheduledTasks.fri.name = item.task.name;
          scheduledTasks.fri.description = item.task.description;
        }
        if (lastHour === time) {
          scheduledTasks.fri.lastHour = true;
        }
        break;

      case 7:
        scheduledTasks.sat.id = item.id;
        scheduledTasks.sat['deliverable_id'] = item['deliverable_id'];
        scheduledTasks.sat['task_id'] = item.task.id;
        scheduledTasks.sat.completed = item.task.completed;
        if (start_time === time) {
          scheduledTasks.sat.name = item.task.name;
          scheduledTasks.sat.description = item.task.description;
        }
        if (lastHour === time) {
          scheduledTasks.sat.lastHour = true;
        }
        break;
    }
  }
  return scheduledTasks;
}
exports.getScheduledTasks = getScheduledTasks;
