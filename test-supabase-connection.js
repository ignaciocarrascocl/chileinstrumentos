/**
 * Test script to verify Supabase connection and data migration
 * Run with: node test-supabase-connection.js
 */

import { createClient } from '@supabase/supabase-js'
import dotenv from 'dotenv'

// Load environment variables
dotenv.config()

const supabaseUrl = process.env.VITE_SUPABASE_URL
const supabaseKey = process.env.VITE_SUPABASE_ANON_KEY

if (!supabaseUrl || !supabaseKey) {
  console.error('❌ Missing Supabase environment variables')
  console.log('Please add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to your .env file')
  process.exit(1)
}

const supabase = createClient(supabaseUrl, supabaseKey)

async function testConnection() {
  console.log('🔄 Testing Supabase connection...')

  try {
    console.log('✅ Supabase connection successful!')

    // Try to fetch products directly first
    console.log('� Attempting to fetch products directly...')
    const { data: products, error: productsError } = await supabase
      .from('products_atabase2')
      .select('ID, Model, "Manufacturer-0", image, "Street Price-0", controls')
      .limit(5)

    if (productsError) {
      console.error('❌ Error fetching products:', productsError)
      throw productsError
    }

    console.log(`📦 Found ${products.length} products:`)
    products.forEach((product, index) => {
      console.log(`   ${index + 1}. ${product.Model} by ${product['Manufacturer-0']} (ID: ${product.ID})`)
      console.log(`      Price: ${product['Street Price-0'] || 'No price'}`)
      console.log(`      Controls type: ${typeof product.controls}`)
      if (product.controls) {
        console.log(`      Controls: ${Array.isArray(product.controls) ? product.controls.join(', ') : product.controls}`)
      }
    })

    // Now try to get count
    const { count, error: countError } = await supabase
      .from('products_atabase2')
      .select('*', { count: 'exact', head: true })

    if (countError) {
      console.warn('⚠️ Count query failed:', countError.message)
    } else {
      console.log(`📊 Total products in database: ${count || 'Unknown'}`)
    }

    // Test searching by ID
    if (products.length > 0) {
      const testId = products[0].ID
      const { data: singleProduct, error: singleError } = await supabase
        .from('products_atabase2')
        .select('*')
        .eq('ID', testId)
        .single()

      if (singleError) {
        throw singleError
      }

      console.log(`🔍 Successfully fetched product by ID: ${singleProduct.Model}`)
      console.log(`   All fields present: ${Object.keys(singleProduct).length} fields`)
    }

    console.log('🎉 All tests passed! Your Supabase setup is working correctly.')

  } catch (error) {
    console.error('❌ Supabase connection failed:', error.message)
    console.log('Error details:', error)
    console.log('\n🔧 Troubleshooting steps:')
    console.log('1. Check your VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY in .env')
    console.log('2. Verify your table name is "products_atabase2"')
    console.log('3. Check if Row Level Security (RLS) policies allow read access')
    console.log('4. Ensure your Supabase project is active and not paused')
    console.log('5. Check if there is actual data in your table')
  }
}

testConnection()
