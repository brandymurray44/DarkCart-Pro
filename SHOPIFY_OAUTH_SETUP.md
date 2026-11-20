# Shopify OAuth Integration Setup - Darkcart-Pro

## Overview
This document describes the complete Shopify OAuth integration setup for Darkcart-Pro, including all endpoints, credentials, and testing instructions.

## Configuration

### Environment Variables
All credentials are configured in `.env.local`:

```env
# Shopify OAuth
SHOPIFY_API_KEY=
SHOPIFY_API_SECRET=
SHOPIFY_SCOPES=read_customers,read_orders,read_products,write_products
SHOPIFY_REDIRECT_URL=http://localhost:3000/api/auth/shopify/callback
SHOPIFY_APP_URL=http://localhost:3000
SHOPIFY_DEV_STORE_DOMAIN=darkcart-dev.myshopify.com
SHOPIFY_API_VERSION=2026-04
SHOPIFY_EMBEDDED_APP=true
SHOPIFY_USE_LEGACY_INSTALL_FLOW=false
SHOPIFY_BILLING_ENABLED=false
```

### App Details
- **App Name**: Darkcart-Pro
- **API Version**: 2026-04
- **Scopes**: read_customers, read_orders, read_products, write_products
- **Dev Store**: darkcart-dev.myshopify.com
- **Embedded App**: true

## Implemented Endpoints

### 1. OAuth Flow Endpoints

#### `/api/auth/shopify/login` (GET)
**Purpose**: Initiates Shopify OAuth flow

**Features**:
- Validates shop domain format
- Rate limiting (5 requests/minute per shop)
- Generates secure state parameter
- Sets HttpOnly cookie for state validation
- Redirects to Shopify OAuth authorization

**Query Parameters**:
- `shop` (required): Shopify shop domain (e.g., darkcart-dev.myshopify.com)

**Response**:
- 307 Redirect to Shopify OAuth
- Sets `shopify_oauth_state` cookie

#### `/api/auth/shopify/callback` (GET)
**Purpose**: Handles OAuth callback from Shopify

**Features**:
- Validates HMAC signature (timing-safe comparison)
- Validates OAuth state parameter
- Rate limiting (10 requests/minute per shop)
- Exchanges authorization code for access token
- Creates/updates user and shop records
- Registers webhooks (app/uninstalled, orders/create, products/update)
- Creates user session
- Redirects to `/dashboard?shop={domain}&success=true`

**Query Parameters** (from Shopify):
- `shop` (required): Shop domain
- `code` (required): Authorization code
- `state` (required): OAuth state parameter
- `hmac` (required): HMAC signature

**Response**:
- 302 Redirect to `/dashboard` on success
- 400/403/500 on validation errors

### 2. Product Management Endpoints

#### `/api/shopify/products/create` (POST)
**Purpose**: Create a new product in Shopify

**Authentication**: Required (session-based)

**Request Body**:
```json
{
  "title": "Product Title",
  "body_html": "<p>Product description</p>",
  "tags": ["tag1", "tag2"],
  "seo_title": "SEO Title",
  "seo_description": "SEO Description",
  "status": "draft",
  "product_type": "Physical",
  "vendor": "Brand Name"
}
```

**Response**:
- 200: `{ success: true, data: { product: {...} } }`
- 401: Unauthorized
- 403: Invalid CSRF token
- 500: Server error

#### `/api/shopify/products/sync` (POST/GET)
**Purpose**: Sync products between Shopify and local database

**POST - Sync from Shopify**:
- Fetches all products from Shopify (up to 250 per page)
- Upserts products to local database
- Returns sync statistics

**GET - List Synced Products**:
- Returns locally stored products for the authenticated user

**Response**:
```json
{
  "success": true,
  "data": {
    "synced": 10,
    "total": 10,
    "products": [...]
  }
}
```

### 3. Webhook Endpoint

