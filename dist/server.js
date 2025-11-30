"use strict";
/**
 * API СЕРВЕР - "Лестница союза"
 * Простой Express сервер для использования бэкенда через HTTP
 */
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const API = __importStar(require("./index"));
const app = (0, express_1.default)();
const PORT = process.env.PORT || 3000;
// Middleware
app.use((0, cors_1.default)());
app.use(express_1.default.json());
// Хранилище активных сессий (в production использовать БД)
const sessions = new Map();
// ============================================================================
// ENDPOINTS
// ============================================================================
/**
 * GET /health
 * Проверка что сервер живой
 */
app.get('/health', (req, res) => {
    res.json({
        status: 'ok',
        service: '12union-test',
        version: '2.0.0',
        timestamp: new Date().toISOString(),
    });
});
/**
 * POST /api/test/initialize
 * Начать новый тест
 */
app.post('/api/test/initialize', (req, res) => {
    try {
        const { testMode = 'self', relationshipStatus = 'in_relationship' } = req.body;
        const context = API.initializeTestSession(`session-${Date.now()}-${Math.random()}`, testMode, relationshipStatus);
        sessions.set(context.sessionId, context);
        res.json({
            success: true,
            sessionId: context.sessionId,
            message: 'Тест инициализирован',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: String(error),
        });
    }
});
/**
 * GET /api/test/:sessionId/next-question
 * Получить следующий вопрос
 */
app.get('/api/test/:sessionId/next-question', (req, res) => {
    try {
        const { sessionId } = req.params;
        if (!sessions.has(sessionId)) {
            return res.status(404).json({
                success: false,
                error: 'Сессия не найдена',
            });
        }
        const question = API.getNextTestQuestion(sessionId);
        res.json({
            success: true,
            question,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: String(error),
        });
    }
});
/**
 * POST /api/test/:sessionId/answer
 * Отправить ответ
 */
app.post('/api/test/:sessionId/answer', (req, res) => {
    try {
        const { sessionId } = req.params;
        const { questionId, optionId, responseTime = 5000 } = req.body;
        if (!sessions.has(sessionId)) {
            return res.status(404).json({
                success: false,
                error: 'Сессия не найдена',
            });
        }
        API.submitTestAnswer(sessionId, questionId, optionId, responseTime);
        res.json({
            success: true,
            message: 'Ответ записан',
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: String(error),
        });
    }
});
/**
 * POST /api/test/:sessionId/complete
 * Завершить тест и получить результаты
 */
app.post('/api/test/:sessionId/complete', (req, res) => {
    try {
        const { sessionId } = req.params;
        if (!sessions.has(sessionId)) {
            return res.status(404).json({
                success: false,
                error: 'Сессия не найдена',
            });
        }
        const { result, interpretation } = API.completeTestSession(sessionId);
        sessions.delete(sessionId);
        res.json({
            success: true,
            result,
            interpretation,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: String(error),
        });
    }
});
/**
 * POST /api/compare
 * Сравнить двух людей
 */
app.post('/api/compare', (req, res) => {
    try {
        const { sessionId1, sessionId2 } = req.body;
        const result1 = API.getTestResult(sessionId1);
        const result2 = API.getTestResult(sessionId2);
        if (!result1 || !result2) {
            return res.status(404).json({
                success: false,
                error: 'Один или оба результата не найдены',
            });
        }
        const comparison = API.compareTestResults(sessionId1, sessionId2);
        res.json({
            success: true,
            comparison,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: String(error),
        });
    }
});
/**
 * GET /api/levels
 * Получить все уровни
 */
app.get('/api/levels', (req, res) => {
    try {
        const levels = [];
        for (let i = 1; i <= 12; i++) {
            const def = API.getLevelDefinition(i);
            if (def) {
                levels.push({
                    level: i,
                    name: def.name,
                    description: def.shortDescription,
                    icon: def.icon,
                    color: def.color,
                });
            }
        }
        res.json({
            success: true,
            levels,
        });
    }
    catch (error) {
        res.status(400).json({
            success: false,
            error: String(error),
        });
    }
});
/**
 * GET /
 * Главная страница с документацией
 */
app.get('/', (req, res) => {
    res.send(`
    <!DOCTYPE html>
    <html>
    <head>
      <meta charset="utf-8">
      <title>Лестница союза - API</title>
      <style>
        body { font-family: Arial, sans-serif; max-width: 800px; margin: 50px auto; padding: 20px; }
        h1 { color: #333; }
        .endpoint { background: #f5f5f5; padding: 15px; margin: 10px 0; border-radius: 5px; }
        code { background: #eee; padding: 2px 6px; border-radius: 3px; }
        .method { display: inline-block; padding: 5px 10px; border-radius: 3px; font-weight: bold; margin-right: 10px; }
        .get { background: #61affe; color: white; }
        .post { background: #49cc90; color: white; }
      </style>
    </head>
    <body>
      <h1>🎯 Лестница союза - API</h1>
      <p>Психологический тест зрелости в отношениях</p>

      <h2>API Endpoints</h2>

      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/health</code>
        <p>Проверка статуса сервера</p>
      </div>

      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/api/test/initialize</code>
        <p>Начать новый тест</p>
        <pre>
{
  "testMode": "self",
  "relationshipStatus": "in_relationship"
}
        </pre>
      </div>

      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/api/test/:sessionId/next-question</code>
        <p>Получить следующий вопрос</p>
      </div>

      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/api/test/:sessionId/answer</code>
        <p>Отправить ответ</p>
        <pre>
{
  "questionId": "q-1",
  "optionId": "opt-1",
  "responseTime": 5000
}
        </pre>
      </div>

      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/api/test/:sessionId/complete</code>
        <p>Завершить тест и получить результаты</p>
      </div>

      <div class="endpoint">
        <span class="method post">POST</span>
        <code>/api/compare</code>
        <p>Сравнить двух людей</p>
        <pre>
{
  "sessionId1": "session-...",
  "sessionId2": "session-..."
}
        </pre>
      </div>

      <div class="endpoint">
        <span class="method get">GET</span>
        <code>/api/levels</code>
        <p>Получить все 12 уровней</p>
      </div>

      <h2>Документация</h2>
      <p><a href="https://github.com/sergei-tigrov/12union-test">GitHub Repository</a></p>
      <p><a href="https://github.com/sergei-tigrov/12union-test#readme">README</a></p>
    </body>
    </html>
  `);
});
// Запуск сервера
app.listen(PORT, () => {
    console.log(`🚀 Сервер запущен на порту ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
    console.log(`❤️  API готов к использованию`);
});
exports.default = app;
