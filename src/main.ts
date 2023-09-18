import {In} from 'typeorm'
import {SubstrateBlock} from '@subsquid/substrate-processor'

import * as ss58 from '@subsquid/ss58'

import {Store, TypeormDatabase} from '@subsquid/typeorm-store'

import {Era,
        ErasStakers,
        EraNominations,
        Bonded, Slashed, Rewarded} from './model'

import {ProcessorContext, processor} from './processor'

import {StakingRewardedEvent,
        StakingSlashedEvent,
        StakingBondedEvent} from './types/events'

import {StakingErasStakersStorage,
        StakingErasValidatorPrefsStorage,
        StakingActiveEraStorage,
        SessionValidatorsStorage} from "./types/storage"

import { BondedEvent, RewardedEvent,
         SlashedEvent, ErasStakersExtracted,
         ErasNominationExtracted, EraExtracted} from "./interfaces"


processor.run(new TypeormDatabase(), async (ctx) => {

    
    for (let block of ctx.blocks) {
        
        let eraExtracted: EraExtracted[] = []
        let bondedEvents: BondedEvent[] = []
        let rewardedEvents: RewardedEvent[] = []
        let slashedEvents: SlashedEvent[] = []
    
        let erasStakers: ErasStakersExtracted[] = []
        let erasNominations: ErasNominationExtracted[] = []
        
        let blockNumber = block.header.height
        let timestamp = new Date(block.header.timestamp)

        for (let item of block.items) {

            if (item.name == 'Staking.Bonded') {
                let e = new StakingBondedEvent(ctx, item.event)
                let rec = getStakingBonded(e)
                bondedEvents.push({
                    id: item.event.id,
                    blockNumber: blockNumber,
                    timestamp: timestamp,
                    extrinsicHash: item.event.extrinsic?.hash,
                    stash: ss58.codec("polkadot").encode(rec.stash),
                    amount: rec.amount
                })
            } else if (item.name == 'Staking.Rewarded') {
                let e = new StakingRewardedEvent(ctx, item.event)
                let rec = getRewarded(e)
                rewardedEvents.push({
                    id: item.event.id,
                    blockNumber: blockNumber,
                    timestamp: timestamp,
                    extrinsicHash: item.event.extrinsic?.hash,
                    stash: ss58.codec("polkadot").encode(rec.stash),
                    amount: rec.amount
                })
            } else if (item.name == 'Staking.Slashed') {
                let e = new StakingSlashedEvent(ctx, item.event)
                let rec = getSlashed(e)
                slashedEvents.push({
                    id: item.event.id,
                    blockNumber: blockNumber,
                    timestamp: timestamp,
                    staker: ss58.codec("polkadot").encode(rec.staker),
                    amount: rec.amount
                })
            } else if (item.name == 'Grandpa.NewAuthorities'){
                let storage = new StakingActiveEraStorage(ctx, block.header)
                let rec = await getActiveEraInfoData(storage)
                if (rec){
                    let eraInfo = await rec.get()
                    if (eraInfo && (eraInfo.start ?? -1) == block.header.timestamp){
                        ctx.log.info(`processing era ${eraInfo?.index}...`)
                        let era: EraExtracted = {
                            id: eraInfo?.index.toString(),
                            index: eraInfo?.index,
                            startAtTime: eraInfo?.start,
                            startAtBlock: block.header.height
                        } 
                        eraExtracted.push(era)
                        
                        let validatorIds = (await getEraValidators(ctx, block.header)) ?? []
                        let stakersInfo = (await getEraValidatorsInfo(ctx, block.header, era.index, validatorIds)) ?? []
                        let stakersInfoPrefs = (await getErasValidatorPrefs(ctx, block.header, era.index, validatorIds)) ?? []
                        
                        for (let i = 0; i < validatorIds.length; i++) {
                            let validatorId = ss58.codec("polkadot").encode(validatorIds[i])
                            let validatorInfo = stakersInfo[i]
                            let stakersInfoPref = stakersInfoPrefs[i]
        
                            let validator: ErasStakersExtracted = {
                                id: `${era.index}-${validatorId}`,
                                eraId: era.index,
                                validator: validatorId,
                                selfBonded: validatorInfo.own,
                                totalBonded: validatorInfo.total,
                                nominatorCount: validatorInfo.others.length,
                                commission: stakersInfoPref.commission
                            }
                            erasStakers.push(validator)
        
                            for (let nomination of validatorInfo.others) {
                                
                                let nominatorId = ss58.codec("polkadot").encode(nomination.who)
                                let erasNomination: ErasNominationExtracted = {
                                    id: `${validator.id}-${nominatorId}`,
                                    eraId: era.index,
                                    validator: validatorId,
                                    nominator: nominatorId,
                                    vote: nomination.value,
                                }
                                erasNominations.push(erasNomination)
                            }

                        }


                    }
                }
            }
        }

        await setBondedToDb(ctx, bondedEvents)
        await setRewardedToDb(ctx, rewardedEvents)
        await setSlashedToDb(ctx, slashedEvents)
        await setEraToDb(ctx, eraExtracted)
        await setErasStakerstoDb(ctx, erasStakers)
        await setErasNominationsToDb(ctx, erasNominations)
    }


})