#### `/api/shopify/webhooks` (POST)
**Purpose**: Handle Shopify webhooks

**Headers Required**:
- `X-Shopify-Hmac-SHA256`: Webhook HMAC signature
- `X-Shopify-Topic`: Webhook topic
- `X-Shopify-Shop-Domain`: Shop domain

**Supported Topics**:
- `app/uninstalled`: Clears access tokens when app is uninstalled
- `products/update`: Logs product updates
- `orders/create`: Logs order creation

**Response**:
- 200: `{ success: true }`
- 400: Missing HMAC or invalid topic
- 401: Invalid HMAC signature
- 413: Payload too large (>1MB)

## Core Libraries

### `src/lib/shopifyAdminClient.ts`
Reusable Shopify Admin API client class

**Features**:
- Generic GET/POST/PUT/DELETE methods
- Product CRUD operations
- Shop info retrieval
- Automatic API versioning
- Error handling

**Usage**:
```typescript
import { createShopifyAdminClient } from "@/lib/shopifyAdminClient";

const client = createShopifyAdminClient(shopDomain, accessToken);
const product = await client.createProduct({
  title: "New Product",
  status: "draft"
});
```

### `src/lib/shopifyOAuth.ts`
OAuth utility functions

**Functions**:
- `validateShopifyHmac()`: Validates HMAC signatures (timing-safe)
- `exchangeCodeForToken()`: Exchanges auth code for access token
- `fetchShopMetadata()`: Fetches shop information
- `getShopProductCount()`: Gets product count

### `src/lib/shopify.ts`
Shopify utility functions

**Functions**:
- `buildShopifyAuthUrl()`: Builds OAuth authorization URL
- `validateShopifyShop()`: Validates shop domain format
- `createShopifyProduct()`: Creates product via Admin API

### `src/services/shopify/webhookService.ts`
Webhook handling service

**Functions**:
- `validateShopifyWebhookHmac()`: Validates webhook HMAC
- `registerShopifyWebhooks()`: Registers webhooks with Shopify
- `processShopifyWebhookEvent()`: Processes incoming webhooks

## Database Schema

### Prisma Models Used

#### `Shop` Model
```prisma
model Shop {
  id               String   @id @default(uuid())
  shopifyDomain    String   @unique
  accessToken      String
  refreshToken     String?
  scopes           String
  user             User     @relation(fields: [userId], references: [id])
  userId           String   @unique
  products         Product[]
}
```

#### `Product` Model
```prisma
model Product {
  id                String   @id @default(uuid())
  shopId            String
  shopifyProductId  String?
  title             String
  description       String
  tags              String[]
  published         Boolean @default(false)
}
```

## Security Features

1. **HMAC Validation**: All OAuth callbacks and webhooks validate HMAC signatures using timing-safe comparison
2. **State Parameter**: OAuth flow uses cryptographically secure state parameter stored in HttpOnly cookies
3. **Rate Limiting**: All endpoints have rate limiting to prevent abuse
4. **CSRF Protection**: Product endpoints require CSRF tokens
5. **Input Sanitization**: All user inputs are sanitized to prevent XSS
6. **Session Management**: Secure session creation and validation

## Testing

### Automated Tests
Run the test script:
```bash
node test-shopify-oauth.mjs
```

### Manual Testing

1. **Start the dev server**:
   ```bash
   npm run dev
   ```

2. **Test OAuth login**:
   ```bash
   curl "http://localhost:3000/api/auth/shopify/login?shop=darkcart-dev.myshopify.com"
   ```

   Expected: 307 redirect to Shopify OAuth

3. **Complete OAuth flow**:
   - Visit: `http://localhost:3000/api/auth/shopify/login?shop=darkcart-dev.myshopify.com`
   - Authorize the app in Shopify
   - Should redirect to `/dashboard?shop=darkcart-dev.myshopify.com&success=true`

