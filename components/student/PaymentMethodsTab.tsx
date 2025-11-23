

import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Plus, Trash2, CreditCard, Loader2, AlertCircle, CheckCircle, RefreshCw, Bug } from 'lucide-react';
import { Button } from '../ui/Button';
import { Input } from '../ui/Input';
import { Modal } from '../ui/Modal';
import { Select } from '../ui/Select';
import { StudentPaymentMethod } from '../../types';
import { studentService } from '../../services/api';

export const PaymentMethodsTab: React.FC = () => {
  const { t, language } = useLanguage();
  const [cards, setCards] = useState<StudentPaymentMethod[]>([]);
  const [loading, setLoading] = useState(true);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [apiErrors, setApiErrors] = useState<Record<string, string[]>>({});
  const [successMsg, setSuccessMsg] = useState<string | null>(null);
  const [showDebug, setShowDebug] = useState(false);

  // Form using API field names
  const [form, setForm] = useState({
    card_number: '',
    card_expiry_month: '',
    card_expiry_year: '',
    card_cvc: '',
    card_holder_name: '',
    card_type: 'visa' as 'visa' | 'mastercard' | 'mada'
  });

  useEffect(() => {
    loadCards();
  }, []);

  const loadCards = async () => {
    setLoading(true);
    try {
      const data = await studentService.getPaymentMethods();
      console.log("Loaded Cards in Component:", data);
      // Ensure we set a new array reference
      setCards(Array.isArray(data) ? [...data] : []);
    } catch (e) {
      console.error("Failed to load cards:", e);
      setCards([]); 
    } finally {
      setLoading(false);
    }
  };

  const handleAddCard = async () => {
    setApiErrors({});
    setSuccessMsg(null);

    if (!form.card_number || !form.card_expiry_month || !form.card_expiry_year || !form.card_cvc || !form.card_holder_name) {
        alert(language === 'ar' ? "يرجى ملء جميع الحقول" : "Please fill all fields");
        return;
    }

    setSubmitting(true);
    try {
      // Map card type string to ID: 1=Visa, 2=Mastercard, 3=Mada
      const typeMap: Record<string, number> = { 'visa': 1, 'mastercard': 2, 'mada': 3 };
      
      const payload = {
          payment_method_id: typeMap[form.card_type] || 1,
          card_number: form.card_number,
          card_holder_name: form.card_holder_name,
          card_cvc: form.card_cvc,
          card_expiry_month: form.card_expiry_month,
          card_expiry_year: form.card_expiry_year
      };

      const response = await studentService.addPaymentMethod(payload);
      
      await loadCards();
      setIsModalOpen(false);
      
      // Show success
      setSuccessMsg(response.message || (language === 'ar' ? "تم حفظ البطاقة بنجاح" : "Card saved successfully"));
      
      // Clear msg after 3s
      setTimeout(() => setSuccessMsg(null), 3000);

      // Reset form
      setForm({
        card_number: '',
        card_expiry_month: '',
        card_expiry_year: '',
        card_cvc: '',
        card_holder_name: '',
        card_type: 'visa'
      });
      
    } catch (e: any) {
      console.error(e);
      if (e.errors) {
          setApiErrors(e.errors);
      } else {
          alert(e.message || "Failed to save card");
      }
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: number) => {
    if (!confirm("Are you sure you want to remove this card?")) return;
    try {
      await studentService.deletePaymentMethod(id);
      await loadCards();
    } catch (e) {
      console.error(e);
    }
  };

  // Determine Brand Name safely
  const getBrandName = (card: StudentPaymentMethod) => {
      if (card.payment_method) {
          return language === 'ar' ? card.payment_method.name_ar : card.payment_method.name_en;
      }
      // Fallback if payment_method object is missing but ID is present
      if (card.payment_method_id === 1) return 'Visa';
      if (card.payment_method_id === 2) return 'Mastercard';
      if (card.payment_method_id === 3) return 'Mada';
      // Use manual brand field if exists
      if (card.card_brand) return card.card_brand;
      
      return 'Card';
  };

  // Render styling based on brand name string
  const getCardStyle = (brandName: string) => {
    const lower = String(brandName).toLowerCase();
    if (lower.includes('visa')) return 'bg-gradient-to-br from-blue-600 to-blue-800';
    if (lower.includes('master')) return 'bg-gradient-to-br from-slate-800 to-black';
    if (lower.includes('mada')) return 'bg-gradient-to-br from-teal-600 to-teal-800';
    return 'bg-gradient-to-br from-slate-600 to-slate-800';
  };

  return (
    <div className="space-y-6 animate-fade-in">
      
      {/* Success Toast */}
      {successMsg && (
          <div className="p-4 bg-green-50 text-green-700 border border-green-200 rounded-xl flex items-center gap-2 animate-fade-in">
              <CheckCircle size={20} />
              <span>{successMsg}</span>
          </div>
      )}

      <div className="flex flex-wrap justify-between items-center gap-4">
        <h2 className="text-2xl font-bold text-slate-900">{t.paymentMethods}</h2>
        <div className="flex gap-2">
            <Button 
                variant="outline" 
                onClick={loadCards} 
                disabled={loading}
                className="px-3"
                title="Refresh List"
            >
                <RefreshCw size={18} className={loading ? 'animate-spin' : ''} />
            </Button>
            <Button 
                variant="ghost" 
                onClick={() => setShowDebug(!showDebug)} 
                className="px-3 text-slate-400"
                title="Debug Info"
            >
                <Bug size={18} />
            </Button>
            <Button onClick={() => { setIsModalOpen(true); setApiErrors({}); }}>
                <Plus size={18} className="mr-2" /> {t.addNewCard}
            </Button>
        </div>
      </div>

      {/* Debug View */}
      {showDebug && (
          <div className="bg-slate-900 text-green-400 p-4 rounded-xl text-xs font-mono overflow-auto max-h-60">
              <p className="mb-2 text-white font-bold">Debug: Cards State ({cards.length})</p>
              <pre>{JSON.stringify(cards, null, 2)}</pre>
          </div>
      )}

      {loading ? (
          <div className="p-12 text-center">
              <Loader2 className="animate-spin mx-auto h-8 w-8 text-primary" />
              <p className="text-slate-500 mt-2">Loading your cards...</p>
          </div>
      ) : (!Array.isArray(cards) || cards.length === 0) ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200 text-slate-500">
          <CreditCard className="mx-auto h-12 w-12 text-slate-300 mb-3" />
          <p>{t.noCards}</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {cards.map(card => {
            const brandName = getBrandName(card);
            return (
                <div key={card.id} className={`relative p-6 rounded-2xl text-white shadow-xl ${getCardStyle(brandName)} aspect-[1.58/1] flex flex-col justify-between overflow-hidden group`}>
                {/* Delete Button */}
                <button 
                    onClick={() => handleDelete(card.id)}
                    className="absolute top-4 right-4 p-2 bg-white/10 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white/20 text-white z-10"
                >
                    <Trash2 size={16} />
                </button>

                <div className="flex justify-between items-start">
                    <span className="text-xl font-bold font-mono uppercase italic opacity-80">{brandName}</span>
                    <CreditCard size={24} className="opacity-50" />
                </div>

                <div className="mt-4">
                    <div className="text-lg font-mono tracking-widest mb-1">
                        **** **** **** {card.card_number?.slice(-4) || card.last_four || '0000'}
                    </div>
                    <div className="flex justify-between items-end mt-4">
                        <div>
                            <p className="text-[10px] text-white/70 uppercase tracking-wider">{t.cardHolder}</p>
                            <p className="font-medium text-sm truncate max-w-[150px]">{card.card_holder_name || card.holder_name || 'Unknown'}</p>
                        </div>
                        <div>
                            <p className="text-[10px] text-white/70 uppercase tracking-wider text-right">EXP</p>
                            <p className="font-medium text-sm">
                                {String(card.card_expiry_month || '00').padStart(2, '0')}/{String(card.card_expiry_year || '00').slice(-2)}
                            </p>
                        </div>
                    </div>
                </div>
                </div>
            );
          })}
        </div>
      )}

      {/* Add Card Modal */}
      <Modal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} title={t.addNewCard}>
        <div className="space-y-4">
           {/* Validation Summary */}
           {Object.keys(apiErrors).length > 0 && (
               <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-start gap-2">
                   <AlertCircle size={18} className="text-red-600 flex-shrink-0 mt-0.5" />
                   <div className="text-sm text-red-600">
                       <p className="font-semibold">Please correct the following errors:</p>
                       <ul className="list-disc list-inside mt-1">
                           {Object.values(apiErrors).flat().slice(0, 3).map((msg, i) => (
                               <li key={i}>{msg}</li>
                           ))}
                       </ul>
                   </div>
               </div>
           )}

           <Select 
             label="Card Type"
             options={[
               { value: 'visa', label: 'Visa' },
               { value: 'mastercard', label: 'Mastercard' },
               { value: 'mada', label: 'Mada' }
             ]}
             value={form.card_type}
             onChange={(e) => setForm({...form, card_type: e.target.value as any})}
             error={apiErrors.payment_method_id?.[0]}
           />

           <Input 
             label={t.cardNumber}
             placeholder="0000 0000 0000 0000"
             maxLength={19}
             value={form.card_number}
             onChange={(e) => setForm({...form, card_number: e.target.value.replace(/\D/g, '')})}
             error={apiErrors.card_number?.[0]}
           />

           <div className="grid grid-cols-2 gap-4">
              <div className="flex gap-2">
                 <Input 
                    label="Month"
                    placeholder="MM"
                    maxLength={2}
                    value={form.card_expiry_month}
                    onChange={(e) => setForm({...form, card_expiry_month: e.target.value})}
                    error={apiErrors.card_expiry_month?.[0]}
                 />
                 <Input 
                    label="Year"
                    placeholder="YY"
                    maxLength={2}
                    value={form.card_expiry_year}
                    onChange={(e) => setForm({...form, card_expiry_year: e.target.value})}
                    error={apiErrors.card_expiry_year?.[0]}
                 />
              </div>
              <Input 
                label={t.cvv}
                placeholder="123"
                maxLength={4}
                value={form.card_cvc}
                onChange={(e) => setForm({...form, card_cvc: e.target.value})}
                error={apiErrors.card_cvc?.[0]}
              />
           </div>

           <Input 
             label={t.cardHolder}
             placeholder="Name on card"
             value={form.card_holder_name}
             onChange={(e) => setForm({...form, card_holder_name: e.target.value})}
             error={apiErrors.card_holder_name?.[0]}
           />

           <Button className="w-full mt-2" onClick={handleAddCard} isLoading={submitting}>
             {t.saveCard}
           </Button>
        </div>
      </Modal>
    </div>
  );
};
