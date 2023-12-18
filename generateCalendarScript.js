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
		if (contributionData.length > 0) {
			generateCalendar();
		} else {
			console.log(
				`Data fethed is empty!...\ncontributionData:${contributionData}`
			);
		}
	} catch (error) {
		console.error("There was a problem with the fetch operation:", error);
	}
}

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

function generateCalendar() {
	const startingMonth = new Date(contributionData[0]["date"]).getMonth();

	// component creation steps happends here
	const calendarComponent = document.getElementById("calendar-component");
	const calendarHeader = document.createElement("h1");
	calendarHeader.textContent = "GitHub Activity Calendar";
	calendarComponent.append(calendarHeader);
	const calendarMonthsTemplate = document.createElement("div");
	calendarMonthsTemplate.className = "months";
	for (let i = 0; i < 13; i++) {
		const month = document.createElement("div");
		month.className = "month";
		const currentMonth =
			i + startingMonth > 11 ? i + startingMonth - 12 : i + startingMonth;
		month.textContent = `${monthsMap[currentMonth]}`;
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
	const calendar = document.createElement("div");
	calendar.id = "calendar";
	calendar.innerHTML = "";
	calendarDaysTemplate.append(calendar);
	calendarComponent.append(calendarDaysTemplate);

	// Generate calendar grid
	for (let dayOfWeek = 0; dayOfWeek < 7; dayOfWeek++) {
		for (let week = 0; week < 53; week++) {
			const dayElement = document.createElement("div");
			dayElement.classList.add("day");
			const currentDate = new Date();
			currentDate.setDate(
				currentDate.getDate() - 365 + (dayOfWeek + week * 7)
			);
			const currentDateISO = currentDate.toLocaleString().split(",")[0];
			const data = contributionData.find(
				(entry) => entry.date === currentDateISO
			);
      //Add gradiant proportionate to contribution count
      if(data && data.contributionCount > 0){
        const colorIntensity = data.contributionCount / 10 // Adjust color intensity based on contributionCount
        dayElement.style.backgroundColor = `rgba(0, 255, 0, ${colorIntensity}` // Use color from data or default color
      }
			dayElement.setAttribute(
				"date",
				currentDate.toLocaleDateString("en-US", {
					month: "short",
					day: "2-digit",
				})
			);
			if (data) {
				dayElement.setAttribute(
					"contributions",
					data.contributionCount
				);
			}
			const today = new Date();
			if (currentDate > today) {
				dayElement.style.backgroundColor = "transparent";
				dayElement.style.border = "0px";
			}
			calendar.appendChild(dayElement);
		}
	}

	const styles = `
  #calendar {
    display: grid;
    /* 53 columns for each week in a year */
    grid-template-columns: repeat(53, 17px);
    /* 7 rows for each day of the week */
    grid-template-rows: repeat(7, 17px);
    gap: 2px;
  }
  
  .day {
    width: 17px;
    height: 17px;
    border: 1px solid rgba(0,255,0,0.25);
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    position: relative;
    background-color: rgba(0, 0, 0, 0.5); /* Adjust background color and opacity as needed */
  }
  .day:hover::after {
    content: attr(contributions) " contributions on " attr(date);
    position: absolute;
    top: 100%;
    left: 50%;
    transform: translate(-50%, -60px);
    background-color: rgba(255, 255, 255, 0.9); /* Adjust background color and opacity as needed */
    border: 1px solid #ccc; /* Add a border if needed */
    padding: 5px; /* Adjust padding as needed */
    border-radius: 5px; /* Add border-radius for rounded corners if needed */
    white-space: nowrap;
    color: #121212;
    z-index: 5;
  }
  .calendar-wrapper {
    display: flex;
    flex-direction: row;
    justify-content: center;
  }
  .calendar-wrapper aside {
    padding-right: 1rem;
    text-align: right;
    width: 2rem;
  }
  .months {
    display: flex;
    flex-direction: row;
    justify-content: left;
    margin-left: 2rem;
  }
  .month {
    width: 76px;
  }
  #calendar-component{
    margin: 3rem 0;
    font-size: 14px;
  }
  #calendar-component > h1{
    margin-bottom: 0.5rem;
    text-align: center;
  }
  `;
	// Apply styles to the document
	const styleElement = document.createElement("style");
	styleElement.textContent = styles;
  document.head.appendChild(styleElement);
}

fetchData();
