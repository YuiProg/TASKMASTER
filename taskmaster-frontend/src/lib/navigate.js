export default function navigateTo(path) {
  if (typeof window !== "undefined") {
    window.location.href = path;
  }
}