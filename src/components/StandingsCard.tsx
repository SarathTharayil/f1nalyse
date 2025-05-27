import { useQuery } from '@tanstack/react-query';
import { f1Api, DriverStanding, ConstructorStanding } from '../services/f1Api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { driverMappings, constructorMappings } from '../lib/mappings';

interface StandingsCardProps {
  type: 'drivers' | 'constructors';
}

const StandingsCard = ({ type }: StandingsCardProps) => {
  const { 
    data: driverStandings,
    isLoading: isDriversLoading 
  } = useQuery({
    queryKey: ['driverStandings'],
    queryFn: f1Api.getCurrentDriverStandings,
    enabled: type === 'drivers',
  });

  const { 
    data: constructorStandings,
    isLoading: isConstructorsLoading 
  } = useQuery({
    queryKey: ['constructorStandings'],
    queryFn: f1Api.getCurrentConstructorStandings,
    enabled: type === 'constructors',
  });

  const standings = type === 'drivers' ? driverStandings : constructorStandings;
  const isLoading = type === 'drivers' ? isDriversLoading : isConstructorsLoading;

  const title = type === 'drivers' ? 'DRIVER' : 'CONSTRUCTOR';
  const icon = type === 'drivers' ? '👨‍🏎️' : '🏎️';

  if (isLoading) {
    return (
      <Card className="bg-white border-gray-200 shadow-sm">
        <CardHeader className="border-b border-gray-100">
          <CardTitle className="flex items-center space-x-2 text-gray-900">
            <span className="text-xl">{icon}</span>
            <span>{title}</span>
          </CardTitle>
        </CardHeader>
        <CardContent className="pt-4">
          <div className="animate-pulse">
            <div className="flex space-x-4">
              <div className="w-24 h-24 bg-gray-200 rounded-lg"></div>
              <div className="flex-1 space-y-2">
                <div className="h-4 bg-gray-200 rounded w-3/4"></div>
                <div className="h-4 bg-gray-200 rounded w-1/2"></div>
              </div>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!standings || standings.length === 0) {
    return null;
  }

  const topStanding = standings[0];
  console.log('Top standing data:', topStanding);

  return (
    <Card className="bg-white border-gray-200 shadow-sm">
      <CardContent className="p-0">
        {type === 'drivers' ? (
          <div className="relative h-64 rounded-lg overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            {/* Driver image as background */}
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <img 
                src={`/images/drivers/${driverMappings.find(d => d.apiName.toLowerCase() === (topStanding as DriverStanding).Driver.driverId.toLowerCase())?.imageFile || 'default.avif'}`}
                alt={`${(topStanding as DriverStanding).Driver.givenName} ${(topStanding as DriverStanding).Driver.familyName}`}
                className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110 rounded-lg"
              />
            </div>

            {/* Title */}
            <div className="absolute top-4 left-4">
              <h2 className="text-xs sm:text-sm font-semibold text-white">{title}</h2>
            </div>

            {/* Wins indicator */}
            <div className="absolute top-4 right-4">
              <p className="text-xs sm:text-sm font-semibold text-white/90">WINS: {topStanding.wins}</p>
            </div>

            {/* Content overlay */}
            <div className="relative h-full flex flex-col justify-end">
              {/* Stats bar */}
              <div className="bg-black/80 backdrop-blur-sm px-3 sm:px-4 py-2 transition-all duration-300 group-hover:bg-black/90">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-white">
                      {(topStanding as DriverStanding).Driver.givenName} {(topStanding as DriverStanding).Driver.familyName}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-300">{(topStanding as DriverStanding).Constructors[0]?.name}</p>
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-f1-red">{topStanding.points}</p>
                    <p className="text-[10px] sm:text-xs text-gray-300">Points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="relative h-64 rounded-lg overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
            {/* Constructor image as background */}
            <div className="absolute inset-0 overflow-hidden rounded-lg">
              <img 
                src={`/images/constructors/${constructorMappings.find(c => c.apiName === (topStanding as ConstructorStanding).Constructor.name)?.logoFile || 'default.avif'}`}
                alt={(topStanding as ConstructorStanding).Constructor.name}
                className="w-full h-full object-contain p-8 sm:p-12 transition-transform duration-500 group-hover:scale-110 rounded-lg"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-black/0 to-transparent" />
            </div>

            {/* Title */}
            <div className="absolute top-4 left-4">
              <h2 className="text-xs sm:text-lg font-semibold text-zinc-900">{title}</h2>
            </div>

            {/* Wins indicator */}
            <div className="absolute top-4 right-4">
              <p className="text-xs sm:text-sm font-semibold text-zinc-900">WINS: {topStanding.wins}</p>
            </div>

            {/* Content overlay */}
            <div className="relative h-full flex flex-col justify-end">
              {/* Stats bar */}
              <div className="bg-black/80 backdrop-blur-sm px-3 sm:px-4 py-2 transition-all duration-300 group-hover:bg-black/90">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-base sm:text-xl font-bold text-white">
                      {(topStanding as ConstructorStanding).Constructor.name}
                    </h3>
                    <p className="text-[10px] sm:text-xs text-gray-300">{(topStanding as ConstructorStanding).Constructor.nationality}</p>
                  </div>
                  <div>
                    <p className="text-lg sm:text-2xl font-bold text-f1-red">{topStanding.points}</p>
                    <p className="text-[10px] sm:text-xs text-gray-300">Points</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default StandingsCard;
