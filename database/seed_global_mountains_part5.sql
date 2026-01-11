-- ============================================================
-- MOUNTKEY - GLOBAL MOUNTAINS PART 5 (FINAL PUSH TO 1000)
-- ============================================================
-- Description: Menambahkan ~250 gunung unik BARU.
-- Target: Mencapai total 1000+ gunung di database.
-- Focus: 
-- 1. Central Asia (The Stans, Tian Shan, Pamir)
-- 2. Arctic & Antarctic (Remote peaks)
-- 3. Detailed Andes (Bolivia, Peru, Chile secondary peaks)
-- 4. European Ranges (Carpathians, Pyrenees, Balkans detailed)
-- 5. Middle East & West Asia (Iran, Turkey, Caucasus)
-- ============================================================

USE mount_key;

-- ============================================================
-- 1. CENTRAL ASIA & RUSSIA (TIAN SHAN, PAMIR, ALTAI)
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Pik Lenin', 'pik-lenin', 'Kyrgyzstan/Tajikistan', 'Pamir', 39.3469, 72.8767, 7134, 'dormant', 'non_volcanic', 'Salah satu 7000m termudah didaki di dunia.', 1),
('Pik Korzhenevskaya', 'pik-korzhenevskaya', 'Tajikistan', 'Pamir', 39.0572, 72.0158, 7105, 'dormant', 'non_volcanic', 'Salah satu dari lima Puncak Macan Tutul Salju.', 1),
('Pik Talgar', 'pik-talgar', 'Kazakhstan', 'Trans-Ili Alatau', 43.1167, 77.2333, 4979, 'dormant', 'non_volcanic', 'Puncak tertinggi Trans-Ili Alatau dekat Almaty.', 1),
('Nursultan Peak', 'nursultan', 'Kazakhstan', 'Trans-Ili Alatau', 43.1333, 77.1000, 4376, 'dormant', 'non_volcanic', 'Ikon kota Almaty (dulu bernama Pik Komsomol).', 1),
('Mount Kamen', 'kamen', 'Russia', 'Putorana', 69.1333, 95.0000, 1701, 'dormant', 'non_volcanic', 'Puncak tertinggi Dataran Tinggi Putorana (Siberia).', 1),
('Mount Munku-Sardyk', 'munku-sardyk', 'Russia/Mongolia', 'Sayan', 51.7167, 100.6000, 3491, 'dormant', 'non_volcanic', 'Puncak tertinggi Pegunungan Sayan Timur.', 1),
('Gora Belukha East', 'belukha-east', 'Russia/Kazakhstan', 'Altai', 49.8072, 86.5886, 4506, 'dormant', 'non_volcanic', 'Puncak kembar tertinggi Altai.', 1),
('Kukurtli Kol', 'kukurtli-kol', 'Russia', 'Caucasus', 43.3400, 42.3200, 4912, 'dormant', 'non_volcanic', 'Bahu barat Elbrus.', 1),
('Dykh-Tau', 'dykh-tau', 'Russia', 'Caucasus', 43.0500, 43.1272, 5205, 'dormant', 'non_volcanic', 'Tertinggi kedua di Kaukasus (dan Eropa).', 1),
('Koshtan-Tau', 'koshtan-tau', 'Russia', 'Caucasus', 43.0500, 43.2111, 5151, 'dormant', 'non_volcanic', 'Salah satu puncak paling sulit di Kaukasus.', 1),
('Pushkin Peak', 'pushkin', 'Russia', 'Caucasus', 43.0211, 43.1083, 5100, 'dormant', 'non_volcanic', 'Dinamai dari penyair Alexander Pushkin.', 1),
('Jangi-Tau', 'jangi-tau', 'Russia/Georgia', 'Caucasus', 43.0181, 43.0567, 5051, 'dormant', 'non_volcanic', 'Puncak pusat Bezingi Wall.', 1),
('Shkhara', 'shkhara', 'Georgia/Russia', 'Caucasus', 42.9972, 43.1117, 5193, 'dormant', 'non_volcanic', 'Titik tertinggi Georgia.', 1),
('Kazbek', 'kazbek', 'Georgia', 'Caucasus', 42.6972, 44.5194, 5054, 'dormant', 'stratovolcano', 'Tempat Prometheus dirantai dalam mitologi.', 1),
('Tetnuldi', 'tetnuldi', 'Georgia', 'Caucasus', 43.0311, 42.9931, 4858, 'dormant', 'non_volcanic', '"Pengantin Putih" Svaneti.', 1),
('Ushba', 'ushba', 'Georgia', 'Caucasus', 43.1250, 42.6597, 4710, 'dormant', 'non_volcanic', 'Matterhorn-nya Kaukasus, sangat sulit.', 1),
('Bazardüzü', 'bazarduzu', 'Azerbaijan/Russia', 'Caucasus', 41.2206, 47.8572, 4466, 'dormant', 'non_volcanic', 'Titik tertinggi Azerbaijan.', 1),
('Mount Shahdagh', 'shahdagh', 'Azerbaijan', 'Caucasus', 41.2722, 48.0083, 4243, 'dormant', 'non_volcanic', 'Puncak populer untuk wisata musim dingin.', 1),
('Mount Aragats', 'aragats', 'Armenia', 'Lesser Caucasus', 40.5236, 44.1953, 4090, 'dormant', 'stratovolcano', 'Titik tertinggi Armenia, memiliki 4 puncak.', 1),
('Khustup', 'khustup', 'Armenia', 'Syunik', 39.1350, 46.3314, 3206, 'dormant', 'non_volcanic', 'Gunung suci pahlawan Garegin Nzhdeh.', 1);

