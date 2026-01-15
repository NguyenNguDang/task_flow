# Task Flow (TinyJira) - Project Management Tool

Task Flow là một ứng dụng quản lý dự án theo mô hình Agile/Scrum, được xây dựng với Spring Boot (Backend) và React (Frontend).

## 🚀 Tính năng chính

*   **Quản lý Dự án & Board:** Tạo dự án, tạo bảng Kanban/Scrum.
*   **Backlog & Sprint:** Quản lý Backlog, tạo Sprint, Start/Complete Sprint.
*   **Task Management:** Tạo, sửa, xóa, kéo thả task giữa các cột.
*   **Chi tiết Task:**
    *   Gán thành viên (Assignee).
    *   Đặt độ ưu tiên (Priority), Story Points.
    *   Subtasks (Checklist).
    *   Comments & Attachments.
*   **Báo cáo:**
    *   Sprint Report (MVP, Overdue tasks).
    *   Burndown Chart.
    *   Project Dashboard (Thống kê tổng quan).
*   **Authentication:** Đăng ký, Đăng nhập (JWT), Logout.

---

## 🛠️ Yêu cầu hệ thống

*   **Java:** JDK 17 trở lên.
*   **Node.js:** v18 trở lên.
*   **Database:** MySQL 8.0.
*   **Build Tool:** Maven (cho Backend).
*   **Package Manager:** npm hoặc yarn (cho Frontend).

---

## ⚙️ Cài đặt & Chạy dự án

### 1. Backend (Spring Boot)

**Bước 1: Cấu hình Database và Redis** 
1.  Tạo database MySQL tên là `task_flow` và import data mẫu `data.sql`
2.  Mở file `api/kanban/.env.example` đổi tên thành `.env` và điền thông tin cấu hình
3.  Cập nhật thông tin kết nối:
    ```properties
    spring.datasource.url=jdbc:mysql://localhost:3306/task_flow
    spring.datasource.username=root
    spring.datasource.password=your_password
    ```
4. Cài đặt Redis: `docker run -d -p 6380:6379 --name redis redis` 
5. Run redis (Docker Desktop)

**Bước 2: Chạy Backend**
1.  Mở terminal tại thư mục `api/kanban`.
2.  Chạy lệnh Maven để tải thư viện và chạy:
    ```bash
    mvn spring-boot:run
    ```
    *Hoặc mở project bằng IntelliJ IDEA và chạy file `KanbanApplication.java`.*

Backend sẽ chạy tại: `http://localhost:8080`

---

### 2. Frontend (React + Vite)

**Bước 1: Cài đặt thư viện**
1.  Mở terminal tại thư mục `client`.
2.  Chạy lệnh:
    ```bash
    npm install
    # hoặc
    yarn install
    ```

**Bước 2: Cấu hình môi trường (Optional)**
*   Mặc định Frontend kết nối đến `http://localhost:8080`.
*   Nếu cần đổi, chỉnh sửa file `client/src/Constants/index.tsx` hoặc `.env`.

**Bước 3: Chạy Frontend**
1.  Chạy lệnh:
    ```bash
    npm run dev
    # hoặc
    yarn dev
    ```

Frontend sẽ chạy tại: `http://localhost:5173`

