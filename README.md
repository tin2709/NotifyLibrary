# notify2t (formerly toast-noti)

A versatile UI library for Notifications, Modals, and Alerts.

## Install

``` console
npm i notify2t

Tuyệt vời! Dưới đây là nội dung `README.md` ngắn gọn, đầy đủ, và tập trung vào trải nghiệm của người dùng khi sử dụng thư viện `notify2t` của bạn, viết bằng tiếng Việt.

---

### **File: `README.md`**

```markdown
# notify2t

Một thư viện UI đa năng dành cho Thông báo (Notifications), Hộp thoại (Modals) và Cảnh báo (Alerts), lấy cảm hứng từ Ant Design với giao diện độc đáo và hiện đại.

## Cài đặt

Để thêm `notify2t` vào dự án của bạn, sử dụng npm hoặc Yarn:

```bash
npm install notify2t
# hoặc
yarn add notify2t
```

## Cách sử dụng

Đầu tiên, hãy import lớp `UINotifier` và stylesheet cốt lõi của nó vào file JavaScript/TypeScript của bạn:

```js
import UINotifier from 'notify2t';
import 'notify2t/dist/ui.style.css'; // Rất quan trọng để có giao diện mặc định
```

Sau đó, tạo một instance của `UINotifier`. Bạn có thể truyền các tùy chọn cấu hình chung khi khởi tạo:

```js
const notifier = new UINotifier({
    notification: {
        duration: 4000,          // Thời gian hiển thị mặc định của thông báo (ms)
        position: 'top-right',   // Vị trí: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right'
        pauseOnHover: true,      // Tạm dừng tự động đóng khi di chuột qua
        appendOnTopBody: true,   // Tự động thêm vùng chứa thông báo vào <body>
        showProgressBar: true,   // Hiển thị thanh tiến trình cho thông báo
        // sound: '/duong/dan/den/am-thanh-thong-bao-mac-dinh.mp3' // Tùy chọn: đường dẫn file âm thanh mặc định
    }
    // Không cần cấu hình cho modal hoặc alert nếu muốn dùng mặc định
});
```

---

### **Notifications (Thông báo/Toast)**

Hiển thị các tin nhắn ngắn gọn, tự động đóng sau một khoảng thời gian nhất định.

```js
// Cách dùng cơ bản: tiêu đề và nội dung
notifier.notification.success('Hoàn thành', 'Yêu cầu của bạn đã được xử lý thành công.');
notifier.notification.error('Lỗi Hệ thống', 'Không thể kết nối đến máy chủ. Vui lòng kiểm tra kết nối mạng.');
notifier.notification.warning('Hết hàng', 'Sản phẩm bạn chọn hiện không có sẵn.');
notifier.notification.info('Có bản cập nhật mới', 'Phiên bản 2.0.1 đã sẵn sàng để tải xuống.');

// Chỉ dùng nội dung (tiêu đề sẽ được đặt mặc định theo loại)
notifier.notification.success('Các thay đổi của bạn đã được lưu.');
notifier.notification.error('Gửi biểu mẫu thất bại.');

// Ghi đè các tùy chọn cho một thông báo cụ thể
notifier.notification.info('Lời nhắc quan trọng', 'Hãy nhớ tham dự cuộc họp vào ngày mai.', {
    duration: 8000,          // Thông báo này hiển thị lâu hơn
    showProgressBar: false,  // Không hiển thị thanh tiến trình
    // sound: '/duong/dan/den/am-thanh-tuy-chinh.mp3'
});
```

---

### **Modals (Hộp thoại)**

Hiển thị các hộp thoại tương tác để xác nhận, nhập liệu hoặc hiển thị thông tin chi tiết. Modals trả về một Promise sẽ được giải quyết khi nhấn "OK" hoặc bị từ chối khi nhấn "Hủy"/"Đóng".

