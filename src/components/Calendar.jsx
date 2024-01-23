import PropTypes from 'prop-types';  
import { authContext } from "../contexts/auth.context";
import { useContext, useEffect, useState } from "react";
import { DateTime } from "luxon";
import { Link } from "react-router-dom";

export default function Calendar( {simpleDate} ) {
  const { loading, currentUser } = useContext(authContext);

  const [monthToDisplay, setMonthToDisplay] = useState();
  const [yearToDisplay, setYearToDisplay] = useState();
  const [firstWeekDay, setFirstWeekDay] = useState();
  const [loadingCalendar, setLoadingCalendar] = useState(true);
  const [eventsDate, setEventsDate] = useState("");
  const [eventsDay, setEventsDay] = useState("");
  const [eventsWeekDay, setEventsWeekDay] = useState("");

  useEffect(() => {
    getMonth.current();
    setLoadingCalendar(false);
  }, [currentUser]);

  const today = new Date();
  const currentDay = simpleDate(today);
  const currentMonth = today.getMonth();
  const currentYear = today.getFullYear();

  let month;
  if ((yearToDisplay - 2020) % 4 === 0) {
    // handle leap years
    month = [31, 29, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  } else {
    month = [31, 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31];
  }

  const monthNames = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
  const weekDays = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];

  // This returns the whole set of days in a month divided by weeks.
  function getDays(month) {
    const days = []; // Here we'll store the whole set of days that belong in a month. Each day informs what week-day it corresponds to.
    for (let i = 1; i <= month; i++) {
      const dayOfWeek = (firstWeekDay + i - 1) % 7;
      const day = [i, dayOfWeek];
      days.push(day);
    }
    // console.log(days);
    const weeks = [[], [], [], [], []]; // Here we'll store that same set of days but split onto weeks.
    let d = 0;
    for (let w = 0; w <= 4; w++) {
      weeks[w].push(days[d]);
      while (days[d + 1] && days[d + 1][1] > days[d][1]) {
        weeks[w].push(days[d + 1]);
        d++;
      }
      d++;
    }
    // console.log("weeks: ",weeks);
    return weeks;
  }

  // Sets up every useState needed to determine the
  const getMonth = {
    current: function () {
      const today = new Date();
      const currentMonth = today.getMonth();
      const currentYear = today.getFullYear();
      const firstDayMonth = new Date(`${currentYear}-${currentMonth + 1}-1`);
      const weekDay = firstDayMonth.getDay();

      setYearToDisplay(currentYear);
      setMonthToDisplay(currentMonth);
      setFirstWeekDay(weekDay);
    },
    change: function (selection) {
      let newMonth;
      let newYear;
      if (selection === "next") {
        if (monthToDisplay <= 10) {
          newMonth = monthToDisplay + 1;
          newYear = yearToDisplay;
        }
        if (monthToDisplay === 11) {
          newMonth = 0;
          newYear = yearToDisplay + 1;
        }
      }
      if (selection === "previous") {
        if (monthToDisplay >= 1) {
          newMonth = monthToDisplay - 1;
          newYear = yearToDisplay;
        }
        if (monthToDisplay === 0) {
          newMonth = 11;
          newYear = yearToDisplay - 1;
        }
      }
      setMonthToDisplay(newMonth);
      setYearToDisplay(newYear);
      const firstDayMonth = new Date(`${newYear}-${newMonth + 1}-1`);
      const weekDay = firstDayMonth.getDay();
      setFirstWeekDay(weekDay);
    },
  };

  //------------ EVENTS REFORMATTED ------------
  const events = {
    //type: {enum: ["eventsCreated","eventsJoined","eventsPending"]}
    //date: simpleDate format
    // We want to retrieve only the events that belong to a specific date and a specific type.
    getEvents: function (type, date) {
      // First we filter those events.
      const filteredEvents = currentUser[type].filter((event) => {
        const eventDate = simpleDate(new Date(event.dateTime));
        return date == eventDate;
      });
      // Then we return an array of objects containing the info we need about every event that takes place on that date.
      const formattedEvents = filteredEvents.map((event) => {
        const eventDate = simpleDate(new Date(event.dateTime));
        const eventTime = DateTime.fromISO(event.dateTime).toLocaleString(DateTime.TIME_SIMPLE);
        const eventType = type.slice(6).toLowerCase();
        return {
          id: event._id,
          title: event.title,
          date: eventDate,
          time: eventTime,
          type: eventType,
        };
      });
      return formattedEvents;
    },

    //date: simpleDate format
    // Returns all the events that belong to a specific date, ordered by time.
    complete: function (date) {
      const formattedEvents = [...this.getEvents("eventsCreated", date), ...this.getEvents("eventsJoined", date), ...this.getEvents("eventsPending", date)];
      const orderedEvents = formattedEvents.sort((a, b) => {
        const timeA = `${a.time.slice(0, 2)}${a.time.slice(3, 5)}`;
        const timeB = `${b.time.slice(0, 2)}${b.time.slice(3, 5)}`;
        return timeA - timeB;
      });
      return orderedEvents;
    },

    // returns an array of plain string dates in "simpleDate" format.
    confirmedDates: function () {
      const created = currentUser.eventsCreated.map((event) => {
        const eventDate = simpleDate(new Date(event.dateTime));
        return eventDate;
      });
      const joined = currentUser.eventsJoined.map((event) => {
        const eventDate = simpleDate(new Date(event.dateTime));
        return eventDate;
      });
      const events = [...created, ...joined];
      const uniqueEvents = [...new Set(events)];
      return uniqueEvents;
    },
    // returns an array of plain string dates in "simpleDate" format.
    possibleDates: function () {
      const events = currentUser.eventsPending.map((event) => {
        const eventDate = simpleDate(new Date(event.dateTime));
        return eventDate;
      });
      const uniqueEvents = [...new Set(events)];
      return uniqueEvents;
    },
  };

  //------------ COMPONENTS ------------
  function FirstWeekGap() {
    const week = getDays(month[monthToDisplay])[0];
    if (week[0][1] != 0) {
      const shift = week[0][1]; // The week-day number that corresponds to the first day of the month is equal to the number of empty spaces we'll need before that day.
      return [...Array(shift)].map((gap, i) => {
        return <div className="day-empty" key={i}></div>;
      });
    }
  }

  function Week({ index }) {
    const week = getDays(month[monthToDisplay])[index];
    if (!week[0]) return; // without this, an error would occur when a month only has 4 weeks. (Example: february 2026)
    function clickHandler(stringDate, day) {
      setEventsDate(stringDate);
      setEventsWeekDay(weekDays[day[1]]);
      switch (day[0].toString().slice(-1)) {
        case "1":
          setEventsDay(`${day[0]}st`);
          break;
        case "2":
          setEventsDay(`${day[0]}nd`);
          break;
        case "3":
          setEventsDay(`${day[0]}rd`);
          break;
        default:
          setEventsDay(`${day[0]}th`);
      }
    }

    return week.map((day, i) => {
      const date = new Date(`${yearToDisplay}-${monthToDisplay + 1}-${day[0]}`);
      const stringDate = simpleDate(date);
      let typeOfEvents = "";
      if (events.confirmedDates().includes(stringDate) && events.possibleDates().includes(stringDate)) {
        typeOfEvents = "mixed";
      } else if (events.confirmedDates().includes(stringDate)) {
        typeOfEvents = "confirmed";
      } else if (events.possibleDates().includes(stringDate)) {
        typeOfEvents = "possible";
      }

      let classes = "day";
      let clickFunction = () => setEventsDate("");
      if (typeOfEvents) {
        classes = `day ${typeOfEvents}`;
        clickFunction = () => clickHandler(stringDate, day);
      }
      if (stringDate < currentDay) {
        classes = "day inactive";
        clickFunction = () => setEventsDate("");
      }
      return (
        <div className={classes} key={i} onClick={clickFunction}>
          {day[0]}
        </div>
      );
    });
  }

  function DayEvents() {
    const eventsData = events.complete(eventsDate);
    return eventsData.map((event) => {
      return (
        <div className={`event ${event.type}`} key={event.id}>
          <div className="title-container">
            <Link to={`/events/${event.id}`}>
              <h6>{event.title}</h6>
            </Link>
          </div>
          <p>{event.time}</p>
        </div>
      );
    });
  }

  //------------ RETURN ------------
  return (
    <div id="Calendar">
      <div className="calendar-container">
        <div className="relative">
          <div className="button">
            {(monthToDisplay != currentMonth || (monthToDisplay === currentMonth && yearToDisplay != currentYear)) && (
              <button
                className="left"
                type="button"
                onClick={() => {
                  getMonth.change("previous");
                  setEventsDate("");
                }}
              >
                <img src="chevron-left-solid.svg" alt="arrow right" />
              </button>
            )}
          </div>
          <div className="main">
            <h4>
              {monthNames[monthToDisplay]} {yearToDisplay}
            </h4>
            <div className="week-days">
              {["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"].map((item, index) => {
                return (
                  <div className="week-day" key={index}>
                    {item}
                  </div>
                );
              })}
            </div>

            {!loading && !loadingCalendar && (
              <div className="days-container">
                <div className="week">
                  <FirstWeekGap />
                  <Week index={0} />
                </div>
                <div className="week">
                  <Week index={1} />
                </div>
                <div className="week">
                  <Week index={2} />
                </div>
                <div className="week">
                  <Week index={3} />
                </div>
                <div className="week">
                  <Week index={4} />
                </div>
              </div>
            )}
          </div>
          <div className="button">
            <button
              className="right"
              type="button"
              onClick={() => {
                getMonth.change("next");
                setEventsDate("");
              }}
            >
              <img src="chevron-right-solid.svg" alt="arrow right" />
            </button>
          </div>
        </div>
      </div>
      {eventsDate && (
        <div className="events-container">
          <div className="events-main">
            <header>
              <h5>
                {eventsWeekDay} {eventsDay}
              </h5>
              <div className="button">
                <button type="button" onClick={() => setEventsDate("")}>
                  ✖️
                </button>
              </div>
            </header>
              <div className="events">
                <DayEvents />
              </div>
          </div>
        </div>
      )}
    </div>
  );
}

Calendar.propTypes = {
  simpleDate: PropTypes.func
}