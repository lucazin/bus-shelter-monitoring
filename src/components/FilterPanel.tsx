import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Filter, 
  X, 
  ChevronDown,
  Bus,
  HardDrive,
  Clock,
  Package,
  Hash
} from 'lucide-react';
import type { BusShelterData } from '@/data/mockData';

export interface FilterState {
  dvrId: string;
  busId: string;
  capturedFrom: string;
  capturedTo: string;
  clipGenFrom: string;
  clipGenTo: string;
  hasObjects: 'all' | 'yes' | 'no';
  minStops: string;
  maxStops: string;
}

interface FilterPanelProps {
  shelters: BusShelterData[];
  filters: FilterState;
  onFiltersChange: (filters: FilterState) => void;
  filteredCount: number;
}

export const initialFilters: FilterState = {
  dvrId: '',
  busId: '',
  capturedFrom: '',
  capturedTo: '',
  clipGenFrom: '',
  clipGenTo: '',
  hasObjects: 'all',
  minStops: '',
  maxStops: '',
};

export function applyFilters(shelters: BusShelterData[], filters: FilterState): BusShelterData[] {
  return shelters.filter(shelter => {
    // DVR ID filter
    if (filters.dvrId && !shelter.dvrId.toLowerCase().includes(filters.dvrId.toLowerCase())) {
      return false;
    }

    // Bus ID filter
    if (filters.busId && !shelter.busId.toLowerCase().includes(filters.busId.toLowerCase())) {
      return false;
    }

    // Captured date filter
    if (filters.capturedFrom) {
      const capturedDate = new Date(shelter.capture.timestamp);
      const fromDate = new Date(filters.capturedFrom);
      if (capturedDate < fromDate) return false;
    }
    if (filters.capturedTo) {
      const capturedDate = new Date(shelter.capture.timestamp);
      const toDate = new Date(filters.capturedTo);
      toDate.setHours(23, 59, 59, 999);
      if (capturedDate > toDate) return false;
    }

    // Clip Generated date filter
    if (filters.clipGenFrom) {
      const clipDate = new Date(shelter.capture.clipGeneratedAt);
      const fromDate = new Date(filters.clipGenFrom);
      if (clipDate < fromDate) return false;
    }
    if (filters.clipGenTo) {
      const clipDate = new Date(shelter.capture.clipGeneratedAt);
      const toDate = new Date(filters.clipGenTo);
      toDate.setHours(23, 59, 59, 999);
      if (clipDate > toDate) return false;
    }

    // Has Objects filter
    if (filters.hasObjects === 'yes' && !shelter.detection.objectsFound) {
      return false;
    }
    if (filters.hasObjects === 'no' && shelter.detection.objectsFound) {
      return false;
    }

    // Bus Stops Count filter
    if (filters.minStops) {
      const min = parseInt(filters.minStops);
      if (!isNaN(min) && shelter.busStopsCount < min) return false;
    }
    if (filters.maxStops) {
      const max = parseInt(filters.maxStops);
      if (!isNaN(max) && shelter.busStopsCount > max) return false;
    }

    return true;
  });
}

