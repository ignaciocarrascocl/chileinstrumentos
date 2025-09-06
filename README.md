# Chile Instrumentos - MIDI Controller Database

A comprehensive Vue.js application for browsing and searching MIDI controllers and music instruments. This application provides an interactive catalog with advanced filtering capabilities, user authentication, and detailed product information.

## 🚀 Overview

Chile Instrumentos is a modern web application built with Vue 3 that serves as a comprehensive database for MIDI controllers and music instruments. Users can search, filter, and explore detailed information about various music production equipment.

### ✨ Key Features

- **📱 Responsive Design** - Works seamlessly on desktop, tablet, and mobile devices
- **🔍 Advanced Search & Filtering** - Multi-criteria search with real-time filtering
- **👤 User Authentication** - Complete auth system with registration, login, and password recovery
- **📊 Real-time Database** - Powered by Supabase for scalable data management
- **🎨 Modern UI/UX** - Clean, intuitive interface with smooth animations
- **📖 Detailed Product Views** - Comprehensive product information and specifications
- **📄 Pagination** - Efficient data loading with customizable page sizes

## 🛠️ Technology Stack

### Frontend Framework
- **Vue 3** - Progressive JavaScript framework with Composition API
- **Vue Router 4** - Official router for Vue.js
- **Pinia** - Official state management library for Vue.js

### UI & Styling
- **Bootstrap 5** - CSS framework for responsive design
- **Bootstrap Icons** - Comprehensive icon library
- **Animate.css** - CSS animation library
- **Google Fonts** - Roboto and Roboto Mono fonts

### Database & Backend
- **Supabase** - Backend-as-a-Service with PostgreSQL database
- **Supabase Auth** - Authentication and user management

### Development Tools
- **Vite** - Fast build tool and development server
- **Vitest** - Testing framework
- **ESLint** - Code linting and quality assurance
- **Prettier** - Code formatting

## 📁 Project Structure

### Root Files
```
├── index.html              # Main HTML template
├── package.json            # Project dependencies and scripts
├── vite.config.js         # Vite configuration
├── vitest.config.js       # Vitest testing configuration
├── eslint.config.js       # ESLint configuration
├── jsconfig.json          # JavaScript project configuration
├── netlify.toml           # Netlify deployment configuration
├── README.md              # This documentation file
└── SUPABASE_SETUP.md      # Supabase setup instructions
```

### Source Code Structure
```
src/
├── main.js                # Application entry point
├── App.vue                # Root Vue component
├── components/            # Reusable Vue components
├── views/                 # Page-level Vue components
├── stores/                # Pinia state management stores
├── composables/           # Vue composition functions
├── services/              # API service layer
├── router/                # Vue Router configuration
└── lib/                   # External library configurations
```

## 📋 Detailed Component Documentation

### 🖼️ Views (Page Components)

#### `CatalogView.vue`
**Purpose**: Main product catalog page displaying MIDI controllers in a grid layout
- **Features**: Advanced filtering, sorting, pagination, search functionality
- **Components Used**: `AdvancedSearch`, `ControllerCard`
- **Store Integration**: Uses `midiStore` for product data and filtering state
- **Composables**: `useFilters`, `usePagination`, `useAnimations`

#### `ProductDetailView.vue`
**Purpose**: Detailed view for individual MIDI controllers
- **Features**: Full product specifications, image display, technical details
- **Route**: `/product/:id` (supports both UUID and image-based IDs)
- **Components**: `ProductBasicInfo`, `ProductFeatureSection`, `ProductTechnicalSpecs`
- **Composables**: `useProductDetail`, `useProductFormatting`, `useProductNavigation`

#### `LoginView.vue` & `RegisterView.vue`
**Purpose**: User authentication pages
- **Features**: Form validation, error handling, redirect management
- **Store Integration**: Uses `authStore` for authentication state
- **Composables**: `useAuth` for authentication logic

#### `ProfileView.vue`
**Purpose**: User profile management (protected route)
- **Features**: Display name updates, password changes, account management
- **Auth Guard**: Requires authentication to access

#### `AboutView.vue` & `ContactView.vue`
**Purpose**: Static information pages
- **Content**: Company information, contact details, mission statement

