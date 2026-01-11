/**
 * Utility untuk normalisasi data cuaca ke skala risiko 0-1
 * 0 = Low Risk (Good for hiking)
 * 1 = High Risk (Bad for hiking)
 */

function normalize(value, min, max) {
    if (value <= min) return 0;
    if (value >= max) return 1;
    return (value - min) / (max - min);
}

module.exports = {
    // Normalisasi Curah Hujan Bulanan (Sum)
    // 0mm = Aman, 400mm++ = Sangat Basah (Risk 1.0)
    normalizePrecipitation: (val) => normalize(val, 0, 400),

    // Normalisasi Jumlah Hari Hujan (>1mm)
    // 0 hari = Aman, 25 hari++ = Hujan Terus (Risk 1.0)
    normalizeRainDays: (val) => normalize(val, 0, 25),

    // Normalisasi Kecepatan Angin Maks (Rata-rata max bulanan)
    // 10 km/h = Tenang, 60 km/h++ = Badai (Risk 1.0)
    normalizeWindSpeed: (val) => normalize(val, 10, 60),

    // Normalisasi Jumlah Hari Dingin Ekstrem (< 5 derajat Celcius)
    // 0 hari = Aman, 20 hari++ = Resiko Hipotermia Tinggi (Risk 1.0)
    normalizeColdDays: (val) => normalize(val, 0, 20)
};
