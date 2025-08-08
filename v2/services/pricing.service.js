import VisaRule from '../models/visaRule.model.js';

function normalize(value) {
  return String(value || '')
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '_');
}

const PROCESSING_SYNONYMS = new Map([
  ['express', 'rush'],
  ['super_express', 'super_rush'],
  ['superexpress', 'super_rush'],
  ['fast', 'rush'],
]);

export async function computeOrderSummary({
  passportCountryCode,
  destinationCountryCode,
  visaOptionName,
  selectedProcessingTime,
  numberOfTravelers,
}) {
  const travelers = Math.max(parseInt(numberOfTravelers || '1', 10) || 1, 1);

  const rule = await VisaRule.findByCountries(
    passportCountryCode,
    destinationCountryCode
  );
  if (!rule) return undefined;

  const options = Array.isArray(rule.visaOptions) ? rule.visaOptions : [];
  const targetOptionName = normalize(visaOptionName);

  let option = options.find(v => normalize(v.name) === targetOptionName);
  if (!option && options.length === 1) option = options[0];
  if (!option) option = options.find(v => v.isDefault) || options[0];
  if (!option) return undefined;

  const selectedKeyRaw = normalize(selectedProcessingTime);
  const selectedKey = PROCESSING_SYNONYMS.get(selectedKeyRaw) || selectedKeyRaw;

  const procs = Array.isArray(option.processingOptions)
    ? option.processingOptions
    : [];

  let processing = procs.find(
    p => normalize(p.id) === selectedKey || normalize(p.name) === selectedKey
  );
  if (!processing) processing = procs.find(p => p.isDefault) || procs[0];
  if (!processing) return undefined;

  const baseFee = Number(option.fee || 0);
  const procFee = Number(processing.fee || 0);
  const subtotal = baseFee * travelers;
  const processingFee = procFee * travelers;
  const serviceFee = 0;
  const discount = 0;
  const total = subtotal + processingFee + serviceFee - discount;
  const currency = processing.currency || option.currency || 'USD';

  return {
    subtotal,
    processingFee,
    serviceFee,
    discount,
    total,
    currency,
    breakdown: {
      visaOptionName: option.name,
      processingOption: processing.name,
      processingId: processing.id,
      travelers,
      baseFee,
      procFee,
    },
  };
}
