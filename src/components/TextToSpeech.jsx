//src/components.TextToSpeech.jsx

import React, { useEffect, useState } from "react";

// Make sure Puter.js is available globally via a <script> tag in index.html
// <script src="https://js.puter.com/v2/"></script>

const TextToSpeech = () => {
  const [text, setText] = useState("");
  const [language, setLanguage] = useState("en-US");

  useEffect(() => {
    // Example: fetch text from an API upon component mount
    const fetchText = async () => {
      try {
        const response = await fetch("https://api.example.com/text"); // your API
        const data = await response.json();
        const apiText = data.message || "Hello, world!"; // fallback text
        setText(apiText);

        // Wait for Puter.js to load
        if (window.puter && window.puter.ai?.txt2speech) {
          const audio = await window.puter.ai.txt2speech(apiText, language);
          audio.play();
        } else {
          console.error("Puter.js not loaded or txt2speech unavailable");
        }
      } catch (err) {
        console.error("API or TTS error:", err);
      }
    };

    fetchText();
  }, [language]); // re-run if language changes

  return (
    <div style={{ fontFamily: "sans-serif" }}>
      <h2>Text-to-Speech Demo</h2>
      <p><strong>Fetched text:</strong> {text}</p>

      <select value={language} onChange={(e) => setLanguage(e.target.value)}>
        <option value="en-US">English (US)</option>
        <option value="fr-FR">French</option>
        <option value="de-DE">German</option>
        <option value="es-ES">Spanish</option>
        <option value="it-IT">Italian</option>
      </select>
    </div>
  );
};

export default TextToSpeech;


/*
PUTER.JS
    https://developer.puter.com/tutorials/free-unlimited-text-to-speech-api/

HTML: 
    <body>
        <script src="https://js.puter.com/v2/"></script>
    </body>

FUNCTION:  puter.ai.txt2speech() 

puter.ai.txt2speech("Hello, world! This is text-to-speech using Puter.js.")
    .then((audio) => {
        audio.play();
    });


HTML:
<!-- public/index.html -->
<script src="https://js.puter.com/v2/"></script>


IMPORT ON COMPONENT:
import React from "react";
import ReactDOM from "react-dom";
import TextToSpeech from "./TextToSpeech";

ReactDOM.render(<TextToSpeech />, document.getElementById("root"));

Replace https://api.example.com/text with your actual data source.
You can trigger txt2speech() on demand (e.g. with a button) instead of useEffect if you prefer.
puter.ai.txt2speech() returns an HTMLAudioElement that you can .play() directly.
If your API requires authentication, handle it in the fetch call.
Ensure you don’t hit rate limits by adding throttling or caching if text changes frequently.


TEST:
<html>
<body>
    <script src="https://js.puter.com/v2/"></script>
    <button id="play">Speak with options!</button>
    <script>
        document.getElementById('play').addEventListener('click', ()=>{
            puter.ai.txt2speech(`Hello world! This is using a neural voice.`, {
                voice: "Joanna",
                engine: "neural",
                language: "en-US"
            }).then((audio)=>{
                audio.play();
            });
        });
    </script>
</body>
</html>



<html>
<head>
    <style>
        body { font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; }
        textarea { width: 100%; height: 80px; margin: 10px 0; }
        button { margin: 5px; padding: 10px 15px; cursor: pointer; }
        .standard { background-color: #e3f2fd; }
        .neural { background-color: #f3e5f5; }
        .generative { background-color: #e8f5e8; }
        .status { margin: 10px 0; padding: 5px; font-size: 14px; }
    </style>
</head>
<body>
    <script src="https://js.puter.com/v2/"></script>
    
    <h1>Text-to-Speech Engine Comparison</h1>
    
    <textarea id="text-input" placeholder="Enter text to convert to speech...">Hello world! This is a test of the text-to-speech engines. Notice the difference in quality between standard, neural, and generative engines.</textarea>
    
    <div>
        <button class="standard" onclick="playAudio('standard')">Standard Engine</button>
        <button class="neural" onclick="playAudio('neural')">Neural Engine</button>
        <button class="generative" onclick="playAudio('generative')">Generative Engine</button>
    </div>
    
    <div id="status" class="status"></div>

    <script>
        const textInput = document.getElementById('text-input');
        const statusDiv = document.getElementById('status');
        
        async function playAudio(engine) {
            const text = textInput.value.trim();
            
            if (!text) {
                statusDiv.textContent = 'Please enter some text first!';
                return;
            }
            
            if (text.length > 3000) {
                statusDiv.textContent = 'Text must be less than 3000 characters!';
                return;
            }
            
            statusDiv.textContent = `Converting with ${engine} engine...`;
            
            try {
                const audio = await puter.ai.txt2speech(text, {
                    voice: "Joanna",
                    engine: engine,
                    language: "en-US"
                });
                
                statusDiv.textContent = `Playing ${engine} audio`;
                audio.play();
            } catch (error) {
                statusDiv.textContent = `Error: ${error.message}`;
            }
        }
    </script>
</body>
</html>
*/