export type PeriodicalTaskRes = {
    cron_spec: string
    workflow_id: string
    name: string
    entry_id: number
    id: number
    last_run_time_unix: number
    run_num: number
    state: PeriodicalTaskStateEnum
}

export enum PeriodicalTaskStateEnum {
    PAUSE = 0,
    RUNNING = 1,
    DELETE = -1
}