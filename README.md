# Portfolio Update (Disciplined Edition)

## Changes Overview
- **Visuals**: Replaced "Blobs" with a precise, micro-parallax grid canvas animation.
- **Form**: Added strict validation, honeypot spam protection, and offline queuing.
- **PWA**: Implemented "Update Available" flow and robust asset caching.

## Local Testing Instructions

### 1. Prerequisites
You need a simple HTTP server because Service Workers do not work on `file://` protocol.
If you have Node.js installed:
```bash
npx http-server . -p 8080 -c-1