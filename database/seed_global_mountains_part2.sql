-- ============================================================
-- MOUNTKEY - GLOBAL MOUNTAINS PART 2 (300 ADDITIONAL PEAKS)
-- ============================================================
-- Description: Menambahkan 300 gunung unik BARU (tidak ada di Part 1).
-- Focus: Andes 6000m+, Alps 4000m+, Rockies, Himalaya 7000m+.
-- ============================================================

USE mount_key;

-- ============================================================
-- 1. SOUTH AMERICA: THE ANDES GIANTS
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Bonete', 'bonete', 'Argentina', 'La Rioja', -28.0186, -68.7556, 6759, 'dormant', 'non_volcanic', 'Salah satu gunung tertinggi di Amerika.', 1),
('Tres Cruces', 'tres-cruces', 'Chile/Argentina', 'Atacama', -27.1000, -68.7833, 6749, 'dormant', 'stratovolcano', 'Massif vulkanik raksasa dengan tiga puncak.', 1),
('Llullaillaco', 'llullaillaco', 'Chile/Argentina', 'Salta', -24.7200, -68.5367, 6739, 'dormant', 'stratovolcano', 'Situs arkeologi tertinggi di dunia (mumi Inca).', 1),
('Mercedario', 'mercedario', 'Argentina', 'San Juan', -31.9725, -70.1131, 6720, 'dormant', 'non_volcanic', 'Raksasa masif di sebelah utara Aconcagua.', 1),
('Walther Penck', 'walther-penck', 'Argentina', 'Catamarca', -27.2000, -68.5500, 6658, 'dormant', 'stratovolcano', 'Kompleks vulkanik besar di gurun tinggi.', 1),
('Incahuasi', 'incahuasi', 'Argentina/Chile', 'Catamarca', -27.0333, -68.2833, 6621, 'dormant', 'stratovolcano', '"Rumah Inca". Puncak 6000m yang populer.', 1),
('Tupungato', 'tupungato', 'Argentina/Chile', 'Mendoza', -33.3500, -69.7667, 6570, 'dormant', 'stratovolcano', 'Kubah salju besar yang terlihat dari Santiago.', 1),
('El Muerto', 'el-muerto', 'Argentina/Chile', 'Atacama', -27.0575, -68.4892, 6488, 'dormant', 'stratovolcano', '"Si Mati". Berdampingan dengan Ojos del Salado.', 1),
('Antofalla', 'antofalla', 'Argentina', 'Catamarca', -25.5625, -67.6111, 6440, 'active', 'stratovolcano', 'Gunung berapi aktif masif di Puna de Atacama.', 1),
('Ausangate', 'ausangate', 'Peru', 'Cusco', -13.7886, -71.2294, 6384, 'dormant', 'non_volcanic', 'Gunung suci utama di wilayah Cusco.', 1),
('Ampato', 'ampato', 'Peru', 'Arequipa', -15.8200, -71.8800, 6288, 'dormant', 'stratovolcano', 'Tempat ditemukannya mumi "Juanita".', 1),
('Salkantay', 'salkantay', 'Peru', 'Cusco', -13.3333, -72.5333, 6271, 'dormant', 'non_volcanic', 'Puncak liar di dekat Machu Picchu.', 1),
('Copa', 'copa', 'Peru', 'Ancash', -9.2689, -77.5819, 6188, 'dormant', 'non_volcanic', 'Puncak es masif di Cordillera Blanca.', 1),
('Tocllaraju', 'tocllaraju', 'Peru', 'Ancash', -9.3467, -77.5611, 6034, 'dormant', 'non_volcanic', 'Puncak piramida klasik tujuan pendaki es.', 1),
('Artesonraju', 'artesonraju', 'Peru', 'Ancash', -8.9564, -77.6253, 6025, 'dormant', 'non_volcanic', 'Diduga inspirasi logo Paramount Pictures.', 1),
('Uturuncu', 'uturuncu', 'Bolivia', 'Potosi', -22.2500, -67.1833, 6008, 'active', 'stratovolcano', 'Gunung 6000m yang mudah diakses.', 1),
('Acotango', 'acotango', 'Bolivia/Chile', 'Oruro', -18.3831, -69.0492, 6052, 'dormant', 'stratovolcano', 'Bagian dari grup vulkanik Kimsa Chata.', 1),
('Pomerape', 'pomerape', 'Bolivia/Chile', 'Oruro', -18.1250, -69.1333, 6282, 'dormant', 'stratovolcano', 'Kembar Parinacota.', 1),
('Chachani', 'chachani', 'Peru', 'Arequipa', -16.1914, -71.5303, 6057, 'dormant', 'stratovolcano', 'Salah satu 6000 yang paling mudah didaki.', 1),
('Pissis', 'monte-pissis', 'Argentina', 'La Rioja', -27.7561, -68.7967, 6793, 'dormant', 'stratovolcano', 'Gunung berapi terbesar kedua di dunia.', 1),
('Nacimiento', 'nacimiento', 'Argentina', 'San Juan', -27.2833, -68.5333, 6436, 'dormant', 'non_volcanic', 'Puncak terjal di Andes kering.', 1),
('Veladero', 'veladero', 'Argentina', 'La Rioja', -28.1167, -68.9667, 6436, 'dormant', 'stratovolcano', 'Di wilayah pertambangan emas tinggi.', 1),
('Palermo', 'palermo', 'Argentina', 'Salta', -24.7500, -66.4167, 6184, 'dormant', 'non_volcanic', 'Puncak tinggi pegunungan Cachi.', 1),
('Tronador', 'tronador', 'Chile/Argentina', 'Patagonia', -41.1611, -71.8889, 3491, 'dormant', 'stratovolcano', '"Sang Guntur", karena suara gletser runtuh.', 1),
('San Valentin', 'san-valentin', 'Chile', 'Aysen', -46.5958, -73.3458, 4058, 'dormant', 'non_volcanic', 'Puncak tertinggi di Patagonia selatan.', 1),
('Darwin', 'monte-darwin', 'Chile', 'Tierra del Fuego', -54.7558, -69.4800, 2488, 'dormant', 'non_volcanic', 'Tertinggi di Tierra del Fuego.', 1),
('Sarmiento', 'sarmiento', 'Chile', 'Magallanes', -54.4500, -70.8333, 2246, 'dormant', 'non_volcanic', 'Gunung es indah di ujung benua.', 1),
('Corcovado', 'corcovado', 'Chile', 'Los Lagos', -43.1883, -72.7958, 2300, 'active', 'stratovolcano', 'Terkenal menantang di hutan hujan.', 1),
('Hudson', 'cerro-hudson', 'Chile', 'Aysen', -45.9000, -72.9667, 1905, 'active', 'stratovolcano', 'Letusan besar 1991.', 1),
('Chaiten', 'chaiten', 'Chile', 'Los Lagos', -42.8328, -72.6469, 1122, 'active', 'caldera', 'Bangun dari tidur panjang tahun 2008.', 1);

