import { spawn } from 'child_process';

// Test the MCP server by spawning it and sending requests
const server = spawn('node', ['dist/index.js'], {
  stdio: ['pipe', 'pipe', 'inherit']
});

// Test: List tools
const listToolsRequest = {
  jsonrpc: "2.0",
  id: 1,
  method: "tools/list"
};

// Test: Search modules
const searchRequest = {
  jsonrpc: "2.0",
  id: 2,
  method: "tools/call",
  params: {
    name: "search_modules",
    arguments: {
      query: "CS1010"
    }
  }
};

// Send requests
server.stdin.write(JSON.stringify(listToolsRequest) + '\n');
server.stdin.write(JSON.stringify(searchRequest) + '\n');

// Handle responses
server.stdout.on('data', (data) => {
  console.log('Response:', data.toString());
});

server.on('close', (code) => {
  console.log(`Server exited with code ${code}`);
});

// Close after 5 seconds
setTimeout(() => {
  server.kill();
}, 5000);