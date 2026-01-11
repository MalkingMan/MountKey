/**
 * ============================================================
 * MOUNTKEY - RISK SCORING UTILITIES
 * ============================================================
 * Engine untuk menghitung risk score pendakian.
 * 
 * SCORING WEIGHTS (Total = 100):
 * - Wind:           25 points
 * - Precipitation:  30 points
 * - Temperature:    20 points
 * - Freezing Level: 15 points
 * - Cloud/Visibility: 10 points
 * 
 * RISK LEVELS:
 * - 0-30:   LOW      → SAFE
 * - 31-60:  MEDIUM   → CAUTION
 * - 61-80:  HIGH     → NOT_RECOMMENDED
 * - 81-100: EXTREME  → NOT_RECOMMENDED
 * ============================================================
 */

// ============================================================
// CONFIGURATION
// ============================================================

const WEIGHTS = {
    WIND: 25,
    PRECIPITATION: 30,
    TEMPERATURE: 20,
    FREEZING_LEVEL: 15,
    VISIBILITY: 10
};

const THRESHOLDS = {
    // Wind thresholds (km/h)
    WIND: {
        LOW: 15,      // < 15 = safe
        MEDIUM: 30,   // 15-30 = moderate
        HIGH: 50,     // 30-50 = high
        EXTREME: 70   // > 50 = dangerous
    },

    // Precipitation (mm/hour)
    PRECIPITATION: {
        LOW: 0.5,
        MEDIUM: 2.5,
        HIGH: 7.5,
        EXTREME: 15
    },

    // Precipitation probability (%)
    PRECIP_PROBABILITY: {
        LOW: 20,
        MEDIUM: 50,
        HIGH: 80
    },

    // Temperature (°C) - untuk suhu di puncak
    TEMPERATURE: {
        VERY_COLD: 0,    // < 0 = dangerous
        COLD: 5,         // 0-5 = cold
        COOL: 10,        // 5-10 = cool
        COMFORTABLE: 25  // 10-25 = comfortable
    },

    // Cloud cover (%)
    CLOUD: {
        CLEAR: 20,
        PARTLY: 50,
        CLOUDY: 80,
        OVERCAST: 95
    }
};

const RISK_LEVELS = {
    LOW: { min: 0, max: 30, status: 'SAFE' },
    MEDIUM: { min: 31, max: 60, status: 'CAUTION' },
    HIGH: { min: 61, max: 80, status: 'NOT_RECOMMENDED' },
    EXTREME: { min: 81, max: 100, status: 'NOT_RECOMMENDED' }
};

// ============================================================
// MAIN SCORING FUNCTION
// ============================================================

/**
 * Calculate comprehensive risk score
 * 
 * @param {object} params - Weather and elevation data
 * @param {number} params.windSpeed - Wind speed (km/h)
 * @param {number} params.windGust - Wind gust (km/h)
 * @param {number} params.precipitation - Precipitation (mm)
 * @param {number} params.precipProbability - Precipitation probability (%)
 * @param {number} params.temperature - Corrected temperature at summit (°C)
 * @param {number} params.elevation - Mountain elevation (mdpl)
 * @param {number} params.freezingLevel - Freezing level (mdpl)
 * @param {number} params.cloudCover - Cloud cover (%)
 * @returns {object} { score, level, status, reasons, breakdown }
 */
function calculateRiskScore(params) {
    const {
        windSpeed,
        windGust,
        precipitation,
        precipProbability,
        temperature,
        elevation,
        freezingLevel,
        cloudCover
    } = params;

    // Calculate individual scores
    const windScore = calculateWindScore(windSpeed, windGust);
    const precipScore = calculatePrecipitationScore(precipitation, precipProbability);
    const tempScore = calculateTemperatureScore(temperature);
    const freezingScore = calculateFreezingScore(elevation, freezingLevel);
    const visibilityScore = calculateVisibilityScore(cloudCover);

    // Total score
    const totalScore = Math.round(
        windScore.score +
        precipScore.score +
        tempScore.score +
        freezingScore.score +
        visibilityScore.score
    );

    // Clamp to 0-100
    const clampedScore = Math.max(0, Math.min(100, totalScore));

    // Determine level and status
    const { level, status } = determineLevel(clampedScore);

    // Collect reasons
    const reasons = collectReasons({
        windScore,
        precipScore,
        tempScore,
        freezingScore,
        visibilityScore
    });

    return {
        score: clampedScore,
        level,
        status,
        reasons,
        breakdown: {
            wind: windScore,
            precipitation: precipScore,
            temperature: tempScore,
            freezing: freezingScore,
            visibility: visibilityScore
        }
    };
}

// ============================================================
// INDIVIDUAL SCORE FUNCTIONS
// ============================================================

/**
 * Calculate wind risk score
 * Max: 25 points
 */
