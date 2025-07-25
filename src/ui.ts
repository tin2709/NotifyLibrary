// --- Type Definitions ---
type UINotifierType = 'success' | 'error' | 'warning' | 'info';

type NotificationOptions = {
    duration?: number;
    position?: 'top-left' | 'top-right' | 'bottom-left' | 'bottom-right';
    pauseOnHover?: boolean;
    appendOnTopBody?: boolean;
    showProgressBar?: boolean; // NEW: Option to show progress bar
    sound?: string; // NEW: Optional sound path
};

type ModalOptions = {
    title?: string;
    content: string | HTMLElement;
    okText?: string;
    cancelText?: string;
    closable?: boolean;
    maskClosable?: boolean;
    footer?: (string | HTMLElement)[] | null;
    sound?: string; // NEW: Optional sound path for modal open
};

type AlertOptions = {
    type: UINotifierType;
    title?: string;
    message: string;
    showIcon?: boolean;
    closable?: boolean;
    expandable?: boolean; // NEW: Allow alert message to be expanded/collapsed
    sound?: string; // NEW: Optional sound path
};

type UINotifierConfig = {
    notification?: NotificationOptions;
};

// FIX: Define an interface for the modal object structure
interface ModalInterface {
    _template: string;
    _activeModal: HTMLDivElement | null;
    _resolve: ((value: HTMLElement) => void) | null;
    _reject: ((reason?: any) => void) | null;
    show: (options: ModalOptions) => Promise<HTMLElement>;
    hide: () => void;
}


// --- Icons (using Ant Design inspired SVGs) ---
const icons = {
    success: '<svg focusable="false" aria-hidden="true" fill="currentColor" viewBox="64 64 896 896"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm193.5 301.7l-210.6 292.8c-1.8 2.5-4.2 4.6-6.8 6.2-2.9 1.7-6.2 2.8-9.6 3.3-3.4.5-6.9.5-10.3 0-3.4-.5-6.7-1.6-9.6-3.3-2.6-1.6-5-3.7-6.8-6.2l-137.9-191.6c-4.5-6.2-3.1-14.7 3.1-19.2s14.7-3.1 19.2 3.1l125.7 174.4 199.3-277.2c4.5-6.2 12.9-7.6 19.2-3.1s7.6 12.9 3.1 19.2z"></path></svg>',
    error: '<svg focusable="false" aria-hidden="true" fill="currentColor" viewBox="64 64 896 896"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/><path d="M512 444c-13.2 0-24 10.8-24 24v112c0 13.2 10.8 24 24 24s24-10.8 24-24V468c0-13.2-10.8-24-24-24z"/><circle cx="512" cy="362" r="24"/></svg>',
    warning: '<svg focusable="false" aria-hidden="true" fill="currentColor" viewBox="64 64 896 896"><path d="M909.5 540.7L679.1 163.6c-13.4-23.2-38.1-37.9-65.7-37.9H296.6c-27.6 0-52.3 14.7-65.7 37.9L114.5 540.7c-13.4 23.2-13.4 49.9 0 73.1l230.4 391.8c13.4 23.2 38.1 37.9 65.7 37.9h316.8c27.6 0 52.3-14.7 65.7-37.9l230.4-391.8c13.4-23.2 13.4-49.9 0-73.1zM488 684V452c0-4.4 3.6-8 8-8h48c4.4 0 8 3.6 8 8v232c0 4.4-3.6 8-8 8h-48c-4.4 0-8-3.6-8-8zm24-144c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z"/></svg>',
    info: '<svg focusable="false" aria-hidden="true" fill="currentColor" viewBox="64 64 896 896"><path d="M512 64C264.6 64 64 264.6 64 512s200.6 448 448 448 448-200.6 448-448S759.4 64 512 64zm0 820c-205.4 0-372-166.6-372-372s166.6-372 372-372 372 166.6 372 372-166.6 372-372 372z"/><path d="M512 444c-13.2 0-24 10.8-24 24v112c0 13.2 10.8 24 24 24s24-10.8 24-24V468c0-13.2-10.8-24-24-24z"/><circle cx="512" cy="362" r="24"/></svg>'
};

