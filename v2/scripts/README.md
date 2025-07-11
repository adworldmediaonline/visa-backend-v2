# Seed Script Documentation

This directory contains scripts for populating the v2 visa application system with test data.

## 🌱 Seed Script

### Purpose

The seed script (`seed.js`) populates the database with comprehensive dummy data for testing all v2 API endpoints.

### What Gets Seeded

#### Countries (10 countries)

- **India** - Origin country only
- **United States** - Destination country
- **United Kingdom** - Destination country
- **Canada** - Destination country
- **Australia** - Destination country
- **Germany** - Destination country
- **France** - Destination country
- **Singapore** - Destination country
- **Japan** - Destination country
- **Thailand** - Destination country

Each country includes:

- ISO codes, flag URLs, dial codes
- Currency information
- Geographic metadata
- Origin/destination flags

#### Visa Types (6 categories)

- **Tourist Visa** - For leisure and tourism
- **Business Visa** - For business activities
- **Student Visa** - For educational purposes
- **Work Visa** - For employment
- **Transit Visa** - For short-term transit
- **Medical Visa** - For medical treatment

Each visa type includes:

- Category classification
- Icons and colors for UI
- Feature descriptions
- Sort order for display

#### Processing Times (3 tiers)

- **Standard Processing** - 5-10 days (₹500 fee)
- **Express Processing** - 2-4 days (₹1,500 fee)
- **Urgent Processing** - 1-2 days (₹3,000 fee)

#### Service Fees (2 types)

- **Standard Service Fee** - ₹1,500
- **Premium Service Fee** - ₹2,500

#### Appointment Centers (2 locations)

- **Mumbai Visa Center** - Marine Drive location
- **Delhi Visa Center** - Connaught Place location

Each center includes:

- Complete address and contact info
- Operating hours (Mon-Sat)
- Daily capacity and booking limits
- Available services

#### Document Requirements (5 types)

- **Passport** - Travel document (required)
- **Passport Photo** - Recent photograph (required)
- **Bank Statement** - Financial proof (required)
- **Employment Letter** - Work verification (optional)
- **Travel Insurance** - Insurance coverage (required)

Each requirement includes:

- File format specifications
- Size and quantity limits
- Validation rules
- Required/optional status

#### Visa Rules (Generated automatically)

- **Tourist visas** for all destination countries
- **Business visas** for all destination countries
- **Student visas** for US, UK, Canada, Australia, Germany
- Random government fees (₹2,000-18,000)
- Varied processing times and requirements

## 🚀 Usage

### Run the Seed Script

```bash
# Using npm script
npm run seed

# Or directly
node v2/scripts/seed.js
```

### What Happens

1. **Connects** to MongoDB using environment variables
2. **Clears** all existing v2 data
3. **Seeds** data in the correct order (dependencies first)
4. **Reports** progress and summary
5. **Disconnects** from database

### Expected Output

```
🌱 Starting data seeding...
✅ MongoDB Connected for seeding
🗑️  Clearing existing data...
✅ Data cleared successfully
✅ 10 countries seeded successfully
✅ 6 visa types seeded successfully
✅ 3 processing times seeded successfully
✅ 2 service fees seeded successfully
✅ 2 appointment centers seeded successfully
✅ 5 document requirements seeded successfully
✅ 27 visa rules seeded successfully

🎉 Seeding completed successfully!

📊 Summary:
   Countries: 10
   Visa Types: 6
   Processing Times: 3
   Service Fees: 2
   Appointment Centers: 2
   Document Requirements: 5
   Visa Rules: 27

🚀 You can now test the API endpoints with this data!
   Health Check: GET /api/v2/health
   Countries: GET /api/v2/admin/countries
   Visa Types: GET /api/v2/admin/visa-types
   Visa Rules: GET /api/v2/admin/visa-rules
   Documentation: GET /api/v2/docs

🔌 Database connection closed
```

## 🧪 Testing After Seeding

### Quick API Tests

```bash
# Health check
curl http://localhost:8090/api/v2/health

# Get all countries
curl http://localhost:8090/api/v2/admin/countries

# Get origin countries
curl http://localhost:8090/api/v2/admin/countries/origin

# Get destination countries
curl http://localhost:8090/api/v2/admin/countries/destination

# Get visa types
curl http://localhost:8090/api/v2/admin/visa-types

# Check visa eligibility (India to US)
curl "http://localhost:8090/api/v2/admin/visa-rules/check-eligibility?fromCountryId=INDIA_ID&toCountryId=US_ID"
```

### Using Postman

1. Import the collection: `v2/docs/Visa_Application_v2.postman_collection.json`
2. Import the environment: `v2/docs/Visa_Application_v2.postman_environment.json`
3. Run the requests to test all endpoints

### Using Swagger UI

Visit: `http://localhost:8090/api/v2/docs`

## 🔧 Customization

### Adding More Data

To add more countries, visa types, or other data:

1. **Edit the seed script** (`seed.js`)
2. **Add new data arrays** in the respective functions
3. **Run the seed script** again

### Modifying Existing Data

1. **Edit the data arrays** in the seed functions
2. **Run the seed script** to replace all data
3. **Or manually update** specific records via API

### Environment Variables

The script uses the same MongoDB connection as the main application:

- `MONGODB_URI` - MongoDB connection string

## ⚠️ Important Notes

### Data Replacement

- The seed script **clears all existing v2 data** before seeding
- This ensures clean, consistent test data
- **Don't run on production** without backing up data

### Dependencies

- Countries must be seeded before visa rules
- Visa types must be seeded before visa rules
- The script handles dependencies automatically

### Randomization

- Government fees are randomized for realistic variation
- Biometric and interview requirements are randomized
- This creates diverse test scenarios

## 🎯 Use Cases

### Development

- Quick setup for new development environments
- Consistent test data across team members
- API endpoint testing with realistic data

### Testing

- Integration testing with known data
- Performance testing with substantial datasets
- UI testing with various country combinations

### Demos

- Client demonstrations with real-looking data
- Sales presentations with complete workflows
- Training sessions with realistic scenarios

## 🔄 Reseeding

To reseed the data (replace existing data):

```bash
npm run seed
```

The script will automatically clear existing data before seeding new data.
