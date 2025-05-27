import { useQuery } from '@tanstack/react-query';
import { f1Api, Race } from '../services/f1Api';
import { format } from 'date-fns';
import { toZonedTime } from 'date-fns-tz';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import React, { useState, useEffect } from 'react';

// Add Quantico font import to the head if not already present
if (typeof window !== 'undefined') {
  const id = 'quantico-font';
  if (!document.getElementById(id)) {
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = 'https://fonts.googleapis.com/css2?family=Quantico:wght@700&display=swap';
    document.head.appendChild(link);
  }
}

const SessionCountdown = () => {
  // Get user's location based on IP
  const { data: locationData } = useQuery({
    queryKey: ['userLocation'],
    queryFn: async () => {
      const response = await fetch('https://ipapi.co/json/');
      if (!response.ok) {
        throw new Error('Failed to fetch location');
      }
      return response.json();
    },
    staleTime: Infinity, // Never refetch
    gcTime: Infinity, // Keep in cache forever
  });

  const { data: nextRace, isLoading } = useQuery({
    queryKey: ['nextRace'],
    queryFn: f1Api.getNextRace,
    refetchInterval: 1000,
  });

  const getSessionFullName = (name: string) => {
    switch (name) {
      case 'FP1':
        return 'Free Practice 1';
      case 'FP2':
        return 'Free Practice 2';
      case 'FP3':
        return 'Free Practice 3';
      case 'Q1':
        return 'Qualifying 1';
      case 'Q2':
        return 'Qualifying 2';
      case 'Q3':
        return 'Qualifying 3';
      case 'Qualifying':
        return 'Qualifying';
      case 'Race':
        return 'Race';
      default:
        return name;
    }
  };

  // Add state for mobile tap
  const [showTimezone, setShowTimezone] = useState(false);

  // Handler for tap (mobile)
  const handleTimeClick = () => setShowTimezone((prev) => !prev);

  // Countdown state for live updates
  const [now, setNow] = useState(new Date());
  useEffect(() => {
    const interval = setInterval(() => setNow(new Date()), 1000);
    return () => clearInterval(interval);
  }, []);

  // Get the next session from the race schedule
  const getNextSession = () => {
    if (!nextRace) return null;
    const sessions = [];
    if (nextRace.FirstPractice) {
      sessions.push({
        name: 'FP1',
        date: new Date(`${nextRace.FirstPractice.date}T${nextRace.FirstPractice.time}`)
      });
    }
    if (nextRace.SecondPractice) {
      sessions.push({
        name: 'FP2',
        date: new Date(`${nextRace.SecondPractice.date}T${nextRace.SecondPractice.time}`)
      });
    }
    if (nextRace.ThirdPractice) {
      sessions.push({
        name: 'FP3',
        date: new Date(`${nextRace.ThirdPractice.date}T${nextRace.ThirdPractice.time}`)
      });
    }
    if (nextRace.Qualifying) {
      sessions.push({
        name: 'Qualifying',
        date: new Date(`${nextRace.Qualifying.date}T${nextRace.Qualifying.time}`)
      });
    }
    sessions.push({
      name: 'Race',
      date: new Date(`${nextRace.date}T${nextRace.time || '14:00:00'}`)
    });
    const nextSession = sessions.find(session => session.date > now);
    return nextSession || sessions[sessions.length - 1];
  };

  const nextSession = getNextSession();

  // Convert the race time to the user's timezone based on IP location
  const { localTime, displayTimeZone } = React.useMemo(() => {
    if (!locationData?.timezone || !nextSession) return { localTime: '', displayTimeZone: '' };

    const userTimezone = locationData.timezone;
    const utcDate = new Date(nextSession.date.toISOString());
    
    // Convert to local time using Intl.DateTimeFormat
    const localTime = new Intl.DateTimeFormat('en-US', {
      timeZone: userTimezone,
      hour: 'numeric',
      minute: 'numeric',
      hour12: true
    }).format(utcDate);
    
    // Get timezone name without offset
    const timeZoneName = new Intl.DateTimeFormat('en-US', {
      timeZone: userTimezone,
      timeZoneName: 'long'
    }).formatToParts(now)
      .find(part => part.type === 'timeZoneName')?.value || '';

    // Map timezone names to more readable names
    const timeZoneMap: { [key: string]: string } = {
      'India Standard Time': 'Indian Time',
      'British Summer Time': 'UK Time',
      'Greenwich Mean Time': 'UK Time',
      'Eastern Daylight Time': 'US Eastern Time',
      'Eastern Standard Time': 'US Eastern Time',
      'Central Daylight Time': 'US Central Time',
      'Central Standard Time': 'US Central Time',
      'Pacific Daylight Time': 'US Pacific Time',
      'Pacific Standard Time': 'US Pacific Time',
      'Australian Eastern Standard Time': 'Australian Eastern Time',
      'Australian Eastern Daylight Time': 'Australian Eastern Time',
      'Japan Standard Time': 'Japan Time',
      'Central European Time': 'Central European Time',
      'Central European Summer Time': 'Central European Time',
      'Brasilia Standard Time': 'Brazil Time',
    };

    return {
      localTime,
      displayTimeZone: timeZoneMap[timeZoneName] || timeZoneName
    };
  }, [locationData?.timezone, nextSession, now]);

  if (isLoading || !locationData) {
    return (
      <Card className="bg-white border-gray-200">
        <CardContent className="p-6">
          <div className="h-32 flex items-center justify-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-red-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!nextRace) return null;
  if (!nextSession) return null;

  const timeDiff = nextSession.date.getTime() - now.getTime();
  const days = Math.floor(timeDiff / (1000 * 60 * 60 * 24));
  const hours = Math.floor((timeDiff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
  const minutes = Math.floor((timeDiff % (1000 * 60 * 60)) / (1000 * 60));
  const seconds = Math.floor((timeDiff % (1000 * 60)) / 1000);

  const formatNumber = (num: number) => {
    return num.toString().padStart(2, '0');
  };

  return (
    <Card className="bg-[linear-gradient(160deg,_#e10600_5%,_#000_55%)] rounded-2xl shadow-lg border-none py-4">
      <CardHeader className="pb-0 pt-0">
        <CardTitle className="text-white text-base font-bold flex items-center justify-center gap-2">
          {getSessionFullName(nextSession.name)}
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-2 p-0">
        <div className="flex flex-wrap items-center justify-center gap-x-2 gap-y-1 text-sm font-medium text-white text-center">
          <span>{nextRace.raceName} — {nextRace.Circuit.circuitName}</span>
          <span className="hidden sm:inline">|</span>
          <span
            className="font-semibold text-blue-100 relative cursor-pointer group select-none"
            onClick={handleTimeClick}
          >
            {localTime}
            <span
              className={
                `absolute left-1/2 -translate-x-1/2 top-full mt-1 px-2 py-1 rounded bg-black bg-opacity-80 text-xs text-white whitespace-nowrap z-10 transition-opacity duration-200 ` +
                `group-hover:opacity-100 ${showTimezone ? 'opacity-100' : 'opacity-0 pointer-events-none'}`
              }
              style={{ minWidth: 'max-content' }}
            >
              {displayTimeZone}
            </span>
          </span>
        </div>
        <div className="flex flex-row items-baseline justify-center w-full gap-2 sm:gap-4 px-2 sm:px-8 mt-2 mb-2">
          <div className="flex flex-col items-center w-16 sm:w-24">
            <span className="text-5xl sm:text-7xl font-extrabold text-white text-center" style={{ fontFamily: 'Quantico, monospace', lineHeight: 1 }}>{formatNumber(days)}</span>
            <span className="text-xs sm:text-sm text-gray-200 tracking-widest mt-1 text-center w-full">DAYS</span>
          </div>
          <span className="text-5xl sm:text-7xl font-extrabold text-white" style={{ fontFamily: 'Quantico, monospace', lineHeight: 1 }}>: </span>
          <div className="flex flex-col items-center w-16 sm:w-24">
            <span className="text-5xl sm:text-7xl font-extrabold text-white text-center" style={{ fontFamily: 'Quantico, monospace', lineHeight: 1 }}>{formatNumber(hours)}</span>
            <span className="text-xs sm:text-sm text-gray-200 tracking-widest mt-1 text-center w-full">HRS</span>
          </div>
          <span className="text-5xl sm:text-7xl font-extrabold text-white" style={{ fontFamily: 'Quantico, monospace', lineHeight: 1 }}>: </span>
          <div className="flex flex-col items-center w-16 sm:w-24">
            <span className="text-5xl sm:text-7xl font-extrabold text-white text-center" style={{ fontFamily: 'Quantico, monospace', lineHeight: 1 }}>{formatNumber(minutes)}</span>
            <span className="text-xs sm:text-sm text-gray-200 tracking-widest mt-1 text-center w-full">MINS</span>
          </div>
          <span className="text-5xl sm:text-7xl font-extrabold text-white" style={{ fontFamily: 'Quantico, monospace', lineHeight: 1 }}>: </span>
          <div className="flex flex-col items-center w-16 sm:w-24">
            <span className="text-5xl sm:text-7xl font-extrabold text-white text-center" style={{ fontFamily: 'Quantico, monospace', lineHeight: 1 }}>{formatNumber(seconds)}</span>
            <span className="text-xs sm:text-sm text-gray-200 tracking-widest mt-1 text-center w-full">SECS</span>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default SessionCountdown;
