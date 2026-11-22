-- ============================================================
-- HADIRKU - SISTEM ABSENSI DIGITAL SEKOLAH (SMK KARTIKA X-1)
-- Database Schema & Master Data Seeds
-- ============================================================

CREATE DATABASE IF NOT EXISTS hadirku_db CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;
USE hadirku_db;

SET FOREIGN_KEY_CHECKS = 0;
DROP TABLE IF EXISTS attendance;
DROP TABLE IF EXISTS teacher_classes;
DROP TABLE IF EXISTS students;
DROP TABLE IF EXISTS classes;
DROP TABLE IF EXISTS teachers;
DROP TABLE IF EXISTS majors;
DROP TABLE IF EXISTS academic_years;
DROP TABLE IF EXISTS users;
SET FOREIGN_KEY_CHECKS = 1;

-- 1. USERS TABLE
CREATE TABLE users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    username VARCHAR(50) NOT NULL UNIQUE,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    role ENUM('admin', 'guru', 'siswa') NOT NULL,
    avatar VARCHAR(255) DEFAULT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    INDEX idx_user_role (role),
    INDEX idx_user_username (username),
    INDEX idx_user_email (email)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 2. ACADEMIC YEARS TABLE
CREATE TABLE academic_years (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    semester ENUM('Ganjil', 'Genap') NOT NULL,
    is_active BOOLEAN NOT NULL DEFAULT FALSE,
    start_date DATE NOT NULL,
    end_date DATE NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 3. MAJORS TABLE (JURUSAN)
CREATE TABLE majors (
    id INT AUTO_INCREMENT PRIMARY KEY,
    code VARCHAR(20) NOT NULL UNIQUE,
    name VARCHAR(100) NOT NULL,
    description TEXT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 4. TEACHERS TABLE (GURU)
CREATE TABLE teachers (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL UNIQUE,
    nip VARCHAR(30) NOT NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL,
    phone VARCHAR(25) NULL,
    gender ENUM('L', 'P') NOT NULL DEFAULT 'L',
    subject VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_teachers_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    INDEX idx_teachers_nip (nip)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 5. CLASSES TABLE (KELAS)
CREATE TABLE classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(50) NOT NULL,
    grade INT NOT NULL DEFAULT 10,
    major_id INT NOT NULL,
    academic_year_id INT NOT NULL,
    homeroom_teacher_id INT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_classes_major FOREIGN KEY (major_id) REFERENCES majors(id) ON DELETE RESTRICT,
    CONSTRAINT fk_classes_academic_year FOREIGN KEY (academic_year_id) REFERENCES academic_years(id) ON DELETE RESTRICT,
    CONSTRAINT fk_classes_homeroom FOREIGN KEY (homeroom_teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
    INDEX idx_classes_name (name)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 6. TEACHER CLASSES ASSIGNMENT
CREATE TABLE teacher_classes (
    id INT AUTO_INCREMENT PRIMARY KEY,
    teacher_id INT NOT NULL,
    class_id INT NOT NULL,
    subject VARCHAR(100) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT fk_tc_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE CASCADE,
    CONSTRAINT fk_tc_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    UNIQUE KEY unique_teacher_class (teacher_id, class_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 7. STUDENTS TABLE (SISWA)
CREATE TABLE students (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NULL UNIQUE,
    nis VARCHAR(30) NOT NULL UNIQUE,
    nisn VARCHAR(30) NULL UNIQUE,
    full_name VARCHAR(100) NOT NULL,
    gender ENUM('L', 'P') NOT NULL DEFAULT 'L',
    class_id INT NOT NULL,
    major_id INT NOT NULL,
    entry_year INT NOT NULL DEFAULT 2023,
    phone VARCHAR(25) NULL,
    address TEXT NULL,
    qr_code_token VARCHAR(100) NOT NULL UNIQUE,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_students_user FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE SET NULL,
    CONSTRAINT fk_students_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE RESTRICT,
    CONSTRAINT fk_students_major FOREIGN KEY (major_id) REFERENCES majors(id) ON DELETE RESTRICT,
    INDEX idx_students_nis (nis),
    INDEX idx_students_class (class_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- 8. ATTENDANCE TABLE (SISTEM ABSENSI)
CREATE TABLE attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    student_id INT NOT NULL,
    class_id INT NOT NULL,
    teacher_id INT NULL,
    date DATE NOT NULL,
    time_in TIME NOT NULL DEFAULT '07:00:00',
    status ENUM('HADIR', 'IZIN', 'SAKIT', 'ALPA') NOT NULL DEFAULT 'HADIR',
    notes VARCHAR(255) NULL,
    is_late BOOLEAN NOT NULL DEFAULT FALSE,
    late_minutes INT NOT NULL DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    CONSTRAINT fk_att_student FOREIGN KEY (student_id) REFERENCES students(id) ON DELETE CASCADE,
    CONSTRAINT fk_att_class FOREIGN KEY (class_id) REFERENCES classes(id) ON DELETE CASCADE,
    CONSTRAINT fk_att_teacher FOREIGN KEY (teacher_id) REFERENCES teachers(id) ON DELETE SET NULL,
    UNIQUE KEY unique_student_attendance_per_date (student_id, date),
    INDEX idx_att_date (date),
    INDEX idx_att_class (class_id),
    INDEX idx_att_status (status)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_unicode_ci;

-- ============================================================
-- DEMO DATA SEEDS (Password: 'password123' for all accounts)
-- Bcrypt: $2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46
-- ============================================================

-- A. USERS
INSERT INTO users (id, username, email, password, role) VALUES
(1, 'admin', 'admin@hadirku.sch.id', '$2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46', 'admin'),
(2, 'guru_budi', 'budi@hadirku.sch.id', '$2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46', 'guru'),
(3, 'guru_siti', 'siti@hadirku.sch.id', '$2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46', 'guru'),
(4, 'guru_eko', 'eko@hadirku.sch.id', '$2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46', 'guru'),
(5, '20240101', 'ahmad@hadirku.sch.id', '$2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46', 'siswa'),
(6, '20240102', 'siti.n@hadirku.sch.id', '$2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46', 'siswa'),
(7, '20240103', 'rizky@hadirku.sch.id', '$2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46', 'siswa'),
(8, '20240104', 'dewi@hadirku.sch.id', '$2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46', 'siswa'),
(9, '20240105', 'farhan@hadirku.sch.id', '$2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46', 'siswa'),
(10, '20240106', 'bayu@hadirku.sch.id', '$2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46', 'siswa'),
(11, '20240107', 'dinda@hadirku.sch.id', '$2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46', 'siswa'),
(12, '20240108', 'aditya@hadirku.sch.id', '$2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46', 'siswa'),
(13, '20240109', 'nabila@hadirku.sch.id', '$2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46', 'siswa'),
(14, '20240110', 'fajar@hadirku.sch.id', '$2a$10$Zih5WjmzPWtr2oKXqOlQPeefoWrWUEqTscY51hQHG0g.PTND/sx46', 'siswa');

-- B. ACADEMIC YEARS
INSERT INTO academic_years (id, name, semester, is_active, start_date, end_date) VALUES
(1, '2024/2025 Ganjil', 'Ganjil', 1, '2024-07-15', '2024-12-20'),
(2, '2024/2025 Genap', 'Genap', 0, '2025-01-06', '2025-06-20');

-- C. MAJORS
INSERT INTO majors (id, code, name, description) VALUES
(1, 'TKJ', 'Teknik Komputer dan Jaringan', 'Konsentrasi keahlian perakitan komputer, instalasi jaringan kabel & nirkabel, administrasi server Linux/Windows, mikrotik, dan cyber security dasar.'),
(2, 'RPL', 'Rekayasa Perangkat Lunak', 'Konsentrasi keahlian pemrograman web, mobile, database, dan software engineering.'),
(3, 'DKV', 'Desain Komunikasi Visual', 'Konsentrasi keahlian grafis digital, animasi, videografi, dan multimedia.');

-- D. TEACHERS
INSERT INTO teachers (id, user_id, nip, full_name, email, phone, gender, subject) VALUES
(1, 2, '198504122010011003', 'Budi Santoso, S.Kom', 'budi@hadirku.sch.id', '081234567890', 'L', 'Administrasi Infrastruktur Jaringan (AIJ)'),
(2, 3, '198902152014022005', 'Siti Rahmawati, S.Pd', 'siti@hadirku.sch.id', '081298765432', 'P', 'Administrasi Sistem Jaringan (ASJ)'),
(3, 4, '197908202008011002', 'Eko Prasetyo, M.T', 'eko@hadirku.sch.id', '081377889900', 'L', 'Teknologi Layanan Jaringan (TLJ)');

-- E. CLASSES
INSERT INTO classes (id, name, grade, major_id, academic_year_id, homeroom_teacher_id) VALUES
(1, 'XII TKJ 1', 12, 1, 1, 1),
(2, 'XII TKJ 2', 12, 1, 1, 3),
(3, 'XI TKJ 1', 11, 1, 1, 2),
(4, 'X TKJ 1', 10, 1, 1, NULL),
(5, 'XII RPL 1', 12, 2, 1, NULL);

-- F. TEACHER CLASSES
INSERT INTO teacher_classes (teacher_id, class_id, subject) VALUES
(1, 1, 'Administrasi Infrastruktur Jaringan'),
(1, 2, 'Administrasi Infrastruktur Jaringan'),
(2, 1, 'Administrasi Sistem Jaringan'),
(2, 3, 'Administrasi Sistem Jaringan'),
(3, 2, 'Teknologi Layanan Jaringan'),
(3, 3, 'Teknologi Layanan Jaringan');

-- G. STUDENTS
INSERT INTO students (id, user_id, nis, nisn, full_name, gender, class_id, major_id, entry_year, phone, address, qr_code_token) VALUES
(1, 5, '20240101', '0061234567', 'Ahmad Fauzi', 'L', 1, 1, 2022, '085200000001', 'Jl. Merdeka No. 12, Jakarta', 'QR-20240101-AHMAD'),
(2, 6, '20240102', '0061234568', 'Siti Nurhaliza', 'P', 1, 1, 2022, '085200000002', 'Jl. Melati Indah No. 4, Jakarta', 'QR-20240102-SITI'),
(3, 7, '20240103', '0061234569', 'Rizky Ramadhan', 'L', 1, 1, 2022, '085200000003', 'Jl. Anggrek No. 8, Jakarta', 'QR-20240103-RIZKY'),
(4, 8, '20240104', '0061234570', 'Dewi Anggraini', 'P', 1, 1, 2022, '085200000004', 'Jl. Mawar No. 15, Jakarta', 'QR-20240104-DEWI'),
(5, 9, '20240105', '0061234571', 'Muhammad Farhan', 'L', 1, 1, 2022, '085200000005', 'Jl. Flamboyan No. 22, Jakarta', 'QR-20240105-FARHAN'),
(6, 10, '20240106', '0061234572', 'Bayu Saputra', 'L', 2, 1, 2022, '085200000006', 'Jl. Kenanga No. 7, Jakarta', 'QR-20240106-BAYU'),
(7, 11, '20240107', '0061234573', 'Dinda Putri', 'P', 2, 1, 2022, '085200000007', 'Jl. Cendana No. 9, Jakarta', 'QR-20240107-DINDA'),
(8, 12, '20240108', '0071234574', 'Aditya Pratama', 'L', 3, 1, 2023, '085200000008', 'Jl. Dahlia No. 19, Jakarta', 'QR-20240108-ADITYA'),
(9, 13, '20240109', '0071234575', 'Nabila Syahira', 'P', 3, 1, 2023, '085200000009', 'Jl. Cempaka No. 3, Jakarta', 'QR-20240109-NABILA'),
(10, 14, '20240110', '0081234576', 'Fajar Ramadhan', 'L', 4, 1, 2024, '085200000010', 'Jl. Kebon Sirih No. 1, Jakarta', 'QR-20240110-FAJAR');

-- H. ATTENDANCE (Data Kosong - Siap Untuk Absensi Real-Time Harian)
-- Data absensi dikosongkan agar sistem siap digunakan secara nyata.
-- Catatan absensi akan terisi otomatis saat guru menginput atau siswa scan QR code.
