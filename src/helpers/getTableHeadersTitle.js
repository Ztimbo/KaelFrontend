const getHeaders = (keys, keyAlias) => {
    const rows = [];

    function createData(name, alias) {
        return { name, alias };
    }

    for(var i = 0; i < keys.length; i++) {
        rows.push(createData(keys[i], keyAlias[i]));
    }

    return rows;
}

export {
    getHeaders
}