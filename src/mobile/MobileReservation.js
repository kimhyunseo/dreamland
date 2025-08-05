import { useEffect, useState } from "react";
import { Route, Routes, useLocation } from "react-router-dom";
import ScheduleSelect from "./ScheduleSelect";
import FloorSelect from "./FloorSelect";
import ParkingSelect from "./ParkingSelect";
import ReservesTime from "./ReservesTime";
import ReservesAllDay from "./ReservesAllDay";
import ReservationPayment from "./ReservationPayment";
import CompleteReservation from "./CompleteReservation";
import ProgressBar from "./ProgressBar";

const MobileReservation = () => {
  const location = useLocation(); // 현재 경로 확인
  const [finalAmount, setFinalAmount] = useState(0);
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedZone, setSelectedZone] = useState(null);
  const [selectedZoneSeats, setSelectedZoneSeats] = useState([]);
  const [selectSeatID, setSelectSeatID] = useState(null);
  const [selectedStartTime, setSelectStartTime] = useState(null);
  const [selectedEndTime, setSelectEndTime] = useState(null);
  const [selectedTime, setSelectTime] = useState(null);
  const [selectedTotal, setSelectTotal] = useState(0);

  const reservationState = {
    selectedDate,
    setSelectedDate,
    selectedZone,
    setSelectedZone,
    selectedZoneSeats,
    setSelectedZoneSeats,
    selectSeatID,
    setSelectSeatID,
    selectedStartTime,
    setSelectStartTime,
    selectedEndTime,
    setSelectEndTime,
    selectedTime,
    setSelectTime,
    selectedTotal,
    setSelectTotal,
  };

  // complete 경로일 때는 진행 바 숨김
  const hideProgressBar = location.pathname.includes("complete");

  return (
    <>
      {!hideProgressBar && <ProgressBar />}
      <Routes>
        <Route path="schedule" element={<ScheduleSelect reservation={reservationState} />} />
        <Route path="floor" element={<FloorSelect reservation={reservationState} />} />
        <Route path="parking" element={<ParkingSelect reservation={reservationState} />} />
        <Route path="Time" element={<ReservesTime reservation={reservationState} />} />
        <Route path="AllDay" element={<ReservesAllDay reservation={reservationState} />} />
        <Route path="payment" element={<ReservationPayment reservation={reservationState} setFinalAmount={setFinalAmount} />} />
        <Route path="complete" element={<CompleteReservation reservation={reservationState} finalAmount={finalAmount} />} />
      </Routes>
    </>
  );
};

export default MobileReservation;
