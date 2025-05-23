# **Yêu cầu phần mềm hệ thống quản lý tuyển sinh**

Hệ thống gồm **hai loại tài khoản**:

1. **Phụ huynh**
2. **Người quản lý**

---

### **1. Chức năng dành cho Phụ huynh**

Sau khi đăng nhập, phụ huynh có thể thực hiện các chức năng sau:

- **Điền phiếu đăng ký dự tuyển**
    
    Nhập đầy đủ thông tin cá nhân và thông tin học sinh.
    
- **Tải lên học bạ (dạng PDF)**
    
    Hệ thống sẽ trích xuất các thông tin từ học bạ bao gồm:
    
    - Điểm học tập
    - Nhận xét/đánh giá rèn luyện
- **Tải lên các chứng chỉ, giấy khen (nếu có)**
    
    Các file sẽ được lưu cùng hồ sơ.
    
- **Xem lại thông tin đã cung cấp**
    Giao diện hiển thị:
    
    - Thông tin đã điền từ phiếu đăng ký
    - Thông tin đã trích xuất từ file PDF học bạ
    - Tình trạng hồ sơ:
        - **Đủ điều kiện** hoặc **Không đủ điều kiện**
        - Nếu **không đủ điều kiện**, hiển thị lý do cụ thể
- Có thể thông báo scan không chính xác, đưa hồ sơ vào trạng thái chờ xử lí
- **Nhận thông báo qua email:**
    
    Nếu hồ sơ **đủ điều kiện**, phụ huynh sẽ nhận được **email mời nộp hồ sơ trực tiếp** tại trường (nội dung chi tiết email sẽ được xác định sau).
    

---

### **2. Chức năng dành cho Người Quản Lý**

Sau khi đăng nhập, người quản lý có các chức năng sau:

- **Lên lịch nộp hồ sơ trực tiếp**
    - Tạo và quản lý các khung thời gian nộp hồ sơ
    - Gửi thông báo lịch đến phụ huynh đủ điều kiện
- **Quản lý danh sách học sinh đăng ký**
    - Xem danh sách toàn bộ học sinh đã nộp hồ sơ trực tuyến
    - Tra cứu học sinh theo **tên**, **mã ID**, hoặc sử dụng **bộ lọc nâng cao**
- **Xem chi tiết từng hồ sơ học sinh**
    - Thông tin từ phiếu đăng ký
    - Kết quả trích xuất học bạ và chứng chỉ
    - Trạng thái xét duyệt
    - Có thể xét duyệt các hồ sơ đang chờ xử lí sai xót
- **Xác nhận hồ sơ tại vòng nộp trực tiếp**
    - Sau khi xác thực thông tin học sinh là chính xác, người quản lý **chọn “Đạt”**
    - Hệ thống sẽ tự động gửi email thông báo đến phụ huynh, bao gồm:
        - Số báo danh (SBD)
        - Phòng thi
        - Các thông tin liên quan đến kỳ thi tuyển sinh