import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { CheckCircle2, MapPin, Bus, Star, Sparkles } from 'lucide-react';
import type { BusShelterData } from '@/data/mockData';

interface NewStopNotificationProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  shelter: BusShelterData | null;
  onViewDetails: () => void;
}

export function NewStopNotification({ 
  open, 
  onOpenChange, 
  shelter,
  onViewDetails 
}: NewStopNotificationProps) {
  if (!shelter) return null;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md overflow-hidden">
        {/* Success Header with Blue Gradient */}
        <div 
          className="absolute top-0 left-0 right-0 h-32"
          style={{
            background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.12) 0%, rgba(147, 197, 253, 0.08) 50%, rgba(59, 130, 246, 0.04) 100%)',
          }}
        />
        
        <DialogHeader className="relative z-10">
          <DialogTitle className="flex items-center gap-3 text-xl">
            <div 
              className="p-3.5 rounded-2xl"
              style={{
                background: 'linear-gradient(135deg, #22c55e 0%, #16a34a 100%)',
                boxShadow: '0 8px 24px rgba(34, 197, 94, 0.35)',
              }}
            >
              <CheckCircle2 className="w-6 h-6 text-white" />
            </div>
            <div>
              <span className="flex items-center gap-2 font-bold">
                New Stop Inserted!
                <Sparkles className="w-5 h-5 text-yellow-500" />
              </span>
            </div>
          </DialogTitle>
          <DialogDescription className="text-sm font-medium mt-1.5">
            A new bus stop has been successfully added to the monitoring system.
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-5 relative z-10">
          {/* Preview Image - Premium Card */}
          <div className="relative overflow-hidden rounded-2xl new-stop-image-card">
            <img
              src={shelter.capture.imageUrl}
              alt={shelter.location.stopName}
              className="w-full h-52 object-cover"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent" />
            <div className="absolute bottom-4 left-4 right-4 text-white">
              <p className="font-bold text-xl tracking-tight drop-shadow-lg">{shelter.location.stopName}</p>
              <p className="text-sm opacity-95 flex items-center gap-1.5 mt-1.5 drop-shadow-md">
                <MapPin className="w-4 h-4" />
                {shelter.location.address}
              </p>
            </div>
          </div>

          {/* Quick Info - Professional Cards */}
          <div className="grid grid-cols-3 gap-3">
            <div className="new-stop-info-card flex flex-col items-center p-4 rounded-xl">
              <div className="p-3 rounded-xl mb-2.5 icon-bg-primary-lg">
                <Bus className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-muted-foreground)' }}>Bus ID</span>
              <span className="font-mono font-bold text-sm" style={{ color: 'var(--color-foreground)' }}>{shelter.busId}</span>
            </div>
            <div className="new-stop-info-card flex flex-col items-center p-4 rounded-xl">
              <div className="p-3 rounded-xl mb-2.5" style={{ background: 'linear-gradient(135deg, rgba(34, 197, 94, 0.18) 0%, rgba(34, 197, 94, 0.08) 100%)', border: '1px solid rgba(34, 197, 94, 0.15)' }}>
                <CheckCircle2 className="w-5 h-5 text-green-500" />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-muted-foreground)' }}>Status</span>
              <span className="font-bold text-sm text-green-500 capitalize">{shelter.status}</span>
            </div>
            <div className="new-stop-info-card flex flex-col items-center p-4 rounded-xl">
              <div className="p-3 rounded-xl mb-2.5" style={{ background: 'linear-gradient(135deg, rgba(59, 130, 246, 0.18) 0%, rgba(59, 130, 246, 0.08) 100%)', border: '1px solid rgba(59, 130, 246, 0.15)' }}>
                <Star className="w-5 h-5" style={{ color: 'var(--color-primary)' }} />
              </div>
              <span className="text-[10px] font-bold uppercase tracking-widest mb-1" style={{ color: 'var(--color-muted-foreground)' }}>Rating</span>
              <span className="font-bold text-sm" style={{ color: 'var(--color-primary)' }}>{shelter.condition.rating}/10</span>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 pt-1">
            <Button 
              variant="outline" 
              className="flex-1 py-5 text-sm font-bold rounded-xl summary-outline-btn"
              onClick={() => onOpenChange(false)}
            >
              Close
            </Button>
            <Button 
              className="flex-1 gap-2 py-5 text-sm font-bold rounded-xl btn-primary-glow shadow-lg shadow-blue-500/30 hover:shadow-blue-500/50 transition-all duration-300"
              onClick={onViewDetails}
            >
              <MapPin className="w-4 h-4" />
              View on Map
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