-- ============================================================
-- 2. NORTH AMERICA: ROCKIES, CASCADES & SIERRAS
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Mount Foraker', 'foraker', 'USA', 'Alaska', 62.9606, -151.3997, 5304, 'dormant', 'non_volcanic', 'Tetangga Denali, "Sultana".', 1),
('Mount Bona', 'bona', 'USA', 'Alaska', 61.3856, -141.7494, 5044, 'dormant', 'stratovolcano', 'Gunung berapi tertinggi di AS.', 1),
('Mount Blackburn', 'blackburn', 'USA', 'Alaska', 61.7306, -143.4031, 4996, 'dormant', 'non_volcanic', 'Puncak es kuno di Wrangell.', 1),
('Mount Sanford', 'sanford', 'USA', 'Alaska', 62.2139, -144.1292, 4949, 'dormant', 'shield', 'Raksasa perisai vulkanik.', 1),
('Mount Vancouver', 'vancouver', 'Canada/USA', 'Yukon', 60.3542, -139.6967, 4812, 'dormant', 'non_volcanic', 'Puncak perbatasan massif.', 1),
('Mount Churchill', 'churchill', 'USA', 'Alaska', 61.4194, -141.7472, 4766, 'dormant', 'stratovolcano', 'Sumber White River Ash.', 1),
('Mount Bear', 'bear', 'USA', 'Alaska', 61.2844, -141.1433, 4520, 'dormant', 'non_volcanic', 'Puncak terpencil es.', 1),
('Mount Hunter', 'hunter', 'USA', 'Alaska', 62.9503, -151.0911, 4442, 'dormant', 'non_volcanic', 'Salah satu dari "tiga besar" Alaska Range.', 1),
('Mount Alverstone', 'alverstone', 'USA/Canada', 'Alaska', 60.3511, -139.0744, 4420, 'dormant', 'non_volcanic', 'Puncak perbatasan tajam.', 1),
('University Peak', 'university', 'USA', 'Alaska', 61.3328, -141.7867, 4410, 'dormant', 'non_volcanic', 'Tebing es curam.', 1),
('Mount Williamson', 'williamson', 'USA', 'California', 36.6559, -118.3111, 4381, 'dormant', 'non_volcanic', 'Kedua tertinggi di Sierra Nevada.', 1),
('White Mountain Peak', 'white-mountain', 'USA', 'California', 37.6341, -118.2557, 4344, 'dormant', 'non_volcanic', 'Puncak gurun tinggi.', 1),
('North Palisade', 'north-palisade', 'USA', 'California', 37.0944, -118.5144, 4341, 'dormant', 'non_volcanic', 'Puncak teknis Sierra.', 1),
('Mount Massive', 'massive', 'USA', 'Colorado', 39.1873, -106.4754, 4398, 'dormant', 'non_volcanic', 'Pesaing Elbert.', 1),
('Mount Harvard', 'harvard', 'USA', 'Colorado', 38.9244, -106.3206, 4395, 'dormant', 'non_volcanic', 'Collegiate Peak tertinggi.', 1),
('Blanca Peak', 'blanca', 'USA', 'Colorado', 37.5775, -105.4856, 4372, 'dormant', 'non_volcanic', 'Puncak suci Navajo.', 1),
('La Plata Peak', 'la-plata', 'USA', 'Colorado', 39.0294, -106.4729, 4370, 'dormant', 'non_volcanic', 'Puncak perak.', 1),
('Uncompahgre Peak', 'uncompahgre', 'USA', 'Colorado', 38.0717, -107.4622, 4361, 'dormant', 'non_volcanic', 'Bentuk unik miring.', 1),
('Crestone Peak', 'crestone', 'USA', 'Colorado', 37.9669, -105.5853, 4357, 'dormant', 'non_volcanic', 'Tantangan pendaki Colorado.', 1),
('Mount Lincoln', 'lincoln', 'USA', 'Colorado', 39.3514, -106.1114, 4354, 'dormant', 'non_volcanic', 'Democrat-Lincoln-Bross loop.', 1),
('Longs Peak', 'longs', 'USA', 'Colorado', 40.2549, -105.6160, 4346, 'dormant', 'non_volcanic', 'Raja Rocky Mountain NP.', 1),
('Mount Wilson', 'wilson-co', 'USA', 'Colorado', 37.8392, -107.9917, 4342, 'dormant', 'non_volcanic', 'Puncak teknis San Juan.', 1),
('Mount Sneffels', 'sneffels', 'USA', 'Colorado', 38.0036, -107.7923, 4315, 'dormant', 'non_volcanic', 'Pemandangan terindah di Colorado.', 1),
('Capitol Peak', 'capitol', 'USA', 'Colorado', 39.1503, -107.0829, 4307, 'dormant', 'non_volcanic', 'Knife Edge ridge yang terkenal.', 1),
('Mount Adams', 'adams', 'USA', 'Washington', 46.2024, -121.4909, 3742, 'active', 'stratovolcano', 'Gunung terbesar kedua di WA.', 1),
('Mount Baker', 'baker', 'USA', 'Washington', 48.7766, -121.8143, 3286, 'active', 'stratovolcano', 'Rekor curah salju dunia.', 1),
('Glacier Peak', 'glacier-peak', 'USA', 'Washington', 48.1125, -121.1138, 3213, 'active', 'stratovolcano', 'Vulkanik terpencil.', 1),
('Mount Jefferson', 'jefferson', 'USA', 'Oregon', 44.6743, -121.7996, 3199, 'dormant', 'stratovolcano', 'Puncak tajam Oregon.', 1),
('Three Sisters', 'three-sisters', 'USA', 'Oregon', 44.1034, -121.7692, 3157, 'dormant', 'stratovolcano', 'Trio vulkanik.', 1),
('Lassen Peak', 'lassen', 'USA', 'California', 40.4881, -121.5050, 3187, 'active', 'dome', 'Kubah lava terbesar.', 1);

