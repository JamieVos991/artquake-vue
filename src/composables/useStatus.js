import { ref } from "vue";

export function useStatus() {
  const status = ref({ show: false, type: "success", message: "" });

  const showStatus = (type, message) => {
    status.value = { show: true, type, message };
    setTimeout(() => {
      status.value.show = false;
    }, 5000);
  };

  return { status, showStatus };
}
