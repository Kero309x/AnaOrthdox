import packageInfo from "../../../package.json";
export const APP_VERSION = packageInfo.version;
export const APP_VERSION_AR = APP_VERSION.replace(/[0-9.]/g, (c) => c === "." ? "٫" : "٠١٢٣٤٥٦٧٨٩"[Number(c)]);