```js
// Hộp thoại xác nhận đơn giản
notifier.modal.show({
    title: 'Xác nhận Hành động',
    content: 'Bạn có chắc chắn muốn tiếp tục không? Hành động này không thể hoàn tác.',
    okText: 'Xác nhận',
    cancelText: 'Hủy bỏ',
    closable: true,      // Hiển thị nút đóng 'x' (mặc định: true)
    maskClosable: true,  // Đóng khi click ra ngoài hộp thoại (mặc định: true)
    // sound: '/duong/dan/den/am-thanh-mo-modal.mp3' // Tùy chọn: âm thanh khi mở modal
}).then(() => {
    notifier.notification.success('Hành động đã được xác nhận!', 'Bạn đã chọn tiếp tục.');
}).catch(() => {
    notifier.notification.info('Hành động đã bị hủy.', 'Bạn đã quyết định không tiếp tục.');
});

// Hộp thoại với phần chân tùy chỉnh (thay thế nút OK/Hủy mặc định)
notifier.modal.show({
    title: 'Ví dụ Chân Hộp thoại Tùy chỉnh',
    content: 'Hộp thoại này có các nút tùy chỉnh ở phần chân. Các nút OK/Hủy mặc định sẽ bị thay thế.',
    footer: [
        '<button class="modal-cancel-btn">Đóng Hộp thoại</button>', // Sử dụng 'modal-cancel-btn' để có hành vi đóng tích hợp
        '<button id="customModalBtn" style="background-color: #6200EE; color: white;">Nhấn vào tôi</button>' // Nút tùy chỉnh
    ]
}).then(modalElement => {
    // Gắn lắng nghe sự kiện cho nút tùy chỉnh sau khi modal được hiển thị
    modalElement.querySelector('#customModalBtn')?.addEventListener('click', () => {
        alert('Nút tùy chỉnh đã được nhấn!');
        notifier.modal.hide(); // Ẩn hộp thoại thủ công sau hành động tùy chỉnh
    });
}).catch(() => {
    console.log('Hộp thoại đã đóng.');
});
```

---

### **Alerts (Cảnh báo Inline)**

Hiển thị các tin nhắn không gây gián đoạn, có thể đóng được và được nhúng trực tiếp vào giao diện người dùng của bạn. Alerts trả về một `HTMLElement` mà bạn cần tự thêm vào DOM.

```js
// Tạo và thêm một cảnh báo thành công
const successAlert = notifier.alert.create({
    type: 'success',         // Loại: 'success' | 'error' | 'warning' | 'info'
    title: 'Dữ liệu đã lưu',
    message: 'Thông tin hồ sơ của bạn đã được cập nhật thành công.',
    showIcon: true,          // Hiển thị biểu tượng (mặc định: true)
    closable: true,          // Hiển thị nút đóng (mặc định: true)
    expandable: true,        // Cho phép mở rộng/thu gọn tin nhắn nếu dài
    // sound: '/duong/dan/den/am-thanh-hien-thi-alert.mp3' // Tùy chọn: âm thanh khi alert hiển thị
});
document.getElementById('vung-chua-alert-cua-ban')?.appendChild(successAlert);

// Tạo một cảnh báo lỗi không có biểu tượng và không thể đóng
const criticalErrorAlert = notifier.alert.create({
    type: 'error',
    title: 'Dịch vụ ngoại tuyến',
    message: 'Dịch vụ chính của chúng tôi hiện không khả dụng. Vui lòng thử lại sau. Đây là một tin nhắn lỗi rất dài để kiểm tra tính năng mở rộng. Ban đầu nó chỉ nên hiển thị hai dòng, sau đó mở rộng khi bạn nhấp vào "Xem thêm".',
    showIcon: false,         // Ẩn biểu tượng
    closable: false          // Ẩn nút đóng
});
document.getElementById('mot-vung-chua-alert-khac')?.appendChild(criticalErrorAlert);

// Để xóa một cảnh báo thủ công (ví dụ: sau một hành động cụ thể)
// successAlert.remove();
```