# Stripe Test Account Setup

## Getting Started with Stripe Test Mode

### 1. Create a Stripe Account
- Go to [stripe.com](https://stripe.com)
- Sign up for a free account
- Verify your email

### 2. Obtain Test API Keys
- Log into Stripe Dashboard
- Navigate to **Developers** → **API Keys**
- You'll find two keys in Test Mode:
  - **Publishable Key**: `pk_test_...` (public, use in frontend)
  - **Secret Key**: `sk_test_...` (private, use in backend)
- Copy your **Secret Key** (starts with `sk_test_`)

### 3. Configure Payment Service

#### Option A: Environment Variable (Recommended for Production)
```bash
export STRIPE_API_KEY=sk_test_your_actual_test_key_here
```

Then start the payment service:
```bash
cd payment
mvn spring-boot:run
```

#### Option B: application.yml (Local Development)
Edit `payment/src/main/resources/application.yml`:
```yaml
stripe:
  mock: false
  api-key: sk_test_your_actual_test_key_here
```

### 4. Test With Stripe Test Cards

Use these test card numbers in the booking flow:

#### Successful Payment
- **Card Number**: `4242 4242 4242 4242`
- **Expiry**: Any future date (e.g., 12/2028)
- **CVC**: Any 3 digits (e.g., 123)
- **Result**: Payment succeeds

#### Declined Payment
- **Card Number**: `4000 0000 0000 0002`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **Result**: Card declined

#### Requires Authentication (3D Secure)
- **Card Number**: `4000 0025 0000 0003`
- **Expiry**: Any future date
- **CVC**: Any 3 digits
- **Result**: Requires additional authentication

### 5. Verify Configuration

The payment service is now configured to:
- Use **real Stripe test mode** (`stripe.mock: false`)
- Fetch API key from environment variable `STRIPE_API_KEY` or fall back to `application.yml`
- Process actual Stripe payment intents (no mock responses)

### 6. Monitor Payments

Monitor test payments in Stripe Dashboard:
- **Developers** → **Events** → View webhook calls
- **Payments** → See all test transactions
- All test payments are prefixed with `test_` and won't charge your card

### Important Notes

⚠️ **Never commit real API keys to Git**
- Use environment variables in production
- Use `.env` file locally (add to `.gitignore`)
- Rotate keys if accidentally exposed

### Troubleshooting

If payment fails:
1. Verify the API key is correct: `sk_test_` prefix
2. Check Stripe Dashboard Events for detailed error
3. Ensure card details match test card format exactly
4. Verify CVC is 3-4 digits
5. Check network connectivity to `api.stripe.com`
