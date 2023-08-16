import Inputmask from "inputmask";

export function inputMask() {
	const code = document.querySelector('[data-code-mask]');

	if(code) {
      maskInputMessage(code);
	}

	function maskInputMessage(selector) {
      const inputMask = new Inputmask('9 9 9  9 9 9');
      inputMask.mask(selector);
    }
}