import { X, Trash2, Plus, Minus, ShoppingCart } from 'lucide-react';
import { useCart } from '../context/CartContext';
import { useNavigate } from 'react-router-dom';

interface CartModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function CartModal({ isOpen, onClose }: CartModalProps) {
  const { items, removeItem, updateQuantity, clearCart, getTotal, getItemCount } = useCart();
  const navigate = useNavigate();

  if (!isOpen) return null;

  const handleCheckout = () => {
    onClose();
    navigate('/checkout');
  };

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[9999] flex items-start justify-center p-4 overflow-y-auto pt-32">
      <div className="bg-white rounded-2xl shadow-2xl max-w-2xl w-full max-h-[calc(100vh-8rem)] flex flex-col my-auto">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-gray-200">
          <div className="flex items-center gap-3">
            <ShoppingCart className="w-6 h-6 text-blue-600" />
            <h2 className="text-2xl font-bold text-gray-900">
              Your Cart ({getItemCount()})
            </h2>
          </div>
          <button
            onClick={onClose}
            className="text-gray-400 hover:text-gray-600 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Cart Items */}
        <div className="flex-1 overflow-y-auto p-6">
          {items.length === 0 ? (
            <div className="text-center py-12">
              <ShoppingCart className="w-16 h-16 text-gray-300 mx-auto mb-4" />
              <p className="text-xl text-gray-500 mb-2">Your cart is empty</p>
              <p className="text-gray-400">Add some items to get started!</p>
            </div>
          ) : (
            <div className="space-y-4">
              {/* Show regular items (not prepay coupons) */}
              {items.filter(item => item.type !== 'prepay').map((item) => (
                <div
                  key={item.id}
                  className="bg-gray-50 rounded-xl p-4 flex items-center gap-4"
                >
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{item.name}</h3>
                    {item.category && (
                      <p className="text-sm text-gray-600 capitalize">
                        {item.category.replace('_', ' ')}
                      </p>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-500 mt-1">{item.description}</p>
                    )}
                    <p className="text-lg font-bold text-blue-600 mt-2">
                      ${item.price} {item.type === 'bundle' && '/ week'}
                    </p>
                  </div>

                  {/* Quantity Controls */}
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                      className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                      <Minus className="w-4 h-4" />
                    </button>
                    <span className="text-lg font-semibold text-gray-900 w-8 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                      className="w-8 h-8 rounded-full bg-white border-2 border-gray-300 flex items-center justify-center hover:border-blue-500 hover:text-blue-500 transition-colors"
                    >
                      <Plus className="w-4 h-4" />
                    </button>
                  </div>

                  {/* Remove Button */}
                  <button
                    onClick={() => removeItem(item.id)}
                    className="text-red-500 hover:text-red-700 transition-colors p-2"
                  >
                    <Trash2 className="w-5 h-5" />
                  </button>
                </div>
              ))}
              
              {/* Show applied coupons */}
              {items.filter(item => item.type === 'prepay').length > 0 && (
                <div className="mt-6 pt-4 border-t border-gray-200">
                  <h4 className="text-sm font-semibold text-gray-700 mb-3">Applied Discounts:</h4>
                  
                  {/* Explanation Card */}
                  <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-3">
                    <h5 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                      <span className="text-lg">💡</span>
                      How Your Prepay Coupon Works
                    </h5>
                    <ul className="text-sm text-blue-800 space-y-1">
                      <li>• <strong>Requires a bundle</strong> in your cart to apply</li>
                      <li>• <strong>Pay upfront</strong> for multiple weeks of service</li>
                      <li>• <strong>Get instant discount</strong> applied at checkout</li>
                      <li>• <strong>Save money</strong> compared to weekly payments</li>
                      <li>• Discount automatically applied when you checkout</li>
                    </ul>
                  </div>

                  {/* Warning if no bundle in cart */}
                  {!items.some(item => item.type === 'bundle') && (
                    <div className="bg-yellow-50 border border-yellow-300 rounded-lg p-3 mb-2">
                      <p className="text-yellow-800 text-sm font-semibold flex items-center gap-2">
                        <span className="text-lg">⚠️</span>
                        Add a bundle to your cart to use this coupon
                      </p>
                      <p className="text-yellow-700 text-xs mt-1">
                        Prepay coupons require a weekly bundle subscription to apply the discount.
                      </p>
                    </div>
                  )}

                  {/* Coupon Items */}
                  {items.filter(item => item.type === 'prepay').map((coupon) => (
                    <div key={coupon.id} className="bg-green-50 border border-green-200 rounded-lg p-3 flex items-center justify-between mb-2">
                      <div className="flex-1">
                        <p className="font-semibold text-green-800">{coupon.name}</p>
                        <p className="text-xs text-green-600">{coupon.description}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-green-700 font-bold">-${coupon.metadata?.savings || 0}</span>
                        <button
                          onClick={() => removeItem(coupon.id)}
                          className="text-red-500 hover:text-red-700 transition-colors p-1"
                          title="Remove coupon"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="border-t border-gray-200 p-6 space-y-4">
            {/* Calculate totals */}
            {(() => {
              const regularItems = items.filter(item => item.type !== 'prepay');
              const couponItems = items.filter(item => item.type === 'prepay');
              const subtotal = regularItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
              const discount = couponItems.reduce((sum, item) => sum + (item.metadata?.savings || 0), 0);
              const total = subtotal - discount;

              return (
                <>
                  {/* Subtotal */}
                  <div className="flex items-center justify-between text-gray-700">
                    <span>Subtotal:</span>
                    <span className="font-semibold">${subtotal.toFixed(2)}</span>
                  </div>

                  {/* Discount if applied */}
                  {discount > 0 && (
                    <div className="flex items-center justify-between text-green-600">
                      <span className="flex items-center gap-2">
                        <span className="bg-green-100 text-green-700 text-xs font-bold px-2 py-1 rounded">COUPON</span>
                        Discount:
                      </span>
                      <span className="font-bold">-${discount.toFixed(2)}</span>
                    </div>
                  )}

                  {/* Total */}
                  <div className="flex items-center justify-between text-2xl font-bold border-t pt-3">
                    <span className="text-gray-900">Total:</span>
                    <span className="text-green-600">${total.toFixed(2)}</span>
                  </div>

                  {/* Savings message */}
                  {discount > 0 && (
                    <div className="bg-green-50 border border-green-200 rounded-lg p-3 text-center">
                      <p className="text-green-800 font-semibold">
                        🎉 You're saving ${discount.toFixed(2)}!
                      </p>
                    </div>
                  )}
                </>
              );
            })()}

            <div className="flex gap-3">
              <button
                onClick={clearCart}
                className="flex-1 bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-3 px-6 rounded-lg transition-all duration-200"
              >
                Clear Cart
              </button>
              <button
                onClick={handleCheckout}
                className="flex-1 bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700 text-white font-semibold py-3 px-6 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl"
              >
                Proceed to Checkout
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
