# Shopify Partner Dashboard Configuration

## App URLs

Configure these values in the Shopify app settings. Replace the production
domain with the HTTPS domain configured as `SHOPIFY_APP_URL`.

- Development app URL: `http://localhost:3000`
- Development OAuth callback: `http://localhost:3000/api/shopify/callback`
- Production app URL: `https://your-production-domain.com`
- Production OAuth callback:
  `https://your-production-domain.com/api/shopify/callback`
- Webhook endpoint:
  `https://your-production-domain.com/api/shopify/webhooks`

The callback must match the OAuth callback route used by the installed app.
Register only the URLs required for the environment.

## Credentials and Scopes

Store the Shopify API key and secret in your local ignored `.env.local` file
and your hosting provider's secret settings. Do not put credential values in
this document or commit them.

The configured scopes are:

- `read_products`
- `write_products`
- `read_orders`
- `read_customers`

Request only scopes needed by enabled features, and keep the Partner Dashboard
and `SHOPIFY_SCOPES` setting synchronized.

## Testing

1. Install the app on a Shopify development store.
2. Verify the OAuth callback and dashboard session.
3. Test product creation and synchronization.
4. Verify webhook delivery and app uninstall handling.
5. Before production, configure HTTPS URLs and the production secrets in the
   hosting provider.

## Security

- Never commit API secrets, access tokens, or database URLs.
- Rotate credentials that have appeared in source control or shared logs.
- Use HTTPS for production callback and webhook URLs.
- Keep webhook HMAC validation enabled.
