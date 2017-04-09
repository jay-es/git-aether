export function closeDialog() {
  this.reset();
  this.$el.close();
}

export function backdrop(ev) {
  const BUFFER = 10;
  const el = ev.target;
  const top = ev.offsetY < -BUFFER;
  const left = ev.offsetX < -BUFFER;
  const bottom = ev.offsetY > el.clientHeight + BUFFER;
  const right = ev.offsetX > el.clientWidth + BUFFER;

  if (top || left || bottom || right) {
    this.closeDialog();
  }
}
