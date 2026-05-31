# YouTube-to-MP3 API - Production Ready

A robust, secure, and scalable API service for converting YouTube videos to MP3 files. Designed for production deployment with comprehensive security, monitoring, and reliability features.

## 🎯 Features

### Core Functionality
- ✅ Convert YouTube videos to MP3
- ✅ Streaming and download endpoints
- ✅ Duration validation and limits
- ✅ Metadata extraction (title, duration)
- ✅ Graceful error handling

### Security
- 🔐 API key authentication
- 🔐 Rate limiting (IP + API key based)
- 🔐 CORS restrictions
- 🔐 Input validation & sanitization
- 🔐 Security headers (Helmet)
- 🔐 Request size limits
- 🔐 Timeout protection
- 🔐 Abuse detection & temporary banning
- 🔐 Audit logging
- 🔐 No sensitive data leakage

### Reliability
- ⚡ Async queue system for conversions
- ⚡ Retry logic with exponential backoff
- ⚡ Circuit breaker pattern
- ⚡ Health checks
- ⚡ Graceful shutdown
- ⚡ Automatic temp file cleanup
- ⚡ Redis caching support

### Infrastructure
- 🐳 Docker ready
- 🐳 Horizontal scaling support
- 🐳 Prometheus metrics
- 🐳 Structured logging (Pino)
- 🐳 CI/CD pipeline examples
- 🐳 Load testing scripts

## 📋 Requirements

- Node.js >= 18.0.0
- FFmpeg
- yt-dlp
- Redis (optional, for distributed caching)
- Docker (optional, for containerization)

## 🚀 Quick Start

### Local Development

```bash
# Install dependencies
npm install

# Copy environment template
cp .env.example .env

# Edit .env with your configuration
nano .env

# Run development server
npm run dev
```

### Docker

```bash
# Build image
npm run build

# Run container
npm run docker:run
```

## 📚 API Endpoints

### Convert to MP3

**GET** `/api/v1/convert?url=<youtube-url>`

**Headers:**
```
Authorization: Bearer <api-key>
Content-Type: application/json
```

**Response (Success):**
```json
{
  "success": true,
  "title": "Video Title",
  "download_url": "https://api.example.com/api/v1/download/abc123",
  "stream_url": "https://api.example.com/api/v1/stream/abc123",
  "duration": 180,
  "expires_at": "2024-01-15T10:30:00Z",
  "request_id": "req-xyz789"
}
```

**Response (Error):**
```json
{
  "success": false,
  "error": "Video URL is invalid",
  "error_code": "INVALID_URL",
  "request_id": "req-xyz789"
}
```

### Stream MP3

**GET** `/api/v1/stream/<file-id>`

Streams MP3 file directly to client.

### Download MP3

**GET** `/api/v1/download/<file-id>`

Downloads MP3 file with attachment headers.

### Health Check

**GET** `/health`

Returns API and dependency health status.

### Metrics

**GET** `/metrics`

Prometheus metrics endpoint.

## 🔒 Security Considerations

### Authentication
- All endpoints except `/health` require valid API key
- API keys are hashed in storage (never store plaintext)
- Rotate keys regularly

### Rate Limiting
- Per-IP: 50 requests/hour (configurable)
- Per-API-Key: 500 requests/hour (configurable)
- Burst protection: Max 10 requests/minute per IP
- Automatic temporary ban after 10 violations

### Input Validation
- YouTube URL validation with regex
- Duration limits enforced (max 60 minutes default)
- File size checks
- Timeout protection (5 minutes default)

### Error Handling
- No internal error details exposed to clients
- All errors logged server-side with request IDs
- Structured error responses

### Data Protection
- Temporary files cleaned up after 24 hours
- No user data stored beyond request metadata
- Audit logging of all API access
- No credentials in logs or responses

## 📊 Monitoring & Logging

### Metrics
- Request rate and latency
- Conversion success/failure rates
- Queue size and processing time
- Cache hit rates
- API key usage patterns

### Logs
- Structured JSON logging (Pino)
- Audit trail for all API access
- Error tracking with stack traces
- Request correlation IDs

## 🧪 Testing

### Unit Tests
```bash
npm test
```

### Load Testing
```bash
npm run test:load
```

### Security Audit
```bash
npm run security:audit
npm run security:check
```

## 🌐 Deployment

See `docs/DEPLOYMENT.md` for:
- Vercel deployment
- Docker Compose setup
- Kubernetes configuration
- Nginx reverse proxy config
- Monitoring setup (Prometheus + Grafana)
- CI/CD pipeline examples

## 📖 Documentation

- `docs/SECURITY.md` - Detailed security architecture
- `docs/ARCHITECTURE.md` - System design and components
- `docs/API.md` - Complete API reference
- `docs/DEPLOYMENT.md` - Deployment guide
- `docs/TROUBLESHOOTING.md` - Common issues and solutions

## 🛠️ Project Structure

```
.
├── src/
│   ├── index.js              # Application entry point
│   ├── config/               # Configuration management
│   ├── routes/               # API route handlers
│   ├── services/             # Business logic
│   ├── middleware/           # Express middleware
│   ├── utils/                # Utility functions
│   ├── queue/                # Job queue system
│   ├── cache/                # Caching layer
│   └── logger/               # Logging configuration
├── tests/                    # Test files
├── scripts/                  # Utility scripts
├── docs/                     # Documentation
├── docker/                   # Docker configuration
└── k8s/                      # Kubernetes manifests
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## ⚖️ Legal Notice

This tool is for personal use only. Respect YouTube's Terms of Service and copyright laws. Users are responsible for complying with applicable laws in their jurisdiction.

## 📄 License

MIT - See LICENSE file for details

## 🆘 Support

For issues and questions:
1. Check `docs/TROUBLESHOOTING.md`
2. Review GitHub Issues
3. Create a new issue with detailed information

---

**Last Updated:** January 2024
**Status:** Production Ready
