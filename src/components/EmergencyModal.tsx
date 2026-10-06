import React, { useState } from 'react';
import {
  Siren,
  PhoneCall,
  ShieldAlert,
  HeartPulse,
  Flame,
  Car,
  AlertTriangle,
  X,
  Copy,
  Check,
  Share2,
  MapPin,
  ExternalLink
} from 'lucide-react';
import { KochiLocation, ThemeMode } from '../types';

interface EmergencyModalProps {
  isOpen: boolean;
  onClose: () => void;
  currentLocation: KochiLocation;
  theme: ThemeMode;
}

export const EmergencyModal: React.FC<EmergencyModalProps> = ({
  isOpen,
  onClose,
  currentLocation,
  theme
}) => {
  const [copied, setCopied] = useState<boolean>(false);
  const isDark = theme === 'dark';

  if (!isOpen) return null;

  const coordinatesText = `${currentLocation.lat.toFixed(4)}, ${currentLocation.lng.toFixed(4)}`;
  const emergencyShareText = encodeURIComponent(
    `🚨 EMERGENCY SOS from Fykso: I need immediate assistance! My current location is ${currentLocation.name}. Coordinates: ${coordinatesText} (https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng})`
  );

  const handleCopyCoordinates = () => {
    navigator.clipboard.writeText(
      `Fykso Emergency SOS Location: ${currentLocation.name} (GPS: ${coordinatesText}) https://maps.google.com/?q=${currentLocation.lat},${currentLocation.lng}`
    );
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  const emergencyContacts = [
    {
      id: 'police',
      title: 'Police Emergency & PCR',
      number: '112',
      altNumber: '100',
      description: 'National Emergency SOS & Kerala Police rapid PCR van response',
      icon: ShieldAlert,
      color: 'bg-blue-600',
      tag: 'Police 112',
      urgent: true
    },
    {
      id: 'ambulance',
      title: 'Ambulance & Medical Trauma',
      number: '108',
      altNumber: '102',
      description: '24/7 Government emergency medical ambulance & trauma care',
      icon: HeartPulse,
      color: 'bg-red-600',
      tag: 'Ambulance 108',
      urgent: true
    },
    {
      id: 'fire',
      title: 'Fire & Rescue Services',
      number: '101',
      altNumber: null,
      description: 'Fire hazard, gas leak, building collapse & flood rescue',
      icon: Flame,
      color: 'bg-orange-600',
      tag: 'Fire Force 101',
      urgent: false
    },
    {
      id: 'highway',
      title: 'Highway Roadside & Accident Patrol',
      number: '1033',
      altNumber: '1073',
      description: 'NHAI 24/7 Highway patrol, emergency towing & accident rescue',
      icon: Car,
      color: 'bg-amber-600',
      tag: 'Highway 1033',
      urgent: false
    },
    {
      id: 'women',
      title: 'Women & Child Safety Helpline',
      number: '1091',
      altNumber: '181',
      description: 'Kerala Police 24/7 Women in Distress & Childline support',
      icon: Siren,
      color: 'bg-rose-600',
      tag: 'Helpline 1091',
      urgent: false
    }
  ];

  return (
    <div className="fixed inset-0 z-50 bg-slate-950/85 backdrop-blur-md flex items-center justify-center p-3 sm:p-4 overflow-y-auto">
      <div className={`relative w-full max-w-2xl rounded-3xl border shadow-2xl overflow-hidden my-auto ${
        isDark ? 'bg-slate-900 border-red-500/40 text-white' : 'bg-white border-red-200 text-slate-900'
      }`}>
        
        {/* Red Siren Header */}
        <div className="bg-gradient-to-r from-red-600 via-rose-600 to-amber-600 text-white p-5 sm:p-6 flex items-start justify-between">
          <div className="flex items-center space-x-3.5">
            <div className="w-12 h-12 rounded-2xl bg-white/20 backdrop-blur flex items-center justify-center shrink-0 shadow-lg animate-pulse">
              <Siren className="w-7 h-7 text-white" />
            </div>
            <div>
              <span className="text-[10px] font-black uppercase tracking-widest bg-white/25 px-2.5 py-0.5 rounded-full">
                Public Safety & SOS
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-0.5">
                24/7 Emergency Department
              </h2>
              <p className="text-xs text-red-100 font-medium">
                Instant 1-tap connection to Police, Ambulance, Fire Force & Highway Patrol
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-white/80 hover:text-white p-1.5 rounded-full hover:bg-white/10 transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Live GPS Emergency Beacon Card */}
        <div className={`p-4 mx-4 sm:mx-6 mt-4 rounded-2xl border flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
          isDark ? 'bg-slate-950 border-slate-800' : 'bg-red-50/70 border-red-200/80'
        }`}>
          <div className="flex items-start space-x-3">
            <div className="p-2 rounded-xl bg-red-600/10 text-red-600 mt-0.5">
              <MapPin className="w-5 h-5 animate-bounce" />
            </div>
            <div>
              <div className="text-[10px] font-black uppercase tracking-wider text-red-600">
                Your Current Emergency Coordinates
              </div>
              <div className="text-xs font-bold mt-0.5">
                📍 {currentLocation.name}
              </div>
              <div className="text-[11px] font-mono text-slate-400">
                GPS: {coordinatesText}
              </div>
            </div>
          </div>

          <div className="flex items-center space-x-2 w-full sm:w-auto">
            <button
              onClick={handleCopyCoordinates}
              className={`flex-1 sm:flex-initial px-3 py-1.5 rounded-xl text-xs font-bold border transition-all flex items-center justify-center space-x-1 ${
                copied
                  ? 'bg-emerald-600 text-white border-emerald-600'
                  : isDark
                  ? 'bg-slate-800 border-slate-700 hover:bg-slate-700 text-slate-200'
                  : 'bg-white border-slate-300 hover:bg-slate-50 text-slate-700 shadow-sm'
              }`}
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Copied!' : 'Copy GPS'}</span>
            </button>

            <a
              href={`https://wa.me/?text=${emergencyShareText}`}
              target="_blank"
              rel="noopener noreferrer"
              className="flex-1 sm:flex-initial px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold shadow flex items-center justify-center space-x-1"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Location</span>
            </a>
          </div>
        </div>

        {/* Emergency Helplines Grid */}
        <div className="p-4 sm:p-6 space-y-3 max-h-[50vh] overflow-y-auto">
          {emergencyContacts.map((contact) => {
            const Icon = contact.icon;
            return (
              <div
                key={contact.id}
                className={`p-4 rounded-2xl border transition-all flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 ${
                  contact.urgent
                    ? isDark
                      ? 'bg-slate-950/80 border-red-500/30 hover:border-red-500/60'
                      : 'bg-white border-red-200 hover:border-red-400 shadow-sm'
                    : isDark
                    ? 'bg-slate-950/60 border-slate-800 hover:border-slate-700'
                    : 'bg-white border-slate-200 hover:border-slate-300 shadow-sm'
                }`}
              >
                <div className="flex items-start space-x-3.5">
                  <div className={`w-10 h-10 rounded-xl ${contact.color} text-white flex items-center justify-center shrink-0 shadow-md`}>
                    <Icon className="w-5 h-5" />
                  </div>
                  <div>
                    <div className="flex items-center space-x-2">
                      <h4 className="font-extrabold text-sm">{contact.title}</h4>
                      <span className={`text-[10px] font-black px-2 py-0.2 rounded-full ${
                        contact.urgent ? 'bg-red-500/20 text-red-500' : 'bg-slate-500/20 text-slate-400'
                      }`}>
                        {contact.tag}
                      </span>
                    </div>
                    <p className={`text-xs mt-0.5 ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                      {contact.description}
                    </p>
                  </div>
                </div>

                <div className="flex items-center space-x-2 w-full sm:w-auto shrink-0">
                  <a
                    href={`tel:${contact.number}`}
                    className={`flex-1 sm:flex-initial px-4 py-2 rounded-xl text-white font-black text-xs shadow-md transition-transform hover:scale-105 flex items-center justify-center space-x-1.5 ${contact.color}`}
                  >
                    <PhoneCall className="w-3.5 h-3.5" />
                    <span>Call {contact.number}</span>
                  </a>

                  {contact.altNumber && (
                    <a
                      href={`tel:${contact.altNumber}`}
                      className={`px-3 py-2 rounded-xl text-xs font-bold border transition-colors ${
                        isDark ? 'border-slate-700 hover:bg-slate-800 text-slate-300' : 'border-slate-300 hover:bg-slate-100 text-slate-700'
                      }`}
                      title={`Alternative: ${contact.altNumber}`}
                    >
                      <span>{contact.altNumber}</span>
                    </a>
                  )}
                </div>
              </div>
            );
          })}

          {/* Kerala Police Thuna Citizen Portal Badge */}
          <div className={`p-4 rounded-2xl border flex items-center justify-between gap-3 ${
            isDark ? 'bg-slate-950 border-emerald-500/30' : 'bg-emerald-50/60 border-emerald-200'
          }`}>
            <div className="flex items-center space-x-3">
              <div className="w-10 h-10 rounded-xl bg-emerald-600 text-white flex items-center justify-center font-bold shrink-0">
                🛡️
              </div>
              <div>
                <h4 className="font-extrabold text-xs">Kerala Police Thuna Citizen Portal</h4>
                <p className={`text-[11px] ${isDark ? 'text-slate-400' : 'text-slate-600'}`}>
                  File online police petitions, report incidents, and check police station jurisdiction.
                </p>
              </div>
            </div>

            <a
              href="https://thuna.keralapolice.gov.in"
              target="_blank"
              rel="noopener noreferrer"
              className="px-3.5 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shrink-0 flex items-center space-x-1 shadow"
            >
              <span>Thuna Portal</span>
              <ExternalLink className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>

        {/* Modal Footer */}
        <div className={`p-4 border-t flex items-center justify-between text-xs ${
          isDark ? 'bg-slate-950 border-slate-800 text-slate-400' : 'bg-slate-50 border-slate-200 text-slate-600'
        }`}>
          <div className="flex items-center space-x-1.5">
            <AlertTriangle className="w-4 h-4 text-amber-500 shrink-0" />
            <span>In life-threatening situations, always dial <strong>112</strong> immediately.</span>
          </div>

          <button
            onClick={onClose}
            className="px-4 py-1.5 rounded-xl font-bold bg-slate-800 hover:bg-slate-700 text-white transition-colors"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
};
