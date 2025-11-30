/**
 * ОПРЕДЕЛЕНИЯ 12 УРОВНЕЙ ЛЕСТНИЦЫ СОЮЗА
 * Полная психологическая система
 */
import { LevelDefinition, UnionLevel } from './types';
export declare const LEVEL_DEFINITIONS: Record<UnionLevel, LevelDefinition>;
export declare function getLevelDefinition(level: UnionLevel): LevelDefinition;
export declare function getLevelName(level: UnionLevel): string;
export declare function getLevelIcon(level: UnionLevel): string;
export declare function getLevelColor(level: UnionLevel): string;
