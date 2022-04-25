import { schedule, ScheduledTask } from "node-cron";

class CronNodeWrapper {
    private _scheduleTask: ScheduledTask | undefined;

    schedule(cronExpression: string, func: () => void) {
        this._scheduleTask = schedule(cronExpression, func, {
            scheduled: true,
            timezone: "Asia/Kuala_Lumpur",
        });
    }

    start() {
        if (this._scheduleTask) {
            this._scheduleTask.start();
        }
    }

    stop() {
        if (this._scheduleTask) {
            this._scheduleTask.stop();
        }
    }
}

export default CronNodeWrapper;
