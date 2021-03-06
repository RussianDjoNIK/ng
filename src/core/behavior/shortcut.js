import {ShortcutManager} from './shortcut.manager';
import {Keyboard} from '../io';

const shortcutManager = new ShortcutManager();

export class Shortcut {
	constructor(manager) {
		this.manager = manager;
	}

	static isControl(keyCode) {
		if (!keyCode) {
			return false;
		}

		const code = keyCode.code;
		const parts = code.split('+');
		return parts.some(part => part === 'ctrl' || part === 'alt') ||
			parts.every(part => Keyboard.isControl(part));
	}

	static isPrintable(keyCode) {
		if (!keyCode) {
			return false;
		}

		return Keyboard.isPrintable(keyCode.code);
	}

	static stringify(keyCode) {
		if (!keyCode) {
			return '';
		}

		return Keyboard.stringify(keyCode.code, keyCode.key);
	}

	static translate(e) {
		const codes = [];
		const code = Keyboard.translate(e.keyCode).toLowerCase();
		if (e.ctrlKey) {
			codes.push('ctrl');
		}

		if (e.shiftKey) {
			codes.push('shift');
		}

		if (e.altKey) {
			codes.push('alt');
		}

		if (code !== 'ctrl' &&
			code !== 'shift' &&
			code !== 'alt') {
			codes.push(code);
		}

		return codes.join('+');
	}

	static keyDown(e) {
		const code = Shortcut.translate(e);
		Shortcut.keyCode = {
			key: e.key,
			code: code
		};

		if (shortcutManager.execute(code)) {
			e.preventDefault();
			return true;
		}

		return false;
	}

	register(commands) {
		return shortcutManager.register(this.manager, commands);
	}
}
