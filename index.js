import dotenv from 'dotenv';
import axios from 'axios';
import readline from 'readline';
import { exec } from 'child_process';
import { OpenAI } from 'openai';
import fs from 'fs';
import path from 'path';


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
  write_file: ({ filePath, content }) => {
    try {
      const fullPath = path.resolve(filePath);
      fs.writeFileSync(fullPath, content, 'utf-8');
      return `Wrote to ${fullPath}`;
    } catch (err) {
      return `Error writing file: ${err.message}`;
    }
  }
};

const SYSTEM_PROMPT = `
You are a helpful AI Assistant who is specialized in resolving user queries.
You work in start,input(optional [user input for more detail in mid way process]) ,  plan, action, observe mode.

For the given user query and available tools,take some inputs form user too what hw need like which stack to work on waht we wanna use for db , what are some default frontend pages what should you add , what will be colour sheming , and other important stuff ... then, plan the step by step execution, based on the planning,
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
- "write_file": Takes a file path and content as input, writes the content to the file, and returns a success message.

Example:
User Query: What is the weather of new york?
Output: { "step": "plan", "content": "The user is interested in weather data of new york" }
Output: { "step": "plan", "content": "From the available tools I should call get_weather" }
Output: { "step": "action", "function": "get_weather", "input": "new york" }
Output: { "step": "observe", "output": "12 Degree Cel" }
Output: { "step": "output", "content": "The weather for new york seems to be 12 degrees." }

Example : 
user Query: I want to create a full-stack todo app with separate frontend and backend folders.
Output: { "step": "plan", "content": "The user wants to create a full-stack todo app with separate frontend and backend folders." }
output:{ "step": "input", "content": "What would you like to name your project folder?" }
output:{ step: "user", content: "todo-app" }
output:{ "step": "input", "content": "Which CSS framework would you prefer for the frontend? (Tailwind / Bootstrap / None)" }
output:{ step: "user", content: "tailwind" }
output:{ "step": "input", "content": "Would you like a specific theme color for your frontend? (e.g., blue, emerald, slate)" }
output:{ step: "user", content: "backgroung black and text while and add button red and del button green" }
output:{ "step": "input", "content": "Would you like to use MongoDB for your backend database? (yes / no)" }
output:{ step: "user", content: "yes" }

Output: { "step": "plan", "content": "Start by creating the root folder with name todo-app and subfolders for frontend and backend." }
Output: { "step": "action", "function": "run_command", "input": "mkdir todo-app && cd todo-app && mkdir frontend backend" }
Output: { "step": "observe", "output": "Created folders: todo-app, todo-app/frontend, and todo-app/backend" }

Output: { "step": "plan", "content": "Next, initialize a Vite project inside the frontend folder using React template." }
Output: { "step": "action", "function": "run_command", "input": "cd todo-app/frontend && npm create vite@latest . -- --template react" }
Output: { "step": "observe", "output": "Vite project created successfully with React template." }

Output: { "step": "plan", "content": "Install required dependencies in the Vite frontend app." }
Output: { "step": "action", "function": "run_command", "input": "cd todo-app/frontend && npm install" }
Output: { "step": "observe", "output": "All npm packages installed." }

Output: { "step": "plan", "content": "Replace the default App.jsx with a basic todo list UI." }
Output: {
  "step": "action",
  "function": "write_file",
  "input": {
    "filePath": "todo-app/frontend/src/App.jsx",
    "content": "import { useState } from 'react';\n\nfunction App() {\n  const [todos, setTodos] = useState([]);\n  const [input, setInput] = useState('');\n\n  const addTodo = () => {\n    if (input.trim()) {\n      setTodos([...todos, input]);\n      setInput('');\n    }\n  };\n\n  return (\n    <div>\n      <h1>Todo App</h1>\n      <input value={input} onChange={(e) => setInput(e.target.value)} />\n      <button onClick={addTodo}>Add</button>\n      <ul>\n        {todos.map((todo, index) => (\n          <li key={index}>{todo}</li>\n        ))}\n      </ul>\n    </div>\n  );\n}\n\nexport default App;"
  }
}
Output: { "step": "observe", "output": "App.jsx replaced with todo UI code." }

Output: { "step": "output", "content": "Your frontend setup for the todo app is complete. It includes a Vite project with a working todo list in App.jsx." }
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
        model: 'gpt-4.1-mini',
        messages: messages,
        response_format: { type: "json_object" },
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
          console.log(`🛠️: Calling Tool: ${parsed.function} with input:`, toolInput);
          const result = await toolFn(toolInput);
          messages.push({ role: 'user', content: JSON.stringify({ step: 'observe', output: result }) });
          continue;
        }
      }

      if(parsed.step === "input"){
        console.log(`💬: ${parsed.content}`);
        const userInput = await new Promise((resolve) => {
          rl.question('> ', (input) => resolve(input));
        });
        messages.push({ role: 'user', content: userInput });
        continue;
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
