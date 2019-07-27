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