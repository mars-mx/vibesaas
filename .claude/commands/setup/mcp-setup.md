# MCP Setup Command

You are tasked with setting up MCP (Model Context Protocol) servers for the user. Follow these steps to configure the required servers.

## Required MCP Servers

1. **Upstash Context7 MCP** - Enhanced context management
   - Source: https://smithery.ai/server/@upstash/context7-mcp
   
2. **Zilliz Claude Context** - Vector database integration for context retrieval
   - Source: https://github.com/zilliztech/claude-context
   
3. **Sequential Thinking Server** - Structured problem-solving capabilities
   - Source: https://smithery.ai/server/@smithery-ai/server-sequential-thinking

## Setup Instructions for Claude

When the user requests MCP setup, follow these steps:

### Step 1: Verify Prerequisites
- Check if Node.js is installed: `node --version`
- Check if npm is available: `npm --version`
- Inform the user they need a Smithery account at https://smithery.ai

### Step 2: Guide User to Obtain API Keys

Tell the user they need to:

1. **Smithery API Key** (required for Smithery servers):
   - Navigate to https://smithery.ai
   - Create an account or log in
   - Go to profile/API settings to get their API key

2. **Upstash Credentials** (for Context7):
   - Visit https://console.upstash.com
   - Create a Redis database
   - Obtain REST URL and REST Token

3. **Zilliz Credentials** (for Claude Context):
   - Visit https://cloud.zilliz.com
   - Create a cluster
   - Generate API credentials and note the endpoint

### Step 3: Install MCP Servers via Smithery CLI

Use the Smithery CLI with proper authentication. The user will need to provide their Smithery profile and key:

```bash
# Install Sequential Thinking Server
echo "n" | npx -y @smithery/cli@latest install @smithery-ai/server-sequential-thinking \
  --client claude \
  --profile <user-profile> \
  --key <smithery-api-key>

# Install Upstash Context7 MCP
echo "n" | npx -y @smithery/cli@latest install @upstash/context7-mcp \
  --client claude \
  --profile <user-profile> \
  --key <smithery-api-key>
```

Note: The `echo "n"` is used to automatically respond "no" to the analytics prompt.

### Step 4: Configure Claude Code Settings for Project

Create `.mcp.json` in the project root (NOT in ~/.claude/). This file configures MCP servers at the project level:

```json
{
  "mcpServers": {
    "upstash-context7": {
      "command": "npx",
      "args": ["-y", "@upstash/context7-mcp"],
      "env": {
        "UPSTASH_REST_URL": "<user-upstash-rest-url>",
        "UPSTASH_REST_TOKEN": "<user-upstash-rest-token>"
      }
    },
    "sequential-thinking": {
      "command": "npx",
      "args": [
        "-y", 
        "@smithery/cli@latest", 
        "run", 
        "@smithery-ai/server-sequential-thinking", 
        "--profile", 
        "<user-profile>", 
        "--key", 
        "<smithery-api-key>"
      ],
      "env": {}
    }
  }
}
```

### Step 5: Verify Installation

After configuration:
1. Ask the user to restart Claude Code
2. Check if servers are loaded properly by looking for MCP indicators in the interface
3. Test each server's functionality if possible

## What is .mcp.json?

The `.mcp.json` file is the configuration file that tells Claude Code which MCP servers to load and how to connect to them:

1. **Server Registry**: Defines which MCP servers are available for your project
2. **Connection Config**: Specifies how to launch each server (command, arguments)
3. **Credentials**: Stores environment variables like API keys needed by each server
4. **Project-Level Sharing**: Can be committed to version control so your team uses the same MCP setup

When Claude Code starts in a project with `.mcp.json`:
- It reads the configuration from the project root
- Launches the configured MCP servers in the background
- These servers provide additional capabilities through standardized APIs
- Claude Code will prompt for approval before using project-scoped servers

## Important Notes for Claude

- **Project-Level Config**: Use `.mcp.json` in the project root for Claude Code (not ~/.claude/claude_desktop_config.json)
- **Security**: Never hardcode API keys. Always prompt the user to provide them securely.
- **Smithery CLI Format**: For Smithery-hosted servers, use `npx -y @smithery/cli@latest run` instead of direct package names
- **Sequential Thinking**: Requires full Smithery CLI command with `run` subcommand and authentication parameters
- **Analytics Prompt**: Use `echo "n" |` prefix to bypass the analytics prompt during installation
- **NPX Args**: Use array format for args, each argument as a separate string
- **Error Handling**: If server fails to connect, verify the package exists and Smithery credentials are valid
- **User Confirmation**: Always ask for user confirmation before modifying configuration files.

## Troubleshooting Steps

If setup fails:
1. Check npm registry connectivity: `npm ping`
2. Verify Git is installed for cloning repositories
3. Ensure sufficient disk space for installations
4. Check if firewall/proxy settings block npm or git
5. Try installing with `--verbose` flag for detailed error messages

## After Setup

Once configured, these MCP servers will provide:
- **Context7**: Advanced context management and memory
- **Zilliz**: Vector search and semantic retrieval capabilities
- **Sequential Thinking**: Step-by-step problem decomposition

Inform the user that they can now use enhanced capabilities provided by these MCP servers in their Claude Code sessions.