const env = require("dotenv").config();
const readLine = require("readline")
const openAI = require("openai");


const client = new openAI()

const rl = readLine.createInterface({
    input: process.stdin,
    output: process.stdout
})

console.log("Hi there! I am your AI assistant. How can I help you today? , type 'exit' to quit.")


const SYSTEM_PROMPT = `
    You are a helpful assistant  .

`





