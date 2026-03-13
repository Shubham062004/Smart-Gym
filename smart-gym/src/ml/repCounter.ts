export const calculateAngle = (a: any, b: any, c: any) => {
    const radians = Math.atan2(c.y - b.y, c.x - b.x) - Math.atan2(a.y - b.y, a.x - b.x);
    let angle = Math.abs((radians * 180.0) / Math.PI);
    if (angle > 180.0) angle = 360 - angle;
    return angle;
};

export const checkRep = (currentAngle: number, threshold: number, state: 'up' | 'down') => {
    if (state === 'up' && currentAngle < threshold) {
        return 'down';
    }
    if (state === 'down' && currentAngle > threshold + 20) {
        return 'up'; // Rep completed
    }
    return state;
};
