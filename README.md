# Invoice PDF Renderer Microservice

A focused microservice that generates PDF invoices from HTML templates. **Single Purpose**: Only handles invoice PDF generation.

## Features

- **Simple Architecture**: Clean MVC structure with separated concerns
- **Invoice Optimized**: Specialized endpoint for invoice generation
- **Environment Config**: Easy configuration via environment variables
- **Health Monitoring**: Detailed health check endpoint
- **TypeScript**: Full type safety
- **Queue Management**: Handles concurrent requests efficiently

## Endpoints

### Health Check

```bash
GET /healthz
```

Response:

```json
{
  "status": "healthy",
  "timestamp": "2024-01-01T12:00:00.000Z",
  "uptime": 3600,
  "memory": {...},
  "version": "1.0.0",
  "config": {
    "port": 8080,
    "maxConcurrent": 4,
    "pageTimeout": 45000
  }
}
```

### Invoice PDF Generation

```bash
POST /render
Content-Type: text/html

<html>...</html>
```

## Usage with Your Invoice Service

```typescript
import axios from "axios";

export async function generateInvoicePdfBuffer(html: string): Promise<Buffer> {
  const response = await axios.post(`${config.pdfRendererUrl}/render`, html, {
    headers: { "Content-Type": "text/html" },
    responseType: "arraybuffer",
    timeout: 45000, // Matches server timeout
  });
  return Buffer.from(response.data);
}
```

## Environment Variables

```bash
# Server Configuration
PORT=8080

# Concurrency Settings
MAX_CONCURRENT=4

# PDF Generation Timeout (milliseconds)
PAGE_TIMEOUT=45000
```

## Development

```bash
# Install dependencies
npm install

# Build TypeScript
npm run build

# Start production server
npm start

# Development with auto-reload
npm run dev
```

## Architecture

```
src/
├── config.ts          # Environment configuration
├── controllers.ts     # Request handlers (business logic)
├── routes.ts          # Route definitions
├── pdf-renderer.ts    # PDF generation logic
├── queue.ts          # Queue management
└── server.ts         # Server setup
```

## Invoice Optimizations

This service is specifically optimized for invoice PDF generation:

- **Single Purpose**: Only generates invoice PDFs
- **45-second timeout** (matches your client timeout)
- **A5 format** with 0.5cm margins for optimal invoice layout
- **Background printing enabled** (crucial for gradients and colors)
- **Headers/footers disabled** for clean invoice appearance
- **Optimized for Persian RTL text and complex layouts**
- **Base64 embedded font support**

Perfect for your invoice templates with Tailwind CSS, Persian text, and embedded WOFF fonts.