#### `ForgotPasswordView.vue` & `ResetPasswordView.vue`
**Purpose**: Password recovery workflow
- **Features**: Email-based password reset, secure token handling

### 🧩 Components (Reusable UI Elements)

#### `NavBar.vue`
**Purpose**: Primary navigation component
- **Features**: 
  - Responsive navigation with mobile hamburger menu
  - User authentication status display
  - Dynamic navigation links based on auth state
  - Search integration
- **Location**: Fixed top navigation

#### `ControllerCard.vue`
**Purpose**: Product card component for catalog grid
- **Props**: `controller` (product object)
- **Features**:
  - Product image with hover effects
  - Basic product information (model, manufacturer, year)
  - Price display with formatting
  - Quick action buttons
- **Navigation**: Links to product detail page
- **Styling**: Card-based design with hover animations

#### `ControllerInfo.vue`
**Purpose**: Compact product information display for cards
- **Props**: `controller` (product object)
- **Features**:
  - Key count and type information
  - Pad count display
  - Connectivity badges
  - Technical specifications summary

#### `AdvancedSearch.vue`
**Purpose**: Comprehensive search and filtering interface
- **Props**: `controllers`, `sidebar-mode`
- **Features**:
  - Text search across multiple fields
  - Multi-select manufacturer filtering
  - Key count and type filters
  - Year and price range sliders
  - Quick filter buttons for common searches
  - Filter reset functionality
- **Events**: Emits search and filter change events

#### `ControllerDetailModal.vue`
**Purpose**: Modal dialog for detailed product information
- **Features**: Modal overlay with product details
- **Usage**: Triggered from product cards or detail views

#### `ProductBasicInfo.vue`
**Purpose**: Basic product information section in detail view
- **Features**: Model, manufacturer, year, price display
- **Layout**: Clean, organized information presentation

#### `ProductFeatureSection.vue`
**Purpose**: Product features and capabilities section
- **Features**: Organized display of product features and specifications
- **Styling**: Feature highlight boxes and badges

#### `ProductTechnicalSpecs.vue`
**Purpose**: Technical specifications table
- **Features**: Comprehensive technical data in table format
- **Data**: Dimensions, weight, connectivity, controls, power requirements

#### `LoadingSkeleton.vue`
**Purpose**: Loading state component
- **Features**: Animated skeleton screens for better UX during data loading
- **Usage**: Displayed while products are being fetched

#### `AppFooter.vue`
**Purpose**: Site footer component
- **Features**: Company information, links, copyright notice
- **Styling**: Consistent with overall site design

### 🔧 Composables (Reusable Logic)

#### `useAuth.js`
**Purpose**: Authentication-related logic
- **Functions**:
  - `login()` - User sign-in
  - `register()` - User registration
  - `logout()` - User sign-out
  - `resetPassword()` - Password recovery
  - `updateProfile()` - Profile updates
- **Returns**: Authentication state and methods

#### `useFilters.js`
**Purpose**: Product filtering logic
- **Functions**:
  - `handleSearch()` - Text search handling
  - `handleFiltersChanged()` - Filter state management
  - `resetFilters()` - Clear all filters
  - `setAdvancedFilters()` - Apply complex filter combinations
- **State**: Current filter values and search query

#### `usePagination.js`
**Purpose**: Pagination logic and controls
- **Functions**:
  - `getVisiblePages()` - Calculate visible page numbers
  - `setPage()` - Navigate to specific page
  - `nextPage()` - Navigate to next page
  - `previousPage()` - Navigate to previous page
- **State**: Current page, items per page, total pages

#### `useProductDetail.js`
**Purpose**: Product detail loading and management
- **Functions**:
  - `loadProduct(id)` - Fetch product by ID
  - `getProductSpecs()` - Format product specifications
- **State**: Product data, loading state, error handling

#### `useProductFormatting.js`
**Purpose**: Product data formatting utilities
- **Functions**:
  - `formatPrice()` - Price formatting with currency
  - `formatDimensions()` - Size formatting
  - `formatConnectivity()` - Connection type formatting
  - `formatWeight()` - Weight formatting
- **Usage**: Consistent data presentation across components

