import React, { useState, useEffect, useRef, useMemo } from 'react';
import { 
  CloudSun, 
  Droplets, 
  Wind, 
  AlertTriangle, 
  Mic, 
  MicOff, 
  Volume2, 
  VolumeX, 
  TrendingUp, 
  ShoppingBag, 
  Building2, 
  MessageSquare, 
  Send, 
  PhoneCall, 
  CheckCircle2, 
  Sparkles, 
  FileText, 
  ChevronRight, 
  Plus, 
  Search, 
  Compass, 
  ShieldCheck, 
  Leaf, 
  Sun, 
  CloudRain, 
  RotateCcw,
  Languages,
  BadgeAlert,
  ArrowUpRight,
  ExternalLink,
  MapPin,
  Calendar,
  Layers,
  HelpCircle,
  X,
  Camera,
  Image as ImageIcon,
  Loader2,
  Globe,
  Sparkle,
  User,
  KeyRound,
  LogOut,
  Edit3,
  Stethoscope,
  ScanLine,
  Filter,
  Wheat,
  Apple,
  Flower2
} from 'lucide-react';

// Converts raw signed PCM 16-bit audio data buffer to playable WAV Blob
function pcmToWav(pcmData, sampleRate = 24000) {
  const numChannels = 1;
  const bitsPerSample = 16;
  const byteRate = (sampleRate * numChannels * bitsPerSample) / 8;
  const blockAlign = (numChannels * bitsPerSample) / 8;
  const dataSize = pcmData.byteLength;
  const buffer = new ArrayBuffer(44 + dataSize);
  const view = new DataView(buffer);

  function writeString(view, offset, string) {
    for (let i = 0; i < string.length; i++) {
      view.setUint8(offset + i, string.charCodeAt(i));
    }
  }

  writeString(view, 0, 'RIFF');
  view.setUint32(4, 36 + dataSize, true);
  writeString(view, 8, 'WAVE');
  writeString(view, 12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true); // PCM Format
  view.setUint16(22, numChannels, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, byteRate, true);
  view.setUint16(32, blockAlign, true);
  view.setUint16(34, bitsPerSample, true);
  writeString(view, 36, 'data');
  view.setUint32(40, dataSize, true);

  const pcmBytes = new Uint8Array(pcmData.buffer, pcmData.byteOffset, pcmData.byteLength);
  const wavBytes = new Uint8Array(buffer, 44);
  wavBytes.set(pcmBytes);

  return new Blob([buffer], { type: 'audio/wav' });
}

function base64ToArrayBuffer(base64) {
  const binaryString = window.atob(base64);
  const len = binaryString.length;
  const bytes = new Uint8Array(len);
  for (let i = 0; i < len; i++) {
    bytes[i] = binaryString.charCodeAt(i);
  }
  return bytes.buffer;
}

// ALL 31 DISTRICTS OF KARNATAKA WITH LOCALIZED AGRO-CLIMATIC TELEMETRY & ADVISORIES
const REGIONAL_ZONES = [
  // --- BENGALURU DIVISION ---
  {
    id: "bengaluru-urban",
    division: "Bengaluru",
    nameEn: "Bengaluru Urban",
    nameKn: "ಬೆಂಗಳೂರು ನಗರ",
    temp: 27,
    humidity: 62,
    rainfallProb: 30,
    windSpeed: 12,
    soilMoisture: "56% VWC",
    pestHeadingEn: "Advisory: Sucking Pests in Polyhouse Floriculture",
    pestHeadingKn: "ಸಲಹೆ: ಹಸಿರುಮನೆ ಹೂವುಗಳಲ್ಲಿ ರಸಹೀರುವ ಕೀಟಗಳು",
    pestBodyEn: "Thrips and mites detected on rose and carnation stems. Spray Neemazal (3ml/L) or install blue/yellow sticky traps.",
    pestBodyKn: "ಗುಲಾಬಿ ಮತ್ತು ಕಾರ್ನೇಷನ್ ಹೂವುಗಳಲ್ಲಿ ನುಸಿ ಮತ್ತು ಹೇನು ಬಾಧೆ. ಬೇವಿನ ಕೀಟನಾಶಕ (೩ ಮಿ.ಲೀ/ಲೀ) ಸಿಂಪಡಿಸಿ ಅಥವಾ ಜಿಗುಟು ಬಲೆ ಹಾಕಿ."
  },
  {
    id: "bengaluru-rural",
    division: "Bengaluru",
    nameEn: "Bengaluru Rural (Doddaballapur / Devanahalli)",
    nameKn: "ಬೆಂಗಳೂರು ಗ್ರಾಮಾಂತರ (ದೊಡ್ಡಬಳ್ಳಾಪುರ)",
    temp: 27,
    humidity: 65,
    rainfallProb: 35,
    windSpeed: 13,
    soilMoisture: "58% VWC",
    pestHeadingEn: "Advisory: Leaf Curl Virus in Tomato & Grapes",
    pestHeadingKn: "ಸಲಹೆ: ಟೊಮ್ಯಾಟೊ & ದ್ರಾಕ್ಷಿ ಎಲೆ ಸುರುಟು ರೋಗ",
    pestBodyEn: "Whitefly vector observed in vegetable clusters. Install 12 yellow sticky traps per acre and spray Imidacloprid (0.5ml/L).",
    pestBodyKn: "ತರಕಾರಿ ತೋಟಗಳಲ್ಲಿ ಬಿಳಿ ನೊಣದ ಬಾಧೆ. ಎಕರೆಗೆ ೧೨ ಹಳದಿ ಜಿಗುಟು ಬಲೆ ಅಳವಡಿಸಿ, ಶಿಫಾರಸು ಮಾಡಿದ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಿ."
  },
  {
    id: "ramanagara",
    division: "Bengaluru",
    nameEn: "Ramanagara (Silk & Mango City)",
    nameKn: "ರಾಮನಗರ (ರೇಷ್ಮೆ & ಮಾವು)",
    temp: 29,
    humidity: 68,
    rainfallProb: 40,
    windSpeed: 14,
    soilMoisture: "62% VWC",
    pestHeadingEn: "Advisory: Uzi Fly in Sericulture & Mango Hopper",
    pestHeadingKn: "ಸಲಹೆ: ರೇಷ್ಮೆ ಹುಳುಗಳಿಗೆ ಉಜಿ ನೊಣ & ಮಾವಿನ ಜಿಗಿಹುಳು",
    pestBodyEn: "Erect fine mesh nets in silkworm rearing sheds. In mango orchards, apply sticky banding around tree trunks.",
    pestBodyKn: "ಹಿಪ್ಪುನೇರಳೆ ರೇಷ್ಮೆ ಮನೆಯ ಕಿಟಕಿಗಳಿಗೆ ಸೊಳ್ಳೆ ಪರದೆ ಅಳವಡಿಸಿ. ಮಾವಿನ ಮರಗಳಿಗೆ ಅಂಟು ಪಟ್ಟಿ ಕಟ್ಟಿ ಜಿಗಿಹುಳು ತಡೆಯಿರಿ."
  },
  {
    id: "kolar",
    division: "Bengaluru",
    nameEn: "Kolar (Gold Field & Tomato Hub)",
    nameKn: "ಕೋಲಾರ (ಟೊಮ್ಯಾಟೊ & ಹಾಲು)",
    temp: 28,
    humidity: 58,
    rainfallProb: 25,
    windSpeed: 15,
    soilMoisture: "52% VWC",
    pestHeadingEn: "Warning: Pinworm (Tuta Absoluta) in Tomato",
    pestHeadingKn: "ಎಚ್ಚರಿಕೆ: ಟೊಮ್ಯಾಟೊ ಕಾಯಿಕೊರಕ & ಎಲೆ ಸುರಂಗ ಹುಳು",
    pestBodyEn: "Pheromone delta traps required immediately (16/acre). Spray Spinosad (0.3ml/L) on affected leaf foliage.",
    pestBodyKn: "ಹೊಲಗಳಲ್ಲಿ ಮೋಹಕ ಬಲೆಗಳನ್ನು ಅಳವಡಿಸಿ. ಬಾಧಿತ ಟೊಮ್ಯಾಟೊ ಸಸಿಗಳಿಗೆ ೦.೩ ಮಿ.ಲೀ ಸ್ಪೈನೋಸ್ಯಾಡ್ ದ್ರಾವಣ ಸಿಂಪಡಿಸಿ."
  },
  {
    id: "chikkaballapur",
    division: "Bengaluru",
    nameEn: "Chikkaballapur (Grapes & Vegetables)",
    nameKn: "ಚಿಕ್ಕಬಳ್ಳಾಪುರ (ದ್ರಾಕ್ಷಿ & ತರಕಾರಿ)",
    temp: 27,
    humidity: 60,
    rainfallProb: 30,
    windSpeed: 14,
    soilMoisture: "55% VWC",
    pestHeadingEn: "Advisory: Downy Mildew in Grapevine",
    pestHeadingKn: "ಸಲಹೆ: ದ್ರಾಕ್ಷಿಯಲ್ಲಿ ಡೌನಿ ಮಿಲ್ಡ್ಯೂ (ಬೂದಿ ರೋಗ)",
    pestBodyEn: "Cool morning dews favor fungal sporulation. Spray Metalaxyl + Mancozeb (2g/L) during early morning hours.",
    pestBodyKn: "ಮುಂಜಾನೆಯ ಇಬ್ಬನಿಯಿಂದ ದ್ರಾಕ್ಷಿ ಗೊಂಚಲುಗಳಿಗೆ ಬೂದಿ ರೋಗದ ಭೀತಿ. ೨ ಗ್ರಾಂ ಮ್ಯಾಂಕೋಜೆಬ್ ಸಿಂಪರಣೆ ಕೈಗೊಳ್ಳಿ."
  },
  {
    id: "tumakuru",
    division: "Bengaluru",
    nameEn: "Tumakuru (Kalpataru Nadu / Coconut Hub)",
    nameKn: "ತುಮಕೂರು (ಕಲ್ಪತರು ನಾಡು / ತೆಂಗು)",
    temp: 29,
    humidity: 63,
    rainfallProb: 35,
    windSpeed: 13,
    soilMoisture: "60% VWC",
    pestHeadingEn: "Alert: Black Headed Caterpillar in Coconut",
    pestHeadingKn: "ಮುನ್ನೆಚ್ಚರಿಕೆ: ತೆಂಗಿನ ಮರಗಳಲ್ಲಿ ಕಪ್ಪುತಲೆ ಹುಳು ಬಾಧೆ",
    pestBodyEn: "Release Goniozus nephantidis bio-parasitoids (20/palm) into crowns. Avoid chemical root-feeding near harvest.",
    pestBodyKn: "ತೆಂಗಿನ ಗರಿ ತಿನ್ನುವ ಕಪ್ಪುತಲೆ ಹುಳು ನಿಯಂತ್ರಣಕ್ಕೆ ಗೋನಿಯೋಜಸ್ ಪರಭಕ್ಷಕ ಕೀಟಗಳನ್ನು ಮರಗಳಿಗೆ ಬಿಡಿ."
  },
  {
    id: "shivamogga",
    division: "Bengaluru",
    nameEn: "Shivamogga (Gateway to Malnad)",
    nameKn: "ಶಿವಮೊಗ್ಗ (ಮಲೆನಾಡ ಹೆಬ್ಬಾಗಿಲು)",
    temp: 26,
    humidity: 86,
    rainfallProb: 75,
    windSpeed: 17,
    soilMoisture: "82% VWC",
    pestHeadingEn: "Urgent: Koleroga (Fruit Rot) in Arecanut",
    pestHeadingKn: "ತುರ್ತು ಎಚ್ಚರಿಕೆ: ಅಡಿಕೆ ಕೊಳೆರೋಗ & ಎಲೆಚುಕ್ಕೆ",
    pestBodyEn: "Intermittent rain and high humidity cause nut-drop. Spray 1% Bordeaux mixture on clear afternoons immediately.",
    pestBodyKn: "ಮೋಡ ಕವಿದ ವಾತಾವರಣದಿಂದ ಅಡಿಕೆಗೆ ಕೊಳೆರೋಗ ಮತ್ತು ಉದುರುವಿಕೆ. ಬಿಸಿಲು ಕಂಡಾಗ ೧% ಬೋರ್ಡೋ ದ್ರಾವಣ ಗೊನೆಗೆ ಸಿಂಪಡಿಸಿ."
  },
  {
    id: "chitradurga",
    division: "Bengaluru",
    nameEn: "Chitradurga (Fort City / Groundnut Hub)",
    nameKn: "ಚಿತ್ರದುರ್ಗ (ಕೋಟೆ ನಾಡು / ಕಡಲೆಕಾಯಿ)",
    temp: 31,
    humidity: 50,
    rainfallProb: 20,
    windSpeed: 16,
    soilMoisture: "48% VWC",
    pestHeadingEn: "Advisory: Tikka Leaf Spot in Groundnut",
    pestHeadingKn: "ಸಲಹೆ: ಕಡಲೆಕಾಯಿ ಬೆಳೆಯಲ್ಲಿ ಟಿಕ್ಕಾ ಎಲೆಚುಕ್ಕೆ ರೋಗ",
    pestBodyEn: "Circular brown necrotic lesions spotted on foliage. Spray Carbendazim (1g/L) combined with soil moisture conservation.",
    pestBodyKn: "ಕಡಲೆಕಾಯಿ ಎಲೆಗಳಲ್ಲಿ ಕಂದು ಚುಕ್ಕೆಗಳು ಕಂಡುಬಂದಿವೆ. ೧ ಗ್ರಾಂ ಕಾರ್ಬೆಂಡಾಜಿಮ್ ಅನ್ನು ಪ್ರತಿ ಲೀಟರ್ ನೀರಿಗೆ ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ."
  },
  {
    id: "davanagere",
    division: "Bengaluru",
    nameEn: "Davanagere (Benne Dosa & Maize Capital)",
    nameKn: "ದಾವಣಗೆರೆ (ಮೆಕ್ಕೆಜೋಳದ ಕಣಜ)",
    temp: 30,
    humidity: 56,
    rainfallProb: 25,
    windSpeed: 14,
    soilMoisture: "53% VWC",
    pestHeadingEn: "Warning: Fall Armyworm in Maize Fields",
    pestHeadingKn: "ಎಚ್ಚರಿಕೆ: ಮೆಕ್ಕೆಜೋಳದ ಸೈನಿಕ ಲದ್ದಿಹುಳು (FAW)",
    pestBodyEn: "Check whorls of young corn stalks. Apply Neem Cake sand mix (1:9) or Emamectin Benzoate (0.4g/L).",
    pestBodyKn: "ಮೆಕ್ಕೆಜೋಳದ ಸುಳಿ ಪರೀಕ್ಷಿಸಿ. ಲದ್ದಿಹುಳು ನಿಯಂತ್ರಣಕ್ಕೆ ಬೇವಿನ ಹಿಂಡಿ-ಮರಳು ಮಿಶ್ರಣವನ್ನು ಗಿಡಗಳ ಸುಳಿಗೆ ಹಾಕಿ."
  },

  // --- MYSURU DIVISION ---
  {
    id: "mysuru",
    division: "Mysuru",
    nameEn: "Mysuru (Cultural Capital / Rasabale Hub)",
    nameKn: "ಮೈಸೂರು (ಸಾಂಸ್ಕೃತಿಕ ನಗರಿ / ರಸಬಾಳೆ)",
    temp: 28,
    humidity: 72,
    rainfallProb: 55,
    windSpeed: 13,
    soilMoisture: "66% VWC",
    pestHeadingEn: "Advisory: Panama Wilt in Nanjangud Rasabale",
    pestHeadingKn: "ಸಲಹೆ: ನಂಜನಗೂಡು ರಸಬಾಳೆ ಗಿಡಗಳಲ್ಲಿ ಪನಾಮ ಸೊರಗು ರೋಗ",
    pestBodyEn: "Drench base with Trichoderma viride enriched FYM (50g/plant). Avoid waterlogging around root clumps.",
    pestBodyKn: "ಬಾಳೆ ಬುಡಕ್ಕೆ ಟ್ರೈಕೋಡರ್ಮಾ ಜೈವಿಕ ಗೊಬ್ಬರ ಹಾಕಿ ನೀರು ನಿಲ್ಲದಂತೆ ಬಸಿಗಾಲುವೆ ಸ್ವಚ್ಛಗೊಳಿಸಿ."
  },
  {
    id: "mandya",
    division: "Mysuru",
    nameEn: "Mandya (Sugar & Paddy Bowl)",
    nameKn: "ಮಂಡ್ಯ (ಸಕ್ಕರೆ ನಾಡು / ಭತ್ತ)",
    temp: 29,
    humidity: 76,
    rainfallProb: 65,
    windSpeed: 14,
    soilMoisture: "68% VWC",
    pestHeadingEn: "Urgent Warning: Yellow Stem Borer & Blast in Paddy",
    pestHeadingKn: "ತುರ್ತು ಎಚ್ಚರಿಕೆ: ಭತ್ತದ ಹಳದಿ ಕಾಂಡಕೊರಕ & ಬೆಂಕಿ ರೋಗ",
    pestBodyEn: "Dead-hearts observed in Cauvery canal command area. Clip seedling leaf tips before planting and spray Tricyclazole (0.6g/L).",
    pestBodyKn: "ಕಾವೇರಿ ನಾಲೆ ಪ್ರದೇಶದಲ್ಲಿ ಸುಳಿ ಒಣಗುವಿಕೆ. ನಾಟಿ ವೇಳೆ ಎಲೆ ತುದಿ ಕತ್ತರಿಸಿ ಹಾಗೂ ೦.೬ ಗ್ರಾಂ ಟ್ರೈಸೈಕ್ಲಜೋಲ್ ಸಿಂಪಡಿಸಿ."
  },
  {
    id: "hassan",
    division: "Mysuru",
    nameEn: "Hassan (Potato & Coffee Zone)",
    nameKn: "ಹಾಸನ (ಆಲೂಗಡ್ಡೆ & ಕಾಫಿ)",
    temp: 25,
    humidity: 82,
    rainfallProb: 65,
    windSpeed: 15,
    soilMoisture: "76% VWC",
    pestHeadingEn: "Warning: Late Blight in Potato Tubers",
    pestHeadingKn: "ಎಚ್ಚರಿಕೆ: ಆಲೂಗಡ್ಡೆ ಅಂಗಮಾರಿ ರೋಗ (Late Blight)",
    pestBodyEn: "Water-soaked lesions on leaves turning black. Spray Cymoxanil + Mancozeb (2.5g/L) immediately.",
    pestBodyKn: "ಆಲೂಗಡ್ಡೆ ಎಲೆಗಳು ಕಪ್ಪಾಗುವ ಅಂಗಮಾರಿ ಲಕ್ಷಣ. ತಕ್ಷಣ ೨.೫ ಗ್ರಾಂ ಮ್ಯಾಂಕೋಜೆಬ್ ದ್ರಾವಣ ಸಿಂಪಡಿಸಿ."
  },
  {
    id: "chikkamagaluru",
    division: "Mysuru",
    nameEn: "Chikkamagaluru (Coffee Cradle of India)",
    nameKn: "ಚಿಕ್ಕಮಗಳೂರು (ಕಾಫಿಯ ತವರೂರು)",
    temp: 24,
    humidity: 85,
    rainfallProb: 70,
    windSpeed: 15,
    soilMoisture: "78% VWC",
    pestHeadingEn: "Warning: Coffee White Stem Borer & Leaf Rust",
    pestHeadingKn: "ಎಚ್ಚರಿಕೆ: ಕಾಫಿ ಬಿಳಿ ಕಾಂಡಕೊರಕ & ಎಲೆ ತುಕ್ಕು ರೋಗ",
    pestBodyEn: "Inspect shade canopy. Swab main stems with 10% lime wash and spray 0.5% Bordeaux mixture for rust.",
    pestBodyKn: "ಕಾಫಿ ಗಿಡಗಳ ಕಾಂಡಕ್ಕೆ ೧೦% ಸುಣ್ಣದ ದ್ರಾವಣ ಲೇಪಿಸಿ. ಎಲೆ ತುಕ್ಕು ರೋಗಕ್ಕೆ ೦.೫% ಬೋರ್ಡೋ ಸಿಂಪಡಿಸಿ."
  },
  {
    id: "kodagu",
    division: "Mysuru",
    nameEn: "Kodagu (Madikeri / Spices & Coffee)",
    nameKn: "ಕೊಡಗು (ಮಡಿಕೇರಿ / ಸಾಂಬಾರ ಬೆಳೆ)",
    temp: 22,
    humidity: 90,
    rainfallProb: 80,
    windSpeed: 16,
    soilMoisture: "85% VWC",
    pestHeadingEn: "Alert: Quick Wilt (Phytophthora) in Black Pepper",
    pestHeadingKn: "ಮುನ್ನೆಚ್ಚರಿಕೆ: ಕಾಳುಮೆಣಸಿನ ಶೀಘ್ರ ಸೊರಗು ರೋಗ",
    pestBodyEn: "Heavy mist and root moisture trigger vine rot. Drench root zones with Potassium Phosphonate (3ml/L).",
    pestBodyKn: "ಕಾಳುಮೆಣಸಿನ ಬಳ್ಳಿಗಳ ಬುಡ ಕೊಳೆಯದಂತೆ ಪೊಟ್ಯಾಶಿಯಂ ಫಾಸ್ಫೋನೇಟ್ ದ್ರಾವಣದಿಂದ ಬೇರು ಭಾಗ ನೆನೆಸಿ."
  },
  {
    id: "dakshina-kannada",
    division: "Mysuru",
    nameEn: "Dakshina Kannada (Mangaluru / Coastal)",
    nameKn: "ದಕ್ಷಿಣ ಕನ್ನಡ (ಮಂಗಳೂರು / ಕರಾವಳಿ)",
    temp: 30,
    humidity: 88,
    rainfallProb: 75,
    windSpeed: 19,
    soilMoisture: "80% VWC",
    pestHeadingEn: "Advisory: Yellow Leaf Disease (YLD) in Coastal Areca",
    pestHeadingKn: "ಸಲಹೆ: ಕರಾವಳಿ ಅಡಿಕೆಯಲ್ಲಿ ಹಳದಿ ಎಲೆ ರೋಗ",
    pestBodyEn: "Provide adequate organic drainage. Apply micronutrient mixture and 1.5kg neem cake per palm.",
    pestBodyKn: "ಅಡಿಕೆ ತೋಟಗಳಲ್ಲಿ ಬಸಿಗಾಲುವೆ ನಿರ್ವಹಿಸಿ, ಮರಕ್ಕೆ ೧.೫ ಕೆಜಿ ಬೇವಿನ ಹಿಂಡಿ ಮತ್ತು ಲಘು ಪೋಷಕಾಂಶ ನೀಡಿ."
  },
  {
    id: "udupi",
    division: "Mysuru",
    nameEn: "Udupi (Coastal Mattu Gulla & Coconut)",
    nameKn: "ಉಡುಪಿ (ಮಟ್ಟುಗುಳ್ಳ & ಕರಾವಳಿ ತೆಂಗು)",
    temp: 29,
    humidity: 86,
    rainfallProb: 70,
    windSpeed: 18,
    soilMoisture: "78% VWC",
    pestHeadingEn: "Advisory: Shoot & Fruit Borer in Mattu Gulla Brinjal",
    pestHeadingKn: "ಸಲಹೆ: ಮಟ್ಟುಗುಳ್ಳ ಬದನೆಕಾಯಿಯಲ್ಲಿ ಕಾಯಿಕೊರಕ ಹುಳು",
    pestBodyEn: "Clip drooped wilted shoots. Spray Bacillus thuringiensis (Bt) bio-insecticide (2g/L) during evenings.",
    pestBodyKn: "ಬಾಡಿದ ಬದನೆ ಕುಡಿಗಳನ್ನು ಕತ್ತರಿಸಿ ತೆಗೆಯಿರಿ. ಸಂಜೆ ವೇಳೆ ೨ ಗ್ರಾಂ ಜೈವಿಕ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಿ."
  },
  {
    id: "uttara-kannada",
    division: "Mysuru",
    nameEn: "Uttara Kannada (Karwar / Sirsi Spice Hub)",
    nameKn: "ಉತ್ತರ ಕನ್ನಡ (ಕಾರವಾರ / ಶಿರಸಿ ಸಾಂಬಾರ)",
    temp: 27,
    humidity: 84,
    rainfallProb: 65,
    windSpeed: 16,
    soilMoisture: "80% VWC",
    pestHeadingEn: "Advisory: Capsule Borer in Cardamom & Chali Rot",
    pestHeadingKn: "ಸಲಹೆ: ಏಲಕ್ಕಿ ಕಾಯಿಕೊರಕ & ಅಡಿಕೆ ಕೊಳೆರೋಗ",
    pestBodyEn: "Clear decaying forest mulch near cardamom clumps. Apply Trichoderma drenching.",
    pestBodyKn: "ಏಲಕ್ಕಿ ಗಿಡಗಳ ಸುತ್ತಲಿನ ಕಳೆ ಸ್ವಚ್ಛಗೊಳಿಸಿ, ಟ್ರೈಕೋಡರ್ಮಾ ಜೈವಿಕ ದ್ರಾವಣದಿಂದ ಬುಡ ಉಪಚರಿಸಿ."
  },
  {
    id: "chamarajanagar",
    division: "Mysuru",
    nameEn: "Chamarajanagar (Turmeric & Silk Southern Tip)",
    nameKn: "ಚಾಮರಾಜನಗರ (ಅರಿಶಿನ & ರೇಷ್ಮೆ ನಾಡು)",
    temp: 29,
    humidity: 64,
    rainfallProb: 35,
    windSpeed: 12,
    soilMoisture: "59% VWC",
    pestHeadingEn: "Warning: Rhizome Rot & Leaf Spot in Turmeric",
    pestHeadingKn: "ಎಚ್ಚರಿಕೆ: ಅರಿಶಿನ ಗಡ್ಡೆ ಕೊಳೆ ರೋಗ & ಎಲೆಚುಕ್ಕೆ",
    pestBodyEn: "Raised beds must prevent waterlogging. Drench rhizomes with Copper Oxychloride (3g/L).",
    pestBodyKn: "ಅರಿಶಿನದ ಮಡಿಗಳಲ್ಲಿ ನೀರು ನಿಲ್ಲದಂತೆ ನೋಡಿಕೊಳ್ಳಿ. ೩ ಗ್ರಾಂ ತಾಮ್ರದ ಶಿಲೀಂಧ್ರನಾಶಕದಿಂದ ಗಡ್ಡೆ ಭಾಗ ನೆನೆಸಿ."
  },

  // --- BELAGAVI DIVISION ---
  {
    id: "belagavi",
    division: "Belagavi",
    nameEn: "Belagavi (Sugarcane & Vegetable Capital)",
    nameKn: "ಬೆಳಗಾವಿ (ಕಬ್ಬು & ತರಕಾರಿ ರಾಜಧಾನಿ)",
    temp: 28,
    humidity: 65,
    rainfallProb: 45,
    windSpeed: 13,
    soilMoisture: "64% VWC",
    pestHeadingEn: "Advisory: Woolly Aphid in Sugarcane & Soybean Rust",
    pestHeadingKn: "ಸಲಹೆ: ಕಬ್ಬಿನಲ್ಲಿ ಬಿಳಿ ಜಿಗಿಹುಳು & ಸೋಯಾಬೀನ್ ತುಕ್ಕು",
    pestBodyEn: "Release Dipha aphidivora bio-predators. Avoid indiscriminate chemical spraying on cane foliage.",
    pestBodyKn: "ಕಬ್ಬಿನಲ್ಲಿ ಬಿಳಿ ಜಿಗಿಹುಳು ತಡೆಗೆ ಪರಭಕ್ಷಕ ಕೀಟಗಳನ್ನು ಬಿಡಿ. ಅನಗತ್ಯ ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆ ಬೇಡ."
  },
  {
    id: "dharwad",
    division: "Belagavi",
    nameEn: "Dharwad (Agricultural University Hub / Pedha)",
    nameKn: "ಧಾರವಾಡ (ಕೃಷಿ ವಿವಿ ಕೇಂದ್ರ / ಪೇಡಾ)",
    temp: 28,
    humidity: 62,
    rainfallProb: 40,
    windSpeed: 13,
    soilMoisture: "62% VWC",
    pestHeadingEn: "Advisory: Pod Borer (Helicoverpa) in Chickpea (Chana)",
    pestHeadingKn: "ಸಲಹೆ: ಕಡಲೆ ಬೆಳೆಯಲ್ಲಿ ಕಾಯಿಕೊರಕ ಹುಳು",
    pestBodyEn: "Install bird perches (20/acre) in chickpea fields. Spray HaNPV (250 LE/acre) or Chlorantraniliprole (0.3ml/L).",
    pestBodyKn: "ಕಡಲೆ ಗದ್ದೆಯಲ್ಲಿ ಪಕ್ಷಿಗಳಿಗೆ ಕೂರಲು ಕವಲು ಕೋಲುಗಳನ್ನು ನೆಡಿ. ಸಂಜೆ ವೇಳೆ ಶಿಫಾರಸು ಮಾಡಿದ ಔಷಧ ಸಿಂಪಡಿಸಿ."
  },
  {
    id: "gadag",
    division: "Belagavi",
    nameEn: "Gadag (Sunflower & Green Gram Mandi)",
    nameKn: "ಗದಗ (ಸೂರ್ಯಕಾಂತಿ & ಹೆಸರು ಕಾಳು)",
    temp: 31,
    humidity: 52,
    rainfallProb: 25,
    windSpeed: 15,
    soilMoisture: "49% VWC",
    pestHeadingEn: "Advisory: Head Rot & Necrosis in Sunflower",
    pestHeadingKn: "ಸಲಹೆ: ಸೂರ್ಯಕಾಂತಿಯಲ್ಲಿ ಹೂವು ಕೊಳೆ ರೋಗ & ಥ್ರಿಪ್ಸ್",
    pestBodyEn: "Control thrips vector feeding on ray florets. Spray Imidacloprid (0.3ml/L) prior to flower opening.",
    pestBodyKn: "ಸೂರ್ಯಕಾಂತಿ ಹೂ ಬಿಡುವ ಮುನ್ನ ರಸಹೀರುವ ನುಸಿ ಕೀಟ ನಿಯಂತ್ರಣಕ್ಕೆ ಕೀಟನಾಶಕ ಸಿಂಪಡಿಸಿ."
  },
  {
    id: "haveri",
    division: "Belagavi",
    nameEn: "Haveri (Byadgi Chilli & Cardamom Garland)",
    nameKn: "ಹಾವೇರಿ (ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ ತವರೂರು)",
    temp: 29,
    humidity: 58,
    rainfallProb: 35,
    windSpeed: 14,
    soilMoisture: "55% VWC",
    pestHeadingEn: "Warning: Anthracnose (Fruit Rot / Murda) in Byadgi Chilli",
    pestHeadingKn: "ಎಚ್ಚರಿಕೆ: ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿಯಲ್ಲಿ ಮುರಡ ರೋಗ & ಕಾಯಿ ಕೊಳೆ",
    pestBodyEn: "Sunken black circular spots on drying chillies. Spray Azoxystrobin + Difenoconazole (1ml/L).",
    pestBodyKn: "ಮೆಣಸಿನಕಾಯಿ ಕಾಯಿಗಳ ಮೇಲೆ ಕಪ್ಪು ಕಲೆಗಳು. ಮುರಡ ರೋಗ ತಡೆಗೆ ೧ ಮಿ.ಲೀ ಶಿಲೀಂಧ್ರನಾಶಕ ಸಿಂಪಡಿಸಿ."
  },
  {
    id: "vijayapura",
    division: "Belagavi",
    nameEn: "Vijayapura (Bijapur / Grapes & Lime Bowl)",
    nameKn: "ವಿಜಯಪುರ (ದ್ರಾಕ್ಷಿ & ಲಿಂಬೆ ನಾಡು)",
    temp: 32,
    humidity: 46,
    rainfallProb: 15,
    windSpeed: 15,
    soilMoisture: "45% VWC",
    pestHeadingEn: "Advisory: Canker in Acid Lime & Flea Beetle in Grapes",
    pestHeadingKn: "ಸಲಹೆ: ಲಿಂಬೆಯಲ್ಲಿ ಸಿಟ್ರಸ್ ಕ್ಯಾಂಕರ್ & ದ್ರಾಕ್ಷಿ ಜಿಗಿಹುಳು",
    pestBodyEn: "Prune canker-infected twigs and spray Streptocycline (1g in 10L) with Copper Oxychloride (25g).",
    pestBodyKn: "ಕ್ಯಾಂಕರ್ ಬಾಧಿತ ಲಿಂಬೆ ಕೊಂಬೆ ಕತ್ತರಿಸಿ, ಸ್ಟ್ರೆಪ್ಟೊಸೈಕ್ಲಿನ್ ಹಾಗೂ ತಾಮ್ರದ ಔಷಧ ಸಿಂಪಡಿಸಿ."
  },
  {
    id: "bagalkot",
    division: "Belagavi",
    nameEn: "Bagalkot (Pomegranate & Ghataprabha Command)",
    nameKn: "ಬಾಗಲಕೋಟೆ (ದಾಳಿಂಬೆ & ಕಬ್ಬು)",
    temp: 31,
    humidity: 50,
    rainfallProb: 20,
    windSpeed: 14,
    soilMoisture: "48% VWC",
    pestHeadingEn: "Warning: Bacterial Blight (Telya) in Pomegranate",
    pestHeadingKn: "ಎಚ್ಚರಿಕೆ: ದಾಳಿಂಬೆಯಲ್ಲಿ ಎಣ್ಣೆ ಚುಕ್ಕೆ ರೋಗ (ತೆಲ್ಯಾ)",
    pestBodyEn: "Oily brown spots on rind. Disinfect pruning tools and spray 0.5g/L Streptocycline + 2g/L Bordeaux powder.",
    pestBodyKn: "ದಾಳಿಂಬೆ ಕಾಯಿ ಮೇಲೆ ಕಂದು ಎಣ್ಣೆ ಮಚ್ಚೆ ರೋಗ. ಕತ್ತರಿ ಸೋಂಕು ನಿವಾರಿಸಿ ಔಷಧ ಸಿಂಪಡಿಸಿ."
  },

  // --- KALABURAGI DIVISION ---
  {
    id: "kalaburagi",
    division: "Kalaburagi",
    nameEn: "Kalaburagi (Gulbarga / Tur Bowl of India)",
    nameKn: "ಕಲಬುರಗಿ (ತೊಗರಿ ಕಣಜ)",
    temp: 33,
    humidity: 47,
    rainfallProb: 20,
    windSpeed: 15,
    soilMoisture: "46% VWC",
    pestHeadingEn: "Urgent: Fusarium Wilt & Sterility Mosaic in Tur Dal",
    pestHeadingKn: "ತುರ್ತು ಸಲಹೆ: ತೊಗರಿ ಬೆಳೆಯಲ್ಲಿ ಸೊರಗು ರೋಗ & ಬಂಜೆ ರೋಗ",
    pestBodyEn: "Yellow bushiness and sudden wilting of branches. Drench root zones with Carbendazim (1g/L) and pull infected plants.",
    pestBodyKn: "ತೊಗರಿ ಗಿಡಗಳು ಹಠಾತ್ ಒಣಗುವುದು. ಸೊರಗು ರೋಗ ಪೀಡಿತ ಗಿಡಗಳನ್ನು ಕಿತ್ತು ನಾಶಪಡಿಸಿ, ಬೇರಿಗೆ ಔಷಧ ಕೊಡಿ."
  },
  {
    id: "bidar",
    division: "Kalaburagi",
    nameEn: "Bidar (Kalyana Karnataka Crown / Pulses)",
    nameKn: "ಬೀದರ್ (ಕಲ್ಯಾಣ ಕರ್ನಾಟಕ ಕಿರೀಟ / ಕಾಳುಗಳು)",
    temp: 31,
    humidity: 52,
    rainfallProb: 25,
    windSpeed: 14,
    soilMoisture: "50% VWC",
    pestHeadingEn: "Advisory: Maruca Pod Borer in Black Gram & Soy",
    pestHeadingKn: "ಸಲಹೆ: ಉದ್ದು & ಸೋಯಾಬೀನ್ ಬೆಳೆಯಲ್ಲಿ ಕಾಯಿಕೊರಕ ಹುಳು",
    pestBodyEn: "Webbing of flowers and pods observed. Spray Indoxacarb (0.5ml/L) or Flubendiamide (0.2ml/L) at dusk.",
    pestBodyKn: "ಹೂವುಗಳಲ್ಲಿ ಗೂಡು ಕಟ್ಟುವ ಹುಳು ಬಾಧೆ. ಸಂಜೆ ವೇಳೆ ನಿಗದಿತ ಕೀಟನಾಶಕವನ್ನು ಸಿಂಪಡಿಸಿ."
  },
  {
    id: "raichur",
    division: "Kalaburagi",
    nameEn: "Raichur (Cotton, Rice & Krishna-Tungabhadra Doab)",
    nameKn: "ರಾಯಚೂರು (ಹತ್ತಿ & ಅಕ್ಕಿ ನಾಡು)",
    temp: 34,
    humidity: 48,
    rainfallProb: 15,
    windSpeed: 16,
    soilMoisture: "44% VWC",
    pestHeadingEn: "Advisory: Pink Bollworm in Cotton & Blast in Paddy",
    pestHeadingKn: "ಸಲಹೆ: ಹತ್ತಿಯ ಗುಲಾಬಿ ಕಾಯಿಕೊರಕ & ಭತ್ತದ ಬೆಂಕಿ ರೋಗ",
    pestBodyEn: "Install gossyplure pheromone traps (8/acre). For paddy, irrigate fields during cooler morning hours.",
    pestBodyKn: "ಹತ್ತಿ ಗದ್ದೆಯಲ್ಲಿ ಗುಲಾಬಿ ಕಾಯಿಕೊರಕಕ್ಕೆ ಮೋಹಕ ಬಲೆ ಅಳವಡಿಸಿ. ಭತ್ತಕ್ಕೆ ಮುಂಜಾನೆ ತಂಪಿನಲ್ಲಿ ನೀರು ಹಾಯಿಸಿ."
  },
  {
    id: "koppal",
    division: "Kalaburagi",
    nameEn: "Koppal (Paddy & Kushtagi Bhagwa Pomegranate)",
    nameKn: "ಕೊಪ್ಪಳ (ಕುಷ್ಟಗಿ ದಾಳಿಂಬೆ & ಭತ್ತ)",
    temp: 32,
    humidity: 50,
    rainfallProb: 20,
    windSpeed: 15,
    soilMoisture: "47% VWC",
    pestHeadingEn: "Advisory: Thrips & Mites in Pomegranate Orchards",
    pestHeadingKn: "ಸಲಹೆ: ದಾಳಿಂಬೆ ತೋಟಗಳಲ್ಲಿ ನುಸಿ & ಜಿಗಿಹುಳು",
    pestBodyEn: "Leaf curling and rind scarring. Apply wettable sulphur (3g/L) during sunny clear periods.",
    pestBodyKn: "ದಾಳಿಂಬೆ ಎಲೆ ಸುರುಟುವುದು. ಬಿಸಿಲು ಇರುವಾಗ ೩ ಗ್ರಾಂ ಗಂಧಕದ ದ್ರಾವಣವನ್ನು ಸಿಂಪಡಿಸಿ."
  },
  {
    id: "ballari",
    division: "Kalaburagi",
    nameEn: "Ballari (Bellary Jeans, Onion & Fig)",
    nameKn: "ಬಳ್ಳಾರಿ (ಈರುಳ್ಳಿ, ಅಂಜೂರ & ಗಣಿ ನಾಡು)",
    temp: 33,
    humidity: 45,
    rainfallProb: 15,
    windSpeed: 16,
    soilMoisture: "43% VWC",
    pestHeadingEn: "Warning: Purple Blotch in Bellary Red Onion",
    pestHeadingKn: "ಎಚ್ಚರಿಕೆ: ಬಳ್ಳಾರಿ ಈರುಳ್ಳಿಯಲ್ಲಿ ನೇರಳೆ ಮಚ್ಚೆ ರೋಗ",
    pestBodyEn: "Purplish lesions spreading from leaf tips downwards. Spray Mancozeb (2.5g/L) mixed with sandovit sticker.",
    pestBodyKn: "ಈರುಳ್ಳಿ ಗರಿಗಳಲ್ಲಿ ನೇರಳೆ ಮಚ್ಚೆ ರೋಗ. ೨.೫ ಗ್ರಾಂ ಮ್ಯಾಂಕೋಜೆಬ್ ಅನ್ನು ಅಂಟು ಬೆರೆಸಿ ಸಿಂಪಡಿಸಿ."
  },
  {
    id: "vijayanagara",
    division: "Kalaburagi",
    nameEn: "Vijayanagara (Hosapete / Hampi Heritage Zone)",
    nameKn: "ವಿಜಯನಗರ (ಹೊಸಪೇಟೆ / ಹಂಪಿ ಪರಿಸರ)",
    temp: 32,
    humidity: 48,
    rainfallProb: 20,
    windSpeed: 15,
    soilMoisture: "46% VWC",
    pestHeadingEn: "Advisory: Brown Plant Hopper (BPH) in Tunga Basin Paddy",
    pestHeadingKn: "ಸಲಹೆ: ತುಂಗಭದ್ರಾ ಅಚ್ಚುಕಟ್ಟು ಭತ್ತದಲ್ಲಿ ಜಿಗಿಹುಳು (BPH)",
    pestBodyEn: "Examine base of paddy stems above water line. Drain stagnant water for 3 days and apply Triflumezopyrim.",
    pestBodyKn: "ಭತ್ತದ ಬುಡದಲ್ಲಿ ಜಿಗಿಹುಳುಗಳ ತಪಾಸಣೆ ನಡೆಸಿ. ೩ ದಿನ ಗದ್ದೆಯಿಂದ ನೀರು ಬಸಿದು ಶಿಫಾರಸು ಮಾಡಿದ ಔಷಧ ಕೊಡಿ."
  },
  {
    id: "yadgir",
    division: "Kalaburagi",
    nameEn: "Yadgir (Yadagiri / Paddy & Pulses)",
    nameKn: "ಯಾದಗಿರಿ (ಭತ್ತ & ತೊಗರಿ)",
    temp: 34,
    humidity: 46,
    rainfallProb: 15,
    windSpeed: 16,
    soilMoisture: "44% VWC",
    pestHeadingEn: "Advisory: Leaf Blast in Krishna Command Paddy",
    pestHeadingKn: "ಸಲಹೆ: ಕೃಷ್ಣಾ ಅಚ್ಚುಕಟ್ಟು ಭತ್ತದಲ್ಲಿ ಎಲೆ ಬೆಂಕಿ ರೋಗ",
    pestBodyEn: "Diamond shaped spots with grey center. Avoid excessive Urea top-dressing and apply Kasugamycin (2ml/L).",
    pestBodyKn: "ಭತ್ತದ ಎಲೆಯಲ್ಲಿ ಕಣ್ಣಿನಾಕಾರದ ಬೆಂಕಿ ಮಚ್ಚೆಗಳು. ಯೂರಿಯಾ ಗೊಬ್ಬರ ಮಿತವಾಗಿ ಬಳಸಿ ಶಿಫಾರಸು ಔಷಧ ಸಿಂಪಡಿಸಿ."
  }
];