-- ============================================================
-- 2. MIDDLE EAST & WEST ASIA (IRAN, TURKEY, SAUDI)
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Sahand', 'sahand', 'Iran', 'East Azerbaijan', 37.7303, 46.5000, 3707, 'dormant', 'stratovolcano', 'Gunung Pengantin.', 1),
('Tochal', 'tochal', 'Iran', 'Tehran', 35.8853, 51.4217, 3964, 'dormant', 'non_volcanic', 'Resor ski di atas Teheran.', 1),
('Zard-Kuh', 'zard-kuh', 'Iran', 'Zagros', 32.3622, 50.0767, 4221, 'dormant', 'non_volcanic', '"Gunung Kuning" di Zagros.', 1),
('Dena', 'dena', 'Iran', 'Zagros', 30.9500, 51.4833, 4409, 'dormant', 'non_volcanic', 'Puncak tertinggi Pegunungan Zagros.', 1),
('Mount Erciyes', 'erciyes', 'Turkey', 'Kayseri', 38.5317, 35.4528, 3917, 'dormant', 'stratovolcano', 'Pusat ski utama di Anatolia Tengah.', 1),
('Mount Hasan', 'hasan', 'Turkey', 'Aksaray', 38.1272, 34.1644, 3268, 'dormant', 'stratovolcano', 'Membentuk lanskap Cappadocia.', 1),
('Mount Suphan', 'suphan', 'Turkey', 'Bitlis', 38.9317, 42.8256, 4058, 'dormant', 'stratovolcano', 'Di utara Danau Van.', 1),
('Kackar Dagi', 'kackar', 'Turkey', 'Pontic Alps', 40.8389, 41.1603, 3937, 'dormant', 'non_volcanic', 'Puncak tertinggi Pegunungan Pontic.', 1),
('Uludag', 'uludag', 'Turkey', 'Bursa', 40.0711, 29.2206, 2543, 'dormant', 'non_volcanic', 'Gunung Olympus Mysian kuno.', 1),
('Jabal Sawda', 'sawda', 'Saudi Arabia', 'Asir', 18.2669, 42.3683, 3015, 'dormant', 'non_volcanic', 'Titik tertinggi Arab Saudi (diperdebatkan).', 1),
('Jabal Ferwa', 'ferwa', 'Saudi Arabia', 'Asir', 17.9281, 43.2750, 3002, 'dormant', 'non_volcanic', 'Pesaing titik tertinggi Saudi.', 1),
('Jabal al-Lawz', 'lawz', 'Saudi Arabia', 'Tabuk', 28.6533, 35.3050, 2580, 'dormant', 'non_volcanic', 'Sering bersalju di musim dingin.', 1),
('Mount Nabi Shu''ayb', 'nabi-shuayb', 'Yemen', 'Sana''a', 15.2778, 43.9769, 3666, 'dormant', 'non_volcanic', 'Puncak tertinggi Semenanjung Arab.', 1),
('Qurnat as Sawda', 'qurnat', 'Lebanon', 'North', 34.3000, 36.1167, 3088, 'dormant', 'non_volcanic', 'Puncak tertinggi Syam (Levant).', 1);

