export function css(tpl: string) {
  const styles = document.createElement("style");
  styles.innerHTML = tpl;
  document.head.append(styles);
}
