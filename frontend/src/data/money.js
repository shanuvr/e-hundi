export const MONEY = {
  1: { src: '/money/1.webp', kind: 'coin' },
  2: { src: '/money/2.webp', kind: 'coin' },
  5: { src: '/money/5.webp', kind: 'coin' },
  10: { src: '/money/10.webp', kind: 'coin' },
  20: { src: '/money/20.webp', kind: 'coin' },
  50: { src: '/money/50.webp', kind: 'note' },
  100: { src: '/money/100.webp', kind: 'note' },
  200: { src: '/money/200.webp', kind: 'note' },
  500: { src: '/money/500.webp', kind: 'note' },
};

export const moneyKind = (value) => MONEY[value]?.kind;
export const moneySrc = (value) => MONEY[value]?.src;