import { useState, useEffect } from 'react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription 
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { 
  HardDrive, 
  MapPin, 
  Clock, 
  AlertTriangle, 
  CheckCircle, 
  XCircle,
  Package,
  Users,
  Video,
  ChevronRight,
  ArrowLeft,
  StopCircle,
  History
} from 'lucide-react';
import type { BusShelterData } from '@/data/mockData';

interface ShelterDialogProps {
  shelter: BusShelterData | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

type ViewMode = 'summary' | 'details' | 'history';

export function ShelterDialog({ shelter, open, onOpenChange }: ShelterDialogProps) {
  const [viewMode, setViewMode] = useState<ViewMode>('summary');

  // Reset to summary view when dialog closes
  useEffect(() => {
    if (!open) {
      setViewMode('summary');
    }
  }, [open]);

  if (!shelter) return null;

  const getStatusBadge = () => {
    switch (shelter.status) {
      case 'good':
        return <Badge variant="success" className="gap-1"><CheckCircle className="w-3 h-3" /> Good Condition</Badge>;
      case 'warning':
        return <Badge variant="warning" className="gap-1"><AlertTriangle className="w-3 h-3" /> Warning</Badge>;
      case 'critical':
        return <Badge variant="destructive" className="gap-1"><XCircle className="w-3 h-3" /> Critical</Badge>;
    }
  };

  const getRatingColor = (rating: number): string => {
    if (rating >= 8) return '#22c55e';
    if (rating >= 5) return '#ca8a04';
    return '#ef4444';
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: '2-digit',
      day: '2-digit',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  // Summary View
  const SummaryView = () => (
    <div className="grid gap-5 mt-4">
      {/* Hero Image Section */}
      <div className="relative overflow-hidden rounded-2xl shadow-xl summary-image-card">
        <img
          src={shelter.capture.imageUrl}
          alt={`Capture from ${shelter.location.stopName}`}
          className="w-full h-52 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className="absolute top-4 right-4">
          {getStatusBadge()}
        </div>
        <div className="absolute bottom-4 left-4 right-4 flex items-end justify-between">
          <Badge className="gap-1.5 px-3 py-1.5 text-sm font-medium" style={{ backgroundColor: 'rgba(0,0,0,0.7)', backdropFilter: 'blur(8px)', border: '1px solid rgba(255,255,255,0.2)' }}>
            <Video className="w-4 h-4" />
            {shelter.capture.clipDuration}s clip
          </Badge>
          <span className="text-xs font-medium text-white/80">{formatDate(shelter.capture.timestamp)}</span>
        </div>
      </div>

      {/* Overall Rating - Premium Card */}
      <div className="p-5 rounded-2xl summary-rating-card">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-foreground)' }}>Overall Rating</p>
            <div className="flex items-baseline gap-1">
              <span className="text-6xl font-black tracking-tight" style={{ color: getRatingColor(shelter.condition.rating) }}>
                {shelter.condition.rating}
              </span>
              <span className="text-2xl font-medium" style={{ color: 'var(--color-muted-foreground)' }}>/10</span>
            </div>
            <p className="text-sm font-medium" style={{ color: 'var(--color-muted-foreground)' }}>
              {shelter.condition.rating >= 8 ? 'Excellent condition' : shelter.condition.rating >= 5 ? 'Needs attention' : 'Requires immediate action'}
            </p>
          </div>
          <div className="relative">
            <div className="w-24 h-24 rounded-full flex items-center justify-center" 
              style={{ 
                background: `conic-gradient(${getRatingColor(shelter.condition.rating)} ${shelter.condition.rating * 10}%, var(--color-border) 0%)`,
                boxShadow: `0 0 24px ${getRatingColor(shelter.condition.rating)}40`,
              }}>
              <div className="w-20 h-20 rounded-full flex items-center justify-center summary-card-inner">
                <span className="text-xl font-bold" style={{ color: getRatingColor(shelter.condition.rating) }}>
                  {shelter.condition.rating * 10}%
                </span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Info Cards Grid */}
      <div className="grid grid-cols-2 gap-4">
        {/* Address */}
        <div className="p-4 rounded-xl summary-info-card col-span-2">
          <div className="flex items-center gap-4">
            <div className="p-3 rounded-xl icon-bg-primary-lg">
              <MapPin className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-semibold uppercase tracking-wider mb-1" style={{ color: 'var(--color-muted-foreground)' }}>Bus Stop Address</p>
              <p className="font-bold text-base truncate" style={{ color: 'var(--color-foreground)' }}>{shelter.location.address}</p>
            </div>
          </div>
        </div>

        {/* Bus Stops Count */}
        <div className="p-4 rounded-xl summary-info-card">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-xl icon-bg-primary-lg mb-3">
              <StopCircle className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-foreground)' }}>Bus Stops</p>
            <p className="text-3xl font-black" style={{ color: 'var(--color-primary)' }}>{shelter.busStopsCount}</p>
          </div>
        </div>

