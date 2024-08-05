
const express = require('express');
const router = express.Router();
const axios = require('axios');
const cacheService = require('../services/cacheService');

const CAT_API_URL = 'https://api.thecatapi.com/v1/images/search?limit=10';
const CAT_API_URL_BY_ID = 'http://localhost:3000/api/cats/';  // Base URL for fetching by ID

/**
 * @swagger
 * tags:
 *   name: cats
 *   description: Операции с ресурсом "cats"
 */

/**
 * @swagger
 *
 * /cats:
 *   get:
 *     summary: Загрузить элементы или получить список всех элементов в случае их отсутствия
 *     tags:
 *       - cats
 *     responses:
 *       200:
 *         description: Список всех элементов
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       id:
 *                         type: integer
 */
router.get('/cats', async (req, res) => {
    const cacheKey = 'cats';
    if (cacheService.has(cacheKey)) {
        return res.json(cacheService.get(cacheKey));
    }
    try {
        const response = await axios.get(CAT_API_URL);
        const data = response.data;
        cacheService.set(cacheKey, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cat images' });
    }
});

/**
 * @swagger
 *
 * /items/{id}:
 *   get:
 *     summary: Получить элемент по ID
 *     tags:
 *       - cats
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       200:
 *         description: Запрашиваемый элемент
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 item:
 *                   type: object
 *                   properties:
 *                     id:
 *                       type: integer
 */
router.get('/cats/:id', async (req, res) => {
    const { id } = req.params;
    if (cacheService.has(id)) {
        return res.json(cacheService.get(id));
    }
    try {
        const response = await axios.get(`${CAT_API_URL_BY_ID}${id}`);
        const data = response.data;
        cacheService.set(id, data);
        res.json(data);
    } catch (error) {
        res.status(500).json({ error: 'Failed to fetch cat image by ID' });
    }
});

/**
 * @swagger
 *
 * /items/{id}:
 *   delete:
 *     summary: Удалить элемент по ID
 *     tags:
 *       - cats
 *     parameters:
 *       - name: id
 *         in: path
 *         required: true
 *         schema:
 *           type: integer
 *     responses:
 *       204:
 *         description: Успешное удаление записи
 */
router.delete('/cats/:id', (req, res) => {
    const { id } = req.params;
    if (cacheService.has(id)) {
        cacheService.delete(id);
        res.status(200).json({ message: `Cache entry for ID ${id} deleted` });
    } else {
        res.status(404).json({ error: `No cache entry found for ID ${id}` });
    }
});

// Route to clear the cache
router.delete('/cache', (req, res) => {
    cacheService.clear();
    res.status(200).json({ message: 'Cache cleared' });
});

// Route to set the cache size
router.post('/cache/size', (req, res) => {
    const { size } = req.body;
    if (typeof size === 'number' && size > 0) {
        cacheService.setSize(size);
        res.status(200).json({ message: `Cache size set to ${size}` });
    } else {
        res.status(400).json({ error: 'Invalid cache size' });
    }
});

module.exports = router;
