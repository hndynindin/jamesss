import React, { useState, useEffect } from 'react';
import { 
  School, 
  Plus, 
  Search, 
  Edit, 
  Trash2, 
  Users, 
  UserCheck, 
  X, 
  AlertTriangle 
} from 'lucide-react';
import api from '../services/api';

const ClassesPage = () => {
  const [classes, setClasses] = useState([]);
  const [teachers, setTeachers] = useState([]);
  const [majors, setMajors] = useState([]);
  const [academicYears, setAcademicYears] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingClass, setEditingClass] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    name: '',
    grade: 10,
    major_id: '',
    academic_year_id: 1,
    homeroom_teacher_id: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resClasses, resTeachers, resMaster] = await Promise.all([
        api.get('/classes'),
        api.get('/teachers'),
        api.get('/reports/master')
      ]);
      if (resClasses.success) setClasses(resClasses.data);
      if (resTeachers.success) setTeachers(resTeachers.data);
      if (resMaster.success) {
        setMajors(resMaster.data.majors);
        setAcademicYears(resMaster.data.academic_years);
      }
    } catch (err) {
      console.error('Error fetching classes data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingClass(null);
    setFormData({
      name: '',
      grade: 10,
      major_id: majors[0]?.id || '',
      academic_year_id: academicYears[0]?.id || 1,
      homeroom_teacher_id: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (cls) => {
    setEditingClass(cls);
    setFormData({
      name: cls.name,
      grade: cls.grade || 10,
      major_id: cls.major_id,
      academic_year_id: cls.academic_year_id || 1,
      homeroom_teacher_id: cls.homeroom_teacher_id || ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      if (editingClass) {
        await api.put(`/classes/${editingClass.id}`, formData);
      } else {
        await api.post('/classes', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data kelas.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/classes/${id}`);
      setDeleteConfirmId(null);
      fetchData();
    } catch (err) {
      alert('Gagal menghapus kelas: ' + err.message);
    }
  };

  const filteredClasses = classes.filter(c => 
    c.name.toLowerCase().includes(search.toLowerCase()) ||
    c.major_name?.toLowerCase().includes(search.toLowerCase()) ||
    c.homeroom_teacher_name?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60">
        <div>
          <h2 className="text-base lg:text-lg font-extrabold text-white flex items-center space-x-2">
            <School className="w-5 h-5 text-amber-400" />
            <span>Manajemen Rombongan Belajar (Kelas)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar kelas kejuruan TKJ, wali kelas pembina, dan kuota siswa aktif
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-lg shadow-amber-600/30 transition-all self-start sm:self-auto active:scale-95"
        >
          <Plus className="w-4 h-4" />
          <span>Tambah Kelas Baru</span>
        </button>
      </div>

      {/* Search Bar */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama kelas atau wali kelas..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-xs focus:outline-none focus:border-amber-500 placeholder-slate-500"
        />
      </div>

      {/* Classes Grid Cards */}
      {loading ? (
        <div className="p-12 text-center text-slate-400">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-amber-500 mx-auto mb-2" />
          <span className="text-xs">Memuat data kelas...</span>
        </div>
      ) : filteredClasses.length === 0 ? (
        <div className="p-12 text-center text-slate-500 text-xs">
          Belum ada kelas terdaftar.
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredClasses.map((cls) => (
            <div
              key={cls.id}
              className="p-5 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60 hover:border-amber-500/40 transition-all flex flex-col justify-between space-y-4 shadow-lg shadow-black/20"
            >
              <div>
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-lg font-black text-white">{cls.name}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30">
                      Tingkat {cls.grade}
                    </span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <button
                      onClick={() => openEditModal(cls)}
                      className="p-1.5 rounded-lg bg-[#0B1120] hover:bg-amber-600/30 text-amber-400 border border-[#334155] transition-colors"
                      title="Edit Kelas"
                    >
                      <Edit className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => setDeleteConfirmId(cls.id)}
                      className="p-1.5 rounded-lg bg-[#0B1120] hover:bg-rose-600/30 text-rose-400 border border-[#334155] transition-colors"
                      title="Hapus Kelas"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </div>

                <p className="text-xs text-slate-300 font-semibold mt-1">
                  {cls.major_name} ({cls.major_code})
                </p>

                <div className="mt-3 pt-3 border-t border-[#334155]/50 space-y-1.5 text-xs">
                  <div className="flex items-center justify-between text-slate-400">
                    <span>Wali Kelas:</span>
                    <span className="font-semibold text-white truncate max-w-[170px]">
                      {cls.homeroom_teacher_name || 'Belum Ditentukan'}
                    </span>
                  </div>

                  <div className="flex items-center justify-between text-slate-400">
                    <span>Tahun Ajaran:</span>
                    <span className="font-mono text-slate-300">{cls.academic_year_name}</span>
                  </div>
                </div>
              </div>

              {/* Student Count Badge */}
              <div className="pt-3 border-t border-[#334155]/40 flex items-center justify-between">
                <span className="text-xs text-slate-400 flex items-center space-x-1.5">
                  <Users className="w-3.5 h-3.5 text-blue-400" />
                  <span>Siswa Terdaftar:</span>
                </span>
                <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-blue-500/15 text-blue-400 border border-blue-500/30">
                  {cls.student_count || 0} Siswa
                </span>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Modal Add / Edit Class */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-md bg-[#111827] border border-[#1E293B] rounded-3xl shadow-2xl overflow-hidden flex flex-col">
            <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between bg-[#1E293B]/40">
              <h3 className="text-sm font-bold text-white">
                {editingClass ? 'Edit Data Kelas' : 'Tambah Kelas Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Kelas *</label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="Contoh: XII TKJ 1 / XI TKJ 2"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tingkat (Grade)</label>
                  <select
                    value={formData.grade}
                    onChange={(e) => setFormData({ ...formData, grade: Number(e.target.value) })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    <option value={10}>Kelas 10 (X)</option>
                    <option value={11}>Kelas 11 (XI)</option>
                    <option value={12}>Kelas 12 (XII)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Jurusan / Konsentrasi</label>
                  <select
                    required
                    value={formData.major_id}
                    onChange={(e) => setFormData({ ...formData, major_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-amber-500"
                  >
                    {majors.map(m => (
                      <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Wali Kelas (Opsional)</label>
                <select
                  value={formData.homeroom_teacher_id}
                  onChange={(e) => setFormData({ ...formData, homeroom_teacher_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  <option value="">-- Belum Ditentukan --</option>
                  {teachers.map(t => (
                    <option key={t.id} value={t.id}>{t.full_name} ({t.nip})</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Tahun Ajaran</label>
                <select
                  value={formData.academic_year_id}
                  onChange={(e) => setFormData({ ...formData, academic_year_id: e.target.value })}
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-amber-500"
                >
                  {academicYears.map(ay => (
                    <option key={ay.id} value={ay.id}>
                      {ay.name} {ay.is_active ? '(Aktif)' : ''}
                    </option>
                  ))}
                </select>
              </div>

              <div className="pt-4 border-t border-[#1E293B] flex justify-end space-x-2">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold"
                >
                  Batal
                </button>
                <button
                  type="submit"
                  disabled={formLoading}
                  className="px-5 py-2 rounded-xl bg-amber-600 hover:bg-amber-500 text-white text-xs font-bold shadow-md shadow-amber-600/30"
                >
                  {formLoading ? 'Menyimpan...' : 'Simpan Data Kelas'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-sm bg-[#111827] border border-[#1E293B] rounded-2xl p-5 shadow-2xl text-center space-y-3">
            <div className="w-12 h-12 rounded-full bg-rose-500/20 text-rose-400 flex items-center justify-center mx-auto border border-rose-500/30">
              <Trash2 className="w-6 h-6" />
            </div>
            <h4 className="text-sm font-bold text-white">Konfirmasi Hapus Kelas</h4>
            <p className="text-xs text-slate-400">
              Apakah Anda yakin ingin menghapus data kelas ini?
            </p>
            <div className="pt-3 flex justify-center space-x-3">
              <button
                onClick={() => setDeleteConfirmId(null)}
                className="px-4 py-2 rounded-xl bg-slate-700 hover:bg-slate-600 text-white text-xs font-semibold"
              >
                Batal
              </button>
              <button
                onClick={() => handleDelete(deleteConfirmId)}
                className="px-4 py-2 rounded-xl bg-rose-600 hover:bg-rose-500 text-white text-xs font-bold shadow-md shadow-rose-600/30"
              >
                Ya, Hapus Kelas
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassesPage;
