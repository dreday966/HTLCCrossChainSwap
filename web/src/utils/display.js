import Decimal from "decimal.js"

export const toPercent2 = str => {
  return str && (new Decimal(str).mul('100').toFixed(2) + '%')
}

export const toPercent4 = str => {
  return str && (new Decimal(str).mul('100').toFixed(4) + '%')
}