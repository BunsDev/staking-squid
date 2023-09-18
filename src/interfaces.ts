// export interface TransferEvent {
//     id: string
//     blockNumber: number
//     timestamp: Date
//     extrinsicHash?: string
//     from: string
//     to: string
//     amount: bigint
//     fee?: bigint
// }

export interface BondedEvent {
    id: string,
    blockNumber: number,
    timestamp: Date,
    extrinsicHash?: string,
    stash: string,
    amount: bigint
}

export interface RewardedEvent{
    id: string
    blockNumber: number
    timestamp: Date
    extrinsicHash?: string
    stash: string
    amount: bigint
}

export interface SlashedEvent{
    id: string
    blockNumber: number
    timestamp: Date
    staker: string
    amount: bigint
}

export interface ErasStakersExtracted{
    id: string
    eraId: number
    validator: string
    selfBonded: bigint
    totalBonded: bigint
    nominatorCount: number
    commission: number
}

export interface ErasNominationExtracted{
    id: string
    eraId: number
    validator: string
    nominator: string
    vote: bigint
}

export interface EraExtracted{
    id?: string,
    index: number,
    startAtTime?: bigint,
    startAtBlock: number
}