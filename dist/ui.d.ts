type UINotifierType = 'success' | 'error' | 'warning' | 'info';
type NotificationOptions = {
    duration?: number;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    pauseOnHover?: boolean;
    appendOnTopBody?: boolean;
    showProgressBar?: boolean;
    sound?: string;
};
type ModalOptions = {
    title?: string;
    content: string | HTMLElement;
    okText?: string;
    cancelText?: string;
    closable?: boolean;
    maskClosable?: boolean;
    footer?: (string | HTMLElement)[] | null;
    sound?: string;
};
type AlertOptions = {
    type: UINotifierType;
    title?: string;
    message: string;
    showIcon?: boolean;
    closable?: boolean;
    expandable?: boolean;
    sound?: string;
};
type UINotifierConfig = {
    notification?: NotificationOptions;
};
interface ModalInterface {
    _template: string;
    _activeModal: HTMLDivElement | null;
    _resolve: ((value: HTMLElement) => void) | null;
    _reject: ((reason?: any) => void) | null;
    show: (options: ModalOptions) => Promise<HTMLElement>;
    hide: () => void;
}
export default class UINotifier {
    private notificationConfig;
    private notificationContainer;
    constructor(config?: UINotifierConfig);
    private initNotificationContainer;
    notification: {
        _template: string;
        _create: (title: string, message: string, type: UINotifierType) => HTMLDivElement;
        _handleLifecycle: (notificationElement: HTMLDivElement, type: UINotifierType, options: NotificationOptions) => void;
        _close: (notificationElement: HTMLDivElement) => void;
        success: (title: string, message?: string, options?: NotificationOptions) => void;
        error: (title: string, message?: string, options?: NotificationOptions) => void;
        warning: (title: string, message?: string, options?: NotificationOptions) => void;
        info: (title: string, message?: string, options?: NotificationOptions) => void;
    };
    modal: ModalInterface;
    alert: {
        _template: string;
        create: (options: AlertOptions) => HTMLDivElement;
    };
}
export {};