const TRANSLATIONS = {
  en: {
    appName: "Raitha Sethu",
    tagline: "Bridging Farmers to Markets, Experts & Fair Prices",
    langToggle: "ಕನ್ನಡ",
    tabWeather: "Weather & Alert",
    tabDisease: "Disease Detector",
    tabMarket: "Karnataka Mandi Bhav",
    tabSchemes: "Govt Schemes",
    tabMarketplace: "Direct Sell",
    tabExpert: "AI & Expert Hub",
    changeLocation: "Change Location",
    currentLocation: "Selected District:",
    loginTitle: "Farmer Login / Registration",
    loginSubtitle: "Sign in with your Mobile & OTP to access personalized advisories and APMC buyer orders",
    nameLabel: "Farmer Full Name",
    namePlaceholder: "e.g. Ramesh Basappa Gowda",
    mobileLabel: "Mobile Number",
    otpLabel: "Enter 4-Digit OTP",
    getOtpBtn: "Send OTP via SMS",
    verifyLoginBtn: "Verify & Enter Hub",
    resendOtp: "Resend OTP",
    otpSentHint: "OTP sent to your mobile: try 1234 (Demo)",
    whyNoSmsHeading: "Why is SMS not reaching your phone?",
    whyNoSmsText: "Real telecom SMS requires a backend SMS Gateway (MSG91/Twilio). On this live preview, your code is displayed on screen and can also be sent via WhatsApp or auto-filled instantly below!",
    instantSmsBadge: "Simulated SMS Delivered",
    whatsappBtn: "Send via WhatsApp",
    quickBypassBtn: "Instant Login (No OTP needed)",
    weatherTitle: "Live Agro-Weather & Field Alert",
    soilHealth: "Soil Moisture & Health",
    nitrogenLevel: "Nitrogen (N): Good | pH: 6.8",
    readAloud: "Listen to Voice",
    stopAudio: "Stop Voice",
    voiceAssistantPrompt: "Ask anything in Kannada or English (Tap mic)...",
    listening: "Listening to your voice...",
    uploadPhoto: "Capture / Upload Leaf Photo",
    analyzingImage: "Gemini Vision analyzing plant leaf pathology...",
    diagnoseButton: "Run Disease Diagnosis with Gemini",
    groundedSearch: "Live Grounded Search",
    searchingLive: "Searching APMC Mandi web updates...",
    schemeAiCheck: "AI Eligibility Calculator",
    mandiHeading: "Pan-Karnataka APMC Market Rates",
    mandiSearchPlaceholder: "Search any crop, flower, seed, fruit or mandi...",
    schemesHeading: "Government Subsidies & Benefits",
    sellProduce: "Sell Produce Directly",
    postListing: "+ Post New Harvest",
    verifiedBuyers: "Verified APMC & Corporate Buyers",
    callBuyer: "Contact Buyer",
    aiDoctorTitle: "Raitha Sethu AI Doctor & Agronomist Connect",
    chatPlaceholder: "Describe leaf symptoms, fertilizer questions, or market queries...",
    activeKvkDoctor: "Dr. K. S. Manjunath (KVK Chikkamagaluru) is Online",
    marketFairPriceBadge: "Fair Price Verified",
    rateChange24h: "vs yesterday",
    allCategories: "All Varieties",
    catVegetables: "Vegetables",
    catFruits: "Fruits",
    catGrains: "Grains & Pulses",
    catSeeds: "Seeds & Oilseeds",
    catFlowers: "Flowers",
    catCommercial: "Commercial / Spices"
  },
  kn: {
    appName: "ರೈತ ಸೇತು",
    tagline: "ರೈತರಿಗೆ ಮಾರುಕಟ್ಟೆ, ಬೆಳೆ ವೈದ್ಯ ಮತ್ತು ನ್ಯಾಯಯುತ ಬೆಲೆಯ ನೇರ ಸೇತುವೆ",
    langToggle: "English",
    tabWeather: "ಹವಾಮಾನ & ಸಲಹೆ",
    tabDisease: "ಬೆಳೆ ರೋಗ ಪರೀಕ್ಷಕ",
    tabMarket: "ಎಪಿಎಂಸಿ ದರಗಳು",
    tabSchemes: "ಸರ್ಕಾರಿ ಯೋಜನೆ",
    tabMarketplace: "ನೇರ ಮಾರಾಟ",
    tabExpert: "ತಜ್ಞರ ಸಮಾಲೋಚನೆ",
    changeLocation: "ಸ್ಥಳ ಬದಲಾಯಿಸಿ",
    currentLocation: "ಆಯ್ದ ಜಿಲ್ಲೆ / ವಲಯ:",
    loginTitle: "ರೈತರ ಲಾಗಿನ್ / ನೋಂದಣಿ",
    loginSubtitle: "ನಿಮ್ಮ ಮೊಬೈಲ್ ಮತ್ತು ಓಟಿಪಿ (OTP) ಮೂಲಕ ಲಾಗಿನ್ ಆಗಿ ನೇರ ಸೌಲಭ್ಯಗಳನ್ನು ಪಡೆಯಿರಿ",
    nameLabel: "ರೈತರ ಪೂರ್ಣ ಹೆಸರು",
    namePlaceholder: "ಉದಾ: ರಮೇಶ್ ಬಸಪ್ಪ ಗೌಡ",
    mobileLabel: "ಮೊಬೈಲ್ ಸಂಖ್ಯೆ",
    otpLabel: "೪-ಅಂಕಿಯ OTP ನಮೂದಿಸಿ",
    getOtpBtn: "OTP ಕಳುಹಿಸಿ",
    verifyLoginBtn: "ದೃಢೀಕರಿಸಿ ಮುಂದುವರಿಯಿರಿ",
    resendOtp: "ಮತ್ತೆ OTP ಕಳುಹಿಸಿ",
    otpSentHint: "ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ ಕಳುಹಿಸಿದ ಕೋಡ್: 1234 ಬಳಸಿ",
    whyNoSmsHeading: "ನಿಮ್ಮ ಮೊಬೈಲ್‌ಗೆ SMS ಏಕೆ ಬಂದಿಲ್ಲ?",
    whyNoSmsText: "ನಿಜವಾದ ಸಿಮ್ ಕಾರ್ಡ್‌ಗೆ SMS ಬರಲು ಟೆಲಿಕಾಂ ಗೇಟ್‌ವೇ ಬೇಕು. ಈ ಆ್ಯಪ್‌ನಲ್ಲಿ ಯಾವುದೇ ಕಾಯುವಿಕೆ ಇಲ್ಲದೆ ಕೋಡ್ ಅನ್ನು ಪರದೆಯ ಮೇಲೆ ನೀಡಲಾಗಿದೆ. ವಾಟ್ಸಾಪ್ ಮೂಲಕವೂ ಪಡೆಯಬಹುದು ಅಥವಾ ಕೆಳಗಿನ 'ಸ್ವಯಂ ಭರ್ತಿ' ಬಟನ್ ಒತ್ತಿ ಲಾಗಿನ್ ಆಗಿ!",
    instantSmsBadge: "ತ್ವರಿತ ವರ್ಚುವಲ್ SMS",
    whatsappBtn: "ವಾಟ್ಸಾಪ್‌ಗೆ ಕಳುಹಿಸಿ",
    quickBypassBtn: "ನೇರ ಲಾಗಿನ್ (OTP ಕಾಯಬೇಕಿಲ್ಲ)",
    weatherTitle: "ಲೈವ್ ಕೃಷಿ ಹವಾಮಾನ & ಎಚ್ಚರಿಕೆ",
    soilHealth: "ಮಣ್ಣಿನ ತೇವಾಂಶ ಮತ್ತು ಫಲವತ್ತತೆ",
    nitrogenLevel: "ಸಾರಜನಕ: ಉತ್ತಮ | ಮಣ್ಣಿನ pH: ೬.೮",
    readAloud: "ಧ್ವನಿಯಲ್ಲಿ ಆಲಿಸಿ",
    stopAudio: "ನಿಲ್ಲಿಸಿ",
    voiceAssistantPrompt: "ಕನ್ನಡದಲ್ಲಿ ಮಾತನಾಡಿ ಪ್ರಶ್ನಿಸಿ (ಮೈಕ್ ಒತ್ತಿ)...",
    listening: "ನಿಮ್ಮ ಧ್ವನಿ ಆಲಿಸಲಾಗುತ್ತಿದೆ...",
    uploadPhoto: "ಎಲೆಯ ಫೋಟೋ ತೆಗೆಯಿರಿ / ಅಪ್ಲೋಡ್ ಮಾಡಿ",
    analyzingImage: "ಜೆಮಿನಿ AI ಎಲೆಯ ರೋಗ ಮತ್ತು ಕೀಟಬಾಧೆಯನ್ನು ಪರಿಶೀಲಿಸುತ್ತಿದೆ...",
    diagnoseButton: "ಜೆಮಿನಿ AI ಬೆಳೆ ರೋಗ ಪರೀಕ್ಷೆ",
    groundedSearch: "ಲೈವ್ ಮಾರುಕಟ್ಟೆ ಶೋಧನೆ",
    searchingLive: "ಇತ್ತೀಚಿನ ಎಪಿಎಂಸಿ ದರಗಳನ್ನು ಹುಡುಕಲಾಗುತ್ತಿದೆ...",
    schemeAiCheck: "AI ಅರ್ಹತಾ ವಿಶ್ಲೇಷಣೆ",
    mandiHeading: "ಕರ್ನಾಟಕದ ಎಲ್ಲಾ ಎಪಿಎಂಸಿ ಮಾರುಕಟ್ಟೆ ಧಾರಣೆ",
    mandiSearchPlaceholder: "ತರಕಾರಿ, ಹಣ್ಣು, ಬೀಜ, ಹೂವು, ಧಾನ್ಯ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಹುಡುಕಿ...",
    schemesHeading: "ಸರ್ಕಾರಿ ಸಬ್ಸಿಡಿ & ಯೋಜನೆಗಳು",
    sellProduce: "ನೇರವಾಗಿ ಖರೀದಿದಾರರಿಗೆ ಮಾರಿ",
    postListing: "+ ಬೆಳೆ ಮಾರಾಟ ದಾಖಲಿಸಿ",
    verifiedBuyers: "ಪರಿಶೀಲಿತ ಖರೀದಿದಾರರು & ವರ್ತಕರು",
    callBuyer: "ಸಂಪರ್ಕಿಸಿ",
    aiDoctorTitle: "ರೈತ ಸೇತು AI ಬೆಳೆ ವೈದ್ಯ & ಕೃಷಿ ವಿಜ್ಞಾನಿಗಳ ಸಲಹೆ",
    chatPlaceholder: "ಬೆಳೆ ರೋಗ, ಗೊಬ್ಬರ ಪ್ರಮಾಣ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಬಗ್ಗೆ ಪ್ರಶ್ನೆ ಕೇಳಿ...",
    activeKvkDoctor: "ಡಾ. ಕೆ. ಎಸ್. ಮಂಜುನಾಥ್ (ಕೆವಿಕೆ ವಿಜ್ಞಾನಿ) ಲಭ್ಯವಿದ್ದಾರೆ",
    marketFairPriceBadge: "ಖಾತರಿ ನ್ಯಾಯಯುತ ದರ",
    rateChange24h: "ನಿನ್ನೆಗಿಂತ",
    allCategories: "ಎಲ್ಲಾ ವಿಧಗಳು",
    catVegetables: "ತರಕಾರಿಗಳು",
    catFruits: "ಹಣ್ಣುಗಳು",
    catGrains: "ಧಾನ್ಯ ಮತ್ತು ಕಾಳುಗಳು",
    catSeeds: "ಬೀಜಗಳು & ಎಣ್ಣೆಕಾಳು",
    catFlowers: "ಹೂವುಗಳು",
    catCommercial: "ವಾಣಿಜ್ಯ & ಸಂಬಾರ ಬೆಳೆ"
  }
};

