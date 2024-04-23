export class PoolVolatilitiesSnapshot {

    constructor(
        public timestamp: number,
        public poolVolatilities: PoolVolatility[],
    ) { }

    get averageVolatility() {
        return this.poolVolatilities.reduce((acc, poolVolatility) => acc + poolVolatility.volatility, 0) / this.poolVolatilities.length;
    }

    get averageVariance() {
        return this.poolVolatilities.reduce((acc, poolVolatility) => acc + poolVolatility.variance, 0) / this.poolVolatilities.length;
    }

    get averageATR() {
        return this.poolVolatilities.reduce((acc, poolVolatility) => acc + poolVolatility.averageTrueRange, 0) / this.poolVolatilities.length;
    }

    static fromServerResponse(timestamp: number, serverResponse: any): PoolVolatilitiesSnapshot {
        let poolVolatilities: PoolVolatility[] = [];

        serverResponse.forEach((poolVolatility: any) => {
            poolVolatilities.push(new PoolVolatility(
                timestamp,
                poolVolatility['poolAddress'],
                poolVolatility['atr'],
                poolVolatility['standardDeviation'],
                poolVolatility['variance'],
            ))
        })
        return new PoolVolatilitiesSnapshot(
            timestamp,
            poolVolatilities,
        )
    }
}

export class PoolVolatility {
    constructor(
        public timestamp: number,
        public poolAddress: string,
        public averageTrueRange: number,
        public volatility: number,
        public variance: number,
    ) { }
}
