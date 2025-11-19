import React, { useState, useEffect } from 'react';
import { useLanguage } from '../../contexts/LanguageContext';
import { BookOpen, Plus, Trash2, Layers, GraduationCap, Loader2 } from 'lucide-react';
import { Button } from '../ui/Button';
import { Select } from '../ui/Select';
import { referenceService, teacherService, ReferenceItem, TeacherSubject } from '../../services/api';

export const SubjectsTab: React.FC = () => {
  const { t, language } = useLanguage();
  const [isLoading, setIsLoading] = useState(false);
  const [classesLoading, setClassesLoading] = useState(false);
  const [subjectsLoading, setSubjectsLoading] = useState(false);
  
  // Lists data
  const [mySubjects, setMySubjects] = useState<TeacherSubject[]>([]);
  const [classMap, setClassMap] = useState<Record<number, string>>({});
  
  // Form Data
  const [levels, setLevels] = useState<ReferenceItem[]>([]);
  const [classes, setClasses] = useState<ReferenceItem[]>([]);
  const [subjects, setSubjects] = useState<ReferenceItem[]>([]);
  
  // Selection State
  const [selectedLevel, setSelectedLevel] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');

  // Helper to get name based on language
  const getName = (item: any) => {
    if (!item) return '';
    return language === 'ar' ? (item.name_ar || item.name) : (item.name_en || item.name);
  };

  // Load initial data
  useEffect(() => {
    loadLevels();
    loadMySubjects();
  }, []);

  // Effect: Load Classes when Level changes
  useEffect(() => {
      if (selectedLevel) {
          setSelectedClass(''); // Reset class selection
          setSelectedSubject(''); // Reset subject selection
          loadClasses(Number(selectedLevel));
      } else {
          setClasses([]);
      }
  }, [selectedLevel]);

  // Effect: Load Subjects when Class changes
  useEffect(() => {
      if (selectedClass) {
          setSelectedSubject(''); // Reset subject selection
          loadSubjects(Number(selectedClass));
      } else {
          setSubjects([]);
      }
  }, [selectedClass]);

  // Fetch Classes for displaying names in the list view
  useEffect(() => {
    if (mySubjects.length > 0) {
        fetchMissingClasses();
    }
  }, [mySubjects]);

  const fetchMissingClasses = async () => {
     const uniqueLevelIds: number[] = Array.from(new Set(mySubjects.map(s => s.education_level_id)));
     const newClassMap = { ...classMap };
     let hasUpdates = false;
     
     for (const levelId of uniqueLevelIds) {
         try {
            const classesData = await referenceService.getClasses(levelId);
            classesData.forEach(c => {
                if (!newClassMap[c.id]) {
                    newClassMap[c.id] = language === 'ar' ? (c.name_ar || c.name) : (c.name_en || c.name);
                    hasUpdates = true;
                }
            });
         } catch(e) { console.error("Failed to fetch classes for mapping", e); }
     }
     
     if (hasUpdates) {
         setClassMap(newClassMap);
     }
  }

  const loadLevels = async () => {
    try {
      const data = await referenceService.getEducationLevels();
      setLevels(data);
    } catch (e) { console.error(e); }
  };

  const loadClasses = async (levelId: number) => {
    setClassesLoading(true);
    try {
      const data = await referenceService.getClasses(levelId);
      setClasses(data);
    } catch (e) { console.error(e); }
    finally { setClassesLoading(false); }
  };

  const loadSubjects = async (classId: number) => {
    setSubjectsLoading(true);
    try {
      const data = await referenceService.getSubjects(classId);
      setSubjects(data);
    } catch (e) { console.error(e); }
    finally { setSubjectsLoading(false); }
  };

  const loadMySubjects = async () => {
    setIsLoading(true);
    try {
      const data = await teacherService.getSubjects();
      setMySubjects(data);
    } catch (e) {
      console.error(e);
    } finally {
      setIsLoading(false);
    }
  };

  const handleAddSubject = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSubject) return;

    setIsLoading(true);
    try {
      // API expects an array of IDs
      await teacherService.addSubject([Number(selectedSubject)]);
      await loadMySubjects();
      
      // Keep level and class selected for easier multi-add, just reset subject
      setSelectedSubject('');
      alert(language === 'ar' ? "تم إضافة المادة بنجاح" : "Subject added successfully!");
    } catch (e) {
      console.error(e);
      alert(language === 'ar' ? "فشل إضافة المادة" : "Failed to add subject");
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="space-y-8 animate-fade-in">
      {/* Add Subject Form */}
      <div className="bg-white p-6 rounded-2xl shadow-sm border border-slate-100 relative overflow-hidden">
        {isLoading && (
            <div className="absolute inset-0 bg-white/50 z-10 flex items-center justify-center">
                <Loader2 className="animate-spin text-primary h-8 w-8" />
            </div>
        )}
        
        <h2 className="text-xl font-bold text-slate-900 mb-6 flex items-center gap-2">
          <Plus className="text-primary" /> 
          {language === 'ar' ? 'إضافة مادة جديدة' : 'Add New Subject'}
        </h2>
        
        <form onSubmit={handleAddSubject} className="grid grid-cols-1 md:grid-cols-4 gap-4 items-end">
          <Select
            label={language === 'ar' ? "المرحلة الدراسية" : "Education Level"}
            value={selectedLevel}
            onChange={(e) => setSelectedLevel(e.target.value)}
            options={[
                {value: '', label: language === 'ar' ? '-- اختر المرحلة --' : '-- Select Level --'}, 
                ...levels.map(l => ({ value: String(l.id), label: getName(l) }))
            ]}
            className="mb-0"
          />
          
          <Select
            label={language === 'ar' ? "الصف الدراسي" : "Class / Grade"}
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            options={[
                {
                    value: '', 
                    label: classesLoading 
                        ? (language === 'ar' ? 'جاري التحميل...' : 'Loading classes...') 
                        : (language === 'ar' ? '-- اختر الصف --' : '-- Select Class --')
                }, 
                ...classes.map(c => ({ value: String(c.id), label: getName(c) }))
            ]}
            disabled={!selectedLevel || classesLoading}
            className="mb-0"
          />
          
          <Select
            label={language === 'ar' ? "المادة" : "Subject"}
            value={selectedSubject}
            onChange={(e) => setSelectedSubject(e.target.value)}
            options={[
                {
                    value: '', 
                    label: subjectsLoading 
                        ? (language === 'ar' ? 'جاري التحميل...' : 'Loading subjects...') 
                        : (language === 'ar' ? '-- اختر المادة --' : '-- Select Subject --')
                }, 
                ...subjects.map(s => ({ value: String(s.id), label: getName(s) }))
            ]}
            disabled={!selectedClass || subjectsLoading}
            className="mb-0"
          />

          <div className="mb-[2px]">
            <Button type="submit" className="w-full" disabled={isLoading || !selectedSubject}>
                {isLoading ? (language === 'ar' ? 'جاري الإضافة...' : 'Adding...') : (language === 'ar' ? 'إضافة' : 'Add')}
            </Button>
          </div>
        </form>
      </div>

      {/* Subjects List */}
      <div>
        <h3 className="text-lg font-bold text-slate-900 mb-4">
          {language === 'ar' ? 'المواد التي أدرسها' : 'My Teaching Subjects'}
        </h3>
        
        {mySubjects.length === 0 && !isLoading ? (
            <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed border-slate-200">
                <BookOpen className="mx-auto h-12 w-12 text-slate-300 mb-3" />
                <p className="text-slate-500">
                  {language === 'ar' ? 'لم تقم بإضافة أي مواد بعد.' : "You haven't added any subjects yet."}
                </p>
            </div>
        ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {mySubjects.map((item) => {
               const level = levels.find(l => l.id === item.education_level_id);
               const levelName = getName(level);
               const subjectName = language === 'ar' ? item.name_ar : item.name_en;
               // Use map to find class name, or fallback to ID
               const className = classMap[item.class_id] || `${language === 'ar' ? 'الصف' : 'Class'} ${item.class_id}`;

               return (
                <div key={item.id} className="bg-white rounded-xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden group">
                    <div className="h-2 bg-primary w-full"></div>
                    <div className="p-5">
                        <div className="flex justify-between items-start mb-4">
                            <div className="p-3 bg-primary/10 text-primary rounded-lg">
                                <BookOpen size={24} />
                            </div>
                            {/* Delete functionality placeholder */}
                            <button className="text-slate-300 hover:text-red-500 transition-colors" title="Delete">
                                <Trash2 size={18} />
                            </button>
                        </div>
                        
                        <h4 className="text-lg font-bold text-slate-900 mb-1">{subjectName}</h4>
                        
                        <div className="space-y-2 mt-4">
                            {levelName && (
                                <div className="flex items-center text-sm text-slate-600">
                                    <GraduationCap size={16} className="mr-2 text-slate-400" />
                                    {levelName}
                                </div>
                            )}
                            <div className="flex items-center text-sm text-slate-600">
                                <Layers size={16} className="mr-2 text-slate-400" />
                                {className}
                            </div>
                        </div>
                    </div>
                </div>
               );
            })}
            </div>
        )}
      </div>
    </div>
  );
};