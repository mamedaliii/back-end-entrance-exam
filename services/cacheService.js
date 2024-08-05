
class CacheService {
    constructor(size = 5) {  // Кеш на 5 элементов
        this.cache = new Map();
        this.size = size;
    }

    // Check if the key exists in cache
    has(key) {
        return this.cache.has(key);
    }

    // Get the value by key from cache
    get(key) {
        if (this.cache.has(key)) {
            return this.cache.get(key);
        }
        return null;
    }

    // Add or update value in cache
    set(key, value) {
        if (this.cache.size >= this.size) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
        this.cache.set(key, value);
    }

    // Delete a specific key from cache
    delete(key) {
        return this.cache.delete(key);
    }

    // Clear the cache
    clear() {
        this.cache.clear();
    }

    // Change the size of the cache
    setSize(size) {
        this.size = size;
        while (this.cache.size > this.size) {
            const firstKey = this.cache.keys().next().value;
            this.cache.delete(firstKey);
        }
    }
}

module.exports = new CacheService();
