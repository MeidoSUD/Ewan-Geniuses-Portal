
import React, { useEffect, useState, useRef } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Mail, Phone, MapPin, Award, Star, Edit, Camera, Loader2, Trash2 } from 'lucide-react';
import { authService, UserData, getStorageUrl, tokenService } from '../../services/api';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';
import { COUNTRIES } from '../../constants'; // Assumes COUNTRIES export exists

export const ProfileTab: React.FC = () => {
  const { t, language } = useLanguage();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  
  // Edit State
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState({
      first_name: '',
      last_name: '',
      phone_number: '',
      bio: ''
  });
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [updating, setUpdating] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const fetchProfile = async () => {
      setLoading(true);
      try {
          const response = await authService.getProfile();
          const userData = response.user?.data || (response as any).data || response;
          setUser(userData);
          
          setEditForm({
              first_name: userData.first_name || '',
              last_name: userData.last_name || '',
              phone_number: userData.phone_number || '',
              bio: userData.bio || userData.profile?.bio || ''
          });
      } catch (error) {
          console.error("Failed to load profile", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (e.target.files && e.target.files[0]) {
          const file = e.target.files[0];
          setSelectedFile(file);
          setPreviewUrl(URL.createObjectURL(file));
      }
  };

  const handleUpdateProfile = async () => {
      setUpdating(true);
      try {
          const formData = new FormData();
          formData.append('first_name', editForm.first_name);
          formData.append('last_name', editForm.last_name);
          formData.append('phone_number', editForm.phone_number);
          
          if (editForm.bio) formData.append('bio', editForm.bio);
          if (selectedFile) {
              formData.append('profile_photo', selectedFile); 
          }

          await authService.updateProfile(formData);
          await fetchProfile();
          setIsEditOpen(false);
          alert(language === 'ar' ? "تم التحديث بنجاح" : "Profile updated successfully");
      } catch(e) {
          console.error(e);
          alert("Failed to update profile");
      } finally {
          setUpdating(false);
      }
  };

  const handleDeleteAccount = async () => {
      if (!confirm(language === 'ar' ? "هل أنت متأكد؟ سيتم حذف حسابك نهائياً." : "Are you sure? This will permanently delete your account.")) return;
      try {
          await authService.deleteAccount();
          tokenService.removeToken();
          window.location.reload();
      } catch(e) {
          console.error(e);
          alert("Failed to delete account");
      }
  };

  if (loading) {
    return (
        <div className="flex flex-col items-center justify-center min-h-[400px] text-slate-400">
            <Loader2 className="animate-spin h-8 w-8 mb-2 text-primary" />
            <p>{t.loading}</p>
        </div>
    );
  }

  if (!user) return <div className="p-10 text-center text-error">Failed to load profile.</div>;

  const isTeacher = user.role_id === 3;
  const isStudent = user.role_id === 4;

  // Helper for Flag
  const country = COUNTRIES.find(c => c.label === user.nationality);
  const flag = country ? country.flag : '🏳️';

  const rawImage = isTeacher ? user.profile_image : user.profile?.profile_photo;
  const imageUrl = getStorageUrl(rawImage);

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-blue-600"></div>
        <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="relative">
                    <div className="h-24 w-24 rounded-full border-4 border-white bg-slate-100 shadow-md flex items-center justify-center text-3xl font-bold text-slate-400 overflow-hidden">
                        {imageUrl ? (
                            <img src={imageUrl} alt="Profile" className="h-full w-full object-cover" />
                        ) : (
                            user.first_name?.charAt(0) || 'U'
                        )}
                    </div>
                </div>
                <Button variant="outline" onClick={() => setIsEditOpen(true)}>
                    <Edit size={16} className="mr-2" /> {t.editProfile}
                </Button>
            </div>
            
            <div>
                <h1 className="text-2xl font-bold text-slate-900">{user.first_name} {user.last_name}</h1>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                    <div className="flex items-center gap-1"><Mail size={16} /> {user.email}</div>
                    <div className="flex items-center gap-1" dir="ltr"><Phone size={16} /> {user.phone_number}</div>
                    {user.nationality && (
                        <div className="flex items-center gap-1">
                            <span className="text-lg">{flag}</span> {user.nationality}
                        </div>
                    )}
                </div>
            </div>
        </div>
      </div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="md:col-span-2 space-y-6">
            {/* Bio - Only for Teachers or if populated */}
            {isTeacher && (
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-lg font-bold text-slate-900 mb-4">{t.bio}</h3>
                    <p className="text-slate-600 leading-relaxed whitespace-pre-wrap">{user.bio || "No biography."}</p>
                </div>
            )}

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Details</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="text-xs uppercase font-bold text-slate-500 mb-1">{t.role}</div>
                        <div className="font-semibold capitalize">{isTeacher ? 'Teacher' : 'Student'}</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="text-xs uppercase font-bold text-slate-500 mb-1">{t.gender}</div>
                        <div className="font-semibold capitalize">{user.gender} {user.gender === 'male' ? '♂️' : '♀️'}</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Sidebar Stats (Teacher Only) */}
        {isTeacher && (
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                    <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Performance</h3>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between p-3 bg-yellow-50 text-yellow-700 rounded-xl">
                            <div className="flex items-center gap-3"><Star size={20} /><span className="font-medium">{t.rating}</span></div>
                            <span className="font-bold text-lg">{user.rating || "0.0"}</span>
                        </div>
                    </div>
                </div>
            </div>
        )}
      </div>

      {/* Delete Account Button */}
      <div className="mt-8 pt-8 border-t border-slate-200 flex justify-center">
          <button 
            onClick={handleDeleteAccount}
            className="flex items-center gap-2 text-red-500 hover:text-red-700 text-sm font-medium transition-colors"
          >
              <Trash2 size={16} /> {language === 'ar' ? "حذف الحساب" : "Delete Account"}
          </button>
      </div>
      
      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={t.editProfile}>
          <div className="space-y-4">
              <div className="flex justify-center mb-6">
                  <div className="relative group cursor-pointer" onClick={() => fileInputRef.current?.click()}>
                      <div className="h-24 w-24 rounded-full overflow-hidden border-2 border-slate-200">
                          {previewUrl ? <img src={previewUrl} className="h-full w-full object-cover" /> : 
                           imageUrl ? <img src={imageUrl} className="h-full w-full object-cover" /> : 
                           <User size={32} className="m-auto mt-6 text-slate-300" />}
                      </div>
                      <div className="absolute inset-0 bg-black/40 rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity">
                          <Camera className="text-white" size={24} />
                      </div>
                  </div>
                  <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleFileChange} />
              </div>

              <div className="grid grid-cols-2 gap-4">
                <Input label={t.firstName} value={editForm.first_name} onChange={(e) => setEditForm({...editForm, first_name: e.target.value})} />
                <Input label={t.lastName} value={editForm.last_name} onChange={(e) => setEditForm({...editForm, last_name: e.target.value})} />
              </div>
              <Input label={t.phone} value={editForm.phone_number} onChange={(e) => setEditForm({...editForm, phone_number: e.target.value})} />

              {isTeacher && (
                  <div className="mb-4 w-full">
                      <label className="block text-sm font-medium text-slate-700 mb-1">{t.bio}</label>
                      <textarea 
                          className="w-full rounded-lg border border-slate-200 p-3 h-24 focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary"
                          value={editForm.bio}
                          onChange={(e) => setEditForm({...editForm, bio: e.target.value})}
                      />
                  </div>
              )}

              <Button className="w-full" onClick={handleUpdateProfile} isLoading={updating}>{t.save}</Button>
          </div>
      </Modal>
    </div>
  );
};
