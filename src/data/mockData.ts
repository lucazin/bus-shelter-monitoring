export interface StopHistoryItem {
  id: string;
  busId: string;
  dvrId: string;
  timestamp: string;
  imageUrl: string;
  rating: number;
  personsDetected: number;
  objectsDetected: string[];
}

export interface BusShelterData {
  id: string;
  busId: string;
  dvrId: string;
  busStopsCount: number;
  location: {
    lat: number;
    lng: number;
    address: string;
    stopName: string;
  };
  status: 'good' | 'warning' | 'critical';
  condition: {
    rating: number; // 0-10
    cleanlinessScore: number;
    structuralScore: number;
    lightingScore: number;
  };
  detection: {
    objectsFound: boolean;
    objectsList: string[];
    personsDetected: number;
  };
  capture: {
    timestamp: string;
    clipDuration: number; // seconds
    clipGeneratedAt: string;
    imageUrl: string;
  };
  lastUpdate: string;
  history: StopHistoryItem[];
}

// Import local images
import img1 from '@/assets/1.webp';
import img2 from '@/assets/2.jpg';
import img3 from '@/assets/3.jpg';
import img4 from '@/assets/4.webp';
import img5 from '@/assets/5.jpg';
import img6 from '@/assets/6.jpg';
import img7 from '@/assets/7.jpg';
import img8 from '@/assets/8.webp';

// Array of local images for random selection
export const localImages = [img1, img2, img3, img4, img5, img6, img7, img8];

// Function to get random image from local assets
export const getRandomLocalImage = (): string => {
  return localImages[Math.floor(Math.random() * localImages.length)];
};

