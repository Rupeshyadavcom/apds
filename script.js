const filters = document.querySelectorAll(".filter");
const groups = document.querySelectorAll(".screen-group");

function applyFilter(target) {
  filters.forEach((button) => {
    button.classList.toggle("is-active", button.dataset.filter === target);
  });

  groups.forEach((group) => {
    const devices = group.querySelectorAll(".device");
    let visibleCount = 0;

    devices.forEach((device) => {
      const shouldShow = target === "all" || device.dataset.kind === target;
      device.hidden = !shouldShow;

      if (shouldShow) {
        visibleCount += 1;
      }
    });

    group.hidden = visibleCount === 0;
  });
}

filters.forEach((button) => {
  button.addEventListener("click", () => applyFilter(button.dataset.filter));
});

applyFilter("all");
