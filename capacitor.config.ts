import type { CapacitorConfig } from "@capacitor/cli";

const config: CapacitorConfig = {
  appId: "com.orderpad.app",
  appName: "Order Pad",
  webDir: "www",
  plugins: {
    CapacitorHttp: {
      enabled: true,
    },
  },
};

export default config;