// Helper for playing sounds
function playSound(path?: string) {
    if (path) {
        try {
            const audio = new Audio(path);
            audio.play().catch(e => console.warn("Audio playback failed:", e));
        } catch (e) {
            console.error("Error creating audio object:", e);
        }
    }
}

export default class UINotifier {
    private notificationConfig: Required<NotificationOptions>;
    private notificationContainer: HTMLDivElement | null = null; // Container for notifications

    constructor(config?: UINotifierConfig) {
        // Default notification config
        this.notificationConfig = {
            duration: config?.notification?.duration ?? 4000, // Slightly shorter for progress bar
            position: config?.notification?.position ?? 'top-right',
            pauseOnHover: config?.notification?.pauseOnHover ?? true,
            appendOnTopBody: config?.notification?.appendOnTopBody ?? true,
            showProgressBar: config?.notification?.showProgressBar ?? false, // Default to false
            sound: config?.notification?.sound,
        };

        // Initialize notification container
        this.initNotificationContainer();
    }

    private initNotificationContainer() {
        // Remove any pre-existing containers to avoid duplicates if instantiated multiple times
        document.querySelectorAll('.ui-notification-container').forEach(node => node.remove());

        this.notificationContainer = document.createElement('div');
        this.notificationContainer.classList.add('ui-notification-container', this.notificationConfig.position);

        if (this.notificationConfig.appendOnTopBody) {
            document.body.prepend(this.notificationContainer);
        } else {
            console.warn('UINotifier: appendOnTopBody is false. You must manually append the notification container element to the DOM.');
            console.warn('Notification Container Element:', this.notificationContainer);
        }
    }

    // --- Notification Methods ---
    public notification = {
        _template: `
            <div class="ui-notification-wrapper">
                <div class="ui-notification-icon ui-icon-base">:icon</div>
                <div class="ui-notification-content">
                    <div class="ui-notification-title">:title</div>
                    <div class="ui-notification-message">:message</div>
                    <div class="ui-expand-btn" style="display:none;">See More</div>
                </div>
                <button class="ui-notification-close-btn">×</button>
                <div class="ui-progress-bar"></div>
            </div>
        `,
        _create: (title: string, message: string, type: UINotifierType): HTMLDivElement => {
            const templateHtml = this.notification._template
                .replace(':icon', icons[type])
                .replace(':title', title)
                .replace(':message', message);

            const parser = new DOMParser();
            const doc = parser.parseFromString(templateHtml, 'text/html');
            return doc.body.firstElementChild as HTMLDivElement;
        },
        _handleLifecycle: (notificationElement: HTMLDivElement, type: UINotifierType, options: NotificationOptions) => {
            if (!this.notificationContainer) {
                this.initNotificationContainer();
                if (!this.notificationContainer) {
                    console.error('Notification container not found and could not be re-initialized.');
                    return;
                }
            }

            notificationElement.classList.add(type); // Add type class for styling

            // Close button event
            notificationElement.querySelector('.ui-notification-close-btn')?.addEventListener('click', () => {
                this.notification._close(notificationElement);
            });

            // Expandable message logic (if message is long)
            const messageEl = notificationElement.querySelector('.ui-notification-message') as HTMLDivElement;
            const expandBtn = notificationElement.querySelector('.ui-expand-btn') as HTMLDivElement;

            if (messageEl && expandBtn && messageEl.scrollHeight > messageEl.clientHeight) {
                expandBtn.style.display = 'block';
                let isExpanded = false;
                expandBtn.textContent = 'See More';

                expandBtn.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent closing notification when clicking expand
                    isExpanded = !isExpanded;
                    notificationElement.classList.toggle('expanded', isExpanded);
                    expandBtn.textContent = isExpanded ? 'See Less' : 'See More';
                });
            }

