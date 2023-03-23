import { useState } from 'react';
import {FiSend, FiMic, FiCornerDownRight, FiRefreshCw} from 'react-icons/fi';
import {Empty} from './components';
import api from './services/api';

function App() {

  const [resposta, setResposta] = useState('');
  const [pergunta, setPergunta] = useState('');

  async function sendQuestion() {
    const {data} = await api.get(`/assistente?question=${pergunta}`);
    const resultText = data.response;

    setResposta(resultText);

  }

  async function onReset() {
    setResposta('');
    setPergunta('');
  }

  return (
    <main className="text-white flex flex-1 flex-col justify-center items-center py-2 w-full">
     <img src="/logo.svg" />
     <p className="text-sky-500 mt-2">código, dúvidas e soluções de bugs em segundos</p>

     <div className='w-full flex justify-center mt-8'>
      <input value={pergunta} onChange={e => setPergunta(e.target.value)} className='p-2 px-4 w-6/12 rounded-md bg-sky-900 text-sm' placeholder="Digite sua pergunta"/>
      <button onClick={sendQuestion} className='p-4 rounded-full bg-purple-500 ml-4'><FiSend /></button>
      <button className='p-4 rounded-full bg-blue-500 ml-3'><FiMic /></button>
     </div>

     {
      !resposta ? (
        <Empty />
      ) : (
        <>
        <div className='w-full flex justify-center  items-center mt-10 bg-gray-700 p-5'>
         <p className='flex flex-row w-9/12 text-left h-auto text-sm'> <FiCornerDownRight size={20} style={{marginRight: 5}}/> {pergunta}</p>
        </div>
         <div className='w-full flex justify-center items-center flex-col mt-5 p-5'>
         <p className='flex flex-row w-9/12 text-left h-auto text-sm text-purple-500'> <FiCornerDownRight size={18} style={{marginRight: 5}}/> Aqui está uma resposta baseada na sua pergunta:</p>

         <p className='flex flex-row w-9/12 text-left h-auto text-sm mt-5 text-white'>{resposta}</p>
        </div>
        </>
      )
     }

     <button onClick={() => onReset()} className='fixed bottom-4 px-4 py-2  flex flex-row justify-center items-center rounded-full bg-gray-700 ml-4 hover:opacity-10'><FiRefreshCw style={{marginRight: 10}}/> Fazer outra pergunta</button>

    </main>
  )
}

export default App
