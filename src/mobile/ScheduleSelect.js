import { useNavigate } from "react-router-dom";
import { useState } from "react";
import moment from "moment";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import BottomNavBarMobile from "./BottomNavBarMobile";
import { FaRegCalendarAlt } from "react-icons/fa";
import "../styles//mobile/CalendarStyle.scss";
import { PiWarningCircleFill } from "react-icons/pi";

const ScheduleSelect = () => {
  const navigate = useNavigate();

  // 로컬 스토리지에 저장된 날짜 불러오기 (없으면 오늘 날짜)
  const today = new Date();
  const storedDate = localStorage.getItem("selectedDate");
  const initialDate = new Date(storedDate);
  const [selectedDate, setSelectedDate] = useState(initialDate);

  const [popUp,setPopUp] = useState(false);


  const maxDate = moment(today).add(30, "days").toDate();

  const handleDateChange = (date) => {
    const newDate = new Date(date.getTime()+ 9* 60 * 60 * 1000)
      .toISOString()
      .slice(0,10);
    setSelectedDate(date);
    localStorage.setItem("selectedDate", newDate);
  };

  const handleReserve = () => {
    if(!localStorage.getItem("selectedDate")){
      setPopUp(true);
      return;
    }
    navigate("/MobileReservation/floor");
  };

  return (
    <div className="ScheduleSelect">
      <h2 className="title">
        <FaRegCalendarAlt />
        예약 날짜 선택
      </h2>
      <div className="calendar-wrap">
              <ul className="state">
          <li>
            <span></span>오늘
          </li>
          <li>
            <span></span>예약 가능
          </li> 
          <li>
            <span></span>잔여 수량 없음
          </li>
          <li>
            <span></span>미운영/준비중
          </li>
        </ul>
        <Calendar
          onChange={handleDateChange}
          value={selectedDate}          // 기본값: 세이브 데이터 or 오늘 날짜
          minDate={today}
          maxDate={maxDate}
          defaultActiveStartDate={today}
          view="month"
          maxDetail="month"
          minDetail="month"
          prev2Label={null}
          next2Label={null}
          calendarType="gregory"
          showNeighboringMonth={false}
          formatDay={(locale, date) => moment(date).format("DD")}
          // tileContent={({ date, view }) => {
          //   if (
          //     view === "month" &&
          //     date.getFullYear() === today.getFullYear() &&
          //     date.getMonth() === today.getMonth() &&
          //     date.getDate() === today.getDate()
          //   ) {
          //     return <div className="today-text">오늘</div>;
          //   }
          //   return null;
          // }}
        />

      </div>
      <button className="reserve-btn" onClick={handleReserve}>
        다음으로</button>
      {
        popUp && (
        <div className="popup-wrap">
          <div className="popup">
            <div className="popup-top">
              <PiWarningCircleFill className="warning-sign" />
              <p className="popup-ment1">날짜가 선택되지 않았습니다</p>
              <p className="popup-ment2">날짜 선택 후 이용해 주세요</p>
            </div>
            <button onClick={()=>{setPopUp(false)}}>확인</button>
          </div>
        </div>
        )
      }
    </div>
  );
};

export default ScheduleSelect;