            // Append to container based on position for correct stacking
            if (this.notificationConfig.position.startsWith('top')) {
                this.notificationContainer.prepend(notificationElement);
            } else {
                this.notificationContainer.append(notificationElement);
            }

            // Animate in
            requestAnimationFrame(() => {
                notificationElement.classList.add('show');
            });

            // Play sound
            if (options.sound) {
                playSound(options.sound);
            }

            // Progress Bar Logic
            const progressBar = notificationElement.querySelector('.ui-progress-bar') as HTMLDivElement;
            let animationFrameId: number;
            let startTime: number;

            const updateProgressBar = (currentTime: number) => {
                if (!startTime) startTime = currentTime;
                const elapsedTime = currentTime - startTime;
                const progress = Math.min(elapsedTime / (options.duration || 4000), 1); // Ensure 1 or less
                if (progressBar) {
                    progressBar.style.width = `${progress * 100}%`;
                }

                if (progress < 1) {
                    animationFrameId = requestAnimationFrame(updateProgressBar);
                }
            };

            if (options.showProgressBar && progressBar) {
                progressBar.style.display = 'block';
                animationFrameId = requestAnimationFrame(updateProgressBar);
            } else if (progressBar) {
                progressBar.style.display = 'none';
            }


            // Auto-close timeout
            let closeTimeoutId: ReturnType<typeof setTimeout> | undefined = setTimeout(() => {
                this.notification._close(notificationElement);
                if (options.showProgressBar && animationFrameId) {
                    cancelAnimationFrame(animationFrameId);
                }
            }, options.duration || 4000);

