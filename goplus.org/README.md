# XGo Official Website (xgo.dev)

This is the official website for **XGo** (accessible at [xgo.dev](https://xgo.dev) and [goplus.org](https://goplus.org)), built with [Next.js](https://nextjs.org/).

**XGo** is the first AI-native programming language that integrates software engineering into a unified whole, combining the power of:
- **C** × **Go** × **Python** × **JavaScript** + **Scratch**

## Features

- 🌐 **Official XGo Website**: Landing page, documentation, and resources
- 🎮 **Interactive Code Examples**: Try XGo directly in your browser
- 📦 **Download Center**: Get XGo compiler and tools
- 🧩 **Web Widgets**: Embeddable components for third-party websites
- 📱 **Responsive Design**: Optimized for all devices

## Getting Started

### Prerequisites

- Node.js >= 22.0.0
- npm

### Installation

```bash
# Install dependencies
npm install
```

### Development

```bash
# Start the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the website in your browser.

The page auto-updates as you edit files. Start by modifying `pages/index.tsx`.

### Building

```bash
# Build for production (includes widgets)
npm run build

# Start production server
npm start
```

### Linting

```bash
# Run ESLint
npm run lint
```

## Web Widgets

This project includes a unique widgets system that allows third-party websites to embed XGo-related components.

### Building Widgets

```bash
# Build widgets for production
npm run build:widgets

# Develop widgets locally
npm run dev:widgets
```

For detailed widget documentation, see [widgets/README.md](widgets/README.md).

## Project Structure

```
goplus.org/
├── components/          # React components
├── pages/              # Next.js pages and API routes
├── public/             # Static assets
├── widgets/            # Embeddable web widgets
├── utils/              # Utility functions
└── types/              # TypeScript type definitions
```

## Contributing

We welcome contributions! Please feel free to submit issues and pull requests.

## License

This project is licensed under the Apache License 2.0. See [LICENSE](../LICENSE) for details.

## Deployment

The website is deployed automatically via Vercel. The production build includes both the main website and the embeddable widgets system.
