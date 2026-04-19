import { useState } from 'react';
import { X, CheckCircle, AlertCircle, Clock, MapPin, Ticket } from 'lucide-react';
import { Movie, Schedule, SeatAvailability, Cinema } from '../types';
import { PaymentForm } from './PaymentForm';

interface CheckoutModalProps {
  isOpen: boolean;
  movie: Movie;
  cinema: Cinema;
  schedule: Schedule;
  selectedSeat: SeatAvailability;
  seatPrice: number;
  onClose: () => void;
  onPaymentSuccess: (cardDetails: {
    cardNumber: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  }) => Promise<void>;
  isProcessing: boolean;
  error?: string;
}

export function CheckoutModal({
  isOpen,
  movie,
  cinema,
  schedule,
  selectedSeat,
  seatPrice,
  onClose,
  onPaymentSuccess,
  isProcessing,
  error,
}: CheckoutModalProps) {
  const [paymentStep, setPaymentStep] = useState<'review' | 'payment' | 'success'>('review');

  if (!isOpen) return null;

  const formatDate = (dateString: string) => {
    const date = new Date(dateString + 'T00:00:00');
    return date.toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' });
  };

  const formatTime = (timeString: string) => {
    const [hours, minutes] = timeString.split(':');
    return `${hours}:${minutes}`;
  };

  const handlePaymentSuccess = async (cardDetails: {
    cardNumber: string;
    expMonth: number;
    expYear: number;
    cvc: string;
  }) => {
    try {
      await onPaymentSuccess(cardDetails);
      setPaymentStep('success');
      setTimeout(() => {
        setPaymentStep('review');
        onClose();
      }, 3000);
    } catch (err) {
      // Error is displayed in the form
    }
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl">
        {/* Header */}
        <div className="sticky top-0 bg-gradient-to-r from-blue-600 to-blue-700 text-white p-6 flex justify-between items-center">
          <h2 className="text-2xl font-bold">
            {paymentStep === 'success' ? '✓ Payment Successful' : 'Complete Your Booking'}
          </h2>
          {paymentStep !== 'success' && (
            <button
              onClick={onClose}
              disabled={isProcessing}
              className="hover:bg-blue-800 rounded-full p-2 transition-colors disabled:opacity-50"
            >
              <X className="h-6 w-6" />
            </button>
          )}
        </div>

        <div className="p-8">
          {paymentStep === 'success' ? (
            // Success State
            <div className="text-center py-12">
              <div className="mx-auto mb-6">
                <CheckCircle className="h-20 w-20 text-green-500 mx-auto" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-2">Payment Confirmed!</h3>
              <p className="text-gray-600 mb-6">Your ticket has been successfully booked.</p>
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 mb-6">
                <p className="text-sm text-green-800">
                  Check your email for ticket confirmation. A confirmation notification has been sent.
                </p>
              </div>
              <p className="text-xs text-gray-500">Redirecting to dashboard...</p>
            </div>
          ) : paymentStep === 'review' ? (
            // Review Step
            <div className="space-y-8">
              {/* Booking Summary */}
              <div className="bg-gray-50 rounded-xl p-6 space-y-6">
                <h3 className="font-bold text-lg text-gray-900">Booking Summary</h3>

                <div className="space-y-4">
                  {/* Movie */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Ticket className="h-6 w-6 text-blue-600 mt-1" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-600">Movie</p>
                      <p className="font-semibold text-gray-900">{movie.movieName}</p>
                    </div>
                  </div>

                  {/* Cinema */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <MapPin className="h-6 w-6 text-blue-600 mt-1" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-600">Cinema</p>
                      <p className="font-semibold text-gray-900">{cinema.cinemaName}</p>
                      <p className="text-sm text-gray-500">{cinema.cinemaLocation}</p>
                    </div>
                  </div>

                  {/* Date & Time */}
                  <div className="flex gap-4">
                    <div className="flex-shrink-0">
                      <Clock className="h-6 w-6 text-blue-600 mt-1" />
                    </div>
                    <div className="flex-grow">
                      <p className="text-sm text-gray-600">Date & Time</p>
                      <p className="font-semibold text-gray-900">
                        {formatDate(schedule.date)} at {formatTime(schedule.startTime)}
                      </p>
                    </div>
                  </div>

                  {/* Seat */}
                  <div className="border-t pt-4">
                    <div className="flex justify-between items-center">
                      <div>
                        <p className="text-sm text-gray-600">Seat</p>
                        <p className="font-semibold text-gray-900">
                          Row {selectedSeat.row}, Seat {selectedSeat.seatNumber}
                        </p>
                        <p className="text-sm text-gray-500 capitalize">{selectedSeat.type} Seat</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm text-gray-600">Price</p>
                        <p className="text-2xl font-bold text-blue-600">${(seatPrice / 100).toFixed(2)}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>

              {/* Proceed Button */}
              <button
                onClick={() => setPaymentStep('payment')}
                disabled={isProcessing}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Proceed to Payment
              </button>
            </div>
          ) : (
            // Payment Step
            <div className="space-y-6">
              {/* Back Button */}
              <button
                onClick={() => setPaymentStep('review')}
                disabled={isProcessing}
                className="text-blue-600 hover:text-blue-700 font-medium text-sm disabled:opacity-50"
              >
                ← Back to Review
              </button>

              {/* Price Breakdown */}
              <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
                <div className="flex justify-between items-center">
                  <span className="font-medium text-gray-900">Total Amount</span>
                  <span className="text-2xl font-bold text-blue-600">${(seatPrice / 100).toFixed(2)}</span>
                </div>
              </div>

              {/* Payment Form */}
              <PaymentForm
                amount={seatPrice}
                onSubmit={handlePaymentSuccess}
                isLoading={isProcessing}
                error={error}
              />

              {/* Terms */}
              <div className="text-center text-xs text-gray-500 space-y-2">
                <p>By completing this purchase, you agree to our</p>
                <div className="flex justify-center gap-4">
                  <a href="#" className="hover:underline text-blue-600">
                    Terms of Service
                  </a>
                  <span>•</span>
                  <a href="#" className="hover:underline text-blue-600">
                    Privacy Policy
                  </a>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
