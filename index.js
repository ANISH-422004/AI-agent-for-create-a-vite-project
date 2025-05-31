import dotenv from 'dotenv';
import axios from 'axios';
import readline from 'readline';
import { exec } from 'child_process';
import { OpenAI } from 'openai';

dotenv.config();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const availableTools = {
  get_weather: async (city) => {
    try {
      const response = await axios.get(`https://wttr.in/${city}?format=%C+%t`);
      return `The weather in ${city} is ${response.data}.`;
    } catch (err) {
      return "Something went wrong";
    }
  },
  run_command: (cmd) => {
    return new Promise((resolve) => {
      exec(cmd, (err, stdout, stderr) => {
        if (err) return resolve(`Error: ${stderr}`);
        resolve(stdout.trim() || "Command executed successfully.");
      });
    });
  },
};

const SYSTEM_PROMPT = `
You are a helpful AI Assistant who is specialized in resolving user queries.
You work in start, plan, action, observe mode.

For the given user query and available tools, plan the step by step execution, based on the planning,
select the relevant tool from the available tool. and based on the tool selection you perform an action to call the tool.

Wait for the observation and based on the observation from the tool call resolve the user query.

Rules:
- Follow the Output JSON Format.
- Always perform one step at a time and wait for next input
- Carefully analyze the user query

Output JSON Format:
{
    "step": "string",
    "content": "string",
    "function": "The name of function if the step is action",
    "input": "The input parameter for the function"
}

Available Tools:
- "get_weather": Takes a city name as an input and returns the current weather for the city
- "run_command": Takes windows command as a string and executes the command and returns the output after executing it.

Example:
User Query: What is the weather of new york?
Output: { "step": "plan", "content": "The user is interested in weather data of new york" }
Output: { "step": "plan", "content": "From the available tools I should call get_weather" }
Output: { "step": "action", "function": "get_weather", "input": "new york" }
Output: { "step": "observe", "output": "12 Degree Cel" }
Output: { "step": "output", "content": "The weather for new york seems to be 12 degrees." }
`;

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

const messages = [
  { role: 'system', content: SYSTEM_PROMPT },
];

const askUser = () => {
  rl.question('> ', async (query) => {
    messages.push({ role: 'user', content: query });

    while (true) {
      const chat = await openai.chat.completions.create({
        model: 'gpt-4.1',
        messages: messages,
        response_format: {type: "json_object"},
      });

      const responseText = chat.choices[0].message.content;
      const parsed = JSON.parse(responseText);
      messages.push({ role: 'assistant', content: responseText });

      if (parsed.step === 'plan') {
        console.log(`🧠: ${parsed.content}`);
        continue;
      }

      if (parsed.step === 'action') {
        const toolFn = availableTools[parsed.function];
        const toolInput = parsed.input;

        if (toolFn) {
          console.log(`🛠️: Calling Tool: ${parsed.function} with input "${toolInput}"`);
          const result = await toolFn(toolInput);
          messages.push({ role: 'user', content: JSON.stringify({ step: 'observe', output: result }) });
          continue;
        }
      }

      if (parsed.step === 'output') {
        console.log(`🤖: ${parsed.content}`);
        break;
      }
    }

    askUser(); // Ask again
  });
};

askUser();