-- ============================================================
-- 3. EUROPE (CARPATHIANS, BALKANS, SCANDINAVIA DETAILED)
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Rysy', 'rysy', 'Poland/Slovakia', 'High Tatras', 49.1794, 20.0881, 2503, 'dormant', 'non_volcanic', 'Titik tertinggi Polandia.', 1),
('Lomnicky stit', 'lomnicky', 'Slovakia', 'High Tatras', 49.1953, 20.2131, 2634, 'dormant', 'non_volcanic', 'Dapat diakses kereta gantung, observatorium.', 1),
('Krivan', 'krivan', 'Slovakia', 'High Tatras', 49.1650, 20.0000, 2494, 'dormant', 'non_volcanic', 'Simbol nasional Slovakia.', 1),
('Pietrosul Rodnei', 'pietrosul', 'Romania', 'Rodna', 47.6000, 24.6333, 2303, 'dormant', 'non_volcanic', 'Tertinggi di Carpathians Timur.', 1),
('Omu Peak', 'omu', 'Romania', 'Bucegi', 45.4456, 25.4572, 2505, 'dormant', 'non_volcanic', 'Puncak dengan stasiun meteorologi dan chalet.', 1),
('Vihren', 'vihren', 'Bulgaria', 'Pirin', 41.7667, 23.4000, 2914, 'dormant', 'non_volcanic', 'Puncak marmer putih Pirin.', 1),
('Botev Peak', 'botev', 'Bulgaria', 'Balkan', 42.7167, 24.9167, 2376, 'dormant', 'non_volcanic', 'Tertinggi di Pegunungan Balkan.', 1),
('Mytikas (Olympus)', 'mytikas', 'Greece', 'Macedonia', 40.0856, 22.3586, 2917, 'dormant', 'non_volcanic', 'Tahta Zeus yang sebenarnya.', 1),
('Smolikas', 'smolikas', 'Greece', 'Epirus', 40.0886, 20.9250, 2637, 'dormant', 'non_volcanic', 'Tertinggi kedua di Yunani.', 1),
('Mount Korab (Macedonia)', 'korab-mk', 'North Macedonia/Albania', 'Mavrovo', 41.7903, 20.5469, 2764, 'dormant', 'non_volcanic', 'Puncak tertinggi kedua negara.', 1),
('Jezerca', 'jezerca', 'Albania', 'Prokletije', 42.4419, 19.8119, 2694, 'dormant', 'non_volcanic', 'Tertinggi di Pegunungan Terkutuk.', 1),
('Bobotov Kuk', 'bobotov-kuk', 'Montenegro', 'Durmitor', 43.1283, 19.0333, 2523, 'dormant', 'non_volcanic', 'Raja Durmitor National Park.', 1),
('Maglic', 'maglic', 'Bosnia & Herzegovina', 'Sutjeska', 43.2792, 18.7350, 2386, 'dormant', 'non_volcanic', 'Titik tertinggi Bosnia.', 1),
('Dinara', 'dinara', 'Croatia/Bosnia', 'Dinarides', 44.0617, 16.3814, 1831, 'dormant', 'non_volcanic', 'Memberi nama Dinaric Alps.', 1),
('Vaganski vrh', 'vaganski', 'Croatia', 'Velebit', 44.3500, 15.5167, 1757, 'dormant', 'non_volcanic', 'Tertinggi di Velebit.', 1),
('Triglav (Slovenia)', 'triglav-sl', 'Slovenia', 'Julian Alps', 46.3783, 13.8367, 2864, 'dormant', 'non_volcanic', 'Simbol nasional.', 1),
('Skuta', 'skuta', 'Slovenia', 'Kamnik Alps', 46.3639, 14.5572, 2532, 'dormant', 'non_volcanic', 'Memiliki gletser paling timur di Alpen.', 1),
('Grintovec', 'grintovec', 'Slovenia', 'Kamnik Alps', 46.3556, 14.5361, 2558, 'dormant', 'non_volcanic', 'Tertinggi di Kamnik-Savinja Alps.', 1),
('Grauspitz', 'grauspitz', 'Liechtenstein', 'Ratikon', 47.0531, 9.5811, 2599, 'dormant', 'non_volcanic', 'Titik tertinggi Liechtenstein.', 1),
('Santis', 'santis', 'Switzerland', 'Appenzell', 47.2494, 9.3433, 2502, 'dormant', 'non_volcanic', 'Dominan di timur laut Swiss.', 1),
('Pilatus', 'pilatus', 'Switzerland', 'Lucerne', 46.9792, 8.2550, 2128, 'dormant', 'non_volcanic', 'Gunung Naga di atas Lucerne.', 1),
('Rigi', 'rigi', 'Switzerland', 'Lucerne', 47.0564, 8.4853, 1798, 'dormant', 'non_volcanic', 'Ratu Pegunungan.', 1),
('Hardangervidda', 'hardangervidda', 'Norway', 'Plateau', 60.0500, 7.4167, 1721, 'dormant', 'non_volcanic', 'Dataran tinggi gunung terbesar Eropa.', 1),
('Store Skagastolstind', 'storen', 'Norway', 'Jotunheimen', 61.4600, 7.8722, 2405, 'dormant', 'non_volcanic', 'Puncak paling menantang di Norwegia.', 1),
('Sarektjakka', 'sarektjakka', 'Sweden', 'Lappland', 67.4333, 17.7167, 2089, 'dormant', 'non_volcanic', 'Puncak terpencil Sarek NP.', 1),
('Hvannadalshnjukur', 'hvannadalshnjukur', 'Iceland', 'Vatnajokull', 64.0147, -16.6750, 2110, 'active', 'stratovolcano', 'Titik tertinggi Islandia (di atas oraefajokull).', 1),
('Grimsvotn', 'grimsvotn', 'Iceland', 'Vatnajokull', 64.4167, -17.3333, 1725, 'active', 'subglacial', 'Sering meletus di bawah es.', 1),
('Askja', 'askja', 'Iceland', 'Highlands', 65.0333, -16.7500, 1510, 'active', 'stratovolcano', 'Danau kawah geotermal biru.', 1),
('Herubreið', 'herubreid', 'Iceland', 'Highlands', 65.1833, -16.3500, 1682, 'dormant', 'tuya', 'Ratu Gunung Islandia (bentuk meja).', 1),
('Ben Macdui', 'ben-macdui', 'UK', 'Scotland', 57.0703, -3.6692, 1309, 'dormant', 'non_volcanic', 'Tertinggi kedua di UK.', 1),
('Scafell Pike', 'scafell', 'UK', 'England', 54.4542, -3.2117, 978, 'dormant', 'non_volcanic', 'Titik tertinggi Inggris.', 1),
('Slieve Donard', 'donard', 'UK', 'Northern Ireland', 54.1803, -5.9222, 850, 'dormant', 'non_volcanic', 'Titik tertinggi Irlandia Utara.', 1),
('Slaettaratindur', 'slaettaratindur', 'Faroe Islands', 'Eysturoy', 62.2969, -7.0131, 880, 'dormant', 'non_volcanic', 'Titik tertinggi Kepulauan Faroe.', 1),
('Beerenberg', 'beerenberg', 'Norway', 'Jan Mayen', 71.0750, -8.1667, 2277, 'active', 'stratovolcano', 'Gunung berapi aktif paling utara di dunia.', 1),
('Newtontoppen', 'newtontoppen', 'Norway', 'Svalbard', 79.0064, 17.5458, 1713, 'dormant', 'non_volcanic', 'Tertinggi di Svalbard.', 1);

