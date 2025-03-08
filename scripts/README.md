# Mekanik Development Scripts

This directory contains reusable scripts for Mekanik development workflow.

## Available Scripts

### `create-pr.sh` - GitHub Pull Request Creation Tool

A flexible script for creating pull requests from the command line.

#### Setup

1. Provide your GitHub token in one of these ways:
   - Set an environment variable: `export GITHUB_TOKEN="your-token-here"`
   - Add to your project's `.env` file: `GITHUB_TOKEN=your-token-here`
   - Create a file at `~/.github/token` containing just your token

#### Usage

```bash
./scripts/create-pr.sh [options]
```

#### Options

- `-t, --title TITLE` - Pull request title
- `-m, --message MESSAGE` - Pull request description
- `-b, --body FILE` - File containing PR description
- `-B, --base BRANCH` - Base branch to merge into (default: main)
- `-d, --draft` - Create as draft PR
- `-o, --open` - Open PR in browser after creation
- `-h, --help` - Show help message

#### Examples

Create a PR with a title and message:
```bash
./scripts/create-pr.sh --title "Add new feature" --message "This implements the new feature X"
```

Create a PR using a description from a file and open it in browser:
```bash
./scripts/create-pr.sh --title "Fix bugs" --body pr-description.md --open
```

Create a draft PR to a different base branch:
```bash
./scripts/create-pr.sh --title "WIP: New feature" --base development --draft
```

If you don't provide a title, the script will prompt you to enter one interactively. 