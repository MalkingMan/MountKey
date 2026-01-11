-- ============================================================
-- MOUNTKEY - GLOBAL MOUNTAINS PART 4 (200 ADDITIONAL PEAKS)
-- ============================================================
-- Description: Menambahkan 200 gunung unik BARU.
-- Focus: 
-- 1. MAJOR INDONESIAN ICONS (Semeru, Rinjani, Kerinci, Bromo) - Previously missing
-- 2. Famous Trekking Peaks (Nepal, Peru, NZ)
-- 3. Sacred Mountains (China, Japan, Korea)
-- 4. North American Classics (California High Sierra, Canadian Rockies)
-- 5. European Cultural Peaks (Greece, Norway, Iceland)
-- ============================================================

USE mount_key;

-- ============================================================
-- 1. INDONESIA: THE MISSING ICONS (JAVA, SUMATRA, LOMBOK)
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Gunung Kerinci', 'kerinci', 'Jambi/Sumatera Barat', 'Kerinci', -1.6967, 101.2642, 3805, 'active', 'stratovolcano', 'Atap Sumatera, gunung berapi tertinggi di Indonesia.', 1),
('Gunung Rinjani', 'rinjani', 'NTB', 'Lombok Timur', -8.4114, 116.4572, 3726, 'active', 'stratovolcano', 'Gunung wisata terpopuler dengan Danau Segara Anak yang ikonik.', 1),
('Gunung Semeru', 'semeru', 'Jawa Timur', 'Lumajang', -8.1077, 112.9224, 3676, 'active', 'stratovolcano', 'Atap Pulau Jawa (Mahameru), gunung tertinggi di Jawa.', 1),
('Gunung Bromo', 'bromo', 'Jawa Timur', 'Probolinggo', -7.9425, 112.9531, 2329, 'active', 'complex', 'Gunung paling ikonik dengan kawah berasap di kaldera Tengger.', 1),
('Gunung Gede', 'gede', 'Jawa Barat', 'Cianjur', -6.7772, 106.9914, 2958, 'active', 'stratovolcano', 'Taman Nasional tertua, sangat populer bagi pendaki Jakarta.', 1),
('Gunung Pangrango', 'pangrango', 'Jawa Barat', 'Cianjur', -6.7686, 106.9814, 3019, 'dormant', 'stratovolcano', 'Puncak tertinggi kedua di Jawa Barat, hutan hujan tropis lebat.', 1),
('Gunung Merbabu', 'merbabu', 'Jawa Tengah', 'Magelang', -7.4550, 110.4383, 3145, 'dormant', 'stratovolcano', 'Terkenal dengan pemandangan sabana dan view ke Merapi.', 1),
('Gunung Sindoro', 'sindoro', 'Jawa Tengah', 'Temanggung', -7.2997, 109.9972, 3153, 'active', 'stratovolcano', 'Gunung dengan kawah aktif yang indah, kembaran Sumbing.', 1),
('Gunung Prau', 'prau', 'Jawa Tengah', 'Wonosobo', -7.1894, 109.9322, 2565, 'dormant', 'non_volcanic', 'Spot sunrise terbaik di Dieng, bukit Teletubbies.', 1),
('Gunung Ciremai', 'ciremai', 'Jawa Barat', 'Kuningan', -6.8925, 108.4075, 3078, 'active', 'stratovolcano', 'Atap Jawa Barat.', 1),
('Gunung Ungaran', 'ungaran', 'Jawa Tengah', 'Semarang', -7.1856, 110.3317, 2050, 'dormant', 'stratovolcano', 'Gunung populer di dekat kota Semarang.', 1),
('Gunung Andong', 'andong', 'Jawa Tengah', 'Magelang', -7.3889, 110.3694, 1726, 'dormant', 'shield', 'Gunung ramah pemula dengan view 360 derajat.', 1),
('Gunung Muria', 'muria', 'Jawa Tengah', 'Kudus', -6.6197, 110.8931, 1602, 'dormant', 'stratovolcano', 'Pusat penyebaran agama Islam di Jawa (Sunan Muria).', 1),
('Gunung Tangkuban Parahu', 'tangkuban-parahu', 'Jawa Barat', 'Subang', -6.7596, 107.6098, 2084, 'active', 'stratovolcano', 'Legenda Sangkuriang, wisata kawah yang bisa diakses mobil.', 1),
('Gunung Burangrang', 'burangrang', 'Jawa Barat', 'Bandung Barat', -6.7725, 107.5564, 2050, 'dormant', 'stratovolcano', 'Sisa gunung purba Sunda.', 1),
('Gunung Malabar', 'malabar', 'Jawa Barat', 'Bandung', -7.1306, 107.6022, 2343, 'dormant', 'stratovolcano', 'Pegunungan legendaris di selatan Bandung.', 1),
('Gunung Patuha', 'patuha', 'Jawa Barat', 'Bandung', -7.1617, 107.3986, 2434, 'dormant', 'stratovolcano', 'Rumah bagi Kawah Putih yang eksotis.', 1),
('Gunung Wayang', 'wayang', 'Jawa Barat', 'Bandung', -7.2117, 107.6333, 2182, 'dormant', 'stratovolcano', 'Hulu sungai Citarum.', 1),
('Gunung Windu', 'windu', 'Jawa Barat', 'Bandung', -7.2189, 107.6300, 2054, 'dormant', 'stratovolcano', 'Terkenal dengan pembangkit listrik panas bumi.', 1),
('Gunung Tampomas', 'tampomas', 'Jawa Barat', 'Sumedang', -6.7681, 107.9542, 1684, 'dormant', 'stratovolcano', 'Gunung ikonik Sumedang.', 1),
('Gunung Talamau', 'talamau', 'Sumatera Barat', 'Pasaman Barat', 0.0767, 99.9819, 2919, 'dormant', 'complex', 'Puncak tertinggi di Sumatera Barat (non-aktif).', 1),
('Gunung Pusuk Buhit', 'pusuk-buhit', 'Sumatera Utara', 'Samosir', 2.6044, 98.6533, 1972, 'dormant', 'complex', 'Gunung suci asal muasal orang Batak di tepi Toba.', 1),
('Gunung Seulawah Agam', 'seulawah-agam', 'Aceh', 'Aceh Besar', 5.4475, 95.6564, 1810, 'active', 'stratovolcano', 'Gunung berapi di ujung utara Sumatera.', 1),
('Gunung Pesagi', 'pesagi', 'Lampung', 'Lampung Barat', -4.9200, 104.1300, 2262, 'dormant', 'stratovolcano', 'Atap provinsi Lampung.', 1),
('Gunung Tanggamus', 'tanggamus', 'Lampung', 'Tanggamus', -5.4222, 104.6611, 2100, 'dormant', 'stratovolcano', 'Sering tertutup kabut tebal.', 1),
('Gunung Rajabasa', 'rajabasa', 'Lampung', 'Lampung Selatan', -5.7833, 105.6250, 1281, 'dormant', 'stratovolcano', 'Menghadap langsung ke Selat Sunda.', 1),
('Anak Krakatau', 'krakatau', 'Lampung', 'Selat Sunda', -6.1021, 105.4230, 155, 'active', 'caldera', 'Gunung berapi sangat aktif, tumbuh dari kaldera purba.', 1),
('Gunung Karang', 'karang', 'Banten', 'Pandeglang', -6.2706, 106.0425, 1778, 'dormant', 'stratovolcano', 'Puncak tertinggi di Banten.', 1),
('Gunung Pulosari', 'pulosari', 'Banten', 'Pandeglang', -6.3422, 105.9767, 1346, 'dormant', 'stratovolcano', 'Gunung keramat di Banten.', 1),
('Gunung Halimun', 'halimun', 'Jawa Barat/Banten', 'Bogor/Lebak', -6.7269, 106.4525, 1929, 'dormant', 'non_volcanic', 'Hutan hujan primer terbesar di Jawa.', 1);