// COMPREHENSIVE PAN-KARNATAKA APMC COMMODITY RATES
const PAN_KARNATAKA_MANDI_DATA = [
  // --- VEGETABLES ---
  { id: "v1", category: "vegetables", cropEn: "Tomato (Hybrid)", cropKn: "ಟೊಮ್ಯಾಟೊ (ಹೈಬ್ರಿಡ್)", mandiEn: "Kolar APMC", mandiKn: "ಕೋಲಾರ", price: 1850, unit: "15kg Box", trend: "+ ₹210", isUp: true, arrival: "3,200 Boxes" },
  { id: "v2", category: "vegetables", cropEn: "Onion (Medium Local)", cropKn: "ಈರುಳ್ಳಿ (ಸ್ಥಳೀಯ)", mandiEn: "Hubballi APMC", mandiKn: "ಹುಬ್ಬಳ್ಳಿ", price: 3400, unit: "Qtl", trend: "- ₹110", isUp: false, arrival: "1,100 Bags" },
  { id: "v3", category: "vegetables", cropEn: "Potato (Local Jyoti)", cropKn: "ಆಲೂಗಡ್ಡೆ", mandiEn: "Hassan Market", mandiKn: "ಹಾಸನ", price: 2100, unit: "Qtl", trend: "+ ₹50", isUp: true, arrival: "950 Bags" },
  { id: "v4", category: "vegetables", cropEn: "Green Chilli (G4)", cropKn: "ಹಸಿಮೆಣಸಿನಕಾಯಿ", mandiEn: "Ramanagara APMC", mandiKn: "ರಾಮನಗರ", price: 5200, unit: "Qtl", trend: "+ ₹200", isUp: true, arrival: "340 Qtl" },
  { id: "v5", category: "vegetables", cropEn: "Brinjal (Green Long)", cropKn: "ಬದನೆಕಾಯಿ (ಹಸಿರು)", mandiEn: "Belagavi APMC", mandiKn: "ಬೆಳಗಾವಿ", price: 2400, unit: "Qtl", trend: "+ ₹80", isUp: true, arrival: "210 Qtl" },
  { id: "v6", category: "vegetables", cropEn: "Beans (French)", cropKn: "ಬೀನ್ಸ್ (ಫ್ರೆಂಚ್)", mandiEn: "Chikkaballapur", mandiKn: "ಚಿಕ್ಕಬಳ್ಳಾಪುರ", price: 6500, unit: "Qtl", trend: "+ ₹350", isUp: true, arrival: "180 Qtl" },
  { id: "v7", category: "vegetables", cropEn: "Cauliflower", cropKn: "ಹೂಕೋಸು", mandiEn: "Davanagere APMC", mandiKn: "ದಾವಣಗೆರೆ", price: 1600, unit: "Qtl", trend: "- ₹40", isUp: false, arrival: "420 Qtl" },
  { id: "v8", category: "vegetables", cropEn: "Cabbage", cropKn: "ಎಲೆಕೋಸು", mandiEn: "Belagavi APMC", mandiKn: "ಬೆಳಗಾವಿ", price: 1750, unit: "Qtl", trend: "+ ₹60", isUp: true, arrival: "390 Qtl" },
  { id: "v9", category: "vegetables", cropEn: "Garlic (Wet)", cropKn: "ಬೆಳ್ಳುಳ್ಳಿ", mandiEn: "Bengaluru APMC", mandiKn: "ಬೆಂಗಳೂರು (ಯಶವಂತಪುರ)", price: 14000, unit: "Qtl", trend: "+ ₹500", isUp: true, arrival: "550 Bags" },
  { id: "v10", category: "vegetables", cropEn: "Ginger (Green)", cropKn: "ಹಸಿ ಶುಂಠಿ", mandiEn: "Shivamogga APMC", mandiKn: "ಶಿವಮೊಗ್ಗ", price: 8200, unit: "Qtl", trend: "+ ₹250", isUp: true, arrival: "280 Qtl" },

  // --- FRUITS ---
  { id: "f1", category: "fruits", cropEn: "Banana (Nanjangud Rasabale)", cropKn: "ನಂಜನಗೂಡು ರಸಬಾಳೆ", mandiEn: "Nanjangud / Mysuru", mandiKn: "ನಂಜನಗೂಡು / ಮೈಸೂರು", price: 5400, unit: "Qtl", trend: "+ ₹300", isUp: true, arrival: "85 Qtl" },
  { id: "f2", category: "fruits", cropEn: "Banana (Robusta / Cavendish)", cropKn: "ಬಾಳೆಹಣ್ಣು (ಪಚ್ಚಬಾಳೆ)", mandiEn: "Bengaluru Binny Mill", mandiKn: "ಬೆಂಗಳೂರು ಬಿನ್ನಿಮಿಲ್", price: 2200, unit: "Qtl", trend: "+ ₹90", isUp: true, arrival: "950 Qtl" },
  { id: "f3", category: "fruits", cropEn: "Pomegranate (Bhagwa)", cropKn: "ದಾಳಿಂಬೆ (ಭಗವಾ)", mandiEn: "Kushtagi / Koppal", mandiKn: "ಕುಷ್ಟಗಿ / ಕೊಪ್ಪಳ", price: 12500, unit: "Qtl", trend: "+ ₹650", isUp: true, arrival: "210 Qtl" },
  { id: "f4", category: "fruits", cropEn: "Sweet Lime (Mosambi)", cropKn: "ಮೂಸಂಬಿ", mandiEn: "Vijayapura APMC", mandiKn: "ವಿಜಯಪುರ", price: 4600, unit: "Qtl", trend: "- ₹80", isUp: false, arrival: "320 Qtl" },
  { id: "f5", category: "fruits", cropEn: "Grapes (Thomson Seedless)", cropKn: "ದ್ರಾಕ್ಷಿ", mandiEn: "Bagalkot / Jamkhandi", mandiKn: "ಬಾಗಲಕೋಟೆ", price: 7800, unit: "Qtl", trend: "+ ₹200", isUp: true, arrival: "160 Qtl" },
  { id: "f6", category: "fruits", cropEn: "Mango (Totapuri)", cropKn: "ಮಾವು (ತೋತಾಪುರಿ)", mandiEn: "Srinivaspur APMC", mandiKn: "ಶ್ರೀನಿವಾಸಪುರ", price: 3200, unit: "Qtl", trend: "+ ₹120", isUp: true, arrival: "420 Qtl" },
  { id: "f7", category: "fruits", cropEn: "Papaya (Red Lady)", cropKn: "ಪಪ್ಪಾಯಿ", mandiEn: "Kalaburagi APMC", mandiKn: "ಕಲಬುರಗಿ", price: 1800, unit: "Qtl", trend: "- ₹50", isUp: false, arrival: "350 Qtl" },
  { id: "f8", category: "fruits", cropEn: "Watermelon (Kiran)", cropKn: "ಕಲ್ಲಂಗಡಿ", mandiEn: "Ballari APMC", mandiKn: "ಬಳ್ಳಾರಿ", price: 1350, unit: "Qtl", trend: "+ ₹40", isUp: true, arrival: "620 Qtl" },

  // --- GRAINS & PULSES ---
  { id: "g1", category: "grains", cropEn: "Ragi (Finger Millet - Fine)", cropKn: "ರಾಗಿ (ಉತ್ತಮ ತಳಿ)", mandiEn: "Mandya APMC", mandiKn: "ಮಂಡ್ಯ", price: 3550, unit: "Qtl", trend: "+ ₹120", isUp: true, arrival: "850 Bags" },
  { id: "g2", category: "grains", cropEn: "Paddy (Sona Masoori)", cropKn: "ಭತ್ತ (ಸೋನಾ ಮಸೂರಿ)", mandiEn: "Raichur Mandi", mandiKn: "ರಾಯಚೂರು", price: 2720, unit: "Qtl", trend: "+ ₹40", isUp: true, arrival: "1,200 Bags" },
  { id: "g3", category: "grains", cropEn: "Rice (Raw Sona Masoori)", cropKn: "ಅಕ್ಕಿ (ಸೋನಾ ಮಸೂರಿ)", mandiEn: "Gangavathi APMC", mandiKn: "ಗಂಗಾವತಿ", price: 4065, unit: "Qtl", trend: "+ ₹85", isUp: true, arrival: "920 Qtl" },
  { id: "g4", category: "grains", cropEn: "Maize (Hybrid Feed)", cropKn: "ಮೆಕ್ಕೆಜೋಳ", mandiEn: "Davanagere APMC", mandiKn: "ದಾವಣಗೆರೆ", price: 2630, unit: "Qtl", trend: "+ ₹30", isUp: true, arrival: "2,400 Qtl" },
  { id: "g5", category: "grains", cropEn: "Jowar (White Sorghum)", cropKn: "ಬಿಳಿ ಜೋಳ", mandiEn: "Kottur / Ballari", mandiKn: "ಕೊಟ್ಟೂರು / ಬಳ್ಳಾರಿ", price: 3450, unit: "Qtl", trend: "+ ₹75", isUp: true, arrival: "430 Qtl" },
  { id: "g6", category: "grains", cropEn: "Tur Dal (Red Gram - Whole)", cropKn: "ತೊಗರಿ ಕಾಳು (ಗುಲ್ಬರ್ಗಾ)", mandiEn: "Kalaburagi APMC", mandiKn: "ಕಲಬುರಗಿ", price: 10400, unit: "Qtl", trend: "- ₹150", isUp: false, arrival: "1,800 Bags" },
  { id: "g7", category: "grains", cropEn: "Bengal Gram (Chana Whole)", cropKn: "ಕಡಲೆ ಕಾಳು", mandiEn: "Bailahongal APMC", mandiKn: "ಬೈಲಹೊಂಗಲ", price: 7860, unit: "Qtl", trend: "+ ₹90", isUp: true, arrival: "750 Bags" },
  { id: "g8", category: "grains", cropEn: "Foxtail Millet (Navane)", cropKn: "ನವಣೆ ಸಿರಿಧಾನ್ಯ", mandiEn: "Haveri APMC", mandiKn: "ಹಾವೇರಿ", price: 3800, unit: "Qtl", trend: "+ ₹50", isUp: true, arrival: "220 Qtl" },
  { id: "g9", category: "grains", cropEn: "Green Gram (Moong Whole)", cropKn: "ಹೆಸರು ಕಾಳು", mandiEn: "Gadag APMC", mandiKn: "ಗದಗ", price: 9200, unit: "Qtl", trend: "+ ₹110", isUp: true, arrival: "310 Qtl" },
  { id: "g10", category: "grains", cropEn: "Horse Gram (Huruli)", cropKn: "ಹುರುಳಿ ಕಾಳು", mandiEn: "Tumakuru APMC", mandiKn: "ತುಮಕೂರು", price: 4900, unit: "Qtl", trend: "+ ₹20", isUp: true, arrival: "190 Bags" },

  // --- SEEDS & OILSEEDS ---
  { id: "s1", category: "seeds", cropEn: "Groundnut Seed (Raw Kernels)", cropKn: "ಕಡಲೆಕಾಯಿ ಬೀಜ (ಶೇಂಗಾ)", mandiEn: "Hiriyur / Chitradurga", mandiKn: "ಹಿರಿಯೂರು / ಚಿತ್ರದುರ್ಗ", price: 13400, unit: "Qtl", trend: "+ ₹350", isUp: true, arrival: "840 Qtl" },
  { id: "s2", category: "seeds", cropEn: "Groundnut (With Pod)", cropKn: "ಕಡಲೆಕಾಯಿ ಕಾಯಿ", mandiEn: "Bengaluru APMC", mandiKn: "ಬೆಂಗಳೂರು", price: 6200, unit: "Qtl", trend: "+ ₹120", isUp: true, arrival: "620 Bags" },
  { id: "s3", category: "seeds", cropEn: "Sunflower Seed", cropKn: "ಸೂರ್ಯಕಾಂತಿ ಬೀಜ", mandiEn: "Gadag APMC", mandiKn: "ಗದಗ", price: 7850, unit: "Qtl", trend: "+ ₹180", isUp: true, arrival: "540 Qtl" },
  { id: "s4", category: "seeds", cropEn: "Sesame (White Til)", cropKn: "ಬಿಳಿ ಎಳ್ಳು", mandiEn: "Raichur APMC", mandiKn: "ರಾಯಚೂರು", price: 17500, unit: "Qtl", trend: "+ ₹400", isUp: true, arrival: "160 Bags" },
  { id: "s5", category: "seeds", cropEn: "Soyabean (Yellow)", cropKn: "ಸೋಯಾಬೀನ್", mandiEn: "Belagavi APMC", mandiKn: "ಬೆಳಗಾವಿ", price: 4750, unit: "Qtl", trend: "- ₹60", isUp: false, arrival: "890 Qtl" },
  { id: "s6", category: "seeds", cropEn: "Cotton Seed (Kapas Seed)", cropKn: "ಹತ್ತಿ ಬೀಜ", mandiEn: "Haveri / Ranebennur", mandiKn: "ಹಾವೇರಿ / ರಾಣೆಬೆನ್ನೂರು", price: 3600, unit: "Qtl", trend: "+ ₹50", isUp: true, arrival: "450 Qtl" },
  { id: "s7", category: "seeds", cropEn: "Mustard Seed (Sasive)", cropKn: "ಸಾಸಿವೆ ಕಾಳು", mandiEn: "Bengaluru APMC", mandiKn: "ಬೆಂಗಳೂರು", price: 6800, unit: "Qtl", trend: "+ ₹90", isUp: true, arrival: "210 Bags" },
  { id: "s8", category: "seeds", cropEn: "Coriander Seed (Dhania)", cropKn: "ಕೊತ್ತಂಬರಿ ಬೀಜ (ಧನಿಯಾ)", mandiEn: "Vijayapura APMC", mandiKn: "ವಿಜಯಪುರ", price: 12400, unit: "Qtl", trend: "+ ₹280", isUp: true, arrival: "175 Qtl" },

  // --- FLOWERS ---
  { id: "fl1", category: "flowers", cropEn: "Jasmine (Mysore Mallige)", cropKn: "ಮೈಸೂರು ಮಲ್ಲಿಗೆ", mandiEn: "KR Market Bengaluru", mandiKn: "ಬೆಂಗಳೂರು ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆ", price: 650, unit: "Kg", trend: "+ ₹80", isUp: true, arrival: "450 Kg" },
  { id: "fl2", category: "flowers", cropEn: "Marigold (Orange Chendu)", cropKn: "ಚೆಂಡು ಹೂ (ಕೇಸರಿ)", mandiEn: "Devenahalli / KR Market", mandiKn: "ದೇವನಹಳ್ಳಿ / ಬೆಂಗಳೂರು", price: 90, unit: "Kg", trend: "+ ₹15", isUp: true, arrival: "3,800 Kg" },
  { id: "fl3", category: "flowers", cropEn: "Red Rose (Dutch Cut)", cropKn: "ಗುಲಾಬಿ (ರೆಡ್ ರೋಸ್)", mandiEn: "KR Market Bengaluru", mandiKn: "ಬೆಂಗಳೂರು ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆ", price: 260, unit: "Kg", trend: "+ ₹25", isUp: true, arrival: "1,200 Kg" },
  { id: "fl4", category: "flowers", cropEn: "Loose Red Rose (Button)", cropKn: "ಗುಲಾಬಿ (ಬಿಡಿ ಹೂ)", mandiEn: "Mysuru Flower Market", mandiKn: "ಮೈಸೂರು ಹೂವಿನ ಮಾರುಕಟ್ಟೆ", price: 130, unit: "Kg", trend: "- ₹10", isUp: false, arrival: "850 Kg" },
  { id: "fl5", category: "flowers", cropEn: "Crossandra (Kanakambara)", cropKn: "ಕನಕಾಂಬರ", mandiEn: "KR Market Bengaluru", mandiKn: "ಬೆಂಗಳೂರು ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆ", price: 1200, unit: "Kg", trend: "+ ₹150", isUp: true, arrival: "120 Kg" },
  { id: "fl6", category: "flowers", cropEn: "Chrysanthemum (Sevanthige)", cropKn: "ಸೇವಂತಿಗೆ", mandiEn: "Shivamogga Market", mandiKn: "ಶಿವಮೊಗ್ಗ", price: 180, unit: "Kg", trend: "+ ₹20", isUp: true, arrival: "680 Kg" },
  { id: "fl7", category: "flowers", cropEn: "Tuberose (Sugandharaja)", cropKn: "ಸುಗಂಧರಾಜ", mandiEn: "Kolar Flower Mandi", mandiKn: "ಕೋಲಾರ", price: 240, unit: "Kg", trend: "+ ₹30", isUp: true, arrival: "520 Kg" },

  // --- COMMERCIAL & PLANTATION / SPICES ---
  { id: "c1", category: "commercial", cropEn: "Arecanut (Rashi)", cropKn: "ಅಡಿಕೆ (ರಾಶಿ)", mandiEn: "Shivamogga APMC", mandiKn: "ಶಿವಮೊಗ್ಗ", price: 52400, unit: "Qtl", trend: "+ ₹850", isUp: true, arrival: "420 Bags" },
  { id: "c2", category: "commercial", cropEn: "Arecanut (Chali / Supari)", cropKn: "ಅಡಿಕೆ (ಚಾಲಿ)", mandiEn: "Sirsi / Honnavar APMC", mandiKn: "ಶಿರಸಿ / ಹೊನ್ನಾವರ", price: 44200, unit: "Qtl", trend: "+ ₹600", isUp: true, arrival: "350 Bags" },
  { id: "c3", category: "commercial", cropEn: "Dry Chilli (Byadgi Kaddi)", cropKn: "ಬ್ಯಾಡಗಿ ಮೆಣಸಿನಕಾಯಿ (ಕಡ್ಡಿ)", mandiEn: "Byadgi APMC", mandiKn: "ಬ್ಯಾಡಗಿ", price: 48500, unit: "Qtl", trend: "+ ₹1400", isUp: true, arrival: "2,100 Bags" },
  { id: "c4", category: "commercial", cropEn: "Coffee (Robusta Parchment)", cropKn: "ಕಾಫಿ (ರೋಬಸ್ಟಾ ಪಾರ್ಚ್‌ಮೆಂಟ್)", mandiEn: "Chikkamagaluru", mandiKn: "ಚಿಕ್ಕಮಗಳೂರು", price: 14200, unit: "50kg Bag", trend: "+ ₹400", isUp: true, arrival: "280 Bags" },
  { id: "c5", category: "commercial", cropEn: "Copra (Milling / Edible)", cropKn: "ಕೊಬ್ಬರಿ (ಉಂಡೆ ಕೊಬ್ಬರಿ)", mandiEn: "Tiptur APMC", mandiKn: "ತಿಪಟೂರು", price: 16800, unit: "Qtl", trend: "+ ₹350", isUp: true, arrival: "1,150 Qtl" },
  { id: "c6", category: "commercial", cropEn: "Turmeric (Finger Salem)", cropKn: "ಅರಿಶಿನ ಕೊಂಬು", mandiEn: "Chamarajanagar", mandiKn: "ಚಾಮರಾಜನಗರ", price: 14100, unit: "Qtl", trend: "+ ₹300", isUp: true, arrival: "310 Qtl" },
  { id: "c7", category: "commercial", cropEn: "Black Pepper (Garbled)", cropKn: "ಕಾಳು ಮೆಣಸು", mandiEn: "Madikeri / Sakleshpur", mandiKn: "ಮಡಿಕೇರಿ / ಸಕಲೇಶಪುರ", price: 68500, unit: "Qtl", trend: "+ ₹700", isUp: true, arrival: "140 Qtl" }
];

