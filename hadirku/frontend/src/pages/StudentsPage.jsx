import React, { useState, useEffect } from 'react';
import { 
  Users, 
  UserPlus, 
  Search, 
  Filter, 
  Edit, 
  Trash2, 
  QrCode, 
  X, 
  Check, 
  AlertTriangle,
  School
} from 'lucide-react';
import api from '../services/api';
import StudentQRBadgeModal from '../components/StudentQRBadgeModal';

const StudentsPage = () => {
  const [students, setStudents] = useState([]);
  const [classes, setClasses] = useState([]);
  const [majors, setMajors] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [selectedClass, setSelectedClass] = useState('');
  const [selectedMajor, setSelectedMajor] = useState('');

  // Modals state
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingStudent, setEditingStudent] = useState(null);
  const [selectedStudentForQR, setSelectedStudentForQR] = useState(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState(null);
  const [formLoading, setFormLoading] = useState(false);
  const [formError, setFormError] = useState('');

  // Form Fields
  const [formData, setFormData] = useState({
    nis: '',
    nisn: '',
    full_name: '',
    gender: 'L',
    class_id: '',
    major_id: '',
    entry_year: 2023,
    phone: '',
    address: '',
    email: '',
    password: ''
  });

  const fetchData = async () => {
    setLoading(true);
    try {
      const [resStudents, resClasses, resMaster] = await Promise.all([
        api.get(`/students?search=${search}&class_id=${selectedClass}&major_id=${selectedMajor}`),
        api.get('/classes'),
        api.get('/reports/master')
      ]);

      if (resStudents.success) setStudents(resStudents.data);
      if (resClasses.success) setClasses(resClasses.data);
      if (resMaster.success) setMajors(resMaster.data.majors);
    } catch (err) {
      console.error('Error fetching students data:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, [search, selectedClass, selectedMajor]);

  const openAddModal = () => {
    setEditingStudent(null);
    setFormData({
      nis: '',
      nisn: '',
      full_name: '',
      gender: 'L',
      class_id: classes[0]?.id || '',
      major_id: majors[0]?.id || '',
      entry_year: 2023,
      phone: '',
      address: '',
      email: '',
      password: 'password123'
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const openEditModal = (s) => {
    setEditingStudent(s);
    setFormData({
      nis: s.nis,
      nisn: s.nisn || '',
      full_name: s.full_name,
      gender: s.gender || 'L',
      class_id: s.class_id,
      major_id: s.major_id,
      entry_year: s.entry_year,
      phone: s.phone || '',
      address: s.address || '',
      email: s.user_email || '',
      password: ''
    });
    setFormError('');
    setIsModalOpen(true);
  };

  const handleFormSubmit = async (e) => {
    e.preventDefault();
    setFormLoading(true);
    setFormError('');

    try {
      if (editingStudent) {
        await api.put(`/students/${editingStudent.id}`, formData);
      } else {
        await api.post('/students', formData);
      }
      setIsModalOpen(false);
      fetchData();
    } catch (err) {
      setFormError(err.message || 'Gagal menyimpan data siswa.');
    } finally {
      setFormLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await api.delete(`/students/${id}`);
      setDeleteConfirmId(null);
      fetchData();
    } catch (err) {
      alert('Gagal menghapus siswa: ' + err.message);
    }
  };

  return (
    <div className="space-y-6">
      {/* Top Header & Add Button */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 p-5 rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60">
        <div>
          <h2 className="text-base lg:text-lg font-extrabold text-white flex items-center space-x-2">
            <Users className="w-5 h-5 text-blue-400" />
            <span>Manajemen Data Siswa</span>
          </h2>
          <p className="text-xs text-slate-400 mt-0.5">
            Kelola data induk siswa, kelas binaan, dan kartu identitas QR presensi
          </p>
        </div>

        <button
          onClick={openAddModal}
          className="flex items-center space-x-2 px-4 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-lg shadow-blue-600/30 transition-all self-start sm:self-auto active:scale-95"
        >
          <UserPlus className="w-4 h-4" />
          <span>Tambah Siswa Baru</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        {/* Search Input */}
        <div className="relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Cari nama, NIS, atau NISN..."
            className="w-full pl-9 pr-4 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500 placeholder-slate-500"
          />
        </div>

        {/* Filter Class */}
        <div>
          <select
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">Semua Rombel / Kelas</option>
            {classes.map(c => (
              <option key={c.id} value={c.id}>{c.name}</option>
            ))}
          </select>
        </div>

        {/* Filter Major */}
        <div>
          <select
            value={selectedMajor}
            onChange={(e) => setSelectedMajor(e.target.value)}
            className="w-full px-3 py-2 rounded-xl bg-[#1E293B] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500 cursor-pointer"
          >
            <option value="">Semua Konsentrasi Keahlian</option>
            {majors.map(m => (
              <option key={m.id} value={m.id}>{m.name} ({m.code})</option>
            ))}
          </select>
        </div>
      </div>

      {/* Students Data Table */}
      <div className="rounded-2xl bg-[#1E293B]/70 border border-[#334155]/60 overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-400">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500 mx-auto mb-2" />
            <span className="text-xs">Memuat data siswa...</span>
          </div>
        ) : students.length === 0 ? (
          <div className="p-12 text-center text-slate-500 text-xs">
            Tidak ada data siswa ditemukan sesuai filter.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-[#111827] text-slate-400 uppercase text-[10px] font-bold border-b border-[#334155]">
                <tr>
                  <th className="px-4 py-3.5 w-12 text-center">No</th>
                  <th className="px-4 py-3.5">NIS / NISN</th>
                  <th className="px-4 py-3.5">Nama Lengkap</th>
                  <th className="px-4 py-3.5 text-center">L/P</th>
                  <th className="px-4 py-3.5">Kelas & Jurusan</th>
                  <th className="px-4 py-3.5">Tahun Masuk</th>
                  <th className="px-4 py-3.5">Kontak & Alamat</th>
                  <th className="px-4 py-3.5 text-center w-36">Aksi</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-[#1E293B]">
                {students.map((s, index) => (
                  <tr key={s.id} className="hover:bg-[#1E293B]/50 transition-colors">
                    <td className="px-4 py-3 text-center font-mono text-slate-500">
                      {index + 1}
                    </td>

                    <td className="px-4 py-3 font-mono">
                      <div className="font-bold text-blue-400">{s.nis}</div>
                      <div className="text-[10px] text-slate-500">{s.nisn || '-'}</div>
                    </td>

                    <td className="px-4 py-3 font-semibold text-white">
                      {s.full_name}
                    </td>

                    <td className="px-4 py-3 text-center">
                      <span className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                        s.gender === 'L' ? 'bg-blue-500/15 text-blue-400' : 'bg-pink-500/15 text-pink-400'
                      }`}>
                        {s.gender === 'L' ? 'L' : 'P'}
                      </span>
                    </td>

                    <td className="px-4 py-3">
                      <div className="font-bold text-slate-200">{s.class_name}</div>
                      <div className="text-[10px] text-emerald-400 font-medium">{s.major_name}</div>
                    </td>

                    <td className="px-4 py-3 font-mono text-slate-400">
                      {s.entry_year}
                    </td>

                    <td className="px-4 py-3 text-slate-400">
                      <div>{s.phone || '-'}</div>
                      <div className="text-[10px] text-slate-500 truncate max-w-[140px]">{s.address || '-'}</div>
                    </td>

                    <td className="px-4 py-3 text-center">
                      <div className="flex items-center justify-center space-x-1">
                        <button
                          onClick={() => setSelectedStudentForQR(s)}
                          className="p-1.5 rounded-lg bg-[#0B1120] hover:bg-blue-600/30 text-blue-400 border border-[#334155] transition-colors"
                          title="Lihat QR Code Siswa"
                        >
                          <QrCode className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => openEditModal(s)}
                          className="p-1.5 rounded-lg bg-[#0B1120] hover:bg-amber-600/30 text-amber-400 border border-[#334155] transition-colors"
                          title="Edit Siswa"
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeleteConfirmId(s.id)}
                          className="p-1.5 rounded-lg bg-[#0B1120] hover:bg-rose-600/30 text-rose-400 border border-[#334155] transition-colors"
                          title="Hapus Siswa"
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

      {/* Modal Add / Edit Student */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
          <div className="w-full max-w-lg bg-[#111827] border border-[#1E293B] rounded-3xl shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
            <div className="px-6 py-4 border-b border-[#1E293B] flex items-center justify-between bg-[#1E293B]/40">
              <h3 className="text-sm font-bold text-white">
                {editingStudent ? 'Edit Data Siswa' : 'Tambah Siswa Baru'}
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
                  <label className="block text-xs font-semibold text-slate-300 mb-1">NIS *</label>
                  <input
                    type="text"
                    required
                    value={formData.nis}
                    onChange={(e) => setFormData({ ...formData, nis: e.target.value })}
                    placeholder="Contoh: 20240101"
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">NISN (Opsional)</label>
                  <input
                    type="text"
                    value={formData.nisn}
                    onChange={(e) => setFormData({ ...formData, nisn: e.target.value })}
                    placeholder="Contoh: 0061234567"
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Nama Lengkap *</label>
                <input
                  type="text"
                  required
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  placeholder="Nama lengkap siswa"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Jenis Kelamin</label>
                  <select
                    value={formData.gender}
                    onChange={(e) => setFormData({ ...formData, gender: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    <option value="L">Laki-laki</option>
                    <option value="P">Perempuan</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Kelas *</label>
                  <select
                    required
                    value={formData.class_id}
                    onChange={(e) => setFormData({ ...formData, class_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    {classes.map(c => (
                      <option key={c.id} value={c.id}>{c.name}</option>
                    ))}
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Jurusan *</label>
                  <select
                    required
                    value={formData.major_id}
                    onChange={(e) => setFormData({ ...formData, major_id: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
                  >
                    {majors.map(m => (
                      <option key={m.id} value={m.id}>{m.code}</option>
                    ))}
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Tahun Masuk</label>
                  <input
                    type="number"
                    value={formData.entry_year}
                    onChange={(e) => setFormData({ ...formData, entry_year: e.target.value })}
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-300 mb-1">Nomor Telepon / WA</label>
                  <input
                    type="text"
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    placeholder="0812xxxx"
                    className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-300 mb-1">Alamat Rumah</label>
                <textarea
                  rows={2}
                  value={formData.address}
                  onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                  placeholder="Alamat lengkap tempat tinggal"
                  className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
                />
              </div>

              {!editingStudent && (
                <div className="grid grid-cols-2 gap-3 pt-2 border-t border-[#1E293B]">
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Email Akun Login</label>
                    <input
                      type="email"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      placeholder="nis@hadirku.sch.id"
                      className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-slate-300 mb-1">Password Default</label>
                    <input
                      type="text"
                      value={formData.password}
                      onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                      className="w-full px-3 py-2 rounded-xl bg-[#0B1120] border border-[#334155] text-white text-xs focus:outline-none focus:border-blue-500"
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
                  className="px-5 py-2 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold shadow-md shadow-blue-600/30"
                >
                  {formLoading ? 'Menyimpan...' : 'Simpan Data Siswa'}
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
            <h4 className="text-sm font-bold text-white">Konfirmasi Hapus Siswa</h4>
            <p className="text-xs text-slate-400">
              Apakah Anda yakin ingin menghapus data siswa ini? Seluruh data riwayat presensi yang terkait juga akan dihapus.
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

      {/* Student QR Badge Modal */}
      <StudentQRBadgeModal
        student={selectedStudentForQR}
        isOpen={!!selectedStudentForQR}
        onClose={() => setSelectedStudentForQR(null)}
      />
    </div>
  );
};

export default StudentsPage;