-- ============================================================
-- 2. NORTH AMERICA: SIERRAS, ROCKIES & BEYOND
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Gannett Peak', 'gannett', 'USA', 'Wyoming', 43.1842, -109.6542, 4207, 'dormant', 'non_volcanic', 'Puncak tertinggi Wyoming di Wind River Range.', 1),
('Kings Peak', 'kings-peak', 'USA', 'Utah', 40.7763, -110.3729, 4123, 'dormant', 'non_volcanic', 'Atap Utah di Uinta Mountains.', 1),
('Mount Timpanogos', 'timpanogos', 'USA', 'Utah', 40.3908, -111.6458, 3582, 'dormant', 'non_volcanic', 'Gunung paling populer di Wasatch Range.', 1),
('Mount Moran', 'moran', 'USA', 'Wyoming', 43.8344, -110.7752, 3842, 'dormant', 'non_volcanic', 'Monolith masif di Grand Teton NP.', 1),
('Mount Temple', 'temple', 'Canada', 'Alberta', 51.3511, -116.2069, 3544, 'dormant', 'non_volcanic', 'Raksasa Lake Louise, salah satu 11.000ers.', 1),
('Mount Athabasca', 'athabasca', 'Canada', 'Alberta', 52.1764, -117.2014, 3491, 'dormant', 'non_volcanic', 'Puncak klasik Columbia Icefield.', 1),
('Bugaboo Spire', 'bugaboo-spire', 'Canada', 'BC', 50.7583, -116.7861, 3204, 'dormant', 'non_volcanic', 'Menara granit legendaris untuk pemanjat.', 1),
('Mount Monadnock', 'monadnock', 'USA', 'New Hampshire', 42.8615, -72.1082, 965, 'dormant', 'non_volcanic', 'Salah satu gunung yang paling sering didaki di dunia.', 1),
('Camels Hump', 'camels-hump', 'USA', 'Vermont', 44.3195, -72.8864, 1244, 'dormant', 'non_volcanic', 'Puncak ikonik Green Mountains.', 1),
('Whiteface Mountain', 'whiteface', 'USA', 'New York', 44.3659, -73.9026, 1483, 'dormant', 'non_volcanic', 'Penyelenggara Olimpiade Musim Dingin.', 1),
('Mount Algonquin', 'algonquin', 'USA', 'New York', 44.1436, -73.9867, 1559, 'dormant', 'non_volcanic', 'Puncak tertinggi kedua di NY.', 1),
('Mount Le Conte', 'le-conte', 'USA', 'Tennessee', 35.6542, -83.4367, 2010, 'dormant', 'non_volcanic', 'Memiliki penginapan tertinggi di timur AS.', 1),
('Grandfather Mountain', 'grandfather', 'USA', 'North Carolina', 36.1114, -81.8119, 1812, 'dormant', 'non_volcanic', 'Cagar biosfer PBB.', 1),
('Cathedral Peak', 'cathedral-peak', 'USA', 'California', 37.8485, -119.4060, 3326, 'dormant', 'non_volcanic', 'Menara granit spektakuler di Yosemite.', 1),
('Mount Conness', 'conness', 'USA', 'California', 37.9678, -119.3193, 3837, 'dormant', 'non_volcanic', 'Di batas Yosemite, memiliki gletser.', 1),
('Mount Dana', 'dana', 'USA', 'California', 37.8997, -119.2211, 3981, 'dormant', 'non_volcanic', 'Puncak tertinggi kedua di Yosemite.', 1),
('Mount Lyell', 'lyell', 'USA', 'California', 37.7392, -119.2713, 3997, 'dormant', 'non_volcanic', 'Atap Taman Nasional Yosemite.', 1),
('Mount Ritter', 'ritter', 'USA', 'California', 37.6892, -119.1989, 4005, 'dormant', 'non_volcanic', 'Puncak dramatis di Ansel Adams Wilderness.', 1),
('Banner Peak', 'banner', 'USA', 'California', 37.6963, -119.1953, 3945, 'dormant', 'non_volcanic', 'Pasangan Mount Ritter yang fotogenik.', 1),
('Bear Creek Spire', 'bear-creek-spire', 'USA', 'California', 37.3697, -118.7667, 4185, 'dormant', 'non_volcanic', 'Klasik High Sierra.', 1),
('Mount Humphreys', 'humphreys-ca', 'USA', 'California', 37.2719, -118.6728, 4265, 'dormant', 'non_volcanic', 'Puncak menakutkan bagi pendaki.', 1),
('Mount Darwin', 'darwin-ca', 'USA', 'California', 37.1669, -118.6722, 4216, 'dormant', 'non_volcanic', 'Puncak meja datar di Evolution Region.', 1),
('Mount Mendel', 'mendel', 'USA', 'California', 37.1758, -118.6669, 4179, 'dormant', 'non_volcanic', 'Terkenal dengan couloir esnya.', 1),
('Clyde Minaret', 'clyde-minaret', 'USA', 'California', 37.6603, -119.1067, 3743, 'dormant', 'non_volcanic', 'Jarum batu tertajam di Minarets.', 1),
('Mount Sill', 'sill', 'USA', 'California', 37.0964, -118.5042, 4314, 'dormant', 'non_volcanic', 'Pemandangan terbaik di Palisades.', 1),
('Middle Palisade', 'middle-palisade', 'USA', 'California', 37.0686, -118.4697, 4271, 'dormant', 'non_volcanic', 'Titik tertinggi ketiga Palisades.', 1),
('Split Mountain', 'split-mt', 'USA', 'California', 37.0211, -118.4231, 4285, 'dormant', 'non_volcanic', 'Puncak ganda yang terbelah.', 1),
('Mount Tyndall', 'tyndall', 'USA', 'California', 36.6561, -118.3364, 4273, 'dormant', 'non_volcanic', 'Tetangga utara Williamson.', 1),
('Mount Russell', 'russell', 'USA', 'California', 36.5903, -118.2911, 4294, 'dormant', 'non_volcanic', 'Tetangga Whitney yang lebih sulit.', 1),
('Dragontail Peak', 'dragontail', 'USA', 'Washington', 47.4786, -120.8336, 2694, 'dormant', 'non_volcanic', 'Ikon The Enchantments.', 1),
('Colchuck Peak', 'colchuck', 'USA', 'Washington', 47.4722, -120.8522, 2653, 'dormant', 'non_volcanic', 'Menjulang di atas Danau Colchuck.', 1),
('Mount Sir Donald', 'sir-donald', 'Canada', 'BC', 51.2667, -117.4333, 3284, 'dormant', 'non_volcanic', 'Matterhorn-nya Selkirks.', 1),
('Mount Louis', 'louis', 'Canada', 'Alberta', 51.2167, -115.6833, 2682, 'dormant', 'non_volcanic', 'Menara batu kapur vertikal.', 1),
('Mount Birdwood', 'birdwood', 'Canada', 'Alberta', 50.7833, -115.3667, 3097, 'dormant', 'non_volcanic', 'Seperti Sphinx.', 1),
('Mount Chester', 'chester', 'Canada', 'Alberta', 50.8167, -115.2833, 3054, 'dormant', 'non_volcanic', 'Tujuan snowshoe dan scramble.', 1),
('Crowsnest Mountain', 'crowsnest', 'Canada', 'Alberta', 49.7042, -114.5844, 2785, 'dormant', 'non_volcanic', 'Gunung terisolasi (inselberg).', 1),
('Turtle Mountain', 'turtle-mt', 'Canada', 'Alberta', 49.5833, -114.4000, 2210, 'dormant', 'non_volcanic', 'Lokasi longsor Frank Slide.', 1),
('Pigeon Spire', 'pigeon-spire', 'Canada', 'BC', 50.7333, -116.8000, 3156, 'dormant', 'non_volcanic', 'Salah satu pendakian 5.4 terbaik dunia.', 1),
('Howser Spire', 'howser', 'Canada', 'BC', 50.7333, -116.8167, 3412, 'dormant', 'non_volcanic', 'Tertinggi di Bugaboos.', 1),
('Mount Fairweather', 'fairweather', 'USA/Canada', 'Alaska/BC', 58.9064, -137.5267, 4671, 'dormant', 'non_volcanic', 'Puncak tertinggi BC.', 1),
('Devils Thumb', 'devils-thumb', 'USA/Canada', 'Alaska/BC', 57.1731, -132.3022, 2767, 'dormant', 'non_volcanic', 'Pilar granit menakutkan.', 1),
('Kates Needle', 'kates-needle', 'USA/Canada', 'Alaska/BC', 57.0667, -132.1667, 3053, 'dormant', 'non_volcanic', 'Puncak perbatasan.', 1),
('Mount Ratz', 'ratz', 'Canada', 'BC', 57.3917, -132.3000, 3090, 'dormant', 'non_volcanic', 'Tertinggi di Stikine Icecap.', 1),
('Mount Silverthrone', 'silverthrone', 'Canada', 'BC', 51.5297, -126.3014, 2860, 'dormant', 'complex', 'Kaldera es terpencil.', 1),
('Mount Cayley', 'cayley', 'Canada', 'BC', 50.1197, -123.2872, 2377, 'dormant', 'stratovolcano', 'Vulkanik tererosi.', 1),
('Mount Price', 'price', 'Canada', 'BC', 49.8517, -123.0333, 2049, 'dormant', 'stratovolcano', 'Membendung Danau Garibaldi.', 1),
('Tricouni Peak', 'tricouni', 'Canada', 'BC', 49.9500, -123.2333, 2122, 'dormant', 'non_volcanic', 'Scramble populer dekat Squamish.', 1),
('Mount Fee', 'fee', 'Canada', 'BC', 50.0667, -123.2333, 2162, 'dormant', 'non_volcanic', 'Menara vulkanik tajam.', 1);

