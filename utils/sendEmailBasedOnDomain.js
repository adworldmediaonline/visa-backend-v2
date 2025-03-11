export const sendEmailBasedOnDomain = currentDomain => {
  let auth = {};

  if (currentDomain === process.env.VISA_COLLECT_DOMAIN_URL) {
    auth = {
      HOSTINGER_EMAIL: process.env.HOSTINGER_EMAIL,
      HOSTINGER_PASSWORD: process.env.HOSTINGER_PASSWORD,
    };
  }
  if (currentDomain === process.env.SERVICES_TRAVEL_INDIA_DOMAIN_URL) {
    auth = {
      HOSTINGER_EMAIL: process.env.SERVICES_TRAVEL_INDIA_HOSTINGER_EMAIL,
      HOSTINGER_PASSWORD: process.env.SERVICES_TRAVEL_INDIA_HOSTINGER_PASSWORD,
    };
  }
  if (currentDomain === process.env.TRAVEL_TO_INDIA_SERVICES_DOMAIN_URL) {
    auth = {
      HOSTINGER_EMAIL: process.env.TRAVEL_TO_INDIA_SERVICES_HOSTINGER_EMAIL,
      HOSTINGER_PASSWORD:
        process.env.TRAVEL_TO_INDIA_SERVICES_HOSTINGER_PASSWORD,
    };
  }
  if (currentDomain === process.env.INDIA_TRAVEL_SERVICES_DOMAIN_URL) {
    auth = {
      HOSTINGER_EMAIL: process.env.INDIA_TRAVEL_SERVICES_HOSTINGER_EMAIL,
      HOSTINGER_PASSWORD: process.env.INDIA_TRAVEL_SERVICES_HOSTINGER_PASSWORD,
    };
  }

  return auth;
};
