
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Modal } from '../ui/Modal';
import { Button } from '../ui/Button';
import { CheckCircle, Clock, CreditCard, Calendar } from 'lucide-react';

interface BookingModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  price: number;
}

const MOCK_SLOTS = [
    { id: 1, time: '09:00 AM', available: true },
    { id: 2, time: '10:00 AM', available: true },
    { id: 3, time: '11:00 AM', available: false },
    { id: 4, time: '02:00 PM', available: true },
    { id: 5, time: '03:00 PM', available: true },
];

const MOCK_PAYMENT_METHODS = [
    { id: 1, type: 'visa', last4: '4242', icon: '💳' },
    { id: 2, type: 'mastercard', last4: '8888', icon: '💳' },
    { id: 3, type: 'wallet', balance: 500, icon: '💰' },
];

export const BookingModal: React.FC<BookingModalProps> = ({ isOpen, onClose, title, price }) => {
  const { t, language } = useLanguage();
  const [step, setStep] = useState(1); // 1: Time, 2: Payment, 3: Success
  const [selectedSlot, setSelectedSlot] = useState<number | null>(null);
  const [selectedPayment, setSelectedPayment] = useState<number | null>(null);
  const [selectedDate, setSelectedDate] = useState(new Date().toISOString().split('T')[0]);

  const reset = () => {
      setStep(1);
      setSelectedSlot(null);
      setSelectedPayment(null);
      onClose();
  };

  const handleNext = () => {
      if (step === 1 && selectedSlot) setStep(2);
      else if (step === 2 && selectedPayment) {
          // Simulate API Call
          setTimeout(() => setStep(3), 1000);
      }
  };

  return (
    <Modal isOpen={isOpen} onClose={reset} title={step === 3 ? '' : t.bookNow}>
      <div className="space-y-6">
        {/* Header Info */}
        {step !== 3 && (
            <div className="bg-slate-50 p-4 rounded-xl border border-slate-100">
                <h4 className="font-bold text-slate-900">{title}</h4>
                <p className="text-primary font-semibold mt-1">{price} {t.sar}</p>
            </div>
        )}

        {/* Step 1: Select Time */}
        {step === 1 && (
            <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <Calendar size={18} />
                    <span>{t.selectTime}</span>
                </div>
                <input 
                    type="date" 
                    value={selectedDate} 
                    onChange={(e) => setSelectedDate(e.target.value)}
                    className="w-full p-2 rounded-lg border border-slate-200 mb-4"
                />
                <div className="grid grid-cols-3 gap-3">
                    {MOCK_SLOTS.map(slot => (
                        <button
                            key={slot.id}
                            disabled={!slot.available}
                            onClick={() => setSelectedSlot(slot.id)}
                            className={`py-2 px-1 rounded-lg text-sm font-medium border transition-all ${
                                selectedSlot === slot.id
                                    ? 'bg-primary text-white border-primary shadow-md'
                                    : slot.available 
                                        ? 'bg-white text-slate-700 border-slate-200 hover:border-primary'
                                        : 'bg-slate-100 text-slate-400 border-slate-100 cursor-not-allowed'
                            }`}
                        >
                            {slot.time}
                        </button>
                    ))}
                </div>
            </div>
        )}

        {/* Step 2: Select Payment */}
        {step === 2 && (
            <div className="space-y-4 animate-fade-in">
                <div className="flex items-center gap-2 text-sm font-medium text-slate-700 mb-2">
                    <CreditCard size={18} />
                    <span>{t.selectPayment}</span>
                </div>
                <div className="space-y-3">
                    {MOCK_PAYMENT_METHODS.map(method => (
                        <div 
                            key={method.id}
                            onClick={() => setSelectedPayment(method.id)}
                            className={`flex items-center justify-between p-4 rounded-xl border cursor-pointer transition-all ${
                                selectedPayment === method.id 
                                    ? 'border-primary bg-primary/5 ring-1 ring-primary' 
                                    : 'border-slate-200 bg-white hover:bg-slate-50'
                            }`}
                        >
                            <div className="flex items-center gap-3">
                                <span className="text-2xl">{method.icon}</span>
                                <div>
                                    <p className="font-bold text-slate-900 capitalize">{method.type}</p>
                                    {method.balance ? (
                                        <p className="text-xs text-slate-500">{t.balance}: {method.balance} {t.sar}</p>
                                    ) : (
                                        <p className="text-xs text-slate-500">**** {method.last4}</p>
                                    )}
                                </div>
                            </div>
                            {selectedPayment === method.id && <CheckCircle className="text-primary" size={20} />}
                        </div>
                    ))}
                    
                    <button className="w-full py-3 border border-dashed border-slate-300 rounded-xl text-slate-500 text-sm hover:bg-slate-50 hover:text-primary transition-colors">
                        + {t.addBank}
                    </button>
                </div>
            </div>
        )}

        {/* Step 3: Success */}
        {step === 3 && (
            <div className="text-center py-8 animate-fade-in">
                <div className="h-20 w-20 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-6">
                    <CheckCircle size={40} />
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-2">{t.bookingSuccess}</h3>
                <p className="text-slate-500 mb-8">Your session with {title} has been confirmed.</p>
                <Button className="w-full" onClick={reset}>Done</Button>
            </div>
        )}

        {/* Footer Actions */}
        {step < 3 && (
            <div className="pt-4 flex gap-3">
                <Button variant="ghost" onClick={reset} className="flex-1 text-slate-500">
                    {t.cancel}
                </Button>
                <Button 
                    onClick={handleNext} 
                    className="flex-[2]"
                    disabled={(step === 1 && !selectedSlot) || (step === 2 && !selectedPayment)}
                >
                    {step === 1 ? t.bookNow : `${t.pay} ${price} ${t.sar}`}
                </Button>
            </div>
        )}
      </div>
    </Modal>
  );
};