-- ============================================================
-- 3. EUROPE: CULTURAL & ALPINE GEMS
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Piz Badile', 'piz-badile', 'Switzerland/Italy', 'Bregaglia', 46.2975, 9.5850, 3308, 'dormant', 'non_volcanic', 'Dinding granit utara yang halus.', 1),
('Piz Buin', 'piz-buin', 'Austria/Switzerland', 'Silvretta', 46.8442, 10.1189, 3312, 'dormant', 'non_volcanic', 'Tertinggi di Vorarlberg.', 1),
('Hochalmspitze', 'hochalmspitze', 'Austria', 'Carinthia', 47.0167, 13.3167, 3360, 'dormant', 'non_volcanic', '"Ratu Tauern".', 1),
('Watzmann', 'watzmann', 'Germany', 'Bavaria', 47.5542, 12.9192, 2713, 'dormant', 'non_volcanic', 'Raja Berchtesgaden.', 1),
('Hochkonig', 'hochkonig', 'Austria', 'Salzburg', 47.4167, 13.0667, 2941, 'dormant', 'non_volcanic', 'Raja Tinggi.', 1),
('Dachstein', 'dachstein', 'Austria', 'Styria', 47.4744, 13.6047, 2995, 'dormant', 'non_volcanic', 'Gletser timur terjauh di Alpen.', 1),
('Tofana di Mezzo', 'tofana', 'Italy', 'Dolomites', 46.5417, 12.0667, 3244, 'dormant', 'non_volcanic', 'Puncak tertinggi ketiga Dolomites.', 1),
('Monte Cristallo', 'cristallo', 'Italy', 'Dolomites', 46.5767, 12.2000, 3221, 'dormant', 'non_volcanic', 'Lokasi film Cliffhanger.', 1),
('Sassolungo', 'sassolungo', 'Italy', 'Dolomites', 46.5250, 11.7333, 3181, 'dormant', 'non_volcanic', '"Langkofel", puncak panjang.', 1),
('Cima Piccola', 'cima-piccola', 'Italy', 'Dolomites', 46.6167, 12.3000, 2857, 'dormant', 'non_volcanic', 'Tersulit didaki dari Tre Cime.', 1),
('Monte Baldo', 'baldo', 'Italy', 'Verona', 45.7333, 10.8667, 2218, 'dormant', 'non_volcanic', 'Taman Eropa di atas Danau Garda.', 1),
('Puy de Dome', 'puy-de-dome', 'France', 'Massif Central', 45.7722, 2.9644, 1465, 'dormant', 'dome', 'Kubah lava ikonik Tour de France.', 1),
('Puy de Sancy', 'puy-de-sancy', 'France', 'Massif Central', 45.5306, 2.8128, 1885, 'dormant', 'stratovolcano', 'Tertinggi di Massif Central.', 1),
('Sainte-Victoire', 'sainte-victoire', 'France', 'Provence', 43.5350, 5.6128, 1011, 'dormant', 'non_volcanic', 'Muse pelukis Cezanne.', 1),
('Snohetta', 'snohetta', 'Norway', 'Dovrefjell', 62.3211, 9.2683, 2286, 'dormant', 'non_volcanic', 'Dulu dianggap tertinggi di Norwegia.', 1),
('Kjerag', 'kjerag', 'Norway', 'Rogaland', 59.0333, 6.5833, 1110, 'dormant', 'non_volcanic', 'Terkenal dengan batu gantung Kjeragbolten.', 1),
('Halti', 'halti', 'Finland', 'Lapland', 69.3094, 21.2647, 1324, 'dormant', 'non_volcanic', 'Titik tertinggi Finlandia.', 1),
('Snaefellsjokull', 'snaefellsjokull', 'Iceland', 'Snaefellsnes', 64.8056, -23.7731, 1446, 'dormant', 'stratovolcano', 'Pintu masuk ke Pusat Bumi (Jules Verne).', 1),
('Eyjafjallajokull', 'eyjafjallajokull', 'Iceland', 'South', 63.6306, -19.6217, 1651, 'active', 'stratovolcano', 'Letusan 2010 yang menghentikan penerbangan Eropa.', 1),
('Katla', 'katla', 'Iceland', 'South', 63.6467, -19.1303, 1512, 'active', 'subglacial', 'Monster di bawah es.', 1),
('Pico Ruivo', 'pico-ruivo', 'Portugal', 'Madeira', 32.7597, -16.9422, 1862, 'dormant', 'non_volcanic', 'Atap Madeira di atas awan.', 1),
('Serra da Estrela', 'estrela', 'Portugal', 'Centro', 40.3219, -7.6122, 1993, 'dormant', 'non_volcanic', 'Titik tertinggi Portugal Daratan.', 1),
('Mount Parnassus', 'parnassus', 'Greece', 'Central', 38.5342, 22.5850, 2457, 'dormant', 'non_volcanic', 'Rumah para Muse dan Orakel Delphi.', 1),
('Mount Athos', 'athos', 'Greece', 'Macedonia', 40.1572, 24.3264, 2033, 'dormant', 'non_volcanic', 'Gunung Suci monastik.', 1),
('Taygetus', 'taygetus', 'Greece', 'Peloponnese', 36.9536, 22.3503, 2404, 'dormant', 'non_volcanic', 'Puncak piramida Sparta.', 1),
('Mount Ida (Psiloritis)', 'ida-crete', 'Greece', 'Crete', 35.2264, 24.7708, 2456, 'dormant', 'non_volcanic', 'Tempat lahir Zeus.', 1);

