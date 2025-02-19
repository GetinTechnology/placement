import { useState } from "react";
import Menu from "../../Menu";
import './newtest.css'
import { Container,Row,Col } from "react-bootstrap";
import BasicSettings from "./BasicSettings";
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
                    <Col lg={4}>
                    <div className="tmain-side">
                    <div>
                        <h4>Test Configuration</h4>
                    </div>
                    <div>
                        <h2>Test Progress & Result</h2>
                    </div>
                </div>
                    </Col>
                    <Col lg={8}>
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