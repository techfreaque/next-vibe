# AW Launchpad

A tool for managing multiple sub repositories in a single repository without using git submodules.

## Table of Contents

- [Setup](#setup)
- [Available Commands](#available-options)
- [Configuration](#configuration)
- [Contributing](#contributing)
- [License](#license)

## Setup

```bash
npm install pwe-launchpad
```

## Add to your package.json

```json
{
  "scripts": {
    "pad": "pwe-launchpad"
  }
}
```

## Available Options

### Clone Missing Repositories

Clones any repositories defined in the config that don't exist locally. If a repository fails to clone (e.g., due to network issues, invalid URL, or permission problems), the operation will continue with the remaining repositories and report which ones failed.

### Update All Repositories

Updates all repositories (clone missing ones, pull latest changes for existing ones). If any repository fails to clone or update, the operation will continue with the remaining repositories and provide a summary of successes and failures.

### Navigate Folders

Browse through the folder structure and open selected directories in Visual Studio Code.
This is helpful for quick navigation through your repository structure.

## Configuration

Repositories are defined in `launchpad.config.ts`. Each repository entry needs:

- `branch`: The branch to clone/pull
- `repoUrl`: The URL of the git repository

The root repository (launchpad itself) will also be updated when running these commands.

## Contributing

Contributions are welcome! Please feel free to submit a pull request or open an issue to discuss improvements or bugs.

## License

This project is licensed under the MIT License. See the LICENSE file for more details.