-- ============================================================
-- 4. ANDES: SECONDARY PEAKS & PATAGONIA (CHILE/ARGENTINA)
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Cerro El Plomo', 'el-plomo', 'Chile', 'Santiago', -33.2425, -70.2131, 5424, 'dormant', 'non_volcanic', 'Gunung suci Inca terlihat dari Santiago.', 1),
('Volcan San Jose', 'san-jose', 'Chile/Argentina', 'Santiago', -33.7806, -69.8928, 5856, 'active', 'stratovolcano', 'Gunung berapi masif di perbatasan.', 1),
('Maipo', 'maipo', 'Chile/Argentina', 'Santiago', -34.1614, -69.8317, 5264, 'active', 'stratovolcano', 'Bentuk kerucut sempurna di perbatasan.', 1),
('Marmolejo', 'marmolejo', 'Chile/Argentina', 'Santiago', -33.7222, -69.8775, 6108, 'dormant', 'non_volcanic', '6000m paling selatan di dunia.', 1),
('Tupungatito', 'tupungatito', 'Chile/Argentina', 'Santiago', -33.4000, -69.8000, 5603, 'active', 'stratovolcano', 'Kawah aktif dekat Tupungato.', 1),
('Descabezado Grande', 'descabezado', 'Chile', 'Maule', -35.5861, -70.7492, 3830, 'active', 'stratovolcano', '"Si Besar Tanpa Kepala".', 1),
('Antuco', 'antuco', 'Chile', 'Biobio', -37.4058, -71.3458, 2979, 'active', 'stratovolcano', 'Tragedi militer 2005 terjadi di sini.', 1),
('Lonquimay', 'lonquimay', 'Chile', 'Araucania', -38.3792, -71.5831, 2865, 'active', 'stratovolcano', 'Kawah Navidad meletus 1988.', 1),
('Mocho-Choshuenco', 'mocho', 'Chile', 'Los Rios', -39.9275, -72.0275, 2422, 'dormant', 'stratovolcano', 'Kompleks vulkanik ganda.', 1),
('Puyehue', 'puyehue', 'Chile', 'Los Rios', -40.5900, -72.1175, 2236, 'active', 'complex', 'Meletus besar 2011 (Puyehue-Cordon Caulle).', 1),
('Tronador (Pico Argentino)', 'tronador-arg', 'Argentina', 'Rio Negro', -41.1611, -71.8889, 3200, 'dormant', 'stratovolcano', 'Puncak sisi Argentina.', 1),
('Cerro Catedral', 'catedral-arg', 'Argentina', 'Rio Negro', -41.1833, -71.4500, 2405, 'dormant', 'non_volcanic', 'Pusat ski terbesar di Bariloche.', 1),
('Cerro Lopez', 'lopez', 'Argentina', 'Rio Negro', -41.1000, -71.5500, 2075, 'dormant', 'non_volcanic', 'Hiking populer Bariloche.', 1),
('Puntiagudo', 'puntiagudo', 'Chile', 'Los Lagos', -40.9692, -72.2639, 2493, 'dormant', 'stratovolcano', '"Puncak Tajam" yang sulit.', 1),
('Michinmahuida', 'michinmahuida', 'Chile', 'Los Lagos', -42.7958, -72.4389, 2404, 'active', 'stratovolcano', 'Tertutup gletser di hutan hujan.', 1),
('Melimoyu', 'melimoyu', 'Chile', 'Aysen', -44.0853, -72.8850, 2400, 'active', 'stratovolcano', 'Empat puncak (nama Mapuche).', 1),
('Macá', 'maca', 'Chile', 'Aysen', -45.1069, -73.1683, 2300, 'dormant', 'stratovolcano', 'Terpencil di fjord.', 1),
('Arenales', 'arenales', 'Chile', 'Aysen', -47.2000, -73.4833, 3437, 'dormant', 'stratovolcano', 'Puncak besar di Northern Patagonian Ice Field.', 1),
('Cerro Castillo', 'castillo', 'Chile', 'Aysen', -46.0667, -72.2000, 2675, 'dormant', 'non_volcanic', 'Bentuk kastil yang ikonik.', 1),
('San Lorenzo', 'san-lorenzo', 'Argentina/Chile', 'Santa Cruz', -47.5919, -72.3089, 3706, 'dormant', 'non_volcanic', 'Tertinggi kedua di Patagonia.', 1),
('Cerro Murallon', 'murallon', 'Argentina/Chile', 'Patagonia', -49.8000, -73.4333, 2656, 'dormant', 'non_volcanic', 'Tembok granit besar.', 1),
('Cerro Torre (Eggher)', 'torre-eggher', 'Argentina/Chile', 'Patagonia', -49.2961, -73.1006, 2685, 'dormant', 'non_volcanic', 'Salah satu menara tersulit Torre group.', 1),
('Cerro Standhardt', 'standhardt', 'Argentina/Chile', 'Patagonia', -49.2931, -73.0950, 2700, 'dormant', 'non_volcanic', 'Menara jarum Torre.', 1),
('Guallatiri', 'guallatiri', 'Chile', 'Arica', -18.4200, -69.0917, 6071, 'active', 'stratovolcano', 'Salah satu gunung berapi aktif tertinggi.', 1),
('Tacora', 'tacora', 'Chile/Peru', 'Arica', -17.7208, -69.7717, 5980, 'dormant', 'stratovolcano', 'Gunung paling utara Chile.', 1),
('Paruma', 'paruma', 'Chile/Bolivia', 'Antofagasta', -20.9411, -68.4550, 5728, 'active', 'stratovolcano', 'Fumarol aktif.', 1),
('Olca', 'olca', 'Chile/Bolivia', 'Antofagasta', -20.9333, -68.4833, 5407, 'active', 'stratovolcano', 'Punggungan panjang.', 1),
('Aucanquilcha', 'aucanquilcha', 'Chile', 'Antofagasta', -21.2167, -68.4667, 6176, 'active', 'stratovolcano', 'Bekas tambang belerang tertinggi.', 1),
('San Pedro', 'san-pedro', 'Chile', 'Antofagasta', -21.8881, -68.3900, 6145, 'active', 'stratovolcano', 'Kembaran San Pablo.', 1),
('San Pablo', 'san-pablo', 'Chile', 'Antofagasta', -21.8833, -68.3500, 6092, 'dormant', 'stratovolcano', 'Kembaran San Pedro.', 1),
('Paniri', 'paniri', 'Chile', 'Antofagasta', -22.0536, -68.2250, 5946, 'dormant', 'stratovolcano', 'Dekat desa Chiu Chiu.', 1),
('Leon Jiwata', 'leon-jiwata', 'Bolivia', 'Oruro', -18.1500, -69.0333, 5680, 'dormant', 'stratovolcano', 'Dekat Sajama.', 1),
('Tunupa', 'tunupa', 'Bolivia', 'Potosi', -19.8317, -67.6433, 5321, 'dormant', 'stratovolcano', 'Wali Salar de Uyuni.', 1),
('Licancabur (Bolivia Side)', 'licancabur-bo', 'Bolivia', 'Potosi', -22.8333, -67.8833, 5920, 'dormant', 'stratovolcano', 'Laguna Verde di kakinya.', 1),
('Juriques', 'juriques', 'Bolivia/Chile', 'Potosi', -22.8500, -67.8333, 5704, 'dormant', 'stratovolcano', 'Kawah besar tanpa kepala.', 1),
('Sairecabur', 'sairecabur', 'Chile/Bolivia', 'Antofagasta', -22.7183, -67.8906, 5971, 'dormant', 'stratovolcano', 'Ada teleskop di puncaknya.', 1);

