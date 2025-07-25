import UINotifier from '../dist/ui.js';

// Cấu hình UINotifier với các tùy chọn chung
const notifier = new UINotifier({
    notification: {
        duration: 4000,
        position: 'top-right',
        pauseOnHover: true,
        appendOnTopBody: true,
        showProgressBar: true, // Mặc định hiển thị progress bar
        // sound: '/path/to/your-notification-sound.mp3' // Thêm đường dẫn file âm thanh nếu có
    }
});

// --- Notification Events ---
document.getElementById('notiSuccess')?.addEventListener('click', () => {
    notifier.notification.success('Operation Successful', 'Your request has been processed without any issues.');
});

document.getElementById('notiError')?.addEventListener('click', () => {
    notifier.notification.error('System Error', 'Could not connect to the server. Please check your internet connection.');
});

document.getElementById('notiWarning')?.addEventListener('click', () => {
    notifier.notification.warning('Out of Stock', 'The item you selected is currently unavailable. Please choose another one.');
});

document.getElementById('notiInfo')?.addEventListener('click', () => {
    notifier.notification.info('New Update Available', 'Version 2.0.1 is now ready for download. Click to install and enjoy new features!');
});

document.getElementById('notiNoTitle')?.addEventListener('click', () => {
    notifier.notification.info('This notification has no explicit title, so the first argument becomes the message. It still looks unique!');
});

document.getElementById('notiNoProgressBar')?.addEventListener('click', () => {
    notifier.notification.success('No Progress Bar', 'This notification will close after its duration without showing a progress bar.', { showProgressBar: false });
});


// --- Modal Events ---
document.getElementById('modalSimple')?.addEventListener('click', () => {
    notifier.modal.show({
        title: 'Confirm Deletion',
        content: 'Are you sure you want to delete this item? This action cannot be undone. This is a crucial decision.',
        okText: 'Delete Now',
        cancelText: 'Cancel',
        closable: true,
        maskClosable: true,
        // sound: '/path/to/your-modal-open-sound.mp3' // Thêm đường dẫn file âm thanh nếu có
    }).then(() => {
        notifier.notification.success('Modal Action', 'Item deleted!');
    }).catch(() => {
        notifier.notification.info('Modal Action', 'Deletion cancelled.');
    });
});

document.getElementById('modalCustomFooter')?.addEventListener('click', () => {
    const customContent = document.createElement('p');
    customContent.innerHTML = 'This modal demonstrates a <strong>custom footer</strong>. You can insert any HTML or element here. The default OK/Cancel buttons are replaced.';

    notifier.modal.show({
        title: 'Unique Modal Actions',
        content: customContent,
        footer: [
            '<button class="modal-cancel-btn">Close This</button>',
            '<button id="specialBtn" style="background-color: #8A2BE2; color: white; border: none; padding: 6.4px 15px; border-radius: 4px; cursor: pointer;">My Special Button</button>'
        ]
    }).then(modalEl => {
        modalEl.querySelector('#specialBtn')?.addEventListener('click', () => {
            alert('Special button clicked inside modal!');
            notifier.modal.hide();
        });
    }).catch(() => {
        console.log('Modal closed via custom footer buttons or backdrop.');
    });
});

document.getElementById('modalNoClosable')?.addEventListener('click', () => {
    notifier.modal.show({
        title: 'Action Required!',
        content: 'You must make a choice here. There is no "X" button to close this modal.',
        closable: false
    }).then(() => notifier.notification.success('Modal Closed', 'OK clicked.')).catch(() => notifier.notification.info('Modal Closed', 'Cancelled.'));
});

document.getElementById('modalNoMask')?.addEventListener('click', () => {
    notifier.modal.show({
        title: 'Sticky Modal',
        content: 'You cannot click outside this modal to close it. This ensures user attention.',
        maskClosable: false
    }).then(() => notifier.notification.success('Modal Closed', 'OK clicked.')).catch(() => notifier.notification.info('Modal Closed', 'Cancelled.'));
});


// --- Alert Events ---
const alertContainer1 = document.getElementById('alertContainer1');
const alertContainer2 = document.getElementById('alertContainer2');

document.getElementById('alertSuccess')?.addEventListener('click', () => {
    const alertElement = notifier.alert.create({
        type: 'success',
        title: 'Data Synced',
        message: 'All your changes have been successfully synchronized with the cloud server.',
        showIcon: true,
        closable: true,
        // sound: '/path/to/your-alert-sound.mp3' // Thêm đường dẫn file âm thanh nếu có
    });
    alertContainer1?.appendChild(alertElement);
});

document.getElementById('alertError')?.addEventListener('click', () => {
    const alertElement = notifier.alert.create({
        type: 'error',
        title: 'Connection Lost',
        message: 'Could not establish a connection to the database. Please verify your internet settings. This is a very long error message to test the expandable feature. It should only show two lines initially, and then expand when you click "See More".',
        showIcon: true,
        closable: true,
        expandable: true // Make this alert expandable
    });
    alertContainer1?.appendChild(alertElement);
});

document.getElementById('alertNoIcon')?.addEventListener('click', () => {
    const alertElement = notifier.alert.create({
        type: 'info',
        title: 'Privacy Notice',
        message: 'We use cookies to enhance your browsing experience. By continuing to use our site, you agree to our cookie policy.',
        showIcon: false, // Explicitly hide icon
        closable: true
    });
    alertContainer2?.appendChild(alertElement);
});

document.getElementById('alertNoClosable')?.addEventListener('click', () => {
    const alertElement = notifier.alert.create({
        type: 'warning',
        title: 'Maintenance Soon',
        message: 'Our services will be undergoing scheduled maintenance tonight from 2 AM to 4 AM UTC. Expect temporary downtime.',
        closable: false // Explicitly hide close button
    });
    alertContainer2?.appendChild(alertElement);
});