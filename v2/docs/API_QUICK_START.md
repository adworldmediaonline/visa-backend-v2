# API Quick Start Guide

This guide will get you up and running with the Visa Application v2 API in 5 minutes.

## 🚀 Quick Setup

### 1. Start the Server

```bash
cd visa-backend-v2
npm start
```

### 2. Verify API is Running

```bash
curl http://localhost:8090/api/v2/health
```

Expected response:

```json
{
  "success": true,
  "message": "Health check completed",
  "data": {
    "message": "Visa Application API v2 is running",
    "version": "2.0.0",
    "modules": {
      "admin": "active",
      "user": "coming_soon"
    }
  }
}
```

## 📝 Basic API Usage

### Create a Country

```bash
curl -X POST http://localhost:8090/api/v2/admin/countries \
  -H "Content-Type: application/json" \
  -d '{
    "name": "India",
    "isoCode": "IN",
    "iso3Code": "IND",
    "flagUrl": "https://example.com/flags/in.png",
    "dialCode": "+91",
    "currency": {
      "code": "INR",
      "symbol": "₹",
      "name": "Indian Rupee"
    }
  }'
```

### Create a Visa Type

```bash
curl -X POST http://localhost:8090/api/v2/admin/visa-types \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Tourist Visa",
    "code": "TOURIST",
    "description": "For tourism and leisure purposes",
    "category": "tourist"
  }'
```

### Create a Visa Rule

```bash
curl -X POST http://localhost:8090/api/v2/admin/visa-rules \
  -H "Content-Type: application/json" \
  -d '{
    "fromCountry": "COUNTRY_ID_HERE",
    "toCountry": "DESTINATION_COUNTRY_ID_HERE",
    "visaType": "VISA_TYPE_ID_HERE",
    "validity": {
      "value": 1,
      "unit": "years"
    },
    "governmentFee": {
      "amount": 4500,
      "currency": "INR"
    },
    "processingTimeRange": {
      "min": 5,
      "max": 10,
      "unit": "days"
    }
  }'
```

### Check Visa Eligibility

```bash
curl "http://localhost:8090/api/v2/admin/visa-rules/check-eligibility?fromCountryId=FROM_COUNTRY_ID&toCountryId=TO_COUNTRY_ID"
```

## 🔧 Using Postman

### Import Collection

1. Open Postman
2. Click **Import**
3. Select `v2/docs/Visa_Application_v2.postman_collection.json`
4. Import `v2/docs/Visa_Application_v2.postman_environment.json`

### Set Environment

1. Select "Visa Application v2 - Development" environment
2. Verify `baseUrl` is set to `http://localhost:8090/api/v2`

### Test Endpoints

1. Run "Health Check" → "Get Health Status"
2. Run "Admin - Countries" → "Create Country"
3. Save the returned `_id` as `countryId` variable
4. Continue with other endpoints

## 📊 Common Workflows

### 1. Setup Basic Configuration

```bash
# 1. Create origin country (e.g., India)
POST /admin/countries

# 2. Create destination country (e.g., USA)
POST /admin/countries

# 3. Create visa type (e.g., Tourist)
POST /admin/visa-types

# 4. Create visa rule connecting them
POST /admin/visa-rules
```

### 2. Check Visa Availability

```bash
# Check if visa is available for a country pair
GET /admin/visa-rules/check-eligibility?fromCountryId=...&toCountryId=...
```

### 3. Manage Countries

```bash
# Get all countries with pagination
GET /admin/countries?page=1&limit=10

# Get countries for origin selection
GET /admin/countries/origin

# Get countries for destination selection
GET /admin/countries/destination

# Search countries
GET /admin/countries?search=india

# Filter active countries
GET /admin/countries?isActive=true
```

## 🛠️ API Features

### Pagination

All list endpoints support pagination:

```bash
GET /admin/countries?page=1&limit=10
```

### Search & Filtering

Most endpoints support search and filtering:

```bash
# Search by name
GET /admin/countries?search=united

# Filter by status
GET /admin/visa-types?isActive=true

# Filter by category
GET /admin/visa-types?category=tourist
```

### Validation

All requests are validated with detailed error messages:

```json
{
  "success": false,
  "message": "Validation failed",
  "errors": ["Name is required", "ISO code must be exactly 2 characters"]
}
```

## 🔍 Troubleshooting

### Common Issues

**API not responding:**

- Check if server is running: `npm start`
- Verify port 8090 is not in use
- Check logs for startup errors

**Validation errors:**

- Review required fields in documentation
- Check data types (string, number, boolean)
- Ensure required nested objects are complete

**404 Not Found:**

- Verify endpoint URL is correct
- Check if IDs exist in database
- Ensure v2 routes are properly registered

### Debug Mode

Enable debug logging:

```bash
DEBUG=visa-v2:* npm start
```

## 📚 Next Steps

1. **Read Full Documentation:** `v2/README.md`
2. **Explore Swagger Spec:** `v2/docs/swagger.yaml`
3. **Use Postman Collection:** Import and test all endpoints
4. **Check Models:** Review `v2/models/` for data structures
5. **Review Validation:** See `v2/schemas/` for input requirements

## 🎯 API Endpoint Summary

| Method | Endpoint                              | Description            |
| ------ | ------------------------------------- | ---------------------- |
| GET    | `/health`                             | Health check           |
| GET    | `/admin/countries`                    | List countries         |
| POST   | `/admin/countries`                    | Create country         |
| GET    | `/admin/visa-types`                   | List visa types        |
| POST   | `/admin/visa-types`                   | Create visa type       |
| GET    | `/admin/visa-rules`                   | List visa rules        |
| POST   | `/admin/visa-rules`                   | Create visa rule       |
| GET    | `/admin/visa-rules/check-eligibility` | Check visa eligibility |

For complete endpoint list with parameters, see the Swagger documentation.
