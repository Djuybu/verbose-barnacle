import admin from 'firebase-admin';
import { OpenAI } from 'openai';

// Load from dotenv
import dotenv from 'dotenv';
dotenv.config();

// Initialize Firebase Admin SDK
admin.initializeApp({
    credential: admin.credential.cert('./serviceAccountKey.json'),
    databaseURL: process.env.database_URL

});

const db = admin.firestore();

// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: process.env.OPENAI_API_KEY
});

// FUNCTIONS:
// First, the user's question will be passed to classification(barbaric type, i know)
// Then, it will be passed to corresponding function to execute; include: support
// (for recommendation, question, etc.), action (add item to cart), meme(10+9(to check
// prompt engineering(not quite, i know))), and other(which will declined to be answered)


//SUPPORT FUNCTION
// Fetch fruit IDs and names from Firebase
async function getFruitsFromFirebase() {
  const snapshot = await db.collection('fruit').get();
  const fruits = snapshot.docs.map(doc => ({
      fruit_id: doc.id,  // Document ID is the fruit_id
      name: doc.data().name // Assume each document has a 'name' field
  }));
  return fruits;
}

// Get recommendations from OpenAI
async function getSupport(Input) {
  // Prepare the data for the prompt (fruit_id and name)
  const fruits = await getFruitsFromFirebase();
  const userInput = Input;
  const fruitDetails = fruits.map(fruit => `${fruit.fruit_id} (${fruit.name})`).join(', ');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
    { role: 'system', content: `You are a helpful assistant that provides support to the user about our store product based on IDs and names: ${fruitDetails}, 
      answer in a content of a json file and always gives reason why` },
    { role: 'user', content: userInput,store: true, stream: true, }
    ]
  });

  const recommendations = response.choices.map(choice => choice.message.content).join("\n");
  console.log(recommendations);
}


//ACTION FUNCTION
// Get action from OpenAI
async function getAction(Input) {
  // Prepare the data for the prompt (fruit_id and name)
  const userInput = Input;
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
    { role: 'system', content: `You are a helpful assistant that help do what the user tell you to do, like putting item to the cart, answer in a content of a json file, but cureently the action is in development, so tell the customer that` },
    { role: 'user', content: userInput,store: true, stream: true, }
    ]
  });

  const recommendations = response.choices.map(choice => choice.message.content).join("\n");
  console.log(recommendations);
}


//MEME FUNCTION
async function getMeme(Input) {
  // Prepare the data for the prompt (fruit_id and name)
  const userInput = Input;
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
    { role: 'system', content: `You are a funny assistant that tell customer joke or meme. For example, if the customer ask what 10+9 is, tell them it is 21` },
    { role: 'user', content: userInput,store: true, stream: true, }
    ]
  });

  const recommendations = response.choices.map(choice => choice.message.content).join("\n");
  console.log(recommendations);
}


//OTHER FUNCTION
async function otherFunction(Input) {
  // Prepare the data for the prompt (fruit_id and name)
  const userInput = Input
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
    { role: 'system', content: `You are a cocky assistant and the customer just asked a question that is not in your range, so dont answer` },
    { role: 'user', content: userInput,store: true, stream: true, }
    ]
  });

  const recommendations = response.choices.map(choice => choice.message.content).join("\n");
  console.log(recommendations);
}


//HANDLE QUESTION
async function classifiedQuestions(input) {
  const userInput = input
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
    { role: 'system', content: `You are a bot assistant used to classified question from user, return question with only 1 of the following word: support/action/meme/other. for example 
      if the user ask about infomation on certain item or need recommendation on item, return support. if they need you to put item into cart, return action. if they want you to tell a 
      joke or ask you about something meme related, return meme, and the rest goes into other` },
    { role: 'user', content: userInput,store: true, stream: true, }
    ]
  });

  const recommendations = response.choices.map(choice => choice.message.content).join("\n");
  if(recommendations=='support'){
    getSupport(userInput);
  }else if(recommendations=='action'){
    getAction(userInput);
  }else if(recommendations=='meme'){
    getMeme(userInput);
  }else{
    otherFunction(userInput);
  }
}


classifiedQuestions('can you give me the top 5 fruit in your store?');
