import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { f1Api } from '../services/f1Api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Statistics = () => {
  const [season, setSeason] = useState(new Date().getFullYear().toString());
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2009 }, (_, i) => (currentYear - i).toString());
  
  // Driver standings query
  const { 
    data: driverStandings, 
    isLoading: isLoadingDrivers 
  } = useQuery({
    queryKey: ['driverStandings', season],
    queryFn: () => f1Api.getDriverStandingsBySeason(season)
  });
  
  // Constructor standings query
  const { 
    data: constructorStandings, 
    isLoading: isLoadingConstructors 
  } = useQuery({
    queryKey: ['constructorStandings', season],
    queryFn: () => f1Api.getConstructorStandingsBySeason(season)
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">F1 Statistics</h1>
        
        <Select value={season} onValueChange={setSeason}>
          <SelectTrigger className="w-full sm:w-[180px]">
            <SelectValue placeholder="Select season" />
          </SelectTrigger>
          <SelectContent>
            {years.map((year) => (
              <SelectItem key={year} value={year}>
                {year} Season
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      
      <Tabs defaultValue="drivers" className="w-full">
        <TabsList className="mb-6 w-full grid grid-cols-2">
          <TabsTrigger value="drivers">Driver Standings</TabsTrigger>
          <TabsTrigger value="constructors">Constructor Standings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="drivers">
          <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <CardTitle className="text-lg sm:text-xl text-gray-900">
                {season} Driver Standings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingDrivers ? (
                <div className="animate-pulse space-y-3 p-4">
                  {[...Array(20)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-100 rounded"></div>
                  ))}
                </div>
              ) : (
                <div>
                  {/* Table Header */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="hidden sm:grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] gap-4 items-center text-sm font-medium text-gray-500">
                      <div className="text-center">Pos</div>
                      <div>Driver</div>
                      <div>Constructor</div>
                      <div className="hidden md:block">Nationality</div>
                      <div className="text-right">Points</div>
                      <div className="text-right">Wins</div>
                    </div>
                    <div className="grid sm:hidden grid-cols-[40px_1fr_auto] gap-4 items-center text-sm font-medium text-gray-500">
                      <div className="text-center">Pos</div>
                      <div>Driver</div>
                      <div className="text-right">Points</div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {driverStandings?.map((driver) => (
                      <div 
                        key={driver.position} 
                        className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="hidden sm:grid grid-cols-[40px_1fr_1fr_1fr_1fr_1fr] gap-4 items-center">
                          <div className="text-center">
                            <span className={`text-xs font-medium ${
                              driver.position === '1' ? 'text-f1-red' : 'text-gray-700'
                            }`}>
                              {driver.position}
                            </span>
                          </div>
                          <div>
                            <div className="flex items-center">
                              <span className="font-medium">{driver.Driver.givenName}</span>
                              <span className="font-medium ml-1">{driver.Driver.familyName}</span>
                            </div>
                          </div>
                          <div>
                            {driver.Constructors[0]?.name || 'Unknown'}
                          </div>
                          <div className="hidden md:block">{driver.Driver.nationality}</div>
                          <div className="text-right font-semibold">{driver.points}</div>
                          <div className="text-right">{driver.wins}</div>
                        </div>
                        <div className="grid sm:hidden grid-cols-[40px_1fr_auto] gap-4 items-center">
                          <div className="text-center">
                            <span className={`text-xs font-medium ${
                              driver.position === '1' ? 'text-f1-red' : 'text-gray-700'
                            }`}>
                              {driver.position}
                            </span>
                          </div>
                          <div>
                            <div className="flex flex-col">
                              <span className="font-medium">{driver.Driver.givenName} {driver.Driver.familyName}</span>
                              <span className="text-xs text-gray-500">
                                {driver.Constructors[0]?.name}
                              </span>
                            </div>
                          </div>
                          <div className="text-right font-semibold">{driver.points}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="constructors">
          <Card className="bg-white border-gray-200 shadow-sm overflow-hidden">
            <CardHeader className="bg-gradient-to-r from-gray-50 to-gray-100 border-b">
              <CardTitle className="text-lg sm:text-xl text-gray-900">
                {season} Constructor Standings
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {isLoadingConstructors ? (
                <div className="animate-pulse space-y-3 p-4">
                  {[...Array(10)].map((_, i) => (
                    <div key={i} className="h-8 bg-gray-100 rounded"></div>
                  ))}
                </div>
              ) : (
                <div>
                  {/* Table Header */}
                  <div className="px-4 py-3 bg-gray-50 border-b border-gray-100">
                    <div className="hidden sm:grid grid-cols-[40px_1fr_1fr_1fr_1fr] gap-4 items-center text-sm font-medium text-gray-500">
                      <div className="text-center">Pos</div>
                      <div>Constructor</div>
                      <div className="hidden md:block">Nationality</div>
                      <div className="text-right">Points</div>
                      <div className="text-right">Wins</div>
                    </div>
                    <div className="grid sm:hidden grid-cols-[40px_1fr_auto] gap-4 items-center text-sm font-medium text-gray-500">
                      <div className="text-center">Pos</div>
                      <div>Constructor</div>
                      <div className="text-right">Points</div>
                    </div>
                  </div>
                  
                  <div className="divide-y divide-gray-100">
                    {constructorStandings?.map((constructor) => (
                      <div 
                        key={constructor.position} 
                        className="px-4 py-3 hover:bg-gray-50 transition-colors duration-200"
                      >
                        <div className="hidden sm:grid grid-cols-[40px_1fr_1fr_1fr_1fr] gap-4 items-center">
                          <div className="text-center">
                            <span className={`text-xs font-medium ${
                              constructor.position === '1' ? 'text-f1-red' : 'text-gray-700'
                            }`}>
                              {constructor.position}
                            </span>
                          </div>
                          <div>
                            {constructor.Constructor.name}
                          </div>
                          <div className="hidden md:block">{constructor.Constructor.nationality}</div>
                          <div className="text-right font-semibold">{constructor.points}</div>
                          <div className="text-right">{constructor.wins}</div>
                        </div>
                        <div className="grid sm:hidden grid-cols-[40px_1fr_auto] gap-4 items-center">
                          <div className="text-center">
                            <span className={`text-xs font-medium ${
                              constructor.position === '1' ? 'text-f1-red' : 'text-gray-700'
                            }`}>
                              {constructor.position}
                            </span>
                          </div>
                          <div>
                            <div className="flex flex-col">
                              <span className="font-medium">{constructor.Constructor.name}</span>
                              <span className="text-xs text-gray-500">
                                {constructor.Constructor.nationality}
                              </span>
                            </div>
                          </div>
                          <div className="text-right font-semibold">{constructor.points}</div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Statistics;
