// Mock Database & Business Logic Store for Fixily Kerala
import { KochiLocation, ServiceItem, GigPartner, BookingJob } from '../types';

export const KOCHI_LOCATIONS: KochiLocation[] = [
  // 1. Ernakulam District (Metropolitan, Suburbs & Coastal/Rural)
  { id: 'kakkanad', name: 'Kakkanad (InfoPark & SmartCity)', city: 'Kochi', district: 'Ernakulam', taluk: 'Kanayannur', panchayat: 'Thrikkakara', regionType: 'URBAN', state: 'Kerala', pin: '682030', lat: 10.0159, lng: 76.3419, isServiced: true },
  { id: 'edappally', name: 'Edappally & Lulu Mall', city: 'Kochi', district: 'Ernakulam', taluk: 'Kanayannur', regionType: 'URBAN', state: 'Kerala', pin: '682024', lat: 10.0261, lng: 76.3084, isServiced: true },
  { id: 'vyttila', name: 'Vyttila Mobility Hub & Kaloor', city: 'Kochi', district: 'Ernakulam', taluk: 'Kanayannur', regionType: 'URBAN', state: 'Kerala', pin: '682019', lat: 9.9674, lng: 76.3182, isServiced: true },
  { id: 'fortkochi', name: 'Fort Kochi & Mattancherry', city: 'Kochi', district: 'Ernakulam', taluk: 'Kochi', regionType: 'COASTAL', state: 'Kerala', pin: '682001', lat: 9.9648, lng: 76.2427, isServiced: true },
  { id: 'aluva', name: 'Aluva Metro & Airport Corridor', city: 'Aluva', district: 'Ernakulam', taluk: 'Aluva', regionType: 'URBAN', state: 'Kerala', pin: '683101', lat: 10.1076, lng: 76.3516, isServiced: true },
  { id: 'angamaly', name: 'Angamaly & Karukutty Rural', city: 'Angamaly', district: 'Ernakulam', taluk: 'Aluva', panchayat: 'Karukutty', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '683572', lat: 10.1960, lng: 76.3860, isServiced: true },
  { id: 'perumbavoor', name: 'Perumbavoor & Kuruppampady', city: 'Perumbavoor', district: 'Ernakulam', taluk: 'Kunnathunad', panchayat: 'Rayamangalam', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '683542', lat: 10.1115, lng: 76.4828, isServiced: true },
  { id: 'kothamangalam', name: 'Kothamangalam (High-Range Gateway)', city: 'Kothamangalam', district: 'Ernakulam', taluk: 'Kothamangalam', panchayat: 'Keerampara', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '686691', lat: 10.0614, lng: 76.6277, isServiced: true },
  { id: 'muvattupuzha', name: 'Muvattupuzha & Paipra Village', city: 'Muvattupuzha', district: 'Ernakulam', taluk: 'Muvattupuzha', panchayat: 'Paipra', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '686661', lat: 9.9894, lng: 76.5790, isServiced: true },
  { id: 'piravom', name: 'Piravom & Ramamangalam Rural', city: 'Piravom', district: 'Ernakulam', taluk: 'Muvattupuzha', panchayat: 'Ramamangalam', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '686664', lat: 9.8700, lng: 76.4900, isServiced: true },
  { id: 'northparavur', name: 'North Paravur & Chendamangalam', city: 'Paravur', district: 'Ernakulam', taluk: 'Paravur', panchayat: 'Chendamangalam', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '683512', lat: 10.1458, lng: 76.2294, isServiced: true },
  { id: 'vypeen', name: 'Vypeen Island & Cherai Beach', city: 'Vypeen', district: 'Ernakulam', taluk: 'Kochi', panchayat: 'Pallippuram', regionType: 'COASTAL', state: 'Kerala', pin: '682508', lat: 10.0700, lng: 76.1900, isServiced: true },
  { id: 'chellanam', name: 'Chellanam Coastal Fishing Village', city: 'Chellanam', district: 'Ernakulam', taluk: 'Kochi', panchayat: 'Chellanam', regionType: 'COASTAL', state: 'Kerala', pin: '682008', lat: 9.8050, lng: 76.2760, isServiced: true },
  { id: 'kalloorkad', name: 'Kalloorkad & Pothanicad Rural', city: 'Kalloorkad', district: 'Ernakulam', taluk: 'Muvattupuzha', panchayat: 'Kalloorkad', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '686668', lat: 9.9320, lng: 76.6780, isServiced: true },

  // 2. Idukki District (High-Range Tea Estates, Valleys & Remote Forest Panchayats)
  { id: 'munnar', name: 'Munnar High-Range Tea Estates', city: 'Munnar', district: 'Idukki', taluk: 'Devikulam', panchayat: 'Munnar', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '685612', lat: 10.0889, lng: 77.0595, isServiced: true },
  { id: 'devikulam', name: 'Devikulam Rural Panchayat', city: 'Devikulam', district: 'Idukki', taluk: 'Devikulam', panchayat: 'Devikulam', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '685613', lat: 10.0617, lng: 77.1028, isServiced: true },
  { id: 'kattappana', name: 'Kattappana Cardamom Hills', city: 'Kattappana', district: 'Idukki', taluk: 'Udumbanchola', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '685508', lat: 9.7712, lng: 77.1194, isServiced: true },
  { id: 'nedumkandam', name: 'Nedumkandam & Udumbanchola', city: 'Nedumkandam', district: 'Idukki', taluk: 'Udumbanchola', panchayat: 'Nedumkandam', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '685553', lat: 9.8450, lng: 77.1700, isServiced: true },
  { id: 'vagamon', name: 'Vagamon Pine Hills & Tea Valleys', city: 'Vagamon', district: 'Idukki', taluk: 'Peermade', panchayat: 'Elappara', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '685503', lat: 9.6885, lng: 76.9056, isServiced: true },
  { id: 'thodupuzha', name: 'Thodupuzha Town & Vannappuram', city: 'Thodupuzha', district: 'Idukki', taluk: 'Thodupuzha', panchayat: 'Vannappuram', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '685584', lat: 9.8959, lng: 76.7184, isServiced: true },
  { id: 'adimali', name: 'Adimali & Neriamangalam Gateway', city: 'Adimali', district: 'Idukki', taluk: 'Devikulam', panchayat: 'Adimali', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '685561', lat: 10.0333, lng: 76.9500, isServiced: true },
  { id: 'marayoor', name: 'Marayoor Sandalwood Forest Village', city: 'Marayoor', district: 'Idukki', taluk: 'Devikulam', panchayat: 'Marayoor', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '685620', lat: 10.2797, lng: 77.1610, isServiced: true },
  { id: 'kumily', name: 'Kumily & Thekkady Periyar Wildlife', city: 'Kumily', district: 'Idukki', taluk: 'Peermade', panchayat: 'Kumily', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '685509', lat: 9.6050, lng: 77.1650, isServiced: true },

  // 3. Wayanad District (Hill Country, Rain Forests & Tribal Foothills)
  { id: 'kalpetta', name: 'Kalpetta & Pinangode Village', city: 'Kalpetta', district: 'Wayanad', taluk: 'Vythiri', panchayat: 'Vengappally', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '673121', lat: 11.6050, lng: 76.0830, isServiced: true },
  { id: 'sulthanbathery', name: 'Sulthan Bathery & Ambalavayal', city: 'Sulthan Bathery', district: 'Wayanad', taluk: 'Sulthan Bathery', panchayat: 'Ambalavayal', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '673592', lat: 11.6622, lng: 76.2570, isServiced: true },
  { id: 'mananthavady', name: 'Mananthavady & Thirunelly Forest', city: 'Mananthavady', district: 'Wayanad', taluk: 'Mananthavady', panchayat: 'Thirunelly', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '670645', lat: 11.8026, lng: 76.0036, isServiced: true },
  { id: 'vythiri', name: 'Vythiri & Lakkidi Rain Forest', city: 'Vythiri', district: 'Wayanad', taluk: 'Vythiri', panchayat: 'Vythiri', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '673576', lat: 11.5510, lng: 76.0400, isServiced: true },
  { id: 'meppadi', name: 'Meppadi & Chooralmala Plantation', city: 'Meppadi', district: 'Wayanad', taluk: 'Vythiri', panchayat: 'Meppadi', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '673577', lat: 11.5500, lng: 76.1300, isServiced: true },
  { id: 'pulpally', name: 'Pulpally & Mullankolly Border Village', city: 'Pulpally', district: 'Wayanad', taluk: 'Sulthan Bathery', panchayat: 'Mullankolly', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '673579', lat: 11.7900, lng: 76.1600, isServiced: true },

  // 4. Thiruvananthapuram District (Capital City, Beaches & Highland Foothills)
  { id: 'trivandrum', name: 'Trivandrum (Technopark & Kowdiar)', city: 'Thiruvananthapuram', district: 'Thiruvananthapuram', taluk: 'Thiruvananthapuram', regionType: 'URBAN', state: 'Kerala', pin: '695581', lat: 8.5241, lng: 76.9366, isServiced: true },
  { id: 'attingal', name: 'Attingal & Chirayinkeezhu Rural', city: 'Attingal', district: 'Thiruvananthapuram', taluk: 'Chirayinkeezhu', panchayat: 'Chirayinkeezhu', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '695101', lat: 8.6960, lng: 76.8140, isServiced: true },
  { id: 'neyyattinkara', name: 'Neyyattinkara & Amaravila', city: 'Neyyattinkara', district: 'Thiruvananthapuram', taluk: 'Neyyattinkara', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '695121', lat: 8.4000, lng: 77.0800, isServiced: true },
  { id: 'varkala', name: 'Varkala Cliff & Coastal Village', city: 'Varkala', district: 'Thiruvananthapuram', taluk: 'Varkala', regionType: 'COASTAL', state: 'Kerala', pin: '695141', lat: 8.7379, lng: 76.7163, isServiced: true },
  { id: 'vizhinjam', name: 'Vizhinjam International Seaport Hub', city: 'Vizhinjam', district: 'Thiruvananthapuram', taluk: 'Neyyattinkara', regionType: 'COASTAL', state: 'Kerala', pin: '695521', lat: 8.3760, lng: 76.9930, isServiced: true },
  { id: 'nedumangad', name: 'Nedumangad & Palode Rural', city: 'Nedumangad', district: 'Thiruvananthapuram', taluk: 'Nedumangad', panchayat: 'Palode', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '695541', lat: 8.6000, lng: 77.0000, isServiced: true },
  { id: 'vithura', name: 'Vithura & Ponmudi Hill Station', city: 'Vithura', district: 'Thiruvananthapuram', taluk: 'Nedumangad', panchayat: 'Vithura', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '695551', lat: 8.6800, lng: 77.1000, isServiced: true },

  // 5. Kozhikode District (Malabar Coast & Highland Ghat Passes)
  { id: 'kozhikode', name: 'Kozhikode (Hilite City & Beach)', city: 'Kozhikode', district: 'Kozhikode', taluk: 'Kozhikode', regionType: 'URBAN', state: 'Kerala', pin: '673001', lat: 11.2588, lng: 75.7804, isServiced: true },
  { id: 'vadakara', name: 'Vadakara & Onchiam Rural', city: 'Vadakara', district: 'Kozhikode', taluk: 'Vatakara', panchayat: 'Onchiam', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '673101', lat: 11.6090, lng: 75.5900, isServiced: true },
  { id: 'thamarassery', name: 'Thamarassery & Churam Ghat Pass', city: 'Thamarassery', district: 'Kozhikode', taluk: 'Thamarassery', panchayat: 'Thamarassery', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '673573', lat: 11.4167, lng: 75.9333, isServiced: true },
  { id: 'koyilandy', name: 'Koyilandy & Kappad Beach', city: 'Koyilandy', district: 'Kozhikode', taluk: 'Koyilandy', regionType: 'COASTAL', state: 'Kerala', pin: '673305', lat: 11.4400, lng: 75.7000, isServiced: true },
  { id: 'balussery', name: 'Balussery & Koorachundu Village', city: 'Balussery', district: 'Kozhikode', taluk: 'Koyilandy', panchayat: 'Koorachundu', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '673612', lat: 11.4500, lng: 75.8200, isServiced: true },
  { id: 'beypore', name: 'Beypore Harbour & Coastal Village', city: 'Beypore', district: 'Kozhikode', taluk: 'Kozhikode', regionType: 'COASTAL', state: 'Kerala', pin: '673015', lat: 11.1800, lng: 75.8000, isServiced: true },
  { id: 'thiruvambady', name: 'Thiruvambady & Kakkadampoyil Hills', city: 'Thiruvambady', district: 'Kozhikode', taluk: 'Thamarassery', panchayat: 'Thiruvambady', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '673603', lat: 11.3900, lng: 76.0100, isServiced: true },

  // 6. Thrissur District (Cultural Capital & Kole Wetlands)
  { id: 'thrissur', name: 'Thrissur (Swaraj Round & East Fort)', city: 'Thrissur', district: 'Thrissur', taluk: 'Thrissur', regionType: 'URBAN', state: 'Kerala', pin: '680001', lat: 10.5276, lng: 76.2144, isServiced: true },
  { id: 'guruvayur', name: 'Guruvayur & Chavakkad Coastal', city: 'Guruvayur', district: 'Thrissur', taluk: 'Chavakkad', regionType: 'COASTAL', state: 'Kerala', pin: '680101', lat: 10.5947, lng: 76.0378, isServiced: true },
  { id: 'chalakudy', name: 'Chalakudy & Pariyaram Rural', city: 'Chalakudy', district: 'Thrissur', taluk: 'Chalakudy', panchayat: 'Pariyaram', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '680307', lat: 10.3070, lng: 76.3330, isServiced: true },
  { id: 'athirappilly', name: 'Athirappilly Forest & Waterfall Village', city: 'Athirappilly', district: 'Thrissur', taluk: 'Chalakudy', panchayat: 'Athirappilly', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '680721', lat: 10.2980, lng: 76.5700, isServiced: true },
  { id: 'kodungallur', name: 'Kodungallur Ancient Port Town', city: 'Kodungallur', district: 'Thrissur', taluk: 'Kodungallur', regionType: 'COASTAL', state: 'Kerala', pin: '680664', lat: 10.2200, lng: 76.2000, isServiced: true },
  { id: 'irinjalakuda', name: 'Irinjalakuda & Kattoor Rural', city: 'Irinjalakuda', district: 'Thrissur', taluk: 'Mukundapuram', panchayat: 'Kattoor', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '680121', lat: 10.3400, lng: 76.2000, isServiced: true },
  { id: 'wadakkanchery', name: 'Wadakkanchery & Chelakkara Village', city: 'Wadakkanchery', district: 'Thrissur', taluk: 'Thalapilly', panchayat: 'Chelakkara', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '680582', lat: 10.6600, lng: 76.2400, isServiced: true },

  // 7. Malappuram District (Riverine Valleys, Teak Belts & Coastal Towns)
  { id: 'malappuram', name: 'Malappuram (Down Hill & Civil Station)', city: 'Malappuram', district: 'Malappuram', taluk: 'Ernad', regionType: 'URBAN', state: 'Kerala', pin: '676505', lat: 11.0732, lng: 76.0740, isServiced: true },
  { id: 'manjeri', name: 'Manjeri & Anakkayam Rural', city: 'Manjeri', district: 'Malappuram', taluk: 'Ernad', panchayat: 'Anakkayam', regionType: 'URBAN', state: 'Kerala', pin: '676121', lat: 11.1200, lng: 76.1200, isServiced: true },
  { id: 'nilambur', name: 'Nilambur Teak Town & Forest Fringe', city: 'Nilambur', district: 'Malappuram', taluk: 'Nilambur', panchayat: 'Chungathara', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '679329', lat: 11.2770, lng: 76.2260, isServiced: true },
  { id: 'perinthalmanna', name: 'Perinthalmanna & Melattur', city: 'Perinthalmanna', district: 'Malappuram', taluk: 'Perinthalmanna', panchayat: 'Melattur', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '679322', lat: 10.9700, lng: 76.2200, isServiced: true },
  { id: 'tirur', name: 'Tirur & Tanur Coastal Strip', city: 'Tirur', district: 'Malappuram', taluk: 'Tirur', regionType: 'COASTAL', state: 'Kerala', pin: '676101', lat: 10.9100, lng: 75.9200, isServiced: true },
  { id: 'karuvarakundu', name: 'Karuvarakundu Silent Valley Foothills', city: 'Karuvarakundu', district: 'Malappuram', taluk: 'Nilambur', panchayat: 'Karuvarakundu', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '676523', lat: 11.1700, lng: 76.3500, isServiced: true },

  // 8. Kannur District (North Malabar Coast & Midland Hills)
  { id: 'kannur', name: 'Kannur (Thavakkara & Payyambalam)', city: 'Kannur', district: 'Kannur', taluk: 'Kannur', regionType: 'URBAN', state: 'Kerala', pin: '670001', lat: 11.8745, lng: 75.3704, isServiced: true },
  { id: 'thalassery', name: 'Thalassery & Dharmadam Island', city: 'Thalassery', district: 'Kannur', taluk: 'Thalassery', regionType: 'COASTAL', state: 'Kerala', pin: '670101', lat: 11.7500, lng: 75.4900, isServiced: true },
  { id: 'payyanur', name: 'Payyanur & Ramanthali Rural', city: 'Payyanur', district: 'Kannur', taluk: 'Payyanur', panchayat: 'Ramanthali', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '670307', lat: 12.1000, lng: 75.2000, isServiced: true },
  { id: 'taliparamba', name: 'Taliparamba & Pattuvam Backwaters', city: 'Taliparamba', district: 'Kannur', taluk: 'Taliparamba', panchayat: 'Pattuvam', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '670141', lat: 12.0400, lng: 75.3600, isServiced: true },
  { id: 'iritty', name: 'Iritty & Ulikkal Hill Valleys', city: 'Iritty', district: 'Kannur', taluk: 'Iritty', panchayat: 'Ulikkal', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '670703', lat: 11.9800, lng: 75.6700, isServiced: true },
  { id: 'peravoor', name: 'Peravoor & Kottiyoor Forest Shrine', city: 'Peravoor', district: 'Kannur', taluk: 'Iritty', panchayat: 'Kottiyoor', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '670673', lat: 11.9000, lng: 75.8100, isServiced: true },

  // 9. Kottayam District (Rubber Plantations, Backwaters & Foothills)
  { id: 'kottayam', name: 'Kottayam (Kanjikuzhy & Collectorate)', city: 'Kottayam', district: 'Kottayam', taluk: 'Kottayam', regionType: 'URBAN', state: 'Kerala', pin: '686001', lat: 9.5916, lng: 76.5222, isServiced: true },
  { id: 'changanassery', name: 'Changanassery & Madappally', city: 'Changanassery', district: 'Kottayam', taluk: 'Changanassery', panchayat: 'Madappally', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '686101', lat: 9.4470, lng: 76.5400, isServiced: true },
  { id: 'pala', name: 'Pala & Ramapuram Plantation Belt', city: 'Pala', district: 'Kottayam', taluk: 'Meenachil', panchayat: 'Ramapuram', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '686575', lat: 9.7090, lng: 76.6800, isServiced: true },
  { id: 'kanjirappally', name: 'Kanjirappally & Mundakayam Foothills', city: 'Kanjirappally', district: 'Kottayam', taluk: 'Kanjirappally', panchayat: 'Mundakayam', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '686507', lat: 9.5580, lng: 76.7860, isServiced: true },
  { id: 'kumarakom', name: 'Kumarakom Backwater Village', city: 'Kumarakom', district: 'Kottayam', taluk: 'Kottayam', panchayat: 'Kumarakom', regionType: 'COASTAL', state: 'Kerala', pin: '686563', lat: 9.6175, lng: 76.4300, isServiced: true },
  { id: 'erumeli', name: 'Erumeli Sabarimala Gateway Village', city: 'Erumeli', district: 'Kottayam', taluk: 'Kanjirappally', panchayat: 'Erumeli', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '686509', lat: 9.4800, lng: 76.8400, isServiced: true },
  { id: 'vaikom', name: 'Vaikom & Thalayolaparambu', city: 'Vaikom', district: 'Kottayam', taluk: 'Vaikom', panchayat: 'Thalayolaparambu', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '686141', lat: 9.7500, lng: 76.3900, isServiced: true },

  // 10. Alappuzha District (Kuttanad Backwaters, Canals & Coastal Belt)
  { id: 'alappuzha', name: 'Alappuzha (Boat Jetty & Beach Road)', city: 'Alappuzha', district: 'Alappuzha', taluk: 'Ambalappuzha', regionType: 'URBAN', state: 'Kerala', pin: '688001', lat: 9.4981, lng: 76.3388, isServiced: true },
  { id: 'kuttanad', name: 'Kuttanad (Champakulam & Nedumudi)', city: 'Kuttanad', district: 'Alappuzha', taluk: 'Kuttanad', panchayat: 'Champakulam', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '688505', lat: 9.4000, lng: 76.4200, isServiced: true },
  { id: 'kavalam', name: 'Kavalam Backwater Hamlet', city: 'Kavalam', district: 'Alappuzha', taluk: 'Kuttanad', panchayat: 'Kavalam', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '688506', lat: 9.4700, lng: 76.4800, isServiced: true },
  { id: 'cherthala', name: 'Cherthala & Mararikulam Beach', city: 'Cherthala', district: 'Alappuzha', taluk: 'Cherthala', panchayat: 'Mararikulam', regionType: 'COASTAL', state: 'Kerala', pin: '688524', lat: 9.6800, lng: 76.3300, isServiced: true },
  { id: 'kayamkulam', name: 'Kayamkulam & Krishnapuram Rural', city: 'Kayamkulam', district: 'Alappuzha', taluk: 'Karthikappally', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '690502', lat: 9.1700, lng: 76.5000, isServiced: true },
  { id: 'mavelikkara', name: 'Mavelikkara & Chettikulangara', city: 'Mavelikkara', district: 'Alappuzha', taluk: 'Mavelikkara', panchayat: 'Chettikulangara', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '690101', lat: 9.2700, lng: 76.5500, isServiced: true },

  // 11. Palakkad District (Palakkad Gap, Attappadi Hills & Rural Agro Belts)
  { id: 'palakkad', name: 'Palakkad (Fort Maidan & Town)', city: 'Palakkad', district: 'Palakkad', taluk: 'Palakkad', regionType: 'URBAN', state: 'Kerala', pin: '678001', lat: 10.7867, lng: 76.6548, isServiced: true },
  { id: 'attappadi', name: 'Attappadi (Agali & Sholayur Tribal Belt)', city: 'Agali', district: 'Palakkad', taluk: 'Mannarkkad', panchayat: 'Agali', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '678581', lat: 11.0800, lng: 76.6500, isServiced: true },
  { id: 'ottapalam', name: 'Ottapalam & Vaniyamkulam Rural', city: 'Ottapalam', district: 'Palakkad', taluk: 'Ottapalam', panchayat: 'Vaniyamkulam', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '679101', lat: 10.7700, lng: 76.3800, isServiced: true },
  { id: 'mannarkkad', name: 'Mannarkkad & Alanallur Foothills', city: 'Mannarkkad', district: 'Palakkad', taluk: 'Mannarkkad', panchayat: 'Alanallur', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '678582', lat: 10.9800, lng: 76.4600, isServiced: true },
  { id: 'nenmara', name: 'Nenmara & Nelliyampathy Orange Hills', city: 'Nenmara', district: 'Palakkad', taluk: 'Chittur', panchayat: 'Nelliyampathy', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '678508', lat: 10.5300, lng: 76.6900, isServiced: true },
  { id: 'chittur', name: 'Chittur & Kozhinjampara Border', city: 'Chittur', district: 'Palakkad', taluk: 'Chittur', panchayat: 'Kozhinjampara', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '678101', lat: 10.7000, lng: 76.8200, isServiced: true },

  // 12. Kollam District (Ashtamudi Lake & Eastern Mountain Foothills)
  { id: 'kollam', name: 'Kollam (Chinnakada & Asramam)', city: 'Kollam', district: 'Kollam', taluk: 'Kollam', regionType: 'URBAN', state: 'Kerala', pin: '691001', lat: 8.8932, lng: 76.6141, isServiced: true },
  { id: 'punalur', name: 'Punalur & Suspension Bridge Town', city: 'Punalur', district: 'Kollam', taluk: 'Punalur', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '691305', lat: 9.0190, lng: 76.9270, isServiced: true },
  { id: 'kottarakkara', name: 'Kottarakkara & Ezhukone Rural', city: 'Kottarakkara', district: 'Kollam', taluk: 'Kottarakkara', panchayat: 'Ezhukone', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '691506', lat: 8.9980, lng: 76.7700, isServiced: true },
  { id: 'sasthamkotta', name: 'Sasthamkotta Lake Village', city: 'Sasthamkotta', district: 'Kollam', taluk: 'Kunnathur', panchayat: 'Sasthamkotta', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '690521', lat: 9.0400, lng: 76.6300, isServiced: true },
  { id: 'thenmala', name: 'Thenmala & Kulathupuzha Eco Hills', city: 'Thenmala', district: 'Kollam', taluk: 'Punalur', panchayat: 'Thenmala', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '691308', lat: 8.9500, lng: 77.0600, isServiced: true },

  // 13. Pathanamthitta District (River Forests & Pilgrim Gateway)
  { id: 'pathanamthitta', name: 'Pathanamthitta Town & Kumbazha', city: 'Pathanamthitta', district: 'Pathanamthitta', taluk: 'Kozhencherry', regionType: 'URBAN', state: 'Kerala', pin: '689645', lat: 9.2648, lng: 76.7870, isServiced: true },
  { id: 'adoor', name: 'Adoor & Ezhamkulam Village', city: 'Adoor', district: 'Pathanamthitta', taluk: 'Adoor', panchayat: 'Ezhamkulam', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '691523', lat: 9.1500, lng: 76.7300, isServiced: true },
  { id: 'thiruvalla', name: 'Thiruvalla & Kumbanad NRI Enclave', city: 'Thiruvalla', district: 'Pathanamthitta', taluk: 'Thiruvalla', regionType: 'URBAN', state: 'Kerala', pin: '689101', lat: 9.3800, lng: 76.5700, isServiced: true },
  { id: 'ranni', name: 'Ranni & Vadasserikkara River Forest', city: 'Ranni', district: 'Pathanamthitta', taluk: 'Ranni', panchayat: 'Vadasserikkara', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '689672', lat: 9.3800, lng: 76.7800, isServiced: true },
  { id: 'konni', name: 'Konni Elephant Sanctuary & Forest', city: 'Konni', district: 'Pathanamthitta', taluk: 'Konni', panchayat: 'Konni', regionType: 'RURAL_VILLAGE', state: 'Kerala', pin: '689691', lat: 9.2400, lng: 76.8400, isServiced: true },
  { id: 'gavi', name: 'Gavi High-Range Rainforest Hamlet', city: 'Gavi', district: 'Pathanamthitta', taluk: 'Ranni', panchayat: 'Seethathode', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '689662', lat: 9.4350, lng: 77.1650, isServiced: true },

  // 14. Kasaragod District (Northern Forts, Coastal Border & Hill Country)
  { id: 'kasaragod', name: 'Kasaragod (Town & Vidyanagar)', city: 'Kasaragod', district: 'Kasaragod', taluk: 'Kasaragod', regionType: 'URBAN', state: 'Kerala', pin: '671121', lat: 12.5102, lng: 74.9852, isServiced: true },
  { id: 'kanhangad', name: 'Kanhangad & Ajanur Rural', city: 'Kanhangad', district: 'Kasaragod', taluk: 'Hosdurg', panchayat: 'Ajanur', regionType: 'URBAN', state: 'Kerala', pin: '671315', lat: 12.3000, lng: 75.0900, isServiced: true },
  { id: 'bekal', name: 'Bekal Fort & Pallikkara Coastal', city: 'Bekal', district: 'Kasaragod', taluk: 'Hosdurg', panchayat: 'Pallikkara', regionType: 'COASTAL', state: 'Kerala', pin: '671318', lat: 12.3900, lng: 75.0300, isServiced: true },
  { id: 'uppala', name: 'Uppala & Manjeshwar Coastal Border', city: 'Uppala', district: 'Kasaragod', taluk: 'Manjeshwaram', regionType: 'COASTAL', state: 'Kerala', pin: '671322', lat: 12.6800, lng: 74.9000, isServiced: true },
  { id: 'ranipuram', name: 'Ranipuram Hill Station & Vellarikundu', city: 'Vellarikundu', district: 'Kasaragod', taluk: 'Vellarikundu', panchayat: 'Panathady', regionType: 'HIGH_RANGE', state: 'Kerala', pin: '671532', lat: 12.4300, lng: 75.3500, isServiced: true }
];

