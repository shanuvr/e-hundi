export const MONEY = {
  1: { src: '/money/1.png', kind: 'coin' },
  2: { src: '/money/2.png', kind: 'coin' },
  5: { src: '/money/5.png', kind: 'coin' },
  10: { src: '/money/10.png', kind: 'coin' },
  20: { src: '/money/20.png', kind: 'coin' },
  50: { src: '/money/50.jpg', kind: 'note' },
  100: { src: '/money/100.jpg', kind: 'note' },
  200: { src: '/money/200.jpg', kind: 'note' },
  500: { src: '/money/500.jpg', kind: 'note' },
};

export const moneyKind = (value) => MONEY[value]?.kind;
export const moneySrc = (value) => MONEY[value]?.src;