#### `useProductNavigation.js`
**Purpose**: Product navigation (previous/next)
- **Functions**:
  - `navigateToNext()` - Go to next product
  - `navigateToPrevious()` - Go to previous product
  - `getAdjacentProducts()` - Find neighboring products
- **Context**: Maintains position in filtered results

#### `useImageHandling.js`
**Purpose**: Image loading and error handling
- **Functions**:
  - `getImageUrl()` - Generate image URLs
  - `handleImageError()` - Fallback for missing images
  - `preloadImage()` - Optimize image loading
- **Features**: Local image serving with fallbacks

#### `useAnimations.js`
**Purpose**: UI animations and transitions
- **Functions**:
  - `onEnter()` - Element entrance animations
  - `onLeave()` - Element exit animations
  - `staggerChildren()` - Staggered list animations
- **Integration**: Works with Vue transition groups

### 🗄️ Stores (State Management)

#### `midiStore.js`
**Purpose**: Central store for product data and catalog state
- **State**:
  - `controllers` - Array of all products
  - `loading` - Loading state for async operations
  - `error` - Error messages
  - `searchQuery` - Current search text
  - `selectedFilters` - Active filter values
  - `sortBy` & `sortOrder` - Sorting configuration
  - `currentPage` & `itemsPerPage` - Pagination state
- **Computed**:
  - `manufacturers` - Unique manufacturer list
  - `keyCounts` - Available key count options
  - `keyTypes` - Available key type options
  - `years` - Available year options
  - `filteredControllers` - Products after filtering
  - `paginatedControllers` - Products for current page
- **Actions**:
  - `loadControllers()` - Fetch all products from Supabase
  - `getProductById(id)` - Fetch single product
  - `resetFilters()` - Clear all filters
  - `setSortBy()` - Update sorting
  - `setPage()` - Change current page

#### `authStore.js`
**Purpose**: User authentication and session management
- **State**:
  - `user` - Current user object
  - `loading` - Auth operation loading state
  - `error` - Authentication error messages
- **Computed**:
  - `isAuthenticated` - Boolean authentication status
  - `userEmail` - Current user email
  - `userDisplayName` - Formatted display name
- **Actions**:
  - `signUp()` - User registration
  - `signIn()` - User login
  - `signOut()` - User logout
  - `resetPassword()` - Password recovery
  - `updatePassword()` - Password update
  - `updateDisplayName()` - Profile update
  - `getCurrentUser()` - Get current session
  - `initializeAuth()` - Setup auth listeners

#### `counter.js`
**Purpose**: Simple counter store (example/template)
- **Usage**: Demonstrates basic Pinia store structure
- **State**: Simple counter value
- **Actions**: Increment, decrement, reset

### 🛜 Services (API Layer)

#### `productsService.js`
**Purpose**: Supabase database interactions for products
- **Class**: `ProductsService` with static methods
- **Methods**:
  - `getAllProducts()` - Fetch complete product catalog
  - `getProductById(id)` - Get single product by ID or image field
  - `searchProducts(filters)` - Advanced search with filtering
  - `getFilterOptions()` - Get unique values for filters
  - `getProductsCount()` - Get total product count
  - `transformProduct(product)` - Data formatting and cleanup
- **Features**:
  - Automatic data transformation
  - Price formatting (cents to dollars)
  - Array field parsing (JSON to arrays)
  - Error handling and logging
  - Backward compatibility support

### 🧭 Router Configuration

#### `router/index.js`
**Purpose**: Application routing and navigation guards
- **Routes**:
  - `/` - Catalog view (home page)
  - `/product/:id` - Product detail view
  - `/about` - About page
  - `/contact` - Contact page
  - `/login` - Login page (guest only)
  - `/register` - Registration page (guest only)
  - `/forgot-password` - Password recovery (guest only)
  - `/reset-password` - Password reset (guest only)
  - `/profile` - User profile (authenticated only)
- **Guards**:
  - `requiresAuth` - Protected routes requiring login
  - `requiresGuest` - Routes only accessible when not logged in
  - Auto-redirect based on authentication status

## 🎯 How It Works

### Application Flow

