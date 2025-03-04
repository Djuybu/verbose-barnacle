import db from "../config/db"
import { OpenAI } from 'openai';
import readline from 'readline';

// Load from dotenv
import dotenv from 'dotenv';
dotenv.config();



// Initialize OpenAI API
const openai = new OpenAI({
    apiKey: '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'
});

// Store chat history
const chatHistory = [];  

// FUNCTIONS:
// First, the user's question will be passed to classification(barbaric type, i know)
// Then, it will be passed to corresponding function to execute; include: support
// (for recommendation, question, etc.), action (add item to cart), meme(10+9(to check
// prompt engineering(not quite, i know))), and other(which will declined to be answered)




//SUPPORT FUNCTION
// Fetch fruit IDs and names from Firebase
async function getFruitsFromFirebase() {
  const snapshot = await db.collection('fruit').get();
  return snapshot.docs.map(doc => ({
      fruit_id: doc.id,  // Document ID is the fruit_id
      name: doc.data().name // Assume each document has a 'name' field
  }));
}

// Get recommendations from OpenAI
async function getSupport(userInput) {
  // Prepare the data for the prompt (fruit_id and name)
  const fruits = await getFruitsFromFirebase();
  const fruitDetails = fruits.map(fruit => `${fruit.fruit_id} (${fruit.name})`).join(', ');

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: "json_object" },
    messages: [
    { role: 'system', content: `You are a helpful assistant that provides support to the user about our store product based on IDs and names: ${fruitDetails}, 
      answer in json and always gives reason why in Vietnamese` },
    { role: 'user', content: userInput}
    ]
  });

  // Save chat log
  chatHistory.push({ role: 'assistant', content: response });

  console.log(response.choices[0].message.content);
}


//ACTION FUNCTION
// Get action from OpenAI
async function getAction(userInput) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: "json_object" },
    messages: [
    { role: 'system', content: `You are a helpful assistant that help do what the user tell you to do, like putting item to the cart, answer in json, but cureently the action is in development, so tell the customer that` },
    { role: 'user', content: userInput}
    ]
  });

  // Save chat log
  chatHistory.push({ role: 'assistant', content: response });

  console.log(response.choices[0].message.content);
}


//MEME FUNCTION
async function getMeme(userInput) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: "json_object" },
    messages: [
    { role: 'system', content: `You are a funny assistant that tell customer joke or meme. For example, if the customer ask what 10+9 is, tell them it is 21, answer in json` },
    { role: 'user', content: userInput}
    ]
  });

  // Save chat log
  chatHistory.push({ role: 'assistant', content: response });

  console.log(response.choices[0].message.content);
}


//OTHER FUNCTION
async function otherFunction(userInput) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: "json_object" },
    messages: [
    { role: 'system', content: `You are a serious assistant and the customer just asked a question that is not in your range, so dont answer, answer in json` },
    { role: 'user', content: userInput}
    ]
  });

  // Save chat log
  chatHistory.push({ role: 'assistant', content: response });

  const recommendations = response.choices.map(choice => choice.message.content).join("\n");
  console.log(recommendations);
}


//HANDLE QUESTION
async function classifiedQuestions(userInput) {
  // Exit case
  if (userInput.toLowerCase() === "exit") {
    console.log("Goodbye!");
    rl.close();
    return;
  }

  
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
    { role: 'system', content: `You are a bot assistant used to classified question from user, return question with only 1 of the following word: support/action/meme/other. for example 
      if the user ask about infomation on certain item or need recommendation on item, return support. if they need you to put item into cart, return action. if they want you to tell a 
      joke or ask you about something meme related, return meme, and the rest goes into other` },
    { role: 'user', content: userInput}
    ]
  });

  // Save chat log
  chatHistory.push({ role: 'user', content: userInput });

  const recommendations = response.choices[0].message.content.trim().toLowerCase();
  
  if(recommendations=='support') await getSupport(userInput);
  else if(recommendations=='action') await getAction(userInput);
  else if(recommendations=='meme') await getMeme(userInput);
  else await otherFunction(userInput);
  
  promptUser(); // Ask for next input
}

// Create a readline interface for user input
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

// Function to prompt the user continuously
function promptUser() {
  rl.question("You: ", classifiedQuestions);
}

// Start the chatbot
function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}
sleep(2000).then(() => console.log("Chatbot started! Type 'exit' to stop."));

promptUser();

// classifiedQuestions('skibidi rizz sigma ohio');
