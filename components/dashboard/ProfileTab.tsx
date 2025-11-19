
import React, { useEffect, useState } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { User, Mail, Phone, MapPin, Award, Star, Calendar, Edit } from 'lucide-react';
import { authService, teacherService, UserData } from '../../services/api';
import { Button } from '../ui/Button';
import { Modal } from '../ui/Modal';
import { Input } from '../ui/Input';

export const ProfileTab: React.FC = () => {
  const { t } = useLanguage();
  const [user, setUser] = useState<UserData | null>(null);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editForm, setEditForm] = useState<any>({});

  const fetchProfile = async () => {
      setLoading(true);
      try {
          const response = await authService.getProfile();
          if (response.user?.data) {
              setUser(response.user.data);
              setEditForm(response.user.data);
          } else {
              setUser(response as unknown as UserData);
              setEditForm(response as unknown as UserData);
          }
      } catch (error) {
          console.error("Failed to load profile", error);
      } finally {
          setLoading(false);
      }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleUpdateProfile = async () => {
      try {
          await teacherService.updateProfile(editForm);
          await fetchProfile();
          setIsEditOpen(false);
          alert("Profile updated successfully");
      } catch(e) {
          console.error(e);
          alert("Failed to update profile");
      }
  };

  if (loading) {
    return <div className="p-10 text-center text-slate-500">Loading profile...</div>;
  }

  if (!user) {
    return <div className="p-10 text-center text-error">Failed to load profile data.</div>;
  }

  return (
    <div className="max-w-4xl mx-auto space-y-6 animate-fade-in">
      {/* Header Card */}
      <div className="bg-white rounded-2xl shadow-sm border border-slate-100 overflow-hidden">
        <div className="h-32 bg-gradient-to-r from-primary to-blue-600"></div>
        <div className="px-8 pb-8">
            <div className="relative flex justify-between items-end -mt-12 mb-6">
                <div className="h-24 w-24 rounded-full border-4 border-white bg-white shadow-md flex items-center justify-center text-3xl font-bold text-primary overflow-hidden">
                    {user.first_name?.charAt(0) || 'U'}
                </div>
                <Button 
                  variant="outline"
                  onClick={() => setIsEditOpen(true)}
                  className="bg-white hover:bg-slate-50"
                >
                    <Edit size={16} className="mr-2" /> {t.editProfile}
                </Button>
            </div>
            
            <div>
                <h1 className="text-2xl font-bold text-slate-900">{user.first_name} {user.last_name}</h1>
                <div className="flex flex-wrap gap-4 mt-3 text-sm text-slate-500">
                    <div className="flex items-center gap-1">
                        <Mail size={16} /> {user.email}
                    </div>
                    <div className="flex items-center gap-1" dir="ltr">
                        <Phone size={16} /> {user.phone_number}
                    </div>
                    <div className="flex items-center gap-1">
                        <MapPin size={16} /> {user.nationality}
                    </div>
                </div>
            </div>
        </div>
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Left Column: Bio & Stats */}
        <div className="md:col-span-2 space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">About Me</h3>
                <p className="text-slate-600 leading-relaxed">
                    {user.profile?.bio || "No biography added yet."}
                </p>
            </div>

            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-lg font-bold text-slate-900 mb-4">Professional Info</h3>
                <div className="grid grid-cols-2 gap-4">
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="text-slate-500 text-xs uppercase font-bold mb-1">Role</div>
                        <div className="font-semibold text-slate-800">Teacher</div>
                    </div>
                    <div className="p-4 bg-slate-50 rounded-xl">
                        <div className="text-slate-500 text-xs uppercase font-bold mb-1">Gender</div>
                        <div className="font-semibold text-slate-800 capitalize">{user.gender}</div>
                    </div>
                </div>
            </div>
        </div>

        {/* Right Column: Stats */}
        <div className="space-y-6">
            <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Performance</h3>
                
                <div className="space-y-4">
                    <div className="flex items-center justify-between p-3 bg-yellow-50 text-yellow-700 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Star size={20} />
                            <span className="font-medium">Rating</span>
                        </div>
                        <span className="font-bold text-lg">{user.profile?.rating || "0.0"}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-blue-50 text-blue-700 rounded-xl">
                        <div className="flex items-center gap-3">
                            <User size={20} />
                            <span className="font-medium">Students</span>
                        </div>
                        <span className="font-bold text-lg">{user.profile?.total_students || "0"}</span>
                    </div>

                    <div className="flex items-center justify-between p-3 bg-purple-50 text-purple-700 rounded-xl">
                        <div className="flex items-center gap-3">
                            <Award size={20} />
                            <span className="font-medium">Verified</span>
                        </div>
                        <span className="font-bold text-lg">Yes</span>
                    </div>
                </div>
            </div>

             <div className="bg-white p-6 rounded-2xl border border-slate-100 shadow-sm">
                 <h3 className="text-sm font-bold text-slate-400 uppercase mb-4">Join Date</h3>
                 <div className="flex items-center gap-2 text-slate-600">
                    <Calendar size={18} />
                    <span>September 2023</span>
                 </div>
             </div>
        </div>
      </div>
      
      {/* Edit Modal */}
      <Modal isOpen={isEditOpen} onClose={() => setIsEditOpen(false)} title={t.editProfile}>
          <div className="space-y-4">
              <Input 
                  label={t.firstName}
                  value={editForm.first_name || ''}
                  onChange={(e) => setEditForm({...editForm, first_name: e.target.value})}
              />
              <Input 
                  label={t.lastName}
                  value={editForm.last_name || ''}
                  onChange={(e) => setEditForm({...editForm, last_name: e.target.value})}
              />
               <div className="mb-4 w-full">
                  <label className="block text-sm font-medium text-slate-700 mb-1">{t.bio}</label>
                  <textarea 
                      className="w-full rounded-lg border border-slate-200 p-3 h-24"
                      value={editForm.profile?.bio || ''}
                      onChange={(e) => setEditForm({
                          ...editForm, 
                          profile: { ...editForm.profile, bio: e.target.value }
                      })}
                  />
               </div>
               <Button className="w-full" onClick={handleUpdateProfile}>{t.save}</Button>
          </div>
      </Modal>
    </div>
  );
};