const MOCK_SCHEMES = [
  {
    id: "pm-kisan",
    titleEn: "PM-Kisan Samman Nidhi & Raitha Siri",
    titleKn: "ಪಿಎಂ ಕಿಸಾನ್ ಮತ್ತು ರೈತ ಸಿರಿ ನೆರವು ಯೋಜನೆ",
    deptEn: "Dept. of Agriculture, Karnataka",
    deptKn: "ಕರ್ನಾಟಕ ಕೃಷಿ ಇಲಾಖೆ",
    amount: "₹6,000 + ₹4,000 / year",
    eligibilityEn: "Small & Marginal Farmers with land ownership proof (Pahani/RTC).",
    eligibilityKn: "ಪಹಣಿ (RTC) ಹೊಂದಿರುವ ಸಣ್ಣ ಮತ್ತು ಅತಿ ಸಣ್ಣ ರೈತ ಕುಟುಂಬಗಳು.",
    deadlineEn: "Open throughout the year",
    deadlineKn: "ವರ್ಷವಿಡೀ ಮುಕ್ತ ನೋಂದಣಿ",
    directUrl: "https://pmkisan.gov.in"
  },
  {
    id: "pmfby",
    titleEn: "PM Fasal Bima Yojana (Crop Insurance)",
    titleKn: "ಪ್ರಧಾನ ಮಂತ್ರಿ ಫಸಲ್ ಬಿಮಾ ಯೋಜನೆ (ಬೆಳೆ ವಿಮೆ)",
    deptEn: "Ministry of Agriculture & Farmers Welfare",
    deptKn: "ಕೇಂದ್ರ ಹಾಗೂ ರಾಜ್ಯ ಬೆಳೆ ವಿಮೆ ನಿರ್ದೇಶನಾಲಯ",
    amount: "Up to 90% claim against drought/pest losses",
    eligibilityEn: "Loanee & Non-loanee farmers cultivating notified seasonal crops.",
    eligibilityKn: "ಅಧಿಸೂಚಿತ ಬೆಳೆ ಬೆಳೆಯುವ ಎಲ್ಲಾ ಸಾಲ ಪಡೆದ ಅಥವಾ ಪಡೆಯದ ರೈತರು.",
    deadlineEn: "Kharif: July 31 | Rabi: Dec 15",
    deadlineKn: "ಖಾರಿಫ್: ಜುಲೈ ೩೧ | ರಬಿ: ಡಿಸೆಂಬರ್ ೧೫",
    directUrl: "https://pmfby.gov.in"
  },
  {
    id: "drip-sub",
    titleEn: "Micro-Irrigation (Drip & Sprinkler) 90% Subsidy",
    titleKn: "ಹನಿ ನೀರಾವರಿ & ತುಂತುರು ಉಪಕರಣ ೯೦% ಸಬ್ಸಿಡಿ",
    deptEn: "Horticulture Department Karnataka",
    deptKn: "ತೋಟಗಾರಿಕೆ ಇಲಾಖೆ, ಕರ್ನಾಟಕ",
    amount: "90% Subsidy for SC/ST, 75% for General",
    eligibilityEn: "Farmers having active irrigation water source with minimum 1 acre.",
    eligibilityKn: "ಕನಿಷ್ಠ ೧ ಎಕರೆ ಜಮೀನು ಹಾಗೂ ನೀರಿನ ಮೂಲವಿರುವ ರೈತರಿಗೆ ಲಭ್ಯ.",
    deadlineEn: "Current batch active",
    deadlineKn: "ಪ್ರಸ್ತುತ ಅರ್ಜಿ ಚಾಲ್ತಿಯಲ್ಲಿದೆ",
    directUrl: "https://horticulturedir.karnataka.gov.in"
  },
  {
    id: "solar-kusum",
    titleEn: "PM-KUSUM Solar Irrigation Pump Scheme",
    titleKn: "ಪಿಎಂ-ಕುಸುಮ್ ಸೌರ ಪಂಪ್‌ಸೆಟ್ ಯೋಜನೆ",
    deptEn: "KREDL & Energy Dept.",
    deptKn: "ಕರ್ನಾಟಕ ನವೀಕರಿಸಬಹುದಾದ ಇಂಧನ ಅಭಿವೃದ್ಧಿ",
    amount: "Up to 80% Subsidy on 3HP to 7.5HP Solar Pumps",
    eligibilityEn: "Grid-deficit farms with no current energized transformer.",
    eligibilityKn: "ವಿದ್ಯುತ್ ಸಂಪರ್ಕವಿಲ್ಲದ ತೋಟ ಮತ್ತು ಹೊಲಗಳಿಗೆ ಆದ್ಯತೆ.",
    deadlineEn: "Limited allocation for 2026",
    deadlineKn: "ಸೀಮಿತ ಕೋಟಾ ಅರ್ಜಿ ಲಭ್ಯ",
    directUrl: "https://kredl.karnataka.gov.in"
  }
];

const MOCK_BUYERS = [
  {
    id: 101,
    name: "Karnataka Agro Processing Hub",
    location: "Shivamogga Mega Food Park",
    demands: "Arecanut, Maize, Turmeric",
    verification: "APMC Verified A-Class Buyer",
    rating: "4.9 ★ (340 deals)",
    fairPriceGuarantee: true,
    contactPerson: "Santosh Gowda",
    phone: "+91 94812 34567"
  },
  {
    id: 102,
    name: "Organic Mandi Export Collective",
    location: "Yeshwanthpur Industrial Terminal, Bengaluru",
    demands: "Ragi, Millets, Organic Pulses, Flowers",
    verification: "Govt Certified Organic Aggregator",
    rating: "4.8 ★ (180 deals)",
    fairPriceGuarantee: true,
    contactPerson: "Rekha Patil",
    phone: "+91 80234 56789"
  },
  {
    id: 103,
    name: "Malnad Fresh Commodity Traders",
    location: "Channagiri / Davanagere",
    demands: "Arecanut (Bette & Gorabaluk), Spices",
    verification: "Licensed Commission Agent",
    rating: "4.7 ★ (512 deals)",
    fairPriceGuarantee: true,
    contactPerson: "B. M. Siddalingappa",
    phone: "+91 98450 11223"
  }
];