function calculateWindScore(speed, gust) {
    const effectiveWind = Math.max(speed || 0, (gust || 0) * 0.7);

    let score = 0;
    let severity = 'LOW';
    let reason = null;

    if (effectiveWind >= THRESHOLDS.WIND.EXTREME) {
        score = WEIGHTS.WIND;
        severity = 'EXTREME';
        reason = `Angin sangat kencang (${Math.round(effectiveWind)} km/jam) - BERBAHAYA`;
    } else if (effectiveWind >= THRESHOLDS.WIND.HIGH) {
        score = WEIGHTS.WIND * 0.8;
        severity = 'HIGH';
        reason = `Angin kencang (${Math.round(effectiveWind)} km/jam)`;
    } else if (effectiveWind >= THRESHOLDS.WIND.MEDIUM) {
        score = WEIGHTS.WIND * 0.5;
        severity = 'MEDIUM';
        reason = `Angin cukup kencang (${Math.round(effectiveWind)} km/jam)`;
    } else if (effectiveWind >= THRESHOLDS.WIND.LOW) {
        score = WEIGHTS.WIND * 0.2;
        severity = 'LOW';
    }

    return { score: Math.round(score), severity, reason, value: effectiveWind };
}

/**
 * Calculate precipitation risk score
 * Max: 30 points
 */
function calculatePrecipitationScore(precipitation, probability) {
    let score = 0;
    let severity = 'LOW';
    let reason = null;

    const precip = precipitation || 0;
    const prob = probability || 0;

    // Score based on actual precipitation
    if (precip >= THRESHOLDS.PRECIPITATION.EXTREME) {
        score = WEIGHTS.PRECIPITATION;
        severity = 'EXTREME';
        reason = `Hujan sangat lebat (${precip} mm) - BERBAHAYA`;
    } else if (precip >= THRESHOLDS.PRECIPITATION.HIGH) {
        score = WEIGHTS.PRECIPITATION * 0.8;
        severity = 'HIGH';
        reason = `Hujan lebat (${precip} mm)`;
    } else if (precip >= THRESHOLDS.PRECIPITATION.MEDIUM) {
        score = WEIGHTS.PRECIPITATION * 0.5;
        severity = 'MEDIUM';
        reason = `Hujan sedang (${precip} mm)`;
    } else if (precip >= THRESHOLDS.PRECIPITATION.LOW) {
        score = WEIGHTS.PRECIPITATION * 0.2;
        severity = 'LOW';
    }

    // Add score based on probability (if no current precipitation)
    if (precip < THRESHOLDS.PRECIPITATION.LOW && prob >= THRESHOLDS.PRECIP_PROBABILITY.HIGH) {
        score = Math.max(score, WEIGHTS.PRECIPITATION * 0.4);
        severity = severity === 'LOW' ? 'MEDIUM' : severity;
        reason = `Kemungkinan hujan tinggi (${prob}%)`;
    } else if (precip < THRESHOLDS.PRECIPITATION.LOW && prob >= THRESHOLDS.PRECIP_PROBABILITY.MEDIUM) {
        score = Math.max(score, WEIGHTS.PRECIPITATION * 0.2);
    }

    return { score: Math.round(score), severity, reason, value: { precip, prob } };
}

/**
 * Calculate temperature risk score
 * Max: 20 points
 */
function calculateTemperatureScore(temperature) {
    let score = 0;
    let severity = 'LOW';
    let reason = null;

    const temp = temperature ?? 15; // Default comfortable

    if (temp < THRESHOLDS.TEMPERATURE.VERY_COLD) {
        score = WEIGHTS.TEMPERATURE;
        severity = 'EXTREME';
        reason = `Suhu di bawah titik beku (${temp}°C) - BERBAHAYA`;
    } else if (temp < THRESHOLDS.TEMPERATURE.COLD) {
        score = WEIGHTS.TEMPERATURE * 0.7;
        severity = 'HIGH';
        reason = `Suhu sangat dingin (${temp}°C)`;
    } else if (temp < THRESHOLDS.TEMPERATURE.COOL) {
        score = WEIGHTS.TEMPERATURE * 0.4;
        severity = 'MEDIUM';
        reason = `Suhu dingin (${temp}°C)`;
    } else if (temp > THRESHOLDS.TEMPERATURE.COMFORTABLE + 10) {
        // Very hot is also risky
        score = WEIGHTS.TEMPERATURE * 0.5;
        severity = 'MEDIUM';
        reason = `Suhu panas (${temp}°C) - risiko dehidrasi`;
    }

    return { score: Math.round(score), severity, reason, value: temp };
}

/**
 * Calculate freezing level risk score
 * Max: 15 points
 */
function calculateFreezingScore(elevation, freezingLevel) {
    let score = 0;
    let severity = 'LOW';
    let reason = null;

    if (freezingLevel === null || freezingLevel === undefined) {
        return { score: 0, severity: 'UNKNOWN', reason: null, value: null };
    }

    const diff = elevation - freezingLevel;

    if (diff > 500) {
        // Summit 500m+ above freezing level
        score = WEIGHTS.FREEZING_LEVEL;
        severity = 'EXTREME';
        reason = `Puncak ${diff}m di atas freezing level - kondisi es/salju`;
    } else if (diff > 200) {
        score = WEIGHTS.FREEZING_LEVEL * 0.7;
        severity = 'HIGH';
        reason = `Puncak di atas freezing level (${freezingLevel}m)`;
    } else if (diff > 0) {
        score = WEIGHTS.FREEZING_LEVEL * 0.4;
        severity = 'MEDIUM';
        reason = `Puncak mendekati freezing level`;
    }

    return { score: Math.round(score), severity, reason, value: freezingLevel };
}