export const SERVICES: ServiceItem[] = [
  // 1. Mechanic & Roadside Assistance (Core)
  {
    id: 'doorstep-mechanic',
    phase: 1,
    category: 'Mechanic & Roadside Assistance',
    title: 'Doorstep Car & Bike Mechanic',
    malayalamTitle: 'ഡോർസ്റ്റെപ്പ് കാർ & ബൈക്ക് മെക്കാനിക്',
    tagline: 'Breakdown jumpstart, engine diagnostic, brake fix & towing.',
    malayalamTagline: 'ബാറ്ററി ജമ്പ്സ്റ്റാർട്ട്, ബ്രേക്ക് റിപ്പയർ, എഞ്ചിൻ തകരാറുകൾ.',
    badge: 'Roadside Rescue',
    icon: 'Wrench',
    imageUrl: 'https://images.unsplash.com/photo-1619642751034-765dfdf7c58e?w=600&auto=format&fit=crop&q=80',
    eta: '20 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 199,
    priceRangeNotice: '₹199 diagnostic fee. Full repair quote given upfront before work begins.',
    sparePartsNotice: 'Spare parts billed at actual retail MRP with printed bill.',
    features: ['20-minute rapid breakdown arrival', 'Battery jumpstart & alternator voltage test', 'Brake pad inspection & diagnostic report'],
    rating: 4.8,
    reviewsCount: 38
  },

  // 2. Acting Drivers (Core)
  {
    id: 'acting-driver',
    phase: 1,
    category: 'Driver',
    title: 'Freelance Acting Driver ("Drive My Car")',
    malayalamTitle: 'ആക്ടിംഗ് ഡ്രൈവർ (നിങ്ങളുടെ കാർ ഓടിക്കാൻ)',
    tagline: 'Police clearance (PCC) checked drivers for city, hospital & outstation.',
    malayalamTagline: 'പോലീസ് ക്ലിയറൻസ് പരിശോധിച്ച ഡ്രൈവർമാർ. ഹോസ്പിറ്റൽ, ശബരിമല, യാത്രകൾക്ക്.',
    badge: 'PCC Checked Pro',
    icon: 'UserCheck',
    imageUrl: 'https://images.unsplash.com/photo-1449965408869-eaa3f722e40d?w=600&auto=format&fit=crop&q=80',
    eta: '25 mins',
    isInstant: true,
    priceType: 'base_plus_hourly',
    basePrice: 250,
    baseHours: 2,
    extraPricePerHour: 80,
    nightAllowance: 150,
    allowancePolicy: '100% kept by driver (Zero platform commission on return bus fare/batta)',
    priceRangeNotice: '₹250 for first 2 hours + ₹80/hr. No surprise surge pricing.',
    features: [
      'Police Clearance Certificate (PCC) checked by Fixily',
      'Minimum 3+ years active LMV driving experience',
      'Hospital visits, Sabarimala pilgrimage, airport runs',
      'Return bus fare & meal allowance kept 100% by driver'
    ],
    rating: 4.9,
    reviewsCount: 42
  },

  // 3. Electrical Services (Core)
  {
    id: 'electrician-consultation',
    phase: 1,
    category: 'Electrical Services',
    title: 'Electrician Consultation & Inverter Wiring',
    malayalamTitle: 'ഇലക്ട്രീഷ്യൻ & ഇൻവെർട്ടർ വയറിംഗ്',
    tagline: 'Monsoon short circuits, MCB trips, inverter setup & switchboard fixes.',
    malayalamTagline: 'ഷോർട്ട് സർക്യൂട്ട്, ഇൻവെർട്ടർ തകരാറുകൾ, സ്വിച്ച്ബോർഡ് റിപ്പയർ.',
    badge: 'Emergency Electrician',
    icon: 'Zap',
    imageUrl: 'https://images.unsplash.com/photo-1621905251189-08b45d6a269e?w=600&auto=format&fit=crop&q=80',
    eta: '30 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 149,
    priceRangeNotice: '₹149 visiting inspection fee (waived if repair is undertaken). Typical fixes: ₹250 - ₹550.',
    sparePartsNotice: 'Wires and MCB switches provided at hardware store MRP.',
    features: ['30-minute rapid arrival', 'Short circuit & monsoon earth leakage check', 'Inverter battery setup & MCB rewiring'],
    rating: 4.8,
    reviewsCount: 29
  },

  // 4. Plumbing & Water Management (Core)
  {
    id: 'plumber-consultation',
    phase: 1,
    category: 'Plumbing & Water Management',
    title: 'Plumber Consultation & Motor Pump Repair',
    malayalamTitle: 'പ്ലംബർ സർവീസും മോട്ടോർ പമ്പ് റിപ്പയറും',
    tagline: 'Water pump troubleshooting, pipeline leaks, taps & sanitaryware.',
    malayalamTagline: 'പമ്പ് മോട്ടോർ തകരാറുകൾ, പൈപ്പ് ലീക്ക്, ടാപ്പുകൾ, ഫ്ലഷ് ടാങ്ക്.',
    badge: 'Urgent Plumber',
    icon: 'Wrench',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    eta: '35 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 149,
    priceRangeNotice: '₹149 inspection fee. Estimated labor range: ₹200 - ₹500 depending on leakage depth.',
    sparePartsNotice: 'Pipes, valves & sealants charged on actual store bill.',
    features: ['Water pump capacitor & motor inspection', 'Concealed leak detection & tap washer fix', 'Sanitaryware & shower pressure check'],
    rating: 4.7,
    reviewsCount: 31
  },

  // 5. Appliance Care & Servicing (Core - Highly Demanded in Kerala)
  {
    id: 'appliance-care',
    phase: 1,
    category: 'Appliance Care & Servicing',
    title: 'AC Foam Jet Cleaning & Appliance Care',
    malayalamTitle: 'എസി ഫോം ജെറ്റ് സർവീസും അപ്ലയൻസ് റിപ്പയറും',
    tagline: 'High-pressure foam jet AC service, gas leak fix & washing machine repairs.',
    malayalamTagline: 'എസി സർവീസ്, ഗ്യാസ് ലീക്ക് റിപ്പയർ, വാഷിംഗ് മെഷീൻ തകരാറുകൾ.',
    badge: 'Cooling & Machine Care',
    icon: 'Cpu',
    imageUrl: 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: true,
    priceType: 'tiered',
    tiers: [
      { name: 'Split AC High-Pressure Foam Jet Clean', price: 499, duration: '45 mins' },
      { name: 'Split AC Deep Clean + Gas Pressure Check', price: 799, duration: '60 mins' },
      { name: 'Washing Machine Drum & Motor Diagnostic', price: 299, duration: '30 mins' }
    ],
    priceRangeNotice: 'Fixed upfront tier pricing. Diagnostic fee waived if repair is approved.',
    sparePartsNotice: 'Original compressor capacitor & coolant gas at transparent rates.',
    features: ['High-PSI indoor & outdoor foam jet wash', 'Cooling temperature delta measurement', 'Anti-fungal coil sanitization'],
    rating: 4.9,
    reviewsCount: 46
  },

  // 6. Vehicle Care (Core)
  {
    id: 'car-foam-wash',
    phase: 1,
    category: 'Vehicle Care',
    title: 'Doorstep Snow Foam Wash & Detailing',
    malayalamTitle: 'ഡോർസ്റ്റെപ്പ് കാർ ഫോം വാഷ്',
    tagline: 'High-pressure snow foam jet wash at your home driveway.',
    malayalamTagline: 'വീട്ടുമുറ്റത്തെത്തി പ്രഷർ ജെറ്റ് ഫോം വാഷ് ചെയ്യുന്നു.',
    badge: 'Doorstep Wash',
    icon: 'Car',
    imageUrl: 'https://images.unsplash.com/photo-1520340356584-f9917d1eea6f?w=600&auto=format&fit=crop&q=80',
    eta: '30 mins',
    isInstant: true,
    priceType: 'tiered',
    tiers: [
      { name: 'Hatchback (Swift, Tiago, i10)', price: 499, duration: '45 mins' },
      { name: 'Sedan / Compact SUV (City, Brezza, Creta)', price: 649, duration: '60 mins' },
      { name: 'Full SUV / MPV (Innova, Harrier, Fortuner)', price: 799, duration: '75 mins' }
    ],
    priceRangeNotice: 'Fixed pricing by vehicle size. Includes water suction vacuuming.',
    features: ['pH-neutral snow foam wash', 'Underbody mud rinse & tyre dressing', 'Interior vacuum & dashboard polish'],
    rating: 4.8,
    reviewsCount: 27
  },

  // 7. Overhead Water Tank & Well Cleaning (Kerala Specific Essential - Item 10)
  {
    id: 'water-tank-cleaning',
    phase: 1,
    category: 'Water Tank Cleaning',
    title: 'Overhead Water Tank & Sump Sanitization',
    malayalamTitle: 'വാട്ടർ ടാങ്ക് & കിണർ ഡീപ് ക്ലീനിംഗ്',
    tagline: 'Algae de-sludging, UV pressure wash & eco-friendly bleaching powder disinfection.',
    malayalamTagline: 'പായൽ നീക്കം ചെയ്യൽ, പ്രഷർ വാഷ്, അണുനശീകരണം.',
    badge: 'Kerala Seasonal Essential',
    icon: 'Droplet',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: false,
    priceType: 'tiered',
    tiers: [
      { name: '500L - 1000L Overhead Tank Clean', price: 699, duration: '60 mins' },
      { name: '2000L Overhead Tank or Ground Sump', price: 1199, duration: '90 mins' },
      { name: 'Open Well Sludge Removal & Chlorination', price: 1799, duration: '2.5 hrs' }
    ],
    priceRangeNotice: 'Fixed rate by tank capacity. Certified clean water assurance.',
    features: ['High-PSI sludge extraction', 'Food-grade potassium permanganate treatment', 'Anti-bacterial wall scrubbing'],
    rating: 4.9,
    reviewsCount: 19
  },

  // 8. Pest Control & Termite Care (Kerala Monsoon Essential - Item 10)
  {
    id: 'pest-control',
    phase: 1,
    category: 'Pest Control',
    title: 'Monsoon Pest Control & Termite Treatment',
    malayalamTitle: 'കീട നിയന്ത്രണവും ചിതൽ നശീകരണവും',
    tagline: 'Odorless cockroach gel, termite woodwork injection & mosquito barrier.',
    malayalamTagline: 'പാറ്റ, ചിതൽ, കൊതുക് തുടങ്ങിയവയ്ക്കെതിരെ സുരക്ഷിത ചികിത്സ.',
    badge: 'Seasonal Care',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    eta: '60 mins',
    isInstant: false,
    priceType: 'tiered',
    tiers: [
      { name: '1-2 BHK Odorless Cockroach & Ant Gel', price: 799, duration: '45 mins' },
      { name: '3-4 BHK Full Villa Pest Protection', price: 1399, duration: '75 mins' },
      { name: 'Doorframe & Woodwork Termite Drilling', price: 1899, duration: '2 hrs' }
    ],
    priceRangeNotice: 'Fixed pricing with 90-day re-service warranty.',
    features: ['Odorless Bayer eco-friendly chemicals', 'Child & pet safe gel baiting', '90-day free re-treatment warranty'],
    rating: 4.8,
    reviewsCount: 14
  },

  // 9. Deep Cleaning & Housekeeping (Other Works)
  {
    id: 'deep-cleaning',
    phase: 1,
    category: 'Deep Cleaning & Housekeeping',
    title: 'Full House Deep Cleaning & Housekeeping',
    malayalamTitle: 'വീട് മുഴുവൻ ഡീപ് ക്ലീനിംഗ്',
    tagline: 'Floor scrubbing, kitchen chimney degrease & bathroom scale removal.',
    malayalamTagline: 'ടൈൽസ് സ്ക്രബ്ബിംഗ്, കിച്ചൺ, ബാത്ത്റൂം ഡീപ് ക്ലീനിംഗ്.',
    badge: 'Home Hygiene',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1581578731548-c64695cc6952?w=600&auto=format&fit=crop&q=80',
    eta: '60 mins',
    isInstant: false,
    priceType: 'tiered',
    tiers: [
      { name: '1-2 BHK Apartment Deep Clean', price: 1299, duration: '3 hrs' },
      { name: '3-4 BHK Villa Deep Clean', price: 2499, duration: '5 hrs' }
    ],
    priceRangeNotice: 'All cleaning chemicals and equipment brought by team.',
    features: ['Single-use eco-friendly solutions', 'Bathroom hard-water tile scrubbing', 'Window glass & furniture dusting'],
    rating: 4.7,
    reviewsCount: 23
  },

  // 10. Monsoon Moss & Interlock Pressure Wash (Kerala Specific Essential)
  {
    id: 'paving-pressure-wash',
    phase: 2,
    category: 'Outdoor & Property Maintenance',
    title: 'Compound Wall & Interlock Pressure Wash',
    malayalamTitle: 'മുറ്റത്തെ ഇന്റർലോക്ക് പ്രഷർ വാഷ്',
    tagline: 'High-PSI water jet cleaning for slippery mossy paving tiles & gates.',
    malayalamTagline: 'മഴക്കാലത്തെ പായൽ മാറ്റാനും മുറ്റം വൃത്തിയാക്കാനും.',
    badge: 'Monsoon Paving Care',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: false,
    priceType: 'quote',
    estPrice: 1299,
    priceRangeNotice: 'Estimated ₹1,000 - ₹1,800 based on driveway square footage.',
    features: ['High-PSI moss & algae removal', 'Slip prevention for elders', 'Compound wall brightening'],
    rating: 4.9,
    reviewsCount: 16
  },

  // 11. Carpenter & Locksmith (Other Works)
  {
    id: 'carpenter-services',
    phase: 1,
    category: 'Carpenter & Locksmith',
    title: 'Doorstep Carpenter & Lock Replacement',
    malayalamTitle: 'കാർപെന്ററും ഡോർ ലോക്ക് മാറ്റലും',
    tagline: 'Door hinge fixes, furniture assembly, Godrej locks & modular kitchen care.',
    malayalamTagline: 'വാതിൽ ലോക്ക് മാറ്റൽ, ഫർണിച്ചർ റിപ്പയർ, കിച്ചൺ കട്ടിള അറ്റകുറ്റപ്പണി.',
    badge: 'Woodwork Care',
    icon: 'Hammer',
    imageUrl: 'https://images.unsplash.com/photo-1601058268499-e52658b8bb88?w=600&auto=format&fit=crop&q=80',
    eta: '30 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 149,
    priceRangeNotice: '₹149 visiting charge. Labor estimates: ₹200 - ₹500.',
    features: ['Door lock & handle replacement', 'Modular kitchen hinge realignment', 'Furniture joint tightening'],
    rating: 4.8,
    reviewsCount: 22
  },

  // 12. Painter & Waterproofing (Other Works)
  {
    id: 'painter-waterproofing',
    phase: 2,
    category: 'Painter & Waterproofing',
    title: 'Wall Dampness Treatment & Roof Waterproofing',
    malayalamTitle: 'റൂഫ് വാട്ടർപ്രൂഫിംഗും പെയിന്റിംഗും',
    tagline: 'Monsoon moisture barrier, wall putty touchup & terrace sealants.',
    malayalamTagline: 'മഴവെള്ള ചോർച്ച തടയൽ, വാൾ പുട്ടി, വാട്ടർപ്രൂഫ് പെയിന്റിംഗ്.',
    badge: 'Waterproofing Care',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1589939705384-5185137a7f0f?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: false,
    priceType: 'quote',
    estPrice: 499,
    priceRangeNotice: 'Free inspection & square-foot estimate before purchase.',
    features: ['Wall dampness seepage inspection', 'Dr. Fixit polymer coat application', 'Terrace leak sealant'],
    rating: 4.7,
    reviewsCount: 15
  },

  // 13. CCTV & Smart Security (Other Works)
  {
    id: 'cctv-security',
    phase: 1,
    category: 'CCTV & Smart Security',
    title: 'CCTV Installation & Smart Video Doorbell',
    malayalamTitle: 'സിസിടിവി ക്യാമറ ഇൻസ്റ്റാളേഷൻ',
    tagline: 'IP camera setup, mobile live view configuration & WiFi door locks.',
    malayalamTagline: 'ക്യാമറ ഫിറ്റിംഗ്, മൊബൈൽ ലൈവ് വ്യൂ സെറ്റപ്പ്, സ്മാർട്ട് ലോക്കുകൾ.',
    badge: 'Security Care',
    icon: 'ShieldCheck',
    imageUrl: 'https://images.unsplash.com/photo-1557597774-9d273605dfa9?w=600&auto=format&fit=crop&q=80',
    eta: '35 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 299,
    priceRangeNotice: '₹299 diagnostic & cabling check. Hardware charged at dealer rate.',
    features: ['WiFi IP camera installation', 'Phone remote live feed setup', 'Night vision calibration'],
    rating: 4.9,
    reviewsCount: 20
  },

  // 14. Vacant Home Caretaking (Formerly NRI - Refactored per Requirement 14 to avoid burglary profiling)
  {
    id: 'vacant-home-care',
    phase: 2,
    category: 'Vacant Property Stewardship',
    title: 'Vacant Home Maintenance & Caretaking',
    malayalamTitle: 'പൂട്ടിക്കിടക്കുന്ന വീടുകളുടെ പരിചരണം',
    tagline: 'Bi-weekly ventilation, electrical check & video inspection for closed homes.',
    malayalamTagline: 'വീട് വായുസഞ്ചാരത്തിനായി തുറക്കൽ, ഇലക്ട്രിക്കൽ ചെക്കിംഗ്, വീഡിയോ റിപ്പോർട്ട്.',
    badge: 'Home Stewardship',
    icon: 'ShieldCheck',
    imageUrl: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=600&auto=format&fit=crop&q=80',
    eta: 'Scheduled',
    isInstant: false,
    priceType: 'subscription',
    estPrice: 1999,
    priceRangeNotice: 'Monthly subscription. Confidential handling with zero public tagging.',
    features: ['Bi-weekly moisture & pest check', 'Water motor dry-run check', 'Encrypted HD video inspection report'],
    rating: 4.9,
    reviewsCount: 11
  },

  // 15. Personal Grooming (Other Works)
  {
    id: 'doorstep-salon-makeup',
    phase: 2,
    category: 'Personal Grooming & At-Home Wellness',
    title: 'Doorstep Salon & Wellness for Women',
    malayalamTitle: 'ഡോർസ്റ്റെപ്പ് സലൂൺ & വെൽനസ്',
    tagline: 'Certified beauticians at home with sanitized single-use kits.',
    malayalamTagline: 'സർട്ടിഫൈഡ് ബ്യൂട്ടീഷ്യൻമാർ വീട്ടിലെത്തി ചെയ്യുന്ന സലൂൺ സേവനങ്ങൾ.',
    badge: 'At-Home Spa',
    icon: 'Scissors',
    imageUrl: 'https://images.unsplash.com/photo-1560066984-138dadb4c035?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: false,
    priceType: 'quote',
    estPrice: 699,
    priceRangeNotice: 'Transparent package rates with sanitized disposable towels.',
    features: ['Single-use sealed hygiene kits', 'Facials, waxing, pedicure & hair styling', 'Certified female beauticians'],
    rating: 4.9,
    reviewsCount: 28
  },

  // 16. Rental Cars & Taxi (Other Works)
  {
    id: 'rental-cars-taxi',
    phase: 1,
    category: 'Rental Cars & Taxi Services',
    title: 'Chauffeur Airport Transfer & Outstation Taxi',
    malayalamTitle: 'എയർപോർട്ട് ടാക്സിയും ഔട്ട്സ്റ്റേഷൻ സർവീസും',
    tagline: 'Clean sanitized AC sedans and Innovas with verified chauffeur.',
    malayalamTagline: 'നെടുമ്പാശ്ശേരി എയർപോർട്ട് ട്രിപ്പുകൾ, ദീർഘദൂര ടാക്സി.',
    badge: 'Travel Care',
    icon: 'Navigation',
    imageUrl: 'https://images.unsplash.com/photo-1549399542-7e3f8b79c341?w=600&auto=format&fit=crop&q=80',
    eta: '20 mins',
    isInstant: true,
    priceType: 'tiered',
    tiers: [
      { name: 'Kochi Airport Transfer Sedan (Etios/Dzire)', price: 899, duration: '60 mins' },
      { name: '12-Hour Outstation Innova Taxi', price: 2399, duration: '12 hrs' }
    ],
    priceRangeNotice: 'Fixed fares including toll guidance. Zero hidden driver fees.',
    features: ['PCC checked professional chauffeurs', 'Clean sanitized AC vehicles', 'Luggage assistance'],
    rating: 4.8,
    reviewsCount: 35
  },

  // 17. Device Repair (Other Works)
  {
    id: 'device-repair',
    phase: 1,
    category: 'Laptop and Mobile Phone Repair',
    title: 'Doorstep Mobile & Laptop Repair',
    malayalamTitle: 'മൊബൈൽ & ലാപ്ടോപ്പ് റിപ്പയർ',
    tagline: 'Screen replacement, battery swap & motherboard diagnostics at home.',
    malayalamTagline: 'ഡിസ്പ്ലേ മാറ്റൽ, ബാറ്ററി റീപ്ലേസ്മെന്റ്, ലാപ്ടോപ്പ് സർവീസ്.',
    badge: 'Tech Repair',
    icon: 'Smartphone',
    imageUrl: 'https://images.unsplash.com/photo-1591799264318-7e6ef8ddb7ea?w=600&auto=format&fit=crop&q=80',
    eta: '30 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 199,
    priceRangeNotice: '₹199 diagnostic fee. 3-month replacement warranty on OEM screens.',
    features: ['Doorstep screen replacement in 30 mins', 'OEM batteries with warranty', 'Full data confidentiality assurance'],
    rating: 4.8,
    reviewsCount: 24
  },

  // 18. Emergency Water Tanker (Other Works)
  {
    id: 'water-supply-tanker',
    phase: 1,
    category: 'Water Supply',
    title: 'Emergency Drinking Water Tanker Delivery',
    malayalamTitle: 'കുടിവെള്ള ടാങ്കർ ഡെലിവറി',
    tagline: '5,000L / 10,000L lab-tested purified drinking water for apartments & homes.',
    malayalamTagline: 'ലാബ് ടെസ്റ്റ് ചെയ്ത ശുദ്ധമായ കുടിവെള്ളം വീടുകളിലും ഫ്ലാറ്റുകളിലും എത്തിക്കുന്നു.',
    badge: 'Water Supply',
    icon: 'Droplet',
    imageUrl: 'https://images.unsplash.com/photo-1548839140-29a749e1bc4e?w=600&auto=format&fit=crop&q=80',
    eta: '40 mins',
    isInstant: true,
    priceType: 'tiered',
    tiers: [
      { name: '5,000 Liters Purified Water Tanker', price: 899, duration: '45 mins' },
      { name: '10,000 Liters Purified Water Tanker', price: 1599, duration: '60 mins' }
    ],
    priceRangeNotice: 'Fixed price by volume delivered with high-flow pump hose.',
    features: ['Lab-tested potable drinking water', 'High-pressure electric pump included', '24/7 delivery dispatch across Kochi'],
    rating: 4.9,
    reviewsCount: 39
  },

  // 19. Worker-Added Custom Works (Marked with isNewService / realistic counts)
  {
    id: 'solar-inverter-ups-care',
    phase: 1,
    category: 'Other Works',
    title: 'Solar Inverter & Rooftop UPS Technician',
    malayalamTitle: 'സോളാർ ഇൻവെർട്ടർ & യു.പി.എസ് ടെക്നീഷ്യൻ',
    tagline: 'Solar rooftop inverter setup, battery desulfation, UPS backup diagnostics.',
    malayalamTagline: 'സോളാർ പാനൽ വയറിംഗ്, ഇൻവെർട്ടർ ബാറ്ററി ടെസ്റ്റിംഗ്.',
    badge: 'Custom Trade',
    icon: 'Sun',
    imageUrl: 'https://images.unsplash.com/photo-1509391365360-2e959784a276?w=600&auto=format&fit=crop&q=80',
    eta: '35 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 299,
    priceRangeNotice: '₹299 diagnostic inspection. Estimates provided before repairs.',
    features: ['Rooftop solar DC/AC cabling check', 'Battery specific gravity testing', 'Pure sine wave inverter diagnostics'],
    rating: 4.9,
    reviewsCount: 12,
    isNewService: false,
    createdByPartnerId: 'p-106',
    createdByPartnerName: 'Sunil Prasad'
  },
  {
    id: 'gardening-lawn-care',
    phase: 1,
    category: 'Other Works',
    title: 'Garden Landscaping & Plant Caretaker',
    malayalamTitle: 'ഗാർഡൻ ലാൻഡ്‌സ്‌കേപ്പിംഗും ഗാർഡനറും',
    tagline: 'Lawn mowing, organic de-weeding, hedge trimming & plant potting.',
    malayalamTagline: 'പുൽത്തകിടി വെട്ടി ഒരുക്കൽ, ചെടികൾ നടൽ, ഗാർഡൻ പരിപാലനം.',
    badge: 'Custom Trade',
    icon: 'Sparkles',
    imageUrl: 'https://images.unsplash.com/photo-1558904541-efa8c4a08931?w=600&auto=format&fit=crop&q=80',
    eta: '45 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 349,
    priceRangeNotice: '₹349 visiting charge. Equipment provided by pro.',
    features: ['Motorized hedge & bush trimming', 'Organic pest repellent spray', 'Lawn edging and garden cleanup'],
    rating: 0,
    reviewsCount: 0,
    isNewService: true
  },
  {
    id: 'smart-iot-automation',
    phase: 1,
    category: 'Other Works',
    title: 'Smart Home IoT & Sensor Automation Specialist',
    malayalamTitle: 'സ്മാർട്ട് ഹോം ഓട്ടോമേഷൻ വിദഗ്ദ്ധൻ',
    tagline: 'Smart switch retrofit, WiFi touch switches, mobile app & Alexa controls.',
    malayalamTagline: 'സ്മാർട്ട് സ്വിച്ചുകൾ, വൈഫൈ ലൈറ്റ്, മൊബൈൽ കൺട്രോൾ സെറ്റപ്പ്.',
    badge: 'Custom Trade',
    icon: 'Cpu',
    imageUrl: 'https://images.unsplash.com/photo-1558002038-1055907df827?w=600&auto=format&fit=crop&q=80',
    eta: '30 mins',
    isInstant: true,
    priceType: 'flat_diagnostic',
    diagnosticFee: 399,
    priceRangeNotice: '₹399 diagnostic & WiFi calibration.',
    features: ['WiFi smart switchboard retrofit', 'Google Home / Alexa voice configuration', 'Smart lock door calibration'],
    rating: 0,
    reviewsCount: 0,
    isNewService: true
  }
];

