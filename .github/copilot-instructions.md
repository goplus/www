# XGo Language Website (https://xgo.dev)

**ALWAYS reference these instructions first and fallback to search or bash commands only when you encounter unexpected information that does not match the info here.**

This repository contains the XGo language website infrastructure with two main components:
1. **XGo Playground Service** - A web service similar to play.golang.org for running XGo code
2. **Next.js Website** - The main xgo.dev website with documentation and interactive features

## Working Effectively

### Bootstrap and Build Process
Always run these commands in order to set up a working development environment:

```bash
# 1. Build the XGo playground (from repository root)
go install ./playground
# TIMING: Takes 20-30 seconds. NEVER CANCEL. Set timeout to 60+ seconds.

# 2. Build the Next.js website
cd goplus.org
npm install
# TIMING: Takes 60-90 seconds. NEVER CANCEL. Set timeout to 120+ seconds.
npm run build
# TIMING: Takes 15-30 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
```

### Development Workflow

#### Next.js Website Development
```bash
cd goplus.org
npm run dev
# Starts development server on http://localhost:3000
# Server starts in 1-2 seconds and auto-reloads on file changes
```

#### XGo Playground Development
```bash
# Build from repository root (playground imports are relative to root module)
go install ./playground
```

**IMPORTANT**: The playground component must be built from the repository root, not from the `playground/` subdirectory. The root directory contains a Go module but no main packages - only subdirectories like `playground/` contain buildable code.

### Testing and Quality Assurance

#### Go Tests
```bash
# From repository root
go test -race -v ./...
# TIMING: Takes 30-45 seconds. NEVER CANCEL. Set timeout to 60+ seconds.
# NOTE: Some test failures are expected (intentionally malformed test functions for testing)
```

#### Next.js Linting
```bash
cd goplus.org
npm run lint
# TIMING: Takes 1-3 seconds. Always runs clean.
```

### Build Validation
Before committing changes, ALWAYS run these validation steps:

```bash
# 1. Validate XGo playground build works
go install ./playground

# 2. Validate Next.js build works
cd goplus.org
npm run build

# 3. Validate linting passes
npm run lint

# 4. Test development server starts
npm run dev
# Verify http://localhost:3000 returns HTTP 200, then stop server
```

## Manual Validation Scenarios

**CRITICAL**: After making any changes, you MUST manually test these scenarios:

### Website Functionality Testing
1. **Start development server**: `cd goplus.org && npm run dev`
2. **Access homepage**: Navigate to http://localhost:3000 and verify it loads without errors
3. **Test code editor**: Navigate to http://localhost:3000/dev/code and verify the Monaco editor loads
4. **Check widget builds**: Ensure `npm run build:widgets` completes without errors

### Go Module Testing  
1. **Build all components**: `go install ./playground` must complete successfully
2. **Run subset tests**: Some tests in `playground/` will fail due to intentionally malformed test names - this is expected

## Timing Expectations and Timeouts

**NEVER CANCEL these long-running commands. Always wait for completion:**

| Command | Expected Time | Minimum Timeout |
|---------|---------------|-----------------|
| `go install ./playground` | 20-30 seconds | 60 seconds |
| `npm install` (goplus.org) | 60-90 seconds | 120 seconds |
| `npm run build` (goplus.org) | 15-30 seconds | 60 seconds |
| `go test -race -v ./...` | 30-45 seconds | 60 seconds |
| `npm run lint` | 1-3 seconds | 10 seconds |

## Known Issues and Workarounds

### Go Module Structure Quirks
- **Problem**: `go install ./...` shows "matched no packages" warning
- **Status**: Normal - the root directory has no main packages, only subdirectories do
- **Solution**: Build specific components: `go install ./playground`
- **Explanation**: The root module defines dependencies but contains no buildable code itself

### Docker Build Issues
- **Problem**: `make docker` in playground/ fails due to certificate/network issues
- **Status**: Does not work in CI/sandbox environments
- **Workaround**: Use local Go builds instead: `go install ./playground`
- **Do not attempt Docker builds** - they require Google Cloud authentication and certificates

### Node.js Version Warnings
- **Problem**: package.json requires Node >=22.0.0, but older versions available
- **Status**: Works with warnings on Node 20.x
- **Expected Output**: `npm warn EBADENGINE Unsupported engine` - this is safe to ignore
- **Workaround**: Continue with installation despite warnings

### Test Failures in Playground
- **Problem**: Tests fail with "TestisNotATest has malformed name" 
- **Status**: Intentional - these are test cases for the test detection logic
- **Expected**: Some playground tests are designed to fail
- **Action**: Ignore these specific test failures

### Security Vulnerabilities
- **Problem**: `npm audit` reports vulnerabilities in dependencies
- **Status**: Known issue with older dependencies
- **Action**: Run `npm audit fix` but expect some vulnerabilities to remain

## Repository Structure

### Key Directories
```
/                          # Go module root
├── playground/           # XGo playground service (similar to play.golang.org)
│   ├── sandbox/         # Code execution sandbox
│   ├── Dockerfile       # Docker build (does not work in CI)
│   └── Makefile         # Build targets (requires gcloud auth)
├── goplus.org/          # Next.js website (main xgo.dev site)
│   ├── pages/           # Next.js pages and API routes  
│   ├── components/      # React components
│   ├── widgets/         # Embeddable widgets for external sites
│   └── public/          # Static assets
└── .travis.yml          # CI configuration (legacy)
```

### Important Files
- `go.mod` / `go.sum`: Go module dependencies
- `goplus.org/package.json`: Node.js dependencies and scripts
- `goplus.org/next.config.js`: Next.js configuration
- `playground/Makefile`: Playground build scripts (requires cloud auth)

### Widget System
The website includes a widget system for embedding XGo functionality on external sites:
```bash
cd goplus.org
npm run build:widgets  # Builds embeddable widgets
npm run dev:widgets    # Development build of widgets
```

## Common Commands Reference

### Repository Root Commands
```bash
go mod download         # Download Go dependencies
go install ./playground # Build playground component  
go test -v ./...        # Run all Go tests
go build ./playground   # Build playground binary
```

### Next.js Website Commands  
```bash
cd goplus.org
npm install             # Install dependencies
npm run dev             # Start development server
npm run build           # Production build
npm run start           # Start production server  
npm run lint            # Run ESLint
npm run build:widgets   # Build embeddable widgets
```

### File Locations for Common Tasks
- **Modify website content**: `goplus.org/pages/`
- **Add React components**: `goplus.org/components/`
- **Update playground logic**: `playground/*.go`
- **Change build configuration**: `goplus.org/next.config.js`
- **Modify widget functionality**: `goplus.org/widgets/`

## Debugging Tips

### Website Not Loading
1. Check if Next.js dev server started: `npm run dev` should show "ready - started server"
2. Verify http://localhost:3000 responds with HTTP 200
3. Check browser console for JavaScript errors

### Go Build Failures  
1. Ensure you're in repository root: `pwd` should end with `/www`
2. Check Go version: `go version` (works with Go 1.12+)
3. Clear module cache: `go clean -modcache` then retry

### Performance Issues
1. **Slow builds**: Normal - XGo playground builds take 20-30 seconds, Next.js builds take 15-30 seconds
2. **Memory issues**: Consider increasing available RAM for long builds
3. **Network timeouts**: Increase timeout values, builds legitimately take time

Remember: **NEVER CANCEL long-running builds**. The timing expectations above are normal and expected.