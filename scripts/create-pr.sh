#!/bin/bash

# GitHub PR Creation Tool
# -----------------------
# This script creates a GitHub Pull Request from the current branch
# It can be run from any git repository connected to GitHub

# Configuration
# ------------
# The script uses the following environment variables:
# - GITHUB_TOKEN: Your GitHub Personal Access Token
#   Can be provided in one of these ways:
#   1. As an environment variable: export GITHUB_TOKEN="your-token-here"
#   2. In the project's .env file as GITHUB_TOKEN=your-token-here
#   3. In a file at ~/.github/token

# Function to display usage information
show_usage() {
  echo "GitHub PR Creation Tool"
  echo "----------------------"
  echo "Usage: $0 [options]"
  echo ""
  echo "Options:"
  echo "  -t, --title TITLE       Pull request title (if not provided, will prompt)"
  echo "  -b, --body FILE         File containing PR description (if not provided, will use simple description)"
  echo "  -m, --message MESSAGE   Pull request description as a string"
  echo "  -B, --base BRANCH       Base branch to merge into (default: main)"
  echo "  -d, --draft             Create as draft PR"
  echo "  -o, --open              Open PR in browser after creation"
  echo "  -h, --help              Show this help message"
  echo ""
  echo "Examples:"
  echo "  $0 --title \"Fix navigation bug\" --message \"This PR fixes the navigation issue #42\""
  echo "  $0 --title \"Add new feature\" --body pr-description.md --base development"
  echo ""
}

# Default values
BASE_BRANCH="main"
DRAFT=false
OPEN_IN_BROWSER=false
TITLE=""
BODY=""

# Parse command line arguments
while [[ $# -gt 0 ]]; do
  case $1 in
    -t|--title)
      TITLE="$2"
      shift 2
      ;;
    -b|--body)
      if [ -f "$2" ]; then
        BODY=$(cat "$2")
      else
        echo "Error: Body file $2 not found"
        exit 1
      fi
      shift 2
      ;;
    -m|--message)
      BODY="$2"
      shift 2
      ;;
    -B|--base)
      BASE_BRANCH="$2"
      shift 2
      ;;
    -d|--draft)
      DRAFT=true
      shift
      ;;
    -o|--open)
      OPEN_IN_BROWSER=true
      shift
      ;;
    -h|--help)
      show_usage
      exit 0
      ;;
    *)
      echo "Unknown option: $1"
      show_usage
      exit 1
      ;;
  esac
done

# Get GitHub token - with added .env file support
if [ -z "$GITHUB_TOKEN" ]; then
  # Check for token in .env file
  if [ -f ".env" ]; then
    ENV_TOKEN=$(grep -E "^GITHUB_TOKEN=.+" .env | cut -d'=' -f2-)
    if [ ! -z "$ENV_TOKEN" ]; then
      GITHUB_TOKEN=$ENV_TOKEN
    fi
  fi
  
  # If still not found, check ~/.github/token
  if [ -z "$GITHUB_TOKEN" ] && [ -f "$HOME/.github/token" ]; then
    GITHUB_TOKEN=$(cat "$HOME/.github/token")
  fi
  
  # If still not found, show error
  if [ -z "$GITHUB_TOKEN" ]; then
    echo "No GitHub token found. Please either:"
    echo "1. Set the GITHUB_TOKEN environment variable"
    echo "2. Add GITHUB_TOKEN to the project's .env file"
    echo "3. Create a file at ~/.github/token containing your token"
    exit 1
  fi
fi

# Get repository information
REPO_URL=$(git config --get remote.origin.url)
REPO_URL=${REPO_URL#https://github.com/}
REPO_URL=${REPO_URL#git@github.com:}
REPO_URL=${REPO_URL%.git}
REPO_OWNER=$(echo $REPO_URL | cut -d '/' -f1)
REPO_NAME=$(echo $REPO_URL | cut -d '/' -f2)

# Get current branch
HEAD_BRANCH=$(git symbolic-ref --short HEAD)

# If title is empty, prompt for it
if [ -z "$TITLE" ]; then
  echo -n "PR Title: "
  read TITLE
  if [ -z "$TITLE" ]; then
    echo "Error: PR title is required"
    exit 1
  fi
fi

# If body is empty, generate a simple one
if [ -z "$BODY" ]; then
  BODY="Changes in branch $HEAD_BRANCH"
  COMMITS=$(git log --format="* %s" origin/$BASE_BRANCH..$HEAD_BRANCH)
  if [ ! -z "$COMMITS" ]; then
    BODY+=$'\n\n'
    BODY+="## Commits:"
    BODY+=$'\n'
    BODY+="$COMMITS"
  fi
fi

# Create JSON data for the API request
# Add draft parameter if requested
if [ "$DRAFT" = true ]; then
  JSON_DATA="{\"title\":\"$TITLE\",\"body\":\"$BODY\",\"head\":\"$HEAD_BRANCH\",\"base\":\"$BASE_BRANCH\",\"draft\":true}"
else
  JSON_DATA="{\"title\":\"$TITLE\",\"body\":\"$BODY\",\"head\":\"$HEAD_BRANCH\",\"base\":\"$BASE_BRANCH\"}"
fi

# Create the pull request
echo "Creating PR for $REPO_OWNER/$REPO_NAME"
echo "From branch $HEAD_BRANCH to $BASE_BRANCH"
echo "Title: $TITLE"
echo "----------------------------------"

RESPONSE=$(curl -s -X POST \
  -H "Authorization: token $GITHUB_TOKEN" \
  -H "Accept: application/vnd.github.v3+json" \
  -d "$JSON_DATA" \
  https://api.github.com/repos/$REPO_OWNER/$REPO_NAME/pulls)

# Check if there was an error
if [[ $RESPONSE == *"message"* && $RESPONSE == *"error"* ]]; then
  echo "Error creating PR:"
  echo $RESPONSE | grep -o '"message":"[^"]*"' | cut -d'"' -f4
  exit 1
fi

# Extract PR URL and number
PR_URL=$(echo $RESPONSE | grep -o '"html_url":"[^"]*"' | grep "/pull/" | head -1 | cut -d'"' -f4)
PR_NUMBER=$(echo $RESPONSE | grep -o '"number":[0-9]*' | head -1 | cut -d':' -f2)

if [ -z "$PR_URL" ]; then
  echo "Error: Could not create PR or extract PR URL from response."
  echo "API Response:"
  echo $RESPONSE
  exit 1
fi

echo "✅ Pull request #$PR_NUMBER created successfully!"
echo "PR URL: $PR_URL"

# Open in browser if requested
if [ "$OPEN_IN_BROWSER" = true ]; then
  echo "Opening PR in browser..."
  if [[ "$OSTYPE" == "darwin"* ]]; then
    open $PR_URL
  elif [[ "$OSTYPE" == "linux-gnu"* ]]; then
    xdg-open $PR_URL
  else
    echo "Could not open browser automatically on this OS."
    echo "Please open the URL manually."
  fi
fi 