-- ============================================================
-- 3. EUROPE: ALPS & PYRENEES GEMS
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Dom', 'dom', 'Switzerland', 'Pennine Alps', 46.0942, 7.8586, 4545, 'dormant', 'non_volcanic', 'Gunung tertinggi sepenuhnya di Swiss.', 1),
('Liskamm', 'liskamm', 'Switzerland/Italy', 'Pennine Alps', 45.9221, 7.8310, 4527, 'dormant', 'non_volcanic', '"Pemakan Manusia".', 1),
('Weisshorn', 'weisshorn', 'Switzerland', 'Pennine Alps', 46.1011, 7.7119, 4506, 'dormant', 'non_volcanic', 'Piramida putih sempurna.', 1),
('Täschhorn', 'taschhorn', 'Switzerland', 'Pennine Alps', 46.0826, 7.8789, 4491, 'dormant', 'non_volcanic', 'Salah satu 4000m tersulit.', 1),
('Dent Blanche', 'dent-blanche', 'Switzerland', 'Pennine Alps', 46.0333, 7.6000, 4357, 'dormant', 'non_volcanic', '"Gigi Putih".', 1),
('Grand Combin', 'grand-combin', 'Switzerland', 'Pennine Alps', 45.9390, 7.2917, 4314, 'dormant', 'non_volcanic', 'Massif es terisolasi.', 1),
('Finsteraarhorn', 'finsteraarhorn', 'Switzerland', 'Bernese Alps', 46.5372, 8.1261, 4274, 'dormant', 'non_volcanic', 'Raja Bernese Oberland.', 1),
('Aletschhorn', 'aletschhorn', 'Switzerland', 'Bernese Alps', 46.4656, 7.9944, 4193, 'dormant', 'non_volcanic', 'Di atas gletser Aletsch.', 1),
('Barre des Écrins', 'barre-des-ecrins', 'France', 'Dauphiné Alps', 44.9219, 6.3639, 4102, 'dormant', 'non_volcanic', 'Puncak paling selatan 4000m.', 1),
('Gran Paradiso', 'gran-paradiso-peak', 'Italy', 'Graian Alps', 45.5192, 7.2721, 4061, 'dormant', 'non_volcanic', 'Satu-satunya 4000m full Italia.', 1),
('Piz Bernina', 'piz-bernina', 'Switzerland', 'Bernina', 46.3822, 9.9081, 4049, 'dormant', 'non_volcanic', 'Raja Alpen Timur.', 1),
('Weissmies', 'weissmies', 'Switzerland', 'Pennine Alps', 46.1264, 8.0136, 4017, 'dormant', 'non_volcanic', '4000m ramah pemula.', 1),
('Lagginhorn', 'lagginhorn', 'Switzerland', 'Pennine Alps', 46.1558, 8.0039, 4010, 'dormant', 'non_volcanic', 'Tanpa gletser ke puncak.', 1),
('Piz Zupò', 'piz-zupo', 'Switzerland/Italy', 'Bernina', 46.3686, 9.9317, 3996, 'dormant', 'non_volcanic', 'Puncak perbatasan indah.', 1),
('La Meije', 'la-meije', 'France', 'Dauphiné Alps', 45.0044, 6.3075, 3984, 'dormant', 'non_volcanic', 'Puncak terakhir ditaklukkan di Alpen.', 1),
('Mönch', 'monch', 'Switzerland', 'Bernese Alps', 46.5586, 7.9994, 4107, 'dormant', 'non_volcanic', '"Si Biarawan", tetangga Eiger.', 1),
('Schreckhorn', 'schreckhorn', 'Switzerland', 'Bernese Alps', 46.5892, 8.0814, 4078, 'dormant', 'non_volcanic', '"Gunung Teror". Sangat curam.', 1),
('Ortler', 'ortler', 'Italy', 'Ortler Alps', 46.5239, 10.5936, 3905, 'dormant', 'non_volcanic', 'Tertinggi di Tyrol Selatan.', 1),
('Wildspitze', 'wildspitze', 'Austria', 'Ötztal Alps', 46.8853, 10.8672, 3768, 'dormant', 'non_volcanic', 'Tertinggi kedua Austria.', 1),
('Piz Palü', 'piz-palu', 'Switzerland/Italy', 'Bernina', 46.3789, 9.9575, 3900, 'dormant', 'non_volcanic', 'Tiga pilar es terkenal.', 1),
('Monte Viso', 'monte-viso', 'Italy', 'Cottian Alps', 44.6675, 7.0906, 3841, 'dormant', 'non_volcanic', 'Inspirasi logo Paramount (versi lain).', 1),
('Grande Casse', 'grande-casse', 'France', 'Vanoise', 45.4092, 6.8483, 3855, 'dormant', 'non_volcanic', 'Puncak tertinggi Vanoise.', 1),
('Mont Pourri', 'mont-pourri', 'France', 'Vanoise', 45.5292, 6.8617, 3779, 'dormant', 'non_volcanic', '"Gunung Busuk".', 1),
('Aiguille du Midi', 'aiguille-du-midi', 'France', 'Mont Blanc', 45.8794, 6.8872, 3842, 'dormant', 'non_volcanic', 'Kereta gantung tertinggi.', 1),
('Les Dru', 'les-dru', 'France', 'Mont Blanc', 45.9403, 6.9467, 3754, 'dormant', 'non_volcanic', 'Jarum granit spektakuler.', 1),
('Grandes Jorasses', 'grandes-jorasses', 'France/Italy', 'Mont Blanc', 45.8675, 6.9856, 4208, 'dormant', 'non_volcanic', 'Dinding utara legendaris.', 1),
('Dent du Géant', 'dent-du-geant', 'France/Italy', 'Mont Blanc', 45.8625, 6.9508, 4013, 'dormant', 'non_volcanic', '"Gigi Raksasa".', 1),
('Tre Cime di Lavaredo', 'tre-cime', 'Italy', 'Dolomites', 46.6186, 12.3028, 2999, 'dormant', 'non_volcanic', 'Tiga Menara ikonik.', 1),
('Civetta', 'civetta', 'Italy', 'Dolomites', 46.3756, 12.0392, 3220, 'dormant', 'non_volcanic', 'Tembok batu raksasa.', 1),
('Sella Towers', 'sella-towers', 'Italy', 'Dolomites', 46.5083, 11.7667, 3152, 'dormant', 'non_volcanic', 'Benteng batu.', 1);

