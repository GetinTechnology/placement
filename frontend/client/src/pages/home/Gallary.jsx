import g1 from '../../images/galleryimg1.webp'
import g2 from '../../images/g11.webp'
import g3 from '../../images/g12.webp'
import g4 from '../../images/g13.webp'
import g5 from '../../images/g14.webp'
import g6 from '../../images/g15.webp'
import g7 from '../../images/gi10.webp'
import g8 from '../../images/gi2.webp'
import g9 from '../../images/gi3.webp'
import g10 from '../../images/gi4.webp'
import g11 from '../../images/gi5.webp'
import g12 from '../../images/gi6.webp'
import g13 from '../../images/gi7.webp'
import g14 from '../../images/gi8.webp'
import g15 from '../../images/gi9.webp'
import { Container } from 'react-bootstrap'
import './home.css'

import React from 'react'

function Gallary() {
  return (
    <div className='Gallery'>
    <Container>
    <div class="parent">
    <div class="div1">
      <img src={g1} alt="" />
    </div>
    <div class="div2">
    <img src={g2} alt="" />

    </div>
    <div class="div3">
    <img src={g3} alt="" />

    </div>
    <div class="div4">
    <img src={g4} alt="" />

    </div>
    <div class="div5">
    <img src={g5} alt="" />

    </div>
    <div class="div6">
    <img src={g6} alt="" />

    </div>
    <div class="div7">
    <img src={g7} alt="" />

    </div>
    <div class="div8">
    <img src={g8} alt="" />

    </div>
    <div class="div9">
    <img src={g9} alt="" />

    </div>
    <div class="div10">
    <img src={g10} alt="" />

    </div>
    <div class="div11">
    <img src={g11} alt="" />

    </div>
    <div class="div12">
    <img src={g12} alt="" />

    </div>
    <div class="div13">
    <img src={g13} alt="" />

    </div>
    <div class="div14">
    <img src={g14} alt="" />

    </div>
</div>
    

   
    </Container>
  </div>
  )
}

export default Gallary