        {/* DVR ID */}
        <div className="p-4 rounded-xl summary-info-card">
          <div className="flex flex-col items-center text-center">
            <div className="p-3 rounded-xl icon-bg-primary-lg mb-3">
              <HardDrive className="w-6 h-6" style={{ color: 'var(--color-primary)' }} />
            </div>
            <p className="text-xs font-semibold uppercase tracking-wider" style={{ color: 'var(--color-muted-foreground)' }}>DVR ID</p>
            <p className="text-lg font-bold" style={{ color: 'var(--color-foreground)' }}>{shelter.dvrId}</p>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="grid grid-cols-2 gap-4 pt-1">
        <Button 
          onClick={() => setViewMode('details')} 
          className="gap-2 py-6 text-sm font-bold rounded-xl btn-primary-glow shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
          size="lg"
        >
          View Details
          <ChevronRight className="w-5 h-5" />
        </Button>
        <Button 
          onClick={() => setViewMode('history')} 
          variant="outline"
          className="gap-2 py-6 text-sm font-bold rounded-xl summary-outline-btn transition-all duration-300"
          size="lg"
        >
          <History className="w-5 h-5" />
          See History
        </Button>
      </div>
    </div>
  );

  // Details View - Horizontal Layout
  const DetailsView = () => (
    <div className="mt-4">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => setViewMode('summary')} 
        className="w-fit gap-2 -ml-2 mb-4 rounded-lg font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Summary
      </Button>

      {/* Horizontal Layout */}
      <div className="flex gap-5">
        {/* Left Column - Image */}
        <div className="flex-shrink-0 w-72">
          <div className="relative overflow-hidden rounded-2xl shadow-lg">
            <img
              src={shelter.capture.imageUrl}
              alt={`Capture from ${shelter.location.stopName}`}
              className="w-full h-48 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
            <div className="absolute top-2 right-2">
              {getStatusBadge()}
            </div>
            <div className="absolute bottom-2 left-2">
              <Badge className="gap-1 px-2 py-1 text-xs" style={{ backgroundColor: 'rgba(0,0,0,0.6)', backdropFilter: 'blur(4px)' }}>
                <Video className="w-3 h-3" />
                {shelter.capture.clipDuration}s
              </Badge>
            </div>
            <div className="absolute bottom-2 right-2">
              <div 
                className="px-2 py-1 rounded-lg text-sm font-bold"
                style={{ 
                  backgroundColor: 'rgba(0,0,0,0.6)', 
                  backdropFilter: 'blur(4px)',
                  color: getRatingColor(shelter.condition.rating),
                }}
              >
                {shelter.condition.rating}/10
              </div>
            </div>
          </div>

          {/* IDs Below Image */}
          <div className="grid grid-cols-2 gap-2 mt-3">
            <div className="details-card p-2.5 rounded-xl">
              <p className="text-[10px] font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Bus ID</p>
              <p className="font-mono font-bold text-sm text-blue-600">{shelter.busId}</p>
            </div>
            <div className="details-card p-2.5 rounded-xl">
              <p className="text-[10px] font-medium" style={{ color: 'var(--color-muted-foreground)' }}>DVR ID</p>
              <p className="font-mono font-bold text-sm text-blue-600">{shelter.dvrId}</p>
            </div>
          </div>

          {/* Address */}
          <div className="details-card p-2.5 rounded-xl mt-2">
            <p className="text-[10px] font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Address</p>
            <p className="font-medium text-sm" style={{ color: 'var(--color-foreground)' }}>{shelter.location.address}</p>
          </div>
        </div>

        {/* Right Column - Details */}
        <div className="flex-1 grid gap-3">
          {/* Condition Scores */}
          <div className="details-card p-3 rounded-xl">
            <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--color-foreground)' }}>
              <CheckCircle className="w-3.5 h-3.5" style={{ color: '#22c55e' }} />
              Condition Scores
            </h4>
            <div className="flex gap-4 justify-center">
              <div className="text-center">
                <div 
                  className="w-11 h-11 mx-auto rounded-full flex items-center justify-center mb-1"
                  style={{ background: `conic-gradient(#22c55e ${shelter.condition.cleanlinessScore * 10}%, rgba(59, 130, 246, 0.1) 0%)` }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center details-card-inner">
                    <span className="text-xs font-bold" style={{ color: '#22c55e' }}>{shelter.condition.cleanlinessScore}</span>
                  </div>
                </div>
                <p className="text-[10px] font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Clean</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-11 h-11 mx-auto rounded-full flex items-center justify-center mb-1"
                  style={{ background: `conic-gradient(#3b82f6 ${shelter.condition.structuralScore * 10}%, rgba(59, 130, 246, 0.1) 0%)` }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center details-card-inner">
                    <span className="text-xs font-bold" style={{ color: '#3b82f6' }}>{shelter.condition.structuralScore}</span>
                  </div>
                </div>
                <p className="text-[10px] font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Struct</p>
              </div>
              <div className="text-center">
                <div 
                  className="w-11 h-11 mx-auto rounded-full flex items-center justify-center mb-1"
                  style={{ background: `conic-gradient(#ca8a04 ${shelter.condition.lightingScore * 10}%, rgba(59, 130, 246, 0.1) 0%)` }}
                >
                  <div className="w-8 h-8 rounded-full flex items-center justify-center details-card-inner">
                    <span className="text-xs font-bold" style={{ color: '#ca8a04' }}>{shelter.condition.lightingScore}</span>
                  </div>
                </div>
                <p className="text-[10px] font-medium" style={{ color: 'var(--color-muted-foreground)' }}>Light</p>
              </div>
            </div>
          </div>

          {/* Detections Row */}
          <div className="grid grid-cols-2 gap-3">
            <div className="details-card p-3 rounded-xl">
              <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--color-foreground)' }}>
                <Package className="w-3.5 h-3.5" style={{ color: '#ca8a04' }} />
                Objects
              </h4>
              {shelter.detection.objectsFound ? (
                <div>
                  <Badge variant="warning" className="text-xs mb-1">
                    {shelter.detection.objectsList.length} found
                  </Badge>
                  <ul className="text-xs list-disc list-inside" style={{ color: 'var(--color-muted-foreground)' }}>
                    {shelter.detection.objectsList.slice(0, 2).map((obj, idx) => (
                      <li key={idx}>{obj}</li>
                    ))}
                  </ul>
                </div>
              ) : (
                <Badge variant="success" className="text-xs">Clear</Badge>
              )}
            </div>
            <div className="details-card p-3 rounded-xl">
              <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--color-foreground)' }}>
                <Users className="w-3.5 h-3.5" style={{ color: '#3b82f6' }} />
                People
              </h4>
              <p className="text-3xl font-bold text-blue-500">
                {shelter.detection.personsDetected}
              </p>
            </div>
          </div>

          {/* Timestamps */}
          <div className="details-card p-3 rounded-xl">
            <h4 className="text-xs font-bold mb-2 flex items-center gap-1.5" style={{ color: 'var(--color-foreground)' }}>
              <Clock className="w-3.5 h-3.5" style={{ color: '#3b82f6' }} />
              Capture Info
            </h4>
            <div className="grid grid-cols-3 gap-2 text-xs">
              <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                <p className="font-medium text-[10px] mb-0.5" style={{ color: 'var(--color-muted-foreground)' }}>Captured</p>
                <p className="font-mono font-bold text-[11px] text-blue-600">{formatTime(shelter.capture.timestamp)}</p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                <p className="font-medium text-[10px] mb-0.5" style={{ color: 'var(--color-muted-foreground)' }}>Clip Gen</p>
                <p className="font-mono font-bold text-[11px] text-blue-600">{formatTime(shelter.capture.clipGeneratedAt)}</p>
              </div>
              <div className="p-2 rounded-lg" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.08) 0%, rgba(59, 130, 246, 0.02) 100%)', border: '1px solid rgba(59, 130, 246, 0.1)' }}>
                <p className="font-medium text-[10px] mb-0.5" style={{ color: 'var(--color-muted-foreground)' }}>Updated</p>
                <p className="font-mono font-bold text-[11px] text-blue-600">{formatTime(shelter.lastUpdate)}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );

  // History View
  const HistoryView = () => (
    <div className="grid gap-4 mt-4">
      {/* Back Button */}
      <Button 
        variant="ghost" 
        onClick={() => setViewMode('summary')} 
        className="w-fit gap-2 -ml-2 rounded-lg font-semibold"
      >
        <ArrowLeft className="w-4 h-4" />
        Back to Summary
      </Button>

      {/* History Header */}
      <div className="history-header-card flex items-center justify-between p-4 rounded-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.2) 0%, rgba(59, 130, 246, 0.08) 100%)' }}>
            <History className="w-5 h-5 text-blue-500" />
          </div>
          <div>
            <h3 className="font-bold text-base" style={{ color: 'var(--color-foreground)' }}>Stop History</h3>
            <p className="text-xs" style={{ color: 'var(--color-muted-foreground)' }}>Recent bus stop records</p>
          </div>
        </div>
        <div className="px-3 py-1.5 rounded-lg font-mono font-semibold text-sm bg-blue-500 text-white">
          {shelter.history?.length || 0} records
        </div>
      </div>

      {/* Scrollable History List */}
      <div 
        className="space-y-3 overflow-y-auto custom-scrollbar" 
        style={{ maxHeight: '380px' }}
      >
        {shelter.history?.map((item, index) => (
          <div 
            key={item.id} 
            className="history-item-card flex gap-4 p-4 rounded-xl cursor-pointer"
          >
            {/* Thumbnail */}
            <div className="relative flex-shrink-0">
              <img 
                src={item.imageUrl} 
                alt={`Stop ${index + 1}`}
                className="w-16 h-16 rounded-xl object-cover shadow-md"
                style={{ border: '2px solid rgba(59, 130, 246, 0.2)' }}
              />
              <div className="absolute -top-2 -right-2 w-6 h-6 rounded-full flex items-center justify-center text-[11px] font-bold bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-lg shadow-blue-500/30">
                {index + 1}
              </div>
            </div>
            
            {/* Info */}
            <div className="flex-1 min-w-0 flex flex-col justify-center">
              {/* Top Row: Bus ID and Rating */}
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-sm font-bold text-blue-600">{item.busId}</span>
                <span 
                  className="text-sm font-bold px-2.5 py-1 rounded-lg shadow-sm"
                  style={{ 
                    backgroundColor: `${getRatingColor(item.rating)}15`,
                    color: getRatingColor(item.rating),
                    border: `1px solid ${getRatingColor(item.rating)}30`
                  }}
                >
                  {item.rating}/10
                </span>
              </div>
              
              {/* Timestamp */}
              <div className="flex items-center gap-1.5 text-xs mb-2" style={{ color: 'var(--color-muted-foreground)' }}>
                <Clock className="w-3 h-3 text-blue-400" />
                <span>{formatDate(item.timestamp)}</span>
              </div>
              
              {/* Bottom Row: Stats */}
              <div className="flex items-center gap-4 text-xs">
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ backgroundColor: 'rgba(59, 130, 246, 0.08)', color: '#3b82f6' }}>
                  <Users className="w-3 h-3" />
                  {item.personsDetected} people
                </span>
                <span className="flex items-center gap-1.5 px-2 py-1 rounded-md" style={{ 
                  backgroundColor: item.objectsDetected.length > 0 ? 'rgba(202, 138, 4, 0.1)' : 'rgba(34, 197, 94, 0.1)',
                  color: item.objectsDetected.length > 0 ? '#ca8a04' : '#22c55e'
                }}>
                  <Package className="w-3 h-3" />
                  {item.objectsDetected.length > 0 ? `${item.objectsDetected.length} found` : 'Clear'}
                </span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );

  const getViewTitle = () => {
    switch (viewMode) {
      case 'summary': return 'Bus Stop Overview';
      case 'details': return 'Detailed Information';
      case 'history': return 'Stop History';
    }
  };

  const renderView = () => {
    switch (viewMode) {
      case 'summary': return <SummaryView />;
      case 'details': return <DetailsView />;
      case 'history': return <HistoryView />;
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className={`${viewMode === 'details' ? 'max-w-2xl' : 'max-w-lg'} max-h-[90vh] overflow-y-auto custom-scrollbar transition-all duration-300`}>
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div 
              className="p-3 rounded-xl" 
              style={{ 
                background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.3) 0%, rgba(59, 130, 246, 0.1) 100%)',
                boxShadow: '0 4px 12px rgba(59, 130, 246, 0.2)',
              }}
            >
              <MapPin className="w-6 h-6 text-blue-500" />
            </div>
            <span className="gradient-text font-bold">{shelter.location.stopName}</span>
          </DialogTitle>
          <DialogDescription className="flex items-center gap-2 text-sm font-medium">
            {getViewTitle()}
          </DialogDescription>
        </DialogHeader>

        {renderView()}
      </DialogContent>
    </Dialog>
  );
}