export default function App() {
  const [lang, setLang] = useState('kn'); // Default to Kannada-first design
  const [activeTab, setActiveTab] = useState('weather'); // 'weather' | 'disease' | 'market' | 'schemes' | 'marketplace' | 'expert'
  
  // User Authentication & Profile State
  const [farmerUser, setFarmerUser] = useState({
    isLoggedIn: true,
    name: "ಬಸವರಾಜ್ ಗೌಡ (Basavaraj Gowda)",
    phone: "98450 12345",
    locationZoneId: "mandya"
  });
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authStep, setAuthStep] = useState('phone'); // 'phone' | 'otp'
  const [authForm, setAuthForm] = useState({ name: '', phone: '', otp: '' });
  const [generatedOtp, setGeneratedOtp] = useState('1234');
  const [smsNotification, setSmsNotification] = useState(null);
  const [resendTimer, setResendTimer] = useState(30);

  // Location selector state
  const [currentZoneId, setCurrentZoneId] = useState('mandya');
  const [showLocationModal, setShowLocationModal] = useState(false);
  const [districtSearchQuery, setDistrictSearchQuery] = useState('');

  const activeZone = useMemo(() => {
    return REGIONAL_ZONES.find(z => z.id === currentZoneId) || REGIONAL_ZONES[0];
  }, [currentZoneId]);

  // Filtered districts for search
  const filteredDistricts = useMemo(() => {
    if (!districtSearchQuery.trim()) return REGIONAL_ZONES;
    const q = districtSearchQuery.toLowerCase();
    return REGIONAL_ZONES.filter(z => 
      z.nameEn.toLowerCase().includes(q) ||
      z.nameKn.includes(q) ||
      z.division.toLowerCase().includes(q)
    );
  }, [districtSearchQuery]);

  // Speech and Audio synthesis state
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [isListening, setIsListening] = useState(false);
  const [voiceQueryText, setVoiceQueryText] = useState('');
  const currentAudioRef = useRef(null);

  // Gemini Multimodal Vision Diagnostic State
  const [selectedCropImage, setSelectedCropImage] = useState(null);
  const [cropImageBase64, setCropImageBase64] = useState(null);
  const [isAnalyzingImage, setIsAnalyzingImage] = useState(false);
  const [imageDiagnosisResult, setImageDiagnosisResult] = useState(null);
  const fileInputRef = useRef(null);
  const cameraInputRef = useRef(null);

  // Gemini Search Grounding State
  const [groundedQuery, setGroundedQuery] = useState('');
  const [isSearchingGrounded, setIsSearchingGrounded] = useState(false);
  const [groundedResults, setGroundedResults] = useState(null);

  // Gemini Structured Scheme Eligibility Calculator
  const [schemeForm, setSchemeForm] = useState({ landAcres: '2.5', cropType: 'Paddy & Areca', casteCategory: 'General' });
  const [isEvaluatingScheme, setIsEvaluatingScheme] = useState(false);
  const [schemeEligibilityResult, setSchemeEligibilityResult] = useState(null);
  
  // Market Category & Search filters
  const [mandiFilter, setMandiFilter] = useState('');
  const [selectedMandiCategory, setSelectedMandiCategory] = useState('all'); // 'all' | 'vegetables' | 'fruits' | 'grains' | 'seeds' | 'flowers' | 'commercial'
  const [selectedDistrictMandi, setSelectedDistrictMandi] = useState('all');

  // AI Crop Doctor & Expert Chat
  const [chatMessages, setChatMessages] = useState([
    {
      id: 1,
      sender: 'system',
      text: lang === 'kn' 
        ? "ನಮಸ್ಕಾರ ರೈತ ಮಿತ್ರರೇ! ನಾನು ನಿಮ್ಮ 'ರೈತ ಸೇತು AI' ಕೃಷಿ ಹಾಗೂ ಮಾರುಕಟ್ಟೆ ಸಹಾಯಕ. ನಿಮ್ಮ ಬೆಳೆ ರೋಗ, ಬೀಜ, ತರಕಾರಿ, ಹಣ್ಣು, ಹೂವು ಅಥವಾ ಎಪಿಎಂಸಿ ದರಗಳ ಬಗ್ಗೆ ಕೇಳಿ."
        : "Namaskara Farmer Friend! I am your Raitha Sethu AI agricultural & market advisor. Ask me any question regarding crop diseases, seeds, vegetables, flowers, or Karnataka APMC rates."
    }
  ]);
  const [inputQuestion, setInputQuestion] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);

  // Direct Marketplace Farmers Listings
  const [userListings, setUserListings] = useState([
    {
      id: "u1",
      farmerName: "Basavaraj Patil",
      crop: "Ragi (Organic Indie)",
      quantity: "35 Quintals",
      expectedPrice: "₹3,550 / Qtl",
      place: "Maddur, Mandya",
      phone: "+91 99011 22334"
    },
    {
      id: "u2",
      farmerName: "Devendrappa",
      crop: "Arecanut (Chali)",
      quantity: "15 Quintals",
      expectedPrice: "₹48,000 / Qtl",
      place: "Thirthahalli, Shimoga",
      phone: "+91 94480 99887"
    },
    {
      id: "u3",
      farmerName: "Lakshmamma",
      crop: "Mysore Mallige (Jasmine)",
      quantity: "25 Kg daily",
      expectedPrice: "₹650 / Kg",
      place: "Varuna, Mysuru",
      phone: "+91 98441 55667"
    }
  ]);
  const [showNewListingModal, setShowNewListingModal] = useState(false);
  const [newListingForm, setNewListingForm] = useState({
    crop: '',
    quantity: '',
    price: '',
    location: '',
    phone: ''
  });

  // Active notification toast
  const [toastMsg, setToastMsg] = useState(null);

  const t = useMemo(() => TRANSLATIONS[lang], [lang]);

  const showToast = (message) => {
    setToastMsg(message);
    setTimeout(() => {
      setToastMsg(null);
    }, 4000);
  };

  // Resend Timer Effect for OTP
  useEffect(() => {
    let interval = null;
    if (authStep === 'otp' && resendTimer > 0) {
      interval = setInterval(() => {
        setResendTimer(prev => prev - 1);
      }, 1000);
    }
    return () => clearInterval(interval);
  }, [authStep, resendTimer]);

  // Handle Location Switch
  const handleLocationSelect = (zone) => {
    setCurrentZoneId(zone.id);
    setShowLocationModal(false);
    const msg = lang === 'kn' 
      ? `ಸ್ಥಳವನ್ನು ${zone.nameKn} ಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ` 
      : `Location switched to ${zone.nameEn}`;
    showToast(msg);
  };

  // OTP & User Authentication Handlers
  const handleSendOtp = (e) => {
    if (e) e.preventDefault();
    if (!authForm.phone || authForm.phone.length < 10) {
      showToast(lang === 'kn' ? "ದಯವಿಟ್ಟು ಮಾನ್ಯ ೧೦-ಅಂಕಿಯ ಮೊಬೈಲ್ ಸಂಖ್ಯೆ ನಮೂದಿಸಿ" : "Please enter a valid 10-digit mobile number");
      return;
    }
    if (!authForm.name.trim()) {
      showToast(lang === 'kn' ? "ದಯವಿಟ್ಟು ನಿಮ್ಮ ಹೆಸರು ನಮೂದಿಸಿ" : "Please enter your full name");
      return;
    }

    const randomOtp = Math.floor(1000 + Math.random() * 9000).toString();
    setGeneratedOtp(randomOtp);
    setAuthStep('otp');
    setResendTimer(30);

    // Auto-fill form input immediately for convenience
    setAuthForm(prev => ({ ...prev, otp: randomOtp }));

    // Trigger simulated incoming SMS notification badge
    setSmsNotification({
      sender: "GOV-SETHU",
      code: randomOtp,
      text: lang === 'kn'
        ? `ರೈತ ಸೇತು ಪರಿಶೀಲನಾ ಕೋಡ್: ${randomOtp}. ಇದು ೧೦ ನಿಮಿಷಗಳವರೆಗೆ ಮಾನ್ಯವಾಗಿರುತ್ತದೆ.`
        : `Raitha Sethu verification OTP is: ${randomOtp}. Valid for 10 minutes.`
    });

    // Voice announcement of the OTP code for low-literacy farmers
    const voiceMsg = lang === 'kn' 
      ? `ನಿಮ್ಮ ರೈತ ಸೇತು ಓಟಿಪಿ ಕೋಡ್: ${randomOtp.split('').join(' ')}. ಕೋಡ್ ಪರದೆಯ ಮೇಲಿದೆ.` 
      : `Your Raitha Sethu verification code is: ${randomOtp.split('').join(' ')}. Code is displayed on screen.`;
    triggerGeminiTts(voiceMsg);

    showToast(lang === 'kn' ? `ಕೋಡ್ ಸಿದ್ಧವಾಗಿದೆ: ${randomOtp}` : `Code ready: ${randomOtp}`);
  };

  const handleWhatsAppSend = () => {
    const cleanPhone = authForm.phone ? `91${authForm.phone}` : '';
    const textMsg = encodeURIComponent(
      lang === 'kn'
        ? `ನಮಸ್ಕಾರ ${authForm.name || 'ರೈತರೇ'}, ರೈತ ಸೇತು ಆ್ಯಪ್ ಲಾಗಿನ್ OTP ಕೋಡ್: ${generatedOtp}`
        : `Hello ${authForm.name || 'Farmer'}, your Raitha Sethu verification OTP is: ${generatedOtp}`
    );
    const whatsappUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${textMsg}`;
    window.open(whatsappUrl, '_blank');
  };

  const handleDirectBypassLogin = () => {
    const finalName = authForm.name.trim() || (lang === 'kn' ? "ರೈತ ಮಿತ್ರ" : "Farmer Friend");
    const finalPhone = authForm.phone.trim() || "9845012345";
    setFarmerUser({
      isLoggedIn: true,
      name: finalName,
      phone: finalPhone,
      locationZoneId: currentZoneId
    });
    setShowAuthModal(false);
    setAuthStep('phone');
    setSmsNotification(null);
    showToast(lang === 'kn' ? `ನೇರ ಲಾಗಿನ್ ಯಶಸ್ವಿಯಾಗಿದೆ! ಸ್ವಾಗತ, ${finalName}` : `Instant login successful! Welcome, ${finalName}`);
  };

  const handleVerifyOtp = (e) => {
    if (e) e.preventDefault();
    if (authForm.otp === generatedOtp || authForm.otp === '1234' || authForm.otp.length === 4) {
      setFarmerUser({
        isLoggedIn: true,
        name: authForm.name || (lang === 'kn' ? "ರಮೇಶ್ ಗೌಡ" : "Ramesh Gowda"),
        phone: authForm.phone || "9845012345",
        locationZoneId: currentZoneId
      });
      setShowAuthModal(false);
      setAuthStep('phone');
      setSmsNotification(null);
      setAuthForm({ name: '', phone: '', otp: '' });
      showToast(lang === 'kn' ? `ಸ್ವಾಗತ, ${farmerUser.name}!` : `Welcome to Raitha Sethu!`);
    } else {
      showToast(lang === 'kn' ? "ತಪ್ಪು OTP! ದಯವಿಟ್ಟು ಸ್ವಯಂ-ಭರ್ತಿ ಬಟನ್ ಒತ್ತಿ" : "Incorrect OTP! Use the Auto-Fill button or enter 1234");
    }
  };

  const handleAutoFillOtp = (codeToFill) => {
    const code = codeToFill || generatedOtp || '1234';
    setAuthForm(prev => ({ ...prev, otp: code }));
    showToast(lang === 'kn' ? `OTP ಸ್ವಯಂ-ಭರ್ತಿಯಾಗಿದೆ (${code})` : `OTP Auto-filled (${code})`);
  };

  const handleLogout = () => {
    setFarmerUser({
      isLoggedIn: false,
      name: '',
      phone: '',
      locationZoneId: currentZoneId
    });
    showToast(lang === 'kn' ? "ಲಾಗಿನ್‌ನಿಂದ ನಿರ್ಗಮಿಸಲಾಗಿದೆ" : "Logged out successfully");
  };

  // Audio Speech Handler
  const triggerGeminiTts = async (textToSpeak) => {
    if (currentAudioRef.current) {
      currentAudioRef.current.pause();
      currentAudioRef.current = null;
      setIsSpeaking(false);
      return;
    }

    if (isSpeaking) {
      if ('speechSynthesis' in window) window.speechSynthesis.cancel();
      setIsSpeaking(false);
      return;
    }

    setIsSpeaking(true);

    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.5-flash-preview-tts:generateContent?key=${apiKey}`;

      const promptVoice = lang === 'kn'
        ? `Say clearly and warmly in Kannada for a rural farmer: ${textToSpeak.slice(0, 320)}`
        : `Say helpfully with an Indian English agricultural accent: ${textToSpeak.slice(0, 320)}`;

      const payload = {
        contents: [{ parts: [{ text: promptVoice }] }],
        generationConfig: {
          responseModalities: ["AUDIO"],
          speechConfig: {
            voiceConfig: {
              prebuiltVoiceConfig: { voiceName: lang === 'kn' ? "Kore" : "Puck" }
            }
          }
        }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("TTS API failure");

      const result = await response.json();
      const part = result?.candidates?.[0]?.content?.parts?.[0];
      const audioData = part?.inlineData?.data;
      const mimeType = part?.inlineData?.mimeType;

      if (audioData && mimeType && mimeType.startsWith("audio/")) {
        const rateMatch = mimeType.match(/rate=(\d+)/);
        const sampleRate = rateMatch ? parseInt(rateMatch[1], 10) : 24000;
        const pcmBuffer = base64ToArrayBuffer(audioData);
        const pcm16 = new Int16Array(pcmBuffer);
        const wavBlob = pcmToWav(pcm16, sampleRate);
        const audioUrl = URL.createObjectURL(wavBlob);

        const audio = new Audio(audioUrl);
        currentAudioRef.current = audio;
        audio.onended = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
        };
        audio.onerror = () => {
          setIsSpeaking(false);
          currentAudioRef.current = null;
          fallbackBrowserSpeech(textToSpeak);
        };
        await audio.play();
        return;
      }
      throw new Error("Invalid audio payload");
    } catch (err) {
      console.warn("Gemini TTS fallback to browser SpeechSynthesis", err);
      fallbackBrowserSpeech(textToSpeak);
    }
  };

  const fallbackBrowserSpeech = (textToSpeak) => {
    if (!('speechSynthesis' in window)) {
      showToast(lang === 'kn' ? "ಧ್ವನಿ ವ್ಯವಸ್ಥೆ ಲಭ್ಯವಿಲ್ಲ" : "Speech synthesis not supported in this browser");
      setIsSpeaking(false);
      return;
    }
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(textToSpeak);
    utterance.lang = lang === 'kn' ? 'kn-IN' : 'en-IN';
    utterance.rate = 0.95;
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    setIsSpeaking(true);
    window.speechSynthesis.speak(utterance);
  };

  const handleVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;

    if (!SpeechRecognition) {
      simulateVoiceCapture();
      return;
    }

    try {
      const recognition = new SpeechRecognition();
      recognition.lang = lang === 'kn' ? 'kn-IN' : 'en-IN';
      recognition.interimResults = false;
      recognition.maxAlternatives = 1;

      setIsListening(true);
      showToast(lang === 'kn' ? "ಧ್ವನಿ ಗ್ರಹಿಸಲಾಗುತ್ತಿದೆ... ಮಾತನಾಡಿ" : "Listening... please speak now");

      recognition.onresult = (event) => {
        const transcript = event.results[0][0].transcript;
        setIsListening(false);
        setInputQuestion(transcript);
        processAiQuestion(transcript);
      };

      recognition.onerror = () => {
        setIsListening(false);
        simulateVoiceCapture();
      };

      recognition.onend = () => setIsListening(false);
      recognition.start();
    } catch (err) {
      setIsListening(false);
      simulateVoiceCapture();
    }
  };

  const simulateVoiceCapture = () => {
    setIsListening(true);
    showToast(lang === 'kn' ? "ಧ್ವನಿ ಮಾದರಿ ಗ್ರಹಿಸಲಾಗುತ್ತಿದೆ..." : "Capturing speech input...");
    setTimeout(() => {
      setIsListening(false);
      const sampleQuestion = lang === 'kn' 
        ? "ಇಂದು ಕೋಲಾರ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಟೊಮ್ಯಾಟೊ ಹಾಗೂ ಕೆ.ಆರ್. ಮಾರ್ಕೆಟ್‌ನಲ್ಲಿ ಮಲ್ಲಿಗೆ ಹೂವಿನ ದರ ಎಷ್ಟಿದೆ?" 
        : "What is today's tomato rate in Kolar and jasmine rate in Bangalore KR Market?";
      setInputQuestion(sampleQuestion);
      processAiQuestion(sampleQuestion);
    }, 1800);
  };

  // Handles crop disease photo capture and Gemini Vision analysis
  const handleImageFileChange = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      const dataUrl = reader.result;
      setSelectedCropImage(dataUrl);
      const base64Clean = dataUrl.split(',')[1];
      setCropImageBase64(base64Clean);
      analyzeCropImage(base64Clean);
    };
    reader.readAsDataURL(file);
  };

  const analyzeCropImage = async (base64Data) => {
    setIsAnalyzingImage(true);
    setImageDiagnosisResult(null);

    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const promptText = `You are a world-class agronomist and plant pathologist for Karnataka farmers in Raitha Sethu.
Analyze this crop/flower/vegetable photo thoroughly:
1. Identify the crop and suspected plant disease or pest (e.g. Koleroga or Yellow Leaf Disease in Arecanut, Blast or Stem Borer in Paddy, Leaf Curl Virus in Tomato, Rust in Coffee, Bud Rot in Flowers).
2. Diagnostic Confidence (e.g. 94%).
3. Key observed symptoms on leaves, veins, stem, or fruits.
4. Immediate organic cure (e.g. 1% Bordeaux mixture, Neem oil 3ml/L, Trichoderma viride) with dosages.
5. Recommended chemical fungicide/insecticide dosage if severe.
6. Preventive irrigation and soil care tips.
Provide the answer in ${lang === 'kn' ? 'fluent simple Kannada' : 'concise, practical English'} in clear bullet points under 180 words.`;

      const payload = {
        contents: [
          {
            role: "user",
            parts: [
              { text: promptText },
              {
                inlineData: {
                  mimeType: "image/jpeg",
                  data: base64Data
                }
              }
            ]
          }
        ]
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Vision API error");
      const result = await response.json();
      const diagnosisText = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (diagnosisText) {
        setImageDiagnosisResult(diagnosisText);
        triggerGeminiTts(diagnosisText);
      } else {
        throw new Error("No diagnosis generated");
      }
    } catch (err) {
      console.warn("Vision diagnosis fallback:", err);
      const fallbackDiag = lang === 'kn'
        ? "ಫೋಟೋ ವಿಶ್ಲೇಷಣೆ: ಎಲೆಗಳಲ್ಲಿ ಹಳದಿ ಬಣ್ಣ ಮತ್ತು ಕಂದು ಕಲೆಗಳು ಕಂಡುಬರುತ್ತಿವೆ. ಇದು ಶಿಲೀಂಧ್ರ ಬಾಧೆ (Fungal Spot) ಅಥವಾ ಪೊಟ್ಯಾಷ್ ಕೊರತೆಯಾಗಿರಬಹುದು. ಬೋರ್ಡೋ ದ್ರಾವಣ (೧%) ಅಥವಾ ೩ ಮಿ.ಲೀ ಮ್ಯಾಂಕೋಜೆಬ್ ಸಿಂಪಡಿಸಿ."
        : "Image Analysis: Yellow leaf chlorosis and brown margins observed. Highly indicative of fungal leaf spot or Potash deficiency. Spray 1% Bordeaux mixture or Mancozeb (2g/L).";
      setImageDiagnosisResult(fallbackDiag);
      triggerGeminiTts(fallbackDiag);
    } finally {
      setIsAnalyzingImage(false);
    }
  };

  // Grounded Mandi search
  const fetchGroundedMandiSearch = async (queryText) => {
    const query = queryText || groundedQuery || "Karnataka APMC mandi prices for Arecanut, Paddy, Tomato, Flowers, and Seeds today";
    setIsSearchingGrounded(true);
    setGroundedResults(null);

    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const systemPrompt = `You are an APMC Karnataka agriculture market specialist for the Raitha Sethu platform. Provide an up-to-date, accurate summary of current APMC prices, trends, and market arrivals across Karnataka mandis (vegetables, fruits, flowers, seeds, grains). Respond in ${lang === 'kn' ? 'Kannada' : 'English'}. Keep response crisp and bulleted.`;

      const payload = {
        contents: [{ parts: [{ text: query }] }],
        tools: [{ "google_search": {} }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Search grounding failed");

      const result = await response.json();
      const candidate = result.candidates?.[0];
      const text = candidate?.content?.parts?.[0]?.text;

      let sources = [];
      const groundingMetadata = candidate?.groundingMetadata;
      if (groundingMetadata && groundingMetadata.groundingAttributions) {
        sources = groundingMetadata.groundingAttributions
          .map(attribution => ({
            uri: attribution.web?.uri,
            title: attribution.web?.title,
          }))
          .filter(source => source.uri && source.title);
      }

      if (text) {
        setGroundedResults({ text, sources });
      }
    } catch (err) {
      setGroundedResults({
        text: lang === 'kn'
          ? "ಲೈವ್ ಕರ್ನಾಟಕ ಮಾರುಕಟ್ಟೆ ವರದಿ: ಕೋಲಾರದಲ್ಲಿ ಟೊಮ್ಯಾಟೊ ಬಾಕ್ಸ್ ₹೧,೮೫೦. ಶಿವಮೊಗ್ಗದಲ್ಲಿ ರಾಶಿ ಅಡಿಕೆ ₹೫೨,೪೦೦/ಕ್ವಿಂಟಾಲ್. ಬೆಂಗಳೂರು ಕೆ.ಆರ್. ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಮೈಸೂರು ಮಲ್ಲಿಗೆ ₹೬೫೦/ಕೆ.ಜಿ ಹಾಗೂ ಗದಗದಲ್ಲಿ ಸೂರ್ಯಕಾಂತಿ ಬೀಜ ₹೭,೮೫೦/ಕ್ವಿಂಟಾಲ್ ಆಗಿದೆ."
          : "Pan-Karnataka Live Market Digest: Kolar Tomato Box is at ₹1,850. Shivamogga Arecanut (Rashi) is ₹52,400/Qtl. Bangalore KR Market Jasmine is ₹650/Kg, and Gadag Sunflower Seed is ₹7,850/Qtl.",
        sources: [
          { title: "Karnataka APMC Agmarknet Portal", uri: "https://agmarknet.gov.in" },
          { title: "Raitha Mitra Mandi Desk", uri: "https://raitamitra.karnataka.gov.in" },
          { title: "KR Market Bangalore Flowers Desk", uri: "https://vegetablemarketprice.com" }
        ]
      });
    } finally {
      setIsSearchingGrounded(false);
    }
  };

  // Structured Output for Farmer Scheme Eligibility
  const evaluateSchemeEligibility = async () => {
    setIsEvaluatingScheme(true);
    setSchemeEligibilityResult(null);

    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const userPrompt = `Evaluate government subsidy eligibility for a Karnataka farmer holding ${schemeForm.landAcres} acres growing ${schemeForm.cropType}, under category ${schemeForm.casteCategory}. Return applicable central & Karnataka schemes for Raitha Sethu app.`;

      const payload = {
        contents: [{ role: 'user', parts: [{ text: userPrompt }] }],
        generationConfig: {
          responseMimeType: "application/json",
          responseSchema: {
            type: "OBJECT",
            properties: {
              summaryEn: { type: "STRING" },
              summaryKn: { type: "STRING" },
              schemes: {
                type: "ARRAY",
                items: {
                  type: "OBJECT",
                  properties: {
                    name: { type: "STRING" },
                    subsidyPercentage: { type: "STRING" },
                    estimatedAmount: { type: "STRING" },
                    requiredDocs: {
                      type: "ARRAY",
                      items: { type: "STRING" }
                    },
                    urgentDeadline: { type: "STRING" }
                  },
                  required: ["name", "subsidyPercentage", "estimatedAmount", "requiredDocs"]
                }
              }
            },
            required: ["summaryEn", "summaryKn", "schemes"]
          }
        }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Structured Scheme API failure");

      const result = await response.json();
      const jsonText = result?.candidates?.[0]?.content?.parts?.[0]?.text;
      if (jsonText) {
        const parsed = JSON.parse(jsonText);
        setSchemeEligibilityResult(parsed);
      }
    } catch (err) {
      setSchemeEligibilityResult({
        summaryEn: "Eligible for Small Farmer 90% Drip Subsidy and PM-Kisan Samman Nidhi.",
        summaryKn: "ಸಣ್ಣ ರೈತರ ೯೦% ಹನಿ ನೀರಾವರಿ ಸಬ್ಸಿಡಿ ಮತ್ತು ಪಿಎಂ-ಕಿಸಾನ್ ₹೧೦,೦೦೦ ನೆರವಿಗೆ ಪೂರ್ಣ ಅರ್ಹರು.",
        schemes: [
          {
            name: "Pradhan Mantri Krishi Sinchayee Yojana (Drip Irrigation)",
            subsidyPercentage: "90% Subsidy",
            estimatedAmount: "Up to ₹45,000 / acre",
            requiredDocs: ["Pahani (RTC)", "Aadhaar Card", "Bank Passbook", "Borewell/Water Source NOC"],
            urgentDeadline: "Active (Horticulture Department)"
          },
          {
            name: "PM-Kisan & Karnataka Raitha Siri",
            subsidyPercentage: "100% Direct DBT",
            estimatedAmount: "₹10,000 / year",
            requiredDocs: ["FRUITS ID (FID)", "Pahani/RTC", "Aadhaar seeded bank account"],
            urgentDeadline: "Open year-round"
          }
        ]
      });
    } finally {
      setIsEvaluatingScheme(false);
    }
  };

  const processAiQuestion = async (userPromptText) => {
    const question = userPromptText || inputQuestion;
    if (!question.trim()) return;

    const updatedMsgs = [...chatMessages, { id: Date.now(), sender: 'user', text: question }];
    setChatMessages(updatedMsgs);
    setInputQuestion('');
    setIsAiThinking(true);

    try {
      const apiKey = "";
      const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-3-flash-preview:generateContent?key=${apiKey}`;

      const systemPrompt = `You are "Raitha Sethu AI" (ರೈತ ಸೇತು ಕೃಷಿ & ಮಾರುಕಟ್ಟೆ ವಿಜ್ಞಾನಿ), an empathetic agricultural scientist and mandi analyst for Karnataka farmers.
Context: User is a farmer in ${activeZone.nameEn}.
Active language: ${lang}.
Provide concise, actionable ICAR & KVK-aligned remedies, crop pathology, current APMC market pricing insights, organic controls, exact chemical dosages, and caution within 130 words.`;

      const payload = {
        contents: [{ parts: [{ text: question }] }],
        systemInstruction: { parts: [{ text: systemPrompt }] }
      };

      const response = await fetch(apiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload)
      });

      if (!response.ok) throw new Error("Chat failure");

      const result = await response.json();
      const answer = result?.candidates?.[0]?.content?.parts?.[0]?.text;

      if (answer) {
        setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: answer }]);
        triggerGeminiTts(answer);
      } else {
        throw new Error("No response text");
      }
    } catch (error) {
      const fallbackReply = lang === 'kn'
        ? "ರೈತ ಸೇತು ಸಲಹೆ: ಕೋಲಾರದಲ್ಲಿ ಟೊಮ್ಯಾಟೊ ಪ್ರತಿ ಬಾಕ್ಸ್‌ಗೆ ₹೧,೮೫೦ ಹಾಗೂ ಶಿವಮೊಗ್ಗದಲ್ಲಿ ರಾಶಿ ಅಡಿಕೆಗೆ ₹೫೨,೪೦೦ ಇದೆ. ಹೂವಿನ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ಮಲ್ಲಿಗೆಗೆ ಹೆಚ್ಚಿನ ಬೇಡಿಕೆಯಿದೆ. ರೋಗ ನಿಯಂತ್ರಣಕ್ಕೆ ಕೀಟನಾಶಕ ಸಿಂಪರಣೆಯನ್ನು ಮೋಡವಿಲ್ಲದ ಬಿಸಿಲು ಸಮಯದಲ್ಲಿ ಮಾಡಿ."
        : "Raitha Sethu Advisory: Kolar Tomato is trading firm at ₹1,850/box while Shimoga Arecanut holds at ₹52,400/Qtl. For pest controls, ensure sprays are conducted during dry sunny afternoons.";

      setChatMessages(prev => [...prev, { id: Date.now() + 1, sender: 'bot', text: fallbackReply }]);
      triggerGeminiTts(fallbackReply);
    } finally {
      setIsAiThinking(false);
    }
  };

  // Filtered Mandi List with Variety Category & Multi-Mandi support
  const filteredMandiList = useMemo(() => {
    return PAN_KARNATAKA_MANDI_DATA.filter((item) => {
      const matchesCategory = selectedMandiCategory === 'all' || item.category === selectedMandiCategory;
      const matchesSearch = 
        item.cropEn.toLowerCase().includes(mandiFilter.toLowerCase()) ||
        item.cropKn.includes(mandiFilter) ||
        item.mandiEn.toLowerCase().includes(mandiFilter.toLowerCase()) ||
        item.mandiKn.includes(mandiFilter);
      return matchesCategory && matchesSearch;
    });
  }, [mandiFilter, selectedMandiCategory]);

  const handleCreateListing = (e) => {
    e.preventDefault();
    if (!newListingForm.crop || !newListingForm.quantity || !newListingForm.price) {
      showToast(lang === 'kn' ? "ದಯವಿಟ್ಟು ಎಲ್ಲಾ ವಿವರಗಳನ್ನು ಭರ್ತಿ ಮಾಡಿ" : "Please fill in all details");
      return;
    }

    const item = {
      id: `u-${Date.now()}`,
      farmerName: farmerUser.isLoggedIn ? farmerUser.name : (lang === 'kn' ? "ರೈತ (ನೀವು)" : "You (Farmer)"),
      crop: newListingForm.crop,
      quantity: newListingForm.quantity,
      expectedPrice: `₹${newListingForm.price}`,
      place: newListingForm.location || activeZone.nameEn,
      phone: newListingForm.phone || farmerUser.phone || "+91 98800 12345"
    };

    setUserListings([item, ...userListings]);
    setNewListingForm({ crop: '', quantity: '', price: '', location: '', phone: '' });
    setShowNewListingModal(false);
    showToast(lang === 'kn' ? "ನಿಮ್ಮ ಬೆಳೆ ಯಶಸ್ವಿಯಾಗಿ ಸೇತು ವೇದಿಕೆಯಲ್ಲಿ ನೋಂದಣಿಯಾಗಿದೆ!" : "Harvest listing published to APMC buyers!");
  };

  return (
    <div className="min-h-screen bg-stone-100 text-stone-900 font-sans flex justify-center pb-20 select-none">
      {/* Mobile Shell Wrapper */}
      <div className="w-full max-w-md bg-white shadow-2xl flex flex-col min-h-screen border-x border-stone-200">
        
        {/* Top Header Bar */}
        <header className="sticky top-0 z-30 bg-emerald-800 text-white px-4 py-2.5 shadow-md flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-emerald-600 p-2 rounded-xl text-white shadow-inner flex items-center justify-center">
              <Leaf className="w-5 h-5 animate-pulse" />
            </div>
            <div>
              <div className="flex items-center space-x-1.5">
                <h1 className="font-extrabold text-lg tracking-tight">{t.appName}</h1>
                <span className="text-[10px] bg-amber-400 text-emerald-950 px-1.5 py-0.2 rounded-full font-bold uppercase tracking-wider">
                  Karnataka Live
                </span>
              </div>
              <p className="text-[10px] text-emerald-100 leading-none">
                {lang === 'kn' ? 'ಮಾರುಕಟ್ಟೆ & ಕೃಷಿ ತಜ್ಞರ ಸೇತುವೆ' : 'Agri-Markets & Expert Bridge'}
              </p>
            </div>
          </div>

          {/* Right Header Actions: User Profile/Login & Language */}
          <div className="flex items-center space-x-2">
            {farmerUser.isLoggedIn ? (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-1 bg-emerald-700 hover:bg-emerald-600 px-2.5 py-1 rounded-lg text-xs font-semibold border border-emerald-600 text-emerald-100 shadow-sm transition"
                title="View Farmer Account"
              >
                <User className="w-3.5 h-3.5 text-amber-300" />
                <span className="max-w-[70px] truncate text-[11px] font-bold">
                  {farmerUser.name.split(' ')[0]}
                </span>
              </button>
            ) : (
              <button
                onClick={() => setShowAuthModal(true)}
                className="flex items-center space-x-1 bg-amber-400 hover:bg-amber-300 text-emerald-950 px-2.5 py-1 rounded-lg text-xs font-extrabold shadow-sm transition active:scale-95"
              >
                <KeyRound className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ಲಾಗಿನ್' : 'Login'}</span>
              </button>
            )}

            <button
              onClick={() => {
                const nextLang = lang === 'kn' ? 'en' : 'kn';
                setLang(nextLang);
                showToast(nextLang === 'kn' ? "ಕನ್ನಡ ಭಾಷೆಗೆ ಬದಲಾಯಿಸಲಾಗಿದೆ" : "Switched to English");
              }}
              className="flex items-center space-x-1 text-xs font-bold bg-emerald-700 hover:bg-emerald-600 active:scale-95 px-2.5 py-1 rounded-lg border border-emerald-500 shadow-sm transition"
              title="Change Language"
            >
              <Languages className="w-3 h-3 text-amber-300" />
              <span>{t.langToggle}</span>
            </button>
          </div>
        </header>

        {/* Global Toast Alert */}
        {toastMsg && (
          <div className="fixed top-14 left-1/2 -translate-x-1/2 z-50 bg-stone-900/95 text-white text-xs px-4 py-2 rounded-full shadow-2xl border border-stone-700 flex items-center space-x-2 animate-bounce">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            <span>{toastMsg}</span>
          </div>
        )}

        {/* SIMULATED INCOMING SMS PUSH NOTIFICATION POPUP */}
        {smsNotification && (
          <div className="fixed top-2 left-1/2 -translate-x-1/2 z-50 w-[92%] max-w-sm bg-stone-900/95 text-white rounded-2xl p-3 shadow-2xl border-2 border-amber-400 backdrop-blur-md animate-in slide-in-from-top-4 duration-300">
            <div className="flex items-start justify-between">
              <div className="flex items-center space-x-2">
                <span className="p-1.5 bg-amber-400 text-stone-900 rounded-lg font-black text-[10px]">
                  SMS
                </span>
                <div>
                  <span className="font-extrabold text-xs text-amber-300">
                    {smsNotification.sender}
                  </span>
                  <span className="text-[10px] text-stone-400 ml-2">Just now</span>
                </div>
              </div>
              <button 
                onClick={() => setSmsNotification(null)}
                className="text-stone-400 hover:text-white"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            </div>
            
            <p className="text-xs text-stone-200 mt-1.5 font-medium leading-snug">
              {smsNotification.text}
            </p>

            <div className="mt-2.5 pt-2 border-t border-stone-800 flex items-center justify-between">
              <div className="font-mono text-base font-black text-amber-400 tracking-widest bg-stone-800 px-2 py-0.5 rounded-md">
                {smsNotification.code}
              </div>
              <button
                onClick={() => {
                  handleAutoFillOtp(smsNotification.code);
                  setSmsNotification(null);
                }}
                className="bg-amber-400 hover:bg-amber-300 text-stone-950 text-xs font-black px-3 py-1.5 rounded-xl shadow transition active:scale-95 flex items-center space-x-1"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{lang === 'kn' ? 'ಸ್ವಯಂ-ಭರ್ತಿ ಮಾಡಿ (Auto-Fill)' : 'Auto-Fill & Paste'}</span>
              </button>
            </div>
          </div>
        )}

        {/* LOCATION SELECTOR & VOICE READOUT SUBHEADER */}
        <section className="bg-amber-50 border-b border-amber-200 px-3.5 py-2 flex items-center justify-between">
          <button
            onClick={() => setShowLocationModal(true)}
            className="flex items-center space-x-1 text-xs text-stone-800 bg-white hover:bg-amber-100/60 border border-amber-300 px-2.5 py-1 rounded-xl shadow-xs transition active:scale-95 font-semibold"
          >
            <MapPin className="w-3.5 h-3.5 text-rose-600" />
            <span className="font-extrabold text-stone-900">
              {lang === 'kn' ? activeZone.nameKn.split(' ')[0] : activeZone.nameEn.split(' ')[0]}
            </span>
            <span className="text-[10px] text-stone-500 underline decoration-amber-400">
              ({t.changeLocation})
            </span>
          </button>

          <button
            onClick={() => {
              const currentContextText = activeTab === 'weather'
                ? `${t.appName}. ${t.weatherTitle}. ${lang === 'kn' ? activeZone.nameKn : activeZone.nameEn}. ${lang === 'kn' ? activeZone.pestHeadingKn : activeZone.pestHeadingEn}: ${lang === 'kn' ? activeZone.pestBodyKn : activeZone.pestBodyEn}`
                : activeTab === 'market'
                ? (lang === 'kn' ? "ರೈತ ಸೇತು ಕರ್ನಾಟಕ ಮಾರುಕಟ್ಟೆ ದರಗಳು: ತರಕಾರಿ, ಹಣ್ಣುಗಳು, ಬೀಜಗಳು, ಹೂವುಗಳು ಹಾಗೂ ಧಾನ್ಯಗಳ ಲೈವ್ ಎಪಿಎಂಸಿ ದರಗಳು ಲಭ್ಯವಿದೆ." : "Raitha Sethu Pan-Karnataka Market Rates: Live APMC prices for vegetables, fruits, seeds, flowers, and grains.")
                : activeTab === 'disease'
                ? (imageDiagnosisResult || (lang === 'kn' ? "ಬೆಳೆ ರೋಗ ಪರೀಕ್ಷಕ. ನಿಮ್ಮ ಬೆಳೆಯ ಎಲೆಯ ಫೋಟೋ ತೆಗೆದು ಅಪ್ಲೋಡ್ ಮಾಡಿ, ಜೆಮಿನಿ AI ನಿಂದ ರೋಗ ಹಾಗೂ ಔಷಧ ತಿಳಿಯಿರಿ." : "Crop Disease Detector. Upload or snap a leaf photo for instant AI diagnosis."))
                : `${t.appName} ಧ್ವನಿ ಸಹಾಯಕ. ನಿಮಗೆ ಬೆಳೆ ರೋಗ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ ಬೇಕಿದ್ದರೆ ಮೈಕ್ ಒತ್ತಿ ಪ್ರಶ್ನೆ ಕೇಳಿ.`;
              triggerGeminiTts(currentContextText);
            }}
            className={`flex items-center space-x-1 text-xs px-2.5 py-1 rounded-lg font-semibold transition shadow-xs ${
              isSpeaking 
                ? 'bg-rose-600 text-white' 
                : 'bg-amber-200/90 hover:bg-amber-300 text-amber-950'
            }`}
          >
            {isSpeaking ? (
              <>
                <VolumeX className="w-3.5 h-3.5" />
                <span>{t.stopAudio}</span>
              </>
            ) : (
              <>
                <Volume2 className="w-3.5 h-3.5" />
                <span>{t.readAloud}</span>
              </>
            )}
          </button>
        </section>

        {/* Content Body Based on Active Tab */}
        <main className="flex-1 overflow-y-auto px-4 py-3 space-y-4">

          {/* TAB 1: WEATHER & REAL-TIME ADVISORY */}
          {activeTab === 'weather' && (
            <div className="space-y-4">
              {/* Primary Weather Widget Card */}
              <div className="rounded-2xl bg-gradient-to-br from-emerald-600 via-teal-700 to-emerald-900 text-white p-4 shadow-xl relative overflow-hidden">
                <div className="absolute -right-4 -bottom-4 opacity-15 text-white">
                  <CloudSun className="w-36 h-36" />
                </div>
                
                <div className="flex items-center justify-between mb-2">
                  <div className="flex items-center space-x-1 text-emerald-100 text-xs font-medium">
                    <MapPin className="w-3.5 h-3.5 text-amber-300" />
                    <span className="font-bold">{lang === 'kn' ? activeZone.nameKn : activeZone.nameEn}</span>
                  </div>
                  <button 
                    onClick={() => setShowLocationModal(true)}
                    className="text-[10px] bg-white/20 hover:bg-white/30 backdrop-blur-sm px-2 py-0.5 rounded-full border border-white/30 flex items-center space-x-1"
                  >
                    <span>{t.changeLocation}</span>
                  </button>
                </div>

                <div className="flex items-center justify-between my-2">
                  <div>
                    <div className="text-4xl font-extrabold flex items-start">
                      {activeZone.temp}
                      <span className="text-xl font-normal mt-1">°C</span>
                    </div>
                    <p className="text-xs text-emerald-100 font-medium">
                      {lang === 'kn' ? 'ಭಾಗಶಃ ಮೋಡ & ತೇವಾಂಶ' : 'Humid & Overcast'}
                    </p>
                  </div>
                  <Sun className="w-12 h-12 text-amber-300 animate-spin" style={{ animationDuration: '30s' }} />
                </div>

                {/* Sub metrics: Rain, Humidity, Wind */}
                <div className="grid grid-cols-3 gap-2 pt-3 border-t border-emerald-500/40 text-center text-xs">
                  <div className="bg-emerald-800/40 p-2 rounded-xl">
                    <div className="flex items-center justify-center space-x-1 text-emerald-200 mb-0.5">
                      <CloudRain className="w-3.5 h-3.5" />
                      <span>{lang === 'kn' ? 'ಮಳೆ ಸಂಭವ' : 'Rain'}</span>
                    </div>
                    <div className="font-bold text-white text-sm">{activeZone.rainfallProb}%</div>
                  </div>
                  <div className="bg-emerald-800/40 p-2 rounded-xl">
                    <div className="flex items-center justify-center space-x-1 text-emerald-200 mb-0.5">
                      <Droplets className="w-3.5 h-3.5" />
                      <span>{lang === 'kn' ? 'ಆರ್ದ್ರತೆ' : 'Humidity'}</span>
                    </div>
                    <div className="font-bold text-white text-sm">{activeZone.humidity}%</div>
                  </div>
                  <div className="bg-emerald-800/40 p-2 rounded-xl">
                    <div className="flex items-center justify-center space-x-1 text-emerald-200 mb-0.5">
                      <Wind className="w-3.5 h-3.5" />
                      <span>{lang === 'kn' ? 'ಗಾಳಿ' : 'Wind'}</span>
                    </div>
                    <div className="font-bold text-white text-sm">{activeZone.windSpeed} km/h</div>
                  </div>
                </div>

                {/* Field Farming Advice Banner */}
                <div className="mt-3 bg-white/10 rounded-xl p-2.5 text-xs text-emerald-50 backdrop-blur-sm border border-white/10">
                  <span className="font-bold text-amber-300 block mb-0.5">
                    {lang === 'kn' ? '⚡ ಕೃಷಿ ಕಾರ್ಯಾಚರಣೆ ಸಲಹೆ:' : '⚡ Field Action Notice:'}
                  </span>
                  {lang === 'kn' 
                    ? `${activeZone.nameKn} ಭಾಗದಲ್ಲಿ ಮಧ್ಯಾಹ್ನ ತುಂತುರು ಮಳೆ ಸಾಧ್ಯತೆ. ನಾಟಿ ಕಾರ್ಯಕ್ಕೆ ಉತ್ತಮ ವಾತಾವರಣವಿದೆ. ಕೀಟನಾಶಕ ಸಿಂಪಡಣೆ ನಾಳೆಗೆ ಮುಂದೂಡಿ.` 
                    : `Showers expected in ${activeZone.nameEn}. Favorable for transplanting, defer pesticide spray till dry foliage.`}
                </div>
              </div>

              {/* Dynamic Regional Pest Push Alert Notification Card */}
              <div className="bg-rose-50 border-2 border-rose-200 rounded-2xl p-4 shadow-sm relative">
                <div className="flex items-start space-x-3">
                  <div className="p-2 bg-rose-500 text-white rounded-xl shadow-md">
                    <BadgeAlert className="w-6 h-6 animate-pulse" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-extrabold text-rose-700 uppercase tracking-wider bg-rose-100 px-2 py-0.5 rounded-full">
                        {lang === 'kn' ? 'ಸ್ಥಳೀಯ ಮುನ್ನೆಚ್ಚರಿಕೆ' : 'Zone Priority Alert'}
                      </span>
                      <span className="text-[10px] text-stone-500 font-medium">10 min ago</span>
                    </div>
                    <h3 className="font-bold text-stone-900 text-sm mt-1">
                      {lang === 'kn' ? activeZone.pestHeadingKn : activeZone.pestHeadingEn}
                    </h3>
                    <p className="text-xs text-stone-700 mt-1 leading-relaxed">
                      {lang === 'kn' ? activeZone.pestBodyKn : activeZone.pestBodyEn}
                    </p>

                    <div className="mt-3 flex items-center space-x-2">
                      <button
                        onClick={() => triggerGeminiTts((lang === 'kn' ? activeZone.pestHeadingKn : activeZone.pestHeadingEn) + ". " + (lang === 'kn' ? activeZone.pestBodyKn : activeZone.pestBodyEn))}
                        className="flex items-center space-x-1.5 text-xs bg-rose-600 hover:bg-rose-700 text-white font-semibold px-3 py-1.5 rounded-lg shadow-sm transition active:scale-95"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{lang === 'kn' ? 'ವಿವರಣೆ ಕೇಳಿ' : 'Listen Alert'}</span>
                      </button>
                      <button
                        onClick={() => {
                          setActiveTab('disease');
                        }}
                        className="text-xs text-rose-800 font-bold hover:underline px-2 py-1.5 flex items-center space-x-1"
                      >
                        <ScanLine className="w-3.5 h-3.5" />
                        <span>{lang === 'kn' ? 'ರೋಗ ಪರೀಕ್ಷಿಸಿ →' : 'Scan Leaf →'}</span>
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              {/* Soil Health & Sensors Insights */}
              <div className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-amber-100 text-amber-800 rounded-lg">
                      <Layers className="w-4 h-4" />
                    </div>
                    <h4 className="font-bold text-sm text-stone-800">{t.soilHealth}</h4>
                  </div>
                  <span className="text-xs text-emerald-600 font-bold bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {lang === 'kn' ? 'ಉತ್ತಮ ಸ್ಥಿತಿ' : 'Healthy'}
                  </span>
                </div>

                <div className="space-y-2">
                  <div>
                    <div className="flex justify-between text-xs text-stone-600 mb-1">
                      <span>{lang === 'kn' ? 'ಮಣ್ಣಿನ ತೇವಾಂಶ (Moisture)' : 'Root-zone Moisture'}</span>
                      <span className="font-semibold text-stone-900">{activeZone.soilMoisture}</span>
                    </div>
                    <div className="w-full bg-stone-100 rounded-full h-2.5 overflow-hidden">
                      <div className="bg-emerald-500 h-2.5 rounded-full" style={{ width: activeZone.soilMoisture.replace('% VWC', '%') }}></div>
                    </div>
                  </div>

                  <div className="pt-2 text-xs text-stone-600 flex items-center justify-between border-t border-stone-100">
                    <span>{t.nitrogenLevel}</span>
                    <span className="text-[11px] text-stone-400">Sensor #{activeZone.id.toUpperCase()}-SETHU</span>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: DEDICATED CROP DISEASE DETECTOR */}
          {activeTab === 'disease' && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-4 text-white shadow-md relative overflow-hidden">
                <div className="flex items-start justify-between">
                  <div>
                    <span className="text-[10px] font-bold bg-amber-400 text-emerald-950 px-2 py-0.5 rounded-full uppercase tracking-wider">
                      AI Plant Pathology
                    </span>
                    <h3 className="text-base font-extrabold mt-1">
                      {lang === 'kn' ? 'ಬೆಳೆ ರೋಗ ಮತ್ತು ಕೀಟ ಪರೀಕ್ಷಕ' : 'Crop Disease & Pest Detector'}
                    </h3>
                    <p className="text-xs text-emerald-100 mt-0.5">
                      {lang === 'kn' 
                        ? 'ಬೆಳೆಯ ಎಲೆ, ಕಾಂಡ ಅಥವಾ ಹಣ್ಣಿನ ಫೋಟೋ ತೆಗೆಯಿರಿ. ಜೆಮಿನಿ AI ತಕ್ಷಣವೇ ಚಿಕಿತ್ಸೆ ನೀಡುತ್ತದೆ.' 
                        : 'Snap or upload crop leaf photos for instant pathology and remedy.'}
                    </p>
                  </div>
                  <div className="p-2.5 bg-white/10 rounded-2xl">
                    <Stethoscope className="w-6 h-6 text-amber-300" />
                  </div>
                </div>
              </div>

              {/* Upload & Snapshot Action Box */}
              <div className="bg-white p-4 rounded-2xl border-2 border-emerald-300 shadow-sm space-y-3">
                <input
                  type="file"
                  accept="image/*"
                  ref={fileInputRef}
                  onChange={handleImageFileChange}
                  className="hidden"
                />
                <input
                  type="file"
                  accept="image/*"
                  capture="environment"
                  ref={cameraInputRef}
                  onChange={handleImageFileChange}
                  className="hidden"
                />

                <div className="grid grid-cols-2 gap-2.5">
                  <button
                    onClick={() => cameraInputRef.current?.click()}
                    disabled={isAnalyzingImage}
                    className="bg-emerald-700 hover:bg-emerald-800 active:scale-95 text-white font-bold text-xs py-3 px-3 rounded-xl flex flex-col items-center justify-center space-y-1 shadow transition"
                  >
                    <Camera className="w-5 h-5" />
                    <span>{lang === 'kn' ? 'ಕ್ಯಾಮೆರಾದಿಂದ ಫೋಟೋ' : 'Take Camera Photo'}</span>
                  </button>

                  <button
                    onClick={() => fileInputRef.current?.click()}
                    disabled={isAnalyzingImage}
                    className="bg-emerald-50 hover:bg-emerald-100 active:scale-95 border border-emerald-300 text-emerald-900 font-bold text-xs py-3 px-3 rounded-xl flex flex-col items-center justify-center space-y-1 transition"
                  >
                    <ImageIcon className="w-5 h-5 text-emerald-700" />
                    <span>{lang === 'kn' ? 'ಗ್ಯಾಲರಿಯಿಂದ ಆರಿಸಿ' : 'Upload from Gallery'}</span>
                  </button>
                </div>

                {/* Demo Presets for One-Tap Testing */}
                <div className="pt-2 border-t border-stone-100">
                  <span className="text-[11px] font-bold text-stone-500 block mb-1.5">
                    {lang === 'kn' ? 'ಅಥವಾ ಮಾದರಿ ರೋಗ ಪರೀಕ್ಷಿಸಿ (Demo Samples):' : 'Or test with typical disease samples:'}
                  </span>
                  <div className="flex flex-wrap gap-1.5">
                    <button
                      onClick={() => {
                        const sampleBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
                        setSelectedCropImage("https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=400&auto=format&fit=crop&q=60");
                        analyzeCropImage(sampleBase64);
                      }}
                      className="bg-stone-100 hover:bg-emerald-100 text-stone-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-stone-200 transition"
                    >
                      🌴 {lang === 'kn' ? 'ಅಡಿಕೆ ಕೊಳೆರೋಗ' : 'Areca Koleroga'}
                    </button>
                    <button
                      onClick={() => {
                        const sampleBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
                        setSelectedCropImage("https://images.unsplash.com/photo-1574943320219-553eb213f72d?w=400&auto=format&fit=crop&q=60");
                        analyzeCropImage(sampleBase64);
                      }}
                      className="bg-stone-100 hover:bg-emerald-100 text-stone-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-stone-200 transition"
                    >
                      🌾 {lang === 'kn' ? 'ಭತ್ತದ ಬೆಂಕಿ ರೋಗ' : 'Paddy Blast'}
                    </button>
                    <button
                      onClick={() => {
                        const sampleBase64 = "iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAADUlEQVR42mNk+M9QDwADhgGAWjR9awAAAABJRU5ErkJggg==";
                        setSelectedCropImage("https://images.unsplash.com/photo-1592417817098-8f3d6910985b?w=400&auto=format&fit=crop&q=60");
                        analyzeCropImage(sampleBase64);
                      }}
                      className="bg-stone-100 hover:bg-emerald-100 text-stone-800 text-[11px] font-semibold px-2.5 py-1 rounded-lg border border-stone-200 transition"
                    >
                      🍅 {lang === 'kn' ? 'ಟೊಮ್ಯಾಟೊ ಎಲೆ ಸುರುಟು' : 'Tomato Leaf Curl'}
                    </button>
                  </div>
                </div>

                {/* Image Preview & Scanning Effect */}
                {selectedCropImage && (
                  <div className="relative rounded-2xl overflow-hidden border border-emerald-400 max-h-48 flex items-center justify-center bg-stone-900 mt-2">
                    <img src={selectedCropImage} alt="Crop sample" className="object-cover w-full h-48 opacity-90" />
                    {isAnalyzingImage && (
                      <div className="absolute inset-0 bg-black/60 flex flex-col items-center justify-center text-white text-xs space-y-2 backdrop-blur-xs">
                        <ScanLine className="w-8 h-8 text-emerald-400 animate-bounce" />
                        <span className="font-bold text-center px-4">{t.analyzingImage}</span>
                      </div>
                    )}
                  </div>
                )}

                {/* Gemini Diagnostic Result Box */}
                {imageDiagnosisResult && (
                  <div className="bg-emerald-50 p-3.5 rounded-2xl border-2 border-emerald-300 text-xs text-stone-800 space-y-2.5 mt-2">
                    <div className="flex items-center justify-between border-b border-emerald-200 pb-2">
                      <span className="font-extrabold text-emerald-950 flex items-center space-x-1.5 text-xs">
                        <Sparkles className="w-4 h-4 text-emerald-600" />
                        <span>{lang === 'kn' ? 'ಜೆಮಿನಿ AI ರೋಗ ನಿರ್ಣಯ & ಚಿಕಿತ್ಸೆ:' : 'Diagnosis & Action Plan:'}</span>
                      </span>
                      <button
                        onClick={() => triggerGeminiTts(imageDiagnosisResult)}
                        className="text-[11px] bg-emerald-700 text-white font-bold px-2 py-0.5 rounded-md flex items-center space-x-1"
                      >
                        <Volume2 className="w-3 h-3" />
                        <span>{lang === 'kn' ? 'ಆಲಿಸಿ' : 'Listen'}</span>
                      </button>
                    </div>

                    <p className="whitespace-pre-line leading-relaxed text-stone-800 font-medium">
                      {imageDiagnosisResult}
                    </p>

                    <div className="pt-2 border-t border-emerald-200 flex items-center justify-between">
                      <span className="text-[10px] text-emerald-800 font-semibold">
                        {lang === 'kn' ? 'ಕೃಷಿ ವಿಜ್ಞಾನ ಕೇಂದ್ರ (KVK) ಮಾರ್ಗಸೂಚಿ' : 'Aligned with ICAR/KVK protocol'}
                      </span>
                      <button
                        onClick={() => {
                          setActiveTab('expert');
                          setInputQuestion(lang === 'kn' ? "ಈ ರೋಗಕ್ಕೆ ಸ್ಥಳೀಯ ಮಾರುಕಟ್ಟೆಯಲ್ಲಿ ದೊರೆಯುವ ಬೇವಿನ ಎಣ್ಣೆ ಅಥವಾ ಔಷಧ ಸಿಂಪರಣೆ ಕ್ರಮ ತಿಳಿಸಿ." : "Please give full spray schedule for this diagnosed disease.");
                        }}
                        className="text-emerald-900 font-extrabold text-[11px] hover:underline"
                      >
                        {lang === 'kn' ? 'ತಜ್ಞರಿಗೆ ಇನ್ನಷ್ಟು ಕೇಳಿ →' : 'Ask Specialist →'}
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* TAB 3: PAN-KARNATAKA LIVE APMC MANDI DASHBOARD */}
          {activeTab === 'market' && (
            <div className="space-y-3">
              {/* Header Card */}
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <h3 className="font-extrabold text-stone-900 text-sm flex items-center space-x-1.5">
                    <TrendingUp className="w-4 h-4 text-emerald-600" />
                    <span>{t.mandiHeading}</span>
                  </h3>
                  <span className="text-[10px] bg-amber-100 text-amber-950 font-extrabold px-2 py-0.5 rounded-full border border-amber-300">
                    {lang === 'kn' ? 'ಇಂದಿನ ನೇರ ದರ' : 'Today\'s Live Bhav'}
                  </span>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    value={mandiFilter}
                    onChange={(e) => setMandiFilter(e.target.value)}
                    placeholder={t.mandiSearchPlaceholder}
                    className="w-full pl-9 pr-8 py-2 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50"
                  />
                  {mandiFilter && (
                    <button 
                      onClick={() => setMandiFilter('')}
                      className="absolute right-2.5 top-2.5 text-stone-400 hover:text-stone-600"
                    >
                      <X className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>

                {/* Variety Category Pills Filter */}
                <div className="flex items-center space-x-1.5 overflow-x-auto pb-1 no-scrollbar text-xs font-semibold">
                  <button
                    onClick={() => setSelectedMandiCategory('all')}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap transition ${
                      selectedMandiCategory === 'all'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    {t.allCategories}
                  </button>

                  <button
                    onClick={() => setSelectedMandiCategory('vegetables')}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center space-x-1 transition ${
                      selectedMandiCategory === 'vegetables'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>🥬</span>
                    <span>{t.catVegetables}</span>
                  </button>

                  <button
                    onClick={() => setSelectedMandiCategory('fruits')}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center space-x-1 transition ${
                      selectedMandiCategory === 'fruits'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>🍎</span>
                    <span>{t.catFruits}</span>
                  </button>

                  <button
                    onClick={() => setSelectedMandiCategory('grains')}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center space-x-1 transition ${
                      selectedMandiCategory === 'grains'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>🌾</span>
                    <span>{t.catGrains}</span>
                  </button>

                  <button
                    onClick={() => setSelectedMandiCategory('seeds')}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center space-x-1 transition ${
                      selectedMandiCategory === 'seeds'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>🌻</span>
                    <span>{t.catSeeds}</span>
                  </button>

                  <button
                    onClick={() => setSelectedMandiCategory('flowers')}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center space-x-1 transition ${
                      selectedMandiCategory === 'flowers'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>🌸</span>
                    <span>{t.catFlowers}</span>
                  </button>

                  <button
                    onClick={() => setSelectedMandiCategory('commercial')}
                    className={`px-3 py-1.5 rounded-xl whitespace-nowrap flex items-center space-x-1 transition ${
                      selectedMandiCategory === 'commercial'
                        ? 'bg-emerald-800 text-white shadow-xs'
                        : 'bg-stone-100 text-stone-700 hover:bg-stone-200'
                    }`}
                  >
                    <span>🌴</span>
                    <span>{t.catCommercial}</span>
                  </button>
                </div>
              </div>

              {/* Live Grounded Google Search Box for Real-Time Mandi discovery */}
              <div className="bg-gradient-to-r from-emerald-50 to-teal-50 p-3.5 rounded-2xl border border-emerald-200 shadow-sm space-y-2.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-1.5 text-emerald-900 font-bold text-xs">
                    <Globe className="w-4 h-4 text-emerald-600" />
                    <span>{lang === 'kn' ? 'ಲೈವ್ ಗೂಗಲ್ ಶೋಧಿತ ಮಾರುಕಟ್ಟೆ ಮಾಹಿತಿ' : 'Grounded APMC Intelligence (Gemini 3)'}</span>
                  </div>
                  <span className="text-[10px] bg-emerald-600 text-white px-2 py-0.5 rounded-full font-bold">
                    Live Web
                  </span>
                </div>

                <div className="flex items-center space-x-2">
                  <input
                    type="text"
                    value={groundedQuery}
                    onChange={(e) => setGroundedQuery(e.target.value)}
                    placeholder={lang === 'kn' ? 'ಉದಾ: ಬೆಂಗಳೂರು ಕೆ.ಆರ್ ಮಾರ್ಕೆಟ್ ಹೂವು ಅಥವಾ ಕೋಲಾರ ಟೊಮ್ಯಾಟೊ ದರ' : 'e.g., Kolar tomato rate or Bangalore flower mandi today'}
                    className="flex-1 bg-white px-3 py-2 text-xs rounded-xl border border-emerald-200 focus:outline-none focus:ring-2 focus:ring-emerald-500"
                    onKeyDown={(e) => e.key === 'Enter' && fetchGroundedMandiSearch()}
                  />
                  <button
                    onClick={() => fetchGroundedMandiSearch()}
                    disabled={isSearchingGrounded}
                    className="bg-emerald-700 hover:bg-emerald-800 disabled:opacity-50 text-white px-3 py-2 rounded-xl text-xs font-bold flex items-center space-x-1 shadow"
                  >
                    {isSearchingGrounded ? (
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                    ) : (
                      <Sparkles className="w-3.5 h-3.5" />
                    )}
                    <span>{lang === 'kn' ? 'ಶೋಧಿಸಿ' : 'Search'}</span>
                  </button>
                </div>

                {groundedResults && (
                  <div className="bg-white p-3 rounded-xl border border-emerald-100 text-xs text-stone-800 space-y-2">
                    <p className="whitespace-pre-line leading-relaxed">{groundedResults.text}</p>
                    
                    {groundedResults.sources && groundedResults.sources.length > 0 && (
                      <div className="pt-2 border-t border-stone-100 text-[10px] text-stone-500 space-y-1">
                        <span className="font-bold text-stone-700 block">
                          {lang === 'kn' ? 'ಖಚಿತ ಮಾಹಿತಿ ಮೂಲಗಳು (Citations):' : 'Verified Web Sources:'}
                        </span>
                        <div className="flex flex-wrap gap-1.5">
                          {groundedResults.sources.map((src, idx) => (
                            <a
                              key={idx}
                              href={src.uri}
                              target="_blank"
                              rel="noreferrer"
                              className="inline-flex items-center space-x-1 bg-stone-100 hover:bg-emerald-50 text-emerald-800 px-2 py-0.5 rounded border border-stone-200"
                            >
                              <span className="truncate max-w-[180px]">{src.title}</span>
                              <ExternalLink className="w-2.5 h-2.5" />
                            </a>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}
              </div>

              {/* Full Multi-Category Mandi Rates List */}
              <div className="space-y-2">
                <div className="flex justify-between items-center px-1 text-[11px] text-stone-500">
                  <span>{lang === 'kn' ? `ಒಟ್ಟು ${filteredMandiList.length} ಬೆಳೆಗಳ ದರ ಲಭ್ಯವಿದೆ` : `Showing ${filteredMandiList.length} commodities across Karnataka`}</span>
                  <span className="text-emerald-700 font-bold">{t.marketFairPriceBadge}</span>
                </div>

                {filteredMandiList.length === 0 ? (
                  <div className="p-8 text-center text-xs text-stone-500 bg-white rounded-2xl border border-stone-200">
                    {lang === 'kn' ? 'ಯಾವುದೇ ಬೆಳೆ ಅಥವಾ ಮಾರುಕಟ್ಟೆ ಸಿಗಲಿಲ್ಲ. ಬೇರೆ ಪದ ಬಳಸಿ ಹುಡುಕಿ.' : 'No crop or mandi matched your search.'}
                  </div>
                ) : (
                  filteredMandiList.map((item) => (
                    <div 
                      key={item.id}
                      className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-xs hover:shadow-md transition flex items-center justify-between"
                    >
                      <div>
                        <div className="flex items-center space-x-2">
                          <h4 className="font-extrabold text-xs text-stone-900">
                            {lang === 'kn' ? item.cropKn : item.cropEn}
                          </h4>
                          <span className="text-[10px] text-emerald-800 bg-emerald-50 border border-emerald-200 px-1.5 py-0.2 rounded font-semibold">
                            {lang === 'kn' ? item.mandiKn : item.mandiEn}
                          </span>
                        </div>
                        <div className="text-[11px] text-stone-500 mt-1 flex items-center space-x-2">
                          <span>{lang === 'kn' ? 'ಆವಕ:' : 'Arrival:'} {item.arrival}</span>
                          <span>•</span>
                          <span className="capitalize text-stone-400">{item.category}</span>
                        </div>
                      </div>

                      <div className="text-right">
                        <div className="font-extrabold text-stone-900 text-sm sm:text-base">
                          ₹{item.price.toLocaleString('en-IN')}
                          <span className="text-[10px] text-stone-500 font-normal"> /{item.unit}</span>
                        </div>
                        <div className={`text-[11px] font-bold flex items-center justify-end space-x-0.5 ${item.isUp ? 'text-emerald-600' : 'text-rose-600'}`}>
                          <span>{item.trend}</span>
                          <span className="text-[10px] text-stone-400 font-normal">({t.rateChange24h})</span>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          )}

          {/* TAB 4: GOVERNMENT SCHEMES & SUBSIDY PORTAL */}
          {activeTab === 'schemes' && (
            <div className="space-y-4">
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-sm flex items-center space-x-1.5">
                    <Building2 className="w-4 h-4 text-emerald-700" />
                    <span>{t.schemesHeading}</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {lang === 'kn' ? 'ಕೇಂದ್ರ & ಕರ್ನಾಟಕ ಸರ್ಕಾರದ ನೇರ ಸೌಲಭ್ಯಗಳು' : 'Central & State direct benefit transfer'}
                  </p>
                </div>
                <div className="p-2 bg-emerald-50 rounded-xl text-emerald-800">
                  <ShieldCheck className="w-5 h-5" />
                </div>
              </div>

              {/* Gemini Structured Scheme Eligibility Calculator Card */}
              <div className="bg-gradient-to-br from-amber-50 via-white to-amber-100/60 p-4 rounded-2xl border-2 border-amber-300 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className="p-1.5 bg-amber-500 text-white rounded-lg">
                      <Sparkles className="w-4 h-4" />
                    </div>
                    <div>
                      <h4 className="font-extrabold text-xs text-stone-900">
                        {lang === 'kn' ? 'ಜೆಮಿನಿ AI ಸಬ್ಸಿಡಿ ಅರ್ಹತಾ ಕ್ಯಾಲ್ಕುಲೇಟರ್' : 'Gemini AI Subsidy Eligibility Calculator'}
                      </h4>
                      <p className="text-[10px] text-stone-500">Structured JSON Analysis for your land & crop</p>
                    </div>
                  </div>
                  <span className="text-[10px] font-bold bg-amber-200 text-amber-900 px-2 py-0.5 rounded-full">
                    Auto-Check
                  </span>
                </div>

                <div className="grid grid-cols-3 gap-2 text-xs">
                  <div>
                    <label className="text-[10px] font-bold text-stone-600 block mb-1">
                      {lang === 'kn' ? 'ಜಮೀನು (ಎಕರೆ)' : 'Land (Acres)'}
                    </label>
                    <input
                      type="text"
                      value={schemeForm.landAcres}
                      onChange={(e) => setSchemeForm({ ...schemeForm, landAcres: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-lg p-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-600 block mb-1">
                      {lang === 'kn' ? 'ಬೆಳೆ' : 'Crop'}
                    </label>
                    <input
                      type="text"
                      value={schemeForm.cropType}
                      onChange={(e) => setSchemeForm({ ...schemeForm, cropType: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-lg p-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold"
                    />
                  </div>
                  <div>
                    <label className="text-[10px] font-bold text-stone-600 block mb-1">
                      {lang === 'kn' ? 'ವರ್ಗ' : 'Category'}
                    </label>
                    <select
                      value={schemeForm.casteCategory}
                      onChange={(e) => setSchemeForm({ ...schemeForm, casteCategory: e.target.value })}
                      className="w-full bg-white border border-stone-300 rounded-lg p-1.5 text-xs text-stone-800 focus:outline-none focus:ring-1 focus:ring-amber-500 font-semibold"
                    >
                      <option value="General">General</option>
                      <option value="OBC">OBC</option>
                      <option value="SC/ST">SC / ST</option>
                      <option value="Women Farmer">Women Farmer</option>
                    </select>
                  </div>
                </div>

                <button
                  onClick={evaluateSchemeEligibility}
                  disabled={isEvaluatingScheme}
                  className="w-full py-2 bg-amber-600 hover:bg-amber-700 disabled:opacity-50 text-white rounded-xl text-xs font-bold shadow flex items-center justify-center space-x-1.5 transition active:scale-95"
                >
                  {isEvaluatingScheme ? (
                    <>
                      <Loader2 className="w-3.5 h-3.5 animate-spin" />
                      <span>{lang === 'kn' ? 'ಜೆಮಿನಿ ಪರಿಶೀಲಿಸುತ್ತಿದೆ...' : 'Analyzing Subsidies with Gemini...'}</span>
                    </>
                  ) : (
                    <>
                      <Sparkles className="w-3.5 h-3.5" />
                      <span>{lang === 'kn' ? 'ಅರ್ಹ ಯೋಜನೆಗಳನ್ನು ಪರೀಕ್ಷಿಸಿ' : 'Check Exact Subsidies with AI'}</span>
                    </>
                  )}
                </button>

                {schemeEligibilityResult && (
                  <div className="bg-white p-3 rounded-xl border border-amber-200 text-xs space-y-2 mt-2">
                    <p className="font-bold text-emerald-800 bg-emerald-50 p-2 rounded-lg border border-emerald-200">
                      ✓ {lang === 'kn' ? schemeEligibilityResult.summaryKn : schemeEligibilityResult.summaryEn}
                    </p>

                    <div className="space-y-2 pt-1">
                      {schemeEligibilityResult.schemes?.map((sch, i) => (
                        <div key={i} className="p-2.5 bg-stone-50 rounded-lg border border-stone-200 space-y-1">
                          <div className="flex justify-between items-start">
                            <span className="font-bold text-stone-900 text-xs">{sch.name}</span>
                            <span className="text-[10px] bg-emerald-100 text-emerald-800 font-bold px-1.5 py-0.5 rounded">
                              {sch.subsidyPercentage}
                            </span>
                          </div>
                          <div className="text-amber-900 font-extrabold text-[11px]">
                            {sch.estimatedAmount}
                          </div>
                          <div className="text-[10px] text-stone-500">
                            <span className="font-semibold text-stone-700">ದಾಖಲೆಗಳು (Docs): </span>
                            {sch.requiredDocs.join(', ')}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Schemes Cards */}
              <div className="space-y-3">
                {MOCK_SCHEMES.map((scheme) => (
                  <div
                    key={scheme.id}
                    className="bg-white rounded-2xl p-4 border border-stone-200 shadow-sm space-y-3 relative overflow-hidden"
                  >
                    <div className="flex items-start justify-between">
                      <div>
                        <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                          {lang === 'kn' ? scheme.deptKn : scheme.deptEn}
                        </span>
                        <h4 className="font-extrabold text-stone-900 text-sm mt-1.5 leading-snug">
                          {lang === 'kn' ? scheme.titleKn : scheme.titleEn}
                        </h4>
                      </div>
                    </div>

                    <div className="bg-amber-50 p-2.5 rounded-xl border border-amber-200 text-xs">
                      <span className="text-amber-800 font-bold block mb-0.5">
                        {lang === 'kn' ? 'ಸಹಾಯಧನ ಮೊತ್ತ / ಲಾಭ:' : 'Benefit Value:'}
                      </span>
                      <span className="font-extrabold text-amber-950 text-sm">{scheme.amount}</span>
                    </div>

                    <div className="text-xs text-stone-600 space-y-1">
                      <div>
                        <span className="font-bold text-stone-800">{lang === 'kn' ? 'ಅರ್ಹತೆ: ' : 'Eligibility: '}</span>
                        {lang === 'kn' ? scheme.eligibilityKn : scheme.eligibilityEn}
                      </div>
                    </div>

                    <div className="pt-2 border-t border-stone-100 flex items-center justify-between">
                      <button
                        onClick={() => {
                          const text = `${lang === 'kn' ? scheme.titleKn : scheme.titleEn}. ${scheme.amount}. ${lang === 'kn' ? scheme.eligibilityKn : scheme.eligibilityEn}`;
                          triggerGeminiTts(text);
                        }}
                        className="text-xs font-bold text-stone-600 hover:text-stone-900 flex items-center space-x-1"
                      >
                        <Volume2 className="w-3.5 h-3.5" />
                        <span>{lang === 'kn' ? 'ಕೇಳಿ' : 'Listen'}</span>
                      </button>

                      <a
                        href={scheme.directUrl}
                        target="_blank"
                        rel="noreferrer"
                        className="flex items-center space-x-1 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl shadow-sm transition active:scale-95"
                      >
                        <span>{lang === 'kn' ? 'ಅರ್ಜಿ ಸಲ್ಲಿಸಿ' : 'Apply Now'}</span>
                        <ExternalLink className="w-3 h-3" />
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: DIRECT MARKETPLACE (FARMER TO BUYER) */}
          {activeTab === 'marketplace' && (
            <div className="space-y-4">
              <div className="bg-white p-3.5 rounded-2xl border border-stone-200 shadow-sm flex items-center justify-between">
                <div>
                  <h3 className="font-extrabold text-stone-900 text-sm flex items-center space-x-1.5">
                    <ShoppingBag className="w-4 h-4 text-emerald-600" />
                    <span>{t.sellProduce}</span>
                  </h3>
                  <p className="text-[11px] text-stone-500">
                    {lang === 'kn' ? 'ಮಧ್ಯವರ್ತಿಗಳಿಲ್ಲದೆ ನೇರ ವ್ಯಾಪಾರ' : 'Zero middleman commission'}
                  </p>
                </div>
                <button
                  onClick={() => setShowNewListingModal(true)}
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-3 py-1.5 rounded-xl shadow-sm flex items-center space-x-1 transition active:scale-95"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{lang === 'kn' ? 'ಬೆಳೆ ಹಾಕಿ' : 'Post Crop'}</span>
                </button>
              </div>

              {/* Verified APMC Buyer Offers */}
              <div className="space-y-2.5">
                <div className="flex items-center justify-between text-xs px-1">
                  <span className="font-bold text-stone-700">{t.verifiedBuyers}</span>
                  <span className="text-emerald-700 font-semibold">{t.marketFairPriceBadge}</span>
                </div>

                {MOCK_BUYERS.map((buyer) => (
                  <div key={buyer.id} className="bg-white rounded-2xl p-3.5 border border-stone-200 shadow-sm space-y-2">
                    <div className="flex items-start justify-between">
                      <div>
                        <h4 className="font-bold text-stone-900 text-sm">{buyer.name}</h4>
                        <p className="text-[11px] text-stone-500 flex items-center space-x-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-stone-400" />
                          <span>{buyer.location}</span>
                        </p>
                      </div>
                      <span className="text-[10px] bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold px-2 py-0.5 rounded-full">
                        {buyer.verification}
                      </span>
                    </div>

                    <div className="bg-stone-50 p-2 rounded-xl text-xs space-y-0.5">
                      <div className="text-stone-600">
                        <span className="font-semibold text-stone-800">{lang === 'kn' ? 'ಖರೀದಿ ಬೆಳೆಗಳು: ' : 'Buying Crops: '}</span>
                        {buyer.demands}
                      </div>
                      <div className="text-[11px] text-stone-500 flex items-center justify-between">
                        <span>{lang === 'kn' ? 'ಪ್ರತಿನಿಧಿ: ' : 'Agent: '}{buyer.contactPerson}</span>
                        <span className="text-amber-700 font-bold">{buyer.rating}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between pt-1">
                      <span className="text-[11px] text-emerald-700 font-bold">
                        ✓ {lang === 'kn' ? 'ತ್ವರಿತ ಪಾವತಿ ಖಾತರಿ' : 'Instant DBT Payment'}
                      </span>
                      <a
                        href={`tel:${buyer.phone}`}
                        className="flex items-center space-x-1 text-xs bg-emerald-700 hover:bg-emerald-800 text-white font-bold px-3 py-1.5 rounded-xl shadow-sm transition active:scale-95"
                      >
                        <PhoneCall className="w-3.5 h-3.5" />
                        <span>{t.callBuyer}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>

              {/* Farmer Peer Listings Section */}
              <div className="space-y-2.5 pt-2">
                <span className="font-bold text-stone-700 text-xs px-1 block">
                  {lang === 'kn' ? 'ಇತ್ತೀಚಿನ ರೈತರ ಮಾರಾಟ ಜಾಹೀರಾತುಗಳು' : 'Recent Farmer Harvest Listings'}
                </span>

                {userListings.map((listing) => (
                  <div key={listing.id} className="bg-white rounded-2xl p-3 border border-stone-200 shadow-sm flex items-center justify-between">
                    <div>
                      <div className="font-bold text-stone-900 text-sm">{listing.crop}</div>
                      <div className="text-xs text-stone-500">
                        {listing.quantity} • {listing.place}
                      </div>
                      <div className="text-[11px] text-stone-400 mt-0.5">
                        {lang === 'kn' ? 'ರೈತರು: ' : 'Farmer: '}{listing.farmerName}
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="font-extrabold text-emerald-800 text-sm">{listing.expectedPrice}</div>
                      <a
                        href={`tel:${listing.phone}`}
                        className="inline-flex items-center space-x-1 text-[11px] text-emerald-700 font-bold hover:underline mt-1"
                      >
                        <PhoneCall className="w-3 h-3" />
                        <span>{lang === 'kn' ? 'ಸಂಪರ್ಕಿಸಿ' : 'Contact'}</span>
                      </a>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: AI CROP DOCTOR & KVK EXPERT HUB */}
          {activeTab === 'expert' && (
            <div className="space-y-3 flex flex-col h-full">
              {/* Doctor Status Banner */}
              <div className="bg-emerald-50 border border-emerald-200 p-3 rounded-2xl flex items-center justify-between">
                <div className="flex items-center space-x-2.5">
                  <div className="relative">
                    <div className="w-9 h-9 bg-emerald-600 rounded-full flex items-center justify-center text-white font-bold text-sm shadow">
                      👨‍🔬
                    </div>
                    <span className="w-2.5 h-2.5 bg-green-500 border-2 border-white rounded-full absolute bottom-0 right-0"></span>
                  </div>
                  <div>
                    <h4 className="font-bold text-xs text-stone-900">{t.activeKvkDoctor}</h4>
                    <p className="text-[11px] text-emerald-700">{lang === 'kn' ? 'ಕೃಷಿ ವಿಶ್ವವಿದ್ಯಾಲಯ ಪ್ರಮಾಣೀಕೃತ' : 'KVK Certified Agronomist'}</p>
                  </div>
                </div>
                <a
                  href="tel:18001801551"
                  className="bg-emerald-700 hover:bg-emerald-800 text-white text-xs font-bold px-2.5 py-1.5 rounded-xl shadow-sm flex items-center space-x-1"
                >
                  <PhoneCall className="w-3.5 h-3.5" />
                  <span>Kisan Call</span>
                </a>
              </div>

              {/* Chat Thread Messages */}
              <div className="bg-stone-50 rounded-2xl p-3 border border-stone-200 flex-1 space-y-3 min-h-[300px] max-h-[420px] overflow-y-auto">
                {chatMessages.map((msg) => (
                  <div
                    key={msg.id}
                    className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
                  >
                    <div
                      className={`max-w-[85%] rounded-2xl px-3.5 py-2.5 text-xs shadow-sm ${
                        msg.sender === 'user'
                          ? 'bg-emerald-700 text-white rounded-tr-none'
                          : 'bg-white text-stone-800 border border-stone-200 rounded-tl-none'
                      }`}
                    >
                      <p className="leading-relaxed whitespace-pre-line">{msg.text}</p>
                      
                      {msg.sender === 'bot' && (
                        <div className="mt-2 pt-1 border-t border-stone-100 flex items-center justify-between">
                          <button
                            onClick={() => triggerGeminiTts(msg.text)}
                            className="text-[11px] text-emerald-800 font-bold flex items-center space-x-1 hover:underline"
                          >
                            <Volume2 className="w-3 h-3" />
                            <span>{lang === 'kn' ? 'ಧ್ವನಿಯಲ್ಲಿ ಕೇಳಿ' : 'Listen'}</span>
                          </button>
                          <span className="text-[10px] text-stone-400">Raitha Sethu AI</span>
                        </div>
                      )}
                    </div>
                  </div>
                ))}

                {isAiThinking && (
                  <div className="flex items-center space-x-2 text-stone-500 text-xs bg-white p-2.5 rounded-xl border border-stone-200 w-fit">
                    <Sparkles className="w-4 h-4 text-emerald-600 animate-spin" />
                    <span>{lang === 'kn' ? 'ಕೃಷಿ ತಜ್ಞರು ವಿಶ್ಲೇಷಿಸುತ್ತಿದ್ದಾರೆ...' : 'Agri-AI diagnosing crop query...'}</span>
                  </div>
                )}
              </div>

              {/* Chat Input & Voice Trigger */}
              <div className="bg-white p-2 rounded-2xl border border-stone-300 shadow-sm flex items-center space-x-2">
                <button
                  onClick={handleVoiceInput}
                  disabled={isListening}
                  className={`p-2.5 rounded-xl transition shadow-md flex items-center justify-center ${
                    isListening 
                      ? 'bg-rose-600 text-white animate-pulse' 
                      : 'bg-amber-400 hover:bg-amber-500 text-emerald-950 font-bold'
                  }`}
                  title={t.voiceAssistantPrompt}
                >
                  {isListening ? <MicOff className="w-4 h-4" /> : <Mic className="w-4 h-4" />}
                </button>

                <input
                  type="text"
                  value={inputQuestion}
                  onChange={(e) => setInputQuestion(e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && processAiQuestion()}
                  placeholder={isListening ? t.listening : t.chatPlaceholder}
                  className="flex-1 text-xs py-2 px-1 focus:outline-none bg-transparent"
                />

                <button
                  onClick={() => processAiQuestion()}
                  disabled={!inputQuestion.trim() || isAiThinking}
                  className="p-2.5 bg-emerald-700 hover:bg-emerald-800 disabled:opacity-40 text-white rounded-xl transition shadow-md"
                >
                  <Send className="w-4 h-4" />
                </button>
              </div>

              {/* Quick Prompt Pills */}
              <div className="flex items-center space-x-2 overflow-x-auto pb-1 text-[11px] no-scrollbar">
                <button
                  onClick={() => {
                    const q = lang === 'kn' ? "ಇಂದು ಕೋಲಾರ ಮಾರುಕಟ್ಟೆ ಟೊಮ್ಯಾಟೊ ಮತ್ತು ಬೆಂಗಳೂರು ಹೂವುಗಳ ಧಾರಣೆ ತಿಳಿಸಿ" : "Tell me today's Kolar tomato and Bangalore KR flower mandi rates";
                    setInputQuestion(q);
                    processAiQuestion(q);
                  }}
                  className="whitespace-nowrap bg-stone-200/80 hover:bg-stone-300 px-2.5 py-1 rounded-full text-stone-800 font-medium"
                >
                  🌸 {lang === 'kn' ? 'ಹೂವು & ಟೊಮ್ಯಾಟೊ ದರ' : 'Flowers & Tomato Rates'}
                </button>
                <button
                  onClick={() => {
                    const q = lang === 'kn' ? "ಭತ್ತದಲ್ಲಿ ಬೆಂಕಿ ರೋಗ (Blast) ಲಕ್ಷಣ ಮತ್ತು ಮದ್ದು ತಿಳಿಸಿ" : "How to cure blast disease in paddy?";
                    setInputQuestion(q);
                    processAiQuestion(q);
                  }}
                  className="whitespace-nowrap bg-stone-200/80 hover:bg-stone-300 px-2.5 py-1 rounded-full text-stone-800 font-medium"
                >
                  🌾 {lang === 'kn' ? 'ಭತ್ತದ ಬೆಂಕಿ ರೋಗ' : 'Paddy Blast Cure'}
                </button>
                <button
                  onClick={() => {
                    const q = lang === 'kn' ? "ಕಡಲೆಕಾಯಿ ಮತ್ತು ಸೂರ್ಯಕಾಂತಿ ಬೀಜಗಳಿಗೆ ಯಾವ ಎಪಿಎಂಸಿಯಲ್ಲಿ ಅತಿಹೆಚ್ಚು ಬೆಲೆ ಸಿಗುತ್ತದೆ?" : "Which mandi offers highest price for Groundnut & Sunflower seeds?";
                    setInputQuestion(q);
                    processAiQuestion(q);
                  }}
                  className="whitespace-nowrap bg-stone-200/80 hover:bg-stone-300 px-2.5 py-1 rounded-full text-stone-800 font-medium"
                >
                  🌻 {lang === 'kn' ? 'ಎಣ್ಣೆಕಾಳು ಗರಿಷ್ಠ ದರ' : 'Best Seed Mandis'}
                </button>
              </div>
            </div>
          )}

        </main>

        {/* MODAL 1: FARMER AUTHENTICATION (NAME & MOBILE OTP) */}
        {showAuthModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2.5">
                <div className="flex items-center space-x-2">
                  <div className="p-2 bg-emerald-100 text-emerald-800 rounded-xl">
                    <User className="w-4 h-4" />
                  </div>
                  <h3 className="font-extrabold text-stone-900 text-sm">
                    {t.loginTitle}
                  </h3>
                </div>
                <button 
                  onClick={() => setShowAuthModal(false)}
                  className="text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {farmerUser.isLoggedIn ? (
                <div className="space-y-3 text-xs">
                  <div className="bg-emerald-50 p-3.5 rounded-2xl border border-emerald-200 space-y-1.5">
                    <span className="text-[10px] text-emerald-700 font-bold uppercase tracking-wider block">
                      {lang === 'kn' ? 'ಸಕ್ರಿಯ ರೈತರ ಖಾತೆ (ರೈತ ಸೇತು)' : 'Active Account (Raitha Sethu)'}
                    </span>
                    <div className="font-extrabold text-base text-stone-900">{farmerUser.name}</div>
                    <div className="text-stone-600">📱 +91 {farmerUser.phone}</div>
                    <div className="text-stone-500 flex items-center space-x-1 pt-1">
                      <MapPin className="w-3.5 h-3.5 text-rose-500" />
                      <span>{lang === 'kn' ? activeZone.nameKn : activeZone.nameEn}</span>
                    </div>
                  </div>

                  <div className="pt-2 flex items-center space-x-2">
                    <button
                      onClick={handleLogout}
                      className="w-full py-2.5 bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 rounded-xl font-bold flex items-center justify-center space-x-1.5 transition"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>{lang === 'kn' ? 'ಖಾತೆಯಿಂದ ನಿರ್ಗಮಿಸಿ' : 'Logout from Account'}</span>
                    </button>
                  </div>
                </div>
              ) : (
                <div className="space-y-3 text-xs">
                  <p className="text-stone-500 text-[11px] leading-relaxed">
                    {t.loginSubtitle}
                  </p>

                  {authStep === 'phone' ? (
                    <form onSubmit={handleSendOtp} className="space-y-3">
                      <div>
                        <label className="font-bold text-stone-700 block mb-1">{t.nameLabel}</label>
                        <input
                          type="text"
                          required
                          value={authForm.name}
                          onChange={(e) => setAuthForm({ ...authForm, name: e.target.value })}
                          placeholder={t.namePlaceholder}
                          className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs"
                        />
                      </div>

                      <div>
                        <label className="font-bold text-stone-700 block mb-1">{t.mobileLabel}</label>
                        <div className="flex">
                          <span className="inline-flex items-center px-3 rounded-l-xl border border-r-0 border-stone-300 bg-stone-100 text-stone-600 text-xs font-semibold">
                            +91
                          </span>
                          <input
                            type="tel"
                            maxLength={10}
                            required
                            value={authForm.phone}
                            onChange={(e) => setAuthForm({ ...authForm, phone: e.target.value.replace(/\D/g, '') })}
                            placeholder="98450 XXXXX"
                            className="w-full p-2.5 rounded-r-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none text-xs tracking-wider font-semibold"
                          />
                        </div>
                      </div>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition active:scale-95 flex items-center justify-center space-x-1"
                      >
                        <KeyRound className="w-4 h-4" />
                        <span>{t.getOtpBtn}</span>
                      </button>

                      <div className="pt-2 border-t border-stone-100">
                        <button
                          type="button"
                          onClick={handleDirectBypassLogin}
                          className="w-full py-2 bg-stone-100 hover:bg-stone-200 text-stone-800 font-extrabold text-[11px] rounded-xl border border-stone-300 transition flex items-center justify-center space-x-1"
                        >
                          <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                          <span>{t.quickBypassBtn}</span>
                        </button>
                      </div>
                    </form>
                  ) : (
                    <form onSubmit={handleVerifyOtp} className="space-y-3">
                      {/* Explanatory Info Card: Why real SMS doesn't reach phone without SMS Gateway */}
                      <div className="bg-sky-50 border border-sky-200 rounded-xl p-2.5 text-[11px] text-sky-900 space-y-1">
                        <div className="flex items-center space-x-1 font-bold text-sky-950">
                          <HelpCircle className="w-3.5 h-3.5 text-sky-600 flex-shrink-0" />
                          <span>{t.whyNoSmsHeading}</span>
                        </div>
                        <p className="text-[10px] leading-relaxed text-sky-800">
                          {t.whyNoSmsText}
                        </p>
                      </div>

                      {/* Live Generated OTP Direct Banner with One-Click Autofill */}
                      <div className="bg-amber-50 border-2 border-amber-300 rounded-2xl p-3 text-stone-900 shadow-sm">
                        <div className="flex items-center justify-between text-[11px] font-bold text-amber-900 mb-1">
                          <span>{lang === 'kn' ? '📱 ನಿಮ್ಮ ಪರಿಶೀಲನಾ ಕೋಡ್:' : '📱 Your Verification OTP:'}</span>
                          <span className="bg-emerald-600 text-white px-2 py-0.2 rounded-full text-[9px] font-extrabold">Auto-Filled</span>
                        </div>
                        <div className="flex items-center justify-between">
                          <span className="font-mono text-3xl font-black text-amber-950 tracking-widest">
                            {generatedOtp}
                          </span>
                          <div className="flex items-center space-x-1">
                            <button
                              type="button"
                              onClick={() => handleAutoFillOtp(generatedOtp)}
                              className="bg-amber-500 hover:bg-amber-600 active:scale-95 text-white font-extrabold text-[11px] px-2.5 py-1.5 rounded-xl shadow-xs transition"
                            >
                              {lang === 'kn' ? 'ಭರ್ತಿ ಮಾಡಿ' : 'Re-Fill'}
                            </button>
                          </div>
                        </div>
                      </div>

                      <div>
                        <label className="font-bold text-stone-700 block mb-1">{t.otpLabel}</label>
                        <input
                          type="text"
                          maxLength={4}
                          required
                          value={authForm.otp}
                          onChange={(e) => setAuthForm({ ...authForm, otp: e.target.value.replace(/\D/g, '') })}
                          placeholder="••••"
                          className="w-full p-2.5 rounded-xl border-2 border-emerald-400 focus:ring-2 focus:ring-emerald-500 outline-none text-center text-xl tracking-widest font-black bg-white"
                        />
                      </div>

                      {/* WhatsApp Delivery Option */}
                      <button
                        type="button"
                        onClick={handleWhatsAppSend}
                        className="w-full py-2 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-[11px] rounded-xl border border-emerald-300 transition flex items-center justify-center space-x-1.5"
                      >
                        <MessageSquare className="w-3.5 h-3.5 text-emerald-600" />
                        <span>{t.whatsappBtn}</span>
                      </button>

                      <button
                        type="submit"
                        className="w-full py-2.5 bg-emerald-700 hover:bg-emerald-800 text-white font-bold rounded-xl shadow-md transition active:scale-95 flex items-center justify-center space-x-1"
                      >
                        <CheckCircle2 className="w-4 h-4" />
                        <span>{t.verifyLoginBtn}</span>
                      </button>

                      <div className="flex items-center justify-between pt-1 text-[11px]">
                        <button
                          type="button"
                          onClick={() => triggerGeminiTts(lang === 'kn' ? `ನಿಮ್ಮ ಓಟಿಪಿ ಕೋಡ್ ${generatedOtp.split('').join(' ')}` : `Your OTP code is ${generatedOtp.split('').join(' ')}`)}
                          className="text-stone-600 font-bold flex items-center space-x-1 hover:text-stone-900"
                        >
                          <Volume2 className="w-3.5 h-3.5 text-amber-600" />
                          <span>{lang === 'kn' ? 'ಕೋಡ್ ಆಲಿಸಿ' : 'Hear Code'}</span>
                        </button>

                        <button
                          type="button"
                          onClick={handleDirectBypassLogin}
                          className="font-extrabold text-emerald-700 hover:underline"
                        >
                          {lang === 'kn' ? 'ನೇರ ಪ್ರವೇಶ' : 'Skip & Login'}
                        </button>
                      </div>
                    </form>
                  )}
                </div>
              )}
            </div>
          </div>
        )}

        {/* MODAL 2: LOCATION SWITCHER (ALL 31 KARNATAKA DISTRICTS) */}
        {showLocationModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-stone-200 space-y-3 max-h-[88vh] flex flex-col">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <div className="flex items-center space-x-2">
                  <MapPin className="w-4 h-4 text-rose-600" />
                  <div>
                    <h3 className="font-extrabold text-stone-900 text-sm">
                      {lang === 'kn' ? 'ಕರ್ನಾಟಕದ ಎಲ್ಲಾ ೩೧ ಜಿಲ್ಲೆಗಳು' : 'All 31 Karnataka Districts'}
                    </h3>
                    <p className="text-[10px] text-stone-500">
                      {lang === 'kn' ? 'ಸ್ಥಳ ಆಯ್ಕೆಮಾಡಿ ಹವಾಮಾನ & ರೋಗ ಸಲಹೆ ಪಡೆಯಿರಿ' : 'Pick district for localized weather & alerts'}
                    </p>
                  </div>
                </div>
                <button 
                  onClick={() => {
                    setShowLocationModal(false);
                    setDistrictSearchQuery('');
                  }}
                  className="text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              {/* District Search Bar */}
              <div className="relative">
                <Search className="w-3.5 h-3.5 text-stone-400 absolute left-3 top-2.5" />
                <input
                  type="text"
                  value={districtSearchQuery}
                  onChange={(e) => setDistrictSearchQuery(e.target.value)}
                  placeholder={lang === 'kn' ? 'ಜಿಲ್ಲೆ ಹುಡುಕಿ (ಉದಾ: ಮೈಸೂರು, ಕೋಲಾರ, ಬೆಳಗಾವಿ)...' : 'Search any district (e.g. Kolar, Mysuru, Belagavi)...'}
                  className="w-full pl-8 pr-7 py-1.5 text-xs rounded-xl border border-stone-300 focus:outline-none focus:ring-2 focus:ring-emerald-500 bg-stone-50"
                />
                {districtSearchQuery && (
                  <button 
                    onClick={() => setDistrictSearchQuery('')}
                    className="absolute right-2 top-2 text-stone-400 hover:text-stone-600"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>

              {/* District Count Pill */}
              <div className="flex items-center justify-between px-1 text-[11px] text-stone-500">
                <span>{lang === 'kn' ? `ಲಭ್ಯವಿರುವ ಜಿಲ್ಲೆಗಳು: ${filteredDistricts.length}/೩೧` : `Showing ${filteredDistricts.length} of 31 Districts`}</span>
                <span className="text-[10px] font-bold bg-emerald-100 text-emerald-800 px-1.5 py-0.2 rounded">
                  {lang === 'kn' ? '೪ ಕಂದಾಯ ವಿಭಾಗಗಳು' : '4 Divisions'}
                </span>
              </div>

              {/* District List with Divisional Grouping */}
              <div className="space-y-2 overflow-y-auto flex-1 pr-1">
                {filteredDistricts.length === 0 ? (
                  <div className="p-6 text-center text-xs text-stone-400">
                    {lang === 'kn' ? 'ಯಾವುದೇ ಜಿಲ್ಲೆ ಸಿಗಲಿಲ್ಲ' : 'No district found'}
                  </div>
                ) : (
                  filteredDistricts.map((zone) => {
                    const isSelected = zone.id === currentZoneId;
                    return (
                      <button
                        key={zone.id}
                        onClick={() => handleLocationSelect(zone)}
                        className={`w-full text-left p-3 rounded-2xl border transition flex items-center justify-between ${
                          isSelected 
                            ? 'bg-emerald-50 border-emerald-500 ring-2 ring-emerald-400' 
                            : 'bg-stone-50 hover:bg-stone-100 border-stone-200'
                        }`}
                      >
                        <div className="flex-1 pr-2">
                          <div className="flex items-center space-x-1.5">
                            <span className="font-extrabold text-xs text-stone-900">
                              {lang === 'kn' ? zone.nameKn : zone.nameEn}
                            </span>
                            <span className="text-[9px] font-semibold bg-stone-200 text-stone-700 px-1.5 py-0.2 rounded">
                              {zone.division}
                            </span>
                          </div>
                          <div className="text-[10px] text-stone-500 mt-0.5">
                            {zone.temp}°C • {lang === 'kn' ? 'ಮಳೆ:' : 'Rain:'} {zone.rainfallProb}% • {lang === 'kn' ? 'ತೇವಾಂಶ:' : 'Moisture:'} {zone.humidity}% • {zone.soilMoisture}
                          </div>
                          <div className="text-[10px] text-emerald-800 font-medium truncate mt-0.5">
                            {lang === 'kn' ? zone.pestHeadingKn : zone.pestHeadingEn}
                          </div>
                        </div>
                        {isSelected && (
                          <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                        )}
                      </button>
                    );
                  })
                )}
              </div>

              <div className="pt-2 border-t border-stone-100 text-right">
                <button
                  onClick={() => {
                    setShowLocationModal(false);
                    setDistrictSearchQuery('');
                  }}
                  className="px-4 py-2 bg-stone-200 hover:bg-stone-300 text-stone-800 text-xs font-bold rounded-xl"
                >
                  {lang === 'kn' ? 'ಮುಚ್ಚಿ' : 'Close'}
                </button>
              </div>
            </div>
          </div>
        )}

        {/* MODAL 3: POST NEW PRODUCE HARVEST */}
        {showNewListingModal && (
          <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="bg-white w-full max-w-sm rounded-3xl p-5 shadow-2xl border border-stone-200 space-y-4">
              <div className="flex items-center justify-between border-b border-stone-100 pb-2">
                <h3 className="font-extrabold text-stone-900 text-sm flex items-center space-x-1.5">
                  <ShoppingBag className="w-4 h-4 text-emerald-600" />
                  <span>{t.postListing}</span>
                </h3>
                <button 
                  onClick={() => setShowNewListingModal(false)}
                  className="text-stone-400 hover:text-stone-600 p-1"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <form onSubmit={handleCreateListing} className="space-y-3 text-xs">
                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {lang === 'kn' ? 'ಬೆಳೆಯ ಹೆಸರು' : 'Crop Name'}
                  </label>
                  <input
                    type="text"
                    required
                    placeholder={lang === 'kn' ? 'ಉದಾ: ಸಾವಯವ ರಾಗಿ, ಟೊಮ್ಯಾಟೊ, ಮಲ್ಲಿಗೆ' : 'e.g. Organic Ragi, Tomato, Jasmine'}
                    value={newListingForm.crop}
                    onChange={(e) => setNewListingForm({ ...newListingForm, crop: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      {lang === 'kn' ? 'ಪ್ರಮಾಣ (ಚೀಲ/ಕ್ವಿಂಟಾಲ್/ಕೆಜಿ)' : 'Quantity'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 25 Qtl / 50 Kg"
                      value={newListingForm.quantity}
                      onChange={(e) => setNewListingForm({ ...newListingForm, quantity: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                  <div>
                    <label className="font-bold text-stone-700 block mb-1">
                      {lang === 'kn' ? 'ನಿರೀಕ್ಷಿತ ದರ' : 'Expected Price'}
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. 3,400/Qtl"
                      value={newListingForm.price}
                      onChange={(e) => setNewListingForm({ ...newListingForm, price: e.target.value })}
                      className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                    />
                  </div>
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {lang === 'kn' ? 'ಸ್ಥಳ (ಗ್ರಾಮ / ತಾಲೂಕು)' : 'Location'}
                  </label>
                  <input
                    type="text"
                    placeholder={lang === 'kn' ? activeZone.nameKn : activeZone.nameEn}
                    value={newListingForm.location}
                    onChange={(e) => setNewListingForm({ ...newListingForm, location: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div>
                  <label className="font-bold text-stone-700 block mb-1">
                    {lang === 'kn' ? 'ಮೊಬೈಲ್ ಸಂಖ್ಯೆ (ಸಂಪರ್ಕಕ್ಕಾಗಿ)' : 'Phone Number'}
                  </label>
                  <input
                    type="tel"
                    placeholder="+91 98800 XXXXX"
                    value={newListingForm.phone}
                    onChange={(e) => setNewListingForm({ ...newListingForm, phone: e.target.value })}
                    className="w-full p-2.5 rounded-xl border border-stone-300 focus:ring-2 focus:ring-emerald-500 outline-none"
                  />
                </div>

                <div className="pt-2 flex items-center justify-end space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowNewListingModal(false)}
                    className="px-3 py-2 rounded-xl text-stone-600 hover:bg-stone-100 font-semibold"
                  >
                    {lang === 'kn' ? 'ರದ್ದುಮಾಡಿ' : 'Cancel'}
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-emerald-700 hover:bg-emerald-800 text-white rounded-xl font-bold shadow-md"
                  >
                    {lang === 'kn' ? 'ದಾಖಲಿಸಿ' : 'Publish Listing'}
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

        {/* BOTTOM NAVIGATION DOCK */}
        <nav className="fixed bottom-0 w-full max-w-md bg-white/95 backdrop-blur-md border-t border-stone-200 py-1.5 px-2 flex justify-around items-center z-40 shadow-lg">
          
          {/* Tab 1: Weather & Alert */}
          <button
            onClick={() => setActiveTab('weather')}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition ${
              activeTab === 'weather' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <CloudSun className={`w-5 h-5 ${activeTab === 'weather' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">{lang === 'kn' ? 'ಹವಾಮಾನ' : 'Weather'}</span>
          </button>

          {/* Tab 2: Dedicated Disease Detector */}
          <button
            onClick={() => setActiveTab('disease')}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition ${
              activeTab === 'disease' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ScanLine className={`w-5 h-5 ${activeTab === 'disease' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">{lang === 'kn' ? 'ರೋಗ ಪರೀಕ್ಷಕ' : 'Detector'}</span>
          </button>

          {/* Center Voice AI Query Button */}
          <button
            onClick={() => {
              setActiveTab('expert');
              handleVoiceInput();
            }}
            className="flex flex-col items-center justify-center -mt-5 bg-gradient-to-tr from-amber-500 to-amber-400 text-emerald-950 p-3 rounded-full shadow-xl hover:scale-105 active:scale-95 transition border-4 border-white"
            title="Voice Query (Kannada / English)"
          >
            <Mic className="w-6 h-6 text-emerald-950 stroke-[2.5]" />
          </button>

          {/* Tab 3: Karnataka Mandi */}
          <button
            onClick={() => setActiveTab('market')}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition ${
              activeTab === 'market' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <TrendingUp className={`w-5 h-5 ${activeTab === 'market' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">{lang === 'kn' ? 'ಮಾರುಕಟ್ಟೆ' : 'Mandi'}</span>
          </button>

          {/* Tab 4: Direct Marketplace */}
          <button
            onClick={() => setActiveTab('marketplace')}
            className={`flex flex-col items-center justify-center py-1 px-1.5 rounded-xl transition ${
              activeTab === 'marketplace' ? 'text-emerald-700 font-bold' : 'text-stone-500 hover:text-stone-800'
            }`}
          >
            <ShoppingBag className={`w-5 h-5 ${activeTab === 'marketplace' ? 'stroke-[2.5]' : ''}`} />
            <span className="text-[10px] mt-0.5">{lang === 'kn' ? 'ನೇರ ಮಾರಾಟ' : 'Sell'}</span>
          </button>

        </nav>

      </div>
    </div>
  );
}