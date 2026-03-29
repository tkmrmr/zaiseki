SET FOREIGN_KEY_CHECKS=0;

DROP TABLE IF EXISTS presence_status;
DROP TABLE IF EXISTS seats;
DROP TABLE IF EXISTS students;

CREATE TABLE students (
  student_id INT NOT NULL AUTO_INCREMENT,
  name VARCHAR(100) NOT NULL,
  grade ENUM('B4','M1','M2','D1','D2','D3') NOT NULL,
  PRIMARY KEY (student_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE seats (
  seat_id INT NOT NULL AUTO_INCREMENT,
  seat_number VARCHAR(20) NOT NULL,
  PRIMARY KEY (seat_id),
  UNIQUE KEY uq_seat_number (seat_number)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

CREATE TABLE presence_status (
  student_id INT NOT NULL,
  seat_id INT DEFAULT NULL,
  status ENUM('present','absent') NOT NULL DEFAULT 'absent',
  updated_at DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
  PRIMARY KEY (student_id),
  UNIQUE KEY uq_presence_status_seat_id (seat_id),
  CONSTRAINT fk_presence_status_student
    FOREIGN KEY (student_id) REFERENCES students (student_id),
  CONSTRAINT fk_presence_status_seat
    FOREIGN KEY (seat_id) REFERENCES seats (seat_id)
) ENGINE=InnoDB DEFAULT CHARSET=utf8mb4 COLLATE=utf8mb4_general_ci;

SET FOREIGN_KEY_CHECKS=1;