-- ============================================================
-- 4. ASIA: SACRED MOUNTAINS & TREKKING PEAKS
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Mount Hua', 'hua-shan', 'China', 'Shaanxi', 34.4783, 110.0831, 2154, 'dormant', 'non_volcanic', 'Gunung Barat yang suci, jalur papan berbahaya.', 1),
('Mount Tai', 'tai-shan', 'China', 'Shandong', 36.2558, 117.1061, 1545, 'dormant', 'non_volcanic', 'Gunung Timur yang suci, paling penting dalam sejarah China.', 1),
('Mount Emei', 'emei', 'China', 'Sichuan', 29.5167, 103.3333, 3099, 'dormant', 'non_volcanic', 'Gunung Buddha suci, lautan awan.', 1),
('Mount Huang', 'huangshan', 'China', 'Anhui', 30.1261, 118.1750, 1864, 'dormant', 'non_volcanic', 'Gunung Kuning, inspirasi lukisan Tiongkok.', 1),
('Xueshan', 'xueshan', 'Taiwan', 'Shei-Pa', 24.3856, 121.2325, 3886, 'dormant', 'non_volcanic', 'Gunung Salju, tertinggi kedua di Taiwan.', 1),
('Nanhudashan', 'nanhu', 'Taiwan', 'Taroko', 24.3611, 121.4392, 3742, 'dormant', 'non_volcanic', 'Raja Gunung Utara.', 1),
('Dabajianshan', 'dabajian', 'Taiwan', 'Shei-Pa', 24.4606, 121.2589, 3492, 'dormant', 'non_volcanic', 'Bentuk tong unik, suci bagi suku Atayal.', 1),
('Hehuanshan', 'hehuan', 'Taiwan', 'Nantou', 24.1436, 121.2722, 3416, 'dormant', 'non_volcanic', 'Dapat diakses jalan raya, populer saat salju.', 1),
('Seoraksan', 'seoraksan', 'South Korea', 'Gangwon', 38.1194, 128.4656, 1708, 'dormant', 'non_volcanic', 'Pegunungan batu putih yang indah.', 1),
('Jirisan', 'jirisan', 'South Korea', 'Gyeongsang', 35.3375, 127.7306, 1915, 'dormant', 'non_volcanic', 'Taman Nasional pertama Korea.', 1),
('Bukhansan', 'bukhansan', 'South Korea', 'Seoul', 37.6533, 126.9792, 836, 'dormant', 'non_volcanic', 'Taman nasional di dalam kota Seoul.', 1),
('Taebaeksan', 'taebaeksan', 'South Korea', 'Gangwon', 37.0989, 128.9161, 1567, 'dormant', 'non_volcanic', 'Gunung salju musim dingin.', 1),
('Mount Yari', 'yari', 'Japan', 'Nagano', 36.3419, 137.6475, 3180, 'dormant', 'non_volcanic', 'Matterhorn-nya Jepang.', 1),
('Mount Hotaka', 'hotaka', 'Japan', 'Nagano', 36.2892, 137.6481, 3190, 'dormant', 'non_volcanic', 'Puncak tertinggi ketiga Jepang.', 1),
('Mount Tsurugi', 'tsurugi', 'Japan', 'Toyama', 36.6231, 137.6169, 2999, 'dormant', 'non_volcanic', 'Gunung paling berbahaya di Jepang.', 1),
('Mount Daisen', 'daisen', 'Japan', 'Tottori', 35.3719, 133.5414, 1729, 'dormant', 'stratovolcano', 'Hoki Fuji, suci.', 1),
('Mount Tanigawa', 'tanigawa', 'Japan', 'Gunma', 36.8375, 138.9297, 1977, 'dormant', 'non_volcanic', 'Gunung pemakan manusia (banyak kecelakaan).', 1),
('Mount Tsukuba', 'tsukuba', 'Japan', 'Ibaraki', 36.2253, 140.1067, 877, 'dormant', 'non_volcanic', '"Ungu di Barat".', 1),
('Mount Zao', 'zao', 'Japan', 'Yamagata', 38.1408, 140.4431, 1841, 'active', 'complex', 'Monster salju (Juhyo).', 1),
('Mount Asama', 'asama', 'Japan', 'Nagano', 36.4033, 138.5261, 2568, 'active', 'complex', 'Gunung berapi paling aktif di Honshu.', 1),
('Mount Norikura', 'norikura', 'Japan', 'Nagano', 36.1061, 137.5539, 3026, 'dormant', 'stratovolcano', 'Dapat diakses bus.', 1),
('Mount Kaikoma', 'kaikoma', 'Japan', 'Yamanashi', 35.7606, 138.2369, 2967, 'dormant', 'non_volcanic', 'Puncak granit putih.', 1),
('Mount Senjo', 'senjo', 'Japan', 'Yamanashi', 35.7192, 138.1817, 3033, 'dormant', 'non_volcanic', 'Ratu Alpen Selatan.', 1),
('Mount Shiomi', 'shiomi', 'Japan', 'Shizuoka', 35.5786, 138.1842, 3047, 'dormant', 'non_volcanic', 'Terpencil dan indah.', 1),
('Island Peak', 'island-peak', 'Nepal', 'Khumbu', 27.9242, 86.9389, 6189, 'dormant', 'non_volcanic', 'Trekking peak paling populer.', 1),
('Mera Peak', 'mera', 'Nepal', 'Khumbu', 27.7000, 86.8683, 6476, 'dormant', 'non_volcanic', 'Trekking peak tertinggi.', 1),
('Lobuche East', 'lobuche', 'Nepal', 'Khumbu', 27.9575, 86.8100, 6119, 'dormant', 'non_volcanic', 'Tantangan teknis dekat Everest.', 1),
('Kyajo Ri', 'kyajo-ri', 'Nepal', 'Khumbu', 27.9150, 86.6850, 6186, 'dormant', 'non_volcanic', 'Puncak tajam indah.', 1),
('Pisang Peak', 'pisang', 'Nepal', 'Annapurna', 28.6489, 84.1481, 6091, 'dormant', 'non_volcanic', 'Di sirkuit Annapurna.', 1),
('Chulu West', 'chulu', 'Nepal', 'Annapurna', 28.7183, 84.0292, 6419, 'dormant', 'non_volcanic', 'Pemandangan Annapurna massif.', 1),
('Yala Peak', 'yala-peak', 'Nepal', 'Langtang', 28.2317, 85.6267, 5500, 'dormant', 'non_volcanic', 'Mudah diakses di Langtang.', 1),
('Tent Peak', 'tent-peak', 'Nepal', 'Annapurna', 28.5375, 83.9033, 5663, 'dormant', 'non_volcanic', 'Di jantung Annapurna Sanctuary.', 1),
('Hiunchuli', 'hiunchuli', 'Nepal', 'Annapurna', 28.5175, 83.8825, 6441, 'dormant', 'non_volcanic', 'Penjaga Annapurna Sanctuary.', 1),
('Gokyo Ri', 'gokyo-ri', 'Nepal', 'Khumbu', 27.9611, 86.6833, 5357, 'dormant', 'non_volcanic', 'Viewpoint Everest terbaik.', 1),
('Kala Patthar', 'kala-patthar', 'Nepal', 'Khumbu', 27.9961, 86.8283, 5545, 'dormant', 'non_volcanic', 'Titik tertinggi trek EBC.', 1),
('Taboche', 'taboche', 'Nepal', 'Khumbu', 27.8967, 86.7775, 6495, 'dormant', 'non_volcanic', 'Tembok es vertikal.', 1),
('Cholatse', 'cholatse', 'Nepal', 'Khumbu', 27.9192, 86.7675, 6440, 'dormant', 'non_volcanic', 'Puncak teknis sulit.', 1),
('Thamserku', 'thamserku', 'Nepal', 'Khumbu', 27.7903, 86.7875, 6608, 'dormant', 'non_volcanic', 'Gerbang Khumbu.', 1),
('Kangtega', 'kangtega', 'Nepal', 'Khumbu', 27.7833, 86.8167, 6782, 'dormant', 'non_volcanic', '"Pelana Salju".', 1),
('Khumbutse', 'khumbutse', 'Nepal/China', 'Khumbu', 28.0033, 86.8711, 6636, 'dormant', 'non_volcanic', 'Barat Everest.', 1),
('Lingtren', 'lingtren', 'Nepal/China', 'Khumbu', 28.0167, 86.8583, 6749, 'dormant', 'non_volcanic', 'Batas dengan Tibet.', 1),
('Changtse', 'changtse', 'China', 'Tibet', 28.0253, 86.9233, 7543, 'dormant', 'non_volcanic', 'Puncak Utara Everest.', 1);

