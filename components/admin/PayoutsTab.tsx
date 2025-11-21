
import React from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { Check, X, Building, ArrowUpRight } from 'lucide-react';

const MOCK_PAYOUTS = [
    { id: 1, teacher: 'Mohammed Ali', amount: 500, bank: 'Al Rajhi Bank', account: '**** 1234', date: '2025-11-20', status: 'pending' },
    { id: 2, teacher: 'Sarah Johnson', amount: 1200, bank: 'NCB', account: '**** 9876', date: '2025-11-19', status: 'pending' },
];

export const PayoutsTab: React.FC = () => {
    const { t } = useLanguage();

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900">{t.payoutRequests}</h2>

            <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
                <table className="w-full text-left text-sm">
                    <thead className="bg-slate-50 border-b border-slate-200">
                        <tr>
                            <th className="px-6 py-4 font-bold text-slate-700">{t.teacher}</th>
                            <th className="px-6 py-4 font-bold text-slate-700">Amount</th>
                            <th className="px-6 py-4 font-bold text-slate-700">Bank Details</th>
                            <th className="px-6 py-4 font-bold text-slate-700">{t.date}</th>
                            <th className="px-6 py-4 font-bold text-slate-700 text-right">{t.actions}</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100">
                        {MOCK_PAYOUTS.map(payout => (
                            <tr key={payout.id} className="hover:bg-slate-50">
                                <td className="px-6 py-4 font-medium text-slate-900">{payout.teacher}</td>
                                <td className="px-6 py-4 text-lg font-bold text-green-600">{payout.amount} {t.sar}</td>
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-2 text-slate-600">
                                        <Building size={16} />
                                        <span>{payout.bank}</span>
                                        <span className="text-xs bg-slate-100 px-2 py-0.5 rounded text-slate-500">{payout.account}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-slate-500">{payout.date}</td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex items-center justify-end gap-2">
                                        <button className="p-2 rounded-lg bg-green-50 text-green-600 hover:bg-green-100 transition-colors" title={t.approve}>
                                            <Check size={18} />
                                        </button>
                                        <button className="p-2 rounded-lg bg-red-50 text-red-600 hover:bg-red-100 transition-colors" title={t.reject}>
                                            <X size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};