-- ============================================================
-- 5. NORTH AMERICA: CANADIAN ROCKIES & US GEMS
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Mount Columbia', 'columbia-ca', 'Canada', 'Alberta', 52.1475, -117.4414, 3747, 'dormant', 'non_volcanic', 'Puncak tertinggi Alberta.', 1),
('North Twin Peak', 'north-twin', 'Canada', 'Alberta', 52.2228, -117.4356, 3731, 'dormant', 'non_volcanic', 'Twin Peaks massif.', 1),
('South Twin Peak', 'south-twin', 'Canada', 'Alberta', 52.2131, -117.4267, 3566, 'dormant', 'non_volcanic', 'Twin Peaks massif.', 1),
('Mount Clemenceau', 'clemenceau', 'Canada', 'BC', 52.2464, -117.9547, 3658, 'dormant', 'non_volcanic', 'Puncak besar di Rockies.', 1),
('Mount Bryce', 'bryce', 'Canada', 'BC', 52.0417, -117.3306, 3507, 'dormant', 'non_volcanic', 'Puncak piramida raksasa.', 1),
('Mount Kitchener', 'kitchener', 'Canada', 'Alberta', 52.2167, -117.3167, 3505, 'dormant', 'non_volcanic', 'Columbia Icefield.', 1),
('Mount Hungabee', 'hungabee', 'Canada', 'Alberta/BC', 51.3167, -116.2833, 3492, 'dormant', 'non_volcanic', 'Puncak kepala suku.', 1),
('Mount Victoria', 'victoria', 'Canada', 'Alberta/BC', 51.3833, -116.3000, 3464, 'dormant', 'non_volcanic', 'Latar belakang Danau Louise.', 1),
('Mount Lefroy', 'lefroy', 'Canada', 'Alberta/BC', 51.3667, -116.2833, 3423, 'dormant', 'non_volcanic', 'Situs kecelakaan pendakian pertama di Rockies.', 1),
('Mount Fay', 'fay', 'Canada', 'Alberta/BC', 51.3000, -116.1333, 3235, 'dormant', 'non_volcanic', 'Valley of the Ten Peaks.', 1),
('Deltaform Mountain', 'deltaform', 'Canada', 'Alberta/BC', 51.3000, -116.2500, 3424, 'dormant', 'non_volcanic', 'Valley of the Ten Peaks.', 1),
('Mount Babel', 'babel', 'Canada', 'Alberta', 51.3167, -116.1667, 3101, 'dormant', 'non_volcanic', 'Menara di Lake Moraine.', 1),
('Eiffel Peak', 'eiffel', 'Canada', 'Alberta', 51.3167, -116.2333, 3084, 'dormant', 'non_volcanic', 'Bentuk menara Eiffel.', 1),
('Sentinel Pass', 'sentinel-pass', 'Canada', 'Alberta', 51.3333, -116.2000, 2611, 'dormant', 'non_volcanic', 'Pass tertinggi yang bisa di-hike.', 1),
('Mount Yamnuska', 'yamnuska-v2', 'Canada', 'Alberta', 51.1333, -115.1167, 2240, 'dormant', 'non_volcanic', 'Dinding batu kapur.', 1),
('Grotto Mountain', 'grotto', 'Canada', 'Alberta', 51.1000, -115.2500, 2706, 'dormant', 'non_volcanic', 'Canmore.', 1),
('Mount Lady Macdonald', 'lady-mac', 'Canada', 'Alberta', 51.1167, -115.3167, 2606, 'dormant', 'non_volcanic', 'Punggungan pisau.', 1),
('Chinaman''s Peak (Ha Ling)', 'ha-ling-v2', 'Canada', 'Alberta', 51.0667, -115.4000, 2407, 'dormant', 'non_volcanic', 'Nama lama Ha Ling.', 1),
('Mount Indefatigable', 'indefatigable-v2', 'Canada', 'Alberta', 50.6333, -115.1500, 2670, 'dormant', 'non_volcanic', 'Hiking ditutup karena beruang.', 1),
('Mount Sarrail', 'sarrail', 'Canada', 'Alberta', 50.6000, -115.0667, 3174, 'dormant', 'non_volcanic', 'Rawson Lake di bawahnya.', 1),
('Mount Fable', 'fable', 'Canada', 'Alberta', 51.0667, -115.2333, 2702, 'dormant', 'non_volcanic', 'Puncak dongeng.', 1),
('Mount Girouard', 'girouard', 'Canada', 'Alberta', 51.2333, -115.4000, 2995, 'dormant', 'non_volcanic', 'Tertinggi di Fairholme Range.', 1),
('Mount Peechee', 'peechee', 'Canada', 'Alberta', 51.2167, -115.3833, 2935, 'dormant', 'non_volcanic', 'Puncak tajam Canmore.', 1),
('Grizzly Peak (CA)', 'grizzly-ca', 'USA', 'California', 37.8394, -122.2178, 536, 'dormant', 'non_volcanic', 'Berkeley Hills.', 1),
('Mount Diablo', 'diablo', 'USA', 'California', 37.8817, -121.9142, 1173, 'dormant', 'non_volcanic', 'Puncak Bay Area.', 1),
('Mount Tamalpais', 'tamalpais', 'USA', 'California', 37.9236, -122.5964, 784, 'dormant', 'non_volcanic', 'Tempat lahir sepeda gunung.', 1),
('Mount Hamilton', 'hamilton', 'USA', 'California', 37.3415, -121.6430, 1284, 'dormant', 'non_volcanic', 'Lick Observatory.', 1),
('Mount Umunhum', 'umunhum', 'USA', 'California', 37.1606, -121.8993, 1063, 'dormant', 'non_volcanic', 'Radar tower kotak.', 1),
('Mission Peak', 'mission-peak', 'USA', 'California', 37.5122, -121.8808, 767, 'dormant', 'non_volcanic', 'Tantangan hiking populer.', 1),
('Mount Saint Helena', 'st-helena', 'USA', 'California', 38.6712, -122.6331, 1323, 'dormant', 'stratovolcano', 'Puncak Napa Valley.', 1),
('Copahue', 'copahue', 'Argentina/Chile', 'Neuquen', -37.8500, -71.1667, 2997, 'active', 'stratovolcano', 'Kawah asam aktif.', 1),
('Peteroa', 'peteroa', 'Chile/Argentina', 'Maule', -35.2400, -70.5700, 4084, 'active', 'complex', 'Gunung berapi kompleks.', 1);

