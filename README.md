# iFruit storefront

Responsive React + Tailwind CSS store for a GTA-inspired *unofficial fan concept*, with one iFruit phone.

## Development

```bash
npm install
npm run dev
```

## Checkout architecture

The shopping bag supports quantity changes up to five devices. The checkout button posts the product ID and quantity to `/api/checkout`. The server sets the unit price to USD 699 and creates a **Stripe-hosted Checkout Session**; the frontend never receives the Stripe secret key or collects card numbers. Stripe redirects to `/success.html`, which calls `/api/checkout-status` to verify the session and display its payment status.

### Before enabling live sales

1. Have a legitimate business, a real phone available for sale, accurate product details, permission for relevant brand assets, and delivery/returns policies. **Do not charge customers for fictional products.**
2. Set `STRIPE_SECRET_KEY` in Vercel's **server-side** environment variables. Never expose or commit it.
3. Set `PUBLIC_SITE_URL` to the actual site origin, e.g. `https://your-domain.example`.
4. Set `ENABLE_LIVE_CHECKOUT=true` once all business requirements are met, and redeploy. Until this is configured, the API returns a clear 503 checkout-not-open response.
5. Test payment, refund, confirmation and abandoned checkout handling using Stripe test mode before switching to a live API key.
6. Configure real shipping rates, tax collection, customer support, privacy policy, cancellation policy, and terms before accepting payment. Shipping countries in the current API: US, Germany, UK, France and Spain.
7. Add an authenticated Stripe webhook (at minimum `checkout.session.completed` and relevant asynchronous payment events) and connect it to a real order/fulfillment system. **This code does not yet create shipping labels or fulfill orders.**

The account icon, mailing-list form, and video preview were removed rather than showing nonfunctional actions. The newswire articles and cart controls remain interactive. The project is not affiliated with Rockstar Games or Take-Two Interactive.
