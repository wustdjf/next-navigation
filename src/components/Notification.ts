export default class AppNotificationHandler {
  isNotificationSupported: boolean;
  isPermissionGranted: boolean = false;

  constructor() {
    //浏览器是否支持Notification api
    const isNotificationSupported = "Notification" in window;
    this.isNotificationSupported = isNotificationSupported;
    //用户是否同意接受通知
    if (isNotificationSupported) {
      this.isPermissionGranted = Notification.permission === "granted";
    }
  }

  //请求开启系统通知功能
  async requestPermission(): Promise<void> {
    const { isNotificationSupported } = this;
    if (!isNotificationSupported) {
      console.log("当前浏览器不支持 Notification API");
    }
    if (Notification.permission === "default") {
      const permission = await Notification.requestPermission();
      if (permission === "granted") {
        this.isPermissionGranted = true;
      }
    } else if (Notification.permission === "granted") {
      this.isPermissionGranted = true;
    } else {
      this.isPermissionGranted = false;
    }
  }

  //打开系统通知功能
  openNotification(title: string, options: NotificationOptions): Notification {
    const { isNotificationSupported, isPermissionGranted } = this;
    if (!isNotificationSupported) {
      console.log("当前浏览器不支持Notification API");
    }
    if (!isPermissionGranted) {
      console.log("当前页面通知未开启");
    }
    return new Notification(title, options);
  }
}
