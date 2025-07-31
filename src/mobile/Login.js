import { useState } from 'react';
import { fetchLogin } from '../utils/ParkingAPI';
import { saveUserInfo } from '../utils/LocalStorage';
import { Link, useNavigate } from 'react-router-dom';
import { PiWarningCircleFill } from 'react-icons/pi';

const Login = () => {
    const navigate = useNavigate();
    const [userID,setUserID] = useState('');
    const [userPw,setUserPw] = useState('');
    const [popUp,setPopUp] = useState(false);
    //로그인 
    const handleLogin = async (e)=>{
        e.preventDefault();
        const {data,error} = await fetchLogin(userID,userPw);
        if(error){
            setPopUp(true);
        }
        if(data){ 
            saveUserInfo(data);
            window.location.href = "/"; // ✅ navigate("/") 대신 새로고침
        }
    }
    return (
        <div id="login-page">
            <div className='login-all-include'>
                <div className='login-logo'>
                    <img className='logo' src={`${process.env.PUBLIC_URL}/images/dreamland_logo1.png`}/>
                </div>
                <form onSubmit={handleLogin}>
                    <input
                        type="text"
                        value={userID}
                        onChange={(e)=>{setUserID(e.target.value)}}
                        placeholder="아이디"
                    />
                    <input
                        type="password"
                        value={userPw}
                        onChange={(e)=>{setUserPw(e.target.value)}}
                        placeholder="비밀번호"
                    />
                    <div className="auto-find">
                        <div className="auto">
                            <input type="checkbox" id="auto-login"/>
                            <label htmlFor="auto-login">자동로그인</label>
                        </div>
                        <div className="find">
                            <Link to="/findid">아이디찾기</Link>
                            <Link to="/findpw">비밀번호찾기/변경</Link>
                        </div>
                    </div>
                    <button className='login-btn' type="submit">로그인</button>
                </form>
                <button className='signup-btn' onClick={()=>{navigate("/agreement")}}>회원가입</button>
                <p className='dream-com'>드림랜드와 함께 편리한 주차를 경험하세요!</p>
                {
                    popUp && (
                        <div className="no-data">
                            <div className="no-data-box">
                                <PiWarningCircleFill />
                                <p>일치하는 회원정보가 없습니다</p>
                                <p className="no-data-bot">회원가입 후 이용해 주세요</p>                          <button onClick={() => setPopUp(false)}>확인</button>
                            </div>
                        </div>
                    )
                }
            </div>
        </div>
    );
};

export default Login;