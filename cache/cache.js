const cache_data = {};

function updatehCache (id, key, value) {
    return new Promise((resv, rej) => {
        if (!cache_data[id]) {
            cache_data[id] = {};
        }
        cache_data[id][key] = value;
        resv(1);
    });
}

function resetCacheById (key) {
    return new Promise((resv, rej) => {
        cache_data[key] = 0;
        resv(1);
    });
}

function getCacheById (key) {
    return new Promise((resv, rej) => {
        const res = cache_data[key] ? cache_data[key] : 0;
        resv(res);
    });
}

function gethAllCache (id) {
    return new Promise((resv, rej) => {
        const res = Object.keys(cache_data[id]);
        resv(res);
    });
}

function inrcCache (key) {
    return new Promise((resv, rej) => {
        if (!cache_data[key]) {
            cache_data[key] = 0;
        }
        cache_data[key]++;
        resv(1);
    });
}

function updateCache (key, value) {
    return new Promise((resv, rej) => {
        cache_data[key] = value;
        resv(1);
    });
}

module.exports = {
    updatehCache,
    resetCacheById,
    getCacheById,
    gethAllCache,
    updateCache,
    inrcCache
};