export const busShelterMockData: BusShelterData[] = [
  {
    id: "BS-001",
    busId: "BUS-4521",
    dvrId: "DVR-A001",
    busStopsCount: 47,
    location: {
      lat: 33.0198,
      lng: -96.6989,
      address: "1000 E 15th St, Plano, TX",
      stopName: "Downtown Plano Station"
    },
    status: "good",
    condition: {
      rating: 9,
      cleanlinessScore: 9,
      structuralScore: 10,
      lightingScore: 8
    },
    detection: {
      objectsFound: false,
      objectsList: [],
      personsDetected: 3
    },
    capture: {
      timestamp: "2026-02-02T08:45:00Z",
      clipDuration: 3,
      clipGeneratedAt: "2026-02-02T08:45:03Z",
      imageUrl: img1
    },
    lastUpdate: "2026-02-02T08:45:10Z",
    history: [
      { id: "H001-1", busId: "BUS-4521", dvrId: "DVR-A001", timestamp: "2026-02-02T08:45:00Z", imageUrl: img1, rating: 9, personsDetected: 3, objectsDetected: [] },
      { id: "H001-2", busId: "BUS-2233", dvrId: "DVR-A001", timestamp: "2026-02-02T07:30:00Z", imageUrl: img2, rating: 8, personsDetected: 5, objectsDetected: [] },
      { id: "H001-3", busId: "BUS-1122", dvrId: "DVR-A001", timestamp: "2026-02-02T06:15:00Z", imageUrl: img3, rating: 9, personsDetected: 2, objectsDetected: [] },
      { id: "H001-4", busId: "BUS-8899", dvrId: "DVR-A001", timestamp: "2026-02-01T18:45:00Z", imageUrl: img4, rating: 7, personsDetected: 8, objectsDetected: ["plastic bag"] },
      { id: "H001-5", busId: "BUS-4455", dvrId: "DVR-A001", timestamp: "2026-02-01T16:30:00Z", imageUrl: img5, rating: 9, personsDetected: 1, objectsDetected: [] }
    ]
  },
  {
    id: "BS-002",
    busId: "BUS-7823",
    dvrId: "DVR-A002",
    busStopsCount: 32,
    location: {
      lat: 33.0462,
      lng: -96.7479,
      address: "5908 Legacy Dr, Plano, TX",
      stopName: "Legacy West Transit"
    },
    status: "warning",
    condition: {
      rating: 6,
      cleanlinessScore: 5,
      structuralScore: 7,
      lightingScore: 6
    },
    detection: {
      objectsFound: true,
      objectsList: ["plastic bag", "bottle"],
      personsDetected: 1
    },
    capture: {
      timestamp: "2026-02-02T08:30:00Z",
      clipDuration: 3,
      clipGeneratedAt: "2026-02-02T08:30:03Z",
      imageUrl: img2
    },
    lastUpdate: "2026-02-02T08:30:15Z",
    history: [
      { id: "H002-1", busId: "BUS-7823", dvrId: "DVR-A002", timestamp: "2026-02-02T08:30:00Z", imageUrl: img2, rating: 6, personsDetected: 1, objectsDetected: ["plastic bag", "bottle"] },
      { id: "H002-2", busId: "BUS-3344", dvrId: "DVR-A002", timestamp: "2026-02-02T06:45:00Z", imageUrl: img6, rating: 7, personsDetected: 4, objectsDetected: [] },
      { id: "H002-3", busId: "BUS-5566", dvrId: "DVR-A002", timestamp: "2026-02-01T20:00:00Z", imageUrl: img7, rating: 5, personsDetected: 2, objectsDetected: ["cup"] }
    ]
  },
  {
    id: "BS-003",
    busId: "BUS-1234",
    dvrId: "DVR-A003",
    busStopsCount: 18,
    location: {
      lat: 32.9987,
      lng: -96.6792,
      address: "2150 Parker Rd, Plano, TX",
      stopName: "Parker Road Station"
    },
    status: "critical",
    condition: {
      rating: 3,
      cleanlinessScore: 2,
      structuralScore: 4,
      lightingScore: 3
    },
    detection: {
      objectsFound: true,
      objectsList: ["mattress", "various bags", "cardboard boxes"],
      personsDetected: 2
    },
    capture: {
      timestamp: "2026-02-02T07:15:00Z",
      clipDuration: 3,
      clipGeneratedAt: "2026-02-02T07:15:03Z",
      imageUrl: img3
    },
    lastUpdate: "2026-02-02T07:15:20Z",
    history: [
      { id: "H003-1", busId: "BUS-1234", dvrId: "DVR-A003", timestamp: "2026-02-02T07:15:00Z", imageUrl: img3, rating: 3, personsDetected: 2, objectsDetected: ["mattress", "various bags", "cardboard boxes"] },
      { id: "H003-2", busId: "BUS-9988", dvrId: "DVR-A003", timestamp: "2026-02-01T22:00:00Z", imageUrl: img8, rating: 4, personsDetected: 1, objectsDetected: ["sleeping bag"] }
    ]
  },
  {
    id: "BS-004",
    busId: "BUS-9087",
    dvrId: "DVR-A004",
    busStopsCount: 56,
    location: {
      lat: 33.0336,
      lng: -96.7128,
      address: "3100 Spring Creek Pkwy, Plano, TX",
      stopName: "Spring Creek Parkway"
    },
    status: "good",
    condition: {
      rating: 8,
      cleanlinessScore: 8,
      structuralScore: 9,
      lightingScore: 7
    },
    detection: {
      objectsFound: false,
      objectsList: [],
      personsDetected: 5
    },
    capture: {
      timestamp: "2026-02-02T09:00:00Z",
      clipDuration: 3,
      clipGeneratedAt: "2026-02-02T09:00:03Z",
      imageUrl: img4
    },
    lastUpdate: "2026-02-02T09:00:12Z",
    history: [
      { id: "H004-1", busId: "BUS-9087", dvrId: "DVR-A004", timestamp: "2026-02-02T09:00:00Z", imageUrl: img4, rating: 8, personsDetected: 5, objectsDetected: [] },
      { id: "H004-2", busId: "BUS-1122", dvrId: "DVR-A004", timestamp: "2026-02-02T07:00:00Z", imageUrl: img1, rating: 9, personsDetected: 3, objectsDetected: [] },
      { id: "H004-3", busId: "BUS-3344", dvrId: "DVR-A004", timestamp: "2026-02-02T05:30:00Z", imageUrl: img5, rating: 8, personsDetected: 1, objectsDetected: [] },
      { id: "H004-4", busId: "BUS-5566", dvrId: "DVR-A004", timestamp: "2026-02-01T19:00:00Z", imageUrl: img6, rating: 7, personsDetected: 6, objectsDetected: ["newspaper"] }
    ]
  },
  {
    id: "BS-005",
    busId: "BUS-5566",
    dvrId: "DVR-A005",
    busStopsCount: 29,
    location: {
      lat: 33.0127,
      lng: -96.7324,
      address: "4500 Preston Rd, Plano, TX",
      stopName: "Preston Road & Park Blvd"
    },
    status: "warning",
    condition: {
      rating: 5,
      cleanlinessScore: 4,
      structuralScore: 6,
      lightingScore: 5
    },
    detection: {
      objectsFound: true,
      objectsList: ["organic waste"],
      personsDetected: 8
    },
    capture: {
      timestamp: "2026-02-02T08:50:00Z",
      clipDuration: 3,
      clipGeneratedAt: "2026-02-02T08:50:03Z",
      imageUrl: img5
    },
    lastUpdate: "2026-02-02T08:50:18Z",
    history: [
      { id: "H005-1", busId: "BUS-5566", dvrId: "DVR-A005", timestamp: "2026-02-02T08:50:00Z", imageUrl: img5, rating: 5, personsDetected: 8, objectsDetected: ["organic waste"] },
      { id: "H005-2", busId: "BUS-7788", dvrId: "DVR-A005", timestamp: "2026-02-02T06:30:00Z", imageUrl: img7, rating: 6, personsDetected: 4, objectsDetected: [] },
      { id: "H005-3", busId: "BUS-9900", dvrId: "DVR-A005", timestamp: "2026-02-01T21:00:00Z", imageUrl: img8, rating: 4, personsDetected: 2, objectsDetected: ["trash bag"] }
    ]
  },
  {
    id: "BS-006",
    busId: "BUS-3344",
    dvrId: "DVR-A006",
    busStopsCount: 63,
    location: {
      lat: 33.0540,
      lng: -96.7501,
      address: "7401 Windrose Ave, Plano, TX",
      stopName: "Shops at Legacy"
    },
    status: "good",
    condition: {
      rating: 10,
      cleanlinessScore: 10,
      structuralScore: 10,
      lightingScore: 10
    },
    detection: {
      objectsFound: false,
      objectsList: [],
      personsDetected: 2
    },
    capture: {
      timestamp: "2026-02-02T09:10:00Z",
      clipDuration: 3,
      clipGeneratedAt: "2026-02-02T09:10:03Z",
      imageUrl: img6
    },
    lastUpdate: "2026-02-02T09:10:08Z",
    history: [
      { id: "H006-1", busId: "BUS-3344", dvrId: "DVR-A006", timestamp: "2026-02-02T09:10:00Z", imageUrl: img6, rating: 10, personsDetected: 2, objectsDetected: [] },
      { id: "H006-2", busId: "BUS-1122", dvrId: "DVR-A006", timestamp: "2026-02-02T07:45:00Z", imageUrl: img1, rating: 10, personsDetected: 4, objectsDetected: [] },
      { id: "H006-3", busId: "BUS-5566", dvrId: "DVR-A006", timestamp: "2026-02-02T06:00:00Z", imageUrl: img2, rating: 9, personsDetected: 1, objectsDetected: [] },
      { id: "H006-4", busId: "BUS-7788", dvrId: "DVR-A006", timestamp: "2026-02-01T20:30:00Z", imageUrl: img3, rating: 10, personsDetected: 3, objectsDetected: [] },
      { id: "H006-5", busId: "BUS-9900", dvrId: "DVR-A006", timestamp: "2026-02-01T18:00:00Z", imageUrl: img4, rating: 10, personsDetected: 5, objectsDetected: [] },
      { id: "H006-6", busId: "BUS-2233", dvrId: "DVR-A006", timestamp: "2026-02-01T15:30:00Z", imageUrl: img8, rating: 9, personsDetected: 2, objectsDetected: [] }
    ]
  }
];

export const workflowSteps = [
  {
    id: 1,
    title: "Bus Stops",
    description: "Bus stops at the boarding point",
    icon: "bus"
  },
  {
    id: 2,
    title: "Capture Video",
    description: "Camera captures 3-second video",
    icon: "camera"
  },
  {
    id: 3,
    title: "Send Trigger",
    description: "Sends trigger to MSET",
    icon: "send"
  },
  {
    id: 4,
    title: "Process Frame",
    description: "MSET processes and sends frame to cloud",
    icon: "cloud"
  },
  {
    id: 5,
    title: "Update Map",
    description: "Data sent to Bus Shelter service",
    icon: "map"
  }
];