1. **Initialization**: `main.js` sets up Vue app with Pinia and router
2. **Auth Setup**: `authStore.initializeAuth()` establishes user session
3. **Data Loading**: `midiStore.loadControllers()` fetches products from Supabase
4. **Routing**: Vue Router handles navigation with auth guards
5. **State Management**: Pinia stores manage global application state
6. **UI Updates**: Reactive data updates trigger component re-renders

### Data Flow

```
Supabase Database → ProductsService → MidiStore → Vue Components
                                          ↓
                                   User Interactions
                                          ↓
                                   Store Mutations
                                          ↓
                                   Reactive Updates
```

### Authentication Flow

```
User Action → AuthStore → Supabase Auth → Session Update → Router Guards → Component Updates
```

### Search and Filtering

1. User inputs search criteria in `AdvancedSearch` component
2. Component emits filter events to parent view
3. Parent updates `midiStore` filter state
4. Store computes filtered results reactively
5. Components receive updated product list
6. UI re-renders with new results

### Product Detail Loading

1. User navigates to product detail page
2. Router extracts product ID from URL
3. `useProductDetail` composable loads product data
4. Service fetches from Supabase (with fallback to local search)
5. Product data populates detail view components
6. Related product navigation updates

## 📊 Database Schema

### Products Table (`products_atabase2`)

| Column | Type | Description |
|--------|------|-------------|
| `ID` | uuid | Primary key identifier |
| `Model` | text | Product model name |
| `Manufacturer-0` | text | Manufacturer/brand name |
| `Blog-headline-0` | text | Marketing headline |
| `Street Price-0` | text | Launch price in USD |
| `Year` | bigint | Release year |
| `keys_count` | bigint | Number of keys |
| `keys_type` | text | Type of keys (weighted, synth, etc.) |
| `pads_count` | text | Number of drum pads |
| `controls` | jsonb | Available controls array |
| `connectivity` | jsonb | Connection types array |
| `power` | jsonb | Power options array |
| `weight_lbs` | double precision | Weight in pounds |
| `dimensions_inches` | jsonb | Physical dimensions |
| `image` | text | Image filename |
| `IsController` | text | Controller classification |

## 🚀 Getting Started

### Prerequisites
- Node.js 20.x or higher
- npm or yarn package manager
- Supabase account and project

### Installation

1. **Clone the repository**
```bash
git clone [repository-url]
cd chileinstrumentos
```

2. **Install dependencies**
```bash
npm install
```

3. **Environment setup**
```bash
cp .env.example .env
# Edit .env with your Supabase credentials
```

4. **Database setup**
- Follow instructions in `SUPABASE_SETUP.md`
- Import product data to Supabase table

5. **Start development server**
```bash
npm run dev
```

### Available Scripts

```bash
npm run dev          # Start development server
npm run build        # Build for production
npm run preview      # Preview production build
npm run test:unit    # Run unit tests
npm run test:supabase # Test Supabase connection
npm run lint         # Lint code with ESLint
npm run format       # Format code with Prettier
```

### Development Workflow

1. **Feature Development**: Create feature branches for new functionality
2. **Component Creation**: Use existing components as templates
3. **State Management**: Update stores for new data requirements
4. **Testing**: Write unit tests for new components and functions
5. **Documentation**: Update this README for significant changes

## 🔧 Configuration

### Environment Variables
```env
VITE_SUPABASE_URL=your-supabase-project-url
VITE_SUPABASE_ANON_KEY=your-supabase-anon-key
```

### Build Configuration
- **Vite**: Modern build tool with HMR
- **Vue 3**: Composition API preferred
- **ESLint**: Code quality enforcement
- **Prettier**: Code formatting standards

## 🚢 Deployment

### Netlify (Recommended)
1. Connect repository to Netlify
2. Set environment variables in Netlify dashboard
3. Build command: `npm run build`
4. Publish directory: `dist`
5. Configure redirects for SPA routing

### Manual Deployment
```bash
npm run build
# Deploy dist/ folder to your hosting provider
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Support

For support and questions:
- Create an issue in the repository
- Check the troubleshooting section in `SUPABASE_SETUP.md`
- Review component documentation above

## 📈 Future Enhancements

- [ ] Advanced product comparison feature
- [ ] User favorites and wishlist
- [ ] Product reviews and ratings
- [ ] Enhanced search with filters
- [ ] Mobile app version
- [ ] API for third-party integrations
