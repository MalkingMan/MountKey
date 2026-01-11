const { normalizePrecipitation, normalizeRainDays, normalizeWindSpeed, normalizeColdDays } = require('../utils/normalizationUtils');

/**
 * Memproses raw data harian menjadi statistik bulanan (Jan-Des)
 * Rata-rata selama 5 tahun.
 */
function aggregateMonthlyData(dailyData) {
    // Inisialisasi akumulator untuk 12 bulan (0 = Jan, 11 = Des)
    const monthlyStats = Array.from({ length: 12 }, () => ({
        count: 0,
        precipSum: 0,
        rainDays: 0, // Days > 1mm precipitation
        windSum: 0,
        coldDays: 0, // Days < 5 deg C
        tempSum: 0
    }));

    const { time, precipitation_sum, wind_speed_10m_max, temperature_2m_min } = dailyData;

    // Iterate through all days
    for (let i = 0; i < time.length; i++) {
        const date = new Date(time[i]);
        const monthIndex = date.getMonth(); // 0-11

        const precip = precipitation_sum[i] || 0;
        const wind = wind_speed_10m_max[i] || 0;
        const tempMin = temperature_2m_min[i] || 0;

        monthlyStats[monthIndex].count++;
        monthlyStats[monthIndex].precipSum += precip;
        monthlyStats[monthIndex].windSum += wind;
        monthlyStats[monthIndex].tempSum += tempMin; // Just for info

        if (precip >= 1.0) monthlyStats[monthIndex].rainDays++;
        if (tempMin < 5.0) monthlyStats[monthIndex].coldDays++;
    }

    // Hitung Rata-rata Bulanan
    // Perhatikan: precipSum adalah total per bulan, bukan rata-rata harian.
    // Tapi karena data kita 5 tahun, monthlyStats[0].precipSum adalah total hujan 5x Januari.
    // Kita ingin "Rata-rata Curah Hujan Bulanan".
    // Jumlah tahun approx = count / 30.

    return monthlyStats.map((stat, index) => {
        const yearsApprox = stat.count / 30.5; // Estimasi jumlah tahun data

        return {
            month: index + 1,
            avg_precipitation: stat.precipSum / yearsApprox,
            avg_rain_days: stat.rainDays / yearsApprox,
            avg_wind_speed_max: stat.windSum / stat.count, // Rata-rata harian
            avg_cold_days: stat.coldDays / yearsApprox
        };
    });
}

/**
 * Menghitung Score Risiko per Bulan
 */
function calculateRiskScores(monthlyData) {
    return monthlyData.map(m => {
        const scoreP = normalizePrecipitation(m.avg_precipitation) * 0.4;
        const scoreR = normalizeRainDays(m.avg_rain_days) * 0.2;
        const scoreW = normalizeWindSpeed(m.avg_wind_speed_max) * 0.2;
        const scoreC = normalizeColdDays(m.avg_cold_days) * 0.2;

        const totalScore = (scoreP + scoreR + scoreW + scoreC) * 100; // Scale 0-100

        return {
            ...m,
            risk_score: parseFloat(totalScore.toFixed(1)),
            components: { scoreP, scoreR, scoreW, scoreC }
        };
    });
}

/**
 * Menentukan Rentang Musim Terbaik dan Terburuk
 */
function determineSeasons(scoredMonths) {
    // Sort copy array by score
    const sorted = [...scoredMonths].sort((a, b) => a.risk_score - b.risk_score);

    // Best Season: Ambil 4 bulan dengan skor terendah
    // Lalu cari yang berurutan (sequence)
    // Sederhana: Ambil bulan dengan skor mutlak terendah sebagai pusat Best Season
    // Kita asumsikan musim biasanya 3-4 bulan.

    const bestMonth = sorted[0]; // Lowest risk
    const worstMonth = sorted[sorted.length - 1]; // Highest risk

    // Helper untuk mencari rentang tetangga
    // (Simplifikasi: Ambil bulan ini +/- 1 atau 2 bulan, lalu cek skornya)

    // Logic untuk Best Season Range (3 bulan)
    // Cari window 3 bulan dengan sum score terendah
    let bestRange = findBestWindow(scoredMonths, 3, 'min');

    // Logic untuk Worst Season Range (3 bulan)
    // Cari window 3 bulan dengan sum score tertinggi
    let worstRange = findBestWindow(scoredMonths, 3, 'max');

    return {
        best_season_start: bestRange.start,
        best_season_end: bestRange.end,
        worst_season_start: worstRange.start,
        worst_season_end: worstRange.end,
        details: scoredMonths
    };
}

// Cari window n-bulan dengan total skor min/max (Handling cyclical Dec -> Jan)
function findBestWindow(months, windowSize, type) {
    let bestSum = type === 'min' ? Infinity : -Infinity;
    let startMonth = 1;

    // Months 0-11
    for (let i = 0; i < 12; i++) {
        let currentSum = 0;
        for (let k = 0; k < windowSize; k++) {
            let idx = (i + k) % 12; // Wrap around (Dec -> Jan)
            currentSum += months[idx].risk_score;
        }

        if (type === 'min') {
            if (currentSum < bestSum) {
                bestSum = currentSum;
                startMonth = months[i].month;
            }
        } else {
            if (currentSum > bestSum) {
                bestSum = currentSum;
                startMonth = months[i].month;
            }
        }
    }

    let endMonth = startMonth + windowSize - 1;
    if (endMonth > 12) endMonth -= 12;

    return { start: startMonth, end: endMonth, sum: bestSum };
}

module.exports = {
    aggregateMonthlyData,
    calculateRiskScores,
    determineSeasons
};
