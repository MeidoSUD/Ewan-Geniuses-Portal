
import React, { useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { CheckCircle, XCircle, FileText, ExternalLink } from 'lucide-react';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';

const MOCK_REQUESTS = [
    { id: 1, name: 'Fatima Al-Sayed', email: 'fatima@edu.com', date: '2025-11-18', cert: 'https://via.placeholder.com/400x300?text=Certificate', status: 'pending' },
    { id: 2, name: 'John Smith', email: 'john@edu.com', date: '2025-11-19', cert: 'https://via.placeholder.com/400x300?text=Degree', status: 'pending' },
];

export const VerificationsTab: React.FC = () => {
    const { t } = useLanguage();
    const [viewCert, setViewCert] = useState<string | null>(null);

    return (
        <div className="space-y-6 animate-fade-in">
            <h2 className="text-2xl font-bold text-slate-900">{t.verifications}</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {MOCK_REQUESTS.map(req => (
                    <div key={req.id} className="bg-white rounded-2xl border border-slate-200 shadow-sm p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div>
                                <h3 className="font-bold text-lg text-slate-900">{req.name}</h3>
                                <p className="text-sm text-slate-500">{req.email}</p>
                            </div>
                            <span className="bg-yellow-100 text-yellow-700 text-xs font-bold px-2 py-1 rounded-md uppercase">
                                {req.status}
                            </span>
                        </div>
                        
                        <div className="mb-6 p-3 bg-slate-50 rounded-xl border border-slate-100 flex items-center justify-between">
                            <div className="flex items-center gap-2 text-sm text-slate-600">
                                <FileText size={16} />
                                <span>Certificate.jpg</span>
                            </div>
                            <button 
                                onClick={() => setViewCert(req.cert)}
                                className="text-primary text-xs font-bold hover:underline flex items-center gap-1"
                            >
                                {t.viewCertificate} <ExternalLink size={10} />
                            </button>
                        </div>

                        <div className="flex gap-3">
                            <Button variant="outline" className="flex-1 border-red-200 text-red-600 hover:bg-red-50">
                                <XCircle size={18} className="mr-2" /> {t.reject}
                            </Button>
                            <Button className="flex-1 bg-green-600 hover:bg-green-700">
                                <CheckCircle size={18} className="mr-2" /> {t.approve}
                            </Button>
                        </div>
                    </div>
                ))}
            </div>

            <Modal isOpen={!!viewCert} onClose={() => setViewCert(null)} title="Document Viewer">
                <div className="flex justify-center bg-slate-100 rounded-lg p-4">
                    {viewCert && <img src={viewCert} alt="Certificate" className="max-w-full max-h-[60vh] object-contain rounded shadow-sm" />}
                </div>
                <div className="mt-4 flex justify-end">
                    <Button onClick={() => setViewCert(null)}>Close</Button>
                </div>
            </Modal>
        </div>
    );
};
