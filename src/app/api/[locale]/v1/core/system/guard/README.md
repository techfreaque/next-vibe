# Vibe Guard

🛡️ **Secure development environment with jail-based restrictions**

Vibe Guard creates a secure, restricted development environment that prevents accidental system damage while maintaining full development capabilities. Perfect for VSCode integration and terminal-based development.

## Features

- 🔒 **Secure Environment**: Restricted PATH and command execution
- 🏛️ **Jail-based Security**: Chroot-like restrictions without root privileges
- 🎯 **VSCode Integration**: Automatic terminal profile setup
- 🚫 **Command Blocking**: Prevents dangerous commands (sudo, su, etc.)
- 📁 **Directory Restrictions**: Prevents navigation outside project directory
- ⚡ **Zero Configuration**: Works out of the box with sensible defaults
- 🔧 **Customizable**: Configurable whitelist and security settings

## Installation

### Global Installation (Recommended)

```bash
npm install -g vibe-guard
```

### Using npx (No Installation Required)

```bash
npx vibe-guard
```

## Quick Start

1. **Navigate to your project directory**:

   ```bash
   cd /path/to/your/project
   ```

2. **Start guard environment**:

   ```bash
   vibe-guard
   ```

   This will automatically create the guard environment and start a secure shell.

3. **Open VSCode** and the guard terminal will be available as the default profile.

## Commands

### `vibe-guard` (default)

Start the guard environment. Creates it if it doesn't exist.

### `vibe-guard create`

Create a new guard environment.

- `--project-path <path>`: Specify project path (default: current directory)
- `--force`: Force recreation if environment already exists

### `vibe-guard start`

Start an existing guard environment.

- `--project-path <path>`: Specify project path (default: current directory)

### `vibe-guard status`

Show the status of the guard environment.

- `--project-path <path>`: Specify project path (default: current directory)

### `vibe-guard clean`

Remove the guard environment.

- `--project-path <path>`: Specify project path (default: current directory)

## How It Works

Vibe Guard creates a `.vibe-guard-instance` directory in your project with:

- **Guard Jail** (`guard-jail/`): Contains security configuration and whitelists
- **Temp Directory** (`guard-temp/`): Temporary files for guard operations
- **Guard Script** (`.guard.sh`): The secure shell script that enforces restrictions

### Security Features

- **Restricted PATH**: Only whitelisted binaries are accessible
- **Command Aliases**: Dangerous commands are blocked with helpful messages
- **Directory Restrictions**: Cannot navigate outside the project directory
- **Environment Variables**: Special guard mode indicators

### VSCode Integration

Automatically configures VSCode with:

- Custom terminal profile "Vibe Guard"
- Sets as default terminal profile
- Preserves existing VSCode settings

## Whitelisted Commands

By default, these commands are available in guard mode:

- Basic utilities: `ls`, `cat`, `grep`, `find`, `head`, `tail`, `wc`
- Editors: `vim`, `nano`
- Development: `git`, `node`, `npm`, `yarn`, `pnpm`
- File operations: `tree`

## Directory Structure

```
your-project/
├── .vibe-guard-instance/
│   ├── guard-jail/
│   │   └── whitelist.txt
│   ├── guard-temp/
│   └── .guard.sh
└── .vscode/
    └── settings.json (updated)
```

## Examples

### Basic Usage

```bash
# Start guard in current directory
vibe-guard

# Create guard for specific project
vibe-guard create --project-path /path/to/project

# Check status
vibe-guard status

# Clean up
vibe-guard clean
```

### Development Workflow

```bash
# 1. Navigate to project
cd my-awesome-project

# 2. Start guard (creates environment automatically)
vibe-guard

# 3. You're now in a secure shell
🛡️ guard@my-awesome-project ~/my-awesome-project $ npm install
🛡️ guard@my-awesome-project ~/my-awesome-project $ git status
🛡️ guard@my-awesome-project ~/my-awesome-project $ code .

# 4. Exit guard mode
🛡️ guard@my-awesome-project ~/my-awesome-project $ exit
```

## Requirements

- Node.js >= 18.0.0
- Linux or macOS
- Bash shell

## License

MIT License - see LICENSE file for details.

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## Support

For issues and questions, please visit our [GitHub repository](https://github.com/vibe-dev/vibe-guard).
