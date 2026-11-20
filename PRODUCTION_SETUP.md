# Production Setup Guide

## Environment Variables

Configure these values in the production hosting provider's secret/environment
settings. Do not copy real credentials into source files or commit them.

Required:

- `DATABASE_URL`: PostgreSQL connection string with TLS enabled.
- `SHOPIFY_API_KEY` and `SHOPIFY_API_SECRET`: credentials from the Shopify app
  configuration.
- `SHOPIFY_APP_URL`: the public HTTPS origin of the deployed app.
- `SHOPIFY_REDIRECT_URL`: an OAuth callback URL registered with Shopify.
- `SHOPIFY_SCOPES`: the minimum scopes the app requires.

Optional, depending on enabled features:

- `OPENAI_API_KEY`, `ANTHROPIC_API_KEY`, `OPENAI_API_BASE_URL`, `LMSTUDIO_URL`
- `CRON_SECRET` for scheduled jobs
- Sentry settings: `NEXT_PUBLIC_SENTRY_DSN`, `SENTRY_AUTH_TOKEN`,
  `SENTRY_ORG`, and `SENTRY_PROJECT`
- `SHOPIFY_BILLING_ENABLED`

See [.env.example](./.env.example) for variable names and non-secret examples.
Keep local values in an ignored `.env.local` file.

## Shopify Partner Dashboard

Set the app URL to the deployed HTTPS origin and add the exact OAuth callback
URL configured by `SHOPIFY_REDIRECT_URL` to the allowed redirection URLs.
Ensure requested scopes match `SHOPIFY_SCOPES`. Configure the app's webhook
endpoint as `<SHOPIFY_APP_URL>/api/shopify/webhooks` if webhooks are enabled.

## Deployment

1. Configure environment variables in the hosting provider.
2. Apply Prisma migrations using the production database:
   `npx prisma migrate deploy`
3. Generate the Prisma client and build:
   `npx prisma generate` and `npm run build`
4. Deploy the build.
5. Test Shopify installation, product creation, product sync, webhook delivery,
   and scheduled jobs using a development store before production use.

## Security Checklist

- Never commit `.env`, `.env.local`, access tokens, database URLs, or API keys.
- Rotate any credential that has appeared in source control, logs, or chat.
- Use HTTPS for the app and OAuth callback URLs.
- Limit Shopify scopes to the app's actual requirements.
- Keep webhook HMAC validation enabled.
- Configure a strong `CRON_SECRET` when cron routes are exposed.
- Confirm production database backups and monitoring are enabled.
