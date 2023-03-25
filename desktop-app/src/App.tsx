import { useEffect, useRef, useState } from 'react';
import {FiSend, FiMic, FiCornerDownRight, FiRefreshCw} from 'react-icons/fi';

import 'regenerator-runtime/runtime';

import {Empty, Loader} from './components';
import SpeechRecognition, { useSpeechRecognition } from "react-speech-recognition";

import api from './services/api';
import { removeAccent } from './utils';

function App() {

  const { transcript, resetTranscript } = useSpeechRecognition();

  const [resposta, setResposta] = useState('');
  const [pergunta, setPergunta] = useState('');

  const [loading, setLoading] = useState(false);
  const [micEnable, setMicEnable] = useState(false);

  const microphoneRef = useRef(null);

  const startSpeechRecognition = () => {
    handleReset();
    
     setMicEnable(true);
      //@ts-ignore
      microphoneRef?.current.classList.add("listening");
    
    
    SpeechRecognition.startListening({
      continuous: true,
      language: 'pt-BR'
    });
  }

  const stopHandle = () => {
    setMicEnable(false);
    //@ts-ignore
    microphoneRef.current.classList.remove("listening");
    SpeechRecognition.stopListening();
  };

  const handleReset = () => {
    stopHandle();
    resetTranscript();
  };

  useEffect(() => {
      const splitted = transcript.split(' ');
      
      if(splitted[splitted.length - 1] === 'enviar') {
        sendQuestion();
      } else {
        setPergunta(transcript);

      }
  
    console.log(transcript);
  }, [transcript]);  

  async function sendQuestion() {

    if(!pergunta) {
      alert('Preencha o campo de pergunta primeiro :)');
      return;
    }

    stopHandle();
    setLoading(true);

    const perguntaPTBR = pergunta + ' em portugues';

    const {data} = await api.get(`/assistente?question=${removeAccent(perguntaPTBR)}`);
    const resultText = data.response;

    setResposta(resultText);

    setLoading(false);

  }

  async function onReset() {
    setResposta('');
    setPergunta('');
  }

  useEffect(() => {
    function handlePress(event: any) {
   
        if (event.key === ' ') {
          event.preventDefault();
          micEnable ? stopHandle() : startSpeechRecognition();
        }   

        removeEventListener('keydown', handlePress);
      
    }
    addEventListener('keydown',  handlePress);
  }, [micEnable]);

  return (
    <main className="text-white flex flex-1 flex-col justify-center items-center py-2 w-full">
     <img src="/logo.svg" />

     <div className='w-full flex justify-center mt-8'>
      <input value={pergunta} onChange={e => setPergunta(e.target.value)} className='p-2 px-4 w-6/12 rounded-md bg-sky-900 text-sm' placeholder="Descreva o que precisa"/>
      <button onClick={sendQuestion} className='p-4 rounded-full bg-purple-500 ml-4'>{loading ? <Loader /> : <FiSend />}</button>
      <button ref={microphoneRef} onClick={micEnable ? stopHandle: startSpeechRecognition} className='p-4 rounded-full bg-blue-500 ml-3'><FiMic className={micEnable ? 'animate-bounce' : ''}/></button>
     </div>

     {
      !resposta ? (
        <Empty />
      ) : (
        <>
        <div className='w-full flex justify-center  items-center mt-10 bg-gray-700 p-5'>
         <p className='flex flex-row w-9/12 text-left h-auto text-sm break-all'> <FiCornerDownRight size={20} style={{marginRight: 5}}/> {pergunta}</p>
        </div>
         <div className='w-full flex justify-center items-center flex-col mt-5 p-5'>
         <p className='flex flex-row w-9/12 text-left h-auto text-sm text-purple-500'> <FiCornerDownRight size={18} style={{marginRight: 5}}/> Aqui está uma resposta baseada na sua pergunta:</p>

         <p className='flex flex-row w-9/12 text-left h-auto text-sm mt-5 text-white break-all'>{resposta}</p>
        </div>
        </>
      )
     }

     <button onClick={() => onReset()} className='fixed bottom-4 px-4 py-2  flex flex-row justify-center items-center rounded-full bg-gray-700 ml-4 hover:opacity-10'><FiRefreshCw style={{marginRight: 10}}/> Fazer outra pergunta</button>

    </main>
  )
}

export default App
