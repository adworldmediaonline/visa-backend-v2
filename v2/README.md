# Visa Application System v2 API

A scalable and secure backend system for a visa application mobile app with admin-controlled configurations.

## 🚀 Features

- **Complete Admin API** - Country, visa type, and visa rule management
- **Application-Centric Architecture** - Central application model with proper relationships
- **Robust Validation** - Zod-based validation with detailed error messages
- **Standardized Responses** - Consistent API response format across all endpoints
- **Comprehensive Documentation** - Swagger/OpenAPI specification and Postman collection
- **Scalable Design** - Built for future user application workflow integration

## 📋 Table of Contents

- [Architecture Overview](#architecture-overview)
- [Quick Start](#quick-start)
- [API Documentation](#api-documentation)
- [Database Models](#database-models)
- [Development](#development)
- [Testing](#testing)
- [Deployment](#deployment)
- [Contributing](#contributing)

## 🏗️ Architecture Overview

The v2 system follows a modular, application-centric architecture:

```
v2/
├── controllers/          # Request handlers
│   ├── admin/           # Admin management endpoints
│   └── user/            # User application endpoints (Phase 2)
├── models/              # Database models
│   ├── admin/           # Admin configuration models
│   └── user/            # User application models
├── schemas/             # Zod validation schemas
├── routes/              # Express route definitions
├── middleware/          # Custom middleware
├── utils/               # Utility functions
└── docs/                # API documentation
```

### Phase Implementation

**Phase 1: Admin API** ✅ **COMPLETED**

- Country management
- Visa type configuration
- Visa rule setup
- Foundation infrastructure

**Phase 2: User API** 🚧 **IN PROGRESS**

- User application workflow
- Step-by-step application process
- Document management
- Payment integration

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ and npm
- MongoDB 5.0+
- Existing backend dependencies

### Installation

1. **Navigate to the v2 directory:**

   ```bash
   cd visa-backend-v2/v2
   ```

2. **The v2 system uses existing backend dependencies** - no additional installation required.

3. **Start the development server:**

   ```bash
   cd .. && npm start
   ```

4. **Verify v2 API is running:**
   ```bash
   curl http://localhost:8090/api/v2/health
   ```

### Environment Variables

The v2 system inherits all environment variables from the main backend. No additional configuration needed.

## 📚 API Documentation

### Base URL

- **Development:** `http://localhost:8090/api/v2`
- **Production:** `https://api.visacollect.com/api/v2`

### Documentation Resources

1. **Swagger/OpenAPI Specification:**

   - File: `v2/docs/swagger.yaml`
   - Online: `http://localhost:8090/api/v2/docs` (when implemented)

2. **Postman Collection:**
   - File: `v2/docs/Visa_Application_v2.postman_collection.json`
   - Import into Postman for immediate testing

### Authentication

All admin endpoints require authentication (to be implemented in Phase 2).
Current endpoints are temporarily accessible without authentication for development.

### Response Format

All API responses follow a standardized format:

```json
{
  "success": true|false,
  "message": "Human-readable message",
  "data": {} | [] | null,
  "errors": [] // Only present on validation errors
}
```

### Error Handling

The API returns appropriate HTTP status codes:

- `200` - Success
- `201` - Created
- `400` - Bad Request / Validation Error
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## 🗃️ Database Models

### Admin Models

#### Country

Configuration for countries that can be selected as passport origin or travel destination.

```javascript
{
  name: "United States",
  isoCode: "US",
  iso3Code: "USA",
  flagUrl: "https://example.com/flags/us.png",
  dialCode: "+1",
  currency: {
    code: "USD",
    symbol: "$",
    name: "US Dollar"
  },
  isActive: true,
  allowAsOrigin: true,
  allowAsDestination: true
}
```

#### VisaType

Visa categories with descriptions and metadata.

```javascript
{
  name: "Tourist Visa",
  code: "TOURIST",
  description: "For tourism and leisure purposes",
  category: "tourist", // tourist, business, transit, student, work, medical, other
  isActive: true,
  metadata: {
    icon: "🏖️",
    color: "#blue",
    features: ["Single entry", "90 days validity"]
  }
}
```

#### VisaRule

Visa availability and requirements between country pairs.

```javascript
{
  fromCountry: ObjectId("..."),
  toCountry: ObjectId("..."),
  visaType: ObjectId("..."),
  isVisaAvailable: true,
  validity: {
    value: 1,
    unit: "years"
  },
  entryType: "multiple", // single, multiple, double
  governmentFee: {
    amount: 4500,
    currency: "INR"
  },
  processingTimeRange: {
    min: 5,
    max: 10,
    unit: "days"
  },
  requirements: {
    minimumValidityRequired: 6,
    blankPagesRequired: 2,
    biometricRequired: false,
    interviewRequired: false
  }
}
```

### User Models

#### Application (Central Model)

The heart of the application workflow system.

```javascript
{
  referenceNumber: "VA12AB34CD", // Auto-generated
  status: "draft", // draft, in_progress, submitted, under_review, approved, rejected
  currentStep: 1,
  completedSteps: [1, 2],
  fromCountry: ObjectId("..."),
  toCountry: ObjectId("..."),
  visaType: ObjectId("..."),
  visaRule: ObjectId("..."),
  pricing: {
    governmentFee: 4500,
    serviceFee: 1500,
    processingFee: 500,
    tax: 945,
    totalAmount: 7445,
    currency: "INR"
  },
  paymentStatus: "pending"
}
```

#### Supporting Models

- **PersonalInfo** - Personal details, contact info, employment
- **TripDetails** - Travel dates, purpose, accommodation, financial info
- **PassportInfo** - Passport details, photos, validity
- **Traveler** - Additional travelers with individual details
- **Document** - File uploads with validation and admin review
- **Appointment** - Appointment booking with centers
- **Payment** - Payment gateway integration and tracking

## 💻 Development

### Code Style

- **TypeScript/JavaScript** - ES6+ features, async/await
- **Validation** - Zod schemas for all inputs
- **Error Handling** - Centralized error handling with proper HTTP codes
- **Naming** - Descriptive names, consistent patterns
- **Structure** - Modular architecture, separation of concerns

### Adding New Endpoints

1. **Create Zod schema** in `schemas/`
2. **Add model** in `models/`
3. **Implement controller** in `controllers/`
4. **Define routes** in `routes/`
5. **Update documentation** in `docs/`

### Available Scripts

```bash
# Start development server
npm start

# Run in development with nodemon
npm run dev

# Run tests (when implemented)
npm test

# Lint code
npm run lint
```

## 🧪 Testing

### Manual Testing

1. **Import Postman Collection:**

   ```bash
   # Import the collection file
   v2/docs/Visa_Application_v2.postman_collection.json
   ```

2. **Set Environment Variables:**

   - `baseUrl`: `http://localhost:8090/api/v2`

3. **Test Health Check:**
   ```bash
   GET {{baseUrl}}/health
   ```

### Automated Testing

Unit tests and integration tests will be implemented in Phase 2.

## 🚀 Deployment

### Production Setup

1. **Environment Configuration:**

   ```bash
   NODE_ENV=production
   MONGODB_URI=mongodb://production-url
   # Other environment variables from main backend
   ```

2. **Build and Deploy:**

   ```bash
   npm run build
   npm start
   ```

3. **Health Check:**
   ```bash
   curl https://api.visacollect.com/api/v2/health
   ```

### Monitoring

The v2 system integrates with the existing backend monitoring:

- Application logs
- Error tracking
- Performance metrics
- Health checks

## 📊 API Endpoints Summary

### Health Check

- `GET /health` - System health and version info

### Admin - Countries

- `GET /admin/countries` - Get all countries (paginated)
- `GET /admin/countries/origin` - Get origin countries
- `GET /admin/countries/destination` - Get destination countries
- `GET /admin/countries/:id` - Get country by ID
- `POST /admin/countries` - Create new country
- `PUT /admin/countries/:id` - Update country
- `PATCH /admin/countries/:id/toggle-status` - Toggle status
- `DELETE /admin/countries/:id` - Soft delete

### Admin - Visa Types

- `GET /admin/visa-types` - Get all visa types (paginated)
- `GET /admin/visa-types/active` - Get active visa types
- `GET /admin/visa-types/category/:category` - Get by category
- `GET /admin/visa-types/:id` - Get visa type by ID
- `POST /admin/visa-types` - Create new visa type
- `PUT /admin/visa-types/:id` - Update visa type
- `PATCH /admin/visa-types/:id/toggle-status` - Toggle status
- `DELETE /admin/visa-types/:id` - Soft delete

### Admin - Visa Rules

- `GET /admin/visa-rules` - Get all visa rules (paginated)
- `GET /admin/visa-rules/check-eligibility` - Check visa eligibility
- `GET /admin/visa-rules/destination/:countryId` - Get rules for destination
- `GET /admin/visa-rules/:id` - Get visa rule by ID
- `POST /admin/visa-rules` - Create new visa rule
- `PUT /admin/visa-rules/:id` - Update visa rule
- `PATCH /admin/visa-rules/:id/toggle-status` - Toggle status
- `DELETE /admin/visa-rules/:id` - Soft delete

## 🤝 Contributing

### Development Workflow

1. **Create feature branch:**

   ```bash
   git checkout -b feature/new-endpoint
   ```

2. **Implement changes:**

   - Add/modify models, controllers, routes
   - Update Zod schemas
   - Add tests (when testing framework is ready)

3. **Update documentation:**

   - Update Swagger spec
   - Add Postman requests
   - Update README if needed

4. **Test thoroughly:**

   - Test all endpoints with Postman
   - Verify error handling
   - Check validation

5. **Submit pull request:**
   - Clear description of changes
   - Test results included
   - Documentation updated

### Code Standards

- Follow existing patterns and conventions
- Use Zod for all input validation
- Implement proper error handling
- Add comprehensive documentation
- Write descriptive commit messages

## 📞 Support

For questions or issues:

1. **Check existing documentation** - README, Swagger, Postman
2. **Review error messages** - Detailed validation errors provided
3. **Test with Postman** - Use provided collection for debugging
4. **Create issue** - With detailed description and reproduction steps

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🎯 Roadmap

### Completed ✅

- [x] Admin API infrastructure
- [x] Country management
- [x] Visa type configuration
- [x] Visa rule setup
- [x] Application-centric data models
- [x] Comprehensive documentation

### In Progress 🚧

- [ ] User API controllers
- [ ] Zod validation for user models
- [ ] User application routes

### Planned 📅

- [ ] Authentication system
- [ ] File upload system
- [ ] Payment gateway integration
- [ ] Email notifications
- [ ] Testing framework
- [ ] Performance optimization

---

**Built with ❤️ for seamless visa applications**