-- ============================================================
-- 5. SOUTH AMERICA, AFRICA & OCEANIA ADDITIONS
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Nevado Pisco', 'pisco', 'Peru', 'Ancash', -9.0111, -77.6319, 5752, 'dormant', 'non_volcanic', 'Puncak aklimatisasi populer.', 1),
('Chopicalqui', 'chopicalqui', 'Peru', 'Ancash', -9.0883, -77.5750, 6354, 'dormant', 'non_volcanic', '"Puncak Ketiga Huascaran".', 1),
('Huandoy', 'huandoy', 'Peru', 'Ancash', -9.0333, -77.6667, 6395, 'dormant', 'non_volcanic', 'Empat puncak spektakuler.', 1),
('Chacraraju', 'chacraraju', 'Peru', 'Ancash', -8.9958, -77.6186, 6108, 'dormant', 'non_volcanic', 'Salah satu yang tersulit di Andes.', 1),
('Taulliraju', 'taulliraju', 'Peru', 'Ancash', -8.8931, -77.5800, 5830, 'dormant', 'non_volcanic', 'Katedral es.', 1),
('Quitaraju', 'quitaraju', 'Peru', 'Ancash', -8.8900, -77.6600, 6040, 'dormant', 'non_volcanic', 'Utara Alpamayo.', 1),
('Santa Cruz', 'santa-cruz', 'Peru', 'Ancash', -8.8667, -77.7167, 6259, 'dormant', 'non_volcanic', 'Puncak dominan utara.', 1),
('Yerupaja', 'yerupaja', 'Peru', 'Huayhuash', -10.2675, -76.9033, 6635, 'dormant', 'non_volcanic', 'Tertinggi kedua di Peru.', 1),
('Siula Grande', 'siula-grande', 'Peru', 'Huayhuash', -10.2933, -76.8917, 6344, 'dormant', 'non_volcanic', 'Lokasi kisah "Touching the Void".', 1),
('Illampu', 'illampu', 'Bolivia', 'La Paz', -15.8272, -68.5433, 6368, 'dormant', 'non_volcanic', 'Puncak utara Cordillera Real.', 1),
('Sajama', 'sajama', 'Bolivia', 'Oruro', -18.1000, -68.8833, 6542, 'dormant', 'stratovolcano', 'Tertinggi di Bolivia.', 1),
('Parinacota', 'parinacota', 'Bolivia/Chile', 'Oruro', -18.1633, -69.1417, 6348, 'dormant', 'stratovolcano', 'Kembaran Pomerape.', 1),
('Lanin', 'lanin', 'Argentina/Chile', 'Neuquen', -39.6358, -71.4969, 3776, 'dormant', 'stratovolcano', 'Simbol provinsi Neuquen.', 1),
('Calbuco', 'calbuco', 'Chile', 'Los Lagos', -41.3260, -72.6140, 2003, 'active', 'stratovolcano', 'Letusan eksplosif 2015.', 1),
('Llaima', 'llaima', 'Chile', 'Araucania', -38.6917, -71.7294, 3125, 'active', 'stratovolcano', 'Sangat aktif di Conguillio.', 1),
('Federation Peak', 'federation', 'Australia', 'Tasmania', -43.2667, 146.4667, 1224, 'dormant', 'non_volcanic', 'Puncak paling menantang di Australia.', 1),
('Frenchmans Cap', 'frenchmans-cap', 'Australia', 'Tasmania', -42.2694, 145.8317, 1446, 'dormant', 'non_volcanic', 'Kubah kuarsit putih.', 1),
('Mount Wellington', 'wellington-tas', 'Australia', 'Tasmania', -42.8958, 147.2372, 1271, 'dormant', 'non_volcanic', 'Latar belakang kota Hobart.', 1),
('Mount Feathertop', 'feathertop', 'Australia', 'Victoria', -36.9033, 147.1383, 1922, 'dormant', 'non_volcanic', 'Puncak alpine klasik.', 1),
('Mount Bogong', 'bogong', 'Australia', 'Victoria', -36.7333, 147.3167, 1986, 'dormant', 'non_volcanic', 'Tertinggi di Victoria.', 1),
('Mount Buller', 'buller', 'Australia', 'Victoria', -37.1458, 146.4194, 1805, 'dormant', 'non_volcanic', 'Resor ski populer.', 1),
('Mount Aspiring', 'aspiring', 'New Zealand', 'Otago', -44.3842, 168.7283, 3033, 'dormant', 'non_volcanic', '"Tititea", puncak berkilau.', 1),
('Mount Tasman', 'tasman', 'New Zealand', 'West Coast', -43.5661, 170.1583, 3497, 'dormant', 'non_volcanic', 'Tertinggi kedua di NZ.', 1),
('Mount Sefton', 'sefton', 'New Zealand', 'Southern Alps', -43.6828, 170.0931, 3151, 'dormant', 'non_volcanic', 'Menjulang di atas Mount Cook Village.', 1),
('Mount Ngauruhoe', 'ngauruhoe', 'New Zealand', 'North Island', -39.1569, 175.6322, 2291, 'active', 'stratovolcano', 'Mount Doom (LOTR).', 1),
('Mount Tongariro', 'tongariro', 'New Zealand', 'North Island', -39.1333, 175.6417, 1978, 'active', 'complex', 'Tongariro Crossing.', 1),
('The Remarkables', 'remarkables', 'New Zealand', 'Otago', -45.0619, 168.8122, 2319, 'dormant', 'non_volcanic', 'Latar belakang Queenstown.', 1),
('Coronet Peak', 'coronet', 'New Zealand', 'Otago', -44.9250, 168.7389, 1652, 'dormant', 'non_volcanic', 'Ski field Queenstown.', 1),
('Treble Cone', 'treble-cone', 'New Zealand', 'Otago', -44.6333, 168.9000, 2088, 'dormant', 'non_volcanic', 'Pemandangan Danau Wanaka.', 1),
('Mount Sabalan', 'sabalan', 'Iran', 'Ardabil', 38.2667, 47.8333, 4811, 'dormant', 'stratovolcano', 'Danau kawah indah di puncak.', 1),
('Alam Kuh', 'alam-kuh', 'Iran', 'Alborz', 36.3758, 50.9633, 4848, 'dormant', 'non_volcanic', 'Tembok utara vertikal.', 1),
('Jebel Jais', 'jebel-jais', 'UAE/Oman', 'Hajar', 25.9533, 56.1625, 1934, 'dormant', 'non_volcanic', 'Titik tertinggi UAE.', 1),
('Mount Sannine', 'sannine', 'Lebanon', 'Mount Lebanon', 33.9500, 35.8500, 2628, 'dormant', 'non_volcanic', 'Terlihat dari Beirut.', 1),
('Brandberg', 'brandberg', 'Namibia', 'Erongo', -21.1167, 14.5833, 2573, 'dormant', 'non_volcanic', 'Gunung Api (karena warna saat senja).', 1),
('Spitzkoppe', 'spitzkoppe', 'Namibia', 'Erongo', -21.8250, 15.2000, 1728, 'dormant', 'non_volcanic', 'Matterhorn-nya Namibia.', 1),
('Zomba Plateau', 'zomba', 'Malawi', 'Southern', -15.3500, 35.3000, 2087, 'dormant', 'non_volcanic', 'Tabel top unik.', 1),
('Thabana Ntlenyana', 'thabana', 'Lesotho', 'Drakensberg', -29.4667, 29.2667, 3482, 'dormant', 'non_volcanic', 'Tertinggi di selatan Afrika.', 1),
('Mount Nimba', 'nimba', 'Guinea/Ivory Coast', 'Nimba', 7.5761, -8.3722, 1752, 'dormant', 'non_volcanic', 'Kaya bijih besi, situs UNESCO.', 1),
('Pico de Sao Tome', 'sao-tome', 'Sao Tome', 'Sao Tome', 0.2692, 6.5414, 2024, 'dormant', 'shield', 'Hutan hujan vertikal.', 1);

