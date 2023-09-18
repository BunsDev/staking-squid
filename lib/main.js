"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const ss58 = __importStar(require("@subsquid/ss58"));
const typeorm_store_1 = require("@subsquid/typeorm-store");
const model_1 = require("./model");
const processor_1 = require("./processor");
const events_1 = require("./types/events");
const storage_1 = require("./types/storage");
processor_1.processor.run(new typeorm_store_1.TypeormDatabase(), async (ctx) => {
    for (let block of ctx.blocks) {
        let eraExtracted = [];
        let bondedEvents = [];
        let rewardedEvents = [];
        let slashedEvents = [];
        let erasStakers = [];
        let erasNominations = [];
        let blockNumber = block.header.height;
        let timestamp = new Date(block.header.timestamp);
        for (let item of block.items) {
            if (item.name == 'Staking.Bonded') {
                let e = new events_1.StakingBondedEvent(ctx, item.event);
                let rec = getStakingBonded(e);
                bondedEvents.push({
                    id: item.event.id,
                    blockNumber: blockNumber,
                    timestamp: timestamp,
                    extrinsicHash: item.event.extrinsic?.hash,
                    stash: ss58.codec("polkadot").encode(rec.stash),
                    amount: rec.amount
                });
            }
            else if (item.name == 'Staking.Rewarded') {
                let e = new events_1.StakingRewardedEvent(ctx, item.event);
                let rec = getRewarded(e);
                rewardedEvents.push({
                    id: item.event.id,
                    blockNumber: blockNumber,
                    timestamp: timestamp,
                    extrinsicHash: item.event.extrinsic?.hash,
                    stash: ss58.codec("polkadot").encode(rec.stash),
                    amount: rec.amount
                });
            }
            else if (item.name == 'Staking.Slashed') {
                let e = new events_1.StakingSlashedEvent(ctx, item.event);
                let rec = getSlashed(e);
                slashedEvents.push({
                    id: item.event.id,
                    blockNumber: blockNumber,
                    timestamp: timestamp,
                    staker: ss58.codec("polkadot").encode(rec.staker),
                    amount: rec.amount
                });
            }
            else if (item.name == 'Grandpa.NewAuthorities') {
                let storage = new storage_1.StakingActiveEraStorage(ctx, block.header);
                let rec = await getActiveEraInfoData(storage);
                if (rec) {
                    let eraInfo = await rec.get();
                    if (eraInfo && (eraInfo.start ?? -1) == block.header.timestamp) {
                        ctx.log.info(`processing era ${eraInfo?.index}...`);
                        let era = {
                            id: eraInfo?.index.toString(),
                            index: eraInfo?.index,
                            startAtTime: eraInfo?.start,
                            startAtBlock: block.header.height
                        };
                        eraExtracted.push(era);
                        let validatorIds = (await getEraValidators(ctx, block.header)) ?? [];
                        let stakersInfo = (await getEraValidatorsInfo(ctx, block.header, era.index, validatorIds)) ?? [];
                        let stakersInfoPrefs = (await getErasValidatorPrefs(ctx, block.header, era.index, validatorIds)) ?? [];
                        for (let i = 0; i < validatorIds.length; i++) {
                            let validatorId = ss58.codec("polkadot").encode(validatorIds[i]);
                            let validatorInfo = stakersInfo[i];
                            let stakersInfoPref = stakersInfoPrefs[i];
                            let validator = {
                                id: `${era.index}-${validatorId}`,
                                eraId: era.index,
                                validator: validatorId,
                                selfBonded: validatorInfo.own,
                                totalBonded: validatorInfo.total,
                                nominatorCount: validatorInfo.others.length,
                                commission: stakersInfoPref.commission
                            };
                            erasStakers.push(validator);
                            for (let nomination of validatorInfo.others) {
                                let nominatorId = ss58.codec("polkadot").encode(nomination.who);
                                let erasNomination = {
                                    id: `${validator.id}-${nominatorId}`,
                                    eraId: era.index,
                                    validator: validatorId,
                                    nominator: nominatorId,
                                    vote: nomination.value,
                                };
                                erasNominations.push(erasNomination);
                            }
                        }
                    }
                }
            }
        }
        await setBondedToDb(ctx, bondedEvents);
        await setRewardedToDb(ctx, rewardedEvents);
        await setSlashedToDb(ctx, slashedEvents);
        await setEraToDb(ctx, eraExtracted);
        await setErasStakerstoDb(ctx, erasStakers);
        await setErasNominationsToDb(ctx, erasNominations);
    }
});
async function setBondedToDb(ctx, bondedData) {
    let bondeds = [];
    for (let rec of bondedData) {
        let { id, blockNumber, timestamp, extrinsicHash, stash, amount } = rec;
        bondeds.push(new model_1.Bonded({
            id,
            blockNumber,
            timestamp,
            extrinsicHash,
            stash,
            amount
        }));
    }
    await ctx.store.insert(bondeds);
}
async function setRewardedToDb(ctx, rewardedData) {
    let rewardeds = [];
    for (let rec of rewardedData) {
        let { id, blockNumber, timestamp, extrinsicHash, stash, amount } = rec;
        rewardeds.push(new model_1.Rewarded({
            id,
            blockNumber,
            timestamp,
            extrinsicHash,
            stash,
            amount
        }));
    }
    await ctx.store.insert(rewardeds);
}
async function setSlashedToDb(ctx, slashedData) {
    let slasheds = [];
    for (let rec of slashedData) {
        let { id, blockNumber, timestamp, staker, amount } = rec;
        slasheds.push(new model_1.Slashed({
            id,
            blockNumber,
            timestamp,
            staker,
            amount
        }));
    }
    await ctx.store.insert(slasheds);
}
async function setEraToDb(ctx, erasData) {
    let eras = [];
    for (let rec of erasData) {
        let { id, startAtBlock, startAtTime } = rec;
        eras.push(new model_1.Era({
            id,
            startAtBlock,
            startAtTime,
        }));
    }
    await ctx.store.insert(eras);
}
async function setErasStakerstoDb(ctx, erasStakersData) {
    let erasStakers = [];
    for (let rec of erasStakersData) {
        let { id, eraId, validator, selfBonded, totalBonded, nominatorCount, commission } = rec;
        erasStakers.push(new model_1.ErasStakers({
            id,
            eraId,
            validator,
            selfBonded,
            totalBonded,
            nominatorCount,
            commission,
        }));
    }
    await ctx.store.insert(erasStakers);
}
async function setErasNominationsToDb(ctx, erasNominationData) {
    let erasNominations = [];
    for (let rec of erasNominationData) {
        let { id, eraId, validator, nominator, vote } = rec;
        erasNominations.push(new model_1.EraNominations({
            id,
            eraId,
            validator,
            nominator,
            vote
        }));
    }
    await ctx.store.insert(erasNominations);
}
async function getEraValidatorsInfo(ctx, block, eraIndex, validatorIds) {
    const s = new storage_1.StakingErasStakersStorage(ctx, block);
    if (!s.isExists) {
        return undefined;
    }
    else if (s.isV0) {
        return s.asV0.getMany(validatorIds.map((v) => [eraIndex, v]));
    }
    else {
        throw new Error('Unsupported spec');
    }
}
async function getEraValidators(ctx, block) {
    let s = new storage_1.SessionValidatorsStorage(ctx, block);
    if (!s.isExists) {
        return undefined;
    }
    else if (s.isV0) {
        return s.asV0.get();
    }
    else {
        throw new Error('Unsupported spec');
    }
}
async function getErasValidatorPrefs(ctx, block, eraIndex, validatorIds) {
    let s = new storage_1.StakingErasValidatorPrefsStorage(ctx, block);
    if (!s.isExists) {
        return undefined;
    }
    else if (s.isV0) {
        return s.asV0.getMany(validatorIds.map((v) => [eraIndex, v]));
    }
    else if (s.isV28) {
        return s.asV28.getMany(validatorIds.map((v) => [eraIndex, v]));
    }
    else {
        throw new Error('Unsupported spec');
    }
}
async function getActiveEraInfoData(s) {
    if (!s.isExists) {
        return undefined;
    }
    else if (s.isV0) {
        return s.asV0;
    }
    else {
        throw Error('Unsupported spec');
    }
}
function getRewarded(e) {
    let record;
    if (e.isV9090) {
        let [stash, amount] = e.asV9090;
        record = { stash, amount };
    }
    else if (e.isV9300) {
        record = e.asV9300;
    }
    else {
        throw new Error('Unsupported spec');
    }
    return record;
}
function getSlashed(e) {
    let record;
    if (e.isV9090) {
        let [staker, amount] = e.asV9090;
        record = { staker, amount };
    }
    else if (e.isV9300) {
        record = e.asV9300;
    }
    else {
        throw new Error('Unsupported spec');
    }
    return record;
}
function getStakingBonded(e) {
    let record;
    if (e.isV0) {
        let [stash, amount] = e.asV0;
        record = { stash, amount };
    }
    else if (e.isV9300) {
        record = e.asV9300;
    }
    else {
        throw new Error('Unsupported spec');
    }
    return record;
}
//# sourceMappingURL=main.js.map