const numFormater = new Intl.NumberFormat('ko', {
  style: 'currency',
  currency: 'krw',
  notation: 'compact',
});

export const localeDateOption: Intl.DateTimeFormatOptions = {
  minute: 'numeric',
  hour: 'numeric',
  day: 'numeric',
  month: 'short',
  year: 'numeric',
  weekday: 'short',
};

export const cvPriveToKo = (candle_price: number) => {
  return `${numFormater.format(candle_price)}원`;
};
