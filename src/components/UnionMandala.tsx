import React from 'react';
import { motion } from 'framer-motion';
import { DimensionsScore } from '../types';

interface UnionMandalaProps {
    scores: DimensionsScore;
}

export const UnionMandala: React.FC<UnionMandalaProps> = ({ scores }) => {
    // Normalize scores to 0-100 range (just in case)
    const safety = Math.min(100, Math.max(0, scores.safety));
    const connection = Math.min(100, Math.max(0, scores.connection));
    const growth = Math.min(100, Math.max(0, scores.growth));
    const mission = Math.min(100, Math.max(0, scores.mission));

    // SVG Configuration
    const size = 300;
    const center = size / 2;
    const radius = 100; // Radius of the chart area

    // Calculate points
    // Top: Safety
    const pSafety = {
        x: center,
        y: center - (radius * safety) / 100
    };

    // Right: Connection
    const pConnection = {
        x: center + (radius * connection) / 100,
        y: center
    };

    // Bottom: Growth
    const pGrowth = {
        x: center,
        y: center + (radius * growth) / 100
    };

    // Left: Mission
    const pMission = {
        x: center - (radius * mission) / 100,
        y: center
    };

    // Polygon path
    const pathData = `M ${pSafety.x} ${pSafety.y} L ${pConnection.x} ${pConnection.y} L ${pGrowth.x} ${pGrowth.y} L ${pMission.x} ${pMission.y} Z`;

    // Axis labels
    const labels: { text: string; x: number; y: number; align: "middle" | "start" | "end" }[] = [
        { text: 'БЕЗОПАСНОСТЬ', x: center, y: center - radius - 20, align: 'middle' },
        { text: 'БЛИЗОСТЬ', x: center + radius + 20, y: center + 5, align: 'start' },
        { text: 'РОСТ', x: center, y: center + radius + 25, align: 'middle' },
        { text: 'МИССИЯ', x: center - radius - 20, y: center + 5, align: 'end' }
    ];

    // Grid circles (25%, 50%, 75%, 100%)
    const circles = [25, 50, 75, 100].map(p => ({
        r: (radius * p) / 100,
        opacity: p === 100 ? 0.3 : 0.1
    }));

    return (
        <div className="flex flex-col items-center justify-center p-4 bg-white/5 rounded-2xl backdrop-blur-sm border border-white/10">
            <h3 className="text-xl font-semibold text-white mb-4">Мандала Союза</h3>
            <p className="text-sm text-gray-400 mb-6 text-center max-w-xs">
                Баланс энергий в ваших отношениях по 4 ключевым измерениям
            </p>

            <div className="relative w-full max-w-[350px] aspect-square">
                <svg viewBox={`0 0 ${size} ${size}`} className="w-full h-full overflow-visible">
                    {/* Background Grid */}
                    {circles.map((circle, i) => (
                        <circle
                            key={i}
                            cx={center}
                            cy={center}
                            r={circle.r}
                            fill="none"
                            stroke="white"
                            strokeOpacity={circle.opacity}
                            strokeWidth="1"
                        />
                    ))}

                    {/* Axes */}
                    <line x1={center} y1={center - radius} x2={center} y2={center + radius} stroke="white" strokeOpacity="0.1" />
                    <line x1={center - radius} y1={center} x2={center + radius} y2={center} stroke="white" strokeOpacity="0.1" />

                    {/* Data Polygon */}
                    <motion.path
                        d={pathData}
                        fill="rgba(124, 58, 237, 0.4)" // Violet-500 with opacity
                        stroke="#8b5cf6" // Violet-500
                        strokeWidth="2"
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 1, ease: "easeOut" }}
                    />

                    {/* Data Points */}
                    {[pSafety, pConnection, pGrowth, pMission].map((p, i) => (
                        <motion.circle
                            key={i}
                            cx={p.x}
                            cy={p.y}
                            r="4"
                            fill="#fff"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ delay: 0.5 + i * 0.1 }}
                        />
                    ))}

                    {/* Labels */}
                    {labels.map((label, i) => (
                        <text
                            key={i}
                            x={label.x}
                            y={label.y}
                            textAnchor={label.align}
                            fill="rgba(255,255,255,0.7)"
                            fontSize="10"
                            fontWeight="500"
                            className="uppercase tracking-wider"
                        >
                            {label.text}
                        </text>
                    ))}
                </svg>
            </div>

            {/* Legend / Scores */}
            <div className="grid grid-cols-2 gap-4 mt-6 w-full max-w-xs">
                <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg">
                    <span className="text-xs text-gray-400 uppercase">Безопасность</span>
                    <span className="text-lg font-bold text-blue-400">{safety}%</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg">
                    <span className="text-xs text-gray-400 uppercase">Близость</span>
                    <span className="text-lg font-bold text-pink-400">{connection}%</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg">
                    <span className="text-xs text-gray-400 uppercase">Рост</span>
                    <span className="text-lg font-bold text-green-400">{growth}%</span>
                </div>
                <div className="flex flex-col items-center p-2 bg-white/5 rounded-lg">
                    <span className="text-xs text-gray-400 uppercase">Миссия</span>
                    <span className="text-lg font-bold text-purple-400">{mission}%</span>
                </div>
            </div>
        </div>
    );
};
