import { useState } from 'react';
import { CreditCard, Lock, AlertCircle } from 'lucide-react';
import { Button } from './Button';

interface PaymentFormProps {
  amount: number;
  onSubmit: (cardDetails: {
    cardNumber: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  }) => Promise<void>;
  isLoading: boolean;
  error?: string;
}

export function PaymentForm({ amount, onSubmit, isLoading, error }: PaymentFormProps) {
  const [formData, setFormData] = useState({
    cardNumber: '',
    expMonth: '',
    expYear: '',
    cvc: '',
    cardholderName: '',
  });

  const [formErrors, setFormErrors] = useState<Record<string, string>>({});

  const validateForm = (): boolean => {
    const errors: Record<string, string> = {};

    // Validate card number (basic validation)
    if (!formData.cardNumber.replace(/\s/g, '').match(/^\d{13,19}$/)) {
      errors.cardNumber = 'Invalid card number';
    }

    // Validate exp month
    if (!formData.expMonth || parseInt(formData.expMonth) < 1 || parseInt(formData.expMonth) > 12) {
      errors.expMonth = 'Invalid month (01-12)';
    }

    // Validate exp year
    const currentYear = new Date().getFullYear();
    if (!formData.expYear || parseInt(formData.expYear) < currentYear) {
      errors.expYear = 'Card expired or invalid year';
    }

    // Validate CVC
    if (!formData.cvc.match(/^\d{3,4}$/)) {
      errors.cvc = 'Invalid CVC (3-4 digits)';
    }

    // Validate cardholder name
    if (!formData.cardholderName.trim()) {
      errors.cardholderName = 'Cardholder name is required';
    }

    setFormErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const formatCardNumber = (value: string): string => {
    const v = value.replace(/\s+/g, '').replace(/[^0-9]/gi, '');
    const matches = v.match(/\d{4,16}/g);
    const match = (matches && matches[0]) || '';
    const parts: string[] = [];

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4));
    }

    if (parts.length) {
      return parts.join(' ');
    } else {
      return value;
    }
  };

  const handleCardNumberChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = formatCardNumber(e.target.value);
    setFormData({ ...formData, cardNumber: value });
    if (formErrors.cardNumber) {
      setFormErrors({ ...formErrors, cardNumber: '' });
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    try {
      await onSubmit({
        cardNumber: formData.cardNumber.replace(/\s/g, ''),
        expMonth: parseInt(formData.expMonth),
        expYear: parseInt(formData.expYear),
        cvc: formData.cvc,
      });
    } catch (err) {
      // Error is handled by parent component
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="flex items-center gap-3 p-4 bg-red-50 border border-red-200 rounded-lg">
          <AlertCircle className="h-5 w-5 text-red-600 flex-shrink-0" />
          <p className="text-sm text-red-800">{error}</p>
        </div>
      )}

      {/* Cardholder Name */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Cardholder Name
        </label>
        <input
          type="text"
          value={formData.cardholderName}
          onChange={(e) => {
            setFormData({ ...formData, cardholderName: e.target.value });
            if (formErrors.cardholderName) {
              setFormErrors({ ...formErrors, cardholderName: '' });
            }
          }}
          className={`w-full px-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
            formErrors.cardholderName ? 'border-red-500' : 'border-gray-300'
          }`}
          placeholder="John Doe"
          disabled={isLoading}
        />
        {formErrors.cardholderName && (
          <p className="mt-1 text-sm text-red-600">{formErrors.cardholderName}</p>
        )}
      </div>

      {/* Card Number */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">
          Card Number
        </label>
        <div className="relative">
          <CreditCard className="absolute left-4 top-3 h-5 w-5 text-gray-400" />
          <input
            type="text"
            value={formData.cardNumber}
            onChange={handleCardNumberChange}
            placeholder="4242 4242 4242 4242"
            maxLength="19"
            className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 ${
              formErrors.cardNumber ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
        </div>
        {formErrors.cardNumber && (
          <p className="mt-1 text-sm text-red-600">{formErrors.cardNumber}</p>
        )}
        <p className="mt-2 text-xs text-gray-500">Test card: 4242 4242 4242 4242</p>
      </div>

      {/* Expiry and CVC */}
      <div className="grid grid-cols-3 gap-4">
        {/* Expiry Month */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Month
          </label>
          <input
            type="number"
            min="1"
            max="12"
            value={formData.expMonth}
            onChange={(e) => {
              setFormData({ ...formData, expMonth: e.target.value });
              if (formErrors.expMonth) {
                setFormErrors({ ...formErrors, expMonth: '' });
              }
            }}
            placeholder="MM"
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center ${
              formErrors.expMonth ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {formErrors.expMonth && (
            <p className="mt-1 text-xs text-red-600">{formErrors.expMonth}</p>
          )}
        </div>

        {/* Expiry Year */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Year
          </label>
          <input
            type="number"
            min={new Date().getFullYear()}
            value={formData.expYear}
            onChange={(e) => {
              setFormData({ ...formData, expYear: e.target.value });
              if (formErrors.expYear) {
                setFormErrors({ ...formErrors, expYear: '' });
              }
            }}
            placeholder="YYYY"
            className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center ${
              formErrors.expYear ? 'border-red-500' : 'border-gray-300'
            }`}
            disabled={isLoading}
          />
          {formErrors.expYear && (
            <p className="mt-1 text-xs text-red-600">{formErrors.expYear}</p>
          )}
        </div>

        {/* CVC */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            CVC
          </label>
          <div className="relative">
            <Lock className="absolute right-3 top-3 h-5 w-5 text-gray-400" />
            <input
              type="text"
              value={formData.cvc}
              onChange={(e) => {
                const value = e.target.value.replace(/\D/g, '').slice(0, 4);
                setFormData({ ...formData, cvc: value });
                if (formErrors.cvc) {
                  setFormErrors({ ...formErrors, cvc: '' });
                }
              }}
              placeholder="123"
              maxLength="4"
              className={`w-full px-3 py-3 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 text-center pr-10 ${
                formErrors.cvc ? 'border-red-500' : 'border-gray-300'
              }`}
              disabled={isLoading}
            />
          </div>
          {formErrors.cvc && (
            <p className="mt-1 text-xs text-red-600">{formErrors.cvc}</p>
          )}
        </div>
      </div>

      {/* Security Notice */}
      <div className="flex items-start gap-2 p-4 bg-blue-50 rounded-lg">
        <Lock className="h-4 w-4 text-blue-600 mt-0.5 flex-shrink-0" />
        <p className="text-xs text-blue-800">
          Your payment information is encrypted and secure. We do not store card details on our servers.
        </p>
      </div>

      {/* Submit Button */}
      <Button
        type="submit"
        disabled={isLoading}
        className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors"
      >
        {isLoading ? (
          <div className="flex items-center justify-center gap-2">
            <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
            Processing Payment...
          </div>
        ) : (
          <div className="flex items-center justify-center gap-2">
            <Lock className="h-5 w-5" />
            Pay ${(amount / 100).toFixed(2)}
          </div>
        )}
      </Button>

      {/* Test Info */}
      <div className="text-center text-xs text-gray-500 border-t pt-4">
        <p>Test Mode: Use card ending in 4242 for successful payment</p>
      </div>
    </form>
  );
}
