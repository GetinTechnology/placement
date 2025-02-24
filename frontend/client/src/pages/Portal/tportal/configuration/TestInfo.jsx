import PeopleAltOutlinedIcon from '@mui/icons-material/PeopleAltOutlined';
import CheckBoxOutlinedIcon from '@mui/icons-material/CheckBoxOutlined';

function TestInfo() {
  return (
    <div className='testinfo-container'>
        <h4>Test info</h4>
        <div className='testinfo-box'>
        <div>
                <p>Respondents Monitoring</p>
                <span>see more</span>
            </div>
            <div>
                <PeopleAltOutlinedIcon className='testinfo-icon'/>
                <p className='testinfo-icon'>0</p> 
                <p>Active respondents</p>
            </div>
        </div>
        <div className='testinfo-box2'>
            <p>Configuration summary</p>
            <ul>
                <li><CheckBoxOutlinedIcon className='testinfo-icon-1'/>You Can assign test to a category</li>
                <li><CheckBoxOutlinedIcon className='testinfo-icon-1'/>Add Question</li>
                <li><CheckBoxOutlinedIcon className='testinfo-icon-1'/>Random order</li>
                <li><CheckBoxOutlinedIcon className='testinfo-icon-1'/>Test Pass Mark:50%</li>
                <li><CheckBoxOutlinedIcon className='testinfo-icon-1'/>Test "Public Link" access mode</li>
                <li><CheckBoxOutlinedIcon className='testinfo-icon-1'/>Test will activate immediately after all settings are confirmed. Time limit for each question is set to 2 min .</li>
            </ul>
        </div>
    </div>
  )
}

export default TestInfo