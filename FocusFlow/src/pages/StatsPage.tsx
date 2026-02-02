import type { Session } from "../types/session"

type Props = {
    sessions: Session[];
};

const formatHM = (totalSeconds: number) => {
    const h = Math.floor(totalSeconds/ 3600);
    const m = Math.floor((totalSeconds % 3600) / 60);
    return h > 0 ? `${h}h ${m}m` : `${m}m`
};

export default function StatsPage({ sessions }: Props)
{
    const totalSessions = sessions.length;

    const totalFocuseSeconds = sessions.reduce((sum, s) => {
        return s.type === "focus" ? sum + s.durationSeconds : sum;
    }, 0)

    const StartOfToday = new Date();
    StartOfToday.setHours(0, 0, 0, 0);
    const startOfTodayMs = StartOfToday.getTime();

    const focusTodaySeconds = sessions.reduce((sum, s) => {
        const isToday = s.endedAt >= startOfTodayMs;
        const isFocus = s.type === "focus";
        return isToday && isFocus ? sum + s.durationSeconds : sum;
    }, 0);
    
    return(
        <div>
            <h1>Stats</h1>
            <p>Sessions: {totalSessions}</p>
            <p>Total focus: {formatHM(totalFocuseSeconds)}</p>
            <p>
                Focus Today : {formatHM(focusTodaySeconds)}
            </p>

        </div>
    )
}