/**
 * Calculate visibility risk score (based on cloud cover)
 * Max: 10 points
 */
function calculateVisibilityScore(cloudCover) {
    let score = 0;
    let severity = 'LOW';
    let reason = null;

    const cloud = cloudCover || 0;

    if (cloud >= THRESHOLDS.CLOUD.OVERCAST) {
        score = WEIGHTS.VISIBILITY;
        severity = 'HIGH';
        reason = `Tertutup awan tebal (${cloud}%) - visibilitas sangat rendah`;
    } else if (cloud >= THRESHOLDS.CLOUD.CLOUDY) {
        score = WEIGHTS.VISIBILITY * 0.6;
        severity = 'MEDIUM';
        reason = `Berawan tebal (${cloud}%)`;
    } else if (cloud >= THRESHOLDS.CLOUD.PARTLY) {
        score = WEIGHTS.VISIBILITY * 0.3;
        severity = 'LOW';
    }

    return { score: Math.round(score), severity, reason, value: cloud };
}

// ============================================================
// HELPER FUNCTIONS
// ============================================================

/**
 * Determine risk level and status from score
 */
function determineLevel(score) {
    if (score <= RISK_LEVELS.LOW.max) {
        return { level: 'LOW', status: RISK_LEVELS.LOW.status };
    } else if (score <= RISK_LEVELS.MEDIUM.max) {
        return { level: 'MEDIUM', status: RISK_LEVELS.MEDIUM.status };
    } else if (score <= RISK_LEVELS.HIGH.max) {
        return { level: 'HIGH', status: RISK_LEVELS.HIGH.status };
    } else {
        return { level: 'EXTREME', status: RISK_LEVELS.EXTREME.status };
    }
}

/**
 * Collect all non-null reasons
 */
function collectReasons(scores) {
    const reasons = [];

    Object.values(scores).forEach(score => {
        if (score.reason) {
            reasons.push(score.reason);
        }
    });

    return reasons;
}

/**
 * Generate recommendations based on risk level
 * 
 * @param {string} level - Risk level (LOW/MEDIUM/HIGH/EXTREME)
 * @param {string[]} reasons - List of risk reasons
 * @returns {object} { summary, advice }
 */
function generateRecommendation(level, reasons) {
    const recommendations = {
        LOW: {
            summary: 'Kondisi cuaca relatif aman untuk pendakian.',
            advice: [
                'Tetap pantau perubahan cuaca',
                'Bawa perlengkapan standar pendakian',
                'Pastikan kondisi fisik prima'
            ]
        },
        MEDIUM: {
            summary: 'Kondisi cuaca memerlukan kewaspadaan ekstra.',
            advice: [
                'Persiapkan perlengkapan hujan dan angin',
                'Bawa pakaian hangat cadangan',
                'Siapkan rencana evakuasi jika cuaca memburuk',
                'Pertimbangkan untuk menunda jika tidak berpengalaman'
            ]
        },
        HIGH: {
            summary: 'Kondisi cuaca berisiko tinggi. Pendakian TIDAK disarankan.',
            advice: [
                'Sangat disarankan menunda pendakian',
                'Jika tetap naik, pastikan tim sangat berpengalaman',
                'Wajib bawa perlengkapan darurat lengkap',
                'Informasikan rencana ke pihak basecamp/SAR',
                'Siap turun kapan saja jika kondisi memburuk'
            ]
        },
        EXTREME: {
            summary: 'Kondisi cuaca BERBAHAYA. Pendakian SANGAT TIDAK disarankan.',
            advice: [
                'JANGAN melakukan pendakian',
                'Tunggu hingga kondisi cuaca membaik',
                'Risiko kecelakaan dan hipotermia sangat tinggi',
                'Konsultasikan dengan petugas setempat'
            ]
        }
    };

    const rec = recommendations[level] || recommendations.MEDIUM;

    // Add specific advice based on reasons
    if (reasons.some(r => r.includes('angin'))) {
        rec.advice.push('Hindari area punggung gunung yang terbuka');
    }
    if (reasons.some(r => r.includes('hujan'))) {
        rec.advice.push('Waspadai jalur licin dan longsor');
    }
    if (reasons.some(r => r.includes('beku') || r.includes('freezing'))) {
        rec.advice.push('Bawa perlengkapan untuk kondisi es/salju');
    }

    return rec;
}

// ============================================================
// EXPORTS
// ============================================================

module.exports = {
    calculateRiskScore,
    generateRecommendation,
    WEIGHTS,
    THRESHOLDS,
    RISK_LEVELS
};
