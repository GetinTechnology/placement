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

function App() {
    return (
        <div className="App">
            <Router>
      
                <Routes>
                    <Route path="/portal" element={<Portal />} />
                    <Route path="/respondents" element={<Respontends/>}/>
                    <Route path="/result_data_base" element={<ResultDataBase/>}/>
                    <Route path="/account" element={<Account/>}/>
                    <Route path="/signout" element={<Respontends/>}/>
                    <Route path="/newtest" element={<NewTest/>}/>
                    <Route path="/register" element={<Register />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/verify" element={<Verify />} />
                </Routes>
            </Router>
        </div>

    );
}

export default App;
