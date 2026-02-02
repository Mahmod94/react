import { useEffect, useRef, useState } from "react";

const FOCUS_SECONDS = 25 * 60;

export default function PromodoroPage()
{
    const [secondsLeft, setSecondsLeft] = useState<number>(FOCUS_SECONDS);
    const [isRunning, setIsRunning] = useState<boolean>(false);

    // Sparar intervall-id mellan renders utan att trigga rerender
    const intervalRef = useRef<number | null>(null);

    // Hjälpfunktion för mm:ss
    const formatTime = (totalSeconds: number) => {
        const m = Math.floor(totalSeconds/ 60);
        const s = totalSeconds % 60;
        return `${m}:${s.toString().padStart(2, "0")}`;
    };


    useEffect(() => {
        // Om vi inte kör: se till att inget intervall lever kvar
        if (!isRunning) {
            if (intervalRef.current !== null){
                clearInterval(intervalRef.current);
                intervalRef.current = null;
            }
            return;
        }

        // Starta intervall när isRunning blir true
        intervalRef.current = window.setInterval(() => {
            setSecondsLeft((prev) => {
                if (prev <= 1) {
                    // När tiden tar slut: stoppa
                    setIsRunning(false);
                    return 0;
                }
                return prev - 1;
        });
    }, 1000);

    // Cleanup när isRunning ändras eller komponenten unmountas
    return () => {
        if (intervalRef.current != null){
            clearInterval(intervalRef.current);
            intervalRef.current = null;
        }
    };
}, [isRunning]);


const handleStartPause = () => setIsRunning((p) => !p);

const handleReset = () => {
    setIsRunning(false);
    setSecondsLeft(FOCUS_SECONDS);
};

return (
    <div>
        <h1>Promodoro</h1>

        <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>
            {formatTime(secondsLeft)}
        </div>

        <button onClick={handleStartPause}>
            {isRunning ? "Pause" : "Start"}
        </button>

        <button onClick={handleReset} style={{ marginLeft: "0.5rem" }}>
            Reset
        </button>

    </div>
);

}

