import dayjs from "dayjs";
import { defineStore } from "pinia";
import utc from "dayjs/plugin/utc";

dayjs.extend(utc);

// 你可以任意命名 `defineStore()` 的返回值，但最好使用 store 的名字，同时以 `use` 开头且以 `Store` 结尾。
// (比如 `useUserStore`，`useCartStore`，`useProductStore`)
// 第一个参数是你的应用中 Store 的唯一 ID。
export const useTimeStore = defineStore("time", () => {
  const currentDate = ref("");
  const currentTime = ref("");
  const currentDateUTC = ref("");
  const currentTimeUTC = ref("");
  const timeZone = ref(0);
  const currentDateChoosen = ref("");
  const currentTimeChoosen = ref("");
  setInterval(() => {
    currentDate.value = dayjs().format("YYYY-MM-DD");
    currentTime.value = dayjs().format("HH:mm:ss");
    currentDateUTC.value = dayjs().utc().format("YYYY-MM-DD");
    currentTimeUTC.value = dayjs().utc().format("HH:mm:ss");
    currentDateChoosen.value = dayjs()
      .utc()
      .add(timeZone.value, "h")
      .format("YYYY-MM-DD");
    currentTimeChoosen.value = dayjs()
      .utc()
      .add(timeZone.value, "h")
      .format("HH:mm:ss");
  }, 1000);
  return {
    currentDate,
    currentTime,
    currentDateUTC,
    currentTimeUTC,
    timeZone,
    currentDateChoosen,
    currentTimeChoosen,
  };
});
