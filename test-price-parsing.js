// Test script to verify price parsing function
const parsePrice = (priceStr) => {
  if (!priceStr || priceStr === '' || priceStr === 'NA') return 0
  // Remover $ y cualquier carácter no numérico excepto puntos y comas
  const cleaned = priceStr.replace(/[$,]/g, '')
  const parsed = parseFloat(cleaned)
  return isNaN(parsed) ? 0 : parsed
}

// Test cases from the database
const testCases = [
  { input: "", expected: 0 },
  { input: "$59.00", expected: 59.00 },
  { input: "$199.99", expected: 199.99 },
  { input: "$1,099.00", expected: 1099.00 },
  { input: "NA", expected: 0 },
  { input: "$96.00", expected: 96.00 },
  { input: "invalid price", expected: 0 },
  { input: null, expected: 0 },
  { input: undefined, expected: 0 }
]

console.log("Testing price parsing function:")
console.log("================================")

testCases.forEach((testCase, index) => {
  const result = parsePrice(testCase.input)
  const passed = result === testCase.expected
  console.log(`Test ${index + 1}: ${passed ? '✅ PASS' : '❌ FAIL'}`)
  console.log(`  Input: ${JSON.stringify(testCase.input)}`)
  console.log(`  Expected: ${testCase.expected}`)
  console.log(`  Got: ${result}`)
  console.log()
})

// Test sorting with parsed prices
const testPrices = [
  { name: "Controller A", price: "$299.00" },
  { name: "Controller B", price: "" },
  { name: "Controller C", price: "$59.00" },
  { name: "Controller D", price: "$1,099.00" },
  { name: "Controller E", price: "NA" }
]

console.log("Testing price sorting:")
console.log("=====================")

const sortedAsc = [...testPrices].sort((a, b) => {
  const aPrice = parsePrice(a.price)
  const bPrice = parsePrice(b.price)
  return aPrice - bPrice
})

const sortedDesc = [...testPrices].sort((a, b) => {
  const aPrice = parsePrice(a.price)
  const bPrice = parsePrice(b.price)
  return bPrice - aPrice
})

console.log("Ascending order:")
sortedAsc.forEach(item => {
  console.log(`  ${item.name}: ${item.price} (parsed: ${parsePrice(item.price)})`)
})

console.log("\nDescending order:")
sortedDesc.forEach(item => {
  console.log(`  ${item.name}: ${item.price} (parsed: ${parsePrice(item.price)})`)
})
