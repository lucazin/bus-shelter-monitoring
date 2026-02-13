import { useState, useCallback, useRef, useMemo } from 'react';
import L from 'leaflet';
import { BusMap } from '@/components/BusMap';
import { ShelterDialog } from '@/components/ShelterDialog';
import { NewStopNotification } from '@/components/NewStopNotification';
import { FilterPanel, applyFilters, initialFilters } from '@/components/FilterPanel';
import type { FilterState } from '@/components/FilterPanel';
import { busShelterMockData, getRandomLocalImage } from '@/data/mockData';
import type { BusShelterData } from '@/data/mockData';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { useTheme } from '@/context/ThemeContext';
import { 
  Bus,
  MapPin, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  RefreshCw,
  Sun,
  Moon,
  Play,
  Loader2,
  Map,
  List
} from 'lucide-react';

// Function to generate a new random stop
const generateNewStop = (existingCount: number): BusShelterData => {
  const stopNames = [
    'Legacy West Station', 'Shops at Willow Bend', 'Medical District Stop',
    'Preston Hollow Center', 'Bishop Arts District', 'Deep Ellum Station',
    'Uptown Transit Hub', 'Knox-Henderson Stop', 'Greenville Avenue Station'
  ];
  const addresses = [
    '5800 Legacy Dr, Plano, TX', '6121 W Park Blvd, Plano, TX',
    '8300 Douglas Ave, Dallas, TX', '6500 Preston Rd, Dallas, TX',
    '400 N Bishop Ave, Dallas, TX', '2800 Main St, Dallas, TX',
    '3200 McKinney Ave, Dallas, TX', '4100 Knox St, Dallas, TX'
  ];

  const id = `BS-${String(existingCount + 1).padStart(3, '0')}`;
  const busId = `BUS-${Math.floor(1000 + Math.random() * 9000)}`;
  const dvrId = `DVR-${String.fromCharCode(65 + Math.floor(Math.random() * 26))}${String(Math.floor(100 + Math.random() * 900)).padStart(3, '0')}`;
  
  // Random location near Dallas/Plano area
  const baseLat = 32.9 + Math.random() * 0.3;
  const baseLng = -96.6 - Math.random() * 0.3;
  const rating = Math.floor(7 + Math.random() * 4); // 7-10
  const now = new Date().toISOString();
  
  // Use local images from assets
  const captureImage = getRandomLocalImage();
  const historyImage = getRandomLocalImage();

  return {
    id,
    busId,
    dvrId,
    busStopsCount: Math.floor(20 + Math.random() * 50),
    location: {
      lat: baseLat,
      lng: baseLng,
      address: addresses[Math.floor(Math.random() * addresses.length)],
      stopName: stopNames[Math.floor(Math.random() * stopNames.length)],
    },
    status: 'good',
    condition: {
      rating,
      cleanlinessScore: Math.floor(7 + Math.random() * 4),
      structuralScore: Math.floor(8 + Math.random() * 3),
      lightingScore: Math.floor(7 + Math.random() * 4),
    },
    detection: {
      objectsFound: false,
      objectsList: [],
      personsDetected: Math.floor(Math.random() * 8),
    },
    capture: {
      timestamp: now,
      clipDuration: 3,
      clipGeneratedAt: now,
      imageUrl: captureImage,
    },
    lastUpdate: now,
    history: [
      {
        id: `${id}-H1`,
        busId,
        dvrId,
        timestamp: now,
        imageUrl: historyImage,
        rating,
        personsDetected: Math.floor(Math.random() * 5),
        objectsDetected: [],
      }
    ]
  };
};

