import assert from 'assert'
import {Block, BlockContext, Chain, ChainContext, Option, Result, StorageBase} from './support'
import * as v0 from './v0'
import * as v28 from './v28'

export class SessionValidatorsStorage extends StorageBase {
    protected getPrefix() {
        return 'Session'
    }

    protected getName() {
        return 'Validators'
    }

    /**
     *  The current set of validators.
     */
    get isV0(): boolean {
        return this.getTypeHash() === 'f5df25eadcdffaa0d2a68b199d671d3921ca36a7b70d22d57506dca52b4b5895'
    }

    /**
     *  The current set of validators.
     */
    get asV0(): SessionValidatorsStorageV0 {
        assert(this.isV0)
        return this as any
    }
}

/**
 *  The current set of validators.
 */
export interface SessionValidatorsStorageV0 {
    get(): Promise<Uint8Array[]>
}

export class StakingActiveEraStorage extends StorageBase {
    protected getPrefix() {
        return 'Staking'
    }

    protected getName() {
        return 'ActiveEra'
    }

    /**
     *  The active era information, it holds index and start.
     * 
     *  The active era is the era currently rewarded.
     *  Validator set of this era must be equal to `SessionInterface::validators`.
     */
    get isV0(): boolean {
        return this.getTypeHash() === '2bb946dd9c19de9f4332897005d1255528c610172f7418fae165b5dafd3cfbfe'
    }

    /**
     *  The active era information, it holds index and start.
     * 
     *  The active era is the era currently rewarded.
     *  Validator set of this era must be equal to `SessionInterface::validators`.
     */
    get asV0(): StakingActiveEraStorageV0 {
        assert(this.isV0)
        return this as any
    }
}

/**
 *  The active era information, it holds index and start.
 * 
 *  The active era is the era currently rewarded.
 *  Validator set of this era must be equal to `SessionInterface::validators`.
 */
export interface StakingActiveEraStorageV0 {
    get(): Promise<(v0.ActiveEraInfo | undefined)>
}

export class StakingErasStakersStorage extends StorageBase {
    protected getPrefix() {
        return 'Staking'
    }

    protected getName() {
        return 'ErasStakers'
    }

    /**
     *  Exposure of validator at era.
     * 
     *  This is keyed first by the era index to allow bulk deletion and then the stash account.
     * 
     *  Is it removed after `HISTORY_DEPTH` eras.
     *  If stakers hasn't been set or has been removed then empty exposure is returned.
     */
    get isV0(): boolean {
        return this.getTypeHash() === 'f3f726cc814cef290657008054cd10667b250a01d2842ff3bbbcca24c98abf5b'
    }

    /**
     *  Exposure of validator at era.
     * 
     *  This is keyed first by the era index to allow bulk deletion and then the stash account.
     * 
     *  Is it removed after `HISTORY_DEPTH` eras.
     *  If stakers hasn't been set or has been removed then empty exposure is returned.
     */
    get asV0(): StakingErasStakersStorageV0 {
        assert(this.isV0)
        return this as any
    }
}

/**
 *  Exposure of validator at era.
 * 
 *  This is keyed first by the era index to allow bulk deletion and then the stash account.
 * 
 *  Is it removed after `HISTORY_DEPTH` eras.
 *  If stakers hasn't been set or has been removed then empty exposure is returned.
 */
export interface StakingErasStakersStorageV0 {
    get(key1: number, key2: Uint8Array): Promise<v0.Exposure>
    getAll(): Promise<v0.Exposure[]>
    getMany(keys: [number, Uint8Array][]): Promise<v0.Exposure[]>
    getKeys(): Promise<[number, Uint8Array][]>
    getKeys(key1: number): Promise<[number, Uint8Array][]>
    getKeys(key1: number, key2: Uint8Array): Promise<[number, Uint8Array][]>
    getKeysPaged(pageSize: number): AsyncIterable<[number, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: number): AsyncIterable<[number, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: number, key2: Uint8Array): AsyncIterable<[number, Uint8Array][]>
    getPairs(): Promise<[k: [number, Uint8Array], v: v0.Exposure][]>
    getPairs(key1: number): Promise<[k: [number, Uint8Array], v: v0.Exposure][]>
    getPairs(key1: number, key2: Uint8Array): Promise<[k: [number, Uint8Array], v: v0.Exposure][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: [number, Uint8Array], v: v0.Exposure][]>
    getPairsPaged(pageSize: number, key1: number): AsyncIterable<[k: [number, Uint8Array], v: v0.Exposure][]>
    getPairsPaged(pageSize: number, key1: number, key2: Uint8Array): AsyncIterable<[k: [number, Uint8Array], v: v0.Exposure][]>
}

export class StakingErasValidatorPrefsStorage extends StorageBase {
    protected getPrefix() {
        return 'Staking'
    }

    protected getName() {
        return 'ErasValidatorPrefs'
    }