-- ============================================================
-- 4. ASIA: HIMALAYA GIANTS & CENTRAL ASIA
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Gyachung Kang', 'gyachung-kang', 'Nepal/China', 'Himalaya', 28.0981, 86.7258, 7952, 'dormant', 'non_volcanic', 'Tertinggi di antara 7000m.', 1),
('Annapurna II', 'annapurna-ii', 'Nepal', 'Himalaya', 28.5358, 84.1217, 7937, 'dormant', 'non_volcanic', 'Puncak terpisah dari Annapurna I.', 1),
('Gasherbrum III', 'gasherbrum-iii', 'Pakistan/China', 'Karakoram', 35.7583, 76.6433, 7946, 'dormant', 'non_volcanic', 'Puncak teknis Karakoram.', 1),
('Gasherbrum IV', 'gasherbrum-iv', 'Pakistan', 'Karakoram', 35.7594, 76.6164, 7925, 'dormant', 'non_volcanic', '"The Shining Wall" - dinding barat.', 1),
('Himalchuli', 'himalchuli', 'Nepal', 'Himalaya', 28.4342, 84.6375, 7893, 'dormant', 'non_volcanic', 'Selatan Manaslu.', 1),
('Distaghil Sar', 'distaghil-sar', 'Pakistan', 'Karakoram', 36.3253, 75.1883, 7885, 'dormant', 'non_volcanic', 'Tertinggi di Hispar Muztagh.', 1),
('Ngadi Chuli', 'ngadi-chuli', 'Nepal', 'Himalaya', 28.5033, 84.5675, 7871, 'dormant', 'non_volcanic', 'Puncak 29.', 1),
('Nuptse', 'nuptse', 'Nepal', 'Himalaya', 27.9667, 86.8833, 7861, 'dormant', 'non_volcanic', 'Dinding selatan Everest.', 1),
('Khunyang Chhish', 'khunyang-chhish', 'Pakistan', 'Karakoram', 36.2058, 75.2086, 7852, 'dormant', 'non_volcanic', 'Puncak besar Hispar.', 1),
('Masherbrum', 'masherbrum', 'Pakistan', 'Karakoram', 35.6333, 76.4333, 7821, 'dormant', 'non_volcanic', 'K1 (Karakoram 1).', 1),
('Nanda Devi East', 'nanda-devi-east', 'India', 'Garhwal', 30.3667, 80.0167, 7434, 'dormant', 'non_volcanic', 'Adik Nanda Devi.', 1),
('Rakaposhi', 'rakaposhi', 'Pakistan', 'Karakoram', 36.1425, 74.4925, 7788, 'dormant', 'non_volcanic', 'Dinding es raksasa di Hunza.', 1),
('Batura Sar', 'batura-sar', 'Pakistan', 'Karakoram', 36.5267, 74.5242, 7795, 'dormant', 'non_volcanic', 'Tembok Batura.', 1),
('Kanjut Sar', 'kanjut-sar', 'Pakistan', 'Karakoram', 36.2053, 75.4175, 7760, 'dormant', 'non_volcanic', 'Puncak salju tajam.', 1),
('Saltoro Kangri', 'saltoro-kangri', 'India/Pakistan', 'Karakoram', 35.4000, 76.9500, 7742, 'dormant', 'non_volcanic', 'Puncak tertinggi Saltoro.', 1),
('Jannu', 'jannu', 'Nepal', 'Himalaya', 27.6828, 88.0458, 7710, 'dormant', 'non_volcanic', 'Kumbhakarna, dinding utara menakutkan.', 1),
('Molamenqing', 'molamenqing', 'China', 'Himalaya', 28.3522, 85.8053, 7703, 'dormant', 'non_volcanic', 'Timur Shishapangma.', 1),
('Gurla Mandhata', 'gurla-mandhata', 'China', 'Himalaya', 30.4353, 81.2986, 7694, 'dormant', 'non_volcanic', 'Berseberangan dengan Kailash.', 1),
('Saser Kangri I', 'saser-kangri', 'India', 'Karakoram', 34.8667, 77.7500, 7672, 'dormant', 'non_volcanic', 'Raja Saser Muztagh.', 1),
('Chogolisa', 'chogolisa', 'Pakistan', 'Karakoram', 35.6131, 76.5742, 7665, 'dormant', 'non_volcanic', 'Atap Puncak Pengantin.', 1),
('Kongur Tagh', 'kongur-tagh', 'China', 'Pamir', 38.5936, 75.3122, 7649, 'dormant', 'non_volcanic', 'Tertinggi di Pamir China.', 1),
('Muztagh Ata', 'muztagh-ata', 'China', 'Pamir', 38.2758, 75.1161, 7546, 'dormant', 'non_volcanic', '"Bapak Gunung Es". Populer untuk ski.', 1),
('Skyang Kangri', 'skyang-kangri', 'Pakistan/China', 'Karakoram', 35.9281, 76.5681, 7545, 'dormant', 'non_volcanic', 'Tangga ke Surga.', 1),
('Pumori', 'pumori', 'Nepal/China', 'Himalaya', 28.0147, 86.8281, 7161, 'dormant', 'non_volcanic', '"Anak Perempuan Everest".', 1),
('Tilicho Peak', 'tilicho', 'Nepal', 'Himalaya', 28.6833, 83.8000, 7134, 'dormant', 'non_volcanic', 'Di atas Danau Tilicho.', 1),
('Baruntse', 'baruntse', 'Nepal', 'Himalaya', 27.8711, 86.9806, 7162, 'dormant', 'non_volcanic', 'Di antara Everest dan Makalu.', 1),
('Gauri Sankar', 'gauri-sankar', 'Nepal/China', 'Himalaya', 27.9542, 86.3364, 7134, 'dormant', 'non_volcanic', 'Gunung suci ganda.', 1),
('Nun', 'nun', 'India', 'Himalaya', 33.9822, 76.0125, 7135, 'dormant', 'non_volcanic', 'Pasangan Kun.', 1),
('Kun', 'kun', 'India', 'Himalaya', 34.0164, 76.0547, 7077, 'dormant', 'non_volcanic', 'Populer untuk ekspedisi.', 1),
('Pauhunri', 'pauhunri', 'India/China', 'Himalaya', 27.9214, 88.8433, 7128, 'dormant', 'non_volcanic', 'Donkya Range.', 1);

