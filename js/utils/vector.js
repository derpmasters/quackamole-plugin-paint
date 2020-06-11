class VectorUtils {
    static add = (v1, v2) => [v1[0] + v2[0], v1[1] + v2[1]];

    static subtract = (v1, v2) => [v1[0] - v2[0], v1[1] - v2[1]];

    static multiply = (v1, v2) => [v1[0] * v2[0], v1[1] * v2[1]];

    static divide = (v1, v2) => [v1[0] / v2[0], v1[1] / v2[1]];

    static multiplyBy = (vector, multiplier) => [vector[0] * multiplier, vector[1] * multiplier];

    static divideBy = (v1, divisor) => [v1[0] / divisor, v1[1] / divisor];

    static addAll = (...vectors) => vectors.reduce((acc, v) => [acc[0] + v[0], acc[1] + v[1]], [1, 1]);

    static multiplyAll = (...vectors) => vectors.reduce((acc, v) => [acc[0] * v[0], acc[1] * v[1]], [1, 1]);

    static relativeVector = (v1, v2) => [v1[0] - v2[0], v1[1] - v2[1]];

    static negate = (vector) => [-vector[0], -vector[1]];

    static distance = (v1, v2) => {
        // const rel = this.relativeVector(v1, v2);
        const rel = [v1[0] - v2[0], v1[1] - v2[1]];

        return Math.hypot(rel[0], rel[1]); // new ES6 way
        // return Math.sqrt(Math.pow(rel[0], 2) + Math.pow(rel[1], 2)); old ES5 way
    };

    static normalize = (vector) => {
        const magnitude = Math.hypot(vector[0], vector[1]);
        // const magnitude = Math.sqrt(vector[0] * vector[0] + vector[1] * vector[1]);  // alternative
        return [vector[0] / magnitude, vector[0] / magnitude];
    };

    /**
     * used to find the angle between two vectors in any dimensional space
     * The dot product is a measure of how parallel two vectors are, scaled by their lengths
     * https://betterexplained.com/articles/vector-calculus-understanding-the-dot-product/
     */
    static dot = (v1, v2) => v1[0] * v2[0] + v1[1] * v2[1];

    static equals = (v1, v2) => v1[0] === v2[0] && v1[1] === v2[1];

    static length = (vector) => Math.sqrt(this.dot(vector, vector));

    static min = (v1, v2) => {
        const x = Math.min(v1[0], v2[0]);
        const y = Math.min(v1[1], v2[1]);
        return [x, y];
    };

    static max = (v1, v2) => {
        const x = Math.max(v1[0], v1[0]);
        const y = Math.max(v1[1], v2[1]);
        return [x, y];
    };

    static lookAtDirection = (from, to) => this.normalize(this.relativeVector(from, to));
}
