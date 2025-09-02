# Chile Instrumentos - Supabase Migration

This project has been migrated from using local JSON data to Supabase for better scalability and real-time capabilities.

## Supabase Setup

### 1. Environment Variables

Create a `.env` file in the root directory and add your Supabase credentials:

```env
VITE_SUPABASE_URL=https://your-project-ref.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
```

### 2. Database Schema

The Supabase database uses the table `products_atabase2` with the following columns:

- `ID` (uuid, primary key)
- `Blog-headline-0` (text)
- `Street Price-0` (text)
- `Manufacturer-0` (text)
- `Model` (text)
- `IsController` (text)
- `Year` (bigint)
- `keys_count` (bigint)
- `keys_type` (text)
- `pads_count` (text)
- `controls` (jsonb)
- `connectivity` (jsonb)
- `power` (jsonb)
- `weight_lbs` (double precision)
- `dimensions_inches` (jsonb)
- `image` (text)

### 3. Data Migration

To migrate your existing JSON data to Supabase:

1. Create a new table in your Supabase database using the schema above
2. Import your data from `public/database.json` into the table
3. Ensure all UUID fields are properly set

### 4. Row Level Security (RLS)

For public read access, you can disable RLS on the table or create appropriate policies:

```sql
-- Disable RLS for public read access (development only)
ALTER TABLE products_atabase2 DISABLE ROW LEVEL SECURITY;

-- OR create a policy for public read access (recommended)
CREATE POLICY "Allow public read access" ON products_atabase2 FOR SELECT USING (true);
```

## Features

### What's Working

- ✅ Product listing with filtering and sorting
- ✅ Search functionality
- ✅ Product detail views
- ✅ Pagination
- ✅ Real-time data from Supabase
- ✅ Fallback compatibility with image-based IDs

### Data Service

The application uses a dedicated `ProductsService` class located in `src/services/productsService.js` that handles all Supabase interactions:

- `getAllProducts()` - Fetch all products
- `getProductById(id)` - Get a single product by ID or image field
- `searchProducts(filters)` - Advanced search with filters
- `getFilterOptions()` - Get unique values for filter dropdowns
- `getProductsCount()` - Get total product count

### Store Integration

The Pinia store (`src/stores/midiStore.js`) has been updated to use the Supabase service instead of fetching local JSON files.

## Development

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Build for production
npm run build
```

## Environment Files

- `.env.example` - Template for environment variables
- `.env` - Your actual environment variables (not committed to git)

Make sure to copy `.env.example` to `.env` and fill in your actual Supabase credentials.

## Migration Notes

- The application maintains backward compatibility by supporting both UUID-based IDs and image-based IDs
- All existing URLs and bookmarks should continue to work
- The data structure remains the same, only the data source has changed
- Images are still served from the local `public/downloaded_images/` directory

## Troubleshooting

### Common Issues

1. **"Missing Supabase environment variables" error**
   - Make sure your `.env` file exists and contains valid Supabase credentials

2. **"Failed to fetch products" error**
   - Check your Supabase URL and API key
   - Verify that your database table exists and has the correct name
   - Check RLS policies if enabled

3. **Products not loading**
   - Verify your table has data
   - Check browser console for detailed error messages
   - Ensure CORS is properly configured in Supabase

### Getting Supabase Credentials

1. Go to [supabase.com](https://supabase.com)
2. Create a new project or select an existing one
3. Go to Settings > API
4. Copy the Project URL and anon/public key
5. Add them to your `.env` file
