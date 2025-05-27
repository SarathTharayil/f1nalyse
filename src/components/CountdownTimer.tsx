
import { useState, useEffect } from 'react';

interface CountdownTimerProps {
  targetDate: Date;
}

const CountdownTimer = ({ targetDate }: CountdownTimerProps) => {
  const [timeLeft, setTimeLeft] = useState({
    days: 0,
    hours: 0,
    minutes: 0,
    seconds: 0
  });

  useEffect(() => {
    const timer = setInterval(() => {
      const now = new Date().getTime();
      const target = targetDate.getTime();
      const difference = target - now;

      if (difference > 0) {
        setTimeLeft({
          days: Math.floor(difference / (1000 * 60 * 60 * 24)),
          hours: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutes: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          seconds: Math.floor((difference % (1000 * 60)) / 1000)
        });
      } else {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  const TimeUnit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center bg-gray-900 text-white rounded-lg p-3 sm:p-4 min-w-[60px] sm:min-w-[80px]">
      <div className="text-xl sm:text-3xl font-bold font-mono">
        {value.toString().padStart(2, '0')}
      </div>
      <div className="text-xs sm:text-sm text-gray-300 mt-1">{label}</div>
    </div>
  );

  return (
    <div className="flex justify-center items-center space-x-2 sm:space-x-4">
      <TimeUnit value={timeLeft.days} label="Days" />
      <div className="text-2xl font-bold text-gray-400">:</div>
      <TimeUnit value={timeLeft.hours} label="Hours" />
      <div className="text-2xl font-bold text-gray-400">:</div>
      <TimeUnit value={timeLeft.minutes} label="Minutes" />
      <div className="text-2xl font-bold text-gray-400">:</div>
      <TimeUnit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

export default CountdownTimer;
