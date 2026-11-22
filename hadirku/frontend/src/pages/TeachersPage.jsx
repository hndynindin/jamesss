import React, { useState, useEffect } from 'react';
import { 
  GraduationCap, 
  UserPlus, 
  Search, 
  Edit, 
  Trash2, 
  X, 
  AlertTriangle,
  School,
  Mail,
  Phone
} from 'lucide-react';
import api from '../services/api';

const TeachersPage = () => {
  const [teachers, setTeachers] = useState([]);
  const [classes, setClasses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTeacher, setEditingTeacher] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  const [formData, setFormData] = useState({
    nip: '',
    full_name: '',
    email: '',
    phone: '',
    gender: 'L',
    subject: '',
    assigned_class_ids: [],
    username: '',
    password: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resTeachers, resClasses] = await Promise.all([
        api.get('/teachers'),
        api.get('/classes')
      ]);
      if (resTeachers.success) setTeachers(resTeachers.data);
      if (resClasses.success) setClasses(resClasses.data);
    } catch (err) {
      console.error('Error fetching teachers data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const openAddModal = () => {
    setEditingTeacher(null);
    setFormData({
      nip: '',
      full_name: '',
      email: '',
      phone: '',
      gender: 'L',
      subject: '',
      assigned_class_ids: [],
      username: '',
      password: 'password123'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (t) => {
    setEditingTeacher(t);
    // Find assigned class ids
    const assignedIds = (t.classes || []).map(c => c.class_id);
    setFormData({
      nip: t.nip,
      full_name: t.full_name,
      email: t.email,
      phone: t.phone || '',
      gender: t.gender || 'L',
      subject: t.subject,
      assigned_class_ids: assignedIds,
      username: t.username || '',
      password: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleClassCheckbox = (classId) => {
    const id = Number(classId);
    setFormData(prev => {
      const exists = prev.assigned_class_ids.includes(id);
      return {
        ...prev,
        assigned_class_ids: exists 
          ? prev.assigned_class_ids.filter(c => c !== id) 
          : [...prev.assigned_class_ids, id]
      };
    });
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      if (editingTeacher) {
        await api.put(`/teachers/${editingTeacher.id}`, formData);
      } else {
        await api.post('/teachers', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data guru.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/teachers/${id}`);
      setDeleteConfirmId(null);
      fetchData();
    } catch (err) {
      alert('Gagal menghapus guru: ' + err.message);
    }
  };

  const filteredTeachers = teachers.filter(t => 
    t.full_name.toLowerCase().includes(search.toLowerCase()) ||
    t.nip.includes(search) ||
    t.subject.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60">
        <div>
          <h2 className="text-base lg:text-lg font-extrabold text-white flex items-center space-x-2">
            <GraduationCap className="w-5 h-5 text-purple-400" />
            <span>Manajemen Tenaga Pendidik (Guru)</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Daftar guru pengampu mata pelajaran kejuruan TKJ dan wali kelas
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-lg shadow-purple-600/30 transition-all self-start sm:self-auto active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Guru Baru</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="relative max-w-md">
        <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Cari nama guru, NIP, atau mata pelajaran..."
          className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-xs focus:outline-none focus:border-purple-500 placeholder-slate-500"
        />
      </div>

      {/* Teachers Table */}
      <div className="rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-purple-500 mx-auto mb-2" />
            <span className="text-xs">Memuat data guru...</span>
          </div>
        ) : filteredTeachers.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            Tidak ada data guru ditemukan.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] font-bold border-b border-[#334155]">
                <tr>
                  <th className="px-4 py-3.5 w-12 text-center">No</th>
                  <th className="px-4 py-3.5">NIP</th>
                  <th className="px-4 py-3.5">Nama Lengkap & Gelar</th>
                  <th className="px-4 py-3.5">Mata Pelajaran Diampu</th>
                  <th className="px-4 py-3.5">Kelas yang Diajar</th>
                  <th className="px-4 py-3.5">Kontak</th>
                  <th className="px-4 py-3.5 text-center w-28">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {filteredTeachers.map((t, index) => (
                  <tr key={t.id} className="hover:bg-[#1E293B]/50 transition-colors">
                    <td className="px-4 py-3 text-center font-mono text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 font-mono font-bold text-purple-400">
                      {t.nip}
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-semibold text-white">{t.full_name}</div>
                      <div className="text-[10px] text-slate-400">
                        {t.gender === 'L' ? 'Laki-laki' : 'Perempuan'}
                      </div>
                    </td>

                    <td className="px-4 py-3">
                      <span className="px-2.5 py-1 rounded-lg bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 text-[11px] font-medium">
                        {t.subject}
                      </span>
                    </td>

                    <td className="px-4 py-3 text-slate-300">
                      {t.assigned_classes_names || '-'}
                    </td>

                    <td className="px-4 py-3 text-slate-400">
                      <div className="flex items-center space-x-1">
                        <Mail className="w-3 h-3 text-slate-500" />
                        <span>{t.email}</span>
                      </div>
                      {t.phone && (
                        <div className="flex items-center space-x-1 text-[10px] text-slate-500">
                          <Phone className="w-3 h-3" />
                          <span>{t.phone}</span>
                        </div>
                      )}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1.5">
                        <button
                          onClick={() => openEditModal(t)}
                          className="p-1.5 rounded-lg bg-[#0B1120] hover:bg-amber-600/30 text-amber-400 border border-[#334155] transition-colors"
                          title="Edit Guru"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(t.id)}
                          className="p-1.5 rounded-lg bg-[#0B1120] hover:bg-rose-600/30 text-rose-400 border border-[#334155] transition-colors"
                          title="Hapus Guru"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Modal Add / Edit Teacher */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#111827] border border-[#1E293B] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between bg-[#1E293B]/40">
              <h3 className="text-sm font-bold text-white">
                {editingTeacher ? 'Edit Data Guru' : 'Tambah Guru Baru'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-[#334155]"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleFormSubmit} className="p-6 overflow-y-auto space-y-4">
              {formError && (
                <div className="p-3 rounded-xl bg-rose-500/10 border border-rose-500/30 text-rose-400 text-xs flex items-center space-x-2">
                  <AlertTriangle className="w-4 h-4 shrink-0" />
                  <span>{formError}</span>
                </div>
              )}

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">NIP *</label>
                  <input
                    type="text"
                    required
                    value={formData.nip}
                    onChange={(e) => setFormData({ ...formData, nip: e.target.value })}
                    placeholder="19850412xxxx"
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-purple-500"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap & Gelar *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Contoh: Budi Santoso, S.Kom"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Mata Pelajaran Diampu *</label>
                <input
                  type="text"
                  required
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Contoh: Administrasi Infrastruktur Jaringan"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-purple-500"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Email Sekolah *</label>
                  <input
                    type="email"
                    required
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="guru@hadirku.sch.id"
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Telepon</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812xxxx"
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-purple-500"
                  />
                </div>
              </div>

              {/* Assigned Classes */}
              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-2">
                  Pilih Kelas yang Diajar:
                </label>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 p-3 rounded-xl bg-[#0B1120] border border-[#334155]">
                  {classes.map(c => {
                    const isChecked = formData.assigned_class_ids.includes(c.id);
                    return (
                      <label 
                        key={c.id} 
                        className={`flex items-center space-x-2 p-2 rounded-lg text-xs cursor-pointer border transition-all ${
                          isChecked ? 'bg-purple-600/20 border-purple-500/40 text-purple-300' : 'bg-[#1E293B]/40 border-transparent text-slate-400 hover:text-white'
                        }`}
                      >
                        <input
                          type="checkbox"
                          checked={isChecked}
                          onChange={() => handleClassCheckbox(c.id)}
                          className="rounded bg-[#111827] border-[#334155] text-purple-600 focus:ring-0"
                        />
                        <span className="font-semibold truncate">{c.name}</span>
                      </label>
                    );
                  })}
                </div>
              </div>

              {!editingTeacher && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1E293B]">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Username Login</label>
                    <input
                      type="text"
                      value={formData.username}
                      onChange={(e) => setFormData({ ...formData, username: e.target.value })}
                      placeholder="guru_nama / NIP"
                      className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password Default</label>
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-purple-500"
                    />
                  </div>
                </div>
              )}

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
                  className="px-5 py-2 rounded-xl bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold shadow-md shadow-purple-600/30"
                >
                  {formLoading ? 'Menyimpan...' : 'Simpan Data Guru'}
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
            <h4 className="text-sm font-bold text-white">Konfirmasi Hapus Guru</h4>
            <p className="text-xs text-slate-400">
              Apakah Anda yakin ingin menghapus data guru ini beserta akun login sistemnya?
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
                Ya, Hapus Data
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default TeachersPage;
