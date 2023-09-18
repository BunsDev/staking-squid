import assert from 'assert'
import {Chain, ChainContext, EventContext, Event, Result, Option} from './support'

export class GrandpaNewAuthoritiesEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Grandpa.NewAuthorities')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     *  New authority set has been applied.
     */
    get isV0(): boolean {
        return this._chain.getEventHash('Grandpa.NewAuthorities') === 'a1a8c88e19b8fedde4aab1bef41aa9e1bdfc3748b1e39f7ad5bb09d0347d9505'
    }

    /**
     *  New authority set has been applied.
     */
    get asV0(): [Uint8Array, bigint][] {
        assert(this.isV0)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * New authority set has been applied.
     */
    get isV9140(): boolean {
        return this._chain.getEventHash('Grandpa.NewAuthorities') === 'e25505d283e6b21359efad4ea3b01da035cbbe2b268fd3cbfb12ca0b5577a9de'
    }

    /**
     * New authority set has been applied.
     */
    get asV9140(): {authoritySet: [Uint8Array, bigint][]} {
        assert(this.isV9140)
        return this._chain.decodeEvent(this.event)
    }
}

export class StakingBondedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Staking.Bonded')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     *  An account has bonded this amount.
     * 
     *  NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
     *  it will not be emitted for staking rewards when they are added to stake.
     */
    get isV0(): boolean {
        return this._chain.getEventHash('Staking.Bonded') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
    }

    /**
     *  An account has bonded this amount.
     * 
     *  NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
     *  it will not be emitted for staking rewards when they are added to stake.
     */
    get asV0(): [Uint8Array, bigint] {
        assert(this.isV0)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * An account has bonded this amount. \[stash, amount\]
     * 
     * NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
     * it will not be emitted for staking rewards when they are added to stake.
     */
    get isV9300(): boolean {
        return this._chain.getEventHash('Staking.Bonded') === '9623d141834cd425342a1ff7a2b2265acd552799bcd6a0df67eb08a661e2215d'
    }

    /**
     * An account has bonded this amount. \[stash, amount\]
     * 
     * NOTE: This event is only emitted when funds are bonded via a dispatchable. Notably,
     * it will not be emitted for staking rewards when they are added to stake.
     */
    get asV9300(): {stash: Uint8Array, amount: bigint} {
        assert(this.isV9300)
        return this._chain.decodeEvent(this.event)
    }
}

export class StakingRewardedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Staking.Rewarded')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     *  The nominator has been rewarded by this amount. \[stash, amount\]
     */
    get isV9090(): boolean {
        return this._chain.getEventHash('Staking.Rewarded') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
    }

    /**
     *  The nominator has been rewarded by this amount. \[stash, amount\]
     */
    get asV9090(): [Uint8Array, bigint] {
        assert(this.isV9090)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * The nominator has been rewarded by this amount.
     */
    get isV9300(): boolean {
        return this._chain.getEventHash('Staking.Rewarded') === '9623d141834cd425342a1ff7a2b2265acd552799bcd6a0df67eb08a661e2215d'
    }

    /**
     * The nominator has been rewarded by this amount.
     */
    get asV9300(): {stash: Uint8Array, amount: bigint} {
        assert(this.isV9300)
        return this._chain.decodeEvent(this.event)
    }
}

export class StakingSlashedEvent {
    private readonly _chain: Chain
    private readonly event: Event

    constructor(ctx: EventContext)
    constructor(ctx: ChainContext, event: Event)
    constructor(ctx: EventContext, event?: Event) {
        event = event || ctx.event
        assert(event.name === 'Staking.Slashed')
        this._chain = ctx._chain
        this.event = event
    }

    /**
     *  One validator (and its nominators) has been slashed by the given amount.
     *  \[validator, amount\]
     */
    get isV9090(): boolean {
        return this._chain.getEventHash('Staking.Slashed') === '23bebce4ca9ed37548947d07d4dc50e772f07401b9a416b6aa2f3e9cb5adcaf4'
    }

    /**
     *  One validator (and its nominators) has been slashed by the given amount.
     *  \[validator, amount\]
     */
    get asV9090(): [Uint8Array, bigint] {
        assert(this.isV9090)
        return this._chain.decodeEvent(this.event)
    }

    /**
     * One staker (and potentially its nominators) has been slashed by the given amount.
     */
    get isV9300(): boolean {
        return this._chain.getEventHash('Staking.Slashed') === '8043a273ae232adf290e1fbbd88711bdf078eb5beb2a947de455999b434e7896'
    }

    /**
     * One staker (and potentially its nominators) has been slashed by the given amount.
     */
    get asV9300(): {staker: Uint8Array, amount: bigint} {
        assert(this.isV9300)
        return this._chain.decodeEvent(this.event)
    }
}