async function setBondedToDb(ctx: ProcessorContext<Store>, bondedData: BondedEvent[]){
    let bondeds: Bonded[] = []
    for (let rec of bondedData) {
        let {id, blockNumber, timestamp, extrinsicHash, stash, amount} = rec
        bondeds.push(
            new Bonded({
                id,
                blockNumber,
                timestamp,
                extrinsicHash,
                stash,
                amount
            })
        )
    }

    await ctx.store.insert(bondeds)
}

async function setRewardedToDb(ctx: ProcessorContext<Store>, rewardedData: RewardedEvent[]){
    let rewardeds: Rewarded[] = []
    for (let rec of rewardedData) {
        let {id, blockNumber, timestamp, extrinsicHash, stash, amount} = rec
        rewardeds.push(
            new Rewarded({
                id,
                blockNumber,
                timestamp,
                extrinsicHash,
                stash,
                amount
            })
        )
    }

    await ctx.store.insert(rewardeds)
}

async function setSlashedToDb(ctx: ProcessorContext<Store>, slashedData: SlashedEvent[]){
    let slasheds: Slashed[] = []
    for (let rec of slashedData) {
        let {id, blockNumber, timestamp, staker, amount} = rec
        slasheds.push(
            new Slashed({
                id,
                blockNumber,
                timestamp,
                staker,
                amount
            })
        )
    }

    await ctx.store.insert(slasheds)
}

async function setEraToDb(ctx: ProcessorContext<Store>, erasData: EraExtracted[]){
    let eras: Era[] = []
    for (let rec of erasData) {
        let {id, startAtBlock, startAtTime} = rec
        eras.push(
            new Era({
                id,
                startAtBlock,
                startAtTime,
            })
        )
    }

    await ctx.store.insert(eras)
}


async function setErasStakerstoDb(ctx: ProcessorContext<Store>, erasStakersData: ErasStakersExtracted[]){
    let erasStakers: ErasStakers[] = []
    
    for (let rec of erasStakersData) {
        let {id, eraId, validator, selfBonded, totalBonded, nominatorCount, commission} = rec
        erasStakers.push(
            new ErasStakers({
                id,
                eraId,
                validator,
                selfBonded,
                totalBonded,
                nominatorCount,
                commission,
            })
        )
    }

    await ctx.store.insert(erasStakers)
}

async function setErasNominationsToDb(ctx: ProcessorContext<Store>, erasNominationData: ErasNominationExtracted[]){
    let erasNominations: EraNominations[] = []
    for (let rec of erasNominationData) {
        let { id, eraId, validator, nominator, vote } = rec
        erasNominations.push(
            new EraNominations({
                id,
                eraId,
                validator,
                nominator,
                vote
            })
        )
    }

    await ctx.store.insert(erasNominations)
}

async function getEraValidatorsInfo(
    ctx: ProcessorContext<Store>,
    block: SubstrateBlock,
    eraIndex: number,
    validatorIds: Uint8Array[]
) {
    const s = new StakingErasStakersStorage(ctx, block)

    if (!s.isExists) {
        return undefined
    } else if (s.isV0) {
        return s.asV0.getMany(validatorIds.map((v) => [eraIndex, v]))
    } else {
        throw new Error('Unsupported spec')
    }
}


async function getEraValidators(ctx: ProcessorContext<Store>, block: SubstrateBlock) {

    let s = new SessionValidatorsStorage(ctx, block)

    if (!s.isExists) {
        return undefined
    } else if (s.isV0) {
        return s.asV0.get()
    } else {
        throw new Error('Unsupported spec')
    }
}


async function getErasValidatorPrefs(
    ctx: ProcessorContext<Store>,
    block: SubstrateBlock,
    eraIndex: number,
    validatorIds: Uint8Array[]

) {

    let s = new StakingErasValidatorPrefsStorage(ctx, block)

    if (!s.isExists) {
        return undefined
    } else if (s.isV0) {
        return s.asV0.getMany(validatorIds.map((v) => [eraIndex, v]))
    }else if (s.isV28) {
        return s.asV28.getMany(validatorIds.map((v) => [eraIndex, v]))
    }else {
        throw new Error('Unsupported spec')
    }
}

async function getActiveEraInfoData(s: StakingActiveEraStorage) {

    if (!s.isExists) {
        return undefined
    } else if (s.isV0) {
        return s.asV0
    } else {
        throw Error('Unsupported spec')
    }
}


function getRewarded(e: StakingRewardedEvent): {stash: Uint8Array; amount: bigint}{

    let record: {stash: Uint8Array; amount: bigint}
    if (e.isV9090) {
        let [stash, amount] = e.asV9090
        record = {stash, amount}
    } else if (e.isV9300) {
        record = e.asV9300
    } else {
        throw new Error('Unsupported spec')
    }
    return record
}


function getSlashed(e: StakingSlashedEvent): {staker: Uint8Array; amount: bigint}{
    
    let record: {staker: Uint8Array; amount: bigint}
    if (e.isV9090) {
        let [staker, amount] = e.asV9090
        record = {staker, amount}
    } else if (e.isV9300) {
        record = e.asV9300
    } else {
        throw new Error('Unsupported spec')
    }
    return record
}


function getStakingBonded(e: StakingBondedEvent): {stash: Uint8Array; amount: bigint}{

    let record: {stash: Uint8Array; amount: bigint}
    if (e.isV0) {
        let [stash, amount] = e.asV0
        record = {stash, amount}
    } else if (e.isV9300) {
        record = e.asV9300
    } else {
        throw new Error('Unsupported spec')
    }
    
    return record
}