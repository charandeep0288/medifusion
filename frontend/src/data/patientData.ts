export const dummyPatients = Array.from({ length: 2000 }, (_, i) => ({
  id: i + 1,
  name: `Patient ${i + 1}`,
  email: `patient${i + 1}@example.com`,
  phone: `+91-98765${10000 + i}`,
  address: `Street ${i + 1}, Health City`,
}));
