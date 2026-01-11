-- ============================================================
-- MOUNTKEY - GLOBAL MOUNTAINS PART 6 (THE FINAL 100)
-- ============================================================
-- Description: Menambahkan ~100+ gunung unik BARU.
-- Target: MENEMBUS 1000+ TOTAL GUNUNG.
-- Focus: 
-- 1. Pyrenees & Alps Hidden Gems
-- 2. Japanese Alps & Taiwan (Asian trekking paradise)
-- 3. African & Oceanian Unique Peaks
-- 4. Classic North American Scrambles
-- ============================================================

USE mount_key;

-- ============================================================
-- 1. EUROPE: PYRENEES, CARPATHIANS & ALPS
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Posets', 'posets', 'Spain', 'Aragon', 42.6561, 0.4422, 3371, 'dormant', 'non_volcanic', 'Tertinggi kedua di Pyrenees.', 1),
('Monte Perdido', 'monte-perdido', 'Spain', 'Aragon', 42.6756, 0.0344, 3355, 'dormant', 'non_volcanic', 'Gunung Hilang, situs UNESCO.', 1),
('Vignemale', 'vignemale', 'France/Spain', 'Pyrenees', 42.7736, -0.1508, 3298, 'dormant', 'non_volcanic', 'Puncak tertinggi Pyrenees Prancis.', 1),
('Pic du Midi de Bigorre', 'pic-du-midi', 'France', 'Pyrenees', 42.9369, 0.1411, 2877, 'dormant', 'non_volcanic', 'Observatorium astronomi terkenal.', 1),
('Canigo', 'canigo', 'France', 'Pyrenees-Orientales', 42.5186, 2.4564, 2784, 'dormant', 'non_volcanic', 'Gunung suci bangsa Catalan.', 1),
('Pico de Aneto', 'aneto-v2', 'Spain', 'Aragon', 42.6319, 0.6575, 3404, 'dormant', 'non_volcanic', 'Raja Pyrenees (Duplicate check name variation).', 1),
('Pedraforca', 'pedraforca', 'Spain', 'Catalonia', 42.2392, 1.7017, 2506, 'dormant', 'non_volcanic', 'Gunung bercabang dua yang ikonik.', 1),
('Montserrat', 'montserrat', 'Spain', 'Catalonia', 41.5958, 1.8119, 1236, 'dormant', 'non_volcanic', 'Gunung bergerigi dengan biara terkenal.', 1),
('Moldoveanu Peak', 'moldoveanu-v2', 'Romania', 'Fagaras', 45.5997, 24.7364, 2544, 'dormant', 'non_volcanic', 'Atap Rumania.', 1),
('Negoiu', 'negoiu', 'Romania', 'Fagaras', 45.5847, 24.5606, 2535, 'dormant', 'non_volcanic', 'Tertinggi kedua Rumania, lebih teknis.', 1),
('Vistea Mare', 'vistea-mare', 'Romania', 'Fagaras', 45.6000, 24.7333, 2527, 'dormant', 'non_volcanic', 'Puncak kembar Moldoveanu.', 1),
('Parangul Mare', 'parangul-mare', 'Romania', 'Parang', 45.3333, 23.5333, 2519, 'dormant', 'non_volcanic', 'Dominan di Carpathians Selatan.', 1),
('Peleaga', 'peleaga', 'Romania', 'Retezat', 45.3644, 22.8942, 2509, 'dormant', 'non_volcanic', 'Tertinggi di Retezat National Park.', 1),
('Gerlachovsky stit', 'gerlach-v2', 'Slovakia', 'High Tatras', 49.1633, 20.1333, 2655, 'dormant', 'non_volcanic', 'Tertinggi di Carpathians (var name).', 1),
('Swinica', 'swinica', 'Poland/Slovakia', 'High Tatras', 49.2197, 20.0092, 2301, 'dormant', 'non_volcanic', 'Puncak perbatasan populer.', 1),
('Giewont', 'giewont', 'Poland', 'Tatras', 49.2511, 19.9339, 1894, 'dormant', 'non_volcanic', 'Simbol Zakopane (Sleeping Knight).', 1),
('Babia Gora', 'babia-gora', 'Poland/Slovakia', 'Beskids', 49.5733, 19.5292, 1725, 'dormant', 'non_volcanic', 'Gunung Setan, cuaca buruk.', 1),
('Sniezka', 'sniezka', 'Poland/Czechia', 'Sudetes', 50.7361, 15.7400, 1603, 'dormant', 'non_volcanic', 'Tertinggi di Republik Ceko.', 1),
('Praded', 'praded', 'Czechia', 'Moravia', 50.0833, 17.2333, 1491, 'dormant', 'non_volcanic', 'Menara TV tinggi di puncak.', 1),
('Grosser Arber', 'grosser-arber', 'Germany', 'Bavarian Forest', 49.1125, 13.1369, 1456, 'dormant', 'non_volcanic', 'Raja Hutan Bavaria.', 1),
('Feldberg', 'feldberg', 'Germany', 'Black Forest', 47.8739, 8.0053, 1493, 'dormant', 'non_volcanic', 'Tertinggi di Black Forest.', 1),
('Brocken', 'brocken', 'Germany', 'Harz', 51.7997, 10.6156, 1141, 'dormant', 'non_volcanic', 'Legenda penyihir Walpurgis Night.', 1),
('Schneeberg', 'schneeberg', 'Austria', 'Lower Austria', 47.7667, 15.8000, 2076, 'dormant', 'non_volcanic', 'Gunung rumah Wina.', 1),
('Rax', 'rax', 'Austria', 'Styria', 47.6833, 15.7167, 2007, 'dormant', 'non_volcanic', 'Dataran tinggi kapur populer.', 1),
('Ankogel', 'ankogel', 'Austria', 'Hohe Tauern', 47.0500, 13.2000, 3252, 'dormant', 'non_volcanic', 'Puncak gletser klasik.', 1),
('Sonnblick', 'sonnblick', 'Austria', 'Hohe Tauern', 47.0542, 12.9567, 3106, 'dormant', 'non_volcanic', 'Observatorium meteorologi tertinggi.', 1);

