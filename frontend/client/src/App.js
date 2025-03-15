import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./pages/Authentication/Register";
import Login from "./pages/Authentication/Login";
import Verify from "./pages/Authentication/Verify";
import Home from "./pages/home/Home";
import Header from "./components/Header";
import Portal from "./pages/Portal/tportal/Portal";
import Respontends from "./pages/Portal/respontends/Respontends";
import ResultDataBase from "./pages/Portal/ResultDataBase/ResultDataBase";
import Account from "./pages/Portal/account/Account";
import NewTest from "./pages/Portal/tportal/New test/NewTest";
import Configuration from "./pages/Portal/tportal/configuration/Configuration";
import ForgotPassword from "./pages/Authentication/ForgotPassword";
import VerifyReset from "./pages/Authentication/VerifyRest";
import ResetPassword from "./pages/Authentication/ResetPassword";
import CSVUpload from "./pages/Portal/tportal/configuration/Questionmanager/CsvUpload";
import StudentRegister from "./pages/Authentication/StudentRegister";
import StudentLogin from "./pages/Authentication/StudentLogin";
import StudentTestPage from "./pages/studentTest/StudentTestPage";
import StudentResult from "./pages/studentTest/StudentResult";

function App() {
    return (
        <div className="App">
            <Router>
                
                <Routes>
                    <Route path="/" element={<Home/>}/>
                    <Route path="/portal" element={<Portal />} />
                    <Route path="/respondents" element={<Respontends/>}/>
                    <Route path="/result_data_base" element={<ResultDataBase/>}/>
                    <Route path="/account" element={<Account/>}/>
                    <Route path="/signout" element={<Respontends/>}/>
                    <Route path="/newtest" element={<NewTest/>}/>
                    <Route path="/csv" element={<CSVUpload/>}/>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/verify" element={<Verify />} />
                    <Route path='/register_student' element={<StudentRegister/>}/>
                    <Route path='/login_student' element={<StudentLogin/>}/>
                    <Route path="/forgot_password" element={<ForgotPassword/>}/>
                    <Route path="/verify_reset_code" element={<VerifyReset/>}/>
                    <Route path="/reset_password" element={<ResetPassword/>}/>
                    <Route path="/configuration/:id" element={<Configuration />} />
                    <Route path="/test/:testId" element={<StudentTestPage />} />
                    <Route path="/result/:testId" element={<StudentResult />} />

                    </Routes>
            </Router>
        </div>

    );
}

export default App;
