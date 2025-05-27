import { driverMappings, constructorMappings } from '../lib/mappings';
import { Card, CardContent } from "@/components/ui/card";

const ImageTest = () => {
  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-6">Driver Images Test</h1>
      <div className="grid grid-cols-2 gap-4 mb-8">
        {driverMappings.map((driver) => (
          <Card key={driver.apiName} className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <div className="relative h-64 rounded-lg overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <img 
                    src={`/images/drivers/${driver.imageFile}`}
                    alt={driver.displayName}
                    className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-110 rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="absolute top-4 left-4">
                  <h2 className="text-sm sm:text-lg font-semibold text-white">DRIVER</h2>
                </div>

                <div className="relative h-full flex flex-col justify-end">
                  <div className="bg-black/80 backdrop-blur-sm px-3 sm:px-4 py-2 transition-all duration-300 group-hover:bg-black/90">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base sm:text-xl font-bold text-white">
                          {driver.displayName}
                        </h3>
                        <p className="text-[10px] sm:text-xs text-gray-300">{driver.constructor}</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <h1 className="text-2xl font-bold mb-6">Constructor Images Test</h1>
      <div className="grid grid-cols-2 gap-4">
        {constructorMappings.map((constructor) => (
          <Card key={constructor.apiName} className="bg-white border-gray-200 shadow-sm">
            <CardContent className="p-0">
              <div className="relative h-64 rounded-lg overflow-hidden group transition-all duration-300 hover:scale-[1.02] hover:shadow-xl">
                <div className="absolute inset-0 overflow-hidden rounded-lg">
                  <img 
                    src={`/images/constructors/${constructor.logoFile}`}
                    alt={constructor.displayName}
                    className="w-full h-full object-contain p-8 sm:p-12 transition-transform duration-500 group-hover:scale-110 rounded-lg"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/40 to-transparent" />
                </div>

                <div className="absolute top-4 left-4">
                  <h2 className="text-sm sm:text-lg font-semibold text-white">CONSTRUCTOR</h2>
                </div>

                <div className="relative h-full flex flex-col justify-end">
                  <div className="bg-black/80 backdrop-blur-sm px-3 sm:px-4 py-2 transition-all duration-300 group-hover:bg-black/90">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-base sm:text-xl font-bold text-white">
                          {constructor.displayName}
                        </h3>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ImageTest; 