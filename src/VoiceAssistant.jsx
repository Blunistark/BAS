   // src/VoiceAssistant.jsx
   import { useState } from 'react';
   import PropTypes from 'prop-types';

   const VoiceAssistant = ({ onCommand }) => {
     const [listening, setListening] = useState(false);

     const handleVoiceCommand = () => {
       const recognition = new window.SpeechRecognition();
       recognition.lang = 'en-US';

       recognition.onstart = () => {
         setListening(true);
       };

       recognition.onresult = (event) => {
         const command = event.results[0][0].transcript;
         onCommand(command);
         setListening(false);
       };

       recognition.onerror = () => {
         setListening(false);
       };

       recognition.start();
     };

     return (
       <button onClick={handleVoiceCommand} className="voice-assistant-button">
         {listening ? 'Listening...' : 'Push to Talk'}
       </button>
     );
   };

   VoiceAssistant.propTypes = {
     onCommand: PropTypes.func.isRequired,
   };

   export default VoiceAssistant;