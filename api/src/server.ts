import {config} from 'dotenv';
import express, {Router} from 'express';
import cors from 'cors';

const app = express();
const router = Router();

app.use(cors());

config({ path: '.env' });

import {Assistant, EHumor, EModel, memoryRepository} from '@whitebeardit/easy-openai'

const {ChatRepository, MessageRepository} = memoryRepository;
const chatRepository = new ChatRepository();
const messageRepository = new MessageRepository();

const assistente =  new Assistant(chatRepository, messageRepository, {
    humor: EHumor.SARCASTIC,
    name: 'Assistente',
    id: `wb_18927689172398713987`,
    model: EModel['GPT-3.5-TURBO']
});

  assistente.addChat({chat: {
    description: 'My description',
    id: 'myId',
    ownerId: 'Assistente',
    title: 'Conversa com o Assistente',
    updatedAt: new Date().getTime()
}})

router.get('/assistente', async (request, response) => {

  
  const {question} = request.query;
  
  assistente.addMessage({
      chatId: 'myId',
      //@ts-ignore
      content: question,
      ownerId: 'Assistente',
      role: 'user',
  });

  console.log(question);

  const resp = await assistente.sendChat('myId');
  
  response.send({
    response: resp.content,
  });
});

app.use('/', router);

app.listen(3000, () => {
  console.log('servidor rodando na porta 3000');
});