function App() {
  const [shelters, setShelters] = useState<BusShelterData[]>(busShelterMockData);
  const [selectedShelter, setSelectedShelter] = useState<BusShelterData | null>(null);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [lastRefresh, setLastRefresh] = useState<Date>(new Date());
  const [newStopNotificationOpen, setNewStopNotificationOpen] = useState(false);
  const [newlyInsertedStop, setNewlyInsertedStop] = useState<BusShelterData | null>(null);
  const [filters, setFilters] = useState<FilterState>(initialFilters);
  const [viewMode, setViewMode] = useState<'map' | 'list'>('map');
  const [isSimulatingWorkflow, setIsSimulatingWorkflow] = useState(false);
  const { theme, toggleTheme } = useTheme();
  const mapRef = useRef<L.Map | null>(null);

  // Apply filters to shelters
  const filteredShelters = useMemo(() => 
    applyFilters(shelters, filters), 
    [shelters, filters]
  );

  const handleMarkerClick = useCallback((shelter: BusShelterData) => {
    setSelectedShelter(shelter);
    setDialogOpen(true);
  }, []);

  const handleWorkflowComplete = useCallback(() => {
    // Generate and insert a new stop
    const newStop = generateNewStop(shelters.length);
    setShelters(prev => [...prev, newStop]);
    setNewlyInsertedStop(newStop);
    setNewStopNotificationOpen(true);
    setLastRefresh(new Date());
    
    // Pan map to new stop location
    if (mapRef.current) {
      mapRef.current.flyTo([newStop.location.lat, newStop.location.lng], 14, {
        duration: 1.5
      });
    }
  }, [shelters.length]);

  const handleViewNewStop = useCallback(() => {
    if (newlyInsertedStop) {
      setNewStopNotificationOpen(false);
      setSelectedShelter(newlyInsertedStop);
      setDialogOpen(true);
    }
  }, [newlyInsertedStop]);

  const handleSimulateWorkflow = useCallback(async () => {
    if (isSimulatingWorkflow) return;

    setIsSimulatingWorkflow(true);
    await new Promise(resolve => setTimeout(resolve, 1200));
    handleWorkflowComplete();
    setIsSimulatingWorkflow(false);
  }, [handleWorkflowComplete, isSimulatingWorkflow]);

  const stats = {
    total: filteredShelters.length,
    good: filteredShelters.filter(s => s.status === 'good').length,
    warning: filteredShelters.filter(s => s.status === 'warning').length,
    critical: filteredShelters.filter(s => s.status === 'critical').length,
  };

  return (
    <div className="min-h-screen flex flex-col" style={{ backgroundColor: 'var(--color-background)', color: 'var(--color-foreground)' }}>
      {/* Header */}
      <header className="header-blur sticky top-0 z-50">
        <div className="container mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 via-blue-600 to-blue-700 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/30">
                <Bus className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-2xl font-bold gradient-text">
                  Luminator Bus Shelter
                </h1>
                <p className="text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
                  Bus Stop Monitoring System
                </p>
              </div>
            </div>
            <div className="flex items-center gap-4">
              <div className="glass-effect flex items-center gap-2 px-4 py-2 rounded-full text-sm">
                <div className="w-2 h-2 rounded-full bg-green-500 pulse-live"></div>
                <RefreshCw className="w-4 h-4" style={{ color: 'var(--color-muted-foreground)' }} />
                <span style={{ color: 'var(--color-muted-foreground)' }}>
                  Last update: {lastRefresh.toLocaleTimeString('en-US')}
                </span>
              </div>
              <Button
                onClick={handleSimulateWorkflow}
                disabled={isSimulatingWorkflow}
                className="gap-2 btn-primary-glow px-4 py-2 text-sm font-semibold"
              >
                {isSimulatingWorkflow ? (
                  <>
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Processando...
                  </>
                ) : (
                  <>
                    <Play className="w-4 h-4" />
                    Simular Workflow
                  </>
                )}
              </Button>
              <Button 
                variant="outline" 
                size="icon" 
                onClick={toggleTheme} 
                className="rounded-full w-10 h-10 glass-effect border-0"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
              </Button>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="flex-1 container mx-auto px-4 py-6 flex flex-col gap-5">
        {/* Filter Panel */}
        <FilterPanel 
          shelters={shelters}
          filters={filters}
          onFiltersChange={setFilters}
          filteredCount={filteredShelters.length}
        />

        {/* Stats Bar */}
        <div className="grid grid-cols-4 gap-5">
          <div className="card-elevated stat-card stat-card-blue p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl icon-glow icon-glow-blue" style={{ backgroundColor: 'rgba(59, 130, 246, 0.15)' }}>
              <MapPin className="w-6 h-6 text-blue-500" />
            </div>
            <div>
              <p className="text-3xl font-bold">{stats.total}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Total Stops</p>
            </div>
          </div>
          <div className="card-elevated stat-card stat-card-green p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl icon-glow icon-glow-green" style={{ backgroundColor: 'rgba(34, 197, 94, 0.15)' }}>
              <CheckCircle className="w-6 h-6 text-green-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-green-500">{stats.good}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Good Condition</p>
            </div>
          </div>
          <div className="card-elevated stat-card stat-card-yellow p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl icon-glow icon-glow-yellow" style={{ backgroundColor: 'rgba(234, 179, 8, 0.15)' }}>
              <AlertTriangle className="w-6 h-6 text-yellow-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-yellow-500">{stats.warning}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Warning</p>
            </div>
          </div>
          <div className="card-elevated stat-card stat-card-red p-5 flex items-center gap-4">
            <div className="p-3 rounded-xl icon-glow icon-glow-red" style={{ backgroundColor: 'rgba(239, 68, 68, 0.15)' }}>
              <XCircle className="w-6 h-6 text-red-500" />
            </div>
            <div>
              <p className="text-3xl font-bold text-red-500">{stats.critical}</p>
              <p className="text-sm font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Critical</p>
            </div>
          </div>
        </div>

        {/* Map Container */}
        <div className="flex-1 relative map-container" style={{ minHeight: '500px' }}>
          <div className="absolute top-4 right-4 z-[1000] flex gap-2">
            {/* View Toggle */}
            <div className="glass-effect flex rounded-lg overflow-hidden border-0">
              <button
                onClick={() => setViewMode('map')}
                className={`px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium transition-all duration-200 ${
                  viewMode === 'map' 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'hover:bg-blue-500/10'
                }`}
                style={{ color: viewMode === 'map' ? 'white' : 'var(--color-foreground)' }}
              >
                <Map className="w-4 h-4" />
                Map
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`px-3 py-1.5 flex items-center gap-1.5 text-sm font-medium transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-blue-500 text-white shadow-lg shadow-blue-500/30' 
                    : 'hover:bg-blue-500/10'
                }`}
                style={{ color: viewMode === 'list' ? 'white' : 'var(--color-foreground)' }}
              >
                <List className="w-4 h-4" />
                List
              </button>
            </div>
            {/* Legend */}
            <Badge variant="outline" className="glass-effect px-3 py-1.5 text-sm font-medium border-0">
              <span className="w-2.5 h-2.5 rounded-full bg-green-500 mr-2 shadow-lg shadow-green-500/50"></span>
              Good
            </Badge>
            <Badge variant="outline" className="glass-effect px-3 py-1.5 text-sm font-medium border-0">
              <span className="w-2.5 h-2.5 rounded-full bg-yellow-500 mr-2 shadow-lg shadow-yellow-500/50"></span>
              Warning
            </Badge>
            <Badge variant="outline" className="glass-effect px-3 py-1.5 text-sm font-medium border-0">
              <span className="w-2.5 h-2.5 rounded-full bg-red-500 mr-2 shadow-lg shadow-red-500/50"></span>
              Critical
            </Badge>
          </div>
          
          {viewMode === 'map' ? (
            <BusMap shelters={filteredShelters} onMarkerClick={handleMarkerClick} mapRef={mapRef} />
          ) : (
            <div className="h-full overflow-auto p-4 custom-scrollbar" style={{ backgroundColor: 'var(--color-background)' }}>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {filteredShelters.map((shelter) => (
                  <div 
                    key={shelter.id} 
                    className="list-view-card rounded-xl overflow-hidden cursor-pointer"
                    onClick={() => handleMarkerClick(shelter)}
                  >
                    <div className="relative h-40">
                      <img 
                        src={shelter.capture.imageUrl} 
                        alt={shelter.location.stopName}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                      <div className="absolute top-3 right-3">
                        <Badge 
                          variant={shelter.status === 'good' ? 'success' : shelter.status === 'warning' ? 'warning' : 'destructive'}
                          className="gap-1 text-xs"
                        >
                          {shelter.status === 'good' && <CheckCircle className="w-3 h-3" />}
                          {shelter.status === 'warning' && <AlertTriangle className="w-3 h-3" />}
                          {shelter.status === 'critical' && <XCircle className="w-3 h-3" />}
                          {shelter.status.charAt(0).toUpperCase() + shelter.status.slice(1)}
                        </Badge>
                      </div>
                      <div className="absolute bottom-3 left-3 right-3 text-white">
                        <p className="font-bold text-lg truncate drop-shadow-lg">{shelter.location.stopName}</p>
                        <p className="text-xs opacity-90 flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3" />
                          {shelter.location.address}
                        </p>
                      </div>
                    </div>
                    <div className="p-4 grid grid-cols-3 gap-2">
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-muted-foreground)' }}>Rating</p>
                        <p className="text-lg font-black" style={{ color: shelter.condition.rating >= 8 ? '#22c55e' : shelter.condition.rating >= 5 ? '#ca8a04' : '#ef4444' }}>
                          {shelter.condition.rating}/10
                        </p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-muted-foreground)' }}>Bus ID</p>
                        <p className="text-sm font-bold font-mono" style={{ color: 'var(--color-foreground)' }}>{shelter.busId}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] font-bold uppercase tracking-wider" style={{ color: 'var(--color-muted-foreground)' }}>Stops</p>
                        <p className="text-lg font-black" style={{ color: 'var(--color-primary)' }}>{shelter.busStopsCount}</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </main>

      {/* Footer */}
      <footer className="py-4 header-blur">
        <div className="container mx-auto px-4 text-center text-sm" style={{ color: 'var(--color-muted-foreground)' }}>
          © 2026 Luminator Bus Shelter Monitoring System • Develop by Lucas Bergamo
        </div>
      </footer>

      {/* Dialog */}
      <ShelterDialog
        shelter={selectedShelter}
        open={dialogOpen}
        onOpenChange={setDialogOpen}
      />

      {/* New Stop Notification */}
      <NewStopNotification
        open={newStopNotificationOpen}
        onOpenChange={setNewStopNotificationOpen}
        shelter={newlyInsertedStop}
        onViewDetails={handleViewNewStop}
      />
    </div>
  );
}

export default App;
