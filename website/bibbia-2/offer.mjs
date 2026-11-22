// The same merchant-defined commercial terms apply to both presentations.
// Reference values describe the contents, not a claimed previous checkout price.
export const offer = Object.freeze({
  price: 27,
  guaranteeDays: 60,
  referenceValues: Object.freeze({ book: 37, catechismo: 19, messa: 19 }),
});
export const referenceTotal = Object.values(offer.referenceValues).reduce((sum, value) => sum + value, 0);