4. **Test product creation** (requires authentication):
   ```bash
   curl -X POST http://localhost:3000/api/shopify/products/create \
     -H "Content-Type: application/json" \
     -d '{"title":"Test Product","description":"Test"}'
   ```

5. **Test product sync** (requires authentication):
   ```bash
   curl -X POST http://localhost:3000/api/shopify/products/sync
   ```

## Shopify Partner Dashboard Setup

### App Configuration
1. Go to https://partners.shopify.com
2. Select your app (Darkcart-Pro)
3. Navigate to **App setup** > **Configuration**

### Required Settings:
- **App name**: Darkcart-Pro
- **App URL**: `http://localhost:3000`
- **Redirection URLs**: `http://localhost:3000/api/auth/shopify/callback`
- **Allowed redirection URL scheme**: `http://`
- **Embedded app**: Yes

### Webhook Configuration
Webhooks are automatically registered during OAuth, but you can also configure them manually:

1. Navigate to **App setup** > **Webhooks**
2. Add webhooks:
   - Topic: `app/uninstalled`
   - Address: `http://localhost:3000/api/shopify/webhooks`
   - Format: JSON

## API Version Updates

The integration uses API version **2026-04**. To update:

1. Update `SHOPIFY_API_VERSION` in `.env.local`
2. The version is automatically used across all API calls via:
   - `src/lib/shopify.ts`
   - `src/lib/shopifyOAuth.ts`
   - `src/lib/shopifyAdminClient.ts`
   - `src/services/shopify/webhookService.ts`

## Troubleshooting

### RateLimitEntry table doesn't exist
Run Prisma migrations:
```bash
# Ensure your Neon database is running (not paused)
# Then run:
npx prisma migrate dev --name add_rate_limit_table
npx prisma generate
```

**Note**: If you get a "Can't reach database server" error, your Neon database may be paused.
Visit https://neon.tech to wake up your database and try again.

### OAuth state mismatch
- Ensure cookies are enabled
- Check that `shopify_oauth_state` cookie is being set
- Verify cookie settings (HttpOnly, SameSite, Secure)

### HMAC validation fails
- Verify `SHOPIFY_API_SECRET` is correct
- Check that callback URL matches exactly in Shopify Partner Dashboard
- Ensure no URL encoding issues

### Webhook not receiving events
- Verify webhook URL is publicly accessible (use ngrok for local development)
- Check webhook logs in Shopify Partner Dashboard
- Ensure HMAC validation is passing

## Next Steps

1. **Test OAuth Flow**: Complete the OAuth flow with your dev store
2. **Verify Webhooks**: Test webhook registration and handling
3. **Product Operations**: Test creating and syncing products
4. **Production Deployment**: Update environment variables for production
5. **App Review**: Prepare for Shopify app review if publishing publicly

## Files Created/Modified

### New Files
- `src/app/api/auth/shopify/login/route.ts` - OAuth login endpoint
- `src/app/api/auth/shopify/callback/route.ts` - OAuth callback endpoint
- `src/app/api/shopify/products/create/route.ts` - Product creation endpoint
- `src/app/api/shopify/products/sync/route.ts` - Product sync endpoint
- `src/lib/shopifyAdminClient.ts` - Reusable Admin API client
- `test-shopify-oauth.mjs` - Test script
- `SHOPIFY_OAUTH_SETUP.md` - This documentation

### Modified Files
- `.env.local` - Updated with new credentials
- `src/lib/shopify.ts` - Updated API version to 2026-04
- `src/lib/shopifyOAuth.ts` - Updated API version to 2026-04
- `src/services/shopify/webhookService.ts` - Updated API version to 2026-04
- `src/lib/env.ts` - Added SHOPIFY_REDIRECT_URL support

## Support

For issues or questions:
1. Check the test output: `node test-shopify-oauth.mjs`
2. Review server logs in the terminal
3. Verify Shopify Partner Dashboard configuration
4. Check Prisma database migrations