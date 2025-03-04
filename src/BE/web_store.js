import admin from 'firebase-admin';
import { OpenAI } from 'openai';
import readline from 'readline';

// Load from dotenv
import dotenv from 'dotenv';
import { response } from 'express';
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

// Store chat history
const chatHistory = [];  

// FUNCTIONS:
// First, the user's question will be passed to classification(barbaric type, i know)
// Then, it will be passed to corresponding function to execute; include: support
// (for recommendation, question, etc.), action (add item to cart), meme(10+9(to check
// prompt engineering(not quite, i know))), and other(which will declined to be answered)

// User and assistant prompt will also be shorten and put into an array, for cached memory.
// Literally the most token-hungry $h1t i've ever seen and i don't want to touch 
// LangChain. $h1t scarry.

// Prompt-shortening and saving
async function savePrompt(userInput) {

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
    { role: 'system', content: `You are a helpful assistant and your job is to shorten user prompt to store memory and reduced the number of used token. So take the input and shorten it as much as possible and out put it as string` },
    { role: 'user', content: userInput.toString()}
    ]
  });

  // Save chat log
  if (response.choices && response.choices.length > 0 && response.choices[0].message) {
    chatHistory.push({ role: 'user', content: response.choices[0].message.content });
  } else {
    console.error("Unexpected API response:", response);
  }

  return;
}

// Answer-shortening and saving
async function saveAnswer(answer) {

  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [
    { role: 'system', content: `You are a helpful assistant and your job is to shorten your answer to user question, to reduced the number of used token for cached input. So take the input and shorten it as much as possible and output it as string` },
    { role: 'assistant', content: answer.toString()}
    ]
  });

  // Save chat log
  if (response.choices && response.choices.length > 0 && response.choices[0].message) {
    chatHistory.push({ role: 'assistant', content: response.choices[0].message.content });
  } else {
    console.error("Unexpected API response:", response);
  }


  return;
}


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
    { role: 'system', content: `You are a helpful assistant with memory ${chatHistory} that provides support to the user about our store 
      product based on IDs and names: ${fruitDetails}, answer in json and always gives reason why` },
    { role: 'user', content: userInput}
    ]
  });

  // Save chat log and output
  if (response.choices && response.choices.length > 0 && response.choices[0].message) {
    savePrompt(userInput);
    saveAnswer(response.choices[0].message.content); 
    console.log(response.choices[0].message.content);
  } else {
    console.error("Unexpected API response:", response);
  }
  
}


//ACTION FUNCTION
// Get action from OpenAI
async function getAction(userInput) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: "json_object" },
    messages: [
    { role: 'system', content: `You are a helpful assistant with memory ${chatHistory} that help do what the user tell you to do, like 
      putting item to the cart, answer in json, but cureently the action is in development, so tell the customer that` },
    { role: 'user', content: userInput}
    ]
  });

  // Save chat log
  if (response.choices && response.choices.length > 0 && response.choices[0].message) {
    savePrompt(userInput);
    saveAnswer(response.choices[0].message.content);
    console.log(response.choices[0].message.content);
  } else {
    console.error("Unexpected API response:", response);
  }
  
}


//MEME FUNCTION
async function getMeme(userInput) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: "json_object" },
    messages: [
    { role: 'system', content: `You are a funny assistant that tell customer joke or meme. For example, if the customer ask what 10+9 is, 
      tell them it is 21, answer in json` },
    { role: 'user', content: userInput}
    ]
  });

  console.log(response.choices[0].message.content);
}


//OTHER FUNCTION
async function otherFunction(userInput) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: "json_object" },
    messages: [
    { role: 'system', content: `You are a serious assistant and the customer just asked a question that is not in your range, so dont answer, 
      answer in json` },
    { role: 'user', content: userInput}
    ]
  });

  console.log(response.choices[0].message.content);
}


//HANDLE QUESTION
async function classifiedQuestions(userInput) {
  // Exit case
  if (userInput.toLowerCase() === "exit") {
    console.log("Goodbye!");
    rl.close();
    return;
  }

  try {
    // Question classification
    const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
        { role: 'system', content: `You are a bot assistant used to classify questions from the user. Return only ONE of the following words: 
          support/action/meme/other. For example:
          - If the user asks about information or recommendations, return "support".
          - If they need you to put an item in the cart, return "action".
          - If they want a joke/meme, return "meme".
          - Otherwise, return "other".` 
        },
        { role: 'user', content: userInput }
      ]
    });

    const category = response.choices[0].message.content.trim().toLowerCase();
    
    // Route the input to the correct function
    if (category === 'support') await getSupport(userInput);
    else if (category === 'action') await getAction(userInput);
    else if (category === 'meme') await getMeme(userInput);
    else await otherFunction(userInput);
    
  } catch (error) {
    console.error("Error processing request:", error);
  }

  // Ask for the next input
  promptUser();
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
console.log("Chatbot started! Type 'exit' to stop.");

promptUser();

// classifiedQuestions('skibidi rizz sigma ohio');

// create a function to trim and shorten both ai output and user input to lower memory