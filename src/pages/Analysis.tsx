import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { f1Api } from '../services/f1Api';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  RadarChart,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  Radar,
  ScatterChart,
  Scatter,
  ZAxis,
  AreaChart,
  Area
} from 'recharts';

interface PointsProgressionData {
  round: string;
  raceName: string;
  [key: string]: string | number;
}

const Analysis = () => {
  const [season, setSeason] = useState(new Date().getFullYear().toString());
  const [selectedDriver, setSelectedDriver] = useState<string>('');
  const [selectedConstructor, setSelectedConstructor] = useState<string>('');
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 2009 }, (_, i) => (currentYear - i).toString());

  // Fetch all required data
  const { data: driverStandings } = useQuery({
    queryKey: ['driverStandings', season],
    queryFn: () => f1Api.getDriverStandingsBySeason(season)
  });

  const { data: constructorStandings } = useQuery({
    queryKey: ['constructorStandings', season],
    queryFn: () => f1Api.getConstructorStandingsBySeason(season)
  });

  const { data: schedule } = useQuery({
    queryKey: ['schedule', season],
    queryFn: () => f1Api.getSchedule()
  });

  const { data: driverStandingsProgression } = useQuery({
    queryKey: ['driverStandingsProgression', season],
    queryFn: () => f1Api.getDriverStandingsProgression(season)
  });

  const { data: constructorStandingsProgression } = useQuery({
    queryKey: ['constructorStandingsProgression', season],
    queryFn: () => f1Api.getConstructorStandingsProgression(season)
  });

  const { data: driverResults } = useQuery({
    queryKey: ['driverResults', season, selectedDriver],
    queryFn: () => f1Api.getDriverResultsBySeason(season, selectedDriver),
    enabled: !!selectedDriver
  });

  const { data: constructorResults } = useQuery({
    queryKey: ['constructorResults', season, selectedConstructor],
    queryFn: () => f1Api.getConstructorResultsBySeason(season, selectedConstructor),
    enabled: !!selectedConstructor
  });

  // Data preparation functions
  const prepareDriverPointsProgressionData = () => {
    if (!driverStandingsProgression || !schedule) return [];
    
    const topDrivers = driverStandings?.slice(0, 5) || [];
    const cumulativePoints = new Map<string, number>();
    
    // Initialize cumulative points for each driver
    topDrivers.forEach(driver => {
      cumulativePoints.set(`${driver.Driver.givenName} ${driver.Driver.familyName}`, 0);
    });

    // Sort races by round to ensure chronological order
    const sortedRaces = [...schedule].sort((a, b) => parseInt(a.round) - parseInt(b.round));
    
    return sortedRaces.map(race => {
      const data: { [key: string]: number | string } = { round: race.round, raceName: race.raceName };
      
      topDrivers.forEach(driver => {
        const driverName = `${driver.Driver.givenName} ${driver.Driver.familyName}`;
        const currentPoints = cumulativePoints.get(driverName) || 0;
        
        // Find the standings for this specific race
        const standing = driverStandingsProgression.find(s => 
          s.round === race.round && 
          s.DriverStandings.some(ds => ds.Driver.driverId === driver.Driver.driverId)
        );
        
        if (standing) {
          const driverStanding = standing.DriverStandings.find(ds => 
            ds.Driver.driverId === driver.Driver.driverId
          );
          // Get points for this specific race
          const pointsForRace = parseInt(driverStanding?.points || '0');
          // Update cumulative points by adding to current total
          cumulativePoints.set(driverName, currentPoints + pointsForRace);
        }
        
        // Use the updated cumulative points
        data[driverName] = cumulativePoints.get(driverName) || 0;
      });
      
      return data;
    });
  };

  const prepareConstructorPointsProgressionData = () => {
    if (!constructorStandingsProgression || !schedule) return [];
    
    return schedule.map(race => {
      const data: PointsProgressionData = { round: race.round, raceName: race.raceName };
      constructorStandings?.forEach(constructor => {
        const standing = constructorStandingsProgression.find(s => 
          s.round === race.round && 
          s.ConstructorStandings.some(cs => cs.Constructor.constructorId === constructor.Constructor.constructorId)
        );
        if (standing) {
          const constructorStanding = standing.ConstructorStandings.find(cs => 
            cs.Constructor.constructorId === constructor.Constructor.constructorId
          );
          data[constructor.Constructor.name] = parseInt(constructorStanding?.points || '0');
        }
      });
      return data;
    });
  };

  const prepareDriverPositionConsistencyData = () => {
    if (!driverResults) return [];
    
    const positionCounts = new Map<string, number>();
    driverResults.forEach(race => {
      const result = race.Results[0];
      if (result) {
        const position = result.position;
        positionCounts.set(position, (positionCounts.get(position) || 0) + 1);
      }
    });
    
    return Array.from(positionCounts.entries()).map(([position, count]) => ({
      position: `P${position}`,
      count
    }));
  };

  const prepareConstructorPerformanceTrendsData = () => {
    if (!constructorResults) return [];
    
    return constructorResults.map(race => {
      const result = race.Results[0];
      return {
        race: race.raceName,
        position: parseInt(result?.position || '0'),
        points: parseInt(result?.points || '0')
      };
    });
  };

  const prepareDriverLapTimeData = () => {
    if (!driverResults) return [];
    
    return driverResults.map(race => {
      const result = race.Results[0];
      return {
        race: race.raceName,
        lapTime: result?.Time?.time || '0',
        position: parseInt(result?.position || '0')
      };
    });
  };

  const prepareConstructorReliabilityData = () => {
    if (!constructorResults) return [];
    
    const reliabilityData = {
      finished: 0,
      dnf: 0,
      total: constructorResults.length
    };

    constructorResults.forEach(race => {
      const result = race.Results[0];
      if (result?.status === 'Finished') {
        reliabilityData.finished++;
      } else {
        reliabilityData.dnf++;
      }
    });

    return [
      { name: 'Finished', value: reliabilityData.finished },
      { name: 'DNF', value: reliabilityData.dnf }
    ];
  };

  const prepareDriverQualifyingPerformanceData = () => {
    if (!driverResults) return [];
    
    return driverResults.map(race => {
      const result = race.Results[0];
      return {
        race: race.raceName,
        qualifyingPosition: parseInt(result?.grid || '0'),
        racePosition: parseInt(result?.position || '0')
      };
    });
  };

  const prepareConstructorPointsDistributionData = () => {
    if (!constructorResults) return [];
    
    const pointsDistribution = new Map<string, number>();
    constructorResults.forEach(race => {
      const result = race.Results[0];
      if (result) {
        const points = parseInt(result.points || '0');
        pointsDistribution.set(points.toString(), (pointsDistribution.get(points.toString()) || 0) + 1);
      }
    });

    return Array.from(pointsDistribution.entries()).map(([points, count]) => ({
      points: points === '0' ? 'No Points' : points,
      count
    }));
  };

  // Add new data preparation functions
  const prepareDriverFastestLapData = () => {
    if (!driverResults) return [];
    
    return driverResults.map(race => {
      const result = race.Results[0];
      return {
        race: race.raceName,
        fastestLapRank: parseInt(result?.FastestLap?.rank || '0'),
        fastestLapTime: result?.FastestLap?.Time?.time || '0',
        averageSpeed: parseFloat(result?.FastestLap?.AverageSpeed?.speed || '0')
      };
    });
  };

  const prepareDriverOvertakingData = () => {
    if (!driverResults) return [];
    
    return driverResults.map(race => {
      const result = race.Results[0];
      const gridPosition = parseInt(result?.grid || '0');
      const finishPosition = parseInt(result?.position || '0');
      return {
        race: race.raceName,
        positionsGained: gridPosition - finishPosition,
        gridPosition,
        finishPosition
      };
    });
  };

  const prepareDriverConsistencyData = () => {
    if (!driverResults) return [];
    
    const consistencyData = {
      podiums: 0,
      top5: 0,
      top10: 0,
      outsideTop10: 0
    };

    driverResults.forEach(race => {
      const position = parseInt(race.Results[0]?.position || '0');
      if (position <= 3) consistencyData.podiums++;
      else if (position <= 5) consistencyData.top5++;
      else if (position <= 10) consistencyData.top10++;
      else consistencyData.outsideTop10++;
    });

    return [
      { name: 'Podiums', value: consistencyData.podiums },
      { name: 'Top 5', value: consistencyData.top5 },
      { name: 'Top 10', value: consistencyData.top10 },
      { name: 'Outside Top 10', value: consistencyData.outsideTop10 }
    ];
  };

  const prepareDriverPointsPerRaceData = () => {
    if (!driverResults) return [];
    
    return driverResults.map(race => {
      const result = race.Results[0];
      return {
        race: race.raceName,
        points: parseFloat(result?.points || '0'),
        position: parseInt(result?.position || '0')
      };
    });
  };

  const prepareDriverDNFData = () => {
    if (!driverResults) return [];
    
    const dnfReasons = new Map<string, number>();
    driverResults.forEach(race => {
      const result = race.Results[0];
      if (result?.status !== 'Finished') {
        dnfReasons.set(result?.status || 'Unknown', (dnfReasons.get(result?.status || 'Unknown') || 0) + 1);
      }
    });

    return Array.from(dnfReasons.entries()).map(([reason, count]) => ({
      reason,
      count
    }));
  };

  const prepareDriverHeadToHeadData = () => {
    if (!driverResults || !driverStandings) return [];
    
    const topDrivers = driverStandings.slice(0, 5);
    return driverResults.map(race => {
      const data: { race: string; [key: string]: number } = { race: race.raceName };
      topDrivers.forEach(driver => {
        const driverResult = race.Results.find(r => 
          r.Driver.driverId === driver.Driver.driverId
        );
        data[`${driver.Driver.givenName} ${driver.Driver.familyName}`] = 
          parseInt(driverResult?.position || '0');
      });
      return data;
    });
  };

  // Colors for charts
  const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#8884D8'];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-8">
      {/* Work in Progress Banner */}
      <div className="bg-yellow-50 border-l-4 border-yellow-400 p-4 mb-6">
        <div className="flex">
          <div className="flex-shrink-0">
            <svg className="h-5 w-5 text-yellow-400" viewBox="0 0 20 20" fill="currentColor">
              <path fillRule="evenodd" d="M8.257 3.099c.765-1.36 2.722-1.36 3.486 0l5.58 9.92c.75 1.334-.213 2.98-1.742 2.98H4.42c-1.53 0-2.493-1.646-1.743-2.98l5.58-9.92zM11 13a1 1 0 11-2 0 1 1 0 012 0zm-1-8a1 1 0 00-1 1v3a1 1 0 002 0V6a1 1 0 00-1-1z" clipRule="evenodd" />
            </svg>
          </div>
          <div className="ml-3">
            <p className="text-sm text-yellow-700">
              <strong className="font-medium">Work in Progress - Demo Page</strong>
              <br />
              This is a demonstration of the F1 Analysis features. Data and visualizations are being continuously improved.
            </p>
          </div>
        </div>
      </div>

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 space-y-4 sm:space-y-0">
        <h1 className="text-2xl sm:text-3xl font-bold text-gray-900">F1 Analysis</h1>
        
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
          <TabsTrigger value="drivers">Driver Analysis</TabsTrigger>
          <TabsTrigger value="constructors">Constructor Analysis</TabsTrigger>
        </TabsList>

        <TabsContent value="drivers">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Points Progression */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Points Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareDriverPointsProgressionData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="raceName" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {driverStandings?.slice(0, 5).map((driver, index) => (
                        <Line
                          key={driver.Driver.driverId}
                          type="monotone"
                          dataKey={`${driver.Driver.givenName} ${driver.Driver.familyName}`}
                          stroke={COLORS[index % COLORS.length]}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Position Consistency */}
        <Card>
          <CardHeader>
                <CardTitle>Position Consistency</CardTitle>
          </CardHeader>
          <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareDriverPositionConsistencyData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="position" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="Number of Times" />
                    </BarChart>
                  </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

            {/* Lap Time Analysis */}
        <Card>
          <CardHeader>
                <CardTitle>Lap Time Analysis</CardTitle>
          </CardHeader>
          <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={prepareDriverLapTimeData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="race" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="lapTime" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

            {/* Qualifying vs Race Performance */}
        <Card>
          <CardHeader>
            <CardTitle>Qualifying vs Race Performance</CardTitle>
          </CardHeader>
          <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="qualifyingPosition" name="Qualifying Position" />
                      <YAxis dataKey="racePosition" name="Race Position" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Scatter name="Performance" data={prepareDriverQualifyingPerformanceData()} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Fastest Lap Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Fastest Lap Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareDriverFastestLapData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="race" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="fastestLapRank" fill="#8884d8" name="Fastest Lap Rank" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Overtaking Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Overtaking Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareDriverOvertakingData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="race" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="positionsGained" fill="#82ca9d" name="Positions Gained" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Consistency */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Consistency</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareDriverConsistencyData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {prepareDriverConsistencyData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Points per Race */}
            <Card>
              <CardHeader>
                <CardTitle>Points per Race</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={prepareDriverPointsPerRaceData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="race" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Area type="monotone" dataKey="points" stroke="#8884d8" fill="#8884d8" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* DNF Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>DNF Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareDriverDNFData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="reason" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#ff8042" name="Number of DNFs" />
                    </BarChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Head-to-Head Comparison */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Head-to-Head Comparison</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareDriverHeadToHeadData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="race" angle={-45} textAnchor="end" height={70} />
                      <YAxis reversed />
                      <Tooltip />
                      <Legend />
                      {driverStandings?.slice(0, 5).map((driver, index) => (
                        <Line
                          key={driver.Driver.driverId}
                          type="monotone"
                          dataKey={`${driver.Driver.givenName} ${driver.Driver.familyName}`}
                          stroke={COLORS[index % COLORS.length]}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="constructors">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Constructor Points Progression */}
            <Card className="col-span-2">
              <CardHeader>
                <CardTitle>Points Progression</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[400px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={prepareConstructorPointsProgressionData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="raceName" angle={-45} textAnchor="end" height={70} />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      {constructorStandings?.map((constructor, index) => (
                        <Line
                          key={constructor.Constructor.constructorId}
                          type="monotone"
                          dataKey={constructor.Constructor.name}
                          stroke={COLORS[index % COLORS.length]}
                          strokeWidth={2}
                        />
                      ))}
                    </LineChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Reliability Analysis */}
            <Card>
              <CardHeader>
                <CardTitle>Reliability Analysis</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie
                        data={prepareConstructorReliabilityData()}
                        dataKey="value"
                        nameKey="name"
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        label={({ name, value }) => `${name}: ${value}`}
                      >
                        {prepareConstructorReliabilityData().map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                        ))}
                      </Pie>
                      <Tooltip />
                      <Legend />
                    </PieChart>
                  </ResponsiveContainer>
                </div>
              </CardContent>
            </Card>

            {/* Performance Trends */}
            <Card>
              <CardHeader>
                <CardTitle>Performance Trends</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <ScatterChart>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="race" name="Race" />
                      <YAxis dataKey="position" name="Position" />
                      <ZAxis dataKey="points" name="Points" />
                      <Tooltip cursor={{ strokeDasharray: '3 3' }} />
                      <Legend />
                      <Scatter name="Race Performance" data={prepareConstructorPerformanceTrendsData()} fill="#8884d8" />
                    </ScatterChart>
                  </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

            {/* Points Distribution */}
        <Card>
          <CardHeader>
                <CardTitle>Points Distribution</CardTitle>
          </CardHeader>
          <CardContent>
                <div className="h-[300px]">
                  <ResponsiveContainer width="100%" height="100%">
                    <BarChart data={prepareConstructorPointsDistributionData()}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="points" />
                      <YAxis />
                      <Tooltip />
                      <Legend />
                      <Bar dataKey="count" fill="#8884d8" name="Number of Times" />
                    </BarChart>
                  </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default Analysis;
