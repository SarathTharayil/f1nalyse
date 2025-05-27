import { useQuery } from '@tanstack/react-query';
import { f1Api, RaceResult } from '../services/f1Api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { format } from 'date-fns';
import { driverMappings, constructorMappings } from '../lib/mappings';

const LastRaceResults = () => {
  const { data, isLoading } = useQuery({
    queryKey: ['lastRaceResults'],
    queryFn: f1Api.getLastRaceResults,
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

  const getDriverImage = (driverId: string) => {
    const mapping = driverMappings.find(d => d.apiName.toLowerCase() === driverId.toLowerCase());
    return mapping?.imageFile || 'default-driver.png';
  };

  const getConstructorLogo = (constructorName: string) => {
    const mapping = constructorMappings.find(c => c.displayName === constructorName);
    const logoFile = mapping?.logoFile ? mapping.logoFile.replace('.avif', '-logo.avif') : 'default-constructor-logo.avif';
    return logoFile;
  };

  if (isLoading) {
    return (
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
          <CardTitle className="text-lg sm:text-xl text-gray-900">Last Race Results</CardTitle>
        </CardHeader>
        <CardContent className="pt-4 px-2 sm:px-6">
          <div className="animate-pulse space-y-3">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded"></div>
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data || !data.results) {
    return null;
  }

  const { race, results } = data;

  return (
    <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <CardTitle className="text-lg sm:text-xl text-gray-900">
            {race.raceName}
          </CardTitle>
          <div className="text-sm text-gray-500">
            {format(new Date(race.date), 'MMMM d, yyyy')}
          </div>
        </div>
      </CardHeader>
      <CardContent className="p-0">
        {/* Table Header */}
        <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
          <div className="grid grid-cols-[40px_1fr_auto] gap-4 items-center text-sm font-medium text-gray-500">
            <div className="text-center"></div>
            <div>Driver</div>
            <div className="text-right">Points</div>
          </div>
        </div>
        
        <div className="divide-y divide-gray-100">
          {results.map((result) => {
            const driverImage = getDriverImage(result.Driver.driverId);
            const constructorLogo = getConstructorLogo(result.Constructor.name);
            
            return (
              <div 
                key={result.position} 
                className="relative flex items-center p-4 hover:bg-gray-50 transition-colors duration-200"
              >
                {/* Position Badge */}
                <div className="flex-shrink-0 w-10 flex items-center justify-center">
                  <span className={`text-xs font-medium ${
                    result.position === '1' ? 'text-f1-red' : 'text-gray-700'
                  }`}>
                    {result.position}
                  </span>
                </div>

                {/* Driver Info */}
                <div className="flex-grow flex items-center gap-4">
                  {/* Driver Image */}
                  <div className="flex-shrink-0 w-12 h-12">
                    <img 
                      src={`/images/drivers/${driverImage}`}
                      alt={`${result.Driver.givenName} ${result.Driver.familyName}`}
                      className="w-full h-full object-cover rounded-lg"
                    />
                  </div>

                  <div className="flex-grow">
                    <div className="flex items-center">
                      <h3 className="font-medium text-gray-900">
                        {result.Driver.givenName} {result.Driver.familyName}
                      </h3>
                      <img 
                        src={`/images/constructors/${constructorLogo}`}
                        alt={result.Constructor.name}
                        className="w-5 h-5 ml-2 opacity-80"
                      />
                    </div>
                    <div className="flex items-center mt-1">
                      <span className="text-sm text-gray-500">{result.Constructor.name}</span>
                      <span className="mx-2 text-gray-300">•</span>
                      <span className={`text-sm ${
                        formatTime(result) === "DNF" 
                          ? "text-red-600 font-medium" 
                          : result.Time?.time 
                            ? "text-gray-900 font-medium" 
                            : "text-gray-500"
                      }`}>
                        {formatTime(result)}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Points */}
                <div className="flex-shrink-0 ml-4">
                  <span className="text-lg font-bold text-gray-900">{result.points}</span>
                  <span className="text-xs text-gray-400 ml-1">pts</span>
                </div>
              </div>
            );
          })}
        </div>
      </CardContent>
    </Card>
  );
};

export default LastRaceResults;
