"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.StakingErasValidatorPrefsStorage = exports.StakingErasStakersStorage = exports.StakingActiveEraStorage = exports.SessionValidatorsStorage = void 0;
const assert_1 = __importDefault(require("assert"));
const support_1 = require("./support");
class SessionValidatorsStorage extends support_1.StorageBase {
    getPrefix() {
        return 'Session';
    }
    getName() {
        return 'Validators';
    }
    /**
     *  The current set of validators.
     */
    get isV0() {
        return this.getTypeHash() === 'f5df25eadcdffaa0d2a68b199d671d3921ca36a7b70d22d57506dca52b4b5895';
    }
    /**
     *  The current set of validators.
     */
    get asV0() {
        (0, assert_1.default)(this.isV0);
        return this;
    }
}
exports.SessionValidatorsStorage = SessionValidatorsStorage;
class StakingActiveEraStorage extends support_1.StorageBase {
    getPrefix() {
        return 'Staking';
    }
    getName() {
        return 'ActiveEra';
    }
    /**
     *  The active era information, it holds index and start.
     *
     *  The active era is the era currently rewarded.
     *  Validator set of this era must be equal to `SessionInterface::validators`.
     */
    get isV0() {
        return this.getTypeHash() === '2bb946dd9c19de9f4332897005d1255528c610172f7418fae165b5dafd3cfbfe';
    }
    /**
     *  The active era information, it holds index and start.
     *
     *  The active era is the era currently rewarded.
     *  Validator set of this era must be equal to `SessionInterface::validators`.
     */
    get asV0() {
        (0, assert_1.default)(this.isV0);
        return this;
    }
}
exports.StakingActiveEraStorage = StakingActiveEraStorage;
class StakingErasStakersStorage extends support_1.StorageBase {
    getPrefix() {
        return 'Staking';
    }
    getName() {
        return 'ErasStakers';
    }
    /**
     *  Exposure of validator at era.
     *
     *  This is keyed first by the era index to allow bulk deletion and then the stash account.
     *
     *  Is it removed after `HISTORY_DEPTH` eras.
     *  If stakers hasn't been set or has been removed then empty exposure is returned.
     */
    get isV0() {
        return this.getTypeHash() === 'f3f726cc814cef290657008054cd10667b250a01d2842ff3bbbcca24c98abf5b';
    }
    /**
     *  Exposure of validator at era.
     *
     *  This is keyed first by the era index to allow bulk deletion and then the stash account.
     *
     *  Is it removed after `HISTORY_DEPTH` eras.
     *  If stakers hasn't been set or has been removed then empty exposure is returned.
     */
    get asV0() {
        (0, assert_1.default)(this.isV0);
        return this;
    }
}
exports.StakingErasStakersStorage = StakingErasStakersStorage;
class StakingErasValidatorPrefsStorage extends support_1.StorageBase {
    getPrefix() {
        return 'Staking';
    }
    getName() {
        return 'ErasValidatorPrefs';
    }
    /**
     *  Similar to `ErasStakers`, this holds the preferences of validators.
     *
     *  This is keyed first by the era index to allow bulk deletion and then the stash account.
     *
     *  Is it removed after `HISTORY_DEPTH` eras.
     */
    get isV0() {
        return this.getTypeHash() === '3b21d3470a6c89e6da0d574a6d1402846f9836bb0d1f42e73e3fab07653299c2';
    }
    /**
     *  Similar to `ErasStakers`, this holds the preferences of validators.
     *
     *  This is keyed first by the era index to allow bulk deletion and then the stash account.
     *
     *  Is it removed after `HISTORY_DEPTH` eras.
     */
    get asV0() {
        (0, assert_1.default)(this.isV0);
        return this;
    }
    /**
     *  Similar to `ErasStakers`, this holds the preferences of validators.
     *
     *  This is keyed first by the era index to allow bulk deletion and then the stash account.
     *
     *  Is it removed after `HISTORY_DEPTH` eras.
     */
    get isV28() {
        return this.getTypeHash() === '2f145e368b1c1a9540437d8c25b9502d09b7e977e27a6bb99156b6bf2c6269d2';
    }
    /**
     *  Similar to `ErasStakers`, this holds the preferences of validators.
     *
     *  This is keyed first by the era index to allow bulk deletion and then the stash account.
     *
     *  Is it removed after `HISTORY_DEPTH` eras.
     */
    get asV28() {
        (0, assert_1.default)(this.isV28);
        return this;
    }
}
exports.StakingErasValidatorPrefsStorage = StakingErasValidatorPrefsStorage;
//# sourceMappingURL=storage.js.map