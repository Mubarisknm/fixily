import React, { useState, useEffect } from 'react';
import {
  X,
  MapPin,
  Home,
  Briefcase,
  Plus,
  Check,
  Trash2,
  Edit2,
  Crosshair,
  Navigation,
  Compass,
  Building,
  CheckCircle2,
  ChevronRight,
  Sparkles,
  Phone,
  User
} from 'lucide-react';
import { KochiLocation, CustomerSavedAddress, ThemeMode, AppLanguage, UserSession } from '../types';
import { useTranslation } from '../utils/translations';

interface ManageAddressModalProps {
  isOpen: boolean;
  onClose: () => void;
  selectedLocation: KochiLocation;
  onSelectLocation: (loc: KochiLocation) => void;
  locations: KochiLocation[];
  onOpenLocationModal?: () => void;
  onDetectLiveGps?: () => void;
  isDetectingLiveGps?: boolean;
  currentUser?: UserSession | null;
  theme: ThemeMode;
  language: AppLanguage;
}

const STORAGE_KEY = 'fykzi_saved_addresses';

export const ManageAddressModal: React.FC<ManageAddressModalProps> = ({
  isOpen,
  onClose,
  selectedLocation,
  onSelectLocation,
  locations,
  onOpenLocationModal,
  onDetectLiveGps,
  isDetectingLiveGps,
  currentUser,
  theme,
  language
}) => {
  const { t } = useTranslation(language);
  const isDark = theme === 'dark';

  // Saved Addresses State
  const [addresses, setAddresses] = useState<CustomerSavedAddress[]>(() => {
    try {
      const stored = localStorage.getItem(STORAGE_KEY);
      if (stored) {
        const parsed = JSON.parse(stored);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch (e) {}

    // Default seeded addresses based on selectedLocation
    return [
      {
        id: 'addr-default-1',
        label: 'Home',
        customTitle: 'My Home',
        houseOrBuilding: 'Door No. 12/45, Green Valley Villa',
        streetOrArea: selectedLocation.name.split('(')[0].trim(),
        landmark: 'Near Town Hall',
        location: selectedLocation,
        contactName: currentUser?.name || 'Customer',
        contactPhone: currentUser?.phone || '+91 98950 12345',
        isDefault: true
      }
    ];
  });

  // UI Modes: 'list' | 'add' | 'edit'
  const [mode, setMode] = useState<'list' | 'add' | 'edit'>('list');
  const [editingId, setEditingId] = useState<string | null>(null);

  // Form Fields
  const [formLabel, setFormLabel] = useState<'Home' | 'Work' | 'Other'>('Home');
  const [formCustomTitle, setFormCustomTitle] = useState<string>('');
  const [formHouse, setFormHouse] = useState<string>('');
  const [formStreet, setFormStreet] = useState<string>('');
  const [formLandmark, setFormLandmark] = useState<string>('');
  const [formLocation, setFormLocation] = useState<KochiLocation>(selectedLocation);
  const [formContactName, setFormContactName] = useState<string>(currentUser?.name || '');
  const [formContactPhone, setFormContactPhone] = useState<string>(currentUser?.phone || '');
  const [toastMsg, setToastMsg] = useState<string | null>(null);

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(addresses));
    } catch (e) {}
  }, [addresses]);

  useEffect(() => {
    if (isOpen) {
      setMode('list');
      setFormLocation(selectedLocation);
      if (currentUser) {
        if (!formContactName && currentUser.name) setFormContactName(currentUser.name);
        if (!formContactPhone && currentUser.phone) setFormContactPhone(currentUser.phone);
      }
    }
  }, [isOpen, selectedLocation, currentUser]);

  const showToast = (msg: string) => {
    setToastMsg(msg);
    setTimeout(() => setToastMsg(null), 3000);
  };

  if (!isOpen) return null;

  // Handle setting an address as active location
  const handleSelectAddress = (addr: CustomerSavedAddress) => {
    onSelectLocation(addr.location);
    // Mark as default in list
    setAddresses(prev =>
      prev.map(a => ({
        ...a,
        isDefault: a.id === addr.id
      }))
    );
    showToast(`📍 Active Location changed to ${addr.label} (${addr.location.name.split('(')[0].trim()})`);
  };

  const handleOpenAddForm = () => {
    setFormLabel('Home');
    setFormCustomTitle('');
    setFormHouse('');
    setFormStreet(selectedLocation.name.split('(')[0].trim());
    setFormLandmark('');
    setFormLocation(selectedLocation);
    setFormContactName(currentUser?.name || '');
    setFormContactPhone(currentUser?.phone || '');
    setEditingId(null);
    setMode('add');
  };

  const handleOpenEditForm = (addr: CustomerSavedAddress) => {
    setFormLabel(addr.label);
    setFormCustomTitle(addr.customTitle || '');
    setFormHouse(addr.houseOrBuilding);
    setFormStreet(addr.streetOrArea);
    setFormLandmark(addr.landmark || '');
    setFormLocation(addr.location);
    setFormContactName(addr.contactName || currentUser?.name || '');
    setFormContactPhone(addr.contactPhone || currentUser?.phone || '');
    setEditingId(addr.id);
    setMode('edit');
  };

  const handleDeleteAddress = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    if (addresses.length <= 1) {
      alert('You must keep at least one address.');
      return;
    }
    setAddresses(prev => prev.filter(a => a.id !== id));
    showToast('🗑️ Address removed');
  };

  const handleSaveForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formHouse.trim() || !formStreet.trim()) {
      alert('Please enter your house/flat number and street area.');
      return;
    }

    if (mode === 'edit' && editingId) {
      const updated = addresses.map(a => {
        if (a.id === editingId) {
          return {
            ...a,
            label: formLabel,
            customTitle: formCustomTitle.trim() || undefined,
            houseOrBuilding: formHouse.trim(),
            streetOrArea: formStreet.trim(),
            landmark: formLandmark.trim() || undefined,
            location: formLocation,
            contactName: formContactName.trim() || undefined,
            contactPhone: formContactPhone.trim() || undefined
          };
        }
        return a;
      });
      setAddresses(updated);
      onSelectLocation(formLocation);
      showToast('✓ Address updated and set as active location!');
    } else {
      const newAddr: CustomerSavedAddress = {
        id: `addr-${Date.now()}`,
        label: formLabel,
        customTitle: formCustomTitle.trim() || undefined,
        houseOrBuilding: formHouse.trim(),
        streetOrArea: formStreet.trim(),
        landmark: formLandmark.trim() || undefined,
        location: formLocation,
        contactName: formContactName.trim() || undefined,
        contactPhone: formContactPhone.trim() || undefined,
        isDefault: true
      };
      // Mark others as non-default
      const updated = [newAddr, ...addresses.map(a => ({ ...a, isDefault: false }))];
      setAddresses(updated);
      onSelectLocation(formLocation);
      showToast('✓ New address saved and set as active location!');
    }

    setMode('list');
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-4 bg-slate-950/80 backdrop-blur-md animate-in fade-in">
      <div className={`relative w-full max-w-lg rounded-3xl border shadow-2xl p-5 sm:p-6 overflow-hidden transition-all max-h-[92vh] flex flex-col ${
        isDark ? 'bg-slate-900 border-slate-800 text-white shadow-[0_20px_60px_rgba(0,0,0,0.8)]' : 'bg-white border-slate-200 text-slate-900 shadow-2xl'
      }`}>
        
        {/* Header */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-200 dark:border-slate-800 shrink-0">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-2xl bg-blue-600/10 border border-blue-500/20 text-blue-600 dark:text-blue-400 flex items-center justify-center">
              <MapPin className="w-5 h-5" />
            </div>
            <div>
              <h3 className="text-base font-black">
                {language === 'ml' ? 'വിലാസങ്ങൾ മാറ്റുക' : 'Manage Saved Addresses'}
              </h3>
              <p className="text-[11px] text-slate-400 font-semibold">
                {language === 'ml' ? 'സർവീസ് ലൊക്കേഷൻ തിരഞ്ഞെടുക്കുക' : 'Change delivery & service location'}
              </p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-xl text-slate-400 hover:text-slate-200 hover:bg-slate-800/50 transition cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Floating Toast Notification */}
        {toastMsg && (
          <div className="my-2 p-2.5 rounded-xl bg-emerald-500/15 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 text-xs font-black flex items-center space-x-2 animate-in fade-in">
            <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
            <span>{toastMsg}</span>
          </div>
        )}

        <div className="overflow-y-auto flex-1 py-3 space-y-4">
          
          {/* Active Location Banner */}
          <div className={`p-3.5 rounded-2xl border transition-all ${
            selectedLocation.isLiveGps
              ? 'bg-emerald-500/10 border-emerald-500/30'
              : 'bg-blue-500/10 border-blue-500/20'
          }`}>
            <div className="flex items-center justify-between text-xs mb-1.5">
              <div className="flex items-center space-x-1.5">
                <span className="relative flex h-2 w-2">
                  <span className={`animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 ${
                    selectedLocation.isLiveGps ? 'bg-emerald-400' : 'bg-blue-400'
                  }`}></span>
                  <span className={`relative inline-flex rounded-full h-2 w-2 ${
                    selectedLocation.isLiveGps ? 'bg-emerald-500' : 'bg-blue-500'
                  }`}></span>
                </span>
                <span className="text-[10px] uppercase font-black tracking-wider text-slate-400">
                  {language === 'ml' ? 'ഇപ്പോഴത്തെ ലൊക്കേഷൻ' : 'Current Active Service Area'}
                </span>
              </div>
              <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full text-white shadow-sm ${
                selectedLocation.isLiveGps ? 'bg-emerald-600' : 'bg-blue-600'
              }`}>
                {selectedLocation.isLiveGps ? 'Live GPS' : 'Selected'}
              </span>
            </div>

            <div className="font-black text-sm text-slate-900 dark:text-white">
              {selectedLocation.name}
            </div>
            <div className="text-[11px] text-slate-400 mt-0.5">
              {selectedLocation.district ? `${selectedLocation.district} District • ` : ''}PIN: {selectedLocation.pin}
            </div>

            {/* Quick Action Buttons: Map Picker & GPS Auto-detect */}
            <div className="grid grid-cols-2 gap-2 mt-3 pt-2.5 border-t border-slate-200/50 dark:border-slate-800/80 text-xs">
              <button
                type="button"
                onClick={() => {
                  onClose();
                  onOpenLocationModal?.();
                }}
                className="py-2 px-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-[11px] flex items-center justify-center space-x-1.5 transition active:scale-95 cursor-pointer shadow-md shadow-blue-600/20"
              >
                <Compass className="w-3.5 h-3.5" />
                <span>{language === 'ml' ? 'മാപ്പിൽ മാറ്റുക' : 'Change on Kerala Map'}</span>
              </button>

              <button
                type="button"
                onClick={() => {
                  onDetectLiveGps?.();
                  showToast('🎯 Auto-detecting live GPS coordinates...');
                }}
                disabled={isDetectingLiveGps}
                className={`py-2 px-2.5 rounded-xl font-black text-[11px] flex items-center justify-center space-x-1.5 transition active:scale-95 cursor-pointer ${
                  selectedLocation.isLiveGps
                    ? 'bg-emerald-600 text-white'
                    : 'bg-emerald-500/10 border border-emerald-500/30 text-emerald-600 dark:text-emerald-300 hover:bg-emerald-500/20'
                }`}
              >
                <Crosshair className={`w-3.5 h-3.5 ${isDetectingLiveGps ? 'animate-spin' : ''}`} />
                <span>{isDetectingLiveGps ? 'Locating...' : 'Use Live GPS'}</span>
              </button>
            </div>
          </div>

          {/* LIST MODE: Show Saved Addresses */}
          {mode === 'list' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between pt-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {language === 'ml' ? 'സേവ് ചെയ്ത വിലാസങ്ങൾ' : 'Saved Addresses'} ({addresses.length})
                </span>
                <button
                  type="button"
                  onClick={handleOpenAddForm}
                  className="px-2.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs flex items-center space-x-1 shadow-sm transition active:scale-95 cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>{language === 'ml' ? 'പുതിയ വിലാസം' : 'Add New Address'}</span>
                </button>
              </div>

              {addresses.map((addr) => {
                const isSelected = selectedLocation.name === addr.location.name;
                return (
                  <div
                    key={addr.id}
                    onClick={() => handleSelectAddress(addr)}
                    className={`p-3.5 rounded-2xl border transition-all cursor-pointer relative group ${
                      isSelected
                        ? isDark
                          ? 'bg-blue-600/15 border-blue-500 shadow-md ring-1 ring-blue-500'
                          : 'bg-blue-50/80 border-blue-400 shadow-sm ring-1 ring-blue-400'
                        : isDark
                        ? 'bg-slate-800/60 border-slate-700/60 hover:bg-slate-800 hover:border-slate-600'
                        : 'bg-white border-slate-200 hover:bg-slate-50 hover:border-slate-300'
                    }`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex items-start space-x-2.5 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 ${
                          addr.label === 'Home'
                            ? 'bg-blue-500/10 text-blue-500'
                            : addr.label === 'Work'
                            ? 'bg-amber-500/10 text-amber-500'
                            : 'bg-purple-500/10 text-purple-500'
                        }`}>
                          {addr.label === 'Home' ? (
                            <Home className="w-4 h-4" />
                          ) : addr.label === 'Work' ? (
                            <Briefcase className="w-4 h-4" />
                          ) : (
                            <Building className="w-4 h-4" />
                          )}
                        </div>

                        <div className="min-w-0">
                          <div className="flex items-center space-x-1.5 flex-wrap">
                            <span className="font-black text-xs text-slate-900 dark:text-white">
                              {addr.customTitle || addr.label}
                            </span>
                            {isSelected && (
                              <span className="text-[9px] font-black uppercase px-2 py-0.5 rounded-full bg-emerald-500 text-white shadow-xs">
                                ✓ Active
                              </span>
                            )}
                          </div>
                          
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 mt-0.5">
                            {addr.houseOrBuilding}
                          </p>
                          <p className="text-[11px] text-slate-400">
                            {addr.streetOrArea} • {addr.location.district || 'Kerala'} (PIN: {addr.location.pin})
                          </p>
                          {addr.landmark && (
                            <p className="text-[10px] text-slate-400 italic">
                              Landmark: {addr.landmark}
                            </p>
                          )}
                          {addr.contactPhone && (
                            <p className="text-[10px] text-blue-500 font-bold mt-1 flex items-center space-x-1">
                              <Phone className="w-2.5 h-2.5" />
                              <span>{addr.contactPhone}</span>
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="flex items-center space-x-1 shrink-0 ml-2">
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleOpenEditForm(addr);
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-blue-500 hover:bg-blue-500/10 transition cursor-pointer"
                          title="Edit Address"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                        <button
                          type="button"
                          onClick={(e) => handleDeleteAddress(addr.id, e)}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-500 hover:bg-rose-500/10 transition cursor-pointer"
                          title="Delete Address"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>

                    {!isSelected && (
                      <button
                        type="button"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleSelectAddress(addr);
                        }}
                        className="mt-2 w-full py-1.5 rounded-xl bg-slate-100 dark:bg-slate-700/50 hover:bg-blue-600 hover:text-white text-slate-700 dark:text-slate-200 text-[11px] font-black transition cursor-pointer text-center"
                      >
                        Set as Active Service Location
                      </button>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {/* ADD / EDIT FORM MODE */}
          {(mode === 'add' || mode === 'edit') && (
            <form onSubmit={handleSaveForm} className="space-y-3 pt-1">
              <div className="flex items-center justify-between pb-1">
                <span className="text-xs font-black uppercase tracking-wider text-slate-400">
                  {mode === 'edit' ? 'Edit Address' : 'New Address Details'}
                </span>
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="text-xs text-blue-500 font-bold hover:underline cursor-pointer"
                >
                  ← Back to List
                </button>
              </div>

              {/* Tag Selector: Home, Work, Other */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Address Type
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {(['Home', 'Work', 'Other'] as const).map((tag) => (
                    <button
                      key={tag}
                      type="button"
                      onClick={() => setFormLabel(tag)}
                      className={`py-2 px-3 rounded-xl border text-xs font-black flex items-center justify-center space-x-1.5 transition cursor-pointer ${
                        formLabel === tag
                          ? 'bg-blue-600 border-blue-500 text-white shadow-sm ring-1 ring-blue-500'
                          : isDark ? 'bg-slate-800 border-slate-700 text-slate-300' : 'bg-slate-50 border-slate-200 text-slate-700'
                      }`}
                    >
                      {tag === 'Home' ? <Home className="w-3.5 h-3.5" /> : tag === 'Work' ? <Briefcase className="w-3.5 h-3.5" /> : <Building className="w-3.5 h-3.5" />}
                      <span>{tag}</span>
                    </button>
                  ))}
                </div>
              </div>

              {/* House / Flat Number */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  House / Flat / Door Number *
                </label>
                <input
                  type="text"
                  required
                  value={formHouse}
                  onChange={(e) => setFormHouse(e.target.value)}
                  placeholder="e.g. Door No. 4B, Sky Heights Apartment"
                  className={`w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Area / Kerala Town Selector */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Town / Locality (Kerala Area) *
                </label>
                <select
                  value={formLocation.id}
                  onChange={(e) => {
                    const found = locations.find(l => l.id === e.target.value);
                    if (found) {
                      setFormLocation(found);
                      setFormStreet(found.name.split('(')[0].trim());
                    }
                  }}
                  className={`w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                >
                  {locations.map((loc) => (
                    <option key={loc.id} value={loc.id}>
                      {loc.name} {loc.district ? `(${loc.district})` : ''} - PIN {loc.pin}
                    </option>
                  ))}
                </select>
              </div>

              {/* Street / Road */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Street / Road / Colony *
                </label>
                <input
                  type="text"
                  required
                  value={formStreet}
                  onChange={(e) => setFormStreet(e.target.value)}
                  placeholder="e.g. Civil Station Road, Seaport-Airport Road"
                  className={`w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Landmark */}
              <div>
                <label className="block text-[11px] font-bold text-slate-400 mb-1">
                  Nearby Landmark (Optional)
                </label>
                <input
                  type="text"
                  value={formLandmark}
                  onChange={(e) => setFormLandmark(e.target.value)}
                  placeholder="e.g. Opposite Metro Pillar 420, Near HP Petrol Pump"
                  className={`w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                    isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                  }`}
                />
              </div>

              {/* Contact Phone */}
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Contact Name
                  </label>
                  <input
                    type="text"
                    value={formContactName}
                    onChange={(e) => setFormContactName(e.target.value)}
                    placeholder="Recipient Name"
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
                <div>
                  <label className="block text-[11px] font-bold text-slate-400 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={formContactPhone}
                    onChange={(e) => setFormContactPhone(e.target.value)}
                    placeholder="+91 98950 12345"
                    className={`w-full p-2.5 rounded-xl border text-xs font-bold focus:outline-none focus:ring-2 focus:ring-blue-500 ${
                      isDark ? 'bg-slate-950 border-slate-800 text-white' : 'bg-slate-50 border-slate-200 text-slate-900'
                    }`}
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="pt-2 flex items-center justify-between space-x-2">
                <button
                  type="button"
                  onClick={() => setMode('list')}
                  className="px-4 py-2.5 rounded-xl border border-slate-700 text-xs font-bold text-slate-300 hover:bg-slate-800 transition cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-black text-xs shadow-lg shadow-blue-600/30 transition cursor-pointer flex items-center justify-center space-x-1.5"
                >
                  <Check className="w-3.5 h-3.5" />
                  <span>{mode === 'edit' ? 'Update & Set Active' : 'Save & Set as Active Location'}</span>
                </button>
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
