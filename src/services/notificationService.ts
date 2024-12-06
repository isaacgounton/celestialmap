import { LocalNotifications } from "@nativescript/local-notifications";

export async function scheduleParishEventNotification(
    title: string,
    message: string,
    date: Date
): Promise<void> {
    await LocalNotifications.schedule([{
        id: Date.now(),
        title,
        body: message,
        at: date,
        forceShowWhenInForeground: true
    }]);
}

export async function cancelAllNotifications(): Promise<void> {
    await LocalNotifications.cancel(0);
}