export const MOCK_PARTNERS: GigPartner[] = [
  {
    id: 'p-101',
    name: 'Anand Kumar',
    phone: '+91 98470 11223',
    role: 'Freelance Acting Driver & Mechanic',
    rating: 4.9,
    jobsCompleted: 34,
    reviewsCount: 18,
    isOnline: true,
    isTopRated: true,
    hourlyRateMultiplier: 1.25,
    damageLiabilityAgreed: true,
    currentLocation: { name: 'Kakkanad Metro Station', lat: 10.0165, lng: 76.3425 },
    availableSlots: [
      'Today, 02:00 PM - 04:00 PM',
      'Today, 05:00 PM - 07:00 PM',
      'Tomorrow, 09:00 AM - 12:00 PM',
      'Tomorrow, 02:00 PM - 05:00 PM'
    ],
    targetAchievement: {
      weeklyTarget: 15,
      completedJobsThisWeek: 12,
      bonusAmount: 1500,
      isBonusUnlocked: false,
      tierLevel: 'GOLD_TOP_RATED' as const,
      commissionDiscountPercent: 5
    },
    reviews: [
      {
        id: 'rev-1',
        customerName: 'Mathew Thomas',
        rating: 5,
        comment: 'Extremely polite driver and expert mechanic! Jumpstarted my car within 15 minutes with zero scratches.',
        serviceTitle: 'Doorstep Car & Bike Mechanic',
        createdAt: '2026-10-02'
      },
      {
        id: 'rev-2',
        customerName: 'Sneha George',
        rating: 5,
        comment: 'Drove my family to Nedumbassery Airport during peak rain. Very safe driver, PCC documents checked.',
        serviceTitle: 'Freelance Acting Driver',
        createdAt: '2026-09-28'
      }
    ],
    kyc: {
      aadhaarVerified: true,
      aadhaarNumber: '•••• •••• 9043',
      govtIdType: 'AADHAAR' as const,
      govtIdNumber: '•••• •••• 9043',
      govtIdFileAttached: true,
      dlNumber: 'KL-07-2015-0049281',
      pccStatus: 'VERIFIED' as const,
      pccRefNo: 'KL-PCC-2024-88912',
      pccExpiry: '2027-04-15',
      pccCheckedByFixily: true,
      bankVerified: true,
      damageLiabilityAgreed: true,
      liabilityAgreementTimestamp: '2026-04-15T09:30:00Z'
    },
    vehicle: 'LMV Driver & Mechanic Toolkit',
    walletBalance: 2840,
    escrowBalance: 350,
    withdrawableBalance: 2490,
    todaysEarnings: 1250,
    photoUrl: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80',
    aadhaarMasked: '•••• •••• 9043'
  },
  {
    id: 'p-102',
    name: 'Suresh Babu',
    phone: '+91 98471 22334',
    role: 'Electrician & Inverter/Wiring Technician',
    rating: 4.8,
    jobsCompleted: 28,
    reviewsCount: 15,
    isOnline: true,
    isTopRated: true,
    hourlyRateMultiplier: 1.20,
    damageLiabilityAgreed: true,
    currentLocation: { name: 'Edappally Toll', lat: 10.0236, lng: 76.3115 },
    availableSlots: [
      'Today, 03:30 PM - 06:00 PM',
      'Tomorrow, 10:00 AM - 01:00 PM',
      'Tomorrow, 03:00 PM - 06:00 PM'
    ],
    targetAchievement: {
      weeklyTarget: 15,
      completedJobsThisWeek: 9,
      bonusAmount: 1500,
      isBonusUnlocked: false,
      tierLevel: 'SILVER_PRO' as const,
      commissionDiscountPercent: 4
    },
    reviews: [
      {
        id: 'rev-3',
        customerName: 'Arun Varma',
        rating: 5,
        comment: 'Diagnosed our main circuit trip problem in 10 mins. Very knowledgeable and clean work.',
        serviceTitle: 'Electrician Consultation & Wiring',
        createdAt: '2026-10-01'
      }
    ],
    kyc: {
      aadhaarVerified: true,
      govtIdType: 'AADHAAR' as const,
      govtIdNumber: '•••• •••• 4419',
      govtIdFileAttached: true,
      pccStatus: 'VERIFIED' as const,
      pccRefNo: 'KL-PCC-2024-55120',
      pccExpiry: '2027-06-20',
      pccCheckedByFixily: true,
      bankVerified: true,
      damageLiabilityAgreed: true,
      liabilityAgreementTimestamp: '2026-06-20T10:00:00Z'
    },
    vehicle: 'Electrical Pro Toolbag & Testing Meter',
    walletBalance: 1950,
    escrowBalance: 250,
    withdrawableBalance: 1700,
    todaysEarnings: 850,
    photoUrl: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80',
    aadhaarMasked: '•••• •••• 4419'
  },
  {
    id: 'p-106',
    name: 'Sunil Prasad',
    phone: '+91 98475 66778',
    role: 'Solar Inverter & Smart Home IoT Specialist',
    rating: 4.9,
    jobsCompleted: 24,
    reviewsCount: 12,
    isOnline: true,
    isTopRated: true,
    hourlyRateMultiplier: 1.25,
    damageLiabilityAgreed: true,
    currentLocation: { name: 'Kalamassery Startup Village', lat: 10.0450, lng: 76.3250 },
    availableSlots: [
      'Today, 02:00 PM - 04:30 PM',
      'Today, 05:00 PM - 07:30 PM',
      'Tomorrow, 09:30 AM - 12:30 PM',
      'Tomorrow, 02:30 PM - 05:30 PM'
    ],
    targetAchievement: {
      weeklyTarget: 15,
      completedJobsThisWeek: 11,
      bonusAmount: 1500,
      isBonusUnlocked: false,
      tierLevel: 'GOLD_TOP_RATED' as const,
      commissionDiscountPercent: 5
    },
    reviews: [
      {
        id: 'rev-7',
        customerName: 'George Joseph',
        rating: 5,
        comment: 'Sunil installed our solar rooftop backup and automated WiFi lights perfectly. Highly recommended freelancer!',
        serviceTitle: 'Solar Inverter & Rooftop UPS Technician',
        createdAt: '2026-10-03'
      }
    ],
    kyc: {
      aadhaarVerified: true,
      govtIdType: 'AADHAAR' as const,
      govtIdNumber: '•••• •••• 0044',
      govtIdFileAttached: true,
      pccStatus: 'VERIFIED' as const,
      pccRefNo: 'KL-PCC-2024-66381',
      pccExpiry: '2027-11-20',
      pccCheckedByFixily: true,
      bankVerified: true,
      damageLiabilityAgreed: true,
      liabilityAgreementTimestamp: '2026-05-15T10:00:00Z'
    },
    vehicle: 'Solar & Smart Home Toolkit with Multimeter',
    walletBalance: 2900,
    escrowBalance: 300,
    withdrawableBalance: 2600,
    todaysEarnings: 1100,
    photoUrl: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=150&auto=format&fit=crop&q=80',
    aadhaarMasked: '•••• •••• 0044',
    customProfessions: [
      {
        id: 'cp-1',
        title: 'Solar Inverter & Rooftop UPS Technician',
        category: 'Other Works',
        tagline: 'Solar rooftop inverter setup, battery desulfation, UPS backup troubleshooting.',
        priceType: 'flat_diagnostic' as const,
        price: 299,
        eta: '35 mins',
        features: ['Rooftop solar DC/AC cabling check', 'Battery specific gravity testing', 'Pure sine wave inverter diagnostics'],
        equipment: 'Carrying digital multimeter, solar crimping pliers & tester',
        isActive: true
      }
    ]
  }
];

