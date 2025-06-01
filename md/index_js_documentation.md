# index.js Documentation

## Overview
This file sets up and runs an AI assistant that interacts with the user and uses several available tools to handle commands.

## Environment Setup
- Loads environment variables using dotenv.
- Initializes OpenAI API with an API key from environment variables.

## Available Tools
- **get_weather(city):** Fetches weather information for the given city using an external API.
- **run_command(cmd):** Executes shell commands and returns the output.
- **write_file({filePath, content}):** Writes content to the specified file path.

## Main Workflow
- Uses readline to interact with the user via the command line.
- Maintains a chat history with system instructions and user-assistant messages.
- Sends messages to OpenAI's GPT-4.1-mini model in a JSON format.
- Parses responses and takes actions such as calling tool functions.

## Error Handling
- Each tool has basic error handling to report issues.

## Usage
Run this script with the necessary environment variables (OPENAI_API_KEY) set to start the AI assistant.
