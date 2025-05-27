
import { useState, useEffect } from 'react';

interface FlipClockProps {
  targetDate: Date;
}

const FlipClock = ({ targetDate }: FlipClockProps) => {
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

  const FlipDigit = ({ value, label }: { value: number; label: string }) => (
    <div className="flex flex-col items-center">
      <div className="relative">
        <div className="bg-gray-900 text-white rounded-lg p-4 min-w-[4rem] h-16 flex items-center justify-center text-2xl font-bold font-mono shadow-lg">
          {value.toString().padStart(2, '0')}
        </div>
        <div className="absolute inset-x-0 top-1/2 h-0.5 bg-gray-700"></div>
      </div>
      <span className="text-sm text-gray-600 mt-2 font-medium">{label}</span>
    </div>
  );

  return (
    <div className="flex justify-center space-x-4">
      <FlipDigit value={timeLeft.days} label="Days" />
      <div className="flex items-center justify-center h-16 text-2xl font-bold text-gray-400">:</div>
      <FlipDigit value={timeLeft.hours} label="Hours" />
      <div className="flex items-center justify-center h-16 text-2xl font-bold text-gray-400">:</div>
      <FlipDigit value={timeLeft.minutes} label="Minutes" />
      <div className="flex items-center justify-center h-16 text-2xl font-bold text-gray-400">:</div>
      <FlipDigit value={timeLeft.seconds} label="Seconds" />
    </div>
  );
};

export default FlipClock;
