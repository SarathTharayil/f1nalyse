import { useState, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { f1Api, RaceResult } from '../services/f1Api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { format } from 'date-fns';

const Results = () => {
  const [selectedRace, setSelectedRace] = useState<string>('');
  
  const { data: schedule, isLoading: isLoadingSchedule } = useQuery({
    queryKey: ['schedule'],
    queryFn: f1Api.getSchedule,
  });

  const { data: lastRace } = useQuery({
    queryKey: ['lastRaceResults'],
    queryFn: f1Api.getLastRaceResults,
  });

  // Set the default selected race to the last race
  useEffect(() => {
    if (lastRace && !selectedRace) {
      setSelectedRace(lastRace.race.round);
    }
  }, [lastRace, selectedRace]);

  const { data: raceResults, isLoading: isLoadingResults } = useQuery({
    queryKey: ['raceResults', selectedRace],
    queryFn: async () => {
      if (!selectedRace) return null;
      const response = await fetch(`https://api.jolpi.ca/ergast/f1/current/${selectedRace}/results.json`);
      const data = await response.json();
      return data.MRData.RaceTable.Races[0];
    },
    enabled: !!selectedRace,
  });

  const formatTime = (result: RaceResult) => {
    if (result.Time?.time) {
      return result.Time.time;
    }
    
    if (result.status.includes("Lap")) {
      return result.status;
    }
    
    return "DNF";
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">Race Results</h1>
        
        <Select value={selectedRace} onValueChange={setSelectedRace}>
          <SelectTrigger className="w-full sm:w-[300px]">
            <SelectValue placeholder="Select a race" />
          </SelectTrigger>
          <SelectContent>
            {schedule?.map((race) => (
              <SelectItem key={race.round} value={race.round}>
                Round {race.round}: {race.raceName}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {selectedRace && (
        <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
          <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
            <CardTitle className="text-lg sm:text-xl text-gray-900">
              {raceResults?.raceName} - {raceResults && format(new Date(raceResults.date), 'MMMM d, yyyy')}
            </CardTitle>
          </CardHeader>
          <CardContent className="p-0">
            {isLoadingResults ? (
              <div className="animate-pulse space-y-3 p-4">
                {[...Array(20)].map((_, i) => (
                  <div key={i} className="h-8 bg-gray-100 rounded"></div>
                ))}
              </div>
            ) : raceResults ? (
              <div>
                {/* Table Header */}
                <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                  <div className="hidden sm:grid grid-cols-[40px_1fr_1fr_1fr_1fr] gap-4 items-center text-sm font-medium text-gray-500">
                    <div className="text-center">Pos</div>
                    <div>Driver</div>
                    <div>Constructor</div>
                    <div>Time/Status</div>
                    <div className="text-right">Points</div>
                  </div>
                  <div className="grid sm:hidden grid-cols-[40px_1fr_auto] gap-4 items-center text-sm font-medium text-gray-500">
                    <div className="text-center">Pos</div>
                    <div>Driver</div>
                    <div className="text-right">Points</div>
                  </div>
                </div>
                
                <div className="divide-y divide-gray-100">
                  {raceResults.Results?.map((result: RaceResult) => (
                    <div 
                      key={result.position} 
                      className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                    >
                      <div className="hidden sm:grid grid-cols-[40px_1fr_1fr_1fr_1fr] gap-4 items-center">
                        <div className="text-center">
                          <span className={`text-xs font-medium ${
                            result.position === '1' ? 'text-f1-red' : 'text-gray-700'
                          }`}>
                            {result.position}
                          </span>
                        </div>
                        <div>
                          <div className="flex items-center">
                            <span className="font-medium">{result.Driver.givenName}</span>
                            <span className="font-medium ml-1">{result.Driver.familyName}</span>
                          </div>
                        </div>
                        <div>{result.Constructor.name}</div>
                        <div>{formatTime(result)}</div>
                        <div className="text-right font-medium">{result.points}</div>
                      </div>
                      <div className="grid sm:hidden grid-cols-[40px_1fr_auto] gap-4 items-center">
                        <div className="text-center">
                          <span className={`text-xs font-medium ${
                            result.position === '1' ? 'text-f1-red' : 'text-gray-700'
                          }`}>
                            {result.position}
                          </span>
                        </div>
                        <div>
                          <div className="flex flex-col">
                            <span className="font-medium">{result.Driver.givenName} {result.Driver.familyName}</span>
                            <span className="text-xs text-gray-500">
                              {result.Constructor.name}
                            </span>
                          </div>
                        </div>
                        <div className="text-right font-medium">{result.points}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="text-center py-8 text-gray-500">
                Select a race to view results
              </div>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default Results;