    /**
     *  Similar to `ErasStakers`, this holds the preferences of validators.
     * 
     *  This is keyed first by the era index to allow bulk deletion and then the stash account.
     * 
     *  Is it removed after `HISTORY_DEPTH` eras.
     */
    get isV0(): boolean {
        return this.getTypeHash() === '3b21d3470a6c89e6da0d574a6d1402846f9836bb0d1f42e73e3fab07653299c2'
    }

    /**
     *  Similar to `ErasStakers`, this holds the preferences of validators.
     * 
     *  This is keyed first by the era index to allow bulk deletion and then the stash account.
     * 
     *  Is it removed after `HISTORY_DEPTH` eras.
     */
    get asV0(): StakingErasValidatorPrefsStorageV0 {
        assert(this.isV0)
        return this as any
    }

    /**
     *  Similar to `ErasStakers`, this holds the preferences of validators.
     * 
     *  This is keyed first by the era index to allow bulk deletion and then the stash account.
     * 
     *  Is it removed after `HISTORY_DEPTH` eras.
     */
    get isV28(): boolean {
        return this.getTypeHash() === '2f145e368b1c1a9540437d8c25b9502d09b7e977e27a6bb99156b6bf2c6269d2'
    }

    /**
     *  Similar to `ErasStakers`, this holds the preferences of validators.
     * 
     *  This is keyed first by the era index to allow bulk deletion and then the stash account.
     * 
     *  Is it removed after `HISTORY_DEPTH` eras.
     */
    get asV28(): StakingErasValidatorPrefsStorageV28 {
        assert(this.isV28)
        return this as any
    }
}

/**
 *  Similar to `ErasStakers`, this holds the preferences of validators.
 * 
 *  This is keyed first by the era index to allow bulk deletion and then the stash account.
 * 
 *  Is it removed after `HISTORY_DEPTH` eras.
 */
export interface StakingErasValidatorPrefsStorageV0 {
    get(key1: number, key2: Uint8Array): Promise<v0.ValidatorPrefs>
    getAll(): Promise<v0.ValidatorPrefs[]>
    getMany(keys: [number, Uint8Array][]): Promise<v0.ValidatorPrefs[]>
    getKeys(): Promise<[number, Uint8Array][]>
    getKeys(key1: number): Promise<[number, Uint8Array][]>
    getKeys(key1: number, key2: Uint8Array): Promise<[number, Uint8Array][]>
    getKeysPaged(pageSize: number): AsyncIterable<[number, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: number): AsyncIterable<[number, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: number, key2: Uint8Array): AsyncIterable<[number, Uint8Array][]>
    getPairs(): Promise<[k: [number, Uint8Array], v: v0.ValidatorPrefs][]>
    getPairs(key1: number): Promise<[k: [number, Uint8Array], v: v0.ValidatorPrefs][]>
    getPairs(key1: number, key2: Uint8Array): Promise<[k: [number, Uint8Array], v: v0.ValidatorPrefs][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: [number, Uint8Array], v: v0.ValidatorPrefs][]>
    getPairsPaged(pageSize: number, key1: number): AsyncIterable<[k: [number, Uint8Array], v: v0.ValidatorPrefs][]>
    getPairsPaged(pageSize: number, key1: number, key2: Uint8Array): AsyncIterable<[k: [number, Uint8Array], v: v0.ValidatorPrefs][]>
}

/**
 *  Similar to `ErasStakers`, this holds the preferences of validators.
 * 
 *  This is keyed first by the era index to allow bulk deletion and then the stash account.
 * 
 *  Is it removed after `HISTORY_DEPTH` eras.
 */
export interface StakingErasValidatorPrefsStorageV28 {
    get(key1: number, key2: Uint8Array): Promise<v28.ValidatorPrefs>
    getAll(): Promise<v28.ValidatorPrefs[]>
    getMany(keys: [number, Uint8Array][]): Promise<v28.ValidatorPrefs[]>
    getKeys(): Promise<[number, Uint8Array][]>
    getKeys(key1: number): Promise<[number, Uint8Array][]>
    getKeys(key1: number, key2: Uint8Array): Promise<[number, Uint8Array][]>
    getKeysPaged(pageSize: number): AsyncIterable<[number, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: number): AsyncIterable<[number, Uint8Array][]>
    getKeysPaged(pageSize: number, key1: number, key2: Uint8Array): AsyncIterable<[number, Uint8Array][]>
    getPairs(): Promise<[k: [number, Uint8Array], v: v28.ValidatorPrefs][]>
    getPairs(key1: number): Promise<[k: [number, Uint8Array], v: v28.ValidatorPrefs][]>
    getPairs(key1: number, key2: Uint8Array): Promise<[k: [number, Uint8Array], v: v28.ValidatorPrefs][]>
    getPairsPaged(pageSize: number): AsyncIterable<[k: [number, Uint8Array], v: v28.ValidatorPrefs][]>
    getPairsPaged(pageSize: number, key1: number): AsyncIterable<[k: [number, Uint8Array], v: v28.ValidatorPrefs][]>
    getPairsPaged(pageSize: number, key1: number, key2: Uint8Array): AsyncIterable<[k: [number, Uint8Array], v: v28.ValidatorPrefs][]>
}
