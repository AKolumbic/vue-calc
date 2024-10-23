export function input(value: string, display: string) {
  return display + value;
}

export function clear() {
  return '';
}

export function calculate(display: string) {
  try {
    return eval(display);
  } catch (e) {
    return 'Error';
  }
}
