import { useState } from "react";
import Menu from "../../Menu";
import './newtest.css'
import { Container,Row,Col } from "react-bootstrap";
import BasicSettings from "./BasicSettings";
import {
    SettingsSuggestOutlined as SettingsIcon,
    QuizOutlined as QuizIcon,
    DatasetOutlined as DatasetIcon,
    LockOutlined as LockIcon,
    HomeOutlined as HomeIcon,
    AccessTimeOutlined as TimeIcon,
    EventNoteOutlined as EventIcon,
  } from "@mui/icons-material";
function NewTest() {
    const [isCollapsed, setIsCollapsed] = useState(true);
    return (
        <div>
            <div className={`menu ${isCollapsed ? "collapsed" : ""}`}>
                <Menu toggleSidebar={() => setIsCollapsed(!isCollapsed)} isCollapsed={isCollapsed} />
            </div>
            <Container>
            <div className="tmain">
                <div className="tmain-h">
                <h3> new test</h3>
                </div>
                <div className="tmain-main">
                <Row>
                     <Col className="cmain-c" lg={3}>
                                      <button>Setup in Progress</button>
                                      <div>
                                        <p>Test Configuration</p>
                                        <div className="cmain-c-box2">
                                          <ul>
                                            {[
                                              ["Basic Settings", <SettingsIcon className="c-icon" />],
                                              ["Question Manager", <QuizIcon className="c-icon" />],
                                              ["Test Sets", <DatasetIcon className="c-icon" />],
                                              ["Test Access", <LockIcon className="c-icon" />],
                                              ["Test Start Page", <HomeIcon className="c-icon" />],
                                              ["Grading and Summary", <EventIcon className="c-icon" />],
                                              ["Time Setting", <TimeIcon className="c-icon" />],
                                            ].map(([label, icon]) => (
                                              <li key={label}>
                                                {icon} {label}
                                              </li>
                                            ))}
                                            <li>Activate Test</li>
                                          </ul>
                                        </div>
                                      </div>
                                    </Col>
                    <Col lg={9}>
                    <div className="tmain-m">
                   <BasicSettings/>
                </div>
                    </Col>
                </Row>
                </div>
          

           
            </div>

            </Container>
      
        </div>
    )
}

export default NewTest