import { useEffect, useState } from "react";
import { getAllseatsByDate, loadZoneSeats } from "../utils/ParkingAPI";
import { useNavigate } from "react-router-dom";
import { PiWarningCircleFill } from "react-icons/pi";
import { FaMapMarkerAlt } from "react-icons/fa";
import { LuListCheck } from "react-icons/lu";

// 전체 구성 순서 요약
// - 선택한 날짜 selectedDate 가져오기 (localStorage)
//   날짜 없으면 alert 띄우고 뒤로 보내기

// - 선택된 구역 상태 저장 (selectedZone)

// - 구역별 잔여 좌석 수 가져오기 (getAllseatsByDate)

// - 특정 구역 클릭 시 자리 상세 데이터 요청 (loadZoneSeats)

// - 구역 상태에 따라 “쾌적/여유/혼잡” 표시

// - 다음 페이지로 이동 (/MobileReservation/parking)

const FloorSelect = ({ userID }) => {
  const navigate = useNavigate();

  //팝업
  const [errorMsg, setErrorMsg] = useState("");
  const [showMsg, setShowMsg] = useState(false);

  //1. selectedDate를 localStorage에서 가져와서 selectedDate로 저장
  const storedDate = localStorage.getItem("selectedDate");
  const selectedDate = storedDate ? new Date(storedDate) : null;

  // 날짜 문자열 포맷 함수
  const getDate = (date) => {
    if (!date) return "";
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekday = date.toLocaleDateString("ko-KR", { weekday: "long" });
    return `${year}년 ${month}월 ${day}일 ${weekday}`;
  };

  //2. 저장된 날짜가 없으면 alert창 띄우고, 날짜 선택 페이지로 이동
  // useEffect(() => {
  //   if (!selectedDate) {
  //     setErrorMsg("잔여석 정보를 불러오는데 실패했습니다");
  //     setShowMsg(true);
  //   }
  // }, []);

  //3. 상태와 로컬스토리지 연결(선택한 구역, 구역 자리 정보)
  const [selectedZone, setSelectedZone] = useState("");
  useEffect(() => {
    const state = localStorage.getItem("selectedZone");
    if (state && zones.includes(state)) {
      setSelectedZone(state);
    }
  }, []);

  //LocalStorage에서 기존 값이 있으면 그걸 불러오고, 없으면 빈 값으로 시작
  const [selectedZoneSeats, setSelectedZoneSeats] = useState(() => {
    const saved = localStorage.getItem("selectedZoneSeats");
    return saved ? JSON.parse(saved) : [];
  }); //해당 구역 자리 정보 배열

  // 선택되는 구역을 A,B,C,D로 저장
  const [zoneStatus, setZoneStatus] = useState({});
  // const [selectedZone, setSelectedZone] = useState(""); //구역 정보 관리(A,B,C,D)
  const zones = ["A", "B", "C", "D"]; //구역 선택용 배열

  // // 컴포넌트가 처음 마운트될 때 로컬스토리지에서 이전 값 가져오기
  // useEffect(() => {
  //   const storedZone = localStorage.getItem("selectedZone");
  //   if (storedZone) {
  //     setSelectedZone(storedZone); // 이전에 선택한 구역을 다시 설정
  //   }
  // }, []);

  // selectedZone 상태 변경 시 로컬스토리지 저장
  useEffect(() => {
    localStorage.setItem("selectedZone", selectedZone);
  }, [selectedZone]);

  // selectedZoneSeats 상태 변경 시 로컬스토리지 저장
  useEffect(() => {
    localStorage.setItem(
      "selectedZoneSeats",
      JSON.stringify(selectedZoneSeats)
    );
  }, [selectedZoneSeats]);

  //4. 구역별 정보를 가져오는 함수(자리보여주기)_성공시 로컬스토리지에 저장
  const listArea = async (selectZone, selectDate, userID) => {
    setSelectedZone(selectZone);
    const { data, error } = await loadZoneSeats(selectZone, selectDate, userID);
    if (error) {
      setErrorMsg("주차 자리 정보 불러오기 실패");
      setSelectedZoneSeats([data.allSeatsData]);
      setShowMsg(true);
      return;
    }
    setSelectedZoneSeats(data);
  };

  //5. 잔여석 정보 불러오기
  //날짜를 한국 날짜로 변환
  const realDate = selectedDate
    ? new Date(selectedDate.getTime() + 9 * 60 * 60 * 1000)
        .toISOString()
        .slice(0, 10)
    : null;

  // 페이지 로드 시 전체 구역의 잔여석 상태를 가져옴
  useEffect(() => {
    //값이 바뀔때마다 코드를 자동으로 실행
    if (!selectedDate) return;

    //함수 정의 : api 불러오기
    const loadZoneStatus = async () => {
      // if( !selectedDate ) return; //날짜가 선택이 안되면 실행 x
      //날짜 잔여석 요청
      const { success, data, error } = await getAllseatsByDate(realDate);
      if (!success || error) {
        setErrorMsg("잔여석 정보를 불러오는데 실패했습니다");
        setShowMsg(true);
        return;
      }
      //잔여석을 불러오는데 성공 시 상태를 저장
      setZoneStatus(data);
    };
    loadZoneStatus();
  }, [realDate]);

  //6. 쾌적/여유/혼잡
  const getZoneStateLabel = (zone) => {
    const data = zoneStatus[zone];
    if (!data) return "정보 없음";

    const remaining = data.available;

    if (remaining >= 18) return "여유";
    if (remaining >= 8) return "보통";
    return "혼잡";
  };

  // 구역 상태에 따라 클래스 이름 반환
  const getZoneStateClass = (zone) => {
    const data = zoneStatus[zone];
    if (!data) return "status-gray";

    const remaining = data.available;

    if (remaining >= 18) return "status-green";
    if (remaining >= 8) return "status-yellow";
    return "status-red";
  };

  //7. ParkingSelect 페이지로 넘어가는 버튼 함수
  const nextbtn = () => {
    // console.log("selectedZone:", selectedZone);
    // console.log("selectedZone at nextbtn:", selectedZone, typeof selectedZone);
    if (!selectedZone || !zones.includes(selectedZone)) {
      setShowMsg(true);
      return;
    }
    navigate("/MobileReservation/parking");
  };

  return (
    <div className="floor-select">
      <div className="top-wrapper">
            <div className="top1">
              <LuListCheck className="calendar-icon" />
              {/* <FaRegCalendarAlt className="calendar-icon" /> */}
              <p>
                {getDate(selectedDate)}
              </p>
            </div>
            <div className="top2">
              <FaMapMarkerAlt className="map-icon" />
              <h2>이용 구역 선택</h2>
            </div>
          </div>
      <div className="floor-wrap-top">
        <div className="top-zone">
          {/* //zones 배열 abcd를 순회하며 list로 받아옴*/}
          <div className="zone-wrap">
            <div className="zone-name">
              <p>↑ DREAMLAND 정문 방향 ↑</p>
              <p className="zone-name">사전 결제 ZONE</p>
            </div>
            <ul>
              {zones.map((list) => {
                const status = zoneStatus[list] || {
                  total: 0,
                  reserved: 0,
                  available: 0,
                };
                return (
                  <li
                    key={list}
                    className={`zone-select ${
                      selectedZone === list ? "on" : ""
                    }`}
                    onClick={() => listArea(list, realDate, userID)}
                  >
                    <div>
                      <span>{list}</span>구역
                    </div>
                    <div>
                      <p>
                        잔여석<span>{status.available}</span>/25
                      </p>
                      <p>
                        <span
                          className={`status-dot ${getZoneStateClass(list)}`}
                        ></span>
                        {getZoneStateLabel(list)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
      {/* <div className="price-info">
            <p className="price-title">요금 안내</p>
            <ul className="price-detail">
              <li>
                <span>최소 1시간</span>
                <span>2,000원</span>
              </li>
              <li>
                <span>이후 30분당</span>
                <span>1,000원</span>
              </li>
              <li>
                <span>일 최대 요금</span>
                <span>15,000원</span>
              </li>
            </ul>
          </div> */}
      <div className="floor-wrap-bottom">
        <button className="next-btn" onClick={nextbtn}>
          다음으로
        </button>
      </div>

      {showMsg && (
        <div className="popup-wrap">
          <div className="popup">
            <div className="popup-top">
              <PiWarningCircleFill className="warning-sign" />
              <p className="popup-ment1">구역이 선택되지 않았습니다</p>
              <p className="popup-ment2">구역 선택 후 이용해 주세요</p>
            </div>
            <button onClick={()=>{setShowMsg(false)}}>확인</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default FloorSelect;