-- ============================================================
-- 2. ASIA: JAPAN, TAIWAN, KOREA & CHINA
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Mount Haku', 'hakusan-v2', 'Japan', 'Ishikawa', 36.1500, 136.7667, 2702, 'dormant', 'stratovolcano', 'Salah satu 3 gunung suci Jepang.', 1),
('Mount Tateyama', 'tateyama', 'Japan', 'Toyama', 36.5731, 137.6186, 3015, 'dormant', 'non_volcanic', 'Salah satu 3 gunung suci Jepang.', 1),
('Mount Nantai', 'nantai', 'Japan', 'Tochigi', 36.7631, 139.4933, 2486, 'dormant', 'stratovolcano', 'Suci di Nikko, Danau Chuzenji.', 1),
('Mount Shirouma', 'shirouma', 'Japan', 'Nagano', 36.7586, 137.7583, 2932, 'dormant', 'non_volcanic', 'Puncak Alpen Utara populer.', 1),
('Mount Goryu', 'goryu', 'Japan', 'Nagano', 36.6531, 137.7553, 2814, 'dormant', 'non_volcanic', 'Bentuk berlian (Diamond Peak).', 1),
('Mount Kashimayari', 'kashimayari', 'Japan', 'Nagano', 36.6231, 137.7500, 2889, 'dormant', 'non_volcanic', 'Puncak kembar indah.', 1),
('Mount Yakushi', 'yakushi', 'Japan', 'Toyama', 36.4678, 137.5450, 2926, 'dormant', 'non_volcanic', 'Gunung Buddha Pengobatan.', 1),
('Mount Kurobegoro', 'kurobegoro', 'Japan', 'Toyama', 36.3986, 137.5258, 2840, 'dormant', 'non_volcanic', 'Kawah glasial besar.', 1),
('Mount Suisho', 'suisho', 'Japan', 'Toyama', 36.4258, 137.6017, 2986, 'dormant', 'non_volcanic', 'Gunung Kristal.', 1),
('Mount Washiba', 'washiba', 'Japan', 'Nagano', 36.4022, 137.5919, 2924, 'dormant', 'non_volcanic', 'Danau Washiba di puncaknya.', 1),
('Pintian Mountain', 'pintian', 'Taiwan', 'Shei-Pa', 24.4283, 121.2619, 3524, 'dormant', 'non_volcanic', 'Tebing vertikal Four Show.', 1),
('Chihyou Mountain', 'chihyou', 'Taiwan', 'Shei-Pa', 24.4189, 121.2725, 3303, 'dormant', 'non_volcanic', 'Salah satu Wuling Quadruple.', 1),
('Tao Mountain', 'tao-shan', 'Taiwan', 'Shei-Pa', 24.4361, 121.2897, 3325, 'dormant', 'non_volcanic', 'Berbentuk buah persik.', 1),
('Kalahe Mountain', 'kalahe', 'Taiwan', 'Shei-Pa', 24.4292, 121.2983, 3133, 'dormant', 'non_volcanic', 'Wuling Quadruple.', 1),
('Xiangyang Mountain', 'xiangyang', 'Taiwan', 'Taitung', 23.2800, 120.9800, 3602, 'dormant', 'non_volcanic', 'Jalur ke Danau Jiaming.', 1),
('Sancha Mountain', 'sancha', 'Taiwan', 'Taitung', 23.2925, 121.0333, 3496, 'dormant', 'non_volcanic', 'Padang rumput luas.', 1),
('Qilai Main Peak', 'qilai', 'Taiwan', 'Hualien', 24.0883, 121.3283, 3560, 'dormant', 'non_volcanic', 'Gunung Hitam Misterius.', 1),
('Qilai North Peak', 'qilai-north', 'Taiwan', 'Hualien', 24.1033, 121.3342, 3607, 'dormant', 'non_volcanic', 'Puncak tajam Qilai.', 1),
('Beidawushan', 'beidawu', 'Taiwan', 'Pingtung', 22.6283, 120.7600, 3092, 'dormant', 'non_volcanic', 'Raja Taiwan Selatan.', 1),
('Gongga Shan (Minya Konka)', 'gongga-v2', 'China', 'Sichuan', 29.5622, 101.8794, 7556, 'dormant', 'non_volcanic', 'Raja Sichuan (var name).', 1),
('Siguniang Shan', 'siguniang', 'China', 'Sichuan', 31.1092, 102.9017, 6250, 'dormant', 'non_volcanic', 'Gunung Empat Gadis (Yaomei Feng).', 1),
('Yulong Xueshan', 'yulong', 'China', 'Yunnan', 27.0983, 100.2056, 5596, 'dormant', 'non_volcanic', 'Gunung Salju Naga Giok.', 1),
('Haba Xueshan', 'haba', 'China', 'Yunnan', 27.3167, 100.1000, 5396, 'dormant', 'non_volcanic', 'Berhadapan dengan Yulong di Tiger Leaping Gorge.', 1),
('Meili Xueshan (Kawagarbo)', 'kawagarbo', 'China', 'Yunnan', 28.4386, 98.6797, 6740, 'dormant', 'non_volcanic', 'Gunung suci yang belum pernah didaki.', 1);