-- ============================================================
-- 5. AFRICA & OTHERS (Ethiopia, volcanic islands)
-- ============================================================
INSERT IGNORE INTO mountains (name, slug, province, regency, latitude, longitude, elevation_meters, mountain_status, mountain_type, description, is_active) VALUES
('Mount Bwahit', 'bwahit', 'Ethiopia', 'Simien', 13.2500, 38.2167, 4430, 'dormant', 'non_volcanic', 'Puncak kedua Simien.', 1),
('Tullu Demtu', 'tullu-demtu', 'Ethiopia', 'Bale', 6.8111, 39.7231, 4377, 'dormant', 'non_volcanic', 'Habitat Serigala Ethiopia.', 1),
('Mount Guna', 'guna', 'Ethiopia', 'Amhara', 11.7167, 38.2333, 4120, 'dormant', 'shield', 'Gunung perisai masif.', 1),
('Mount Choqa', 'choqa', 'Ethiopia', 'Gojjam', 10.7167, 37.8500, 4100, 'dormant', 'shield', 'Tanpa hutan, pertanian tinggi.', 1),
('Mount Batu', 'batu', 'Ethiopia', 'Bale', 6.9167, 39.7333, 4307, 'dormant', 'non_volcanic', 'Puncak berbatu.', 1),
('Amba Alagi', 'amba-alagi', 'Ethiopia', 'Tigray', 12.9806, 39.5703, 3438, 'dormant', 'non_volcanic', 'Benteng alami bersejarah.', 1),
('Mount Hanang', 'hanang', 'Tanzania', 'Manyara', -4.4333, 35.4000, 3420, 'active', 'stratovolcano', 'Gunung suci suku Barabaig.', 1),
('Mount Loolmalasin', 'loolmalasin', 'Tanzania', 'Ngorongoro', -2.8667, 35.8000, 3682, 'dormant', 'shield', 'Kawah raksasa.', 1),
('Mount Satima', 'satima', 'Kenya', 'Aberdare', -0.3667, 36.6333, 4001, 'dormant', 'non_volcanic', 'Tertinggi di Aberdare.', 1),
('Kinangop', 'kinangop', 'Kenya', 'Aberdare', -0.6306, 36.7089, 3906, 'dormant', 'non_volcanic', 'Puncak kembar.', 1),
('Mount Elgon (Wagagai)', 'wagagai', 'Uganda', 'Border', 1.1167, 34.5333, 4321, 'dormant', 'caldera', 'Puncak tertinggi Elgon.', 1),
('Mount Moroto', 'moroto', 'Uganda', 'Karamoja', 2.5333, 34.7667, 3083, 'dormant', 'non_volcanic', 'Perbatasan kering.', 1),
('Mount Kadam', 'kadam', 'Uganda', 'Karamoja', 1.7667, 34.7000, 3063, 'dormant', 'non_volcanic', 'Piramida terisolasi.', 1),
('Mount Muhabura', 'muhabura', 'Rwanda/Uganda', 'Virunga', -1.3833, 29.6833, 4127, 'dormant', 'stratovolcano', 'Pemandu jalan.', 1),
('Mount Gahinga', 'gahinga', 'Rwanda/Uganda', 'Virunga', -1.3917, 29.6417, 3474, 'dormant', 'stratovolcano', 'Tumpukan batu vulkanik.', 1),
('Mount Sabinyo', 'sabinyo', 'Rwanda/Uganda', 'Virunga', -1.3889, 29.5917, 3645, 'dormant', 'stratovolcano', '"Gigi Orang Tua".', 1),
('Mount Bisoke', 'bisoke', 'Rwanda/DRC', 'Virunga', -1.4617, 29.4850, 3711, 'active', 'stratovolcano', 'Danau kawah populer.', 1),
('Mikeno', 'mikeno', 'DRC', 'Virunga', -1.4667, 29.4167, 4437, 'dormant', 'stratovolcano', 'Sulit didaki, gorila.', 1),
('Pico Basilé', 'basile', 'Equatorial Guinea', 'Bioko', 3.5883, 8.7619, 3011, 'active', 'shield', 'Tertinggi di Eq. Guinea.', 1),
('Mount Fako', 'fako', 'Cameroon', 'Southwest', 4.2000, 9.1700, 4040, 'active', 'stratovolcano', 'Nama lokal Mt Cameroon.', 1),
('Mount Oku', 'oku', 'Cameroon', 'Bamenda', 6.2000, 10.5167, 3011, 'active', 'stratovolcano', 'Danau Oku di kawah.', 1),
('Pic Toussidé', 'tousside', 'Chad', 'Tibesti', 21.0400, 16.4500, 3265, 'active', 'stratovolcano', 'Kawah Trou au Natron.', 1),
('Tarso Voon', 'tarso-voon', 'Chad', 'Tibesti', 20.9167, 17.2833, 3100, 'dormant', 'stratovolcano', 'Kaldera besar.', 1),
('Koussi', 'koussi', 'Chad', 'Tibesti', 19.8000, 18.5300, 3415, 'dormant', 'shield', 'Atap Sahara.', 1),
('Jabal Marrah', 'jabal-marrah', 'Sudan', 'Darfur', 12.9333, 24.2167, 3042, 'dormant', 'caldera', 'Inti Darfur.', 1),
('Mount Ramlo', 'ramlo', 'Eritrea', 'Southern', 13.3917, 41.8333, 2248, 'active', 'stratovolcano', 'Tertinggi di Eritrea.', 1),
('Karthala', 'karthala', 'Comoros', 'Grande Comore', -11.7500, 43.3600, 2361, 'active', 'shield', 'Sangat aktif.', 1),
('Maromokotro', 'maromokotro', 'Madagascar', 'Tsaratanana', -14.0217, 48.9667, 2876, 'dormant', 'non_volcanic', 'Tertinggi di Madagaskar.', 1),
('Piton des Neiges', 'piton-neiges', 'Reunion', 'Indian Ocean', -21.0997, 55.4800, 3069, 'dormant', 'shield', '"Puncak Salju".', 1),
('Piton de la Fournaise', 'piton-fournaise', 'Reunion', 'Indian Ocean', -21.2425, 55.7089, 2632, 'active', 'shield', 'Tungku Api.', 1);

