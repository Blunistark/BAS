// import './Mission.css'
// function Mission(){
//     return(
//         <>
//             <h1>MISSION INFO</h1>
//         <div className="Mission-card">
//             <p>AND THIS IS ABOUT THE MISSION AND ALL 
//                 THE LONG STUFF AND I WANT TO 
//                 FILL THIS WHOLE TEXT BOX SO U CAN SEE
//                  HOW IT WILL LOOK, AND HERE I 
//                 AM TEXTING FOR NO REASON</p>
//         </div>
//         </>
//     );
// }

// export default Mission


import React from 'react';
import './Mission.css';


function Mission(){
  return (
    <div className="Mission-container">
      <h1 className="Mission-title">MISSION INFO</h1>
      <div className="Mission-cards">
        <div className="Mission-card">
          <h2>HEADING</h2>
          <p>
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam voluptates molestias
             nesciunt deleniti quia odit, consequatur pariatur libero repudiandae accusantium 
             necessitatibus asperiores quod! Cumque hic blanditiis voluptatibus repellendus 
             quibusdam molestias vero omnis facere nam deserunt, sit, eius totam assumenda 
             atque commodi ab sed aspernatur quidem. Reprehenderit quibusdam enim aspernatur
              nemo!
          </p>
        </div>
        <div className="Mission-card">
          <h2>HEADING</h2>
          <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam voluptates molestias
             nesciunt deleniti quia odit, consequatur pariatur libero repudiandae accusantium 
             necessitatibus asperiores quod! Cumque hic blanditiis voluptatibus repellendus 
             quibusdam molestias vero omnis facere nam deserunt, sit, eius totam assumenda 
             atque commodi ab sed aspernatur quidem. Reprehenderit quibusdam enim aspernatur
              nemo!
          </p>
        </div>
        <div className="Mission-card">
          <h2>HEADING</h2>
          <p>
          Lorem ipsum dolor sit amet consectetur adipisicing elit. Ullam voluptates molestias
             nesciunt deleniti quia odit, consequatur pariatur libero repudiandae accusantium 
             necessitatibus asperiores quod! Cumque hic blanditiis voluptatibus repellendus 
             quibusdam molestias vero omnis facere nam deserunt, sit, eius totam assumenda 
             atque commodi ab sed aspernatur quidem. Reprehenderit quibusdam enim aspernatur
              nemo!
          </p>
        </div>
      </div>
      <div className="Mission-action">
      <button className="Microphone-btn">
  <img src='./mic.jpeg' alt="icon" className="button-icon" />
</button>
      </div>
    </div>
  );
};

export default Mission;