export const MOCK_JOBS: BookingJob[] = [
  {
    id: 'FIX-8849',
    serviceId: 'doorstep-mechanic',
    serviceTitle: 'Doorstep Car & Bike Mechanic',
    tierName: 'Engine Diagnostic & Battery Jumpstart',
    customerName: 'Mathew Thomas',
    customerPhone: '+91 98950 12345',
    location: {
      address: 'Villa 14, Asset Homes Enclave, Kakkanad',
      microMarket: 'Kakkanad',
      lat: 10.0175,
      lng: 76.3450
    },
    maskedAddress: 'Kakkanad near Asset Homes Enclave',
    scheduledTime: 'Today, 03:30 PM',
    targetDate: '2026-10-05',
    targetTimeSlot: '03:00 PM - 05:00 PM',
    preferredPartnerId: 'p-101',
    preferredPartnerName: 'Anand Kumar',
    status: 'IN_PROGRESS',
    assignedPartnerId: 'p-101',
    assignedPartnerName: 'Anand Kumar',
    assignedPartnerPhone: '+91 98470 11223',
    completionOtp: '4892',
    startOtp: '2214',
    pricing: {
      baseFare: 299,
      platformCommission: 45,
      partnerEarnings: 254,
      convenienceFee: 35,
      microInsurance: 19,
      totalPaid: 353
    },
    paymentStatus: 'PAID_UPI',
    paymentMethod: 'UPI',
    vehicleDetails: 'Honda City (KL-07-CC-4091)',
    preServiceChecklist: {
      completedAt: '2026-10-05T10:15:00Z',
      photos: [
        { angle: 'Front Engine Bay', url: 'https://images.unsplash.com/photo-1486006920555-c77dce18193b?w=400', notes: 'Alternator cables intact. Battery voltage low.' }
      ]
    },
    invoiceId: 'INV-KL-2026-8849',
    payoutHoldUntil: '2026-10-06T15:30:00Z',
    payoutStatus: 'IN_ESCROW',
    createdAt: '2026-10-05T09:45:00Z'
  },
  {
    id: 'FIX-8850',
    serviceId: 'acting-driver',
    serviceTitle: 'Freelance Acting Driver ("Drive My Car")',
    tierName: '2-Hour City Drive & Hospital Visit',
    customerName: 'Sneha George',
    customerPhone: '+91 98951 88990',
    location: {
      address: 'Skyline Ivy League, Edappally Toll',
      microMarket: 'Edappally',
      lat: 10.0261,
      lng: 76.3084
    },
    maskedAddress: 'Edappally near Toll Junction',
    scheduledTime: 'Tomorrow, 09:00 AM',
    targetDate: '2026-10-06',
    targetTimeSlot: 'Morning: 09:00 AM - 12:00 PM',
    preferredPartnerId: 'p-101',
    preferredPartnerName: 'Anand Kumar',
    status: 'PROVIDER_ASSIGNED',
    assignedPartnerId: 'p-101',
    assignedPartnerName: 'Anand Kumar',
    assignedPartnerPhone: '+91 98470 11223',
    completionOtp: '9134',
    startOtp: '3381',
    pricing: {
      baseFare: 250,
      platformCommission: 35,
      partnerEarnings: 215,
      convenienceFee: 35,
      microInsurance: 19,
      totalPaid: 304
    },
    paymentStatus: 'PAY_ON_SERVICE',
    paymentMethod: 'PAY_AFTER_SERVICE',
    vehicleDetails: 'Hyundai Creta (KL-07-BZ-5511)',
    invoiceId: 'INV-KL-2026-8850',
    createdAt: '2026-10-05T12:00:00Z'
  }
];