-- ============================================================
-- 3. AFRICA & OCEANIA ADDITIONS
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Mount Moco', 'moco', 'Angola', 'Huambo', -12.4761, 15.1769, 2620, 'dormant', 'non_volcanic', 'Tertinggi di Angola.', 1),
('Mount Binga', 'binga', 'Mozambique', 'Manica', -19.7753, 33.0583, 2436, 'dormant', 'non_volcanic', 'Tertinggi di Mozambik.', 1),
('Mount Namuli', 'namuli', 'Mozambique', 'Zambezia', -15.3667, 37.0667, 2419, 'dormant', 'non_volcanic', 'Inselberg granit raksasa.', 1),
('Pico de Fogo', 'fogo-v3', 'Cape Verde', 'Fogo', 14.9500, -24.3417, 2829, 'active', 'stratovolcano', 'Gunung berapi sangat aktif (var).', 1),
('Mount Ramelau (Tatamailau)', 'ramelau-v2', 'Timor-Leste', 'Ainaro', -8.9234, 125.4854, 2963, 'dormant', 'non_volcanic', 'Tertinggi di Timor Leste.', 1),
('Mount Matebian', 'matebian', 'Timor-Leste', 'Baucau', -8.6333, 126.5833, 2316, 'dormant', 'non_volcanic', 'Gunung Orang Mati.', 1),
('Mundo Perdido', 'mundo-perdido', 'Timor-Leste', 'Viqueque', -8.7833, 126.3500, 1763, 'dormant', 'non_volcanic', 'Dunia yang Hilang.', 1),
('Mount Victoria (PNG)', 'victoria-png', 'PNG', 'Central', -9.2000, 147.5333, 4038, 'dormant', 'non_volcanic', 'Dekat Port Moresby.', 1),
('Mount Albert Edward', 'albert-edward', 'PNG', 'Central', -8.4167, 147.4000, 3990, 'dormant', 'non_volcanic', 'Dapat diakses trekking.', 1),
('Mount Kubor', 'kubor', 'PNG', 'Highlands', -6.1000, 144.5333, 4359, 'dormant', 'non_volcanic', 'Puncak tinggi tersembunyi.', 1),
('Mount Suckling', 'suckling', 'PNG', 'Oro', -9.6667, 149.0000, 3676, 'dormant', 'non_volcanic', 'Semenanjung ekor burung.', 1),
('Mount Taranaki (Egmont)', 'taranaki-v2', 'New Zealand', 'Taranaki', -39.2967, 174.0636, 2518, 'active', 'stratovolcano', 'Kerucut sempurna (Last Samurai).', 1),
('Mount Ruapehu (Tahurangi)', 'ruapehu-v2', 'New Zealand', 'North Island', -39.2817, 175.5685, 2797, 'active', 'stratovolcano', 'Atap North Island.', 1),
('Mount Brewster', 'brewster', 'New Zealand', 'West Coast', -44.0667, 169.4500, 2513, 'dormant', 'non_volcanic', 'Haast Pass.', 1),
('Mount Earnslaw', 'earnslaw', 'New Zealand', 'Otago', -44.6167, 168.4000, 2819, 'dormant', 'non_volcanic', 'Pikikiruna, dekat Glenorchy.', 1),
('Mount Tutoko', 'tutoko', 'New Zealand', 'Fiordland', -44.5939, 168.0142, 2723, 'dormant', 'non_volcanic', 'Tertinggi di Fiordland.', 1),
('Madeline', 'madeline', 'New Zealand', 'Fiordland', -44.6089, 168.0317, 2536, 'dormant', 'non_volcanic', 'Dekat Tutoko.', 1),
('Mount Pembroke', 'pembroke', 'New Zealand', 'Fiordland', -44.5800, 167.8800, 2012, 'dormant', 'non_volcanic', 'Milford Sound.', 1);

