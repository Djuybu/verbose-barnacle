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

// Store last 10 exchanges
function saveChat(role, content) {
    // Push to chatHistory
    chatHistory.push({ role, content });

    // Keep only last 10 exchanges
    if (chatHistory.length > 10) {
        chatHistory.shift();  // Remove the oldest message
    }
}


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
          { role: 'system', content: "Shorten user prompt while keeping the key details." },
          { role: 'user', content: userInput }
      ]
  });

  if (response.choices?.[0]?.message?.content) {
      saveChat('user', response.choices[0].message.content);
  }
}

// Answer-shortening and saving
async function saveAnswer(answer) {
  const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
          { role: 'system', content: "Shorten the assistant's response while keeping key information." },
          { role: 'assistant', content: answer }
      ]
  });

  if (response.choices?.[0]?.message?.content) {
      saveChat('assistant', response.choices[0].message.content);
  }
}

//SUPPORT FUNCTION
// Fetch fruit IDs and names from Firebase
async function getFruitsFromFirebase() {
  const snapshot = await db.collection('fruit').get();
  return snapshot.docs.map(doc => ({
      fruit_id: doc.id,
      name: doc.data().name
  }));
}

// Get recommendations from OpenAI
async function getSupport(userInput) {
  const fruits = await getFruitsFromFirebase();
  const fruitDetails = fruits.map(fruit => `${fruit.fruit_id} (${fruit.name})`).join(', ');

  const response = await openai.chat.completions.create({
      model: 'gpt-4o-mini',
      messages: [
          { role: 'system', content: `You are a helpful assistant. Use past memory: ${JSON.stringify(chatHistory)}. 
              Provide support about these products: ${fruitDetails}. Answer in JSON.` },
          { role: 'user', content: userInput }
      ]
  });

  // Save responses
  if (response.choices?.[0]?.message?.content) {
      savePrompt(userInput);
      saveAnswer(response.choices[0].message.content);
      console.log(response.choices[0].message.content);
  }
}



//ACTION FUNCTION
// Get action from OpenAI
async function getAction(userInput) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: "json_object" },
    messages: [
    { role: 'system', content: `You are a helpful assistant. Use past memory: ${JSON.stringify(chatHistory)}, 
      that help do what the user tell you to do, like putting item to the cart, answer in json, but cureently 
      the action is in development, so tell the customer that` },
    { role: 'user', content: userInput}
    ]
  });

  // Save responses
  if (response.choices?.[0]?.message?.content) {
    savePrompt(userInput);
    saveAnswer(response.choices[0].message.content);
    console.log(response.choices[0].message.content);
}
  
}


//MEME FUNCTION
async function getMeme(userInput) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: "json_object" },
    messages: [
    { role: 'system', content: `You are a funny assistant that tell customer joke or meme. For example, if 
      the customer ask what 10+9 is, tell them it is 21, answer in json` },
    { role: 'user', content: userInput}
    ]
  });

  console.log(response.choices[0].message.content);
  // No saving for this
}


//OTHER FUNCTION
async function otherFunction(userInput) {
  const response = await openai.chat.completions.create({
    model: 'gpt-4o-mini',
    response_format: { type: "json_object" },
    messages: [
    { role: 'system', content: `You are a serious assistant and the customer just asked a question that is 
      not in your range, so dont answerthe user question, answer in json` },
    { role: 'user', content: userInput}
    ]
  });

  console.log(response.choices[0].message.content);
  // And this
}


//HANDLE  
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
        { role: 'system', content: `You are a bot assistant used to classify questions from the user. 
          Return only ONE of the following words: support/action/meme/other. For example:
          - If the user asks about information or recommendations, return "support".
          - If they need you to put an item in the cart, return "action".
          - If they want a joke/meme, return "meme".
          - Otherwise, return "other".` 
        },
        { role: 'user', content: userInput }
      ]
    });

    const category = response.choices[0].message.content.trim().toLowerCase();
    
    // Route the input to function
    if (category === 'support') await getSupport(userInput);
    else if (category === 'action') await getAction(userInput);
    else if (category === 'meme') await getMeme(userInput);
    else await otherFunction(userInput);
    
  } catch (error) {
    console.error("Error processing request:", error);
  }

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