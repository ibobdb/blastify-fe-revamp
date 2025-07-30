declare global {
  interface Window {
    snap: {
      pay: (token: string, options?: SnapPayOptions) => void;
    };
  }
}

interface SnapPayOptions {
  onSuccess?: (result: any) => void;
  onPending?: (result: any) => void;
  onError?: (result: any) => void;
  onClose?: () => void;
}

export class MidtransService {
  private static instance: MidtransService;
  private isScriptLoaded = false;
  private clientKey: string;

  constructor() {
    this.clientKey = process.env.NEXT_PUBLIC_MIDTRANS_CLIENT_KEY || '';
  }

  static getInstance(): MidtransService {
    if (!MidtransService.instance) {
      MidtransService.instance = new MidtransService();
    }
    return MidtransService.instance;
  }

  async loadSnapScript(): Promise<void> {
    if (this.isScriptLoaded || typeof window === 'undefined') {
      return;
    }

    return new Promise((resolve, reject) => {
      // Check if script already exists
      const existingScript = document.querySelector('script[src*="snap.js"]');
      if (existingScript) {
        this.isScriptLoaded = true;
        resolve();
        return;
      }

      const script = document.createElement('script');
      script.src = 'https://app.sandbox.midtrans.com/snap/snap.js'; // Use production URL for live
      script.setAttribute('data-client-key', this.clientKey);

      script.onload = () => {
        this.isScriptLoaded = true;
        resolve();
      };

      script.onerror = () => {
        reject(new Error('Failed to load Midtrans Snap script'));
      };

      document.head.appendChild(script);
    });
  }

  async pay(snapToken: string, options: SnapPayOptions = {}): Promise<void> {
    if (!this.isScriptLoaded) {
      await this.loadSnapScript();
    }

    if (!window.snap) {
      throw new Error('Midtrans Snap not available');
    }

    const defaultOptions: SnapPayOptions = {
      onSuccess: (result) => {
        // Payment success
      },
      onPending: (result) => {
        // Payment pending
      },
      onError: (result) => {
        // Payment error
      },
      onClose: () => {
        // Payment popup closed
      },
      ...options,
    };

    window.snap.pay(snapToken, defaultOptions);
  }

  isLoaded(): boolean {
    return this.isScriptLoaded;
  }
}

export const midtransService = MidtransService.getInstance();
