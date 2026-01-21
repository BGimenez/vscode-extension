import * as vscode from 'vscode';

export default interface MessageProvider {
	showInfo(message: string, duration?: number): void;
	showWarning(message: string, duration?: number): void;
	showError(message: string, duration?: number): void;
}

export class StatusBarVsCodeProvider implements MessageProvider {
	private statusBarItem: vscode.StatusBarItem;
	private timeoutId: NodeJS.Timeout | undefined;

	constructor() {
		this.statusBarItem = vscode.window.createStatusBarItem(vscode.StatusBarAlignment.Left, 100);
		this.statusBarItem.command = 'cortexExplorer.showStatusHistory';
	}

	showInfo(message: string, duration: number = 4000): void {
		this.showStatus(message, duration, 'info');
	}

	showWarning(message: string, duration: number = 6000): void {
		this.showStatus(message, duration, 'warning');
	}

	showError(message: string, duration: number = 6000): void {
		this.showStatus(message, duration, 'error');
	}

	/**
	 * Show a status message in the status bar
	 * @param message The message to show
	 * @param duration Duration in milliseconds to show the message (default: 5000ms)
	 * @param icon Optional icon to show alongside the message
	 */
	private showStatus(message: string, duration: number = 5000, icon?: string): void {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}

		this.statusBarItem.text = `${icon ? `$(${icon})` : ''} ${message}`;
		this.statusBarItem.show();

		this.timeoutId = setTimeout(() => {
			this.hide();
		}, duration);
	}

	/**
	 * Hide the status bar message
	 */
	private hide(): void {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
			this.timeoutId = undefined;
		}
		this.statusBarItem.hide();
	}

	/**
	 * Dispose the status bar item
	 */
	dispose(): void {
		if (this.timeoutId) {
			clearTimeout(this.timeoutId);
		}
		this.statusBarItem.dispose();
	}
}