-- ============================================================
-- AUTO-GENERATE TRAILS
-- ============================================================
INSERT IGNORE INTO trails (mountain_id, name, slug, basecamp_name, distance_km, estimated_time_up_hours, difficulty_level, trail_status, description, is_active)
SELECT 
    id, 
    CONCAT('Expedition Route - ', name), 
    CONCAT(slug, '-exp-route'), 
    'Advance Base Camp', 
    15.0, 
    24.0, 
    5, 
    'open', 
    'Jalur ekspedisi teknis. Membutuhkan peralatan lengkap dan pengalaman tinggi.', 
    1
FROM mountains 
WHERE id NOT IN (SELECT DISTINCT mountain_id FROM trails) AND elevation_meters > 6000;

INSERT IGNORE INTO trails (mountain_id, name, slug, basecamp_name, distance_km, estimated_time_up_hours, difficulty_level, trail_status, description, is_active)
SELECT 
    id, 
    CONCAT('Standard Trek - ', name), 
    CONCAT(slug, '-std-trek'), 
    'Trailhead', 
    8.0, 
    6.0, 
    3, 
    'open', 
    'Jalur pendakian umum. Cek cuaca sebelum berangkat.', 
    1
FROM mountains 
WHERE id NOT IN (SELECT DISTINCT mountain_id FROM trails) AND elevation_meters <= 6000;

-- ============================================================
-- VERIFIKASI
-- ============================================================
SELECT 'PART 2 SEED COMPLETED' AS status;
SELECT COUNT(*) as total_mountains FROM mountains;
