export type ToastType = 'success' | 'error' | 'warning' | 'info' | 'loading';

export interface ToastOptions {
  duration?: number;
}

export class ToastManager {
  private static container: HTMLDivElement | null = null;
  private static toasts: { id: string; element: HTMLDivElement; timeoutId?: any }[] = [];
  private static maxToasts = 3;

  private static initContainer() {
    if (typeof window === 'undefined') return;
    if (!this.container) {
      this.container = document.getElementById('toast-container') as HTMLDivElement;
      if (!this.container) {
        this.container = document.createElement('div');
        this.container.id = 'toast-container';
        document.body.appendChild(this.container);
      }
    }
  }

  private static createToastElement(
    id: string,
    message: string,
    type: ToastType,
    options: ToastOptions
  ) {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.id = `toast-${id}`;

    let icon = '';
    if (type === 'success') icon = '✓';
    else if (type === 'error') icon = '✗';
    else if (type === 'warning') icon = '!';
    else if (type === 'info') icon = 'i';
    else if (type === 'loading') icon = '↻'; // Placeholder for Hot Wheels wheel

    toast.innerHTML = `
      <div class="toast-icon ${type === 'loading' ? 'spin' : ''}">${icon}</div>
      <div class="toast-message">${message}</div>
      ${type !== 'loading' ? `<button class="toast-close" onclick="document.dispatchEvent(new CustomEvent('dismissToast', {detail: '${id}'}))">×</button>` : ''}
      ${type !== 'loading' ? `<div class="toast-progress" style="animation-duration: ${options.duration}ms;"></div>` : ''}
    `;

    return toast;
  }

  static show(message: string, type: ToastType, options: ToastOptions = { duration: 3000 }): string {
    if (typeof window === 'undefined') return '';
    this.initContainer();

    const id = Math.random().toString(36).substring(2, 9);
    const duration = options.duration || 3000;

    const toastElement = this.createToastElement(id, message, type, { duration });
    
    // Manage queue size
    if (this.toasts.length >= this.maxToasts) {
      const oldestToast = this.toasts.shift();
      if (oldestToast) this.removeToast(oldestToast.id);
    }

    this.container?.appendChild(toastElement);
    
    // Animate in
    requestAnimationFrame(() => {
      toastElement.classList.add('toast-visible');
    });

    let timeoutId;
    if (type !== 'loading') {
      timeoutId = setTimeout(() => {
        this.dismiss(id);
      }, duration);
    }

    this.toasts.push({ id, element: toastElement, timeoutId });
    return id;
  }

  static dismiss(id: string) {
    const toastIndex = this.toasts.findIndex(t => t.id === id);
    if (toastIndex > -1) {
      const toast = this.toasts[toastIndex];
      if (toast.timeoutId) clearTimeout(toast.timeoutId);
      this.toasts.splice(toastIndex, 1);
      this.removeToast(id);
    }
  }

  private static removeToast(id: string) {
    const el = document.getElementById(`toast-${id}`);
    if (el) {
      el.classList.remove('toast-visible');
      setTimeout(() => {
        el.remove();
      }, 300); // Matches transition duration
    }
  }

  static success(message: string, options?: ToastOptions) { return this.show(message, 'success', options); }
  static error(message: string, options?: ToastOptions) { return this.show(message, 'error', options); }
  static warning(message: string, options?: ToastOptions) { return this.show(message, 'warning', options); }
  static info(message: string, options?: ToastOptions) { return this.show(message, 'info', options); }
  static loading(message: string) { return this.show(message, 'loading', { duration: 0 }); }
  
  static promise(
    promise: Promise<any>,
    messages: { loading: string; success: string; error: string }
  ) {
    const id = this.loading(messages.loading);
    return promise
      .then((res) => {
        this.dismiss(id);
        this.success(messages.success);
        return res;
      })
      .catch((err) => {
        this.dismiss(id);
        this.error(messages.error);
        throw err;
      });
  }
}

// Global listener for inline dismiss buttons
if (typeof window !== 'undefined') {
  document.addEventListener('dismissToast', (e: any) => {
    ToastManager.dismiss(e.detail);
  });
}