            // Pause on hover
            if (this.notificationConfig.pauseOnHover) {
                notificationElement.addEventListener('mouseenter', () => {
                    if (closeTimeoutId !== undefined) {
                        clearTimeout(closeTimeoutId);
                        closeTimeoutId = undefined;
                    }
                    if (options.showProgressBar && animationFrameId) {
                        cancelAnimationFrame(animationFrameId); // Pause progress bar animation
                    }
                });

                notificationElement.addEventListener('mouseleave', () => {
                    if (closeTimeoutId === undefined) {
                        startTime = performance.now() - (this.notificationConfig.duration - (options.duration || 4000) * (1 - parseFloat(progressBar.style.width) / 100)); // Restart from current progress
                        closeTimeoutId = setTimeout(() => {
                            this.notification._close(notificationElement);
                            if (options.showProgressBar && animationFrameId) {
                                cancelAnimationFrame(animationFrameId);
                            }
                        }, (options.duration || 4000) * (1 - parseFloat(progressBar.style.width) / 100));
                    }
                    if (options.showProgressBar && progressBar && progressBar.style.width !== '100%') {
                        animationFrameId = requestAnimationFrame(updateProgressBar); // Resume progress bar animation
                    }
                }, { once: true });
            }
        },
        _close: (notificationElement: HTMLDivElement) => {
            notificationElement.classList.remove('show');
            notificationElement.classList.add('hide');

            setTimeout(() => {
                notificationElement.remove();
                if (this.notificationContainer && this.notificationContainer.children.length === 0) {
                    this.notificationContainer.remove();
                    this.notificationContainer = null;
                }
            }, 400); // Increased to match CSS transition
        },
        // Modified methods to accept optional NotificationOptions
        success: (title: string, message?: string, options?: NotificationOptions) => {
            const actualMessage = message || title;
            const actualTitle = message ? title : 'Success!';
            const combinedOptions: NotificationOptions = { ...this.notificationConfig, ...options }; // Combine with instance config
            const element = this.notification._create(actualTitle, actualMessage, 'success');
            this.notification._handleLifecycle(element, 'success', combinedOptions);
        },
        error: (title: string, message?: string, options?: NotificationOptions) => {
            const actualMessage = message || title;
            const actualTitle = message ? title : 'Error!';
            const combinedOptions: NotificationOptions = { ...this.notificationConfig, ...options };
            const element = this.notification._create(actualTitle, actualMessage, 'error');
            this.notification._handleLifecycle(element, 'error', combinedOptions);
        },
        warning: (title: string, message?: string, options?: NotificationOptions) => {
            const actualMessage = message || title;
            const actualTitle = message ? title : 'Warning!';
            const combinedOptions: NotificationOptions = { ...this.notificationConfig, ...options };
            const element = this.notification._create(actualTitle, actualMessage, 'warning');
            this.notification._handleLifecycle(element, 'warning', combinedOptions);
        },
        info: (title: string, message?: string, options?: NotificationOptions) => {
            const actualMessage = message || title;
            const actualTitle = message ? title : 'Info';
            const combinedOptions: NotificationOptions = { ...this.notificationConfig, ...options };
            const element = this.notification._create(actualTitle, actualMessage, 'info');
            this.notification._handleLifecycle(element, 'info', combinedOptions);
        }
    }; // End of Notification Methods

    // --- Modal Methods ---
    public modal: ModalInterface = {
        _template: `
            <div class="ui-modal-backdrop">
                <div class="ui-modal-wrapper">
                    <div class="ui-modal-header">
                        <div class="ui-modal-title"></div>
                        <button class="ui-modal-close-btn">×</button>
                    </div>
                    <div class="ui-modal-body"></div>
                    <div class="ui-modal-footer">
                        <button class="modal-cancel-btn">Cancel</button>
                        <button class="modal-ok-btn">OK</button>
                    </div>
                </div>
            </div>
        `,
        _activeModal: null,
        _resolve: null,
        _reject: null,

        show: (options: ModalOptions): Promise<HTMLElement> => {
            return new Promise((resolve, reject) => {
                if (this.modal._activeModal) {
                    this.modal.hide();
                    this.modal._reject?.('New modal opened, previous cancelled.');
                }

                this.modal._resolve = resolve;
                this.modal._reject = reject;

                const parser = new DOMParser();
                const doc = parser.parseFromString(this.modal._template, 'text/html');
                const backdropElement = doc.body.firstElementChild as HTMLDivElement;
                const modalWrapper = backdropElement.querySelector('.ui-modal-wrapper') as HTMLDivElement;
                const modalHeader = backdropElement.querySelector('.ui-modal-header') as HTMLDivElement;
                const modalBody = backdropElement.querySelector('.ui-modal-body') as HTMLDivElement;
                const modalFooter = backdropElement.querySelector('.ui-modal-footer') as HTMLDivElement;
                const closeButton = modalHeader.querySelector('.ui-modal-close-btn') as HTMLButtonElement;
                const okButton = modalFooter.querySelector('.modal-ok-btn') as HTMLButtonElement;
                const cancelButton = modalFooter.querySelector('.modal-cancel-btn') as HTMLButtonElement;

                // Set title
                const modalTitleEl = modalHeader.querySelector('.ui-modal-title') as HTMLDivElement;
                modalTitleEl.textContent = options.title || 'Modal';

                // Set content
                if (typeof options.content === 'string') {
                    modalBody.innerHTML = options.content;
                } else {
                    modalBody.appendChild(options.content);
                }

                // Customize footer
                if (options.footer === null) {
                    modalFooter.remove();
                } else if (Array.isArray(options.footer)) {
                    modalFooter.innerHTML = '';
                    options.footer.forEach(item => {
                        if (typeof item === 'string') {
                            const tempDiv = document.createElement('div');
                            tempDiv.innerHTML = item.trim();
                            if (tempDiv.firstChild) {
                                modalFooter.appendChild(tempDiv.firstChild as HTMLElement);
                            }
                        } else {
                            modalFooter.appendChild(item);
                        }
                    });
                } else { // Fallback for default buttons if options.footer is undefined or not an array/null
                    okButton.textContent = options.okText || 'OK';
                    cancelButton.textContent = options.cancelText || 'Cancel';
                }

                // Hide close button if closable is false
                if (options.closable === false) {
                    closeButton.remove();
                }

                // Event Handlers for closing modal
                const closeModal = (reason?: any) => {
                    this.modal.hide();
                    this.modal._reject?.(reason || 'Modal Closed');
                    this.modal._resolve = null;
                    this.modal._reject = null;
                };

                closeButton?.addEventListener('click', () => closeModal('close-button'));
                cancelButton?.addEventListener('click', () => closeModal('cancel-button'));
                okButton?.addEventListener('click', () => {
                    this.modal.hide();
                    this.modal._resolve?.(modalWrapper);
                    this.modal._resolve = null;
                    this.modal._reject = null;
                });

                // Mask Closable
                if (options.maskClosable !== false) {
                    backdropElement.addEventListener('click', (e) => {
                        if (e.target === backdropElement) {
                            closeModal('mask-click');
                        }
                    });
                }

                // Play sound on open
                if (options.sound) {
                    playSound(options.sound);
                }

                document.body.appendChild(backdropElement);
                this.modal._activeModal = backdropElement;

                // Animate in
                requestAnimationFrame(() => {
                    backdropElement.classList.add('show');
                    document.body.style.overflow = 'hidden'; // Prevent scrolling body when modal is open
                });
            });
        },
        hide: () => {
            if (this.modal._activeModal) {
                this.modal._activeModal.classList.remove('show');
                setTimeout(() => {
                    this.modal._activeModal?.remove();
                    this.modal._activeModal = null;
                    document.body.style.overflow = '';
                }, 400); // Increased to match CSS transition
            }
        }
    }; // End of Modal Methods

    // --- Alert Methods ---
    public alert = {
        _template: `
            <div class="ui-alert-wrapper">
                <div class="ui-alert-icon ui-icon-base">:icon</div>
                <div class="ui-alert-content">
                    <div class="ui-alert-title"></div>
                    <div class="ui-alert-message"></div>
                    <div class="ui-expand-btn" style="display:none;">See More</div>
                </div>
                <button class="ui-alert-close-btn">×</button>
            </div>
        `,
        create: (options: AlertOptions): HTMLDivElement => {
            let templateHtml = this.alert._template
                .replace(':icon', icons[options.type]);

            const parser = new DOMParser();
            const doc = parser.parseFromString(templateHtml, 'text/html');
            const alertElement = doc.body.firstElementChild as HTMLDivElement;

            alertElement.classList.add(options.type); // Add type class for styling

            // Set title and message
            const titleEl = alertElement.querySelector('.ui-alert-title') as HTMLDivElement;
            const messageEl = alertElement.querySelector('.ui-alert-message') as HTMLDivElement;
            const expandBtn = alertElement.querySelector('.ui-expand-btn') as HTMLDivElement;


            if (options.title) {
                titleEl.textContent = options.title;
            } else {
                titleEl?.remove(); // Remove title element if not provided
            }
            messageEl.textContent = options.message;

            // Handle icon visibility
            if (options.showIcon !== false) {
                alertElement.classList.add('show-icon');
            } else {
                alertElement.classList.remove('show-icon');
            }

            // Handle closable button
            const closeButton = alertElement.querySelector('.ui-alert-close-btn') as HTMLButtonElement;
            if (options.closable !== false) {
                closeButton.addEventListener('click', () => {
                    alertElement.classList.add('hide');
                    setTimeout(() => alertElement.remove(), 300);
                });
            } else {
                closeButton.remove();
            }

            // Expandable message logic
            if (options.expandable && messageEl && expandBtn && messageEl.scrollHeight > messageEl.clientHeight) {
                expandBtn.style.display = 'block';
                let isExpanded = false;
                expandBtn.textContent = 'See More';

                expandBtn.addEventListener('click', () => {
                    isExpanded = !isExpanded;
                    alertElement.classList.toggle('expanded', isExpanded);
                    expandBtn.textContent = isExpanded ? 'See Less' : 'See More';
                });
            } else if (expandBtn) {
                expandBtn.remove(); // Remove expand button if not expandable or content is short
            }

            // Play sound
            if (options.sound) {
                playSound(options.sound);
            }

            return alertElement; // User is responsible for appending this element
        }
    }; // End of Alert Methods
}