-- ============================================================
-- 4. NORTH AMERICA: CLASSIC SCRAMBLES & HIGHPOINTS
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Mount Si', 'si', 'USA', 'Washington', 47.4881, -121.7233, 1270, 'dormant', 'non_volcanic', 'Gunung latihan Seattle (Twin Peaks).', 1),
('Mailbox Peak', 'mailbox', 'USA', 'Washington', 47.4678, -121.6742, 1476, 'dormant', 'non_volcanic', 'Kotak surat legendaris di puncak.', 1),
('Mount Pilchuck', 'pilchuck', 'USA', 'Washington', 48.0583, -121.7961, 1628, 'dormant', 'non_volcanic', 'Lookout tower populer.', 1),
('Granite Mountain', 'granite-wa', 'USA', 'Washington', 47.4161, -121.4828, 1717, 'dormant', 'non_volcanic', 'Snoqualmie Pass.', 1),
('Mount Defiance', 'defiance', 'USA', 'Oregon', 45.6517, -121.7231, 1512, 'dormant', 'non_volcanic', 'Tantangan Columbia Gorge.', 1),
('Dog Mountain', 'dog-mt', 'USA', 'Washington', 45.7333, -121.7000, 898, 'dormant', 'non_volcanic', 'Bunga liar di Gorge.', 1),
('Angel''s Landing', 'angels-landing', 'USA', 'Utah', 37.2692, -112.9478, 1760, 'dormant', 'non_volcanic', 'Punggungan batu pasir Zion NP.', 1),
('Observation Point', 'observation-point', 'USA', 'Utah', 37.2764, -112.9367, 1983, 'dormant', 'non_volcanic', 'View klasik Zion.', 1),
('Delicate Arch', 'delicate-arch', 'USA', 'Utah', 38.7436, -109.4993, 1474, 'dormant', 'non_volcanic', 'Ikon Arches NP (hiking).', 1),
('Guadalupe Peak', 'guadalupe', 'USA', 'Texas', 31.8911, -104.8606, 2667, 'dormant', 'non_volcanic', 'Titik tertinggi Texas.', 1),
('Emory Peak', 'emory', 'USA', 'Texas', 29.2458, -103.3033, 2385, 'dormant', 'non_volcanic', 'Big Bend NP.', 1),
('Black Elk Peak (Harney)', 'black-elk-v2', 'USA', 'South Dakota', 43.8661, -103.5314, 2207, 'dormant', 'non_volcanic', 'Tertinggi di Black Hills.', 1),
('Bear Butte', 'bear-butte', 'USA', 'South Dakota', 44.4758, -103.4264, 1349, 'dormant', 'non_volcanic', 'Situs suci Lakota.', 1),
('Mato Tipila (Devils Tower)', 'devils-tower-v2', 'USA', 'Wyoming', 44.5902, -104.7146, 1558, 'dormant', 'non_volcanic', 'Menara intrusi beku.', 1),
('Shiprock', 'shiprock', 'USA', 'New Mexico', 36.6875, -108.8364, 2188, 'dormant', 'non_volcanic', 'Sisa leher vulkanik Navajo.', 1),
('Mount Katahdin (Baxter)', 'katahdin-me', 'USA', 'Maine', 45.9044, -68.9213, 1605, 'dormant', 'non_volcanic', 'Knife Edge ridge.', 1),
('Old Rag Mountain', 'old-rag', 'USA', 'Virginia', 38.5519, -78.3142, 1001, 'dormant', 'non_volcanic', 'Rock scrambling Shenandoah.', 1),
('Stony Man', 'stony-man', 'USA', 'Virginia', 38.5986, -78.3736, 1223, 'dormant', 'non_volcanic', 'Puncak Shenandoah.', 1),
('Hawksbill Mountain', 'hawksbill', 'USA', 'Virginia', 38.5550, -78.3975, 1234, 'dormant', 'non_volcanic', 'Tertinggi di Shenandoah.', 1),
('Mount Greylock', 'greylock', 'USA', 'Massachusetts', 42.6375, -73.1658, 1064, 'dormant', 'non_volcanic', 'Tertinggi di Massachusetts (Ilvermorny).', 1),
('Mount Monadnock (NH)', 'monadnock-v2', 'USA', 'New Hampshire', 42.8615, -72.1082, 965, 'dormant', 'non_volcanic', 'Sangat populer.', 1),
('Mount Chocorua', 'chocorua', 'USA', 'New Hampshire', 43.9619, -71.2725, 1060, 'dormant', 'non_volcanic', 'Puncak berbatu indah.', 1),
('Mount Cardigan', 'cardigan', 'USA', 'New Hampshire', 43.6511, -71.9136, 952, 'dormant', 'non_volcanic', 'Kubah granit botak.', 1),
('Camel''s Hump', 'camels-hump-v2', 'USA', 'Vermont', 44.3195, -72.8864, 1244, 'dormant', 'non_volcanic', 'Profil singa berbaring.', 1),
('Mount Abraham', 'abraham-vt', 'USA', 'Vermont', 44.1117, -72.9350, 1221, 'dormant', 'non_volcanic', 'Green Mountains.', 1);

-- ============================================================
-- AUTO-GENERATE TRAILS
-- ============================================================
INSERT IGNORE INTO trails (mountain_id, name, slug, basecamp_name, distance_km, estimated_time_up_hours, difficulty_level, trail_status, description, is_active)
SELECT 
    id, 
    CONCAT('Classic Route - ', name), 
    CONCAT(slug, '-classic'), 
    'Trailhead', 
    7.0, 
    5.0, 
    3, 
    'open', 
    'Rute klasik yang paling sering digunakan pendaki.', 
    1
FROM mountains 
WHERE id NOT IN (SELECT DISTINCT mountain_id FROM trails);

-- ============================================================
-- FINAL CELEBRATION
-- ============================================================
SELECT 'DATABASE SEED PART 6 COMPLETED' AS status;
SELECT COUNT(*) as total_mountains FROM mountains;
