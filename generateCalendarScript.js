"use strict";
const updatingEndPointURL =
  "https://raw.githubusercontent.com/imananoosheh/github-contributions-fetch/main/gh-contributions.json";
let contributionData = [];
async function fetchData() {
  try {
    const response = await fetch(updatingEndPointURL);
    if (!response.ok) {
      throw new Error("Network response was not ok");
    }
    const data = await response.json();
    contributionData = data;
  } catch (error) {
    console.error("There was a problem with the fetch operation:", error);
  }
}

fetchData();

const monthsMap = {
  0: "Jan",
  1: "Feb",
  2: "Mar",
  3: "Apr",
  4: "May",
  5: "Jun",
  6: "Jul",
  7: "Aug",
  8: "Sep",
  9: "Oct",
  10: "Nov",
  11: "Dec",
};
const startingMonth = new Date(contributionData[0]["date"]).getMonth();
const monthsHeaderAxis = document.querySelectorAll(".month");
for (let i = 0; i < monthsHeaderAxis.length; i++) {
  const currentMonth =
    i + startingMonth > 11 ? i + startingMonth - 12 : i + startingMonth;
  monthsHeaderAxis[i].textContent = `${monthsMap[currentMonth]}`;
}

function generateCalendar() {
  const calendarComponent = document.getElementById("calendar-component");
  const calendarHeader = document.createElement("h1");
  calendarHeader.textContent = "GitHub Activity Calendar";
  calendarComponent.append(CalendarHeader);
  const calendarMonthsTemplate = document.createElement("div");
  calendarMonthsTemplate.className = "months";
  for (let i = 0; i < 13; i++) {
    const month = document.createElement("div");
    month.className = "month";
    calendarMonthsTemplate.append(month);
  }
  calendarComponent.append(calendarMonthsTemplate);
  const calendarDaysTemplate = document.createElement("div");
  calendarDaysTemplate.className = "calendar-wrapper";
  const calendarDaysAsideBlock = document.createElement("aside");
  const daysOfWeeks = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"];
  for (let i = 0; i < 7; i++) {
    const day = document.createElement("div");
    day.textContent = `${daysOfWeeks[i]}`;
    calendarDaysAsideBlock.append(day);
  }
  calendarDaysTemplate.append(calendarDaysAsideBlock);
  const calendar = document.getElementById("calendar");
  calendar.innerHTML = "";
  calendarDaysTemplate.append(calendar);
  calendarComponent.append(calendarDaysTemplate);
  document.append(calendarComponent);

  // Generate calendar grid
  for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
    for (let week = 0; week < 53; week++) {
      const dayElement = document.createElement("div");
      dayElement.classList.add("day");
      const currentDate = new Date();
      currentDate.setDate(currentDate.getDate() - 365 + (dayOfWeek + week * 7));
      const currentDateISO = currentDate.toISOString().split("T")[0];
      const data = contributionData.find(
        (entry) => entry.date === currentDateISO
      );
      const colorIntensity = data ? data.contributionCount / 10 : 0; // Adjust color intensity based on contributionCount
      dayElement.style.backgroundColor = data ? data.color : "#ebedf0"; // Use color from data or default color
      dayElement.setAttribute("date", currentDate);
      if (data) {
        dayElement.setAttribute("contributions", data.contributionCount);
      }
      const today = new Date();
      if (currentDate > today) {
        dayElement.style.backgroundColor = "transparent";
        dayElement.style.border = "0px";
      }
      calendar.appendChild(dayElement);
    }
  }
}
generateCalendar();
