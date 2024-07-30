import Loading from "../assets/images/loading.gif";
function progress(isOpen) {
  const openProgress = () => {
    const progress = document.getElementById("progress");
    progress.innerHTML = `<img src=${Loading} alt='loading' />`;
    progress.classList.add("progress-bar");
  };
  const closeProgress = () => {
    const progress = document.getElementById("progress");
    progress.innerHTML = "";
    progress.classList.remove("progress-bar");
  };
  if (isOpen) {
    openProgress();
  } else {
    closeProgress();
  }
}
export const Utils = {
  progress,
};