export function FilterPanel({ shelters, filters, onFiltersChange, filteredCount }: FilterPanelProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  // Get unique values for dropdowns
  const uniqueDvrIds = useMemo(() => 
    [...new Set(shelters.map(s => s.dvrId))].sort(), 
    [shelters]
  );
  const uniqueBusIds = useMemo(() => 
    [...new Set(shelters.map(s => s.busId))].sort(), 
    [shelters]
  );

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (filters.dvrId) count++;
    if (filters.busId) count++;
    if (filters.capturedFrom || filters.capturedTo) count++;
    if (filters.clipGenFrom || filters.clipGenTo) count++;
    if (filters.hasObjects !== 'all') count++;
    if (filters.minStops || filters.maxStops) count++;
    return count;
  }, [filters]);

  const handleClearFilters = () => {
    onFiltersChange(initialFilters);
  };

  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value });
  };

  return (
    <div className="filter-panel-card rounded-xl overflow-hidden">
      {/* Header - Always visible */}
      <button
        onClick={() => setIsExpanded(!isExpanded)}
        className="w-full p-4 flex items-center justify-between transition-all filter-panel-header"
      >
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.08) 100%)' }}>
            <Filter className="w-5 h-5 text-blue-500" />
          </div>
          <span className="font-semibold" style={{ color: 'var(--color-foreground)' }}>Filters</span>
          {activeFiltersCount > 0 && (
            <Badge variant="default" className="bg-gradient-to-r from-blue-500 to-blue-600 text-white text-xs px-2.5 py-0.5 shadow-sm">
              {activeFiltersCount} active
            </Badge>
          )}
        </div>
        <div className="flex items-center gap-3">
          <span className="text-sm px-3 py-1 rounded-full" style={{ background: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6' }}>
            Showing <strong>{filteredCount}</strong> of {shelters.length} stops
          </span>
          <ChevronDown 
            className={`w-5 h-5 transition-transform duration-200 ${isExpanded ? 'rotate-180' : ''}`}
            style={{ color: 'var(--color-primary)' }}
          />
        </div>
      </button>

      {/* Filters Content */}
      {isExpanded && (
        <div className="p-4 pt-2 border-t" style={{ borderColor: 'var(--color-border)' }}>
          <div className="grid grid-cols-6 gap-4">
            {/* DVR ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                <HardDrive className="w-3.5 h-3.5" />
                DVR ID
              </label>
              <select
                value={filters.dvrId}
                onChange={(e) => updateFilter('dvrId', e.target.value)}
                className="w-full p-2 rounded-lg text-sm filter-input"
              >
                <option value="">All DVRs</option>
                {uniqueDvrIds.map(id => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>

            {/* Bus ID */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                <Bus className="w-3.5 h-3.5" />
                Bus ID
              </label>
              <select
                value={filters.busId}
                onChange={(e) => updateFilter('busId', e.target.value)}
                className="w-full p-2 rounded-lg text-sm filter-input"
              >
                <option value="">All Buses</option>
                {uniqueBusIds.map(id => (
                  <option key={id} value={id}>{id}</option>
                ))}
              </select>
            </div>

            {/* Captured Date */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                <Clock className="w-3.5 h-3.5" />
                Captured
              </label>
              <div className="flex gap-1">
                <input
                  type="date"
                  value={filters.capturedFrom}
                  onChange={(e) => updateFilter('capturedFrom', e.target.value)}
                  className="flex-1 p-2 rounded-lg text-xs filter-input"
                  placeholder="From"
                />
              </div>
            </div>

            {/* Clip Generated */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                <Clock className="w-3.5 h-3.5" />
                Clip Gen
              </label>
              <div className="flex gap-1">
                <input
                  type="date"
                  value={filters.clipGenFrom}
                  onChange={(e) => updateFilter('clipGenFrom', e.target.value)}
                  className="flex-1 p-2 rounded-lg text-xs filter-input"
                  placeholder="From"
                />
              </div>
            </div>

            {/* Has Objects */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                <Package className="w-3.5 h-3.5" />
                Objects
              </label>
              <select
                value={filters.hasObjects}
                onChange={(e) => updateFilter('hasObjects', e.target.value)}
                className="w-full p-2 rounded-lg text-sm filter-input"
              >
                <option value="all">All</option>
                <option value="yes">With Objects</option>
                <option value="no">No Objects</option>
              </select>
            </div>

            {/* Stops Count */}
            <div className="space-y-1.5">
              <label className="text-xs font-medium flex items-center gap-1.5" style={{ color: 'var(--color-muted-foreground)' }}>
                <Hash className="w-3.5 h-3.5" />
                Stops #
              </label>
              <div className="flex gap-1">
                <input
                  type="number"
                  value={filters.minStops}
                  onChange={(e) => updateFilter('minStops', e.target.value)}
                  className="w-1/2 p-2 rounded-lg text-xs filter-input"
                  placeholder="Min"
                  min="0"
                />
                <input
                  type="number"
                  value={filters.maxStops}
                  onChange={(e) => updateFilter('maxStops', e.target.value)}
                  className="w-1/2 p-2 rounded-lg text-xs filter-input"
                  placeholder="Max"
                  min="0"
                />
              </div>
            </div>
          </div>

          {/* Clear Filters Button */}
          {activeFiltersCount > 0 && (
            <div className="flex justify-end mt-4 pt-3 border-t" style={{ borderColor: 'var(--color-border)' }}>
              <Button
                variant="outline"
                size="sm"
                onClick={handleClearFilters}
                className="gap-2 text-sm"
              >
                <X className="w-4 h-4" />
                Clear All Filters
              </Button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}
