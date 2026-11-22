const { getPool, isUsingFallback, getStore, saveStore } = require('../config/db');

class DbService {
  // ==========================================
  // USERS & AUTH
  // ==========================================
  async findUserByUsernameOrEmail(identifier) {
    if (!isUsingFallback()) {
      const [rows] = await getPool().query(
        'SELECT * FROM users WHERE username = ? OR email = ? LIMIT 1',
        [identifier, identifier]
      );
      return rows[0] || null;
    } else {
      const store = getStore();
      const user = store.users.find(
        u => u.username.toLowerCase() === identifier.toLowerCase() || 
             u.email.toLowerCase() === identifier.toLowerCase()
      );
      return user ? { ...user } : null;
    }
  }

  async findUserById(id) {
    if (!isUsingFallback()) {
      const [rows] = await getPool().query(
        'SELECT id, username, email, role, avatar, created_at FROM users WHERE id = ? LIMIT 1',
        [id]
      );
      return rows[0] || null;
    } else {
      const store = getStore();
      const user = store.users.find(u => u.id === Number(id));
      if (!user) return null;
      const { password, ...safeUser } = user;
      return safeUser;
    }
  }

  async updateUserProfile(id, { username, email, password, avatar }) {
    if (!isUsingFallback()) {
      let sql = 'UPDATE users SET updated_at = NOW()';
      const params = [];
      if (username) { sql += ', username = ?'; params.push(username); }
      if (email) { sql += ', email = ?'; params.push(email); }
      if (password) { sql += ', password = ?'; params.push(password); }
      if (avatar !== undefined) { sql += ', avatar = ?'; params.push(avatar); }
      sql += ' WHERE id = ?';
      params.push(id);
      await getPool().query(sql, params);
      return this.findUserById(id);
    } else {
      const store = getStore();
      const user = store.users.find(u => u.id === Number(id));
      if (!user) return null;
      if (username) user.username = username;
      if (email) user.email = email;
      if (password) user.password = password;
      if (avatar !== undefined) user.avatar = avatar;
      saveStore();
      const { password: _, ...safeUser } = user;
      return safeUser;
    }
  }

  // ==========================================
  // TEACHERS
  // ==========================================
  async getTeachers() {
    if (!isUsingFallback()) {
      const [rows] = await getPool().query(`
        SELECT t.*, u.username,
               (SELECT COUNT(*) FROM classes c WHERE c.homeroom_teacher_id = t.id) as homeroom_class_count,
               (SELECT GROUP_CONCAT(c.name SEPARATOR ', ') FROM teacher_classes tc JOIN classes c ON c.id = tc.class_id WHERE tc.teacher_id = t.id) as assigned_classes_names
        FROM teachers t
        LEFT JOIN users u ON u.id = t.user_id
        ORDER BY t.full_name ASC
      `);
      return rows;
    } else {
      const store = getStore();
      return store.teachers.map(t => {
        const user = store.users.find(u => u.id === t.user_id);
        const homeroom_class_count = store.classes.filter(c => c.homeroom_teacher_id === t.id).length;
        const assigned = store.teacher_classes
          .filter(tc => tc.teacher_id === t.id)
          .map(tc => {
            const cls = store.classes.find(c => c.id === tc.class_id);
            return cls ? cls.name : null;
          })
          .filter(Boolean)
          .join(', ');

        return {
          ...t,
          username: user ? user.username : null,
          homeroom_class_count,
          assigned_classes_names: assigned || '-'
        };
      });
    }
  }

  async getTeacherById(id) {
    if (!isUsingFallback()) {
      const [rows] = await getPool().query(
        'SELECT t.*, u.username FROM teachers t LEFT JOIN users u ON u.id = t.user_id WHERE t.id = ?',
        [id]
      );
      if (!rows.length) return null;
      const teacher = rows[0];
      const [cls] = await getPool().query(
        'SELECT tc.*, c.name as class_name FROM teacher_classes tc JOIN classes c ON c.id = tc.class_id WHERE tc.teacher_id = ?',
        [id]
      );
      teacher.classes = cls;
      return teacher;
    } else {
      const store = getStore();
      const teacher = store.teachers.find(t => t.id === Number(id));
      if (!teacher) return null;
      const user = store.users.find(u => u.id === teacher.user_id);
      const classes = store.teacher_classes
        .filter(tc => tc.teacher_id === teacher.id)
        .map(tc => {
          const cls = store.classes.find(c => c.id === tc.class_id);
          return { ...tc, class_name: cls ? cls.name : 'Unknown' };
        });
      return { ...teacher, username: user ? user.username : null, classes };
    }
  }

  async getTeacherByUserId(userId) {
    if (!isUsingFallback()) {
      const [rows] = await getPool().query('SELECT * FROM teachers WHERE user_id = ?', [userId]);
      return rows[0] || null;
    } else {
      const store = getStore();
      const teacher = store.teachers.find(t => t.user_id === Number(userId));
      return teacher ? { ...teacher } : null;
    }
  }

