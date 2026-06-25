import React, { useState } from 'react';
import { CreditCard, Smartphone, X, ShieldCheck, CheckCircle2 } from 'lucide-react';

const MockPaymentModal = ({ isOpen, onClose, onSuccess, courseTitle, amount }) => {
  const [method, setMethod] = useState('card');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handlePay = () => {
    setLoading(true);
    // Simulate API delay
    setTimeout(() => {
      setLoading(false);
      setSuccess(true);
      // Simulate success delay before calling onSuccess
      setTimeout(() => {
        onSuccess();
        setSuccess(false);
      }, 1500);
    }, 2000);
  };

  const formattedAmount = new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
  }).format(amount / 100);

  return (
    <div style={{ position: 'fixed', inset: 0, zIndex: 50, display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1rem', background: 'rgba(0,0,0,0.8)', backdropFilter: 'blur(4px)' }}>
      <div style={{ position: 'relative', width: '100%', maxWidth: '28rem', overflow: 'hidden', background: 'var(--bg-primary)', border: '1px solid rgba(255,255,255,0.1)', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)', borderRadius: '1.5rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '1.25rem', borderBottom: '1px solid rgba(255,255,255,0.05)', background: 'var(--bg-card)' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '2rem', height: '2rem', color: '#fff', borderRadius: '0.5rem', background: 'linear-gradient(to bottom right, #06b6d4, #6366f1)' }}>
              <ShieldCheck size={18} />
            </div>
            <h2 className="dashboard-section-title" style={{ marginBottom: 0 }}>Secure Checkout</h2>
          </div>
          <button 
            onClick={onClose} 
            style={{ padding: '0.25rem', borderRadius: '9999px', color: 'var(--text-secondary)', background: 'transparent', border: 'none', cursor: 'pointer' }}
            disabled={loading || success}
          >
            <X size={20} />
          </button>
        </div>

        {success ? (
          <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '2.5rem', gap: '1rem' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', width: '5rem', height: '5rem', color: '#34d399', background: 'rgba(52, 211, 153, 0.1)', borderRadius: '9999px' }}>
              <CheckCircle2 size={40} />
            </div>
            <h3 style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#34d399' }}>Payment Successful!</h3>
            <p style={{ textAlign: 'center', color: 'var(--text-secondary)' }}>Redirecting to course...</p>
          </div>
        ) : (
          <>
            {/* Order Summary */}
            <div style={{ padding: '1.5rem', background: 'var(--bg-primary)' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.05em', marginBottom: '0.25rem' }}>Order Summary</p>
              <h3 style={{ fontSize: '1.125rem', fontWeight: '600', color: 'var(--text-primary)', marginBottom: '1rem' }}>{courseTitle}</h3>
              <div style={{ display: 'flex', alignItems: 'baseline', justifyContent: 'space-between', paddingTop: '1rem', borderTop: '1px solid rgba(255,255,255,0.05)' }}>
                <span style={{ color: 'var(--text-secondary)' }}>Total Amount</span>
                <span style={{ fontSize: '1.5rem', fontWeight: 'bold', color: 'var(--accent)' }}>{formattedAmount}</span>
              </div>
            </div>

            {/* Payment Methods */}
            <div style={{ padding: '0 1.5rem 1.5rem', display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <p style={{ fontSize: '0.875rem', fontWeight: '500', color: 'var(--text-secondary)' }}>Select Payment Method</p>
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, minmax(0, 1fr))', gap: '0.75rem' }}>
                <button 
                  onClick={() => setMethod('card')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', border: '1px solid', borderRadius: '1rem', transition: 'all 0.2s',
                    borderColor: method === 'card' ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                    background: method === 'card' ? 'rgba(79, 70, 229, 0.1)' : 'var(--bg-card)',
                    color: method === 'card' ? 'var(--accent)' : 'var(--text-secondary)'
                  }}
                >
                  <CreditCard style={{ marginBottom: '0.5rem' }} size={24} />
                  <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>Card</span>
                </button>
                <button 
                  onClick={() => setMethod('upi')}
                  style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', padding: '1rem', border: '1px solid', borderRadius: '1rem', transition: 'all 0.2s',
                    borderColor: method === 'upi' ? 'var(--accent)' : 'rgba(255,255,255,0.1)',
                    background: method === 'upi' ? 'rgba(79, 70, 229, 0.1)' : 'var(--bg-card)',
                    color: method === 'upi' ? 'var(--accent)' : 'var(--text-secondary)'
                  }}
                >
                  <Smartphone style={{ marginBottom: '0.5rem' }} size={24} />
                  <span style={{ fontSize: '0.875rem', fontWeight: '600' }}>UPI</span>
                </button>
              </div>

              {/* Mock Fields */}
              {method === 'card' ? (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
                  <input type="text" placeholder="Card Number" defaultValue="4242 4242 4242 4242" readOnly style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)' }} />
                  <div style={{ display: 'flex', gap: '0.75rem' }}>
                    <input type="text" placeholder="MM/YY" defaultValue="12/25" readOnly style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', width: '50%' }} />
                    <input type="text" placeholder="CVC" defaultValue="123" readOnly style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)', width: '50%' }} />
                  </div>
                </div>
              ) : (
                <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem', paddingTop: '0.5rem' }}>
                  <input type="text" placeholder="UPI ID" defaultValue="user@okmock" readOnly style={{ padding: '0.75rem 1rem', borderRadius: '0.75rem', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.1)', color: 'var(--text-primary)' }} />
                </div>
              )}
            </div>

            {/* Footer / Actions */}
            <div style={{ padding: '0 1.5rem 1.5rem' }}>
              <button 
                onClick={handlePay}
                disabled={loading}
                className="btn-action"
                style={{ width: '100%', padding: '1rem', fontSize: '1rem' }}
              >
                {loading ? 'Processing...' : `Pay ${formattedAmount}`}
              </button>
              <p style={{ textAlign: 'center', fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '1rem', display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.25rem' }}>
                <ShieldCheck size={14} /> This is a secure mock payment gateway
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default MockPaymentModal;
