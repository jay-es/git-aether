export function openDialog() {
  this.$el.showModal();
  this.$el.classList.add('fade');

  this.$el.oncancel = (e) => {
    e.preventDefault();
    this.closeDialog();
  };
}

export function closeDialog() {
  this.$el.classList.remove('fade');
  setTimeout(() => {
    this.reset();
    this.$el.close();
  }, 300);
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
