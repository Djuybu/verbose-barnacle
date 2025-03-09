import OpenAI from "openai";
import db from "../config/db";
import { Fruit } from "./fruit.model";

export class Assistant {
    private API_KEY: string
    private id: string
    private chatHistory: any[]
    private openai: OpenAI
    constructor(id: string) {
      console.log(process.env.OPENAI_API_KEY);
      
        this.openai = new OpenAI({
            apiKey: process.env.OPENAI_API_KEY
        })
        this.id = id;
        this.chatHistory = []
        
    }

    public getAction = async(userInput: string) => {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: { type: "json_object" },
            messages: [
            { role: 'system', content: `You are a helpful assistant with memory ${this.chatHistory} that help do what the user tell you to do, like 
              putting item to the cart, answer in json, but cureently the action is in development, so tell the customer that` + 
            "Please return a JSON with the following structure:{reason, data}" },
            { role: 'user', content: userInput}
            ]
          });
        
          // Save chat log
          if (response.choices && response.choices.length > 0 && response.choices[0].message) {
            this.savePrompt(userInput);
            this.saveAnswer(String(response.choices[0].message.content));
            return response.choices[0].message.content
            console.log(response.choices[0].message.content);
          } else {
            console.error("Unexpected API response:", response);
          }
          
    }

    public getSupport = async(userInput: string, fruitList) => {
        try {
        const fruitDetails = fruitList

        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: { type: "json_object" },
            messages: [
            { role: 'system', content: `You are a helpful assistant with memory ${this.chatHistory} that provides support to the user about our store 
            product based on IDs and names: ${fruitDetails}, answer in valid json without notation and always gives reason why` + "Please follow the sructure of this json:{content:string,data:string}"},
            { role: 'user', content: userInput}
            ]
        });

        if (response.choices && response.choices.length > 0 && response.choices[0].message) {
            this.savePrompt(userInput);
            this.saveAnswer(String(response.choices[0].message.content)); 
            return response.choices[0].message.content
          } else {
            console.error("Unexpected API response:", response);
          }
        } catch (error) {
          throw new Error('error:' + error.message)
        }
    }

    public getMeme = async(userInput: string) => {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            response_format: { type: "json_object" },
            messages: [
            { role: 'system', content: `You are a funny assistant that tell customer joke or meme. For example, if the customer ask what 10+9 is, 
              tell them it is 21, answer in json` },
            { role: 'user', content: userInput}
            ]
          });
          return response.choices[0].message.content
          console.log(response.choices[0].message.content);
    }
    public otherFunction = async(userInput: string) => {
        const response = await this.openai.chat.completions.create({
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
    
    public Chat = async(userInput: string, fruitList) => {
        try {
            // Question classification
            const response = await this.openai.chat.completions.create({
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
            let category;
            if (response.choices && response.choices.length > 0 && response.choices[0].message.content) {
                category = response.choices[0].message.content.trim().toLowerCase();
            }    
            
            // Route the input to the correct function
            
            if (category === 'support') return await this.getSupport(userInput, fruitList);
            else if (category === 'action') return await this.getAction(userInput);
            else if (category === 'meme') return await this.getMeme(userInput);
            else return await this.otherFunction(userInput);
          } catch (error) {
            throw new Error("error:" + error)
          }
    }

    public savePrompt = async(userInput: string) => {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
            { role: 'system', content: `You are a helpful assistant and your job is to shorten user prompt to store memory and reduced the number of used token. So take the input and shorten it as much as possible and out put it as string` },
            { role: 'user', content: userInput.toString()}
            ]
          });
        
          // Save chat log
          if (response.choices && response.choices.length > 0 && response.choices[0].message) {
            this.chatHistory.push({ role: 'user', content: response.choices[0].message.content });
          } else {
            console.error("Unexpected API response:", response);
          }
          return;
    }

    public saveAnswer = async(answer: string) => {
        const response = await this.openai.chat.completions.create({
            model: 'gpt-4o-mini',
            messages: [
            { role: 'system', content: `You are a helpful assistant and your job is to shorten your answer to user question, to reduced the number of used token for cached input. So take the input and shorten it as much as possible and output it as string` },
            { role: 'assistant', content: answer.toString()}
            ]
          });
        
          // Save chat log
          if (response.choices && response.choices.length > 0 && response.choices[0].message) {
            this.chatHistory.push({ role: 'assistant', content: response.choices[0].message.content });
          } else {
            console.error("Unexpected API response:", response);
          }
        
        
          return;
    }
    public getId(){
      return this.id;
    }
}
