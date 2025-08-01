import { Route, Routes } from "react-router-dom";
import { useState } from "react";
import MainPageD from "../desktop/MainPageD";
import Layout from "../desktop/Layout";
import MyPage from "../components/MyPage/MyPage";
import Login from "../mobile/Login";
import MobileReservation from "../mobile/MobileReservation";
import ChangedPw from "../mobile/ChangedPw";
import ResetPw from "../mobile/ResetPw";
import FindPW from "../mobile/FindPW";
import FindIDNo1 from "../mobile/FindIDNo1";
import FindID from "../mobile/FindID";
import SignUpComplete from "../mobile/SignUpComplete";
import AgreeMent from "../mobile/AgreeMent";
import IntroMobile from "../mobile/IntroMobile";
import Information from "../mobile/Information";
import SignUp from "../mobile/SignUp";

const DesktopPage = () => {
  const [userID, setUserID] = useState("");
  const [id,setId] = useState(null);

  return (
    <div className="desktop-page">
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<MainPageD />} />
          <Route path="/login" element={<Login />} />
          <Route path="/mypage/*" element={<MyPage />} />
          <Route path="/agreement" element={<AgreeMent />} />
          <Route path="/signup" element={<SignUp/>}/>
          <Route path="/signupComplete" element={<SignUpComplete />} />
          <Route path="/findid" element={<FindID setUserID={setUserID} />} />
          <Route path="/findidno1" element={<FindIDNo1 userID={userID} />} />
          <Route path="/findpw" element={<FindPW setID={setId} />} />
          <Route path="/findpw/resetpw" element={<ResetPw ID={id} />} />
          <Route path="/findpw/changedpw" element={<ChangedPw />} />
          <Route path="MobileReservation/*" element={<MobileReservation />} />
          <Route path="/intro" element={<IntroMobile />} />
          <Route path="/information" element={<Information />} />
        </Route>
      </Routes>
    </div>
  );
};

export default DesktopPage;