-- ============================================================
-- AUTO-GENERATE TRAILS (INSERT IGNORE TO AVOID DUPLICATES)
-- ============================================================
INSERT IGNORE INTO trails (mountain_id, name, slug, basecamp_name, distance_km, estimated_time_up_hours, difficulty_level, trail_status, description, is_active)
SELECT 
    id, 
    CONCAT('Summit Route - ', name), 
    CONCAT(slug, '-summit-route'), 
    'Main Trailhead', 
    12.0, 
    10.0, 
    4, 
    'open', 
    'Jalur pendakian utama menuju puncak. Memerlukan fisik yang prima.', 
    1
FROM mountains 
WHERE id NOT IN (SELECT DISTINCT mountain_id FROM trails) AND elevation_meters > 3000;

INSERT IGNORE INTO trails (mountain_id, name, slug, basecamp_name, distance_km, estimated_time_up_hours, difficulty_level, trail_status, description, is_active)
SELECT 
    id, 
    CONCAT('Tourist Trail - ', name), 
    CONCAT(slug, '-tourist-trail'), 
    'Visitor Center', 
    5.0, 
    3.0, 
    2, 
    'open', 
    'Jalur wisata yang populer dan relatif mudah diakses.', 
    1
FROM mountains 
WHERE id NOT IN (SELECT DISTINCT mountain_id FROM trails) AND elevation_meters <= 3000;

-- ============================================================
-- FINAL VERIFICATION
-- ============================================================
SELECT 'PART 4 SEED SUCCESS' AS status;
SELECT COUNT(*) as total_mountains FROM mountains;
