const cache = new Map();

export const cacheMiddleware = (duration: number) => {
    return (req: any, res: any, next: any) => {
        const key = req.originalUrl || req.url;
        const cachedResponse = cache.get(key);

        if (cachedResponse && Date.now() < cachedResponse.expiry) {
            return res.status(200).json(cachedResponse.data);
        }

        res.sendResponse = res.json;
        res.json = (body: any) => {
            cache.set(key, {
                data: body,
                expiry: Date.now() + (duration * 1000)
            });
            res.sendResponse(body);
        };
        next();
    };
};