  async createTeacher({ nip, full_name, email, phone, gender, subject, username, password, assigned_class_ids = [] }) {
    if (!isUsingFallback()) {
      const bcrypt = require('bcryptjs');
      const hash = bcrypt.hashSync(password || 'password123', 10);
      const [userRes] = await getPool().query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "guru")',
        [username || nip, email, hash]
      );
      const userId = userRes.insertId;

      const [res] = await getPool().query(
        'INSERT INTO teachers (user_id, nip, full_name, email, phone, gender, subject) VALUES (?, ?, ?, ?, ?, ?, ?)',
        [userId, nip, full_name, email, phone, gender || 'L', subject]
      );
      const teacherId = res.insertId;

      if (assigned_class_ids && assigned_class_ids.length > 0) {
        for (const cid of assigned_class_ids) {
          await getPool().query('INSERT INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)', [teacherId, cid]);
        }
      }
      return this.getTeacherById(teacherId);
    } else {
      const store = getStore();
      const bcrypt = require('bcryptjs');
      const hash = bcrypt.hashSync(password || 'password123', 10);
      
      const newUserId = store.users.length ? Math.max(...store.users.map(u => u.id)) + 1 : 1;
      store.users.push({
        id: newUserId,
        username: username || nip,
        email,
        password: hash,
        role: 'guru',
        avatar: null
      });

      const newTeacherId = store.teachers.length ? Math.max(...store.teachers.map(t => t.id)) + 1 : 1;
      const newTeacher = {
        id: newTeacherId,
        user_id: newUserId,
        nip,
        full_name,
        email,
        phone,
        gender: gender || 'L',
        subject
      };
      store.teachers.push(newTeacher);

      if (assigned_class_ids && assigned_class_ids.length > 0) {
        for (const cid of assigned_class_ids) {
          const tcId = store.teacher_classes.length ? Math.max(...store.teacher_classes.map(tc => tc.id)) + 1 : 1;
          store.teacher_classes.push({ id: tcId, teacher_id: newTeacherId, class_id: Number(cid), subject });
        }
      }
      saveStore();
      return this.getTeacherById(newTeacherId);
    }
  }

  async updateTeacher(id, { nip, full_name, email, phone, gender, subject, assigned_class_ids }) {
    if (!isUsingFallback()) {
      await getPool().query(
        'UPDATE teachers SET nip = ?, full_name = ?, email = ?, phone = ?, gender = ?, subject = ? WHERE id = ?',
        [nip, full_name, email, phone, gender, subject, id]
      );

      if (assigned_class_ids) {
        await getPool().query('DELETE FROM teacher_classes WHERE teacher_id = ?', [id]);
        for (const cid of assigned_class_ids) {
          await getPool().query('INSERT INTO teacher_classes (teacher_id, class_id) VALUES (?, ?)', [id, cid]);
        }
      }
      return this.getTeacherById(id);
    } else {
      const store = getStore();
      const teacher = store.teachers.find(t => t.id === Number(id));
      if (!teacher) return null;
      if (nip) teacher.nip = nip;
      if (full_name) teacher.full_name = full_name;
      if (email) teacher.email = email;
      if (phone !== undefined) teacher.phone = phone;
      if (gender) teacher.gender = gender;
      if (subject) teacher.subject = subject;

      if (assigned_class_ids) {
        store.teacher_classes = store.teacher_classes.filter(tc => tc.teacher_id !== Number(id));
        for (const cid of assigned_class_ids) {
          const tcId = store.teacher_classes.length ? Math.max(...store.teacher_classes.map(tc => tc.id)) + 1 : 1;
          store.teacher_classes.push({ id: tcId, teacher_id: Number(id), class_id: Number(cid), subject: teacher.subject });
        }
      }
      saveStore();
      return this.getTeacherById(id);
    }
  }

  async deleteTeacher(id) {
    if (!isUsingFallback()) {
      const [rows] = await getPool().query('SELECT user_id FROM teachers WHERE id = ?', [id]);
      const userId = rows[0]?.user_id;
      await getPool().query('DELETE FROM teacher_classes WHERE teacher_id = ?', [id]);
      await getPool().query('DELETE FROM teachers WHERE id = ?', [id]);
      if (userId) {
        await getPool().query('DELETE FROM users WHERE id = ?', [userId]);
      }
      return true;
    } else {
      const store = getStore();
      const idx = store.teachers.findIndex(t => t.id === Number(id));
      if (idx === -1) return false;
      const userId = store.teachers[idx].user_id;
      store.teachers.splice(idx, 1);
      store.teacher_classes = store.teacher_classes.filter(tc => tc.teacher_id !== Number(id));
      if (userId) {
        store.users = store.users.filter(u => u.id !== userId);
      }
      saveStore();
      return true;
    }
  }

  // ==========================================
  // CLASSES
  // ==========================================
  async getClasses() {
    if (!isUsingFallback()) {
      const [rows] = await getPool().query(`
        SELECT c.*, 
               m.name as major_name, m.code as major_code,
               ay.name as academic_year_name,
               t.full_name as homeroom_teacher_name,
               (SELECT COUNT(*) FROM students s WHERE s.class_id = c.id) as student_count
        FROM classes c
        JOIN majors m ON m.id = c.major_id
        JOIN academic_years ay ON ay.id = c.academic_year_id
        LEFT JOIN teachers t ON t.id = c.homeroom_teacher_id
        ORDER BY c.grade ASC, c.name ASC
      `);
      return rows;
    } else {
      const store = getStore();
      return store.classes.map(c => {
        const major = store.majors.find(m => m.id === c.major_id);
        const ay = store.academic_years.find(a => a.id === c.academic_year_id);
        const teacher = store.teachers.find(t => t.id === c.homeroom_teacher_id);
        const student_count = store.students.filter(s => s.class_id === c.id).length;

        return {
          ...c,
          major_name: major ? major.name : 'Unknown',
          major_code: major ? major.code : '-',
          academic_year_name: ay ? ay.name : 'Unknown',
          homeroom_teacher_name: teacher ? teacher.full_name : 'Belum Ditentukan',
          student_count
        };
      });
    }
  }

  async getClassById(id) {
    if (!isUsingFallback()) {
      const [rows] = await getPool().query(`
        SELECT c.*, m.name as major_name, ay.name as academic_year_name, t.full_name as homeroom_teacher_name
        FROM classes c
        JOIN majors m ON m.id = c.major_id
        JOIN academic_years ay ON ay.id = c.academic_year_id
        LEFT JOIN teachers t ON t.id = c.homeroom_teacher_id
        WHERE c.id = ?
      `, [id]);
      return rows[0] || null;
    } else {
      const store = getStore();
      const c = store.classes.find(cl => cl.id === Number(id));
      if (!c) return null;
      const major = store.majors.find(m => m.id === c.major_id);
      const ay = store.academic_years.find(a => a.id === c.academic_year_id);
      const teacher = store.teachers.find(t => t.id === c.homeroom_teacher_id);
      return {
        ...c,
        major_name: major ? major.name : 'Unknown',
        academic_year_name: ay ? ay.name : 'Unknown',
        homeroom_teacher_name: teacher ? teacher.full_name : 'Belum Ditentukan'
      };
    }
  }

  async createClass({ name, grade, major_id, academic_year_id, homeroom_teacher_id }) {
    if (!isUsingFallback()) {
      const [res] = await getPool().query(
        'INSERT INTO classes (name, grade, major_id, academic_year_id, homeroom_teacher_id) VALUES (?, ?, ?, ?, ?)',
        [name, grade || 10, major_id, academic_year_id || 1, homeroom_teacher_id || null]
      );
      return this.getClassById(res.insertId);
    } else {
      const store = getStore();
      const newId = store.classes.length ? Math.max(...store.classes.map(c => c.id)) + 1 : 1;
      const newClass = {
        id: newId,
        name,
        grade: Number(grade) || 10,
        major_id: Number(major_id),
        academic_year_id: Number(academic_year_id) || 1,
        homeroom_teacher_id: homeroom_teacher_id ? Number(homeroom_teacher_id) : null
      };
      store.classes.push(newClass);
      saveStore();
      return this.getClassById(newId);
    }
  }

  async updateClass(id, { name, grade, major_id, academic_year_id, homeroom_teacher_id }) {
    if (!isUsingFallback()) {
      await getPool().query(
        'UPDATE classes SET name = ?, grade = ?, major_id = ?, academic_year_id = ?, homeroom_teacher_id = ? WHERE id = ?',
        [name, grade, major_id, academic_year_id, homeroom_teacher_id || null, id]
      );
      return this.getClassById(id);
    } else {
      const store = getStore();
      const c = store.classes.find(cl => cl.id === Number(id));
      if (!c) return null;
      if (name) c.name = name;
      if (grade) c.grade = Number(grade);
      if (major_id) c.major_id = Number(major_id);
      if (academic_year_id) c.academic_year_id = Number(academic_year_id);
      c.homeroom_teacher_id = homeroom_teacher_id ? Number(homeroom_teacher_id) : null;
      saveStore();
      return this.getClassById(id);
    }
  }

  async deleteClass(id) {
    if (!isUsingFallback()) {
      await getPool().query('DELETE FROM classes WHERE id = ?', [id]);
      return true;
    } else {
      const store = getStore();
      store.classes = store.classes.filter(c => c.id !== Number(id));
      saveStore();
      return true;
    }
  }

  // ==========================================
  // STUDENTS
  // ==========================================
  async getStudents({ search = '', class_id = null, major_id = null } = {}) {
    if (!isUsingFallback()) {
      let sql = `
        SELECT s.*, c.name as class_name, m.name as major_name, m.code as major_code, u.email as user_email
        FROM students s
        JOIN classes c ON c.id = s.class_id
        JOIN majors m ON m.id = s.major_id
        LEFT JOIN users u ON u.id = s.user_id
        WHERE 1=1
      `;
      const params = [];
      if (search) {
        sql += ' AND (s.full_name LIKE ? OR s.nis LIKE ? OR s.nisn LIKE ?)';
        const queryTerm = `%${search}%`;
        params.push(queryTerm, queryTerm, queryTerm);
      }
      if (class_id) {
        sql += ' AND s.class_id = ?';
        params.push(class_id);
      }
      if (major_id) {
        sql += ' AND s.major_id = ?';
        params.push(major_id);
      }
      sql += ' ORDER BY c.name ASC, s.full_name ASC';
      const [rows] = await getPool().query(sql, params);
      return rows;
    } else {
      const store = getStore();
      let list = store.students.map(s => {
        const cls = store.classes.find(c => c.id === s.class_id);
        const major = store.majors.find(m => m.id === s.major_id);
        const user = store.users.find(u => u.id === s.user_id);
        return {
          ...s,
          class_name: cls ? cls.name : 'Unknown',
          major_name: major ? major.name : 'Unknown',
          major_code: major ? major.code : '-',
          user_email: user ? user.email : s.phone
        };
      });

      if (search) {
        const term = search.toLowerCase();
        list = list.filter(s => 
          s.full_name.toLowerCase().includes(term) ||
          s.nis.toLowerCase().includes(term) ||
          (s.nisn && s.nisn.toLowerCase().includes(term))
        );
      }

      if (class_id) {
        list = list.filter(s => s.class_id === Number(class_id));
      }
      if (major_id) {
        list = list.filter(s => s.major_id === Number(major_id));
      }

      list.sort((a, b) => a.full_name.localeCompare(b.full_name));
      return list;
    }
  }

  async getStudentById(id) {
    if (!isUsingFallback()) {
      const [rows] = await getPool().query(`
        SELECT s.*, c.name as class_name, m.name as major_name, m.code as major_code, u.email as user_email
        FROM students s
        JOIN classes c ON c.id = s.class_id
        JOIN majors m ON m.id = s.major_id
        LEFT JOIN users u ON u.id = s.user_id
        WHERE s.id = ?
      `, [id]);
      return rows[0] || null;
    } else {
      const store = getStore();
      const s = store.students.find(st => st.id === Number(id));
      if (!s) return null;
      const cls = store.classes.find(c => c.id === s.class_id);
      const major = store.majors.find(m => m.id === s.major_id);
      const user = store.users.find(u => u.id === s.user_id);
      return {
        ...s,
        class_name: cls ? cls.name : 'Unknown',
        major_name: major ? major.name : 'Unknown',
        major_code: major ? major.code : '-',
        user_email: user ? user.email : s.phone
      };
    }
  }

  async getStudentByUserId(userId) {
    if (!isUsingFallback()) {
      const [rows] = await getPool().query(`
        SELECT s.*, c.name as class_name, m.name as major_name, m.code as major_code, u.email as user_email
        FROM students s
        JOIN classes c ON c.id = s.class_id
        JOIN majors m ON m.id = s.major_id
        LEFT JOIN users u ON u.id = s.user_id
        WHERE s.user_id = ?
      `, [userId]);
      return rows[0] || null;
    } else {
      const store = getStore();
      const s = store.students.find(st => st.user_id === Number(userId));
      if (!s) return null;
      return this.getStudentById(s.id);
    }
  }

  async getStudentByQRToken(token) {
    if (!isUsingFallback()) {
      const [rows] = await getPool().query(`
        SELECT s.*, c.name as class_name, m.name as major_name
        FROM students s
        JOIN classes c ON c.id = s.class_id
        JOIN majors m ON m.id = s.major_id
        WHERE s.qr_code_token = ?
      `, [token]);
      return rows[0] || null;
    } else {
      const store = getStore();
      const s = store.students.find(st => st.qr_code_token === token || st.nis === token);
      if (!s) return null;
      return this.getStudentById(s.id);
    }
  }

  async createStudent({ nis, nisn, full_name, gender, class_id, major_id, entry_year, phone, address, email, password }) {
    const qrToken = `QR-${nis}-${full_name.substring(0, 5).toUpperCase().replace(/[^A-Z]/g, '')}`;
    
    if (!isUsingFallback()) {
      const bcrypt = require('bcryptjs');
      const hash = bcrypt.hashSync(password || 'password123', 10);
      const studentEmail = email || `${nis}@hadirku.sch.id`;

      const [userRes] = await getPool().query(
        'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, "siswa")',
        [nis, studentEmail, hash]
      );
      const userId = userRes.insertId;

      const [res] = await getPool().query(
        'INSERT INTO students (user_id, nis, nisn, full_name, gender, class_id, major_id, entry_year, phone, address, qr_code_token) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [userId, nis, nisn || null, full_name, gender || 'L', class_id, major_id, entry_year || new Date().getFullYear(), phone, address, qrToken]
      );
      return this.getStudentById(res.insertId);
    } else {
      const store = getStore();
      const bcrypt = require('bcryptjs');
      const hash = bcrypt.hashSync(password || 'password123', 10);
      const studentEmail = email || `${nis}@hadirku.sch.id`;

      const newUserId = store.users.length ? Math.max(...store.users.map(u => u.id)) + 1 : 1;
      store.users.push({
        id: newUserId,
        username: nis,
        email: studentEmail,
        password: hash,
        role: 'siswa',
        avatar: null
      });

      const newStudentId = store.students.length ? Math.max(...store.students.map(s => s.id)) + 1 : 1;
      const newStudent = {
        id: newStudentId,
        user_id: newUserId,
        nis,
        nisn: nisn || null,
        full_name,
        gender: gender || 'L',
        class_id: Number(class_id),
        major_id: Number(major_id),
        entry_year: Number(entry_year) || new Date().getFullYear(),
        phone: phone || null,
        address: address || null,
        qr_code_token: qrToken
      };
      store.students.push(newStudent);
      saveStore();
      return this.getStudentById(newStudentId);
    }
  }

  async updateStudent(id, { nis, nisn, full_name, gender, class_id, major_id, entry_year, phone, address }) {
    if (!isUsingFallback()) {
      await getPool().query(`
        UPDATE students SET 
          nis = ?, nisn = ?, full_name = ?, gender = ?, 
          class_id = ?, major_id = ?, entry_year = ?, phone = ?, address = ?
        WHERE id = ?
      `, [nis, nisn || null, full_name, gender, class_id, major_id, entry_year, phone, address, id]);
      return this.getStudentById(id);
    } else {
      const store = getStore();
      const s = store.students.find(st => st.id === Number(id));
      if (!s) return null;
      if (nis) s.nis = nis;
      if (nisn !== undefined) s.nisn = nisn;
      if (full_name) s.full_name = full_name;
      if (gender) s.gender = gender;
      if (class_id) s.class_id = Number(class_id);
      if (major_id) s.major_id = Number(major_id);
      if (entry_year) s.entry_year = Number(entry_year);
      if (phone !== undefined) s.phone = phone;
      if (address !== undefined) s.address = address;
      saveStore();
      return this.getStudentById(id);
    }
  }

  async deleteStudent(id) {
    if (!isUsingFallback()) {
      const [rows] = await getPool().query('SELECT user_id FROM students WHERE id = ?', [id]);
      const userId = rows[0]?.user_id;
      await getPool().query('DELETE FROM attendance WHERE student_id = ?', [id]);
      await getPool().query('DELETE FROM students WHERE id = ?', [id]);
      if (userId) {
        await getPool().query('DELETE FROM users WHERE id = ?', [userId]);
      }
      return true;
    } else {
      const store = getStore();
      const idx = store.students.findIndex(s => s.id === Number(id));
      if (idx === -1) return false;
      const userId = store.students[idx].user_id;
      store.students.splice(idx, 1);
      store.attendance = store.attendance.filter(a => a.student_id !== Number(id));
      if (userId) {
        store.users = store.users.filter(u => u.id !== userId);
      }
      saveStore();
      return true;
    }
  }

  // ==========================================
  // ATTENDANCE CORE (SISTEM ABSENSI)
  // ==========================================
  async getAttendanceByClassAndDate(class_id, date) {
    if (!isUsingFallback()) {
      const [rows] = await getPool().query(`
        SELECT 
          s.id as student_id, s.nis, s.full_name, s.gender, s.qr_code_token,
          a.id as attendance_id, a.date, a.time_in, a.status, a.notes, a.is_late, a.late_minutes
        FROM students s
        LEFT JOIN attendance a ON a.student_id = s.id AND a.date = ?
        WHERE s.class_id = ?
        ORDER BY s.full_name ASC
      `, [date, class_id]);
      return rows;
    } else {
      const store = getStore();
      const students = store.students.filter(s => s.class_id === Number(class_id));
      return students.map(s => {
        const att = store.attendance.find(a => a.student_id === s.id && a.date === date);
        return {
          student_id: s.id,
          nis: s.nis,
          full_name: s.full_name,
          gender: s.gender,
          qr_code_token: s.qr_code_token,
          attendance_id: att ? att.id : null,
          date: att ? att.date : date,
          time_in: att ? att.time_in : null,
          status: att ? att.status : null,
          notes: att ? att.notes : '',
          is_late: att ? att.is_late : 0,
          late_minutes: att ? att.late_minutes : 0
        };
      }).sort((a, b) => a.full_name.localeCompare(b.full_name));
    }
  }

  async saveBatchAttendance({ class_id, date, teacher_id = null, records = [] }) {
    if (!isUsingFallback()) {
      const conn = await getPool().getConnection();
      try {
        await conn.beginTransaction();
        for (const rec of records) {
          if (!rec.status) continue;
          const timeIn = rec.time_in || '07:00:00';
          const isLate = rec.is_late ? 1 : 0;
          const lateMinutes = rec.late_minutes || 0;
          const notes = rec.notes || null;

          await conn.query(`
            INSERT INTO attendance (student_id, class_id, teacher_id, date, time_in, status, notes, is_late, late_minutes)
            VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
            ON DUPLICATE KEY UPDATE 
              class_id = VALUES(class_id),
              teacher_id = VALUES(teacher_id),
              time_in = VALUES(time_in),
              status = VALUES(status),
              notes = VALUES(notes),
              is_late = VALUES(is_late),
              late_minutes = VALUES(late_minutes),
              updated_at = NOW()
          `, [rec.student_id, class_id, teacher_id, date, timeIn, rec.status, notes, isLate, lateMinutes]);
        }
        await conn.commit();
        return { success: true, count: records.length };
      } catch (err) {
        await conn.rollback();
        throw err;
      } finally {
        conn.release();
      }
    } else {
      const store = getStore();
      for (const rec of records) {
        if (!rec.status) continue;
        const existingIdx = store.attendance.findIndex(
          a => a.student_id === Number(rec.student_id) && a.date === date
        );

        const attRecord = {
          student_id: Number(rec.student_id),
          class_id: Number(class_id),
          teacher_id: teacher_id ? Number(teacher_id) : null,
          date,
          time_in: rec.time_in || '07:00:00',
          status: rec.status,
          notes: rec.notes || '',
          is_late: rec.is_late ? 1 : 0,
          late_minutes: Number(rec.late_minutes) || 0
        };

        if (existingIdx !== -1) {
          store.attendance[existingIdx] = {
            ...store.attendance[existingIdx],
            ...attRecord
          };
        } else {
          const newId = store.attendance.length ? Math.max(...store.attendance.map(a => a.id)) + 1 : 1;
          store.attendance.push({ id: newId, ...attRecord });
        }
      }
      saveStore();
      return { success: true, count: records.length };
    }
  }

  async recordQuickAttendance({ student_id, date, status = 'HADIR', time_in, notes = '', is_late = 0, late_minutes = 0 }) {
    const student = await this.getStudentById(student_id);
    if (!student) throw new Error('Siswa tidak ditemukan');

    if (!isUsingFallback()) {
      await getPool().query(`
        INSERT INTO attendance (student_id, class_id, date, time_in, status, notes, is_late, late_minutes)
        VALUES (?, ?, ?, ?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE 
          status = VALUES(status),
          time_in = VALUES(time_in),
          notes = VALUES(notes),
          is_late = VALUES(is_late),
          late_minutes = VALUES(late_minutes),
          updated_at = NOW()
      `, [student.id, student.class_id, date, time_in || '06:50:00', status, notes, is_late, late_minutes]);
      return { success: true, student };
    } else {
      const store = getStore();
      const existingIdx = store.attendance.findIndex(
        a => a.student_id === Number(student.id) && a.date === date
      );
      const record = {
        student_id: Number(student.id),
        class_id: Number(student.class_id),
        teacher_id: null,
        date,
        time_in: time_in || '06:50:00',
        status,
        notes,
        is_late: is_late ? 1 : 0,
        late_minutes: Number(late_minutes) || 0
      };

      if (existingIdx !== -1) {
        store.attendance[existingIdx] = { ...store.attendance[existingIdx], ...record };
      } else {
        const newId = store.attendance.length ? Math.max(...store.attendance.map(a => a.id)) + 1 : 1;
        store.attendance.push({ id: newId, ...record });
      }
      saveStore();
      return { success: true, student };
    }
  }

  async getAttendanceHistory({ date_from, date_to, class_id, student_id, status, limit = 100 } = {}) {
    if (!isUsingFallback()) {
      let sql = `
        SELECT a.*, s.nis, s.full_name as student_name, c.name as class_name, m.code as major_code, t.full_name as teacher_name
        FROM attendance a
        JOIN students s ON s.id = a.student_id
        JOIN classes c ON c.id = a.class_id
        JOIN majors m ON m.id = s.major_id
        LEFT JOIN teachers t ON t.id = a.teacher_id
        WHERE 1=1
      `;
      const params = [];
      if (date_from) { sql += ' AND a.date >= ?'; params.push(date_from); }
      if (date_to) { sql += ' AND a.date <= ?'; params.push(date_to); }
      if (class_id) { sql += ' AND a.class_id = ?'; params.push(class_id); }
      if (student_id) { sql += ' AND a.student_id = ?'; params.push(student_id); }
      if (status) { sql += ' AND a.status = ?'; params.push(status); }

      sql += ' ORDER BY a.date DESC, a.time_in DESC LIMIT ?';
      params.push(Number(limit));
      const [rows] = await getPool().query(sql, params);
      return rows;
    } else {
      const store = getStore();
      let list = store.attendance.map(a => {
        const student = store.students.find(s => s.id === a.student_id);
        const cls = store.classes.find(c => c.id === a.class_id);
        const major = student ? store.majors.find(m => m.id === student.major_id) : null;
        const teacher = store.teachers.find(t => t.id === a.teacher_id);
        return {
          ...a,
          nis: student ? student.nis : '-',
          student_name: student ? student.full_name : 'Unknown',
          class_name: cls ? cls.name : 'Unknown',
          major_code: major ? major.code : '-',
          teacher_name: teacher ? teacher.full_name : 'Sistem'
        };
      });

      if (date_from) list = list.filter(a => a.date >= date_from);
      if (date_to) list = list.filter(a => a.date <= date_to);
      if (class_id) list = list.filter(a => a.class_id === Number(class_id));
      if (student_id) list = list.filter(a => a.student_id === Number(student_id));
      if (status) list = list.filter(a => a.status === status);

      list.sort((a, b) => (b.date + b.time_in).localeCompare(a.date + a.time_in));
      return list.slice(0, Number(limit));
    }
  }

  // ==========================================
  // DASHBOARD STATS
  // ==========================================
  async getAdminDashboardStats(targetDate = null) {
    const today = targetDate || new Date().toISOString().split('T')[0];

    if (!isUsingFallback()) {
      const [[{ total_students }]] = await getPool().query('SELECT COUNT(*) as total_students FROM students');
      const [[{ total_teachers }]] = await getPool().query('SELECT COUNT(*) as total_teachers FROM teachers');
      const [[{ total_classes }]] = await getPool().query('SELECT COUNT(*) as total_classes FROM classes');

      const [todayAtt] = await getPool().query(`
        SELECT status, COUNT(*) as count 
        FROM attendance 
        WHERE date = ? 
        GROUP BY status
      `, [today]);

      const counts = { HADIR: 0, IZIN: 0, SAKIT: 0, ALPA: 0 };
      todayAtt.forEach(r => { counts[r.status] = Number(r.count); });

      const total_attendance_today = counts.HADIR + counts.IZIN + counts.SAKIT + counts.ALPA;
      const attendance_rate = total_students > 0 ? ((counts.HADIR / total_students) * 100).toFixed(1) : 0;

      // 7-day trend
      const [trendRows] = await getPool().query(`
        SELECT date, 
               SUM(CASE WHEN status = 'HADIR' THEN 1 ELSE 0 END) as hadir,
               SUM(CASE WHEN status = 'IZIN' THEN 1 ELSE 0 END) as izin,
               SUM(CASE WHEN status = 'SAKIT' THEN 1 ELSE 0 END) as sakit,
               SUM(CASE WHEN status = 'ALPA' THEN 1 ELSE 0 END) as alpa
        FROM attendance
        GROUP BY date
        ORDER BY date DESC
        LIMIT 7
      `);

      const [recentActivities] = await getPool().query(`
        SELECT a.id, a.date, a.time_in, a.status, a.notes, a.is_late, a.late_minutes,
               s.full_name as student_name, s.nis, c.name as class_name
        FROM attendance a
        JOIN students s ON s.id = a.student_id
        JOIN classes c ON c.id = a.class_id
        ORDER BY a.created_at DESC, a.id DESC
        LIMIT 10
      `);

      return {
        total_students: Number(total_students),
        total_teachers: Number(total_teachers),
        total_classes: Number(total_classes),
        today_date: today,
        total_attendance_today,
        hadir: counts.HADIR,
        izin: counts.IZIN,
        sakit: counts.SAKIT,
        alpa: counts.ALPA,
        attendance_rate: Number(attendance_rate),
        trend: trendRows.reverse(),
        recent_activities: recentActivities
      };
    } else {
      const store = getStore();
      const total_students = store.students.length;
      const total_teachers = store.teachers.length;
      const total_classes = store.classes.length;

      const todayRecords = store.attendance.filter(a => a.date === today);
      const counts = { HADIR: 0, IZIN: 0, SAKIT: 0, ALPA: 0 };
      todayRecords.forEach(r => { counts[r.status] = (counts[r.status] || 0) + 1; });

      const total_attendance_today = counts.HADIR + counts.IZIN + counts.SAKIT + counts.ALPA;
      const attendance_rate = total_students > 0 ? ((counts.HADIR / total_students) * 100).toFixed(1) : 0;

      // 7 distinct dates
      const allDates = [...new Set(store.attendance.map(a => a.date))].sort().reverse().slice(0, 7).reverse();
      const trend = allDates.map(d => {
        const dRecs = store.attendance.filter(a => a.date === d);
        return {
          date: d,
          hadir: dRecs.filter(a => a.status === 'HADIR').length,
          izin: dRecs.filter(a => a.status === 'IZIN').length,
          sakit: dRecs.filter(a => a.status === 'SAKIT').length,
          alpa: dRecs.filter(a => a.status === 'ALPA').length
        };
      });

      const recentActivities = [...store.attendance]
        .reverse()
        .slice(0, 10)
        .map(a => {
          const s = store.students.find(st => st.id === a.student_id);
          const c = store.classes.find(cl => cl.id === a.class_id);
          return {
            id: a.id,
            date: a.date,
            time_in: a.time_in,
            status: a.status,
            notes: a.notes,
            is_late: a.is_late,
            late_minutes: a.late_minutes,
            student_name: s ? s.full_name : 'Unknown',
            nis: s ? s.nis : '-',
            class_name: c ? c.name : 'Unknown'
          };
        });

      return {
        total_students,
        total_teachers,
        total_classes,
        today_date: today,
        total_attendance_today,
        hadir: counts.HADIR,
        izin: counts.IZIN,
        sakit: counts.SAKIT,
        alpa: counts.ALPA,
        attendance_rate: Number(attendance_rate),
        trend,
        recent_activities: recentActivities
      };
    }
  }

  async getTeacherDashboardStats(teacherId, targetDate = null) {
    const today = targetDate || new Date().toISOString().split('T')[0];
    const teacher = await this.getTeacherById(teacherId);
    if (!teacher) throw new Error('Data guru tidak ditemukan');

    const teacherClasses = teacher.classes || [];
    const classIds = teacherClasses.map(c => c.class_id);

    // Also include homeroom classes
    const classes = await this.getClasses();
    const myClasses = classes.filter(c => classIds.includes(c.id) || c.homeroom_teacher_id === Number(teacherId));
    const allMyClassIds = myClasses.map(c => c.id);

    const todayAttendance = await this.getAttendanceHistory({
      date_from: today,
      date_to: today
    });
    const myClassAttendance = todayAttendance.filter(a => allMyClassIds.includes(a.class_id));

    const counts = { HADIR: 0, IZIN: 0, SAKIT: 0, ALPA: 0 };
    myClassAttendance.forEach(a => { counts[a.status] = (counts[a.status] || 0) + 1; });

    const totalStudentsInClasses = myClasses.reduce((acc, c) => acc + (c.student_count || 0), 0);

    return {
      teacher,
      classes: myClasses,
      total_classes: myClasses.length,
      total_students: totalStudentsInClasses,
      today_date: today,
      today_stats: counts,
      recent_attendance: myClassAttendance.slice(0, 8)
    };
  }

  async getStudentDashboardStats(studentId) {
    const student = await this.getStudentById(studentId);
    if (!student) throw new Error('Data siswa tidak ditemukan');

    const today = new Date().toISOString().split('T')[0];
    const history = await this.getAttendanceHistory({ student_id: studentId, limit: 180 });
    const todayAttendance = history.find(a => a.date === today) || null;

    const counts = { HADIR: 0, IZIN: 0, SAKIT: 0, ALPA: 0 };
    let totalLateMinutes = 0;
    history.forEach(a => {
      counts[a.status] = (counts[a.status] || 0) + 1;
      if (a.is_late) totalLateMinutes += (a.late_minutes || 0);
    });

    const totalDays = history.length;
    const attendancePercentage = totalDays > 0 ? ((counts.HADIR / totalDays) * 100).toFixed(1) : 100;

    return {
      student,
      today_status: todayAttendance ? todayAttendance.status : 'BELUM ABSEN',
      today_attendance: todayAttendance,
      total_days: totalDays,
      hadir: counts.HADIR,
      izin: counts.IZIN,
      sakit: counts.SAKIT,
      alpa: counts.ALPA,
      late_minutes: totalLateMinutes,
      percentage: Number(attendancePercentage),
      history: history.slice(0, 30)
    };
  }

  // ==========================================
  // RECAP & REPORTING
  // ==========================================
  async getRecapReport({ period = 'monthly', class_id = null, student_id = null, date_from = null, date_to = null } = {}) {
    const now = new Date();
    let startDate = date_from;
    let endDate = date_to || now.toISOString().split('T')[0];

    if (!startDate) {
      if (period === 'daily') {
        startDate = endDate;
      } else if (period === 'weekly') {
        const d = new Date(now);
        d.setDate(d.getDate() - 7);
        startDate = d.toISOString().split('T')[0];
      } else if (period === 'monthly') {
        const d = new Date(now);
        d.setMonth(d.getMonth() - 1);
        startDate = d.toISOString().split('T')[0];
      } else if (period === 'semester') {
        const d = new Date(now);
        d.setMonth(d.getMonth() - 6);
        startDate = d.toISOString().split('T')[0];
      }
    }

    const records = await this.getAttendanceHistory({
      date_from: startDate,
      date_to: endDate,
      class_id,
      student_id,
      limit: 1000
    });

    const summary = { HADIR: 0, IZIN: 0, SAKIT: 0, ALPA: 0, TOTAL: records.length, LATE_COUNT: 0 };
    records.forEach(r => {
      if (summary[r.status] !== undefined) summary[r.status]++;
      if (r.is_late) summary.LATE_COUNT++;
    });

    // Student summary grouping
    const studentMap = {};
    records.forEach(r => {
      if (!studentMap[r.student_id]) {
        studentMap[r.student_id] = {
          student_id: r.student_id,
          nis: r.nis,
          student_name: r.student_name,
          class_name: r.class_name,
          hadir: 0,
          izin: 0,
          sakit: 0,
          alpa: 0,
          late: 0,
          total: 0
        };
      }
      studentMap[r.student_id].total++;
      if (r.status === 'HADIR') studentMap[r.student_id].hadir++;
      if (r.status === 'IZIN') studentMap[r.student_id].izin++;
      if (r.status === 'SAKIT') studentMap[r.student_id].sakit++;
      if (r.status === 'ALPA') studentMap[r.student_id].alpa++;
      if (r.is_late) studentMap[r.student_id].late++;
    });

    const studentBreakdown = Object.values(studentMap).map(s => ({
      ...s,
      percentage: s.total > 0 ? ((s.hadir / s.total) * 100).toFixed(1) : 0
    }));

    return {
      period,
      date_from: startDate,
      date_to: endDate,
      summary,
      student_breakdown: studentBreakdown,
      records
    };
  }

  // ==========================================
  // MAJORS & ACADEMIC YEARS
  // ==========================================
  async getMajors() {
    if (!isUsingFallback()) {
      const [rows] = await getPool().query('SELECT * FROM majors ORDER BY name ASC');
      return rows;
    } else {
      return getStore().majors;
    }
  }

  async getAcademicYears() {
    if (!isUsingFallback()) {
      const [rows] = await getPool().query('SELECT * FROM academic_years ORDER BY id DESC');
      return rows;
    } else {
      return getStore().academic_years;
    }
  }
}

module.exports = new DbService();
