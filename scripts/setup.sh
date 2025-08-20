#!/bin/bash

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# Function to print colored output
print_color() {
    color=$1
    message=$2
    echo -e "${color}${message}${NC}"
}

# Function to print header
print_header() {
    echo
    print_color "$BLUE" "╔══════════════════════════════════════╗"
    print_color "$BLUE" "║       VibeSaaS Setup Script         ║"
    print_color "$BLUE" "╚══════════════════════════════════════╝"
    echo
}

# Main setup flow
main() {
    print_header
    
    # Check if we're in the right directory
    if [ ! -f "package.json" ]; then
        print_color "$RED" "Error: This script should be run from the project root directory."
        print_color "$YELLOW" "Please navigate to your VibeSaaS project root and run: ./scripts/setup.sh"
        exit 1
    fi
    
    AGENTS_DIR=".claude/agents"
    
    # Check if agents directory exists
    if [ ! -d "$AGENTS_DIR" ]; then
        print_color "$RED" "Error: No .claude/agents directory found."
        exit 1
    fi
    
    # Get model choice from user
    print_color "$YELLOW" "Which model should the agents use?"
    read -p "Enter 'opus' or 'sonnet': " MODEL
    
    # Validate input
    if [[ "$MODEL" != "opus" && "$MODEL" != "sonnet" ]]; then
        print_color "$RED" "Invalid input. Please enter 'opus' or 'sonnet'."
        exit 1
    fi
    
    print_color "$GREEN" "✓ Selected model: $MODEL"
    echo
    
    # Update agents
    print_color "$CYAN" "Updating agents to use $MODEL..."
    echo
    
    updated_count=0
    
    for agent_file in "$AGENTS_DIR"/*.md; do
        if [ -f "$agent_file" ]; then
            filename=$(basename "$agent_file")
            
            # Update the model line using sed
            if [[ "$OSTYPE" == "darwin"* ]]; then
                # macOS version
                sed -i '' "s/^model: .*/model: $MODEL/" "$agent_file"
            else
                # Linux version
                sed -i "s/^model: .*/model: $MODEL/" "$agent_file"
            fi
            
            if [ $? -eq 0 ]; then
                print_color "$GREEN" "  ✓ $filename"
                ((updated_count++))
            else
                print_color "$RED" "  ✗ Failed: $filename"
            fi
        fi
    done
    
    echo
    print_color "$GREEN" "🎉 Updated $updated_count agent(s) to use $MODEL"
    print_color "$YELLOW" "Note: These changes will be tracked by git."
    echo
}

# Run main function
main "$@"