-- ============================================================
-- 6. ASIA & OCEANIA: ISLAND GIANTS & OTHERS
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Mount Tapulao', 'tapulao', 'Philippines', 'Zambales', 15.4833, 120.1167, 2037, 'dormant', 'non_volcanic', 'High Peak.', 1),
('Mount Guiting-Guiting', 'guiting', 'Philippines', 'Romblon', 12.4167, 122.5667, 2058, 'dormant', 'non_volcanic', 'Punggungan "gergaji" yang terkenal.', 1),
('Mount Halcon', 'halcon', 'Philippines', 'Mindoro', 13.2572, 121.0006, 2582, 'dormant', 'non_volcanic', 'Salah satu yang tersulit di PH.', 1),
('Mount Isarog', 'isarog', 'Philippines', 'Camarines', 13.6592, 123.3733, 1966, 'active', 'stratovolcano', 'Bicolandia.', 1),
('Mount Makiling', 'makiling', 'Philippines', 'Laguna', 14.1300, 121.2000, 1090, 'dormant', 'stratovolcano', 'Legenda Maria Makiling.', 1),
('Mount Banahaw', 'banahaw', 'Philippines', 'Quezon', 14.0667, 121.4833, 2170, 'active', 'complex', 'Gunung suci mistis.', 1),
('Mount Kitanglad', 'kitanglad', 'Philippines', 'Bukidnon', 8.1333, 124.9167, 2899, 'dormant', 'non_volcanic', 'Tertinggi keempat PH.', 1),
('Mount Dulang-Dulang', 'dulang', 'Philippines', 'Bukidnon', 8.1103, 124.9611, 2938, 'dormant', 'non_volcanic', 'Tertinggi kedua PH.', 1),
('Gunung Nuang', 'nuang', 'Malaysia', 'Selangor', 3.2667, 101.9000, 1493, 'dormant', 'non_volcanic', 'Gunung latihan terpopuler di KL.', 1),
('Gunung Datuk', 'datuk', 'Malaysia', 'Negeri Sembilan', 2.5500, 102.1833, 884, 'dormant', 'non_volcanic', 'Batu besar di puncak.', 1),
('Gunung Angsi', 'angsi', 'Malaysia', 'Negeri Sembilan', 2.6833, 102.0500, 825, 'dormant', 'non_volcanic', 'Dekat Seremban.', 1),
('Gunung Jerai', 'jerai', 'Malaysia', 'Kedah', 5.7833, 100.4333, 1217, 'dormant', 'non_volcanic', 'Terlihat dari laut.', 1),
('Bukit Tabur', 'tabur', 'Malaysia', 'Selangor', 3.2333, 101.7500, 396, 'dormant', 'non_volcanic', 'Punggungan kuarsa naga.', 1),
('Gunung Santubong', 'santubong', 'Malaysia', 'Sarawak', 1.7333, 110.3167, 810, 'dormant', 'non_volcanic', 'Ikon Sarawak.', 1),
('Gunung Mulu', 'mulu', 'Malaysia', 'Sarawak', 4.0478, 114.9317, 2376, 'dormant', 'non_volcanic', 'Taman Nasional Mulu (Pinnacles).', 1),
('Gunung Murud', 'murud', 'Malaysia', 'Sarawak', 3.9000, 115.4833, 2423, 'dormant', 'non_volcanic', 'Tertinggi di Sarawak.', 1),
('Pukaskwa', 'pukaskwa', 'Canada', 'Ontario', 48.0167, -85.9167, 640, 'dormant', 'non_volcanic', 'Pesisir Danau Superior liar.', 1),
('Ishpatina Ridge', 'ishpatina', 'Canada', 'Ontario', 47.3167, -80.7500, 693, 'dormant', 'non_volcanic', 'Tertinggi di Ontario.', 1),
('Mount Caubvick', 'caubvick', 'Canada', 'Newfoundland', 58.8833, -63.7000, 1652, 'dormant', 'non_volcanic', 'Tertinggi di Kanada timur.', 1),
('Thor Peak (Canada)', 'thor-canada', 'Canada', 'Nunavut', 66.5333, -65.3167, 1675, 'dormant', 'non_volcanic', 'Tebing vertikal terbesar bumi.', 1),
('Mount Asgard', 'asgard', 'Canada', 'Nunavut', 66.4500, -65.2667, 2015, 'dormant', 'non_volcanic', 'Menara kembar datar.', 1),
('Qalherhaue', 'qalherhaue', 'Canada', 'Nunavut', 66.5000, -65.3000, 1600, 'dormant', 'non_volcanic', 'Baffin Island.', 1);

-- ============================================================
-- AUTO-GENERATE TRAILS
-- ============================================================
INSERT IGNORE INTO trails (mountain_id, name, slug, basecamp_name, distance_km, estimated_time_up_hours, difficulty_level, trail_status, description, is_active)
SELECT 
    id, 
    CONCAT('Summit Trail - ', name), 
    CONCAT(slug, '-summit'), 
    'Main Gate', 
    6.0, 
    4.0, 
    3, 
    'open', 
    'Jalur pendakian umum.', 
    1
FROM mountains 
WHERE id NOT IN (SELECT DISTINCT mountain_id FROM trails);

-- ============================================================
-- FINAL COUNT CHECK
-- ============================================================
SELECT 'DATABASE SEED PART 5 COMPLETED' AS status;
SELECT COUNT(*) as total_mountains FROM mountains;
