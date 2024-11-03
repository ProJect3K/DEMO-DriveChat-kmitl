import { Bus, Car, MapPin, Bike } from 'lucide-react';
import { ROOM_TYPES } from 'app/lib/constants';

export default function TransportButtons({ onSelectType, selectedType }) {
  return (
    <div className="flex flex-col gap-2 w-full mb-4">
      <div className="flex gap-2">
        <button 
          onClick={() => onSelectType(ROOM_TYPES.BIKE)}
          className={`flex-1 rounded-lg overflow-hidden border ${
            selectedType === ROOM_TYPES.BIKE ? 'border-orange-500' : 'border-gray-200'
          }`}
        >
          <div className={`flex items-center gap-2 py-2 px-3 w-full ${
            selectedType === ROOM_TYPES.BIKE ? 'border-orange-500' : 'border-gray-200'
          }`}>
            <Bike className='border-orange-500' />
            <span className="text-sm text-gray-600">มอเตอร์ไซค์</span>
          </div>
        </button>

        <button 
          onClick={() => onSelectType(ROOM_TYPES.CAR)}
          className={`flex-1 rounded-lg overflow-hidden border ${
            selectedType === ROOM_TYPES.CAR ? 'border-orange-500' : 'border-gray-200'
          }`}
        >
          <div className={`flex items-center gap-2 py-2 px-3 w-full ${
            selectedType === ROOM_TYPES.CAR ? 'bg-orange-100' : 'bg-white'
          }`}>
            <Car className='border-orange-500' />
            <span className="text-sm text-gray-600">แท็กซี่</span>
          </div>
        </button>
      </div>

      <div className="flex gap-2">
        <button 
          onClick={() => onSelectType(ROOM_TYPES.LOCATION)}
          className={`flex-1 rounded-lg overflow-hidden border ${
            selectedType === ROOM_TYPES.LOCATION ? 'border-orange-500' : 'border-gray-200'
          }`}
        >
          <div className={`flex items-center gap-2 py-2 px-3 w-full ${
            selectedType === ROOM_TYPES.LOCATION ? 'bg-blue-50' : 'bg-white'
          }`}>
            <MapPin className='border-orange-500' />
            <span className="text-sm text-gray-600">สองแถว</span>
          </div>
        </button>

        <button 
          onClick={() => onSelectType(ROOM_TYPES.BUS)}
          className={`flex-1 rounded-lg overflow-hidden border ${
            selectedType === ROOM_TYPES.BUS ? 'border-orange-500' : 'border-gray-200'
          }`}
        >
<div className={`flex items-center gap-2 py-2 px-3 w-full ${
            selectedType === ROOM_TYPES.BUS ? 'bg-blue-50' : 'bg-white'
          }`}>
            <Bus className='border-orange-500' />
            <span className="text-sm text-gray-600">Ev มินิบัส</span>
          </div>
        </button>
      </div>
    </div>
  );
}