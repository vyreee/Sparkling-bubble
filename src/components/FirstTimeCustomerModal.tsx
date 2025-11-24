import { X, Gift } from 'lucide-react';

interface FirstTimeCustomerModalProps {
  isOpen: boolean;
  onClose: () => void;
  onClaim: () => void;
}

export default function FirstTimeCustomerModal({ isOpen, onClose, onClaim }: FirstTimeCustomerModalProps) {
  if (!isOpen) return null;

  const handleClaim = () => {
    onClaim();
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[10000] flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl shadow-2xl max-w-md w-full p-8 relative animate-bounce-in">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 text-gray-400 hover:text-gray-600 transition-colors"
        >
          <X className="w-6 h-6" />
        </button>

        {/* Content */}
        <div className="text-center">
          {/* Icon */}
          <div className="mb-6">
            <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-emerald-500 rounded-full flex items-center justify-center mx-auto animate-pulse">
              <Gift className="w-10 h-10 text-white" />
            </div>
          </div>

          {/* Title */}
          <h2 className="text-3xl font-bold text-gray-900 mb-3">
            Welcome! 🎉
          </h2>
          
          {/* Subtitle */}
          <p className="text-xl font-semibold text-green-600 mb-4">
            First-Time Customer Gift!
          </p>

          {/* Description */}
          <div className="bg-green-50 border-2 border-green-200 rounded-xl p-6 mb-6">
            <p className="text-lg font-bold text-green-800 mb-2">
              FREE Laundry Bag
            </p>
            <p className="text-sm text-green-700">
              As a thank you for choosing us, you'll receive a complimentary laundry bag with your first order!
            </p>
          </div>

          {/* Details */}
          <div className="text-left bg-gray-50 rounded-lg p-4 mb-6">
            <p className="text-sm text-gray-700 mb-2">
              <strong>What you get:</strong>
            </p>
            <ul className="text-sm text-gray-600 space-y-1">
              <li>• High-quality laundry bag</li>
              <li>• Perfect for organizing your clothes</li>
              <li>• Delivered with your first order</li>
              <li>• No extra charge!</li>
            </ul>
          </div>

          {/* Buttons */}
          <div className="flex gap-3">
            <button
              onClick={onClose}
              className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
            >
              No Thanks
            </button>
            <button
              onClick={handleClaim}
              className="flex-1 bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
            >
              Claim Free Bag!
            </button>
          </div>

          {/* Fine print */}
          <p className="text-xs text-gray-500 mt-4">
            * One free bag per customer. Offer valid for first-time customers only.
          </p>
        </div>
      </div>
    </div>
  );
}
